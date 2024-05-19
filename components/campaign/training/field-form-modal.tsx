import { allFieldsListType } from "@/app/(dashboard)/dashboard/campaign/[campaignId]/training/types";
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
import { useState, useEffect, ReactNode } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createTraining, updateTraining } from "./training.api";

const FormSchema = z.object({
  fieldName: z.string(),
  description: z.string(),
  length: z.string().optional(),
});

export class TrainingRequest {
  campaign_id: string | undefined;
  template: string | undefined;
  follow_up_template?: string;
  variables?: Record<string, any>;
  offering_variables?: Record<string, any> | undefined;
  personalized_fields: Record<string, any> | undefined;
  enriched_fields?: string[];
}

export class TrainingResponse extends TrainingRequest {
  id?: string;
  length: any;
  val: ReactNode;
  type: string | undefined;
  description: string | undefined;
}
export function FieldFormModal({
  children,
  type,
  setFieldsList,
  fieldsList,
  fieldId,
  modalType,
}: {
  children: React.ReactNode;
  type: string;
  fieldsList: allFieldsListType | any;
  setFieldsList: (val: allFieldsListType) => void; // fetch api
  fieldId?: any;
  modalType: "edit" | "add";
}) {
  const [open, setOpen] = useState(false);
  const [currentTraining, setCurrentTraining] =
    useState<TrainingResponse | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fieldName: "",
      description: "",
      ...(type === "variable" && { length: "short" }),
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      let updatedFieldsList: allFieldsListType;

      if (modalType === "add") {
        const trainingInfo: TrainingRequest = {
          campaign_id: "482b7b80-4681-422b-9d40-f7253f4a8305",
          template: data.fieldName,
          follow_up_template: data.description,
          offering_variables: {},
          personalized_fields: {},
          enriched_fields: [],
          ...(type === "variable" && { length: data.length }),
        };

        const createdTraining: TrainingResponse =
          await createTraining(trainingInfo);
        updatedFieldsList = {
          ...fieldsList,
          [type]: [
            ...fieldsList[type],
            {
              id: createdTraining.id,
              val: createdTraining.template,
              description: createdTraining.follow_up_template, // Add the description property
              ...(type === "variable" && { length: createdTraining.length }), // Add the length property
            },
          ],
        };
      } else {
        if (currentTraining) {
          const updatedTraining: TrainingRequest = {
            campaign_id: "482b7b80-4681-422b-9d40-f7253f4a8305",
            template: data.fieldName,
            follow_up_template: data.description,
            offering_variables: {},
            personalized_fields: {},
            enriched_fields: [],
            ...(type === "variable" && { length: data.length }),
          };

          const updatedResponse: TrainingResponse = await updateTraining(
            currentTraining.id!,
            updatedTraining
          );
          updatedFieldsList = {
            ...fieldsList,
            [type]: fieldsList[type].map((val: any) => {
              if (val.id === updatedResponse.id) {
                return {
                  id: updatedResponse.id,
                  val: updatedResponse.template,
                  description: updatedResponse.follow_up_template, // Add the description property
                  ...(type === "variable" && {
                    length: updatedResponse.length,
                  }), // Add the length property
                };
              }
              return val;
            }),
          };
        } else {
          updatedFieldsList = fieldsList;
        }
      }

      setFieldsList(updatedFieldsList);
      setOpen(false);
    } catch (error) {
      console.error("Error creating/updating training:", error);
    }
  }
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
            {type === "variable" && (
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Length of the field</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {/* Radio group option */}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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

export type { allFieldsListType };
