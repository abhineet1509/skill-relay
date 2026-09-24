import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  addresses?: Array<{title: string, text: string}>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const buildAvatar = (u: any): string => {
  // If user has a real avatar (Google photo or uploaded), use it
  if (u.avatar && u.avatar.startsWith('http')) return u.avatar;
  // Fallback: generate initials avatar
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=4F46E5&color=fff&size=200`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
        if (response.data.success && response.data.user) {
          const u = response.data.user;
          setUser({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            avatar: buildAvatar(u),
            addresses: u.addresses || []
          });
        }
      } catch {
        // not logged in
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (u: any) => {
    setUser({
      id: u._id || u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: buildAvatar(u),
      addresses: u.addresses || []
    });
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
    } catch {
      // ignore
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};


