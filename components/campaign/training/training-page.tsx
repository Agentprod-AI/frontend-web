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
import {
  allFieldsListType,
  allFieldsList,
} from "@/app/(dashboard)/dashboard/campaign/[campaignId]/training/types";
import { useUserContext } from "@/context/user-context";
import { useRouter } from "next/navigation";

export interface PreviewData {
  subject: string;
  body: string;
}

export default function Training() {
  const [activeTab, setActiveTab] = React.useState("editor");
  const [previewData, setPreviewData] = React.useState<PreviewData>();
  const [campaignId, setCampaignId] = React.useState("");
  const { user } = useUserContext();

  const router = useRouter();

  React.useEffect(() => {
    const storedCampaignId = localStorage.getItem("campaignId");
    if (storedCampaignId) {
      setCampaignId(storedCampaignId);
    }
  }, []);

  const handleGenerateWithAI = async () => {
    setActiveTab("preview");
    try {
      const response = await getAutogenerateTrainingEmail(campaignId, user.id);
      const data = JSON.parse(response);
      const subject = data.subject;
      const body = data.body;
      setPreviewData({
        subject,
        body,
      });
      console.log(response);
    } catch (error) {
      console.error("Failed to fetch training data:", error);
    }
  };

  const handleStartCampaign = async () => {
    const userId = user.id as string;
    const campaignId = localStorage.getItem("campaignId") as string;

    try {
      const response = await startCampaign(campaignId, userId);
      console.log("saashjashj", response);
      router.push("/dashboard/mail");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full h-14 px-4 flex flex-row justify-between items-center rounded-lg border">
        <div className="ml-4">Training</div>
        <div className="flex items-center flex-row">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
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
          subject={previewData?.subject}
          body={previewData?.body}
        />
      )}
    </>
  );
}
