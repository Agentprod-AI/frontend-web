"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: { email: string; password: string }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { data: userData, error } =
    await supabase.auth.signInWithPassword(data);

  if (error) {
    throw new Error(error.message);
  }

  return userData;
  // revalidatePath("/", "layout");
  // redirect("/");
}

export async function signup(formData: { email: string; password: string }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    throw new Error(error.message);
  }

  // revalidatePath("/", "layout");
  // redirect("/");
}

export async function logout() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  } else {
    // Ideally, you might want to also revalidate or clear any cache that depends on the user session
    // This step depends on your application's structure and how it handles cache
    // redirect("/");
    // Redirect to the homepage or login page after successful logout
  }
}
