import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";
import {
  allFieldsListType,
  FieldType,
  VariableType,
} from "@/components/campaign/training/types";

interface FieldsListContextType {
  fieldsList: allFieldsListType;
  addField: (field: FieldType | VariableType, fieldType: string) => void;
  removeField: (fieldId: string) => void;
  editField: (field: FieldType | VariableType, fieldId: string) => void;
  setFieldsList: (fieldsList: allFieldsListType) => void;
  body: string;
  setBody: (body: string) => void;
  subject: string;
  setSubject: (subject: string) => void;
  followUp: string;
  setFollowUp: (followUp: string) => void;
  subjectOptions: string[];
  setSubjectOptions: (options: string[]) => void;
}

const defaultState: FieldsListContextType = {
  fieldsList: {
    variables: [],
    personalized_fields: [],
    offering_variables: [],
    enriched_fields: [],
  },
  addField: () => {},
  removeField: () => {},
  editField: () => {},
  setFieldsList: () => {},
  body: "",
  setBody: () => {},
  subject: "",
  setSubject: () => {},
  followUp: "",
  setFollowUp: () => {},
  subjectOptions: [],
  setSubjectOptions: () => {},
};

const FieldsListContext = createContext<FieldsListContextType>(defaultState);

interface FieldsListProviderProps {
  children: ReactNode;
}

export const FieldsListProvider: React.FC<FieldsListProviderProps> = ({
  children,
}) => {
  const [fieldsList, setFieldsList] = useState<allFieldsListType>(
    defaultState.fieldsList
  );
  const [body, setBody] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [followUp, setFollowUp] = useState<string>("");
  const [subjectOptions, setSubjectOptions] = useState<string[]>([]);

  const addField = (field: FieldType | VariableType, fieldType: string) => {
    const updatedFieldsList = { ...fieldsList };

    if (fieldType === "variables") {
      updatedFieldsList.variables = [
        ...updatedFieldsList.variables,
        field as VariableType,
      ];
    } else {
      const targetField = fieldType as
        | "personalized_fields"
        | "offering_variables"
        | "enriched_fields";
      updatedFieldsList[targetField] = [
        ...updatedFieldsList[targetField],
        field as FieldType,
      ];
    }

    setFieldsList(updatedFieldsList);
  };

  const removeField = (fieldId: string) => {
    const updatedFieldsList = { ...fieldsList };
    Object.keys(updatedFieldsList).forEach((key: string) => {
      const fieldType = key as keyof allFieldsListType;
      if (fieldType === "variables") {
        updatedFieldsList.variables = updatedFieldsList.variables.filter(
          (field) => field.id !== fieldId
        );
      } else {
        updatedFieldsList[fieldType] = updatedFieldsList[fieldType].filter(
          (field) => field.id !== fieldId
        );
      }
    });
    setFieldsList(updatedFieldsList);
  };

  const editField = (field: FieldType | VariableType, fieldId: string) => {
    const updatedFieldsList = { ...fieldsList };
    let fieldUpdated = false;

    // Update variables array
    updatedFieldsList.variables = updatedFieldsList.variables.map(
      (variable) => {
        if (variable.id === fieldId) {
          fieldUpdated = true;
          return field as VariableType;
        }
        return variable;
      }
    );

    // Update other arrays
    Object.keys(updatedFieldsList).forEach((key) => {
      const fieldType = key as keyof Omit<allFieldsListType, "variables">;
      const updatedFields = updatedFieldsList[fieldType].map((f) => {
        if (f.id === fieldId) {
          fieldUpdated = true;
          return field as FieldType;
        }
        return f;
      });

      if (fieldUpdated) {
        updatedFieldsList[fieldType] = updatedFields;
      }
    });

    if (!fieldUpdated) {
      console.error(`Field with id ${fieldId} not found in the context.`);
    } else {
      setFieldsList(updatedFieldsList);
    }
  };

  const contextValue = useMemo(
    () => ({
      fieldsList,
      removeField,
      addField,
      editField,
      setFieldsList,
      body,
      setBody,
      subject,
      setSubject,
      followUp,
      setFollowUp,
      subjectOptions,
      setSubjectOptions,
    }),
    [fieldsList, body, subject, followUp, subjectOptions]
  );

  return (
    <FieldsListContext.Provider value={contextValue}>
      {children}
    </FieldsListContext.Provider>
  );
};

export const useFieldsList = () => useContext(FieldsListContext);
