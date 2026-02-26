// import Link from "next/link";

// const partners = ["Godsent Oko-Ose", "Geesoft Studios", "Sentok Ventures"];

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-[#f0f0ed] flex flex-col items-center font-sans">

//       {/* Navbar */}
//       <nav className="w-full flex justify-center px-6 py-5 border-b border-[#ddddd8]">
//         <div className="flex items-center gap-2 font-black text-[18px] tracking-tight text-[#111]">
//           <span className="w-7 h-7 bg-[#111] rounded-[6px] grid grid-cols-2 grid-rows-2 gap-[3px] p-[5px]">
//             <span className="bg-[#f0f0ed] rounded-[1px]" />
//             <span className="bg-[#f0f0ed] rounded-[1px]" />
//             <span className="bg-[#f0f0ed] rounded-[1px]" />
//             <span className="bg-[#f0f0ed] rounded-[1px]" />
//           </span>
//              <h1 className="md:text-4xl text-2xl font-light  text-zinc-900 mb-2">
//                 Oasis<span className="text-zinc-900 text-2xl md:text-4xl font-extrabold">Portal</span>
                
//               </h1>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="flex flex-col items-center text-center px-5 pt-20 pb-10 max-w-2xl w-full">

//         {/* Badge */}
//         <span className="inline-block bg-[#e8e8e4] border border-[#ddddd8] rounded-full px-4 py-1.5 text-[13px] text-[#888880] mb-7 tracking-wide animate-[fadeUp_0.6s_ease_both]">
//           Now in early access
//         </span>

//         {/* Headline */}
//         {/* <h1 className="font-black text-[42px] md:text-[64px] leading-[1.05] tracking-[-2.5px] text-[#111] mb-5 animate-[fadeUp_0.7s_0.05s_ease_both]">
//           Manage your cells<br />on your own effectively.
//         </h1> */}
//         <h1 className="font-black text-[42px] md:text-[64px] leading-[1.05] tracking-[-2.5px] text-[#111] mb-5 animate-[fadeUp_0.7s_0.05s_ease_both]">
          
//           The Smart Way to <br />Manage Your Cells


//         </h1>

//         {/* Subtitle */}
//         <p className="text-[17px] font-medium text-zinc-700 leading-relaxed max-w-[420px] mb-12 animate-[fadeUp_0.7s_0.1s_ease_both]">
//          Organize, track, and monitor your cell ecosystem with confidence and clarity.  
//         </p>

//         {/* CTA Buttons */}
//         <div className="flex items-center gap-3 animate-[fadeUp_0.7s_0.18s_ease_both]">
//           <Link
//             href="/login"
//             className="bg-[#111] text-white text-[15px] font-medium px-8 py-3.5 rounded-xl hover:opacity-80 active:scale-[0.98] transition-all duration-150"
//           >
//             Log in →
//           </Link>
//           <Link
//             href="/sign-up"
//             className="bg-transparent text-[#111] border border-[#ddddd8] text-[15px] font-medium px-8 py-3.5 rounded-xl hover:bg-[#e8e8e4] active:scale-[0.98] transition-all duration-150"
//           >
//             Create account
//           </Link>
//         </div>

//         {/* Privacy note */}
//         {/* <p className="italic text-[12px] text-[#888880] mt-4 animate-[fadeUp_0.7s_0.22s_ease_both]">
//           No spam, ever. We respect your privacy.
//         </p> */}
//       </section>

//       {/* Social proof */}
//       <div className="flex flex-col items-center mt-10 pb-16 animate-[fadeUp_0.7s_0.3s_ease_both]">
//         <p className="text-[11px] text-[#888880] uppercase tracking-widest mb-4">
//           Trusted by teams at
//         </p>
//         <div className="flex items-center gap-8">
//           {partners.map((name) => (
//             <div key={name} className="flex items-center gap-2 text-[13px] font-medium text-zinc-600">
//               <span className="w-2 h-2 rounded-full bg-current opacity-60" />
//               {name}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Keyframe animations — injected via a style tag */}
//       <style>{`
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </main>
//   );
// }
























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
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-[6px] grid grid-cols-2 grid-rows-2 gap-[3px] p-[4px] sm:p-[5px] flex-shrink-0"
          >
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={{ backgroundColor: t.iconDot }} className="rounded-[1px]" />
            ))}
          </span>
          <h1
            style={{ color: t.logoText, transition: "color 0.3s ease" }}
            className="text-[15px] sm:text-2xl md:text-4xl font-light leading-none mb-0"
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
      <section className="flex flex-col mt-15 md:mt-0 items-center text-center px-5 sm:px-8 pt-14 sm:pt-20 pb-8 sm:pb-10 max-w-2xl w-full">
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
      <div className="flex flex-col items-center mt-8 sm:mt-10 pb-14 sm:pb-16 px-5 animate-[fadeUp_0.7s_0.3s_ease_both]">
        <p
          style={{ color: t.badgeText, transition: "color 0.3s ease" }}
          className="text-[10px] sm:text-[11px] uppercase tracking-widest mb-4"
        >
          DEVELOPED BY:
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
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

          {/* <p className="text-zinc-400 ">Geesoft Technologies</p> */}

          
        </div>
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