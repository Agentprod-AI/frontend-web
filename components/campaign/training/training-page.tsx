"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Settings, X, Pencil, Eye } from "lucide-react";

import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SubjectForm from "@/components/campaign/training/subject-form";
import FieldList from "@/components/campaign/training/field-list";
import FieldTextArea from "@/components/campaign/training/field-text-area";
import { Button } from "@/components/ui/button";
import { allFieldsListType } from "./field-form-modal";

const allFieldsList: allFieldsListType = {
  variable: [
    {
      id: "1",
      val: "company name",
      description: "The name of the company",
      length: "short",
    },
    {
      id: "2",
      val: "first name",
      description: "The first name of the customer",
      length: "automatic",
    },
  ],
  offering: [
    {
      id: "4",
      val: "customer per industry",
      description: "The industry of the customer",
    },
    {
      id: "5",
      val: "customer per region",
      description: "The region of the customer",
    },
  ],
  personalized: [
    {
      id: "7",
      val: "customer name",
      description: "The name of the customer",
    },
    {
      id: "8",
      val: "customer company",
      description: "The company of the customer",
    },
  ],
  enriched: [
    {
      id: "10",
      val: "enriched",
      description: "The enriched data",
    },
  ],
};

export default function Training() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [fieldsList, setFieldsList] = React.useState(allFieldsList);
  const [activeTab, setActiveTab] = React.useState("editor");

  const editorContent = (
    <ResizablePanelGroup direction="horizontal" className="">
      <ResizablePanel defaultSize={75}>
        <div className="flex justify-center p-6">
          <Avatar className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-2">
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>
          <div className="flex-col w-full">
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <Input placeholder="Subject" className="flex-1" />
                <CollapsibleTrigger asChild>
                  <Settings className="h-5 w-5 cursor-pointer" />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2">
                <SubjectForm />
              </CollapsibleContent>
            </Collapsible>
            <FieldTextArea fieldsList={fieldsList} />
            <span className="text-xs text-gray-500">
              *use variables like: &#123;variable_name&#125;
            </span>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <FieldList fieldsList={fieldsList} setFieldsList={setFieldsList} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  const previewContent = null; // Define your preview content here if needed

  return (
    <>
      <div className="w-full h-14 px-4 flex flex-row justify-between items-center rounded-lg border">
        <div className="flex flex-row gap-3 items-center">
          <X className="h-4 w-4 cursor-pointer" />
          <p>Training</p>
        </div>
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
      {activeTab === "editor" ? editorContent : previewContent}
    </>
  );
}
