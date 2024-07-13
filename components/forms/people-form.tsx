/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tag, TagInput, Tag as type } from "@/components/ui/tag/tag-input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";
import { Contact, Lead, useLeads } from "@/context/lead-user";
import { LoadingCircle } from "@/app/icons";
import { AudienceTableClient } from "../tables/audience-table/client";
import { ChevronUp } from "lucide-react";
import { v4 as uuid } from "uuid";
import { orgLocations, jobTitles, seniorities, InputType } from "./formUtils";
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "@/context/user-context";
import { useParams } from "next/navigation";
import { getAudienceFiltersById } from "../campaign/camapign.api";
import { keywords } from "./formUtils";
import { ScrollArea } from "../ui/scroll-area";
import { useButtonStatus } from "@/context/button-status";
import AudienceTable from "../ui/AudienceTable";

const FormSchema = z.object({
  q_organization_domains: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  q_organization_keyword_tags: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
  organization_locations: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
  person_seniorities: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
  email_status: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  company_headcount: z
    .array(z.object({ id: z.string(), text: z.string() }))
    .optional(),
  organization_latest_funding_stage_cd: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  minimum_company_funding: z
    .object({
      id: z.string(),
      text: z.number(),
    })
    .optional(),
  maximum_company_funding: z
    .object({
      id: z.string(),
      text: z.number(),
    })
    .optional(),
  per_page: z.number(),
  person_titles: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  trading_statuses: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  organization_job_locations: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  q_organization_job_titles: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
});

