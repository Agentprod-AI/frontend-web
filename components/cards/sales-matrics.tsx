import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const salesMetricsData = [
  {
    title: "Open Rate",
    value: "55%",
    difference: "+4%",
  },
  {
    title: "Reply Rate",
    value: "55%",
    difference: "+4%",
  },
  {
    title: "Click-Through Rate",
    value: "55%",
    difference: "+4%",
  },
  {
    title: "Click-To-Open Rate",
    value: "55%",
    difference: "+4%",
  },
  {
    title: "Bounce Rate",
    value: "55%",
    difference: "+4%",
  },
  {
    title: "Message Sent",
    value: "55%",
    difference: "+4%",
  },
];

export function SalesMetrics() {
  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>Sales Metrics</CardTitle>
        <CardDescription>Sales metrics of this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {salesMetricsData.map((val, ind) => (
            <div className="flex items-center" key={ind}>
              <div className="ml-4 font-medium">{val.title}</div>
              <div className="ml-auto space-y-1">
                <p className="text-md font-medium leading-none">{val.value}</p>
                <p className="text-xs text-muted-foreground">
                  {val.difference}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
