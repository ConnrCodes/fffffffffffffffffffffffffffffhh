import { all } from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  role: 'admin' | 'user';
  allowedFeatures: string[];
  password: string; // Added password field
}

interface AuthContextType {
  user: Omit<User, 'password'> | null; // Exclude password from the exposed user object
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
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);

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
        allowedFeatures: ['all'],
        password: '12345678',
      },
      sdsiedentop: {
        username: 'sdsiedentop',
        role: 'user',
        allowedFeatures: ['all'],
        password: '12345678',
      },
      ijsiedentop: {
        username: 'ijsiedentop',
        role: 'user',
        allowedFeatures: ['chat', 'calculator'],
        password: '123456789',
      },
      jmsiedentop: {
        username: 'jmsiedentop',
        role: 'user',
        allowedFeatures: ['all'],
        password: '12345678',
      },
      tester: {
        username: 'test123',
        role: 'tester',
        allowedFeatures: ['all'],
        password: 'tester',
      },
    };

    return users[username] || null;
  };

  const login = (username: string, password: string) => {
    const user = getUserConfig(username);
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user; // Exclude password from stored user object
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
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
