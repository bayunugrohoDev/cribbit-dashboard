import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import {
  X,
  Share,
  MoreVertical,
  Heart,
  Eye,
  Home,
  CircleDollarSign,
  MessageSquare,
} from "lucide-react";
import ClientRedirect from "./ClientRedirect";

export default async function PostcardLandingPage({
  params,
}: {
  params: Promise<{ qrToken: string }>;
}) {
  const { qrToken } = await params;
  const supabase = await createAdminClient();

  // Fetch the postcard order and location
  const { data: order, error } = await supabase
    .from("postcard_orders")
    .select("*, locations(*)")
    .eq("qr_token", qrToken)
    .single();

  if (error || !order) {
    return notFound();
  }

  // Fetch the buyer manually since the foreign key might be missing in types
  const { data: buyer } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", order.user_id)
    .single();

  const location = Array.isArray(order.locations)
    ? order.locations[0]
    : order.locations;
  const address = location
    ? `${location.street || ""} ${location.street_number || ""}`.trim()
    : "Laddar adress...";
  const city = location?.city || "";

  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
  const streetViewUrl =
    location?.latitude && location?.longitude && GOOGLE_API_KEY
      ? `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${location.latitude},${location.longitude}&key=${GOOGLE_API_KEY}`
      : `https://picsum.photos/400/300?random=${location?.id || 1}1`;

  const buyerName = buyer?.full_name || "En intressent";
  const avatarInitial = buyerName.charAt(0).toUpperCase();

  let finalAvatarUrl = null;
  if (buyer?.avatar_url) {
    if (buyer.avatar_url.startsWith("http")) {
      finalAvatarUrl = buyer.avatar_url;
    } else {
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(buyer.avatar_url);
      finalAvatarUrl = publicUrlData.publicUrl;
    }
  }

  const priceMin = order.price_min?.toLocaleString("sv-SE") || "0";
  const priceMax = order.price_max?.toLocaleString("sv-SE") || "0";

  // --- Statistics Logic ---
  const { data: houseBids } = await supabase
    .from("bids")
    .select("price_min, price_max, created_at")
    .eq("location_id", location?.id);

  const currentBidders = houseBids || [];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newBiddersLastWeek = currentBidders.filter(
    (b) => b.created_at && new Date(b.created_at) > oneWeekAgo
  ).length;

  let streetInterestCount: number | null = null;
  let valuationDifference: number | null = null;

  if (location?.street && location?.city) {
    const { data: streetLocs } = await supabase
      .from("locations")
      .select("id")
      .eq("street", location.street)
      .eq("city", location.city);

    if (streetLocs && streetLocs.length > 0) {
      const locIds = streetLocs.map((l: any) => l.id);

      const { count: watchCount } = await supabase
        .from("watches")
        .select("*", { count: "exact", head: true })
        .in("location_id", locIds);

      const { count: bidCount } = await supabase
        .from("bids")
        .select("*", { count: "exact", head: true })
        .in("location_id", locIds);

      streetInterestCount = (watchCount || 0) + (bidCount || 0);

      const { data: streetBids } = await supabase
        .from("bids")
        .select("price_min, price_max")
        .in("location_id", locIds);

      if (streetBids && streetBids.length > 0 && currentBidders.length > 0) {
        const sumStreet = streetBids.reduce((acc: number, bid: any) => acc + ((bid.price_min || 0) + (bid.price_max || 0)) / 2, 0);
        const avgStreet = sumStreet / streetBids.length;

        const sumHouse = currentBidders.reduce((acc: number, bid: any) => acc + ((bid.price_min || 0) + (bid.price_max || 0)) / 2, 0);
        const avgHouse = sumHouse / currentBidders.length;

        if (avgStreet > 0) {
          valuationDifference = Math.round(((avgHouse - avgStreet) / avgStreet) * 100);
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md bg-[#FDF9F1] shadow-2xl relative pb-24 overflow-y-auto overflow-x-hidden border-x border-slate-200">
        {/* Header Image Section */}
        <div className="w-full h-[320px] relative bg-gray-300">
          <img
            src={streetViewUrl}
            alt="Street View"
            className="w-full h-full object-cover"
          />
          {/* Close Button Placeholder */}
          {/* <div className="absolute top-[60px] right-4 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm">
            <X size={24} color="#000" />
          </div> */}
          {/* Share Button Placeholder */}
          <div className="absolute bottom-4 right-4 w-11 h-11 bg-[#D9AD7C] rounded-full flex items-center justify-center shadow-sm">
            <Share size={20} color="#000" />
          </div>
        </div>

        {/* Title Section */}
        <div className="px-6 pt-6 pb-2 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h1 className="text-[32px] font-serif text-black leading-tight tracking-tight">
              {address}
            </h1>
            <p className="text-[15px] text-gray-800 mt-1">{city}</p>
          </div>
          <div className="p-1 -mr-2">
            <MoreVertical size={28} color="#000" />
          </div>
        </div>

        {/* Intressenter Section */}
        <div className="px-5 mt-6">
          <div className="border-b border-gray-400 pb-2 mb-4">
            <h2 className="text-[14px] font-bold text-black tracking-tight">
              Intressenter
            </h2>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center gap-4 flex-1">
              {finalAvatarUrl ? (
                <div className="w-[42px] h-[42px] rounded-full bg-gray-200 overflow-hidden shrink-0 border border-black/10">
                  <img
                    src={finalAvatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-[42px] h-[42px] rounded-full bg-[#C7F1E8] flex items-center justify-center shrink-0 border border-black/10">
                  <span className="text-lg font-bold text-black">
                    {avatarInitial}
                  </span>
                </div>
              )}
              <div className="flex-1 justify-center">
                <p className="font-bold text-[14px] text-black truncate">
                  {buyerName}
                </p>
                <p className="text-black text-[14px] mt-0.5">
                  {priceMin} – {priceMax} kr
                </p>
              </div>
            </div>

            <div className="shrink-0 ml-2">
              <div className="w-11 h-8 rounded-[8px] bg-white flex items-center justify-center relative shadow-sm border border-slate-100">
                <MessageSquare
                  className="w-5 h-5 text-black"
                  strokeWidth={1.5}
                />
                <div className="absolute -top-1.5 -right-1.5 bg-[#66C66F] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-[1.5px] border-[#FDF9F1]">
                  <span className="text-[9px] text-black font-bold">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action at bottom */}
        <div className="px-12 mt-12 mb-8">
          <ClientRedirect qrToken={qrToken} />
        </div>

        {/* Statistik Section */}
        <div className="px-5 mt-10">
          <div className="border-b border-gray-400 pb-2 mb-4">
            <h2 className="text-[14px] font-bold text-black tracking-tight">
              Statistik
            </h2>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            <div className="flex items-center gap-4">
              <Heart size={28} color="#000" strokeWidth={1.5} />
              <p className="flex-1 font-sans text-[15px] text-black leading-5">
                {newBiddersLastWeek} nya intressenter senaste veckan.
              </p>
            </div>

            {streetInterestCount !== null && (
              <div className="flex items-center gap-4">
                <Home size={28} color="#000" strokeWidth={1.5} />
                <p className="flex-1 font-sans text-[15px] text-black leading-5">
                  {streetInterestCount} personer är intresserade av din gata.
                </p>
              </div>
            )}

            {valuationDifference !== null && (
              <div className="flex items-center gap-4">
                <CircleDollarSign size={28} color="#000" strokeWidth={1.5} />
                <p className="flex-1 font-sans text-[15px] text-black leading-5">
                  Intressenterna värderar ditt hus {valuationDifference > 0 ? `${valuationDifference}% högre` : `${Math.abs(valuationDifference)}% lägre`} än snittet på gatan.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
