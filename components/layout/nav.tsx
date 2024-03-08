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
import { ChevronsUpDown } from "lucide-react";

interface NavProps {
  isCollapsed: boolean;
  links: NavInterface[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const path = usePathname();

  return (
    <div
      data-collapsed={isCollapsed}
      className="md:pt-16 group flex-col gap-4 flex"
    >
      <nav className="grid gap-1 px-2 pt-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {/* <Separator /> */}
        {links.map((nav, index) => {
          return (
            <div key={index}>
              {nav.items.map((link, index) => {
                const Icon = Icons[link.icon || "arrowRight"];
                return isCollapsed ? (
                  <Tooltip key={link.label} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <>
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
                              link.disabled && "cursor-not-allowed opacity-80"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="sr-only">{link.title}</span>
                          </span>
                        </Link>
                        <div className="bg-accent rounded-b-md">
                          {path.includes(link.href!) && link.isCollapsible
                            ? link.subNavs?.map((subLink, index) => {
                                const SubLinkIcon =
                                  Icons[subLink.icon || "arrowRight"];
                                return (
                                  <Link
                                    key={subLink.label}
                                    href={subLink.href || "/"}
                                    // className={cn(
                                    //   buttonVariants({ variant: link.variant, size: "sm" }),
                                    //   link.variant === "default" &&
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
                                        subLink.disabled &&
                                          "cursor-not-allowed opacity-80"
                                      )}
                                    >
                                      <SubLinkIcon className="mr-2 h-4 w-4" />
                                      <span className="sr-only">
                                        {subLink.title}
                                      </span>
                                    </span>
                                  </Link>
                                );
                              })
                            : null}
                        </div>
                      </>
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
                  <div key={link.label}>
                    <Link
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
                          link.disabled && "cursor-not-allowed opacity-80"
                        )}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {link.title}
                        {link.isCollapsible && (
                          <ChevronsUpDown className="h-4 w-4 ml-auto text-muted-foreground" />
                        )}
                      </span>
                    </Link>

                    <div className="bg-accent rounded-b-md">
                      {path.includes(link.href!) && link.isCollapsible
                        ? link.subNavs?.map((subLink, index) => {
                            const SubLinkIcon =
                              Icons[subLink.icon || "arrowRight"];
                            return (
                              <Link
                                key={subLink.label}
                                href={subLink.href || "/"}
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
                                    path === subLink.href
                                      ? "bg-primary text-accent hover:bg-primary hover:text-accent"
                                      : "transparent",
                                    subLink.disabled &&
                                      "cursor-not-allowed opacity-80"
                                  )}
                                >
                                  <SubLinkIcon className="mr-2 h-4 w-4" />
                                  {subLink.title}
                                </span>
                              </Link>
                            );
                          })
                        : null}
                    </div>
                  </div>
                );
              })}
              <Separator className="my-1" />
            </div>
          );
        })}
      </nav>
    </div>
  );
}
