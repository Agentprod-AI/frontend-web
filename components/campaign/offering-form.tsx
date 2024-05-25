"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea"; // Adjust the import path as needed
import {
  useCampaignContext,
  OfferingFormData,
} from "@/context/campaign-provider";
import {
  getOfferingById,
  getPersonaByUserId,
  createPersona,
} from "./camapign.api";
import { useUserContext } from "@/context/user-context";
import { CompanyProfile } from "@/components/campaign/company-profile"; // Adjust the import path as needed

const profileFormSchema = z.object({
  product_offering: z.string(),
  pain_point: z.array(z.string()),
  values: z.array(z.string()),
  customer_success_stories: z.array(z.string()),
  detailed_product_description: z.string(),
});

type OfferingFormValues = z.infer<typeof profileFormSchema>;

export function OfferingForm({ type }: { type: string }) {
  const router = useRouter();
  const params = useParams<{ campaignId: string }>();

  const { user } = useUserContext();

  const form = useForm<OfferingFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      product_offering: "",
      pain_point: [""],
      values: [""],
      customer_success_stories: [""],
      detailed_product_description: "",
    },
    mode: "onChange",
  });

  const fetchPersona = async () => {
    if (user?.id) {
      const persona = await getPersonaByUserId(user.id);
      if (persona) {
        form.setValue("pain_point", persona.pain_point);
        form.setValue("values", persona.values);
        form.setValue(
          "customer_success_stories",
          persona.customer_success_stories || [""]
        );
        form.setValue(
          "detailed_product_description",
          persona.detailed_product_description
        );
      }
    }
  };

  useEffect(() => {
    fetchPersona();
  }, [user]);

  const { createOffering, editOffering } = useCampaignContext();
  const [offeringData, setOfferingData] = useState<OfferingFormData>();

  const onSubmit = async (data: OfferingFormValues) => {
    const postData = {
      user_id: user?.id,
      campaign_id: params.campaignId,
      pain_point: data.pain_point,
      values: data.values,
      customer_success_stories: data.customer_success_stories,
      detailed_product_description: data.detailed_product_description,
    };

    createPersona(postData)
      .then(() => {
        if (type === "create") {
          createOffering(
            {
              name: data.product_offering,
              details: data.detailed_product_description,
            },
            params.campaignId
          );
        } else if (type === "edit") {
          editOffering(
            {
              name: data.product_offering,
              details: data.detailed_product_description,
            },
            params.campaignId
          );
        }
      })
      .catch((error) => {
        console.error("Error creating persona:", error);
      });
  };

  useEffect(() => {
    const fetchOffering = async () => {
      if (type === "edit") {
        const id = params.campaignId;
        if (id) {
          const offering = await getOfferingById(id);
          setOfferingData(offering || undefined);
        }
      }
    };

    fetchOffering();
  }, [params.campaignId]);

  useEffect(() => {
    if (offeringData) {
      form.setValue("product_offering", offeringData?.name);
    }
  }, [offeringData]);

  const transformToCompanyProfile = (
    data: string[],
    label: string,
    actionLabel: string
  ) => {
    return {
      label: label,
      items: data,
      actionLabel: actionLabel,
    };
  };

  const handleCompanyProfileChange = (
    newValue: any[],
    fieldName: "pain_point" | "values" | "customer_success_stories"
  ) => {
    const updatedValue = newValue[0].items || [];
    form.setValue(fieldName, updatedValue, { shouldValidate: false });
  };

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
        <h1 className="text-2xl font-bold tracking-tight mb-4">
          Company Profile
        </h1>
        <FormField
          control={form.control}
          name="detailed_product_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Product Description</FormLabel>
              <FormControl>
                <Textarea
                  className="h-40"
                  placeholder="Detailed description of the product"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of your product here.
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
                <CompanyProfile
                  value={[
                    transformToCompanyProfile(
                      field.value,
                      "Pain Points",
                      "Pain Point"
                    ),
                  ]}
                  onChange={(newValue) =>
                    handleCompanyProfileChange(newValue, "pain_point")
                  }
                />
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
                <CompanyProfile
                  value={[
                    transformToCompanyProfile(field.value, "Values", "Value"),
                  ]}
                  onChange={(newValue) =>
                    handleCompanyProfileChange(newValue, "values")
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customer_success_stories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Proof</FormLabel>
              <FormControl>
                <CompanyProfile
                  value={[
                    transformToCompanyProfile(
                      field.value,
                      "Social Proof",
                      "Success Story"
                    ),
                  ]}
                  onChange={(newValue) =>
                    handleCompanyProfileChange(
                      newValue,
                      "customer_success_stories"
                    )
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Create Offer</Button>
      </form>
    </Form>
  );
}
