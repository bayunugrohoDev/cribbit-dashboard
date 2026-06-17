import { NextResponse } from "next/server";
import { initChat } from "@/lib/api/chat";

export async function POST(req: Request) {
  try {
    const { buyerId, userId, locationId } = await req.json();
    
    // Support both buyerId and userId for backward compatibility
    const targetUserId = userId || buyerId;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const { chatId, systemUserId } = await initChat(targetUserId, locationId);

    return NextResponse.json({ chatId, systemUserId });
  } catch (error: any) {
    console.error("Failed to init chat:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize chat" },
      { status: 500 }
    );
  }
}
