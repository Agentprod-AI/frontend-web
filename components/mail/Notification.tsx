// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable no-console */
// import {
//   Archive,
//   Bell,
//   CalendarCheck,
//   CalendarPlus,
//   // CalendarClock,
//   Clock3,
//   Edit3,
//   Forward,
//   ListTodo,
//   Mail,
//   MailPlus,
//   MailQuestion,
//   MailWarning,
//   RefreshCw,
//   SendHorizontal,
//   ThumbsDown,
//   ThumbsUp,
//   TimerReset,
//   Trash2,
//   UserX,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// import React from "react";

// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";
// import { useLeads } from "@/context/lead-user";
// import { useUserContext } from "@/context/user-context";
// import { Button } from "../ui/button";
// import { useMailbox } from "@/context/mailbox-provider";
// import axiosInstance from "@/utils/axiosInstance";
// import { toast } from "sonner";
// import { LoadingCircle } from "@/app/icons";

// interface EmailMessage {
//   id: any;
//   conversation_id: any;
//   received_datetime: any;
//   sender: any;
//   recipient: any;
//   subject: any;
//   body: any;
//   is_reply: any;
//   send_datetime: any;
//   open_datetime: any;
//   click_datetime: any;
//   response_datetime: any;
//   status: any;
//   sentiment: any;
//   category: any;
//   action_draft: any;
//   message_id: any;
// }

// interface NotificationProps {
//   email: EmailMessage;
// }

// const Notification: React.FC<NotificationProps> = ({ email }) => {
//   const [title, setTitle] = React.useState("");
//   const [body, setBody] = React.useState("");
//   const [editable, setEditable] = React.useState(false);
//   const [isLoadingButton, SetIsLoadingButton] = React.useState(false);
//   const [loadingSmartSchedule, setLoadingSmartSchedule] = React.useState(false);
//   const [questions, setQuestions] = React.useState([]);
//   const [loadingQuestion, setLoadingQuestions] = React.useState(false);
//   const [errorQuestion, setErrorQuestions] = React.useState(false);
//   const [answers, setAnswers] = React.useState<string[]>([]);
//   const [answerLoading, setAnswerLoading] = React.useState(false);
//   // const { setIsContextBarOpen, thread } = useMailbox();
//   const { leads } = useLeads();
//   const { user } = useUserContext();

//   const {
//     conversationId,
//     thread,
//     setThread,
//     recipientEmail,
//     senderEmail,
//     setIsContextBarOpen,
//     setConversationId,
//   } = useMailbox();

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();

//     const timeOptions: Intl.DateTimeFormatOptions = {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     };

//     const dateOptions: Intl.DateTimeFormatOptions = {
//       day: "2-digit",
//       month: "short",
//     };

//     if (date.getFullYear() !== now.getFullYear()) {
//       dateOptions.year = "numeric";
//     }

//     const time = new Intl.DateTimeFormat("en-US", timeOptions).format(date);
//     const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(
//       date
//     );

//     return `${time}, ${formattedDate}`;
//   };

//   const messageId =
//     email.category === "Information Required" && email.message_id;

//   React.useEffect(() => {
//     if (email.is_reply && email?.category === "Information Required") {
//       setLoadingQuestions(true);
//       axiosInstance
//         .get(`v2/questions/${messageId}`)
//         .then((response) => {
//           // console.log("prev Questions", response.data);
//           setQuestions(response.data.questions.questions);
//           // console.log("Questions", response.data);
//           setLoadingQuestions(false);
//         })
//         .catch((error) => {
//           console.error("Failed to fetch questions", error);
//           setErrorQuestions(true);
//           setLoadingQuestions(false);
//         });
//     }
//   }, [email.category, email.is_reply, messageId]);

//   const handleInputChange = (index: number, value: string) => {
//     const newAnswers = [...answers];
//     newAnswers[index] = value;
//     setAnswers(newAnswers);
//   };

//   const handleGenerateResponse = () => {
//     setAnswerLoading(true);
//     axiosInstance
//       .post("/v2/answers", {
//         user_id: user.id,
//         questions,
//         answers,
//       })
//       .then((response) => {
//         console.log("Response submitted successfully", response);
//         return axiosInstance.post("/v2/send-info", {
//           messageId,
//           to: email.category === "Information Required" && email.recipient,
//           from: email.category === "Information Required" && email.sender,
//           subject: email.category === "Information Required" && email.subject,
//           content: email.category === "Information Required" && email.body,
//         });
//       })
//       .then((response) => {
//         toast.success("Response submitted successfully");
//         console.log("Info sent successfully", response);
//       })
//       .catch((error) => {
//         console.error("Failed to submit response or send info", error);
//       })
//       .finally(() => {
//         setAnswerLoading(false);
//       });
//   };

