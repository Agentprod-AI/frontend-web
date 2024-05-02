/* eslint-disable import/no-unresolved */
"use client";
import React from "react";
import { Pencil, Eye } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import EditorContent from "./editor-content";
import PreviewContent from "./preview-content";

export default function Training() {
  const [activeTab, setActiveTab] = React.useState("editor");
  return (
    <>
      <div className="w-full h-14 px-4 flex flex-row justify-between items-center rounded-lg border">
        <div className="ml-4">Training</div>
        <div className="flex items-center flex-row">
          <Tabs
            defaultValue="editor"
            className="w-[200px]"
            onValueChange={setActiveTab}
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
      {activeTab === "editor" ? <EditorContent /> : <PreviewContent />}
    </>
  );
}
