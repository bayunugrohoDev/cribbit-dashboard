import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getSystemUser } from "@/lib/api/chat";

export async function GET() {
  const supabase = await createClient();

  try {
    // 1. Fetch all bids
    const { data: bids, error: bidsError } = await supabase
      .from("bids")
      .select(
        `id, created_at, price, price_min, price_max, status, user_id, location_id, contact_method, has_loan_promise, must_sell_first, move_in_timeline, message`
      )
      .order("created_at", { ascending: false });

    if (bidsError) {
      console.error("Error fetching bids:", bidsError);
      throw bidsError;
    }

    if (!bids || bids.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Collect unique IDs
    const userIds = [...new Set(bids.map((bid) => bid.user_id))];
    const locationIds = [...new Set(bids.map((bid) => bid.location_id))];

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

    // Create maps for quick lookups
    const profilesMap = new Map(profiles.map((p) => [p.id, p]));
    const locationsMap = new Map(locations.map((l) => [l.id, l]));

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

    // 4. Stitch the data together
    const formattedBids = bids.map((bid) => {
      const user = profilesMap.get(bid.user_id);
      const location = locationsMap.get(bid.location_id);
      // console.log('location:', location);
      return {
        id: bid.id,
        userId: bid.user_id,
        userName: user?.full_name || "Unknown User",
        userAvatar: user?.avatar_url || "",
        locations: {
          location_id: location?.id ?? null,
          route: location?.street ?? null,
          streetNumber: location?.street_number ?? null,
          postal_town: location?.city ?? null,
        },
        // route: location?.street || "",
        // streetNumber: location?.street_number || "",
        // postal_town: location?.city || "",
        price_min: bid.price_min || 0,
        price_max: bid.price_max || 0,
        status:
          bid.status === "Winning" ||
          bid.status === "Outbid" ||
          bid.status === "Accepted"
            ? bid.status
            : "Pending",
        contact_method: bid.contact_method || "direct_post",
        has_loan_promise: bid.has_loan_promise || null,
        must_sell_first: bid.must_sell_first ?? null,
        move_in_timeline: bid.move_in_timeline || null,
        message: bid.message || null,
        date: bid.created_at || "",
        unreadCount: (() => {
          if (!chats) return 0;
          const chat = chats.find(c => {
             if (c.location_id !== bid.location_id) return false;
             const participants = c.chat_participants.map(p => p.user_id);
             return participants.includes(systemUserId) && participants.includes(bid.user_id);
          });
          if (!chat) return 0;
          return chat.chat_participants.find(p => p.user_id === systemUserId)?.unread_count || 0;
        })()
      };
    });
    console.log("formattedBids:", formattedBids);
    return NextResponse.json(formattedBids);
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(
      JSON.stringify({
        message: "Error fetching bids",
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
