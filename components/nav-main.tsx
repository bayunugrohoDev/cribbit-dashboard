"use client";

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchPostcards } from "@/lib/api/postcards";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();

  const { data: postcards } = useQuery({
    queryKey: ["postcards"],
    queryFn: fetchPostcards,
  });

  const hasUnreadPostcards = postcards?.some((p) => p.unreadCount && p.unreadCount > 0);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {/* <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem> */}
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
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
                    </div>
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
