

"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/app/components/ThemeProvider";

type PageId = "dashboard" | "members" | "attendance" | "programs" | "settings";

interface NavItem {
  id: PageId;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "DASHBOARD",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "members",
    label: "MEMBERS",
    href: "/dashboard/members",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
        <circle cx="9" cy="7" r="4" />
        <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
    ),
  },
  {
    id: "attendance",
    label: "ATTENDANCE",
    href: "/dashboard/attendance",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "programs",
    label: "PROGRAMS",
    href: "/dashboard/programs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function Sidebar({ activePage }: { activePage: PageId }) {
  const { isDark } = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);

  const bg = isDark ? "#111318" : "#ffffff";
  const border = isDark ? "#1e2028" : "#f0f0f0";
  const labelColor = isDark ? "#4b5262" : "#b0b7c3";
  const logoColor = isDark ? "#ffffff" : "#0f1117";

  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        flexShrink: 0,
        background: bg,
        borderRight: `1px solid ${border}`,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        transition: "background 0.3s, border-color 0.3s",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px" }}>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: logoColor }}>
            <span style={{ fontWeight: 300 }}>oasis</span>
            <span style={{ fontWeight: 900 }}>Portal</span>
          </span>
        </Link>
      </div>

      {/* Menu label */}
      <div
        style={{
          padding: "0 24px 12px",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.15em",
          color: labelColor,
          textTransform: "uppercase",
        }}

        className="mt-5"
      >
        Menu
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "0 12px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          const isHovered = hovered === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 12,
                fontFamily: "inherit",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textDecoration: "none",
                transition: "all 0.15s",
                background: isActive
                  ? isDark ? "#ffffff" : "#0f1117"
                  : isHovered
                  ? isDark ? "#1a1d27" : "#f5f6f8"
                  : "transparent",
                color: isActive
                  ? isDark ? "#0f1117" : "#ffffff"
                  : isDark ? "#6b7280" : "#6b7280",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: isActive
                    ? isDark ? "#0f1117" : "#ffffff"
                    : isDark ? "#6b7280" : "#9ca3af",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: `1px solid ${border}`, padding: "12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Settings */}
        <Link
          href="/dashboard/settings"
          
          onMouseEnter={() => setHovered("settings")}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderRadius: 12,
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textDecoration: "none",
            transition: "all 0.15s",
            background:
              activePage === "settings"
                ? isDark ? "#ffffff" : "#0f1117"
                : hovered === "settings"
                ? isDark ? "#1a1d27" : "#f5f6f8"
                : "transparent",
            color:
              activePage === "settings"
                ? isDark ? "#0f1117" : "#ffffff"
                : isDark ? "#6b7280" : "#6b7280",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            stroke={activePage === "settings" ? (isDark ? "#0f1117" : "#fff") : "#9ca3af"}
            style={{ width: 15, height: 15 }}
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          SETTINGS
        </Link>

        {/* Logout */}
        <button
          onMouseEnter={() => setHovered("logout")}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 14px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            width: "100%",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            transition: "all 0.15s",
            background: hovered === "logout" ? "rgba(239,68,68,0.08)" : "transparent",
            color: "#ef4444",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            stroke="#ef4444"
            style={{ width: 15, height: 15 }}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}