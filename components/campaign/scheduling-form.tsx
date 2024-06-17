/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
"use client";

import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import React, { useState } from "react";
import Link from "next/link";
import {
  CampaignFormData,
  useCampaignContext,
} from "@/context/campaign-provider";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "@/context/user-context";
import { getCampaignById } from "./camapign.api";
import { CampaignEntry } from "@/context/campaign-provider";
import { useButtonStatus } from "@/context/button-status";

const campaignTypes = ["Outbound", "Inbound", "Nurturing"];

const campaignFormSchema = z.object({
  campaignName: z
    .string()
    .min(2, "Campaign Name must be at least 2 characters.")
    .max(50, "Campaign Name must not be longer than 50 characters."),
  campaignType: z.enum(["Outbound", "Inbound", "Nurturing"], {
    required_error: "Please select a campaign type.",
  }),
  // dailyOutreach: z.preprocess(
  //   (value) => {
  //     // Convert the input value to a number if it's a string
  //     if (typeof value === "string") {
  //       return parseInt(value, 10);
  //     }
  //     return value;
  //   },
  //   z
  //     .number()
  //     .min(1, "You must outreach to at least 1 prospect per day.")
  //     .max(500, "You cannot outreach to more than 500 prospects per day.")
  // ),
  schedule: z.object({
    weekdayStartTime: z.string().optional(),
    weekdayEndTime: z.string().optional(),
  }),
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<CampaignFormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
};

export function SchedulingForm({ type }: { type: string }) {
  const router = useRouter();
  const params = useParams<{ campaignId: string }>();

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues,
  });

  const { createCampaign, editCampaign } = useCampaignContext();
  const { user } = useUserContext();
  // console.log("SchedulingForm", user);
  const watchAllFields = form.watch();

  const [campaignData, setCampaignData] = useState<CampaignEntry>();
  const { setPageCompletion } = useButtonStatus();

  const onSubmit = async (data: CampaignFormValues) => {
    if (type === "create") {
      createCampaign(data);
      toast.success("Campaign is scheduled successfully!");
      setPageCompletion("scheduling-budget", true); // Set the page completion to true
    } else {
      const changes = Object.keys(data).reduce((acc, key) => {
        // Ensure the correct key type is used
        const propertyKey = key as keyof CampaignFormValues;

        // Compare the stringified versions of the current and previous values
        if (
          JSON.stringify(data[propertyKey]) !==
          JSON.stringify(watchAllFields[propertyKey])
        ) {
          // Assign only if types are compatible
          acc = { ...acc, [propertyKey]: data[propertyKey] };
        }
        return acc;
      }, {} as CampaignFormValues);

      if (Object.keys(changes).length > 0) {
        editCampaign(changes, params.campaignId);
      } else {
        console.log("No changes detected.");
        // Handle no changes scenario
      }
    }
  };

  React.useEffect(() => {
    const fetchCampaign = async () => {
      if (type === "edit") {
        const id = params.campaignId;
        console.log("id in scheduling form", id);
        if (id) {
          const campaign = await getCampaignById(id);
          console.log("campaign in scheduling form", campaign);
          if (campaign) {
            setCampaignData(campaign as CampaignEntry);
          }
        }
      }
    };

    fetchCampaign();
  }, [params.campaignId, getCampaignById]);

  React.useEffect(() => {
    if (campaignData) {
      form.setValue("campaignName", campaignData.campaign_name);
      form.setValue(
        "campaignType",
        campaignData.campaign_type as "Outbound" | "Inbound" | "Nurturing"
      );

      const processTime = (timeString: string) => {
        const [hours, minutes, seconds] = timeString.split(":").map(Number);

        const paddedHours = String(hours).padStart(2, "0");
        const paddedMinutes = String(minutes).padStart(2, "0");

        return `${paddedHours}:${paddedMinutes}`;
      };

      if (campaignData.monday_start && campaignData.monday_end) {
        form.setValue(
          "schedule.weekdayStartTime",
          processTime(campaignData.monday_start)
        );
        form.setValue(
          "schedule.weekdayEndTime",
          processTime(campaignData.monday_end)
        );
      }
    }
  }, [campaignData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-5">
        <FormField
          control={form.control}
          name="campaignName"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="Campaign Name" {...field} />
              </FormControl>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="campaignType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Campaign Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || campaignData?.campaign_type}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Outbound" />
                    </FormControl>
                    <FormLabel className="font-normal">Outbound</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Inbound" />
                    </FormControl>
                    <FormLabel className="font-normal">Inbound</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Nurturing" />
                    </FormControl>
                    <FormLabel className="font-normal">Nurturing</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="dailyOutreach"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Daily Outreach</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Number of daily outreach"
                  {...field}
                />
              </FormControl>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        /> */}

        {/* Dynamically create a time input for each day */}
        <h1>Schedule</h1>
        <div className="flex w-[400px] justify-between">
          <h1>Weekdays</h1>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              //@ts-ignore
              name={`schedule.weekdayStartTime`}
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  {/* <FormLabel>{`${
                    day.charAt(0).toUpperCase() + day.slice(1)
                  } Start Time`}</FormLabel> */}
                  <FormControl>
                    {/* @ts-ignore */}
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage>{error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              //@ts-ignore
              name={`schedule.weekdayEndTime`}
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  {/* <FormLabel>{`${
                    day.charAt(0).toUpperCase() + day.slice(1)
                  } End Time`}</FormLabel> */}
                  <FormControl>
                    {/* @ts-ignore */}
                    <Input type="time" placeholder="End Time" {...field} />
                  </FormControl>
                  <FormMessage>{error?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit">
          {/* {
            type === "create" ?
            <a href="/dashboard/campaign/create">
              Add Campagin
            </a> :
            "Update Campagin"
          } */}
          {type === "create" ? "Add" : "Update"} Campaign
        </Button>
      </form>
    </Form>
  );
}
