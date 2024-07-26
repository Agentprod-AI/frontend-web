/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect } from "react";

// import { cn } from "@/lib/utils";

// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useMail } from "@/hooks/useMail";
// import { Conversations } from "./mail";
// import { useMailbox } from "@/context/mailbox-provider";
// import axiosInstance from "@/utils/axiosInstance";
// import { useUserContext } from "@/context/user-context";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { Badge } from "../ui/badge";
// import {
//   Ban,
//   Bell,
//   CalendarCheck,
//   Forward,
//   MailPlus,
//   ThumbsDown,
//   ThumbsUp,
//   TimerReset,
//   Trash2Icon,
//   UserX,
// } from "lucide-react";
// import { MdForwardToInbox } from "react-icons/md";

// import { toast } from "sonner";

// interface MailListProps {
//   items: Conversations[]; // Accepts mails array as props
//   selectedMailId: string | null;
//   setSelectedMailId: (id: string | null) => void;
// }

// export function MailList({
//   items,
//   selectedMailId,
//   setSelectedMailId,
// }: MailListProps) {
//   const [selectedStatus, setSelectedStatus] = React.useState("all"); // State to handle status filter
//   const [mail, setMail] = useMail(); // Assuming useMail is a custom hook for state management
//   const [hoveredMailId, setHoveredMailId] = React.useState<string | null>(null);
//   const [filteredItems, setFilteredItems] = React.useState(items);
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
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [conversationId]);

//   useEffect(() => {
//     axiosInstance
//       .get(`/v2/mailbox/${user?.id}`)
//       .then((response) => {
//         // setConversationId(response.data.mails[0].id);
//         // setRecipientEmail(response.data.mails[0].recipient);
//         // setSenderEmail(response.data.mails[0].sender);
//         // console.log("resssss", response.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [user?.id]);

//   useEffect(() => {
//     // Update filteredItems whenever items, selectedStatus, or the selected campaign changes
//     setFilteredItems(
//       items.filter(
//         (item) =>
//           selectedStatus === "all" ||
//           item.status.toLowerCase() === selectedStatus.toLowerCase()
//       )
//     );
//   }, [items, selectedStatus]);

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);

//     const timeOptions: Intl.DateTimeFormatOptions = {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     };

//     const time = new Intl.DateTimeFormat("en-US", timeOptions).format(date);

//     const dateOptions: Intl.DateTimeFormatOptions = {
//       day: "2-digit",
//       month: "short",
//     };

//     const formattedDate = new Intl.DateTimeFormat("en-GB", dateOptions).format(
//       date
//     );

//     return `${time}, ${formattedDate}`;
//   };

//   // const handleDelete = async (id: string) => {
//   //   try {
//   //     await axiosInstance.delete(`/v2/email/conversations/${id}`);
//   //     toast.success("Mail Deleted");
//   //     setSenderEmail(filteredItems[0]?.sender);
//   //     setConversationId(filteredItems[0]?.id);
//   //     setRecipientEmail(filteredItems[0]?.recipient);
//   //     setFilteredItems(filteredItems.filter((mail) => mail.id !== id));
//   //   } catch (error) {
//   //     // eslint-disable-next-line no-console
//   //     console.error("Failed to delete mail:", error);
//   //   }
//   // };

//   const handleDelete = async (id: string) => {
//     try {
//       await axiosInstance.delete(`/v2/email/conversations/${id}`);
//       toast.success("Mail Deleted");

//       const updatedItems = filteredItems.filter((mail) => mail.id !== id);

//       if (updatedItems.length > 0) {
//         const newSelectedMail = updatedItems[0];
//         setSelectedMailId(newSelectedMail.id);
//         setSenderEmail(updatedItems[0].sender);
//         setConversationId(updatedItems[0].id);
//         setRecipientEmail(updatedItems[0].recipient);
//       } else {
//         setSelectedMailId(null);
//         setSenderEmail(updatedItems[1].sender);
//         setConversationId(updatedItems[1].id);
//         setRecipientEmail(updatedItems[1].recipient);
//       }

//       setFilteredItems(updatedItems);
//     } catch (error) {
//       console.error("Failed to delete mail:", error);
//     }
//   };

//   console.log("Filtered Mail", filteredItems);

