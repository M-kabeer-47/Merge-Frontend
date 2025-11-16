"use client";

import { createContext, useContext, type ReactNode } from "react";
import { User } from "@/types/user";
import useGetUser from "@/hooks/user/use-get-user";
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useGetUser();
  // Fetch user data if access token exists

  const value: AuthContextType = {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
