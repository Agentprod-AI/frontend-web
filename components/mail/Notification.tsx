/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Archive,
  Clock3,
  Mail,
  SendHorizontal,
  ThumbsDown,
} from "lucide-react";
import React from "react";
import notuser from "../../public/notuser.png";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { Badge } from "../ui/badge";

const Notification = () => {
  const [subject, setSubject] = React.useState("Remove from mailing list");
  const [body, setBody] = React.useState(
    "Please remove me from the mailing list"
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-3">
        <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
          <SendHorizontal className="h-4 w-4 text-gray-400" />
        </div>
        <p className=" ml-1 text-xs ">Message processed by server</p>
        <span className="text-gray-400 text-xs">8 hours ago</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
          <Mail className="h-4 w-4 text-gray-400" />
        </div>
        <p className=" ml-1 text-xs ">
          Mail was delivered to Kevin&apos;s inboxs
        </p>
        <span className="text-gray-400 text-xs">8 hours ago</span>
        <Badge
          variant="destructive"
          className="rounded-full flex gap-1 items-center bg-red-900 bg-opacity-90"
        >
          <ThumbsDown className="h-4 w-4 text-red-500 text-opacity-90 transform scale-x-[-1]" />
          <span className="text-xs text-red-500 text-opacity-90 ">
            Negative
          </span>
        </Badge>
      </div>

      <div className="flex w-full">
        <Avatar className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-4">
          <AvatarFallback className="bg-yellow-400 text-black text-xs">
            KN
          </AvatarFallback>
        </Avatar>
        <Card className="w-full mr-7 opacity-60">
          <div className="flex gap-3 p-4">
            <span className="text-sm font-semibold text-gray-500">
              Kevin to You
            </span>
            <span className="text-gray-600 text-sm ">8 hours ago</span>
          </div>
          <CardHeader className="-mt-8 -ml-3">
            <CardTitle className="text-sm flex flex-col ">
              <Input
                className="text-xs text-gray-400 "
                placeholder="Subject"
                value={subject}
                readOnly
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs -ml-3 -mt-4">
            <Textarea
              className="text-xs text-gray-400  h-40"
              placeholder="Enter email body"
              value={body}
              readOnly
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
          <Clock3 className="h-4 w-4 text-gray-400" />
        </div>
        <p className=" ml-1 text-xs ">
          Kevin was blocked becasue of negative reply
        </p>
        <span className="text-gray-400 text-xs">8 hours ago</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
          <Archive className="h-4 w-4 text-gray-400" />
        </div>
        <p className=" ml-1 text-xs ">
          Kevin was marked as lost in outbound campaign Senior Executives in
          Canada
        </p>
        <span className="text-gray-400 text-xs">8 hours ago</span>
      </div>
    </div>
  );
};

export default Notification;
