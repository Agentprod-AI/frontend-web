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
import { Data, TrainingPeopleProfileSheet } from "./training_profile_sheet";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/user-context";
import axiosInstance from "@/utils/axiosInstance";

function PreviewContent({ subject, body }: any) {
  const [newPreviews, setNewPreviews] = React.useState(false);
  const [newData, setNewData] = React.useState<Data | null>(null);
  const [newSubject, setNewSubject] = React.useState("");
  const [newBody, setNewBody] = React.useState("");
  const [campaignId, setCampaignId] = React.useState("");
  const { user } = useUserContext();

  React.useEffect(() => {
    const storedCampaignId = localStorage.getItem("campaignId");
    if (storedCampaignId) {
      setCampaignId(storedCampaignId);
    }
  }, []);

  const newPreview = async () => {
    try {
      const response = await axiosInstance.post("v2/training/preview", {
        campaign_id: campaignId,
        user_id: user.id,
      });

      const { email, ...restData } = response.data;
      setNewPreviews(true);
      setNewSubject(email.subject);
      setNewBody(email.body);
      setNewData({ ...restData });
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
                value={
                  newPreviews ? newSubject : subject || "Loading subject..."
                }
                readOnly
              />
            </div>

            <div className="flex flex-row gap-2 mt-3">
              <TextField
                text={newPreviews ? newBody : body || "Loading mail..."}
              />
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center">
          <TrainingPeopleProfileSheet
            newData={newData}
            newPreviews={newPreviews}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default PreviewContent;
