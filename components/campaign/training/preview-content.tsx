/* eslint-disable import/no-unresolved */
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import FieldTextArea from "./field-text-area";
import { allFieldsListType } from "./field-form-modal";
import TextField from "./preview-text-field";
import { Contact, Lead, useLeads } from "@/context/lead-user";
import { PeopleProfileSheet } from "@/components/people-profile-sheet";
// import UserDetails from "./user-details";
// import { PeopleProfileSheet } from "@/components/people-profile-sheet";

const allFieldsList: allFieldsListType = {
  variable: [
    {
      id: "1",
      val: "company name",
      description: "The name of the company",
      length: "short",
    },
    {
      id: "2",
      val: "first name",
      description: "The first name of the customer",
      length: "automatic",
    },
  ],
  offering: [
    {
      id: "4",
      val: "customer per industry",
      description: "The industry of the customer",
    },
    {
      id: "5",
      val: "customer per region",
      description: "The region of the customer",
    },
  ],
  personalized: [
    {
      id: "7",
      val: "customer name",
      description: "The name of the customer",
    },
    {
      id: "8",
      val: "customer company",
      description: "The company of the customer",
    },
  ],
  enriched: [
    {
      id: "10",
      val: "enriched",
      description: "The enriched data",
    },
  ],
};


function PreviewContent({ previewData }: { previewData: allFieldsListType }) {

  const [fieldsList, setFieldsList] = React.useState(allFieldsList);
  const { leads } = useLeads();
  const [data, setData] = React.useState<Lead | Contact>();

  return (
    <ResizablePanelGroup direction="horizontal" className="">
      <ResizablePanel defaultSize={75}>
        <div className="flex justify-center p-6">
          <div className="flex-col w-full">
            <div className="flex justify-end">
              <Button>New preview</Button>
            </div>
            <div className="flex flex-row gap-2 mt-3">
              <Avatar className="flex h-8 w-8 items-center justify-center space-y-0 border bg-white mr-2 mt-1">
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              {/* <FieldTextArea fieldsList={previewData} /> */}
              <TextField text={previewData || ""} />
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center">
          <PeopleProfileSheet {...(data as Lead | Contact)} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default PreviewContent;