//   const parseActionDraft = (actionDraft: any) => {
//     if (!actionDraft)
//       return { subject: "No subject", body: "No details provided" };

//     const subjectMarker = "Subject: ";
//     const splitIndex = actionDraft.indexOf("\n\n");

//     let subject = "No subject";
//     let body = "No details provided";

//     if (splitIndex !== -1) {
//       subject = actionDraft.substring(subjectMarker.length, splitIndex);
//       body = actionDraft.substring(splitIndex + 2);
//     } else {
//       body = actionDraft.substring(subjectMarker.length);
//     }

//     return { subject, body };
//   };

//   const cleanedCategory = email?.category?.trim(); // Trim the category string

//   const handleSendNow = () => {
//     SetIsLoadingButton(true);
//     const payload = {
//       conversation_id: conversationId,
//       sender: senderEmail,
//       recipient: recipientEmail,
//       subject: parseActionDraft(email.action_draft).subject,
//       body: parseActionDraft(email.action_draft).body,
//     };

//     axiosInstance
//       .post("/v2/mailbox/send/immediately", payload)
//       .then((response) => {
//         toast.success("Your email has been sent successfully!");
//         // console.log("Send Data", response.data);
//         setThread(response.data);
//         // updateMailStatus(conversationId, "sent"); // Update mail status
//         SetIsLoadingButton(false);
//         setEditable(false);
//       })
//       .catch((error) => {
//         console.error("Failed to send email:", error);
//         toast.error("Failed to send the email. Please try again.");
//       });
//   };

//   const handleApproveEmail = () => {
//     setLoadingSmartSchedule(true);
//     const payload = {
//       conversation_id: conversationId,
//       sender: senderEmail,
//       recipient: recipientEmail,
//       subject: parseActionDraft(email.action_draft).subject,
//       body: parseActionDraft(email.action_draft).body,
//     };

//     axiosInstance
//       .post("/v2/mailbox/draft/send", payload)
//       .then((response) => {
//         toast.success("Draft Approved!");
//         setThread(response.data);
//         // console.log("Approve Data", response.data);
//         // updateMailStatus(conversationId, "scheduled"); // Update mail status
//         setLoadingSmartSchedule(false);
//         setEditable(false);
//       })
//       .catch((error) => {
//         console.error("Failed to send email:", error);
//         toast.error("Failed to send the email. Please try again.");
//       });
//   };

//   const handleRegenrateDraft = () => {
//     const payload = {
//       user_id: user.id,
//       conversation_id: conversationId,
//       campaign_id: leads[0].campaign_id,
//     };

//     console.log("Payload for regeenerate", payload);

//     axiosInstance
//       .post(`/v2/mailbox/draft/regenerate`, payload)
//       .then((response) => {
//         toast.success("Your draft has been regenerated successfully!");
//         setTitle(response.data.subject);
//         setBody(response.data.body);
//         console.log(response.data);
//         setEditable(false);
//       })
//       .catch((error) => {
//         console.error("Failed to regenerate draft:", error);
//         toast.error("Failed to regenerate the draft. Please try again.");
//       });
//   };

//   // regenerate the draft email

//   const handleDeleteDraft = () => {
//     axiosInstance
//       .delete(`/v2/mailbox/draft/${conversationId}`)
//       .then((response) => {
//         toast.success("Your draft has been deleted successfully!");
//         console.log(response.data);
//         setEditable(false);
//       })
//       .catch((error) => {
//         console.error("Failed to delete draft:", error);
//         toast.error("Failed to delete the draft. Please try again.");
//       });
//   };

