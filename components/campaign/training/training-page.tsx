"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import SubjectForm from "@/components/campaign/training/subject-form";
import FieldList from "@/components/campaign/training/field-list";
import FieldTextArea from "@/components/campaign/training/field-text-area";
import { useClerk } from "@clerk/nextjs";

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

// make a type for all variables
export type allFieldsListType = {
  variable: {
    id?: string;
    val: string;
    description: string;
    length: string;
  }[];
  offering: {
    id?: string;
    val: string;
    description: string;
  }[];
  personalized: {
    id?: string;
    val: string;
    description: string;
  }[];
  enriched: {
    id?: string;
    val: string;
    description: string;
  }[];
};
export default function Training() {
  const [isOpen, setIsOpen] = React.useState(false);

  const [fieldsList, setFieldsList] =
    React.useState<allFieldsListType>(allFieldsList);

  // useEffect(() => {
  //   setVariableList([
  //     ...variableListMain,
  //     {
  //       id: 4,
  //       val: "C-3PO",
  //     },
  //   ]);
  // }, []);

  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={75}>
        <div className="flex justify-center p-6">
          <Avatar className="flex h-7 w-7 items-center justify-center space-y-0 border bg-white mr-2">
            {/* <AvatarImage src="/user.png" alt="user" /> */}
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>
          {/* <Textarea cols={10} /> */}
          <div className="flex-col w-full">
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className=" space-y-2"
            >
              <div className="flex items-center gap-2">
                <Input placeholder="Subject" className="flex-1" />
                <CollapsibleTrigger asChild>
                  <Settings className="h-5 w-5" />
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
}
