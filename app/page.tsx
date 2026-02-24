// // app/page.tsx
// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
//       <div className="max-w-3xl">
//         <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
//           Welcome to <span className="text-red-600">Oasis</span>
//         </h1>
        
//         <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto">
//           A private portal. Exclusive. Seductive. Only for those who know the way in.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-6 justify-center">
//           <Link
//             href="/login"
//             className="
//               px-10 py-5 bg-black border border-zinc-700 
//               hover:border-red-600 text-white font-medium
//               rounded-xl transition-all duration-300
//               uppercase tracking-wider text-sm
//             "
//           >
//             Enter the Portal
//           </Link>

//           <Link
//             href="/signup"
//             className="
//               px-10 py-5 bg-zinc-900 border border-zinc-800 
//               hover:bg-zinc-800 text-zinc-300 hover:text-white
//               rounded-xl transition-all duration-300
//               uppercase tracking-wider text-sm
//             "
//           >
//             Request Access
//           </Link>
//         </div>

//         <p className="mt-16 text-zinc-600 text-sm">
//           © {new Date().getFullYear()} Oasis Collective • All rights reserved
//         </p>
//       </div>
//     </div>
//   );
// }




// 'use client';

// import { useState, useEffect } from 'react';

// // ─── Types ────────────────────────────────────────────────────────────────────
// type Theme = 'light' | 'dark';

// // ─── Data ─────────────────────────────────────────────────────────────────────
// const UPCOMING_EVENTS = [
//   { id: 1, name: 'Healing Streams',  date: 'April 9th'  },
//   { id: 2, name: 'Reach Out World',  date: 'March 5th'  },
//   { id: 3, name: "Pastor's Birthday",date: 'Dec. 7th'   },
//   { id: 4, name: 'Cell Conference',  date: 'May 12th'   },
// ];

// const CELEBRATIONS = [
//   { id: 1, name: 'Esteemed Bro. John Ezra',     day: 5  },
//   { id: 2, name: 'Esteemed Sis. Praise Oluchi', day: 20 },
//   { id: 3, name: 'Esteemed Bro. Samuel Oke',    day: 27 },
// ];

// const MONTHS    = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
// const BAR_VALS  = [58, 72, 50, 83, 68, 91];

// // ─── Hooks ────────────────────────────────────────────────────────────────────
// function useAnimatedProgress(delay = 0, duration = 1200) {
//   const [prog, setProg] = useState(0);
//   useEffect(() => {
//     let raf: number;
//     let t0: number | null = null;
//     const go = setTimeout(() => {
//       const tick = (ts: number) => {
//         if (!t0) t0 = ts;
//         const p = Math.min((ts - t0) / duration, 1);
//         setProg(1 - Math.pow(1 - p, 3));
//         if (p < 1) raf = requestAnimationFrame(tick);
//       };
//       raf = requestAnimationFrame(tick);
//     }, delay);
//     return () => { clearTimeout(go); cancelAnimationFrame(raf); };
//   }, [delay, duration]);
//   return prog;
// }

// // ─── Animated Counter ─────────────────────────────────────────────────────────
// function Counter({ to, duration = 900 }: { to: number; duration?: number }) {
//   const [val, setVal] = useState(0);
//   useEffect(() => {
//     let raf: number;
//     let t0: number | null = null;
//     const tick = (ts: number) => {
//       if (!t0) t0 = ts;
//       const p = Math.min((ts - t0) / duration, 1);
//       setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
//       if (p < 1) raf = requestAnimationFrame(tick);
//     };
//     raf = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(raf);
//   }, [to, duration]);
//   return <>{String(val).padStart(2, '0')}</>;
// }

// // ─── Donut Chart ──────────────────────────────────────────────────────────────
// function DonutChart({ isDark }: { isDark: boolean }) {
//   const prog = useAnimatedProgress(150, 1400);

//   const segs = [
//     { label: 'Present',  pct: 65, color: '#06b6d4' },
//     { label: 'Absent',   pct: 20, color: '#818cf8' },
//     { label: 'New Mbrs', pct: 15, color: '#34d399' },
//   ];

//   const SZ = 190, cx = 95, cy = 95, R = 72, inner = 46, sw = R - inner;

