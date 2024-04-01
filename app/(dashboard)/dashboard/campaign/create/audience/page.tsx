"use client";
import PeopleFormComponent from "@/components/forms/people-form";
import OrgFormComponenet from "@/components/forms/org-form";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useState } from "react";

export default function Page() {
  const [isPeopleFormActive, setIsPeopleFormActive] = useState<boolean>(true);

  function onRadioChange(value: string) {
    if (value === "org") {
      setIsPeopleFormActive(false);
    } else {
      setIsPeopleFormActive(true);
    }
  }

  return (
    <>
      <RadioGroup
        className="my-3 flex"
        defaultValue="people"
        onValueChange={onRadioChange}
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
    </>
  );
}