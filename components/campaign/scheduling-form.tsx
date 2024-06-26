/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
"use client";

import { useRouter, useParams } from "next/navigation";
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
import React, { useEffect, useState } from "react";
import {
  CampaignFormData,
  useCampaignContext,
} from "@/context/campaign-provider";
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
  schedule: z.object({
    weekdayStartTime: z.string().optional(),
    weekdayEndTime: z.string().optional(),
  }),
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

const defaultValues: Partial<CampaignFormValues> = {};

export function SchedulingForm() {
  const router = useRouter();
  const params = useParams<{ campaignId: string }>();
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues,
  });
  const defaultFormsTracker = {
    schedulingBudget: true,
    offering: false,
    goal: false,
    audience: false,
    training: false,
  };

  const { createCampaign, editCampaign } = useCampaignContext();
  const { user } = useUserContext();
  const watchAllFields = form.watch();
  const [campaignData, setCampaignData] = useState<CampaignEntry>();
  const { setPageCompletion } = useButtonStatus();
  const [type, setType] = useState<"create" | "edit">("create");
  const [formsTracker, setFormsTracker] = useState(defaultFormsTracker);

  const onSubmit = async (data: CampaignFormValues) => {
    if (type === "create") {
      await createCampaign(data);
      toast.success("Campaign is scheduled successfully!");
      // setPageCompletion("scheduling-budget", true);
      const updatedFormsTracker = {
        schedulingBudget: true,
        offering: true,
      };
      localStorage.setItem("formsTracker", JSON.stringify(updatedFormsTracker));
      setFormsTracker((prevFormsTracker) => ({
        ...prevFormsTracker,
        ...updatedFormsTracker,
      }));
    } else if (type === "edit") {
      const changes = Object.keys(data).reduce((acc, key) => {
        const propertyKey = key as keyof CampaignFormValues;
        if (
          JSON.stringify(data[propertyKey]) !==
          JSON.stringify(watchAllFields[propertyKey])
        ) {
          acc = { ...acc, [propertyKey]: data[propertyKey] };
        }
        return acc;
      }, {} as CampaignFormValues);

      await editCampaign(changes, params.campaignId);
      toast.success("Campaign is updated successfully!");

      const updatedFormsTracker = {
        schedulingBudget: true,
        offering: true,
      };
      localStorage.setItem("formsTracker", JSON.stringify(updatedFormsTracker));
      setFormsTracker((prevFormsTracker) => ({
        ...prevFormsTracker,
        ...updatedFormsTracker,
      }));
    }
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      const id = params.campaignId;
      if (id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}v2/campaigns/${params.campaignId}`
          );
          const data = await response.json();
          if (data.detail === "Campaign not found") {
            setType("create");
          } else {
            setCampaignData(data as CampaignEntry);
            setType("edit");
          }
        } catch (error) {
          console.error("Error fetching campaign:", error);
        }
      }
    };

    fetchCampaign();
  }, [params.campaignId]);

  useEffect(() => {
    if (campaignData) {
      form.setValue("campaignName", campaignData.campaign_name);
      form.setValue(
        "campaignType",
        campaignData.campaign_type as "Outbound" | "Inbound" | "Nurturing"
      );

      const processTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(":").map(Number);
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
                  {campaignTypes.map((type) => (
                    <FormItem
                      key={type}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={type} />
                      </FormControl>
                      <FormLabel className="font-normal">{type}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h1>Schedule</h1>
        <div className="flex w-[400px] justify-between">
          <h1>Weekdays</h1>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name={`schedule.weekdayStartTime`}
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage>{error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`schedule.weekdayEndTime`}
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormControl>
                    <Input type="time" placeholder="End Time" {...field} />
                  </FormControl>
                  <FormMessage>{error?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">
          {type === "create" ? "Add" : "Update"} Campaign
        </Button>
      </form>
    </Form>
  );
}
