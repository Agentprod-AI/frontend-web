import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import { Contact } from "./lead-user";
import { CompanyInfo } from "./company-linkedin";

interface AutoGenerateContextType {
  autoGeneratedFollowUp: string;
  autoGeneratedFollowUpTwo: string;
  autoGeneratedSubject: string;
  posts : string[]
  autoGeneratedBody: string;
  setAutoGeneratedFollowUp: (subject: string) => void;
  setAutoGeneratedSubject: (subject: string) => void;
  setAutoGeneratedBody: (body: string) => void;
  setAutoGeneratedFollowUpTwo: (subject: string) => void;
  contact: Contact | undefined;
  setPosts : (posts : string[]) => void;
  linkedinInformation: CompanyInfo | undefined;
  setContact: (contact: Contact) => void;
  setLinkedinInformation: (linkedinInformation: CompanyInfo) => void;
  previewType: "previewFromTemplate" | "previewFromAI";
  setPreviewType: (
    previewType: "previewFromTemplate" | "previewFromAI"
  ) => void;
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
  const [autoGeneratedFollowUp, setAutoGeneratedFollowUp] =
    useState<string>("");
  const [autoGeneratedFollowUpTwo, setAutoGeneratedFollowUpTwo] =
    useState<string>("");
    const [posts , setPosts] = useState<string[]>([]);
  const [contact, setContact] = useState<Contact>();
  const [linkedinInformation, setLinkedinInformation] = useState<CompanyInfo>();
  const [previewType, setPreviewType] = useState<
    "previewFromAI" | "previewFromTemplate"
  >("previewFromAI");

  const contextValue = useMemo(
    () => ({
      autoGeneratedFollowUp,
      setAutoGeneratedFollowUp,
      autoGeneratedFollowUpTwo,
      autoGeneratedSubject,
      setAutoGeneratedFollowUpTwo,
      autoGeneratedBody,
      setAutoGeneratedSubject,
      setAutoGeneratedBody,
      contact,
      setContact,
      posts,
      setPosts,
      linkedinInformation,
      setLinkedinInformation,
      previewType,
      setPreviewType,
    }),
    [
      autoGeneratedSubject,
      autoGeneratedBody,
      contact,
      linkedinInformation,
      posts,
      autoGeneratedFollowUp,
      autoGeneratedFollowUpTwo,
      previewType,
    ]
  );

  return (
    <AutoGenerateContext.Provider value={contextValue}>
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
