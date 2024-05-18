"use client";

import React, { useEffect } from "react";
import {
  BadgePercent,
  CurlyBraces,
  ShieldCheck,
  TextQuote,
  UserCog2,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { allFieldsListType } from "@/app/(dashboard)/dashboard/campaign/[campaignId]/training/types";
import { Button } from "@/components/ui/button";
import { FieldFormModal } from "./field-form-modal";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getTrainingByCampaignId } from "./training.api";
import { useParams } from "next/navigation";

export interface TrainingResponse {
  campaign_id?: string;
  template?: string;
  follow_up_template?: string | null;
  variables?: any | null;
  offering_variables?: Record<string, string> | null;
  personalized_fields: Record<string, any> | undefined;
  enriched_fields?: string[] | null;
  id?: string;
  type?: string;
}
export default function FieldList({
  fieldsList,
  setFieldsList,
}: {
  fieldsList: allFieldsListType;
  setFieldsList: (val: allFieldsListType) => void;
}) {
  const params = useParams<{ campaignId: string }>();

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const responseFromGetTraining = await getTrainingByCampaignId(
          params.campaignId
        );

        console.log("response from get training", responseFromGetTraining);

        const fields: TrainingResponse[] = responseFromGetTraining;

        const updatedFieldsList: allFieldsListType = {
          variable: fields
            .filter((field) => field.variables !== null)
            .map((field) => ({
              id: field.id,
              val: field.template || "",
              description: field.follow_up_template || "",
              length: "",
            })),
          personalized: fields[0].personalized_fields
            ? Object.entries(fields[0].personalized_fields).map(
                ([key, value]) => ({
                  id: fields[0].id,
                  val: value,
                  description: "",
                  length: "",
                })
              )
            : [],
          offering: fields[0].offering_variables
            ? Object.entries(fields[0].offering_variables).map(
                ([key, value]) => ({
                  id: fields[0].id,
                  val: value,
                  description: "",
                  length: "",
                })
              )
            : [],
          enriched: fields[0].enriched_fields
            ? fields[0].enriched_fields.map((field) => ({
                id: fields[0].id,
                val: field,
                description: "",
                length: "",
              }))
            : [],
        };

        setFieldsList(updatedFieldsList);
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    };

    fetchFields();
  }, [setFieldsList]);

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search..." />
      <CommandList className="max-h-full">
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.keys(fieldsList).map((field, ind) => (
          <div key={ind}>
            <CommandGroup heading={capitalizeFirstLetter(field + " Fields")}>
              {fieldsList[field as keyof allFieldsListType].map(
                (val: any, ind: any) => (
                  <CommandItem key={ind}>
                    {
                      {
                        variable: (
                          <CurlyBraces className="mr-2 h-4 w-4 min-w-3" />
                        ),
                        personalized: (
                          <UserCog2 className="mr-2 h-4 w-4 min-w-3" />
                        ),
                        offering: (
                          <BadgePercent className="mr-2 h-4 w-4 min-w-3" />
                        ),
                        enriched: (
                          <ShieldCheck className="mr-2 h-4 w-4 min-w-3" />
                        ),
                      }[field]
                    }
                    <FieldFormModal
                      modalType="edit"
                      type={field}
                      setFieldsList={setFieldsList}
                      fieldsList={fieldsList}
                      fieldId={val.id}
                    >
                      <span className="w-full">{val.val}</span>
                    </FieldFormModal>
                    {field === "variable" && (
                      <Badge variant="outline">
                        <TextQuote className="h-3 w-3 mr-1" /> {val.val.length}
                      </Badge>
                    )}
                  </CommandItem>
                )
              )}
            </CommandGroup>
            <FieldFormModal
              type={field}
              modalType="add"
              setFieldsList={setFieldsList}
              fieldsList={fieldsList}
            >
              <Button variant="outline" size="sm" className="m-2">
                Add Field
              </Button>
            </FieldFormModal>
            <CommandSeparator />
          </div>
        ))}
      </CommandList>
    </Command>
  );
}
