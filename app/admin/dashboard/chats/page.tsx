"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChatDrawer } from "@/app/admin/dashboard/postcards/_components/ChatDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchUsers } from "@/lib/api/users";
import { Search, Plus, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";

export default function ChatsPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: supportChats = [], isLoading: isLoadingChats } = useQuery({
    queryKey: ["support-chats"],
    queryFn: async () => {
      const res = await fetch("/api/support-chats");
      return res.json();
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const allFilteredUsers = users.filter((u: any) => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // You can still cap it at a reasonable number for performance, or show all.
  // 50 is a good safe limit for a dropdown so it doesn't lag the DOM.
  const filteredUsers = allFilteredUsers.slice(0, 50);

  const openChat = (user: any) => {
    setSelectedUser({ id: user.userId || user.id, full_name: user.userName || user.full_name });
    setIsChatOpen(true);
    setIsSearchOpen(false);
    
    // Optimistically clear unread count for this user
    queryClient.setQueryData(["support-chats"], (old: any) => {
      if (!old) return old;
      return old.map((c: any) => 
        (c.userId === user.userId || c.userId === user.id) 
          ? { ...c, unreadCount: 0 } 
          : c
      );
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Support Chats</h1>
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> New Chat</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Search Users</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2 my-4">
              <Search className="w-5 h-5 text-gray-500" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ScrollArea className="max-h-[300px] pr-4 -mr-4">
              <div className="space-y-2">
                {filteredUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => openChat(user)}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url ?? undefined} />
                        <AvatarFallback>{user.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.full_name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </div>
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
                {filteredUsers.length === 0 && <div className="text-center text-sm text-gray-500 py-4">No users found.</div>}
                {allFilteredUsers.length > 50 && (
                  <div className="text-center text-xs text-gray-400 py-2">
                    + {allFilteredUsers.length - 50} more users. Keep typing to refine.
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        {isLoadingChats ? (
          <div className="p-8 text-center text-gray-500">Loading chats...</div>
        ) : supportChats.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No active support chats. Start a new one!</div>
        ) : (
          <div className="divide-y">
            {supportChats.map((chat: any) => (
              <div 
                key={chat.chatId} 
                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => openChat(chat)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={chat.userAvatar ?? undefined} />
                    <AvatarFallback>{chat.userName?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{chat.userName}</span>
                      {!!chat.unreadCount && chat.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 min-w-5 p-0 px-1.5 flex items-center justify-center rounded-full text-[10px]">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 truncate max-w-md">
                      {chat.lastMessage || "No messages yet."}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {chat.lastMessageAt ? formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: true }) : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedUser(null);
          // invalidate query to refresh last messages and sorts
          queryClient.invalidateQueries({ queryKey: ["support-chats"] });
        }}
        buyerId={selectedUser?.id || null}
        locationId={null} // General support chat
        userName={selectedUser?.full_name || null}
      />
    </div>
  );
}
