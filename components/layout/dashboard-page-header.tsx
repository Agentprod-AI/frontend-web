"use client";
import React, { useEffect } from "react";
import { usePageHeader } from "./context/page-header";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import { pageTitleConfig, matchPathname } from "@/constants/headers"; // Adjust import as needed

export default function DashboardPageHeader() {
  const { setTitle, setHidden, hidden, title } = usePageHeader();
  const pathname = usePathname();

  useEffect(() => {
    // Attempt to find a matching config for the current pathname
    const currentPageConfig = pageTitleConfig.find((config) =>
      matchPathname(pathname, config.pathname),
    );

    if (currentPageConfig) {
      setTitle(currentPageConfig.title);
      setHidden(currentPageConfig.hidden);
    }
  }, [pathname, setTitle, setHidden]);

  return (
    <>
      {hidden ? null : (
        <div>
          <h1 className="text-3xl font-bold tracking-tight mt-2">{title}</h1>
          <Separator className="mt-3 mb-3" />
        </div>
      )}
    </>
  );
}
