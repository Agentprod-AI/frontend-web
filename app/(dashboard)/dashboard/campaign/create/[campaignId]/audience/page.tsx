"use client";
import PeopleFormComponent from "@/components/forms/people-form";
// import OrgFormComponenet from "@/components/forms/org-form";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { set } from "date-fns";
import { ImportAudience } from "@/components/campaign/import-audience";
import { useRouter } from "next/router";

export default function Page() {
  // const [isPeopleFormActive, setIsPeopleFormActive] = useState<boolean>(true);
  const [isProspectActive, setIsProspectActive] = useState<boolean>(true);
  const [isImportActive, setIsImportActive] = useState<boolean>(false);
  // const [isFromExistingActive, setIsFromExistingActive] =
  useState<boolean>(false);

  // function onFormRadioChange(value: string) {
  //   if (value === "org") {
  //     setIsPeopleFormActive(false);
  //   } else {
  //     setIsPeopleFormActive(true);
  //   }
  // }

  function onProspectRadioChange(value: string) {
    if (value === "prospect") {
      setIsProspectActive(true);
    } else {
      setIsProspectActive(false);
      if (value === "import") {
        setIsImportActive(true);
      } else {
        setIsImportActive(false);
        // setIsFromExistingActive(true);
      }
    }
  }

  return (
    <>
      <RadioGroup
        className="mb-3"
        defaultValue="prospect"
        onValueChange={onProspectRadioChange}
      >
        <div className="text-sm text-muted-foreground">Audience Type</div>
        <div className="flex">
          <div className="flex items-center space-x-2 mr-3">
            <RadioGroupItem value="prospect" />
            <Label htmlFor="prospect">Prospect</Label>
          </div>
          <div className="flex items-center space-x-2 mr-3">
            <RadioGroupItem value="import" />
            <Label htmlFor="import">Import</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="select-from-existing" />
            <Label htmlFor="select-from-existing">Select from existing</Label>
          </div>
        </div>
      </RadioGroup>
      {isProspectActive ? (
        <div>
          {/* <RadioGroup
            className="my-3 flex"
            defaultValue="people"
            onValueChange={onFormRadioChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="people" />
              <Label htmlFor="people">People</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="org" />
              <Label htmlFor="org">Organizations</Label>
            </div>
          </RadioGroup> */}
          {/* {isPeopleFormActive ?  */}
          <PeopleFormComponent type="create" />
          {/* : <OrgFormComponenet />} */}
        </div>
      ) : isImportActive ? (
        <ImportAudience />
      ) : (
        <div>Select from existing placeholder</div>
      )}
    </>
  );
}
