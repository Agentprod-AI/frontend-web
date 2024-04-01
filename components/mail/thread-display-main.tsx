import React from "react";
import { formatDistanceToNow } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Email, sampleThread, ThreadEvents } from "@/constants/threads";
import {
  EmailReply,
  emailReplies,
  emailTemplates,
} from "@/constants/new-threads";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useLeadSheetSidebar } from "@/context/lead-sheet-sidebar";
import { Check, ChevronsUpDown, Edit3, RefreshCw, Trash2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const frameworks = [
  {
    value: "autopilotmode",
    label: "Autopilot mode",
  },
  {
    value: "manualmode",
    label: "Manual mode",
  },
];

type EmailOrEventItem = {
  type: "email" | "event";
  data: Email | ThreadEvents;
  timestamp: Date;
};

export default function ThreadDisplayMain() {
  const threadData = sampleThread;
  return (
    <div className="relative">
      <div className="bg-accent w-[3px] h-full absolute left-7 -z-10"></div>
      <SingleThreadDisplay threadData={threadData} />
    </div>
  );
}

function EmailComponent({ email }: { email: EmailReply }) {
  const ownerEmail = "naman.barkiya@gmail.com";
  const isEmailFromOwner = email.fromAddress === ownerEmail;
  const { toggleSidebar } = useLeadSheetSidebar();
  return (
    <div className="flex m-4 w-full">
      <Avatar
        className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-4"
        onClick={() => toggleSidebar(true)}
      >
        {/* <AvatarImage src="/user.png" alt="user" /> */}
        <AvatarFallback>{isEmailFromOwner ? "NB" : "TP"}</AvatarFallback>
      </Avatar>
      <Card className="w-full mr-5">
        <CardHeader>
          <CardTitle className="text-sm">
            {email.subject}{" "}
            {!isEmailFromOwner && (
              <Badge className="ml-2" key={"label"}>
                {email.sentiment}
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-xs">{email.body}</CardDescription>
        </CardHeader>
        <CardContent className="text-xs">
          <span className="text-muted-foreground">
            {email.fromAddress === ownerEmail ? "you" : email.fromAddress} sent
            to {email.toAddress === ownerEmail ? "you" : email.toAddress} -{" "}
            {formatDistanceToNow(
              new Date(email.receivedDateTime.toDateString()),
              {
                addSuffix: true,
              }
            )}
          </span>
        </CardContent>
        {email.category === "Request for Information" ? (
          <CardFooter className="flex justify-between text-xs">
            <span className="mr-2 text-xs">Reply:</span>
            <Textarea className="text-xs" value={emailTemplates[0].bodyText} />
            <Button variant={"ghost"}>Send</Button>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}

function DropdownComponent() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
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
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
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
}

function DraftEmailComponent() {
  const [editable, setEditable] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");

  return (
    <div className="flex m-4 w-full">
      <Avatar
        className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-4"
        // onClick={() => toggleSidebar(true)}
      >
        {/* <AvatarImage src="/user.png" alt="user" /> */}
        <AvatarFallback>{"NB"}</AvatarFallback>
      </Avatar>
      <Card className="w-full mr-5">
        <CardHeader>
          <CardTitle className="text-sm flex">
            <Input
              disabled={!editable}
              className="text-xs"
              placeholder="Subject"
              onChange={(e) => setTitle(e.target.value)}
            />
            <Badge className="ml-2" key={"label"}>
              Draft
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs">
          <Textarea
            disabled={!editable}
            className="text-xs"
            placeholder={emailTemplates[0].bodyText}
            onChange={(e) => setBody(e.target.value)}
          />
        </CardContent>

        <CardFooter className="flex justify-between text-xs items-center">
          <div>
            <Button disabled={editable}>Send</Button>
            {editable && (
              <Button variant={"ghost"} onClick={() => setEditable(false)}>
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div>
            <Button variant={"ghost"} onClick={() => setEditable(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
            </Button>
            <Button variant={"ghost"}>
              <RefreshCw className="mr-2 h-4 w-4" />
            </Button>
            <Button variant={"ghost"}>
              <Trash2 className="mr-2 h-4 w-4" />
            </Button>
            <DropdownComponent />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function SingleThreadDisplay({ threadData }: { threadData: any }) {
  const emails = emailReplies;
  //   const emailsWithType: EmailOrEventItem[] = threadData.data.emails.map(
  //     (email: any) => ({
  //       type: "email",
  //       data: email,
  //       timestamp: new Date(email.timestamp),
  //     }),
  //   );

  //   const eventsWithType: EmailOrEventItem[] = threadData.data.threadEvents.map(
  //     (event: any) => ({
  //       type: "event",
  //       data: event,
  //       timestamp: new Date(event.timestamp),
  //     }),
  //   );

  //   const messages: EmailOrEventItem[] = [...emailsWithType, ...eventsWithType];

  //   messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return (
    <div className="relative">
      {emailReplies.map((email, index) => {
        return <EmailComponent key={index} email={email} />;
      })}
      <DraftEmailComponent />
      {/* {messages.map((message, index) => {
        if (message.type === "email") {
          return <EmailComponent key={index} data={message} />;
        }
      })} */}
    </div>
  );
}
