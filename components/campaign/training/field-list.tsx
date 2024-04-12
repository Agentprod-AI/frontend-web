"use client";

import React, { useEffect, useState } from "react";
import {
  BadgePercent,
  CurlyBraces,
  ListRestart,
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
  CommandShortcut,
} from "@/components/ui/command";
import { allFieldsListType } from "@/app/(dashboard)/dashboard/campaign/[campaignId]/training/page";
import { Button } from "@/components/ui/button";
import { FieldFormModal, TrainingResponse } from "./field-form-modal";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getTraining } from "./training.api";

export default function FieldList({ setFieldsList }: { setFieldsList: (val: allFieldsListType) => void }) {
  const [fieldsList, setFieldsListState] = useState<allFieldsListType>({
    variable: [],
    personalized: [],
    offering: [],
    enriched: [],
  });

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fields: TrainingResponse[] = await Promise.all([
          getTraining("variable"),
          getTraining("personalized"),
          getTraining("offering"),
          getTraining("enriched"),
        ]);

        /**
         * Updates the `fieldsList` state with the fetched training data.
         * The `fieldsList` state is an object with four properties:
         * - `variable`: an array of `TrainingResponse` objects for variable fields
         * - `personalized`: an array of `TrainingResponse` objects for personalized fields
         * - `offering`: an array of `TrainingResponse` objects for offering fields
         * - `enriched`: an array of `TrainingResponse` objects for enriched fields
         */
        const updatedFieldsList: allFieldsListType = {
          variable: fields[0],
          personalized: fields[1],
          offering: fields[2],
          enriched: fields[3],
        };
        setFieldsListState(updatedFieldsList);
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
              {fieldsList[field as keyof allFieldsListType].map((val: any, ind: any) => (
                <CommandItem key={ind}>
                  {
                    {
                      variable: <CurlyBraces className="mr-2 h-4 w-4 min-w-3" />,
                      personalized: <UserCog2 className="mr-2 h-4 w-4 min-w-3" />,
                      offering: <BadgePercent className="mr-2 h-4 w-4 min-w-3" />,
                      enriched: <ShieldCheck className="mr-2 h-4 w-4 min-w-3" />,
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
                    <Badge variant={"outline"}>
                      <TextQuote className="h-3 w-3 mr-1" /> {val.length}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <FieldFormModal
              type={field}
              modalType="add"
              setFieldsList={setFieldsList}
              fieldsList={fieldsList}
            >
              <Button variant={"outline"} size={"sm"} className="m-2">
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