"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
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
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast"; 


const dummyEmails = [
    "john.doe@example.com",
    "jane.smith@placeholder.com",
    "alex.jones@dummyemail.com",
    "samantha.brown@fakemail.com",
    "michael.wilson@test.com",
    "chris.johnson@norealmail.com",
    "kimberly.martinez@tempmail.com",
    "david.anderson@fakebox.com",
    "emily.thompson@nowhere.com",
    "jason.roberts@nomail.com",
]

const dummyLinks = [
    "https://calendly.com/dummyuser1/consultation",
    "https://calendly.com/dummyuser2/30min",
    "https://calendly.com/dummyuser3/introduction-call",
    "https://calendly.com/dummyuser4/team-meeting",
    "https://calendly.com/dummyuser5/product-demo",
    "https://calendly.com/dummyuser6/strategy-session",
    "https://calendly.com/dummyuser7/quick-chat",
    "https://calendly.com/dummyuser8/client-onboarding",
    "https://calendly.com/dummyuser9/networking",
    "https://calendly.com/dummyuser10/feedback-session"
]

// Update the Zod schema to reflect that followUps is just an array of numbers
const goalFormSchema = z.object({
  goal: z.string(),
  schedulingLink: z.string().url(), 
  email: z.string().email(),
  calendlyLink: z.string().url(),
  followUps: z.array(z.union([z.number(), z.undefined()])), 
  markAsLost: z.number(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

const defaultValues: GoalFormValues = {
  goal: '',
  schedulingLink: '',
  email: '',
  calendlyLink: '',
  followUps: [undefined, undefined], 
  markAsLost: 0,
};

export function GoalForm() {
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'followUps',
  });

  const onAppend = () => {
    if (fields.length < 5) {
      append(undefined);
    }
  };

  const onRemove = (index: number) => {
    if (fields.length > 2) { // Ensure minimum two inputs
      remove(index);
    }
  };

  const onSubmit: SubmitHandler<GoalFormValues> = (data) =>  {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mb-5">
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div>
                <FormLabel>Goal</FormLabel>
                <FormDescription>How success is measured for this campaign</FormDescription>
              </div>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Meeting scheduled" />
                    </FormControl>
                    <FormLabel className="font-normal">Meeting scheduled</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Link clicked" />
                    </FormControl>
                    <FormLabel className="font-normal">Link clicked</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Reply received" />
                    </FormControl>
                    <FormLabel className="font-normal">Reply received</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Custom goal" />
                    </FormControl>
                    <FormLabel className="font-normal">Custom goal</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schedulingLink"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="space-y-3">
              <div>
                <FormLabel>Scheduling Link</FormLabel>
                <FormDescription>Where prospects can schedule a meeting with you</FormDescription>
              </div>
              <FormControl>
                <Input
                  type="number"
                  placeholder="https://calendly.com/example"
                  {...field}
                />
              </FormControl>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
        control={form.control}
        name="senderEmail"
        render={({ field, fieldState: { error } }) => (
          <FormItem className="space-y-3">
              <div>
                  <FormLabel>Sender Email</FormLabel>
                  <FormDescription>Where prospects can schedule a meeting with you</FormDescription>
              </div>
              <div className="flex gap-4">
                  <FormControl>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="flex items-center justify-center space-x-3">
                                  <span>Select Email</span>
                                  <ChevronDown size={20} />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-max">
                              <ScrollArea className="h-60">
                                  <DropdownMenuGroup>
                                      {dummyEmails &&
                                          dummyEmails?.map((email, index) => (
                                          <div key={index}>
                                              <DropdownMenuItem key={index}>
                                                      <div className="flex items-center space-x-2" onClick={(event) => event.stopPropagation()}>
                                                          <Checkbox />
                                                          <label
                                                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                          >
                                                          {email}
                                                          </label>
                                                      </div>
                                              </DropdownMenuItem>

                                              {index !== dummyEmails.length - 1 && (
                                              <DropdownMenuSeparator />
                                              )}
                                          </div>
                                      ))}
                                  </DropdownMenuGroup>
                              </ScrollArea>
                          </DropdownMenuContent>
                      </DropdownMenu>
                  </FormControl>

                  <FormControl>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="flex items-center justify-center space-x-3">
                                  <span>Select Calendly Link</span>
                                  <ChevronDown size={20} />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-max">
                              <ScrollArea className="h-60">
                                  <DropdownMenuGroup >
                                      {dummyLinks &&
                                          dummyLinks?.map((link, index) => (
                                          <div key={index}>
                                              <DropdownMenuItem key={index}>
                                                      <div className="flex items-center space-x-2" onClick={(event) => event.stopPropagation()}>
                                                          <Checkbox />
                                                          <label
                                                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                          >
                                                          {link}
                                                          </label>
                                                      </div>
                                              </DropdownMenuItem>

                                              {index !== dummyEmails.length - 1 && (
                                              <DropdownMenuSeparator />
                                              )}
                                          </div>
                                      ))}
                                  </DropdownMenuGroup>
                              </ScrollArea>
                          </DropdownMenuContent>
                      </DropdownMenu>
                  </FormControl>
              </div>
            <FormMessage>{error?.message}</FormMessage>
          </FormItem>
        )}
        />

        <div className="flex flex-col gap-4">
          <FormLabel>Follow Up</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                {...form.register(`followUps.${index}`)}
                type="number"
                placeholder="Follow Up" 
              />
              {fields.length > 2 && (
                <Button type="button" variant={"outline"} className="w-max" onClick={() => onRemove(index)}><Minus size={14}/></Button>
              )}
            </div>
          ))}
          {fields.length < 5 && (
            <Button type="button" variant={"outline"} className="w-max" onClick={onAppend}><Plus size={14}/></Button>
          )}
        </div>

        <FormField
          control={form.control}
          name="markAsLost"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="space-y-3">
                <FormLabel>Mark as lost</FormLabel>
                <FormControl>
                    <Input
                    type="number"
                    placeholder="eg. 10 days"
                    {...field}
                    />
                </FormControl>
                <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
          />

        <Button type="submit">Add Goal</Button>
      </form>
    </Form>
  );
}
