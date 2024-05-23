// /* eslint-disable @typescript-eslint/no-unused-vars */

// ----------------------HARD CODED DATA----------------------

// import {
//   Archive,
//   Clock3,
//   Mail,
//   SendHorizontal,
//   ThumbsDown,
// } from "lucide-react";
// import React from "react";
// import notuser from "../../public/notuser.png";

// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";

// import { Badge } from "../ui/badge";

// const Notification = () => {
//   const [subject, setSubject] = React.useState("Remove from mailing list");
//   const [body, setBody] = React.useState(
//     "Please remove me from the mailing list"
//   );

//   return (
//     <div className="flex flex-col gap-3 w-full">
//       <div className="flex items-center gap-3">
//         <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//           <SendHorizontal className="h-4 w-4 text-gray-400" />
//         </div>
//         <p className=" ml-1 text-xs ">Message processed by server</p>
//         <span className="text-gray-400 text-xs">8 hours ago</span>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//           <Mail className="h-4 w-4 text-gray-400" />
//         </div>
//         <p className=" ml-1 text-xs ">
//           Mail was delivered to Kevin&apos;s inboxs
//         </p>
//         <span className="text-gray-400 text-xs">8 hours ago</span>
//         <Badge
//           variant="destructive"
//           className="rounded-full flex gap-1 items-center bg-red-900 bg-opacity-90"
//         >
//           <ThumbsDown className="h-4 w-4 text-red-500 text-opacity-90 transform scale-x-[-1]" />
//           <span className="text-xs text-red-500 text-opacity-90 ">
//             Negative
//           </span>
//         </Badge>
//       </div>

//       <div className="flex w-full">
//         <Avatar className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-4">
//           <AvatarFallback className="bg-purple-400 text-black text-xs">
//             KN
//           </AvatarFallback>
//         </Avatar>
//         <Card className="w-full mr-7 opacity-60">
//           <div className="flex gap-3 p-4">
//             <span className="text-sm font-semibold text-gray-500">
//               Kevin to You
//             </span>
//             <span className="text-gray-600 text-sm ">8 hours ago</span>
//           </div>
//           <CardHeader className="-mt-8 -ml-3">
//             <CardTitle className="text-sm flex flex-col ">
//               <Input
//                 className="text-xs text-gray-400 "
//                 placeholder="Subject"
//                 value={subject}
//                 readOnly
//               />
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="text-xs -ml-3 -mt-4">
//             <Textarea
//               className="text-xs text-gray-400  h-40"
//               placeholder="Enter email body"
//               value={body}
//               readOnly
//             />
//           </CardContent>
//         </Card>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//           <Clock3 className="h-4 w-4 text-gray-400" />
//         </div>
//         <p className=" ml-1 text-xs ">
//           Kevin was blocked becasue of negative reply
//         </p>
//         <span className="text-gray-400 text-xs">8 hours ago</span>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//           <Archive className="h-4 w-4 text-gray-400" />
//         </div>
//         <p className=" ml-1 text-xs ">
//           Kevin was marked as lost in outbound campaign Senior Executives in
//           Canada
//         </p>
//         <span className="text-gray-400 text-xs">8 hours ago</span>
//       </div>
//     </div>
//   );
// };

// export default Notification;

// ----------------------HARD CODED DATA----------------------

// ----------------------BETTER THAN UPPER ONE----------------------

// import React from "react";
// import { EmailMessage } from "@/context/mailbox-provider"; // Adjust this import according to your project structure
// import {
//   // Archive,
//   // Clock3,
//   Mail,
//   SendHorizontal,
//   ThumbsDown,
// } from "lucide-react";
// import { Badge } from "../ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";

// interface NotificationProps {
//   email: EmailMessage;
// }

// const Notification: React.FC<NotificationProps> = ({ email }) => {
//   const getTimeSince = (dateString: string) => {
//     const date = new Date(dateString);
//     return `${Math.round(
//       (new Date().getTime() - date.getTime()) / (1000 * 3600)
//     )} hours ago`;
//   };

//   return (
//     <div className="flex flex-col gap-3 w-full">
//       {email.is_reply && (
//         <div className="flex items-center gap-3">
//           <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//             <SendHorizontal className="h-4 w-4 text-gray-400" />
//           </div>
//           <p className="ml-1 text-xs">Reply detected: action required.</p>
//           <span className="text-gray-400 text-xs">
//             {getTimeSince(email.received_datetime)}
//           </span>
//         </div>
//       )}

//       <div className="flex items-center gap-3">
//         <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//           <Mail className="h-4 w-4 text-gray-400" />
//         </div>
//         <p className="ml-1 text-xs">
//           Mail delivered to {email.recipient}'s inbox.
//         </p>
//         <span className="text-gray-400 text-xs">
//           {getTimeSince(email.send_datetime)}
//         </span>
//       </div>

//       {email.sentiment === "Negative" && (
//         <div className="flex items-center gap-3">
//           <Badge
//             variant="destructive"
//             className="rounded-full flex gap-1 items-center bg-red-900 bg-opacity-90"
//           >
//             <ThumbsDown className="h-4 w-4 text-red-500 text-opacity-90 transform scale-x-[-1]" />
//             <span className="text-xs text-red-500 text-opacity-90">
//               Negative feedback received.
//             </span>
//           </Badge>
//           <span className="text-gray-400 text-xs">
//             {getTimeSince(email.response_datetime)}
//           </span>
//         </div>
//       )}

