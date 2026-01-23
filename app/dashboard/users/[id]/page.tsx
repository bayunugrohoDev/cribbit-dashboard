// import EditUser from "@/components/EditUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import {
  BadgeCheck,
  Candy,
  Citrus,
  MessageCircle,
  MessageCircleIcon,
  Shield,
} from "lucide-react";
import AppLineChart from "./_components/history-login-chart";
import { UserBids } from "./_components/bid-list";

const SingleUsersPage = () => {
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
            <BreadcrumbPage>Bayu Nugroho</BreadcrumbPage>
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
                    src="https://github.com/shadcn.png"
                    alt="user-icon"
                  />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>

                <h1 className="text-xl font-semibold">Bayu Nugroho</h1>
              </div>
              <div>
                <div className="flex items-center gap-1 mt-2">
                  <MessageCircleIcon />
                  Message
                </div>
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground text-justify">
              Hi, Good morning
            </p>
          </div>
          {/* User Card Container */}

          {/* Information Container */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">User Information</h1>

              {/* <Sheet>
                <SheetTrigger asChild>
                  <Button>Edit User</Button>
                </SheetTrigger>

                <EditUser />
              </Sheet> */}
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
                <span>Bayu Nugroho</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">Email:</span>
                <span>bayu@gmail.com</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">Phone:</span>
                <span>+70 1689 190142</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">Address:</span>
                <span>Stockholm, SE</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">City:</span>
                <span>Stockholm</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              joined on 2025.01.01
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
            <UserBids />
          </div>
          {/* Table Container */}
        </div>
      </div>
    </div>
  );
};

export default SingleUsersPage;
