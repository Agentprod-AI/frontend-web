"use client";

import * as React from "react";
import { useRouter } from "next/router";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/accountSelect";

interface Account {
  text?: string;
  link?: string;
  label: string;
  email: string;
  disable?: boolean;
  icon: React.ReactNode;
}

interface AccountSwitcherProps {
  isCollapsed?: boolean;
  accounts: Account[];
}

export function AccountSwitcher({
  isCollapsed,
  accounts,
}: AccountSwitcherProps) {
  const [selectedAccount, setSelectedAccount] = React.useState<string>(
    accounts[0].email
  );

  const selectedAccountData = accounts.find(
    (account) => account.email === selectedAccount
  );

  const handleAccountChange = (email: string) => {
    const account = accounts.find((acc) => acc.email === email);

    if (account?.disable && account.link) {
      // If account is disabled and has a link, open the link in a new tab
      window.open(account.link, "_blank");
    } else {
      // Switch account only if it's not disabled
      setSelectedAccount(email);
    }
  };

  return (
    <Select defaultValue={selectedAccount} onValueChange={handleAccountChange}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          {selectedAccountData?.icon}
          <span
            className={cn(
              "ml-2",
              isCollapsed && "hidden",
              selectedAccountData?.disable && "text-gray-400"
            )}
          >
            {selectedAccountData?.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem
            key={account.email}
            value={account.email}
            onClick={() => handleAccountChange(account.email)}
            // disabled={account.disable}
          >
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {account.icon}
              {account.label}
              {account.text && (
                <span className="border-gray-500 border px-2 py-1 text-xs rounded-md">
                  {account.text}
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
