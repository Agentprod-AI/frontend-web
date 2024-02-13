"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

// Define the shape of the context state
export interface AuthStateInterface {
  user: { [key: string]: any } | null; // Assuming user data is an object; adjust as necessary
  //   login: (userData: { [key: string]: any }) => void;
  //   logout: () => void;
}

// Define the default state
const defaultAuthState: AuthStateInterface = {
  user: null, // User is not authenticated by default
  //   login: () => {},
  //   logout: () => {},
};

// Create the context
const AuthContext = createContext<AuthStateInterface>(defaultAuthState);

// Define the provider props type
interface AuthProviderProps {
  authData: AuthStateInterface;
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({
  authData,
  children,
}: AuthProviderProps) => {
  const [userAuthData, setUserAuthData] =
    useState<AuthStateInterface>(authData);

  //   const login = (userData: { [key: string]: any }) => {
  //     setUser(userData);
  //     // Optionally save the user data to localStorage/sessionStorage for persistence
  //   };

  //   const logout = () => {
  //     setUser(null);
  //     // Optionally clear the user data from localStorage/sessionStorage
  //   };

  const contextValue = useMemo(
    () => ({
      user: userAuthData.user,
      //   login,
      //   logout,
    }),
    [userAuthData],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
