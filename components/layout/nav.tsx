"use client";

import Link from "next/link";
// import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
// import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { AccountSwitcher } from "./account-switcher";
// import { accounts } from "@/constants/data";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { NavInterface } from "@/types";

interface NavProps {
  isCollapsed: boolean;
  links: NavInterface[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const path = usePathname();

  return (
    <div
      data-collapsed={isCollapsed}
      className="pt-16 group flex-col gap-4 flex"
    >
      <nav className="grid gap-1 px-2 pt-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {/* <Separator /> */}
        {links.map((nav, index) => {
          return (
            <>
              {nav.items.map((link, index) => {
                const Icon = Icons[link.icon || "arrowRight"];
                return isCollapsed ? (
                  <Tooltip key={index} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={link.href || "/"}
                        // className={cn(
                        //   buttonVariants({ size: "icon" }),
                        //   "h-9 w-9",
                        //   link.variant === "default" &&
                        //     "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                        // )}
                      >
                        <span
                          className={cn(
                            "group flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            path === link.href
                              ? "bg-primary text-accent hover:bg-primary hover:text-accent"
                              : "transparent",
                            link.disabled && "cursor-not-allowed opacity-80",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="sr-only">{link.title}</span>
                        </span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="flex items-center gap-4"
                    >
                      {link.title}
                      {link.label && (
                        <span className="ml-auto text-muted-foreground">
                          {link.label}
                        </span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    key={index}
                    href={link.href || "/"}
                    // className={cn(
                    //   buttonVariants({ variant: link.variant, size: "sm" }),
                    //   link.variant === "default" &&
                    //     "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                    //   "justify-start",
                    // )}
                  >
                    <span
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        path === link.href
                          ? "bg-primary text-accent hover:bg-primary hover:text-accent"
                          : "transparent",
                        link.disabled && "cursor-not-allowed opacity-80",
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {link.title}
                    </span>
                    {/* {link.label && (
                  <span
                    className={cn(
                      "ml-auto",
                      link.variant === "default" &&
                        "text-background dark:text-white",
                    )}
                  >
                    {link.label}
                  </span>
                )} */}
                  </Link>
                );
              })}
              <Separator className="mb-1" />
            </>
          );
        })}
      </nav>
    </div>
  );
}
