"use client";

import Header from "@/components/layout/header";
// import Sidebar from "@/components/layout/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
// import type { Metadata } from "next";
import React from "react";
import { Nav } from "@/components/layout/nav";
import { navItems } from "@/constants/data";
import { TooltipProvider } from "@/components/ui/tooltip";
import useWindowSize from "@/hooks/useWindowSize";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/layout/context/auth-provider";
import { redirect } from "next/navigation";
import { PageHeaderProvider } from "@/components/layout/context/page-header";
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
      <div className="flex h-screen overflow-hidden">
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
              document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                sizes,
              )}`;
            }}
            className="h-full items-stretch"
            // style={{ height: "calc(100vh - 3.5rem)" }}
          >
            <ResizablePanel
              defaultSize={15}
              collapsedSize={4}
              collapsible={true}
              minSize={15}
              maxSize={15}
              onCollapse={() => {
                setIsCollapsed(true);
                document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                  true,
                )}`;
              }}
              onExpand={() => {
                setIsCollapsed(false);
                document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                  false,
                )}`;
              }}
              className={cn(
                isCollapsed &&
                  "min-w-[50px] transition-all duration-300 ease-in-out",
              )}
            >
              {/* <Sidebar isCollapsed={isCollapsed} /> */}
              <Nav isCollapsed={isCollapsed} links={navItems} />
            </ResizablePanel>
            {width > 768 ? <ResizableHandle withHandle /> : null}
            <ResizablePanel minSize={30} defaultSize={85}>
              <ScrollArea className="h-screen">
                <PageHeaderProvider>
                  <main className="px-4 pt-[56px]">
                    <DashboardPageHeader />
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
