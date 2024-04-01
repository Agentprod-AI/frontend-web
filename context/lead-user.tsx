import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

// Define the type for a single lead

export interface Organization {
  id: string;
  type: string;
  name: string;
  website_url: string | null;
  blog_url: string | null;
  angellist_url: string | null; // Adjusted to allow null, matching your provided structure
  linkedin_url: string;
  twitter_url: string;
  facebook_url: string;
  primary_phone: {
    number: string;
    source: string;
  };
  languages: string[];
  alexa_ranking: number;
  phone: string | null;
  linkedin_uid: string;
  founded_year: number;
  publicly_traded_symbol: string | null; // Adjusted to allow null
  publicly_traded_exchange: string | null; // Adjusted to allow null
  logo_url: string;
  crunchbase_url: string | null;
  primary_domain: string | null;
  domain?: string | null;
  sanitized_phone: string;
  market_cap: string | number | null;
  organization_raw_address?: string | null;
  organization_city?: string | null;
  organization_street_address?: string | null;
  organization_state?: string | null;
  organization_country?: string | null;
  organization_postal_code?: string | null;
}
export interface Lead {
  id: string;
  type: string;
  campaign_id: string | undefined;
  first_name: string;
  last_name: string;
  name: string;
  linkedin_url: string;
  title: string;
  email_status: string;
  photo_url: string;
  twitter_url: string | null;
  github_url: string | null;
  facebook_url: string | null;
  extrapolated_email_confidence: null; // Assuming null, adjust if there's a specific type
  headline: string;
  email: string;
  organization_id: string;
  employment_history: any[];
  state: string;
  city: string;
  country: string;
  organization: Organization;
  is_likely_to_engage: boolean;
  departments: string[];
  subdepartments: string[];
  seniority: string;
  functions: string[];
  phone_numbers: any[];
  intent_strength: null; // Assuming null, adjust if there's a specific type
  show_intent: boolean;
  revealed_for_current_team: boolean;
}

export interface Contact {
  id: string;
  campaign_id: string;
  type: string;
  name: string;
  first_name: string;
  last_name: string | null;
  title: string | null;
  headline: string | null;
  city: string | null;
  country: string | null;
  state: string | null;
  departments: string[];
  email: string;
  employment_history: any;
  extrapolated_email_confidence: string | null;
  facebook_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  phone_numbers: any;
  photo_url: string | null;
  functions: string[] | null;
  seniority: string | null;
  subdepartments: string[] | null;
  intent_strength: string | null;
  is_likely_to_engage: boolean | null;
  revealed_for_current_team: boolean | null;
  show_intent: boolean | null;
  last_contacted: string;
  responded: "Responded" | "Not Responded";
}

// Define the state structure for our context
interface LeadsContextState {
  leads: Lead[] | Contact[];
  setLeads: (leads: Lead[] | Contact[]) => void;
}

// Default state with initial values
const defaultState: LeadsContextState = {
  leads: [],
  setLeads: () => {},
};

// Creating the context
const LeadsContext = createContext<LeadsContextState>(defaultState);

interface LeadsProviderProps {
  children: ReactNode;
}

// Context provider component
export const LeadsProvider: React.FC<LeadsProviderProps> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[] | Contact[]>(defaultState.leads);

  const contextValue = useMemo(
    () => ({
      leads,
      setLeads,
    }),
    [leads]
  );

  return (
    <LeadsContext.Provider value={contextValue}>
      {children}
    </LeadsContext.Provider>
  );
};

// Custom hook to use the leads context
export const useLeads = () => useContext(LeadsContext);
