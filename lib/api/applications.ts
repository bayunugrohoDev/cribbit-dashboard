import { createClient } from "@/lib/supabase/client";

export async function fetchApplicationsByStatus(status: "pending" | "rejected" | "approved") {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("broker_applications")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }
  return data;
}

export async function fetchPendingApplications() {
  return fetchApplicationsByStatus("pending");
}

export async function fetchRejectedApplications() {
  return fetchApplicationsByStatus("rejected");
}
