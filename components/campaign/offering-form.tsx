"use client";

// import Link from "next/link";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useCampaignContext } from '@/context/campaign-provider';
import axiosInstance from '@/utils/axiosInstance';

const profileFormSchema = z.object({
  product_offering: z
    .string()
    .min(2, {
      message: "Product offering must be at least 2 characters.",
    })
    .max(30, {
      message: "Product offering must not be longer than 30 characters.",
    }),
  offering_details: z.string().max(160).min(4),
});

type OfferingFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<OfferingFormValues> = {};

export function OfferingForm({type}: {type: string}) {
  const router = useRouter();
  
  const form = useForm<OfferingFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { createOffering, editOffering } = useCampaignContext();
  const watchAllFields = form.watch();

  //   const { fields, append } = useFieldArray({
  //     name: "urls",
  //     control: form.control,
  //   });

  async function onSubmit(data: OfferingFormValues) {
    if (type === "create") {
      createOffering(data);
    } if (type === "edit") {
      const changes = Object.keys(data).reduce((acc, key) => {
        // Ensure the correct key type is used
        const propertyKey = key as keyof OfferingFormValues;

        // Compare the stringified versions of the current and previous values
        if (
          JSON.stringify(data[propertyKey]) !==
          JSON.stringify(watchAllFields[propertyKey])
        ) {
          // Assign only if types are compatible
          acc = { ...acc, [propertyKey]: data[propertyKey] };
        }
        return acc;
      }, {} as OfferingFormValues);

      if (Object.keys(changes).length > 0) {
        editOffering(changes);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="product_offering"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Offering</FormLabel>
              <FormControl>
                <Input placeholder="Product" {...field} />
              </FormControl>
              <FormDescription>This is your product name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="offering_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details of offers and details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the product and features."
                  // className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can write details of your product here
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div> */}
        <Button type="submit">Create Offer</Button>
      </form>
    </Form>
  );
}
