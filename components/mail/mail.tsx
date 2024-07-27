/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import MailList from "./mail-list";
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
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const MIN_LOADING_TIME = 5000;

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
  name: string;
  photo_url: string;
  company_name: string;
  category: string;
}

const LoadingOverlay = () => {
  const [showWaitMessage, setShowWaitMessage] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowWaitMessage(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <Image
          src="/bw-logo.png"
          alt="agent-prod"
          width="40"
          height="40"
          className="rounded-full mx-auto mb-4"
        />
        <p className="text-lg font-semibold">Generating Drafts</p>
        <p
          className={`mt-2 transition-opacity duration-1000 ${
            showWaitMessage ? "opacity-100" : "opacity-0"
          }`}
        >
          Please wait
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;

export function Mail({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [mails, setMails] = React.useState<Conversations[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showLoadingOverlay, setShowLoadingOverlay] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState("all");
  const { campaigns } = useCampaignContext();
  const [campaign, setCampaign] = React.useState<{
    campaignName: string;
    campaignId: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedMailId, setSelectedMailId] = React.useState<string | null>(
    null
  );

  const { user } = useUserContext();
  const {
    setSenderEmail,
    isContextBarOpen,
    setConversationId,
    setRecipientEmail,
  } = useMailbox();
  const { leads, setLeads } = useLeads();

  const [localIsContextBarOpen, setLocalIsContextBarOpen] =
    React.useState(false);
  const loadingStartTimeRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setLocalIsContextBarOpen(isContextBarOpen);
  }, [isContextBarOpen]);

  const fetchConversations = React.useCallback(
    async (campaignId?: string) => {
      setLoading(true);
      if (showLoadingOverlay) {
        loadingStartTimeRef.current = Date.now();
      }
      try {
        let url = `v2/mailbox/${user?.id}`;
        if (campaignId) {
          url += `?campaign_id=${campaignId}`;
        }
        const response = await axiosInstance.get<{ mails: Conversations[] }>(
          url
        );
        setMails(response.data.mails);

        if (showLoadingOverlay) {
          const elapsedTime = Date.now() - (loadingStartTimeRef.current || 0);
          if (elapsedTime < MIN_LOADING_TIME) {
            setTimeout(() => {
              setLoading(false);
              setShowLoadingOverlay(false);
            }, MIN_LOADING_TIME - elapsedTime);
          } else {
            setLoading(false);
            setShowLoadingOverlay(false);
          }
        } else {
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Error fetching mails:", err);
        setError(err.message || "Failed to load mails.");
        setLoading(false);
        setShowLoadingOverlay(false);
      }
    },
    [user?.id, showLoadingOverlay]
  );

  React.useEffect(() => {
    const newCampaignId = localStorage.getItem("newCampaignId");
    const isRedirectFromCampaign = localStorage.getItem("redirectFromCampaign");

    if (
      newCampaignId &&
      campaigns.length > 0 &&
      isRedirectFromCampaign === "true"
    ) {
      setShowLoadingOverlay(true);
      loadingStartTimeRef.current = Date.now();
      const newCampaign = campaigns.find((c) => c.id === newCampaignId);
      if (newCampaign) {
        setCampaign({
          campaignName: newCampaign.campaign_name,
          campaignId: newCampaign.id,
        });
        fetchConversations(newCampaign.id);
      }
    } else {
      fetchConversations();
    }

    localStorage.removeItem("newCampaignId");
    localStorage.removeItem("redirectFromCampaign");
  }, [campaigns, fetchConversations]);

  React.useEffect(() => {
    if (campaign) {
      fetchConversations(campaign.campaignId);
    } else {
      fetchConversations();
    }
  }, [campaign, fetchConversations]);

  const updateMailStatus = React.useCallback(
    (mailId: string, status: string) => {
      setMails((prevMails) =>
        prevMails.map((mail) =>
          mail.id === mailId ? { ...mail, status } : mail
        )
      );
      if (mailId === selectedMailId) {
        setSelectedMailId(mailId);
      }
    },
    [selectedMailId]
  );

  // const filteredMails = React.useMemo(() => {
  //   return mails.filter((mail) => {
  //     const matchesSearchTerm =
  //       mail.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       mail.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       mail.body_substr.toLowerCase().includes(searchTerm.toLowerCase());

  //     const matchesFilter =
  //       filter === "all" ||
  //       mail.status.toLowerCase() === filter ||
  //       (filter === "sent" && mail.status.toLowerCase() === "delivered");

  //     const matchesCampaign =
  //       !campaign || mail.campaign_id === campaign.campaignId;

  //     return matchesSearchTerm && matchesFilter && matchesCampaign;
  //   });
  // }, [mails, filter, campaign, searchTerm]);

  const filteredMails = React.useMemo(() => {
    return mails.filter((mail) => {
      const matchesSearchTerm =
        mail.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mail.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mail.body_substr.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        mail.status.toLowerCase() === filter ||
        (filter === "sent" && mail.status.toLowerCase() === "delivered") ||
        (filter === "lost" && mail.status.toLowerCase() === "lost");

      const matchesCampaign =
        !campaign || mail.campaign_id === campaign.campaignId;

      return matchesSearchTerm && matchesFilter && matchesCampaign;
    });
  }, [mails, filter, campaign, searchTerm]);

  const currentMail = React.useMemo(
    () =>
      filteredMails.find((mail) => mail.id === selectedMailId) ||
      filteredMails[0] ||
      null,
    [filteredMails, selectedMailId]
  );

  React.useEffect(() => {
    if (currentMail) {
      setSelectedMailId(currentMail.id);
      setSenderEmail(currentMail.sender);
      setConversationId(currentMail.id);
      setRecipientEmail(currentMail.recipient);

      axiosInstance
        .get(`v2/lead/info/${currentMail.recipient}`)
        .then((response) => {
          setLeads([response.data]);
        })
        .catch((error) => {
          console.error("Error fetching lead data:", error);
        });
    } else {
      setSelectedMailId(null);
      setSenderEmail("");
      setConversationId("");
      setRecipientEmail("");
      setLeads([]);
    }
  }, [
    currentMail,
    setSenderEmail,
    setConversationId,
    setRecipientEmail,
    setLeads,
  ]);

  const handleFilterChange = React.useCallback((newFilter: string) => {
    setFilter(newFilter);
  }, []);

  const handleCampaignChange = React.useCallback(
    (newCampaign: { campaignName: string; campaignId: string } | null) => {
      setCampaign(newCampaign);
    },
    []
  );

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  console.log("Current Mail", currentMail);

  return (
    <TooltipProvider delayDuration={0}>
      {showLoadingOverlay && <LoadingOverlay />}
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full items-stretch"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <ResizablePanel defaultSize={localIsContextBarOpen ? 40 : 20}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 pt-2 pb-0">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto flex relative">
                <TabsTrigger
                  value="all"
                  onClick={() => handleFilterChange("all")}
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="to-approve"
                  onClick={() => handleFilterChange("to-approve")}
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  To do
                </TabsTrigger>
                <TabsTrigger
                  value="scheduled"
                  onClick={() => handleFilterChange("scheduled")}
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  Scheduled
                </TabsTrigger>
                <TabsTrigger
                  value="sent"
                  onClick={() => handleFilterChange("sent")}
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  Sent
                </TabsTrigger>
                <TabsTrigger
                  value="lost"
                  onClick={() => handleFilterChange("lost")}
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  Lost
                </TabsTrigger>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center space-x-2"
                    >
                      <span>
                        {campaign ? campaign.campaignName : "All Campaigns"}
                      </span>
                      <ChevronDown size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80">
                    <DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <ScrollArea className="h-[400px] w-full rounded-md">
                        <DropdownMenuItem
                          onClick={() => handleCampaignChange(null)}
                        >
                          <p className="cursor-pointer">All Campaigns</p>
                        </DropdownMenuItem>
                        {campaigns && campaigns.length > 0 ? (
                          campaigns.map((campaignItem) => (
                            <DropdownMenuItem
                              key={campaignItem.id}
                              onClick={() =>
                                handleCampaignChange({
                                  campaignName: campaignItem.campaign_name,
                                  campaignId: campaignItem.id,
                                })
                              }
                            >
                              <p className="cursor-pointer">
                                {campaignItem.campaign_name}{" "}
                                {campaignItem.additional_details &&
                                  `- ${campaignItem.additional_details}`}
                              </p>
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <p className="text-center mt-10">
                            No campaign available.
                          </p>
                        )}
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
                  <Input
                    placeholder="Search"
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </form>
            </div>
            <TabsContent value={filter} className="m-0">
              {loading ? (
                <div className="flex flex-col space-y-3 p-4 pt-0">
                  <Skeleton className="h-[90px] w-full rounded-xl" />
                  <Skeleton className="h-[90px] w-full rounded-xl" />
                  <Skeleton className="h-[90px] w-full rounded-xl" />
                  <Skeleton className="h-[90px] w-full rounded-xl" />
                  <Skeleton className="h-[90px] w-full rounded-xl" />
                  <Skeleton className="h-[90px] w-full rounded-xl" />
                </div>
              ) : filteredMails.length > 0 ? (
                <MailList
                  items={filteredMails}
                  selectedMailId={selectedMailId}
                  setSelectedMailId={setSelectedMailId}
                />
              ) : (
                <div className="flex flex-col gap-3 items-center justify-center mt-36">
                  <Image
                    src="/empty.svg"
                    alt="empty-inbox"
                    width="200"
                    height="200"
                    className="dark:filter dark:invert"
                  />
                  <p className="flex justify-center items-center mt-10 ml-14 text-gray-500">
                    No Mails Available
                  </p>
                </div>
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
            {loading ? (
              <div className="m-4 flex flex-row ">
                <Skeleton className="h-7 w-7 rounded-full" />
                <div className="flex flex-col space-y-3 ml-5">
                  <Skeleton className="h-[25px] w-[30rem] rounded-lg" />
                  <Skeleton className="h-[325px] w-[30rem] rounded-xl" />
                </div>
              </div>
            ) : currentMail ? (
              <ThreadDisplayMain
                ownerEmail={currentMail.recipient}
                updateMailStatus={updateMailStatus}
                selectedMailId={selectedMailId}
                setSelectedMailId={setSelectedMailId}
                mailStatus={currentMail.status} // Add this line
              />
            ) : (
              <div className="flex flex-col gap-3 items-center justify-center mt-[17.2rem]">
                <Image
                  src="/emptydraft.svg"
                  alt="empty-inbox"
                  width="200"
                  height="200"
                  className="dark:filter dark:invert"
                />
                <p className="flex justify-center items-center mt-10 ml-6  text-gray-500">
                  No Draft Available
                </p>
              </div>
            )}
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
