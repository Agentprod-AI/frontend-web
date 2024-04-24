"use client";

import React, { useState } from "react";
// Ensure your import paths are correct based on your project structure
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface NestedField {
  title: string;
  description?: string;
  isEditing: boolean;
}

interface Field {
  label: string;
  description?: string;
  details?: NestedField[];
  isEditing?: boolean;
  actionLabel?: string;
}

const companyData: Field[] = [
  {
    label: "Your Company's website",
    description: "https://www.agentprod.com",
    isEditing: false,
  },
  {
    label: "What's Your Product/Service?",
    description:
      "We have created Sally, an Al BDR that automates the entire outbound email process.",
    isEditing: false,
  },
  {
    label: "Features",
    details: [
      {
        title: "Outcome-as-a-Service",
        description:
          "Delivers concrete sales outcomes, automating the sales process.",
        isEditing: false,
      },
      {
        title: "AI Software OS",
        description:
          "Serves as a comprehensive operating system for startups in different sectors.",
        isEditing: false,
      },
      {
        title: "Human-AI Collaboration",
        description:
          "AI Employees designed to collaborate seamlessly with human teams.",
        isEditing: false,
      },
      {
        title: "SDR Replacement",
        description:
          "Aims to take over the role of Sales Development Representatives (SDRs) in sales.",
        isEditing: false,
      },
      {
        title: "Cost-Effective Growth",
        description:
          "Enhances sales pipelines at a fraction of the usual cost.",
        isEditing: false,
      },
      {
        title: "Integrative Generative AI",
        description:
          "Harnesses the latest generative AI for multimodal, automated workflow execution.",
        isEditing: false,
      },
    ],
    actionLabel: "Feature",
  },
  {
    label: "Pain Points",
    details: [
      {
        title: "SaaS Overload",
        description:
          "Reduces reliance on multiple, fragmented SaaS tools by centralizing functionalities.",
        isEditing: false,
      },
      {
        title: "Efficiency in Sales",
        description:
          "Addresses inefficiencies in lead generation and follow-ups with advanced AI analysis and actions.",
        isEditing: false,
      },
      {
        title: "CRM Automation",
        description:
          "Streamlines CRM updates, eliminating manual data entry through AI automation.",
        isEditing: false,
      },
    ],
    actionLabel: "Pain Point",
  },
  {
    label: "Social Proofs",
    details: [
      {
        title: "Enhanced Productivity",
        description:
          "Users report significant increases in meeting schedules and sales conversions due to AI efficiency.",
        isEditing: false,
      },
      {
        title: "Industry Recognition",
        description:
          "Businesses have acknowledged the innovative approach to sales automation and the platform's impact.",
        isEditing: false,
      },
    ],
    actionLabel: "Social Proof",
  },
];

export default function CompanyProfile() {
  const [fields, setFields] = useState<Field[]>(companyData);
  const [detailsInput, setDetailsInput] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });

  const toggleEdit = (index: number, detailsIndex?: number) => {
    setFields((fields) =>
      fields.map((field, i) => ({
        ...field,
        isEditing: i === index ? !field.isEditing : field.isEditing,
        details: field.details?.map((detail, ci) => ({
          ...detail,
          isEditing:
            i === index && ci === detailsIndex
              ? !detail.isEditing
              : detail.isEditing,
        })),
      }))
    );
  };

  const handleFieldChange =
    (
      index: number,
      detailsIndex: number | undefined,
      valueType: "title" | "description"
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      setFields((fields) =>
        fields.map((field, i) => {
          if (
            i === index &&
            detailsIndex === undefined &&
            valueType === "description"
          ) {
            return { ...field, description: newValue };
          }

          if (i === index && field.details && detailsIndex !== undefined) {
            const updatedDetails = field.details.map((item, ci) => {
              if (ci === detailsIndex) {
                return { ...item, [valueType]: newValue };
              }
              return item;
            });
            return { ...field, details: updatedDetails };
          }

          return field;
        })
      );
    };

  const handleAddDetails = (type: string) => {
    if (detailsInput.title.trim() && detailsInput.description.trim()) {
      setFields((fields) =>
        fields.map((field) => {
          if (field.label === type) {
            const updatedDetails = field.details
              ? [...field.details, { ...detailsInput, isEditing: false }]
              : [{ ...detailsInput, isEditing: false }];
            return { ...field, details: updatedDetails };
          }
          return field;
        })
      );

      setDetailsInput({ title: "", description: "" });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-4">
        Company Profile
      </h1>
      {fields.map((field, index) => (
        <Card key={field.label} className="mb-4">
          <CardHeader className="pb-2">
            <CardDescription>{field.label}</CardDescription>
          </CardHeader>
          <CardContent>
            {field.description && (
              <div className="flex justify-between items-center">
                {field.isEditing ? (
                  <Input
                    value={field.description}
                    autoFocus
                    onChange={handleFieldChange(
                      index,
                      undefined,
                      "description"
                    )}
                    className="mr-4"
                  />
                ) : (
                  <span className="text-sm">{field.description}</span>
                )}
                <Button onClick={() => toggleEdit(index)} variant={"ghost"}>
                  {field.isEditing ? (
                    <Icons.check size={16} />
                  ) : (
                    <>
                      <Icons.pencilLine size={16} className="mr-3" />
                      <span className="text-sm">Edit</span>
                    </>
                  )}
                </Button>
              </div>
            )}
            {field.details &&
              field.details.map((detail, detailsIndex) => (
                <Card
                  key={`${field.label}-detail-${detailsIndex}`}
                  className="mt-2 w-full"
                >
                  <CardContent className="flex justify-between items-center p-4">
                    <div className="flex-grow flex flex-col justify-between mr-4">
                      {detail.isEditing ? (
                        <>
                          <Input
                            value={detail.title}
                            autoFocus
                            onChange={handleFieldChange(
                              index,
                              detailsIndex,
                              "title"
                            )}
                            className="mb-2 w-full"
                          />
                          <Input
                            value={detail.description || ""}
                            onChange={handleFieldChange(
                              index,
                              detailsIndex,
                              "description"
                            )}
                            className="mb-4 w-full"
                          />
                        </>
                      ) : (
                        <>
                          <p className="text-sm mb-2">{detail.title}</p>
                          <p className="text-xs">{detail.description}</p>
                        </>
                      )}
                    </div>
                    <Button
                      onClick={() => toggleEdit(index, detailsIndex)}
                      variant={"ghost"}
                    >
                      {detail.isEditing ? (
                        <Icons.check size={16} />
                      ) : (
                        <>
                          <Icons.pencilLine size={16} className="mr-3" />
                          <span className="text-sm">Edit</span>
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}

            {field.actionLabel && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="mt-4 text-sm font-normal"
                    variant={"outline"}
                  >
                    Add {field.actionLabel}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add {field.actionLabel}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        onChange={(e) =>
                          setDetailsInput({
                            ...detailsInput,
                            title: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        onChange={(e) =>
                          setDetailsInput({
                            ...detailsInput,
                            description: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    {detailsInput.title.trim() &&
                    detailsInput.description.trim() ? (
                      <DialogClose asChild>
                        <Button
                          type="submit"
                          onClick={() => handleAddDetails(field.label)}
                        >
                          Add
                        </Button>
                      </DialogClose>
                    ) : (
                      <Button
                        type="submit"
                        onClick={() => handleAddDetails(field.label)}
                      >
                        Add
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
