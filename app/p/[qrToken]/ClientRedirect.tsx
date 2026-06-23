"use client";

export default function ClientRedirect({ qrToken }: { qrToken: string }) {
  const handleOpenApp = () => {
    // Try to open the app via deep link
    window.location.href = `cribbit://postcard/${qrToken}`;

    // Set a timeout to redirect to the app store if the app doesn't open
    setTimeout(() => {
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/android/i.test(userAgent)) {
        window.location.href =
          "https://play.google.com/store/apps/details?id=com.cribbit";
      } else if (
        /iPad|iPhone|iPod/.test(userAgent) &&
        !(window as any).MSStream
      ) {
        window.location.href = "https://apps.apple.com/app/cribbit/id123456789";
      } else {
        // Fallback
        window.location.href = "https://cribbit.se";
      }
    }, 2500);
  };

  return (
    <button
      onClick={handleOpenApp}
      className="w-full bg-[#18181B] hover:bg-black text-white rounded-[32px] py-5 text-[16px] font-bold shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
    >
      Skapa konto
    </button>
  );
}
