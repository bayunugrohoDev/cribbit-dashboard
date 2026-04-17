import { createClient } from "../supabase/client";

export async function fetchAgents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brokers")
    .select("*, profiles(*)");

  if (error) {
    throw error;
  }

  // Format the data to make it easier to consume by the table
  return data.map((broker) => ({
    ...broker,
    profile: Array.isArray(broker.profiles)
      ? broker.profiles[0]
      : broker.profiles,
  }));
}
