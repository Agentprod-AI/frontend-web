import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Lead, useLeads } from "@/context/lead-user";
import { LoadingCircle } from "@/app/icons";
import { AudienceTableClient } from "../tables/audience-table/client";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  orgLocations,
  jobTitles,
  emailStatusOptions,
  seniorities,
  InputType,
} from "./formUtils";
import { Checkbox } from "@/components/ui/checkbox";

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
  organization_locations: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  person_seniorities: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  email_status: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  company_headcount: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  funding_rounds: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  minimun_company_funding: z
    .object({
      id: z.string(),
      text: z.number(),
    })
    .optional(),
  maximun_company_funding: z
    .object({
      id: z.string(),
      text: z.number(),
    })
    .optional(),
  // prospected_by_current_team: z
  //   .object({
  //     id: z.string(),
  //     text: z.string(),
  //   })
  //   .optional(),
  per_page: z
    .object({
      id: z.string(),
      text: z.number(),
    })
    .optional(),
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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { leads, setLeads } = useLeads();

  const [tab, setTab] = useState("tab1");
  const [loading, setLoading] = useState(false);

  const onTabChange = async (value: any) => {
    //TODO: only change the value if form is correct
    console.log(form.formState.isValid);
    // if (form.formState.isValid) {
    setTab(value);
    setLoading(true);
    // }
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
  const [perPage, setPerPage] = React.useState<InputType>({
    id: "",
    text: 0,
  });

  const [emailStatus, setEmailStatus] = React.useState<Tag[]>([]);

  // const [prospectedByCurrentTeam, setProspectedByCurrentTeam] =
  //   React.useState<InputType>({
  //     id: "",
  //     text: "",
  //   });

  const [checkedFundingRounds, setCheckedFundingRounds] = React.useState<
    string[]
  >([""]);

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
  const [tradingStatusTags, setTradingStatusTags] = React.useState<Tag[]>([]);

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
    per_page: { id: string; text: number } | undefined;
    // prospected_by_current_team: { id: string; text: string } | undefined;
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
      person_titles: data.person_titles,
      per_page: data.per_page,
      email_status: data.email_status,
      // prospected_by_current_team: data.prospected_by_current_team,
      job_locations: data.job_locations,
      job_offerings: data.job_offerings,
    };

    let shouldCallAPI = false;

    if (!prevInputValues) shouldCallAPI = true;

    const pages = formData.per_page?.text
      ? Math.ceil(formData.per_page?.text / 100)
      : 1;

    let headcounts: string[] = [];
    const companyHeadcounts = () => {
      checkedCompanyHeadcount?.map((headcount) => {
        headcounts.push(headcount.split("-").join(","));
      });

      return headcounts;
    };

    console.log(formData.company_headcount);

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
      ...{ organization_num_employees_ranges: companyHeadcounts() },
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
    };
    console.log(body);

    if (
      prevInputValues.current?.company_headcount?.toString() !==
        formData.company_headcount?.toString() ||
      prevInputValues.current?.per_page?.text !== body.per_page
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
        .toString() !== body.job_locations?.toString() ||
      prevInputValues.current?.job_offerings
        ?.map((tag) => tag.text)
        .toString() !== body.job_offerings?.toString()
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
        // const response = await axios.post(
        //   "/api/apollo",
        //   {
        // url: "https://api.apollo.io/v1/mixed_people/search",
        //     body: body,
        //   },
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );

        const response = await axios.post(
          "/api/apollo",
          {
            url: "http://localhost:3030/apollo/api/people",
            body: body,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // console.log(response);

        console.log("DATA: ", JSON.stringify(response));
        response.data.result.people.map((person: Lead): void => {
          person.type = "people";
        });
        setLeads(response.data.result.people as Lead[]);
        console.log(leads);
        toast.success("api called");

        console.log("BODY: ", body);
      } catch (err) {
        console.log("ERR: ", err);
        toast.error("Error fetching data");
      } finally {
        shouldCallAPI = false;
        setLoading(false);
      }
    } else {
      toast.error("no need to call api");
      setLoading(false);
    }
  };

  const [dropdownsOpen, setDropdownsOpen] = useState({
    currentEmployment: false,
    revenueFunding: false,
    orgLocations: false,
    advanced: false,
    funding: false,
    headcount: false,
  });
  const toggleDropdown = (id: string) => {
    setDropdownsOpen((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }));
  };

  const min = 0;
  const [leadsNum, setLeadsNum] = useState<number>(0);

  const increment = () => setLeadsNum((prev) => prev + 1);
  const decrement = () => setLeadsNum((prev) => Math.max(min, prev - 1));

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

          <TabsContent value="tab1" className="space-y-2">
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
                  name="q_organization_domains"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start py-4 w-8/12">
                      <FormLabel className="text-left">
                        Company Domains
                      </FormLabel>
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
                        {companyHeadcountOptions.map((round, index) => (
                          <div className="text-sm flex items-center mb-3">
                            <Checkbox
                              {...field}
                              className="mr-2"
                              checked={checkedCompanyHeadcount?.includes(
                                round.name
                              )}
                              onCheckedChange={(e) => {
                                if (e.valueOf()) {
                                  setCheckedCompanyHeadcount([
                                    ...(checkedCompanyHeadcount
                                      ? checkedCompanyHeadcount
                                      : []),
                                    round.name,
                                  ]);
                                } else {
                                  setCheckedCompanyHeadcount(
                                    checkedCompanyHeadcount?.filter(
                                      (item) => item !== round.name
                                    )
                                  );
                                }
                              }}
                              key={index}
                              value={round.name}
                            />
                            {round.name}
                          </div>
                        ))}
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
                            <div className="text-sm flex items-center mb-3">
                              <Checkbox
                                {...field}
                                className="mr-2"
                                checked={checkedFundingRounds.includes(
                                  round.name
                                )}
                                onCheckedChange={(e) => {
                                  if (e.valueOf()) {
                                    setCheckedFundingRounds([
                                      ...checkedFundingRounds,
                                      round.name,
                                    ]);
                                  } else {
                                    setCheckedFundingRounds(
                                      checkedFundingRounds.filter(
                                        (item) => item !== round.name
                                      )
                                    );
                                  }
                                }}
                                key={index}
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
                      name="minimun_company_funding"
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
                        name="maximun_company_funding"
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
                <FormField
                  control={form.control}
                  name="trading_statuses"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start py-4 w-8/12">
                      <FormLabel className="text-left h-1">
                        Trading status
                      </FormLabel>
                      <FormControl>
                        <TagInput
                          {...field}
                          dropdown={true}
                          dropdownPlaceholder="Add trading statuses"
                          // dropdownOptions={tradingStatuses}
                          tags={tradingStatusTags}
                          variant={"base"}
                          className="sm:min-w-[450px]"
                          setTags={(newTags) => {
                            setTradingStatusTags(newTags);
                            setValue(
                              "trading_statuses",
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
            <div className="bg-muted px-2 rounded">
              <div
                className="flex justify-between w-full py-3 cursor-pointer"
                onClick={() => toggleDropdown("advanced")}
              >
                <div className="text-sm">Advanced</div>
                {dropdownsOpen.advanced ? (
                  <ChevronUp color="#000000" />
                ) : (
                  <ChevronUp
                    color="#000000"
                    className="transition-transform duration-200 transform rotate-180"
                  />
                )}
              </div>
              <div className={`${dropdownsOpen.advanced ? "block" : "hidden"}`}>
                <div className="text-sm font-medium">Job postings</div>
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

            <FormField
              control={form.control}
              name="per_page"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start my-4">
                  <FormLabel className="text-left">Number of Leads</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        placeholder={"Enter the number of leads you want"}
                        className="sm:min-w-[450px] outline-none"
                        value={leadsNum}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const numericValue = Math.max(
                            min,
                            Number(e.target.value)
                          );
                          if (!isNaN(numericValue)) {
                            setLeadsNum(numericValue);
                          }
                          // Handle field.onChange if needed
                        }}
                      />
                      <div className="flex flex-col items-center">
                        <ChevronUp
                          className="cursor-pointer"
                          height={10}
                          onClick={increment}
                        />
                        <ChevronDown
                          className="cursor-pointer"
                          height={10}
                          onClick={decrement}
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
          </TabsContent>
          <TabsContent value="tab2">
            {loading ? <LoadingCircle /> : <AudienceTableClient />}
            <Button>Create Audience</Button>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
