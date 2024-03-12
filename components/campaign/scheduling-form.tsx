"use client";

import axios from 'axios';
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
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import React from "react";
import Link from 'next/link';

const campaignTypes = ["Outbound", "Inbound", "Nurturing"];

const accountFormSchema = z.object({
  campaignName: z
    .string()
    .min(2, "Campaign Name must be at least 2 characters.")
    .max(50, "Campaign Name must not be longer than 50 characters."),
  campaignType: z.enum(["Outbound", "Inbouncd", "Nurturing"], {
    required_error: "Please select a campaign type.",
  }),
  dailyOutreach: z.preprocess(
    (value) => {
      // Convert the input value to a number if it's a string
      if (typeof value === "string") {
        return parseInt(value, 10);
      }
      return value;
    },
    z
      .number()
      .min(1, "You must outreach to at least 1 prospect per day.")
      .max(500, "You cannot outreach to more than 500 prospects per day.")
  ),
  schedule: z.object({
    mondayStartTime: z.string().optional(),
    mondayEndTime: z.string().optional(),
    tuesdayStartTime: z.string().optional(),
    tuesdayEndTime: z.string().optional(),
    wednesdayStartTime: z.string().optional(),
    wednesdayEndTime: z.string().optional(),
    thursdayStartTime: z.string().optional(),
    thursdayEndTime: z.string().optional(),
    fridayStartTime: z.string().optional(),
    fridayEndTime: z.string().optional(),
    // Assuming Saturday and Sunday are not working days as per the image
    // If they are, you can add them similarly to the weekdays
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
};

export function SchedulingForm({type}: {type: string}) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  async function onSubmit(data: AccountFormValues) {
    if (type === "create") {
      try {
        const apiRequestBody = {
          campaign_name: data.campaignName,
          status: "Active", 
          start_date: "2024-02-01",
          end_date: "2024-03-01",
          // user_id: "9cbe5057-59fe-4e6e-8399-b9cd85cc9c6c", 
          schedule_type: "Weekly",
          start_time: data.schedule.mondayStartTime || "", 
          end_time: data.schedule.fridayEndTime || "", 
          days_of_week: "Mon,Tue,Wed,Thu,Fri", 
          // description: "Launching our new product line", 
          // additional_details: "Focused on regions with high engagement", 
        };

        // const response = await axios.post('http://localhost:3000/v2/campaigns/', apiRequestBody);
    
        // console.log('Success:', response.data);

        localStorage.setItem('campaignId', "9b0660ce-7333-4315-aa3f-e9b0ed6653c4");
        
        let formsTracker = JSON.parse(localStorage.getItem('formsTracker') || '{}');
        formsTracker.schedulingBudget = true;
        localStorage.setItem('formsTracker', JSON.stringify(formsTracker));
      } catch (error) {
        console.error('Failure:', error);
        toast({
          title: "Error updating campaign",
          description: "There was an error updating your campaign. Please try again.",
        });
      }
    }

    console.log("Data: ", data);

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
                  defaultValue={field.value}
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

        <FormField
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
        />

        {/* Dynamically create a time input for each day */}
        <h1>Schedule</h1>
        {["monday", "tuesday", "wednesday", "thursday", "friday"].map((day) => (
          <div key={day} className="flex w-[400px] justify-between">
            <h1>{day.charAt(0).toUpperCase() + day.slice(1)}:</h1>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                //@ts-ignore
                name={`schedule.${day}StartTime`}
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
                name={`schedule.${day}EndTime`}
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
        ))}

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