//   function mkArc(startDeg: number, sweepDeg: number) {
//     if (sweepDeg >= 360) sweepDeg = 359.99;
//     const mid = R - sw / 2;
//     const toXY = (d: number): [number, number] => {
//       const rad = ((d - 90) * Math.PI) / 180;
//       return [cx + mid * Math.cos(rad), cy + mid * Math.sin(rad)];
//     };
//     const [sx, sy] = toXY(startDeg);
//     const [ex, ey] = toXY(startDeg + sweepDeg);
//     return `M ${sx} ${sy} A ${mid} ${mid} 0 ${sweepDeg > 180 ? 1 : 0} 1 ${ex} ${ey}`;
//   }

//   let cum = 0;
//   const arcs = segs.map(s => {
//     const start = cum * 3.6;
//     const sweep = s.pct * prog * 3.6;
//     cum += s.pct;
//     return { ...s, start, sweep };
//   });

//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
//       {/* SVG */}
//       <div style={{ flexShrink: 0 }}>
//         <svg width={SZ} height={SZ}>
//           <circle cx={cx} cy={cy} r={R - sw / 2} fill="none"
//             stroke={isDark ? '#2a2d3a' : '#f1f5f9'} strokeWidth={sw} />
//           {arcs.map((a, i) => (
//             <path key={i} d={mkArc(a.start, a.sweep)} fill="none"
//               stroke={a.color} strokeWidth={sw} strokeLinecap="butt" />
//           ))}
//           <text x={cx} y={cy - 9} textAnchor="middle" fontSize="9" fontWeight="700"
//             letterSpacing="0.8" fill={isDark ? '#6b7280' : '#9ca3af'}>ATTENDANCE</text>
//           <text x={cx} y={cy + 13} textAnchor="middle" fontSize="28" fontWeight="900"
//             fill={isDark ? '#f3f4f6' : '#0f1117'}>
//             {Math.round(65 * prog)}%
//           </text>
//         </svg>
//       </div>

//       {/* Legend + bars */}
//       <div style={{ flex: 1, minWidth: 130, display: 'flex', flexDirection: 'column', gap: 14 }}>
//         {segs.map((s, i) => (
//           <div key={i}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
//                 <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
//                 <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#9ca3af' : '#6b7280', fontFamily: 'inherit' }}>{s.label}</span>
//               </div>
//               <span style={{ fontSize: 13, fontWeight: 800, color: isDark ? '#f3f4f6' : '#0f1117', fontFamily: 'inherit' }}>
//                 {Math.round(s.pct * prog)}%
//               </span>
//             </div>
//             <div style={{ height: 5, borderRadius: 3, background: isDark ? '#2a2d3a' : '#f1f5f9', overflow: 'hidden' }}>
//               <div style={{
//                 height: '100%', borderRadius: 3, background: s.color,
//                 width: `${s.pct * prog}%`, transition: 'width 0.05s',
//               }} />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Bar Chart ────────────────────────────────────────────────────────────────
// function BarChart({ isDark }: { isDark: boolean }) {
//   const prog = useAnimatedProgress(300, 1000);

//   return (
//     <div>
//       <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 96 }}>
//         {MONTHS.map((m, i) => {
//           const isLast = i === MONTHS.length - 1;
//           return (
//             <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
//               {/* Peak label */}
//               <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
//                 {isLast && prog > 0.85 && (
//                   <div style={{
//                     position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
//                     fontSize: 10, fontWeight: 800, color: '#06b6d4', whiteSpace: 'nowrap',
//                   }}>
//                     {BAR_VALS[i]}%
//                   </div>
//                 )}
//                 <div style={{
//                   width: '100%', borderRadius: '5px 5px 0 0',
//                   height: `${BAR_VALS[i] * prog}%`,
//                   background: isLast
//                     ? 'linear-gradient(to top, #06b6d4, #818cf8)'
//                     : isDark ? '#2a2d3a' : '#e9edf5',
//                   transition: `height 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 70}ms`,
//                 }} />
//               </div>
//               <span style={{ fontSize: 10, fontWeight: 600, color: isDark ? '#4b5262' : '#b0b7c3', fontFamily: 'inherit' }}>{m}</span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ─── Stat Card ────────────────────────────────────────────────────────────────
// function StatCard({
//   label, value, sub, iconPath, iconColor, iconBg, isDark, delay,
// }: {
//   label: string; value: number; sub: string | null;
//   iconPath: string; iconColor: string; iconBg: string;
//   isDark: boolean; delay: number;
// }) {
//   const tp = isDark ? '#f3f4f6' : '#0f1117';
//   const ts = isDark ? '#6b7280' : '#9ca3af';

