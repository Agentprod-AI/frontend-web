// hooks/useCreateCampaign.tsx
import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "./user-context";

interface CampaignFormData {
  [key: string]: any;
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

interface GoalFormData {
  success_metric: string;
  scheduling_link: string;
  emails: { value: string }[];
  follow_up_days: number;
  follow_up_times: number;
  mark_as_lost: number;
}

interface CampaignEntry {
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
}

const defaultCampaignEntry: CampaignEntry = {
  id: "",
  user_id: "",
  campaign_name: "",
  is_active: false,
  campaign_type: "",
  daily_outreach_number: 0,
  start_date: "",
  end_date: "",
  schedule_type: "",
  description: "",
  additional_details: "",
  monday_start: "",
  monday_end: "",
  tuesday_start: "",
  tuesday_end: "",
  wednesday_start: "",
  wednesday_end: "",
  thursday_start: "",
  thursday_end: "",
  friday_start: "",
  friday_end: "",
};

const defaultGoalEntry: GoalFormData = {
  success_metric: "",
  scheduling_link: "",
  emails: [],
  follow_up_days: 0,
  follow_up_times: 0,
  mark_as_lost: 0,
};

const defaultOfferingEntry: OfferingFormData = {
  product_offering: "",
  offering_details: "",
};

interface CampaignContextType {
  camoaingId: string | null;
  campaigns: CampaignEntry[];
  createCampaign: (data: CampaignFormData) => void;
  editCampaign: (data: CampaignFormData) => void;
  deleteCampaign: (campaignId: string) => void;
  createOffering: (data: OfferingFormData) => void;
  editOffering: (data: OfferingFormData) => void;
  createGoal: (data: GoalFormData) => void;
  editGoal: (data: GoalFormData) => void;
  toggleCampaignIsActive: (campaignId: string) => void;
  getCampaignById: (campaignId: string) => CampaignEntry;
  getGoalById: (campaignId: string) => GoalFormData;
  getOfferingById: (campaignId: string) => OfferingFormData;
  isLoading: boolean;
}

const defaultCampaignState: CampaignContextType = {
  campaigns: [],
  createCampaign: () => {},
  editCampaign: () => {},
  deleteCampaign: () => {},
  createOffering: () => {},
  editOffering: () => {},
  createGoal: () => {},
  editGoal: () => {},
  toggleCampaignIsActive: () => {},
  getCampaignById: (campaignId: string) => ({ ...defaultCampaignEntry }),
  getGoalById: (campaignId: string) => ({ ...defaultGoalEntry }),
  getOfferingById: (campaignId: string) => ({ ...defaultOfferingEntry }),
  isLoading: true,
};

// Use the default state when creating the context
const CampaignContext =
  createContext<CampaignContextType>(defaultCampaignState);

interface Props {
  children: ReactNode;
}

export const CampaignProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  const router = useRouter();
  // const { user } = useAuth();
  const { user } = useUserContext();
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [isUserLoaded, setIsUserLoaded] = React.useState(false);
  const [userId, setUserId] = React.useState<string>();

  React.useEffect(() => {
    if (user && user.id) {
      setUserId(user.id);
    }
  }, [user]);

  // Experiment with the useEffect hook to see if it can be used to set the campaignId in localStorage

  React.useEffect(() => {
    if (campaignId) {
      localStorage.setItem("campaignId", campaignId);
    }
  }, [campaignId]);
  // --------------------------------------------

  const createCampaign = (data: CampaignFormData) => {
    console.log("user from camapgin", user);
    const postData = {
      user_id: userId,
      campaign_name: data.campaignName,
      campaign_type: data.campaignType,
      daily_outreach_number: data.dailyOutreach,
      monday_start: data.schedule.mondayStartTime,
      monday_end: data.schedule.mondayEndTime,
      tuesday_start: data.schedule.tuesdayStartTime,
      tuesday_end: data.schedule.tuesdayEndTime,
      wednesday_start: data.schedule.wednesdayStartTime,
      wednesday_end: data.schedule.wednesdayEndTime,
      thursday_start: data.schedule.thursdayStartTime,
      thursday_end: data.schedule.thursdayEndTime,
      friday_start: data.schedule.fridayStartTime,
      friday_end: data.schedule.fridayEndTime,

      is_active: true,
      schedule_type: "none",
    };

    if (postData)
      axiosInstance
        .post("v2/campaigns/", postData)
        .then((response) => {
          console.log("Campaign created successfully:", response);
          setCampaignId(response.data.id);
          console.log(response.data.id, "response.data.id");
          console.log(campaignId, "campaignId");
          localStorage.setItem("campaignId", response.data.id);
          let formsTracker = JSON.parse(
            localStorage.getItem("formsTracker") || "{}"
          );
          formsTracker.schedulingBudget = true;
          localStorage.setItem("formsTracker", JSON.stringify(formsTracker));

          router.push("/dashboard/campaign/create");
        })
        .catch((error) => {
          console.error("Error creating Campaign:", error);
          toast({
            title: "Error creating campaign",
            description: error.message || "Failed to create campaign.",
          });
        });
  };

