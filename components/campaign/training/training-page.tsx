/* eslint-disable no-console */
// /* eslint-disable import/no-unresolved */
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

export interface PreviewData {
  email: {
    subject: string;
    body: string;
  };
  contact: any;
  linkedin_information: string;
}

export default function Training() {
  const [activeTab, setActiveTab] = React.useState("editor");
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(
    null
  );
  const { user } = useUserContext();
  const params = useParams<{ campaignId: string }>();

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
      await startCampaign(params.campaignId, userId);
      router.push("/dashboard/mail");
    } catch (error: any) {
      console.log(error);
    }
  };

  const onTabChange = async (tab: string) => {
    if (tab === "preview") {
      await handleGenerateWithAI();
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
