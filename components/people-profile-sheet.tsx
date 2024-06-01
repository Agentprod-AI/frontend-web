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
} from "lucide-react";
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
  const [affiliatedPagesCollapsibleOpen, setAffiliatedPagesCollapsibleOpen] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const { getCompanyInfo, companyInfo, setCompanyLinkedin } = useCompanyInfo();

  console.log(data);

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
                  {data.state}, {data.country}
                </span>
              </div>
              <div className="flex space-x-2 w-full">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground whitespace-normal w-full">
                  {data.employment_history &&
                    data.employment_history[0].organization_name}
                </span>
              </div>
              {data.phone_numbers && (
                <div className="flex space-x-2 w-full">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground whitespace-normal w-full">
                    {data.phone_numbers[0].sanitized_number || "N/A"}
                  </span>
                </div>
              )}
              <div className="flex space-x-2 w-full">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground whitespace-normal w-full">
                  {data.linkedin_url || "N/A"}
                </span>
              </div>
            </div>
            <br />
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
                      {data.employment_history[0].title}
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
                            {val.start_date.substring(0, 4)} -{" "}
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
            <br />
            <div>
              <p className="text-sm font-medium leading-none whitespace-normal w-full">
                {data.employment_history &&
                  data.employment_history[0].organization_name}
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
                </div>
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

                <div>
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-9 p-0"
                            >
                              <ChevronsUpDown className="h-4 w-4" />
                              <span className="sr-only">Toggle</span>
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <div className="px-2 py-1 text-xs whitespace-normal w-full">
                          <div className="text-muted-foreground">
                            {companyInfo.affiliated_pages.title[0]}
                            {companyInfo.affiliated_pages.description[0] &&
                              ` - ${companyInfo.affiliated_pages.description[0]}`}
                          </div>
                        </div>
                        <CollapsibleContent className="space-y-2 w-full">
                          <div className="flex flex-col gap-2 w-full">
                            {companyInfo.affiliated_pages.title &&
                              companyInfo.affiliated_pages.title.map(
                                (title: string, index: number) => {
                                  if (index === 0) return null;
                                  else {
                                    return (
                                      <div
                                        key={index}
                                        className="px-2 py-1 text-xs text-muted-foreground whitespace-normal w-full"
                                      >
                                        {title}
                                        {companyInfo.affiliated_pages
                                          .description[index] &&
                                          ` - ${companyInfo.affiliated_pages.description[index]}`}
                                      </div>
                                    );
                                  }
                                }
                              )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                </div>

                {companyInfo.stock_info &&
                  Object.entries(companyInfo.stock_info).length > 0 && (
                    <>
                      <br />
                      <br />
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
                    </>
                  )}
                {companyInfo.funding_info &&
                  Object.entries(companyInfo.funding_info).length > 0 && (
                    <>
                      <br />
                      <br />
                      <div>
                        <div className="text-sm font-semibold text-muted-foreground">
                          Funding Info:
                        </div>
                        <div>
                          {Object.entries(companyInfo.funding_info).map(
                            ([key, value]) => (
                              <div
                                className="text-muted-foreground text-sm whitespace-normal w-full"
                                key={key}
                              >
                                {formatText(key)}:{" "}
                                <span>{value as string}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
