// /* eslint-disable import/no-unresolved */
"use client";
import React from "react";
import { Pencil, Eye } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import EditorContent from "./editor-content";
import PreviewContent from "./preview-content";
import { getAutogenerateTrainingEmail } from "./training.api";

export default function Training() {
  const [activeTab, setActiveTab] = React.useState("editor");
  const [previewData, setPreviewData] = React.useState("");

  const handleGenerateWithAI = async () => {
    setActiveTab("preview"); // This sets the active tab to 'preview'
    try {
      const campaignId = "9b0660ce-7333-4315-aa3f-e9b0ed6653c4";
      const data = await getAutogenerateTrainingEmail(campaignId);
      console.log("data commingg -> ", data);
      setPreviewData(data); // Assuming the response has a 'result' field
      setActiveTab("preview"); // Switch to the Preview tab after fetching
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <>
      <div className="w-full h-14 px-4 flex flex-row justify-between items-center rounded-lg border">
        <div className="ml-4">Training</div>
        <div className="flex items-center flex-row">
          <Tabs
            value={activeTab} // This binds the active tab state to the Tabs component
            onValueChange={setActiveTab} // This changes the active tab state when a tab is manually clicked
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