export default function PeopleForm(): JSX.Element {
  const params = useParams<{ campaignId: string }>();
  const { user } = useUserContext();

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { leads, setLeads } = useLeads();

  const [tab, setTab] = useState("tab1");
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isCreateBtnLoading, setIsCreateBtnLoading] = useState(false);

  //   const [tags, setTags] = React.useState<Tag[]>([]);
  const [organizationLocationsTags, setOrganizationLocationsTags] =
    React.useState<Tag[]>([]);

  const [personSenioritiesTags, setPersonSenioritiesTags] = React.useState<
    Tag[]
  >([]);

  const [qOrganizationDomainsTags, setQOrganizationDomainsTags] =
    React.useState<Tag[]>([]);

  const [personTitlesTags, setPersonTitlesTags] = React.useState<Tag[]>([]);

  const [checkedFundingRounds, setCheckedFundingRounds] =
    React.useState<string[]>();

  const [checkedCompanyHeadcount, setCheckedCompanyHeadcount] =
    React.useState<string[]>();

  const [minimumCompanyFunding, setMinimumCompanyFunding] =
    React.useState<InputType>({
      id: "",
      text: 0,
    });

  const [maximumCompanyFunding, setMaximumCompanyFunding] =
    React.useState<InputType>({
      id: "",
      text: 0,
    });

  const [jobLocationTags, setJobLocationTags] = React.useState<Tag[]>([]);

  const [jobOfferingTags, setJobOfferingTags] = React.useState<Tag[]>([]);

  const [organizationKeywordTags, setOrganizationKeywordTags] = React.useState<
    Tag[]
  >([]);

  const keywordDropdownRef = useRef<HTMLDivElement>(null);

  const { setValue } = form;

  interface Data {
    q_organization_domains: { id: string; text: string }[] | undefined;
    organization_locations: { id: string; text: string }[] | undefined;
    person_seniorities: { id: string; text: string }[] | undefined;
    person_titles: { id: string; text: string }[] | undefined;
    email_status: { id: string; text: string }[] | undefined;
    company_headcount: { id: string; text: string }[] | undefined;
    organization_latest_funding_stage_cd:
      | { id: string; text: string }[]
      | undefined;
    minimum_company_funding: { id: string; text: number } | undefined;
    maximum_company_funding: { id: string; text: number } | undefined;
    per_page: { id: string; text: number } | undefined;
    q_keywords: { id: string; text: string } | undefined;
    organization_job_locations: { id: string; text: string }[] | undefined;
    q_organization_job_titles: { id: string; text: string }[] | undefined;
  }

  interface TagInput {
    id: string;
    text: string;
  }

  // Assuming prevInputValues is a useRef with the initial structure
  const prevInputValues = React.useRef<any>();

  // const email_status = React.useRef<{ text: string }>({
  //   text: "",
  // });

  const [allFilters, setAllFilters] = React.useState<any>();

  const [allFiltersFromDB, setAllFiltersFromDB] = React.useState<any>();

  const [audienceId, setAudienceId] = React.useState<string>();
  const { setPageCompletion } = useButtonStatus();
  const [type, setType] = useState<"create" | "edit">("create");

  useEffect(() => {
    const fetchCampaign = async () => {
      const id = params.campaignId;
      if (id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}v2/lead/campaign/${params.campaignId}`
          );
          const data = await response.json();
          if (data.detail === "No Contacts found") {
            setType("create");
          } else {
            // setGoalData(data);
            // setAllFiltersFromDB(data.filters_applied);
            console.log("data ==>", data);
            setType("edit");
            const audienceFilters = await getAudienceFiltersById(id);
            console.log("response from audience filters", audienceFilters);
            setAllFiltersFromDB(audienceFilters.filters_applied);
            setAudienceId(audienceFilters.id);
          }
        } catch (error) {
          console.error("Error fetching campaign:", error);
        }
      }
    };

    fetchCampaign();
  }, [params.campaignId]);

  React.useEffect(() => {
    const fetchAudienceFilters = async () => {
      if (type === "edit") {
        const id = params.campaignId;
        if (id) {
          const audienceFilters = await getAudienceFiltersById(id);
          console.log("response from audience filters", audienceFilters);
          setAllFiltersFromDB(audienceFilters.filters_applied);
          setAudienceId(audienceFilters.id);
        }
      }
    };

    fetchAudienceFilters();
  }, [params.campaignId, getAudienceFiltersById]);

  // React.useEffect(() => {
  //   console.log("current form values", form.getValues());
  // }, [form]);

  const onTabChange = async (value: any) => {
    //TODO: only change the value if form is correct
    if (value === "tab1") {
      setTab(value);
    } else {
      console.log(form.formState.isValid);
      if (form.formState.isValid) {
        setTab(value);
        setIsTableLoading(true);
      }
    }
  };

  const checkedFields = (
    field: string[] | undefined,
    returnDashed: boolean
  ) => {
    const checked: string[] = [];
    if (returnDashed) {
      field?.map((field) => {
        if (field.split("-")[1] === "x") {
          checked.push(`${field.split("-")[0]}+`);
        } else {
          checked.push(field.split("-").join(","));
        }
      });
    } else {
      field?.map((field) => {
        checked.push(field);
      });
    }
    return checked;
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    // Convert all arrays of objects to arrays of strings
    const formData = {
      q_organization_domains: data.q_organization_domains,
      q_organization_keyword_tags: data.q_organization_keyword_tags,
      organization_locations: data.organization_locations,
      person_seniorities: data.person_seniorities,
      company_headcount: data.company_headcount,
      organization_latest_funding_stage_cd:
        data.organization_latest_funding_stage_cd,
      minimum_company_funding: data.minimum_company_funding,
      maximum_company_funding: data.maximum_company_funding,
      person_titles: data.person_titles,
      per_page: data.per_page,
      email_status: data.email_status,
      organization_job_locations: data.organization_job_locations,
      q_organization_job_titles: data.q_organization_job_titles,
    };

    setPageCompletion("audience", true); // Set the page completion to true
    console.log("form data", formData);

    let shouldCallAPI = false;

    if (!prevInputValues) shouldCallAPI = true;

    const pages = formData.per_page ? Math.ceil(formData.per_page / 10) : 1;

    const body = {
      ...(pages && { page: pages }),
      ...(formData.per_page && {
        per_page:
          formData.per_page > 10
            ? Math.ceil(formData.per_page / pages)
            : formData.per_page,
      }),
      ...(formData.person_titles && {
        person_titles: formData.person_titles
          .map((tag) => tag.text)
          .filter((text) => text),
      }),
      ...(formData.organization_locations && {
        organization_locations: formData.organization_locations
          .map((tag) => tag.text)
          .filter((text) => text),
      }),
      organization_num_employees_ranges: checkedFields(
        checkedCompanyHeadcount,
        true
      ),
      ...(formData.person_seniorities && {
        person_seniorities: formData.person_seniorities
          .map((tag) => tag.text.toLowerCase())
          .filter((text) => text),
      }),
      ...(formData.q_organization_domains && {
        q_organization_domains: formData.q_organization_domains
          .map((tag) => tag.text)
          .join("\n")
          .trim(),
      }),
      ...(formData.email_status && {
        email_status: formData.email_status
          .map((tag) => tag.text)
          .filter((text) => text),
      }),
      ...(formData.q_organization_keyword_tags && {
        q_organization_keyword_tags: formData.q_organization_keyword_tags
          .map((tag) => tag.text)
          .filter((text) => text),
      }),
      ...(formData.minimum_company_funding &&
        formData.maximum_company_funding && {
          revenue_range: {
            min: formData.minimum_company_funding.text.toString(),
            max: formData.maximum_company_funding.text.toString(),
          },
        }),
      ...(formData.organization_job_locations && {
        organization_job_locations: formData.organization_job_locations
          .map((tag) => tag.text)
          .filter((text) => text),
      }),
      ...(formData.q_organization_job_titles && {
        q_organization_job_titles: formData.q_organization_job_titles
          .map((tag) => tag.text)
          .filter((text) => text),
      }),
      organization_latest_funding_stage_cd: checkedFields(
        checkedFundingRounds,
        false
      ),
    };

    console.log(body);

    if (
      prevInputValues.current?.company_headcount?.toString() !==
        formData.company_headcount?.toString() ||
      prevInputValues.current?.per_page?.text !== body.per_page ||
      prevInputValues.current?.organization_latest_funding_stage_cd?.toString() !==
        body.organization_latest_funding_stage_cd?.toString()
    ) {
      shouldCallAPI = true;
      console.log("foo");
    }

    if (
      prevInputValues.current?.q_organization_domains
        ?.map((tag: Tag) => tag.text)
        .join("\n")
        .trim() !== body.q_organization_domains?.toString() ||
      prevInputValues.current?.organization_locations
        ?.map((tag: Tag) => tag.text)
        .toString() !== body.organization_locations?.toString() ||
      prevInputValues.current?.person_seniorities
        ?.map((tag: Tag) => tag.text.toLowerCase())
        .toString() !== body.person_seniorities?.toString() ||
      prevInputValues.current?.person_titles
        ?.map((tag: Tag) => tag.text)
        .toString() !== body.person_titles?.toString() ||
      prevInputValues.current?.email_status
        ?.map((tag: Tag) => tag.text)
        .toString() !== body.email_status?.toString() ||
      prevInputValues.current?.organization_job_locations
        ?.map((tag: Tag) => tag.text)
        .toString() !== body.organization_job_locations?.toString() ||
      prevInputValues.current?.q_organization_job_titles
        ?.map((tag: Tag) => tag.text)
        .toString() !== body.q_organization_job_titles?.toString()
    ) {
      shouldCallAPI = true;
      console.log("bar");
    }

    if (formData) {
      prevInputValues.current = formData;
    }

    console.log(shouldCallAPI);
    if (shouldCallAPI) {
      try {
        console.log(body);
        console.log("api called");
        setIsTableLoading(true);
        axiosInstance
          .post<Lead[]>(`v2/apollo/leads`, body)
          .then((response: any) => {
            const data = response.data;
            console.log("DATA: ", data);
            data.forEach((person: Lead) => {
              person.type = "prospective";
              person.campaign_id = params.campaignId;
              person.id = uuid();
            });
            setLeads(data as Lead[]);
            setIsTableLoading(false);

            toast.success("Leads fetched successfully");
          })
          .catch((error: any) => {
            console.log(error);
            setError(error instanceof Error ? error.toString() : String(error));
            setIsTableLoading(false);
          });

        console.log("this is my leads" + leads);

        console.log("BODY: ", body);
      } catch (err) {
        console.log("ERR: ", err);

        toast.error("Error fetching data");
        setTab("tab1");
      } finally {
        setTab("tab2");
        console.log("this is my leads" + leads);
        setAllFilters({ ...body });
        shouldCallAPI = false;
      }
    } else {
      toast.error("No need to call API");
      setIsTableLoading(false);
    }
  };

  const [dropdownsOpen, setDropdownsOpen] = useState({
    currentEmployment: false,
    revenueFunding: false,
    companyFunding: false,
    orgLocations: false,
    funding: false,
    headcount: false,
    jobPostings: false,
    companyDomains: false,
    companyKeywords: false,
  });
  const toggleDropdown = (id: string) => {
    setDropdownsOpen((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }));
  };

  const min = 0;
  const [leadsNum, setLeadsNum] = useState<number>(0);

  type CheckboxOptions = {
    name: string;
    value: string;
    checked: boolean;
  };

  const fundingRounds = [
    { name: "Seed", checked: false, value: "0" },
    { name: "Angel", checked: false, value: "1" },
    { name: "Venture (Round not Specified)", checked: false, value: "10" },
    { name: "Series A", checked: false, value: "2" },
    { name: "Series B", checked: false, value: "3" },
    { name: "Series C", checked: false, value: "4" },
    { name: "Series D", checked: false, value: "5" },
    { name: "Series E", checked: false, value: "6" },
    { name: "Series F", checked: false, value: "7" },
    { name: "Debt Financing", checked: false, value: "13" },
    { name: "Equity Crowdfunding", checked: false, value: "14" },
    { name: "Convertible Note", checked: false, value: "15" },
    { name: "Private Equity", checked: false, value: "11" },
    { name: "Other", checked: false, value: "12" },
  ];

  const companyHeadcountOptions: CheckboxOptions[] = [
    { name: "1-10", value: "1-10", checked: false },
    { name: "11-20", value: "11-20", checked: false },
    { name: "21-50", value: "21-50", checked: false },
    { name: "51-100", value: "51-100", checked: false },
    { name: "101-200", value: "101-200", checked: false },
    { name: "201-500", value: "201-500", checked: false },
    { name: "501-1000", value: "501-1000", checked: false },
    { name: "1001-2000", value: "1001-2000", checked: false },
    { name: "2001-5000", value: "2001-5000", checked: false },
    { name: "5001-10000", value: "5001-10000", checked: false },
    { name: "10000+", value: "10000+", checked: false },
  ];

  // const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // console.log("leadsssssss", leads);

  function mapLeadsToBodies(leads: Lead[], campaignId: string): Contact[] {
    return leads.map((lead) => ({
      id: lead.id,
      user_id: user.id,
      campaign_id: campaignId,
      type: "prospective",
      first_name: lead.first_name,
      last_name: lead.last_name,
      name: lead.name,
      title: lead.title,
      linkedin_url: lead?.linkedin_url,
      email_status: lead.email_status,
      photo_url: lead.photo_url,
      twitter_url: lead.twitter_url,
      github_url: lead.github_url,
      facebook_url: lead.facebook_url,
      extrapolated_email_confidence: lead.extrapolated_email_confidence,
      headline: lead.headline,
      email: lead.email,
      employment_history: lead.employment_history,
      state: lead.state,
      city: lead.city,
      country: lead.country,
      is_likely_to_engage: lead.is_likely_to_engage,
      departments: lead.departments,
      subdepartments: lead.subdepartments,
      seniority: lead.seniority,
      functions: lead.functions,
      phone_numbers: lead.phone_numbers,
      intent_strength: lead.intent_strength,
      show_intent: lead.show_intent,
      revealed_for_current_team: lead.revealed_for_current_team,
      is_responded: false,
      company_linkedin_url: lead.company_linkedin_url,
      pain_points: lead.pain_points || [], // Assuming optional or provide default
      value: lead.value || [], // Assuming optional or provide default
      metrics: lead.metrics || [], // Assuming optional or provide default
      compliments: lead.compliments || [], // Assuming optional or provide default
      lead_information: lead.lead_information || String,
      is_b2b: lead.is_b2b,
      score: lead.score,
    }));
  }

  const createAudience = async () => {
    const audienceBody = mapLeadsToBodies(leads as Lead[], params.campaignId);
    console.log("data = " + audienceBody);

    setIsCreateBtnLoading(true);
    const response = axiosInstance
      .post<Contact[]>(`v2/lead/bulk/`, audienceBody)
      .then((response: any) => {
        const data = response.data;
        console.log("DATA from contacts: ", data);
        if (data.isArray) {
          setLeads(data);
        } else {
          setLeads([data]);
        }
        setIsCreateBtnLoading(false);
        toast.success("Audience created successfully");
        // router.push(`/dashboard/campaign/create/${params.campaignId}`);
      })
      .catch((error: any) => {
        console.log(error);
        setError(error instanceof Error ? error.toString() : String(error));
        setIsCreateBtnLoading(false);
        toast.error("Audience Creation Failer");
      });

    if (type === "create") {
      const postBody = {
        campaign_id: params.campaignId,
        audience_type: "prospective",
        filters_applied: { ...allFilters },
      };

      try {
        const response = await axiosInstance.post("v2/audience", postBody);
        const data = response.data;
        console.log("filters to audience: ", data);

        toast.success("Audience created successfully");
        setTimeout(() => {}, 2000);
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.toString() : String(error));
      } finally {
        toast.info("Updating user details, please wait...");
        setTimeout(() => {
          router.push(`/dashboard/campaign/${params.campaignId}`);
        }, 25000);
      }
    }

    console.log(allFilters);

    console.log("response from creating contact", response);
  };

  type FieldName =
    | "person_seniorities"
    | "q_organization_domains"
    | "organization_locations"
    | "person_titles"
    | "revenue_range"
    | "q_organization_keyword_tags";

  const mapFiltersToTags = (
    filterName: string,
    filterData: string | undefined,
    tagStateSetter: React.Dispatch<React.SetStateAction<Tag[]>>,
    fieldName: any
  ) => {
    if (
      allFiltersFromDB &&
      typeof allFiltersFromDB === "object" &&
      fieldName in allFiltersFromDB &&
      Array.isArray(filterData) &&
      filterData.length > 0
    ) {
      const tags = filterData.map((value: string, index: number) => {
        return {
          id: String(index),
          text: value,
        };
      });

      tagStateSetter(tags);

      form.setValue(fieldName, allFiltersFromDB[filterName]);
    } else {
      console.error(
        "One of the required variables is undefined or has an unexpected type."
      );
    }
  };

  React.useEffect(() => {
    if (allFiltersFromDB) {
      // setPersonSenioritiesTags(
      //   mapFiltersToTags(allFiltersFromDB.person_seniorities)
      // );
      // form.setValue("person_seniorities", allFiltersFromDB.person_seniorities);

      mapFiltersToTags(
        "person_seniorities",
        allFiltersFromDB.person_seniorities,
        setPersonSenioritiesTags,
        "person_seniorities"
      );

      mapFiltersToTags(
        "person_titles",
        allFiltersFromDB.person_titles,
        setPersonTitlesTags,
        "person_titles"
      );

      mapFiltersToTags(
        "q_organization_domains",
        allFiltersFromDB.q_organization_domains,
        setQOrganizationDomainsTags,
        "q_organization_domains"
      );
      mapFiltersToTags(
        "q_organization_keyword_tags",
        allFiltersFromDB.q_organization_keyword_tags,
        setOrganizationKeywordTags,
        "q_organization_keyword_tags"
      );

      mapFiltersToTags(
        "organization_locations",
        allFiltersFromDB.organization_locations,
        setOrganizationLocationsTags,
        "organization_locations"
      );

      mapFiltersToTags(
        "revenue_range",
        allFiltersFromDB.revenue_range.max,
        (newValue) => {
          const numericValue = Number(newValue);
          const updatedValue = {
            ...maximumCompanyFunding,
            text: numericValue,
          };
          setMaximumCompanyFunding(updatedValue);
        },
        "revenue_range"
      );
      console.log("maximum value : ", maximumCompanyFunding.text);

      mapFiltersToTags(
        "q_organization_keyword_tags",
        allFiltersFromDB.q_keywords,
        setOrganizationKeywordTags,
        "q_organization_keyword_tags"
      );

      const formatFundingHeadcount =
        allFiltersFromDB.organization_latest_funding_stage_cd.map(
          (range: string) => {
            return range.split(",").join("-");
          }
        );
      setCheckedFundingRounds(formatFundingHeadcount);
      const formatCheckedHeadcount =
        allFiltersFromDB.organization_num_employees_ranges.map(
          (range: string) => {
            return range.split(",").join("-");
          }
        );

      setCheckedCompanyHeadcount(formatCheckedHeadcount);

      form.setValue(
        "company_headcount",
        allFiltersFromDB.organization_num_employees_ranges
      );
      form.setValue(
        "organization_latest_funding_stage_cd",
        allFiltersFromDB.organization_latest_funding_stage_cd
      );
      form.setValue(
        "organization_job_locations",
        allFiltersFromDB.organization_job_locations
      );
      form.setValue(
        "q_organization_job_titles",
        allFiltersFromDB.q_organization_job_titles
      );
      form.setValue("email_status", allFiltersFromDB.email_status);
      form.setValue(
        "per_page",
        allFiltersFromDB.per_page * allFiltersFromDB.page
      );

      console.log("form values updated, current values", form.getValues());
    }
  }, [allFiltersFromDB]);

  React.useEffect(() => {
    console.log("checked company headcount", checkedCompanyHeadcount);
  }, [checkedCompanyHeadcount]);

  const updateAudience = async () => {
    const formData = form.getValues();

    const pages = formData.per_page ? Math.ceil(formData.per_page / 10) : 1;

    const filters = {
      ...(pages && { page: pages }),
      ...(formData.per_page && {
        per_page:
          formData.per_page > 10
            ? Math.ceil(formData.per_page / pages)
            : formData.per_page,
      }),
      prospected_by_current_team: ["No"],
      ...(formData.person_titles && {
        person_titles: formData.person_titles.map((tag) => tag.text),
      }),
      ...(formData.organization_locations.length > 0 && {
        organization_locations: formData.organization_locations.map(
          (tag) => tag.text
        ),
      }),
      organization_num_employees_ranges: checkedFields(
        checkedCompanyHeadcount,
        true
      ),
      ...(formData.person_seniorities && {
        person_seniorities: formData.person_seniorities.map((tag) => tag.text),
      }),
      ...(formData.q_organization_domains && {
        q_organization_domains: formData.q_organization_domains.map(
          (tag) => tag.text
        ),
      }),
      ...(formData.email_status && { email_status: formData.email_status }),
    };

    console.log("post body", filters);

    const filtersPostBody = {
      campaign_id: params.campaignId,
      audience_type: "prospective",
      filters_applied: filters,
    };

    console.log("filters post body", filters);

    //   setTab("tab2");

    //   try {
    //     console.log("api called");

    //     axiosInstance
    //       .put(`v2/audience/${audienceId}`, filtersPostBody)
    //       .then((response) => {
    //         console.log("response from updating filters", response);
    //         toast.success("Audience updated successfully");
    //       })
    //       .catch((error: any) => {
    //         console.log(error);
    //         toast.error("Error updating audience");
    //       });
    //   } catch (err) {
    //     console.log("ERR: ", err);
    //     toast.error("Error updating audience");
    //   }

    //   setIsTableLoading(true);
    //   const updateLeads = await axiosInstance
    //     .post<Lead[]>(`v2/apollo/leads`, filters)
    //     .then((response: any) => {
    //       const data = response.data;
    //       // console.log("DATA from contacts: ", data);
    //       console.log("DATA: ", data);
    //       data.map((person: Lead): void => {
    //         person.type = "prospective";
    //         person.campaign_id = params.campaignId;
    //         person.id = uuid();
    //       });
    //       setLeads(data as Lead[]);
    //       setIsTableLoading(false);
    //       toast.success("Leads fetched successfully");
    //       return data;
    //     })
    //     .catch((error: any) => {
    //       console.log(error);
    //       setError(error instanceof Error ? error.toString() : String(error));
    //       setIsTableLoading(false);
    //     });

    //   const updateLeadsBody = mapLeadsToBodies(updateLeads, params.campaignId);
    //   await axiosInstance
    //     .post(`v2/lead/bulk/`, updateLeadsBody)
    //     .then((response: any) => {
    //       console.log("response from bulk", response.data);
    //       toast.success("Leads added successfully");
    //     })
    //     .catch((error: any) => {
    //       console.log(error);
    //       setError(error instanceof Error ? error.toString() : String(error));
    //       setIsTableLoading(false);
    //     });

    //   console.log(leads);
  };

  const [keywordDropdownIsOpen, setKeywordDropdownIsOpen] =
    React.useState(false);

  function toggleKeywordsDropdown(isOpen: boolean) {
    setKeywordDropdownIsOpen(isOpen);
  }

  function handleDropdownSelect(value: string) {
    const keywordTag: Tag = {
      id: uuid(),
      text: value,
    };
    if (!organizationKeywordTags.some((tag) => tag.text === value)) {
      setOrganizationKeywordTags((prevState) => {
        const updatedTags = [...prevState, keywordTag];
        return updatedTags;
      });
    }
  }

  React.useEffect(() => {
    setValue(
      "q_organization_keyword_tags",
      organizationKeywordTags as [Tag, ...Tag[]]
    );
  }, [organizationKeywordTags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        keywordDropdownRef.current &&
        !keywordDropdownRef.current.contains(event.target as Node)
      ) {
        setKeywordDropdownIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col items-start"
      >
        <Tabs value={tab} onValueChange={onTabChange} className="w-full">
          <TabsList
            className={`grid grid-cols-2 w-[330px] ${
              type === "edit" && "hidden"
            }`}
          >
            <TabsTrigger value="tab1">Edit</TabsTrigger>
            <TabsTrigger value="tab2" type="submit">
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tab1">
            <div className="flex align-top w-full gap-x-4 justify-between">
              <div className="w-1/2 flex flex-col gap-2">
                <div className="mb-2">Role and personal</div>
                <div className="bg-muted px-2 rounded">
                  <div
                    className="flex justify-between w-full py-3 cursor-pointer"
                    onClick={() => toggleDropdown("currentEmployment")}
                  >
                    <div className="text-sm">Current employment</div>
                    {dropdownsOpen.currentEmployment ? (
                      <ChevronUp color="#000000" />
                    ) : (
                      <ChevronUp
                        color="#000000"
                        className="transition-transform duration-200 transform rotate-180"
                      />
                    )}
                  </div>
                  <div
                    className={`${
                      dropdownsOpen.currentEmployment ? "block" : "hidden"
                    }`}
                  >
                    <FormField
                      control={form.control}
                      name="person_seniorities"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start py-4 w-8/12">
                          <FormLabel className="text-left">
                            Management Positions
                          </FormLabel>
                          <FormControl>
                            <TagInput
                              {...field}
                              dropdown={true}
                              dropdownPlaceholder="Add management postitions"
                              dropdownOptions={seniorities}
                              tags={personSenioritiesTags}
                              variant={"base"}
                              className="sm:min-w-[450px] bg-white/90 text-black"
                              setTags={(newTags) => {
                                setPersonSenioritiesTags(newTags);
                                setValue(
                                  "person_seniorities",
                                  newTags as [Tag, ...Tag[]]
                                );
                              }}
                            />
                          </FormControl>
                          {/* <FormDescription>
                        These are the seniorities that you&apos;re interested
                        in.
                      </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="person_titles"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start py-4 w-8/12">
                          <FormLabel className="text-left">
                            Current Job Title
                          </FormLabel>
                          <FormControl>
                            <TagInput
                              {...field}
                              dropdown={true}
                              dropdownPlaceholder="Enter a job title"
                              dropdownOptions={jobTitles}
                              tags={personTitlesTags}
                              variant={"base"}
                              className="sm:min-w-[450px]"
                              setTags={(newTags) => {
                                setPersonTitlesTags(newTags);
                                setValue(
                                  "person_titles",
                                  newTags as [Tag, ...Tag[]]
                                );
                              }}
                            />
                          </FormControl>
                          {/* <FormDescription>
                        These are the job titles that you&apos;re interested in.
                      </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="bg-muted px-2 rounded">
                  <FormField
                    control={form.control}
                    name="company_headcount"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start">
                        <FormLabel
                          className="flex justify-between font-normal w-full py-3 cursor-pointer items-center text-left"
                          onClick={() => toggleDropdown("headcount")}
                        >
                          <div>Company Headcount</div>
                          {dropdownsOpen.headcount ? (
                            <ChevronUp color="#000000" />
                          ) : (
                            <ChevronUp
                              color="#000000"
                              className="transition-transform duration-200 transform rotate-180"
                            />
                          )}
                        </FormLabel>
                        <FormControl>
                          <div
                            className={`${
                              dropdownsOpen.headcount ? "block" : "hidden"
                            }`}
                          >
                            {companyHeadcountOptions.map(
                              (headcountOption, index) => (
                                <div
                                  className="text-sm flex items-center mb-3"
                                  key={index}
                                >
                                  <Checkbox
                                    {...field}
                                    className="mr-2"
                                    checked={checkedCompanyHeadcount?.includes(
                                      headcountOption.value
                                    )}
                                    onCheckedChange={(checked) => {
                                      const isChecked = checked.valueOf();
                                      const value = headcountOption.value;

                                      setCheckedCompanyHeadcount(
                                        (currentChecked) => {
                                          // If the value is already present and the checkbox is checked, return the current array
                                          if (
                                            currentChecked?.includes(value) &&
                                            isChecked
                                          ) {
                                            return currentChecked;
                                          }

                                          // If the value is not present and the checkbox is checked, add the value to the array
                                          if (
                                            !currentChecked?.includes(value) &&
                                            isChecked
                                          ) {
                                            return [
                                              ...(currentChecked || []),
                                              value,
                                            ];
                                          }

                                          // If the checkbox is unchecked, remove the value from the array
                                          return (currentChecked || []).filter(
                                            (item) => item !== value
                                          );
                                        }
                                      );
                                    }}
                                    value={headcountOption.name}
                                  />
                                  {headcountOption.name}
                                </div>
                              )
                            )}
                          </div>
                        </FormControl>
                        {/* <FormDescription>
                      This is headcount of the company that you&apos;re
                      interested in.
                    </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="bg-muted px-2 rounded">
                  <FormField
                    control={form.control}
                    name="organization_locations"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start">
                        <FormLabel
                          className="w-full font-normal flex justify-between cursor-pointer py-3 "
                          onClick={() => toggleDropdown("orgLocations")}
                        >
                          <div>Company Locations</div>
                          {dropdownsOpen.orgLocations ? (
                            <ChevronUp color="#000000" />
                          ) : (
                            <ChevronUp
                              color="#000000"
                              className="transition-transform duration-200 transform rotate-180"
                            />
                          )}
                        </FormLabel>
                        <FormControl>
                          <div
                            className={`${
                              dropdownsOpen.orgLocations ? "block" : "hidden"
                            }`}
                          >
                            <div className="w-2/3 sm:min-w-[300px] mb-3">
                              <TagInput
                                {...field}
                                dropdown={true}
                                dropdownPlaceholder="Enter a location"
                                dropdownOptions={orgLocations}
                                tags={organizationLocationsTags}
                                variant={"base"}
                                className="sm:min-w-[450px]"
                                setTags={(newTags) => {
                                  setOrganizationLocationsTags(newTags);
                                  setValue(
                                    "organization_locations",
                                    newTags as [Tag, ...Tag[]]
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </FormControl>
                        {/* <FormDescription>
                      These are the company locations that you&apos;re
                      interested in.
                    </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="per_page"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start my-4">
                      <FormLabel className="text-left">
                        Number of Leads
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            {...field}
                            type="number"
                            placeholder={"Enter the number of leads you want"}
                            className="sm:min-w-[450px] outline-none"
                            value={field.value || leadsNum}
                            onChange={(e) => {
                              const value = e.target.value;
                              const numberValue =
                                value === "" ? undefined : Number(value);
                              field.onChange(numberValue);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        These are the number of leads that you&apos;re
                        interested in.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <div className="mb-2">Advanced</div>
                <div className="bg-muted px-2 rounded">
                  <div
                    className="flex justify-between w-full py-3 cursor-pointer"
                    onClick={() => toggleDropdown("companyDomains")}
                  >
                    <div className="text-sm">Company Domains</div>
                    {dropdownsOpen.companyDomains ? (
                      <ChevronUp color="#000000" />
                    ) : (
                      <ChevronUp
                        color="#000000"
                        className="transition-transform duration-200 transform rotate-180"
                      />
                    )}
                  </div>

                  <div
                    className={`${
                      dropdownsOpen.companyDomains ? "block" : "hidden"
                    }`}
                  >
                    <FormField
                      control={form.control}
                      name="q_organization_domains"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start py-4 w-8/12">
                          <FormControl>
                            <TagInput
                              {...field}
                              tags={qOrganizationDomainsTags}
                              placeholder="Enter company domain"
                              variant={"base"}
                              className="sm:min-w-[450px] bg-white/90 text-black placeholder:text-black/[70]"
                              setTags={(newTags) => {
                                setQOrganizationDomainsTags(newTags);
                                setValue(
                                  "q_organization_domains",
                                  newTags as [Tag, ...Tag[]]
                                );
                              }}
                            />
                          </FormControl>
                          {/* <FormDescription>
                        These are the company domains that you&apos;re
                        interested in.
                      </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="bg-muted px-2 rounded">
                  <div
                    className="flex justify-between w-full py-3 cursor-pointer"
                    onClick={() => {
                      toggleDropdown("companyKeywords");
                    }}
                  >
                    <div className="text-sm">Industry and Keyword</div>
                    {dropdownsOpen.companyKeywords ? (
                      <ChevronUp color="#000000" />
                    ) : (
                      <ChevronUp
                        color="#000000"
                        className="transition-transform duration-200 transform rotate-180"
                      />
                    )}
                  </div>
                  <div
                    className={`${
                      dropdownsOpen.companyKeywords ? "block" : "hidden"
                    } relative`}
                  >
                    <FormField
                      control={form.control}
                      name="q_organization_keyword_tags"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start pb-4 w-8/12">
                          <FormControl>
                            <TagInput
                              {...field}
                              tags={organizationKeywordTags}
                              placeholder="Enter company keywords"
                              variant={"base"}
                              onFocus={() => {
                                toggleKeywordsDropdown(true);
                              }}
                              className="sm:min-w-[450px] bg-white/90 text-black placeholder:text-black/[70]"
                              setTags={(newTags) => {
                                setOrganizationKeywordTags(newTags);
                                setValue(
                                  "q_organization_keyword_tags",
                                  newTags as [Tag, ...Tag[]]
                                );
                              }}
                            />
                          </FormControl>
                          {/* <FormDescription>
                        These are the company domains that you&apos;re
                        interested in.
                      </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="absolute inline-block text-left -my-4">
                      {keywordDropdownIsOpen && (
                        <ScrollArea className="w-56 z-50 h-[200px] rounded-md shadow-lg bg-white dark:bg-black ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                            onClick={(e) => {
                              toggleKeywordsDropdown(false);
                            }}
                            ref={keywordDropdownRef}
                          >
                            {keywords.map((option) => (
                              <button
                                key={option}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDropdownSelect(option);
                                }}
                                className={
                                  "dark:text-white block px-4 py-2 text-sm w-full text-left hover:bg-accent"
                                }
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  </div>
                </div>
                {/* // Revenue and funding */}
                <div className="bg-muted px-2 rounded ">
                  <div
                    className="flex justify-between w-full py-3 cursor-pointer"
                    onClick={() => toggleDropdown("revenueFunding")}
                  >
                    <div className="text-sm">Funding Rounds</div>
                    {dropdownsOpen.revenueFunding ? (
                      <ChevronUp color="#000000" />
                    ) : (
                      <ChevronUp
                        color="#000000"
                        className="transition-transform duration-200 transform rotate-180"
                      />
                    )}
                  </div>
                  <div
                    className={`${
                      dropdownsOpen.revenueFunding ? "block" : "hidden"
                    }`}
                  >
                    <FormField
                      control={form.control}
                      name="organization_latest_funding_stage_cd"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start py-4 w-8/12">
                          <FormLabel
                            className="w-full text-left h-1 my-2 flex items-center"
                            onClick={() => toggleDropdown("funding")}
                          >
                            <div className="bold">
                              Funding rounds and Raises
                            </div>
                            {dropdownsOpen.funding ? (
                              <ChevronUp
                                width="25"
                                color="#000000"
                                className="ml-2"
                              />
                            ) : (
                              <ChevronUp
                                width={25}
                                color="#000000"
                                className="ml-2 transition-transform duration-200 transform rotate-180 text-white"
                              />
                            )}
                          </FormLabel>
                          <FormControl>
                            <div
                              className={`${
                                dropdownsOpen.funding ? "block" : "hidden"
                              }`}
                            >
                              {fundingRounds.map((round, index) => (
                                <div
                                  className="text-sm flex items-center mb-3"
                                  key={index}
                                >
                                  <Checkbox
                                    {...field}
                                    className="mr-2"
                                    checked={checkedFundingRounds?.includes(
                                      round.value
                                    )}
                                    onCheckedChange={(e) => {
                                      if (e.valueOf()) {
                                        setCheckedFundingRounds([
                                          ...(checkedFundingRounds
                                            ? checkedFundingRounds
                                            : []),
                                          round.value,
                                        ]);
                                      } else {
                                        setCheckedFundingRounds(
                                          checkedFundingRounds?.filter(
                                            (item) => item !== round.value
                                          )
                                        );
                                      }
                                      console.log(checkedFundingRounds);
                                    }}
                                    value={round.value}
                                  />
                                  {round.name}
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="bg-muted px-2 rounded ">
                  <div
                    className="flex justify-between w-full py-3 cursor-pointer"
                    onClick={() => toggleDropdown("companyFunding")}
                  >
                    <div className="text-sm">Revenue</div>
                    {dropdownsOpen.companyFunding ? (
                      <ChevronUp color="#000000" />
                    ) : (
                      <ChevronUp
                        color="#000000"
                        className="transition-transform duration-200 transform rotate-180"
                      />
                    )}
                  </div>
                  <div
                    className={`${
                      dropdownsOpen.companyFunding ? "block" : "hidden"
                    }`}
                  >
                    <div className="">
                      <div className="text-sm font-medium">
                        Total Company Revenue Range
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <FormField
                          control={form.control}
                          name="minimum_company_funding"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start mx-1 my-4">
                              <FormControl>
                                <Input
                                  placeholder="Min"
                                  className="w-max bg-white text-black"
                                  value={
                                    minimumCompanyFunding.text
                                      ? minimumCompanyFunding.text
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const numericValue = Number(e.target.value);
                                    if (!isNaN(numericValue)) {
                                      const newValue = {
                                        ...minimumCompanyFunding,
                                        text: numericValue,
                                      };
                                      setMinimumCompanyFunding(newValue); // Update local state
                                      field.onChange(newValue); // Notify React Hook Form of the change
                                    }
                                  }}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="w-1/2">
                          <FormField
                            control={form.control}
                            name="maximum_company_funding"
                            render={({ field }) => (
                              <FormItem className="flex flex-col items-start mx-1 my-4">
                                <FormControl>
                                  <Input
                                    placeholder="Max"
                                    className=" bg-white text-black"
                                    value={
                                      maximumCompanyFunding.text
                                        ? maximumCompanyFunding.text
                                        : ""
                                    }
                                    onChange={(e) => {
                                      const numericValue = Number(
                                        e.target.value
                                      );
                                      const newValue = {
                                        ...maximumCompanyFunding,
                                        text: numericValue,
                                      };
                                      setMaximumCompanyFunding(newValue); // Update local state
                                      field.onChange(newValue); // Notify React Hook Form of the change
                                    }}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-muted px-2 rounded">
                  {/* <div
                    className="flex justify-between w-full py-3 cursor-pointer"
                    onClick={() => toggleDropdown("jobPostings")}
                  >
                    <div className="text-sm">Technology Used</div>
                    {dropdownsOpen.jobPostings ? (
                      <ChevronUp color="#000000" />
                    ) : (
                      <ChevronUp
                        color="#000000"
                        className="transition-transform duration-200 transform rotate-180"
                      />
                    )}
                  </div> */}
                  <div
                    className={`${
                      dropdownsOpen.jobPostings ? "block" : "hidden"
                    }`}
                  >
                    <div className="flex items-center  gap-2">
                      <div className="mb-3 ">
                        <FormField
                          control={form.control}
                          name="q_organization_job_titles"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start mx-1 my-4">
                              <FormControl>
                                <TagInput
                                  {...field}
                                  dropdown={true}
                                  dropdownPlaceholder="Enter Technology"
                                  dropdownOptions={jobTitles}
                                  tags={jobOfferingTags}
                                  className="sm:min-w-[450px]"
                                  setTags={(newTags) => {
                                    setJobOfferingTags(newTags);
                                    setValue(
                                      "q_organization_job_titles",
                                      newTags as [Tag, ...Tag[]]
                                    );
                                  }}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* <div className="w-1/2 mb-3">
                        <FormField
                          control={form.control}
                          name="organization_job_locations"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start mx-1 my-4">
                              <FormLabel className="text-left font-normal">
                                Job located at
                              </FormLabel>
                              <FormControl>
                                <TagInput
                                  {...field}
                                  dropdown={true}
                                  dropdownPlaceholder="Enter locations..."
                                  dropdownOptions={orgLocations}
                                  tags={jobLocationTags}
                                  variant={"base"}
                                  className="sm:min-w-[450px]"
                                  setTags={(newTags) => {
                                    setJobLocationTags(newTags);
                                    setValue(
                                      "organization_job_locations",
                                      newTags as [Tag, ...Tag[]]
                                    );
                                  }}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {type === "edit" && (
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  updateAudience();
                }}
              >
                Update Audience
              </Button>
            )}
          </TabsContent>
          <TabsContent value="tab2">
            {isTableLoading ? (
              <LoadingCircle />
            ) : (
              <div>
                {/* <AudienceTableClient/> */}
                <AudienceTable />
              </div>
            )}
            {/* {isCreateBtnLoading ? (
              <LoadingCircle />
            ) : type === "create" ? (
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  createAudience();
                }}
              >
                Create Audience
              </Button>
            ) : (
              <div className="w-1/4 flex justify-between">
                <Button>Go Back</Button>
                <Button
                  onClick={(event) => {
                    event.preventDefault();
                    createAudience();
                  }}
                >
                  Update Audience
                </Button>
              </div>
            )} */}
            {type === "create" ? (
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  createAudience();
                }}
              >
                {isCreateBtnLoading ? <LoadingCircle /> : "Create Audience"}
              </Button>
            ) : (
              <div className="w-1/4 flex justify-between">
                <Button>Go Back</Button>
                <Button
                  onClick={(event) => {
                    event.preventDefault();
                    createAudience();
                  }}
                >
                  Update Audience
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
