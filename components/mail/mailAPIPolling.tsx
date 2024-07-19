// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable no-console */
// "use client";
// import * as React from "react";
// import { ChevronDown, Search } from "lucide-react";
// import { MailList } from "./mail-list";
// import type { Mail } from "@/constants/data";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
//   DropdownMenuGroup,
// } from "@/components/ui/dropdown-menu";
// import ThreadDisplayMain from "./thread-display-main";
// import { ScrollArea } from "../ui/scroll-area";
// import axiosInstance from "@/utils/axiosInstance";
// import { useUserContext } from "@/context/user-context";
// import { Button } from "../ui/button";
// import { useCampaignContext } from "@/context/campaign-provider";
// import { useMailbox } from "@/context/mailbox-provider";
// import { Contact, useLeads } from "@/context/lead-user";
// import { PeopleProfileSheet } from "../people-profile-sheet";
// import { Skeleton } from "@/components/ui/skeleton";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";

// interface MailProps {
//   accounts: {
//     label: string;
//     email: string;
//     icon: React.ReactNode;
//   }[];
//   mails: Mail[];
//   defaultLayout: number[] | undefined;
//   defaultCollapsed?: boolean;
//   navCollapsedSize: number;
// }

// export interface Conversations {
//   id: string;
//   user_id: string;
//   sender: string;
//   recipient: string;
//   subject: string;
//   body_substr: string;
//   campaign_id: string;
//   updated_at: string;
//   status: string;
//   name: string;
//   photo_url: string;
//   company_name: string;
//   category: string;
// }

// const ProgressBar = ({ progress }: { progress: number }) => (
//   <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 fixed bottom-0 left-0">
//     <div
//       className="bg-blue-600 h-2.5 rounded-full"
//       style={{ width: `${progress}%` }}
//     ></div>
//   </div>
// );

// export function Mail({
//   defaultLayout = [265, 440, 655],
//   defaultCollapsed = false,
//   navCollapsedSize,
// }: MailProps) {
//   const [mails, setMails] = React.useState<Conversations[]>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);
//   const [filter, setFilter] = React.useState("all");
//   const { campaigns } = useCampaignContext();
//   const [campaign, setCampaign] = React.useState<{
//     campaignName: string;
//     campaignId: string;
//   }>();
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const [progress, setProgress] = React.useState(0);
//   const [isPolling, setIsPolling] = React.useState(false);
//   const [shouldPoll, setShouldPoll] = React.useState(false);

//   const [currentMail, setCurrentMail] = React.useState<Conversations | null>(
//     null
//   );

//   const { user } = useUserContext();
//   const router = useRouter();
//   const pathname = usePathname();

//   const {
//     setSenderEmail,
//     isContextBarOpen,
//     conversationId,
//     setConversationId,
//     setRecipientEmail,
//   } = useMailbox();
//   const { leads } = useLeads();

//   const [localIsContextBarOpen, setLocalIsContextBarOpen] =
//     React.useState(false);

//   React.useEffect(() => {
//     setLocalIsContextBarOpen(isContextBarOpen);
//   }, [isContextBarOpen]);

//   const allCampaigns =
//     campaigns.map((campaign) => ({
//       campaignName: campaign.campaign_name,
//       campaignId: campaign.id,
//       additionalInfo: campaign.additional_details,
//     })) || null;

//   const fetchConversations = React.useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get<{ mails: Conversations[] }>(
//         `v2/mailbox/${user?.id}`
//       );
//       setMails(response.data.mails as Conversations[]);
//       setLoading(false);
//     } catch (err: any) {
//       console.error("Error fetching mails:", err);
//       setError(err.message || "Failed to load mails.");
//       setLoading(false);
//     }
//   }, [user?.id]);

//   const updateMailStatus = React.useCallback((mailId: any, status: any) => {
//     setMails((prevMails) =>
//       prevMails.map((mail) => (mail.id === mailId ? { ...mail, status } : mail))
//     );
//   }, []);

//   React.useEffect(() => {
//     fetchConversations();
//   }, [fetchConversations]);

//   React.useEffect(() => {
//     const previousPath = sessionStorage.getItem("previousPath");
//     const campaignUuidPattern =
//       /^\/dashboard\/campaign\/[a-fA-F0-9-]+\/training$/;

