"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useFieldsList } from "@/context/training-fields-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Check } from "lucide-react";

const items = [
  {
    id: "emoji",
    label: "Include emojis",
  },
  {
    id: "name",
    label: "Include lead's name",
  },
  {
    id: "company",
    label: "Include lead's company name",
  },
  {
    id: "lowercase",
    label: "Use all lowercase letters",
  },
  {
    id: "plain",
    label: "Use plain language",
  },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()),
});

export default function SubjectForm() {
  const { setSubjectOptions } = useFieldsList(); // Get setSubjectOptions from the context

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  // Load form state from local storage on component mount
  useEffect(() => {
    const storedItems = localStorage.getItem("subjectFormItems");
    if (storedItems) {
      form.reset({ items: JSON.parse(storedItems) });
    }
  }, [form]);

  // Save form state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "subjectFormItems",
      JSON.stringify(form.watch("items"))
    );
  }, [form.watch("items")]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const selectedLabels = data.items.map((itemId) => {
      const item = items.find((i) => i.id === itemId);
      return item ? item.label : "";
    });

    setSubjectOptions(selectedLabels.filter(Boolean)); // Update context with selected labels
    console.log("data submitted" + selectedLabels);
    toast.success("Setting updated successfully");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit"><Check/></Button>
      </form>
    </Form>
  );
}
