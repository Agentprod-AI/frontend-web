/* eslint-disable no-console */
import {
  Archive,
  Bell,
  Clock3,
  ListTodo,
  Mail,
  MailPlus,
  SendHorizontal,
} from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useLeads } from "@/context/lead-user";
import { useUserContext } from "@/context/user-context";
import { Button } from "../ui/button";
import { useMailbox } from "@/context/mailbox-provider";
import axiosInstance from "@/utils/axiosInstance";

interface EmailMessage {
  id: any;
  conversation_id: any;
  received_datetime: any;
  sender: any;
  recipient: any;
  subject: any;
  body: any;
  is_reply: any;
  send_datetime: any;
  open_datetime: any;
  click_datetime: any;
  response_datetime: any;
  status: any;
  sentiment: any;
  category: any;
  action_draft: any;
  message_id: any;
}

interface NotificationProps {
  email: EmailMessage;
}

const Notification: React.FC<NotificationProps> = ({ email }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const [questions, setQuestions] = React.useState([]);
  const { setIsContextBarOpen } = useMailbox();
  const { leads } = useLeads();
  const { user } = useUserContext();

  React.useEffect(() => {
    if (
      !email.is_reply &&
      email?.status?.toLowerCase() === "information required"
    ) {
      axiosInstance
        .get(`/questions/${email.message_id}`)
        .then((response) => {
          setQuestions(response.data.questions);
          console.log("Questions", response.data.questions);
        })
        .catch((error) => console.error("Failed to fetch questions", error));
    }
  }, [email]);

  const parseActionDraft = (actionDraft: any) => {
    if (!actionDraft)
      return { subject: "No subject", body: "No details provided" };

    const subjectMarker = "Subject: ";
    const splitIndex = actionDraft.indexOf("\n\n");

    let subject = "No subject";
    let body = "No details provided";

    if (splitIndex !== -1) {
      subject = actionDraft.substring(subjectMarker.length, splitIndex);
      body = actionDraft.substring(splitIndex + 2);
    } else {
      body = actionDraft.substring(subjectMarker.length);
    }

    return { subject, body };
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {email.is_reply && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
              <Clock3 className="h-4 w-4 text-gray-400" />
            </div>
            <p className=" ml-1 text-xs ">{email.category}</p>
            <span className="text-gray-600 text-sm ">
              {formatDate(email.received_datetime)}
            </span>
          </div>

          <div className="flex w-full">
            <Avatar className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-4">
              <AvatarFallback className="bg-yellow-400 text-black text-xs">
                {user?.firstName && user.lastName
                  ? user.firstName.charAt(0) + user.lastName.charAt(0)
                  : ""}
              </AvatarFallback>
            </Avatar>
            <Card className="w-full mr-7 ">
              <div className="flex gap-4 p-4">
                <span className="text-sm font-semibold">
                  {leads[0].first_name ? "You to " + leads[0].first_name : ""}
                </span>
                <span className="text-gray-600 text-sm ">
                  {formatDate(email.received_datetime)}
                </span>
              </div>
              <CardHeader className="-mt-8 -ml-3">
                <CardTitle className="text-sm flex flex-col ">
                  <Input
                    className="text-xs"
                    placeholder="Subject"
                    value={
                      email.action_draft &&
                      parseActionDraft(email.action_draft).subject
                    }
                    readOnly
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs -ml-3 -mt-4">
                <Textarea
                  className="text-xs h-40"
                  placeholder="Enter email body"
                  value={
                    email.action_draft &&
                    parseActionDraft(email.action_draft).body
                  }
                  readOnly
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!email.is_reply &&
        email?.status?.toLowerCase() === "information required" && (
          <div>
            <div className="flex gap-2 flex-col h-full">
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
                      ? leads[0].first_name.charAt(0) +
                        leads[0].last_name.charAt(0)
                      : ""}
                  </AvatarFallback>
                </Avatar>
                <Card className="w-full mr-5 ">
                  <div className="flex gap-5 p-4 items-center">
                    <span className="text-sm font-semibold">
                      {leads[0]?.first_name + " to you"}
                    </span>
                    <div className="flex gap-3 items-center">
                      <span className="text-gray-500 text-sm  ">
                        2 minutes ago
                      </span>
                      <span className="bg-green-100 text-green-600 text-xs border p-1 border-green-100 flex gap-1 items-center rounded-full">
                        <MailPlus className="h-4 w-4" />{" "}
                        <span> Information requested</span>
                      </span>
                    </div>
                  </div>
                  <CardHeader></CardHeader>
                  <CardContent className="text-xs -ml-3 -mt-10">
                    <Textarea
                      value={`Hi Jason,\n\What's the pricing? I coudn't find it on the website. \n\nThanks\nJason`}
                      className="text-xs h-40"
                      placeholder="Enter email body"
                      readOnly
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
                <ListTodo className="h-4 w-4 text-gray-400" />
              </div>
              <p className=" ml-1 text-xs ">
                <span className="text-gray-500">Todo: </span> Respond to ask
                question
              </p>
            </div>

            <div className="flex gap-2 flex-col h-full">
              {questions.map((question: any, index: any) => (
                <div key={index} className="flex w-full mr-4">
                  <Card className="w-full mr-5 ml-12 p-4 flex flex-row justify-between items-center">
                    <span className="text-xs w-2/3">{question}</span>
                    <Input className="w-1/3" placeholder="Answer" />
                  </Card>
                </div>
              ))}

              <Button
                className="ml-12 w-48 flex gap-2 items-center"
                variant="secondary"
              >
                <span>Generate response</span>
              </Button>
            </div>
          </div>
        )}

      {!email.is_reply && email?.status?.toLowerCase() === "sent" && (
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
            <SendHorizontal className="h-4 w-4 text-gray-400" />
          </div>
          <p className=" ml-1 text-xs ">Message processed by server</p>
          <span className="text-gray-400 text-xs">
            {email.send_datetime && (
              <span className="text-gray-400 text-xs">
                {formatDate(email.send_datetime)}
              </span>
            )}
          </span>
        </div>
      )}
      {!email.is_reply && email?.status?.toLowerCase() === "scheduled" && (
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
            <Bell className="h-4 w-4 text-gray-400" />
          </div>
          <p className=" ml-1 text-xs ">Your draft has been scheduled.</p>
          <span className="text-gray-400 text-xs">
            {email.send_datetime && (
              <span className="text-gray-400 text-xs">
                {formatDate(email.send_datetime)}
              </span>
            )}
          </span>
        </div>
      )}
      {!email.is_reply && email?.status?.toLowerCase() === "click" && (
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
            <Clock3 className="h-4 w-4 text-gray-400" />
          </div>
          <p className=" ml-1 text-xs ">Recipient opened the email.</p>
          <span className="text-gray-400 text-xs">
            {email.click_datetime && (
              <span className="text-gray-400 text-xs">
                {formatDate(email.click_datetime)}
              </span>
            )}
          </span>
        </div>
      )}

      {!email.is_reply && email?.status?.toLowerCase() === "delivered" && (
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <p className=" ml-1 text-xs ">
            Mail was delivered to recipient&apos;s inbox
          </p>
          <span className="text-gray-400 text-xs">
            {email.received_datetime && (
              <span className="text-gray-400 text-xs">
                {formatDate(email.received_datetime)}
              </span>
            )}
          </span>
        </div>
      )}

      {!email.is_reply && email?.status?.toLowerCase() === "bounce" && (
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
            <Archive className="h-4 w-4 text-gray-400" />
          </div>
          <p className=" ml-1 text-xs ">
            Mail could not be delivered and was returned to sender.
          </p>
          {/* <span className="text-gray-400 text-xs">
            {email.send_datetime && (
              <span className="text-gray-400 text-xs">
                {formatDate(email.send_datetime)}
              </span>
            )}
          </span> */}
        </div>
      )}

      {!email.is_reply && email?.status?.toLowerCase() === "complain" && (
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
            <Clock3 className="h-4 w-4 text-gray-400" />
          </div>
          <p className=" ml-1 text-xs ">Recipient marked the email as spam.</p>
          {/* <span className="text-gray-400 text-xs">
            {email.send_datetime && (
              <span className="text-gray-400 text-xs">
                {formatDate(email.send_datetime)}
              </span>
            )}
          </span> */}
        </div>
      )}

      {/* {email.sentiment === "Negative" && (
        <div className="flex items-center gap-3">
          <ThumbsDown className="h-4 w-4 text-red-500" />
          <p className="text-xs">Negative feedback received.</p>
          {email.response_datetime && (
            <span className="text-gray-400 text-xs">
              {formatDate(email.response_datetime)}
            </span>
          )}
        </div>
      )} */}
    </div>
  );
};

export default Notification;
