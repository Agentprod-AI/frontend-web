import { NavItem } from "@/types";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { IntroJs } from "intro.js/src/intro";

import "intro.js/introjs.css";
import "@/components/layout/nav/introjs-css/custom-introjs.css"

interface SimpleNavProps {
  nav: NavItem;
  id?: string;
  tourInstance: IntroJs;
  showOnboarding: boolean;
}

const introEnabledIds = ["chatwithsally", "settings", "campaign"];

export default function SimpleNav({ nav, id, tourInstance, showOnboarding }: SimpleNavProps) {
  const Icon = Icons[nav.icon || "arrowRight"];
  const path = usePathname();
  const linkRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (showOnboarding && id && introEnabledIds.includes(id) && linkRef.current) {
      let introContent = "";
      let titleContent = "";
      let position: "right" | "left" | "top" | "bottom" = "right";
      let steps = 0;

      switch (id) {
        case "chatwithsally":
          steps = 1;
          titleContent = "Step 1: Onboarding";
          introContent = "Meet Sally, your AI Sales Rep. Chat with Sally to onboard yourself.";
          break;
        
        case "campaign":
          steps = 2;
          titleContent = "Step 3: Create Your Campaign";
          introContent = "Manage various types of sales campaigns including outbound, inbound and nurturing campaigns.";
          break;
        case "settings":
          steps = 3;
          titleContent = "Step 2: Sync Your Inbox";
          introContent = "Connect a mailbox to use it for campaigns and increase your sending volume. ";
          break;
      }

      tourInstance.addStep({
        element: linkRef.current,
        step : steps,
        intro: introContent,
        title: titleContent,
        position: position,
        tooltipClass: "custom-introjs-tooltip",
      });
    }
  }, [id, nav, tourInstance, showOnboarding]);

  return (
    <div key={nav.label}>
      <Link href={nav.href || "/"}>
        <span
          ref={linkRef}
          id={id}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            path === nav.href
              ? "bg-primary text-accent hover:bg-primary hover:text-accent"
              : "transparent",
            nav.disabled && "cursor-not-allowed opacity-80"
          )}
        >
          <Icon className="mr-2 h-4 w-4" />
          {nav.title}
          {nav.isCollapsible && (
            <ChevronsUpDown className="h-4 w-4 ml-auto text-muted-foreground" />
          )}
        </span>
      </Link>

      <div className="bg-accent rounded-b-md">
        {path.includes(nav.href!) && nav.isCollapsible
          ? nav.subNavs?.map((subLink) => {
              const SubLinkIcon = Icons[subLink.icon || "arrowRight"];
              return (
                <Link key={subLink.label} href={subLink.href || "/"}>
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground text-black dark:text-white",
                      path === subLink.href
                        ? "bg-primary text-accent hover:bg-primary hover:text-accent"
                        : "transparent",
                      subLink.disabled && "cursor-not-allowed opacity-80"
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
}