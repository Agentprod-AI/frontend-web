import React, { createContext, useContext, useState, ReactNode } from "react";

interface ButtonStatusContextType {
  completedPages: { [key: string]: boolean };
  togglePageCompletion: (pageKey: string) => void;
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
    setTimeout(() => {
      setCompletedPages((prev) => ({
        ...prev,
        [pageKey]: !prev[pageKey],
      }));
    }, 10000);
  };

  return (
    <ButtonStatusContext.Provider
      value={{ completedPages, togglePageCompletion }}
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
