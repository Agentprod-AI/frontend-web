/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "./user-context"; // Assuming this is correctly imported

interface MailGraphData {
  date: string;
  emails: number;
  new_emails: number;
}

interface MailGraphContextType {
  mailGraphData: MailGraphData[]; // Corrected property names
  isLoading: boolean;
  setMailGraphData: (data: MailGraphData[]) => void; // Corrected setter name
}

const defaultMailGraphState: MailGraphContextType = {
  mailGraphData: [],
  isLoading: true,
  setMailGraphData: () => {}, // Make sure the default state matches the interface
};

const MailGraphContext = createContext<MailGraphContextType>(
  defaultMailGraphState
);

export const MailGraphProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUserContext();
  const [mailGraphData, setMailGraphData] = useState<MailGraphData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<MailGraphData[]>(
          `/v2/mailgraph/${user?.id}`
        );
        setMailGraphData(response.data);
        console.log("Mailgraph Data comingggg:", response.data);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching mailgraph data:", error);
        setError(error.message || "Failed to load data.");
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const contextValue = useMemo(
    () => ({
      mailGraphData,
      isLoading,
      setMailGraphData,
    }),
    [mailGraphData, isLoading]
  );

  return (
    <MailGraphContext.Provider value={contextValue}>
      {children}
    </MailGraphContext.Provider>
  );
};

export const useMailGraphContext = () => useContext(MailGraphContext);
