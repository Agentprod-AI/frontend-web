"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useLeadSheetSidebar } from "@/context/lead-sheet-sidebar";
import { Contact, Lead, useLeads } from "@/context/lead-user";
import { PeopleProfileSheet } from "./people-profile-sheet";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function LeadProfileSheet({ className }: SidebarProps) {
  const { isOpen, itemId, toggleSidebar } = useLeadSheetSidebar();
  const { leads } = useLeads();
  const [data, setData] = useState<Lead | Contact>();

  useEffect(() => {
    if (isOpen && itemId) {
      console.log(leads);
      const item = leads.find((lead) => lead.id === itemId);
      console.log("item", item);
      setData(item);
    }
  }, [isOpen, itemId]);

  //add item type to leads useLeadSheetSidebar
  //add item type with item id

  if (!isOpen) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={toggleSidebar}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="right" className="!px-0">
          <PeopleProfileSheet data={data as Lead | Contact} />
        </SheetContent>
      </Sheet>
    </>
  );
}
