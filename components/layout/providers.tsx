"use client";
import React from "react";

import ThemeProvider from "./ThemeToggle/theme-provider";
import { UserContextProvider } from "../../context/user-context";
import { LeadSheetSidebarProvider } from "../../context/lead-sheet-sidebar";
import { AuthProvider, AuthStateInterface } from "../../context/auth-provider";
import { LeadsProvider } from "../../context/lead-user";
import { CampaignProvider } from "../../context/campaign-provider";
import { DashboardProvider } from "@/context/dashboard-analytics-provider";
import { CompanyProvider } from "@/context/company-linkedin";
import { MailboxProvider } from "@/context/mailbox-provider";
import { AutoGenerateProvider } from "@/context/auto-generate-mail";

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
          <AutoGenerateProvider>
            <UserContextProvider>
              <LeadSheetSidebarProvider>
                <LeadsProvider>
                  <CampaignProvider>
                    <DashboardProvider>
                      <CompanyProvider>
                        <MailboxProvider>
                          {/* <SessionProvider session={session}> */}
                          {children}
                          {/* </SessionProvider> */}
                        </MailboxProvider>
                      </CompanyProvider>
                    </DashboardProvider>
                  </CampaignProvider>
                </LeadsProvider>
              </LeadSheetSidebarProvider>
            </UserContextProvider>
          </AutoGenerateProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
