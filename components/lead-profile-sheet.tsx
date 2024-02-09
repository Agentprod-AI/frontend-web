"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function LeadProfileSheet({ className }: SidebarProps) {
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
                <span>Hello</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
