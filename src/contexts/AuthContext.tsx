import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  role: 'admin' | 'user';
  allowedFeatures: string[];
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const getUserConfig = (username: string): User | null => {
    const users: { [key: string]: User } = {
      csiedentop: {
        username: 'csiedentop',
        role: 'admin',
        allowedFeatures: ['all']
      },
      sdsiedentop: {
        username: 'sdsiedentop',
        role: 'user',
        allowedFeatures: ['chat', 'calculator', 'expense']
      }
    };

    return users[username] || null;
  };

  const login = (username: string, password: string) => {
    const user = getUserConfig(username);
    if (user) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};