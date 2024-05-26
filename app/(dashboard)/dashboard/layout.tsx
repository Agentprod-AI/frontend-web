"use client";
import React, { useEffect } from "react";
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

  const { isContextBarOpen } = useMailbox();

  useEffect(() => {
    setIsCollapsed(isContextBarOpen);
  }, [isContextBarOpen]);

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
                defaultSize={!isCollapsed ? 15 : 5} // Default size when expanded
                collapsedSize={5} // Size when collapsed
                collapsible={true}
                minSize={5}
                maxSize={20}
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
                  isCollapsed ? "w-[20px]" : "w-[50px]",
                  "transition-all duration-300 ease-in-out"
                )}
              >
                <Nav isCollapsed={isCollapsed} links={navItems} />
              </ResizablePanel>
            ) : null}
            {width > 768 ? <ResizableHandle withHandle /> : null}
            <ResizablePanel minSize={70} defaultSize={85}>
              <ScrollArea className="h-screen">
                <PageHeaderProvider>
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
