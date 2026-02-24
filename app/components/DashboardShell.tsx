"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import { useTheme } from "@/app/components/ThemeProvider";
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
  const activePage = getActivePage(pathname);
  const { isDark } = useTheme();

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