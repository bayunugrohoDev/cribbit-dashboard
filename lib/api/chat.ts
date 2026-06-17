import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

// Create a service role client to bypass RLS for system operations
export const getServiceSupabase = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

export async function getSystemUser() {
  const supabase = getServiceSupabase();
  const systemEmail = "support@cribbit.se";

  // Check if profile exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", systemEmail)
    .single();

  if (profile) {
    return profile;
  }

  // If not, we create the user in auth.users
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: systemEmail,
    email_confirm: true,
    password: crypto.randomUUID(),
    user_metadata: {
      full_name: "Cribbit Support",
      avatar_url: "https://rksgokwldtbskssnwwnt.supabase.co/storage/v1/object/public/public/icon.png", // Example generic icon
    },
  });

  if (authError || !authData.user) {
    throw new Error("Failed to create system user: " + authError?.message);
  }

  // The handle_new_user trigger should have created the profile.
  // Let's ensure the role is set to 'admin'
  await supabase
    .from("profiles")
    .update({ role: "admin" as any, full_name: "Cribbit Support" })
    .eq("id", authData.user.id);

  return { id: authData.user.id };
}

export async function initChat(userId: string, locationId: string | null = null) {
  const supabase = getServiceSupabase();
  const systemUser = await getSystemUser();

  // 1. Check if chat already exists using the RPC function we have or by querying
  // In the mobile app, get_common_chat_id expects user1, user2, locationId.
  // We can just query chat_participants and chats directly.

  let chatsQuery = supabase
    .from("chats")
    .select("id, chat_participants!inner(user_id)");

  if (locationId) {
    chatsQuery = chatsQuery.eq("location_id", locationId);
  } else {
    chatsQuery = chatsQuery.is("location_id", null);
  }

  const { data: chats } = await chatsQuery;

  let existingChatId: string | null = null;

  if (chats) {
    for (const chat of chats) {
      const participants = chat.chat_participants.map(p => p.user_id);
      if (participants.includes(userId) && participants.includes(systemUser.id)) {
        existingChatId = chat.id;
        break;
      }
    }
  }

  if (existingChatId) {
    // Reset unread count for the system user since they are opening the chat
    await supabase
      .from("chat_participants")
      .update({ unread_count: 0, last_read_at: new Date().toISOString() })
      .eq("chat_id", existingChatId)
      .eq("user_id", systemUser.id);

    return { chatId: existingChatId, systemUserId: systemUser.id };
  }

  // 2. If not, create a new chat
  const insertData: any = {};
  if (locationId) {
    insertData.location_id = locationId;
  }

  const { data: newChat, error: chatError } = await supabase
    .from("chats")
    .insert(insertData)
    .select("id")
    .single();

  if (chatError || !newChat) {
    throw new Error("Failed to create chat: " + chatError?.message);
  }

  // 3. Add both participants
  const { error: partError } = await supabase
    .from("chat_participants")
    .insert([
      { chat_id: newChat.id, user_id: userId, unread_count: 0 },
      { chat_id: newChat.id, user_id: systemUser.id, unread_count: 0 },
    ]);

  if (partError) {
    throw new Error("Failed to add participants: " + partError.message);
  }

  return { chatId: newChat.id, systemUserId: systemUser.id };
}
