import React, { useState, ChangeEvent } from "react";
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
import SubjectForm from "@/components/campaign/training/subject-form";
import FieldList from "@/components/campaign/training/field-list";
import FieldTextArea from "@/components/campaign/training/field-text-area";
import { Button } from "@/components/ui/button";
import { useAutoGenerate } from "@/context/auto-generate-mail";
import { useParams } from "next/navigation";
import { useFieldsList } from "@/context/training-fields-provider";

interface Variable {
  id: string;
  value: string;
  length: string;
  isCustom: boolean;
}

export default function EditorContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdditionalTextArea, setShowAdditionalTextArea] = useState(false);
  const [localBody, setLocalBody] = useState("");
  const [localSubject, setLocalSubject] = useState("");

  const { fieldsList, setBody, setSubject } = useFieldsList();

  const toggleFollowUp = () => {
    setShowAdditionalTextArea(!showAdditionalTextArea);
  };

  const handleTextChange = (text: string, setText: (value: string) => void) => {
    const variablePattern = /\{([^\}]+)\}/g;
    let match;
    const newVariables: Variable[] = [];

    while ((match = variablePattern.exec(text)) !== null) {
      let variableName = match[1].trim();
      // Remove any double or single quotes from the variable name
      variableName = variableName.replace(/['"]/g, "");

      if (variableName) {
        const newVariable = {
          id: Math.random().toString(),
          value: variableName,
          length: "auto",
          isCustom: true,
        };
        newVariables.push(newVariable);
      }
    }

    // Filter out existing variables that are no longer in the text
    const updatedVariables = fieldsList.variables.filter((variable) =>
      newVariables.some((newVar) => newVar.value === variable.value)
    );

    // Add new variables that were not already present
    newVariables.forEach((newVar) => {
      if (
        !updatedVariables.some((variable) => variable.value === newVar.value)
      ) {
        updatedVariables.push(newVar);
      }
    });

    // Update the fields list
    fieldsList.variables = updatedVariables;

    setText(text);
  };

  const handleSubjectChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setLocalSubject(text);
    handleTextChange(text, setSubject);
  };

  const handleBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setLocalBody(text);
    handleTextChange(text, setBody);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="">
      <ResizablePanel defaultSize={75}>
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
                  placeholder="Write an enticing subject"
                  className="flex-1"
                  value={localSubject}
                  onChange={handleSubjectChange}
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
                placeholder="Hi {first name}..."
                value={localBody}
                onChange={handleBodyChange}
                className="w-full h-full text-base bg-transparent resize-none focus:outline-none"
              />
            </div>
            <span className="text-xs text-gray-500">
              *use variables like: &#123;variable_name&#125;
            </span>
            {showAdditionalTextArea && (
              <FieldTextArea fieldsList={fieldsList} emailContent={localBody} />
            )}
            <div className="mt-4 flex flex-row gap-4">
              <Button
                className="flex gap-2 bg-white cursor-pointer text-black hover:text-slate-400 disable:cursor-not-allowed"
                onClick={toggleFollowUp}
                disabled={showAdditionalTextArea}
              >
                <Plus className="h-3 w-3 text-gray-400" /> Add follow-Up
              </Button>
              <Button className="flex gap-2 bg-gray-300 cursor-pointer text-black hover:text-slate-400">
                Auto Generate
              </Button>
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <FieldList />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
