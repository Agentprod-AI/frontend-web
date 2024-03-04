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
              },
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
      {/* {messages.map((message, index) => {
        if (message.type === "email") {
          return <EmailComponent key={index} data={message} />;
        }
      })} */}
    </div>
  );
}
