"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/app/components/ThemeProvider";

type NotifType = "success" | "warning" | "info";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NOTIFS_INIT: Notification[] = [
  { id: 1, type: "success", title: "Attendance Saved",     message: "Prayer Meeting Jun 5th has been recorded.",   time: "2m ago", read: false },
  { id: 2, type: "info",    title: "New Member Added",     message: "Sis. Mary Grace has been added to the cell.", time: "1h ago", read: false },
  { id: 3, type: "warning", title: "Upcoming Event",       message: "Pastor's Birthday is coming up on Dec 7th.",  time: "3h ago", read: false },
  { id: 4, type: "info",    title: "Celebration Reminder", message: "Bro. John Ezra celebrates on the 5th!",       time: "1d ago", read: true  },
  { id: 5, type: "success", title: "Milestone Reached",    message: "Your cell has reached 20 total members!",     time: "2d ago", read: true  },
];

const TYPE_STYLE: Record<NotifType, { bg: string; color: string; icon: string }> = {
  success: { bg: "#d1fae5", color: "#059669", icon: "✓" },
  warning: { bg: "#fef3c7", color: "#d97706", icon: "!" },
  info:    { bg: "#dbeafe", color: "#2563eb", icon: "i" },
};

export default function Topbar() {
  const { isDark, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs]       = useState<Notification[]>(NOTIFS_INIT);
  const [search, setSearch]       = useState("");
  const panelRef                  = useRef<HTMLDivElement>(null);

  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const bg       = isDark ? "#111318" : "#ffffff";
  const border   = isDark ? "#1e2028" : "#f0f0f0";
  const sbg      = isDark ? "#1a1d27" : "#f5f6f8";
  const ic       = isDark ? "#6b7280" : "#9ca3af";
  const tp       = isDark ? "#f3f4f6" : "#0f1117";
  const ts       = isDark ? "#6b7280" : "#9ca3af";
  const panelBg  = isDark ? "#16181f" : "#ffffff";
  const panelBd  = isDark ? "#1e2028" : "#e5e7eb";
  const userBg   = isDark ? "#1a1d27" : "#f5f6f8";
  const nhBg     = isDark ? "#1a1d27" : "#f9fafb";
  const unreadBg = isDark ? "rgba(6,182,212,0.06)" : "rgba(6,182,212,0.04)";

  return (
    <header
      style={{
        height: 64,
        background: bg,
        borderBottom: `1px solid ${border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 40,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      {/* Search */}
      <div style={{ flex: 1, maxWidth: 400, position: "relative" }}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={2}
          stroke={ic}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 15,
            height: 15,
            pointerEvents: "none",
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search members"
          style={{
            width: "100%",
            height: 40,
            paddingLeft: 38,
            paddingRight: 16,
            borderRadius: 20,
            border: "1.5px solid transparent",
            background: sbg,
            color: isDark ? "#e5e7eb" : "#374151",
            fontSize: 13,
            fontFamily: "inherit",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#06b6d4";
            e.target.style.boxShadow = "0 0 0 3px rgba(6,182,212,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "transparent";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = sbg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#facc15" style={{ width: 18, height: 18 }}>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 18, height: 18 }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Bell */}
        <div style={{ position: "relative" }} ref={panelRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "none",
              background: notifOpen ? sbg : "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = sbg)}
            onMouseLeave={(e) => {
              if (!notifOpen) e.currentTarget.style.background = "transparent";
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 18, height: 18 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unread > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${bg}`,
                }}
              >
                {unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 44,
                width: 320,
                borderRadius: 16,
                background: panelBg,
                border: `1px solid ${panelBd}`,
                boxShadow: isDark
                  ? "0 20px 60px rgba(0,0,0,0.6)"
                  : "0 20px 60px rgba(0,0,0,0.12)",
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderBottom: `1px solid ${panelBd}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: tp }}>Notifications</span>
                  {unread > 0 && (
                    <span
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderRadius: 20,
                      }}
                    >
                      {unread} new
                    </span>
                  )}
                </div>
                {unread > 0 && (
                  <button
                    onClick={() => setNotifs((p) => p.map((n) => ({ ...n, read: true })))}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#06b6d4",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {notifs.length === 0 ? (
                  <div style={{ padding: "32px 16px", textAlign: "center", color: ts, fontSize: 13 }}>
                    No notifications
                  </div>
                ) : (
                  notifs.map((n) => {
                    const t = TYPE_STYLE[n.type];
                    return (
                      <div
                        key={n.id}
                        style={{
                          display: "flex",
                          gap: 12,
                          padding: "12px 16px",
                          borderBottom: `1px solid ${panelBd}`,
                          background: !n.read ? unreadBg : "transparent",
                          transition: "background 0.15s",
                          cursor: "default",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = nhBg)}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = !n.read ? unreadBg : "transparent")
                        }
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: t.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 800,
                            color: t.color,
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          {t.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: tp }}>{n.title}</span>
                            <button
                              onClick={() => setNotifs((p) => p.filter((x) => x.id !== n.id))}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                color: ts,
                                fontSize: 14,
                                padding: 0,
                                fontFamily: "inherit",
                              }}
                            >
                              ×
                            </button>
                          </div>
                          <p style={{ fontSize: 11, color: ts, margin: "3px 0 4px", lineHeight: 1.5 }}>
                            {n.message}
                          </p>
                          <span style={{ fontSize: 10, color: isDark ? "#374151" : "#d1d5db" }}>
                            {n.time}
                          </span>
                        </div>
                        {!n.read && (
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: "#06b6d4",
                              flexShrink: 0,
                              marginTop: 8,
                            }}
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "7px 14px 7px 8px",
            background: userBg,
            borderRadius: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: isDark ? "#2a2d3a" : "#e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 16, height: 16 }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: tp, lineHeight: 1.3 }}>Bro. Andrew</div>
            <div style={{ fontSize: 10, color: ts }}>Cell Leader</div>
          </div>
        </div>

      </div>
    </header>
  );
}