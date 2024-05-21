import { OfferingForm } from "@/components/campaign/offering-form";
// import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="flex flex-col gap-10 mb-20">
      <OfferingForm type="create" />
      {/* <Separator /> */}
    </div>
  );
}
