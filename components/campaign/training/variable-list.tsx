import React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  CurlyBraces,
  Settings,
  Smile,
  User,
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
import { AllVariablesListType } from "@/app/(dashboard)/dashboard/campaign/[campaignId]/training/page";
import { Button } from "@/components/ui/button";
import { EditModal } from "./edit-modal";
import { AddModal } from "./add-modal";
import { capitalizeFirstLetter } from "@/lib/utils";
export default function VariableList({
  variableList,
}: {
  variableList: AllVariablesListType;
}) {
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search..." />
      <CommandList className="max-h-full">
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.keys(variableList).map((variable, ind) => (
          <div key={ind}>
            <CommandGroup heading={capitalizeFirstLetter(variable)}>
              {variableList[variable].map((val, ind) => (
                <CommandItem key={ind}>
                  <CurlyBraces className="mr-2 h-4 w-4" />
                  <EditModal type={variable}>
                    <span className="w-full">{val.val}</span>
                  </EditModal>
                </CommandItem>
              ))}
            </CommandGroup>
            <AddModal type={variable}>
              <Button variant={"outline"} size={"sm"} className="m-2">
                Add Field
              </Button>
            </AddModal>
            <CommandSeparator />
          </div>
        ))}
      </CommandList>
    </Command>
  );
}
