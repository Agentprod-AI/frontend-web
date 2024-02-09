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
    title: "New York, New York, United States",
    value: "32",
  },
  {
    title: "San Francisco, California, United States",
    value: "28",
  },
  {
    title: "Los Angeles, California, United States",
    value: "25",
  },
  {
    title: "Bengaluru, Karnataka, India",
    value: "9",
  },
];

export function LocationCardDashboard() {
  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>Top Locations</CardTitle>
        <CardDescription>Sales metrics of this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {salesMetricsData.map((val, ind) => (
            <div className="flex items-center" key={ind}>
              <div className="ml-4 font-medium">{val.title}</div>
              <div className="ml-auto space-y-1">
                <p className="text-md font-medium leading-none">{val.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
