/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
// hooks/useCreateCampaign.tsx
import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  ReactNode,
} from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "./user-context";

type HotLead = {
  id: string;
  photo_url: string;
  fallback: string;
  name: string;
  company: string;
};

type TopPerformingCampaign = {
  campaign_name: string;
  engaged_leads: number;
  response_rate: number;
  bounce_rate: number;
  open_rate: number;
};

type ConversionFunnel = {
  [key: string]: number;
};

type EmailStats = {
  open_rate: number;
  reply_rate: number;
  conversion_rate: number;
  unsubscribed_rate: number;
  deliverability_rate: number;
  negative_email_rate: number;
  positive_email_rate: number;
};

interface DashboardEntry {
  id: number;
  pending_approvals: number;
  user_id: string;
  emails_sent: number | null;
  engaged: number | null;
  meetings_booked: number | null;
  response_rate: number;
  conversion_funnel: ConversionFunnel;
  hot_leads: HotLead[];
  mailbox_health: { [email: string]: number };
  top_performing_campaigns: TopPerformingCampaign[];
  email_stats: EmailStats;
}

interface DashboardContextType {
  dashboardData: DashboardEntry;
  isLoading: boolean;
  setDashboardData: (dashboardData: DashboardEntry) => void;
}

const defaultDashboardState: DashboardContextType = {
  dashboardData: {
    id: 0,
    user_id: "",
    pending_approvals: 0,
    emails_sent: null,
    engaged: null,
    meetings_booked: null,
    response_rate: 0,
    hot_leads: [],
    mailbox_health: {},
    conversion_funnel: {},
    top_performing_campaigns: [],
    email_stats: {
      open_rate: 0,
      reply_rate: 0,
      conversion_rate: 0,
      unsubscribed_rate: 0,
      deliverability_rate: 0,
      negative_email_rate: 0,
      positive_email_rate: 0,
    },
  },
  isLoading: true,
  setDashboardData: () => {},
};

// Use the default state when creating the context
const DashboardContext = createContext<DashboardContextType>(
  defaultDashboardState
);

interface Props {
  children: ReactNode;
}

export const DashboardProvider: React.FunctionComponent<Props> = ({
  children,
}) => {
  // const { user } = useAuth();
  const { user } = useUserContext();
  const [dashboardData, setDashboardData] = useState<any>({
    emails_sent: null,
    engaged: null,
    meetings_booked: null,
    response_rate: null,
    hot_leads: [],
    top_performing_campaigns: [],
    mailbox_health: {},
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    axiosInstance
      .get<DashboardEntry[]>(`v2/dashboard/${user?.id}`)
      .then((response) => {
        setDashboardData(response.data);
        console.log("Dashboard Data comingggg:", response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data.");
        setIsLoading(false);
      });

    // axiosInstance
    // .get<DashboardEntry[]>(`v2/contacts/${leadId}`)
    // .then((response) => {
    //   setDashboardData(response.data);
    //   setIsLoading(false);
    // })
    // .catch((error) => {
    //   console.error("Error fetching data:", error);
    //   setError(error.message || "Failed to load data.");
    //   setIsLoading(false);
    // });
  }, [user]); // chnage to user only if any error

  const contextValue = useMemo(
    () => ({
      dashboardData,
      isLoading,
      setDashboardData,
    }),
    [dashboardData, isLoading]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
