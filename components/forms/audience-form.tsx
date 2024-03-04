// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Tag, TagInput } from "@/components/ui/tag/tag-input";
// import { Button } from "@/components/ui/button";
// import { input, z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { toast } from "sonner";
// import axios from "axios";
// import { useLeads } from "../layout/context/lead-user";
// import { LoadingCircle } from "@/app/icons";
// import { AudienceTableClient } from "../tables/audience-table/client";
// // import { toast } from "@/components/ui/use-toast";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// const FormSchema = z.object({
//   q_organization_domains: z.array(
//     z.object({
//       id: z.string(),
//       text: z.string(),
//     }),
//   ),
//   organization_locations: z.array(
//     z.object({
//       id: z.string(),
//       text: z.string(),
//     }),
//   ),
//   person_seniorities: z.array(
//     z.object({
//       id: z.string(),
//       text: z.string(),
//     }),
//   ),
//   organization_num_employees_ranges: z.array(
//     z.object({
//       id: z.string(),
//       text: z.string(),
//     }),
//   ),
//   person_titles: z.array(
//     z.object({
//       id: z.string(),
//       text: z.string(),
//     }),
//   ),
// });

// const OrgFormSchema = z.object({
//   organization_num_employees_ranges: z.array(
//     z.object({
//       id: z.string(),
//       text: z.string(),
//     }),
//   ),
//   organization_locations: z.array(
//     z.object({
//       id: z.string(),
//       text: z.string(),
//     }),
//   ),
//   q_organization_keyword_tags: z.array(
//     z.object({
//       id: z.string(),
//       text: z.string(),
//     }),
//   ),
//   q_organization_name: z.object({
//     id: z.string(),
//     text: z.string(),
//   }),
// });

// export default function Hero() {
//   const [formType, setFormType] = useState<"people" | "org">("people");

//   type FormSchemas = typeof FormSchema | typeof OrgFormSchema;

//   type FormSchemaMap = {
//     people: typeof FormSchema;
//     org: typeof OrgFormSchema;
//   };

//   const formSchemaMap: FormSchemaMap = {
//     people: FormSchema,
//     org: OrgFormSchema,
//   };

//   const currentSchema = formSchemaMap[formType];

//   const form = useForm<z.infer<typeof currentSchema>>({
//     resolver: zodResolver(FormSchema),
//   });

//   const { setLeads } = useLeads();

//   const [tab, setTab] = useState("tab1");
//   const [loading, setLoading] = useState(false);

//   interface inputValues {
//     q_organization_domains: string[];
//     organization_locations: string[];
//     person_seniorities: string[];
//     organization_num_employees_ranges: string[];
//     person_titles: string[];
//   }

//   const prevInputValues = React.useRef<inputValues>({
//     q_organization_domains: [],
//     organization_locations: [],
//     person_seniorities: [],
//     organization_num_employees_ranges: [],
//     person_titles: [],
//   });

//   const onTabChange = async (value: any) => {
//     //TODO: only change the value if form is correct
//     console.log(form.formState.isValid);
//     if (form.formState.isValid) {
//       setTab(value);
//       setLoading(true);
//       let shouldCallAPI = false;
//       for (const [key, value] of Object.entries(form.getValues())) {
//         value.forEach((item) => {
//           if (
//             !prevInputValues.current[
//               key as keyof typeof prevInputValues.current
//             ].includes(item.text)
//           ) {
//             prevInputValues.current[
//               key as keyof typeof prevInputValues.current
//             ] = [
//               ...prevInputValues.current[
//                 key as keyof typeof prevInputValues.current
//               ],
//               item.text,
//             ];
//             shouldCallAPI = true;
//           }
//         });
//       }

//       if (shouldCallAPI) {
//         try {
//           console.log("api called");
//           // const data = await axios.post(
//           //   "/api/apollo",
//           //   {
//           //     url: "https://api.apollo.io/v1/mixed_people/search",
//           //     body: {
//           //       q_organization_domains: "apollo.io\ngoogle.com",
//           //       page: 1,
//           //       per_page: 2,
//           //       organization_locations: ["California, US"],
//           //       person_seniorities: ["senior", "manager"],
//           //       organization_num_employees_ranges: ["1,1000000"],
//           //       person_titles: ["sales manager", "engineer manager"],
//           //     },
//           //   },
//           //   {
//           //     headers: {
//           //       "Content-Type": "application/json",
//           //     },
//           //   },
//           // );
//           // console.log("DATA: ", JSON.stringify(data.data));
//           // setLeads(data.data.result.people);
//           toast.success("api called");
//         } catch (err) {
//           console.log("ERR: ", err);
//           toast.error("Error fetching data");
//         } finally {
//           shouldCallAPI = false;
//           setLoading(false);
//         }
//       } else {
//         toast.error("no need to call api");
//         setLoading(false);
//       }
//     } else {
//       toast.error("Please fill out the form correctly");
//     }
//     // setTab(value);
//   };

//   //   const [tags, setTags] = React.useState<Tag[]>([]);
//   const [qOrganizationDomainsTags, setQOrganizationDomainsTags] =
//     React.useState<Tag[]>([]);
//   const [organizationLocationsTags, setOrganizationLocationsTags] =
//     React.useState<Tag[]>([]);
//   const [personSenioritiesTags, setPersonSenioritiesTags] = React.useState<
//     Tag[]
//   >([]);
//   const [
//     organizationNumEmployeesRangesTags,
//     setOrganizationNumEmployeesRangesTags,
//   ] = React.useState<Tag[]>([]);
//   const [personTitlesTags, setPersonTitlesTags] = React.useState<Tag[]>([]);

