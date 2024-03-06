import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
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
import { Organization } from "@/context/lead-user";
import { ScrollArea } from "./ui/scroll-area";

export const CompanyProfileSheet = (data: Organization) => {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className={"p-4 h-full"}>
            <div className="flex">
              <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                <AvatarImage src={data.logo_url} alt="Company Logo" />
                <AvatarFallback>
                  {data.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{data.name}</p>
                <p className="text-sm text-muted-foreground">
                  {data.primary_domain}
                </p>
              </div>
            </div>
            <br />
            <div className="pt-4 space-y-3">
              <div className="flex space-x-2">
                <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.organization_country}, {data.organization_city}
                </span>
              </div>
              <div className="flex space-x-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.sanitized_phone}
                </span>
              </div>
              <div className="flex space-x-2">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.linkedin_url}
                </span>
              </div>
              {data.website_url && (
                <div className="flex space-x-2">
                  <Link className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {data.website_url}
                  </span>
                </div>
              )}
              {data.domain && (
                <div className="flex space-x-2">
                  <Link className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {data.domain}
                  </span>
                </div>
              )}
              <div className="flex space-x-2">
                <Twitter className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.twitter_url}
                </span>
              </div>
              <div className="flex space-x-2">
                <Facebook className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {data.facebook_url}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
