"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPatterns() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("address_patterns")
    .select("*")
    .order("created_at", { ascending: true });
  
  if (error) throw new Error("Failed to fetch patterns: " + error.message);
  return data;
}

export async function getCountries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("country_to_pattern")
    .select("*");
  
  if (error) throw new Error("Failed to fetch countries: " + error.message);
  return data;
}

export async function createPattern(name: string) {
  const supabase = await createClient();
  const id = "PATTERN_" + Math.random().toString(36).substring(2, 9).toUpperCase();
  
  const { error } = await supabase
    .from("address_patterns")
    .insert({ id, name, title_fallbacks: [] });

  if (error) throw new Error("Failed to create pattern: " + error.message);
  revalidatePath("/dashboard/settings");
  return { id, name };
}

export async function updatePatternName(id: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("address_patterns")
    .update({ name })
    .eq("id", id);

  if (error) throw new Error("Failed to update pattern name: " + error.message);
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function deletePattern(id: string) {
  const supabase = await createClient();
  if (id === 'PATTERN_WESTERN_DEFAULT') throw new Error("Cannot delete DEFAULT pattern");

  const { error } = await supabase
    .from("address_patterns")
    .delete()
    .eq("id", id);

  if (error) throw new Error("Failed to delete pattern: " + error.message);
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function savePatternSettings(
  patternId: string, 
  titleFallbacks: string[], 
  assignedCountries: string[]
) {
  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("address_patterns")
    .update({ title_fallbacks: titleFallbacks })
    .eq("id", patternId);

  if (updateError) {
    throw new Error("Failed to update pattern: " + updateError.message);
  }

  // Remove old mappings for this pattern first
  await supabase
    .from("country_to_pattern")
    .delete()
    .eq("pattern_id", patternId);

  // Insert new mappings
  for (const country of assignedCountries) {
    if (country === 'DEFAULT') continue;
    await supabase
      .from("country_to_pattern")
      .upsert({ 
        country_code: country, 
        pattern_id: patternId 
      }, { onConflict: "country_code" });
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}
