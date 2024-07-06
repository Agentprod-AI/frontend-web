import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import Providers from "@/components/layout/providers";
// import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AuthStateInterface } from "@/context/auth-provider";
import { Toaster } from "sonner";
// import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agent Prod",
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

  let authData: AuthStateInterface["user"] = null;

  const { data, error } = await supabase.auth.getUser();
  if (!error && data?.user) {
    authData = data?.user;
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-3LG32WF4MD"
          ></script>
          <script id="google-analytics">
            {` window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-3LG32WF4MD');`}
          </script>
        </head>
        <body className={`${inter.className} overflow-hidden`}>
          <Providers userAuthData={authData}>
            <Toaster />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
