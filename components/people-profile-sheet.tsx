/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unresolved */
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState, useEffect } from "react";
import {
  Briefcase,
  ChevronsUpDown,
  MapPinIcon,
  Phone,
  Linkedin,
  MonitorUp,
  Building2,
  Users,
  Layers,
  Activity,
} from "lucide-react";
import { GrScorecard } from "react-icons/gr";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { Lead, Contact } from "@/context/lead-user";
import { ScrollArea } from "./ui/scroll-area";
import { useCompanyInfo, CompanyInfo } from "@/context/company-linkedin";

interface PeopleProfileSheetProps {
  data: Lead | Contact;
  companyInfoProp?: CompanyInfo;
}

export const PeopleProfileSheet = ({
  data,
  companyInfoProp,
}: PeopleProfileSheetProps) => {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [addressCollapsibleOpen, setAddressCollapsibleOpen] = useState(false);
  const [painPointsCollapsibleOpen, setPainPointsCollapsibleOpen] =
    useState(false);
  const [technologiesCollapsibleOpen, setTechnologiesCollapsibleOpen] =
    useState(false);
  const [complimentsCollapsibleOpen, setComplimentsCollapsibleOpen] =
    useState(false);
  const [valueCollapsibleOpen, setValueCollapsibleOpen] = useState(false);
  const [metricsCollapsibleOpen, setMetricsCollapsibleOpen] = useState(false);
  const [affiliatedPagesCollapsibleOpen, setAffiliatedPagesCollapsibleOpen] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [qualificationsCollapsibleOpen, setQualificationsCollapsibleOpen] =
    useState(false);
  const { getCompanyInfo, companyInfo, setCompanyLinkedin } = useCompanyInfo();
  const [subdepartmentsCollapsibleOpen, setSubdepartmentsCollapsibleOpen] =
    useState(false);
  // const [companyCollapsibleOpen, setCompanyCollapsibleOpen] = useState(false);

  console.log("Leads Data for Indiviual User", data);

  const initials = (name: string) => {
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  const formatName = (name: string) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  const formatText = (text: string) => {
    let spacedText = text.replace(/_+/g, " ");
    return spacedText[0].toUpperCase() + spacedText.slice(1).toLowerCase();
  };

  useEffect(() => {
    console.log(data);
    const fetchCompanyInfo = async () => {
      if (data) {
        if (!companyInfoProp) {
          if ("company_linkedin_url" in data && data.company_linkedin_url) {
            getCompanyInfo(data.company_linkedin_url);
          }
        } else {
          setCompanyLinkedin(companyInfoProp);
        }
      }
    };

    fetchCompanyInfo();
    setLoading(false);
  }, [data]);

  useEffect(() => {
    console.log("Company Info: ", companyInfo);
  }, [companyInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No lead found.</div>;
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="p-4 h-full">
            <div className="flex">
              <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                <AvatarImage src={data?.photo_url} alt="avatar" />
                <AvatarFallback>{initials(data?.name || "AP")}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1 w-full">
                <p className="text-sm font-medium leading-none whitespace-normal w-full">
                  {data.name}
                </p>
                <p className="text-sm text-muted-foreground whitespace-normal w-full">
                  {data.email}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-4 whitespace-normal w-full">
              {data.headline}
            </p>
            <br />
            <div className="pt-4 space-y-3 w-full">
              <div className="flex space-x-2 w-full">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground whitespace-normal w-full">
                  {data.title}
                </span>
              </div>
              <div className="flex space-x-2 w-full">
                <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground whitespace-normal w-full">
                  {data.state && `${data.state}, `}
                  {data.country}
                </span>
              </div>
              <div className="flex space-x-2 w-full">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground whitespace-normal w-full">
                  {data?.employment_history
                    ? data?.employment_history[0]?.organization_name
                    : data.company}
                </span>
              </div>
              {/* {data.phone_numbers && (
                <div className="flex space-x-2 w-full">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground whitespace-normal w-full">
                    {data.phone_numbers[0]?.sanitized_number || data.phone}
                  </span>
                </div>
              )} */}
              <div className="flex space-x-2 w-full">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground whitespace-normal w-full underline">
                  <a href={data.linkedin_url || ""} target="_blank">
                    {data.linkedin_url || "N/A"}
                  </a>
                </span>
              </div>
              {data.seniority && (
                <div className="flex space-x-2 w-full">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground whitespace-normal w-full">
                    Seniority: {data.seniority.toLocaleUpperCase()}
                  </span>
                </div>
              )}
              {data.departments && data.departments.length > 0 && (
                <div className="flex space-x-2 w-full">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground whitespace-normal w-full">
                    Department: {data.departments.map(formatName).join(", ")}
                  </span>
                </div>
              )}

              {data.subdepartments && data.subdepartments.length > 0 && (
                <Collapsible
                  open={subdepartmentsCollapsibleOpen}
                  onOpenChange={setSubdepartmentsCollapsibleOpen}
                  className="pt-2 space-y-2 text-muted-foreground w-full"
                >
                  <div className="flex items-center justify-between space-x-4 w-full">
                    <div className="flex space-x-2 w-full">
                      <Layers className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground whitespace-normal w-full">
                        Sub-departments
                      </span>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-2 w-full">
                    {data.subdepartments.map((subdepartment, index) => (
                      <div
                        key={index}
                        className="flex px-2 py-1 font-mono text-xs justify-between w-full"
                      >
                        <span className="w-full whitespace-normal">
                          {formatName(subdepartment)}
                        </span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
              {data.functions && data.functions.length > 0 && (
                <div className="flex space-x-2 w-full">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground whitespace-normal w-full">
                    Functions: {data.functions.map(formatName).join(", ")}
                  </span>
                </div>
              )}
            </div>
            <br />

            {data.organization && (
              <>
                <div className="text-sm text-muted-foreground whitespace-normal w-full">
                  <span className="font-semibold">Industry:</span>{" "}
                  {data.organization.industry || "N/A"}
                </div>
                <div className="text-sm text-muted-foreground whitespace-normal w-full">
                  <span className="font-semibold">Company Size:</span>{" "}
                  {data.organization.estimated_num_employees
                    ? `${data.organization.estimated_num_employees} employees`
                    : "N/A"}
                </div>
                <div className="text-sm text-muted-foreground whitespace-normal w-full">
                  <span className="font-semibold">Headquarters:</span>{" "}
                  {`${data.organization.city || "N/A"}, ${
                    data.organization.state || "N/A"
                  }, ${data.organization.country || "N/A"}`}
                </div>
                <div className="text-sm text-muted-foreground whitespace-normal w-full">
                  <span className="font-semibold">Type:</span>{" "}
                  {data.organization.publicly_traded_symbol
                    ? "Publicly Traded"
                    : "Privately Held"}
                </div>
                <div className="text-sm text-muted-foreground whitespace-normal w-full">
                  <span className="font-semibold">Founded:</span>{" "}
                  {data.organization.founded_year || "N/A"}
                </div>
                <div className="text-sm text-muted-foreground whitespace-normal w-full">
                  <span className="font-semibold">Website:</span>{" "}
                  {data.organization.website_url ? (
                    <a
                      href={data.organization.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.organization.website_url}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </div>
                {data.organization.keywords &&
                  data.organization.keywords.length > 0 && (
                    <div className="text-sm text-muted-foreground whitespace-normal w-full">
                      <span className="font-semibold">Keywords:</span>{" "}
                      {data.organization.keywords.join(", ")}
                    </div>
                  )}
                {((data.organization.industries &&
                  data.organization.industries.length > 0) ||
                  (data.organization.secondary_industries &&
                    data.organization.secondary_industries.length > 0)) && (
                  <div className="text-sm text-muted-foreground whitespace-normal w-full">
                    <span className="font-semibold">
                      Industries & Specialties:
                    </span>{" "}
                    {[
                      ...(data.organization.industries || []),
                      ...(data.organization.secondary_industries || []),
                    ].join(", ")}
                  </div>
                )}
              </>
            )}

            {/* Show here */}
            {companyInfo && (
              <div className="flex flex-col gap-2 w-full">
                {companyInfo.company_info &&
                  Object.entries(companyInfo.company_info).map(
                    ([key, value]) => (
                      <div
                        className="text-sm font-semibold text-muted-foreground whitespace-normal w-full"
                        key={key}
                      >
                        {formatText(key)}:{" "}
                        <span className="text-sm font-normal text-muted-foreground whitespace-normal w-full">
                          {value as string}
                        </span>
                      </div>
                    )
                  )}

                {companyInfo.addresses && companyInfo.addresses.length > 0 && (
                  <Collapsible
                    open={addressCollapsibleOpen}
                    onOpenChange={setAddressCollapsibleOpen}
                    className="pt-4 space-y-2 text-muted-foreground w-full"
                  >
                    <div className="flex items-center justify-between space-x-4 w-full">
                      <h4 className="text-sm font-semibold">Addresses</h4>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                          <ChevronsUpDown className="h-4 w-4" />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <div className="px-2 py-1 text-xs whitespace-normal w-full">
                      {companyInfo.addresses[0].replace("Get directions", "")}
                    </div>
                    <CollapsibleContent className="space-y-2 w-full">
                      <div className="flex flex-col gap-2 px-2 w-full">
                        {companyInfo.addresses.map((address, index) => {
                          if (index === 0) return null;
                          else {
                            return (
                              <div
                                className="text-xs text-muted-foreground whitespace-normal w-full"
                                key={index}
                              >
                                {address.replace("Get directions", "")}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {companyInfo.affiliated_pages &&
                  companyInfo.affiliated_pages.length > 0 && (
                    <Collapsible
                      open={affiliatedPagesCollapsibleOpen}
                      onOpenChange={setAffiliatedPagesCollapsibleOpen}
                      className="pt-4 space-y-2 text-muted-foreground w-full"
                    >
                      <div className="flex items-center justify-between space-x-4 w-full">
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
                      <CollapsibleContent className="space-y-2 w-full">
                        {companyInfo.affiliated_pages.title.map(
                          (title: any, index: any) =>
                            index > 0 && (
                              <div
                                className="px-2 py-1 text-xs text-muted-foreground whitespace-normal w-full"
                                key={index}
                              >
                                {title}
                                {companyInfo.affiliated_pages.description[
                                  index
                                ] &&
                                  ` - ${companyInfo.affiliated_pages.description[index]}`}
                              </div>
                            )
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                {companyInfo.stock_info &&
                  Object.entries(companyInfo.stock_info).length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground">
                        Stock Info:
                      </div>
                      {Object.entries(companyInfo.stock_info).map(
                        ([key, value]) => (
                          <div
                            className="text-muted-foreground text-sm whitespace-normal w-full"
                            key={key}
                          >
                            {formatText(key)}:{" "}
                            <span className="font-normal">
                              {value as string}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                {companyInfo.funding_info &&
                  Object.entries(companyInfo.funding_info).length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground">
                        Funding Info:
                      </div>
                      {Object.entries(companyInfo.funding_info).map(
                        ([key, value]) => (
                          <div
                            className="text-muted-foreground text-sm whitespace-normal w-full"
                            key={key}
                          >
                            {formatText(key)}: <span>{value as string}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                {data?.qualification_details &&
                  data.qualification_details.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground">
                        Qualifications:
                      </div>
                      {data.qualification_details.map(
                        (qual: any, ind: number) => (
                          <div
                            className="flex text-muted-foreground flex-col px-2 py-1 font-mono text-xs w-full"
                            key={`qual_${ind}`}
                          >
                            <span className="font-semibold">
                              Q: {qual.question}
                            </span>
                            <span>A: {qual.answer}</span>
                            <span>
                              Qualifies: {qual.qualifies ? "Yes" : "No"}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                {/* Qualifications */}
                {/* <Collapsible
                  open={qualificationsCollapsibleOpen}
                  onOpenChange={setQualificationsCollapsibleOpen}
                  className="pt-4 space-y-2 text-muted-foreground w-full"
                >
                  <div className="flex items-center justify-between space-x-4 w-full">
                    <h4 className="text-sm font-semibold">Qualifications</h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  {data?.qualification_details && (
                    <>
                      <div className="flex px-2 py-1 font-mono text-xs justify-between w-full">
                        <span>{data?.qualification_details[0]?.question}</span>
                      </div>
                      <CollapsibleContent className="space-y-2 w-full">
                        {data.qualification_details.map(
                          (qual: any, ind: number) => (
                            <div
                              className="flex flex-col px-2 py-1 font-mono text-xs w-full"
                              key={`qual_${ind}`}
                            >
                              <span className="font-semibold">
                                Q: {qual.question}
                              </span>
                              <span>A: {qual.answer}</span>
                              <span>
                                Qualifies: {qual.qualifies ? "Yes" : "No"}
                              </span>
                            </div>
                          )
                        )}
                      </CollapsibleContent>
                    </>
                  )}
                </Collapsible> */}

                {/* Qualifications */}
              </div>
            )}

            {/* Show here */}
            <Collapsible
              open={collapsibleOpen}
              onOpenChange={setCollapsibleOpen}
              className="pt-4 space-y-2 text-muted-foreground w-full"
            >
              <div className="flex items-center justify-between space-x-4 w-full">
                <h4 className="text-sm font-semibold">Work History</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              {data?.employment_history && (
                <>
                  <div className="flex px-2 py-1 font-mono text-xs justify-between w-full">
                    <span>
                      {data?.employment_history[0]?.start_date
                        ? data.employment_history[0].start_date.substring(0, 4)
                        : ""}{" "}
                      - present
                    </span>
                    <span className="w-full whitespace-normal">
                      {data?.employment_history[0]?.title}
                    </span>
                  </div>
                  <CollapsibleContent className="space-y-2 w-full">
                    {data.employment_history.map((val, ind) => {
                      if (ind === 0) return null;
                      return (
                        <div
                          className="flex px-2 py-1 font-mono text-xs justify-between w-full"
                          key={`e_his${ind}`}
                        >
                          <span>
                            {/* {val.start_date.substring(0, 4)} -{" "} */}
                            {val.end_date ? val.end_date.substring(0, 4) : ""}
                          </span>
                          <span className="w-full whitespace-normal">
                            {val.title}
                          </span>
                        </div>
                      );
                    })}
                  </CollapsibleContent>
                </>
              )}
            </Collapsible>

            <br />

            {/* Technologies */}

            {/* <Collapsible
              open={technologiesCollapsibleOpen}
              onOpenChange={setTechnologiesCollapsibleOpen}
              className="pt-4 space-y-2 text-muted-foreground w-full"
            >
              <div className="flex items-center justify-between space-x-4 w-full">
                <h4 className="text-sm font-semibold">Technologies</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              {data?.technologies && data.technologies.length > 0 ? (
                <>
                  <div className="flex px-2 py-1 font-mono text-xs justify-between w-full">
                    <span>{data.technologies[0]}</span>
                  </div>
                  <CollapsibleContent className="space-y-2 w-full">
                    {data.technologies.slice(1).map((val, ind) => (
                      <div
                        className="flex px-2 py-1 font-mono text-xs justify-between w-full"
                        key={`e_his${ind + 1}`}
                      >
                        <span className="w-full whitespace-normal">{val}</span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </>
              ) : (
                <div className="flex px-2 py-1 font-mono text-xs justify-between w-full">
                  <span>No data available</span>
                </div>
              )}
            </Collapsible> */}

            {/* Technologies */}

            {/* Pain Points */}
            <Collapsible
              open={painPointsCollapsibleOpen}
              onOpenChange={setPainPointsCollapsibleOpen}
              className="pt-4 space-y-2 text-muted-foreground w-full"
            >
              <div className="flex items-center justify-between space-x-4 w-full">
                <h4 className="text-sm font-semibold">Pain Poitns</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              {data?.pain_points && (
                <>
                  <div className="flex px-2 py-1 font-mono text-xs justify-between w-full">
                    <span>{data?.pain_points[0]}</span>
                  </div>
                  <CollapsibleContent className="space-y-2 w-full">
                    {data.pain_points.map((val: any, ind: any) => {
                      if (ind === 0) return null;
                      return (
                        <div
                          className="flex px-2 py-1 font-mono text-xs justify-between w-full"
                          key={`e_his${ind}`}
                        >
                          <span className="w-full whitespace-normal">
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </CollapsibleContent>
                </>
              )}
            </Collapsible>

            {/* Pain Points */}

            {/* Value */}
            <Collapsible
              open={valueCollapsibleOpen}
              onOpenChange={setValueCollapsibleOpen}
              className="pt-4 space-y-2 text-muted-foreground w-full"
            >
              <div className="flex items-center justify-between space-x-4 w-full">
                <h4 className="text-sm font-semibold">Values</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              {data?.value && (
                <>
                  <div className="flex px-2 py-1 font-mono text-xs justify-between w-full">
                    <span>{data?.value[0]}</span>
                  </div>
                  <CollapsibleContent className="space-y-2 w-full">
                    {data.value.map((val: any, ind: any) => {
                      if (ind === 0) return null;
                      return (
                        <div
                          className="flex px-2 py-1 font-mono text-xs justify-between w-full"
                          key={`e_his${ind}`}
                        >
                          <span className="w-full whitespace-normal">
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </CollapsibleContent>
                </>
              )}
            </Collapsible>

            {/* Value */}

            {/* Metrics */}
            <Collapsible
              open={metricsCollapsibleOpen}
              onOpenChange={setMetricsCollapsibleOpen}
              className="pt-4 space-y-2 text-muted-foreground w-full"
            >
              <div className="flex items-center justify-between space-x-4 w-full">
                <h4 className="text-sm font-semibold">Metrics</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              {data?.metrics && (
                <>
                  <div className="flex px-2 py-1 font-mono text-xs justify-between w-full">
                    <span>{data?.metrics[0]}</span>
                  </div>
                  <CollapsibleContent className="space-y-2 w-full">
                    {data.metrics.map((val: any, ind: any) => {
                      if (ind === 0) return null;
                      return (
                        <div
                          className="flex px-2 py-1 font-mono text-xs justify-between w-full"
                          key={`e_his${ind}`}
                        >
                          <span className="w-full whitespace-normal">
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </CollapsibleContent>
                </>
              )}
            </Collapsible>

            {/* Metrics */}

            {/* Compliments */}
            <Collapsible
              open={complimentsCollapsibleOpen}
              onOpenChange={setComplimentsCollapsibleOpen}
              className="pt-4 space-y-2 text-muted-foreground w-full"
            >
              <div className="flex items-center justify-between space-x-4 w-full">
                <h4 className="text-sm font-semibold">Compliments</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              {data?.compliments && (
                <>
                  <div className="flex px-2 py-1 font-mono text-xs justify-between w-full">
                    <span>{data?.compliments[0]}</span>
                  </div>
                  <CollapsibleContent className="space-y-2 w-full">
                    {data.compliments.map((val: any, ind: any) => {
                      if (ind === 0) return null;
                      return (
                        <div
                          className="flex px-2 py-1 font-mono text-xs justify-between w-full"
                          key={`e_his${ind}`}
                        >
                          <span className="w-full whitespace-normal">
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </CollapsibleContent>
                </>
              )}
            </Collapsible>

            {/* Compliments */}
            <br />
            <p className="flex gap-2 items-center text-sm text-muted-foreground whitespace-normal w-full">
              <Building2 className="h-4 w-4" />
              Company Type: {data?.is_b2b ? "B2B" : "B2C"}
            </p>
            <br />
            <p className="flex gap-2 items-center text-sm text-muted-foreground whitespace-normal w-full">
              <GrScorecard className="h-4 w-4" />
              Score: {data?.score ? data?.score + "/10" : "Score not available"}
            </p>
            <br />
            <div className="flex space-x-2 w-full">
              <MonitorUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground whitespace-normal w-full">
                {data?.lead_information || "No Information"}
              </span>
            </div>

            <br />
            <br />
            <div>
              <p className="text-sm font-medium leading-none whitespace-normal w-full">
                {data?.employment_history &&
                  data?.employment_history[0]?.organization_name}
              </p>
            </div>

            <br />
            {companyInfo && (
              <div className="space-y-3 w-full">
                <div className="flex space-x-2 w-full">
                  <span className="text-sm text-muted-foreground whitespace-normal w-full">
                    {companyInfo.about_us}
                  </span>
                </div>
                <br />
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
