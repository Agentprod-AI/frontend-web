"use client";
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const campaignPages = [
  {
    title: "Scheduling and budget",
    description: "How do you want to schedule this campaign?",
    href: "scheduling-budget",
  },
  {
    title: "Offering",
    description: "What are your products and services?",
    href: "offering",
  },
  {
    title: "Goal",
    description: "What do you want to achieve with this campaign?",
    href: "goal",
  },
  {
    title: "Audience",
    description: "Who do you want to reach?",
    href: "audience",
  },
  {
    title: "Training",
    description: "What messages do you want to send?",
    href: "training",
  },
  {
    title: "Autopilot",
    description: "How do you want to automate this campaign?",
    href: "autopilot",
  },
];

export default function Page() {
  const [isSchedulingBudgetCompleted, setIsSchedulingBudgetCompleted] = useState<boolean>(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  useEffect(() => {
    const formsTracker: {[key: string]: boolean} = JSON.parse(localStorage.getItem('formsTracker') || 'null') || {
      schedulingBudget: false,
      offering: false,
      goal: false,
      audience: false,
      training: false,
      autopilot: false,
    };

    const storedCampaignId: string | null = localStorage.getItem('campaignId');

    localStorage.setItem('formsTracker', JSON.stringify(formsTracker));

    setIsSchedulingBudgetCompleted(formsTracker.schedulingBudget);
    setCampaignId(storedCampaignId);

    const handleStorageChange = (): void => {
      const updatedFormsTracker: {[key: string]: boolean} = JSON.parse(localStorage.getItem('formsTracker') || 'null');
      const updatedCampaignId: string | null = localStorage.getItem('campaignId');

      setIsSchedulingBudgetCompleted(updatedFormsTracker?.schedulingBudget || false);
      setCampaignId(updatedCampaignId);
    };

    window.addEventListener('storage', handleStorageChange);

    return (): void => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const areCardsEnabled: boolean = isSchedulingBudgetCompleted && campaignId !== null;

  return (
      <div>
        {campaignPages.map((val, ind) => (
          <Card
            className={`w-[95%] min-w-[330px] m-2 flex justify-between ${!areCardsEnabled && val.href !== 'scheduling-budget' ? 'opacity-40 bg-accent cursor-not-allowed' : ''}`}
            key={ind}
          >
            <CardHeader>
              <CardTitle>{val.title}</CardTitle>
              <CardDescription>{val.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex py-0 justify-between">
              <Button asChild variant={"outline"} disabled={!areCardsEnabled && val.href !== 'scheduling-budget'}>
                <Link href={`/dashboard/campaign/create/${val.href}`} className={!areCardsEnabled && val.href !== 'scheduling-budget' ? 'pointer-events-none' : ''} passHref>
                  Add
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
  );
}