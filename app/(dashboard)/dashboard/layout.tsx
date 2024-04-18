"use client";
import React, { useEffect } from "react";
import Header from "@/components/layout/header";
// import Sidebar from "@/components/layout/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
// import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav/nav";
import { navItems } from "@/constants/data";
import { DummyCampaign } from "@/constants/campaign";
import { TooltipProvider } from "@/components/ui/tooltip";
import useWindowSize from "@/hooks/useWindowSize";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-provider";
import { redirect } from "next/navigation";
import { PageHeaderProvider } from "@/context/page-header";
import { useCampaignContext } from "@/context/campaign-provider";
import DashboardPageHeader from "@/components/layout/dashboard-page-header";

// export const metadata: Metadata = {
//   title: "Next Shadcn Dashboard Starter",
//   description: "Basic dashboard with Next.js and Shadcn",
// };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const { width } = useWindowSize();
  const { user } = useAuth();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden md:pt-16">
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
              document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                sizes
              )}`;
            }}
            className="h-full items-stretch"
            // style={{ height: "calc(100vh - 3.5rem)" }}
          >
            {width > 768 ? (
              <ResizablePanel
                defaultSize={15}
                collapsedSize={4}
                collapsible={true}
                minSize={15}
                maxSize={15}
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
                className={cn(
                  isCollapsed &&
                    "min-w-[50px] transition-all duration-300 ease-in-out"
                )}
              >
                {/* <Sidebar isCollapsed={isCollapsed} /> */}
                <Nav isCollapsed={isCollapsed} links={navItems} />
              </ResizablePanel>
            ) : null}
            {width > 768 ? <ResizableHandle withHandle /> : null}
            <ResizablePanel minSize={30} defaultSize={85}>
              <ScrollArea className="h-screen">
                <PageHeaderProvider>
                  <main className="px-4 pb-20">
                    {/* <DashboardPageHeader /> */}
                    {children}
                  </main>
                </PageHeaderProvider>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </div>
    </>
  );
}
