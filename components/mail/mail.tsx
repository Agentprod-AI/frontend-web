/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
"use client";
import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import { MailList } from "./mail-list";
import type { Mail } from "@/constants/data";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import ThreadDisplayMain from "./thread-display-main";
import { ScrollArea } from "../ui/scroll-area";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "@/context/user-context";
import { Button } from "../ui/button";
import { useCampaignContext } from "@/context/campaign-provider";
import { useMailbox } from "@/context/mailbox-provider";
import { Contact, useLeads } from "@/context/lead-user";
import { PeopleProfileSheet } from "../people-profile-sheet";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export interface Conversations {
  id: string;
  user_id: string;
  sender: string;
  recipient: string;
  subject: string;
  body_substr: string;
  campaign_id: string;
  updated_at: string;
  status: string;
}

export function Mail({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [mails, setMails] = React.useState<Conversations[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState("all");
  const { campaigns } = useCampaignContext();
  const [campaign, setCampaign] = React.useState<{
    campaignName: string;
    campaignId: string;
  }>();

  const { user } = useUserContext();

  const { setSenderEmail, isContextBarOpen } = useMailbox();
  console.log("User from mail", user);

  const {
    conversationId,
    setConversationId,
    setRecipientEmail,
    recipientEmail,
    setSenderEmail,
    senderEmail,
  } = useMailbox();

  const { leads } = useLeads();

  const [localIsContextBarOpen, setLocalIsContextBarOpen] =
    React.useState(false);

  React.useEffect(() => {
    setLocalIsContextBarOpen(isContextBarOpen);
  }, [isContextBarOpen]);

  const allCampaigns =
    campaigns.map((campaign) => ({
      campaignName: campaign.campaign_name,
      campaignId: campaign.id,
      additionalInfo: campaign.additional_details,
    })) || null;

  React.useEffect(() => {
    console.log("user from inbox", user);
    async function fetchConversations() {
      setLoading(true);
      try {
        const response = await axiosInstance.get<{ mails: Conversations[] }>(
          `v2/mailbox/${user?.id}`
        );
        console.log("Mail Responses", response.data.mails[0].campaign_id);
        setMails(response.data.mails as Conversations[]);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching mails:", err);
        setError(err.message || "Failed to load mails.");
        setLoading(false);
      }
    }

    fetchConversations();
  }, []); // Dependency array remains empty to run once on mount

  const filteredMails = React.useMemo(() => {
    return mails.filter((mail) => {
      return (
        (filter === "all" || mail.status.toLowerCase() === filter) &&
        (!campaign || mail.campaign_id === campaign.campaignId)
      );
    });
  }, [mails, filter, campaign]);

  React.useEffect(() => {
    if (filteredMails.length > 0) {
      setSenderEmail(filteredMails[0]?.sender);
    }
  }, [filteredMails, setSenderEmail]);
  // if (filteredMails) {
  //   setConversationId(filteredMails[0]?.id);
  //   setRecipientEmail(filteredMails[0]?.recipient);
  //   setSenderEmail(filteredMails[0]?.sender);
  // }

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full items-stretch"
        style={{ height: "calc(100vh - 80px)" }} // 56px is the height of the top bar
      >
        <ResizablePanel defaultSize={localIsContextBarOpen ? 40 : 20}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 pt-2 pb-0">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto flex space-x-4 relative">
                <TabsTrigger
                  value="all"
                  onClick={() => setFilter("all")}
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="to-approve"
                  onClick={() => setFilter("to-approve")}
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  To approve
                </TabsTrigger>
                <TabsTrigger
                  value="scheduled"
                  onClick={() => setFilter("scheduled")}
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  Scheduled
                </TabsTrigger>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center space-x-2"
                    >
                      <span>
                        {campaign ? campaign.campaignName : "Select Campaign"}
                      </span>
                      <ChevronDown size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80">
                    <DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <ScrollArea className="h-[400px] w-full rounded-md">
                        {allCampaigns &&
                          allCampaigns.map((campaignItem) => (
                            <div key={campaignItem.campaignId}>
                              <DropdownMenuItem
                                key={campaignItem.campaignId}
                                onClick={() =>
                                  setCampaign({
                                    campaignName: campaignItem.campaignName,
                                    campaignId: campaignItem.campaignId,
                                  })
                                }
                              >
                                <p>
                                  {campaignItem.campaignName}{" "}
                                  {campaignItem.additionalInfo &&
                                    `- ${campaignItem.additionalInfo}`}
                                </p>
                              </DropdownMenuItem>
                            </div>
                          ))}
                      </ScrollArea>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TabsList>
            </div>
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value={filter} className="m-0">
              {mails.length > 0 ? (
                <MailList items={filteredMails} />
              ) : (
                "No Mails Found"
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={localIsContextBarOpen ? 40 : 20}
          minSize={20}
        >
          <ScrollArea className="h-full">
            <ThreadDisplayMain ownerEmail={""} />
          </ScrollArea>
        </ResizablePanel>
        {localIsContextBarOpen && leads.length > 0 && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20}>
              <PeopleProfileSheet data={leads[0] as Contact} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
