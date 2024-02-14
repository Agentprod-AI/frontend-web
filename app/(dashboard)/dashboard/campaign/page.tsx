import { Button } from "@/components/ui/button";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div>
      <h1>Campaign Page</h1>
      <Button> + Create Campaign </Button>

      <Card className="w-[350px] m-2">
        <CardHeader>
          <CardTitle>Test Campaign</CardTitle>
          <CardDescription>
            This is a test campaign to see how it works
          </CardDescription>
        </CardHeader>
        {/* <CardContent>
          
        </CardContent> */}
        <CardFooter className="flex justify-between">
          <Button>Edit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
