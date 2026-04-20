"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitApplication(formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const companyName = formData.get("companyName") as string;
  const licenseNumber = formData.get("licenseNumber") as string;
  const bio = formData.get("bio") as string;

  if (!email || !fullName) {
    return { success: false, message: "Full Name and Email are required." };
  }

  // Double check if the user is already a broker to avoid spam
  const { data: existingBroker } = await supabase
    .from("brokers")
    .select("id")
    .eq("email", email)
    .single();

  if (existingBroker) {
    return {
      success: false,
      message: "Email is already registered as an active agent.",
    };
  }

  // Check if they already have a pending application
  const { data: existingApp } = await supabase
    .from("broker_applications")
    .select("id")
    .eq("email", email)
    .eq("status", "pending")
    .single();

  if (existingApp) {
      return {
          success: false,
          message: "You already have a pending application. Please wait for our team to review it.",
      };
  }

  // Insert into broker_applications
  const newApp = {
    full_name: fullName,
    email: email,
    phone: phone,
    company_name: companyName,
    license_number: licenseNumber,
    bio: bio,
    status: "pending",
  };

  const { error } = await supabase.from("broker_applications").insert([newApp]);

  if (error) {
    return {
      success: false,
      message: `Failed to submit application: ${error.message}`,
    };
  }

  revalidatePath("/dashboard/applications");

  return {
    success: true,
    message: "Application submitted successfully! Our team will review it shortly.",
  };
}

export async function approveApplication(applicationId: string) {
  const supabase = await createClient();
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const adminClient = createAdminClient();

  // 1. Fetch application details
  const { data: app, error: appError } = await supabase
    .from("broker_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (appError || !app) {
    return { success: false, message: "Application not found." };
  }

  // 2. Check if user already exists in auth
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", app.email)
    .single();

  let userId = existingProfile?.id;

  if (!userId) {
    // Skenario 1: New User. Invite them via Admin Auth API
    const { data: inviteData, error: authError } = await adminClient.auth.admin.inviteUserByEmail(
      app.email,
      {
        data: { role: 'agent', is_upgraded: true, full_name: app.full_name },
        redirectTo: 'https://cribbit-dashboard-shadcn.vercel.app'
      }
    );

    if (authError || !inviteData.user) {
      return { success: false, message: `Auth creation failed: ${authError?.message}` };
    }
    userId = inviteData.user.id;
    
    // Ensure profile exists. We only know id and full_name are valid for sure
    await adminClient.from("profiles").upsert({ id: userId, full_name: app.full_name });
  } else {
    // Skenario 2: Existing User. Update their profile.
    await adminClient.auth.admin.updateUserById(userId, { user_metadata: { role: 'agent', is_upgraded: true } });
  }

  // 3. Create Brokers record (matching exact schema: id, company_name)
  const newBrokerData = {
    id: userId,
    company_name: app.company_name || 'Independent Agent',
  };

  const { error: insertError } = await adminClient.from("brokers").upsert([newBrokerData]);

  if (insertError) {
    return { success: false, message: `Broker creation failed/table error: ${insertError.message}` };
  }

  // 4. Mark application as approved
  await adminClient.from("broker_applications").update({ status: 'approved' }).eq("id", applicationId);

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard/agents");

  return { success: true, message: "Agent approved & created successfully!" };
}

export async function rejectApplication(applicationId: string) {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("broker_applications")
    .update({ status: 'rejected' })
    .eq("id", applicationId);

  if (error) {
    return { success: false, message: `Failed to reject: ${error.message}` };
  }

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard/agents");
  return { success: true, message: "Application rejected." };
}
