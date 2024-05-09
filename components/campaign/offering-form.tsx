"use client"; // This directive must be at the very top

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation"; // Make sure this import is correct for client-only usage
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCampaignContext } from "@/context/campaign-provider";
import axios from "axios"; // Ensure axios is suitable for client-side

// Define the validation schema using Zod
const profileFormSchema = z.object({
  product_offering: z.string().min(2).max(30),
  offering_details: z.string(),
  pain_point: z.array(z.string()), // Handling pain points as an array of strings
  values: z.array(z.string()), // Handling values as an array of strings
});

type OfferingFormValues = z.infer<typeof profileFormSchema>;

export function OfferingForm({ type }: { type: string }) {
  const router = useRouter();
  const params = useParams<{ campaignId: string }>();

  const [formData, setFormData] = useState<OfferingFormValues>({
    product_offering: "",
    offering_details: "",
    pain_point: [
      "People don't want to hire BDRs because they're too expense",
      "you need to use too many platforms to do cold email",
      "cold email requires specialized hires and skills",
      "lead research and personalized email is time consuming",
      "setting up outbound sales takes too long",
    ],
    values: [
      "Our first AI employee, SDR Sally, actively searches for leads within a database of 300 million contacts, analyzing over 60+ data points across the internet.",
      "It crafts and sends personalized email sequences to thousands of prospects after researching their profiles.",
      "Sally responds to inquiries, follows up, and schedules meetings directly into SDRs' calendars while auto updating CRM for all actions taken by AI.",
      "Enabling fully automated and scalable sales.",
      "Reply to any Email in <10 min",
      "Grow your sales pipeline at 10% of cost",
      "Book meetings 10x faster",
      "Put on autopilot",
    ],
  });

  const form = useForm<OfferingFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  const { createOffering, editOffering, getOfferingById } =
    useCampaignContext();

  async function onSubmit(data: OfferingFormValues) {
    if (type === "create") {
      createOffering(data);
    } else if (type === "edit") {
      editOffering(data);
    }
  }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('https://agentprod-backend-framework-9e52.onrender.com/v2/personas/db02731a-cf14-4bb4-b56c-c1b5df9802bc');
  //       setFormData({
  //         product_offering: response.data.product_offering,
  //         offering_details: response.data.offering_details,
  //         pain_point: response.data.pain_point || [],
  //         values: response.data.values || []
  //       });
  //     } catch (error) {
  //       console.error('Failed to fetch data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    if (type === "edit") {
      const id = params.campaignId;
      console.log(id);
      if (id) {
        const offering = getOfferingById(id);
        if (offering) {
          form.setValue("product_offering", offering.product_offering);
          form.setValue("offering_details", offering.offering_details);
        }
      }
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="product_offering"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Offering</FormLabel>
              <FormControl>
                <Input placeholder="Product" {...field} />
              </FormControl>
              <FormDescription>This is your product name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="offering_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details of offers and details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the product and features."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can write details of your product here
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pain_point"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pain Points</FormLabel>
              <FormControl>
                <Textarea placeholder="List pain points" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="values"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Values</FormLabel>
              <FormControl>
                <Textarea placeholder="List values" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Create Offer</Button>
      </form>
    </Form>
  );
}
