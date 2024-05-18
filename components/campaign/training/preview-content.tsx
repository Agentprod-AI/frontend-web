/* eslint-disable no-console */
// /* eslint-disable import/no-unresolved */
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

import TextField from "./preview-text-field";
import { Data } from "./training_profile_sheet";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/user-context";
import axiosInstance from "@/utils/axiosInstance";
import { useParams } from "next/navigation";
import { PeopleProfileSheet } from "@/components/people-profile-sheet";
import { Lead } from "@/context/lead-user";

interface PreviewContentProps {
  email: {
    subject: string;
    body: string;
  };
  contact: Lead;
  linkedin_information: any; // Replace `any` with appropriate type if available
}

function PreviewContent({
  email: initialEmail,
  contact: initialContact,
  linkedin_information: initialLinkedinInformation,
}: PreviewContentProps) {
  const [newPreviews, setNewPreviews] = React.useState(false);
  const [newContact, setNewContact] = React.useState<Lead>(initialContact);
  const [newSubject, setNewSubject] = React.useState(initialEmail.subject);
  const [newBody, setNewBody] = React.useState(initialEmail.body);
  const [newLinkedinInformation, setNewLinkedinInformation] = React.useState(
    initialLinkedinInformation
  );
  const { user } = useUserContext();
  const params = useParams<{ campaignId: string }>();

  const newPreview = async () => {
    try {
      const response = await axiosInstance.post("v2/training/preview", {
        campaign_id: params.campaignId,
        user_id: user.id,
      });
      console.log("response", response);
      const { email, contact } = response.data;
      setNewPreviews(true);
      setNewSubject(email.subject);
      setNewBody(email.body);
      setNewContact(contact);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setNewPreviews(false);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="">
      <ResizablePanel defaultSize={70}>
        <div className="flex justify-center p-6">
          <div className="flex-col w-full">
            <div className="flex justify-end">
              <Button onClick={newPreview}>New preview</Button>
            </div>
            <div className="flex mt-2 items-center">
              <Avatar className="flex h-10 w-10 items-center justify-center space-y-0 border bg-white mr-2 mt-1">
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              <Input
                placeholder="Subject"
                className="flex-1 h-12"
                value={newSubject}
                readOnly
              />
            </div>

            <div className="flex flex-row gap-2 mt-3">
              <TextField text={newBody} />
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center">
          <PeopleProfileSheet
            data={newContact}
            companyInfoProp={newLinkedinInformation}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default PreviewContent;
