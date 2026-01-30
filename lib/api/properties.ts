import { propertySchemaDetail } from "@/app/dashboard/properties/[propertyId]/_components/schema";
import { propertySchema } from "@/app/dashboard/properties/_components/schema";
import { z } from "zod";

export const fetchProperties = async () => {
  const response = await fetch("/api/bids");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = properties
  
  return z.array(propertySchema).parse(data);
};
export const properties = [
    {
      id: "PROP-001",
      title: "Luxury Villa Stockholm",
      route: "Elmegatan",
      streetNumber: "12A",
      postal_town: "Stockholm",
      owner: "Olivia Martin",
      agent: "Budi Agent",
      source: "Agent Post",
      status: "Active", // Properti resmi yang sedang tayang
      listingPrice: 5500000,
      currentHighestBid: 5700000,
      total_bids: 12,
      date: "2024-07-20T10:30:00Z",
    },
    {
      id: "PROP-002",
      title: "Potensial Lot - Björkvägen",
      route: "Björkvägen",
      streetNumber: "5",
      postal_town: "Göteborg",
      owner: "-", // Belum ada pemilik terdaftar
      agent: "-", // Belum ada agen ditugaskan
      source: "User Post",
      status: "Requested", // Kondisi: User ngebid di map, butuh agen untuk follow up
      listingPrice: 0,
      currentHighestBid: 1200000,
      total_bids: 4,
      date: "2024-07-21T11:00:00Z",
    },
    {
      id: "PROP-003",
      title: "Modern Apartment Malmö",
      route: "Vasagatan",
      streetNumber: "3",
      postal_town: "Malmö",
      owner: "William Kim",
      agent: "Sarah Agent",
      source: "Agent Post",
      status: "Pending", // Kondisi: Sedang proses verifikasi dokumen atau nego akhir
      listingPrice: 3200000,
      currentHighestBid: 3450000,
      total_bids: 8,
      date: "2024-07-22T09:15:00Z",
    },
    {
      id: "PROP-004",
      title: "Vintage House Uppsala",
      route: "Storgatan",
      streetNumber: "10",
      postal_town: "Uppsala",
      owner: "Sofia Davis",
      agent: "Budi Agent",
      source: "Agent Post",
      status: "Sold", // Kondisi: Transaksi sudah selesai
      listingPrice: 4100000,
      currentHighestBid: 4500000,
      total_bids: 15,
      date: "2024-07-15T08:00:00Z",
    },
    {
      id: "PROP-005",
      title: "Hot Spot - Kungsgatan",
      route: "Kungsgatan",
      streetNumber: "7",
      postal_town: "Linköping",
      owner: "-",
      agent: "Sarah Agent", // Kondisi: Requested yang sudah mulai diproses oleh agen
      source: "User Post",
      status: "Requested",
      listingPrice: 0,
      currentHighestBid: 950000,
      total_bids: 2,
      date: "2024-07-23T14:05:00Z",
    },
  ];



export type PropertyDetail = z.infer<typeof propertySchemaDetail>;

export const fetchPropertiesDetail = async (propertyId: string): Promise<PropertyDetail> => {
  const response = await fetch(`/api/properties/${propertyId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return propertySchemaDetail.parse(data);
};
