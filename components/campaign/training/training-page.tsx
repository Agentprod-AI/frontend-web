/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */

"use client";
import React from "react";
import { Pencil, Eye } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import EditorContent from "./editor-content";
import PreviewContent from "./preview-content";
import { getAutogenerateTrainingEmail, startCampaign } from "./training.api";

import { useUserContext } from "@/context/user-context";
import { useRouter } from "next/navigation";

import { useParams } from "next/navigation";
import { useAutoGenerate } from "@/context/auto-generate-mail";

export interface PreviewData {
  email: {
    subject: string;
    body: string;
  };
  contact: any;
  linkedin_information: string;
}

interface Lead {
  firstName: string;
  email: string;
  position: string;
  companyName: string;
  phone: string;
  linkedinUrl: string;
  industry: string;
  companySize: string;
  headquarters: string;
  foundedYear: string;
  specialties: string[];
  // Define other necessary fields
}
export default function Training() {
  const [activeTab, setActiveTab] = React.useState("editor");
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(
    null
  );
  const { user } = useUserContext();
  const params = useParams<{ campaignId: string }>();
  const { autoGeneratedBody, autoGeneratedSubject } = useAutoGenerate();

  const router = useRouter();

  const handleGenerateWithAI = async () => {
    try {
      const response = await getAutogenerateTrainingEmail(
        params.campaignId,
        user.id
      );
      // const data = JSON.parse(response);
      console.log(response);
      const { email, contact, linkedin_information } = response; // Destructure the additional data
      setPreviewData({
        email,
        contact,
        linkedin_information, // Assign the additional data
      });
      setActiveTab("preview");
    } catch (error) {
      console.error("Failed to fetch training data:", error);
    }
  };

  const handleStartCampaign = async () => {
    const userId = user.id as string;

    try {
      const response = await startCampaign(params.campaignId, userId);
      console.log("trainingResponse", response);
      // await startCampaign(params.campaignId, userId);

      router.push("/dashboard/mail");
    } catch (error: any) {
      console.log("TrainingResponse", error);
    }
  };

  function replacePlaceholders(template: string, leadData: Lead): string {
    return template.replace(/\{(\w+)\}/g, (_, key: string) => {
      const value = leadData[key as keyof Lead];
      if (typeof value === "string") {
        // Ensure the value is a string
        return value;
      }
      return `{${key}}`; // If it's not a string, return the placeholder as is
    });
  }

  const handleCustomGenerate = async () => {
    try {
      const response = await getAutogenerateTrainingEmail(
        params.campaignId,
        user.id
      );
      // const data = JSON.parse(response);
      console.log(response);
      const { contact, linkedin_information } = response; // Destructure the additional data

      const updatedEmail = {
        subject: replacePlaceholders(autoGeneratedSubject, contact),
        body: replacePlaceholders(autoGeneratedBody, contact),
      };
      setPreviewData({
        email: updatedEmail,
        contact,
        linkedin_information, // Assign the additional data
      });
      setActiveTab("preview");
    } catch (error) {
      console.error("Failed to fetch training data:", error);
    }
  };

  const onTabChange = async (tab: string) => {
    if (tab === "preview") {
      await handleCustomGenerate();
    }
    setActiveTab(tab);
  };

  return (
    <>
      <div className="w-full h-14 px-4 flex flex-row justify-between items-center rounded-lg border">
        <div className="ml-4">Training</div>
        <div className="flex items-center flex-row">
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-[200px]"
          >
            <TabsList>
              <TabsTrigger value="editor" className="flex gap-1">
                <Pencil className="h-3 w-3" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex gap-1">
                <Eye className="h-3 w-3" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleStartCampaign}>Start campaign</Button>
        </div>
      </div>
      {activeTab === "editor" ? (
        <EditorContent onGenerateWithAI={handleGenerateWithAI} />
      ) : (
        <PreviewContent
          email={
            previewData?.email || {
              subject: "",
              body: "",
            }
          }
          contact={previewData?.contact}
          linkedin_information={previewData?.linkedin_information}
        />
      )}
    </>
  );
}
