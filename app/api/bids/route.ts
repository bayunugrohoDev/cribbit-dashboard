import { NextResponse } from "next/server";

const bidsData = [
  {
    id: "BID-8782",
    userName: "Olivia Martin",
    userAvatar: "/images/avatars/01.png",
    price_min: 2500000,
    price_max: 2700000,
    date: "2024-07-20T10:30:00Z",
    status: "Outbid",
  },
  {
    id: "BID-7878",
    userName: "Jackson Lee",
    userAvatar: "/images/avatars/02.png",
    price_min: 2800000,
    price_max: 3000000,
    date: "2024-07-20T11:00:00Z",
    status: "Winning",
  },
  {
    id: "BID-4567",
    userName: "Isabella Nguyen",
    userAvatar: "/images/avatars/03.png",
    price_min: 2600000,
    price_max: 2650000,
    date: "2024-07-20T11:15:00Z",
    status: "Outbid",
  },
  {
    id: "BID-9876",
    userName: "William Kim",
    price_min: 3100000,
    price_max: 3200000,
    date: "2024-07-21T09:00:00Z",
    status: "Accepted",
  },
  {
    id: "BID-2345",
    userName: "Sofia Davis",
    userAvatar: "/images/avatars/05.png",
    price_min: 2900000,
    price_max: 2950000,
    date: "2024-07-21T09:05:00Z",
    status: "Outbid",
  },
  {
    id: "BID-3456",
    userName: "Ethan Brown",
    price_min: 3050000,
    price_max: 3150000,
    date: "2024-07-22T10:00:00Z",
    status: "Pending",
  },
  {
    id: "BID-5678",
    userName: "Mia Wilson",
    userAvatar: "/images/avatars/06.png",
    price_min: 3060000,
    price_max: 3100000,
    date: "2024-07-22T11:30:00Z",
    status: "Pending",
  },
];

export async function GET() {
  // In a real app, you would fetch this from a database.
  // Here, we're returning the hardcoded array after a short delay to simulate a network request.
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return NextResponse.json(bidsData);
}
