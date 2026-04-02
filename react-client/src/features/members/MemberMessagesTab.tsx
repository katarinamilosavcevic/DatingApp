import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { useAuth } from '../../app/AuthContext';
import { usePresence } from '../../app/PresenceContext';
import type { Member } from '../../types/member';
import type { Message } from '../../types/message';
import { environment } from '../../config/environment';
import { timeAgo } from '../../utils/timeAgo';

type OutletContext = {
    member: Member;
};

export default function MemberMessagesTab() {
    const { member } = useOutletContext<OutletContext>();
    const { currentUser } = useAuth();
    const { onlineUsers } = usePresence();
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageContent, setMessageContent] = useState('');
    const hubConnectionRef = useRef<HubConnection | null>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (!currentUser) return;

        const connection = new HubConnectionBuilder()
            .withUrl(`${environment.hubUrl}messages?userId=${member.id}`, {
                accessTokenFactory: () => currentUser.token
            })
            .withAutomaticReconnect()
            .build();

        hubConnectionRef.current = connection;

        connection.start().catch(err => console.log(err));

        connection.on('ReceiveMessageThread', (msgs: Message[]) => {
            const mapped = msgs.map(m => ({
                ...m,
                currentUserSender: m.senderId !== member.id
            }));
            setMessages(mapped);
        });

        connection.on('NewMessage', (message: Message) => {
            message.currentUserSender = message.senderId === currentUser.id;
            setMessages(prev => [...prev, message]);
        });

        return () => {
            if (connection.state === HubConnectionState.Connected) {
                connection.stop();
            }
        };
    }, [member.id, currentUser]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!messageContent.trim() || !hubConnectionRef.current) return;
        await hubConnectionRef.current.invoke('SendMessage', {
            recipientId: member.id,
            content: messageContent
        });
        setMessageContent('');
    };



    return (
        <div className="flex flex-col w-full h-[65vh]">
            <div className="flex flex-col grow overflow-auto gap-2 mb-3">
                {messages.map(message => (
                    <div key={message.id} className={`flex flex-col ${message.currentUserSender ? 'items-end' : 'items-start'} mb-3`}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-600">{message.senderDisplayName}</span>
                            <time className="text-xs text-gray-400">{timeAgo(message.messageSent)}</time>
                        </div>

                        <div className={`flex items-end gap-2 ${message.currentUserSender ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="relative shrink-0">
                                <img
                                    src={message.senderImageUrl || '/user.png'}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                {onlineUsers.includes(message.senderId) && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
                                )}
                            </div>

                            <div className={`px-4 py-2 rounded-2xl max-w-xs text-sm  ${message.currentUserSender ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                {message.content}
                            </div>
                        </div>

                        <div className="text-xs text-gray-400 mt-1">
                            {message.currentUserSender
                                ? message.dateRead ? 'Seen' : 'Not read'
                                : 'Delivered'}
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            <div className="flex gap-2">
                <input
                    value={messageContent}
                    onChange={e => setMessageContent(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Enter your message"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
                <button onClick={sendMessage}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                    Send
                </button>
            </div>
        </div>
    );
}