//   return (
//     <ScrollArea className="h-screen pb-44">
//       <div className="flex flex-col gap-2 p-4 pt-0">
//         {filteredItems.length > 0 ? (
//           filteredItems.map((item) => (
//             <button
//               key={item.id}
//               className={cn(
//                 "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
//                 mail.selected === item.id && "bg-muted"
//               )}
//               onClick={() => {
//                 setMail({ ...mail, selected: item.id });
//                 setSelectedMailId(item.id);
//                 setConversationId(item.id);
//                 setRecipientEmail(item.recipient);
//               }}
//               onMouseEnter={() => setHoveredMailId(item.id)}
//               onMouseLeave={() => setHoveredMailId(null)}
//             >
//               <div className="flex w-full flex-col gap-1">
//                 <div className="flex items-center">
//                   <div className="flex items-center gap-2">
//                     <Avatar className="flex h-8 w-8 items-center justify-center space-y-0 border bg-white">
//                       <AvatarImage src={item.photo_url} alt="avatar" />
//                       <AvatarFallback className="bg-yellow-400 text-black text-xs">
//                         {item.name
//                           ? item.name
//                               .split(" ")
//                               .map((namePart, index, arr) => {
//                                 if (
//                                   index === 0 ||
//                                   (index === 1 && arr.length > 1)
//                                 ) {
//                                   return namePart[0];
//                                 }
//                                 return "";
//                               })
//                               .join("")
//                           : ""}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="font-semibold w-72 truncate">{`${item.name} from ${item.company_name} `}</div>
//                     {/* {item.read === false && (
//                     <span className="flex h-2 w-2 rounded-full bg-blue-600" />
//                   )} */}
//                     <span className="text-xs">
//                       {item && item.category ? (
//                         <Badge
//                           className={`gap-1 text-xs items-center rounded-full ${
//                             item.category.trim() === "Positive"
//                               ? "bg-green-400"
//                               : item.category.trim() === "Information Required"
//                               ? "bg-green-600"
//                               : item.category.trim() === "Negative"
//                               ? "bg-red-600"
//                               : item.category.trim() === "OOO"
//                               ? "bg-yellow-600"
//                               : item.category.trim() === "Forwarded"
//                               ? "bg-blue-600"
//                               : item.category.trim() === "Forwarded to"
//                               ? "bg-blue-400"
//                               : item.category.trim() === "Neutral"
//                               ? "bg-yellow-300"
//                               : item.category.trim() === "Demo"
//                               ? "bg-purple-600"
//                               : item.category.trim() === "Later"
//                               ? "bg-orange-600"
//                               : item.category.trim() === "Not Interested"
//                               ? "bg-red-600"
//                               : item.category.trim() === "Block"
//                               ? "bg-red-600"
//                               : ""
//                           }`}
//                         >
//                           {item.category.trim() === "Positive" && (
//                             <ThumbsUp className="h-[14px] w-[14px] scale-x-100" />
//                           )}
//                           {item.category.trim() === "Negative" && (
//                             <ThumbsDown className="h-[14px] w-[14px] -scale-x-100" />
//                           )}
//                           {item.category.trim() === "Not Interested" && (
//                             <ThumbsDown className="h-[14px] w-[14px] -scale-x-100" />
//                           )}
//                           {item.category.trim() === "OOO" && (
//                             <UserX className="h-[14px] w-[14px] scale-x-100" />
//                           )}
//                           {item.category.trim() === "Forwarded" && (
//                             <Forward className="h-[14px] w-[14px] scale-x-100" />
//                           )}
//                           {item.category.trim() === "Forwarded to" && (
//                             <MdForwardToInbox className="h-[14px] w-[14px] scale-x-100" />
//                           )}
//                           {item.category.trim() === "Neutral" && (
//                             <Bell className="h-[14px] w-[14px] scale-x-100" />
//                           )}
//                           {item.category.trim() === "Demo" && (
//                             <CalendarCheck className="h-[14px] w-[14px] scale-x-100" />
//                           )}
//                           {item.category.trim() === "Later" && (
//                             <TimerReset className="h-[14px] w-[14px] scale-x-100" />
//                           )}
//                           {item.category.trim() === "Information Required" && (
//                             <MailPlus className="h-[14px] w-[14px] scale-x-100" />
//                           )}
//                           {item.category.trim() === "Block" && (
//                             <Ban className="h-[14px] w-[14px] -scale-x-100" />
//                           )}
//                           {item.category.trim() === "Later"
//                             ? "Later"
//                             : item.category.trim() === "Information Required"
//                             ? "Info Req"
//                             : item.category.trim() === "Not Interested"
//                             ? "Disinterested"
//                             : item.category.trim() === "Forwarded"
//                             ? "Referral"
//                             : item.category.trim() === "Forwarded to"
//                             ? "Forwarded"
//                             : item.category}
//                         </Badge>
//                       ) : null}
//                     </span>
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
//                   )}
//                     {/* Displaying the date if available */}
//                     {/* {item.date && isValidDate(item.date)
//                     ? formatDistanceToNow(new Date(item.date), {
//                         addSuffix: true,
//                       })
//                     : "No date available"} */}
//                     <span className="text-xs text-gray-400">
//                       {item.updated_at && formatDate(item.updated_at)}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="text-xs font-medium ml-10">{item.subject}</div>
//                 {/* Using body_substr for the email body preview */}
//                 <div className="line-clamp-2 text-xs text-muted-foreground ml-10 flex flex-row justify-between items-center">
//                   {(item.body_substr as string)?.substring(0, 80)}{" "}
//                   {/* Adjust substring as needed */}
//                   {hoveredMailId === item.id && (
//                     <Trash2Icon
//                       className="w-4 h-4 dark:hover:text-white hover:text-black"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDelete(item.id);
//                       }}
//                     />
//                   )}
//                 </div>
//               </div>
//             </button>
//           ))
//         ) : (
//           <div className="text-muted-foreground text-center mt-10">
//             No Mails Available
//           </div>
//         )}
//       </div>
//     </ScrollArea>
//   );
// }

