"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Nav } from "@/components/layout/nav/nav";
import { navItems } from "@/constants/data";
import { TooltipProvider } from "@/components/ui/tooltip";
import useWindowSize from "@/hooks/useWindowSize";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-provider";
import { redirect } from "next/navigation";
import { PageHeaderProvider } from "@/context/page-header";
import { useMailbox } from "@/context/mailbox-provider";
import WarningBanner from "@/components/payment/WarningBanner";
import axios from "axios";
import { useSubscription } from "@/hooks/userSubscription";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { width } = useWindowSize();
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();

  useEffect(() => {
    if (!user) {
      redirect("/");
      return;
    }
  }, [user]);

  const { isContextBarOpen } = useMailbox();

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden md:pt-16 ">
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
              document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                sizes
              )}`;
            }}
            className="h-full items-stretch"
          >
            {width > 768 ? (
              <ResizablePanel
                defaultSize={15}
                collapsedSize={5}
                collapsible={true}
                minSize={5}
                onCollapse={() => {
                  setIsCollapsed(true);
                  document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                    true
                  )}`;
                }}
                onExpand={() => {
                  setIsCollapsed(false);
                  document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                    false
                  )}`;
                }}
                className={cn("transition-all duration-300 ease-in-out")}
              >
                <Nav isCollapsed={isCollapsed} links={navItems} />
              </ResizablePanel>
            ) : null}
            {width > 768 ? <ResizableHandle withHandle /> : null}
            <ResizablePanel minSize={70} defaultSize={85}>
              <ScrollArea className="h-screen">
                <PageHeaderProvider>
                  {isSubscribed === false && <WarningBanner />}
                  <main className="px-4 pb-20">{children}</main>
                </PageHeaderProvider>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </div>
    </>
  );
}
