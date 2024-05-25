/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
"use client";

import React, { useState } from "react";
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
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { GmailIcon, LoadingCircle } from "@/app/icons";
import { Switch } from "@/components/ui/switch";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "@/context/user-context";

interface MailData {
  id: number;
  Name: string;
  Type: string;
  Value: string;
}

const initialMailboxes = [
  {
    id: 1,
    email: "siddhant@100xengineers.com",
    name: "Siddhant Goswami",
    warmUp: true,
    dailyLimit: 5,
  },
];

export default function Page() {
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
  const { user } = useUserContext();

  const handleOpenAddMailbox = () => setIsAddMailboxOpen(true);
  const handleCloseAddMailbox = () => setIsAddMailboxOpen(false);

  const fetchDomainData = React.useCallback(async () => {
    setLoading(true);
    setFetchSuccess(false);
    try {
      const response = await axiosInstance.get(
        `/v2/aws/verify/domain/${domainInput}`
      );
      setMailData(response.data);
      setFetchSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch domain data:", error);
      setLoading(false);
      setFetchSuccess(false);
    }
  }, [domainInput]);

  const fetchDomain = () => {
    fetchDomainData();
  };

  const fetchMailboxes = async () => {
    try {
      const response = await axiosInstance.get(
        `/v2/settings/mailboxes/${user.id}`
      );
      // setMailboxes(response.data.mailboxes);
      console.log("Mailboxes fetched successfully:", response.data);
    } catch (error) {
      console.error("Failed to fetch mailboxes:", error);
      // Optionally set some state to show an error message or alert
    }
  };
  React.useEffect(() => {
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
      // setOtpInput(response.data.otp);
      setSenderID(response.data._id);
      handleCloseAddMailbox();
      setIsVerifyEmailOpen(true);
    } catch (error) {
      console.error("Failed to verify email:", error);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {},
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const addMailbox = (mailbox: any) => {
    setMailboxes([...mailboxes, mailbox]);
  };

  const removeMailbox = (id: number) => {
    setMailboxes(mailboxes.filter((mailbox) => mailbox.id !== id));
  };

  const saveChanges = async () => {
    const payload = {
      sender_id: String(senderID),
      otp: String(otpInput),
      mailbox: String(emailInput),
      user_id: String(user.id),
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
          email: emailInput,
          name: nameInput,
          warmUp: true,
          dailyLimit: 5,
        };
        addMailbox(newMailbox);
        setDomainInput("");
        setEmailInput("");
        setNameInput("");
        setIsVerifyEmailOpen(false);
        setIsTableDialogOpen(true);
      } else {
        alert("OTP validation failed: " + "Invalid OTP entered.");
      }
    } catch (error) {
      console.error("Failed to validate OTP:", error);
      alert(
        "Error validating OTP. Please check your connection and try again."
      );
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

      <div className="rounded-md border border-collapse mt-4">
        <Table className="w-full text-left">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-1/5">MAILBOX</TableHead>
              <TableHead>NAME ACCOUNT</TableHead>
              <TableHead>WARM-UP</TableHead>
              <TableHead className="text-left">DAILY LIMIT</TableHead>
              <TableHead> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mailboxes.map((mailbox, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <GmailIcon />
                    <span>{mailbox?.email}</span>
                  </div>
                </TableCell>
                <TableCell>{mailbox?.name || "Muskaan "}</TableCell>
                <TableCell>
                  <Switch checked={mailbox?.warmUp || true} />
                </TableCell>
                <TableCell>{mailbox?.dailyLimit || 5}</TableCell>
                <TableCell>
                  <Dialog>
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
                          <span className="text-blue-500">{mailbox.email}</span>
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
                          onClick={() => removeMailbox(mailbox.id)}
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
      </div>

      <Button className="mt-5" onClick={handleOpenAddMailbox}>
        Add Mailbox
      </Button>
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
              className="w-48"
            >
              {loading ? (
                <LoadingCircle />
              ) : fetchSuccess ? (
                <Check />
              ) : (
                "Get Domain"
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
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Domain Data</DialogTitle>
            <DialogDescription>
              Here is the domain data you requested.
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

                        <span className="w-48 overflow-x-scroll">
                          {mailbox.Name}
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
          <DialogFooter>
            <Button type="button" onClick={() => setIsTableDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
