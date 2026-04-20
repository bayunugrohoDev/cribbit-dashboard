"use client";

import React from "react";
import Link from "next/link";
import Head from "next/head";
import { ArrowRight, Building2, ArrowUpRight } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Cribbit | The Gateway to Real Estate Excellence</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;600;700&display=swap');
          
          .editorial-shadow {
              box-shadow: 0 20px 40px -15px rgba(26, 29, 20, 0.06);
          }
          .signature-gradient {
              background: linear-gradient(135deg, #7ba0f1 0%, #345ca8 100%);
          }
        `,
        }}
      />

      <div className="bg-[#E6E7D9] text-[#1a1d14] font-['Inter',sans-serif] selection:bg-[#7ba0f1] selection:text-[#00357b] min-h-screen">
        {/* TopAppBar */}
        <header className="fixed top-0 w-full z-50 bg-[#E6E7D9]/80 backdrop-blur-xl">
          <nav className="flex justify-between items-center w-full px-8 py-6 max-w-screen-2xl mx-auto">
            <div className="text-3xl font-['Noto_Serif',serif] font-bold text-[#BC5B1D]">
              Cribbit
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                className="text-[#1a1d14]/60 hover:text-[#1a1d14] transition-colors font-['Inter',sans-serif]"
                href="#"
              >
                Portfolio
              </a>
              <a
                className="text-[#1a1d14]/60 hover:text-[#1a1d14] transition-colors font-['Inter',sans-serif]"
                href="#"
              >
                Insights
              </a>
              <a
                className="text-[#1a1d14]/60 hover:text-[#1a1d14] transition-colors font-['Inter',sans-serif]"
                href="#"
              >
                Atelier
              </a>
            </div>
            <div className="flex items-center gap-4">
              {/* <Link
                href="/login"
                className="text-[#1a1d14]/60 hover:text-[#1a1d14] transition-colors font-['Inter',sans-serif] px-4 py-2"
              >
                Sign In
              </Link> */}
              <Link
                href="/register-agent"
                className="bg-[#1a1d14] text-[#E6E7D9] px-6 py-2 rounded-full font-['Noto_Serif',serif] text-sm border border-[#1a1d14] hover:opacity-80 transition-all active:scale-95"
              >
                Agent Apply
              </Link>
            </div>
          </nav>
        </header>

        <main className="min-h-screen pt-24">
          {/* Hero Section: Split Screen Layout */}
          <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[921px] w-full">
            {/* Left: Brand & Intent */}
            <div className="flex flex-col justify-center px-8 lg:px-24 py-16 bg-[#E6E7D9]">
              <div className="max-w-xl">
                <span className="inline-block px-4 py-1 mb-8 rounded-full bg-[#e8e9db] text-[#345ca8] font-['Inter',sans-serif] text-xs uppercase tracking-widest">
                  Digital Atelier
                </span>
                <h1 className="text-5xl lg:text-7xl font-['Noto_Serif',serif] font-bold leading-[1.1] text-[#1a1d14] tracking-tight mb-8">
                  The Gateway to Real Estate Excellence
                </h1>
                <p className="text-xl text-[#434751] font-['Inter',sans-serif] leading-relaxed mb-12">
                  Don’t miss your dream home. Your dream home isn’t always
                  listed when you’re ready. Cribbit helps you quietly keep track
                  – so you’re first when it matters.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Login to Dashboard Button */}
                  {/* <Link
                    href="/login"
                    className="group relative flex items-center justify-center gap-3 px-8 py-5 rounded-full signature-gradient text-[#E6E7D9] font-['Noto_Serif',serif] text-lg border border-[#1a1d14] editorial-shadow transition-transform active:scale-95"
                  >
                    Login to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link> */}
                  {/* Become an Agent Button */}
                  <Link
                    href="/register-agent"
                    className="flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#ffffff] text-[#1a1d14] font-['Noto_Serif',serif] text-lg border border-[#c3c6d3] hover:bg-[#f4f5e6] transition-all active:scale-95"
                  >
                    Agent Apply
                  </Link>
                </div>
              </div>
            </div>
            {/* Right: Architectural Visual */}
            <div className="relative overflow-hidden lg:rounded-l-xl">
              <img
                alt="Luxury architectural residence"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDair0z_S-lD7-7TcGeUiDCFEsYJYtSDNvN_323Cs5mROrakgSF-8z3ImzCN2uYx_gPe4IcUpIcjvCd14gyAXHlaitxTvy8UQBkNi2wXBHup2HZ1uMVlORjvBtMFHRXqG0L9yhyNpItMCbRC1BkmGY6hxrm4-P-NL7m2Io1QtejfOwKhlzJt8-ofn5ceZN-fTrz2a6BL-RGBTzlLcL7nhcn6lQxq_8NwBBHHPrAEZasXFIkPYhpY6xcRz0io6qsnqMETEGB7Uup3xUp"
              />
              {/* Glass Overlay Detail */}
              <div className="absolute bottom-12 left-12 right-12 p-8 rounded-xl bg-[#E6E7D9]/20 backdrop-blur-md border border-[#E6E7D9]/30 hidden md:block">
                <div className="flex items-center gap-4 text-[#E6E7D9]">
                  <div className="w-12 h-12 rounded-full bg-[#7ba0f1] flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#00357b]" />
                  </div>
                  <div>
                    <p className="font-['Noto_Serif',serif] italic text-lg leading-none">
                      Curated Spaces
                    </p>
                    <p className="font-['Inter',sans-serif] text-sm opacity-80">
                      Managing over $2.4B in elite assets
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Path Selection: Bento Grid Layout */}
          <section className="py-24 px-8 max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Large Feature Card */}
              <div className="md:col-span-8 bg-[#f4f5e6] rounded-xl p-12 flex flex-col justify-between min-h-[400px]">
                <div>
                  <h3 className="text-3xl font-['Noto_Serif',serif] mb-4">
                    Track homes off-market
                  </h3>
                  <p className="text-[#434751] max-w-md">
                    Add any home to your watchlist. Reach out to the owner
                    whenever you want – or get notified if it’s listed.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 mt-8">
                  <div className="px-4 py-2 rounded-full bg-[#e8e9db] border border-[#c3c6d3]/20 text-xs font-['Inter',sans-serif]">
                    Off-Market Insights
                  </div>
                  <div className="px-4 py-2 rounded-full bg-[#e8e9db] border border-[#c3c6d3]/20 text-xs font-['Inter',sans-serif]">
                    Direct Communication
                  </div>
                  <div className="px-4 py-2 rounded-full bg-[#e8e9db] border border-[#c3c6d3]/20 text-xs font-['Inter',sans-serif]">
                    Smart Notifications
                  </div>
                </div>
              </div>
              {/* Image Card */}
              <div className="md:col-span-4 h-full min-h-[400px] rounded-xl overflow-hidden relative">
                <img
                  alt="Skyscraper glass detail"
                  className="absolute inset-0 w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDshguIAGpnJYe2VNg9ur7KlcrQ9yrmFynYL4Bf9CfgyQS-ngs5_F0vnLUYQhgDi6lo81Yew1KBXi9daeJ4H6KXSj_rU0OQnjJLMDMj4rnpPGDm5BDQXBrEDVvSK4zSuXTL-YSF7H_31d0o7jB_s7-O7Pm9FOHIO3H2L-HxXgiwPToNoesRdU78mcIMW5czw_FE6eAK2hzotNddljFvOe9ZqoAKH7hMvPwqX-JF1FzBe4BCw25vd23MQX2tGABzrcLOwTnLURrurcop"
                />
                <div className="absolute inset-0 bg-[#345ca8]/20 mix-blend-multiply"></div>
              </div>
              {/* Agent Card */}
              <div className="md:col-span-5 h-full min-h-[400px] rounded-xl overflow-hidden relative">
                <img
                  alt="Minimalist office interior"
                  className="absolute inset-0 w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTAZoCY9Cl-HDpNJUbkABAWw8Rf1RMIgIOi1aicK3je2wWG2wPUxHcte1MLZPHWMUkhBUbCSefK-RqC40YaALvoWfOjZ555zFqqVqbJxVIBhAiH1BnkCRr-dWZzH4aVunzwdJ0YrqgB7mglf7Y56WFkqDyIkGaDFgp2g5Xbr2BPm4Dx4OYKtXJpKImBdUMigPChfkuJ1cSV6w7ikjsPGNmC5vdY7ebKyNjUmKBGbpSQ8JynznmPeGRZphoyms2yDQB_RkecxsOf8W-"
                />
              </div>
              {/* Network Card */}
              <div className="md:col-span-7 bg-[#1a1d14] text-[#E6E7D9] rounded-xl p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-['Noto_Serif',serif] mb-4">
                  The Elite Network
                </h3>
                <p className="text-[#E6E7D9]/70 max-w-lg mb-8 leading-relaxed">
                  Join a community of the world's most accomplished real estate
                  professionals. Access off-market listings and exclusive
                  brokerage tools designed for high-velocity closings.
                </p>
                <Link
                  href="/register-agent"
                  className="inline-flex items-center gap-2 text-[#7ba0f1] font-['Noto_Serif',serif] italic hover:gap-4 transition-all"
                >
                  Inquire about partnership
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Stats Section (Tonal Shift) */}
          <section className="bg-[#f4f5e6] py-24">
            <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              <div>
                <p className="text-4xl font-['Noto_Serif',serif] mb-2">
                  $14.2B
                </p>
                <p className="font-['Inter',sans-serif] text-xs uppercase tracking-widest text-[#434751]">
                  Asset Volume
                </p>
              </div>
              <div>
                <p className="text-4xl font-['Noto_Serif',serif] mb-2">
                  1,200+
                </p>
                <p className="font-['Inter',sans-serif] text-xs uppercase tracking-widest text-[#434751]">
                  Global Partners
                </p>
              </div>
              <div>
                <p className="text-4xl font-['Noto_Serif',serif] mb-2">42</p>
                <p className="font-['Inter',sans-serif] text-xs uppercase tracking-widest text-[#434751]">
                  Primary Markets
                </p>
              </div>
              <div>
                <p className="text-4xl font-['Noto_Serif',serif] mb-2">98%</p>
                <p className="font-['Inter',sans-serif] text-xs uppercase tracking-widest text-[#434751]">
                  Retention Rate
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#f4f5e6] w-full py-12 px-8 border-t border-[#1a1d14]/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-screen-2xl mx-auto">
            <div className="text-lg font-['Noto_Serif',serif] text-[#1a1d14]">
              Cribbit
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-['Inter',sans-serif] tracking-wide">
              <a
                className="text-[#1a1d14]/50 hover:text-[#345ca8] transition-colors"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-[#1a1d14]/50 hover:text-[#345ca8] transition-colors"
                href="#"
              >
                Terms of Service
              </a>
              <a
                className="text-[#1a1d14]/50 hover:text-[#345ca8] transition-colors"
                href="#"
              >
                Contact
              </a>
              <a
                className="text-[#1a1d14]/50 hover:text-[#345ca8] transition-colors"
                href="#"
              >
                Accessibility
              </a>
            </div>
            <div className="text-[#1a1d14]/50 text-sm font-['Inter',sans-serif]">
              © 2024 Cribbit Realty Group. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