//   return (
//     <div style={{
//       background: isDark ? '#16181f' : '#ffffff',
//       border: `1px solid ${isDark ? '#1e2028' : '#ebebeb'}`,
//       borderRadius: 18, padding: '20px 22px',
//       boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 16px rgba(0,0,0,0.05)',
//       transition: 'background 0.3s, border-color 0.3s, box-shadow 0.2s',
//       fontFamily: 'inherit',
//     }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <div>
//           <p style={{ fontSize: 13, color: ts, margin: 0, fontWeight: 500 }}>{label}</p>
//           <p style={{ fontSize: 48, fontWeight: 900, color: tp, margin: '4px 0 0', letterSpacing: '-3px', lineHeight: 1, fontFamily: 'inherit' }}>
//             <Counter to={value} duration={delay} />
//           </p>
//           {sub && <p style={{ fontSize: 11, color: ts, margin: '6px 0 0' }}>{sub}</p>}
//         </div>
//         <div style={{
//           width: 44, height: 44, borderRadius: 12,
//           background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
//         }}>
//           <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={iconColor} style={{ width: 20, height: 20 }}>
//             <path d={iconPath} />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Card wrapper ─────────────────────────────────────────────────────────────
// function Card({ isDark, children, style = {} }: { isDark: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
//   return (
//     <div style={{
//       background: isDark ? '#16181f' : '#ffffff',
//       border: `1px solid ${isDark ? '#1e2028' : '#ebebeb'}`,
//       borderRadius: 18, padding: '22px 24px',
//       boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 16px rgba(0,0,0,0.05)',
//       transition: 'background 0.3s, border-color 0.3s',
//       fontFamily: 'inherit',
//       ...style,
//     }}>
//       {children}
//     </div>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────
// export default function DashboardPage() {
//   // Read theme from localStorage so it stays in sync with layout
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     const check = () => setIsDark(localStorage.getItem('oasis-theme') === 'dark');
//     check();
//     // Re-check when storage changes (theme toggle in Topbar fires this)
//     window.addEventListener('storage', check);
//     // Also poll lightly for same-tab updates (layout toggles don't fire storage event)
//     const id = setInterval(check, 200);
//     return () => { window.removeEventListener('storage', check); clearInterval(id); };
//   }, []);

//   const tp      = isDark ? '#f3f4f6' : '#0f1117';
//   const ts      = isDark ? '#6b7280' : '#9ca3af';
//   const divCol  = isDark ? '#1e2028' : '#f0f0f0';
//   const rowHov  = isDark ? '#1a1d27' : '#f9fafb';

//   const STATS = [
//     {
//       label: 'Total members',  value: 20, sub: null,
//       iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
//       iconColor: '#ec4899', iconBg: isDark ? 'rgba(236,72,153,0.12)' : '#fce7f3',
//     },
//     {
//       label: 'Active members', value: 13, sub: 'Last 2 meetings',
//       iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 11l2 2 4-4',
//       iconColor: '#22c55e', iconBg: isDark ? 'rgba(34,197,94,0.12)' : '#dcfce7',
//     },
//     {
//       label: 'New Member(s)',  value: 5,  sub: 'Last 4 weeks',
//       iconPath: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6',
//       iconColor: '#f59e0b', iconBg: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7',
//     },
//   ];

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

//       {/* Page title */}
//       <div>
//         <h1 style={{ fontSize: 22, fontWeight: 800, color: tp, margin: 0, letterSpacing: '-0.3px' }}>
//           Dashboard
//         </h1>
//         <p style={{ fontSize: 13, color: ts, margin: '4px 0 0' }}>
//           {new Date().toLocaleDateString('en-US', {
//             weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
//           })}
//         </p>
//       </div>

//       {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
//         {STATS.map((s, i) => (
//           <StatCard key={i} {...s} isDark={isDark} delay={850 + i * 120} />
//         ))}
//       </div>

//       {/* ── Charts Row ──────────────────────────────────────────────────────── */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//         {/* Donut */}
//         <Card isDark={isDark}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//             <h2 style={{ fontSize: 15, fontWeight: 700, color: tp, margin: 0 }}>Average Attendance</h2>
//             <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#06b6d4" style={{ width: 16, height: 16 }}>
//               <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
//               <polyline points="16 7 22 7 22 13" />
//             </svg>
//           </div>
//           <DonutChart isDark={isDark} />
//         </Card>

