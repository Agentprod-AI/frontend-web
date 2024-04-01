"use client";

import { NavItem } from "@/types";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export default function MiniNav({ nav }: { nav: NavItem }) {
  const Icon = Icons[nav.icon || "arrowRight"];
  const path = usePathname();
  return (
    <Tooltip key={nav.label} delayDuration={0}>
      <TooltipTrigger asChild>
        <>
          <Link
            href={nav.href || "/"}
            // className={cn(
            //   buttonVariants({ size: "icon" }),
            //   "h-9 w-9",
            //   nav.variant === "default" &&
            //     "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
            // )}
          >
            <span
              className={cn(
                "group flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                path === nav.href
                  ? "bg-primary text-accent hover:bg-primary hover:text-accent"
                  : "transparent",
                nav.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{nav.title}</span>
            </span>
          </Link>
          <div className="bg-accent rounded-b-md">
            {path.includes(nav.href!) && nav.isCollapsible
              ? nav.subNavs?.map((subLink, index) => {
                  const SubLinkIcon = Icons[subLink.icon || "arrowRight"];
                  return (
                    <Link
                      key={subLink.label}
                      href={subLink.href || "/"}
                      // className={cn(
                      //   buttonVariants({ variant: nav.variant, size: "sm" }),
                      //   nav.variant === "default" &&
                      //     "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                      //   "justify-start",
                      // )}
                    >
                      <span
                        className={cn(
                          "group flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          path === subLink.href
                            ? "bg-primary text-accent hover:bg-primary hover:text-accent"
                            : "transparent",
                          subLink.disabled && "cursor-not-allowed opacity-80"
                        )}
                      >
                        <SubLinkIcon className="mr-2 h-4 w-4" />
                        <span className="sr-only">{subLink.title}</span>
                      </span>
                    </Link>
                  );
                })
              : null}
          </div>
        </>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-4">
        {nav.title}
        {nav.label && (
          <span className="ml-auto text-muted-foreground">{nav.label}</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}