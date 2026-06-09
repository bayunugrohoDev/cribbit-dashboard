import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

async function verifyAdmin(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", status: 401 };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    return { error: "Forbidden", status: 403 };
  }

  return { user };
}

export async function GET() {
  const supabase = await createClient();
  const { error, status } = await verifyAdmin(supabase);
  if (error) {
    return new Response(JSON.stringify({ error }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { data: settings, error: settingsError } = await supabase
      .from("system_settings")
      .select("*")
      .order("key");

    if (settingsError) {
      console.error("Error fetching settings:", settingsError);
      throw settingsError;
    }

    // Mask secret values before returning to client
    const maskedSettings = settings.map((s) => {
      let displayValue = s.value;
      if (s.is_secret && s.value) {
        if (s.value.length > 8) {
          displayValue = `${s.value.slice(0, 4)}••••${s.value.slice(-4)}`;
        } else {
          displayValue = "••••••••";
        }
      }
      return {
        ...s,
        value: displayValue,
      };
    });

    return NextResponse.json(maskedSettings);
  } catch (error) {
    console.error("API GET Settings Error:", error);
    return new Response(
      JSON.stringify({
        message: "Error fetching system settings",
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { error: authErr, status: authStat } = await verifyAdmin(supabase);
  if (authErr) {
    return new Response(JSON.stringify({ error: authErr }), {
      status: authStat,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { settings } = await req.json();

    if (!settings || !Array.isArray(settings)) {
      return new Response(
        JSON.stringify({ message: "Invalid payload: settings must be an array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch existing settings to check if they are secrets and verify if the value has changed
    const { data: dbSettings, error: dbError } = await supabase
      .from("system_settings")
      .select("*");

    if (dbError || !dbSettings) {
      console.error("Error fetching existing settings for update:", dbError);
      throw dbError || new Error("Could not fetch current settings");
    }

    const dbSettingsMap = new Map(dbSettings.map((s) => [s.key, s]));

    // Perform updates
    for (const item of settings) {
      const { key, value } = item;
      if (!key || value === undefined) continue;

      const dbSetting = dbSettingsMap.get(key);
      if (!dbSetting) continue;

      // Skip updating secret if the value submitted is masked (meaning the user did not edit it)
      if (dbSetting.is_secret && value.includes("••••")) {
        continue;
      }

      // Update the database value
      const { error: updateError } = await supabase
        .from("system_settings")
        .update({
          value: value.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("key", key);

      if (updateError) {
        console.error(`Error updating setting ${key}:`, updateError);
        throw updateError;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API PATCH Settings Error:", error);
    return new Response(
      JSON.stringify({
        message: "Error updating system settings",
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
