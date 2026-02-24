


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





'use client';

import { Users, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

const stats = [
  { title: "Total members", value: "20", icon: Users, color: "text-pink-500", subtitle: "" },
  { title: "Active members", value: "13", icon: Users, color: "text-green-500", subtitle: "Last 2 meetings" },
  { title: "New Member(s)", value: "05", icon: UserPlus, color: "text-blue-500", subtitle: "Last 4 weeks" },
];

const pieData = [
  { name: "Impressions", value: 40, fill: "#3b82f6" },
  { name: "Click-Through Rate", value: 30, fill: "#10b981" },
  { name: "Engagement Rate", value: 30, fill: "#8b5cf6" },
];

const upcomingEvents = [
  { name: "Healing Streams", date: "April 9th" },
  { name: "Reach out world", date: "March 5th" },
  { name: "Pastors Birthday", date: "Dec 7th" },
  { name: "IPPC", date: "March 6th" },

  // ...
];

const celebrations = [
  { name: "Esteemed Bro. John Ezra", day: "05" },
  { name: "Esteemed Sis. Praise Oluchi", day: "20" },
  { name: "Esteemed Sis. Glory Esther", day: "14" },
];

const renderCustomLabel = ({ cx, cy }: any) => (
  <g>
    <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="central">
      <tspan fontSize="28" fontWeight="bold" fill="#444">
        20
      </tspan>
    </text>
    <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="central">
      <tspan fontSize="13" fill="#666">
        Total Members
      </tspan>
    </text>
  </g>
);

export default function Dashboard() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-10 text-zinc-800">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-12">
        {stats.map((item, i) => (
          <Card key={i} className="bg-white border-none shadow-sm">
            <CardContent className="p-7">
              <div className="flex items-center justify-between mb-5">
                <p className="text-lg text-zinc-500 font-medium">{item.title}</p>
                <div className="bg-zinc-100 p-4 rounded-full">
                  <item.icon className={`h-7 w-7 ${item.color}`} />
                </div>
              </div>
              <div className="text-6xl font-bold text-zinc-900 pl-2">{item.value}</div>
              {item.subtitle && (
                <p className="text-sm text-zinc-500 mt-2 pl-2">{item.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Pie + Upcoming */}
        <Card className="bg-white lg:col-span-2 shadow-sm">
          <div className="p-6 pb-2">
            <h2 className="text-xl font-semibold text-zinc-800">Average Attendance</h2>
          </div>
          <div className="h-96 px-4">
            <ChartContainer
              config={{
                impressions: { label: "Impressions", color: "#3b82f6" },
                ctr: { label: "Click-Through Rate", color: "#10b981" },
                engagement: { label: "Engagement Rate", color: "#8b5cf6" },
              }}
              className="h-full"
            >
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={4}
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-6 pb-2">
            <h2 className="text-xl font-semibold text-zinc-800">Upcoming Events</h2>
          </div>
          <div className="px-6 pb-6">
            <ul className="space-y-5">
              {upcomingEvents.map((event, i) => (
                <li key={i} className="flex justify-between text-base">
                  <span className="text-zinc-700 font-medium">{event.name}</span>
                  <span className="text-zinc-500">{event.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Celebrations */}
        <Card className="bg-white lg:col-span-3 shadow-sm">
          <div className="p-6 pb-2 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-800">Celebrations</h2>
            <Badge
              variant="outline"
              className="bg-zinc-800 text-white border-zinc-700 px-4 py-2 text-base"
            >
              Month: <span className="font-bold ml-1.5">March</span>
            </Badge>
          </div>
          <div className="px-6 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {celebrations.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 bg-zinc-50 border rounded-xl"
                >
                  <span className="text-zinc-800 text-lg font-medium">{item.name}</span>
                  <Badge className="bg-zinc-800 text-white px-4 py-1.5 text-sm">
                    DAY {item.day}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}