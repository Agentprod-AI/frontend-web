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
// import { toast } from "@/components/ui/use-toast";
import {
  orgLocations,
  jobTitles,
  emailStatusOptions,
  seniorities,
  InputType,
} from "./formUtils";

const FormSchema = z.object({
  q_organization_domains: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
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
  minimun_company_headcount: z
    .object({
      id: z.string(),
      text: z.number(),
    })
    .optional(),
  maximun_company_headcount: z
    .object({
      id: z.string(),
      text: z.number(),
    })
    .optional(),
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
  prospected_by_current_team: z
    .object({
      id: z.string(),
      text: z.string(),
    })
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
  const [minimumCompanyHeadcount, setMinimumCompanyHeadcount] =
    React.useState<InputType>({
      id: "",
      text: 0,
    });
  const [maximumCompanyHeadcount, setMaximumCompanyHeadcount] =
    React.useState<InputType>({
      id: "",
      text: 0,
    });
  const [personTitlesTags, setPersonTitlesTags] = React.useState<Tag[]>([]);
  const [perPage, setPerPage] = React.useState<InputType>({
    id: "",
    text: 0,
  });

  const [emailStatus, setEmailStatus] = React.useState<Tag[]>([]);

  const [prospectedByCurrentTeam, setProspectedByCurrentTeam] =
    React.useState<InputType>({
      id: "",
      text: "",
    });
  const { setValue } = form;

  interface Data {
    q_organization_domains: { id: string; text: string }[] | undefined;
    organization_locations: { id: string; text: string }[] | undefined;
    person_seniorities: { id: string; text: string }[] | undefined;
    person_titles: { id: string; text: string }[] | undefined;
    email_status: { id: string; text: string }[] | undefined;
    minimum_company_headcount: { id: string; text: number } | undefined;
    maximum_company_headcount: { id: string; text: number } | undefined;
    per_page: { id: string; text: number } | undefined;
    prospected_by_current_team: { id: string; text: string } | undefined;
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
      organization_locations: data.organization_locations,
      person_seniorities: data.person_seniorities,
      minimum_company_headcount: data.minimun_company_headcount,
      maximum_company_headcount: data.maximun_company_headcount,
      person_titles: data.person_titles,
      per_page: data.per_page,
      email_status: data.email_status,
      prospected_by_current_team: data.prospected_by_current_team,
    };

    let shouldCallAPI = false;

    if (!prevInputValues) shouldCallAPI = true;

    const pages = formData.per_page?.text
      ? Math.ceil(formData.per_page?.text / 100)
      : 1;

    const body = {
      ...(pages && { page: pages }), // Only include if pages is truthy
      ...(formData.per_page?.text && {
        per_page:
          formData.per_page.text > 100
            ? Math.ceil(formData.per_page?.text / pages)
            : formData.per_page.text,
      }),
      ...(formData.prospected_by_current_team?.text && {
        prospected_by_current_team: [formData.prospected_by_current_team.text],
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
      ...(formData.minimum_company_headcount?.text &&
        formData.maximum_company_headcount?.text && {
          organization_num_employees_ranges: [
            `${formData.minimum_company_headcount.text},${formData.maximum_company_headcount.text}`,
          ],
        }),
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

    if (
      prevInputValues.current?.minimum_company_headcount?.text !==
        formData.minimum_company_headcount?.text ||
      prevInputValues.current?.maximum_company_headcount?.text !==
        formData.maximum_company_headcount?.text ||
      prevInputValues.current?.per_page?.text !== body.per_page ||
      prevInputValues.current?.prospected_by_current_team?.text !==
        body.prospected_by_current_team?.[0]
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
        .toString() !== body.email_status?.toString()
    ) {
      shouldCallAPI = true;
      console.log("bar");
    }

    if (formData) {
      prevInputValues.current = formData;
    }

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
          <TabsContent value="tab1" className="space-y-4">
            <Accordion className="flex flex-col" type="single" collapsible>
              <AccordionItem className="my-2" value="current-employment">
                <AccordionTrigger>Current Employment</AccordionTrigger>
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="q_organization_domains"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start mx-1 mb-4">
                        <FormLabel className="text-left">
                          Company Domains
                        </FormLabel>
                        <FormControl>
                          <TagInput
                            {...field}
                            tags={qOrganizationDomainsTags}
                            placeholder="Enter company domain"
                            className="sm:min-w-[450px]"
                            setTags={(newTags) => {
                              setQOrganizationDomainsTags(newTags);
                              setValue(
                                "q_organization_domains",
                                newTags as [Tag, ...Tag[]]
                              );
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          These are the company domains that you&apos;re
                          interested in.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full justify-between">
                    <div className="my-3 w-1/2">
                      <FormField
                        control={form.control}
                        name="person_seniorities"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start mx-1 my-4">
                            <FormLabel className="text-left">
                              Seniorities
                            </FormLabel>
                            <FormControl>
                              <TagInput
                                {...field}
                                dropdown={true}
                                dropdownPlaceholder="Enter a seniority"
                                dropdownOptions={seniorities}
                                tags={personSenioritiesTags}
                                className="sm:min-w-[450px]"
                                setTags={(newTags) => {
                                  setPersonSenioritiesTags(newTags);
                                  setValue(
                                    "person_seniorities",
                                    newTags as [Tag, ...Tag[]]
                                  );
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              These are the seniorities that you&apos;re
                              interested in.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="my-3 w-1/2">
                      <FormField
                        control={form.control}
                        name="person_titles"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start mx-1 my-4">
                            <FormLabel className="text-left">
                              Job Titles
                            </FormLabel>
                            <FormControl>
                              <TagInput
                                {...field}
                                dropdown={true}
                                dropdownPlaceholder="Enter a job title"
                                dropdownOptions={jobTitles}
                                tags={personTitlesTags}
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
                            <FormDescription>
                              These are the job titles that you&apos;re
                              interested in.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion className="flex flex-col" type="single" collapsible>
              <AccordionItem className="my-2" value="current-employment">
                <AccordionTrigger>Company information</AccordionTrigger>
                <AccordionContent>
                  <div className="flex w-full justify-between">
                    <div className="my-3 w-1/2">
                      <FormField
                        control={form.control}
                        name="minimun_company_headcount"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start mx-1 my-4">
                            <FormLabel className="text-left">
                              Minimum Company Headcount
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Minimum"
                                className="sm:min-w-[450px] w-2/3"
                                value={minimumCompanyHeadcount.text}
                                onChange={(e) => {
                                  const numericValue = Number(e.target.value);
                                  const newValue = {
                                    ...minimumCompanyHeadcount,
                                    text: numericValue,
                                  };
                                  setMinimumCompanyHeadcount(newValue); // Update local state
                                  field.onChange(newValue); // Notify React Hook Form of the change
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              This is the minimun headcount of the company that
                              you&apos;re interested in.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="my-3 w-1/2">
                      <FormField
                        control={form.control}
                        name="maximun_company_headcount"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start mx-1 my-4">
                            <FormLabel className="text-left">
                              Maximun Company Headcount
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Maximun"
                                className="sm:min-w-[450px] w-2/3"
                                value={maximumCompanyHeadcount.text}
                                onChange={(e) => {
                                  const numericValue = Number(e.target.value);
                                  const newValue = {
                                    ...maximumCompanyHeadcount,
                                    text: numericValue,
                                  };
                                  setMaximumCompanyHeadcount(newValue); // Update local state
                                  field.onChange(newValue); // Notify React Hook Form of the change
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              This is maximun headcount of the company that
                              you&apos;re interested in.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="organization_locations"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start mx-1 my-4">
                        <FormLabel className="text-left">
                          Company Locations
                        </FormLabel>
                        <FormControl>
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
                        </FormControl>
                        <FormDescription>
                          These are the company locations that you&apos;re
                          interested in.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex w-full justify-between">
              <div className="my-3 w-1/2">
                <FormField
                  control={form.control}
                  name="email_status"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start my-4">
                      <FormLabel className="text-left">
                        Contact email status
                      </FormLabel>
                      <FormControl>
                        <FormControl>
                          <TagInput
                            {...field}
                            dropdown={true}
                            dropdownPlaceholder="Select email status"
                            dropdownOptions={emailStatusOptions}
                            tags={emailStatus}
                            className="sm:min-w-[450px]"
                            setTags={(newTags) => {
                              setEmailStatus(newTags);
                              setValue(
                                "email_status",
                                newTags as [Tag, ...Tag[]]
                              );
                            }}
                          />
                        </FormControl>
                      </FormControl>
                      <FormDescription>
                        These are the email status you&apos;re interested in.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
              </div>
              <div className="my-3 w-1/2">
                <FormField
                  control={form.control}
                  name="prospected_by_current_team"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start my-4">
                      <FormLabel className="text-left">
                        Prospected by Current Team
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            const newValue = {
                              ...prospectedByCurrentTeam,
                              text: value,
                            };
                            setProspectedByCurrentTeam(newValue);
                            field.onChange(newValue);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Yes/No" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        This is wether the organization that you&apos;re
                        interested in has been prospected or not.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="per_page"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start my-4">
                  <FormLabel className="text-left">
                    Number of Employees
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter number of employees"
                      className="sm:min-w-[450px]"
                      value={perPage.text}
                      onChange={(e) => {
                        const numericValue = Number(e.target.value);
                        const newValue = {
                          ...perPage,
                          text: numericValue,
                        };
                        setPerPage(newValue); // Update local state
                        field.onChange(newValue); // Notify React Hook Form of the change
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    These are the number of employees that you&apos;re
                    interested in.
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
