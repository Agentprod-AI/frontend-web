"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
// import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AppState, UserInterface } from "@/context/user-context";

import {
  login as supabaseLogin,
  signup as supabaseSignup,
} from "@/app/(auth)/actions";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-provider";
import { useUserContext } from "@/context/user-context";
// import GoogleSignInButton from "@/components/github-auth-button";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm({
  formType,
}: {
  formType: "signin" | "signup";
}) {
  const { login } = useAuth();

  const { user, setUser } = useUserContext();

  // const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);

  // const defaultValues = {
  //   email: "mrtechnobot02@gmail.com",
  //   password: "naman123",
  // };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  // const onSubmit = async (data: UserFormValue) => {
  //   if (formType === "signin") {
  //     try {
  //       const userData = await supabaseLogin({
  //         email: data.email,
  //         password: data.password,
  //       });
  //       const newState: UserInterface = {
  //         id: userData.user.id,
  //         email: userData.user.email,
  //       };

  //       console.log("userrrr", userData.user.id);
  //       login(userData.user);
  //       setUser(newState);
  //     } catch (error: any) {
  //       toast.error(error.message);
  //     }
  //   } else if (formType === "signup") {
  //     try {
  //       await supabaseSignup({
  //         email: data.email,
  //         password: data.password,
  //       });
  //       toast.success("Verification email sent!");
  //       // redirect("/");
  //     } catch (error: any) {
  //       toast.error(error.message);
  //     }
  //   }

  //   // signIn("credentials", {
  //   //   email: data.email,
  //   //   callbackUrl: callbackUrl ?? "/dashboard",
  //   // });
  // };
  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      let userData;
      if (formType === "signin") {
        userData = await supabaseLogin({
          email: data.email,
          password: data.password,
        });
        console.log("User details on signin:", userData.user);
      } else if (formType === "signup") {
        userData = await supabaseSignup({
          email: data.email,
          password: data.password,
        });
        toast.success("Verification email sent!");
        console.log("User details on signup:", userData.user);
      }

      if (userData.user) {
        console.log("UserData just after logged in", userData);
        setUser({
          id: userData?.user?.id,
          email: userData?.user?.email,
          username: userData?.user?.username,
          firstName: userData?.user?.firstName,
        });
        login(userData.user);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            {formType === "signin"
              ? "Continue With Email"
              : "Send Verification Email"}
          </Button>
        </form>
      </Form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleSignInButton /> */}
    </>
  );
}
