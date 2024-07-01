/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useLeadSheetSidebar } from "@/context/lead-sheet-sidebar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Bell,
  CalendarCheck,
  Check,
  ChevronsUpDown,
  Edit3,
  Forward,
  ListTodo,
  MailPlus,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  TimerReset,
  Trash2,
  TrendingUp,
  UserX,
} from "lucide-react";
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
import { PeopleProfileSheet } from "../people-profile-sheet";
import Notification from "./Notification";
import { useCampaignContext } from "@/context/campaign-provider";
import { User } from "lucide-react";
import { LoadingCircle } from "@/app/icons";
import { useUserContext } from "@/context/user-context";
import { Badge } from "../ui/badge";
import { last, previous } from "slate";

interface ThreadDisplayMainProps {
  ownerEmail: string;
  updateMailStatus: (mailId: string, status: string) => void;
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
  updateMailStatus,
}) => {
  const {
    conversationId,
    thread,
    setThread,
    recipientEmail,
    senderEmail,
    setIsContextBarOpen,
    setConversationId,
  } = useMailbox();

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const { toggleSidebar, setItemId } = useLeadSheetSidebar();
  const { leads, setLeads } = useLeads();
  const { campaigns } = useCampaignContext();

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

  const leadId = leads[0]?.campaign_id;

  console.log("Thread, from thread->", thread);

  React.useEffect(() => {
    axiosInstance
      .get<EmailMessage[]>(`v2/mailbox/conversation/${conversationId}`)
      .then((response) => {
        setThread(response.data);
        console.log("Thread Data", response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching conversation:", error);
        setError(error.message || "Failed to load conversation.");
        setIsLoading(false);
      });
  }, [conversationId, thread.length]);

  React.useEffect(() => {
    if (recipientEmail) {
      axiosInstance
        .get(`v2/lead/info/${recipientEmail}`)
        .then((response) => {
          setItemId(response.data.id);
          setLeads([response.data]);
          // console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(error.message || "Failed to load data.");
        });
    }
  }, [recipientEmail]);

  if (isLoading) {
    return (
      <div className="m-4 flex flex-row ">
        <Skeleton className="h-7 w-7 rounded-full" />
        <div className="flex flex-col space-y-3 ml-5">
          <Skeleton className="h-[25px] w-[30rem] rounded-lg" />
          <Skeleton className="h-[325px] w-[30rem] rounded-xl" />
        </div>
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
    // const isEmailFromOwner = email.sender === ownerEmail;

    const [title, setTitle] = React.useState("");
    const [body, setBody] = React.useState("");
    const [editable, setEditable] = React.useState(false);
    const [isLoadingButton, SetIsLoadingButton] = React.useState(false);
    const [loadingSmartSchedule, setLoadingSmartSchedule] =
      React.useState(false);

    const { user } = useUserContext();

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();

      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };

      const dateOptions: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
      };

      // Check if the year is different from the current year
      if (date.getFullYear() !== now.getFullYear()) {
        dateOptions.year = "numeric";
      }

      const time = new Intl.DateTimeFormat("en-US", timeOptions).format(date);
      const formattedDate = new Intl.DateTimeFormat(
        "en-US",
        dateOptions
      ).format(date);

      return `${time}, ${formattedDate}`;
    };

    const handleSendNow = () => {
      SetIsLoadingButton(true);
      const payload = {
        conversation_id: conversationId,
        sender: senderEmail,
        recipient: recipientEmail,
        subject: email.subject,
        body: email.body,
      };

      axiosInstance
        .post("/v2/mailbox/send/immediately", payload)
        .then((response) => {
          toast.success("Your email has been sent successfully!");
          // console.log("Send Data", response.data);
          setThread(response.data);
          // updateMailStatus(conversationId, "sent"); // Update mail status
          SetIsLoadingButton(false);
          setEditable(false);
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
          toast.error("Failed to send the email. Please try again.");
        });
    };

    const handleApproveEmail = () => {
      setLoadingSmartSchedule(true);
      const payload = {
        conversation_id: conversationId,
        sender: senderEmail,
        recipient: recipientEmail,
        subject: email.subject,
        body: email.body,
      };

      axiosInstance
        .post("/v2/mailbox/draft/send", payload)
        .then((response) => {
          toast.success("Draft Approved!");
          setThread(response.data);
          // console.log("Approve Data", response.data);
          // updateMailStatus(conversationId, "scheduled"); // Update mail status
          setLoadingSmartSchedule(false);
          setEditable(false);
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
          toast.error("Failed to send the email. Please try again.");
        });
    };

    const handleRegenrateDraft = () => {
      const payload = {
        user_id: user.id,
        conversation_id: conversationId,
        campaign_id: leads[0].campaign_id,
      };

      console.log("Payload for regeenerate", payload);

      axiosInstance
        .post(`/v2/mailbox/draft/regenerate`, payload)
        .then((response) => {
          toast.success("Your draft has been regenerated successfully!");
          setTitle(response.data.subject);
          setBody(response.data.body);
          console.log(response.data);
          setEditable(false);
        })
        .catch((error) => {
          console.error("Failed to regenerate draft:", error);
          toast.error("Failed to regenerate the draft. Please try again.");
        });
    };

    // regenerate the draft email

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

    if (email?.status === "TO-APPROVE") {
      return (
        <div className="flex gap-4 flex-col m-4 h-full">
          <div className="flex w-full ">
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
                {leads.length > 0 && leads[0]?.first_name && leads[0]?.last_name
                  ? leads[0].first_name.charAt(0) + leads[0].last_name.charAt(0)
                  : ""}
              </AvatarFallback>
            </Avatar>
            <Card className="w-full mr-5 ">
              <div className="flex gap-5 p-4 items-center">
                <span className="text-sm font-semibold">
                  {leads[0]?.email
                    ? email.sender !== leads[0].email
                      ? "You to " + leads[0].first_name
                      : leads[0].first_name + " to you"
                    : ""}
                </span>
                <div className="flex gap-3">
                  <span className="text-gray-500 text-sm  ">
                    {email?.received_datetime &&
                      formatDate(email?.received_datetime.toString())}
                  </span>
                </div>

                <span>
                  {email.is_reply &&
                    email.category === "Information Required" && (
                      <Badge className="gap-1 items-center rounded-full bg-green-600">
                        <MailPlus className="h-[14px] w-[14px] scale-x-100" />
                        Information requested
                      </Badge>
                    )}
                  {email.is_reply && email.category === "Positive" && (
                    <Badge className="gap-1 items-center rounded-full bg-green-600">
                      <MailPlus className="h-[14px] w-[14px] scale-x-100" />
                      Postive
                    </Badge>
                  )}
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-sm flex -mt-8 -ml-3">
                  <Input
                    value={email.subject}
                    className="text-xs"
                    placeholder="Subject"
                    readOnly
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs -ml-3 -mt-4">
                <Textarea
                  value={email.body}
                  readOnly
                  className="text-xs h-64"
                  placeholder="Enter email body"
                />
              </CardContent>
              {/* ADD BUTTON */}
              <CardFooter className="flex justify-between text-xs items-center">
                <div>
                  <Button disabled={editable} onClick={handleApproveEmail}>
                    {loadingSmartSchedule ? (
                      <LoadingCircle />
                    ) : (
                      "Smart Schedule"
                    )}
                  </Button>
                  <Button
                    variant={"secondary"}
                    className="ml-2"
                    onClick={handleSendNow}
                  >
                    {isLoadingButton ? <LoadingCircle /> : "Send Now"}
                  </Button>
                  {editable && (
                    <Button
                      variant={"ghost"}
                      onClick={() => setEditable(false)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <Button variant={"ghost"} onClick={() => setEditable(true)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant={"ghost"} onClick={handleRegenrateDraft}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant={"ghost"} onClick={handleDeleteDraft}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-4 flex-col m-4 h-full ">
        <div className="flex w-full ">
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
              {leads.length > 0 && leads[0]?.first_name && leads[0]?.last_name
                ? leads[0].first_name.charAt(0) + leads[0].last_name.charAt(0)
                : ""}
            </AvatarFallback>
          </Avatar>
          <Card className="w-full mr-5 ">
            <div className="flex gap-5 p-4 items-center">
              <span className="text-sm font-semibold">
                {leads[0]?.email
                  ? email.sender !== leads[0].email
                    ? "You to " + leads[0].first_name
                    : leads[0].first_name + " to you"
                  : ""}
              </span>
              <div className="flex gap-3">
                <span className="text-gray-500 text-sm  ">
                  {email?.received_datetime &&
                    formatDate(email?.received_datetime.toString())}
                </span>
                <span>
                  {email.is_reply &&
                    email.category &&
                    email.category.trim() === "Positive" && (
                      <Badge className="gap-1 items-center rounded-full bg-green-600">
                        <ThumbsUp className="h-[14px] w-[14px] scale-x-100" />
                        Positive
                      </Badge>
                    )}
                  {email.is_reply &&
                    email.category &&
                    email.category.trim() === "OOO" && (
                      <Badge className="gap-1 items-center rounded-full bg-yellow-600">
                        <UserX className="h-[14px] w-[14px] scale-x-100" />
                        Out of office
                      </Badge>
                    )}
                  {email.is_reply &&
                    email.category &&
                    email.category.trim() === "Negative" && (
                      <Badge
                        variant="destructive"
                        className="gap-1 items-center rounded-full"
                      >
                        <ThumbsDown className="-scale-x-100 h-[14px] w-[14px]" />
                        Negative
                      </Badge>
                    )}
                  {email.is_reply &&
                    email.category &&
                    email.category.trim() === "Forwarded" && (
                      <Badge className="gap-1 items-center rounded-full bg-blue-600">
                        <Forward className="h-[14px] w-[14px]" />
                        Forwarded
                      </Badge>
                    )}
                  {email.is_reply &&
                    email.category &&
                    email.category.trim() === "Later" && (
                      <Badge className="gap-1 items-center rounded-full bg-orange-600">
                        <TimerReset className="h-[14px] w-[14px]" />
                        Maybe Later
                      </Badge>
                    )}
                  {email.is_reply &&
                    email.category &&
                    email.category.trim() === "Demo" && (
                      <Badge className="gap-1 items-center rounded-full bg-purple-600">
                        <CalendarCheck className="h-[14px] w-[14px]" />
                        Demo
                      </Badge>
                    )}
                  {email.is_reply &&
                    email.category &&
                    email.category.trim() === "Neutral" && (
                      <Badge className="gap-1 items-center rounded-full bg-gray-600">
                        <Bell className="h-[14px] w-[14px]" />
                        Neutral
                      </Badge>
                    )}
                </span>
              </div>

              <span>
                {email.is_reply &&
                  email.category === "Information Required" && (
                    <Badge className="gap-1 items-center rounded-full bg-green-600">
                      <MailPlus className="h-[14px] w-[14px] scale-x-100" />
                      Information requested
                    </Badge>
                  )}
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-sm flex -mt-8 -ml-3">
                <Input
                  value={email.subject}
                  className="text-xs"
                  placeholder="Subject"
                  readOnly
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs -ml-3 -mt-4">
              <Textarea
                value={email.body}
                readOnly
                className="text-xs h-64"
                placeholder="Enter email body"
              />
            </CardContent>
          </Card>
        </div>
        <Notification email={email} />
      </div>
    );
  };

  const DraftEmailComponent = () => {
    const [followUpSubject, setFollowUpSubject] = React.useState("");
    const [followUpBody, setFollowUpBody] = React.useState("");
    const [editable, setEditable] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [body, setBody] = React.useState("");
    const [isLoadingButton, SetIsLoadingButton] = React.useState(false);
    const [loadingSmartSchedule, setLoadingSmartSchedule] =
      React.useState(false);
    // const [currentEmailIndex, setCurrentEmailIndex] = React.useState(0);
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
    const { user } = useUserContext();
    const internalScrollRef = React.useRef<HTMLDivElement>(null);
    const lastEmail = thread[thread.length - 1];

    React.useEffect(() => {
      axiosInstance
        .get(`/v2/mailbox/draft/${conversationId}`)
        .then((response) => {
          if (response.data.length > 0) {
            setTitle(response.data[0].subject);
            setBody(response.data[0].body);
            setEmails(response.data);
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

    const generateFollowUp = React.useCallback(() => {
      const payload = {
        follow_up_number: 1,
        user_id: user.id,
        previous_emails: [
          {
            subject: lastEmail.subject,
            body: lastEmail.body,
          },
        ],
      };

      console.log(payload);
      axiosInstance
        .post("v2/training/autogenerate/followup", payload)
        .then((response) => {
          setFollowUpSubject(response.data.subject);
          setFollowUpBody(response.data.body);
        })
        .catch((error) => {
          console.error("Error fetching followup data:", error);
        });
    }, [user.id, title, body]);

    React.useEffect(() => {
      if (lastEmail && !lastEmail.is_reply) {
        generateFollowUp();
      }
    }, [lastEmail && !lastEmail.is_reply]);

    const regenrateFollowUp = React.useCallback(() => {
      const payload = {
        follow_up_number: 1,
        user_id: user.id,
        previous_emails: [
          {
            subject: lastEmail.subject,
            body: lastEmail.body,
          },
        ],
      };

      axiosInstance
        .post("v2/training/autogenerate/followup", payload)
        .then((response) => {
          setFollowUpSubject(response.data.subject);
          setFollowUpBody(response.data.body);
          console.log("Regenerated");
        })
        .catch((error) => {
          console.error("Error fetching followup data:", error);
        });
    }, [user.id, title, body]);

    const handleApproveEmail = () => {
      setLoadingSmartSchedule(true);
      const payload = {
        conversation_id: conversationId,
        sender:
          user.id === "54d58714-1e64-46d4-8dfa-02bc24cf9a52"
            ? "muskaan@agenptrodai.com"
            : senderEmail,
        recipient:
          user.id === "54d58714-1e64-46d4-8dfa-02bc24cf9a52"
            ? "info.agentprod@gmail.com"
            : recipientEmail,
        subject: title,
        body: body,
      };

      axiosInstance
        .post("/v2/mailbox/draft/send", payload)
        .then((response) => {
          toast.success("Draft Approved!");
          setThread(response.data);
          // console.log("Approve Data", response.data);
          updateMailStatus(conversationId, "scheduled"); // Update mail status
          setLoadingSmartSchedule(false);
          setEditable(false);
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
          toast.error("Failed to send the email. Please try again.");
        });
    };

    const handleSendNow = () => {
      SetIsLoadingButton(true);
      const payload = {
        conversation_id: conversationId,
        sender:
          user.id === "54d58714-1e64-46d4-8dfa-02bc24cf9a52"
            ? "muskaan@agenptrodai.com"
            : senderEmail,
        recipient:
          user.id === "54d58714-1e64-46d4-8dfa-02bc24cf9a52"
            ? "info.agentprod@gmail.com"
            : recipientEmail,
        subject: title,
        body: body,
      };

      axiosInstance
        .post("/v2/mailbox/send/immediately", payload)
        .then((response) => {
          toast.success("Your email has been sent successfully!");
          setThread(response.data);
          updateMailStatus(conversationId, "sent"); // Update mail status
          SetIsLoadingButton(false);
          setEditable(false);
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
          toast.error("Failed to send the email. Please try again.");
        });
    };

    const handleRegenrateDraft = () => {
      const payload = {
        user_id: user.id,
        conversation_id: conversationId,
        campaign_id: leads[0].campaign_id,
      };

      console.log("Payload for regeenerate", payload);

      axiosInstance
        .post(`/v2/mailbox/draft/regenerate`, payload)
        .then((response) => {
          toast.success("Your draft has been regenerated successfully!");
          setTitle(response.data.subject);
          setBody(response.data.body);
          console.log(response.data);
          setEditable(false);
        })
        .catch((error) => {
          console.error("Failed to regenerate draft:", error);
          toast.error("Failed to regenerate the draft. Please try again.");
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
      return (
        <div className="m-4 flex flex-row ">
          {/* <LoadingCircle /> */}
          <Skeleton className="h-7 w-7 rounded-full" />
          <div className="flex flex-col space-y-3 ml-5">
            <Skeleton className="h-[25px] w-[30rem] rounded-lg" />
            <Skeleton className="h-[325px] w-[30rem] rounded-xl" />
          </div>
        </div>
      );
    }

    if (!emails) {
      <div>Draft is empty</div>;
    }

    if (thread.length > 0 && !lastEmail?.is_reply) {
      {
        return (
          <div className="flex gap-4 flex-col m-4 h-full">
            {/* {thread?.length > 0 && !lastEmail.is_reply && (
              <div className="flex items-center gap-3">
                <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-xs ml-1">
                  Sally will draft a follow-up email when it&apos;s time to
                  reconnect.
                </div>
              </div>
            )} */}

            <div className="flex gap-2 flex-col h-full">
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
                    {leads[0]?.first_name && leads[0]?.last_name
                      ? leads[0].first_name.charAt(0) +
                        leads[0].last_name.charAt(0)
                      : ""}
                  </AvatarFallback>
                </Avatar>
                <Card className="w-full mr-5 ">
                  <div className="flex gap-5 p-4 items-center">
                    <span className="text-sm font-semibold">
                      {"You to " + leads[0]?.first_name}
                    </span>
                    <div className="flex gap-3">
                      <span className="text-green-500 text-sm ">Draft</span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-sm flex -mt-8 -ml-3">
                      <Input
                        value={followUpSubject}
                        className="text-xs"
                        placeholder="Subject"
                        onChange={(e) => setFollowUpSubject(e.target.value)}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs -ml-3 -mt-4">
                    <Textarea
                      value={followUpBody}
                      className="text-xs h-64"
                      placeholder="Enter email body"
                      onChange={(e) => setFollowUpBody(e.target.value)}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between text-xs items-center">
                    <div>
                      <Button disabled={editable} onClick={handleApproveEmail}>
                        {loadingSmartSchedule ? (
                          <LoadingCircle />
                        ) : (
                          "Smart Schedule"
                        )}
                      </Button>
                      <Button
                        variant={"secondary"}
                        className="ml-2"
                        onClick={handleSendNow}
                      >
                        {isLoadingButton ? <LoadingCircle /> : "Send Now"}
                      </Button>
                      {editable && (
                        <Button
                          variant={"ghost"}
                          onClick={() => setEditable(false)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <Button
                        variant={"ghost"}
                        onClick={() => setEditable(true)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={"ghost"}
                        onClick={() => {
                          regenrateFollowUp();
                          toast.success("Draft Regenerating!!");
                        }}
                      >
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
          </div>
        );
      }
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="flex gap-2 flex-col m-4 h-full">
        <div className="flex w-full">
          <Avatar
            className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-4"
            onClick={() => {
              setIsContextBarOpen(true);
            }}
          >
            <AvatarImage
              src={leads[0]?.photo_url ? leads[0].photo_url : ""}
              alt="avatar"
            />

            <AvatarFallback className="bg-yellow-400 text-black text-xs">
              {leads[0]?.first_name && leads[0]?.last_name
                ? leads[0].first_name.charAt(0) + leads[0].last_name.charAt(0)
                : ""}
            </AvatarFallback>
          </Avatar>
          <Card className="w-full mr-5 ">
            <div className="flex gap-5 p-4 items-center">
              <span className="text-sm font-semibold">
                {"You to " + leads[0]?.first_name}
              </span>
              <div className="flex gap-3">
                {/* <span className="text-gray-500 text-sm  ">8 hours ago</span> */}
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
                  {loadingSmartSchedule ? <LoadingCircle /> : "Smart Schedule"}
                </Button>
                <Button
                  variant={"secondary"}
                  className="ml-2"
                  onClick={handleSendNow}
                >
                  {isLoadingButton ? <LoadingCircle /> : "Send Now"}
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
                <Button variant={"ghost"} onClick={handleRegenrateDraft}>
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

  const matchingCampaign = campaigns.find((campaign) => campaign.id === leadId);
  const lastEmail = thread[thread.length - 1];

  return (
    <div className="relative">
      <div className="bg-accent w-[3px] h-full absolute left-7 -z-10"></div>
      <div className="h-full ">
        {isLoading ? (
          ""
        ) : (
          <div className="m-4">
            {matchingCampaign && (
              <div className="flex items-center gap-3">
                <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-xs ml-1">
                  {leads[0].first_name} was added in{" "}
                  {matchingCampaign.campaign_type}{" "}
                  {matchingCampaign.campaign_name} campaign
                </div>
              </div>
            )}
          </div>
        )}
        {thread?.length > 0 && (
          <div>
            {thread.map((email, index) => (
              <EmailComponent key={index} email={email} />
            ))}
          </div>
        )}

        {thread?.length > 0 ? (
          lastEmail.is_reply === false ? (
            <DraftEmailComponent />
          ) : null
        ) : (
          <DraftEmailComponent />
        )}
      </div>
    </div>
  );
};

export default ThreadDisplayMain;
