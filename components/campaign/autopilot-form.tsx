"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { nullable, z } from "zod";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import axios from "axios";

const autopilotFormSchema = z.object({
  all_messages_actions: z.boolean().default(false).optional(),
  outbound_sequences: z.boolean().default(false).optional(),
  replies: z.boolean().default(false).optional(),
  out_of_office: z.boolean().default(false).optional(),
  positive: z.boolean().default(false).optional(),
  negative: z.boolean().default(false).optional(),
  neutral: z.boolean().default(false).optional(),
  maybe_later: z.boolean().default(false).optional(),
  forwarded: z.boolean().default(false).optional(),
  error: z.boolean().default(false).optional(),
  demo: z.boolean().default(false).optional(),
  not_interested: z.boolean().default(false).optional(),
});

type AutopilotFormValues = z.infer<typeof autopilotFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AutopilotFormValues> = {
  all_messages_actions: false,
  outbound_sequences: false,
  replies: false,
  out_of_office: false,
  positive: false,
  negative: false,
  neutral: false,
  maybe_later: false,
  forwarded: false,
  error: false,
  demo: false,
  not_interested: false,
};

export function AutopilotForm() {
  const params = useParams<{ campaignId: string }>();
  const [type, setType] = useState<"create" | "edit">("create");

  const form = useForm<AutopilotFormValues>({
    resolver: zodResolver(autopilotFormSchema),
    defaultValues,
  });
  const { setValue, watch } = form;
  const allMessagesActions = watch("all_messages_actions");
  const reply = watch("replies");

  useEffect(() => {
    const setAllValues = (value: boolean) => {
      setValue("outbound_sequences", value);
      setValue("replies", value);
      setValue("out_of_office", value);
      setValue("positive", value);
      setValue("negative", value);
      setValue("neutral", value);
      setValue("maybe_later", value);
      setValue("forwarded", value);
      setValue("error", value);
      setValue("demo", value);
      setValue("not_interested", value);
    };

    if (allMessagesActions) {
      setAllValues(true);
    } else {
      setAllValues(false);
    }
  }, [allMessagesActions, setValue]);

  useEffect(() => {
    const setReplyValues = (value: boolean) => {
      setValue("out_of_office", value);
      setValue("positive", value);
      setValue("negative", value);
      setValue("neutral", value);
      setValue("maybe_later", value);
      setValue("forwarded", value);
      setValue("error", value);
      setValue("demo", value);
      setValue("not_interested", value);
    };

    if (reply) {
      setReplyValues(true);
    } else {
      setReplyValues(false);
    }
  }, [reply, setValue]);

  useEffect(() => {
    async function call() {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}v2/autopilot/${params.campaignId}`
      );
      if (res.data === null) {
        setType("create");
      } else {
        setType("edit");
        const data = res.data;
        setValue("outbound_sequences", data.email ?? false);
        setValue("out_of_office", data.ooo ?? false);
        setValue("positive", data.positive ?? false);
        setValue("negative", data.negative ?? false);
        setValue("neutral", data.neutral ?? false);
        setValue("maybe_later", data.maybe_later ?? false);
        setValue("forwarded", data.forwarded ?? false);
        setValue("error", data.error ?? false);
        setValue("demo", data.demo ?? false);
        setValue("not_interested", data.not_interested ?? false);
        toast.success("Autopilot settings loaded successfully.");
      }
    }
    call();
  }, []);

  async function onSubmit(data: AutopilotFormValues) {
    try {
      if (type === "create") {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}v2/autopilot`, {
          campaign_id: params.campaignId,
          demo: data.demo,
          not_interested: data.not_interested,
          email: data.outbound_sequences,
          ooo: data.out_of_office,
          positive: data.positive,
          negative: data.negative,
          neutral: data.neutral,
          maybe_later: data.maybe_later,
          forwarded: data.forwarded,
          error: data.error,
        });
        toast.success("Autopilot settings created successfully.");
      } else {
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}v2/autopilot`, {
          campaign_id: params.campaignId,
          demo: data.demo,
          not_interested: data.not_interested,
          email: data.outbound_sequences,
          ooo: data.out_of_office,
          positive: data.positive,
          negative: data.negative,
          neutral: data.neutral,
          maybe_later: data.maybe_later,
          forwarded: data.forwarded,
          error: data.error,
        });
        toast.success("Autopilot settings updated successfully.");
      }
    } catch (error) {
      toast.error("An error occurred while saving the autopilot settings.");
    }
  }

  return (
    <div className="w-4/5 border p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="all_messages_actions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      All messages and actions
                    </FormLabel>
                    <FormDescription>
                      Turn on autopilot for all messages and actions.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="outbound_sequences"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Outbound sequences
                    </FormLabel>
                    <FormDescription>
                      First contact and follow-ups as part of a campaign
                      sequence.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="replies"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Replies</FormLabel>
                    <FormDescription>
                      Responses and actions to inbound replies.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="pl-8 space-y-2">
              <FormField
                control={form.control}
                name="out_of_office"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Out of office</FormLabel>
                      <FormDescription>
                        Follow-up when they are back at work.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Positive</FormLabel>
                      <FormDescription>
                        Respond towards campaign goal on positive reply.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="negative"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Negative</FormLabel>
                      <FormDescription>
                        Respond, mark as lost, and block contact on negative
                        reply.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neutral"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Neutral</FormLabel>
                      <FormDescription>
                        Respond towards campaign goal on neutral reply.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maybe_later"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Maybe later</FormLabel>
                      <FormDescription>
                        Respond and follow-up later towards campaign goal.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="forwarded"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Forwarded</FormLabel>
                      <FormDescription>
                        Start a new conversation on forwarded reply.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="error"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Error</FormLabel>
                      <FormDescription>
                        Block contact and mark as lost if an email bounces.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="demo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Demo</FormLabel>
                      <FormDescription>
                        {/* Block contact and mark as lost if an email bounces. */}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="not_interested"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Not Interested
                      </FormLabel>
                      <FormDescription>
                        {/* Block contact and mark as lost if an email bounces. */}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit">Update notifications</Button>
        </form>
      </Form>
    </div>
  );
}
