"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { Separator } from "./ui/separator";
import { AccountSwitcher } from "@/components/layout/account-switcher";
import { accounts } from "@/constants/data";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isCollapsed?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isCollapsed,
}: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid items-start gap-2">
        <div
          className={cn(
            "flex h-[52px] items-center justify-center px-2",
            isCollapsed ? "h-[52px]" : "px-2"
          )}
        >
          <AccountSwitcher
            isCollapsed={isCollapsed || false}
            // isCollapsed={false}
            accounts={accounts}
          />
        </div>
        <Separator />
        {items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"];
          return isCollapsed
            ? item.href && (
                <Link
                  key={index}
                  href={item.disabled ? "/" : item.href}
                  onClick={() => {
                    if (setOpen) setOpen(false);
                  }}
                >
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      path === item.href
                        ? "bg-primary text-accent hover:bg-primary hover:text-accent"
                        : "transparent",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </span>
                </Link>
              )
            : null;
        })}
      </nav>
    </div>
  );
}
