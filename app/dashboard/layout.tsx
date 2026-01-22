import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil data profile beserta role-nya, full_name, dan avatar_url
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name, avatar_url") // Tambahkan full_name dan avatar_url
    .eq("id", user?.id)
    .single();

  if (profileError || !profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    // Jika tidak ada profil, role salah, atau tidak terotorisasi, paksa logout dan kembalikan ke login
    await supabase.auth.signOut();
    redirect("/login?error=Account not authorized");
  }

  const userForNav = {
    name: profile.full_name || user.email, // Gunakan full_name jika ada, jika tidak pakai email
    email: user.email,
    avatar: profile.avatar_url || "/images/default-avatar.png", // Gunakan avatar_url jika ada
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={userForNav} /> {/* Pass userForNav here */}
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