//     if (previousPath && campaignUuidPattern.test(previousPath)) {
//       setShouldPoll(true);
//     }

//     // Store current path for future reference
//     if (pathname) {
//       sessionStorage.setItem("previousPath", pathname);
//     }
//   }, [pathname]);

//   const pollCampaignProgress = React.useCallback(async (): Promise<boolean> => {
//     if (!campaign) return true;

//     setIsPolling(true);
//     return new Promise((resolve) => {
//       const pollInterval = setInterval(async () => {
//         if (!shouldPoll) {
//           clearInterval(pollInterval);
//           setIsPolling(false);
//           resolve(true);
//           return;
//         }

//         try {
//           const response = await axiosInstance.get(
//             `/campaign-progress/${campaign.campaignId}`
//           );
//           const newProgress = response.data.progress;
//           setProgress(newProgress);

//           if (newProgress >= 100) {
//             clearInterval(pollInterval);
//             setIsPolling(false);
//             resolve(true);
//           }
//         } catch (error) {
//           console.error("Error polling campaign progress:", error);
//           clearInterval(pollInterval);
//           setIsPolling(false);
//           resolve(true);
//         }
//       }, 5000); // Poll every 5 seconds
//     });
//   }, [campaign, shouldPoll]);

//   React.useEffect(() => {
//     if (campaign && shouldPoll) {
//       pollCampaignProgress().then((isComplete) => {
//         if (isComplete) {
//           console.log("Polling complete");
//           setShouldPoll(false); // Reset the polling flag
//         }
//       });
//     }
//   }, [campaign, pollCampaignProgress, shouldPoll]);

//   const filteredMails = React.useMemo(() => {
//     return mails.filter((mail) => {
//       const matchesSearchTerm =
//         mail.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         mail.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         mail.body_substr.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesFilter =
//         filter === "all" ||
//         mail.status.toLowerCase() === filter ||
//         (filter === "sent" && mail.status.toLowerCase() === "delivered");

//       const matchesCampaign =
//         !campaign || mail.campaign_id === campaign.campaignId;

//       return matchesSearchTerm && matchesFilter && matchesCampaign;
//     });
//   }, [mails, filter, campaign, searchTerm]);

//   React.useEffect(() => {
//     if (
//       filteredMails.length > 0 &&
//       (!currentMail || currentMail.id !== filteredMails[0]?.id)
//     ) {
//       setSenderEmail(filteredMails[0]?.sender);
//       setConversationId(filteredMails[0]?.id);
//       setRecipientEmail(filteredMails[0]?.recipient);
//       setCurrentMail(filteredMails[0]);
//     }
//   }, [
//     filteredMails,
//     setSenderEmail,
//     setConversationId,
//     setRecipientEmail,
//     currentMail,
//   ]);

//   return (
//     <>
//       <TooltipProvider delayDuration={0}>
//         <ResizablePanelGroup
//           direction="horizontal"
//           onLayout={(sizes: number[]) => {
//             document.cookie = `react-resizable-panels:layout=${JSON.stringify(
//               sizes
//             )}`;
//           }}
//           className="h-full items-stretch"
//           style={{ height: "calc(100vh - 80px)" }}
//         >
//           <ResizablePanel defaultSize={localIsContextBarOpen ? 40 : 20}>
//             <Tabs defaultValue="all">
//               <div className="flex items-center px-4 pt-2 pb-0">
//                 <h1 className="text-xl font-bold">Inbox</h1>
//                 <TabsList className="ml-auto flex relative">
//                   <TabsTrigger
//                     value="all"
//                     onClick={() => setFilter("all")}
//                     className="text-zinc-800 dark:text-zinc-200"
//                   >
//                     All
//                   </TabsTrigger>

//                   <TabsTrigger
//                     value="to-approve"
//                     onClick={() => setFilter("to-approve")}
//                     className="text-zinc-800 dark:text-zinc-200"
//                   >
//                     To do
//                   </TabsTrigger>

//                   <TabsTrigger
//                     value="scheduled"
//                     onClick={() => setFilter("scheduled")}
//                     className="text-zinc-800 dark:text-zinc-200"
//                   >
//                     Scheduled
//                   </TabsTrigger>

