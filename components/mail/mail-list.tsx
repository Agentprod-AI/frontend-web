// import React, { ComponentProps, ReactNode, useEffect } from "react";
// import formatDistanceToNow from "date-fns/formatDistanceToNow";

// import { cn } from "@/lib/utils";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useMail } from "@/hooks/useMail";
// import { Conversations } from "./mail";
// import { useMailbox } from "@/context/mailbox-provider";
// import axiosInstance from "@/utils/axiosInstance";
// import { useUserContext } from "@/context/user-context";

// // Adjusting the Mail interface to match the API response
// interface Mail {
//   [x: string]: ReactNode;
//   id: string;
//   name: string; // Assuming this is the sender's name
//   email: string; // Assuming this is the recipient's email
//   subject: string;
//   text: string; // Assuming this is the email body content
//   date?: string; // Optional if your data doesn't always include it
//   read?: boolean;
//   labels?: string[];
// }
// // Props definition if you're passing the mails down from a parent component
// interface MailListProps {
//   items: Conversations[]; // Accepts mails array as props
// }

// function isValidDate(dateString: string) {
//   return Boolean(dateString) && !isNaN(Date.parse(dateString));
// }

// export function MailList({ items }: MailListProps) {
//   const [mail, setMail] = useMail(); // Assuming useMail is a custom hook for state management
//   const {
//     conversationId,
//     setConversationId,
//     setRecipientEmail,
//     recipientEmail,
//     setSenderEmail,
//     senderEmail,
//   } = useMailbox();
//   const { user } = useUserContext();

//   useEffect(() => {
//     console.log(conversationId);
//     console.log(recipientEmail);
//     console.log("sender email", senderEmail);
//   }, [conversationId]);

//   useEffect(() => {
//     axiosInstance
//       .get(`/v2/mailbox/${user?.id}`)
//       .then((response) => {
//         setConversationId(response.data.mails[0].id); //defaults convo id to the first mail's id
//         setRecipientEmail(response.data.mails[0].recipient);
//         setSenderEmail(response.data.mails[0].sender);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   return (
//     <ScrollArea className="h-screen pb-40">
//       <div className="flex flex-col gap-2 p-4 pt-0">
//         {items.length > 0 ? (
//           items.map((item) => (
//             <button
//               key={item.id}
//               className={cn(
//                 "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
//                 mail.selected === item.id && "bg-muted"
//               )}
//               onClick={() => {
//                 setMail({ ...mail, selected: item.id });
//                 console.log("change convo id");
//                 setConversationId(item.id);
//                 setRecipientEmail(item.recipient);
//               }}
//             >
//               <div className="flex w-full flex-col gap-1">
//                 <div className="flex items-center">
//                   <div className="flex items-center gap-2">
//                     <div className="font-semibold">{item.recipient}</div>
//                     {/* {item.read === false && (
//                     <span className="flex h-2 w-2 rounded-full bg-blue-600" />
//                   )} */}
//                   </div>
//                   <div
//                     className={cn(
//                       "ml-auto text-xs flex gap-2 items-center",
//                       mail.selected === item.id
//                         ? "text-foreground"
//                         : "text-muted-foreground"
//                     )}
//                   >
//                     {/* If labels are part of your data */}
//                     {/* {item.labels && item.labels.length > 0 && (
//                     <div className="flex items-center gap-2">
//                       {item.labels.map((label, index) => (
//                         <Badge key={index} variant="default">
//                           {label}
//                         </Badge>
//                       ))}
//                     </div>
//                   )} */}
//                     {/* Displaying the date if available */}
//                     {/* {item.date && isValidDate(item.date)
//                     ? formatDistanceToNow(new Date(item.date), {
//                         addSuffix: true,
//                       })
//                     : "No date available"} */}
//                   </div>
//                 </div>
//                 <div className="text-xs font-medium">{item.subject}</div>
//                 {/* Using body_substr for the email body preview */}
//                 <div className="line-clamp-2 text-xs text-muted-foreground">
//                   {(item.body_substr as string).substring(0, 100)}{" "}
//                   {/* Adjust substring as needed */}
//                 </div>
//               </div>
//             </button>
//           ))
//         ) : (
//           <div className="text-muted-foreground text-center mt-10">
//             No mails found
//           </div>
//         )}
//       </div>
//     </ScrollArea>
//   );
// }
// function getBadgeVariantFromLabel(
//   label: string
// ): ComponentProps<typeof Badge>["variant"] {
//   if (["work"].includes(label.toLowerCase())) {
//     return "default";
//   }

//   if (["personal"].includes(label.toLowerCase())) {
//     return "outline";
//   }

//   return "secondary";
// }

import React, { useEffect } from "react";

import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMail } from "@/hooks/useMail";
import { Conversations } from "./mail";
import { useMailbox } from "@/context/mailbox-provider";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "@/context/user-context";

interface MailListProps {
  items: Conversations[]; // Accepts mails array as props
}

export function MailList({ items }: MailListProps) {
  const [selectedStatus, setSelectedStatus] = React.useState("all"); // State to handle status filter
  const [mail, setMail] = useMail(); // Assuming useMail is a custom hook for state management
  const {
    conversationId,
    setConversationId,
    setRecipientEmail,
    recipientEmail,
    setSenderEmail,
    senderEmail,
  } = useMailbox();
  const { user } = useUserContext();

  useEffect(() => {
    console.log(conversationId);
    console.log(recipientEmail);
    console.log("sender email", senderEmail);
  }, [conversationId]);

  useEffect(() => {
    axiosInstance
      .get(`/v2/mailbox/${user?.id}`)
      .then((response) => {
        setConversationId(response.data.mails[0].id);
        setRecipientEmail(response.data.mails[0].recipient);
        setSenderEmail(response.data.mails[0].sender);
        console.log("resssss", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user?.id]);

  return (
    <ScrollArea className="h-screen pb-44">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                mail.selected === item.id && "bg-muted"
              )}
              onClick={() => {
                setMail({ ...mail, selected: item.id });
                console.log("change convo id");
                setConversationId(item.id);
                setRecipientEmail(item.recipient);
              }}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.recipient}</div>
                    {/* {item.read === false && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )} */}
                  </div>
                  <div
                    className={cn(
                      "ml-auto text-xs flex gap-2 items-center",
                      mail.selected === item.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {/* If labels are part of your data */}
                    {/* {item.labels && item.labels.length > 0 && (
                    <div className="flex items-center gap-2">
                      {item.labels.map((label, index) => (
                        <Badge key={index} variant="default">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )} */}
                    {/* Displaying the date if available */}
                    {/* {item.date && isValidDate(item.date)
                    ? formatDistanceToNow(new Date(item.date), {
                        addSuffix: true,
                      })
                    : "No date available"} */}
                  </div>
                </div>
                <div className="text-xs font-medium">{item.subject}</div>
                {/* Using body_substr for the email body preview */}
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {(item.body_substr as string)?.substring(0, 100)}{" "}
                  {/* Adjust substring as needed */}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-muted-foreground text-center mt-10">
            No Mails Available
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
