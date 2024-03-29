import React, { ComponentProps } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMail } from "@/hooks/useMail";

// Adjusting the Mail interface to match the API response
interface Mail {
  id: string;
  user_id: string; // Consider if you need to use it in your component
  sender: string;
  recipient: string; // Consider if you need to use it in your component
  subject: string;
  body_substr: string;
  // Assuming date, read, labels might be part of your data; include them if they are
  date?: string; // Optional if your data doesn't always include it
  read?: boolean;
  labels?: string[]; // Optional, include if your mails have labels
}

// Props definition if you're passing the mails down from a parent component
interface MailListProps {
  items: Mail[]; // Accepts mails array as props
}

function isValidDate(dateString: string) {
  return Boolean(dateString) && !isNaN(Date.parse(dateString));
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail(); // Assuming useMail is a custom hook for state management

  return (
    <ScrollArea className="h-screen pb-40">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted"
            )}
            onClick={() => setMail({ ...mail, selected: item.id })}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.sender}</div>
                  {item.read === false && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs flex gap-2 items-center",
                    mail.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {/* If labels are part of your data */}
                  {item.labels && item.labels.length > 0 && (
                    <div className="flex items-center gap-2">
                      {item.labels.map((label, index) => (
                        <Badge key={index} variant="default">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {/* Displaying the date if available */}
                  {item.date && isValidDate(item.date)
                    ? formatDistanceToNow(new Date(item.date), { addSuffix: true })
                    : "No date available"}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
              {/* Using body_substr for the email body preview */}
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.body_substr.substring(0, 100)} {/* Adjust substring as needed */}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