//   const { setValue } = form;

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     // convert all arrays object to array of strings
//     const qOrganizationDomains = data.q_organization_domains.map(
//       (tag) => tag.text,
//     );
//     const organizationLocations = data.organization_locations.map(
//       (tag) => tag.text,
//     );
//     const personSeniorities = data.person_seniorities.map((tag) => tag.text);
//     const organizationNumEmployeesRanges =
//       data.organization_num_employees_ranges.map((tag) => tag.text);
//     const personTitles = data.person_titles.map((tag) => tag.text);

//     console.log(data);

//     const body = {
//       qOrganizationDomains,
//       organizationLocations,
//       personSeniorities,
//       organizationNumEmployeesRanges,
//       personTitles,
//     };

//     // console.log("prevInputValues: ", prevInputValues.current);

//     console.log("BODY: ", body);
//   }

//   function onRadioChange(value: string) {
//     if (value === "people" || value === "org") {
//       setFormType(value);
//       form.reset();
//     }
//   }

//   return (
//     <>
//       <RadioGroup defaultValue="people" onValueChange={onRadioChange}>
//         <div className="flex items-center space-x-2">
//           <RadioGroupItem value="people" />
//           <Label htmlFor="people">People</Label>
//         </div>
//         <div className="flex items-center space-x-2">
//           <RadioGroupItem value="org" />
//           <Label htmlFor="org">Organizations</Label>
//         </div>
//       </RadioGroup>
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="space-y-8 flex flex-col items-start"
//         >
//           <Tabs value={tab} onValueChange={onTabChange} className="w-full">
//             <TabsList className="grid grid-cols-2 w-[330px]">
//               <TabsTrigger value="tab1">Edit</TabsTrigger>
//               <TabsTrigger value="tab2" type="submit">
//                 Preview
//               </TabsTrigger>
//             </TabsList>
//             <TabsContent value="tab1" className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="q_organization_domains"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col items-start">
//                     <FormLabel className="text-left">Company Domains</FormLabel>
//                     <FormControl>
//                       <TagInput
//                         {...field}
//                         placeholder="Enter a location"
//                         tags={qOrganizationDomainsTags}
//                         className="sm:min-w-[450px]"
//                         setTags={(newTags) => {
//                           setQOrganizationDomainsTags(newTags);
//                           setValue(
//                             "q_organization_domains",
//                             newTags as [Tag, ...Tag[]],
//                           );
//                         }}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       These are the company domains that you&apos;re interested
//                       in.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="organization_locations"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col items-start">
//                     <FormLabel className="text-left">
//                       Company Locations
//                     </FormLabel>
//                     <FormControl>
//                       <TagInput
//                         {...field}
//                         placeholder="Enter a location"
//                         tags={organizationLocationsTags}
//                         className="sm:min-w-[450px]"
//                         setTags={(newTags) => {
//                           setOrganizationLocationsTags(newTags);
//                           setValue(
//                             "organization_locations",
//                             newTags as [Tag, ...Tag[]],
//                           );
//                         }}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       These are the company locations that you&apos;re
//                       interested in.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="person_seniorities"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col items-start">
//                     <FormLabel className="text-left">Seniorities</FormLabel>
//                     <FormControl>
//                       <TagInput
//                         {...field}
//                         placeholder="Enter a seniority"
//                         tags={personSenioritiesTags}
//                         className="sm:min-w-[450px]"
//                         setTags={(newTags) => {
//                           setPersonSenioritiesTags(newTags);
//                           setValue(
//                             "person_seniorities",
//                             newTags as [Tag, ...Tag[]],
//                           );
//                         }}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       These are the seniorities that you&apos;re interested in.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="organization_num_employees_ranges"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col items-start">
//                     <FormLabel className="text-left">
//                       Number of Employees
//                     </FormLabel>
//                     <FormControl>
//                       <TagInput
//                         {...field}
//                         placeholder="Enter a number of employees"
//                         tags={organizationNumEmployeesRangesTags}
//                         className="sm:min-w-[450px]"
//                         setTags={(newTags) => {
//                           setOrganizationNumEmployeesRangesTags(newTags);
//                           setValue(
//                             "organization_num_employees_ranges",
//                             newTags as [Tag, ...Tag[]],
//                           );
//                         }}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       These are the number of employees that you&apos;re
//                       interested in.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="person_titles"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col items-start">
//                     <FormLabel className="text-left">Job Titles</FormLabel>
//                     <FormControl>
//                       <TagInput
//                         {...field}
//                         placeholder="Enter a job title"
//                         tags={personTitlesTags}
//                         className="sm:min-w-[450px]"
//                         setTags={(newTags) => {
//                           setPersonTitlesTags(newTags);
//                           setValue("person_titles", newTags as [Tag, ...Tag[]]);
//                         }}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       These are the job titles that you&apos;re interested in.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </TabsContent>
//             <TabsContent value="tab2">
//               {loading ? <LoadingCircle /> : <AudienceTableClient />}
//               <Button>Create Audience</Button>
//             </TabsContent>
//           </Tabs>
//         </form>
//       </Form>
//     </>
//   );
// }
