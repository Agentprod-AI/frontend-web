import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import {
  Briefcase,
  ChevronsUpDown,
  MapPinIcon,
  Phone,
  Linkedin,
  Link,
  Twitter,
  Facebook,
  Search,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { Lead } from "@/context/lead-user";
import { ScrollArea } from "./ui/scroll-area";
import { useCompanyInfo, CompanyInfo } from "@/context/company-linkedin";

interface CompanyInfoDataItem {
  company_info: {
    website: string;
    industry: string;
    "company size": string;
    headquarters: string;
    type: string;
    specialties: string;
  };
  about_us: string;
  addresses: string[];
  employees: {
    name: string;
    role: string;
  }[];
  affiliated_pages: {
    title: string;
    description: string;
  }[];
  stock_info: {
    symbol: string;
    date: string;
    market: string;
    delay_info: string;
    current_price: string;
    open_price: string;
    low_price: string;
    high_price: string;
  };
  funding_info: {
    total_rounds: string;
    last_round_details: string;
    investors: string[];
  };
}

export const PeopleProfileSheet = (
  data: Lead
  // companyInfo: CompanyInfoDataItem[]
) => {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  console.log(data);

  const { companyInfo } = useCompanyInfo();

  const initials = (name: string) => {
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // console.log(companyInfo);

  const formatText = (text: string) => {
    let spacedText = text.replace(/_+/g, " ");
    return spacedText[0].toUpperCase() + spacedText.slice(1).toLowerCase();
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className={"p-4 h-full"}>
            <div className="flex">
              <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                <AvatarImage src={data.photo_url} alt="avatar" />
                <AvatarFallback>{initials(data.name || "AP")}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                {/* <p>Id: {itemId}</p> */}
                <p className="text-sm font-medium leading-none">{data.name}</p>
                <p className="text-sm text-muted-foreground">{data.email}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              {data.headline}
            </p>
            <br />
            <div className="pt-4 space-y-3">
              <div className="flex space-x-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.title}
                </span>
              </div>
              <div className="flex space-x-2">
                <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.state}, {data.country}
                </span>
              </div>
              <div className="flex space-x-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.employment_history &&
                    data.employment_history[0].organization_name}
                </span>
              </div>
              {data.phone_numbers && (
                <div className="flex space-x-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {data.phone_numbers[0].sanitized_number || "N/A"}
                  </span>
                </div>
              )}
              <div className="flex space-x-2">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.linkedin_url || "N/A"}
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
              {data.employment_history && (
                <>
                  <div className="flex px-2 py-1 font-mono text-xs justify-between">
                    <span>
                      {data.employment_history[0].start_date.substring(0, 4)} -
                      present
                    </span>
                    <span className="w-[200px]">
                      {data.employment_history[0].title}
                    </span>
                  </div>
                  <CollapsibleContent className="space-y-2">
                    {data.employment_history.map((val, ind) => {
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
            {data.organization && (
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
            )}
            <div>
              <p className="text-sm font-medium leading-none">
                {data.employment_history &&
                  data.employment_history[0].organization_name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

// "
// {(
//   {companyInfo.map((item, index) => (
//     <div key={index}>
//       {/* Display company_info data */}
//       <div className="flex space-x-2">
//         {/* <p>About Us:</p> */}
//         {/* <br /> */}
//         {/* <Search width={150} className="h-5 text-muted-foreground" /> */}
//         <span className="text-sm text-muted-foreground">
//           {item.about_us}
//         </span>
//       </div>
//       <br />
//       <br />
//       <div className="flex flex-col gap-2">
//         {Object.entries(item.company_info).map(([key, value]) => (
//           <div
//             className="text-sm font-semibold text-muted-foreground"
//             key={key}
//           >
//             {formatText(key)}:{" "}
//             <span className="text-sm font-normal text-muted-foreground">
//               {value}
//             </span>
//           </div>
//         ))}
//       </div>
//       <br />
//       <br />
//       {/* Display about_us_description */}
//       {/* Display addresses */}
//       <div>
//         <div className="text-sm font-medium text-muted-foreground">
//           Addresses:
//         </div>
//         <div className="flex flex-col gap-2">
//           {item.addresses.map((address, index) => (
//             <div
//               className="text-sm text-muted-foreground"
//               key={index}
//             >
//               {address}
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* Display affiliated_pages */}
//       <br />
//       <br />
//       <div>
//         <div className="text-sm font-medium text-muted-foreground">
//           Affiliated Pages:
//         </div>
//         <div className="flex flex-col gap-2">
//           {item.affiliataed_pages.map((page, index) => (
//             <div
//               className="text-sm text-muted-foreground"
//               key={index}
//             >
//               {index + 1}. {page.title} - {page.description}
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* Display stock_info */}
//       <br />
//       <br />
//       <div>
//         <div className="text-sm font-semibold text-muted-foreground">
//           Stock Info:
//         </div>
//         {Object.entries(item.stock_info).map(([key, value]) => (
//           <div className="text-muted-foreground text-sm" key={key}>
//             {formatText(key)}:{" "}
//             <span className="font-normal">{value}</span>
//           </div>
//         ))}
//       </div>
//       {/* Display funding_info */}
//       <br />
//       <br />
//       <div>
//         <div className="text-sm font-semibold text-muted-foreground">
//           Funding Info:
//         </div>
//         <div>
//           {Object.entries(item.funding_info).map(([key, value]) => (
//             <div
//               className="text-muted-foreground text-sm"
//               key={key}
//             >
//               {formatText(key)}: <span>{value}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   ))}
//   ) }
// "
