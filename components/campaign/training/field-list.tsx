import React from "react";
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
import { FieldFormModal } from "./field-form-modal";
// import { AddModal } from "./add-modal";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
export default function FieldList({
  fieldsList,
  setFieldsList,
}: {
  fieldsList: allFieldsListType;
  setFieldsList: (val: allFieldsListType) => void;
}) {
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search..." />
      <CommandList className="max-h-full">
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.keys(fieldsList).map((field, ind) => (
          <div key={ind}>
            <CommandGroup heading={capitalizeFirstLetter(field + " Fields")}>
              {fieldsList[field].map((val: any, ind: any) => (
                <CommandItem key={ind}>
                  {/* switch for icons for different variable types */}
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
                    <Badge variant={"outline"}>
                      <TextQuote className="h-3 w-3 mr-1" />
                      {val.length}
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
