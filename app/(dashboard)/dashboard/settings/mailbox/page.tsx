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
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { GmailIcon } from "@/app/icons";
import { Switch } from "@/components/ui/switch";

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
  const [isAddMailboxOpen, setIsAddMailboxOpen] = useState(false);
  const [isVerifyEmailOpen, setIsVerifyEmailOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [mailData, setMailData] = useState<MailData[]>([]);
  const [mailboxes, setMailboxes] = useState(initialMailboxes);

  const handleOpenAddMailbox = () => setIsAddMailboxOpen(true);
  const handleCloseAddMailbox = () => setIsAddMailboxOpen(false);

  const fetchDomainData = React.useCallback(async () => {
    try {
      const response = await fetch(
        `https://agentprod-backend-framework-zahq.onrender.com/v2/aws/verify/domain/${domainInput}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: MailData[] = await response.json();
      setMailData(data);
    } catch (error) {
      // console.error("Failed to fetch domain data:", error);
    }
  }, [domainInput]);

  function fetchDomain() {
    fetchDomainData();
  }

  const handleEmailVerification = async () => {
    try {
      const response = await fetch(
        `https://agentprod-backend-framework-zahq.onrender.com/v2/aws/verify/email/${emailInput}`
      );
      await response.json();
      handleCloseAddMailbox();
      setIsVerifyEmailOpen(true);
    } catch (error) {
      // console.error("Failed to verify email:", error);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {},
      (err) => {
        // console.error("Could not copy text: ", err);
      }
    );
  };
  // const handleCloseVerifyEmail = () => setIsVerifyEmailOpen(false);

  const addMailbox = (mailbox: any) => {
    setMailboxes([...mailboxes, mailbox]);
  };

  const removeMailbox = (id: number) => {
    setMailboxes(mailboxes.filter((mailbox) => mailbox.id !== id));
  };

  const saveChanges = () => {
    // Example mailbox data that might be added
    const newMailbox = {
      id: Math.max(...mailboxes.map((mb) => mb.id)) + 1,
      email: emailInput,
      name: nameInput,
      warmUp: true,
      dailyLimit: 5,
    };
    addMailbox(newMailbox);
    setDomainInput("");
    setIsVerifyEmailOpen(false);
  };

  return (
    <div className="w-full">
      <Alert>
        <Icons.info />
        <AlertDescription className="ml-2">
          Connect a mailbox to use it for campaigns and increase your sending
          volume. If you disconnect a mailbox, it won&apos;t be able to send and
          receive emails, and it & can&apos;t be added to new campaigns. You can
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
                    <span>{mailbox.email}</span>
                  </div>
                </TableCell>
                <TableCell>{mailbox.name}</TableCell>
                <TableCell>
                  <Switch checked={mailbox.warmUp} />
                </TableCell>
                <TableCell>{mailbox.dailyLimit}</TableCell>
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
                          <span className="text-blue-500">
                            siddhant@100xengineers.com
                          </span>
                          . This action cannot be undone.
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
                placeholder="Enter email address"
              />
            </div>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              <p className="text-sm">Email Address</p>
              <Input
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleEmailVerification}
              disabled={emailInput === ""}
            >
              Verify email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isVerifyEmailOpen} onOpenChange={setIsVerifyEmailOpen}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Add mailbox</DialogTitle>
            <DialogDescription>
              Enter the domain you want to add to the mailbox.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <p className="text-sm">Domain</p>
              <Input
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Enter domain"
                className="flex-grow"
              />
              <Button type="submit" onClick={fetchDomain}>
                Done
              </Button>
            </div>
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
                        <div className="flex items-center gap-2">
                          <Icons.copy
                            className="cursor-pointer"
                            onClick={() => handleCopy(mailbox.Name)}
                          />
                          <span>{mailbox.Name}</span>
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
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveChanges}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
