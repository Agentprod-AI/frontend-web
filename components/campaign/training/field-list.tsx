/* eslint-disable import/no-unresolved */
"use client";

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  FieldType,
  allFieldsListType,
} from "@/components/campaign/training/types";
import { Button } from "@/components/ui/button";
import FieldFormModal from "./field-form-modal";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useFieldsList } from "@/context/training-fields-provider";

export interface TrainingResponse {
  campaign_id?: string;
  template?: string;
  follow_up_template?: string;
  variables?: any;
  offering_variables?: Record<string, string> | undefined;
  personalized_fields?: Record<string, any> | undefined;
  enriched_fields?: string[];
  id?: string;
  type?: string;
}

export default function FieldList() {
  const [isFieldsList, setIsFieldsList] = useState(false);
  const { fieldsList, addField, removeField, editField } = useFieldsList();

  useEffect(() => {
    if (fieldsList) {
      console.log("fields list in editor content", fieldsList);
      setIsFieldsList(true);
      console.log(Object.keys(fieldsList));
    }
  }, [fieldsList]);

  return (
    <Command className="rounded-lg border shadow-md">
      {/* <CommandInput placeholder="Search..." /> */}
      <CommandList className="max-h-full">
        {fieldsList && (
          <CommandGroup>
            <CommandGroup heading={capitalizeFirstLetter("variables")}>
              {fieldsList.variables.length > 0 ? (
                fieldsList.variables.map((variable, index) => (
                  <CommandItem key={index}>
                    <span>{variable.value}</span>
                    <Badge
                      variant="outline"
                      className="text-xs ml-2 rounded-full border-sky-500 text-sky-500 font-normal"
                    >
                      <Sparkles size={15} />
                      <span className="ml-1">
                        {variable.length.toUpperCase()}
                      </span>
                    </Badge>
                    {variable.isCustom && (
                      <Badge
                        variant="outline"
                        className="text-xs ml-2 rounded-full border-green-500 text-green-500 font-normal"
                      >
                        CUSTOM
                      </Badge>
                    )}
                  </CommandItem>
                ))
              ) : (
                <div className="ml-2 mb-2 text-xs text-gray-500">
                  Variables will show up here as you add them to your message.
                </div>
              )}
              <CommandSeparator />
            </CommandGroup>
            <CommandGroup heading={capitalizeFirstLetter("offering fields")}>
              {fieldsList.offering_variables.map((field, index) => (
                <CommandItem key={index}>
                  <FieldFormModal
                    type="offering_variables"
                    modalType="edit"
                    fieldId={field.id}
                  >
                    <div>{field.fieldName}</div>
                  </FieldFormModal>
                </CommandItem>
              ))}
              <FieldFormModal type="offering_variables" modalType="add">
                <Button variant="outline" size="sm" className="m-2">
                  Add Field
                </Button>
              </FieldFormModal>
              <CommandSeparator />
            </CommandGroup>
            <CommandGroup
              heading={capitalizeFirstLetter("personalized fields")}
            >
              {fieldsList.personalized_fields.map((field, index) => (
                <CommandItem key={index}>
                  <FieldFormModal
                    type="personalized_fields"
                    modalType="edit"
                    fieldId={field.id}
                  >
                    <div>{field.fieldName}</div>
                  </FieldFormModal>
                </CommandItem>
              ))}
              <FieldFormModal type="personalized_fields" modalType="add">
                <Button variant="outline" size="sm" className="m-2">
                  Add Field
                </Button>
              </FieldFormModal>
              <CommandSeparator />
            </CommandGroup>
            <CommandGroup heading={capitalizeFirstLetter("enriched fields")}>
              {fieldsList.enriched_fields.map((field, index) => (
                <CommandItem key={index}>
                  <FieldFormModal
                    type="enriched_fields"
                    modalType="edit"
                    fieldId={field.id}
                  >
                    <div>{field.fieldName}</div>
                  </FieldFormModal>
                </CommandItem>
              ))}
              <FieldFormModal type="enriched_fields" modalType="add">
                <Button variant="outline" size="sm" className="m-2">
                  Add Field
                </Button>
              </FieldFormModal>
              <CommandSeparator />
            </CommandGroup>
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
