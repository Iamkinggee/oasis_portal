


// // app/dashboard/page.tsx
// 'use client'

// import {
//   Bell,
//   Home,
//   Users,
//   Calendar,
//   BookOpen,
//   Settings,
//   LogOut,
//   Search,
//   UserPlus,
//   User,
// } from "lucide-react"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Separator } from "@/components/ui/separator"
// import {
//   Pie,
//   PieChart,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
// } from "recharts"
// import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// // ── Mock Data ────────────────────────────────────────────────────────
// const stats = [
//   { title: "Total members", value: "20", icon: Users, color: "text-pink-500", subtitle: "" },
//   { title: "Active members", value: "13", icon: Users, color: "text-green-500", subtitle: "Last 2 meetings" },
//   { title: "New Member(s)", value: "05", icon: UserPlus, color: "text-blue-500", subtitle: "Last 4 weeks" },
// ]

// const pieData = [
//   { name: "Impressions", value: 40, fill: "#3b82f6" },
//   { name: "Click-Through Rate", value: 30, fill: "#10b981" },
//   { name: "Engagement Rate", value: 30, fill: "#8b5cf6" },
// ]

// const upcomingEvents = [
//   { name: "Healing Streams", date: "April 9th" },
//   { name: "Reach out world", date: "March 5th" },
//   { name: "Pastors Birthday", date: "Dec 7th" },
//   { name: "IPPC", date: "March 6th" },
//   { name: "Communion Service", date: "April 1st" },
//   { name: "Cell Outreach", date: "March 28th" },
//   { name: "Gospel Train", date: "June 7th" },
// ]

// const celebrations = [
//   { name: "Esteemed Bro. John Ezra", day: "05" },
//   { name: "Esteemed Sis. Praise Oluchi", day: "20" },
//   { name: "Esteemed Sis. Glory Esther", day: "14" },
// ]

// // ── Custom center label for pie chart ────────────────────────────────
// const renderCustomLabel = ({ cx, cy }: any) => (
//   <g>
//     <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="central">
//       <tspan fontSize="25" fontWeight="bold" fill="gray">
//        20
//       </tspan>
//     </text>
//     <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="central">
//       <tspan fontSize="12" fill="#9ca3af">
//         Total Members
//       </tspan>
//     </text>
//   </g>
// )

// export default function Dashboard() {
//   return (
//     <div className="flex h-screen overflow-hidden  text-white">
//       {/* Sidebar */}
//       <aside className="hidden md:flex w-70 flex-col border-r bg-white ">
//         <div className="p-12 text-zinc-800">
//           <h1 className="text-2xl font-extrabold ">oasis <span className="font-light ">portal</span></h1>
//         </div>


//         <div className="p-3 bg-white ">
//            <nav className="flex-1 px-3 py- space-y-1 rounded-2xl ">
//           <h1 className="text-zinc-400 mb-5">MENU</h1>
//           <Button
//             variant="secondary"
//             className="w-full justify-start gap-3 mb-5 bg-zinc-800 hover:bg-zinc-700 text-[18px] text-white font-medium"
//           >
//             <Home className="h-5 w-5" />
//             DASHBOARD
//           </Button>

//           <Button variant="ghost" className="w-full mb-5 justify-start gap-3 text-zinc-600 text-[18px] hover:text-white hover:bg-zinc-800/50">
//             <Users className="h-5 w-5" />
//             MEMBERS
//           </Button>

//           <Button variant="ghost" className="w-full mb-5 justify-start gap-3 text-zinc-600 text-[18px] hover:text-white hover:bg-zinc-800/50">
//             <Calendar className="h-5 w-5" />
//             ATTENDANCE
//           </Button>

//           <Button variant="ghost" className="w-full mb-5 justify-start gap-3 text-zinc-600 text-[18px] hover:text-white hover:bg-zinc-800/50">
//             <BookOpen className="h-5 w-5" />
//             PROGRAMS
//           </Button>

//           <Separator className="my-6 bg-zinc-300" />

//          <div className="mt-56">
//            <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-600 text-[18px]  hover:text-white mb-5 hover:bg-zinc-800/50">
//             <Settings className="h-5 w-5" />
//             SETTINGS
//           </Button>

