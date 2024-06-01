import React, { useState, ChangeEvent, useRef, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface Variable {
  id: string;
  value: string;
  length: string;
  isCustom: boolean;
}

export default function EditorContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdditionalTextArea, setShowAdditionalTextArea] = useState(false);
  const [keywordDropdownIsOpen, setKeywordDropdownIsOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const keywords = [
    "first name",
    "last name",
    "current company",
    "current job role",
    "current company location",
    "industry",
  ];

  const toggleFollowUp = () => {
    setShowAdditionalTextArea(!showAdditionalTextArea);
  };

  const handleTextChange = (text: string, setText: (value: string) => void) => {
    const variablePattern = /\{([^\}]+)\}/g;
    let match;
    const newVariables: Variable[] = [];

    while ((match = variablePattern.exec(text)) !== null) {
      let variableName = match[1].trim();
      variableName = variableName.replace(/['"]/g, "");

      let custom = true;
      if (variableName) {
        if (keywords.includes(variableName)) {
          custom = false;
        }
        const newVariable = {
          id: Math.random().toString(),
          value: variableName,
          length: "auto",
          isCustom: custom,
        };
        newVariables.push(newVariable);
      }
    }

    const updatedVariables = fieldsList.variables.filter((variable) =>
      newVariables.some((newVar) => newVar.value === variable.value)
    );

    newVariables.forEach((newVar) => {
      if (
        !updatedVariables.some((variable) => variable.value === newVar.value)
      ) {
        updatedVariables.push(newVar);
      }
      setKeywordDropdownIsOpen(false);
    });

    fieldsList.variables = updatedVariables;
    setText(text);
  };

  const handleSubjectChange = (text: string) => {
    setLocalSubject(text);
    handleTextChange(text, setSubject);
  };

  const handleBodyChange = (text: string, cursorPos?: number) => {
    setLocalBody(text);
    handleTextChange(text, setBody);
    if (cursorPos !== undefined) {
      setCursorPosition(cursorPos);
    }
  };

  const handleFollowUpChange = (text: string) => {
    setLocalFollowUp(text);
    handleTextChange(text, setLocalFollowUp);
  };

  const handleDropdownSelect = (option: string) => {
    if (cursorPosition === null) return;

    const variable = `${option}}`;
    const newBody =
      localBody.slice(0, cursorPosition) +
      variable +
      localBody.slice(cursorPosition);
    handleBodyChange(newBody, cursorPosition + variable.length);
    setKeywordDropdownIsOpen(false);
  };

  const mapFields = (response: any, fields: string[]) => {
    fields.forEach((field: string) => {
      Object.keys(response[field]).forEach((key) => {
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

      handleSubjectChange(response.template.subject);
      handleBodyChange(response.template.body);

      setLocalSubject(response.template.subject);
      setLocalBody(
        `${response.template.body} ${response.template.closing || ""}`
      );

      mapFields(response, [
        "enriched_fields",
        "personalized_fields",
        "offering_variables",
      ]);
    } catch (error) {
      console.error("Failed to fetch training data:", error);
    }
  };

  const updateDropdownPosition = (cursorPos: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.value;
    const lines = text.substring(0, cursorPos).split("\n");
    const lineNumber = lines.length;
    const charNumber = lines[lines.length - 1].length;

    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
    const top = lineNumber * lineHeight + 5 - textarea.scrollTop;
    const left = charNumber * 8; // Approximate character width in pixels

    console.log({ top, left });
    setDropdownPosition({ top, left });
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "{") {
        const cursorPos = textarea.selectionStart;
        setCursorPosition(cursorPos);
        // updateDropdownPosition(cursorPos);
        setTimeout(() => {
          setKeywordDropdownIsOpen(true);
          updateDropdownPosition(cursorPos);
        }, 0);
      }
    };

    textarea.addEventListener("keydown", handleKeyDown);

    return () => {
      textarea.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setKeywordDropdownIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            <div className="relative">
              <Textarea
                placeholder="Hi {first name}..."
                value={localBody}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  handleBodyChange(e.target.value, e.target.selectionStart);
                }}
                className="mt-2 w-full h-[200px]"
                ref={textareaRef}
              />
              <span className="text-xs text-gray-500">
                *use variables like: &#123;variable_name&#125;
              </span>
              {keywordDropdownIsOpen && (
                <div
                  className={`absolute z-10 inline-block text-left mt-1`}
                  ref={dropdownRef}
                  style={{
                    top: dropdownPosition ? `${dropdownPosition.top}px` : "0",
                    left: dropdownPosition ? `${dropdownPosition.left}px` : "0",
                  }}
                >
                  <ScrollArea className="w-56 h-[200px] rounded-md shadow-lg bg-black ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                      onClick={() => setKeywordDropdownIsOpen(false)}
                    >
                      {keywords.map((option) => (
                        <button
                          key={option}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDropdownSelect(option);
                          }}
                          className="text-white block px-4 py-2 text-sm w-full text-left hover:bg-accent"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

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
              <Button onClick={handleAutoGenerateTemplate}>
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
