import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

// Define the schema for company info
interface CompanyInfo {
  company_info: {
    website: string;
    industry: string;
    "company size": string;
    headquarters: string;
    type: string;
    specialties: string;
  };
  about_us_description: string;
  addresses: string[];
  employees: {
    name: string;
    role: string;
  }[];
  affiliated_pages: {
    title: string;
    description: string;
  }[];
  stock_info: {
    symbol: string;
    date: string;
    market: string;
    delay_info: string;
    current_price: string;
    open_price: string;
    low_price: string;
    high_price: string;
  };
  funding_info: {
    total_rounds: string;
    last_round_details: string;
    investors: string[];
  };
}

// Define the state structure for company context
interface CompanyContextState {
  companyInfo: CompanyInfo[];
  setCompanyInfo: (companyInfo: CompanyInfo[]) => void;
}

// Default state with initial values
const defaultState: CompanyContextState = {
  companyInfo: [],
  setCompanyInfo: () => {},
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
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>(
    defaultState.companyInfo
  );

  const contextValue = useMemo(
    () => ({
      companyInfo,
      setCompanyInfo,
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