//           <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 text-[18px] font-semibold hover:text-red-300 mb-5 hover:bg-zinc-800/50 mt-auto">
//             <LogOut className="h-5 w-5" />
//             Log out
//           </Button>
//          </div>
//         </nav>
//         </div>

       
//       </aside>








//       {/* Main area */}
//       <div className="flex-1 bg-zinc-200 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="border-b  px-10 py-4 flex items-center justify-between bg-white ">
//           <div className="flex items-center gap-6">
//             <div className="relative w-110  py-5 ">
//               <Search className="absolute left-100   top-1/2 h-5 w-5  -translate-y-1/2 text-zinc-500" />
//               <Input
//                 placeholder="Search members"
//                 className="pl-10 ml-1 bg-zinc-200 p-6 border-zinc-300 rounded-2xl  text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500 "
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-6">
//             <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50">
//               <Bell className="h-5 w-5" />
//             </Button>

//             <div className="flex items-center gap-3">
//               <Avatar className="h-9 w-9">
//                 <AvatarImage src="/placeholder-user.jpg" alt="Bro. Andrew" />
//                 <AvatarFallback className="bg-zinc-700">BA</AvatarFallback>
//               </Avatar>
//               <div className="hidden sm:block">
//                 <div className="font-medium text-sm text-zinc-800">Bro. Andrew</div>
//                 <div className="text-xs text-zinc-500">Cell Leader</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Content */}
//         <main className="flex-1 overflow-y-auto p-11">
//           <h1 className="text-2xl font-bold mb-8 text-zinc-800">Dashboard</h1>

//           {/* Stats row */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//             {stats.map((item, i) => (
//               <Card key={i} className="bg-white text-zinc-800 border-none">
//                 <CardContent className="p-6 ">
//                   <div className="flex items-center justify-between mb-4">
//                     <p className="text-[20px] pl-3 text-zinc-400 font-medium">{item.title}</p>

//                  <div className="bg-zinc-100 p-5 rounded-full ">     <item.icon className={`h-6 w-6  ${item.color}`} />
//                  </div>


//                   </div>
//                   <div className="text-7xl pl-10 font-bold">{item.value}</div>
//                   {item.subtitle && (
//                     <p className="text-[15px] pt-3 pl-5 text-zinc-500 mt-1">{item.subtitle}</p>
//                   )}
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Pie Chart - takes more space */}
//             <Card className="bg-white lg:col-span-2">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg text-zinc-700">Average Attendance</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-80 relative">
//                   <ChartContainer
//                     config={{
//                       impressions: { label: "Impressions", color: "#3b82f6" },
//                       ctr: { label: "Click-Through Rate", color: "#10b981" },
//                       engagement: { label: "Engagement Rate", color: "#8b5cf6" },
//                     }}
//                     className="h-full"
//                   >
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={pieData}
//                           cx="50%"
//                           cy="50%"
//                           innerRadius={70}
//                           outerRadius={110}
//                           paddingAngle={4}
//                           dataKey="value"
//                           label={renderCustomLabel}
//                           labelLine={false}
//                           isAnimationActive={true}
//                           animationDuration={1400}
//                         >
//                           {pieData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.fill} />
//                           ))}
//                         </Pie>
//                         <Tooltip content={<ChartTooltipContent />} />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </ChartContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Upcoming Events */}
//             <Card className="bg-white">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg text-zinc-700">Upcoming Events</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-4 ">
//                   {upcomingEvents.map((event, i) => (
//                     <li key={i} className="flex justify-between text-sm">
//                       <span className="text-zinc-500 font-medium text-xl">{event.name}</span>
//                       <span className="text-zinc-500  font-medium text-xl">{event.date}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>

//             {/* Celebrations */}
//             <Card className="bg-white lg:col-span-3">
//               <CardHeader className="pb-2">
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-lg text-zinc-700">celebrations</CardTitle>
//                   <Badge variant="outline" className="bg-zinc-800 border-zinc-700 text-white p-2 text-[15px]">
//                     Month: 

