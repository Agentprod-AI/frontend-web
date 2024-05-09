"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/icons";
import { Switch } from "@/components/ui/switch";
import { GmailIcon } from "@/app/icons";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mailbox = [
  {
    name: "h66fgugabtde2xw3alnbdjcnkvkf2aic._domainkey.agentprod.com",
    value: "h66fgugabtde2xw3alnbdjcnkvkf2aic.dkim.amazonses.com",
  },
  {
    name: "t55xo37trffwlzb3u6htrj2lng7mx6h6._domainkey.agentprod.com",
    value: "t55xo37trffwlzb3u6htrj2lng7mx6h6.dkim.amazonses.com",
  },
  {
    name: "t4uiosaepu7vohinjqlagesy7lzh5rye._domainkey.agentprod.com",
    value: "t4uiosaepu7vohinjqlagesy7lzh5rye.dkim.amazonses.com",
  },
];

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // You might want to set a state to show a success message or tooltip
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
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
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-3">
                  <GmailIcon />
                  <span>siddhant@100xengineers.com</span>
                </div>
              </TableCell>
              <TableCell>Siddhant Goswami</TableCell>
              <TableCell>
                <Switch />
              </TableCell>
              <TableCell>5</TableCell>
              <TableCell>
                {/* <Icons.info/> */}
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
                      <Button type="submit" variant={"destructive"}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-5">Add Mailbox</Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Add mailbox</DialogTitle>
            <DialogDescription>
              Enter the domain you want to add to the mailbox.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              <p className="text-sm">Domain</p>
              <Input
                //   value={domainValue}
                //   onChange={(e) => setDomainValue(e.target.value)}
                placeholder="Enter domain"
              />
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
                  {mailbox.map((mailbox, index) => (
                    <TableRow key={index}>
                      <TableCell>CNAME</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icons.copy
                            className="cursor-pointer"
                            onClick={() => handleCopy(mailbox.name)}
                          />
                          <span>{mailbox.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icons.copy
                            className="cursor-pointer"
                            onClick={() => handleCopy(mailbox.value)}
                          />
                          <span>{mailbox.value}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
