"use client";
import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  PenBox,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { AccountSwitcher } from "../layout/account-switcher";
import { MailDisplay } from "./mail-display";
import { MailList } from "./mail-list";
// import { Nav } from "../layout/nav";
import { Mail } from "@/constants/data";
import { useMail } from "@/hooks/useMail";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
// import ThreadDisplay from "./thread-display";
import ThreadDisplayMain from "./thread-display-main";
import { ScrollArea } from "../ui/scroll-area";
import { config } from "@/utils/config";

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

export function Mail({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [mails, setMails] = React.useState<Mail[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const testUserId = "9cbe5057-59fe-4e6e-8399-b9cd85cc9c6c";

  React.useEffect(() => {
    // Define the function for fetching mails using axios
    async function fetchMails(userId: string) {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/v2/mailbox/${userId}`;

      try {
        setLoading(true);
        const response = await axios.get(apiUrl);
        setMails(response.data.mails); // Assuming the response structure contains { mails: [...] }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message); // Handling Axios errors
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMails(testUserId);
  }, []); // Dependency array remains empty to run once on mount

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
        style={{ height: "calc(100vh - 56px)" }}
      >
        <ResizablePanel defaultSize={50}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 pt-2 pb-0">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto flex space-x-4 relative">
                <TabsTrigger
                  value="all"
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  To approve
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-800 dark:text-zinc-200"
                >
                  Scheduled
                </TabsTrigger>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <TabsTrigger
                      value="more"
                      className="text-zinc-800 dark:text-zinc-200 flex items-center space-x-2"
                    >
                      More
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 9l-7 7-7-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </TabsTrigger>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="absolute right-0 z-10 mt-2 w-38 origin-top-right rounded-md bg-zinc-200 shadow-lg dark:bg-zinc-800 "
                      align="center"
                    >
                      <DropdownMenu.Item className="block cursor-pointer px-4 py-2 align-middle text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:rounded-md transition-colors duration-200 ease-in-out">
                        <p className=" text-center">All</p>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="block cursor-pointer px-4 py-2 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:rounded-md transition-colors duration-200 ease-in-out">
                        <p className=" text-center">Starred</p>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="block cursor-pointer px-4 py-2 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:rounded-md transition-colors duration-200 ease-in-out">
                        <p className=" text-center">Engaged</p>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
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
            <TabsContent value="all" className="m-0">
              <MailList items={mails as Mail[]} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={mails.filter((item) => !item.read) as Mail[]} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          {/* <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
          /> */}
          <ScrollArea className="h-full">
            <ThreadDisplayMain conversationId={""} ownerEmail={""} />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
      {/* </ResizablePanel>
      </ResizablePanelGroup> */}
    </TooltipProvider>
  );
}
