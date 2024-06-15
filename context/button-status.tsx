import React, { createContext, useContext, useState, ReactNode } from "react";

interface ButtonStatusContextType {
  completedPages: { [key: string]: boolean };
  togglePageCompletion: (pageKey: string) => void;
  setPageCompletion: (pageKey: string, status: boolean) => void;
}
const ButtonStatusContext = createContext<ButtonStatusContextType | undefined>(
  undefined
);

interface ButtonStatusProviderProps {
  children: ReactNode;
}

export const ButtonStatusProvider: React.FC<ButtonStatusProviderProps> = ({
  children,
}) => {
  const [completedPages, setCompletedPages] = useState<{
    [key: string]: boolean;
  }>({});

  const togglePageCompletion = (pageKey: string) => {
    setCompletedPages((prev) => ({
      ...prev,
      [pageKey]: !prev[pageKey],
    }));
  };

  const setPageCompletion = (pageKey: string, status: boolean) => {
    setCompletedPages((prev) => ({
      ...prev,
      [pageKey]: status,
    }));
  };

  return (
    <ButtonStatusContext.Provider
      value={{ completedPages, togglePageCompletion, setPageCompletion }}
    >
      {children}
    </ButtonStatusContext.Provider>
  );
};

export const useButtonStatus = (): ButtonStatusContextType => {
  const context = useContext(ButtonStatusContext);
  if (context === undefined) {
    throw new Error(
      "useButtonStatus must be used within a ButtonStatusProvider"
    );
  }
  return context;
};
