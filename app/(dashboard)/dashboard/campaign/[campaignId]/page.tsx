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
];

export default function Page({ params }: { params: { campaignId: string } }) {
  return (
    <div>
      {/* Campaign: {params.campaignId} */}
      {campaignPages.map((val, ind) => (
        <Card
          className="w-[95%] min-w-[330px] m-2 flex justify-between"
          key={ind}
        >
          <CardHeader>
            <CardTitle>{val.title}</CardTitle>
            <CardDescription>{val.description}</CardDescription>
          </CardHeader>
          {/* <CardContent>
          
        </CardContent> */}
          <CardFooter className="flex py-0 justify-between">
            <Button asChild variant={"outline"}>
              <Link href={`${params.campaignId}/${val.href}`}>Edit</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
