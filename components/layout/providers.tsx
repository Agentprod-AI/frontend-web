"use client";
import React from "react";
// import { SessionProvider, SessionProviderProps } from "next-auth/react";

import ThemeProvider from "./ThemeToggle/theme-provider";
import { UserContextProvider } from "../../context/user-context";
import { LeadSheetSidebarProvider } from "../../context/lead-sheet-sidebar";
import { AuthProvider, AuthStateInterface } from "../../context/auth-provider";
import { LeadsProvider } from "../../context/lead-user";
import { CampaignProvider } from "../../context/campaign-provider";
import { DashboardProvider } from "@/context/dashboard-analytics-provider";

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
                <CampaignProvider>
                  <DashboardProvider>
                    {/* <SessionProvider session={session}> */}
                    {children}
                    {/* </SessionProvider> */} 
                  </DashboardProvider>
                </CampaignProvider>
              </LeadsProvider>
            </LeadSheetSidebarProvider>
          </UserContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
