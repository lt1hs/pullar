import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useUser } from "@/hooks/useUser";

type UserContextType = {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, login, logout, connect } = useUser();
  
  useEffect(() => {
    // Connect WebSocket when user is set
    if (user) {
      connect();
    }
  }, [user, connect]);

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
