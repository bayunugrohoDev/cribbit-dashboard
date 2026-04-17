"use server";

import { createClient } from "@/lib/supabase/server";

export async function createAgentAccount(formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const companyName = formData.get("companyName") as string;
  const region = formData.get("region") as string;

  if (!email || !fullName) {
    return { success: false, message: "Full Name and Email are required." };
  }

  // 1. Validation for unique email
  // We will check both profiles and brokers tables just to be safe,
  // depending on where the email is formally stored. Let's check brokers first.
  const { data: existingBroker, error: existingBrokerError } = await supabase
    .from("brokers")
    .select("id")
    .eq("email", email)
    .single();

  if (existingBroker) {
    return {
      success: false,
      message: "Email is already registered as an agent.",
    };
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (existingProfile) {
    return {
      success: false,
      message: "Email is already registered in profiles.",
    };
  }

  // 2. We use the Admin Client to securely create the Auth User first!
  // This bypasses the issue of the admin getting logged out, and avoids all Foreign Key complaints.
  const { createAdminClient } = await import("@/lib/supabase/admin");
  let adminClient;
  try {
    adminClient = createAdminClient();
  } catch (error) {
    return {
      success: false,
      message: "Server Configuration Error: Missing SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  // Step 2a: Create the Auth user via Supabase Invite API
  // This automatically generates a temporary password link and sends them the official Invite Email!
  const { data: inviteData, error: authError } = await adminClient.auth.admin.inviteUserByEmail(
    email,
    {
      data: { role: 'agent', is_upgraded: false, full_name: fullName }, // This data is accessible in your Email Template
      redirectTo: 'https://cribbit-dashboard-shadcn.vercel.app' // Update this to your real website
    }
  );

  if (authError || !inviteData.user) {
    return {
      success: false,
      message: `Auth Database Error: ${authError?.message}`,
    };
  }

  const userId = inviteData.user.id;

  // Most Supabase setups will automatically create the `profiles` row using a trigger when `auth.users` is created!
  // Just in case it doesn't, we will update the profile with the full name we gathered.
  await adminClient
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", userId);

  // Step 2b: Create the broker entry safely linked to the real Auth User ID!
  const newBrokerData = {
    id: userId,
    full_name: fullName,
    email: email,
    phone: phone,
    company_name: companyName,
    region: region,
  };

  const { error: insertError } = await adminClient
    .from("brokers")
    .insert([newBrokerData]);

  if (insertError) {
    // Attempt rollback of the Auth user we just created so we don't have orphan data
    await adminClient.auth.admin.deleteUser(userId);
    return {
      success: false,
      message: `Broker Database Error: ${insertError.message}`,
    };
  }

  // 3. Email Implementation
  console.log(
    `[EMAIL SYSTEM]: Supabase automatically sent the Invite Email to ${email} !`
  );

  return {
    success: true,
    message: "Agent created successfully and invite email sent.",
  };
}
