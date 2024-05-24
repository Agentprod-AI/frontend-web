"use client";

import { allFieldsListType } from "@/components/campaign/training/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useFieldsList } from "@/context/training-fields-provider";
import { FieldType } from "@/components/campaign/training/types";

const FormSchema = z.object({
  fieldName: z.string(),
  description: z.string(),
});

export default function FieldFormModal({
  children,
  type,
  fieldId,
  modalType,
}: {
  children: React.ReactNode;
  type: keyof allFieldsListType;
  fieldId?: string;
  modalType: "edit" | "add";
}) {
  const [open, setOpen] = useState(false);
  const params = useParams<{ campaign_id: string }>();
  const { fieldsList, addField, editField } = useFieldsList();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fieldName: "",
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (modalType === "add") {
        const newField = {
          id: uuid(),
          fieldName: data.fieldName,
          description: data.description,
        };
        addField(newField, type);
      } else if (modalType === "edit" && fieldId) {
        const updatedField = {
          id: fieldId,
          fieldName: data.fieldName,
          description: data.description,
        };
        editField(updatedField, fieldId);
      }
      setOpen(false);
    } catch (error) {
      console.error("Error creating/updating field:", error);
    }
  }

  useEffect(() => {
    if (open) {
      if (modalType === "edit" && fieldId) {
        const field = (fieldsList[type] as FieldType[]).find(
          (field) => field.id === fieldId
        );
        if (field) {
          form.setValue("fieldName", field.fieldName);
          form.setValue("description", field.description);
        }
      } else {
        form.reset({
          fieldName: "",
          description: "",
        });
      }
    }
  }, [open, fieldId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {modalType + " " + type}
          </DialogTitle>
          <DialogDescription>
            Make changes to your fields here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fieldName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Name:</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. pricing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description:</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="tell something about the field..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {modalType === "add" ? "Create" : "Update"} Field
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
