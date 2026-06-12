import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getSystemUser } from "@/lib/api/chat";

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
    // 1. Fetch all postcard orders
    const { data: orders, error: ordersError } = await supabase
      .from("postcard_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching postcard orders:", ordersError);
      throw ordersError;
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Collect unique IDs
    const userIds = [...new Set(orders.map((o) => o.user_id))];
    const locationIds = [...new Set(orders.map((o) => o.location_id))];

    // 3. Fetch corresponding profiles and locations in parallel
    const [
      { data: profiles, error: profilesError },
      { data: locations, error: locationsError },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select(`id, full_name, avatar_url`)
        .in("id", userIds),
      supabase
        .from("locations")
        .select(`id, street, street_number, city, country`)
        .in("id", locationIds),
    ]);

    if (profilesError) throw profilesError;
    if (locationsError) throw locationsError;

    // Fetch chat unread counts for the system user
    const systemUser = await getSystemUser();
    const systemUserId = systemUser.id;

    const { data: chats } = await supabase
      .from("chats")
      .select(`
        id,
        location_id,
        chat_participants!inner (
          user_id,
          unread_count
        )
      `)
      .in("location_id", locationIds);

    // Create maps for quick lookups
    const profilesMap = new Map(profiles.map((p) => [p.id, p]));
    const locationsMap = new Map(locations.map((l) => [l.id, l]));

    // 4. Stitch the data together
    const formattedOrders = orders.map((order) => {
      const user = profilesMap.get(order.user_id);
      const location = locationsMap.get(order.location_id);

      return {
        id: order.id,
        userId: order.user_id,
        userName: user?.full_name || "Unknown User",
        userAvatar: user?.avatar_url || "",
        locations: {
          location_id: location?.id ?? null,
          route: location?.street ?? null,
          streetNumber: location?.street_number ?? null,
          postal_town: location?.city ?? null,
        },
        price_min: order.price_min || 0,
        price_max: order.price_max || 0,
        amount: order.amount || 0,
        currency: order.currency || "SEK",
        status: order.status,
        date: order.created_at,
        paid_at: order.paid_at,
        sent_at: order.sent_at,
        adminNote: order.admin_note || "",
        qrToken: order.qr_token || "",
        stripePaymentIntentId: order.stripe_payment_intent_id || "",
        stripeChargeId: order.stripe_charge_id || "",
        unreadCount: (() => {
          if (!chats) return 0;
          // Find the chat for this location that has both the system user and the order user
          const chat = chats.find(c => {
             if (c.location_id !== order.location_id) return false;
             const participants = c.chat_participants.map(p => p.user_id);
             return participants.includes(systemUserId) && participants.includes(order.user_id);
          });
          if (!chat) return 0;
          return chat.chat_participants.find(p => p.user_id === systemUserId)?.unread_count || 0;
        })()
      };
    });

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("API Route GET Error:", error);
    return new Response(
      JSON.stringify({
        message: "Error fetching postcard orders",
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
    const { id, status, adminNote } = await req.json();

    if (!id || !status) {
      return new Response(
        JSON.stringify({ message: "Missing required fields: id or status" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch existing postcard order
    const { data: existingOrder, error: fetchError } = await supabase
      .from("postcard_orders")
      .select("paid_at, sent_at")
      .eq("id", id)
      .single();

    if (fetchError || !existingOrder) {
      return new Response(
        JSON.stringify({ message: "Postcard order not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (adminNote !== undefined) {
      updateData.admin_note = adminNote;
    }

    if (status === "paid" && !existingOrder.paid_at) {
      updateData.paid_at = new Date().toISOString();
    }

    if (status === "sent" && !existingOrder.sent_at) {
      updateData.sent_at = new Date().toISOString();
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from("postcard_orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating postcard order:", updateError);
      throw updateError;
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("API Route PATCH Error:", error);
    return new Response(
      JSON.stringify({
        message: "Error updating postcard order",
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
