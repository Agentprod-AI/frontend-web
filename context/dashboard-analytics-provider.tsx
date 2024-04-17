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
import { useAuth } from "./auth-provider";

interface DashboardEntry {
  id: number;
  user_id: string;
  emails_sent: number;
  engaged: number;
  meetings_booked: number;
  response_rate: number;
  hot_leads: [];
  top_performing_campaigns: [];
}

interface DashboardContextType {
  dashboardData: DashboardEntry[];
  isLoading: boolean;
}

const defaultDashboardState: DashboardContextType = {
  dashboardData: [],
  isLoading: true,
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
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const testUserId = "9cbe5057-59fe-4e6e-8399-b9cd85cc9c6c";
    axiosInstance
      .get<DashboardEntry[]>(`v2/dashboard/${testUserId}`)
      .then((response) => {
        setDashboardData(response.data);
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
  }, []);

  const contextValue = useMemo(
    () => ({
      dashboardData,
      isLoading,
    }),
    [dashboardData]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
