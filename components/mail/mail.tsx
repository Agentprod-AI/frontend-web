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
const ITEMS_PER_PAGE = 7;

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
  const [activeTab, setActiveTab] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

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
  const mailListRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setLocalIsContextBarOpen(isContextBarOpen);
  }, [isContextBarOpen]);

  // const fetchConversations = React.useCallback(
  //   async (
  //     campaignId?: string,
  //     pageNum: number = 1,
  //     search?: string,
  //     status?: string
  //   ) => {
  //     setLoading(true);
  //     if (showLoadingOverlay) {
  //       loadingStartTimeRef.current = Date.now();
  //     }
  //     try {
  //       let url = `v2/mailbox/${user?.id}`;

  //       if (campaignId) {
  //         url = `v2/mailbox/campaign/${campaignId}/${user?.id}`;
  //       }
  //       url += `?limit=${ITEMS_PER_PAGE}&offset=${
  //         (pageNum - 1) * ITEMS_PER_PAGE
  //       }`;

  //       if (search) {
  //         url += `&search=${encodeURIComponent(search)}`;
  //       }

  //       if (status && status !== "all") {
  //         url += `&_filter=${status.toUpperCase()}`;
  //       }

  //       console.log("Fetching conversations with URL:", url);

  //       const response = await axiosInstance.get<{ mails: Conversations[] }>(
  //         url
  //       );

  //       console.log("Response data:", response.data.mails);
  //       setConversationId(response.data.mails[0].id);

  //       setMails((prevMails) => {
  //         const newMails =
  //           pageNum === 1
  //             ? response.data.mails
  //             : [...prevMails, ...response.data.mails];
  //         return newMails;
  //       });

  //       setHasMore(response.data.mails.length === ITEMS_PER_PAGE);
  //       setPage(pageNum);
  //     } catch (err: any) {
  //       console.error("Error fetching mails:", err);
  //       setError(err.message || "Failed to load mails.");
  //     } finally {
  //       setLoading(false);
  //       setShowLoadingOverlay(false);
  //     }
  //   },
  //   [user?.id, showLoadingOverlay]
  // );

  const fetchConversations = React.useCallback(
    async (
      campaignId?: string,
      pageNum: number = 1,
      search?: string,
      status?: string
    ) => {
      setLoading(true);
      if (showLoadingOverlay) {
        loadingStartTimeRef.current = Date.now();
      }
      try {
        let url = `v2/mailbox/${user?.id}`;

        if (campaignId) {
          url = `v2/mailbox/campaign/${campaignId}/${user?.id}`;
        }
        url += `?limit=${ITEMS_PER_PAGE}&offset=${
          (pageNum - 1) * ITEMS_PER_PAGE
        }`;

        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }

        if (status && status !== "all") {
          url += `&_filter=${status.toUpperCase()}`;
        }

        console.log("Fetching conversations with URL:", url);

        const response = await axiosInstance.get<{ mails: Conversations[] }>(
          url
        );

        console.log("Response data:", response.data.mails);

        if (response.data.mails.length > 0) {
          setConversationId(response.data.mails[0].id);
        } else {
          setConversationId("");
        }

        setMails((prevMails) => {
          if (pageNum === 1) {
            return response.data.mails;
          } else {
            return [...prevMails, ...response.data.mails];
          }
        });

        setHasMore(response.data.mails.length === ITEMS_PER_PAGE);
        setPage(pageNum);
      } catch (err: any) {
        console.error("Error fetching mails:", err);
        setError(err.message || "Failed to load mails.");
        setMails([]); // Set mails to empty array on error
      } finally {
        setLoading(false);
        setShowLoadingOverlay(false);
      }
    },
    [user?.id, showLoadingOverlay, setConversationId]
  );

  // const loadMore = React.useCallback(() => {
  //   if (!loading && hasMore) {
  //     fetchConversations(campaign?.campaignId, page + 1, searchTerm, filter);
  //     if (page === 1 && mailListRef.current) {
  //       mailListRef.current.style.overflowY = "auto";
  //     }
  //   }
  // }, [
  //   loading,
  //   hasMore,
  //   campaign,
  //   page,
  //   searchTerm,
  //   filter,
  //   fetchConversations,
  // ]);

  const loadMore = React.useCallback(() => {
    if (!loading && hasMore) {
      fetchConversations(campaign?.campaignId, page + 1, searchTerm, filter);
      if (page === 1 && mailListRef.current) {
        mailListRef.current.style.overflowY = "auto";
      }
      // Add this line to trigger a re-render of the parent component
      setSelectedMailId(null);
    }
  }, [
    loading,
    hasMore,
    campaign,
    page,
    searchTerm,
    filter,
    fetchConversations,
    setSelectedMailId,
  ]);

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
      }
    }

    localStorage.removeItem("newCampaignId");
    localStorage.removeItem("redirectFromCampaign");
  }, [campaigns]);

  React.useEffect(() => {
    fetchConversations(campaign?.campaignId, 1, searchTerm, filter);
  }, [campaign, searchTerm, filter, fetchConversations]);

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

  const currentMail = React.useMemo(
    () => mails.find((mail) => mail.id === selectedMailId) || mails[0] || null,
    [mails, selectedMailId]
  );

  // React.useEffect(() => {
  //   if (currentMail) {
  //     setSelectedMailId(currentMail.id);
  //     setSenderEmail(currentMail.sender);
  //     setConversationId(currentMail.id);
  //     setRecipientEmail(currentMail.recipient);

  //     axiosInstance
  //       .get(`v2/lead/info/${currentMail.recipient}`)
  //       .then((response) => {
  //         setLeads([response.data]);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching lead data:", error);
  //       });
  //   } else {
  //     setSelectedMailId(null);
  //     setSenderEmail("");
  //     setConversationId("");
  //     setRecipientEmail("");
  //     setLeads([]);
  //   }
  // }, [
  //   currentMail,
  //   setSenderEmail,
  //   setConversationId,
  //   setRecipientEmail,
  //   setLeads,
  // ]);
  React.useEffect(() => {
    if (mails.length > 0) {
      const newCurrentMail =
        mails.find((mail) => mail.id === selectedMailId) || mails[0];
      setSelectedMailId(newCurrentMail.id);
      setSenderEmail(newCurrentMail.sender);
      setConversationId(newCurrentMail.id);
      setRecipientEmail(newCurrentMail.recipient);

      axiosInstance
        .get(`v2/lead/info/${newCurrentMail.recipient}`)
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
    mails,
    selectedMailId,
    setSenderEmail,
    setConversationId,
    setRecipientEmail,
    setLeads,
  ]);

  const handleFilterChange = React.useCallback((newFilter: string) => {
    setFilter(newFilter);
    setPage(1);
  }, []);

  const handleCampaignChange = React.useCallback(
    (newCampaign: { campaignName: string; campaignId: string } | null) => {
      setCampaign(newCampaign);
      setPage(1);
      setMails([]);
    },
    []
  );

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setPage(1);
    },
    []
  );

  const handleTabChange = (value: string) => {
    console.log("Table", value);
    setActiveTab(value);
    handleFilterChange(value);
  };
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
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <div className="flex items-center px-4 pt-2 pb-0">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto flex relative">
                <TabsTrigger
                  value="all"
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="to-approve"
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  To do
                </TabsTrigger>
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center space-x-2"
                    >
                      <span>More</span>
                      <ChevronDown size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => handleTabChange("scheduled")}
                    >
                      Scheduled
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleTabChange("scheduled")}
                    >
                      Responded
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleTabChange("sent")}>
                      Sent
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleTabChange("lost")}>
                      Lost
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center space-x-2"
                    >
                      <span>More</span>
                      <ChevronDown size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => handleTabChange("scheduled")}
                    >
                      Scheduled
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleTabChange("responded")}
                    >
                      Responded
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleTabChange("sent")}>
                      Sent
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleTabChange("lost")}>
                      Lost
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            <TabsContent
              value={filter}
              className="flex-grow overflow-hidden m-0"
            >
              <div ref={mailListRef} className="h-full flex flex-col">
                {loading && page === 1 ? (
                  <div className="flex flex-col space-y-3 p-4 pt-0">
                    {[...Array(6)].map((_, index) => (
                      <Skeleton
                        key={index}
                        className="h-[90px] w-full rounded-xl"
                      />
                    ))}
                  </div>
                ) : mails.length > 0 ? (
                  <MailList
                    items={mails}
                    selectedMailId={selectedMailId}
                    setSelectedMailId={setSelectedMailId}
                    hasMore={hasMore}
                    loading={loading}
                    loadMore={loadMore}
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
                    <p className="text-gray-500 mt-4">No Mails Available</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={localIsContextBarOpen ? 40 : 20}
          minSize={20}
        >
          <ScrollArea className="h-full">
            {loading && page === 1 ? (
              <div className="m-4 flex flex-row ">
                <Skeleton className="h-7 w-7 rounded-full" />
                <div className="flex flex-col space-y-3 ml-5">
                  <Skeleton className="h-[25px] w-[30rem] rounded-lg" />
                  <Skeleton className="h-[325px] w-[30rem] rounded-xl" />
                </div>
              </div>
            ) : currentMail ? (
              <ThreadDisplayMain
                key={`thread-${selectedMailId}-${mails.length}`}
                ownerEmail={currentMail.recipient}
                updateMailStatus={updateMailStatus}
                selectedMailId={selectedMailId}
                setSelectedMailId={setSelectedMailId}
                mailStatus={currentMail.status}
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

export default Mail;
