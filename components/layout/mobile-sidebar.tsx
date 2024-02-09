"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { accounts, navItems } from "@/constants/data";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { Nav } from "./nav";
import { AccountSwitcher } from "./account-switcher";
import { cn } from "@/lib/utils";

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div
                className={cn(
                  "flex h-[52px] items-center justify-center px-2",
                  // isCollapsed ? "h-[52px]" : "px-2",
                )}
              >
                <AccountSwitcher
                  isCollapsed={false}
                  // isCollapsed={false}
                  accounts={accounts}
                />
              </div>
              <div className="space-y-1">
                <Nav links={navItems} isCollapsed={false} />
                {/* <DashboardNav items={navItems} setOpen={setOpen} /> */}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
