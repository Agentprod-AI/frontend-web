import React from "react";

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
import { StarsIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { formatDistanceToNow } from "date-fns";
import { useLeadSheetSidebar } from "@/context/lead-sheet-sidebar";

type EmailOrEventItem = {
  type: "email" | "event";
  data: Email | ThreadEvents;
  timestamp: Date;
};

function EmailComponent({ data }: { data: any }) {
  const { toggleSidebar } = useLeadSheetSidebar();
  const email: Email = data.data;
  return (
    <div className="flex m-4 w-full">
      <Avatar
        className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-4"
        onClick={() => toggleSidebar(true)}
      >
        {/* <AvatarImage src="/user.png" alt="user" /> */}
        <AvatarFallback>NB</AvatarFallback>
      </Avatar>
      <Card className="w-full mr-5">
        <CardHeader>
          <CardTitle className="text-sm">{email.subject}</CardTitle>
          <CardDescription className="text-xs">{email.body}</CardDescription>
        </CardHeader>
        {/* <CardContent><span>{email.body}</span></CardContent> */}
        <CardFooter className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            {email.from.name} -{" "}
            {formatDistanceToNow(new Date(email.timestamp.toDateString()), {
              addSuffix: true,
            })}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}

function EventsComponent({ data }: { data: any }) {
  const event: ThreadEvents = data.data;
  return (
    <div className="flex m-4 w-full items-center">
      <div className="bg-accent rounded-full mr-4 h-7 w-7 flex items-center justify-center">
        <StarsIcon className="h-4 w-4" />
      </div>
      {/* <div className="bg-accent w-[3px] h-full absolute left-3 -z-10"></div> */}
      <span className="text-xs">{event.title}</span>
    </div>
  );
}

export default function ThreadDisplay() {
  const threadData = sampleThread;

  return (
    <div className="relative">
      <div className="bg-accent w-[3px] h-full absolute left-7 -z-10"></div>
      <SingleThreadDisplay threadData={threadData} />
      {/* <div className="ml-10">
        {threadData.childThreads?.map((thread, index) => (
          <>
            <div className="pb-2">
              <SingleThreadDisplay key={index} threadData={thread} />
            </div>
          </>
        ))}
      </div> */}
    </div>
  );
}

function SingleThreadDisplay({ threadData }: { threadData: any }) {
  const emailsWithType: EmailOrEventItem[] = threadData.data.emails.map(
    (email: any) => ({
      type: "email",
      data: email,
      timestamp: new Date(email.timestamp),
    }),
  );

  const eventsWithType: EmailOrEventItem[] = threadData.data.threadEvents.map(
    (event: any) => ({
      type: "event",
      data: event,
      timestamp: new Date(event.timestamp),
    }),
  );

  const messages: EmailOrEventItem[] = [...emailsWithType, ...eventsWithType];

  messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // console.log(messages);
  return (
    <div className="relative">
      {/* <div className="bg-accent w-[3px] h-[calc(100%+0.5rem)] absolute left-7 -z-10 border-b-8 border-primary"></div> */}
      {messages.map((message, index) => {
        if (message.type === "email") {
          return <EmailComponent key={index} data={message} />;
        }
        return <EventsComponent key={index} data={message} />;
      })}
    </div>
  );
}
