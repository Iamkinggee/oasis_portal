import Link from "next/link";

const partners = ["Godsent Oko-Ose", "Geesoft Studios", "Sentok Ventures"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f0f0ed] flex flex-col items-center font-sans">

      {/* Navbar */}
      <nav className="w-full flex justify-center px-6 py-5 border-b border-[#ddddd8]">
        <div className="flex items-center gap-2 font-black text-[18px] tracking-tight text-[#111]">
          <span className="w-7 h-7 bg-[#111] rounded-[6px] grid grid-cols-2 grid-rows-2 gap-[3px] p-[5px]">
            <span className="bg-[#f0f0ed] rounded-[1px]" />
            <span className="bg-[#f0f0ed] rounded-[1px]" />
            <span className="bg-[#f0f0ed] rounded-[1px]" />
            <span className="bg-[#f0f0ed] rounded-[1px]" />
          </span>
             <h1 className="md:text-4xl text-2xl font-light  text-zinc-900 mb-2">
                Oasis<span className="text-zinc-900 text-2xl md:text-4xl font-extrabold">Portal</span>
                
              </h1>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-5 pt-20 pb-10 max-w-2xl w-full">

        {/* Badge */}
        <span className="inline-block bg-[#e8e8e4] border border-[#ddddd8] rounded-full px-4 py-1.5 text-[13px] text-[#888880] mb-7 tracking-wide animate-[fadeUp_0.6s_ease_both]">
          Now in early access
        </span>

        {/* Headline */}
        {/* <h1 className="font-black text-[42px] md:text-[64px] leading-[1.05] tracking-[-2.5px] text-[#111] mb-5 animate-[fadeUp_0.7s_0.05s_ease_both]">
          Manage your cells<br />on your own effectively.
        </h1> */}
        <h1 className="font-black text-[42px] md:text-[64px] leading-[1.05] tracking-[-2.5px] text-[#111] mb-5 animate-[fadeUp_0.7s_0.05s_ease_both]">
          
          The Smart Way to <br />Manage Your Cells


        </h1>

        {/* Subtitle */}
        <p className="text-[17px] font-medium text-zinc-700 leading-relaxed max-w-[420px] mb-12 animate-[fadeUp_0.7s_0.1s_ease_both]">
         Organize, track, and monitor your cell ecosystem with confidence and clarity.  
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3 animate-[fadeUp_0.7s_0.18s_ease_both]">
          <Link
            href="/login"
            className="bg-[#111] text-white text-[15px] font-medium px-8 py-3.5 rounded-xl hover:opacity-80 active:scale-[0.98] transition-all duration-150"
          >
            Log in →
          </Link>
          <Link
            href="/sign-up"
            className="bg-transparent text-[#111] border border-[#ddddd8] text-[15px] font-medium px-8 py-3.5 rounded-xl hover:bg-[#e8e8e4] active:scale-[0.98] transition-all duration-150"
          >
            Create account
          </Link>
        </div>

        {/* Privacy note */}
        {/* <p className="italic text-[12px] text-[#888880] mt-4 animate-[fadeUp_0.7s_0.22s_ease_both]">
          No spam, ever. We respect your privacy.
        </p> */}
      </section>

      {/* Social proof */}
      <div className="flex flex-col items-center mt-10 pb-16 animate-[fadeUp_0.7s_0.3s_ease_both]">
        <p className="text-[11px] text-[#888880] uppercase tracking-widest mb-4">
          Trusted by teams at
        </p>
        <div className="flex items-center gap-8">
          {partners.map((name) => (
            <div key={name} className="flex items-center gap-2 text-[13px] font-medium text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-current opacity-60" />
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe animations — injected via a style tag */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}