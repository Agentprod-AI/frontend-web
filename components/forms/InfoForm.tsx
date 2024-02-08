"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

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
  name: z.string().min(3, {
    message: "Name must contain at least 3 characters.",
  }),
  email: z.string().email("Please enter a valid email."),
  profession: z.string().min(3, {
    message: "Profession must contain at least 3 characters.",
  }),
});

export default function ContactForm() {
  // const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      profession: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      localStorage.setItem("ap_user_data", JSON.stringify(values));
      console.log("values", values);
      router.push("/chat");
    } catch (err) {
      console.log("Err!", err);
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://framerusercontent.com/images/tTP6vsAVNMPiMpnllgHsJPN4FbQ.png"
          alt="AgentProd"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Start using Agentprod!
        </h2>
      </div>
      <br />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 min-w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter yout name" {...field} />
                </FormControl>
                {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter yout email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profession</FormLabel>
                <FormControl>
                  <Input placeholder="Enter yout profession" {...field} />
                </FormControl>
                {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Start Chatting</Button>
        </form>
      </Form>
    </div>
  );
}