//         {/* Upcoming Events */}
//         <Card isDark={isDark}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//             <h2 style={{ fontSize: 15, fontWeight: 700, color: tp, margin: 0 }}>Upcoming Events</h2>
//             <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#818cf8" style={{ width: 16, height: 16 }}>
//               <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//               <line x1="16" y1="2" x2="16" y2="6" />
//               <line x1="8" y1="2" x2="8" y2="6" />
//               <line x1="3" y1="10" x2="21" y2="10" />
//             </svg>
//           </div>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//             {UPCOMING_EVENTS.map((ev, i) => (
//               <div
//                 key={ev.id}
//                 style={{
//                   display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                   padding: '10px 10px', borderRadius: 10, cursor: 'default', transition: 'background 0.15s',
//                 }}
//                 onMouseEnter={e => (e.currentTarget.style.background = rowHov)}
//                 onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
//               >
//                 <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
//                   <span style={{ fontSize: 12, fontWeight: 700, color: ts }}>{i + 1}.</span>
//                   <span style={{ fontSize: 13, fontWeight: 600, color: tp }}>{ev.name}</span>
//                 </div>
//                 <span style={{ fontSize: 13, fontWeight: 700, color: '#06b6d4' }}>{ev.date}</span>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* ── Bar Chart + Celebrations ─────────────────────────────────────────── */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//         {/* Monthly Bar */}
//         <Card isDark={isDark}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//             <h2 style={{ fontSize: 15, fontWeight: 700, color: tp, margin: 0 }}>Monthly Trend</h2>
//             <span style={{ fontSize: 11, fontWeight: 600, color: ts }}>2026</span>
//           </div>
//           <BarChart isDark={isDark} />
//           <p style={{
//             fontSize: 11, color: ts, margin: '12px 0 0',
//             borderTop: `1px solid ${divCol}`, paddingTop: 10,
//           }}>
//             Attendance peaked in{' '}
//             <span style={{ color: '#06b6d4', fontWeight: 700 }}>June</span> at 91%
//           </p>
//         </Card>

//         {/* Celebrations */}
//         <Card isDark={isDark}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//             <h2 style={{ fontSize: 15, fontWeight: 700, color: tp, margin: 0 }}>celebrations</h2>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//               <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#f59e0b" style={{ width: 14, height: 14 }}>
//                 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//               </svg>
//               <span style={{ fontSize: 11, fontWeight: 700, color: ts }}>MONTH: March</span>
//             </div>
//           </div>

//           {/* Table header */}
//           <div style={{
//             display: 'grid', gridTemplateColumns: '1fr 50px',
//             padding: '0 10px 8px',
//             borderBottom: `1px solid ${divCol}`,
//           }}>
//             <span style={{ fontSize: 11, fontWeight: 700, color: ts, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Names</span>
//             <span style={{ fontSize: 11, fontWeight: 700, color: ts, textAlign: 'right', letterSpacing: '0.08em', textTransform: 'uppercase' }}>DAY</span>
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
//             {CELEBRATIONS.map((c, i) => (
//               <div
//                 key={c.id}
//                 style={{
//                   display: 'grid', gridTemplateColumns: '1fr 50px',
//                   padding: '10px 10px', borderRadius: 10, transition: 'background 0.15s',
//                 }}
//                 onMouseEnter={e => (e.currentTarget.style.background = rowHov)}
//                 onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
//               >
//                 <span style={{ fontSize: 13, fontWeight: 600, color: tp }}>{i + 1}. {c.name}</span>
//                 <span style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
//                   {String(c.day).padStart(2, '0')}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* ── Scripture Quote ──────────────────────────────────────────────────── */}
//       <Card isDark={isDark} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
//         <div style={{
//           width: 40, height: 40, borderRadius: 12, flexShrink: 0,
//           background: 'linear-gradient(135deg, #06b6d4, #818cf8)',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//         }}>
//           <span style={{ color: '#fff', fontSize: 22, fontWeight: 900, lineHeight: 1 }}>"</span>
//         </div>
//         <div>
//           <p style={{ fontSize: 13, fontStyle: 'italic', color: ts, margin: 0, lineHeight: 1.75 }}>
//             "Not forsaking the assembling of ourselves together, as the manner of some is;
//             but exhorting one another: and so much the more, as ye see the day approaching."
//           </p>
//           <p style={{ fontSize: 11, fontWeight: 800, color: '#06b6d4', margin: '8px 0 0', letterSpacing: '0.03em' }}>
//             Hebrews 10:25
//           </p>
//         </div>
//       </Card>

//     </div>
//   );
// }




import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}