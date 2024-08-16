/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCampaignContext,
  OfferingFormData,
} from "@/context/campaign-provider";
import {
  getOfferingById,
  getPersonaByUserId,
  createPersona,
  getPersonaByCampaignId,
  editPersona,
} from "./camapign.api";
import { useUserContext } from "@/context/user-context";
import { CompanyProfile } from "@/components/campaign/company-profile";
import { toast } from "sonner";
import { Label } from "../ui/label";
import axiosInstance from "@/utils/axiosInstance";
import { useButtonStatus } from "@/context/button-status";
import { LoadingCircle } from "@/app/icons";

const profileFormSchema = z.object({
  product_offering: z.string(),
  pain_point: z.array(z.string()),
  values: z.array(z.string()),
  customer_success_stories: z.array(z.string()),
  detailed_product_description: z.string(),
  company_features: z.array(z.string()),
});

type OfferingFormValues = z.infer<typeof profileFormSchema>;

export function OfferingForm() {
  const router = useRouter();
  const params = useParams<{ campaignId: string }>();
  const defaultFormsTracker = {
    schedulingBudget: true,
    offering: false,
    goal: false,
    audience: false,
    training: false,
  };
  const { user } = useUserContext();
  const { createOffering, editOffering } = useCampaignContext();
  const [isUploading, setIsUploading] = useState(false);
  const { setPageCompletion } = useButtonStatus();

  const [offeringData, setOfferingData] = useState<OfferingFormData>();
  const [type, setType] = useState<"create" | "edit">("create");
  const [formsTracker, setFormsTracker] = useState(defaultFormsTracker);

  const [campaignType, setCampaignType] = useState("");

  const form = useForm<OfferingFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      product_offering: "",
      pain_point: [""],
      values: [""],
      customer_success_stories: [""],
      detailed_product_description: "",
      company_features: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      const id = params.campaignId;
      if (id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}v2/campaigns/${id}`
          );

          const data = await response.json();
          console.log(data, "ress");
          if (response.ok) {
            setCampaignType(data.campaign_type);
            if (data.campaign_type === "Nurturing") {
              form.setValue("company_features", []);
            }
          } else {
            toast.error("Failed to fetch campaign data");
          }
        } catch (error) {
          console.error("Error fetching campaign:", error);
          toast.error("An error occurred while fetching campaign data");
        }
      }
    };

    fetchCampaign();
  }, [params.campaignId, form]);

  useEffect(() => {
    const fetchCampaign = async () => {
      const id = params.campaignId;
      if (id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}v2/offerings/${params.campaignId}`
          );
          const data = await response.json();
          if (data.detail === "Offering not found") {
            setType("create");
          } else {
            setOfferingData(data as OfferingFormData);
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
    const fetchPersona = async () => {
      const persona = await getPersonaByCampaignId(params.campaignId);
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
        form.setValue("company_features", persona.company_features || []);
      } else {
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
          form.setValue("company_features", persona.company_features || []);
        } else {
          toast.error("Failed to fetch persona");
        }
      }
    };

    fetchPersona();
  }, [user, params.campaignId, form]);

  useEffect(() => {
    if (offeringData) {
      form.setValue("product_offering", offeringData?.name);
    }
  }, [offeringData, form]);

  // const onSubmit = async (data: OfferingFormValues) => {
  //   const postData = {
  //     user_id: user?.id,
  //     campaign_id: params.campaignId,
  //     pain_point: data.pain_point,
  //     values: data.values,
  //     customer_success_stories: data.customer_success_stories,
  //     detailed_product_description: data.detailed_product_description,
  //     company_features: data.company_features,
  //   };

  //   try {
  //     if (type === "create") {
  //       await createPersona(postData);
  //       await createOffering(
  //         {
  //           name: data.product_offering,
  //           details: data.detailed_product_description,
  //         },
  //         params.campaignId
  //       );
  //       setPageCompletion("offering", true);
  //       const updatedFormsTracker = {
  //         schedulingBudget: true,
  //         offering: true,
  //         goal: true,
  //       };
  //       localStorage.setItem(
  //         "formsTracker",
  //         JSON.stringify(updatedFormsTracker)
  //       );
  //       setFormsTracker((prevFormsTracker) => ({
  //         ...prevFormsTracker,
  //         ...updatedFormsTracker,
  //       }));
  //       toast.success("Offering created successfully.");
  //     } else {
  //       await editPersona(postData);
  //       await editOffering(
  //         {
  //           name: data.product_offering,
  //           details: data.detailed_product_description,
  //         },
  //         params.campaignId
  //       );
  //       const updatedFormsTracker = {
  //         schedulingBudget: true,
  //         offering: true,
  //         goal: true,
  //       };
  //       localStorage.setItem(
  //         "formsTracker",
  //         JSON.stringify(updatedFormsTracker)
  //       );
  //       setFormsTracker((prevFormsTracker) => ({
  //         ...prevFormsTracker,
  //         ...updatedFormsTracker,
  //       }));
  //       toast.success("Offering updated successfully.");
  //     }
  //   } catch (error) {
  //     console.error("Error handling offering:", error);
  //     toast.error("Failed to handle offering.");
  //   }
  // };

  const onSubmit = async (data: OfferingFormValues) => {
    let offeringData;

    if (campaignType === "Nurturing") {
      // For Nurturing campaigns, combine product offering and features
      const featuresString = data.company_features.join(", ");
      const combinedString = `${data.product_offering} --- ${featuresString}`;

      offeringData = {
        name: data.product_offering,
        details: combinedString,
      };
    } else {
      // For non-Nurturing campaigns, use the original structure
      offeringData = {
        name: data.product_offering,
        details: data.detailed_product_description,
      };
    }

    const postData = {
      user_id: user?.id,
      campaign_id: params.campaignId,
      pain_point: data.pain_point,
      values: data.values,
      customer_success_stories: data.customer_success_stories,
      detailed_product_description: data.detailed_product_description,
      company_features: data.company_features,
    };

    try {
      if (type === "create") {
        await createPersona(postData);
        await createOffering(offeringData, params.campaignId);
        setPageCompletion("offering", true);
        const updatedFormsTracker = {
          schedulingBudget: true,
          offering: true,
          goal: true,
        };
        localStorage.setItem(
          "formsTracker",
          JSON.stringify(updatedFormsTracker)
        );
        setFormsTracker((prevFormsTracker) => ({
          ...prevFormsTracker,
          ...updatedFormsTracker,
        }));
        toast.success("Offering created successfully.");
      } else {
        await editPersona(postData);
        await editOffering(offeringData, params.campaignId);
        const updatedFormsTracker = {
          schedulingBudget: true,
          offering: true,
          goal: true,
        };
        localStorage.setItem(
          "formsTracker",
          JSON.stringify(updatedFormsTracker)
        );
        setFormsTracker((prevFormsTracker) => ({
          ...prevFormsTracker,
          ...updatedFormsTracker,
        }));
        toast.success("Offering updated successfully.");
      }
    } catch (error) {
      console.error("Error handling offering:", error);
      toast.error("Failed to handle offering.");
    }
  };

  const handleFileChange = async (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setIsUploading(true);
      const payload = new FormData();
      payload.append("file", selectedFile, selectedFile.name);
      payload.append("campaign_id", params.campaignId);

      try {
        const response = await axiosInstance.post("/v2/upload-pdf/", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          console.log(response);
          toast.success("PDF uploaded successfully.");
        } else {
          toast.error("Failed to upload PDF.");
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);
        toast.error("Error uploading PDF.");
      } finally {
        setIsUploading(false);
      }
    } else {
      toast.error("Please select a PDF file.");
    }
  };

  const handleCompanyProfileChange = (
    newValue: any[],
    fieldName:
      | "pain_point"
      | "values"
      | "customer_success_stories"
      | "company_features"
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
              <FormLabel>
                {campaignType === "Nurturing" ? "Campaign Offering" : "Product Offering"}
              </FormLabel>
              <FormControl>
                <Input placeholder="Product" {...field} />
              </FormControl>
              <FormDescription>This is your product name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {campaignType !== "Nurturing" ? (
          <>
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
                        {
                          label: "Pain Points",
                          items: field.value,
                          actionLabel: "Pain Point",
                        },
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
                        {
                          label: "Values",
                          items: field.value,
                          actionLabel: "Value",
                        },
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
                        {
                          label: "Social Proof",
                          items: field.value,
                          actionLabel: "Success Story",
                        },
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
            <div className="flex flex-col gap-10 ">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Add your sales knowledge</Label>
                <div className="flex gap-2 flex-col">
                  <Input
                    id="picture"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />

                  {isUploading && (
                    <div className="flex items-center gap-2">
                      <LoadingCircle />
                      <span className="text-sm text-gray-500">
                        Uploading PDF, please wait...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <FormField
            control={form.control}
            name="company_features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Feature</FormLabel>
                <FormControl>
                  <CompanyProfile
                    value={[
                      {
                        label: "",
                        items: field.value,
                        actionLabel: "Feature",
                      },
                    ]}
                    onChange={(newValue) =>
                      handleCompanyProfileChange(newValue, "company_features")
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col gap-10 ">
          {type === "create" && (
            <Button type="submit" className="cursor-pointer w-32 ">
              Create Offer
            </Button>
          )}
          {type === "edit" && (
            <Button type="submit" className="cursor-pointer w-32">
              Update Offer
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
