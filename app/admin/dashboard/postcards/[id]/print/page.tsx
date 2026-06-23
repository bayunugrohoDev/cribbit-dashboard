import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import PrintButton from "./PrintButton"; // We'll create this to handle window.print() client-side
import { headers } from "next/headers";

export default async function PrintPostcardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    "app.cribbit.se";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const { data: order, error } = await supabase
    .from("postcard_orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) {
    return (
      <div className="p-8 text-center text-red-500">Postcard not found</div>
    );
  }

  // Fetch related profile and location manually
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", order.user_id)
    .single();

  let location = null;
  if (order.location_id) {
    const { data: locData } = await supabase
      .from("locations")
      .select("street, street_number, city")
      .eq("id", order.location_id)
      .single();
    location = locData;
  }

  const userName = profile?.full_name || profile?.email || "Cribbit User";
  const route = location?.street || "";
  const streetNumber = location?.street_number || "";
  const postalTown = location?.city || "";
  const addressLine1 = `${route} ${streetNumber}`.trim();
  const qrToken = order.qr_token || "";
  console.log(qrToken);
  // Truncate qrToken if it's from an old order (64 chars) to prevent layout break
  const displayPin = qrToken.length > 8 ? qrToken.substring(0, 6) : qrToken;

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col items-center">
      <div className="mb-8 print:hidden text-center flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Print Postcard</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          Make sure your printer settings are set to A6 landscape (148 x 105 mm)
          with no margins.
        </p>
        <PrintButton />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #postcard-container, #postcard-container * {
            visibility: visible;
          }
          #postcard-container {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            size: A6 landscape;
            margin: 0;
          }
        }
      `,
        }}
      />

      {/* Postcard Container (A6 Size: 148mm x 105mm) */}
      <div
        id="postcard-container"
        className="w-[148mm] h-[105mm] bg-white border border-slate-200 shadow-lg relative overflow-hidden flex"
      >
        {/* Left side: Message */}
        <div className="w-1/2 p-6 border-r border-slate-200 flex flex-col justify-between bg-slate-50">
          <div>
            <h2 className="font-bold text-2xl mb-4 text-slate-800">Hej!</h2>
            <p className="text-[13px] text-slate-700 leading-relaxed mb-4">
              Jag är väldigt intresserad av din bostad på{" "}
              <strong>{addressLine1}</strong> och vill gärna komma i kontakt med
              dig.
            </p>
            <p className="text-[13px] text-slate-700 leading-relaxed">
              Skanna QR-koden till höger med din mobilkamera för att se mitt bud
              eller kontakta mig direkt, helt diskret.
            </p>
          </div>
          <div className="mt-4">
            <p className="text-[12px] font-semibold text-slate-800">
              Med vänlig hälsning,
            </p>
            <p className="text-[12px] text-slate-600">{userName}</p>
            <p className="text-[10px] text-slate-400 mt-2">via Cribbit.se</p>
          </div>
        </div>

        {/* Right side: Address & QR */}
        <div className="w-1/2 p-6 flex flex-col relative bg-white">
          {/* Stamp placeholder */}
          <div className="absolute top-6 right-6 w-12 h-14 border border-slate-300 flex items-center justify-center text-[9px] text-slate-400">
            Frimärke
          </div>

          {/* QR Code */}
          <div className="mt-8 flex flex-col items-center self-start pl-4">
            <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm inline-block">
              <QRCodeSVG value={`${baseUrl}/p/${qrToken}`} size={90} />
            </div>
            <span className="text-[12px] mt-2 text-slate-900 font-bold tracking-widest uppercase">
              PIN: {displayPin}
            </span>
            <span className="text-[9px] mt-0.5 text-slate-500 font-medium tracking-wide">
              {host}
            </span>
          </div>

          {/* Address */}
          <div className="mt-auto mb-6 border-l-[3px] border-black pl-4 ml-6">
            <p className="text-[12px] font-medium text-slate-500 mb-1">
              Mottagare:
            </p>
            <p className="text-[15px] font-bold text-slate-900 leading-tight">
              Till boende på
            </p>
            <p className="text-[15px] font-semibold text-slate-800 leading-tight">
              {addressLine1}
            </p>
            <p className="text-[15px] font-semibold text-slate-800 leading-tight uppercase">
              {postalTown}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