  const editCampaign = (data: CampaignFormData) => {
    axiosInstance
      .put(`v2/campaigns/${campaignId}`, data)
      .then((response) => {
        console.log("Campaign edited successfully:", response.data);
        router.push("/dashboard/campaign/create");
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
        router.push("/dashboard/campaigns");
      })
      .catch((error) => {
        console.error("Error deleting campaign:", error);
        toast({
          title: "Error deleting campaign",
          description: error.message || "Failed to delete campaign.",
        });
      });
  };

  const createOffering = (data: OfferingFormData) => {
    const postData = {
      campaign_id: localStorage.getItem("campaignId"),
      name: data.product_offering,
      details: data.offering_details,
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
        router.push("/dashboard/campaign/create");
      })
      .catch((error) => {
        console.error("Error creating offering:", error);
        toast({
          title: "Error creating offering",
          description: error.message || "Failed to create offering.",
        });
      });
  };

  const editOffering = (data: OfferingFormData) => {
    axiosInstance
      .put(`v2/offerings/${campaignId}`, data)
      .then((response) => {
        console.log("Offering edited successfully:", response.data);
        router.push("/dashboard/campaign/create");
      })
      .catch((error) => {
        console.error("Error editing offering:", error);
        toast({
          title: "Error editing offering",
          description: error.message || "Failed to edit offering.",
        });
      });
  };

  const createGoal = (data: GoalFormData) => {
    const postData = {
      campaign_id: localStorage.getItem("campaignId"),
      emails: data.emails.map((email) => email.value),
      current_email: "muskaan@agentprodai.com",
      success_metric: data.success_metric,
      scheduling_link: data.scheduling_link,
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
        router.push("/dashboard/campaign/create");
      })
      .catch((error) => {
        console.error("Error creating goal:", error);
        toast({
          title: "Error creating goal",
          description: error.message || "Failed to create goal.",
        });
      });
  };

  const editGoal = (data: GoalFormData) => {
    axiosInstance
      .put(`v2/goals/${campaignId}`, data)
      .then((response) => {
        console.log("Goal edited successfully:", response.data);
        router.push("/dashboard/campaign/create");
      })
      .catch((error) => {
        console.error("Error editing goal:", error);
        toast({
          title: "Error editing offering",
          description: error.message || "Failed to edit goal.",
        });
      });
  };

  const getCampaignById = (campaignId: string): CampaignEntry => {
    axiosInstance
      .get(`v2/campaigns/${campaignId}`)
      .then((response) => {
        console.log("Campaign fetched successfully:", response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching campaign:", error);
        toast({
          title: "Error fetching campaign",
          description: error.message || "Failed to fetch campaign.",
        });
      });

    return defaultCampaignEntry;
  };

  const getGoalById = (campaignId: string): GoalFormData => {
    axiosInstance
      .get(`v2/goals/${campaignId}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching goal:", error);
        toast({
          title: "Error fetching goal",
          description: error.message || "Failed to fetch goal.",
        });
      });

    return defaultGoalEntry;
  };

  const getOfferingById = (campaignId: string): OfferingFormData => {
    axiosInstance
      .get(`v2/offerings/${campaignId}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching offering:", error);
        toast({
          title: "Error fetching offering",
          description: error.message || "Failed to fetch offering.",
        });
      });

    return defaultOfferingEntry;
  };

  const toggleCampaignIsActive = (id: string) => {
    setCampaigns((currentCampaigns) =>
      currentCampaigns.map((campaign) =>
        campaign.campaignId === id
          ? { ...campaign, is_active: !campaign.is_active }
          : campaign
      )
    );
  };

  React.useEffect(() => {
    if (userId) {
      axiosInstance
        .get<CampaignEntry[]>(`v2/campaigns/all/${userId}`)
        .then((response) => {
          console.log("response from all campaigns api", response);
          setCampaigns(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching campaign:", error);
          setError(error.message || "Failed to load campaign.");
          setIsLoading(false);
        });
    }
  }, [userId]);

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
      getCampaignById,
      getGoalById,
      getOfferingById,
      campaigns,
      isLoading,
      campaignId,
    }),
    [userId, campaignId, campaigns]
  );

  return (
    <CampaignContext.Provider value={contextValue}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaignContext = () => useContext(CampaignContext);
