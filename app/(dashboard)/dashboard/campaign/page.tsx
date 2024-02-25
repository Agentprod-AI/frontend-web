import { Button } from "@/components/ui/button";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-2">
      {/* <h1>Campaign Page</h1> */}
      <Button> + Create Campaign </Button>

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Test Campaign</CardTitle>
          <CardDescription>
            This is a test campaign to see how it works
          </CardDescription>
        </CardHeader>
        {/* <CardContent>
          
        </CardContent> */}
        <CardFooter className="flex justify-between">
          <Button asChild variant={"outline"}>
            <Link href={"/dashboard/campaign/123"}>Edit</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
