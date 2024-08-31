/* eslint-disable no-console */
// hooks/useCreateCampaign.tsx
import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "./user-context";

// Existing interfaces and type definitions remain unchanged
export interface CampaignFormData {
  [key: string]: any;
  campaignName: string;
  campaignType: "Outbound" | "Inbound" | "Nurturing";
  schedule: {
    weekdayStartTime?: string;
    weekdayEndTime?: string;
  };
}

export interface OfferingFormData {
  name: string;
  details: string;
}

export interface GoalFormData {
  success_metric: string;
  scheduling_link: string;
  emails: { value: string }[];
  follow_up_days: number;
  follow_up_times: number;
  mark_as_lost: number;
}

export interface CampaignEntry {
  id: string;
  user_id: string;
  campaign_name: string;
  is_active: boolean;
  campaign_type: string;
  daily_outreach_number?: number;
  start_date?: string;
  end_date?: string;
  schedule_type: string;
  description?: string;
  additional_details?: string;
  monday_start?: string;
  monday_end?: string;
  tuesday_start?: string;
  tuesday_end?: string;
  wednesday_start?: string;
  wednesday_end?: string;
  thursday_start?: string;
  thursday_end?: string;
  friday_start?: string;
  friday_end?: string;
  contacts?: any;
  offering_details: any[];
  replies: any;
  meetings_booked: any;
  created_at: string; // Add this field
  detail: string;
}

interface CampaignContextType {
  campaigns: CampaignEntry[];
  createCampaign: (data: CampaignFormData) => void;
  editCampaign: (data: CampaignFormData, campaignId: string) => void;
  deleteCampaign: (campaignId: string) => void;
  createOffering: (data: OfferingFormData, campaignId: string) => void;
  editOffering: (data: OfferingFormData, campaignId: string) => void;
  createGoal: (data: GoalFormData, campaignId: string) => void;
  editGoal: (data: GoalFormData, goalId: string, campaignId: string) => void;
  toggleCampaignIsActive: (campaignId: string) => void;
  isLoading: boolean;
  setCampaigns: React.Dispatch<React.SetStateAction<CampaignEntry[]>>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

export const CampaignProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const router = useRouter();
  const { user } = useUserContext();

