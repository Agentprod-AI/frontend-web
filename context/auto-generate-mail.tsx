import React, { createContext, useState, useContext, ReactNode } from "react";

interface AutoGenerateContextType {
  autoGeneratedSubject: string;
  autoGeneratedBody: string;
  handleGenerate: (newSubject: string, newBody: string) => void;
  setAutoGeneratedSubject: (subject: string) => void;
  setAutoGeneratedBody: (body: string) => void;
}

const AutoGenerateContext = createContext<AutoGenerateContextType | undefined>(
  undefined
);

interface AutoGenerateProviderProps {
  children: ReactNode;
}

export const AutoGenerateProvider = ({
  children,
}: AutoGenerateProviderProps) => {
  const [autoGeneratedSubject, setAutoGeneratedSubject] = useState<string>("");
  const [autoGeneratedBody, setAutoGeneratedBody] = useState<string>("");

  const handleGenerate = (newSubject: string, newBody: string): void => {
    setAutoGeneratedSubject(newSubject);
    setAutoGeneratedBody(newBody);
  };

  return (
    <AutoGenerateContext.Provider
      value={{
        autoGeneratedSubject,
        autoGeneratedBody,
        handleGenerate,
        setAutoGeneratedSubject,
        setAutoGeneratedBody,
      }}
    >
      {children}
    </AutoGenerateContext.Provider>
  );
};

export const useAutoGenerate = (): AutoGenerateContextType => {
  const context = useContext(AutoGenerateContext);
  if (!context) {
    throw new Error(
      "useAutoGenerate must be used within a AutoGenerateProvider"
    );
  }
  return context;
};
