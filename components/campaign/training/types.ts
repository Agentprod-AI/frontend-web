export type FieldType = {
  id: string;
  fieldName: string;
  description: string;
};

export type VariableType = {
  id: string;
  value: string;
  length: string;
  isCustom: boolean;
};

export type allFieldsListType = {
  variables: VariableType[];
  offering_variables: FieldType[];
  personalized_fields: FieldType[];
  enriched_fields: FieldType[];
};
