"use client";

// import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// import { AccountSwitcher } from "./account-switcher";
// import { accounts } from "@/constants/data";
import { NavInterface } from "@/types";
import MiniNav from "./mini-nav";
import SimpleNav from "./simple-nav";
import CollapseNavItem from "./collapse-nav-item";

interface NavProps {
  isCollapsed: boolean;
  links: NavInterface[];
}

export function Nav({ links, isCollapsed }: NavProps) {
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
                return isCollapsed ? (
                  <MiniNav key={link.label} nav={link} />
                ) : !link.isCollapsible ? (
                  <SimpleNav key={link.label} nav={link} />
                ) : (
                  <CollapseNavItem nav={link} key={link.label} />
                );
              })}
              <Separator className="my-1" />
            </div>
          );
        })}
      </nav>
    </div>
  );