//                     <span className="text-xl">March</span>
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {celebrations.map((item, i) => (
//                     <div
//                       key={i}
//                       className="flex items-center justify-between p-4 bg-zinc-200/50 border rounded-lg"
//                     >
//                       <span className="text-zinc-700 text-xl font-medium">{item.name}</span>
//                       <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 p-2 text-[14px] font-medium">
//                         DAY {item.day}
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }





// 'use client';

// import { Users, UserPlus } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
// } from "recharts";
// import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
// import { Badge } from "@/components/ui/badge";

// const stats = [
//   { title: "Total members", value: "20", icon: Users, color: "text-pink-500", subtitle: "" },
//   { title: "Active members", value: "13", icon: Users, color: "text-green-500", subtitle: "Last 2 meetings" },
//   { title: "New Member(s)", value: "05", icon: UserPlus, color: "text-blue-500", subtitle: "Last 4 weeks" },
// ];

// const pieData = [
//   { name: "Impressions", value: 40, fill: "#3b82f6" },
//   { name: "Click-Through Rate", value: 30, fill: "#10b981" },
//   { name: "Engagement Rate", value: 30, fill: "#8b5cf6" },
// ];

// const upcomingEvents = [
//   { name: "Healing Streams", date: "April 9th" },
//   { name: "Reach out world", date: "March 5th" },
//   { name: "Pastors Birthday", date: "Dec 7th" },
//   { name: "IPPC", date: "March 6th" },

//   // ...
// ];

// const celebrations = [
//   { name: "Esteemed Bro. John Ezra", day: "05" },
//   { name: "Esteemed Sis. Praise Oluchi", day: "20" },
//   { name: "Esteemed Sis. Glory Esther", day: "14" },
// ];

// const renderCustomLabel = ({ cx, cy }: any) => (
//   <g>
//     <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="central">
//       <tspan fontSize="28" fontWeight="bold" fill="#444">
//         20
//       </tspan>
//     </text>
//     <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="central">
//       <tspan fontSize="13" fill="#666">
//         Total Members
//       </tspan>
//     </text>
//   </g>
// );

// export default function Dashboard() {
//   return (
//     <>
//       <h1 className="text-3xl font-bold mb-10 text-zinc-800">Dashboard</h1>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-12">
//         {stats.map((item, i) => (
//           <Card key={i} className="bg-white border-none shadow-sm">
//             <CardContent className="p-7">
//               <div className="flex items-center justify-between mb-5">
//                 <p className="text-lg text-zinc-500 font-medium">{item.title}</p>
//                 <div className="bg-zinc-100 p-4 rounded-full">
//                   <item.icon className={`h-7 w-7 ${item.color}`} />
//                 </div>
//               </div>
//               <div className="text-6xl font-bold text-zinc-900 pl-2">{item.value}</div>
//               {item.subtitle && (
//                 <p className="text-sm text-zinc-500 mt-2 pl-2">{item.subtitle}</p>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
//         {/* Pie + Upcoming */}
//         <Card className="bg-white lg:col-span-2 shadow-sm">
//           <div className="p-6 pb-2">
//             <h2 className="text-xl font-semibold text-zinc-800">Average Attendance</h2>
//           </div>
//           <div className="h-96 px-4">
//             <ChartContainer
//               config={{
//                 impressions: { label: "Impressions", color: "#3b82f6" },
//                 ctr: { label: "Click-Through Rate", color: "#10b981" },
//                 engagement: { label: "Engagement Rate", color: "#8b5cf6" },
//               }}
//               className="h-full"
//             >
//               <ResponsiveContainer>
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={80}
//                     outerRadius={120}
//                     paddingAngle={4}
//                     dataKey="value"
//                     label={renderCustomLabel}
//                     labelLine={false}
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.fill} />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<ChartTooltipContent />} />
//                 </PieChart>
//               </ResponsiveContainer>
//             </ChartContainer>
//           </div>
//         </Card>

//         <Card className="bg-white shadow-sm">
//           <div className="p-6 pb-2">
//             <h2 className="text-xl font-semibold text-zinc-800">Upcoming Events</h2>
//           </div>
//           <div className="px-6 pb-6">
//             <ul className="space-y-5">
//               {upcomingEvents.map((event, i) => (
//                 <li key={i} className="flex justify-between text-base">
//                   <span className="text-zinc-700 font-medium">{event.name}</span>
//                   <span className="text-zinc-500">{event.date}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </Card>

