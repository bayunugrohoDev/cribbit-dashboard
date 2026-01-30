"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";

import { fetchBidsByUserId } from "@/lib/api/bids";
import { fetchUserWithAuthById } from "@/lib/api/users";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  Candy,
  Citrus,
  MessageCircleIcon,
  Shield,
} from "lucide-react";
import { useParams } from "next/navigation";
import AppLineChart from "./_components/history-login-chart";
import { UserBids } from "./_components/bid-list";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

const SingleUsersPage = () => {
  const params = useParams<{ id: string }>();

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["user", params.id],
    queryFn: () => fetchUserWithAuthById(params.id),
    enabled: !!params.id,
  });

  const {
    data: bids,
    isLoading: isBidsLoading,
    isError: isBidsError,
  } = useQuery({
    queryKey: ["bids", params.id],
    queryFn: () => fetchBidsByUserId(params.id),
    enabled: !!params.id,
  });

  if (isUserLoading || isBidsLoading) {
    return <LoadingSkeleton />;
  }

  if (isUserError || isBidsError) {
    return <div>Error loading data</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/users">Users</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{user.full_name || "-"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Container */}
      <div className="mt-4 flex flex-col xl:flex-row gap-8">
        {/* Left */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/* User Badges Container */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">User Badge</h1>
            <div className="flex gap-4 mt-4">
              <HoverCard>
                <HoverCardTrigger>
                  <BadgeCheck
                    size={36}
                    className="rounded-full bg-blue-500/30 border-1 border-blue-500/50 p-2 cursor-pointer"
                  />
                </HoverCardTrigger>

                <HoverCardContent>
                  <h1 className="font-bold mb-2">Verified Users</h1>
                  <p className="text-sm text-muted-foreground">
                    The user has been verified by the admin.
                  </p>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger>
                  <Shield
                    size={36}
                    className="rounded-full bg-green-500/30 border-1 border-green-500/50 p-2 cursor-pointer"
                  />
                </HoverCardTrigger>

                <HoverCardContent>
                  <h1 className="font-bold mb-2">Admin</h1>
                  <p className="text-sm text-muted-foreground">
                    Admin must have access to all features and can manage users.
                  </p>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger>
                  <Candy
                    size={36}
                    className="rounded-full bg-yellow-500/30 border-1 border-yellow-500/50 p-2 cursor-pointer"
                  />
                </HoverCardTrigger>

                <HoverCardContent>
                  <h1 className="font-bold mb-2">Agent</h1>
                  <p className="text-sm text-muted-foreground">
                    The user has been registered as an agent in the system.
                  </p>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger>
                  <Citrus
                    size={36}
                    className="rounded-full bg-orange-500/30 border-1 border-orange-500/50 p-2 cursor-pointer"
                  />
                </HoverCardTrigger>

                <HoverCardContent>
                  <h1 className="font-bold mb-2">Popular</h1>
                  <p className="text-sm text-muted-foreground">
                    The user has been popular in the Community.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          {/* User Badges Container */}

          {/* User Card Container */}
          <div className="bg-primary-foreground p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 justify-between">
              <div>
                <Avatar className="size-12">
                  <AvatarImage
                    src={user.avatar_url || ""}
                    alt="user-icon"
                  />
                  <AvatarFallback>
                    {user.full_name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <h1 className="text-xl font-semibold">
                  {user.full_name || "-"}
                </h1>
              </div>
              <div>
                <div className="flex items-center gap-1 mt-2">
                  <MessageCircleIcon />
                  Message
                </div>
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground text-justify">
              -
            </p>
          </div>
          {/* User Card Container */}

          {/* Information Container */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">User Information</h1>
            </div>

            <div className="space-y-4 mt-4">
              <div className="flex flex-col gap-2 mb-8">
                <p className="text-sm text-muted-foreground">
                  Profile Completion
                </p>
                <Progress value={66} />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">Full Name:</span>
                <span>{user.full_name || "-"}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">Email:</span>
                <span>{user.email || "-"}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">Phone:</span>
                <span>-</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">Address:</span>
                <span>-</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">City:</span>
                <span>-</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              joined on {new Date(user.registered_at || "").toLocaleDateString()}
            </p>
          </div>
          {/* Information Container */}
        </div>

        {/* Right */}
        <div className="w-full xl:w-2/3 space-y-6">
          {/* Chart Container */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">User Activity</h1>
            <AppLineChart />
          </div>
          {/* Chart Container */}

          {/* Table Container */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">Bids</h1>
            <UserBids bids={bids} />
          </div>
          {/* Table Container */}
        </div>
      </div>
    </div>
  );
};

export default SingleUsersPage;
