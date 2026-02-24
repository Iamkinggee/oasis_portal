
// import { Bell, Search } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Sidebar from "@/components/Sidebar/Sidebar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {

  




//   return (
//     <div className="flex h-screen overflow-hidden text-white bg-zinc-100">
//       {/* Sidebar – shared across all dashboard pages */}
//       <Sidebar activePage="dashboard"  />

//       {/* Main area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header – can also be extracted later if needed */}
//         <header className="border-b px-10 py-5 flex items-center justify-between bg-white">
//           <div className="flex items-center gap-6">
//             <div className="relative w-96">
//               <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
//               <Input
//                 placeholder="Search members"
//                 className="pl-12 bg-zinc-100 border-zinc-300 rounded-2xl text-zinc-800 placeholder:text-zinc-500 focus-visible:ring-zinc-400"
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-6">
//             <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-900">
//               <Bell className="h-5 w-5" />
//             </Button>

//             <div className="flex items-center gap-3">
//               <Avatar className="h-10 w-10">
//                 <AvatarImage src="/placeholder-user.jpg" alt="Bro. Andrew" />
//                 <AvatarFallback className="bg-zinc-700 text-white">BA</AvatarFallback>
//               </Avatar>
//               <div className="hidden sm:block">
//                 <div className="font-medium text-sm text-zinc-900">Bro. Andrew</div>
//                 <div className="text-xs text-zinc-500">Cell Leader</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page content goes here */}
//         <main className="flex-1 overflow-y-auto p-10 bg-zinc-100">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }







// import { Bell, Search } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Sidebar from "@/app/components/Sidebar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-screen overflow-hidden text-white bg-zinc-100">
//       {/* Sidebar – shared across all dashboard pages */}
//       <Sidebar activePage="dashboard" theme="light" />

//       {/* Main area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="border-b px-10 py-5 flex items-center justify-between bg-white">
//           <div className="flex items-center gap-6">
//             <div className="relative w-96">
//               <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
//               <Input
//                 placeholder="Search members"
//                 className="pl-12 bg-zinc-100 border-zinc-300 rounded-2xl text-zinc-800 placeholder:text-zinc-500 focus-visible:ring-zinc-400"
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-6">
//             <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-900">
//               <Bell className="h-5 w-5" />
//             </Button>

//             <div className="flex items-center gap-3">
//               <Avatar className="h-10 w-10">
//                 <AvatarImage src="/placeholder-user.jpg" alt="Bro. Andrew" />
//                 <AvatarFallback className="bg-zinc-700 text-white">BA</AvatarFallback>
//               </Avatar>
//               <div className="hidden sm:block">
//                 <div className="font-medium text-sm text-zinc-900">Bro. Andrew</div>
//                 <div className="text-xs text-zinc-500">Cell Leader</div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto p-10 bg-zinc-100">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }









// import ThemeProvider from "@/app/components/ThemeProvider";
// import Sidebar from "@/app/components/Sidebar";
// import Topbar from "@/app/components/Topbar";
// import { ReactNode } from "react";

// type PageId = "dashboard" | "members" | "attendance" | "programs" | "settings";

// export default function DashboardLayout({ children }: { children: ReactNode }) {
//   const activePage: PageId = "dashboard";

//   return (
//     <ThemeProvider>
//       <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
//         <Sidebar activePage={activePage} />
//         <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
//           <Topbar />
//           <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px", background: "#f3f4f6" }}>
//             {children}
//           </main>
//         </div>
//       </div>
//     </ThemeProvider>
//   );
// }



import ThemeProvider from "@/app/components/ThemeProvider";
import DashboardShell from "@/app/components/DashboardShell";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardShell>
        {children}
      </DashboardShell>
    </ThemeProvider>
  );
}



