"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Check, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export default function EmailForm(props: {
  setUserEmail: any;
  userEmail: string;
  disabled?: boolean;
  //   loading: boolean;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: props.userEmail,
    },
  });

  useEffect(() => {
    form.setValue("email", props.userEmail);
  }, [props.userEmail]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      localStorage.setItem("ap_user_email", JSON.stringify(values.email));
      props.setUserEmail(values.email);
    } catch (err) {
      console.log("Err!", err);
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="min-w-full flex space-x-2"
        >
          <FormField
            disabled={props.disabled}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-64">
                {/* <FormLabel>Email</FormLabel> */}
                <FormControl>
                  <Input placeholder="Enter email to continue" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={props.disabled} variant={"outline"} type="submit">
            {props.disabled ? (
              <Check className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
