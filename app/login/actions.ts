"use server";


import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Attempting login for:", email);
  console.log("Password provided:", password);

  // 1. Sign in ke Supabase Auth
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("Auth response data:", data);
    console.log("Auth error:", authError);

  if (authError || !data.user) {
    return redirect("/login?error=Invalid credentials");
  }

  // 2. Cek Role di tabel Profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

    console.log('profile data:', profile);

  if (profileError || (profile.role !== "admin" && profile.role !== "super_admin")) {
    // Jika bukan admin, paksa logout dan kembalikan ke login
    await supabase.auth.signOut();
    return redirect("/login?error=Unauthorized access");
  }

  // 3. Berhasil
  redirect("/dashboard");
}