/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, CheckCircle, Dot, Lightbulb } from "lucide-react";
import { FiAlertTriangle } from "react-icons/fi";
import { BiError } from "react-icons/bi";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { GmailIcon, LoadingCircle } from "@/app/icons";
import { Switch } from "@/components/ui/switch";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "@/context/user-context";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MailData {
  id: number;
  Name: string;
  Type: string;
  Value: string;
  sender_id: any;
  platform: String;
  mailbox: String;
  issues: String;
  dns: Array<{ Name: string; Type: string; Value: string }>;
  domain: String;
  health: String;
}

const initialMailboxes = [
  {
    id: 1,
    sender_id: "",
    mailbox: "",
    sender_name: "",
    warmup: true,
    daily_limit: 30,
    platform: "",
    issues: "",
    dns: [
      {
        Name: "",
        Type: "",
        Value: "",
      },
    ],
    domain: "",
    health: 0,
  },
];

export default function Page() {
  const [isPresentDomain, setIsPresentDomain] = useState();
  const [openDisconnect, setOpenDisconnect] = useState<string | number |null>(null);
  const [googleMail, setGoogleMail] = useState<any>("");
  const [inputAppPassword, setInputAppPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isAddMailboxOpen, setIsAddMailboxOpen] = useState(false);
  const [isVerifyEmailOpen, setIsVerifyEmailOpen] = useState(false);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [mailData, setMailData] = useState<MailData[]>([]);
  const [mailboxes, setMailboxes] = useState(initialMailboxes);
  const [otpInput, setOtpInput] = useState("");
  const [senderID, setSenderID] = useState("");
  const [isChooseServiceOpen, setIsChooseServiceOpen] = useState(false);
  const [isWarmupDialogOpen, setIsWarmupDialogOpen] = useState(false);
  const [isSecondWarmupDialogOpen, setIsSecondWarmupDialogOpen] =
    useState(false);
  const [isLoadingMailboxes, setIsLoadingMailboxes] = useState(false); // Shimmer UI Prep
  const [isApppasswordLoading, setIsApppassowrdLoading] = useState(false);
  const { user } = useUserContext();

  const handleOpenAddMailbox = () => setIsChooseServiceOpen(true);
  const handleCloseAddMailbox = () => setIsChooseServiceOpen(false);

  const handleOpenAgentprodService = () => {
    setIsChooseServiceOpen(false);
    setIsAddMailboxOpen(true);
  };

  const handleOpenGoogleService = () => {
    setIsChooseServiceOpen(false);

    if (user?.id) {
      window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}v2/google/authorize/${user.id}`;
    } else {
      toast.error("User ID is missing. Please try again.");
    }
  };

  const fetchHealthData = async (userId: any) => {
    try {
      const response = await axiosInstance.get(`/v2/settings/health/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch health data:", error);
      return {};
    }
  };

  const handleEnableWarmup = async (email: any) => {
    try {
      const response = await axiosInstance.post(`/v2/google/warmup`, { email });
      console.log("Warmup Enabled:", response.data);
      setMailboxes((prevMailboxes) =>
        prevMailboxes.map((mailbox) =>
          mailbox.mailbox === email ? { ...mailbox, warmup: true } : mailbox
        )
      );
      toast.success("Warmup Enabled!");
    } catch (error) {
      console.error("Failed to enable warmup:", error);
      toast.error("Failed to enable warmup.");
    }
  };

  const handleDisableWarmup = async (email: any) => {
    try {
      const response = await axiosInstance.post(`/v2/google/pause-warmup`, {
        email,
      });
      console.log("Warmup Disabled:", response.data);
      toast.success("Warmup Disabled!");

      // Update the mailbox state with warmup disabled
      setMailboxes((prevMailboxes) =>
        prevMailboxes.map((mailbox) =>
          mailbox.mailbox === email ? { ...mailbox, warmup: false } : mailbox
        )
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleAppPassword = async () => {
    setIsApppassowrdLoading(true);
    const payload = {
      email: googleMail,
      appKey: inputAppPassword,
    };
    try {
      const response = await axios.post(
        `https://warmup.agentprod.com/add-email`,
        payload
      );
      if (response.data === "Success") {
        setIsApppassowrdLoading(false);
        handleEnableWarmup(googleMail);
        localStorage.setItem(`warmupSetup_${googleMail}`, "true");
        setIsSecondWarmupDialogOpen(false);
        toast.success("Warmup Enabled!!");
      } else {
        setIsApppassowrdLoading(false);
        toast.error("Failed to setup warmup.");
      }
    } catch (error) {
      console.error("Failed to setup warmup:", error);
      toast.error("Failed to setup warmup.");
    }
  };

  const handleSwitchChange = (isChecked: boolean, email: any) => {
    if (isChecked) {
      handleEnableWarmup(email);
    } else {
      handleDisableWarmup(email);
    }
  };

  const fetchDomainData = useCallback(async () => {
    setLoading(true);
    setFetchSuccess(false);
    try {
      const response = await axiosInstance.get(
        `/v2/aws/verify/domain/${domainInput}`
      );
      setMailData(response.data.dns);
      setIsPresentDomain(response.data.authenticate);
      console.log("Domain data fetched successfully:", response.data);
      setFetchSuccess(true);
      setLoading(false);
      toast.success("Domain Verified Successfully.");
    } catch (error) {
      setLoading(false);
      setFetchSuccess(false);
      toast.error("Failed To Fetch Domain Data");
    }
  }, [domainInput]);

  const fetchDomain = () => {
    fetchDomainData();
  };

  const fetchMailboxes = async () => {
    setIsLoadingMailboxes(true);
    try {
      const [mailboxesResponse, healthData] = await Promise.all([
        axiosInstance.get(`/v2/settings/mailboxes/${user.id}`),
        fetchHealthData(user.id),
      ]);

      const mailboxes = mailboxesResponse.data.map((mailbox: any) => ({
        ...mailbox,
        dns: mailbox.dns ? JSON.parse(mailbox.dns) : [],
        health: healthData[mailbox.mailbox] || 0, // Set health from the health data
      }));

      setMailboxes(mailboxes);

      const googleMailbox = mailboxes.find(
        (mailbox: any) => mailbox.platform === "Google"
      );
      if (googleMailbox) {
        setGoogleMail(googleMailbox.mailbox);
      }
      console.log("Mailboxes fetched successfully:", mailboxes);
    } catch (error) {
      console.error("Failed to fetch mailboxes:", error);
    }
    setIsLoadingMailboxes(false);
  };

  useEffect(() => {
    if (user?.id) {
      fetchMailboxes();
    }
  }, []);

  const handleEmailVerification = async () => {
    const postData = {
      name: nameInput,
      email: emailInput,
      domain: domainInput,
    };
    try {
      const response = await axiosInstance.post("/v2/brevo/sender", postData);
      console.log("DataMailboxing for verification: ", response.data);
      setSenderID(response.data._id);
      handleCloseAddMailbox();
      setIsVerifyEmailOpen(true);
    } catch (error) {
      console.error("Failed to verify email:", error);
      toast.error("Email Already In Use.");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const addMailbox = (mailbox: any) => {
    setMailboxes([...mailboxes, mailbox]);
  };

  const removeMailbox = async (sender_id: any) => {
    try {
      await axiosInstance.delete(`/v2/user/mailbox/${sender_id}`);
      setMailboxes((prevState) =>
        prevState.filter((mailbox) => mailbox.sender_id !== sender_id)
      );
      setOpenDisconnect(null);
      toast.success("Mailbox removed successfully.");
    } catch (error: any) {
      console.error("Failed to remove mailbox.", error);
      toast.error("Failed to remove mailbox.");
    }
  };

  const saveChanges = async () => {
    const payload = {
      sender_id: String(senderID),
      otp: String(otpInput),
      mailbox: String(emailInput),
      user_id: String(user.id),
      sender_name: String(nameInput),
    };
    console.log("Payload for OTP validation:", JSON.stringify(payload));
    try {
      const response = await axiosInstance.post(
        "/v2/brevo/sender/validate",
        payload
      );
      console.log("Response from OTP validation:", response.data.status);
      if (response.data.status === 204) {
        const newMailbox = {
          id:
            mailboxes.length > 0
              ? Math.max(...mailboxes.map((mb) => mb.id)) + 1
              : 1,
          mailbox: emailInput,
          sender_name: nameInput,
          warmup: true,
          daily_limit: 50,
        };
        const dnsPayload = {
          domain: domainInput,
          data: mailData,
          mail: emailInput,
        };
        await axiosInstance.post("v2/users/dns", dnsPayload);
        await axiosInstance.post("v2/mx/test-domain", { domain: domainInput });
        console.log(dnsPayload);
        setIsVerifyEmailOpen(false);
        if (!isPresentDomain) {
          setIsTableDialogOpen(true);
        }
        setIsAddMailboxOpen(false);
        addMailbox(newMailbox);
        toast.success("Mailbox Added Successfully");
        console.log("Mailbox added successfully:", mailboxes);
        // Fetch the updated mailboxes list
        fetchMailboxes();
      } else {
        alert("OTP validation failed: " + "Invalid OTP entered.");
      }
    } catch (error) {
      console.error("Failed to validate OTP:", error);
      toast.error("Email Verification Failed");
    }
  };

  return (
    <div className="w-full">
      <Alert>
        <Icons.info />
        <AlertDescription className="ml-2">
          Connect a mailbox to use it for campaigns and increase your sending
          volume. If you disconnect a mailbox, it won&apos;t be able to send and
          receive emails, and it can&apos;t be added to new campaigns. You can
          connect as many mailboxes as needed.
        </AlertDescription>
      </Alert>
      <div
        className={`rounded-md ${
          mailboxes.length > 0 ? "border" : ""
        } border-collapse mt-4`}
      >
        {isLoadingMailboxes ? (
          <div className="border-none">
            <div>
              <Skeleton className="w-full h-[40px] rounded-none" />
            </div>
            <Separator />
            <Skeleton className="w-full h-[70px] rounded-none" />
          </div>
        ) : mailboxes.length > 0 ? (
          <Table className="w-full text-center text-xs">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-1/5">MAILBOX</TableHead>
                <TableHead>NAME ACCOUNT</TableHead>
                <TableHead className="text-center">WARM-UP</TableHead>
                <TableHead className="text-left">DAILY LIMIT</TableHead>
                <TableHead className="text-center">Health</TableHead>
                <TableHead className="text-center">STATUS</TableHead>
                <TableHead className="text-center">DNS</TableHead>
                <TableHead> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mailboxes.map((mailbox, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {mailbox.platform === "Google" ? (
                        <GmailIcon />
                      ) : (
                        <Image
                          src="/bw-logo.png"
                          alt="agent-prod"
                          width="20"
                          height="20"
                        />
                      )}
                      <span>{mailbox.mailbox}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {mailbox?.sender_name || "No Name Provided"}
                  </TableCell>
                  <TableCell>
                    {mailbox?.platform === "Google" ? (
                      mailbox.warmup ||
                      localStorage.getItem(`warmupSetup_${mailbox.mailbox}`) ? (
                        <Switch
                          checked={mailbox.warmup}
                          onCheckedChange={(isChecked) =>
                            handleSwitchChange(isChecked, mailbox.mailbox)
                          }
                        />
                      ) : (
                        <Button
                          variant="secondary"
                          onClick={() => setIsWarmupDialogOpen(true)}
                        >
                          Setup Warmup
                        </Button>
                      )
                    ) : (
                      <Switch
                        checked={mailbox.warmup}
                        onCheckedChange={(isChecked) =>
                          handleSwitchChange(isChecked, mailbox.mailbox)
                        }
                      />
                    )}
                  </TableCell>

                  <TableCell>{mailbox.daily_limit}</TableCell>
                  <TableCell>
                    {mailbox.health > 0 ? (
                      <CircularProgressbar
                        value={mailbox.health}
                        text={`${mailbox.health}%`}
                        className={`h-8 w-8 font-semibold `}
                        styles={buildStyles({
                          rotation: 0.25,
                          textSize: "25px",
                          strokeLinecap: "butt",
                          pathTransitionDuration: 0.5,
                          pathColor: `${
                            mailbox.health === 100 ? "#3ae374" : "#f88"
                          }`,
                          textColor: `${
                            mailbox.health === 100 ? "#00c04b" : "#f88"
                          }`,
                          trailColor: "#d6d6d6",
                          backgroundColor: "#3e98c7",
                        })}
                      />
                    ) : (
                      <CircularProgressbar
                        value={mailbox.health}
                        text={`${mailbox.health}%`}
                        className={`h-8 w-8 font-semibold animate-pulse`}
                        styles={buildStyles({
                          rotation: 0.25,
                          textSize: "25px",
                          strokeLinecap: "butt",
                        })}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {mailbox.issues === null ? (
                      <Popover>
                        <PopoverTrigger>
                          <Badge className="gap-1 flex text-[10px] items-center w-32 justify-center hover:cursor-pointer rounded-full hover:bg-green-400 hover:text-green-800 bg-green-300 text-green-700">
                            <CheckCircle className="h-[14px] w-[14px]" />
                            GOOD
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="sm:max-w-[425px]">
                          <div className="text-left flex flex-col gap-1">
                            <CheckCircle
                              size={"30"}
                              color="green"
                              className="mb-4"
                            />
                            <div>
                              This mailbox is healthy and has no urgent issues.
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : mailbox.issues.length > 2 ? (
                      <Popover>
                        <PopoverTrigger>
                          <Badge className="gap-1 flex text-[10px] w-32 justify-center hover:cursor-pointer items-center rounded-full hover:bg-red-400 hover:text-red-800 bg-red-300 text-red-700">
                            <FiAlertTriangle className="h-[14px] w-[14px]" />
                            URGENT ISSUE
                          </Badge>
                        </PopoverTrigger>

                        <PopoverContent className="w-full p-8">
                          <ScrollArea className="h-[20rem] max-w-[35rem]">
                            <div className="text-left flex flex-col gap-1">
                              <div className="flex flex-row items-center gap-4">
                                <Icons.alertCircle
                                  size={"30"}
                                  color="red"
                                  className=""
                                />
                                Urgent Issues Detected.
                              </div>
                              <div className="mt-4">
                                Critical issues have been identified with this
                                mailbox:
                                <ul className="flex flex-col gap-2 mt-1">
                                  {JSON.parse(mailbox.issues).map(
                                    (issue: any, index: any) => (
                                      <li
                                        key={index}
                                        className="flex gap-1 items-center"
                                      >
                                        <BiError className="h-4 w-4 text-red-700" />
                                        {issue.Info}
                                      </li>
                                    )
                                  )}
                                </ul>
                                <Separator />
                                <div className="mt-2">Recommended Actions:</div>
                                <ul className="flex flex-col gap-2 mt-1">
                                  <li className="flex gap-1 items-center">
                                    <Lightbulb className="h-4 w-4 text-green-700" />
                                    Click the DNS button in the table to view
                                    the DNS records.
                                  </li>
                                  <li className="flex gap-1 items-center">
                                    <Lightbulb className="h-4 w-4 text-green-700" />
                                    <span>
                                      {
                                        "Access domain registrar or DNS provider.(For Eg. GoDaddy)"
                                      }
                                    </span>
                                  </li>
                                  <li className="flex gap-1 items-center">
                                    <Lightbulb className="h-4 w-4 text-green-700" />
                                    Go to DNS Management settings.
                                  </li>
                                  {JSON.parse(mailbox.issues).map(
                                    (issue: any, index: any) => (
                                      <li
                                        key={index}
                                        className="flex gap-1 items-center"
                                      >
                                        {issue.Name ===
                                          "DNS Record Published" && (
                                          <div className="flex flex-col gap-1">
                                            <div className="flex gap-1 items-center">
                                              <Lightbulb className="h-4 w-4 text-green-700" />
                                              DNS Records:
                                            </div>
                                            <div className="flex gap-1 items-center">
                                              <Dot className="text-green-700 ml-2" />
                                              <b>A Records:</b> Connect your
                                              domain to your server&apos;s IP
                                              address.
                                            </div>
                                            <div className="flex gap-1 items-center">
                                              <Dot className="text-green-700 ml-2" />
                                              <b>MX Records:</b> Set up your
                                              email servers.
                                            </div>
                                            <div className="flex gap-1 items-center">
                                              <Dot className="text-green-700 ml-2" />
                                              <b>CNAME Records:</b> Link an
                                              alias to another domain.
                                            </div>
                                          </div>
                                        )}
                                        {issue.Name ===
                                          "SPF Record Published" && (
                                          <div className="flex flex-col gap-1">
                                            <div className="flex gap-1 items-center">
                                              <Lightbulb className="h-4 w-4 text-green-700 mt-1" />
                                              SPF Record:
                                            </div>
                                            <div className="flex gap-1 items-center ">
                                              <Dot className="text-green-700 ml-2" />
                                              Add TXT Record:
                                            </div>
                                            <div className="flex gap-1 items-center ml-3">
                                              <Dot className="text-green-700 ml-2" />
                                              <b>Name:</b> @
                                            </div>
                                            <div className="flex gap-1 items-center ml-3">
                                              <Dot className="text-green-700 ml-2" />
                                              <b>Type:</b> TXT
                                            </div>
                                          </div>
                                        )}
                                        {issue.Name ===
                                          "DMARC Record Published" && (
                                          <div className="flex flex-col gap-1">
                                            <div className="flex gap-1 items-center">
                                              <Lightbulb className="h-4 w-4 text-green-700 mt-1" />
                                              DMARC Record:
                                            </div>
                                            <div className="flex gap-1 items-center ">
                                              <Dot className="text-green-700 ml-2" />
                                              Add a TXT Record:
                                            </div>
                                            <div className="flex gap-1 items-center ml-3">
                                              <Dot className="text-green-700 ml-2" />
                                              <b>Name:</b>_dmarc
                                            </div>
                                            <div className="flex gap-1 items-center ml-3">
                                              <Dot className="text-green-700 ml-2" />
                                              <b>Type:</b> TXT
                                            </div>
                                          </div>
                                        )}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Popover>
                        <PopoverTrigger>
                          <Badge className="gap-1 flex text-[10px] items-center w-32 justify-center hover:cursor-pointer rounded-full hover:bg-green-400 hover:text-green-800 bg-green-300 text-green-700">
                            <CheckCircle className="h-[14px] w-[14px]" />
                            GOOD
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="sm:max-w-[425px]">
                          <div className="text-left flex flex-col gap-1">
                            <CheckCircle
                              size={"30"}
                              color="green"
                              className="mb-4"
                            />
                            <div>
                              This mailbox is healthy and has no urgent issues.
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </TableCell>
                  {/* <TableCell>
                    <Dialog>
                      <DialogTrigger
                        asChild
                        className="flex gap-1 items-center"
                      >
                        <Button variant={"secondary"} className="p-2">
                          DNS
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>DNS Records</DialogTitle>
                        </DialogHeader>
                        <div className="grid items-center gap-4 w-full">
                          <Table className="mt-4 w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Value</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {mailbox?.dns.map((dns) => (
                                <TableRow key={dns.Value}>
                                  <TableCell>{dns.Type}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Icons.copy
                                        className="cursor-pointer "
                                        onClick={() => handleCopy(dns.Name)}
                                      />
                                      <span className="w-96 overflow-x-scroll">
                                        {dns?.Name}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Icons.copy
                                        className="cursor-pointer"
                                        onClick={() => handleCopy(dns.Value)}
                                      />
                                      <span>{dns.Value}</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <Table className="mt-4 w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Priority</TableHead>
                              <TableHead>Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <input
                                  type="text"
                                  value={"MX"}
                                  readOnly
                                  className="w-full h-10 bg-transparent border border-gray-400 rounded-sm px-2"
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  type="text"
                                  value={mailbox.domain}
                                  readOnly
                                  className="w-full h-10 bg-transparent border border-gray-400 rounded-sm px-2"
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  type="text"
                                  value={"1"}
                                  readOnly
                                  className="w-full h-10 bg-transparent border border-gray-400 rounded-sm px-2"
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  type="text"
                                  value={
                                    "inbound-smtp.us-east-1.amazonaws.com."
                                  }
                                  readOnly
                                  className="w-full h-10 bg-transparent border border-gray-400 rounded-sm px-2"
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </DialogContent>
                    </Dialog>
                  </TableCell> */}
                  <TableCell>
                    {mailbox.platform === "Google" ? (
                      <span className="text-gray-500 italic">No DNS</span>
                    ) : (
                      <Dialog>
                        <DialogTrigger
                          asChild
                          className="flex gap-1 items-center"
                        >
                          <Button variant={"secondary"} className="p-2">
                            DNS
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>DNS Records</DialogTitle>
                          </DialogHeader>
                          <div className="grid items-center gap-4 w-full">
                            <Table className="mt-4 w-full">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Value</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {mailbox?.dns.map((dns) => (
                                  <TableRow key={dns.Value}>
                                    <TableCell>{dns.Type}</TableCell>
                                    <TableCell>
                                      <div className="flex gap-2">
                                        <Icons.copy
                                          className="cursor-pointer "
                                          onClick={() => handleCopy(dns.Name)}
                                        />
                                        <span className="w-96 overflow-x-scroll">
                                          {dns?.Name}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Icons.copy
                                          className="cursor-pointer"
                                          onClick={() => handleCopy(dns.Value)}
                                        />
                                        <span>{dns.Value}</span>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <Table className="mt-4 w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Value</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <input
                                    type="text"
                                    value={"MX"}
                                    readOnly
                                    className="w-full h-10 bg-transparent border border-gray-400 rounded-sm px-2"
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="text"
                                    value={mailbox.domain}
                                    readOnly
                                    className="w-full h-10 bg-transparent border border-gray-400 rounded-sm px-2"
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="text"
                                    value={"1"}
                                    readOnly
                                    className="w-full h-10 bg-transparent border border-gray-400 rounded-sm px-2"
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="text"
                                    value={
                                      "inbound-smtp.us-east-1.amazonaws.com."
                                    }
                                    readOnly
                                    className="w-full h-10 bg-transparent border border-gray-400 rounded-sm px-2"
                                  />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={openDisconnect === mailbox.id}
                      onOpenChange={(open) =>
                        setOpenDisconnect(open ? mailbox.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant={"destructive"}>Disconnect</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader className="text-left flex gap-1">
                          <Icons.alertCircle
                            size={"40"}
                            color="red"
                            className="mb-4"
                          />
                          <DialogTitle>Disconnect Account</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to disconnect{" "}
                            <span className="text-blue-500">
                              {mailbox.mailbox}
                            </span>
                            ? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant={"outline"}>
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            type="submit"
                            variant={"destructive"}
                            onClick={() => removeMailbox(mailbox.sender_id)}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          "No mailboxes connected."
        )}
      </div>
      <Button className="mt-5" onClick={handleOpenAddMailbox}>
        Add Mailbox
      </Button>

      <Dialog open={isWarmupDialogOpen} onOpenChange={setIsWarmupDialogOpen}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Setup Warmup</DialogTitle>
            <DialogDescription>
              Enable your Imap and forwading
            </DialogDescription>
          </DialogHeader>

          <p>· Open Gmail.</p>
          <p>
            · Go to <b>Settings.</b>
          </p>
          <p>
            · Navigate to the <b>Forwarding</b> and <b>POP/IMAP</b> Tab.
          </p>
          <p>
            · Enable <b>IMAP</b> and <b>Save Changes.</b>
          </p>

          <DialogFooter>
            <Button
              onClick={() => {
                setIsWarmupDialogOpen(false);
                setIsSecondWarmupDialogOpen(true);
              }}
            >
              Next Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSecondWarmupDialogOpen}
        onOpenChange={setIsSecondWarmupDialogOpen}
      >
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Setup Warmup</DialogTitle>
            <DialogDescription>
              Enable 2 factor verification and app password
            </DialogDescription>
          </DialogHeader>
          <p>
            · Go to <b>myaccount.google.com</b>
          </p>
          <p>
            · Enable <b>2-Factor Verification.</b>
          </p>
          <p>
            · Search for <b>App Passwords.</b>
          </p>
          <p>· Generate a new app password.</p>

          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              <p className="text-sm">Enter Your App Password</p>
              <Input
                value={inputAppPassword}
                onChange={(e) => setInputAppPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => handleAppPassword()}>
              {isApppasswordLoading ? <LoadingCircle /> : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isChooseServiceOpen} onOpenChange={setIsChooseServiceOpen}>
        <DialogContent className="w-full flex flex-col">
          <DialogHeader>
            <DialogTitle>Add mailbox</DialogTitle>
            <DialogDescription>
              Choose the service to continue adding the mailbox.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <Button
              onClick={handleOpenGoogleService}
              className="flex gap-2 items-center"
            >
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </Button>
            <Button
              onClick={handleOpenAgentprodService}
              className="flex items-center gap-2"
            >
              <Image
                src="/bw-logo.png"
                alt="agent-prod"
                width="20"
                height="20"
              />
              Continue with Agentprod Email Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddMailboxOpen} onOpenChange={setIsAddMailboxOpen}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Add mailbox</DialogTitle>
            <DialogDescription>
              Enter the email you want to add to the mailbox.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              <p className="text-sm">Name</p>
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter name"
              />
            </div>
          </div>
          <div className="grid gap-4 py-4 -mt-8">
            <div className="grid items-center gap-4">
              <p className="text-sm">Email Address</p>
              <Input
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm">Domain</p>
            <Input
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="Enter domain"
              className="flex-grow"
            />
            <Button
              variant="secondary"
              type="submit"
              onClick={fetchDomain}
              className="w-56"
            >
              {loading ? (
                <LoadingCircle />
              ) : fetchSuccess ? (
                <Check />
              ) : (
                "Verify Domain"
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button
              onClick={handleEmailVerification}
              disabled={emailInput === "" || domainInput === ""}
            >
              Verify email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isVerifyEmailOpen} onOpenChange={setIsVerifyEmailOpen}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Email Verification</DialogTitle>
            <DialogDescription>
              Enter the OTP you have received on your email.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-center">
            <Input
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveChanges}>
              Verify OTP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
        <DialogContent className="w-full max-w-4xl">
          <DialogHeader>
            <DialogTitle>Publish DNS Records</DialogTitle>
            <DialogDescription>
              Publish these records on your email provider in DNS Management
              (eg.- Go daddy)
            </DialogDescription>
          </DialogHeader>
          <div className="grid items-center gap-4 w-full">
            <Table className="mt-4 w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mailData.map((mailbox, index) => (
                  <TableRow key={index}>
                    <TableCell>{mailbox.Type}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Icons.copy
                          className="cursor-pointer "
                          onClick={() => handleCopy(mailbox.Name)}
                        />
                        <span className="w-96 overflow-x-scroll">
                          {mailbox.Name.replace("", "")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icons.copy
                          className="cursor-pointer"
                          onClick={() => handleCopy(mailbox.Value)}
                        />
                        <span>{mailbox.Value}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Table className="mt-4 w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <input
                    type="text"
                    value={"MX"}
                    readOnly
                    className="w-full h-10 bg-transparent border border-gray-400 rounded-sm px-2"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={domainInput}
                    readOnly
                    className="w-full h-10 bg-transparent border border-gray-400 rounded-sm px-2"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={"1"}
                    readOnly
                    className="w-full h-10 bg-transparent border border-gray-400 rounded-sm px-2"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="text"
                    value={"inbound-smtp.us-east-1.amazonaws.com."}
                    readOnly
                    className="w-full h-10 bg-transparent border border-gray-400 rounded-sm px-2"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setIsTableDialogOpen(false);
                setIsVerifyEmailOpen(false);
                setIsAddMailboxOpen(false);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
