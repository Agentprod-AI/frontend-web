import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./nav/mobile-sidebar";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { AccountSwitcher } from "./account-switcher";
import { accounts } from "@/constants/data";
import { LeadProfileSheet } from "../lead-profile-sheet";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden md:block">
          {/* <Link href={"/dashboard"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </Link> */}
          <div
            className={cn(
              "flex h-[52px] items-center justify-center px-2"
              // isCollapsed ? "h-[52px]" : "px-2",
            )}
          >
            <AccountSwitcher
              // isCollapsed={isCollapsed}
              // isCollapsed={false}
              accounts={accounts}
            />
          </div>
        </div>
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
          <LeadProfileSheet />
        </div>
      </nav>
    </div>
  );
}
