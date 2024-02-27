import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tag, TagInput } from "@/components/ui/tag/tag-input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import { useLeads } from "../layout/context/lead-user";
import { LoadingCircle } from "@/app/icons";
import { AudienceTableClient } from "../tables/audience-table/client";
// import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  q_organization_domains: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
  organization_locations: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
  person_seniorities: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
  organization_num_employees_ranges: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
  person_titles: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
});

export default function Hero() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { setLeads } = useLeads();

  const [tab, setTab] = useState("tab1");
  const [loading, setLoading] = useState(false);

  const onTabChange = async (value: any) => {
    //TODO: only change the value if form is correct
    if (form.formState.isValid) {
      setTab(value);
      setLoading(true);
      try {
        const data = await axios.post(
          "/api/apollo",
          {
            url: "https://api.apollo.io/v1/mixed_people/search",
            body: {
              q_organization_domains: "apollo.io\ngoogle.com",
              page: 1,
              per_page: 2,
              organization_locations: ["California, US"],
              person_seniorities: ["senior", "manager"],
              organization_num_employees_ranges: ["1,1000000"],
              person_titles: ["sales manager", "engineer manager"],
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        // console.log("DATA: ", JSON.stringify(data.data));
        setLeads(data.data.result.people);
      } catch (err) {
        console.log("ERR: ", err);
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fill out the form correctly");
    }
    // setTab(value);
  };

  //   const [tags, setTags] = React.useState<Tag[]>([]);
  const [qOrganizationDomainsTags, setQOrganizationDomainsTags] =
    React.useState<Tag[]>([]);
  const [organizationLocationsTags, setOrganizationLocationsTags] =
    React.useState<Tag[]>([]);
  const [personSenioritiesTags, setPersonSenioritiesTags] = React.useState<
    Tag[]
  >([]);
  const [
    organizationNumEmployeesRangesTags,
    setOrganizationNumEmployeesRangesTags,
  ] = React.useState<Tag[]>([]);
  const [personTitlesTags, setPersonTitlesTags] = React.useState<Tag[]>([]);

  const { setValue } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // convert all arrays object to array of strings
    const qOrganizationDomains = data.q_organization_domains.map(
      (tag) => tag.text,
    );
    const organizationLocations = data.organization_locations.map(
      (tag) => tag.text,
    );
    const personSeniorities = data.person_seniorities.map((tag) => tag.text);
    const organizationNumEmployeesRanges =
      data.organization_num_employees_ranges.map((tag) => tag.text);
    const personTitles = data.person_titles.map((tag) => tag.text);

    const body = {
      qOrganizationDomains,
      organizationLocations,
      personSeniorities,
      organizationNumEmployeesRanges,
      personTitles,
    };

    console.log("BODY: ", body);
  }

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
            <FormField
              control={form.control}
              name="q_organization_domains"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Company Domains</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="Enter a location"
                      tags={qOrganizationDomainsTags}
                      className="sm:min-w-[450px]"
                      setTags={(newTags) => {
                        setQOrganizationDomainsTags(newTags);
                        setValue(
                          "q_organization_domains",
                          newTags as [Tag, ...Tag[]],
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    These are the company domains that you&apos;re interested
                    in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organization_locations"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Company Locations</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="Enter a location"
                      tags={organizationLocationsTags}
                      className="sm:min-w-[450px]"
                      setTags={(newTags) => {
                        setOrganizationLocationsTags(newTags);
                        setValue(
                          "organization_locations",
                          newTags as [Tag, ...Tag[]],
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    These are the company locations that you&apos;re interested
                    in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="person_seniorities"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Seniorities</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="Enter a seniority"
                      tags={personSenioritiesTags}
                      className="sm:min-w-[450px]"
                      setTags={(newTags) => {
                        setPersonSenioritiesTags(newTags);
                        setValue(
                          "person_seniorities",
                          newTags as [Tag, ...Tag[]],
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    These are the seniorities that you&apos;re interested in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organization_num_employees_ranges"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">
                    Number of Employees
                  </FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="Enter a number of employees"
                      tags={organizationNumEmployeesRangesTags}
                      className="sm:min-w-[450px]"
                      setTags={(newTags) => {
                        setOrganizationNumEmployeesRangesTags(newTags);
                        setValue(
                          "organization_num_employees_ranges",
                          newTags as [Tag, ...Tag[]],
                        );
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
            <FormField
              control={form.control}
              name="person_titles"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Job Titles</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="Enter a job title"
                      tags={personTitlesTags}
                      className="sm:min-w-[450px]"
                      setTags={(newTags) => {
                        setPersonTitlesTags(newTags);
                        setValue("person_titles", newTags as [Tag, ...Tag[]]);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    These are the job titles that you&apos;re interested in.
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
