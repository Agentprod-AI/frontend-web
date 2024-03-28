import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { HubSpotIcon, LinkedInIcon, SalesForceIcon, SlackIcon, ZapierIcon } from '@/app/icons';

type Service = {
  name: string;
  description: string;
  logo: string;
  isConnected: boolean;
  // onConnect: () => void; 
};

const services = [
  { name: 'Slack', description: 'Used to interact with the Artisan and receive notifications.', logo: <SlackIcon/>, isConnected: false },
  { name: 'HubSpot', description: 'Used to interact with the Artisan and receive notifications.', logo: <HubSpotIcon/>, isConnected: true },
  { name: 'LinkedIn', description: 'Used to interact with the Artisan and receive notifications.', logo: <LinkedInIcon/>, isConnected: false },
  { name: 'Salesforce', description: 'Used to interact with the Artisan and receive notifications.', logo: <SalesForceIcon/>, isConnected: false },
  { name: 'Zapier', description: 'Used to interact with the Artisan and receive notifications.', logo: <ZapierIcon/>, isConnected: false },
  // Add more services as needed
];

export default function Page () {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map(service => (
        <Card key={service.name}>
        <CardHeader className="flex flex-col justify-between">
          <div className="flex justify-between items-center">
            {service.logo}
            <div className="text-sm border rounded-lg text-center p-2">Coming Soon</div>
          </div>

          {/* {service.isConnected ? (
            <Button variant={"outline"} className="text-sm"> 
              Disconnect
            </Button>
          ) : (
            <Button variant={"outline"} className="text-sm"> 
              Connect
            </Button>
          )} */}
    
        </CardHeader>
        <CardContent className="space-y-2 mt-2">
          <CardTitle>{service.name}</CardTitle>
          <CardDescription>{service.description}</CardDescription>
        </CardContent>
      </Card>
      ))}
    </div>
  );
};