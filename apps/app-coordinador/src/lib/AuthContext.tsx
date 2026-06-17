import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUser, storeUser, clearStoredUser, logout as apiLogout, User } from './api';

interface AuthCtx {
  user: User | null;
  setUser: (u: User) => void;
  logout: () => void;
  isLogged: boolean;
}

const AuthContext = createContext<AuthCtx>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const setAndStore = (u: User) => { setUser(u); storeUser(u); };
  const logout = () => { setUser(null); apiLogout(); };
  return (
    <AuthContext.Provider value={{ user, setUser: setAndStore, logout, isLogged: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
