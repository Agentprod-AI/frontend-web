"use client";

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

const campaignTypes = ["Outbound", "Inbound", "Nurturing"];

const accountFormSchema = z.object({
  campaignName: z
    .string()
    .min(2, "Campaign Name must be at least 2 characters.")
    .max(50, "Campaign Name must not be longer than 50 characters."),
  campaignType: z.enum(["Outbound", "Inbound", "Nurturing"], {
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
      .max(500, "You cannot outreach to more than 500 prospects per day."),
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

export function SchedulingForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  function onSubmit(data: AccountFormValues) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

        <Button type="submit">Update Campaign</Button>
      </form>
    </Form>
  );
}
