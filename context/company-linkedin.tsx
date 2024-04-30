import axiosInstance from "@/utils/axiosInstance";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

// Define the schema for company info
export interface CompanyInfo {
  id: string;
  company_info: any;
  about_us: string;
  addresses: string[];
  affiliated_pages: any;
  stock_info: any;
  funding_info: any;
}

// Define the state structure for company context
interface CompanyContextState {
  companyInfo: CompanyInfo;
  setCompanyInfo: (companyInfo: CompanyInfo) => void;
  getCompanyInfo: (companyLinkedin: string) => void;
}

// Default state with initial values
const defaultState: CompanyContextState = {
  companyInfo: {
    id: "",
    company_info: {},
    about_us: "",
    addresses: [],
    affiliated_pages: {},
    stock_info: [],
    funding_info: [],
  },
  setCompanyInfo: () => {},
  getCompanyInfo: (companyLinkedin: string) => {},
};

// Create company context
const CompanyContext = createContext<CompanyContextState>(defaultState);

interface CompanyProviderProps {
  children: ReactNode;
}

// Context provider component
export const CompanyProvider: React.FC<CompanyProviderProps> = ({
  children,
}) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(
    defaultState.companyInfo
  );

  const getCompanyInfo = (companyLinkedin: string) => {
    console.log("get company info", companyLinkedin);
    axiosInstance
      .post("v2/linkedin_scraper/company/", {
        company_linkedin_url: companyLinkedin,
      })
      .then((res) => {
        setCompanyInfo(res.data);
        console.log("company info", res.data);
        Object.values(res.data).map((item) => {
          console.log(item);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const contextValue = useMemo(
    () => ({
      companyInfo,
      setCompanyInfo,
      getCompanyInfo,
    }),
    [companyInfo]
  );

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook to use the company context
export const useCompanyInfo = () => useContext(CompanyContext);
