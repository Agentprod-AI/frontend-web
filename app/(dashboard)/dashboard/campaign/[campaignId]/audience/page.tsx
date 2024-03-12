"use client";
import PeopleFormComponent from "@/components/forms/people-form";
import OrgFormComponenet from "@/components/forms/org-form";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

import { useState } from "react";

export default function Page() {
  const [isPeopleFormActive, setIsPeopleFormActive] = useState<boolean>(true);
  const [isProspectActive, setIsProspectActive] = useState<boolean>(true);

  function onFormRadioChange(value: string) {
    if (value === "org") {
      setIsPeopleFormActive(false);
    } else {
      setIsPeopleFormActive(true);
    }
  }

  function onProspectRadioChange(value: string) {
    if (value === "prospect") {
      setIsProspectActive(true);
    } else {
      setIsProspectActive(false);
    }
  }

  return (
    <>
      <RadioGroup
        className="mb-3 flex"
        defaultValue="prospect"
        onValueChange={onProspectRadioChange}
      >
        <div className="text-sm text-muted-foreground mr-3">Audience Type</div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="prospect" />
          <Label htmlFor="prospect">Prospect</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="import" />
          <Label htmlFor="import">Import</Label>
        </div>
      </RadioGroup>
      {isProspectActive ? (
        <div>
          <RadioGroup
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
          </RadioGroup>
          {isPeopleFormActive ? <PeopleFormComponent /> : <OrgFormComponenet />}
        </div>
      ) : (
        <div>
          <div className="my-2">File</div>
          <Input type="file" className="w-1/5"></Input>
        </div>
      )}
    </>
  );
}
