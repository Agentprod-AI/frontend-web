/* eslint-disable no-console */
import { useState, useEffect } from "react";
import {
  Briefcase,
  ChevronsUpDown,
  MapPinIcon,
  Phone,
  Linkedin,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from "@/context/user-context";
import { Loading } from "./Loader";

interface PhoneNumber {
  type?: string;
  status?: string;
  position?: number;
  dnc_status?: string | null;
  raw_number?: string;
  dialer_flags?: any;
  dnc_other_info?: string | null;
  sanitized_number?: string;
}

interface EmploymentHistory {
  id: string;
  _id: string;
  key: string;
  kind?: string | null;
  major?: string | null;
  title: string;
  degree?: string | null;
  emails?: string[] | null;
  current?: boolean;
  end_date?: string | null;
  created_at?: string | null;
  start_date: string;
  updated_at?: string | null;
  description?: string | null;
  grade_level?: string | null;
  raw_address?: string | null;
  organization_id: string;
  organization_name: string;
}

interface LinkedInCompanyInfo {
  Website?: string;
  Industry?: string;
  "Company size"?: string;
  Headquarters?: string;
  Type?: string;
  Founded?: string;
  Specialties?: string;
}

interface AffiliatedPages {
  title: string[];
  description: string[];
}

interface ContactData {
  id: string;
  campaign_id: string;
  type?: string | null;
  first_name: string;
  last_name: string;
  name: string;
  linkedin_url: string;
  title: string;
  email_status: string;
  photo_url: string;
  twitter_url?: string | null;
  github_url?: string | null;
  facebook_url?: string | null;
  extrapolated_email_confidence?: any;
  headline: string;
  email: string;
  employment_history: EmploymentHistory[];
  state: string;
  city: string;
  country: string;
  is_likely_to_engage: boolean;
  departments: string[];
  subdepartments: string[];
  seniority: string;
  functions: string[];
  phone_numbers: PhoneNumber[];
  intent_strength?: any;
  show_intent?: boolean;
  revealed_for_current_team?: boolean;
  is_responded?: boolean | null;
  personalized_social_info?: any;
  company_linkedin_url: string;
  company_website_url: string;
}

interface EmailContent {
  subject: string;
  body: string;
}

interface LinkedInInformation {
  id: string;
  company_info: LinkedInCompanyInfo;
  about_us: string;
  affiliated_pages: AffiliatedPages;
  stock_info: any;
  funding_info: any;
  company_linkedin_url: string;
  addresses: string[];
}

export interface Data {
  contact: ContactData;
  linkedin_information: LinkedInInformation;
  email: EmailContent;
}

export const TrainingPeopleProfileSheet = ({
  newData,
  newPreviews,
}: {
  newData: any;
  newPreviews: any;
}) => {
  const [campaignId, setCampaignId] = useState("");
  const { user } = useUserContext();
  const [data, setData] = useState<Data | null>(null);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [addressCollapsibleOpen, setAddressCollapsibleOpen] = useState(false);
  const [affiliatedPagesCollapsibleOpen, setAffiliatedPagesCollapsibleOpen] =
    useState(false);

  const initials = (name: string) => {
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatText = (text: string) => {
    let spacedText = text.replace(/_+/g, " ");
    return spacedText[0].toUpperCase() + spacedText.slice(1).toLowerCase();
  };

  useEffect(() => {
    const storedCampaignId = localStorage.getItem("campaignId");
    if (storedCampaignId) {
      setCampaignId(storedCampaignId);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://agentprod-backend-framework-zahq.onrender.com/v2/training/preview",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ campaign_id: campaignId, user_id: user.id }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result: Data = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [campaignId, user.id]);

  console.log("New Data from SHeet", newData);
  console.log("New Previews from SHeet", newPreviews);

  const renderEmploymentHistory = (employmentHistory: any) => {
    const validHistory = Array.isArray(employmentHistory)
      ? employmentHistory
      : [];

    if (validHistory.length === 0) {
      return <div>No employment history available.</div>;
    }

    return validHistory.map((job, index) => (
      <div key={index} className="text-xs">
        {job.start_date} - {job.end_date || "Present"}: {job.title} at{" "}
        {job.organization_name}
      </div>
    ));
  };

  const renderPhoneNumbers = (phoneNumbers: any) => {
    const validPhoneNumbers = Array.isArray(phoneNumbers) ? phoneNumbers : [];

    if (validPhoneNumbers.length === 0) {
      return <span className="text-sm text-muted-foreground">N/A</span>;
    }

    return (
      <div className="flex space-x-2">
        <span className="text-sm text-muted-foreground">
          {validPhoneNumbers[0].sanitized_number}
        </span>
      </div>
    );
  };

  if (!data) {
    return <Loading />;
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className={"p-4 h-full"}>
            <div className="flex">
              <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                <AvatarImage
                  src={
                    newPreviews
                      ? newData?.contact.photo_url
                      : data?.contact.photo_url
                  }
                  alt="avatar"
                />
                <AvatarFallback>
                  {initials(data?.contact.name || "AP")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                {/* <p>Id: {itemId}</p> */}
                <p className="text-sm font-medium leading-none">
                  {newPreviews ? newData?.contact.name : data?.contact?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {newPreviews ? newData?.contact.email : data?.contact?.email}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              {newPreviews
                ? newData?.contact?.headline
                : data?.contact?.headline}
            </p>
            <br />
            <div className="pt-4 space-y-3">
              <div className="flex space-x-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {newPreviews ? newData?.contact?.title : data?.contact?.title}
                </span>
              </div>
              <div className="flex space-x-2">
                <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {newPreviews ? newData?.contact?.state : data?.contact?.state}
                  ,
                  {newPreviews
                    ? newData?.contact?.country
                    : data?.contact?.country}
                </span>
              </div>
              <div className="flex space-x-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {newPreviews
                    ? renderEmploymentHistory(
                        newData?.contact?.employment_history
                      )
                    : renderEmploymentHistory(
                        data?.contact?.employment_history
                      ) && newPreviews
                    ? renderEmploymentHistory(
                        newData?.contact?.employment_history[0]
                          .organization_name
                      )
                    : renderEmploymentHistory(
                        data?.contact?.employment_history[0].organization_name
                      )}
                </span>
              </div>
              {newPreviews
                ? renderPhoneNumbers(newData?.contact?.phone_numbers)
                : renderPhoneNumbers(data?.contact?.phone_numbers) && (
                    <div className="flex space-x-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {newPreviews
                          ? renderPhoneNumbers(
                              newData?.contact?.phone_numbers
                              // [0]
                              //   ?.sanitized_number
                            )
                          : renderPhoneNumbers(
                              data?.contact?.phone_numbers
                              // [0]
                              //   ?.sanitized_number
                            ) || "N/A"}
                      </span>
                    </div>
                  )}
              <div className="flex space-x-2">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {newPreviews
                    ? newData?.contact?.linkedin_url
                    : data?.contact?.linkedin_url || "N/A"}
                </span>
              </div>
            </div>
            <br />
            <Collapsible
              open={collapsibleOpen}
              onOpenChange={setCollapsibleOpen}
              className="w-[350px] pt-4 space-y-2 text-muted-foreground"
            >
              <div className="flex items-center justify-between space-x-4">
                <h4 className="text-sm font-semibold">Work History</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              {data?.contact?.employment_history && (
                <>
                  <div className="flex px-2 py-1 font-mono text-xs justify-between">
                    <span>
                      {data?.contact?.employment_history[0].start_date.substring(
                        0,
                        4
                      )}{" "}
                      - present
                    </span>
                    <span className="w-[200px]">
                      {data?.contact?.employment_history[0].title}
                    </span>
                  </div>
                  <CollapsibleContent className="space-y-2">
                    {data?.contact?.employment_history.map((val, ind) => {
                      if (ind === 0) return null;
                      return (
                        <div
                          className="flex px-2 py-1 font-mono text-xs justify-between"
                          key={`e_his${ind}`}
                        >
                          <span>
                            {val.start_date.substring(0, 4)} -{" "}
                            {val.end_date ? val.end_date.substring(0, 4) : ""}
                          </span>
                          <span className="w-[200px]">{val.title}</span>
                        </div>
                      );
                    })}
                    {/* <div className="flex px-2 py-1 font-mono text-sm justify-between">
                      <span></span>
                      <span>Software Developer</span>
                    </div> */}
                  </CollapsibleContent>
                </>
              )}
            </Collapsible>
            <br />
            <br />
            {/* {data.organization && (
              <>
                <div className="flex">
                  <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                    <AvatarImage src={data.organization.logo_url} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {data.organization.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {data.organization.primary_domain || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex space-x-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {data.organization.sanitized_phone || "N/A"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Linkedin className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {data.organization.linkedin_url || "N/A"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {data.organization.website_url || "N/A"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Twitter className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {data.organization.twitter_url || "N/A"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Facebook className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {data.organization.facebook_url || "N/A"}
                    </span>
                  </div>
                </div>
              </>
            )} */}
            <div>
              <p className="text-sm font-medium leading-none">
                {data?.contact?.employment_history &&
                  data?.contact?.employment_history[0].organization_name}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <span className="text-sm text-muted-foreground">
                  {data?.linkedin_information?.about_us}
                </span>
              </div>
              <br />
              <br />
              <div className="flex flex-col gap-2">
                {data?.linkedin_information?.company_info &&
                  Object.entries(data?.linkedin_information?.company_info).map(
                    ([key, value]) => (
                      <div
                        className="text-sm font-semibold text-muted-foreground"
                        key={key}
                      >
                        {formatText(key)}:{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          {value as string}
                        </span>
                      </div>
                    )
                  )}
              </div>
              <br />
              <br />

              <Collapsible
                open={addressCollapsibleOpen}
                onOpenChange={setAddressCollapsibleOpen}
                className="w-[350px] pt-4 space-y-2 text-muted-foreground"
              >
                <div className="flex items-center justify-between space-x-4">
                  <h4 className="text-sm font-semibold">Addresses</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <div className="px-2 py-1 text-xs">
                  {/* {data?.linkedin_information?.company_info.Headquarters &&
                    data?.linkedin_information?.company_info?.Headquarters
                      .length > 0 &&
                    data?.linkedin_information?.company_info?.Headquarters[0].replace(
                      "Get directions",
                      ""
                    )} */}
                  {data?.linkedin_information?.company_info?.Headquarters}
                </div>
                <CollapsibleContent className="space-y-2">
                  <div className="flex flex-col gap-2 px-2">
                    {/* {data?.linkedin_information?.company_info.Headquarters &&
                      data?.linkedin_information?.company_info.Headquarters
                        .length > 0 &&
                      // handle this error
                      companyInfo.addresses.map((address, index) => {
                        if (index === 0) return null;
                        else {
                          return (
                            <div
                              className="text-xs text-muted-foreground"
                              key={index}
                            >
                              {address.replace("Get directions", "")}
                            </div>
                          );
                        }
                      })} */}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <br />
              <br />
              <div>
                <Collapsible
                  open={affiliatedPagesCollapsibleOpen}
                  onOpenChange={setAffiliatedPagesCollapsibleOpen}
                  className="w-[350px] pt-4 space-y-2 text-muted-foreground"
                >
                  <div className="flex items-center justify-between space-x-4">
                    <div className="text-sm font-medium text-muted-foreground">
                      Affiliated Pages:
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <div className="px-2 py-1 text-xs">
                    {data?.linkedin_information.affiliated_pages?.title && (
                      <div className="text-muted-foreground">
                        {data.linkedin_information.affiliated_pages?.title[0]}
                        {data.linkedin_information.affiliated_pages
                          ?.description[0] &&
                          ` - ${data.linkedin_information.affiliated_pages?.description[0]}`}
                      </div>
                    )}
                  </div>
                  <CollapsibleContent className="space-y-2">
                    <div className="flex flex-col gap-2">
                      {/* {data?.linkedin_information?.affiliated_pages.title &&
                        data?.linkedin_information?.affiliated_pages.title.map(
                          (title: string, index: number) => {
                            if (index === 0) return null;
                            else {
                              return (
                                <div
                                  key={index}
                                  className="px-2 py-1 text-xs text-muted-foreground"
                                >
                                  {title}
                                  {data?.linkedin_information.affiliated_pages
                                    .description[index] &&
                                    ` - ${data.linkedin_information?.affiliated_pages.description[index]}`}
                                </div>
                              );
                            }
                          }
                        )} */}
                      {data?.linkedin_information?.affiliated_pages?.title}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              <br />
              <br />
              <div>
                <div className="text-sm font-semibold text-muted-foreground">
                  Stock Info:
                </div>
                {data?.linkedin_information?.stock_info &&
                  Object.entries(data?.linkedin_information?.stock_info).map(
                    ([key, value]) => (
                      <div className="text-muted-foreground text-sm" key={key}>
                        {formatText(key)}:{" "}
                        <span className="font-normal">{value as string}</span>
                      </div>
                    )
                  )}
              </div>
              <br />
              <br />
              <div>
                <div className="text-sm font-semibold text-muted-foreground">
                  Funding Info:
                </div>
                <div>
                  {data?.linkedin_information?.funding_info &&
                    Object.entries(
                      data?.linkedin_information?.funding_info
                    ).map(([key, value]) => (
                      <div className="text-muted-foreground text-sm" key={key}>
                        {formatText(key)}: <span>{value as string}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
