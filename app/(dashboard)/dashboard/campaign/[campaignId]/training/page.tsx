"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import VariablesTextArea from "@/components/campaign/training/variables-text-area";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import React, { useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import SubjectForm from "@/components/campaign/training/subject-form";
import VariableList from "@/components/campaign/training/variable-list";

const allVariablesList: AllVariablesListType = {
  variables: [
    {
      id: 1,
      val: "company name",
    },
    {
      id: 2,
      val: "first name",
    },
  ],
  offering: [
    {
      id: 4,
      val: "customer per industry",
    },
    {
      id: 5,
      val: "customer per region",
    },
  ],
  personlized: [
    {
      id: 7,
      val: "customer name",
    },
    {
      id: 8,
      val: "customer company",
    },
  ],
  enriched: [
    {
      id: 10,
      val: "enriched",
    },
  ],
};

// make a type for all variables
export type AllVariablesListType = {
  variables: {
    id: number;
    val: string;
  }[];
  offering: {
    id: number;
    val: string;
  }[];
  personlized: {
    id: number;
    val: string;
  }[];
  enriched: {
    id: number;
    val: string;
  }[];
};

export default function Training() {
  const [isOpen, setIsOpen] = React.useState(false);

  const [variableList, setVariableList] = React.useState(allVariablesList);

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
            <VariablesTextArea variableList={variableList} />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <VariableList variableList={variableList} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
