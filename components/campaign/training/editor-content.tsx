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
import { Textarea } from "@/components/ui/textarea";
import { getAutogenerateTrainingTemplate } from "./training.api";
import { allFieldsListType } from "./types";

interface Variable {
  id: string;
  value: string;
  length: string;
  isCustom: boolean;
}

export default function EditorContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdditionalTextArea, setShowAdditionalTextArea] = useState(false);
  const {
    fieldsList,
    body,
    setBody,
    subject,
    setSubject,
    followUp,
    setFollowUp,
    addField,
  } = useFieldsList();
  const params = useParams<{ campaignId: string }>();

  const [localBody, setLocalBody] = useState(body);
  const [localSubject, setLocalSubject] = useState(subject);
  const [localFollowUp, setLocalFollowUp] = useState(followUp);

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

  const handleSubjectChange = (text: string) => {
    setLocalSubject(text);
    handleTextChange(text, setSubject);
  };

  const handleBodyChange = (text: string) => {
    setLocalBody(text);
    handleTextChange(text, setBody);
  };

  const handleFollowUpChange = (text: string) => {
    setLocalFollowUp(text);
    handleTextChange(text, setLocalFollowUp);
  };

  const mapFields = (response: any, fields: string[]) => {
    fields.forEach((field: string) => {
      Object.keys(response[field]).forEach((key) => {
        console.log("Mapping enriched_fields", key, response[field][key]);
        addField(
          {
            id: String(Math.random()),
            fieldName: key,
            description: `${response[field][key]}`,
          },
          field
        );
      });
    });
  };

  const handleAutoGenerateTemplate = async () => {
    try {
      const response = await getAutogenerateTrainingTemplate(params.campaignId);
      console.log(response.template.subject);
      // setSubject(response.template.subject);
      // setBody(`${response.template.body}
      // ${" "}
      // ${response.template.closing || ""}`);

      handleSubjectChange(response.template.subject);
      handleBodyChange(response.template.body);

      setLocalSubject(response.template.subject);
      setLocalBody(`${response.template.body}
      ${" "}
      ${response.template.closing || ""}`);

      mapFields(response, [
        "enriched_fields",
        "personalized_fields",
        "offering_variables",
      ]);

      // Object.keys(response.enriched_fields).forEach((key) => {
      //   console.log(
      //     "Mapping enriched_fields",
      //     key,
      //     response.enriched_fields[key]
      //   );
      //   addField(
      //     {
      //       id: String(Math.random()),
      //       fieldName: key,
      //       description: `${response.enriched_fields[key]}`,
      //     },
      //     "enriched_fields"
      //   );
      // });

      // Object.keys(response.offering_variables).forEach((key) => {
      //   console.log(
      //     "Mapping offering_variables",
      //     key,
      //     response.offering_variables[key]
      //   );
      //   addField(
      //     {
      //       id: String(Math.random()),
      //       fieldName: key,
      //       description: `${response.offering_variables[key]}`,
      //     },
      //     "offering_variables"
      //   );
      // });

      // Object.keys(response.personalized_fields).forEach((key) => {
      //   console.log(
      //     "Mapping personalized_fields",
      //     key,
      //     response.personalized_fields[key]
      //   );
      //   addField(
      //     {
      //       id: String(Math.random()),
      //       fieldName: key,
      //       description: `${response.personalized_fields[key]}`,
      //     },
      //     "personalized_fields"
      //   );
      // });
    } catch (error) {
      console.error("Failed to fetch training data:", error);
    }
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleSubjectChange(e.target.value);
                  }}
                />
                <CollapsibleTrigger asChild>
                  <Settings className="h-5 w-5 cursor-pointer" />
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2">
                <SubjectForm />
              </CollapsibleContent>
            </Collapsible>
            <Textarea
              placeholder="Hi {first name}..."
              value={localBody}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                handleBodyChange(e.target.value);
              }}
              className="mt-2 w-full h-[200px]"
            />
            <span className="text-xs text-gray-500">
              *use variables like: &#123;variable_name&#125;
            </span>
            {showAdditionalTextArea && (
              <Textarea
                placeholder="Write a follow-up"
                value={localFollowUp}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  handleFollowUpChange(e.target.value);
                }}
                className="mt-2 w-full h-[200px]"
              />
            )}
            <div className="mt-4 flex flex-row gap-4">
              <Button
                className="flex gap-2 bg-white cursor-pointer text-black hover:text-slate-400 disable:cursor-not-allowed"
                onClick={toggleFollowUp}
              >
                <Plus
                  className={`h-3 w-3 text-gray-400 ${
                    showAdditionalTextArea ? "rotate-45 transition-all" : ""
                  }`}
                />
                {showAdditionalTextArea ? "Remove follow-up" : "Add follow-up"}
              </Button>
              <Button
                onClick={handleAutoGenerateTemplate}
                // className="flex gap-2 bg-gray-300 cursor-pointer text-black hover:text-slate-400"
              >
                Auto Generate Template
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
