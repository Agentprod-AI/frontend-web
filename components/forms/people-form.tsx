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
import { ChevronUp } from "lucide-react";
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
import axios from "axios";
import { useSubscription } from "@/hooks/userSubscription";

const FormSchema = z.object({
  q_organization_domains: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  organization_industry_tag_ids: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      value: z.string(),
    })
  ),
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
  const [editFilters, setEditFilters] = React.useState<any>(null);

  const { leads, setLeads } = useLeads();
  const { isSubscribed } = useSubscription();
  const [existLead, setExistLead] = useState([]);
  const [tab, setTab] = useState("tab1");
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isCreateBtnLoading, setIsCreateBtnLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [calculatedPages, setCalculatedPages] = useState(1);

  const [jobLocationTags, setJobLocationTags] = React.useState<Tag[]>([]);

  const [jobOfferingTags, setJobOfferingTags] = React.useState<Tag[]>([]);

  const [organizationKeywordTags, setOrganizationKeywordTags] = React.useState<
    Tag[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = React.useState<string | null>(null);
  const [apolloUrl, setApolloUrl] = useState("");
  const [organizationCompanyTags, setOrganizationCompanyTags] = React.useState<
    Tag[]
  >([]);

  const keywordDropdownRef = useRef<HTMLDivElement>(null);

  const companyDropdownRef = useRef<HTMLDivElement>(null);

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
  const [jobTitleDropdownIsOpen, setJobTitleDropdownIsOpen] = useState(false);
  const [filteredJobTitles, setFilteredJobTitles] = useState(jobTitles);
  const [jobTitleSearchTerm, setJobTitleSearchTerm] = useState("");
  const jobTitleDropdownRef = useRef<HTMLDivElement>(null);
  const [audienceId, setAudienceId] = React.useState<string>();
  const { setPageCompletion } = useButtonStatus();
  const [type, setType] = useState<"create" | "edit">("create");

  const toggleJobTitleDropdown = (isOpen: boolean) => {
    setJobTitleDropdownIsOpen(isOpen);
  };

  const handleJobTitleDropdownSelect = (title: string) => {
    const newTag: Tag = {
      text: title,
      id: title,
    };

    if (!personTitlesTags.some((tag) => tag.text === title)) {
      const updatedTags = [...personTitlesTags, newTag];
      setPersonTitlesTags(updatedTags);
      setValue("person_titles", updatedTags as [Tag, ...Tag[]]);
    }
  };

  useEffect(() => {
    const filtered = jobTitles.filter((title) =>
      title.toLowerCase().includes(jobTitleSearchTerm.toLowerCase())
    );
    setFilteredJobTitles(filtered);
  }, [jobTitleSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        jobTitleDropdownRef.current &&
        !jobTitleDropdownRef.current.contains(event.target as Node)
      ) {
        setJobTitleDropdownIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            try {
              const audienceFilters = await getAudienceFiltersById(id);
              console.log(
                "response from audience filters",
                audienceFilters.filters_applied
              );
              setAllFiltersFromDB(audienceFilters.filters_applied);
              setEditFilters(audienceFilters.filters_applied); // Store filters_applied in state
              setAudienceId(audienceFilters.id);
              populateFormWithExistingFilters(audienceFilters.filters_applied);
            } catch (error) {
              console.error("Error fetching audience filters:", error);
            }
          }
        } catch (error) {
          console.error("Error fetching campaign:", error);
        }
      }
    };

    fetchCampaign();
  }, [params.campaignId]);

  // React.useEffect(() => {
  //   console.log("current form values", form.getValues());
  // }, [form]);

  const onTabChange = async (value: any) => {
    if (isSubmitting) {
      return; // Don't allow tab changes while submitting
    }
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

  const filteredKeywords = keywords.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const constructApolloUrl = (formData: any) => {
    let url =
      "https://app.apollo.io/#/people?finderViewId=6674b20eecfedd000184539f&contactEmailStatusV2[]=likely_to_engage&contactEmailStatusV2[]=verified&sortByField=account_owner_id&sortAscending=true";

    if (
      formData.organization_locations &&
      formData.organization_locations.length > 0
    ) {
      url += formData.organization_locations
        .map(
          (location: any) =>
            `&personLocations[]=${encodeURIComponent(location.text)}`
        )
        .join("");
    }

    if (
      formData.organization_industry_tag_ids &&
      formData.organization_industry_tag_ids.length > 0
    ) {
      url += formData.organization_industry_tag_ids
        .map(
          (industry: any) =>
            `&organizationIndustryTagIds[]=${encodeURIComponent(
              industry.value
            )}`
        )
        .join("");
    }

    if (formData.person_titles && formData.person_titles.length > 0) {
      url += formData.person_titles
        .map(
          (title: any) => `&personTitles[]=${encodeURIComponent(title.text)}`
        )
        .join("");
    }

    if (checkedCompanyHeadcount && checkedCompanyHeadcount.length > 0) {
      url += checkedCompanyHeadcount
        .map((range: string) => {
          const [min, max] = range.split("-");
          return `&organizationNumEmployeesRanges[]=${encodeURIComponent(
            min
          )},${max === "x" ? "" : encodeURIComponent(max)}`;
        })
        .join("");
    }

    if (
      formData.q_organization_keyword_tags &&
      formData.q_organization_keyword_tags.length > 0
    ) {
      url += formData.q_organization_keyword_tags
        .map(
          (tag: any) =>
            `&qOrganizationKeywordTags[]=${encodeURIComponent(tag.text)}`
        )
        .join("");
      url +=
        "&includedOrganizationKeywordFields[]=tags&includedOrganizationKeywordFields[]=name";
    }

    if (checkedFundingRounds && checkedFundingRounds.length > 0) {
      url += checkedFundingRounds
        .map(
          (round: string) =>
            `&organizationLatestFundingStageCd[]=${encodeURIComponent(round)}`
        )
        .join("");
    }

    if (formData.person_seniorities && formData.person_seniorities.length > 0) {
      url += formData.person_seniorities
        .map(
          (seniority: any) =>
            `&personSeniorities[]=${encodeURIComponent(seniority.text)}`
        )
        .join("");
    }

    if (formData.minimum_company_funding && formData.maximum_company_funding) {
      url += `&organizationRevenueRanges[]=${encodeURIComponent(
        formData.minimum_company_funding.text
      )},${encodeURIComponent(formData.maximum_company_funding.text)}`;
    }

    if (formData.email_status && formData.email_status.length > 0) {
      url += formData.email_status
        .map(
          (status: any) =>
            `&contactEmailStatusV2[]=${encodeURIComponent(status.text)}`
        )
        .join("");
    }

    return url;
  };

  // Inside your component or a useEffect hook:
  useEffect(() => {
    const formData = form.getValues();
    const newApolloUrl = constructApolloUrl(formData);
    setApolloUrl(newApolloUrl);
  }, [
    form,
    checkedCompanyHeadcount,
    checkedFundingRounds,
    form.watch("organization_locations"),
    form.watch("organization_industry_tag_ids"),
    form.watch("person_titles"),
    form.watch("q_organization_keyword_tags"),
    form.watch("person_seniorities"),
    form.watch("minimum_company_funding"),
    form.watch("maximum_company_funding"),
    form.watch("email_status"),
  ]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = {
      q_organization_domains: data.q_organization_domains,
      organization_industry_tag_ids: data.organization_industry_tag_ids,
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
    setIsSubmitting(true);
    setPageCompletion("audience", true);
    console.log("form data", formData);

    let shouldCallAPI = false;

    if (!prevInputValues.current) shouldCallAPI = true;

    // Construct the Apollo.io URL based on the selected filters

    // Add more filter conditions here as needed

    let pages = 1;
    if (formData.per_page) {
      if (formData.per_page <= 25) {
        pages = 1;
      } else if (formData.per_page <= 50) {
        pages = 2;
      } else if (formData.per_page <= 75) {
        pages = 3;
      } else {
        pages = Math.ceil(formData.per_page / 25);
      }
    }
    const newApolloUrl = constructApolloUrl(data);
    setApolloUrl(newApolloUrl);

    setCalculatedPages(pages);

    const getRandomEmail = (startPage: number) => {
      const emailArray = [
        "nisheet@agentprod.com",
        "admin@agentprod.com",
        "naman.barkiya@agentprod.com",
        "siddhant.goswami@agentprod.com",
        "muskaan@agentprod.com",
        "bharath.kumar@getquestionpro.com",
        "Urvashi.singh@getverloop.com",
        "demo@agentprod.com",
        "founders@agentprod.com",
      ];
      const premiumAcc = ["info@agentprod.com", "muskaan@agentprodapp.com"];

      if (startPage > 5) {
        const randomIndex = Math.floor(Math.random() * premiumAcc.length);
        return premiumAcc[randomIndex];
      } else {
        const randomIndex = Math.floor(Math.random() * emailArray.length);
        return emailArray[randomIndex];
      }
    };

    const createScraperBody = (
      email: string,
      count: number,
      startPage: number
    ) => ({
      count: Math.min(count, 25),
      email: email,
      getEmails: true,
      guessedEmails: true,
      maxDelay: 15,
      minDelay: 8,
      password: "Agentprod06ms",
      searchUrl: apolloUrl,
      startPage: startPage,
      waitForVerification: true,
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ["RESIDENTIAL"],
        apifyProxyCountry: "IN",
      },
    });

    const fetchLead = async (startPage: number): Promise<any[]> => {
      const email = getRandomEmail(startPage);
      const scraperBody = createScraperBody(email, 25, startPage);
      let retries = 0;
      const TIMEOUT = 90000;
      const maxRetries = 3;

      while (retries < maxRetries) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
          const response = await axios.post(
            "https://api.apify.com/v2/acts/curious_coder~apollo-io-scraper/run-sync-get-dataset-items?token=apify_api_n5GCPgdvobcZfCa9w38PSxtIQiY22E4k3ARa",
            scraperBody,
            {
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);
          return response.data;
        } catch (error) {
          console.error(
            `Error fetching leads for page ${startPage} (attempt ${
              retries + 1
            }):`,
            error
          );
          retries++;
          if (axios.isCancel(error)) {
            console.log("Request timed out. Retrying...");
          } else if (retries === maxRetries) {
            console.error(
              `Failed to fetch leads for page ${startPage} after ${maxRetries} attempts`
            );
            return [];
          }
          await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 second delay before retry
        }
      }
      return []; // This line should never be reached, but TypeScript requires it
    };

    const existingLeadsResponse = await axiosInstance.get(
      `v2/leads/${user?.id}`
    );
    setExistLead(existingLeadsResponse.data);
    console.log("Existing leads:", existingLeadsResponse.data);
    if (existingLeadsResponse.data === null) {
      shouldCallAPI = true;
    } else if (
      existingLeadsResponse.data.length > 100 + pages * 25 &&
      isSubscribed === false
    ) {
      toast.warning("Your free account has reached the limit of 300 leads");
      shouldCallAPI = false;
    } else if (isSubscribed === true) {
      shouldCallAPI = true;
    }
    if (shouldCallAPI) {
      try {
        setIsLoading(true);
        setIsTableLoading(true);

        const toastMessages = [
          "Initializing lead search engine...",
          "Preparing your personalized, high-quality lead list for presentation...",
        ];

        let toastIndex = 0;
        const toastInterval = setInterval(() => {
          toast.info(toastMessages[toastIndex % toastMessages.length], {
            duration: 10000,
          });
          toastIndex++;
        }, 10000);

        const batchSize = 8; // Number of concurrent API calls
        const totalPages = Math.ceil(data.per_page / 25);
        let enrichedLeads: any[] = [];

        for (let i = 0; i < totalPages; i += batchSize) {
          const batch = Array.from(
            { length: Math.min(batchSize, totalPages - i) },
            (_, index) => i + index + 1
          );
          console.log(
            `Processing batch ${i / batchSize + 1} of ${Math.ceil(
              totalPages / batchSize
            )}`
          );

          const batchPromises = batch.map(fetchLead);
          const batchResults = await Promise.all(batchPromises);
          const batchLeads = batchResults.flat();

          enrichedLeads.push(...batchLeads);

          // Optional: Add a delay between batches to avoid rate limiting
          if (i + batchSize < totalPages) {
            await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 second delay
          }
        }

        clearInterval(toastInterval);

        if (enrichedLeads.length === 0) {
          toast.error("No leads found");
          setTab("tab1");
        } else {
          console.log("Fetched leads:", enrichedLeads);

          const processedLeads = enrichedLeads
            .slice(0, data.per_page)
            .map((person: any) => ({
              ...person,
              type: "prospective",
              campaign_id: params.campaignId,
              id: uuid(),
            }));
          setLeads(processedLeads);
          console.log("Processed new leads:", processedLeads);
          setTab("tab2");

          setIsTableLoading(false);
          toast.success(
            `${processedLeads.length} new leads fetched successfully`
          );
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching data.");
        setError(error instanceof Error ? error.toString() : String(error));
        setTab("tab1");
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
        setIsTableLoading(false);
        console.log("Fetched leads:", leads);
        setAllFilters({
          ...formData,
        });
        shouldCallAPI = false;
      }
    } else {
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
    industry: false,
    company: false,
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
      qualification_details: lead.qualification_details || String,
      company: lead.company,
      phone: lead.phone,
      technologies: lead.technologies || [],
      organization: lead.organization,
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
      const formData = form.getValues();
      const postBody = {
        campaign_id: params.campaignId,
        audience_type: "prospective",
        filters_applied: {
          q_organization_domains: formData.q_organization_domains,
          organization_industry_tag_ids: formData.organization_industry_tag_ids,
          q_organization_keyword_tags: formData.q_organization_keyword_tags,
          organization_locations: formData.organization_locations,
          person_seniorities: formData.person_seniorities,
          company_headcount: checkedCompanyHeadcount,
          organization_latest_funding_stage_cd: checkedFundingRounds,
          revenue_range: {
            min: formData.minimum_company_funding?.text,
            max: formData.maximum_company_funding?.text,
          },
          person_titles: formData.person_titles,
          per_page: formData.per_page,
          email_status: formData.email_status,
          organization_job_locations: formData.organization_job_locations,
          q_organization_job_titles: formData.q_organization_job_titles,
        },
      };

      try {
        const response = await axiosInstance.post("v2/audience/", postBody);
        const data = response.data;
        console.log("filters to audience: ", data);

        const getRecData = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}v2/campaigns/${params.campaignId}`
        );
        if (getRecData.data.schedule_type === "recurring") {
          const resp = await axiosInstance.post(
            "v2/recurring_campaign_request",
            {
              campaign_id: params.campaignId,
              user_id: user.id,
              apollo_url: apolloUrl,
              page: calculatedPages + 1,
              is_active: true,
              leads_count: calculatedPages * 25,
            }
          );
          const data1 = resp.data;
          console.log(" audience: ", data1);
        }

        toast.success("Audience created successfully");
        setTimeout(() => {}, 2000);
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.toString() : String(error));
      } finally {
        toast.info("Updating user details, please wait...");
        setTimeout(() => {
          setIsCreateBtnLoading(false);
          router.push(`/dashboard/campaign/${params.campaignId}`);
        }, 46000);
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
    | "organization_industry_tag_ids";

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

  function populateFormWithExistingFilters(allFiltersFromDB: any) {
    if (allFiltersFromDB) {
      // Organization Industry Tag IDs
      if (allFiltersFromDB.organization_industry_tag_ids) {
        setOrganizationKeywordTags(
          allFiltersFromDB.organization_industry_tag_ids
        );
        setValue(
          "organization_industry_tag_ids",
          allFiltersFromDB.organization_industry_tag_ids
        );
      }

      // Organization Keyword Tags
      if (allFiltersFromDB.q_organization_keyword_tags) {
        setOrganizationCompanyTags(
          allFiltersFromDB.q_organization_keyword_tags
        );
        setValue(
          "q_organization_keyword_tags",
          allFiltersFromDB.q_organization_keyword_tags
        );
      }

      // Organization Locations
      if (allFiltersFromDB.organization_locations) {
        setOrganizationLocationsTags(allFiltersFromDB.organization_locations);
        setValue(
          "organization_locations",
          allFiltersFromDB.organization_locations
        );
      }

      // Person Seniorities
      if (allFiltersFromDB.person_seniorities) {
        setPersonSenioritiesTags(allFiltersFromDB.person_seniorities);
        setValue("person_seniorities", allFiltersFromDB.person_seniorities);
      }

      // Person Titles
      if (allFiltersFromDB.person_titles) {
        setPersonTitlesTags(allFiltersFromDB.person_titles);
        setValue("person_titles", allFiltersFromDB.person_titles);
      }

      // Per Page
      if (allFiltersFromDB.per_page) {
        setValue("per_page", allFiltersFromDB.per_page);
      }

      // Company Headcount
      if (allFiltersFromDB.company_headcount) {
        setCheckedCompanyHeadcount(allFiltersFromDB.company_headcount);
        setValue("company_headcount", allFiltersFromDB.company_headcount);
      }

      // Funding Rounds
      if (allFiltersFromDB.organization_latest_funding_stage_cd) {
        setCheckedFundingRounds(
          allFiltersFromDB.organization_latest_funding_stage_cd
        );
        setValue(
          "organization_latest_funding_stage_cd",
          allFiltersFromDB.organization_latest_funding_stage_cd
        );
      }

      // Company Domains
      if (allFiltersFromDB.q_organization_domains) {
        setQOrganizationDomainsTags(allFiltersFromDB.q_organization_domains);
        setValue(
          "q_organization_domains",
          allFiltersFromDB.q_organization_domains
        );
      }

      // Revenue Range
      if (allFiltersFromDB.revenue_range) {
        if (allFiltersFromDB.revenue_range.min) {
          setMinimumCompanyFunding({
            id: "min",
            text: Number(allFiltersFromDB.revenue_range.min),
          });
          setValue("minimum_company_funding", {
            id: "min",
            text: Number(allFiltersFromDB.revenue_range.min),
          });
        }
        if (allFiltersFromDB.revenue_range.max) {
          setMaximumCompanyFunding({
            id: "max",
            text: Number(allFiltersFromDB.revenue_range.max),
          });
          setValue("maximum_company_funding", {
            id: "max",
            text: Number(allFiltersFromDB.revenue_range.max),
          });
        }
      }

      // Job Titles (if used for technology)
      if (allFiltersFromDB.q_organization_job_titles) {
        setJobOfferingTags(allFiltersFromDB.q_organization_job_titles);
        setValue(
          "q_organization_job_titles",
          allFiltersFromDB.q_organization_job_titles
        );
      }

      // Job Locations
      if (allFiltersFromDB.organization_job_locations) {
        setJobLocationTags(allFiltersFromDB.organization_job_locations);
        setValue(
          "organization_job_locations",
          allFiltersFromDB.organization_job_locations
        );
      }

      // Email Status (if applicable)
      if (allFiltersFromDB.email_status) {
        setValue("email_status", allFiltersFromDB.email_status);
      }

      // Additional fields can be added here as needed

      console.log("Form values updated, current values:", form.getValues());
    }
  }

  React.useEffect(() => {
    console.log("checked company headcount", checkedCompanyHeadcount);
  }, [checkedCompanyHeadcount]);

  const updateAudience = async () => {
    const formData = form.getValues();

    const pages = formData.per_page ? Math.ceil(formData.per_page / 10) : 1;

    let filters = editFilters ? { ...editFilters } : {};

    filters = {
      ...filters,
      ...(pages && { page: pages }),
      ...(formData.per_page && {
        per_page:
          formData.per_page > 10
            ? Math.ceil(formData.per_page / pages)
            : formData.per_page,
      }),
      prospected_by_current_team: ["No"],
      ...(Array.isArray(formData.person_titles) &&
        formData.person_titles.length > 0 && {
          person_titles: formData.person_titles
            .map((tag) => tag?.text)
            .filter(Boolean),
        }),
      ...(Array.isArray(formData.organization_locations) &&
        formData.organization_locations.length > 0 && {
          organization_locations: formData.organization_locations
            .map((tag) => tag?.text)
            .filter(Boolean),
        }),
      organization_num_employees_ranges: checkedFields(
        checkedCompanyHeadcount,
        true
      ),
      ...(Array.isArray(formData.person_seniorities) &&
        formData.person_seniorities.length > 0 && {
          person_seniorities: formData.person_seniorities
            .map((tag) => tag?.text)
            .filter(Boolean),
        }),
      ...(Array.isArray(formData.q_organization_domains) &&
        formData.q_organization_domains.length > 0 && {
          q_organization_domains: formData.q_organization_domains
            .map((tag) => tag?.text)
            .filter(Boolean),
        }),
      ...(formData.email_status && { email_status: formData.email_status }),
      ...(Array.isArray(formData.organization_industry_tag_ids) &&
        formData.organization_industry_tag_ids.length > 0 && {
          organization_industry_tag_ids: formData.organization_industry_tag_ids
            .map((tag) => tag?.value)
            .filter(Boolean),
        }),
      ...(Array.isArray(formData.q_organization_keyword_tags) &&
        formData.q_organization_keyword_tags.length > 0 && {
          q_organization_keyword_tags: formData.q_organization_keyword_tags
            .map((tag) => tag?.text)
            .filter(Boolean),
        }),
      ...(formData.minimum_company_funding &&
        formData.maximum_company_funding && {
          revenue_range: {
            min: formData.minimum_company_funding.text?.toString(),
            max: formData.maximum_company_funding.text?.toString(),
          },
        }),
      ...(Array.isArray(formData.organization_job_locations) &&
        formData.organization_job_locations.length > 0 && {
          organization_job_locations: formData.organization_job_locations
            .map((tag) => tag?.text)
            .filter(Boolean),
        }),
      ...(Array.isArray(formData.q_organization_job_titles) &&
        formData.q_organization_job_titles.length > 0 && {
          q_organization_job_titles: formData.q_organization_job_titles
            .map((tag) => tag?.text)
            .filter(Boolean),
        }),
      organization_latest_funding_stage_cd: checkedFields(
        checkedFundingRounds,
        false
      ),
    };

    const filtersPostBody = {
      campaign_id: params.campaignId,
      audience_type: "prospective",
      filters_applied: filters,
    };

    setIsTableLoading(true);

    try {
      // Update audience filters
      // await axiosInstance.put(`v2/audience/${audienceId}`, filtersPostBody);

      // Fetch updated leads
      const updatedLeadsResponse = await axiosInstance.post<Lead[]>(
        `v2/apollo/leads`,
        filters
      );
      const updatedLeads = updatedLeadsResponse.data;

      updatedLeads.forEach((person: Lead) => {
        person.type = "prospective";
        person.campaign_id = params.campaignId;
        person.id = uuid();
      });

      setLeads(updatedLeads);

      // Update contacts
      const updateLeadsBody = mapLeadsToBodies(updatedLeads, params.campaignId);
      await axiosInstance.post(`v2/lead/bulk/`, updateLeadsBody);

      toast.success("Audience updated successfully");
      router.push(`/dashboard/campaign/${params.campaignId}`);
    } catch (error) {
      console.error("Error updating audience:", error);
      toast.error("Error updating audience");
    } finally {
      setIsTableLoading(false);
    }
  };

  const [keywordDropdownIsOpen, setKeywordDropdownIsOpen] =
    React.useState(false);

  const [companyDropdownIsOpen, setCompanyDropdownIsOpen] =
    React.useState(false);

  function toggleKeywordsDropdown(isOpen: boolean) {
    setKeywordDropdownIsOpen(isOpen);
  }

  function toggleCompanyDropdown(isOpen: boolean) {
    setCompanyDropdownIsOpen(isOpen);
  }

  function handleDropdownSelect(option: any) {
    const keywordTag = {
      id: uuid(),
      text: option.name,
      value: option.value,
    };

    if (
      !organizationKeywordTags.some((tag: any) => tag.value === option.value)
    ) {
      setOrganizationKeywordTags((prevState) => [...prevState, keywordTag]);
    }
  }

  useEffect(() => {
    if (organizationKeywordTags.length > 0) {
      setValue("organization_industry_tag_ids", organizationKeywordTags as any);
    } else {
      setValue("organization_industry_tag_ids", []); // Handle the case when there are no tags
    }
  }, [organizationKeywordTags, setValue]);

  React.useEffect(() => {
    setValue(
      "q_organization_keyword_tags",
      organizationCompanyTags as [Tag, ...Tag[]]
    );
  }, [organizationCompanyTags]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target as Node)
      ) {
        setCompanyDropdownIsOpen(false);
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
            <TabsTrigger value="tab1" disabled={isSubmitting}>
              Edit
            </TabsTrigger>
            <TabsTrigger value="tab2" type="submit" disabled={isSubmitting}>
              {isLoading ? (
                <div>
                  <LoadingCircle />
                </div>
              ) : (
                "Preview"
              )}
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
                    <div
                      className={`${
                        dropdownsOpen.currentEmployment ? "block" : "hidden"
                      } relative`}
                    >
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
                                tags={personTitlesTags}
                                placeholder="Enter a job title"
                                variant="base"
                                onFocus={() => toggleJobTitleDropdown(true)}
                                className="sm:min-w-[150px] bg-white/90 text-black placeholder:text-black/[70]"
                                setTags={(newTags) => {
                                  setPersonTitlesTags(newTags);
                                  setValue(
                                    "person_titles",
                                    newTags as [Tag, ...Tag[]]
                                  );
                                }}
                                onInputChange={(value) =>
                                  setJobTitleSearchTerm(value)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="absolute inline-block text-left -my-4">
                        {jobTitleDropdownIsOpen && (
                          <ScrollArea
                            className="w-56 z-50 rounded-md shadow-lg bg-white dark:bg-black ring-1 ring-black ring-opacity-5 focus:outline-none"
                            style={{
                              height:
                                filteredJobTitles.length > 0
                                  ? `${Math.min(
                                      filteredJobTitles.length * 40,
                                      200
                                    )}px`
                                  : "auto",
                            }}
                          >
                            <div
                              className="py-1"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="options-menu"
                              onClick={() => toggleJobTitleDropdown(false)}
                              ref={jobTitleDropdownRef}
                            >
                              {filteredJobTitles.length > 0 ? (
                                filteredJobTitles.map((title) => (
                                  <button
                                    key={title}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleJobTitleDropdownSelect(title);
                                      setJobTitleSearchTerm("");
                                    }}
                                    className="dark:text-white block px-4 py-2 text-sm w-full text-left hover:bg-accent"
                                  >
                                    {title}
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                  No results found
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        )}
                      </div>
                    </div>
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
                            min={0}
                            max={500}
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
                        interested in select between 1 - 125.
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
                    onClick={() => toggleDropdown("industry")}
                  >
                    <div className="text-sm">Industry</div>
                    {dropdownsOpen.industry ? (
                      <ChevronUp
                        color="#000000"
                        className="transition-transform duration-200 transform rotate-0"
                      />
                    ) : (
                      <ChevronUp
                        color="#000000"
                        className="transition-transform duration-200 transform rotate-180"
                      />
                    )}
                  </div>
                  <div
                    className={`${
                      dropdownsOpen.industry ? "block" : "hidden"
                    } relative`}
                  >
                    <FormField
                      control={form.control}
                      name="organization_industry_tag_ids"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start pb-4 w-8/12">
                          <FormControl>
                            <TagInput
                              {...field}
                              tags={organizationKeywordTags}
                              placeholder="Enter industry"
                              variant="base"
                              onFocus={() => toggleKeywordsDropdown(true)}
                              className="sm:min-w-[450px] bg-white/90 text-black placeholder:text-black/[70]"
                              setTags={(newTags) => {
                                setOrganizationKeywordTags(newTags);
                                setValue(
                                  "organization_industry_tag_ids",
                                  newTags as any
                                );
                              }}
                              onInputChange={(value) => setSearchTerm(value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="absolute inline-block text-left -my-4">
                      {keywordDropdownIsOpen && (
                        <ScrollArea
                          className="w-56 z-50 rounded-md shadow-lg bg-white dark:bg-black ring-1 ring-black ring-opacity-5 focus:outline-none"
                          style={{
                            height:
                              filteredKeywords.length > 0
                                ? `${Math.min(
                                    filteredKeywords.length * 40,
                                    200
                                  )}px`
                                : "auto",
                          }}
                        >
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                            onClick={() => toggleKeywordsDropdown(false)}
                            ref={keywordDropdownRef}
                          >
                            {filteredKeywords.length > 0 ? (
                              filteredKeywords.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDropdownSelect(option);
                                    setSearchTerm("");
                                  }}
                                  className="dark:text-white block px-4 py-2 text-sm w-full text-left hover:bg-accent"
                                >
                                  {option.name}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                No results found
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company keyword section */}
                <div className="bg-muted px-2 rounded">
                  <div
                    className="flex justify-between w-full py-3 cursor-pointer"
                    onClick={() => toggleDropdown("company")}
                  >
                    <div className="text-sm">Company Keyword</div>
                    {dropdownsOpen.company ? (
                      <ChevronUp
                        color="#000000"
                        className="transition-transform duration-200 transform rotate-0"
                      />
                    ) : (
                      <ChevronUp
                        color="#000000"
                        className="transition-transform duration-200 transform rotate-180"
                      />
                    )}
                  </div>
                  <div
                    className={`${
                      dropdownsOpen.company ? "block" : "hidden"
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
                              tags={organizationCompanyTags}
                              placeholder="Enter company keywords"
                              variant="base"
                              onFocus={() => toggleCompanyDropdown(true)}
                              className="sm:min-w-[450px] bg-white/90 text-black placeholder:text-black/[70]"
                              setTags={(newTags) => {
                                setOrganizationCompanyTags(newTags);
                                setValue(
                                  "q_organization_keyword_tags",
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
                <AudienceTable />
              </div>
            )}

            {type === "create" ? (
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  createAudience();
                }}
                disabled={isSubmitting}
              >
                {isCreateBtnLoading ? <LoadingCircle /> : "Create Audience"}
              </Button>
            ) : (
              <div className="w-1/4 space-y-4 justify-between">
                <Button>Go Back</Button>
                <Button
                  onClick={(event) => {
                    event.preventDefault();
                    createAudience();
                  }}
                  disabled={isSubmitting}
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
