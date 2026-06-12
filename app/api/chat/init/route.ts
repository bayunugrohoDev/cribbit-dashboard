import { NextResponse } from "next/server";
import { initPostcardChat } from "@/lib/api/chat";

export async function POST(req: Request) {
  try {
    const { buyerId, locationId } = await req.json();

    if (!buyerId || !locationId) {
      return NextResponse.json(
        { error: "buyerId and locationId are required" },
        { status: 400 }
      );
    }

    const { chatId, systemUserId } = await initPostcardChat(buyerId, locationId);

    return NextResponse.json({ chatId, systemUserId });
  } catch (error: any) {
    console.error("Failed to init chat:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize chat" },
      { status: 500 }
    );
  }
}
