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
import { Tag, TagInput } from "@/components/ui/tag/tag-input";
import { Button } from "@/components/ui/button";
import { boolean, input, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import { Contact, Lead, useLeads } from "@/context/lead-user";
import { LoadingCircle } from "@/app/icons";
import { AudienceTableClient } from "../tables/audience-table/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { v4 as uuid } from "uuid";

import { orgLocations, jobTitles, seniorities, InputType } from "./formUtils";
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "@/utils/axiosInstance";

const FormSchema = z.object({
  q_organization_domains: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  q_keywords: z
    .object({
      id: z.string(),
      text: z.string(),
    })
    .optional(),
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
  funding_rounds: z
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
  per_page: z.object({
    id: z.string(),
    text: z.number(),
  }),
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
  job_locations: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  job_offerings: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
});

export default function PeopleForm(): JSX.Element {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { leads, setLeads } = useLeads();

  const [tab, setTab] = useState("tab1");
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isCreateBtnLoading, setIsCreateBtnLoading] = useState(false);
  const [campaignId, setCampaignId] = useState<string>(
    "482b7b80-4681-422b-9d40-f7253f4a8305"
  );

  const onTabChange = async (value: any) => {
    //TODO: only change the value if form is correct
    console.log(form.formState.isValid);
    if (form.formState.isValid) {
      setTab(value);
      setIsTableLoading(true);
    }
  };

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

  const { setValue } = form;

  interface Data {
    q_organization_domains: { id: string; text: string }[] | undefined;
    organization_locations: { id: string; text: string }[] | undefined;
    person_seniorities: { id: string; text: string }[] | undefined;
    person_titles: { id: string; text: string }[] | undefined;
    email_status: { id: string; text: string }[] | undefined;
    company_headcount: { id: string; text: string }[] | undefined;
    funding_rounds: { id: string; text: string }[] | undefined;
    minimum_company_funding: { id: string; text: number } | undefined;
    maximum_company_funding: { id: string; text: number } | undefined;
    per_page: { id: string; text: number } | undefined;
    q_keywords: { id: string; text: string } | undefined;
    job_locations: { id: string; text: string }[] | undefined;
    job_offerings: { id: string; text: string }[] | undefined;
  }

  // Assuming prevInputValues is a useRef with the initial structure
  const prevInputValues = React.useRef<Data | null>(null);

  // const email_status = React.useRef<{ text: string }>({
  //   text: "",
  // });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    // convert all arrays object to array of strings

    const formData = {
      q_organization_domains: data.q_organization_domains,
      q_keywords: data.q_keywords,
      organization_locations: data.organization_locations,
      person_seniorities: data.person_seniorities,
      company_headcount: data.company_headcount,
      funding_rounds: data.funding_rounds,
      minimum_company_funding: data.minimum_company_funding,
      maximum_company_funding: data.maximum_company_funding,
      person_titles: data.person_titles,
      per_page: data.per_page,
      email_status: data.email_status,
      // prospected_by_current_team: data.prospected_by_current_team,
      job_locations: data.job_locations,
      job_offerings: data.job_offerings,
    };

    console.log("form data", formData);

    let shouldCallAPI = false;

    if (!prevInputValues) shouldCallAPI = true;

    const pages = formData.per_page?.text
      ? Math.ceil(formData.per_page?.text / 100)
      : 1;

    // let headcounts: string[] = [];
    // const companyHeadcounts = () => {
    //   checkedCompanyHeadcount?.map((headcount) => {
    //     headcounts.push(headcount.split("-").join(","));
    //   });

    //   return headcounts;
    // };

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

    const body = {
      ...(pages && { page: pages }), // Only include if pages is truthy
      ...(formData.per_page?.text && {
        per_page:
          formData.per_page.text > 100
            ? Math.ceil(formData.per_page?.text / pages)
            : formData.per_page.text,
      }),
      prospected_by_current_team: ["No"],
      // ...(formData.prospected_by_current_team?.text && {
      //   prospected_by_current_team: [formData.prospected_by_current_team.text],
      // }),
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
      ...{
        organization_num_employees_ranges: checkedFields(
          checkedCompanyHeadcount,
          true
        ),
      },
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
    };

    const extraFilters = {
      ...(formData.minimum_company_funding &&
        formData.maximum_company_funding && {
          total_funding: `${data.minimum_company_funding?.text}-${data.maximum_company_funding?.text}`,
        }),
      ...(formData.job_locations && {
        job_locations: formData.job_locations
          .map((tag) => tag.text)
          .filter((text) => text),
      }),
      ...(formData.job_offerings && {
        job_offerings: formData.job_offerings
          .map((tag) => tag.text)
          .filter((text) => text),
      }),
      ...{
        funding_rounds: checkedFields(checkedFundingRounds, false),
      },
    };
    console.log(body);

    // below preview -> filter audience by funding
    // import , selectExisting !!

    if (
      prevInputValues.current?.company_headcount?.toString() !==
        formData.company_headcount?.toString() ||
      prevInputValues.current?.per_page?.text !== body.per_page ||
      `${prevInputValues.current?.minimum_company_funding?.text}-${prevInputValues.current?.maximum_company_funding?.text}` !==
        extraFilters.total_funding ||
      prevInputValues.current?.funding_rounds?.toString() !==
        extraFilters.funding_rounds?.toString()
      // ||
      // prevInputValues.current?.prospected_by_current_team?.text !==
      //   body.prospected_by_current_team?.[0]
    ) {
      shouldCallAPI = true;
      console.log("foo");
    }

    if (
      prevInputValues.current?.q_organization_domains
        ?.map((tag) => tag.text)
        .join("\n")
        .trim() !== body.q_organization_domains?.toString() ||
      prevInputValues.current?.organization_locations
        ?.map((tag) => tag.text)
        .toString() !== body.organization_locations?.toString() ||
      prevInputValues.current?.person_seniorities
        ?.map((tag) => tag.text.toLowerCase())
        .toString() !== body.person_seniorities?.toString() ||
      prevInputValues.current?.person_titles
        ?.map((tag) => tag.text)
        .toString() !== body.person_titles?.toString() ||
      prevInputValues.current?.email_status
        ?.map((tag) => tag.text)
        .toString() !== body.email_status?.toString() ||
      prevInputValues.current?.job_locations
        ?.map((tag) => tag.text)
        .toString() !== extraFilters.job_locations?.toString() ||
      prevInputValues.current?.job_offerings
        ?.map((tag) => tag.text)
        .toString() !== extraFilters.job_offerings?.toString()
    ) {
      shouldCallAPI = true;
      console.log("bar");
    }

    if (formData) {
      prevInputValues.current = formData;
    }

    // console.log("body", body);
    // console.log("prevInputValues", prevInputValues);

    // const body = {
    //   q_organization_domains: "apollo.io\ngoogle.com",
    //   page: 1,
    //   per_page: 2,
    //   organization_locations: ["California, US"],
    //   person_seniorities: ["senior", "manager"],
    //   organization_num_employees_ranges: ["1,1000000"],
    //   person_titles: ["sales manager", "engineer manager"],
    // };

    console.log(shouldCallAPI);
    if (shouldCallAPI) {
      try {
        console.log(body);
        console.log("api called");
        setIsTableLoading(true);
        const response = axiosInstance
          .post<Lead[]>(`v2/apollo/leads`, body)
          .then((response: any) => {
            const data = response.data;
            // console.log("DATA from contacts: ", data);
            console.log("DATA: ", JSON.stringify(response));
            data.map((person: Lead): void => {
              person.type = "prospective";
              person.campaign_id = campaignId;
              person.id = uuid();
            });
            setLeads(data as Lead[]);
            setIsTableLoading(false);
            toast.success("Leads fetched successfully");
            // if (data.isArray) {
            //   setLeads(data);
            // } else {
            //   setLeads([data]);
            // }
          })
          .catch((error: any) => {
            console.log(error);
            setError(error instanceof Error ? error.toString() : String(error));
            setIsTableLoading(false);
          });

        // const response = await axios.post(
        //   "/api/apollo",
        //   {
        //     url: "http://localhost:3030/apollo/api/people",
        //     body: body,
        //   },
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );

        // console.log(response);

        console.log(leads);
        toast.success("api called");

        console.log("BODY: ", body);
      } catch (err) {
        console.log("ERR: ", err);
        toast.error("Error fetching data");
      } finally {
        shouldCallAPI = false;
      }
    } else {
      toast.error("no need to call api");
      setIsTableLoading(false);
    }
  };

  const [dropdownsOpen, setDropdownsOpen] = useState({
    currentEmployment: false,
    revenueFunding: false,
    orgLocations: false,
    funding: false,
    headcount: false,
    jobPostings: false,
    companyDomains: false,
  });
  const toggleDropdown = (id: string) => {
    setDropdownsOpen((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }));
  };

  const min = 0;
  const [leadsNum, setLeadsNum] = useState<number>(0);

  const increment = (field: any) => {
    const newValue = leadsNum + 1;
    setLeadsNum(newValue);
    field.onChange({ target: { value: newValue.toString() } });
  };

  const decrement = (field: any) => {
    const newValue = Math.max(min, leadsNum - 1);
    setLeadsNum(newValue);
    field.onChange({ target: { value: newValue.toString() } });
  };
  type CheckboxOptions = {
    name: string;
    checked: boolean;
  };

  const fundingRounds: CheckboxOptions[] = [
    { name: "Seed", checked: false },
    { name: "Venture (Round not Specified)", checked: false },
    { name: "Series A", checked: false },
    { name: "Series B", checked: false },
    { name: "Series C", checked: false },
    { name: "Series D", checked: false },
    { name: "Series E", checked: false },
    { name: "Series F", checked: false },
    { name: "Debt Financing", checked: false },
    { name: "Equity Crowdfunding", checked: false },
    { name: "Convertible Note", checked: false },
    { name: "Private Equity", checked: false },
    { name: "Other", checked: false },
  ];

  const companyHeadcountOptions: CheckboxOptions[] = [
    { name: "1-10", checked: false },
    { name: "11-20", checked: false },
    { name: "21-50", checked: false },
    { name: "51-100", checked: false },
    { name: "101-200", checked: false },
    { name: "201-500", checked: false },
    { name: "501-1000", checked: false },
    { name: "1001-2000", checked: false },
    { name: "2001-5000", checked: false },
    { name: "5001-10000", checked: false },
    { name: "10000+", checked: false },
  ];

  // const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  function mapLeadsToBodies(leads: Lead[], campaignId: string): Contact[] {
    return leads.map((lead) => ({
      id: lead.id,
      campaign_id: campaignId,
      type: "prospective",
      first_name: lead.first_name,
      last_name: lead.last_name,
      name: lead.name,
      linkedin_url: lead.linkedin_url,
      title: lead.title,
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
    }));
  }

  const createAudience = async () => {
    const audienceBody = mapLeadsToBodies(leads as Lead[], campaignId);
    console.log(audienceBody);

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
      })
      .catch((error: any) => {
        console.log(error);
        setError(error instanceof Error ? error.toString() : String(error));
        setIsCreateBtnLoading(false);
      });

    console.log("response from creating contact", response);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col items-start"
      >
        <Tabs value={tab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 w-[330px]">
            <TabsTrigger value="tab1">Edit</TabsTrigger>
            <TabsTrigger value="tab2" type="submit">
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="tab1"
            className="flex align-top w-full gap-x-4 justify-between"
          >
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
                                    headcountOption.name.replace("+", "-x")
                                  )}
                                  onCheckedChange={(e) => {
                                    setCheckedCompanyHeadcount(
                                      (currentChecked) => {
                                        if (e.valueOf()) {
                                          // If the checkbox is checked
                                          if (
                                            currentChecked?.some(
                                              (item) =>
                                                item ===
                                                headcountOption.name.replace(
                                                  "+",
                                                  "-x"
                                                )
                                            )
                                          ) {
                                            // If the checkbox was previously checked and unchecked
                                            return (
                                              currentChecked || []
                                            ).filter(
                                              (item) =>
                                                item !==
                                                headcountOption.name.replace(
                                                  "+",
                                                  "-x"
                                                )
                                            );
                                          } else {
                                            // If the checkbox was previously unchecked
                                            return [
                                              ...(currentChecked || []),
                                              headcountOption.name.replace(
                                                "+",
                                                "-x"
                                              ),
                                            ];
                                          }
                                        } else {
                                          // If the checkbox is unchecked
                                          return (currentChecked || []).filter(
                                            (item) =>
                                              item !== headcountOption.name
                                          );
                                        }
                                      }
                                    );
                                    console.log(checkedCompanyHeadcount);
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
                    <FormLabel className="text-left">Number of Leads</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          {...field}
                          type="text"
                          placeholder={"Enter the number of leads you want"}
                          className="sm:min-w-[450px] outline-none"
                          value={leadsNum}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const numericValue = Math.max(
                              min,
                              Number(e.target.value)
                            );
                            if (!isNaN(numericValue)) {
                              setLeadsNum(numericValue);
                              field.onChange({
                                id: "per_page",
                                text: numericValue,
                              });
                            }
                          }}
                        />
                        <div className="flex flex-col items-center">
                          <ChevronUp
                            className="cursor-pointer"
                            height={10}
                            onClick={() => {
                              increment(field);
                            }}
                          />
                          <ChevronDown
                            className="cursor-pointer"
                            height={10}
                            onClick={() => {
                              decrement(field);
                            }}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      These are the number of leads that you&apos;re interested
                      in.
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
                  onClick={() => toggleDropdown("revenueFunding")}
                >
                  <div className="text-sm">Revenue and funding</div>
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
                    name="funding_rounds"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start py-4 w-8/12">
                        <FormLabel
                          className="w-full text-left h-1 my-2 flex items-center"
                          onClick={() => toggleDropdown("funding")}
                        >
                          <div>Funding rounds</div>
                          {dropdownsOpen.funding ? (
                            <ChevronUp
                              width="15"
                              color="#000000"
                              className="ml-2"
                            />
                          ) : (
                            <ChevronUp
                              width={15}
                              color="#000000"
                              className="ml-2 transition-transform duration-200 transform rotate-180"
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
                                    round.name
                                  )}
                                  onCheckedChange={(e) => {
                                    if (e.valueOf()) {
                                      setCheckedFundingRounds([
                                        ...(checkedFundingRounds
                                          ? checkedFundingRounds
                                          : []),
                                        round.name,
                                      ]);
                                    } else {
                                      setCheckedFundingRounds(
                                        checkedFundingRounds?.filter(
                                          (item) => item !== round.name
                                        )
                                      );
                                    }
                                    console.log(checkedFundingRounds);
                                  }}
                                  value={round.name}
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
                  <div className="w-1/2">
                    <div className="text-sm font-medium">
                      Total Company Funding
                    </div>
                    <div className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name="minimum_company_funding"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start mx-1 my-4">
                            {/* <FormLabel className="text-left">Min</FormLabel> */}
                            <FormControl>
                              <Input
                                placeholder="Min"
                                className="sm:min-w-[300px] w-2/3 bg-white"
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
                            {/* <FormDescription>
                            This is the minimun funding of the company that
                            you&apos;re interested in.
                          </FormDescription> */}
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
                              {/* <FormLabel className="text-left">Max</FormLabel> */}
                              <FormControl>
                                <Input
                                  placeholder="Max"
                                  className="sm:min-w-[300px] w-2/3 bg-white"
                                  value={
                                    maximumCompanyFunding.text
                                      ? maximumCompanyFunding.text
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const numericValue = Number(e.target.value);
                                    const newValue = {
                                      ...maximumCompanyFunding,
                                      text: numericValue,
                                    };
                                    setMaximumCompanyFunding(newValue); // Update local state
                                    field.onChange(newValue); // Notify React Hook Form of the change
                                  }}
                                />
                              </FormControl>
                              {/* <FormDescription>
                              This is maximun funding of the company that
                              you&apos;re interested in.
                            </FormDescription> */}
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
                  className="flex justify-between w-full py-3 cursor-pointer"
                  onClick={() => toggleDropdown("jobPostings")}
                >
                  <div className="text-sm">Job postings</div>
                  {dropdownsOpen.jobPostings ? (
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
                    dropdownsOpen.jobPostings ? "block" : "hidden"
                  }`}
                >
                  {/* <div className="text-sm font-medium">Job postings</div> */}
                  <div className="flex items-center gap-2">
                    <div className="mb-3 w-1/2">
                      <FormField
                        control={form.control}
                        name="job_offerings"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start mx-1 my-4">
                            <FormLabel className="text-left font-normal">
                              Currently hiring for
                            </FormLabel>
                            <FormControl>
                              <TagInput
                                {...field}
                                dropdown={true}
                                dropdownPlaceholder="Enter job titles..."
                                dropdownOptions={jobTitles}
                                tags={jobOfferingTags}
                                className="sm:min-w-[450px]"
                                setTags={(newTags) => {
                                  setJobOfferingTags(newTags);
                                  setValue(
                                    "job_offerings",
                                    newTags as [Tag, ...Tag[]]
                                  );
                                }}
                              />
                            </FormControl>
                            {/* <FormDescription>
                            This is the minimun funding of the company that
                            you&apos;re interested in.
                          </FormDescription> */}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/2 mb-3">
                      <FormField
                        control={form.control}
                        name="job_locations"
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
                                    "job_locations",
                                    newTags as [Tag, ...Tag[]]
                                  );
                                }}
                              />
                            </FormControl>
                            {/* <FormDescription>
                              This is maximun funding of the company that
                              you&apos;re interested in.
                            </FormDescription> */}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            {isTableLoading ? <LoadingCircle /> : <AudienceTableClient />}
            {isCreateBtnLoading ? (
              <LoadingCircle />
            ) : (
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  createAudience();
                }}
              >
                Create Audience
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
