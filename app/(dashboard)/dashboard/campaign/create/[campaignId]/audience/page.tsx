"use client";
import PeopleFormComponent from "@/components/forms/people-form";
// import OrgFormComponenet from "@/components/forms/org-form";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useEffect, useState } from "react";
import { ImportAudience } from "@/components/campaign/import-audience";
import { SelectFromExisting } from "@/components/campaign/select-from-existing";
import { getCampaignById } from "@/components/campaign/camapign.api";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ campaignId: string }>();

  // const [isPeopleFormActive, setIsPeopleFormActive] = useState<boolean>(true);
  const [isProspectActive, setIsProspectActive] = useState<boolean>(true);
  const [isImportActive, setIsImportActive] = useState<boolean>(false);
  const [isExisting, setIsExisting] = useState<boolean>(false);
  const [campaignType, setCampaignType] = useState("");
  // const [isFromExistingActive, setIsFromExistingActive] =
  useState<boolean>(false);

  // function onFormRadioChange(value: string) {
  //   if (value === "org") {
  //     setIsPeopleFormActive(false);
  //   } else {
  //     setIsPeopleFormActive(true);
  //   }
  // }

  useEffect(() => {
    const fetchCampaign = async () => {
      const id = params.campaignId;
      console.log("id in form", id);
      if (id) {
        const campaign = await getCampaignById(id);
        setCampaignType(campaign.campaign_type);
        console.log("campaign in budget form =>", campaign.campaign_type);

        // Set initial state based on the campaign type
        if (campaign.campaign_type === "Outbound") {
          setIsProspectActive(true);
          setIsImportActive(false);
          setIsExisting(false);
        } else if (campaign.campaign_type === "Inbound") {
          setIsProspectActive(false);
          setIsImportActive(true);
          setIsExisting(false);
        } else if (campaign.campaign_type === "Nurturing") {
          setIsProspectActive(false);
          setIsImportActive(false);
          setIsExisting(true);
        }
      }
    };

    fetchCampaign();
  }, [params.campaignId]);

  function onProspectRadioChange(value: string) {
    if (campaignType === "Outbound") {
      setIsProspectActive(true);
      setIsImportActive(false);
      setIsExisting(false);
    } else if (campaignType === "Inbound") {
      setIsProspectActive(false);
      setIsImportActive(true);
      setIsExisting(false);
    } else if (campaignType === "Nurturing") {
      setIsProspectActive(false);
      setIsImportActive(false);
      setIsExisting(true);
    }
  }

  return (
    <>
      <RadioGroup
        className="mb-3"
        defaultValue="prospect"
        onValueChange={onProspectRadioChange}
        disabled
      >
        <div className="text-sm text-muted-foreground">Audience Type</div>
        <div className="flex">
          <div className="flex items-center space-x-2 mr-3">
            <RadioGroupItem value="prospect" checked={isProspectActive} />
            <Label htmlFor="prospect">Prospect</Label>
          </div>
          <div className="flex items-center space-x-2 mr-3">
            <RadioGroupItem value="import" checked={isImportActive} />
            <Label htmlFor="import">Import</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="select-from-existing" checked={isExisting} />
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
        <SelectFromExisting />
      )}
    </>
  );
}
