"use client";

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchPostcards } from "@/lib/api/postcards";
import { fetchBids } from "@/lib/api/bids";

export function NavMain({
  groups,
}: {
  groups: {
    title?: string;
    items: {
      title: string;
      url: string;
      icon?: Icon;
      subItemsType?: "postcards" | "brokers";
    }[];
  }[];
}) {
  const pathname = usePathname();

  const { data: postcards } = useQuery({
    queryKey: ["postcards"],
    queryFn: fetchPostcards,
  });

  const { data: supportChats } = useQuery({
    queryKey: ["support-chats"],
    queryFn: async () => {
      const res = await fetch("/api/support-chats");
      return res.json();
    },
  });

  const { data: bids } = useQuery({
    queryKey: ["bids"],
    queryFn: fetchBids,
  });

  const hasUnreadPostcards = Array.isArray(postcards)
    ? postcards.some((p) => p.unreadCount && p.unreadCount > 0)
    : false;
  const hasUnreadSupportChats = Array.isArray(supportChats)
    ? supportChats.some((c: any) => c.unreadCount && c.unreadCount > 0)
    : false;
  const hasUnreadBrokers = Array.isArray(bids)
    ? bids.some(
        (b: any) => b.contact_method === "broker" && b.unreadCount && b.unreadCount > 0,
      )
    : false;

  return (
    <>
      {groups.map((group, index) => (
        <SidebarGroup key={index}>
          {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      {item.icon && (
                        <div className="relative">
                          <item.icon />
                          {item.title === "Postcards" && hasUnreadPostcards && (
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                          )}
                          {item.title === "Support Chats" &&
                            hasUnreadSupportChats && (
                              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                            )}
                          {item.title === "Brokers" && hasUnreadBrokers && (
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                          )}
                        </div>
                      )}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>

                  {item.subItemsType === "postcards" && Array.isArray(postcards) && postcards.length > 0 && (
                    <SidebarMenuSub>
                      {postcards.map((p) => (
                        <SidebarMenuSubItem key={p.id}>
                          <SidebarMenuSubButton asChild>
                            <Link href={`/admin/dashboard/postcards?id=${p.id}`}>
                              <span className="truncate">
                                {p.locations?.streetNumber} {p.locations?.route}
                              </span>
                              {p.unreadCount && p.unreadCount > 0 ? (
                                <span className="ml-auto h-2 w-2 rounded-full bg-red-500" />
                              ) : null}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}

                  {item.subItemsType === "brokers" && Array.isArray(bids) && bids.length > 0 && (
                    <SidebarMenuSub>
                      {bids.filter(b => b.contact_method === "broker").map((b) => (
                        <SidebarMenuSubItem key={b.id}>
                          <SidebarMenuSubButton asChild>
                            <Link href={`/admin/dashboard/brokers?id=${b.id}`}>
                              <span className="truncate">
                                {b.locations?.streetNumber} {b.locations?.route}
                              </span>
                              {b.unreadCount && b.unreadCount > 0 ? (
                                <span className="ml-auto h-2 w-2 rounded-full bg-red-500" />
                              ) : null}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
