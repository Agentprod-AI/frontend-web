"use client";
import React from "react";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

import ThemeProvider from "./ThemeToggle/theme-provider";
import { UserContextProvider } from "./context/user-context";
import { LeadSheetSidebarProvider } from "./context/lead-sheet-sidebar";

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
          <LeadSheetSidebarProvider>
            <SessionProvider session={session}>{children}</SessionProvider>
          </LeadSheetSidebarProvider>
        </UserContextProvider>
      </ThemeProvider>
    </>
  );
}
