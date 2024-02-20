/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import va from "@vercel/analytics";
import clsx from "clsx";
import { LoadingCircle, SendIcon } from "../../../icons";
import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
// import Textarea from "react-textarea-autosize";
// import { Textarea } from "@/components/ui/textarea";

import EmailForm from "@/components/forms/emailForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/layout/context/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useSession } from "next-auth/react";

const examples = [
  `How much revenue did we close this month?`,
  `Send an email wishing happy new year to me`,
  `Schedule my meeting with info@agentprod.com tomorrow`,
];

export default function Home() {
  // const { data: session } = useSession();

  // console.log("Session: ", session);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  // console.log("User: ", user);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [userEmail, setUserEmail] = useState(user?.email);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  // console.log("Id: ", userId);

  // console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const fetchUserIdFromEmail = async (email_id: string) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    );

    let { data: allUsers, error } = await supabase
      .from("Users")
      .select("id")
      .eq("email", email_id);
    // console.log(allUsers);

    if (!allUsers?.length) {
      let { data: createdUser, error } = await supabase
        .from("Users")
        .insert([
          {
            email: email_id,
            user_info: {
              email: email_id,
              timezone: null,
              real_name: null,
              profession: null,
              display_name: null,
              profile_image: null,
            },
            source: "web",
          },
        ])
        .select("id");

      if (error) {
        console.error(error);
      } else if (createdUser && createdUser[0].id) {
        setMessages([
          {
            id: Math.random().toString(),
            role: "assistant",
            content: JSON.stringify({
              content: `👋 Hey, I'm Agentprod, your AI work assistant! First, allow me to showcase Agentprod's capabilities, designed to supercharge your workflow.`,
              buttons: [
                {
                  buttonTitle: "Check out our website",
                  url: "https://agentprod.com",
                },
              ],
            }),
          },
          {
            id: Math.random().toString(),
            role: "assistant",
            content: JSON.stringify({
              content: `Let's connect to apps! Once you are authenticated you will be prompted to try some tasks`,
              buttons: [
                {
                  buttonTitle: "Google Login",
                  url: `${BACKEND_URL}/googlelogin?userId=${createdUser[0].id}`,
                },
                {
                  buttonTitle: "Hubspot Login",
                  url: `${BACKEND_URL}/hubspotlogin?userId=${createdUser[0].id}`,
                },
              ],
            }),
          },
        ]);
        setUserId(createdUser[0].id);
        let { data: tokenUsers, error: tokenTableError } = await supabase
          .from("UserTokens")
          .insert([{ user_id: createdUser[0].id }]);

        if (tokenTableError) {
          console.error(tokenTableError);
        }
      }
    }

    if (allUsers && allUsers[0].id) setUserId(allUsers[0].id);
  };

  useEffect(() => {
    if (userId) {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    try {
      // fetchUserIdFromEmail(userEmail);
      setMessages([
        {
          id: Math.random().toString(),
          role: "assistant",
          content: JSON.stringify({
            content: `👋 Hey, I'm Agentprod, your AI work assistant! First, allow me to showcase Agentprod's capabilities, designed to supercharge your workflow.`,
            buttons: [
              {
                buttonTitle: "Check out our website",
                url: "https://agentprod.com",
              },
            ],
          }),
        },
        {
          id: Math.random().toString(),
          role: "assistant",
          content: JSON.stringify({
            content: `Let's connect to apps! Once you are authenticated you will be prompted to try some tasks`,
            buttons: [
              {
                buttonTitle: "Google Login",
                url: `hello.com/test`,
              },
            ],
          }),
        },
        {
          id: Math.random().toString(),
          role: "user",
          content: "How much revenue did we close this month?",
        },
      ]);
    } catch (err) {
      console.log("Something went wrong!", err);
    }
  }, []);

  // TODO: add chat history for a user
  const { messages, input, setInput, handleSubmit, isLoading, setMessages } =
    useChat({
      api: `${BACKEND_URL}/chat-completion`,
      body: {
        userId: userId,
      },
      onResponse: (response) => {
        if (response.status === 429) {
          toast.error("You have reached your request limit for the day.");
          va.track("Rate limited");
          return;
        } else {
          va.track("Chat initiated");
        }
      },
      onError: (error) => {
        va.track("Chat errored", {
          input,
          error: error.message,
        });
      },
    });

  useEffect(() => {}, []);

  const disabled = isLoading || input.length === 0;

  return (
    <div>
      <main className="flex flex-col items-center justify-between pb-20">
        {messages.length > 0 ? (
          messages.map((message, i) => (
            <div
              key={i}
              className={clsx(
                "flex w-full items-center justify-center py-4",
                // message.role === "user" ? "bg-black" : "bg-black/5",
              )}
            >
              <div
                className={clsx(
                  "flex w-full max-w-screen-lg items-start space-x-4 px-5 sm:px-0",
                  message.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={clsx(
                    "p-1.5 text-white",
                    message.role === "assistant" ? "" : "",
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
                      <AvatarImage src="/bw-logo.png" alt="agentprod logo" />
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
                    message.role === "assistant" ? "items-start" : "items-end",
                  )}
                >
                  <span className="text-xs">
                    {message.role === "assistant" ? "Prod" : "User"} 05:07 PM
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
                      {message.role === "assistant"
                        ? JSON.parse(message.content).content
                        : message.content}
                    </ReactMarkdown>

                    <div
                      className={clsx(
                        "button-container mt-4",
                        message.role === "assistant" ? "pb-4" : "pb-0",
                      )}
                    >
                      {message.role === "assistant" &&
                      JSON.parse(message.content).buttons
                        ? JSON.parse(message.content).buttons.map(
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
                            ),
                          )
                        : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Card className="w-[90%] mt-5 mb-0">
            <div className="flex flex-col space-y-4 p-7 sm:p-10">
              <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Welcome to AgentProd
              </h2>
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                👋 Hey, I'm Agentprod, your AI work assistant! First, allow me
                to showcase Agentprod's capabilities, designed to supercharge
                your workflow.
              </p>
              <EmailForm
                userEmail={userEmail}
                setUserEmail={setUserEmail}
                disabled={userEmail !== ""}
              />
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                {userEmail === ""
                  ? "*Enter you email to start using AgentProd!"
                  : "You can now try AgentProd!"}
              </p>
            </div>
            <div className="flex flex-col space-y-4 border-t p-7 sm:px-10 sm:py-4">
              {examples.map((example, i) => (
                <Button
                  key={i}
                  className="rounded-md border h-auto"
                  variant={"outline"}
                  onClick={() => {
                    setInput(example);
                    inputRef.current?.focus();
                  }}
                >
                  {example}
                </Button>
              ))}
            </div>
          </Card>
        )}
        <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 p-5 pb-3 sm:px-0">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
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