//         {/* Celebrations */}
//         <Card className="bg-white lg:col-span-3 shadow-sm">
//           <div className="p-6 pb-2 flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-zinc-800">Celebrations</h2>
//             <Badge
//               variant="outline"
//               className="bg-zinc-800 text-white border-zinc-700 px-4 py-2 text-base"
//             >
//               Month: <span className="font-bold ml-1.5">March</span>
//             </Badge>
//           </div>
//           <div className="px-6 pb-8">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {celebrations.map((item, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between p-5 bg-zinc-50 border rounded-xl"
//                 >
//                   <span className="text-zinc-800 text-lg font-medium">{item.name}</span>
//                   <Badge className="bg-zinc-800 text-white px-4 py-1.5 text-sm">
//                     DAY {item.day}
//                   </Badge>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Card>
//       </div>
//     </>
//   );
// }




















'use client';

import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Theme = 'light' | 'dark';

// ─── Data ─────────────────────────────────────────────────────────────────────
const UPCOMING_EVENTS = [
  { id: 1, name: 'Healing Streams',  date: 'April 9th'  },
  { id: 2, name: 'Reach Out World',  date: 'March 5th'  },
  { id: 3, name: "Pastor's Birthday",date: 'Dec. 7th'   },
  { id: 4, name: 'Cell Conference',  date: 'May 12th'   },
];

const CELEBRATIONS = [
  { id: 1, name: 'Esteemed Bro. John Ezra',     day: 5  },
  { id: 2, name: 'Esteemed Sis. Praise Oluchi', day: 20 },
  { id: 3, name: 'Esteemed Bro. Samuel Oke',    day: 27 },
];

const MONTHS    = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const BAR_VALS  = [58, 72, 50, 83, 68, 91];

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

