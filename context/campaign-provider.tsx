import React, { useState } from "react";
import { CampaignInterface } from "@/constants/campaign";

export interface CampaignState {
  campaign?: CampaignInterface[];
  updateCampaignState: (newState: Partial<CampaignState>) => void;
  toggleCampaignEnabled: (id: number) => void;
  activeCampaignId?: number;
  setActiveCampaignId: (id: number | undefined) => void;
}

const defaultCampaignState: CampaignState = {
  campaign: [],
  updateCampaignState: () => {},
  toggleCampaignEnabled: (id: number) => {},
  activeCampaignId: undefined,
  setActiveCampaignId: (id: number | undefined) => {} 
};

const CampaignContext = React.createContext<CampaignState>(defaultCampaignState);

interface Props {
  children: React.ReactNode;
}

export const CampaignProvider: React.FunctionComponent<Props> = ({ children }) => {
  const [state, setState] = useState<CampaignState>(defaultCampaignState);  
  const [activeCampaignId, setActiveCampaignId] = useState<number | undefined>(); 

  const updateCampaignState = (newState: Partial<CampaignState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const toggleCampaignEnabled = (id: number) => {
    setState((prevState) => ({
      ...prevState,
      campaign: prevState.campaign?.map((campaign) =>
        campaign.campaignId == id ? { ...campaign, isEnabled: !campaign.isEnabled } : campaign
      ),
    }));
  };  

  const contextValue = React.useMemo(() => ({
    ...state,
    updateCampaignState,
    toggleCampaignEnabled,
    activeCampaignId,
    setActiveCampaignId, 
  }), [state, activeCampaignId]);

  return (
    <CampaignContext.Provider value={contextValue}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaignContext = () => React.useContext(CampaignContext);