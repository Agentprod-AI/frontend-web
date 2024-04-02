import React from 'react';

import { Button } from '@/components/ui/button';
 
import {
  Alert,
  AlertDescription
} from "@/components/ui/alert";
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
  } from "@/components/ui/dialog"
import { Icons } from '@/components/icons';
import { Switch } from '@/components/ui/switch';
import { GmailIcon } from '@/app/icons';

export default function Page () {
  return (
    <div className="w-full">
        <Alert>
            <Icons.info/>
            <AlertDescription className="ml-2">
                Connect a mailbox to use it for campaigns and increase your sending volume. If you disconnect a mailbox, it won&apos;t be able to send and receive emails, and it can&apos;t be added to new campaigns. You can connect as many mailboxes as needed.
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
                    <TableHead>{" "}</TableHead>
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
                    <TableCell>
                        Siddhant Goswami
                    </TableCell>
                    <TableCell>
                        <Switch/>
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
                                    <Icons.alertCircle size={"40"} color="red" className="mb-4"/>
                                    <DialogTitle>Disconnect Account</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to disconnect <span className="text-blue-500">siddhant@100xengineers.com</span>. This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant={"outline"}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                    <Button type="submit" variant={"destructive"}>Delete</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TableCell>
                </TableRow>
                </TableBody>
            </Table>
        </div>
        <Button className="mt-5">
            Add Mailbox
        </Button>
    </div>
  );
};