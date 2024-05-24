/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import va from "@vercel/analytics";
import clsx from "clsx";
import { LoadingCircle, SendIcon } from "../../../icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
// import Textarea from "react-textarea-autosize";
// import { Textarea } from "@/components/ui/textarea";

// import EmailForm from "@/components/forms/emailForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { Message } from "ai/react";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "@/context/user-context";

// import { useSession } from "next-auth/react";

// const examples = [
//   `How much revenue did we close this month?`,
//   `Send an email wishing happy new year to me`,
//   `Schedule my meeting with info@agentprod.com tomorrow`,
// ];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: any;
}

export default function Home() {
  // const { data: session } = useSession();

  // console.log("Session: ", session);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserContext();
  // console.log("User: ", user);

  const [userEmail] = useState(user?.email);
  // const [userEmail, setUserEmail] = useState(user?.email);
  // const [userId, setUserId] = useState(user?.id);
  const [userId] = useState(user?.id);
  const [loading, setLoading] = useState(true);

  const [allMessages, setAllMessages] = useState<Message[]>([
    {
      id: Math.random().toString(),
      role: "assistant",
      content: `Hello! I'm Sally, your Sales Rep. I accelerate outbound sales with access to 250 million contacts and manage bespoke email campaigns to thousands. I also reply to queries and schedule meetings. Can I help you start your sales outreach?`,
    },
  ]);

  // console.log("Id: ", userId);

  // console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
  // const fetchUserIdFromEmail = async (email_id: string) => {
  //   const supabase = createClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  //   );

  //   let { data: allUsers } = await supabase
  //     .from("Users")
  //     .select("id")
  //     .eq("email", email_id);
  //   // console.log(allUsers);

  //   if (!allUsers?.length) {
  //     let { data: createdUser, error } = await supabase
  //       .from("Users")
  //       .insert([
  //         {
  //           email: email_id,
  //           user_info: {
  //             email: email_id,
  //             timezone: null,
  //             real_name: null,
  //             profession: null,
  //             display_name: null,
  //             profile_image: null,
  //           },
  //           source: "web",
  //         },
  //       ])
  //       .select("id");

  //     if (error) {
  //       console.error(error);
  //     } else if (createdUser && createdUser[0].id) {
  //       setUserId(createdUser[0].id);
  //       let { data: tokenUsers, error: tokenTableError } = await supabase
  //         .from("UserTokens")
  //         .insert([{ user_id: createdUser[0].id }]);

  //       if (tokenTableError) {
  //         console.error(tokenTableError);
  //       }
  //     }
  //   }

  //   if (allUsers && allUsers[0].id) setUserId(allUsers[0].id);
  // };

  function formatDate(created_at: any) {
    // Ensure createdAt is a valid date
    if (!created_at) return "No date provided";

    const date = new Date(created_at);
    if (isNaN(date.getTime())) return "Invalid date"; // Check if the date is valid

    const IST_OFFSET = 330; // Indian Standard Time offset in minutes
    const now = new Date();
    const past = new Date(date.valueOf() + IST_OFFSET * 60000); // Apply IST offset

    // Check if the date is today
    if (now.toDateString() === past.toDateString()) {
      return past.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    // Check if the date is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toDateString() === past.toDateString()) {
      return "Yesterday";
    }

    // Default to a simple date format
    return past.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  useEffect(() => {
    const fetchMessages = () => {
      axiosInstance
        .get(`v2/conversation/${userId}`)
        .then((response) => {
          const adaptedMessages = response.data.map((msg: any) => ({
            ...msg,
            createdAt: msg.created_at, // Adapt backend data to fit the interface
          }));
          setMessages(adaptedMessages);
          // console.log("Shally responde", response);
          // if (response.data.length > 0) {
          //   // const messagesWithISTTime = response.data.map((message: any) => ({
          //   //   ...message,
          //   //   time: formatDate(message.created_at), // Use the conversion function here
          //   // }));
          //   console.log("Shally responde", response.data.created_at);
          //   setAllMessages([...response.data]);
          //   // setAllMessages([...messagesWithISTTime]);
          // }
        })
        .catch((error) => {
          // console.log(error);
        });
    };

    fetchMessages();
  });

  useEffect(() => {
    if (userId) {
      setLoading(false);
    }
  }, [userId]);

  // useEffect(() => {
  //   try {
  //     fetchUserIdFromEmail(userEmail);
  //     setMessages([
  //       {
  //         id: Math.random().toString(),
  //         type: "assistant",
  //         content: JSON.stringify({
  //           content: `👋 Hey, I'm Agentprod, your AI work assistant! First, allow me to showcase Agentprod's capabilities, designed to supercharge your workflow.`,
  //           buttons: [
  //             {
  //               buttonTitle: "Check out our website",
  //               url: "https://agentprod.com",
  //             },
  //           ],
  //         }),
  //       },
  //       {
  //         id: Math.random().toString(),
  //         type: "assistant",
  //         content: JSON.stringify({
  //           content: `Let's connect to apps! Once you are authenticated you will be prompted to try some tasks`,
  //           buttons: [
  //             {
  //               buttonTitle: "Google Login",
  //               url: `hello.com/test`,
  //             },
  //           ],
  //         }),
  //       },
  //       // {
  //       //   id: Math.random().toString(),
  //       //   type: "user",
  //       //   content: "How much revenue did we close this month?",
  //       // },
  //     ]);
  //     setAllMessages(messagesFromBackend.data);
  //   } catch (err) {
  //     console.log("Something went wrong!", err);
  //   }
  // }, []);

  useEffect(() => {
    try {
      if (allMessages) {
        setMessages(allMessages);
      }
    } catch (err) {
      // console.log("Something went wrong!", err);
    }
  }, [allMessages]);

  // TODO: add chat history for a user
  const { messages, input, setInput, handleSubmit, isLoading, setMessages } =
    useChat({
      api: `${process.env.NEXT_PUBLIC_SERVER_URL}v2/chat/completion`,
      body: {
        user_id: userId,
        content: inputRef.current?.value,
      },
      onResponse: async (response) => {
        if (response.status === 429) {
          toast.error("You have reached your request limit for the day.");
          va.track("Rate limited");
          return;
        } else {
          va.track("Chat initiated");
          const assistantResponse = await response.json();
          // console.log(assistantResponse);
          setAllMessages((prevMessages: Message[]) => [
            ...prevMessages,
            {
              id: Math.random().toString(),
              role: "assistant",
              content: assistantResponse,
            },
          ]);
        }
      },
      onError: (error) => {
        va.track("Chat errored", {
          input,
          error: error.message,
        });
      },
      onFinish(message) {
        // console.log(message);
      },
    });

  useEffect(() => {}, [inputRef.current?.value]);

  const disabled = isLoading || input.length === 0;

  return (
    <div>
      <main className="flex flex-col items-center justify-between pb-20">
        {messages.length > 0 ? (
          messages.map(
            (message, i) =>
              message && (
                <div
                  key={i}
                  className={clsx(
                    "flex w-full items-center justify-center py-4"
                    // message.type === "user" ? "bg-black" : "bg-black/5",
                  )}
                >
                  <div
                    className={clsx(
                      "flex w-full max-w-screen-lg items-start space-x-4 px-5 sm:px-0",
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div
                      className={clsx(
                        "p-1.5 text-white",
                        message.role === "assistant" ? "" : ""
                      )}
                    >
                      {message.role === "user" ? (
                        <Avatar className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white">
                          <AvatarImage src="/user.png" alt="user" />
                          {/* <AvatarFallback>NB</AvatarFallback> */}
                        </Avatar>
                      ) : (
                        <Avatar className="flex h-7 w-7 items-center justify-center space-y-0 border">
                          {/* <AvatarFallback>JL</AvatarFallback> */}
                          <AvatarImage
                            src="/ai-sales-rep.png"
                            alt="agentprod logo"
                          />
                          {/* <Image
                        // className="mx-auto"
                        width={100}
                        height={100}
                        src={"/bw-logo.png"}
                        alt="AgentProd"
                      /> */}
                        </Avatar>
                      )}
                    </div>
                    <div
                      className={clsx(
                        "flex flex-col !mr-3 space-y-1",
                        message.role === "assistant"
                          ? "items-start"
                          : "items-end"
                      )}
                    >
                      <span className="text-xs">
                        {message.role === "assistant"
                          ? "Sally"
                          : user?.firstName}{" "}
                        {formatDate(message?.createdAt)}
                      </span>
                      <div className="flex flex-col px-4 py-3 bg-accent rounded-xl max-w-3xl">
                        <ReactMarkdown
                          className="prose mt-1 text-sm w-full break-words prose-p:leading-relaxed"
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // open links in new tab
                            a: (props) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            ),
                          }}
                        >
                          {message.content &&
                            message.content.replace("Assistant: ", "")}
                        </ReactMarkdown>

                        {/* <div
                      className={clsx(
                        "button-container mt-4",
                        message.type === "assistant" ? "pb-4" : "pb-0"
                      )}
                    >
                      {message.type === "assistant" &&
                      JSON.parse(message.message).buttons
                        ? JSON.parse(message.message).buttons.map(
                            (button: any, index: number) => (
                              <a
                                key={index}
                                href={button.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md border border-gray-200 bg-white px-3 sm:px-5 py-2 sm:py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-black hover:text-gray-700 active:bg-gray-50 ml-1 sm:ml-2"
                              >
                                {button.buttonTitle}
                              </a>
                            )
                          )
                        : null}
                    </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              )
          )
        ) : (
          <LoadingCircle />
        )}
        <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 p-5 pb-3 sm:px-0">
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              setAllMessages([
                ...allMessages,
                {
                  id: Math.random().toString(),
                  role: "user",
                  content: input,
                },
              ]);
              // console.log(allMessages);
              handleSubmit(e);
            }}
            className="relative w-full max-w-screen-md rounded-xl border px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4 flex"
          >
            <Input
              ref={inputRef}
              tabIndex={0}
              required
              autoFocus
              placeholder="Send a message"
              value={input}
              disabled={userEmail === "" || loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  formRef.current?.requestSubmit();
                  e.preventDefault();
                }
              }}
              spellCheck={false}
              className="w-full px-5 focus:outline-none"
            />
            {/* <Textarea
              ref={inputRef}
              tabIndex={0}
              required
              rows={1}
              autoFocus
              placeholder="Send a message"
              value={input}
              disabled={userEmail === "" || loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  formRef.current?.requestSubmit();
                  e.preventDefault();
                }
              }}
              spellCheck={false}
              className="w-full pr-10 focus:outline-none"
            /> */}
            <Button
              type="submit"
              variant={"outline"}
              className="ml-3"
              disabled={disabled}
            >
              {loading || isLoading ? (
                <LoadingCircle />
              ) : (
                <SendIcon className={clsx("h-4 w-4")} />
              )}
            </Button>
            {/* <button
              className={clsx(
                "absolute inset-y-0 right-5 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
                disabled
                  ? "cursor-not-allowed bg-white"
                  : "bg-green-500 hover:bg-green-600"
              )}
              disabled={disabled}
            >
              {loading || isLoading ? (
                <LoadingCircle />
              ) : (
                <SendIcon
                  className={clsx(
                    "h-4 w-4",
                    input.length === 0 ? "text-gray-300" : "text-white"
                  )}
                />
              )}
            </button> */}
          </form>
          {/* <p className="text-center text-xs text-gray-400">
         This is a playground environment
        </p> */}
        </div>
        {/* <button
          onClick={() => {
            console.log("isLoading ", isLoading);
            console.log("Loading ", loading);
            console.log(userEmail);
          }}
        >
          LOG
        </button> */}
      </main>
    </div>
  );
}
