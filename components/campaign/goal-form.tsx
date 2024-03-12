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
  emails: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one email.",
  }),
  calendlyLinks: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one Calendly link.",
  }),
  followUps: z.array(z.object({
    value: z.union([z.number(), z.undefined()]),
  })),
  markAsLost: z.number(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

const defaultValues: Partial<GoalFormValues> = {
  // followUps: [{ value: undefined }, { value: undefined }]
};

export function GoalForm() {
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { control, handleSubmit } = form;
  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
    control,
    name: 'emails',
  });

  // Field array for calendlyLinks
  const { fields: calendlyFields, append: appendCalendlyLink, remove: removeCalendlyLink } = useFieldArray({
    control,
    name: 'calendlyLinks',
  });

  // Field array for followUps
  const { fields: followUpFields, append: appendFollowUp, remove: removeFollowUp } = useFieldArray({
    control,
    name: 'followUps',
  });

  const onAppend = () => {
    if (followUpFields.length < 5) {
      appendFollowUp({ value: undefined });
    }
  };

  const onRemove = (index: number) => {
    if (followUpFields.length > 2) { // Ensure minimum two inputs
      removeFollowUp(index);
    }
  };

  const onSubmit: SubmitHandler<GoalFormValues> = (data) =>  {
    console.log(data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div>
                <FormLabel>Scheduling Link</FormLabel>
                <FormDescription>Where prospects can schedule a meeting with you</FormDescription>
              </div>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://calendly.com/example"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <div>
            <FormLabel>Sender Email</FormLabel>
            <FormDescription>Where prospects can schedule a meeting with you</FormDescription>

            <div className="flex gap-4 mt-3">
              <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem className="space-y-3">
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
                                    <Checkbox
                                      checked={emailFields.some((field) => field.email === email)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          appendEmail({ email });
                                        } else {
                                          const index = emailFields.findIndex((field) => field.email === email);
                                          removeEmail(index);
                                        }
                                      }}
                                    />
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                          {email}
                                        </label>
                                    </div>
                                  </DropdownMenuItem>
                                  {index !== dummyEmails.length - 1 && (
                                    <DropdownMenuSeparator />)}
                                </div>
                            ))}
                          </DropdownMenuGroup>
                        </ScrollArea>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                <FormMessage/>
              </FormItem>
              )}
              />  

              <FormField
              control={form.control}
              name="calendlyLinks"
              render={({ field }) => (
                <FormItem className="space-y-3">
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
                        <DropdownMenuGroup>
                          {dummyLinks && dummyLinks.map((link, index) => (
                            <div key={index}>
                              <DropdownMenuItem key={index}>
                                <div className="flex items-center space-x-2" onClick={(event) => event.stopPropagation()}>
                                <Checkbox
                                  checked={calendlyFields.some((field) => field.calendlyLink === link)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      appendCalendlyLink({ calendlyLink: link });
                                    } else {
                                      const index = calendlyFields.findIndex((field) => field.calendlyLink === link);
                                      removeCalendlyLink(index);
                                    }
                                  }}
                                />
                                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                <FormMessage/>
              </FormItem>
              )}
              />  
            </div>  
        </div> 

        <FormField
          control={form.control}
          name="followUps"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>Follow Up</FormLabel>
              {followUpFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Follow Up"
                      {...form.register(`followUps.${index}.value`, {
                        setValueAs: (value) => value === "" ? undefined : Number(value),
                      })}
                      {...field}
                    />
                  </FormControl>
                  {followUpFields.length > 2 && (
                    <Button type="button" variant="outline" className="w-max" onClick={() => onRemove(index)}>
                      <Minus size={14}/>
                    </Button>
                  )}
                </div>
              ))}
              {followUpFields.length < 5 && (
                <Button type="button" variant="outline" className="w-max" onClick={onAppend}>
                  <Plus size={14}/>
                </Button>
              )}
              <FormMessage/>
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="markAsLost"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Mark as lost</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="eg. 10 days"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numberValue = value === "" ? undefined : Number(value);
                    field.onChange(numberValue);
                  }}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <Button type="submit">Add Goal</Button>
      </form>
    </Form>
  );
}
