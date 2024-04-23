"use client";
import Link from "next/link";
import UserAuthForm from "@/components/forms/auth/user-auth-form";
// import { useAuth } from "@/context/auth-provider";
import { redirect } from "next/navigation";
import { SignIn, SignUp, useAuth } from "@clerk/nextjs";

// export const metadata: Metadata = {
//   title: "Authentication",
//   description: "Authentication forms built using the components.",
// };

export default function AuthenticationPage() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    redirect("/dashboard");
  }
  return (
    <div className="p-4 lg:p-8 h-full flex items-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {/* <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Login into your account
          </p>
        </div> */}
        {/* <UserAuthForm formType="signin" /> */}

        <SignIn routing="hash" />
        {/* <Link href={"/signup"}>Create an account</Link> */}
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
