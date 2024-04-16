"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Briefcase,
  MenuIcon,
  ChevronsUpDown,
  MapPinIcon,
  Clock,
  Linkedin,
  Phone,
  Link,
  Twitter,
  Facebook,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { useLeadSheetSidebar } from "@/context/lead-sheet-sidebar";
import { Contact, Lead, Organization, useLeads } from "@/context/lead-user";
import { PeopleProfileSheet } from "./people-profile-sheet";
import { useCompanyInfo } from "@/context/company-linkedin";
import { ContactProfileSheet } from "./contact-profile-sheet";
// import { CompanyProfileSheet } from "./company-profile-sheet";

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function LeadProfileSheet({ className }: SidebarProps) {
  const { isOpen, itemId, toggleSidebar } = useLeadSheetSidebar();
  const { leads } = useLeads();
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [data, setData] = useState<Lead | Contact>();
  const { companyInfo } = useCompanyInfo();

  useEffect(() => {
    if (isOpen && itemId) {
      const item = leads.find((lead) => lead.id);
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
          {data?.type === "prospective" && (
            <PeopleProfileSheet {...(data as Lead)} {...companyInfo} />
          )}
          <ContactProfileSheet {...(data as Contact)} />
          {/* {data?.type === "organization" && (
            <CompanyProfileSheet {...(data as Organization)} />
          )} */}
          {/* component people, company*/}
        </SheetContent>
      </Sheet>
    </>
  );
}
