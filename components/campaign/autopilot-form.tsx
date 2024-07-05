"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const autopilotFormSchema = z.object({
  all_messages_actions: z.boolean().optional(),
  outbound_sequences: z.boolean().optional(),
  replies: z.boolean().optional(),
  out_of_office: z.boolean().optional(),
  positive: z.boolean().optional(),
  negative: z.boolean().optional(),
  neutral: z.boolean().optional(),
  maybe_later: z.boolean().optional(),
  forwarded: z.boolean().optional(),
  error: z.boolean().optional(),
  demo: z.boolean().optional(),
  not_interested: z.boolean().optional(),
});

type AutopilotFormValues = z.infer<typeof autopilotFormSchema>;

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

const setFormValues = (setValue: any, values: Partial<AutopilotFormValues>) => {
  Object.entries(values).forEach(([key, value]) => {
    setValue(key as keyof AutopilotFormValues, value);
  });
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
    setFormValues(setValue, {
      outbound_sequences: allMessagesActions,
      replies: allMessagesActions,
      out_of_office: allMessagesActions,
      positive: allMessagesActions,
      negative: allMessagesActions,
      neutral: allMessagesActions,
      maybe_later: allMessagesActions,
      forwarded: allMessagesActions,
      error: allMessagesActions,
      demo: allMessagesActions,
      not_interested: allMessagesActions,
    });
  }, [allMessagesActions, setValue]);

  useEffect(() => {
    setFormValues(setValue, {
      out_of_office: reply,
      positive: reply,
      negative: reply,
      neutral: reply,
      maybe_later: reply,
      forwarded: reply,
      error: reply,
      demo: reply,
      not_interested: reply,
    });
  }, [reply, setValue]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}v2/autopilot/${params.campaignId}`
      );
      const data = res.data;
      if (data) {
        setType("edit");
        setFormValues(setValue, {
          outbound_sequences: data.email,
          out_of_office: data.ooo,
          positive: data.positive,
          negative: data.negative,
          neutral: data.neutral,
          maybe_later: data.maybe_later,
          forwarded: data.forwarded,
          error: data.error,
          demo: data.demo,
          not_interested: data.not_interested,
        });
      }
    }
    fetchData();
  }, [params.campaignId, setValue]);

  async function onSubmit(data: AutopilotFormValues) {
    try {
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}v2/autopilot`;
      const payload = { campaign_id: params.campaignId, ...data };

      if (type === "create") {
        await axios.post(url, payload);
        toast.success("Autopilot settings created successfully.");
      } else {
        await axios.put(url, payload);
        toast.success("Autopilot settings updated successfully.");
      }
    } catch {
      toast.error("An error occurred while saving the autopilot settings.");
    }
  }

  const renderSwitchField = (
    name: keyof AutopilotFormValues,
    label: string,
    description: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );

  return (
    <div className="w-4/5 border p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {renderSwitchField(
            "all_messages_actions",
            "All messages and actions",
            "Turn on autopilot for all messages and actions."
          )}
          {renderSwitchField(
            "outbound_sequences",
            "Outbound sequences",
            "First contact and follow-ups as part of a campaign sequence."
          )}
          {renderSwitchField(
            "replies",
            "Replies",
            "Responses and actions to inbound replies."
          )}

          <div className="pl-8 space-y-2">
            {renderSwitchField(
              "out_of_office",
              "Out of office",
              "Follow-up when they are back at work."
            )}
            {renderSwitchField(
              "positive",
              "Positive",
              "Respond towards campaign goal on positive reply."
            )}
            {renderSwitchField(
              "negative",
              "Negative",
              "Respond, mark as lost, and block contact on negative reply."
            )}
            {renderSwitchField(
              "neutral",
              "Neutral",
              "Respond towards campaign goal on neutral reply."
            )}
            {renderSwitchField(
              "maybe_later",
              "Maybe later",
              "Respond and follow-up later towards campaign goal."
            )}
            {renderSwitchField(
              "forwarded",
              "Forwarded",
              "Start a new conversation on forwarded reply."
            )}
            {renderSwitchField(
              "error",
              "Error",
              "Block contact and mark as lost if an email bounces."
            )}
            {renderSwitchField(
              "demo",
              "Demo",
              "Respond, send them a calendar link"
            )}
            {renderSwitchField(
              "not_interested",
              "Not Interested",
              "Respond, ask for any other help and dont send any future campaign emails."
            )}
          </div>

          <Button type="submit">Update notifications</Button>
        </form>
      </Form>
    </div>
  );
}