// working on 2-3 times rendering

import React, { useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMail } from "@/hooks/useMail";
import { Conversations } from "./mail";
import { useMailbox } from "@/context/mailbox-provider";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "@/context/user-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Ban,
  Bell,
  CalendarCheck,
  Forward,
  MailPlus,
  ThumbsDown,
  ThumbsUp,
  TimerReset,
  Trash2Icon,
  UserX,
} from "lucide-react";
import { MdForwardToInbox } from "react-icons/md";
import { toast } from "sonner";

interface MailListProps {
  items: Conversations[];
  selectedMailId: string | null;
  setSelectedMailId: (id: string | null) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const time = new Intl.DateTimeFormat("en-US", timeOptions).format(date);
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
  };
  const formattedDate = new Intl.DateTimeFormat("en-GB", dateOptions).format(
    date
  );
  return `${time}, ${formattedDate}`;
};

const MailList: React.FC<MailListProps> = ({
  items,
  selectedMailId,
  setSelectedMailId,
}) => {
  const [selectedStatus] = React.useState("all");
  const [mail, setMail] = useMail();
  const [hoveredMailId, setHoveredMailId] = React.useState<string | null>(null);
  const { setConversationId, setRecipientEmail, setSenderEmail } = useMailbox();
  const { user } = useUserContext();

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        selectedStatus === "all" ||
        item.status.toLowerCase() === selectedStatus.toLowerCase()
    );
  }, [items, selectedStatus]);

  useEffect(() => {
    if (user?.id) {
      axiosInstance
        .get(`/v2/mailbox/${user.id}`)
        .then((response) => {
          console.log("Mailbox data fetched:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching mailbox:", error);
        });
    }
  }, [user?.id]);

  const handleMailClick = useCallback(
    (item: Conversations) => {
      setMail((prevMail) => ({ ...prevMail, selected: item.id }));
      setSelectedMailId(item.id);
      setConversationId(item.id);
      setRecipientEmail(item.recipient);
    },
    [setMail, setSelectedMailId, setConversationId, setRecipientEmail]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await axiosInstance.delete(`/v2/email/conversations/${id}`);
        toast.success("Mail Deleted");

        const updatedItems = filteredItems.filter((mail) => mail.id !== id);

        if (updatedItems.length > 0) {
          const newSelectedMail = updatedItems[0];
          setSelectedMailId(newSelectedMail.id);
          setSenderEmail(newSelectedMail.sender);
          setConversationId(newSelectedMail.id);
          setRecipientEmail(newSelectedMail.recipient);
        } else {
          setSelectedMailId(null);
          setSenderEmail("");
          setConversationId("");
          setRecipientEmail("");
        }
      } catch (error) {
        console.error("Failed to delete mail:", error);
        toast.error("Failed to delete mail");
      }
    },
    [
      filteredItems,
      setSelectedMailId,
      setSenderEmail,
      setConversationId,
      setRecipientEmail,
    ]
  );

  const renderMailItem = useCallback(
    (item: Conversations) => {
      const getCategoryBadge = (category: string) => {
        const categoryMap: {
          [key: string]: { color: string; icon: React.ReactNode };
        } = {
          Positive: {
            color: "bg-green-400",
            icon: <ThumbsUp className="h-[14px] w-[14px] scale-x-100" />,
          },
          "Information Required": {
            color: "bg-green-600",
            icon: <MailPlus className="h-[14px] w-[14px] scale-x-100" />,
          },
          Negative: {
            color: "bg-red-600",
            icon: <ThumbsDown className="h-[14px] w-[14px] -scale-x-100" />,
          },
          OOO: {
            color: "bg-yellow-600",
            icon: <UserX className="h-[14px] w-[14px] scale-x-100" />,
          },
          Forwarded: {
            color: "bg-blue-600",
            icon: <Forward className="h-[14px] w-[14px] scale-x-100" />,
          },
          "Forwarded to": {
            color: "bg-blue-400",
            icon: (
              <MdForwardToInbox className="h-[14px] w-[14px] scale-x-100" />
            ),
          },
          Neutral: {
            color: "bg-yellow-300",
            icon: <Bell className="h-[14px] w-[14px] scale-x-100" />,
          },
          Demo: {
            color: "bg-purple-600",
            icon: <CalendarCheck className="h-[14px] w-[14px] scale-x-100" />,
          },
          Later: {
            color: "bg-orange-600",
            icon: <TimerReset className="h-[14px] w-[14px] scale-x-100" />,
          },
          "Not Interested": {
            color: "bg-red-600",
            icon: <ThumbsDown className="h-[14px] w-[14px] -scale-x-100" />,
          },
          Block: {
            color: "bg-red-600",
            icon: <Ban className="h-[14px] w-[14px] -scale-x-100" />,
          },
        };

        const { color, icon } = categoryMap[category.trim()] || {
          color: "",
          icon: null,
        };

        return (
          <Badge className={`gap-1 text-xs items-center rounded-full ${color}`}>
            {icon}
            {category.trim() === "Later"
              ? "Later"
              : category.trim() === "Information Required"
              ? "Info Req"
              : category.trim() === "Not Interested"
              ? "Disinterested"
              : category.trim() === "Forwarded"
              ? "Referral"
              : category.trim() === "Forwarded to"
              ? "Forwarded"
              : category}
          </Badge>
        );
      };

      return (
        <button
          key={item.id}
          className={cn(
            "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
            selectedMailId === item.id && "bg-muted"
          )}
          onClick={() => handleMailClick(item)}
          onMouseEnter={() => setHoveredMailId(item.id)}
          onMouseLeave={() => setHoveredMailId(null)}
        >
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <Avatar className="flex h-8 w-8 items-center justify-center space-y-0 border bg-white">
                  <AvatarImage src={item.photo_url} alt="avatar" />
                  <AvatarFallback className="bg-yellow-400 text-black text-xs">
                    {item.name
                      ? item.name
                          .split(" ")
                          .map((namePart, index, arr) =>
                            index === 0 || (index === 1 && arr.length > 1)
                              ? namePart[0]
                              : ""
                          )
                          .join("")
                      : ""}
                  </AvatarFallback>
                </Avatar>
                {/* <div className="font-semibold w-72 truncate">{`${item.name} from ${item.company_name}`}</div> */}
                <div className="font-semibold w-72 truncate">{`${
                  item.name || "Punit"
                } from ${item.company_name || "suki.ai"}`}</div>
                <span className="text-xs">
                  {item.category && getCategoryBadge(item.category)}
                </span>
              </div>
              <div
                className={cn(
                  "ml-auto text-xs flex gap-2 items-center",
                  selectedMailId === item.id
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <span className="text-xs text-gray-400">
                  {item.updated_at && formatDate(item.updated_at)}
                </span>
              </div>
            </div>
            <div className="text-xs font-medium ml-10">{item.subject}</div>
            <div className="line-clamp-2 text-xs text-muted-foreground ml-10 flex flex-row justify-between items-center">
              {(item.body_substr as string)?.substring(0, 80)}
              {hoveredMailId === item.id && (
                <Trash2Icon
                  className="w-4 h-4 dark:hover:text-white hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                />
              )}
            </div>
          </div>
        </button>
      );
    },
    [selectedMailId, hoveredMailId, handleDelete, handleMailClick]
  );

  return (
    <ScrollArea className="h-screen pb-44">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {filteredItems.length > 0 ? (
          filteredItems.map(renderMailItem)
        ) : (
          <div className="text-muted-foreground text-center mt-10">
            No Mails Available
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default React.memo(MailList);