//                   <TabsTrigger
//                     value="sent"
//                     onClick={() => setFilter("sent")}
//                     className="text-zinc-800 dark:text-zinc-200"
//                   >
//                     Sent
//                   </TabsTrigger>

//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className="flex items-center justify-center space-x-2"
//                       >
//                         <span>
//                           {campaign ? campaign.campaignName : "Select Campaign"}
//                         </span>
//                         <ChevronDown size={20} />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-80">
//                       <DropdownMenuGroup>
//                         <DropdownMenuSeparator />
//                         <ScrollArea className="h-[400px] w-full rounded-md">
//                           <DropdownMenuItem
//                             onClick={() => setCampaign(undefined)}
//                           >
//                             <p className="cursor-pointer">All Campaigns</p>
//                           </DropdownMenuItem>
//                           {allCampaigns && allCampaigns.length > 0 ? (
//                             allCampaigns.map((campaignItem) => (
//                               <div key={campaignItem.campaignId}>
//                                 <DropdownMenuItem
//                                   onClick={() =>
//                                     setCampaign({
//                                       campaignName: campaignItem.campaignName,
//                                       campaignId: campaignItem.campaignId,
//                                     })
//                                   }
//                                 >
//                                   <p className="cursor-pointer">
//                                     {campaignItem.campaignName}{" "}
//                                     {campaignItem.additionalInfo &&
//                                       `- ${campaignItem.additionalInfo}`}
//                                   </p>
//                                 </DropdownMenuItem>
//                               </div>
//                             ))
//                           ) : (
//                             <p className="text-center mt-10">
//                               No campaign available.
//                             </p>
//                           )}
//                         </ScrollArea>
//                       </DropdownMenuGroup>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TabsList>
//               </div>
//               <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//                 <form>
//                   <div className="relative">
//                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Search"
//                       className="pl-8"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                   </div>
//                 </form>
//               </div>
//               <TabsContent value={filter} className="m-0">
//                 {loading ? (
//                   <div className="flex flex-col space-y-3 p-4 pt-0">
//                     <Skeleton className="h-[90px] w-full  rounded-xl" />
//                     <Skeleton className="h-[90px] w-full  rounded-xl" />
//                     <Skeleton className="h-[90px] w-full  rounded-xl" />
//                     <Skeleton className="h-[90px] w-full  rounded-xl" />
//                     <Skeleton className="h-[90px] w-full  rounded-xl" />
//                     <Skeleton className="h-[90px] w-full  rounded-xl" />
//                   </div>
//                 ) : filteredMails.length > 0 ? (
//                   <MailList items={filteredMails} />
//                 ) : (
//                   <div className="flex flex-col gap-3 items-center justify-center mt-36">
//                     <Image
//                       src="/empty.svg"
//                       alt="empty-inbox"
//                       width="200"
//                       height="200"
//                       className="dark:filter dark:invert"
//                     />
//                     <p className="flex justify-center items-center mt-10 ml-14 text-gray-500">
//                       No Mails Available
//                     </p>
//                   </div>
//                 )}
//               </TabsContent>
//             </Tabs>
//           </ResizablePanel>
//           <ResizableHandle withHandle />
//           <ResizablePanel
//             defaultSize={localIsContextBarOpen ? 40 : 20}
//             minSize={20}
//           >
//             <ScrollArea className="h-full">
//               {loading ? (
//                 <div className="m-4 flex flex-row ">
//                   <Skeleton className="h-7 w-7 rounded-full" />
//                   <div className="flex flex-col space-y-3 ml-5">
//                     <Skeleton className="h-[25px] w-[30rem] rounded-lg" />
//                     <Skeleton className="h-[325px] w-[30rem] rounded-xl" />
//                   </div>
//                 </div>
//               ) : filteredMails.length > 0 ? (
//                 <ThreadDisplayMain
//                   ownerEmail={filteredMails[0].recipient}
//                   updateMailStatus={updateMailStatus}
//                 />
//               ) : (
//                 <div className="flex flex-col gap-3 items-center justify-center mt-[17.2rem]">
//                   <Image
//                     src="/emptydraft.svg"
//                     alt="empty-inbox"
//                     width="200"
//                     height="200"
//                     className="dark:filter dark:invert"
//                   />
//                   <p className="flex justify-center items-center mt-10 ml-6  text-gray-500">
//                     No Draft Available
//                   </p>
//                 </div>
//               )}
//             </ScrollArea>
//           </ResizablePanel>
//           {localIsContextBarOpen && leads.length > 0 && (
//             <>
//               <ResizableHandle withHandle />
//               <ResizablePanel defaultSize={20}>
//                 <PeopleProfileSheet data={leads[0] as Contact} />
//               </ResizablePanel>
//             </>
//           )}
//         </ResizablePanelGroup>
//       </TooltipProvider>
//       {isPolling && <ProgressBar progress={progress} />}
//     </>
//   );
// }

