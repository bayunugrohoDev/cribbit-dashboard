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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { error, status } = await verifyAdmin(supabase);
  
  if (error) {
    return new Response(JSON.stringify({ error }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Create a service role client to bypass RLS for updating another user's profile
    const supabaseAdmin = createClient();
    // Wait, createClient() in Next.js Server uses the user's session.
    // We need to use @supabase/supabase-js createClient with SERVICE_ROLE_KEY.
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
    const serviceClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Perform soft delete by setting deleted_at
    const { error: updateError } = await serviceClient
      .from("profiles")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", userId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("API Route DELETE Error:", error);
    return new Response(
      JSON.stringify({
        message: "Error deleting user",
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
