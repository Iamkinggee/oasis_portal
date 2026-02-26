


"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const partners = ["Godsent Oko-Ose"];

export default function Home() {
  const [dark, setDark] = useState(false);

  // Persist preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      localStorage.setItem("theme", !prev ? "dark" : "light");
      return !prev;
    });
  };

  const t = {
    bg: dark ? "#0f0f0e" : "#f0f0ed",
    border: dark ? "#2a2a28" : "#ddddd8",
    badgeBg: dark ? "#1e1e1c" : "#e8e8e4",
    badgeText: dark ? "#66665e" : "#888880",
    headline: dark ? "#f5f5f2" : "#111",
    subtext: dark ? "#9a9a94" : "#52525b",
    btnBg: dark ? "#f5f5f2" : "#111",
    btnText: dark ? "#111" : "#fff",
    outlineBtnText: dark ? "#f5f5f2" : "#111",
    outlineBtnHover: dark ? "#1e1e1c" : "#e8e8e4",
    partnerText: dark ? "#6b6b65" : "#52525b",
    logoText: dark ? "#f5f5f2" : "#1a1a1a",
    iconBg: dark ? "#f5f5f2" : "#111",
    iconDot: dark ? "#0f0f0e" : "#f0f0ed",
    toggleBg: dark ? "#2a2a28" : "#e0e0db",
    toggleText: dark ? "#f5f5f2" : "#444",
  };

  return (
    <main
      style={{ backgroundColor: t.bg, transition: "background-color 0.3s ease, color 0.3s ease" }}
      className="min-h-screen flex flex-col items-center font-sans"
    >
      {/* Navbar */}
      <nav
        style={{ borderBottomColor: t.border, transition: "border-color 0.3s ease" }}
        className="w-full flex justify-between items-center px-5 sm:px-8 py-4 sm:py-5 border-b"
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span
            style={{ backgroundColor: t.iconBg, transition: "background-color 0.3s ease" }}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-md grid grid-cols-2 grid-rows-2 gap-[3px] p-[4px] sm:p-[5px] flex-shrink-0"
          >
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={{ backgroundColor: t.iconDot }} className="rounded-[1px]" />
            ))}
          </span>
          <h1
            style={{ color: t.logoText, transition: "color 0.3s ease" }}
            className="text-[10px] sm:text-2xl md:text-3xl font-light leading-none mb-0"
          >
            Oasis
            <span className="font-extrabold">Portal</span>
          </h1>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: t.toggleBg,
            color: t.toggleText,
            border: `1px solid ${t.border}`,
            transition: "all 0.3s ease",
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium cursor-pointer"
          aria-label="Toggle theme"
        >
          <span className="text-[14px]">{dark ? "☀️" : "🌙"}</span>
          <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col  items-center text-center px-5 sm:px-8 pt-14  pb-8 sm:pb-10 max-w-2xl w-full">
        {/* Badge */}
        <span
          style={{
            backgroundColor: t.badgeBg,
            borderColor: t.border,
            color: t.badgeText,
            transition: "all 0.3s ease",
          }}
          className="inline-block border rounded-full px-3.5 sm:px-4 py-1 sm:py-1.5 text-[12px] sm:text-[13px] mb-6 sm:mb-7 tracking-wide animate-[fadeUp_0.6s_ease_both]"
        >
          Early Access. Version 1.0
        </span>

        {/* Headline */}
        <h1
          style={{ color: t.headline, transition: "color 0.3s ease" }}
          className="font-black text-[36px] sm:text-[48px] md:text-[64px] leading-[1.05] tracking-[-2px] sm:tracking-[-2.5px] mb-4 sm:mb-5 animate-[fadeUp_0.7s_0.05s_ease_both]"
        >
          The Smartest and efficient Way to{" "}
          <br className="hidden sm:block" />
          Manage Your Group
        </h1>

        {/* Subtitle */}
        <p
          style={{ color: t.subtext, transition: "color 0.3s ease" }}
          className="text-[15px] sm:text-[17px] font-medium leading-relaxed max-w-[420px] mb-10 sm:mb-12 animate-[fadeUp_0.7s_0.1s_ease_both]"
        >
          Organize, track, and monitor your group ecosystem with confidence and clarity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto animate-[fadeUp_0.7s_0.18s_ease_both]">
          <Link
            href="/login"
            style={{
              backgroundColor: t.btnBg,
              color: t.btnText,
              transition: "all 0.3s ease",
            }}
            className="w-full sm:w-auto text-center text-[14px] sm:text-[15px] font-medium px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:opacity-80 active:scale-[0.98] transition-all duration-150"
          >
            Log in →
          </Link>
          <Link
            href="/sign-up"
            style={{
              color: t.outlineBtnText,
              borderColor: t.border,
              transition: "all 0.3s ease",
            }}
            className="w-full sm:w-auto text-center bg-transparent border text-[14px] sm:text-[15px] font-medium px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:opacity-80 active:scale-[0.98] transition-all duration-150"
          >
            Create account
          </Link>
        </div>
      </section>

      {/* Social proof */}
      <div className="flex flex-col items-center   px-5 animate-[fadeUp_0.7s_0.3s_ease_both]">
        <p
          style={{ color: t.badgeText, transition: "color 0.3s ease" }}
          className="text-[10px] sm:text-[11px] uppercase tracking-widest "
        >
          DEVELOPED BY:
        </p>

        <p className="text-zinc-500 font-mon font-semibold">GODSENT OKO-OSE</p>

        {/* <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          {partners.map((name) => (
            <div
              key={name}
              style={{ color: t.partnerText, transition: "color 0.3s ease" }}
              className="flex items-center gap-2 text-[12px] sm:text-[13px] font-medium"
            >
              <span className="w-2 h-2  rounded-full bg-current opacity-60" />
              {name}
              
            </div>
            
          ))}

      

          
        </div> */}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}