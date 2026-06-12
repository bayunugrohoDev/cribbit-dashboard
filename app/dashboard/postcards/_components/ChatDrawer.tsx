"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  buyerId: string | null;
  locationId: string | null;
  userName: string | null;
}

export function ChatDrawer({ isOpen, onClose, buyerId, locationId, userName }: ChatDrawerProps) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [systemUserId, setSystemUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && buyerId && locationId) {
      initChat();
    } else {
      setChatId(null);
      setMessages([]);
    }
  }, [isOpen, buyerId, locationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!chatId) return;

    // Load initial messages
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const initChat = async () => {
    setIsInitializing(true);
    try {
      const res = await fetch("/api/chat/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerId, locationId }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      setChatId(data.chatId);
      setSystemUserId(data.systemUserId);
    } catch (error: any) {
      toast.error(error.message || "Failed to initialize chat");
      onClose();
    } finally {
      setIsInitializing(false);
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch messages error:", error);
    } else {
      setMessages(data || []);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !systemUserId) return;

    setIsLoading(true);
    const { error } = await supabase.from("messages").insert({
      chat_id: chatId,
      sender_id: systemUserId,
      message: newMessage.trim(),
    });

    if (error) {
      toast.error("Failed to send message: " + error.message);
    } else {
      setNewMessage("");
    }
    setIsLoading(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex flex-col sm:max-w-md w-full h-full p-0">
        <SheetHeader className="p-6 pb-2 border-b">
          <SheetTitle>Chat with {userName || "Buyer"}</SheetTitle>
          <SheetDescription>
            Send a direct message to the user's Cribbit inbox.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-900/50">
          {isInitializing ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground mt-10 text-sm">
                      No messages yet. Send a message to start the conversation!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender_id === systemUserId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-[80%] ${
                            isMe ? "self-end items-end" : "self-start items-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isMe
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : "bg-white dark:bg-slate-800 border shadow-sm rounded-tl-none"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground mt-1 px-1">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              <div className="p-4 bg-background border-t">
                <form
                  onSubmit={handleSendMessage}
                  className="flex w-full items-center space-x-2"
                >
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim() || isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
