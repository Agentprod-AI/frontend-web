"use client";

import { useRouter } from 'next/navigation';
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

const goalFormSchema = z.object({
  success_metric: z.string(),
  scheduling_link: z.string().url(), 
  emails: z.array(z.object({
    value: z.string()
  })).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  follow_up_days: z.number(),
  follow_up_times: z.number(),
  mark_as_lost: z.number(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

const defaultValues: Partial<GoalFormValues> = {};

export function GoalForm({type}: {type: string}) {
  const router = useRouter();

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

  const onEmailAppend = (email: string) => {
    // Check if the email is not already present to avoid duplicates
    if (!emailFields.some(emailField => emailField.value === email)) {
      appendEmail({ value: email });
    }
  };
  
  const onEmailRemove = (email: string) => {
    // Find the index of the email object to remove
    const indexToRemove = emailFields.findIndex(emailField => emailField.value === email);
    if (indexToRemove !== -1) {
      removeEmail(indexToRemove);
    }
  };

  const onSubmit: SubmitHandler<GoalFormValues> = (data) =>  {
    if (type === "create") {
      console.log(data);
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
      router.push('/dashboard/campaign/create');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mb-5">
        <FormField
          control={form.control}
          name="success_metric"
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
          name="scheduling_link"
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

        <FormField
          control={form.control}
          name="emails"
          render={({field}) => (
            <FormItem className="space-y-3">
              <div>
                <FormLabel>Sender Email</FormLabel>
                <FormDescription>Where prospects can schedule a meeting with you</FormDescription>
              </div>
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
                        {dummyEmails && dummyEmails.map((email, index) => {
                          return (
                            <DropdownMenuItem key={index}>
                              <div className="flex items-center space-x-2" onClick={(event) => event.stopPropagation()}>
                              <Checkbox
                                checked={emailFields.some(emailField => emailField.value === email)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    onEmailAppend(email);
                                  } else {
                                    onEmailRemove(email);
                                  }
                                }}
                              />
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  {email}
                                </label>
                              </div>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuGroup>
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel className="tex-sm font-medium">Follow Up</FormLabel>

          <div className="flex gap-4 items-center mt-3">
            <FormField
              control={form.control}
              name="follow_up_days"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <p className="text-sm mb-3">Days between follow-ups</p>
                  <FormControl>
                    <Input 
                      type="number" 
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

            <FormField
              control={form.control}
              name="follow_up_times"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <p className="text-sm mb-3">Number of follow-ups</p>
                  <FormControl>
                    <Input 
                      type="number" 
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
          </div>
        </div>


        <FormField
          control={form.control}
          name="mark_as_lost"
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