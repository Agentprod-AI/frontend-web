/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
"use client";
import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Settings, Plus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SubjectForm from "@/components/campaign/training/subject-form";
import FieldList from "@/components/campaign/training/field-list";
import FieldTextArea from "@/components/campaign/training/field-text-area";
import { Button } from "@/components/ui/button";
import { allFieldsListType } from "./field-form-modal";
import axiosInstance from "@/utils/axiosInstance";
import { useAutoGenerate } from "@/context/auto-generate-mail";

interface EditorContentProps {
  onGenerateWithAI: () => void;
}

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

function EditorContent({ onGenerateWithAI }: EditorContentProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [fieldsList, setFieldsList] = React.useState(allFieldsList);
  const [showAdditionalTextArea, setShowAdditionalTextArea] =
    React.useState(false);
  const [campaignId, setCampaignId] = React.useState("");
  // const [body, setBody] = React.useState("");
  // const [subject, setSubject] = React.useState("");

  const { handleGenerate, autoGeneratedBody, autoGeneratedSubject } =
    useAutoGenerate();

  const toggleFollowUp = () => {
    setShowAdditionalTextArea(!showAdditionalTextArea);
  };

  React.useEffect(() => {
    const storedCampaignId = localStorage.getItem("campaignId");
    if (storedCampaignId) {
      setCampaignId(storedCampaignId);
    }
  }, []);

  const handleAutoGenerate = async () => {
    try {
      const response = await axiosInstance.get(
        `v2/training/autogenerate/template/${campaignId}`
      );

      const { subject, body } = response.data.template;

      handleGenerate(subject, body);
    } catch (error) {
      console.error("Failed to fetch AI generated template:", error);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="">
      <ResizablePanel defaultSize={75}>
        <div
          className="mx-16 mt-3  hover:underline cursor-pointer"
          onClick={onGenerateWithAI}
        >
          Let AI write email on its own <AutoAwesomeIcon />
        </div>
        <div className="flex justify-center px-6 py-4">
          <Avatar className="flex h-8 w-8 items-center justify-center space-y-0 border bg-white mr-2">
            <AvatarFallback>AV</AvatarFallback>
          </Avatar>
          <div className="flex-col w-full">
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Subject"
                  className="flex-1"
                  value={autoGeneratedSubject}
                  // onChange={(e) => setSubject(e.target.value)}
                  readOnly
                />
                <CollapsibleTrigger asChild>
                  <Settings className="h-5 w-5 cursor-pointer" />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2">
                <SubjectForm />
              </CollapsibleContent>
            </Collapsible>
            <div className="p-2 border rounded w-full h-72 mt-2">
              <textarea
                value={autoGeneratedBody}
                // onChange={(e) => setBody(e.target.value)}
                readOnly
                className="w-full h-full text-base  text-white bg-transparent resize-none focus:outline-none"
                aria-readonly="true"
              />
            </div>
            <span className="text-xs text-gray-500">
              *use variables like: &#123;variable_name&#125;
            </span>
            {showAdditionalTextArea && (
              <FieldTextArea fieldsList={fieldsList} emailContent={""} />
            )}
            <div className="mt-4 flex flex-row gap-4">
              <Button
                className="flex gap-2 bg-white cursor-pointer text-black hover:text-slate-400 disable:cursor-not-allowed"
                onClick={toggleFollowUp}
                disabled={showAdditionalTextArea}
              >
                <Plus className="h-3 w-3 text-gray-400" /> Add follow-Up
              </Button>
              <Button
                onClick={handleAutoGenerate}
                className="flex gap-2 bg-gray-300 cursor-pointer text-black hover:text-slate-400"
              >
                Auto Generate
              </Button>
            </div>
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
}

export default EditorContent;
