import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { useAuth } from './AuthContext';
import { toast } from '../services/toast';
import type { Message } from '../types/message';
import { environment } from '../config/environment';

type PresenceContextType = {
  onlineUsers: string[];
};

const PresenceContext = createContext<PresenceContextType>({ onlineUsers: [] });

export function PresenceProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const hubConnectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!currentUser) {
      if (hubConnectionRef.current?.state === HubConnectionState.Connected) {
        hubConnectionRef.current.stop();
        hubConnectionRef.current = null;
      }
      setOnlineUsers([]);
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(environment.hubUrl + 'presence', {
        accessTokenFactory: () => currentUser.token
      })
      .withAutomaticReconnect()
      .build();

    hubConnectionRef.current = connection;

    connection.start().catch(err => console.log(err));

    connection.on('UserOnline', (userId: string) => {
      setOnlineUsers(prev => [...prev, userId]);
    });

    connection.on('UserOffline', (userId: string) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    connection.on('GetOnlineUsers', (userIds: string[]) => {
      setOnlineUsers(userIds);
    });

    connection.on('NewMessageReceived', (message: Message) => {
      toast.info(
        `${message.senderDisplayName} has sent you a new message`,
        10000,
        message.senderImageUrl,
        `/members/${message.senderId}/messages`
      );
    });

    return () => {
      if (connection.state === HubConnectionState.Connected) {
        connection.stop();
      }
    };
  }, [currentUser]);

  return (
    <PresenceContext.Provider value={{ onlineUsers }}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  return useContext(PresenceContext);
}