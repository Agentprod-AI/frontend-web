import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

// Extend the state and actions your header will need
export interface PageHeaderState {
  title: string;
  breadcrumbs: Array<{ label: string; path: string }>;
  hidden: boolean; // Added hidden state
  setTitle: (title: string) => void;
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; path: string }>) => void;
  setHidden: (hidden: boolean) => void; // Function to update hidden state
}

// Updated default state to include hidden
const defaultState: PageHeaderState = {
  title: "Dashboard",
  breadcrumbs: [],
  hidden: false, // Default visibility state
  setTitle: () => {},
  setBreadcrumbs: () => {},
  setHidden: () => {}, // Placeholder function
};

// Creating the context
const PageHeaderContext = createContext<PageHeaderState>(defaultState);

// Provider component type definition
interface PageHeaderProviderProps {
  children: ReactNode;
}

// Provider component implementation
export const PageHeaderProvider: React.FC<PageHeaderProviderProps> = ({
  children,
}) => {
  const [title, setTitle] = useState<string>(defaultState.title);
  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{ label: string; path: string }>
  >([]);
  const [hidden, setHidden] = useState<boolean>(defaultState.hidden); // State for visibility

  // Memoizing the context value to include hidden and its control methods
  const contextValue = useMemo(
    () => ({
      title,
      breadcrumbs,
      hidden,
      setTitle,
      setBreadcrumbs,
      setHidden, // Provide setHidden function
    }),
    [title, breadcrumbs, hidden]
  );

  return (
    <PageHeaderContext.Provider value={contextValue}>
      {children}
    </PageHeaderContext.Provider>
  );
};

// Custom hook for consuming the context
export const usePageHeader = () => useContext(PageHeaderContext);
