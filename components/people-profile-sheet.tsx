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
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { Lead } from "@/context/lead-user";
import { ScrollArea } from "./ui/scroll-area";

export const PeopleProfileSheet = (data: Lead) => {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);

  const initials = (name: string) => {
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  console.log(data);

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
                  {data.organization.name}
                </span>
              </div>
              {data.phone_numbers[0].sanitized_number && (
                <div className="flex space-x-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {data.phone_numbers[0].sanitized_number}
                  </span>
                </div>
              )}
              <div className="flex space-x-2">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.linkedin_url}
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
                        {val.end_date.substring(0, 4)}
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
            </Collapsible>
            <br />
            <br />
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
                  {data.organization.primary_domain}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              {/* {data?.organization.} */}
            </p>
            <div className="pt-4 space-y-3">
              <div className="flex space-x-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.organization.sanitized_phone}
                </span>
              </div>
              <div className="flex space-x-2">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.organization.linkedin_url}
                </span>
              </div>
              <div className="flex space-x-2">
                <Link className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.organization.website_url}
                </span>
              </div>
              <div className="flex space-x-2">
                <Twitter className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.organization.twitter_url}
                </span>
              </div>
              <div className="flex space-x-2">
                <Facebook className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.organization.facebook_url}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
