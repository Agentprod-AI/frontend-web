import "./globals.css";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import Providers from "@/components/layout/providers";
// import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AuthStateInterface } from "@/components/layout/context/auth-provider";
import { Toaster } from "sonner";
// import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Shadcn",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let authData: AuthStateInterface = { user: null };

  const { data, error } = await supabase.auth.getUser();
  if (!error && data?.user) {
    authData["user"] = data?.user;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <Providers userAuthData={authData}>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