//   return (
//     <div className="flex flex-col gap-3 w-full">
//       {email.is_reply && email.category !== "Information Required" && (
//         <div className="flex flex-col gap-3">
//           <div className="flex items-center gap-3">
//             <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//               {cleanedCategory === "OOO" && (
//                 <UserX className="h-4 w-4 text-gray-400" />
//               )}
//               {cleanedCategory === "Positive" && (
//                 <ThumbsUp className="h-4 w-4 text-gray-400" />
//               )}
//               {cleanedCategory === "Negative" && (
//                 <MailWarning className="h-4 w-4 text-gray-400" />
//               )}
//               {cleanedCategory === "Forwarded" && (
//                 <Forward className="h-4 w-4 text-gray-400" />
//               )}
//               {cleanedCategory === "Later" && (
//                 <MailQuestion className="h-4 w-4 text-gray-400" />
//               )}
//               {cleanedCategory === "Demo" && (
//                 <CalendarPlus className="h-4 w-4 text-gray-400" />
//               )}
//               {cleanedCategory === "Neutral" && (
//                 <Mail className="h-4 w-4 text-gray-400" />
//               )}
//             </div>
//             <p className="ml-1 text-xs">
//               {cleanedCategory === "OOO" && "Currently out of office."}
//               {cleanedCategory === "Positive" && "Positive response received."}
//               {cleanedCategory === "Negative" && "Negative feedback received."}
//               {cleanedCategory === "Forwarded" &&
//                 "This message has been forwarded."}
//               {cleanedCategory === "Later" &&
//                 `Follow up with ${
//                   leads.length > 0 && leads[0].first_name
//                     ? leads[0].first_name
//                     : ""
//                 } in a few day as requested.`}
//               {cleanedCategory === "Demo" &&
//                 "Demo scheduling requested by client."}
//               {cleanedCategory === "Neutral" && "Neutral response received."}
//             </p>
//             <span className="text-gray-600 text-sm">
//               {formatDate(email.received_datetime)}
//             </span>
//             <p className="ml-1 text-xs">
//               {cleanedCategory === "OOO" && (
//                 <Badge className="gap-1 items-center rounded-full bg-yellow-600">
//                   <UserX className="h-[14px] w-[14px] scale-x-100" />
//                   Out of office
//                 </Badge>
//               )}
//               {cleanedCategory === "Positive" && (
//                 <Badge className="gap-1 items-center rounded-full bg-green-600">
//                   <ThumbsUp className="h-[14px] w-[14px] scale-x-100" />
//                   Positive
//                 </Badge>
//               )}
//               {cleanedCategory === "Negative" && (
//                 <Badge
//                   variant="destructive"
//                   className="gap-1 items-center rounded-full"
//                 >
//                   <ThumbsDown className="-scale-x-100 h-[14px] w-[14px]" />
//                   Negative
//                 </Badge>
//               )}
//               {cleanedCategory === "Forwarded" && (
//                 <Badge className="gap-1 items-center rounded-full bg-yellow-600">
//                   <Forward className="h-[14px] w-[14px]" />
//                   Forwarded
//                 </Badge>
//               )}
//               {cleanedCategory === "Later" && (
//                 <Badge className="gap-1 items-center rounded-full bg-yellow-600">
//                   <TimerReset className="h-[14px] w-[14px]" />
//                   Delayed
//                 </Badge>
//               )}
//               {cleanedCategory === "Demo" && (
//                 <Badge className="gap-1 items-center rounded-full bg-yellow-600">
//                   <CalendarCheck className="h-[14px] w-[14px]" />
//                   Demo
//                 </Badge>
//               )}
//               {cleanedCategory === "Neutral" && (
//                 <Badge className="gap-1 items-center rounded-full bg-blue-600">
//                   <Bell className="h-[14px] w-[14px]" />
//                   Neutral
//                 </Badge>
//               )}
//             </p>
//           </div>

