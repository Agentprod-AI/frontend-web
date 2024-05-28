"use client";
import React from "react";

// import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HubSpotIcon,
  LinkedInIcon,
  SalesForceIcon,
  SlackIcon,
  ZapierIcon,
} from "@/app/icons";
import {
  Dialog,
  // DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  // DialogClose,
} from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../../../../public/bw-logo.png";
import { ArrowLeftRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

// type Service = {
//   name: string;
//   description: string;
//   logo: string;
//   isConnected: boolean;
//   // onConnect: () => void;
// };

const FormSchema = z.object({
  type: z.enum(["all", "engaged"], {
    required_error: "You need to select a notification type.",
  }),
});

// const services = [
//   {
//     name: "Slack",
//     description: "Used to interact with the Artisan and receive notifications.",
//     logo: <SlackIcon />,
//     isConnected: false,
//     available: "Coming Soon",
//   },
//   {
//     name: "HubSpot",
//     description: "Used to interact with the Artisan and receive notifications.",
//     logo: <HubSpotIcon />,
//     isConnected: true,
//     available: "Connect",
//   },
//   {
//     name: "LinkedIn",
//     description: "Used to interact with the Artisan and receive notifications.",
//     logo: <LinkedInIcon />,
//     isConnected: false,
//     available: "Coming Soon",
//   },
//   {
//     name: "Salesforce",
//     description: "Used to interact with the Artisan and receive notifications.",
//     logo: <SalesForceIcon />,
//     isConnected: false,
//     available: "Coming Soon",
//   },
//   {
//     name: "Zapier",
//     description: "Used to interact with the Artisan and receive notifications.",
//     logo: <ZapierIcon />,
//     isConnected: false,
//     available: "Coming Soon",
//   },
//   // Add more services as needed
// ];

export default function Page() {
  const [isHubspotMailboxOpen, setIsHubspotMailboxOpen] = React.useState(false);
  const handleOpenAddMailbox = () => setIsHubspotMailboxOpen(true);
  const handleCloseAddMailbox = () => setIsHubspotMailboxOpen(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Slack Card Started Here */}
      <Card>
        <CardHeader className="flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <SlackIcon />
            <div
              className={`text-sm border rounded-lg text-center p-2 cursor-pointer`}
              onClick={() => {}}
            >
              Connect
            </div>
          </div>
          <Dialog>
            <DialogContent className="w-full">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex flex-col gap-4 mb-1">
                    <div className="flex justify-center items-center flex-row gap-3">
                      <Image src={logo} alt="logo" width={40} height={40} />
                      <ArrowLeftRight />
                      <HubSpotIcon />
                    </div>
                    Export AgentProd Leads to HubSpot
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Description about the action being performed
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-2/3 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          <p className="text-base text-gray-400">
                            Configure Leads
                          </p>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="all"
                                  className="h-6 w-6 focus:bg-black focus:text-white"
                                />
                              </FormControl>
                              <FormLabel className="font-bold">
                                <div>
                                  <h1 className="text-lg">Export All Leads</h1>
                                  <p className="font-normal text-gray-400">
                                    We will stream every lead that is enrolled
                                    from your AgentProd account
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="engaged"
                                  className="h-6 w-6 focus:bg-black focus:text-white"
                                />
                              </FormControl>
                              <FormLabel className="font-bold">
                                <div>
                                  <h1 className="text-lg">
                                    Export Engaged Leads
                                  </h1>
                                  <p className="font-normal text-gray-400">
                                    We will stream every lead that have
                                    responsed to your outbound workflows
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <Separator />
              <div className="flex flex-row gap-4">
                <p className="font-semibold">
                  Avoid outreach to leads that is already in your CRM?{" "}
                </p>
                <Switch />
              </div>
              <DialogFooter>
                <Button
                  variant={"outline"}
                  className="mt-3"
                  onClick={handleCloseAddMailbox}
                >
                  Cancel
                </Button>
                <Button className="mt-3" type="submit">
                  Update
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* {service.isConnected ? (
            <Button variant={"outline"} className="text-sm"> 
              Disconnect
            </Button>
          ) : (
            <Button variant={"outline"} className="text-sm"> 
              Connect
            </Button>
          )} */}
        </CardHeader>
        <CardContent className="space-y-2 mt-2">
          <CardTitle>Slack</CardTitle>
          <CardDescription>
            Used to interact with the Artisan and receive notifications.
          </CardDescription>
        </CardContent>
      </Card>
      {/*------------------ Slack Card Ended Here------------------- */}

      {/* Hubspot Card Started Here */}

      <Card>
        <CardHeader className="flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <HubSpotIcon />
            <div
              className={`text-sm border rounded-lg text-center p-2 cursor-pointer`}
              onClick={() => {
                handleOpenAddMailbox();
              }}
            >
              Connect
            </div>
          </div>
          <Dialog
            open={isHubspotMailboxOpen}
            onOpenChange={setIsHubspotMailboxOpen}
          >
            <DialogContent className="w-full">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex flex-col gap-4 mb-1">
                    <div className="flex justify-center items-center flex-row gap-3">
                      <Image src={logo} alt="logo" width={40} height={40} />
                      <ArrowLeftRight />
                      <HubSpotIcon />
                    </div>
                    Export AgentProd Leads to HubSpot
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Description about the action being performed
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-2/3 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          <p className="text-base text-gray-400">
                            Configure Leads
                          </p>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="all"
                                  className="h-6 w-6 focus:bg-black focus:text-white"
                                />
                              </FormControl>
                              <FormLabel className="font-bold">
                                <div>
                                  <h1 className="text-lg">Export All Leads</h1>
                                  <p className="font-normal text-gray-400">
                                    We will stream every lead that is enrolled
                                    from your AgentProd account
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="engaged"
                                  className="h-6 w-6 focus:bg-black focus:text-white"
                                />
                              </FormControl>
                              <FormLabel className="font-bold">
                                <div>
                                  <h1 className="text-lg">
                                    Export Engaged Leads
                                  </h1>
                                  <p className="font-normal text-gray-400">
                                    We will stream every lead that have
                                    responsed to your outbound workflows
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <Separator />
              <div className="flex flex-row gap-4">
                <p className="font-semibold">
                  Avoid outreach to leads that is already in your CRM?{" "}
                </p>
                <Switch />
              </div>
              <DialogFooter>
                <Button
                  variant={"outline"}
                  className="mt-3"
                  onClick={handleCloseAddMailbox}
                >
                  Cancel
                </Button>
                <Button className="mt-3" type="submit">
                  Update
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* {service.isConnected ? (
            <Button variant={"outline"} className="text-sm"> 
              Disconnect
            </Button>
          ) : (
            <Button variant={"outline"} className="text-sm"> 
              Connect
            </Button>
          )} */}
        </CardHeader>
        <CardContent className="space-y-2 mt-2">
          <CardTitle>Hubspot</CardTitle>
          <CardDescription>
            Used to interact with the Artisan and receive notifications.
          </CardDescription>
        </CardContent>
      </Card>

      {/*------------------ Hubspot Card Ended Here------------------- */}

      {/* LinkedIn Card Started Here */}
      <Card>
        <CardHeader className="flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <LinkedInIcon />
            <div
              className={`text-sm border rounded-lg text-center p-2 cursor-pointer`}
              onClick={() => {}}
            >
              Connect
            </div>
          </div>
          <Dialog>
            <DialogContent className="w-full">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex flex-col gap-4 mb-1">
                    <div className="flex justify-center items-center flex-row gap-3">
                      <Image src={logo} alt="logo" width={40} height={40} />
                      <ArrowLeftRight />
                      <HubSpotIcon />
                    </div>
                    Export AgentProd Leads to HubSpot
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Description about the action being performed
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-2/3 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          <p className="text-base text-gray-400">
                            Configure Leads
                          </p>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="all"
                                  className="h-6 w-6 focus:bg-black focus:text-white"
                                />
                              </FormControl>
                              <FormLabel className="font-bold">
                                <div>
                                  <h1 className="text-lg">Export All Leads</h1>
                                  <p className="font-normal text-gray-400">
                                    We will stream every lead that is enrolled
                                    from your AgentProd account
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="engaged"
                                  className="h-6 w-6 focus:bg-black focus:text-white"
                                />
                              </FormControl>
                              <FormLabel className="font-bold">
                                <div>
                                  <h1 className="text-lg">
                                    Export Engaged Leads
                                  </h1>
                                  <p className="font-normal text-gray-400">
                                    We will stream every lead that have
                                    responsed to your outbound workflows
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <Separator />
              <div className="flex flex-row gap-4">
                <p className="font-semibold">
                  Avoid outreach to leads that is already in your CRM?{" "}
                </p>
                <Switch />
              </div>
              <DialogFooter>
                <Button
                  variant={"outline"}
                  className="mt-3"
                  onClick={handleCloseAddMailbox}
                >
                  Cancel
                </Button>
                <Button className="mt-3" type="submit">
                  Update
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* {service.isConnected ? (
            <Button variant={"outline"} className="text-sm"> 
              Disconnect
            </Button>
          ) : (
            <Button variant={"outline"} className="text-sm"> 
              Connect
            </Button>
          )} */}
        </CardHeader>
        <CardContent className="space-y-2 mt-2">
          <CardTitle>LinkedIn</CardTitle>
          <CardDescription>
            Used to interact with the Artisan and receive notifications.
          </CardDescription>
        </CardContent>
      </Card>
      {/*------------------ LinkedIn Card Ended Here------------------- */}

      {/* SalesForce Card Started Here */}
      <Card>
        <CardHeader className="flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <SalesForceIcon />
            <div
              className={`text-sm border rounded-lg text-center p-2 cursor-pointer`}
              onClick={() => {}}
            >
              Connect
            </div>
          </div>
          <Dialog>
            <DialogContent className="w-full">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex flex-col gap-4 mb-1">
                    <div className="flex justify-center items-center flex-row gap-3">
                      <Image src={logo} alt="logo" width={40} height={40} />
                      <ArrowLeftRight />
                      <HubSpotIcon />
                    </div>
                    Export AgentProd Leads to HubSpot
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Description about the action being performed
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-2/3 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          <p className="text-base text-gray-400">
                            Configure Leads
                          </p>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="all"
                                  className="h-6 w-6 focus:bg-black focus:text-white"
                                />
                              </FormControl>
                              <FormLabel className="font-bold">
                                <div>
                                  <h1 className="text-lg">Export All Leads</h1>
                                  <p className="font-normal text-gray-400">
                                    We will stream every lead that is enrolled
                                    from your AgentProd account
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="engaged"
                                  className="h-6 w-6 focus:bg-black focus:text-white"
                                />
                              </FormControl>
                              <FormLabel className="font-bold">
                                <div>
                                  <h1 className="text-lg">
                                    Export Engaged Leads
                                  </h1>
                                  <p className="font-normal text-gray-400">
                                    We will stream every lead that have
                                    responsed to your outbound workflows
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <Separator />
              <div className="flex flex-row gap-4">
                <p className="font-semibold">
                  Avoid outreach to leads that is already in your CRM?{" "}
                </p>
                <Switch />
              </div>
              <DialogFooter>
                <Button
                  variant={"outline"}
                  className="mt-3"
                  onClick={handleCloseAddMailbox}
                >
                  Cancel
                </Button>
                <Button className="mt-3" type="submit">
                  Update
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* {service.isConnected ? (
            <Button variant={"outline"} className="text-sm"> 
              Disconnect
            </Button>
          ) : (
            <Button variant={"outline"} className="text-sm"> 
              Connect
            </Button>
          )} */}
        </CardHeader>
        <CardContent className="space-y-2 mt-2">
          <CardTitle>Salesforce</CardTitle>
          <CardDescription>
            Used to interact with the Artisan and receive notifications.
          </CardDescription>
        </CardContent>
      </Card>

      {/*------------------ SalesForce Card Ended Here------------------- */}

      {/* Zapier Card Started Here */}

      <Card>
        <CardHeader className="flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <ZapierIcon />
            <div
              className={`text-sm border rounded-lg text-center p-2 cursor-pointer`}
              onClick={() => {}}
            >
              Connect
            </div>
          </div>
          <Dialog>
            <DialogContent className="w-full">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex flex-col gap-4 mb-1">
                    <div className="flex justify-center items-center flex-row gap-3">
                      <Image src={logo} alt="logo" width={40} height={40} />
                      <ArrowLeftRight />
                      <HubSpotIcon />
                    </div>
                    Export AgentProd Leads to HubSpot
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Description about the action being performed
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-2/3 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          <p className="text-base text-gray-400">
                            Configure Leads
                          </p>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="all"
                                  className="h-6 w-6 focus:bg-black focus:text-white"
                                />
                              </FormControl>
                              <FormLabel className="font-bold">
                                <div>
                                  <h1 className="text-lg">Export All Leads</h1>
                                  <p className="font-normal text-gray-400">
                                    We will stream every lead that is enrolled
                                    from your AgentProd account
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="engaged"
                                  className="h-6 w-6 focus:bg-black focus:text-white"
                                />
                              </FormControl>
                              <FormLabel className="font-bold">
                                <div>
                                  <h1 className="text-lg">
                                    Export Engaged Leads
                                  </h1>
                                  <p className="font-normal text-gray-400">
                                    We will stream every lead that have
                                    responsed to your outbound workflows
                                  </p>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <Separator />
              <div className="flex flex-row gap-4">
                <p className="font-semibold">
                  Avoid outreach to leads that is already in your CRM?{" "}
                </p>
                <Switch />
              </div>
              <DialogFooter>
                <Button
                  variant={"outline"}
                  className="mt-3"
                  onClick={handleCloseAddMailbox}
                >
                  Cancel
                </Button>
                <Button className="mt-3" type="submit">
                  Update
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* {service.isConnected ? (
            <Button variant={"outline"} className="text-sm"> 
              Disconnect
            </Button>
          ) : (
            <Button variant={"outline"} className="text-sm"> 
              Connect
            </Button>
          )} */}
        </CardHeader>
        <CardContent className="space-y-2 mt-2">
          <CardTitle>Zapier</CardTitle>
          <CardDescription>
            Used to interact with the Artisan and receive notifications.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