// ─── Animated Counter ─────────────────────────────────────────────────────────
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
function DonutChart({ isDark }: { isDark: boolean }) {
  const prog = useAnimatedProgress(150, 1400);

  const segs = [
    { label: 'Present',  pct: 65, color: '#06b6d4' },
    { label: 'Absent',   pct: 20, color: '#818cf8' },
    { label: 'New Mbrs', pct: 15, color: '#34d399' },
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
      {/* SVG */}
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
            {Math.round(65 * prog)}%
          </text>
        </svg>
      </div>

      {/* Legend + bars */}
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
              <div style={{
                height: '100%', borderRadius: 3, background: s.color,
                width: `${s.pct * prog}%`, transition: 'width 0.05s',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ isDark }: { isDark: boolean }) {
  const prog = useAnimatedProgress(300, 1000);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 96 }}>
        {MONTHS.map((m, i) => {
          const isLast = i === MONTHS.length - 1;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
              {/* Peak label */}
              <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
                {isLast && prog > 0.85 && (
                  <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    fontSize: 10, fontWeight: 800, color: '#06b6d4', whiteSpace: 'nowrap',
                  }}>
                    {BAR_VALS[i]}%
                  </div>
                )}
                <div style={{
                  width: '100%', borderRadius: '5px 5px 0 0',
                  height: `${BAR_VALS[i] * prog}%`,
                  background: isLast
                    ? 'linear-gradient(to top, #06b6d4, #818cf8)'
                    : isDark ? '#2a2d3a' : '#e9edf5',
                  transition: `height 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 70}ms`,
                }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: isDark ? '#4b5262' : '#b0b7c3', fontFamily: 'inherit' }}>{m}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, iconPath, iconColor, iconBg, isDark, delay,
}: {
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
      transition: 'background 0.3s, border-color 0.3s, box-shadow 0.2s',
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
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={iconColor} style={{ width: 20, height: 20 }}>
            <path d={iconPath} />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ isDark, children, style = {} }: { isDark: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: isDark ? '#16181f' : '#ffffff',
      border: `1px solid ${isDark ? '#1e2028' : '#ebebeb'}`,
      borderRadius: 18, padding: '22px 24px',
      boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 16px rgba(0,0,0,0.05)',
      transition: 'background 0.3s, border-color 0.3s',
      fontFamily: 'inherit',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  // Read theme from localStorage so it stays in sync with layout
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(localStorage.getItem('oasis-theme') === 'dark');
    check();
    // Re-check when storage changes (theme toggle in Topbar fires this)
    window.addEventListener('storage', check);
    // Also poll lightly for same-tab updates (layout toggles don't fire storage event)
    const id = setInterval(check, 200);
    return () => { window.removeEventListener('storage', check); clearInterval(id); };
  }, []);

  const tp      = isDark ? '#f3f4f6' : '#0f1117';
  const ts      = isDark ? '#6b7280' : '#9ca3af';
  const divCol  = isDark ? '#1e2028' : '#f0f0f0';
  const rowHov  = isDark ? '#1a1d27' : '#f9fafb';

  const STATS = [
    {
      label: 'Total members',  value: 20, sub: null,
      iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
      iconColor: '#ec4899', iconBg: isDark ? 'rgba(236,72,153,0.12)' : '#fce7f3',
    },
    {
      label: 'Active members', value: 13, sub: 'Last 2 meetings',
      iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 11l2 2 4-4',
      iconColor: '#22c55e', iconBg: isDark ? 'rgba(34,197,94,0.12)' : '#dcfce7',
    },
    {
      label: 'New Member(s)',  value: 5,  sub: 'Last 4 weeks',
      iconPath: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6',
      iconColor: '#f59e0b', iconBg: isDark ? 'rgba(245,158,11,0.12)' : '#fef3c7',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Page title */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: tp, margin: 0, letterSpacing: '-0.3px' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: ts, margin: '4px 0 0' }}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
          })}
        </p>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {STATS.map((s, i) => (
          <StatCard key={i} {...s} isDark={isDark} delay={850 + i * 120} />
        ))}
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Donut */}
        <Card isDark={isDark}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: tp, margin: 0 }}>Average Attendance</h2>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#06b6d4" style={{ width: 16, height: 16 }}>
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <DonutChart isDark={isDark} />
        </Card>

        {/* Upcoming Events */}
        <Card isDark={isDark}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: tp, margin: 0 }}>Upcoming Events</h2>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#818cf8" style={{ width: 16, height: 16 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {UPCOMING_EVENTS.map((ev, i) => (
              <div
                key={ev.id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 10px', borderRadius: 10, cursor: 'default', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = rowHov)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: ts }}>{i + 1}.</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: tp }}>{ev.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#06b6d4' }}>{ev.date}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Bar Chart + Celebrations ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Monthly Bar */}
        <Card isDark={isDark}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: tp, margin: 0 }}>Monthly Trend</h2>
            <span style={{ fontSize: 11, fontWeight: 600, color: ts }}>2026</span>
          </div>
          <BarChart isDark={isDark} />
          <p style={{
            fontSize: 11, color: ts, margin: '12px 0 0',
            borderTop: `1px solid ${divCol}`, paddingTop: 10,
          }}>
            Attendance peaked in{' '}
            <span style={{ color: '#06b6d4', fontWeight: 700 }}>June</span> at 91%
          </p>
        </Card>

        {/* Celebrations */}
        <Card isDark={isDark}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: tp, margin: 0 }}>celebrations</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#f59e0b" style={{ width: 14, height: 14 }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 700, color: ts }}>MONTH: March</span>
            </div>
          </div>

          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 50px',
            padding: '0 10px 8px',
            borderBottom: `1px solid ${divCol}`,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: ts, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Names</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: ts, textAlign: 'right', letterSpacing: '0.08em', textTransform: 'uppercase' }}>DAY</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
            {CELEBRATIONS.map((c, i) => (
              <div
                key={c.id}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 50px',
                  padding: '10px 10px', borderRadius: 10, transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = rowHov)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: tp }}>{i + 1}. {c.name}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {String(c.day).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Scripture Quote ──────────────────────────────────────────────────── */}
      <Card isDark={isDark} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: 'linear-gradient(135deg, #06b6d4, #818cf8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 900, lineHeight: 1 }}>"</span>
        </div>
        <div>
          <p style={{ fontSize: 13, fontStyle: 'italic', color: ts, margin: 0, lineHeight: 1.75 }}>
            "Not forsaking the assembling of ourselves together, as the manner of some is;
            but exhorting one another: and so much the more, as ye see the day approaching."
          </p>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#06b6d4', margin: '8px 0 0', letterSpacing: '0.03em' }}>
            Hebrews 10:25
          </p>
        </div>
      </Card>

    </div>
  );
}
