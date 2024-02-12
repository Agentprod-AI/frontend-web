"use client";
import React from "react";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

import ThemeProvider from "./ThemeToggle/theme-provider";
import { UserContextProvider } from "./context/user-context";

export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <UserContextProvider>
          <SessionProvider session={session}>{children}</SessionProvider>
        </UserContextProvider>
      </ThemeProvider>
    </>
  );
}
