"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useButtonStatus } from "@/context/button-status";
import { Check } from "lucide-react";

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
];

export default function Page() {
  const { completedPages, togglePageCompletion } = useButtonStatus();
  const params = useParams();
  const [isSchedulingBudgetCompleted, setIsSchedulingBudgetCompleted] =
    useState<boolean>(false);

  useEffect(() => {
    const defaultFormsTracker = {
      schedulingBudget: false,
      offering: false,
      goal: false,
      audience: false,
      training: false,
      autopilot: false,
    };

    // Initialize forms tracker if not present
    if (!localStorage.getItem("formsTracker")) {
      localStorage.setItem("formsTracker", JSON.stringify(defaultFormsTracker));
    }

    const handleStorageChange = (): void => {
      const updatedFormsTracker = JSON.parse(
        localStorage.getItem("formsTracker") || "{}"
      );
      setIsSchedulingBudgetCompleted(
        updatedFormsTracker.schedulingBudget || false
      );
    };

    // Check forms tracker on component mount
    handleStorageChange();

    window.addEventListener("storage", handleStorageChange);
    return (): void => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [params.campaignId]);

  const areCardsEnabled = isSchedulingBudgetCompleted;

  return (
    <div>
      {campaignPages.map((val, ind) => (
        <Card
          className={`w-[95%] min-w-[330px] m-2 flex justify-between ${
            !areCardsEnabled && val.href !== "scheduling-budget"
              ? "opacity-40 bg-accent cursor-not-allowed"
              : ""
          }`}
          key={ind}
        >
          <CardHeader>
            <CardTitle>{val.title}</CardTitle>
            <CardDescription>{val.description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex py-0 justify-between">
            <Button
              asChild
              variant={"outline"}
              disabled={!areCardsEnabled && val.href !== "scheduling-budget"}
              onClick={() => togglePageCompletion(val.href)}
            >
              <Link
                href={`/dashboard/campaign/create/${params.campaignId}/${val.href}`}
                className={
                  !areCardsEnabled && val.href !== "scheduling-budget"
                    ? "pointer-events-none"
                    : ""
                }
                passHref
              >
                <span>{completedPages[val.href] ? <Check /> : "Add"}</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
