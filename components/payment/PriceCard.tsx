"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const pricingData = [
  {
    title: "Launch",
    price: "$190/month",
    description: "1000 Leads contacted per month\nApprox. 3000 emails",
    features: [
      "All Core Sally-AgentProd features",
      "CRM Integrations",
      "Email Warmup",
    ],
    buttonText: "$190",
    additionalInfo: "$40 per additional 100 leads",
  },
  {
    title: "Amplify",
    price: "$380/month",
    description: "2000 Leads contacted per month\nApprox. 6000 emails",
    features: [
      "All Core Sally-AgentProd features",
      "CRM Integrations",
      "Email Warmup",
      "1-1 White Glove Human Onboarding",
      "Premium Support",
    ],
    heightlight: true,
    buttonText: "$380",
    additionalInfo: "$40 per additional 100 leads",
  },
  {
    title: "Maximize",
    price: "$770/month",
    description: "3000 Leads contacted per month\nApprox. 9000 emails",
    features: [
      "All Core Sally-AgentProd features",
      "CRM Integrations",
      "Email Warmup",
      "1-1 White Glove Human Onboarding",
      "Premium Support",
      "Account Manager",
    ],
    buttonText: "$770",
    additionalInfo: "$40 per additional 100 leads",
  },
  {
    title: "Custom",
    price: "Custom",
    description: "For B2B Sales Teams with 5+ Seats\nUnlimited emails",
    features: [
      "Custom Email Playbook",
      "Training on your Data",
      "Custom Feature Development",
      "Domain + Email Setup",
      "Dedicated Account Manager",
      "Direct Slack Connection",
    ],
    buttonText: "Talk To Sales",
    additionalInfo: "",
  },
];

function PriceCard() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <DialogHeader>
        <DialogTitle className="text-3xl">Pricing Plans</DialogTitle>
        <DialogDescription>
          Select a plan that suits your needs.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingData.map((card, index) => (
          <div
            key={index}
            className={` rounded-3xl p-6 shadow-lg flex flex-col justify-between  ${
              card.heightlight
                ? "border-[#732e53] border-2 bg-gradient-to-b from-[#732e53]/30 via-white/15 via-20% to-black"
                : "border-white/30 border bg-gradient-to-b from-black via-white/15 via-20% to-black"
            } bg-black text-white `}
          >
            <div className="flex flex-col">
              <h3 className="text-2xl font-semibold mb-4">{card.title}</h3>
              <p className="mb-4 whitespace-pre-line">{card.description}</p>
              <p className="text-3xl my-12 font-mono fonrt-thin text-center">
                {card.price}
              </p>
              <ul className="mb-4 space-y-2">
                {card.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-14">
              <Button className="bg-transparent border-2  border-white text-white hover:bg-white hover:text-black transition duration-500 py-5 px-4 rounded-full w-full">
                {card.buttonText}
              </Button>

              {card.additionalInfo ? (
                <p className="mt-4 text-sm text-gray-400">
                  {card.additionalInfo}
                </p>
              ) : (
                <div className="mt-9"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PriceCard;
