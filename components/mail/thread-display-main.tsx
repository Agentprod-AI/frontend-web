/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import axiosInstance from "../../utils/axiosInstance";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

import { useLeadSheetSidebar } from "@/context/lead-sheet-sidebar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Edit3, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useMailbox, Mailbox, EmailMessage } from "@/context/mailbox-provider";
import { Lead, useLeads, Contact } from "@/context/lead-user";
import { toast } from "sonner";
import Notification from "./Notification";

interface ConversationEntry {
  id: string;
  conversation_id: string;
  received_datetime: string | null;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  is_reply: boolean;
  send_datetime: string | null;
  open_datetime: string | null;
  click_datetime: string | null;
  response_datetime: string | null;
  status: string | null;
  sentiment: string | null;
  category: string | null;
  action_draft: string | null;
  message_id: string;
}

interface ThreadDisplayMainProps {
  ownerEmail: string;
}

const frameworks = [
  {
    value: "manualmode",
    label: "Manual mode",
  },
  {
    value: "autopilotmode",
    label: "Autopilot mode",
  },
];

const ThreadDisplayMain: React.FC<ThreadDisplayMainProps> = ({
  ownerEmail,
}) => {
  const { conversationId, thread, setThread, recipientEmail, senderEmail } =
    useMailbox();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const { toggleSidebar, setItemId } = useLeadSheetSidebar();
  const { leads, setLeads } = useLeads();

  const initials = (name: string) => {
    const names = name.split(" ");
    if (names) {
      return names
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    } else {
      return "NA";
    }
  };

  React.useEffect(() => {
    axiosInstance
      .get<EmailMessage[]>(`v2/mailbox/conversation/${conversationId}`)
      .then((response) => {
        setThread(response.data);

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching conversation:", error);
        setError(error.message || "Failed to load conversation.");
        setIsLoading(false);
      });
  }, [conversationId]);

  React.useEffect(() => {
    if (recipientEmail) {
      axiosInstance
        .get(`v2/lead/info/${recipientEmail}`)
        .then((response) => {
          setItemId(response.data.id);
          setLeads([response.data]);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(error.message || "Failed to load data.");
        });
    }
  }, [recipientEmail]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium text-red-500">Error: {error}</div>
      </div>
    );
  }

  const EmailComponent = ({ email }: { email: EmailMessage }) => {
    const isEmailFromOwner = email.sender === ownerEmail;

    return (
      <div className="flex m-4 w-full">
        <Avatar
          className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-4"
          onClick={() => {
            toggleSidebar(true);
          }}
        >
          <AvatarImage
            src={leads[0]?.photo_url ? leads[0].photo_url : ""}
            alt="avatar"
          />
          <AvatarFallback>{initials(leads[0]?.name)}</AvatarFallback>
        </Avatar>
        <Card className="w-full mr-5">
          <CardHeader>
            <CardTitle className="text-sm">
              {email.subject}{" "}
              {!isEmailFromOwner && email.sentiment && (
                <Badge className="ml-2" key={"label"}>
                  {email.sentiment}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-xs">{email.body}</CardDescription>
          </CardHeader>
          <CardContent className="text-xs">
            <span className="text-muted-foreground">
              {email.sender === ownerEmail ? "you" : email.sender} sent to{" "}
              {email.recipient === ownerEmail ? "you" : email.recipient} -{" "}
              {email.received_datetime &&
                formatDistanceToNow(
                  new Date(email.received_datetime.toString()),
                  {
                    addSuffix: true,
                  }
                )}
            </span>
          </CardContent>
        </Card>
      </div>
    );
  };

  const DraftEmailComponent = () => {
    const [editable, setEditable] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [body, setBody] = React.useState("");
    const [currentEmailIndex, setCurrentEmailIndex] = React.useState(0);
    const [emails, setEmails] = React.useState<
      {
        body: string;
        conversation_id: string;
        created_at: string;
        id: number;
        subject: string;
        updated_at: string;
      }[]
    >();
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    const internalScrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      axiosInstance
        .get(`/v2/mailbox/draft/${conversationId}`)
        .then((response) => {
          console.log("ThreadDisplayyyy->", response);
          if (response.data.length > 0) {
            setTitle(response.data[0].subject);
            setBody(response.data[0].body);
            setEmails(response.data);

            // draftEmailRef.current?.scrollIntoView({
            //   behavior: "smooth",
            //   inline: "center",
            // });
          }

          setIsLoading(false);
        })
        .catch((err) => {
          setError("Failed to load draft emails");
          setIsLoading(false);
          console.error(err);
        });
    }, [conversationId]);

    React.useEffect(() => {
      if (internalScrollRef.current) {
        internalScrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, [emails]);

    const handleApproveEmail = () => {
      const payload = {
        conversation_id: conversationId,
        sender: "muskaan@agentprodai.com",
        recipient: "info.agentprod@gmail.com",
        subject: title,
        body: body,
      };

      axiosInstance
        .post("/v2/mailbox/draft/send", payload)
        .then((response) => {
          toast.success("Your email has been sent successfully!");
          console.log(response.data);
          setEditable(false);
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
          toast.error("Failed to send the email. Please try again.");
        });
    };

    const handleSendNow = () => {
      const payload = {
        conversation_id: conversationId,
        sender: "muskaan@agentprodai.com",
        recipient: "info.agentprod@gmail.com",
        subject: title,
        body: body,
      };

      axiosInstance
        .post("/v2/mailbox/send/immediately", payload)
        .then((response) => {
          toast.success("Your email has been sent successfully!");
          console.log(response.data);
          setEditable(false);
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
          toast.error("Failed to send the email. Please try again.");
        });
    };

    const handleDeleteDraft = () => {
      axiosInstance
        .delete(`/v2/mailbox/draft/${conversationId}`)
        .then((response) => {
          toast.success("Your draft has been deleted successfully!");
          console.log(response.data);
          setEditable(false);
        })
        .catch((error) => {
          console.error("Failed to delete draft:", error);
          toast.error("Failed to delete the draft. Please try again.");
        });
    };

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="flex gap-2 flex-col m-4 h-full">
        <Notification />
        <div className="flex w-full">
          <Avatar
            className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-4"
            onClick={() => {
              toggleSidebar(true);
            }}
          >
            <AvatarImage
              src={leads[0]?.photo_url ? leads[0].photo_url : ""}
              alt="avatar"
            />

            <AvatarFallback className="bg-yellow-400 text-black text-xs">
              SG
            </AvatarFallback>
          </Avatar>
          <Card className="w-full mr-5 ">
            <div className="flex gap-5 p-4 items-center">
              <span className="text-sm font-semibold">You to Kevin</span>
              <div className="flex gap-3">
                <span className="text-gray-500 text-sm  ">8 hours ago</span>
                <span className="text-green-500 text-sm ">Draft</span>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-sm flex -mt-8 -ml-3">
                <Input
                  value={title}
                  disabled={!editable}
                  className="text-xs"
                  placeholder="Subject"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs -ml-3 -mt-4">
              <Textarea
                value={body}
                disabled={!editable}
                className="text-xs h-64"
                placeholder="Enter email body"
                onChange={(e) => setBody(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-between text-xs items-center">
              <div>
                <Button disabled={editable} onClick={handleApproveEmail}>
                  Approve
                </Button>
                <Button
                  variant={"secondary"}
                  className="ml-2"
                  onClick={handleSendNow}
                >
                  Send Now
                </Button>
                {editable && (
                  <Button variant={"ghost"} onClick={() => setEditable(false)}>
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div>
                <Button variant={"ghost"} onClick={() => setEditable(true)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant={"ghost"}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant={"ghost"} onClick={handleDeleteDraft}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
            <div ref={internalScrollRef} />
          </Card>
        </div>
      </div>
    );
  };

  const DropdownComponent = () => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("manualmode");

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? frameworks.find((f) => f.value === value)?.label
              : "Manual mode"}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="relative">
      <div className="bg-accent w-[3px] h-full absolute left-7 -z-10"></div>
      <div className="h-full ">
        {thread?.length > 0 && (
          <div>
            {thread.map((email, index) => (
              <EmailComponent key={index} email={email} />
            ))}
          </div>
        )}
        <DraftEmailComponent />
      </div>
    </div>
  );
};

export default ThreadDisplayMain;
