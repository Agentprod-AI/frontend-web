// "use client";

// import Link from "next/link";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Switch } from "@/components/ui/switch";
// import { toast } from "@/components/ui/use-toast";

// const autopilotFormSchema = z.object({
//   all_messages_actions: z.boolean().default(false).optional(),
//   outbound_sequences: z.boolean().default(false).optional(),
//   replies: z.boolean().default(false).optional(),
//   out_of_office: z.boolean().default(false).optional(),
//   positive: z.boolean().default(false).optional(),
//   negative: z.boolean().default(false).optional(),
//   neutral: z.boolean().default(false).optional(),
//   maybe_later: z.boolean().default(false).optional(),
//   forwarded: z.boolean().default(false).optional(),
//   error: z.boolean().default(false).optional(),
// });

// type AutopilotFormValues = z.infer<typeof autopilotFormSchema>;

// interface autopilotOptionsInterface {
//   name:
//     | "all_messages_actions"
//     | "outbound_sequences"
//     | "replies"
//     | "out_of_office"
//     | "positive"
//     | "negative"
//     | "neutral"
//     | "maybe_later"
//     | "forwarded"
//     | "error";
//   label: string;
//   description: string;
// }
// const autopilotOptions: autopilotOptionsInterface[] = [
//   {
//     name: "all_messages_actions",
//     label: "All messages and actions",
//     description: "Turn on autopilot for all messages and actions.",
//   },
//   {
//     name: "outbound_sequences",
//     label: "Outbound sequences",
//     description: "First contact and follow-ups as part of a campaign sequence.",
//   },
//   {
//     name: "replies",
//     label: "Replies",
//     description: "Responses and actions to inbound replies.",
//   },
//   {
//     name: "out_of_office",
//     label: "Out of office",
//     description: "Follow-up when they are back at work.",
//   },
//   {
//     name: "positive",
//     label: "Positive",
//     description: "Respond towards campaign goal on positive reply.",
//   },
//   {
//     name: "negative",
//     label: "Negative",
//     description: "Respond, mark as lost, and block contact on negative reply.",
//   },
//   {
//     name: "neutral",
//     label: "Neutral",
//     description: "Respond towards campaign goal on neutral reply.",
//   },
//   {
//     name: "maybe_later",
//     label: "Maybe later",
//     description: "Respond and follow-up later towards campaign goal.",
//   },
//   {
//     name: "forwarded",
//     label: "Forwarded",
//     description: "Start a new conversation on forwarded reply.",
//   },
//   {
//     name: "error",
//     label: "Error",
//     description: "Block contact and mark as lost if an email bounces.",
//   },
// ];

// // This can come from your database or API.
// const defaultValues: Partial<AutopilotFormValues> = {
//   all_messages_actions: false,
//   outbound_sequences: false,
//   replies: false,
//   out_of_office: false,
//   positive: false,
//   negative: false,
//   neutral: false,
//   maybe_later: false,
//   forwarded: false,
//   error: false,
// };
// export function AutopilotForm() {
//   const form = useForm<AutopilotFormValues>({
//     resolver: zodResolver(autopilotFormSchema),
//     defaultValues,
//   });

//   function onSubmit(data: AutopilotFormValues) {
//     console.log("Data: ", data);
//     toast({
//       title: "You submitted the following values:",
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     });
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <div>
//           {/* <h3 className="mb-4 text-lg font-medium">Email Notifications</h3> */}
//           <div className="space-y-2">
//             {autopilotOptions.map((val, ind) => (
//               <FormField
//                 key={`autopilot_${ind}`}
//                 control={form.control}
//                 name={val.name}
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center justify-between rounded-lg px-4 py-2">
//                     <div className="space-y-0.5">
//                       <FormLabel className="text-base">{val.label}</FormLabel>
//                       <FormDescription>{val.description}</FormDescription>
//                     </div>
//                     <FormControl>
//                       <Switch
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//             ))}
//           </div>
//         </div>
//         <Button type="submit">Update notifications</Button>
//       </form>
//     </Form>
//   );
// }