//       {/* Additional custom notifications can be added here based on other email attributes */}
//     </div>
//   );
// };

// export default Notification;

// storing code

{
  /* <div className="flex items-center gap-3">
        <Mail className="h-4 w-4 text-gray-400" />
        <p className="text-xs">
          Mail was delivered to {email.recipient}&apos;s inbox.
        </p>
        {email.send_datetime && (
          <span className="text-gray-400 text-xs">
            {formatDate(email.send_datetime)}
          </span>
        )}
      </div> */
}

{
  /* <Badge
            variant="destructive"
            className="rounded-full flex gap-1 items-center bg-red-900 bg-opacity-90"
          >
            <ThumbsDown className="h-4 w-4 text-red-500 text-opacity-90 transform scale-x-[-1]" />
            <span className="text-xs text-red-500 text-opacity-90 ">
              {email.status}
            </span>
          </Badge> */
}
// storing code

// ----------------------BETTER THAN UPPER ONE----------------------

// ----------------------NEW TESTING----------------------

import {
  Archive,
  // Archive,
  Clock3,
  Mail,
  SendHorizontal,
  // SendHorizontal,
  // ThumbsDown,
} from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

// import { Badge } from "../ui/badge";
import { useLeads } from "@/context/lead-user";
import { useUserContext } from "@/context/user-context";

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

  const { leads } = useLeads();
  const { user } = useUserContext();
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
      // Fallback if the format isn't as expected
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
            <Card className="w-full mr-7 opacity-60">
              <div className="flex gap-4 p-4">
                <span className="text-sm font-semibold text-gray-500">
                  You to {leads[0].first_name}
                </span>
                <span className="text-gray-600 text-sm ">
                  {formatDate(email.received_datetime)}
                </span>
              </div>
              <CardHeader className="-mt-8 -ml-3">
                <CardTitle className="text-sm flex flex-col ">
                  <Input
                    className="text-xs text-gray-400 "
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
                  className="text-xs text-gray-400  h-40"
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

      {!email.is_reply && email.status === "SENT" && (
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
            <SendHorizontal className="h-4 w-4 text-gray-400" />
          </div>
          <p className=" ml-1 text-xs ">Message processed by server</p>
          <span className="text-gray-400 text-xs">
            {/* Hardcoded to showcase */}
            <span className="text-gray-400 text-xs">8 hours ago</span>
            {/* Hardcoded to showcase */}
            {email.send_datetime && (
              <span className="text-gray-400 text-xs">
                {formatDate(email.send_datetime)}
              </span>
            )}
          </span>
        </div>
      )}
      {!email.is_reply && email.status === "CLICK" && (
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
            <Clock3 className="h-4 w-4 text-gray-400" />
          </div>
          <p className=" ml-1 text-xs ">Recipient opened the email.</p>
          <span className="text-gray-400 text-xs">
            {/* Hardcoded to showcase */}
            <span className="text-gray-400 text-xs">8 hours ago</span>
            {/* Hardcoded to showcase */}
            {email.send_datetime && (
              <span className="text-gray-400 text-xs">
                {formatDate(email.send_datetime)}
              </span>
            )}
          </span>
        </div>
      )}

      {!email.is_reply && email.status === "DELIVERED" && (
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <p className=" ml-1 text-xs ">
            Mail was delivered to recipient&apos;s inbox
          </p>
          <span className="text-gray-400 text-xs">
            {/* Hardcoded to showcase */}
            <span className="text-gray-400 text-xs">8 hours ago</span>
            {/* Hardcoded to showcase */}
            {email.send_datetime && (
              <span className="text-gray-400 text-xs">
                {formatDate(email.send_datetime)}
              </span>
            )}
          </span>
        </div>
      )}

      {!email.is_reply && email.status === "BOUNCE" && (
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
            <Archive className="h-4 w-4 text-gray-400" />
          </div>
          <p className=" ml-1 text-xs ">
            Mail could not be delivered and was returned to sender.
          </p>
          <span className="text-gray-400 text-xs">
            {/* Hardcoded to showcase */}
            <span className="text-gray-400 text-xs">8 hours ago</span>
            {/* Hardcoded to showcase */}
            {email.send_datetime && (
              <span className="text-gray-400 text-xs">
                {formatDate(email.send_datetime)}
              </span>
            )}
          </span>
        </div>
      )}

      {!email.is_reply && email.status === "COMPLAIN" && (
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
            <Clock3 className="h-4 w-4 text-gray-400" />
          </div>
          <p className=" ml-1 text-xs ">Recipient marked the email as spam.</p>
          <span className="text-gray-400 text-xs">
            {/* Hardcoded to showcase */}
            <span className="text-gray-400 text-xs">8 hours ago</span>
            {/* Hardcoded to showcase */}
            {email.send_datetime && (
              <span className="text-gray-400 text-xs">
                {formatDate(email.send_datetime)}
              </span>
            )}
          </span>
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

// ----------------------NEW TESTING----------------------