//           {email?.action_draft && (
//             <div className="flex w-full">
//               <Avatar className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-4">
//                 <AvatarFallback className="bg-yellow-400 text-black text-xs">
//                   {user?.firstName && user.lastName
//                     ? user.firstName.charAt(0) + user.lastName.charAt(0)
//                     : ""}
//                 </AvatarFallback>
//               </Avatar>
//               <Card className={`w-full mr-7`}>
//                 <div className="flex gap-4 p-4">
//                   <span className="text-sm font-semibold">
//                     {leads.length > 0 && leads[0].first_name
//                       ? "You to " + leads[0].first_name
//                       : ""}
//                   </span>
//                   <span className="text-gray-600 text-sm ">
//                     {formatDate(email.received_datetime)}
//                   </span>
//                 </div>
//                 <CardHeader className="-mt-8 -ml-3">
//                   <CardTitle className="text-sm flex flex-col ">
//                     <Input
//                       className="text-xs"
//                       disabled={!editable}
//                       placeholder="Subject"
//                       value={
//                         email.action_draft &&
//                         parseActionDraft(email.action_draft).subject
//                       }
//                       onChange={(e) => setBody(e.target.value)}
//                     />
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-xs -ml-3 -mt-4">
//                   <Textarea
//                     className="text-xs h-40"
//                     disabled={!editable}
//                     placeholder="Enter email body"
//                     value={
//                       email.action_draft &&
//                       parseActionDraft(email.action_draft).body
//                     }
//                     onChange={(e) => setBody(e.target.value)}
//                   />
//                 </CardContent>
//                 <CardFooter className="flex justify-between text-xs items-center">
//                   <div className="flex flex-row gap-2">
//                     <Button onClick={handleApproveEmail}>Smart Schedule</Button>
//                     <Button
//                       variant={"secondary"}
//                       className=""
//                       onClick={handleSendNow}
//                     >
//                       {isLoadingButton ? <LoadingCircle /> : "Send Now"}
//                     </Button>
//                   </div>
//                   <div>
//                     <Button variant={"ghost"} onClick={() => setEditable(true)}>
//                       <Edit3 className="h-4 w-4" />
//                     </Button>
//                     <Button variant={"ghost"} onClick={handleRegenrateDraft}>
//                       <RefreshCw className="h-4 w-4" />
//                     </Button>
//                     <Button variant={"ghost"} onClick={handleDeleteDraft}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </CardFooter>
//               </Card>
//             </div>
//           )}

//           {cleanedCategory === "Negative" && (
//             <div className="flex items-center gap-3">
//               <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//                 {cleanedCategory === "Negative" && (
//                   <MailWarning className="h-4 w-4 text-gray-400" />
//                 )}
//               </div>
//               <p className="ml-1 text-xs">
//                 {cleanedCategory === "Negative" &&
//                   ` ${
//                     leads.length > 0 && leads[0].first_name
//                       ? leads[0].first_name
//                       : ""
//                   } was blocked because of a negative reply.`}
//               </p>
//               <span className="text-gray-600 text-sm">
//                 {formatDate(email.received_datetime)}
//               </span>
//             </div>
//           )}
//           {cleanedCategory === "Demo" && (
//             <div className="flex items-center gap-3">
//               <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//                 {cleanedCategory === "Demo" && (
//                   <CalendarCheck className="h-4 w-4 text-gray-400" />
//                 )}
//               </div>
//               <p className="ml-1 text-xs">
//                 {cleanedCategory === "Demo" &&
//                   ` Sally is scheduling meeting with ${
//                     leads.length > 0 && leads[0].first_name
//                       ? leads[0].first_name
//                       : ""
//                   } .`}
//               </p>
//               <span className="text-gray-600 text-sm">
//                 {formatDate(email.received_datetime)}
//               </span>
//             </div>
//           )}
//         </div>
//       )}

//       {email.is_reply && email?.category === "Information Required" && (
//         <div>
//           <div className="flex items-center gap-3">
//             <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//               <ListTodo className="h-4 w-4 text-gray-400" />
//             </div>
//             <p className=" ml-1 text-xs ">
//               <span className="text-gray-500">Todo: </span> Respond to ask
//               question
//             </p>
//           </div>

//           <div className="flex gap-2 flex-col h-full">
//             {loadingQuestion ? (
//               <div className="flex w-full mr-4">
//                 <Card className="w-full mr-5 ml-12 p-4 flex flex-row justify-between items-center">
//                   <span className="text-xs w-2/3">Loading...</span>
//                 </Card>
//               </div>
//             ) : errorQuestion ? (
//               <div className="flex w-full mr-4">
//                 <Card className="w-full mr-5 ml-12 p-4 flex flex-row justify-between items-center">
//                   <span className="text-xs w-2/3">
//                     Failed to load questions
//                   </span>
//                 </Card>
//               </div>
//             ) : (
//               questions.map((question: any, index: any) => (
//                 <div key={index} className="flex w-full mr-4">
//                   <Card className="w-full mr-5 ml-12 p-4 flex flex-row justify-between items-center">
//                     <span className="text-xs w-2/3">{question}</span>
//                     <Input
//                       className="w-1/3"
//                       placeholder="Answer"
//                       value={answers[index]}
//                       onChange={(e) => handleInputChange(index, e.target.value)}
//                     />
//                   </Card>
//                 </div>
//               ))
//             )}