/* eslint-disable react-hooks/exhaustive-deps */
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
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

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

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 fixed bottom-0 left-0">
    <div
      className="bg-blue-600 h-2.5 rounded-full"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

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
  const [searchTerm, setSearchTerm] = React.useState("");
  const [progress, setProgress] = React.useState(0);
  const [isPolling, setIsPolling] = React.useState(false);

  const [currentMail, setCurrentMail] = React.useState<Conversations | null>(
    null
  );

  const { user } = useUserContext();
  const pathname = usePathname();
  const router = useRouter();

  const {
    setSenderEmail,
    isContextBarOpen,
    conversationId,
    setConversationId,
    setRecipientEmail,
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

  const fetchConversations = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<{ mails: Conversations[] }>(
        `v2/mailbox/${user?.id}`
      );
      setMails(response.data.mails as Conversations[]);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching mails:", err);
      setError(err.message || "Failed to load mails.");
      setLoading(false);
    }
  }, [user?.id]);

  const updateMailStatus = React.useCallback((mailId: any, status: any) => {
    setMails((prevMails) =>
      prevMails.map((mail) => (mail.id === mailId ? { ...mail, status } : mail))
    );
  }, []);

  React.useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  React.useEffect(() => {
    const previousPath = sessionStorage.getItem("previousPath");
    const campaignUuidPattern =
      /^\/dashboard\/campaign\/[a-fA-F0-9-]+\/training$/;

    if (previousPath && campaignUuidPattern.test(previousPath)) {
      startPolling();
    }

    // Store current path for future reference
    if (pathname) {
      sessionStorage.setItem("previousPath", pathname);
    }
  }, [pathname]);

  const startPolling = React.useCallback(async () => {
    setIsPolling(true);
    try {
      while (true) {
        const response = await axiosInstance.get("/campaign-progress");
        const newProgress = response.data.progress;
        setProgress(newProgress);

        if (newProgress >= 100) {
          setIsPolling(false);
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before next poll
      }
    } catch (error) {
      console.error("Error in polling:", error);
      setIsPolling(false);
    }
  }, []);

  const filteredMails = React.useMemo(() => {
    return mails.filter((mail) => {
      const matchesSearchTerm =
        mail.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mail.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mail.body_substr.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        mail.status.toLowerCase() === filter ||
        (filter === "sent" && mail.status.toLowerCase() === "delivered");

      const matchesCampaign =
        !campaign || mail.campaign_id === campaign.campaignId;

      return matchesSearchTerm && matchesFilter && matchesCampaign;
    });
  }, [mails, filter, campaign, searchTerm]);

  React.useEffect(() => {
    if (
      filteredMails.length > 0 &&
      (!currentMail || currentMail.id !== filteredMails[0]?.id)
    ) {
      setSenderEmail(filteredMails[0]?.sender);
      setConversationId(filteredMails[0]?.id);
      setRecipientEmail(filteredMails[0]?.recipient);
      setCurrentMail(filteredMails[0]);
    }
  }, [
    filteredMails,
    setSenderEmail,
    setConversationId,
    setRecipientEmail,
    currentMail,
  ]);

  return (
    <>
      <TooltipProvider delayDuration={0}>
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
                    To do
                  </TabsTrigger>

                  <TabsTrigger
                    value="scheduled"
                    onClick={() => setFilter("scheduled")}
                    className="text-zinc-800 dark:text-zinc-200"
                  >
                    Scheduled
                  </TabsTrigger>

                  <TabsTrigger
                    value="sent"
                    onClick={() => setFilter("sent")}
                    className="text-zinc-800 dark:text-zinc-200"
                  >
                    Sent
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
                          <DropdownMenuItem
                            onClick={() => setCampaign(undefined)}
                          >
                            <p className="cursor-pointer">All Campaigns</p>
                          </DropdownMenuItem>
                          {allCampaigns && allCampaigns.length > 0 ? (
                            allCampaigns.map((campaignItem) => (
                              <div key={campaignItem.campaignId}>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setCampaign({
                                      campaignName: campaignItem.campaignName,
                                      campaignId: campaignItem.campaignId,
                                    })
                                  }
                                >
                                  <p className="cursor-pointer">
                                    {campaignItem.campaignName}{" "}
                                    {campaignItem.additionalInfo &&
                                      `- ${campaignItem.additionalInfo}`}
                                  </p>
                                </DropdownMenuItem>
                              </div>
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
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <TabsContent value={filter} className="m-0">
                {loading ? (
                  <div className="flex flex-col space-y-3 p-4 pt-0">
                    <Skeleton className="h-[90px] w-full  rounded-xl" />
                    <Skeleton className="h-[90px] w-full  rounded-xl" />
                    <Skeleton className="h-[90px] w-full  rounded-xl" />
                    <Skeleton className="h-[90px] w-full  rounded-xl" />
                    <Skeleton className="h-[90px] w-full  rounded-xl" />
                    <Skeleton className="h-[90px] w-full  rounded-xl" />
                  </div>
                ) : filteredMails.length > 0 ? (
                  <MailList items={filteredMails} />
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
              ) : filteredMails.length > 0 ? (
                <ThreadDisplayMain
                  ownerEmail={filteredMails[0].recipient}
                  updateMailStatus={updateMailStatus}
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
      {isPolling && <ProgressBar progress={progress} />}
    </>
  );
}

// Testing

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
("use client");
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
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const ProgressTooltip = ({
  count,
  total,
}: {
  count: number;
  total: number;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="fixed bottom-4 left-4 bg-blue-600 text-white rounded-full px-3 py-2 flex items-center justify-center cursor-pointer text-sm">
          leads fetching: {count}/{total}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Progress: {((count / total) * 100).toFixed(2)}%</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const usePollingState = () => {
  const [isPolling, setIsPolling] = React.useState(false);
  const [leadCount, setLeadCount] = React.useState(0);
  const [totalLeads, setTotalLeads] = React.useState(100);

  return {
    isPolling,
    setIsPolling,
    leadCount,
    setLeadCount,
    totalLeads,
    setTotalLeads,
  };
};

const MemoizedThreadDisplayMain = React.memo(ThreadDisplayMain);

export function Mail({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const {
    isPolling,
    setIsPolling,
    leadCount,
    setLeadCount,
    totalLeads,
    setTotalLeads,
  } = usePollingState();
  const [mails, setMails] = React.useState<Conversations[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState("all");
  const { campaigns } = useCampaignContext();
  const [campaign, setCampaign] = React.useState<{
    campaignName: string;
    campaignId: string;
  }>();
  const [searchTerm, setSearchTerm] = React.useState("");

  const [currentMail, setCurrentMail] = React.useState<Conversations | null>(
    null
  );

  const { user } = useUserContext();
  const pathname = usePathname();

  const {
    setSenderEmail,
    isContextBarOpen,
    conversationId,
    setConversationId,
    setRecipientEmail,
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

  const fetchConversations = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<{ mails: Conversations[] }>(
        `v2/mailbox/${user?.id}`
      );
      setMails(response.data.mails as Conversations[]);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching mails:", err);
      setError(err.message || "Failed to load mails.");
      setLoading(false);
    }
  }, [user?.id]);

  const updateMailStatus = React.useCallback((mailId: any, status: any) => {
    setMails((prevMails) =>
      prevMails.map((mail) => (mail.id === mailId ? { ...mail, status } : mail))
    );
  }, []);

  React.useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const simulatePolling = React.useCallback(async () => {
    setIsPolling(true);
    setLeadCount(0);

    const interval = setInterval(() => {
      setLeadCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount >= totalLeads) {
          clearInterval(interval);
          setIsPolling(false);
        }
        return newCount;
      });
    }, 100); // Update every 100ms for faster simulation

    return () => clearInterval(interval);
  }, [setIsPolling, setLeadCount, totalLeads]);

  const handleTestClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPolling) {
      simulatePolling();
    }
  };

  const filteredMails = React.useMemo(() => {
    return mails.filter((mail) => {
      const matchesSearchTerm =
        mail.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mail.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mail.body_substr.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        mail.status.toLowerCase() === filter ||
        (filter === "sent" && mail.status.toLowerCase() === "delivered");

      const matchesCampaign =
        !campaign || mail.campaign_id === campaign.campaignId;

      return matchesSearchTerm && matchesFilter && matchesCampaign;
    });
  }, [mails, filter, campaign, searchTerm]);

  React.useEffect(() => {
    if (
      filteredMails.length > 0 &&
      (!currentMail || currentMail.id !== filteredMails[0]?.id)
    ) {
      setSenderEmail(filteredMails[0]?.sender);
      setConversationId(filteredMails[0]?.id);
      setRecipientEmail(filteredMails[0]?.recipient);
      setCurrentMail(filteredMails[0]);
    }
  }, [
    filteredMails,
    setSenderEmail,
    setConversationId,
    setRecipientEmail,
    currentMail,
  ]);

  const memoizedOwnerEmail = React.useMemo(
    () => filteredMails[0]?.recipient,
    [filteredMails]
  );
  const memoizedUpdateMailStatus = React.useCallback(updateMailStatus, []);

  return (
    <>
      <div className="mb-4">
        <Button onClick={handleTestClick} disabled={isPolling}>
          Test Leads Fetching
        </Button>
      </div>
      <TooltipProvider delayDuration={0}>
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
                    To do
                  </TabsTrigger>

                  <TabsTrigger
                    value="scheduled"
                    onClick={() => setFilter("scheduled")}
                    className="text-zinc-800 dark:text-zinc-200"
                  >
                    Scheduled
                  </TabsTrigger>

                  <TabsTrigger
                    value="sent"
                    onClick={() => setFilter("sent")}
                    className="text-zinc-800 dark:text-zinc-200"
                  >
                    Sent
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
                          <DropdownMenuItem
                            onClick={() => setCampaign(undefined)}
                          >
                            <p className="cursor-pointer">All Campaigns</p>
                          </DropdownMenuItem>
                          {allCampaigns && allCampaigns.length > 0 ? (
                            allCampaigns.map((campaignItem) => (
                              <div key={campaignItem.campaignId}>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setCampaign({
                                      campaignName: campaignItem.campaignName,
                                      campaignId: campaignItem.campaignId,
                                    })
                                  }
                                >
                                  <p className="cursor-pointer">
                                    {campaignItem.campaignName}{" "}
                                    {campaignItem.additionalInfo &&
                                      `- ${campaignItem.additionalInfo}`}
                                  </p>
                                </DropdownMenuItem>
                              </div>
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
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <TabsContent value={filter} className="m-0">
                {loading ? (
                  <div className="flex flex-col space-y-3 p-4 pt-0">
                    <Skeleton className="h-[90px] w-full  rounded-xl" />
                    <Skeleton className="h-[90px] w-full  rounded-xl" />
                    <Skeleton className="h-[90px] w-full  rounded-xl" />
                    <Skeleton className="h-[90px] w-full  rounded-xl" />
                    <Skeleton className="h-[90px] w-full  rounded-xl" />
                    <Skeleton className="h-[90px] w-full  rounded-xl" />
                  </div>
                ) : filteredMails.length > 0 ? (
                  <MailList items={filteredMails} />
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
              ) : filteredMails.length > 0 ? (
                <MemoizedThreadDisplayMain
                  ownerEmail={memoizedOwnerEmail}
                  updateMailStatus={memoizedUpdateMailStatus}
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
      {isPolling && <ProgressTooltip count={leadCount} total={totalLeads} />}
    </>
  );
}
