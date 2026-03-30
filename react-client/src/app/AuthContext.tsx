import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCreds, RegisterCreds } from '../types/user';
import api, { setAuthToken } from '../services/api';

type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (creds: LoginCreds) => Promise<void>;
  register: (creds: RegisterCreds) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);


function getRolesFromToken(user: User): string[] {
  const payload = user.token.split('.')[1];
  const decoded = atob(payload);
  const jsonPayload = JSON.parse(decoded);
  return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  
  const setCurrentUser = (user: User | null) => {
    if (user) {
      user.roles = getRolesFromToken(user);
      setAuthToken(user.token); 
    } else {
      setAuthToken(null);
    }
    setCurrentUserState(user);
  };

  const logout = async () => {
    await api.post('account/logout');
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    setCurrentUser(null);
  };

 
  const startTokenRefreshInterval = () => {
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    refreshIntervalRef.current = setInterval(async () => {
      try {
        const res = await api.post<User>('account/refresh-token');
        setCurrentUser(res.data);
      } catch {
        await logout();
      }
    }, 14 * 24 * 60 * 60 * 1000); // 14 dana
  };

  
  useEffect(() => {
    api.post<User>('account/refresh-token')
      .then(res => {
        setCurrentUser(res.data);
        startTokenRefreshInterval();
      })
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false));

    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (creds: LoginCreds) => {
    const res = await api.post<User>('account/login', creds);
    setCurrentUser(res.data);
    startTokenRefreshInterval();
  };

  const register = async (creds: RegisterCreds) => {
    const res = await api.post<User>('account/register', creds);
    setCurrentUser(res.data);
    startTokenRefreshInterval();
  };

  

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth mora biti unutar AuthProvider');
  return ctx;
}