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
  affiliataed_pages: any;
  stock_info: any;
  funding_info: any;
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
