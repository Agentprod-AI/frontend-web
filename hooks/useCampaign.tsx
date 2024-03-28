// hooks/useCreateCampaign.tsx
import { useState } from 'react';
import axios from 'axios';
import { toast } from "@/components/ui/use-toast";

interface CampaignFormData {
  campaignName: string;
  campaignType: "Outbound" | "Inbound" | "Nurturing";
  dailyOutreach: number;
  schedule: {
    mondayStartTime?: string;
    mondayEndTime?: string;
    tuesdayStartTime?: string;
    tuesdayEndTime?: string;
    wednesdayStartTime?: string;
    wednesdayEndTime?: string;
    thursdayStartTime?: string;
    thursdayEndTime?: string;
    fridayStartTime?: string;
    fridayEndTime?: string;
  };
}

interface OfferingFormData {
  product_offering: string;
  offering_details: string;
}

export const useCreateCampaign = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createCampaign = async (data: CampaignFormData) => {
    setIsLoading(true);
    setError(null);

    const apiRequestBody = {
      campaign_name: data.campaignName,
      status: "Active", 
      start_date: "2024-02-01",
      end_date: "2024-03-01",
      schedule_type: "Weekly",
      start_time: data.schedule.mondayStartTime || "", 
      end_time: data.schedule.fridayEndTime || "", 
      days_of_week: "Mon,Tue,Wed,Thu,Fri", 
    };

    try {
      // const response = await axios.post('http://localhost:3000/v2/campaigns/', apiRequestBody);
      // console.log('Success:', response.data);
      
      localStorage.setItem('campaignId', "9b0660ce-7333-4315-aa3f-e9b0ed6653c4");
      let formsTracker = JSON.parse(localStorage.getItem('formsTracker') || '{}');
      formsTracker.schedulingBudget = true;
      localStorage.setItem('formsTracker', JSON.stringify(formsTracker));
      
      toast({
        title: "Campaign successfully created",
        description: "Your campaign has been created successfully.",
      });
    } catch (error) {
      console.error('Failure:', error);
      setError(error as Error);
      toast({
        title: "Error creating campaign",
        description: "There was an error creating your campaign. Please try again.",
      });
    }

    setIsLoading(false);
  };

  const createOffering = async (data: OfferingFormData) => {
    setIsLoading(true);
    setError(null);

    const campaignId = localStorage.getItem('campaignId');
    if (!campaignId) {
      toast({
        title: "Error",
        description: "No campaign ID found in localStorage.",
      });
      setIsLoading(false);
      return;
    }

    const apiRequestBody = {
      campaign_id: campaignId,
      name: data.product_offering,
      details:  data.offering_details,
    };

    try {
      // const response = await axios.post('http://localhost:3000/v2/offerings/', apiRequestBody);
      // console.log('Success:', response.data);

      let formsTracker = JSON.parse(localStorage.getItem('formsTracker') || '{}');
      formsTracker.offering = true;
      localStorage.setItem('formsTracker', JSON.stringify(formsTracker));

      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (error) {
      console.error('Failure:', error);
      setError(error as Error);
      toast({
        title: "Error creating offer",
        description: "There was an error creating your offer. Please try again.",
      });
    }

    setIsLoading(false);
  };

  return {
    createCampaign,
    createOffering,
    isLoading,
    error,
  };
};