//             <Button
//               className="ml-12 w-48 flex gap-2 items-center"
//               variant="secondary"
//               onClick={handleGenerateResponse}
//             >
//               <span>
//                 {answerLoading ? <LoadingCircle /> : "Generate response"}
//               </span>
//             </Button>
//           </div>
//         </div>
//       )}

//       {!email.is_reply && email?.status?.toLowerCase() === "sent" && (
//         <div className="flex items-center gap-3">
//           <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//             <SendHorizontal className="h-4 w-4 text-gray-400" />
//           </div>
//           <p className=" ml-1 text-xs ">Message processed by server</p>
//           <span className="text-gray-400 text-xs">
//             {email.send_datetime && (
//               <span className="text-gray-400 text-xs">
//                 {formatDate(email.send_datetime)}
//               </span>
//             )}
//           </span>
//         </div>
//       )}
//       {!email.is_reply && email?.status?.toLowerCase() === "scheduled" && (
//         <div className="flex items-center gap-3">
//           <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//             <Bell className="h-4 w-4 text-gray-400" />
//           </div>
//           <p className=" ml-1 text-xs ">Your draft has been scheduled.</p>
//           <span className="text-gray-400 text-xs">
//             {email.send_datetime && (
//               <span className="text-gray-400 text-xs">
//                 {formatDate(email.send_datetime)}
//               </span>
//             )}
//           </span>
//         </div>
//       )}
//       {!email.is_reply && email?.status?.toLowerCase() === "click" && (
//         <div className="flex items-center gap-3">
//           <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//             <Clock3 className="h-4 w-4 text-gray-400" />
//           </div>
//           <p className=" ml-1 text-xs ">Recipient opened the email.</p>
//           <span className="text-gray-400 text-xs">
//             {email.click_datetime && (
//               <span className="text-gray-400 text-xs">
//                 {formatDate(email.click_datetime)}
//               </span>
//             )}
//           </span>
//         </div>
//       )}

//       {!email.is_reply && email?.status?.toLowerCase() === "delivered" && (
//         <div className="flex items-center gap-3">
//           <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//             <Mail className="h-4 w-4 text-gray-400" />
//           </div>
//           <p className=" ml-1 text-xs ">
//             Mail was delivered to recipient&apos;s inbox
//           </p>
//           <span className="text-gray-400 text-xs">
//             {email.received_datetime && (
//               <span className="text-gray-400 text-xs">
//                 {formatDate(email.received_datetime)}
//               </span>
//             )}
//           </span>
//         </div>
//       )}

//       {!email.is_reply && email?.status?.toLowerCase() === "bounce" && (
//         <div className="flex items-center gap-3">
//           <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//             <Archive className="h-4 w-4 text-gray-400" />
//           </div>
//           <p className=" ml-1 text-xs ">
//             Mail could not be delivered and was returned to sender.
//           </p>
//           {/* <span className="text-gray-400 text-xs">
//             {email.send_datetime && (
//               <span className="text-gray-400 text-xs">
//                 {formatDate(email.send_datetime)}
//               </span>
//             )}
//           </span> */}
//         </div>
//       )}

//       {!email.is_reply && email?.status?.toLowerCase() === "complain" && (
//         <div className="flex items-center gap-3">
//           <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//             <Clock3 className="h-4 w-4 text-gray-400" />
//           </div>
//           <p className=" ml-1 text-xs ">Recipient marked the email as spam.</p>
//           {/* <span className="text-gray-400 text-xs">
//             {email.send_datetime && (
//               <span className="text-gray-400 text-xs">
//                 {formatDate(email.send_datetime)}
//               </span>
//             )}
//           </span> */}
//         </div>
//       )}

//       {!email.is_reply && email?.status?.toLowerCase() === "TO-APPROVE" && (
//         <div className="flex items-center gap-3">
//           <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
//             <Clock3 className="h-4 w-4 text-gray-400" />
//           </div>
//           <p className=" ml-1 text-xs ">Recipient opened the email.</p>
//           <span className="text-gray-400 text-xs">
//             {email.click_datetime && (
//               <span className="text-gray-400 text-xs">
//                 {formatDate(email.click_datetime)}
//               </span>
//             )}
//           </span>
//         </div>
//       )}

