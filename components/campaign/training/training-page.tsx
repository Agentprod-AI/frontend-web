// /* eslint-disable import/no-unresolved */
"use client";
import React from "react";
import { Pencil, Eye } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import EditorContent from "./editor-content";
import PreviewContent from "./preview-content";
import { getAutogenerateTrainingEmail } from "./training.api";

import {
  allFieldsListType,
  allFieldsList,
} from "@/app/(dashboard)/dashboard/campaign/[campaignId]/training/types";

export default function Training() {
  const [activeTab, setActiveTab] = React.useState("editor");
  const [previewData, setPreviewData] = React.useState(allFieldsList);

  const handleGenerateWithAI = async () => {
    setActiveTab("preview");
    try {
      const data = await getAutogenerateTrainingEmail(
        "a37d8526-316a-41eb-90e3-1a0c7a8e6e76",
        user.id
      );
      console.log("Data coming from AI generation:", data);
      setPreviewData(data);
    } catch (error) {
      console.error("Failed to fetch training data:", error);
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
          <Button>Start campaign</Button>
        </div>
      </div>
      {activeTab === "editor" ? (
        <EditorContent onGenerateWithAI={handleGenerateWithAI} />
      ) : (
        <PreviewContent previewData={previewData} />
      )}
    </>
  );
}
