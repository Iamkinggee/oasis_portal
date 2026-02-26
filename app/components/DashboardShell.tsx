// "use client";

// import { usePathname } from "next/navigation";
// import Sidebar from "@/app/components/Sidebar";
// import Topbar from "@/app/components/Topbar";
// import { useTheme } from "@/app/components/ThemeProvider";
// import { ReactNode } from "react";

// type PageId = "dashboard" | "members" | "attendance" | "programs" | "settings";

// function getActivePage(pathname: string): PageId {
//   if (pathname === "/dashboard") return "dashboard";
//   if (pathname.includes("/members")) return "members";
//   if (pathname.includes("/attendance")) return "attendance";
//   if (pathname.includes("/programs")) return "programs";
//   if (pathname.includes("/settings")) return "settings";
//   return "dashboard";
// }

// export default function DashboardShell({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const activePage = getActivePage(pathname);
//   const { isDark } = useTheme();

//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "100vh",
//         overflow: "hidden",
//         background: isDark ? "#0d0f14" : "#f3f4f6",
//         transition: "background 0.3s",
//       }}
//     >
//       <Sidebar activePage={activePage} />
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//           minWidth: 0,
//         }}
//       >
//         <Topbar />
//         <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }













"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import { useTheme } from "@/app/components/ThemeProvider";
import { createClient } from "@/lib/supabase/client";
import { ReactNode } from "react";

type PageId = "dashboard" | "members" | "attendance" | "programs" | "settings";

function getActivePage(pathname: string): PageId {
  if (pathname === "/dashboard") return "dashboard";
  if (pathname.includes("/members")) return "members";
  if (pathname.includes("/attendance")) return "attendance";
  if (pathname.includes("/programs")) return "programs";
  if (pathname.includes("/settings")) return "settings";
  return "dashboard";
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const activePage = getActivePage(pathname);
  const { isDark } = useTheme();

  // ── Auth guard: listen for sign-out or account deletion ──────────────────
  // Middleware handles the initial load, but if the session is invalidated
  // WHILE the user is already on the dashboard (e.g. account permanently
  // deleted from another tab, or session revoked), this catches it client-side
  // and immediately redirects to the hero page.
  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // SIGNED_OUT covers: manual logout, session expiry, account deletion
        // USER_DELETED is fired specifically when the account is permanently removed
        if (
          event === 'SIGNED_OUT' ||
          // event === 'USER_DELETED' ||
          session === null
        ) {
          router.replace('/Heropage');
        }
      }
    );

    // Also do an immediate session check on mount — catches the case where
    // the user navigated directly to a dashboard URL after deletion
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/Heropage');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: isDark ? "#0d0f14" : "#f3f4f6",
        transition: "background 0.3s",
      }}
    >
      <Sidebar activePage={activePage} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Topbar />
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}