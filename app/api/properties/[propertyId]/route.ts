import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ propertyId: string }> } // Ubah tipe data jadi Promise
) {
  // 1. Unwrapped params menggunakan await
  const { propertyId } = await params;
  
  console.log('propertyId:', propertyId);

  const supabase = await createClient();

  try {
    const { data: location, error: locationError } = await supabase
      .from("locations")
      .select(`*`) // Select all columns from the locations table
      .eq("id", propertyId)
      .single();

    if (locationError) {
      console.error("Error fetching location:", locationError);
      throw locationError;
    }

    if (!location) {
      return new Response(
        JSON.stringify({ message: "Location not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return NextResponse.json(location);
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(
      JSON.stringify({
        message: "Error fetching location",
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}