  const [campaigns, setCampaigns] = useState<CampaignEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    if (user && user.id) {
      setUserId(user.id);
    }
  }, [user]);

  const createCampaign = (data: CampaignFormData) => {
    const postData = {
      user_id: userId,
      campaign_name: data.campaignName,
      campaign_type: data.campaignType,
      monday_start: data.schedule.weekdayStartTime,
      monday_end: data.schedule.weekdayEndTime,
      tuesday_start: data.schedule.weekdayStartTime,
      tuesday_end: data.schedule.weekdayEndTime,
      wednesday_start: data.schedule.weekdayStartTime,
      wednesday_end: data.schedule.weekdayEndTime,
      thursday_start: data.schedule.weekdayStartTime,
      thursday_end: data.schedule.weekdayEndTime,
      friday_start: data.schedule.weekdayStartTime,
      friday_end: data.schedule.weekdayEndTime,
      schedule_type: "none",
      autopilot: false,
      is_active: false,
    };

    if (postData)
      axiosInstance
        .post("v2/campaigns/", postData)
        .then((response) => {
          console.log("Campaign created successfully:", response);
          setCampaigns((prevCampaigns) => [response.data, ...prevCampaigns]);
          let formsTracker = JSON.parse(
            localStorage.getItem("formsTracker") || "{}"
          );
          formsTracker.schedulingBudget = true;
          formsTracker.campaignId = response.data.id;
          localStorage.setItem("formsTracker", JSON.stringify(formsTracker));

          router.push(`/dashboard/campaign/${response.data.id}`);
        })
        .catch((error) => {
          console.error("Error creating Campaign:", error);
          toast({
            title: "Error creating campaign",
            description: error.message || "Failed to create campaign.",
          });
        });
  };

  const editCampaign = (data: CampaignFormData, campaignId: string) => {
    axiosInstance
      .put(`v2/campaigns/${campaignId}`, data)
      .then((response) => {
        console.log("Campaign edited successfully:", response.data);
        router.push(`/dashboard/campaign/${campaignId}`);
      })
      .catch((error) => {
        console.error("Error editing campaign:", error);
        toast({
          title: "Error editing campaign",
          description: error.message || "Failed to edit campaign.",
        });
      });
  };

  const deleteCampaign = (campaignId: string) => {
    axiosInstance
      .delete(`v2/campaigns/${campaignId}`)
      .then((response) => {
        console.log("Campaign deleted successfully:", response.data);
        setCampaigns((currentCampaigns) =>
          currentCampaigns.filter((campaign) => campaign.id !== campaignId)
        );
        router.push("/dashboard/campaign");
      })
      .catch((error) => {
        console.error("Error deleting campaign:", error);
        toast({
          title: "Error deleting campaign",
          description: error.message || "Failed to delete campaign.",
        });
      });
  };

  const createOffering = (data: OfferingFormData, campaignId: string) => {
    const postData = {
      campaign_id: campaignId,
      name: data.name,
      details: data.details,
    };

    axiosInstance
      .post("v2/offerings/", postData)
      .then((response) => {
        let formsTracker = JSON.parse(
          localStorage.getItem("formsTracker") || "{}"
        );
        formsTracker.offering = true;
        localStorage.setItem("formsTracker", JSON.stringify(formsTracker));

        console.log("Offering created successfully:", response.data);
        router.push(`/dashboard/campaign/${campaignId}`);
      })
      .catch((error) => {
        console.error("Error creating offering:", error);
        toast({
          title: "Error creating offering",
          description: error.message || "Failed to create offering.",
        });
      });
  };

  const editOffering = (data: OfferingFormData, campaignId: string) => {
    axiosInstance
      .put(`v2/offerings/${campaignId}`, data)
      .then((response) => {
        console.log("Offering edited successfully:", response.data);
        router.push(`/dashboard/campaign/${campaignId}`);
      })
      .catch((error) => {
        console.error("Error editing offering:", error);
        toast({
          title: "Error editing offering",
          description: error.message || "Failed to edit offering.",
        });
      });
  };

  const createGoal = (data: GoalFormData, campaignId: string) => {
    const postData = {
      campaign_id: campaignId,
      emails: data.emails.map((email) => email.value),
      current_email: data.emails[0].value,
      success_metric: data.success_metric,
      scheduling_link: `${data.scheduling_link}`,
      follow_up_days: data.follow_up_days,
      follow_up_times: data.follow_up_times,
      mark_as_lost: data.mark_as_lost,
    };

    axiosInstance
      .post("v2/goals/", postData)
      .then((response) => {
        let formsTracker = JSON.parse(
          localStorage.getItem("formsTracker") || "{}"
        );
        formsTracker.goal = true;
        localStorage.setItem("formsTracker", JSON.stringify(formsTracker));

        console.log("Goal created successfully:", response.data);
        router.push(`/dashboard/campaign/${campaignId}`);
      })
      .catch((error) => {
        console.error("Error creating goal:", error);
        toast({
          title: "Error creating goal",
          description: error.message || "Failed to create goal.",
        });
      });
  };

  const editGoal = (data: GoalFormData, goalId: string, campaignId: string) => {
    axiosInstance
      .put(`v2/goals/${goalId}`, data)
      .then((response) => {
        console.log("Goal edited successfully:", response.data);
        router.push(`/dashboard/campaign/${campaignId}`);
      })
      .catch((error) => {
        console.error("Error editing goal:", error);
        toast({
          title: "Error editing offering",
          description: error.message || "Failed to edit goal.",
        });
      });
  };

  const toggleCampaignIsActive = (id: string) => {
    setCampaigns((currentCampaigns) =>
      currentCampaigns.map((campaign) =>
        campaign.id === id
          ? { ...campaign, is_active: !campaign.is_active }
          : campaign
      )
    );
  };

  useEffect(() => {
    const fetchCampaigns = () => {
      if (userId) {
        axiosInstance
          .get<CampaignEntry[]>(`v2/campaigns/all/${userId}`)
          .then((response) => {
            console.log("response from all campaigns api", response);

            // Sort campaigns based on created_at field
            const sortedCampaigns = response.data.sort((a, b) => {
              const dateA = new Date(a.created_at).getTime();
              const dateB = new Date(b.created_at).getTime();
              return dateB - dateA; // Sort in descending order (newest first)
            });

            setCampaigns(sortedCampaigns);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching campaign:", error);
            setError(error.message || "Failed to load campaign.");
            setIsLoading(false);
          });
      }
    };

    fetchCampaigns(); // Fetch initially

    // const intervalId = setInterval(fetchCampaigns, 10000); // Fetch every 10 seconds

    // return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [userId, campaigns.length]);

  const contextValue = useMemo(
    () => ({
      createCampaign,
      editCampaign,
      deleteCampaign,
      createOffering,
      editOffering,
      createGoal,
      editGoal,
      toggleCampaignIsActive,
      campaigns,
      isLoading,
      setCampaigns,
    }),
    [campaigns, isLoading]
  );

  return (
    <CampaignContext.Provider value={contextValue}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error(
      "useCampaignContext must be used within a CampaignProvider"
    );
  }
  return context;
};
