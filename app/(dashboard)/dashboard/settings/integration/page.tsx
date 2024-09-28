/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
"use client";
import React from "react";
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
  LoadingCircle,
  SalesForceIcon,
  SlackIcon,
  ZapierIcon,
  ZohoIcon,
  PipedriveIcon,
} from "@/app/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
// import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  hubspotLogin,
  salesforceLogin,
  slackLogin,
  zohoLogin,
  pipedriveLogin,
} from ".";
import { useUserContext } from "@/context/user-context";
import axiosInstance from "@/utils/axiosInstance";

import { toast } from "sonner";

const FormSchema = z.object({
  type: z.enum(["all", "engaged"], {
    required_error: "You need to select a notification type.",
  }),
});

export default function Page() {
  const [isHubspotMailboxOpen, setIsHubspotMailboxOpen] = React.useState(false);
  const [isConnectedToHubspot, setIsConnectedToHubspot] = React.useState(false);

  const [isZohoMailboxOpen, setIsZohoMailboxOpen] = React.useState(false);
  const [isConnectedToZoho, setIsConnectedToZoho] = React.useState(false);

  const [isPipedriveMailboxOpen, setIsPipedriveMailboxOpen] =
    React.useState(false);
  const [isConnectedToPipedrive, setIsConnectedToPipedrive] =
    React.useState(false);

  const [isSalesforceMailboxOpen, setIsSalesforceMailboxOpen] =
    React.useState(false);
  const [isConnectedToSalesforce, setIsConnectedToSalesforce] =
    React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [selectedHubspotLeadType, setSelectedHubspotLeadType] =
    React.useState("all");
  const [selectedZohoLeadType, setSelectedZohoLeadType] = React.useState("all");
  const [selectedPipedriveLeadType, setSelectedPipedriveType] =
    React.useState("all");
  const { user } = useUserContext();

  const updateHubspotLeadType = async () => {
    setLoading(true);
    const payload = {
      user_id: user.id,
    };
    console.log("Payload:", payload);
    try {
      const response = await axiosInstance.post("v2/hubspot/export", payload);
      console.log("HubSpot Lead Type Updated:", response.data);
      setLoading(false);
      toast.success("HubSpot lead type updated successfully");
      setIsHubspotMailboxOpen(false);
    } catch (error) {
      console.error("Failed to update HubSpot lead type:", error);
      throw error;
    }
  };

  const updateSaleforceLeadType = async () => {
    setLoading(true);
    const payload = {
      user_id: user.id,
    };
    console.log("Payload:", payload);
    try {
      const response = await axiosInstance.post(
        "v2/salesforce/export",
        payload
      );
      console.log("Salesforce Lead Type Updated:", response.data);
      setLoading(false);
      toast.success("Salesforce lead type updated successfully");
      setIsSalesforceMailboxOpen(false);
    } catch (error) {
      console.error("Failed to update Salesforce lead type:", error);
      throw error;
    }
  };

  const updateZohoLeadType = async () => {
    setLoading(true);
    const payload = {
      user_id: user.id,
    };
    console.log("Payload:", payload);
    try {
      const response = await axiosInstance.post(
        "v2/zoho/upsert/contacts",
        payload
      );
      console.log("Zoho Lead Type Updated:", response.data);
      setLoading(false);
      toast.success("Zoho lead type updated successfully");
      setIsZohoMailboxOpen(false);
    } catch (error) {
      console.error("Failed to update Zoho lead type:", error);
      throw error;
    }
  };

  const updatePipedriveLeadType = async () => {
    setLoading(true);
    const payload = {
      user_id: user.id,
    };
    console.log("Payload:", payload);
    try {
      const response = await axiosInstance.post(
        "v2/pipedrive/upsert/contacts",
        payload
      );
      console.log("Pipedrive Lead Type Updated:", response.data);
      setLoading(false);
      toast.success("Pipedrive lead type updated successfully");
      setIsPipedriveMailboxOpen(false);
    } catch (error) {
      console.error("Failed to update Pipedrive lead type:", error);
      throw error;
    }
  };

  // closing dialogbox
  const handleCloseHubspotMailbox = () => setIsHubspotMailboxOpen(false);
  const handleCloseSalesforceMailbox = () => setIsSalesforceMailboxOpen(false);
  const handleCloseZohoMailbox = () => setIsZohoMailboxOpen(false);
  const handleClosePipedriveMailbox = () => setIsPipedriveMailboxOpen(false);
  // closing dialogbox

  React.useEffect(() => {
    const fetchHubSpotStatus = async (): Promise<any> => {
      try {
        const response = await axiosInstance.post(`v2/hubspot/status/`, {
          user_id: user.id,
          platform: "hubspot",
        });
        setIsConnectedToHubspot(response.data.message);
      } catch (error) {
        console.error("Failed to fetch HubSpot status:", error);
        throw error;
      }
    };

    const fetchSalesforceStatus = async (): Promise<any> => {
      try {
        const response = await axiosInstance.post(`v2/hubspot/status/`, {
          user_id: user.id,
          platform: "salesforce",
        });
        setIsConnectedToSalesforce(response.data.message);
      } catch (error) {
        console.error("Failed to fetch salesforce status:", error);
        throw error;
      }
    };

    const fetchZohoStatus = async (): Promise<any> => {
      try {
        const response = await axiosInstance.post(`v2/hubspot/status`, {
          user_id: user.id,
          platform: "zoho",
        });
        setIsConnectedToZoho(response.data.message);
      } catch (error) {
        console.error("Failed to fetch zoho status:", error);
        throw error;
      }
    };

    const fetchPipedriveStatus = async (): Promise<any> => {
      try {
        const response = await axiosInstance.post(`v2/hubspot/status`, {
          user_id: user.id,
          platform: "pipedrive",
        });
        setIsConnectedToPipedrive(response.data.message);
      } catch (error) {
        console.error("Failed to fetch pipedrive status:", error);
        throw error;
      }
    };

    fetchSalesforceStatus();
    fetchHubSpotStatus();
    fetchZohoStatus();
    fetchPipedriveStatus();
  }, []);

  const handleHubspotConnect = async () => {
    if (isConnectedToHubspot) {
      setIsHubspotMailboxOpen(true);
    } else {
      hubspotLogin(user.id);
    }
  };

  const handleSalesforceConnect = async () => {
    if (isConnectedToSalesforce) {
      setIsSalesforceMailboxOpen(true);
    } else {
      salesforceLogin(user.id);
    }
  };

  const handleZohoConnect = async () => {
    if (isConnectedToZoho) {
      setIsZohoMailboxOpen(true);
    } else {
      zohoLogin(user.id);
    }
  };

  const handlePipedriveConnect = async () => {
    if (isConnectedToPipedrive) {
      setIsPipedriveMailboxOpen(true);
    } else {
      pipedriveLogin(user.id);
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Slack Card Started Here */}
      <Card>
        <CardHeader className="flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <SlackIcon />
            <div
              className={`text-sm border rounded-lg text-center p-2 cursor-pointer`}
              onClick={() => {
                slackLogin();
              }}
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
                <form className="w-2/3 space-y-6">
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
                  onClick={handleCloseHubspotMailbox}
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
            Used to interact with the AgentProd and receive notifications.
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
                setIsHubspotMailboxOpen(true);
              }}
            >
              {isConnectedToHubspot ? "Connected" : "Connect"}
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

              <div>
                <div className="w-full space-y-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-base text-gray-400">
                          Configure Leads
                        </p>
                      </div>
                      <div>
                        <RadioGroup
                          value={selectedHubspotLeadType}
                          onValueChange={setSelectedHubspotLeadType}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-3 space-y-0">
                            <div>
                              <RadioGroupItem value="all" className="h-6 w-6" />
                            </div>
                            <div className="font-bold">
                              <div>
                                <h1 className="text-lg">Export All Leads</h1>
                                <p className="font-normal text-gray-400">
                                  We will stream every lead that is enrolled
                                  from your AgentProd account
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 space-y-0">
                            <div>
                              <RadioGroupItem
                                value="engaged"
                                className="h-6 w-6"
                              />
                            </div>
                            <div className="font-bold">
                              <div>
                                <h1 className="text-lg">
                                  Export Engaged Leads
                                </h1>
                                <p className="font-normal text-gray-400">
                                  We will stream every lead that have responsed
                                  to your outbound workflows
                                </p>
                              </div>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  onClick={handleCloseHubspotMailbox}
                >
                  Cancel
                </Button>
                <Button
                  className="mt-3"
                  type="submit"
                  onClick={() => {
                    if (!isConnectedToHubspot) {
                      handleHubspotConnect();
                      setTimeout(() => updateHubspotLeadType(), 100000);
                    } else {
                      updateHubspotLeadType();
                    }
                  }}
                >
                  {loading ? (
                    <LoadingCircle />
                  ) : isConnectedToHubspot ? (
                    "Update"
                  ) : (
                    "Login"
                  )}
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
            Used to interact with the AgentProd and receive notifications.
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
              className={`text-sm border rounded-lg text-center p-2 cursor-not-allowed`}
              onClick={() => {}}
            >
              Coming Soon
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
                  // onSubmit={form.handleSubmit(onSubmit)}
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
                  onClick={handleCloseHubspotMailbox}
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
            Used to interact with the AgentProd and receive notifications.
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
              onClick={() => {
                handleSalesforceConnect();
              }}
            >
              {isConnectedToSalesforce ? "Connected" : "Connect"}
            </div>
          </div>
          <Dialog
            open={isSalesforceMailboxOpen}
            onOpenChange={setIsSalesforceMailboxOpen}
          >
            <DialogContent className="w-full">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex flex-col gap-4 mb-1">
                    <div className="flex justify-center items-center flex-row gap-3">
                      <Image src={logo} alt="logo" width={40} height={40} />
                      <ArrowLeftRight />
                      <SalesForceIcon />
                    </div>
                    Export AgentProd Leads to Salesforce
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Description about the action being performed
                </DialogDescription>
              </DialogHeader>
              <Separator />

              <div>
                <div className="w-full space-y-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-base text-gray-400">
                          Configure Leads
                        </p>
                      </div>
                      <div>
                        <RadioGroup
                          value={selectedHubspotLeadType}
                          onValueChange={setSelectedHubspotLeadType}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-3 space-y-0">
                            <div>
                              <RadioGroupItem value="all" className="h-6 w-6" />
                            </div>
                            <div className="font-bold">
                              <div>
                                <h1 className="text-lg">Export All Leads</h1>
                                <p className="font-normal text-gray-400">
                                  We will stream every lead that is enrolled
                                  from your AgentProd account
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 space-y-0">
                            <div>
                              <RadioGroupItem
                                value="engaged"
                                className="h-6 w-6"
                              />
                            </div>
                            <div className="font-bold">
                              <div>
                                <h1 className="text-lg">
                                  Export Engaged Leads
                                </h1>
                                <p className="font-normal text-gray-400">
                                  We will stream every lead that have responsed
                                  to your outbound workflows
                                </p>
                              </div>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  onClick={handleCloseSalesforceMailbox}
                >
                  Cancel
                </Button>
                <Button
                  className="mt-3"
                  type="submit"
                  onClick={() => updateSaleforceLeadType()}
                >
                  {loading ? <LoadingCircle /> : "Update"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-2 mt-2">
          <CardTitle>Salesforce</CardTitle>
          <CardDescription>
            Used to interact with the AgentProd and receive notifications.
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
              className={`text-sm border rounded-lg text-center p-2 cursor-not-allowed`}
              onClick={() => {}}
            >
              Coming Soon
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
                  // onSubmit={form.handleSubmit(onSubmit)}
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
                  onClick={handleCloseHubspotMailbox}
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
            Used to interact with the AgentProd and receive notifications.
          </CardDescription>
        </CardContent>
      </Card>
      {/* Zoho Card */}
      <Card>
        <CardHeader className="flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="w-1/2">
              <ZohoIcon />
            </div>
            <div
              className={`text-sm border rounded-lg text-center p-2 cursor-pointer`}
              onClick={() => handleZohoConnect()}
            >
              {isConnectedToZoho ? "Connected" : "Connect"}
            </div>
          </div>
          <Dialog open={isZohoMailboxOpen} onOpenChange={setIsZohoMailboxOpen}>
            <DialogContent className="w-full">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex flex-col gap-4 mb-1">
                    <div className="flex justify-center items-center flex-row gap-3">
                      <Image src={logo} alt="logo" width={40} height={40} />
                      <ArrowLeftRight />
                      <div className="w-28">
                        <ZohoIcon />
                      </div>
                    </div>
                    Export AgentProd Leads to Zoho
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Configure how you want to export leads to Zoho
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <div>
                <div className="w-full space-y-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-base text-gray-400">
                          Configure Leads
                        </p>
                      </div>
                      <div>
                        <RadioGroup
                          value={selectedZohoLeadType}
                          onValueChange={setSelectedZohoLeadType}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-3 space-y-0">
                            <div>
                              <RadioGroupItem value="all" className="h-6 w-6" />
                            </div>
                            <div className="font-bold">
                              <div>
                                <h1 className="text-lg">Export All Leads</h1>
                                <p className="font-normal text-gray-400">
                                  We will stream every lead that is enrolled
                                  from your AgentProd account
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 space-y-0">
                            <div>
                              <RadioGroupItem
                                value="engaged"
                                className="h-6 w-6"
                              />
                            </div>
                            <div className="font-bold">
                              <div>
                                <h1 className="text-lg">
                                  Export Engaged Leads
                                </h1>
                                <p className="font-normal text-gray-400">
                                  We will stream every lead that have responsed
                                  to your outbound workflows
                                </p>
                              </div>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <DialogFooter>
                <Button
                  variant={"outline"}
                  className="mt-3"
                  onClick={handleCloseZohoMailbox}
                >
                  Cancel
                </Button>
                <Button
                  className="mt-3"
                  type="submit"
                  onClick={() => updateZohoLeadType()}
                >
                  {loading ? <LoadingCircle /> : "Update"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-2 mt-2">
          <CardTitle>Zoho</CardTitle>
          <CardDescription>
            Used to interact with the AgentProd and receive notifications.
          </CardDescription>
        </CardContent>
      </Card>

      {/* Pipedrive Card */}
      <Card>
        <CardHeader className="flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <PipedriveIcon />
            <div
              className={`text-sm border rounded-lg text-center p-2 cursor-pointer`}
              onClick={() => handlePipedriveConnect()}
            >
              {isConnectedToPipedrive ? "Connected" : "Connect"}
            </div>
          </div>
          <Dialog
            open={isPipedriveMailboxOpen}
            onOpenChange={setIsPipedriveMailboxOpen}
          >
            <DialogContent className="w-full">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex flex-col gap-4 mb-1">
                    <div className="flex justify-center items-center flex-row gap-3">
                      <Image src={logo} alt="logo" width={40} height={40} />
                      <ArrowLeftRight />
                      <div className="w-44">
                        <PipedriveIcon />
                      </div>
                    </div>
                    Export AgentProd Leads to Pipedrive
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Configure how you want to export leads to Pipedrive
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <div>
                <div className="w-full space-y-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-base text-gray-400">
                          Configure Leads
                        </p>
                      </div>
                      <div>
                        <RadioGroup
                          value={selectedZohoLeadType}
                          onValueChange={setSelectedZohoLeadType}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-3 space-y-0">
                            <div>
                              <RadioGroupItem value="all" className="h-6 w-6" />
                            </div>
                            <div className="font-bold">
                              <div>
                                <h1 className="text-lg">Export All Leads</h1>
                                <p className="font-normal text-gray-400">
                                  We will stream every lead that is enrolled
                                  from your AgentProd account
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 space-y-0">
                            <div>
                              <RadioGroupItem
                                value="engaged"
                                className="h-6 w-6"
                              />
                            </div>
                            <div className="font-bold">
                              <div>
                                <h1 className="text-lg">
                                  Export Engaged Leads
                                </h1>
                                <p className="font-normal text-gray-400">
                                  We will stream every lead that have responsed
                                  to your outbound workflows
                                </p>
                              </div>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant={"outline"}
                  className="mt-3"
                  onClick={handleClosePipedriveMailbox}
                >
                  Cancel
                </Button>
                <Button
                  className="mt-3"
                  type="submit"
                  onClick={() => updatePipedriveLeadType()}
                >
                  {loading ? <LoadingCircle /> : "Update"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-2 mt-2">
          <CardTitle>Pipedrive</CardTitle>
          <CardDescription>
            Used to interact with the AgentProd and receive notifications.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
