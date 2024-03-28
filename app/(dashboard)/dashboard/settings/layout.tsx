"use client";
import React from "react";
import { Nav } from "@/components/layout/nav";
import { NavInterface } from "@/types";
import { ResizablePanel } from "@/components/ui/resizable";
import { PageHeaderProvider } from "@/context/page-header";
import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import SettingsPageHeader from "@/components/layout/settings-page-header";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const navItems: NavInterface[] = [
  {
    category: "Main",
    items: [
      {
        title: "Account Info",
        href: "/dashboard/settings/account-info",
        label: "Account Info",
        isCollapsible: false,
      },
      {
        title: "Mailboxes",
        href: "/dashboard/settings/mailbox",
        label: "Mailboxes",
        isCollapsible: false,
      },
      {
        title: "Integrations",
        href: "/dashboard/settings/integration",
        label: "Integrations",
        isCollapsible: false,
      }
    ],
  },
  // ... add other categories and items if needed
];

export default function SettingsLayout ({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex"> 
      <div className="w-52 flex-shrink-0" >
        <Nav isCollapsed={false} links={navItems}/>
      </div>
      <Separator orientation="vertical" style={{ height: "calc(100vh - 100px)" }} />
      <div className="flex flex-col flex-grow">
        <PageHeaderProvider>
          <main className="flex-grow px-4">
            <SettingsPageHeader/>
            {/* <div className="py-5 w-full"> */}
              <ScrollArea className="py-5">
                {children}
              </ScrollArea>
            {/* </div> */}
          </main>
        </PageHeaderProvider>
      </div>
    </div>
  );
};