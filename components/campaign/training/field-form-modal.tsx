import { allFieldsListType } from "@/app/(dashboard)/dashboard/campaign/[campaignId]/training/page";
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
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FormSchema = z.object({
  fieldName: z.string(),
  description: z.string(),
  length: z.string().optional(),
});

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
  fieldsList: allFieldsListType;
  setFieldsList: (val: allFieldsListType) => void;
  fieldId?: any;
  modalType: "edit" | "add";
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fieldName:
        modalType === "edit"
          ? fieldsList[type].find((val) => val.id === fieldId)?.val
          : "",
      description:
        modalType === "edit"
          ? fieldsList[type].find((val) => val.id === fieldId)?.description
          : "",
      ...(type === "variable" && {
        length:
          modalType === "edit"
            ? fieldsList[type].find((val) => val.id === fieldId)?.length
            : "short",
      }),
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (modalType === "add") {
      setFieldsList({
        ...fieldsList,
        [type]: [
          ...fieldsList[type],
          {
            id: fieldsList[type].length + 1,
            val: data.fieldName,
            description: data.description,
            ...(type === "variable" && { length: data.length }),
          },
        ],
      });
    } else {
      const newfieldsList = { ...fieldsList };
      newfieldsList[type] = newfieldsList[type].map((val) => {
        if (val.id === fieldId) {
          return {
            id: fieldId,
            val: data.fieldName,
            description: data.description,
            // add length only if type is variable
            ...(type === "variable" && { length: data.length }),
          };
        }
        return val;
      });
      setFieldsList(newfieldsList);
    }
    setOpen(false);
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
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="short" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Short
                            <span className="text-muted-foreground">
                              {" "}
                              &#40;1-5 words&#41;
                            </span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Medium
                            <span className="text-muted-foreground">
                              {" "}
                              &#40;5-10 words&#41;
                            </span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="long" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Long
                            <span className="text-muted-foreground">
                              {" "}
                              &#40;A few sentences&#41;
                            </span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="automatic" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Automatic
                            <span className="text-muted-foreground">
                              {" "}
                              &#40;AI determined length&#41;
                            </span>
                          </FormLabel>
                        </FormItem>
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
