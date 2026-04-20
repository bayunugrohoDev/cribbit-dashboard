"use client";

import React, { useState } from "react";
import Head from "next/head";
import { submitApplication } from "@/app/actions/applications";
import { useFormStatus } from "react-dom";
import { CheckCircle2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="w-full relative px-[36px] py-[22px] bg-[#000000] text-white text-[20px] font-serif tracking-tight rounded-[33px] border border-black shadow-lg hover:shadow-xl hover:bg-black/90 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group overflow-hidden"
      type="submit"
      disabled={pending}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-black/20 pointer-events-none" />
      <span className="relative z-10 leading-[22px]">
        {pending ? "Submitting..." : "Submit Application"}
      </span>
    </button>
  );
}

export default function RegisterAgentPage() {
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  async function handleAction(formData: FormData) {
    setStatus(null);
    const result = await submitApplication(formData);
    setStatus(result);
  }

  return (
    <>
      <Head>
        <title>Register as Agent | Cribbit</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300..900;1,300..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap');
        
        .font-sans { font-family: "Source Sans 3", sans-serif; }
        .font-serif { font-family: "Source Serif 4", serif; }

        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
            -moz-osx-font-smoothing: grayscale;
            font-feature-settings: 'liga';
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .form-input-focus {
            transition: all 0.3s ease;
        }
        .form-input-focus:focus {
            background-color: #fff;
            border-color: #7BA0F1;
            box-shadow: 0 0 0 4px rgba(123, 160, 241, 0.1);
        }
      `,
        }}
      />
      <div className="bg-[#fafaec] text-[#2d3436] min-h-screen flex flex-col items-center font-sans">
        {/* TopNavBar (Shared Component) */}
        <header className="bg-[#FEFAF3] antialiased tracking-tight docked full-width top-0 z-50 shadow-none w-full border-b border-[#dfe6e9]/30">
          <nav className="flex justify-between items-center px-8 h-20 w-full max-w-[1440px] mx-auto">
            <div className="text-2xl font-bold tracking-tighter text-[#2d3436] font-serif">
              Cribbit
            </div>
            {/* <div className="hidden md:flex items-center gap-8 font-semibold">
              <a className="text-[#636e72] hover:text-[#7BA0F1] transition-colors" href="#">Marketplace</a>
              <a className="text-[#636e72] hover:text-[#7BA0F1] transition-colors" href="#">Insights</a>
              <a className="text-[#636e72] hover:text-[#7BA0F1] transition-colors" href="#">Properties</a>
              <a className="text-[#636e72] hover:text-[#7BA0F1] transition-colors" href="#">About</a>
            </div> */}
            {/* <div className="flex items-center gap-4">
              <a
                href="/login"
                className="px-6 py-2 rounded-full border border-[#2d3436] text-[#2d3436] font-bold text-sm hover:bg-[#2d3436] hover:text-white transition-colors"
              >
                Log In
              </a>
            </div> */}
          </nav>
        </header>

        <main className="flex-grow w-full flex items-center justify-center p-6 md:p-12">
          {/* Centered Single Column Layout */}
          <div className="w-full max-w-2xl">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-[#2d3436] tracking-tight mb-4 font-serif">
                Join Cribbit as an Agent
              </h1>
              <p className="text-[#636e72] text-lg">
                Create your broker profile to start managing and claiming
                properties.
              </p>
            </div>

            {/* Form Card Wrapper */}
            <div className="bg-[#ffffff] rounded-2xl shadow-[0px_10px_50px_rgba(45,52,54,0.04)] border border-[#dfe6e9]/50 p-8 md:p-14">
              {status?.success ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {/* <span className="material-symbols-outlined text-3xl">
                      check_circle
                    </span> */}
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-green-800">
                    Application Received!
                  </h3>
                  <p className="text-green-700 leading-relaxed max-w-md mx-auto">
                    {status.message}
                  </p>
                </div>
              ) : (
                <form className="space-y-12" action={handleAction}>
                  {status?.success === false && (
                    <div className="p-4 text-sm font-semibold text-red-700 bg-red-50/80 rounded-xl text-center border border-red-100 flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">
                        error
                      </span>
                      {status.message}
                    </div>
                  )}

                  {/* Section 1: Personal Information */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-8 bg-[#7BA0F1] rounded-full"></div>
                      <h2 className="text-xl font-bold text-[#2d3436] font-serif">
                        Personal Information
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#636e72]/80 ml-1">
                          Full Legal Name
                        </label>
                        <input
                          name="fullName"
                          required
                          className="w-full bg-[#FEFAF3]/50 border border-[#dfe6e9] rounded-lg px-5 py-4 form-input-focus outline-none placeholder:text-[#636e72]/40 text-[#2d3436]"
                          placeholder="John Doe"
                          type="text"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="block text-xs font-bold uppercase tracking-widest text-[#636e72]/80 ml-1">
                            Work Email Address
                          </label>
                          <input
                            name="email"
                            required
                            className="w-full bg-[#FEFAF3]/50 border border-[#dfe6e9] rounded-lg px-5 py-4 form-input-focus outline-none placeholder:text-[#636e72]/40 text-[#2d3436]"
                            placeholder="john@agency.com"
                            type="email"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-xs font-bold uppercase tracking-widest text-[#636e72]/80 ml-1">
                            Phone Number
                          </label>
                          <input
                            name="phone"
                            className="w-full bg-[#FEFAF3]/50 border border-[#dfe6e9] rounded-lg px-5 py-4 form-input-focus outline-none placeholder:text-[#636e72]/40 text-[#2d3436]"
                            placeholder="+1 (555) 000-0000"
                            type="tel"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Professional Details */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-8 bg-[#7BA0F1] rounded-full"></div>
                      <h2 className="text-xl font-bold text-[#2d3436] font-serif">
                        Professional Details
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="block text-xs font-bold uppercase tracking-widest text-[#636e72]/80 ml-1">
                            Agency / Company Name
                          </label>
                          <input
                            name="companyName"
                            className="w-full bg-[#FEFAF3]/50 border border-[#dfe6e9] rounded-lg px-5 py-4 form-input-focus outline-none placeholder:text-[#636e72]/40 text-[#2d3436]"
                            placeholder="Luxe Realty Group"
                            type="text"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-xs font-bold uppercase tracking-widest text-[#636e72]/80 ml-1">
                            Real Estate License Number
                          </label>
                          <input
                            name="licenseNumber"
                            className="w-full bg-[#FEFAF3]/50 border border-[#dfe6e9] rounded-lg px-5 py-4 form-input-focus outline-none placeholder:text-[#636e72]/40 text-[#2d3436]"
                            placeholder="RE-992834-X"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#636e72]/80 ml-1">
                          Short Bio / Description
                        </label>
                        <textarea
                          name="bio"
                          className="w-full bg-[#FEFAF3]/50 border border-[#dfe6e9] rounded-lg px-5 py-4 form-input-focus outline-none placeholder:text-[#636e72]/40 resize-none text-[#2d3436]"
                          placeholder="Briefly describe your expertise and focus areas..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Agreements & Action */}
                  <div className="pt-8 space-y-10">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="mt-1 relative">
                        <input
                          required
                          className="peer h-5 w-5 rounded border-[#dfe6e9] text-[#7BA0F1] focus:ring-[#7BA0F1] transition-all cursor-pointer"
                          type="checkbox"
                        />
                      </div>
                      <span className="text-sm text-[#636e72] leading-relaxed">
                        I agree to the{" "}
                        <a
                          className="text-[#7BA0F1] font-bold hover:underline"
                          href="#"
                        >
                          Agent Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          className="text-[#7BA0F1] font-bold hover:underline"
                          href="#"
                        >
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>

                    <SubmitButton />
                  </div>
                </form>
              )}

              {/* <div className="mt-14 pt-8 border-t border-[#dfe6e9]/40 text-center">
                <p className="text-[#636e72]">
                  Already have an account?
                  <a
                    className="text-[#7BA0F1] font-bold ml-1 hover:underline flex-inline items-center"
                    href="/login"
                  >
                    Log in here
                  </a>
                </p>
              </div> */}
            </div>
          </div>
        </main>

        {/* Footer (Shared Component) */}
        <footer className="bg-[#fafaec] text-xs uppercase tracking-widest w-full py-8 mt-auto">
          <div className="border-t border-[#dfe6e9]/30 flex flex-col md:flex-row justify-between items-center px-12 w-full py-10">
            <div className="text-[#636e72] mb-4 md:mb-0">
              © 2024 Cribbit Real Estate. All rights reserved.
            </div>
            <div className="flex gap-10 font-bold">
              <a
                className="text-[#636e72] hover:text-[#7BA0F1] transition-colors"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-[#636e72] hover:text-[#7BA0F1] transition-colors"
                href="#"
              >
                Terms of Service
              </a>
              <a
                className="text-[#636e72] hover:text-[#7BA0F1] transition-colors"
                href="#"
              >
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
