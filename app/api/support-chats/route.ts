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
    const systemUser = await getSystemUser();

    // Fetch all chats involving the system user where location_id is NULL (general chats)
    const { data: chats, error: chatsError } = await supabase
      .from("chats")
      .select(`
        id,
        last_message,
        last_message_at,
        chat_participants!inner(user_id, unread_count)
      `)
      .is("location_id", null);

    if (chatsError) throw chatsError;

    // Filter to only chats where systemUser is a participant
    const systemChats = chats.filter((c) =>
      c.chat_participants.some((p: any) => p.user_id === systemUser.id)
    );

    // Get the OTHER user in each chat
    const formattedChats = await Promise.all(
      systemChats.map(async (chat) => {
        const otherParticipant = chat.chat_participants.find(
          (p: any) => p.user_id !== systemUser.id
        );
        const unreadCount = chat.chat_participants.find(
          (p: any) => p.user_id === systemUser.id
        )?.unread_count || 0;

        if (!otherParticipant) return null;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, email, deleted_at")
          .eq("id", otherParticipant.user_id)
          .single();

        if (!profile || profile.deleted_at !== null) return null;

        return {
          chatId: chat.id,
          userId: profile?.id,
          userName: profile?.full_name || profile?.email || "Unknown User",
          userAvatar: profile?.avatar_url,
          lastMessage: chat.last_message,
          lastMessageAt: chat.last_message_at,
          unreadCount,
        };
      })
    );

    const validChats = formattedChats.filter(Boolean).sort((a: any, b: any) => {
       const dateA = new Date(a.lastMessageAt || 0).getTime();
       const dateB = new Date(b.lastMessageAt || 0).getTime();
       return dateB - dateA;
    });

    return NextResponse.json(validChats);
  } catch (error) {
    console.error("API Route GET Error:", error);
    return new Response(
      JSON.stringify({
        message: "Error fetching support chats",
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
