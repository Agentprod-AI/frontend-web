"use client";
import React from "react";
// import { SessionProvider, SessionProviderProps } from "next-auth/react";

import ThemeProvider from "./ThemeToggle/theme-provider";
import { UserContextProvider } from "./context/user-context";
import { LeadSheetSidebarProvider } from "./context/lead-sheet-sidebar";
import { AuthProvider, AuthStateInterface } from "./context/auth-provider";
import { LeadsProvider } from "./context/lead-user";

export default function Providers({
  // session,
  userAuthData,
  children,
}: {
  // session: SessionProviderProps["session"];
  userAuthData: AuthStateInterface["user"];
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider userData={userAuthData}>
          <UserContextProvider>
            <LeadSheetSidebarProvider>
              <LeadsProvider>
                {/* <SessionProvider session={session}> */}
                {children}
                {/* </SessionProvider> */}
              </LeadsProvider>
            </LeadSheetSidebarProvider>
          </UserContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
