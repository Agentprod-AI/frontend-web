"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";

export default function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-16 md:block w-72`)}
    >
      <div className="space-y-4 pb-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {/* <DashboardNav items={navItems} isCollapsed={isCollapsed} /> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
