import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export interface LeadSheetSidebarState {
  isOpen: boolean;
  itemId: string | null;
  toggleSidebar: (open?: boolean) => void;
  setItemId: (id: string | null) => void;
}

const defaultState: LeadSheetSidebarState = {
  isOpen: false,
  itemId: null,
  toggleSidebar: () => {},
  setItemId: () => {},
};

const LeadSheetSidebarContext =
  createContext<LeadSheetSidebarState>(defaultState);

interface LeadSheetSidebarProviderProps {
  children: ReactNode;
}

export const LeadSheetSidebarProvider: React.FC<
  LeadSheetSidebarProviderProps
> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultState.isOpen);
  const [itemId, setItemId] = useState<string | null>(null);

  const toggleSidebar = (open?: boolean) => {
    if (typeof open === "boolean") {
      setIsOpen(open);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const contextValue = useMemo(
    () => ({
      isOpen,
      itemId,
      toggleSidebar,
      setItemId,
    }),
    [isOpen, itemId]
  );

  return (
    <LeadSheetSidebarContext.Provider value={contextValue}>
      {children}
    </LeadSheetSidebarContext.Provider>
  );
};

export const useLeadSheetSidebar = () => useContext(LeadSheetSidebarContext);