//       {/* {email.sentiment === "Negative" && (
//         <div className="flex items-center gap-3">
//           <ThumbsDown className="h-4 w-4 text-red-500" />
//           <p className="text-xs">Negative feedback received.</p>
//           {email.response_datetime && (
//             <span className="text-gray-400 text-xs">
//               {formatDate(email.response_datetime)}
//             </span>
//           )}
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default Notification;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import {
  Archive,
  Bell,
  CalendarCheck,
  CalendarPlus,
  Check,
  Clock3,
  Edit3,
  Forward,
  ListTodo,
  Mail,
  MailPlus,
  MailQuestion,
  MailWarning,
  RefreshCw,
  SendHorizontal,
  ThumbsDown,
  ThumbsUp,
  TimerReset,
  Trash2,
  UserX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useLeads } from "@/context/lead-user";
import { useUserContext } from "@/context/user-context";
import { Button } from "../ui/button";
import { useMailbox } from "@/context/mailbox-provider";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { LoadingCircle } from "@/app/icons";

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
  approved: any;
}

interface NotificationProps {
  email: EmailMessage;
}

const Notification: React.FC<NotificationProps> = ({ email }) => {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [editable, setEditable] = React.useState(false);
  const [isLoadingButton, SetIsLoadingButton] = React.useState(false);
  const [loadingSmartSchedule, setLoadingSmartSchedule] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [loadingQuestion, setLoadingQuestions] = React.useState(false);
  const [errorQuestion, setErrorQuestions] = React.useState(false);
  const [answers, setAnswers] = React.useState<string[]>([]);
  const [answerLoading, setAnswerLoading] = React.useState(false);
  const { leads } = useLeads();
  const { user } = useUserContext();

  const {
    conversationId,
    thread,
    setThread,
    recipientEmail,
    senderEmail,
    setIsContextBarOpen,
    setConversationId,
  } = useMailbox();

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

    if (date.getFullYear() !== now.getFullYear()) {
      dateOptions.year = "numeric";
    }

    const time = new Intl.DateTimeFormat("en-US", timeOptions).format(date);
    const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(
      date
    );

    return `${time}, ${formattedDate}`;
  };

  const messageId =
    email.category === "Information Required" && email.message_id;

  React.useEffect(() => {
    if (email.is_reply && email?.category === "Information Required") {
      setLoadingQuestions(true);
      axiosInstance
        .get(`v2/questions/${messageId}`)
        .then((response) => {
          setQuestions(response.data.questions.questions);
          setLoadingQuestions(false);
        })
        .catch((error) => {
          console.error("Failed to fetch questions", error);
          setErrorQuestions(true);
          setLoadingQuestions(false);
        });
    }
  }, [email.category, email.is_reply, messageId]);

  React.useEffect(() => {
    if (email.action_draft) {
      const { subject, body } = parseActionDraft(email.action_draft);
      setTitle(subject);
      setBody(body);
    }
  }, [email.action_draft]);

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleGenerateResponse = () => {
    setAnswerLoading(true);
    axiosInstance
      .post("/v2/answers", {
        user_id: user.id,
        questions,
        answers,
      })
      .then((response) => {
        console.log("Response submitted successfully", response);
        return axiosInstance.post("/v2/send-info", {
          messageId,
          to: email.category === "Information Required" && email.recipient,
          from: email.category === "Information Required" && email.sender,
          subject: email.category === "Information Required" && email.subject,
          content: email.category === "Information Required" && email.body,
        });
      })
      .then((response) => {
        toast.success("Response submitted successfully");
        console.log("Info sent successfully", response);
      })
      .catch((error) => {
        console.error("Failed to submit response or send info", error);
      })
      .finally(() => {
        setAnswerLoading(false);
      });
  };

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

  const cleanedCategory = email?.category?.trim();

  const handleSendNow = () => {
    SetIsLoadingButton(true);
    const payload = {
      conversation_id: conversationId,
      sender: senderEmail,
      recipient: recipientEmail,
      subject: title,
      body: body,
    };

    console.log("Payload of sending", payload);

    axiosInstance
      .post("/v2/mailbox/send/immediately", payload)
      .then((response) => {
        toast.success("Your email has been sent successfully!");
        setThread(response.data);
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
      subject: parseActionDraft(email.action_draft).subject,
      body: parseActionDraft(email.action_draft).body,
    };

    axiosInstance
      .post("/v2/mailbox/draft/send", payload)
      .then((response) => {
        toast.success("Draft Approved!");
        setThread(response.data);
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

    axiosInstance
      .post(`/v2/mailbox/draft/regenerate`, payload)
      .then((response) => {
        toast.success("Your draft has been regenerated successfully!");
        setTitle(response.data.subject);
        setBody(response.data.body);
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
        setEditable(false);
      })
      .catch((error) => {
        console.error("Failed to delete draft:", error);
        toast.error("Failed to delete the draft. Please try again.");
      });
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {email.is_reply && email.category !== "Information Required" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
              {cleanedCategory === "OOO" && (
                <UserX className="h-4 w-4 text-gray-400" />
              )}
              {cleanedCategory === "Positive" && (
                <ThumbsUp className="h-4 w-4 text-gray-400" />
              )}
              {cleanedCategory === "Negative" && (
                <MailWarning className="h-4 w-4 text-gray-400" />
              )}
              {cleanedCategory === "Forwarded" && (
                <Forward className="h-4 w-4 text-gray-400" />
              )}
              {cleanedCategory === "Later" && (
                <MailQuestion className="h-4 w-4 text-gray-400" />
              )}
              {cleanedCategory === "Demo" && (
                <CalendarPlus className="h-4 w-4 text-gray-400" />
              )}
              {cleanedCategory === "Neutral" && (
                <Mail className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <p className="ml-1 text-xs">
              {cleanedCategory === "OOO" && "Currently out of office."}
              {cleanedCategory === "Positive" && "Positive response received."}
              {cleanedCategory === "Negative" && "Negative feedback received."}
              {cleanedCategory === "Forwarded" &&
                "This message has been forwarded."}
              {cleanedCategory === "Later" &&
                `Follow up with ${
                  leads.length > 0 && leads[0].first_name
                    ? leads[0].first_name
                    : ""
                } in a few day as requested.`}
              {cleanedCategory === "Demo" &&
                "Demo scheduling requested by client."}
              {cleanedCategory === "Neutral" && "Neutral response received."}
            </p>
            <span className="text-gray-600 text-sm">
              {formatDate(email.received_datetime)}
            </span>
          </div>

          {email?.action_draft && (
            <div className="flex w-full">
              <Avatar className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-4">
                <AvatarFallback className="bg-yellow-400 text-black text-xs">
                  {user?.firstName && user.lastName
                    ? user.firstName.charAt(0) + user.lastName.charAt(0)
                    : ""}
                </AvatarFallback>
              </Avatar>
              <Card className={`w-full mr-7`}>
                <div className="flex gap-4 p-4">
                  <span className="text-sm font-semibold">
                    {leads.length > 0 && leads[0].first_name
                      ? "You to " + leads[0].first_name
                      : ""}
                  </span>
                  <span className="text-gray-600 text-sm ">
                    {formatDate(email.received_datetime)}
                  </span>
                  <div className="flex gap-3">
                    {!email.approved ? (
                      <span className="text-green-500 text-sm ">Draft</span>
                    ) : null}
                  </div>

                  <p className="ml-1 text-xs">
                    {cleanedCategory === "OOO" && (
                      <Badge className="gap-1 items-center rounded-full bg-yellow-600">
                        <UserX className="h-[14px] w-[14px] scale-x-100" />
                        Out of office
                      </Badge>
                    )}
                    {cleanedCategory === "Positive" && (
                      <Badge className="gap-1 items-center rounded-full bg-green-600">
                        <ThumbsUp className="h-[14px] w-[14px] scale-x-100" />
                        Positive
                      </Badge>
                    )}
                    {cleanedCategory === "Negative" && (
                      <Badge
                        variant="destructive"
                        className="gap-1 items-center rounded-full"
                      >
                        <ThumbsDown className="-scale-x-100 h-[14px] w-[14px]" />
                        Negative
                      </Badge>
                    )}
                    {cleanedCategory === "Forwarded" && (
                      <Badge className="gap-1 items-center rounded-full bg-blue-600">
                        <Forward className="h-[14px] w-[14px]" />
                        Forwarded
                      </Badge>
                    )}
                    {cleanedCategory === "Later" && (
                      <Badge className="gap-1 items-center rounded-full bg-orange-600">
                        <TimerReset className="h-[14px] w-[14px]" />
                        Maybe Later
                      </Badge>
                    )}
                    {cleanedCategory === "Demo" && (
                      <Badge className="gap-1 items-center rounded-full bg-purple-600">
                        <CalendarCheck className="h-[14px] w-[14px]" />
                        Demo
                      </Badge>
                    )}
                    {cleanedCategory === "Neutral" && (
                      <Badge className="gap-1 items-center rounded-full bg-gray-600">
                        <Bell className="h-[14px] w-[14px]" />
                        Neutral
                      </Badge>
                    )}
                  </p>
                </div>
                <CardHeader className="-mt-8 -ml-3">
                  <CardTitle className="text-sm flex flex-col ">
                    <Input
                      className="text-xs"
                      disabled={!editable}
                      placeholder="Subject"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs -ml-3 -mt-4">
                  <Textarea
                    className="text-xs h-40"
                    disabled={!editable}
                    placeholder="Enter email body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </CardContent>

                {!email?.approved && (
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
                      <Button variant={"ghost"} onClick={handleRegenrateDraft}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant={"ghost"} onClick={handleDeleteDraft}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </div>
          )}

          {cleanedCategory === "Negative" && (
            <div className="flex items-center gap-3">
              <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
                {cleanedCategory === "Negative" && (
                  <MailWarning className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <p className="ml-1 text-xs">
                {cleanedCategory === "Negative" &&
                  ` ${
                    leads.length > 0 && leads[0].first_name
                      ? leads[0].first_name
                      : ""
                  } was blocked because of a negative reply.`}
              </p>
              <span className="text-gray-600 text-sm">
                {formatDate(email.received_datetime)}
              </span>
            </div>
          )}
          {cleanedCategory === "Demo" && (
            <div className="flex items-center gap-3">
              <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
                {cleanedCategory === "Demo" && (
                  <CalendarCheck className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <p className="ml-1 text-xs">
                {cleanedCategory === "Demo" &&
                  ` Sally is scheduling meeting with ${
                    leads.length > 0 && leads[0].first_name
                      ? leads[0].first_name
                      : ""
                  } .`}
              </p>
              <span className="text-gray-600 text-sm">
                {formatDate(email.received_datetime)}
              </span>
            </div>
          )}
        </div>
      )}

      {email.is_reply && email?.category === "Information Required" && (
        <div>
          <div className="flex gap-2 flex-col h-full"></div>

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
            {loadingQuestion ? (
              <div className="flex w-full mr-4">
                <Card className="w-full mr-5 ml-12 p-4 flex flex-row justify-between items-center">
                  <span className="text-xs w-2/3">Loading...</span>
                </Card>
              </div>
            ) : errorQuestion ? (
              <div className="flex w-full mr-4">
                <Card className="w-full mr-5 ml-12 p-4 flex flex-row justify-between items-center">
                  <span className="text-xs w-2/3">
                    Failed to load questions
                  </span>
                </Card>
              </div>
            ) : (
              questions.map((question: any, index: any) => (
                <div key={index} className="flex w-full mr-4">
                  <Card className="w-full mr-5 ml-12 p-4 flex flex-row justify-between items-center">
                    <span className="text-xs w-2/3">{question}</span>
                    <Input
                      className="w-1/3"
                      placeholder="Answer"
                      value={answers[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  </Card>
                </div>
              ))
            )}

            <Button
              className="ml-12 w-48 flex gap-2 items-center"
              variant="secondary"
              onClick={handleGenerateResponse}
            >
              <span>
                {answerLoading ? <LoadingCircle /> : "Generate response"}
              </span>
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
        </div>
      )}

      {!email.is_reply && email?.status?.toLowerCase() === "complain" && (
        <div className="flex items-center gap-3">
          <div className="h-[30px] w-[30px] bg-gray-800 rounded-full items-center justify-center flex text-center">
            <Clock3 className="h-4 w-4 text-gray-400" />
          </div>
          <p className=" ml-1 text-xs ">Recipient marked the email as spam.</p>
        </div>
      )}

      {!email.is_reply && email?.status?.toLowerCase() === "TO-APPROVE" && (
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
    </div>
  );
};

export default Notification;
