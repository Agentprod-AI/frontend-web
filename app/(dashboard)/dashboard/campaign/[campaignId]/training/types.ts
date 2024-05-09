export const allFieldsList: allFieldsListType = {
  variable: [
    {
      id: "1",
      val: "company name",
      description: "The name of the company",
      length: "short",
    },
    {
      id: "2",
      val: "first name",
      description: "The first name of the customer",
      length: "automatic",
    },
  ],
  offering: [
    {
      id: "4",
      val: "customer per industry",
      description: "The industry of the customer",
    },
    {
      id: "5",
      val: "customer per region",
      description: "The region of the customer",
    },
  ],
  personalized: [
    {
      id: "7",
      val: "customer name",
      description: "The name of the customer",
    },
    {
      id: "8",
      val: "customer company",
      description: "The company of the customer",
    },
  ],
  enriched: [
    {
      id: "10",
      val: "enriched",
      description: "The enriched data",
    },
  ],
};

// make a type for all variables
export type allFieldsListType = {
  variable: {
    id?: string;
    val: string;
    description: string;
    length: string;
  }[];
  offering: {
    id?: string;
    val: string;
    description: string;
  }[];
  personalized: {
    id?: string;
    val: string;
    description: string;
  }[];
  enriched: {
    id?: string;
    val: string;
    description: string;
  }[];
};
