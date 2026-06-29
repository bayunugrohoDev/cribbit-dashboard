"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconDeviceTabletExclamation,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconMessage,
  IconReport,
  IconSearch,
  IconSettings,
  IconTable,
  IconUsers,
  IconHome,
  IconMail,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

const data = {
  // Removed hardcoded user data as it will now come from props
  navGroups: [
    {
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: IconDashboard,
        },
      ],
    },
    {
      title: "Master Data",
      items: [
        {
          title: "Users",
          url: "/admin/dashboard/users",
          icon: IconUsers,
        },
        {
          title: "Properties",
          url: "/admin/dashboard/properties",
          icon: IconHome,
        },
        {
          title: "Agents",
          url: "/admin/dashboard/agents",
          icon: IconUsers,
        },
        {
          title: "Owners",
          url: "/admin/dashboard/owners",
          icon: IconHome,
        },
      ],
    },
    {
      title: "Interests",
      items: [
        {
          title: "Property Interests",
          url: "/admin/dashboard/property-interests",
          icon: IconListDetails,
        },
        {
          title: "Street Interests",
          url: "/admin/dashboard/streets",
          icon: IconListDetails,
        },
      ],
    },
    {
      title: "Bids",
      items: [
        {
          title: "Direct Bids",
          url: "/admin/dashboard/direct-bids",
          icon: IconTable,
        },
        {
          title: "Postcards",
          url: "/admin/dashboard/postcards",
          icon: IconMail,
        },
        {
          title: "Brokers",
          url: "/admin/dashboard/brokers",
          icon: IconTable,
        },
      ],
    },
    {
      title: "Chat",
      items: [
        {
          title: "Support Chats",
          url: "/admin/dashboard/chats",
          icon: IconMessage,
        },
        {
          title: "User Reports",
          url: "/admin/dashboard/reports",
          icon: IconReport,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/dashboard/settings",
      icon: IconSettings,
    },
    // {
    //   title: "Get Help",
    //   url: "#",
    //   icon: IconHelp,
    // },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch,
    // },
  ],
  // documents: [
  //   {
  //     name: "Data Library",
  //     url: "#",
  //     icon: IconDatabase,
  //   },
  //   {
  //     name: "Reports",
  //     url: "#",
  //     icon: IconReport,
  //   },
  //   {
  //     name: "Word Assistant",
  //     url: "#",
  //     icon: IconFileWord,
  //   },
  // ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string;
    email?: string;
    avatar: string;
  };
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#" className="flex items-baseline gap-2 px-2 py-3">
                {/* <IconInnerShadowTop className="!size-5" /> */}
                <Image
                  src="/images/logo-icon.svg"
                  alt="logo"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold">Cribbit Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={data.navGroups} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} /> {/* Pass the user prop here */}
      </SidebarFooter>
    </Sidebar>
  );
}
