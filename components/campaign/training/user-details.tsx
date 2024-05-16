"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React, { useState, useEffect } from "react";
// import { Skeleton } from "@/components/ui/skeleton";

interface WorkHistory {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
}

interface CompanyDetails {
  name: string;
  number: string;
  facebook: string;
}

interface UserDetailsProps {
  avatar: string;
  name: string;
  email: string;
  occupation: string;
  linkedin: string;
  timestamp: string;
  location: string;
  workHistory: WorkHistory[];
  companyDetails: CompanyDetails;
}

const userDetails: UserDetailsProps[] = [
  {
    avatar: "JM",
    name: "Jason Radisson",
    email: "jason@shifttone.net",
    occupation: "Chief Executive Officer @ Movo - HCM for the frontline",
    linkedin: "linkedin/json",
    timestamp: "Pacific Time",
    location: "SF, California, US",
    workHistory: [
      {
        position: "Chief Executive Officer",
        company: "Movo",
        startDate: "2019",
        endDate: "Present",
      },
      {
        position: "Investor",
        company: "Rappi",
        startDate: "2016",
        endDate: "2018",
      },
    ],
    companyDetails: {
      name: "Movo",
      number: "+14158001303",
      facebook: "@profile.php",
    },
  },
];

const UserDetails = () => {
  const [loading, setLoading] = useState(true);
  //   const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simulate a fetch call
    setTimeout(() => {
      //   setUsers(userDetails);
      setLoading(false);
    }, 2000); // simulate loading delay
  }, []);

  if (loading) {
    return (
      <div>
        {Array.from({ length: 1 }).map((_, index) => (
          <div key={index} className="space-y-4 p-4">
            {/* <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-64" /> */}
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="space-y-2 pt-2">
                {/* <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-64" /> */}
              </div>
            ))}
            <div className="pt-4">
              {/* <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-64" /> */}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {userDetails.map((detail, index) => (
        <div key={index} className="p-2 flex flex-col gap-4">
          <div className="flex flex-row items-center gap-3">
            <Avatar className="flex h-12 w-12 items-center justify-center space-y-0 border bg-white mr-2">
              <AvatarFallback>{detail.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-bold">{detail.name}</h1>
              <p className="text-sm text-gray-400">{detail.email}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">{detail.occupation}</p>
          <div className="flex flex-col gap-2 ">
            <p>{detail.linkedin}</p>
            <p>{detail.timestamp}</p>
            <p>{detail.location}</p>
          </div>
          <div>
            {detail.workHistory.map((work, idx) => (
              <div key={idx}>
                <h2 className="text-lg font-semibold">
                  {work.position} at {work.company}
                </h2>
                <p>
                  {work.startDate} - {work.endDate}
                </p>
              </div>
            ))}
          </div>
          <div>
            <p>{detail.companyDetails.name}</p>
            <p>{detail.companyDetails.number}</p>
            <p>{detail.companyDetails.facebook}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserDetails;
