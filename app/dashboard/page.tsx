//  // app/dashboard/page.tsx

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












// app/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────
type Member = { id: number; name: string; created_at: string };
type Meeting = { id: number; title: string; date: string; saved: boolean };
type AttendanceRecord = { meeting_id: number; member_id: number; present: boolean };
type Celebration = { id: number; name: string; day: number; month: number; event: string };
type Program = { id: number; title: string; date: string; venue: string };

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useAnimatedProgress(delay = 0, duration = 1200) {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    let raf: number;
    let t0: number | null = null;
    const go = setTimeout(() => {
      const tick = (ts: number) => {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / duration, 1);
        setProg(1 - Math.pow(1 - p, 3));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(go); cancelAnimationFrame(raf); };
  }, [delay, duration]);
  return prog;
}

function Counter({ to, duration = 900 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    let t0: number | null = null;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{String(val).padStart(2, '0')}</>;
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ isDark, presentPct, absentPct, newPct }: {
  isDark: boolean; presentPct: number; absentPct: number; newPct: number;
}) {
  const prog = useAnimatedProgress(150, 1400);
  const segs = [
    { label: 'Present',  pct: presentPct, color: '#06b6d4' },
    { label: 'Absent',   pct: absentPct,  color: '#818cf8' },
    { label: 'New Mbrs', pct: newPct,     color: '#34d399' },
  ];
  const SZ = 190, cx = 95, cy = 95, R = 72, inner = 46, sw = R - inner;

  function mkArc(startDeg: number, sweepDeg: number) {
    if (sweepDeg >= 360) sweepDeg = 359.99;
    const mid = R - sw / 2;
    const toXY = (d: number): [number, number] => {
      const rad = ((d - 90) * Math.PI) / 180;
      return [cx + mid * Math.cos(rad), cy + mid * Math.sin(rad)];
    };
    const [sx, sy] = toXY(startDeg);
    const [ex, ey] = toXY(startDeg + sweepDeg);
    return `M ${sx} ${sy} A ${mid} ${mid} 0 ${sweepDeg > 180 ? 1 : 0} 1 ${ex} ${ey}`;
  }

  let cum = 0;
  const arcs = segs.map(s => {
    const start = cum * 3.6;
    const sweep = s.pct * prog * 3.6;
    cum += s.pct;
    return { ...s, start, sweep };
  });

  return (
    <div  className='mb-10 md:mb-0' style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
      <div style={{ flexShrink: 0 }}>
        <svg width={SZ} height={SZ}>
          <circle cx={cx} cy={cy} r={R - sw / 2} fill="none"
            stroke={isDark ? '#2a2d3a' : '#f1f5f9'} strokeWidth={sw} />
          {arcs.map((a, i) => (
            <path key={i} d={mkArc(a.start, a.sweep)} fill="none"
              stroke={a.color} strokeWidth={sw} strokeLinecap="butt" />
          ))}
          <text x={cx} y={cy - 9} textAnchor="middle" fontSize="9" fontWeight="700"
            letterSpacing="0.8" fill={isDark ? '#6b7280' : '#9ca3af'}>ATTENDANCE</text>
          <text x={cx} y={cy + 13} textAnchor="middle" fontSize="28" fontWeight="900"
            fill={isDark ? '#f3f4f6' : '#0f1117'}>
            {Math.round(presentPct * prog)}%
          </text>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 130, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {segs.map((s, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#9ca3af' : '#6b7280', fontFamily: 'inherit' }}>{s.label}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: isDark ? '#f3f4f6' : '#0f1117', fontFamily: 'inherit' }}>
                {Math.round(s.pct * prog)}%
              </span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: isDark ? '#2a2d3a' : '#f1f5f9', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 3, background: s.color, width: `${s.pct * prog}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ isDark, data }: { isDark: boolean; data: { month: string; pct: number }[] }) {
  const prog = useAnimatedProgress(300, 1000);
  if (!data.length) return <div style={{ color: isDark ? '#6b7280' : '#9ca3af', fontSize: 12 }}>No attendance data yet.</div>;
  const peak = data.reduce((a, b) => a.pct >= b.pct ? a : b);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 96 }}>
        {data.map((item, i) => {
          const isLast = i === data.length - 1;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
              <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
                {isLast && prog > 0.85 && (
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 800, color: '#06b6d4', whiteSpace: 'nowrap' }}>
                    {item.pct}%
                  </div>
                )}
                <div style={{
                  width: '100%', borderRadius: '5px 5px 0 0',
                  height: `${item.pct * prog}%`,
                  background: isLast ? 'linear-gradient(to top, #06b6d4, #818cf8)' : isDark ? '#2a2d3a' : '#e9edf5',
                }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: isDark ? '#4b5262' : '#b0b7c3', fontFamily: 'inherit' }}>{item.month}</span>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 11, color: isDark ? '#6b7280' : '#9ca3af', margin: '12px 0 0' }}>
        Attendance peaked in <span style={{ color: '#06b6d4', fontWeight: 700 }}>{peak.month}</span> at {peak.pct}%
      </p>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, iconPath, iconColor, iconBg, isDark, delay }: {
  label: string; value: number; sub: string | null;
  iconPath: string; iconColor: string; iconBg: string;
  isDark: boolean; delay: number;
}) {
  const tp = isDark ? '#f3f4f6' : '#0f1117';
  const ts = isDark ? '#6b7280' : '#9ca3af';
  return (
    <div style={{
      background: isDark ? '#16181f' : '#ffffff',
      border: `1px solid ${isDark ? '#1e2028' : '#ebebeb'}`,
      borderRadius: 18, padding: '20px 22px',
      boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 16px rgba(0,0,0,0.05)',
      fontFamily: 'inherit',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 13, color: ts, margin: 0, fontWeight: 500 }}>{label}</p>
          <p style={{ fontSize: 48, fontWeight: 900, color: tp, margin: '4px 0 0', letterSpacing: '-3px', lineHeight: 1, fontFamily: 'inherit' }}>
            <Counter to={value} duration={delay} />
          </p>
          {sub && <p style={{ fontSize: 11, color: ts, margin: '6px 0 0' }}>{sub}</p>}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={iconColor} style={{ width: 20, height: 20 }}>
            <path d={iconPath} />
          </svg>
        </div>
      </div>
    </div>
  );
}

function DashCard({ isDark, children, style = {} }: { isDark: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: isDark ? '#16181f' : '#ffffff',
      border: `1px solid ${isDark ? '#1e2028' : '#ebebeb'}`,
      borderRadius: 18, padding: '22px 24px',
      boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 16px rgba(0,0,0,0.05)',
      fontFamily: 'inherit', ...style,
    }}>
      {children}
    </div>
  );
}

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [isDark, setIsDark] = useState(false);

  // Real data
  const [members, setMembers] = useState<Member[]>([]);
  const [savedMeetings, setSavedMeetings] = useState<Meeting[]>([]);
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const check = () => setIsDark(localStorage.getItem('oasis-theme') === 'dark');
    check();
    window.addEventListener('storage', check);
    const id = setInterval(check, 200);
    return () => { window.removeEventListener('storage', check); clearInterval(id); };
  }, []);

  // ── Fetch all data ──────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    const [
      { data: membersData },
      { data: meetingsData },
      { data: recordsData },
      { data: celebrationsData },
      { data: programsData },
    ] = await Promise.all([
      supabase.from('members').select('id, name, created_at').order('created_at'),
      supabase.from('meetings').select('id, title, date, saved').eq('saved', true).order('date'),
      supabase.from('attendance_records').select('meeting_id, member_id, present'),
      supabase.from('celebrations').select('*').order('month').order('day'),
      supabase.from('programs').select('id, title, date, venue').order('date'),
    ]);

    if (membersData) setMembers(membersData);
    if (meetingsData) setSavedMeetings(meetingsData);
    if (recordsData) setAllRecords(recordsData);
    if (celebrationsData) setCelebrations(celebrationsData);
    if (programsData) setPrograms(programsData);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Realtime
  useEffect(() => {
    const tables = ['members', 'meetings', 'attendance_records', 'celebrations', 'programs'];
    const subs = tables.map(table =>
      supabase.channel(`dash-${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, fetchAll)
        .subscribe()
    );
    return () => { subs.forEach(s => supabase.removeChannel(s)); };
  }, [fetchAll]);

  // ── Derived stats ───────────────────────────────────────────────────────
  const totalMembers = members.length;

  // Active = present in at least 1 of last 2 saved meetings
  const lastTwo = savedMeetings.slice(-2);
  const activeMembers = members.filter(m =>
    lastTwo.some(mt => allRecords.find(r => r.meeting_id === mt.id && r.member_id === m.id && r.present))
  ).length;

  // New members: joined in last 28 days
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 28);
  const newMembers = members.filter(m => new Date(m.created_at) >= cutoff).length;

  // Avg attendance % across all saved meetings
  let presentPct = 0, absentPct = 0, newPct = 0;
  if (savedMeetings.length > 0 && totalMembers > 0) {
    const totalPresent = allRecords.filter(r => r.present).length;
    const totalPossible = savedMeetings.length * totalMembers;
    presentPct = Math.round((totalPresent / totalPossible) * 100);
    absentPct = Math.round(((totalPossible - totalPresent) / totalPossible) * (100 - (newMembers > 0 ? 5 : 0)));
    newPct = 100 - presentPct - absentPct;
    if (newPct < 0) newPct = 0;
    if (absentPct + presentPct + newPct > 100) absentPct = 100 - presentPct - newPct;
  }

  // Monthly attendance trend (last 6 months)
  const monthlyData = (() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return { month: MONTH_SHORT[d.getMonth()], year: d.getFullYear(), monthNum: d.getMonth() + 1 };
    });

    return months.map(({ month, year, monthNum }) => {
      const mtgs = savedMeetings.filter(m => {
        const d = new Date(m.date + 'T00:00:00');
        return d.getFullYear() === year && d.getMonth() + 1 === monthNum;
      });
      if (!mtgs.length || !totalMembers) return { month, pct: 0 };
      const totalPresent = mtgs.reduce((acc, mt) => {
        return acc + allRecords.filter(r => r.meeting_id === mt.id && r.present).length;
      }, 0);
      const pct = Math.round((totalPresent / (mtgs.length * totalMembers)) * 100);
      return { month, pct };
    });
  })();

  // Upcoming programs (next 30 days)
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const in30 = new Date(today); in30.setDate(in30.getDate() + 30);
  const upcomingPrograms = programs
    .filter(p => { const d = new Date(p.date + 'T00:00:00'); return d >= today && d <= in30; })
    .slice(0, 4);

  // Current month celebrations
  const currentMonth = new Date().getMonth() + 1;
  const currentCelebrations = celebrations
    .filter(c => c.month === currentMonth)
    .slice(0, 5);

  const tp = isDark ? '#f3f4f6' : '#0f1117';
  const ts = isDark ? '#6b7280' : '#9ca3af';
  const divCol = isDark ? '#1e2028' : '#f0f0f0';
  const rowHov = isDark ? '#1a1d27' : '#f9fafb';

  const STATS = [
    {
      label: 'Total Members', value: totalMembers, sub: null,
      iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
      iconColor: '#ec4899', iconBg: isDark ? 'rgba(236,72,153,0.12)' : '#fce7f3',
    },
    {
      label: 'Active Members', value: activeMembers, sub: 'Last 2 meetings',
      iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 11l2 2 4-4',
      iconColor: '#22c55e', iconBg: isDark ? 'rgba(34,197,94,0.12)' : '#dcfce7',
    },
    {
      label: 'New Member(s)', value: newMembers, sub: 'Last 4 weeks',
      iconPath: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6',
      iconColor: '#f59e0b', iconBg: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7',
    },
  ];

  function daysFromNow(iso: string) {
    const d = new Date(iso + 'T00:00:00');
    const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return 'TODAY';
    if (diff === 1) return 'TOMORROW';
    return `${diff}d`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: tp, margin: 0, letterSpacing: '-0.3px' }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: ts, margin: '4px 0 0' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        {STATS.map((s, i) => <StatCard key={i} {...s} isDark={isDark} delay={850 + i * 120} />)}
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>

        {/* Donut */}
        <DashCard isDark={isDark}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: tp, margin: 0 }}>Average Attendance</h2>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#06b6d4" style={{ width: 16, height: 16 }}>
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          {savedMeetings.length === 0
            ? <div style={{ color: ts, fontSize: 13, padding: '20px 0' }}>No meetings saved yet.</div>
            : <DonutChart isDark={isDark} presentPct={presentPct} absentPct={absentPct} newPct={newPct} />
          }
        </DashCard>

        {/* Upcoming Programs */}
        <DashCard isDark={isDark}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: tp, margin: 0 }}>Upcoming Events</h2>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#818cf8" style={{ width: 16, height: 16 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          {upcomingPrograms.length === 0
            ? <div style={{ color: ts, fontSize: 13, padding: '10px 0' }}>No upcoming events in next 30 days.</div>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {upcomingPrograms.map((ev, i) => (
                  <div
                    key={ev.id}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px', borderRadius: 10, transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = rowHov)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: ts, flexShrink: 0 }}>{i + 1}.</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: tp, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.title}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#06b6d4', flexShrink: 0, marginLeft: 8 }}>
                      {daysFromNow(ev.date)}
                    </span>
                  </div>
                ))}
              </div>
            )
          }
        </DashCard>
      </div>

      {/* ── Bar Chart + Celebrations ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>

        {/* Monthly Bar */}
        <DashCard isDark={isDark}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: tp, margin: 0 }}>Monthly Trend</h2>
            <span style={{ fontSize: 11, fontWeight: 600, color: ts }}>{new Date().getFullYear()}</span>
          </div>
          <BarChart isDark={isDark} data={monthlyData} />
        </DashCard>

        {/* Celebrations */}
        <DashCard isDark={isDark}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: tp, margin: 0 }}>Celebrations</h2>
            <span style={{ fontSize: 11, fontWeight: 700, color: ts }}>
              {MONTH_SHORT[new Date().getMonth()].toUpperCase()} {new Date().getFullYear()}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px', padding: '0 10px 8px', borderBottom: `1px solid ${divCol}` }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: ts, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Names</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: ts, textAlign: 'right', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Day</span>
          </div>

          {currentCelebrations.length === 0
            ? <div style={{ color: ts, fontSize: 13, padding: '14px 10px' }}>No celebrations this month.</div>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
                {currentCelebrations.map((c, i) => (
                  <div
                    key={c.id}
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr 50px',
                      padding: '10px 10px', borderRadius: 10, transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = rowHov)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: tp }}>{i + 1}. {c.name}</span>
                      <span style={{ fontSize: 10, color: ts, marginLeft: 6 }}>({c.event})</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b', textAlign: 'right' }}>
                      {String(c.day).padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>
            )
          }
        </DashCard>
      </div>

      {/* ── Scripture Quote ──────────────────────────────────────────────────── */}
      <DashCard  isDark={isDark} style={{ display: 'flex', gap: 16, alignItems: 'flex-start',  marginBottom: 50 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: 'linear-gradient(135deg, #06b6d4, #818cf8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        
        }}>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 900, lineHeight: 1 }}>"</span>
        </div>
        <div >
          <p style={{ fontSize: 13, fontStyle: 'italic', color: ts, margin: 0, lineHeight: 1.75 }}>
            "Not forsaking the assembling of ourselves together, as the manner of some is; but exhorting one another: and so much the more, as ye see the day approaching."
          </p>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#06b6d4', margin: '8px 0 0', letterSpacing: '0.03em' }}>
            Hebrews 10:25
          </p>
        </div>
      </DashCard>

    </div>
  );
}