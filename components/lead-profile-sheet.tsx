"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Briefcase,
  MenuIcon,
  ChevronsUpDown,
  MapPinIcon,
  Clock,
  Linkedin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { useLeadSheetSidebar } from "./layout/context/lead-sheet-sidebar";
import { Lead, useLeads } from "./layout/context/lead-user";

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
}

export function LeadProfileSheet({ className }: SidebarProps) {
  const { isOpen, itemId, toggleSidebar } = useLeadSheetSidebar();
  const { leads } = useLeads();
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [data, setData] = useState<Lead>();

  useEffect(() => {
    if (isOpen && itemId) {
      const item = leads.find((lead) => lead.id === itemId);
      setData(item);
    }
  }, [isOpen, itemId]);

  if (!isOpen) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={toggleSidebar}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="right" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className={"p-4 h-full"}>
                <div className="flex">
                  <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                    <AvatarFallback>JL</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    {/* <p>Id: {itemId}</p> */}
                    <p className="text-sm font-medium leading-none">
                      {data?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      jackson.lee@email.com
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground pt-4">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Beatae veritatis minima pariatur fugit eaque itaque ut
                  accusantium, quas error nihil quasi deserunt saepe inventore
                  corrupti a voluptate omnis laborum vel!
                </p>
                <br />
                <div className="pt-4 space-y-3">
                  <div className="flex space-x-2">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {data?.title}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Pune, Maharashtra, India
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Tuesday 10:00 AM, 2023
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Linkedin className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      /in/jacksonlee
                    </span>
                  </div>
                </div>
                <br />
                <Collapsible
                  open={collapsibleOpen}
                  onOpenChange={setCollapsibleOpen}
                  className="w-[350px] pt-4 space-y-2 text-muted-foreground"
                >
                  <div className="flex items-center justify-between space-x-4">
                    <h4 className="text-sm font-semibold">Work History</h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <div className="flex px-2 py-1 font-mono text-sm justify-between">
                    <span>2023-present</span>
                    <span>Software Developer</span>
                  </div>
                  <CollapsibleContent className="space-y-2">
                    <div className="flex px-2 py-1 font-mono text-sm justify-between">
                      <span>2022-2023</span>
                      <span>Software Developer</span>
                    </div>
                    <div className="flex px-2 py-1 font-mono text-sm justify-between">
                      <span>2021-2022</span>
                      <span>Software Developer</span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <br />
                <br />
                <div className="flex">
                  <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Company Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      companyname.com
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground pt-4">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Beatae veritatis minima pariatur fugit eaque itaque ut
                  accusantium, quas error nihil quasi deserunt saepe inventore
                  corrupti a voluptate omnis laborum vel!
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
