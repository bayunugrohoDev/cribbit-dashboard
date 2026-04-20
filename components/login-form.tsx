"use client";

import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/login/actions";
import Head from "next/head";
import { Lock, Mail } from "lucide-react";

// Submit Button styling based on cribbit-button.tsx (Solid Variant)
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full relative py-[22px] px-[36px] bg-[#000000] text-white text-[20px] font-serif tracking-tight rounded-[33px] border border-black shadow-lg hover:shadow-xl hover:bg-black/90 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group overflow-hidden`}
    >
      {/* Simulate the linear gradient from mobile app solid button */}
      <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-black/20 pointer-events-none" />
      <span className="relative z-10 leading-[22px]">
        {pending ? "Authenticating..." : "Log In"}
      </span>
    </button>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error");

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300..900;1,300..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap');
        
        .font-sans {
          font-family: "Source Sans 3", sans-serif;
        }
        .font-serif {
          font-family: "Source Serif 4", serif;
        }
        
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
      `,
        }}
      />
      <div className="bg-[#FEFAF3] text-[#2d3436] antialiased overflow-x-hidden min-h-screen flex flex-col font-sans">
        <main className="flex-grow flex flex-col md:flex-row w-full min-h-screen">
          {/* Left Column: Branding (Visible on Desktop, Top on Mobile) */}
          <section className="relative w-full md:w-1/2 flex items-center justify-center p-12 md:p-24 overflow-hidden bg-[#AFAF72]">
            {/* Background Texture Layer */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <img
                alt="luxury modern interior"
                className="w-full h-full object-cover grayscale mix-blend-overlay"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1rpm0QnadEg6C7b_xhhVKdxEHnzeUikrifU0VacwRBklMiTHv7EJWjgzirAduv5VQf2bT10h7rfBqNibQ-dYnPqpgMWp5JNdLGgnDn1kZsvI7nrvrQNGb7zMfzF3pqQqfajU-VF02Q_2cdCD8J__GHFHRZWDn6roWRtGXMrVWUeXwnQ4Ntsy0VqsIbQfD1vy9nWZtw62hkyefxy4KuJQwZ_rl4Dd89mtiJZgZmxPL7xmhQmeCGxa2hdwCgGISWgNtwV1rVBgW5-1Y"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[##AFAF72] via-[#CED9F2]/50 to-transparent"></div>
            </div>
            {/* Content Container */}
            <div className="relative z-10 max-w-lg text-left">
              <div className="mb-12">
                <span className="text-3xl font-extrabold tracking-tighter text-white font-serif">
                  Cribbit
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6 font-serif">
                Welcome back to Cribbit Dashboard
              </h1>
              <p className="text-lg md:text-xl leading-relaxed font-light mb-8">
                Access your premium real estate management tools and property
                insights.
              </p>
              <div className="flex gap-4">
                <div className="h-1 w-12 bg-white rounded-full"></div>
                <div className="h-1 w-4 bg-white/50 rounded-full"></div>
              </div>
            </div>
            {/* Bottom decorative element */}
            <div className="absolute bottom-12 left-12 md:left-24">
              <p className="text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
                Curated Real Estate Excellence
              </p>
            </div>
          </section>

          {/* Right Column: Login Form */}
          <section className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#FEFAF3]">
            <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-2xl shadow-[0_20px_40px_rgba(123,160,241,0.06)] border border-[#dfe6e9]">
              {/* Form Header */}
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-bold text-[#2d3436] tracking-tight mb-3 font-serif">
                  Sign In
                </h2>
                <p className="text-[#636e72] text-sm leading-relaxed">
                  Enter your credentials to access your account.
                </p>
              </div>

              <form className="space-y-6" action={login}>
                {/* Error Box */}
                {errorMessage && (
                  <div className="p-4 text-sm font-semibold text-red-700 bg-red-50/80 rounded-xl text-center border border-red-100 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">
                      error
                    </span>
                    {errorMessage}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2 relative">
                  <label
                    className="text-[0.75rem] font-bold tracking-widest text-[#636e72] uppercase ml-1"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aab2] group-focus-within:text-[#7BA0F1] transition-colors" />
                    <input
                      className="w-full pl-12 pr-4 py-4 bg-[#f1f2f6] border border-[#dfe6e9] rounded-xl text-[#2d3436] placeholder:text-[#a0aab2] focus:ring-2 focus:ring-[#7BA0F1] focus:bg-white transition-all outline-none"
                      id="email"
                      name="email"
                      // placeholder="agent@cribbit.com"
                      type="email"
                      required
                      defaultValue={"bayunugroho963@gmail.com"}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 relative">
                  <label
                    className="text-[0.75rem] font-bold tracking-widest text-[#636e72] uppercase ml-1"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    {/* password lucide  */}
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aab2] group-focus-within:text-[#7BA0F1] transition-colors" />
                    <input
                      className="w-full pl-12 pr-12 py-4 bg-[#f1f2f6] border border-[#dfe6e9] rounded-xl text-[#2d3436] placeholder:text-[#a0aab2] focus:ring-2 focus:ring-[#7BA0F1] focus:bg-white transition-all outline-none"
                      id="password"
                      name="password"
                      // placeholder="••••••••"
                      type="password"
                      required
                      defaultValue={"1122334455"}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between py-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      className="w-5 h-5 rounded border-[#dfe6e9] text-[#7BA0F1] focus:ring-[#7BA0F1] focus:ring-offset-0 transition-all cursor-pointer"
                      type="checkbox"
                    />
                    <span className="text-sm text-[#636e72] group-hover:text-[#7BA0F1] transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a
                    className="text-sm font-semibold text-[#7BA0F1] hover:text-[#5e84d1] transition-colors"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <SubmitButton />
                </div>
              </form>

              {/* Footer Links */}
              {/* <div className="mt-10 pt-8 border-t border-[#dfe6e9]/60 text-center">
                <p className="text-sm text-[#636e72]">
                  Don't have an agent account?
                  <a
                    className="ml-1 font-bold text-[#7BA0F1] hover:underline decoration-2 underline-offset-4"
                    href="/register-agent"
                  >
                    Register as Agent
                  </a>
                </p>
              </div> */}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
