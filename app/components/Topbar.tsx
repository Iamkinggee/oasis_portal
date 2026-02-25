
// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useTheme } from "@/app/components/ThemeProvider";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
// );

// // ── Types ─────────────────────────────────────────────────────────────────────
// type NotifType = "success" | "warning" | "info" | "error";

// interface AppNotification {
//   id: string;
//   type: NotifType;
//   title: string;
//   message: string;
//   timestamp: number;
//   read: boolean;
// }

// type CellProfile = {
//   cell_leader: string;
//   cell_name: string;
//   image_url: string | null;
// };

// // ── Global event bus so other pages can push notifications ────────────────────
// // Usage from any page: window.dispatchEvent(new CustomEvent("oasis:notify", { detail: { type, title, message } }))
// declare global {
//   interface WindowEventMap {
//     "oasis:notify": CustomEvent<{ type: NotifType; title: string; message: string }>;
//   }
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────
// function timeAgo(ts: number): string {
//   const s = Math.floor((Date.now() - ts) / 1000);
//   if (s < 60) return "just now";
//   if (s < 3600) return `${Math.floor(s / 60)}m ago`;
//   if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
//   return `${Math.floor(s / 86400)}d ago`;
// }

// function uid(): string {
//   return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
// }

// function makeNotif(type: NotifType, title: string, message: string): AppNotification {
//   return { id: uid(), type, title, message, timestamp: Date.now(), read: false };
// }

// // ── Theme-aware type styles ───────────────────────────────────────────────────
// const TYPE_META: Record<NotifType, { lightBg: string; darkBg: string; color: string; icon: string }> = {
//   success: { lightBg: "#d1fae5", darkBg: "rgba(16,185,129,0.18)", color: "#059669", icon: "✓" },
//   warning: { lightBg: "#fef3c7", darkBg: "rgba(245,158,11,0.18)", color: "#d97706", icon: "!" },
//   info:    { lightBg: "#dbeafe", darkBg: "rgba(59,130,246,0.18)",  color: "#2563eb", icon: "i" },
//   error:   { lightBg: "#fee2e2", darkBg: "rgba(239,68,68,0.18)",   color: "#dc2626", icon: "✕" },
// };

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function Topbar() {
//   const { isDark, toggleTheme } = useTheme();
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [notifs, setNotifs] = useState<AppNotification[]>([]);
//   const [profile, setProfile] = useState<CellProfile>({ cell_leader: "Cell Leader", cell_name: "OASIS", image_url: null });
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const panelRef = useRef<HTMLDivElement>(null);
//   const searchRef = useRef<HTMLInputElement>(null);

//   const unread = notifs.filter(n => !n.read).length;

//   // ── Push helper ───────────────────────────────────────────────────────────
//   const push = useCallback((type: NotifType, title: string, message: string) => {
//     setNotifs(prev => [makeNotif(type, title, message), ...prev].slice(0, 40));
//   }, []);

//   // ── Listen to global event bus ────────────────────────────────────────────
//   useEffect(() => {
//     const h = (e: CustomEvent<{ type: NotifType; title: string; message: string }>) => {
//       push(e.detail.type, e.detail.title, e.detail.message);
//     };
//     window.addEventListener("oasis:notify", h);
//     return () => window.removeEventListener("oasis:notify", h);
//   }, [push]);

//   // ── Fetch profile ─────────────────────────────────────────────────────────
//   const fetchProfile = useCallback(async () => {
//     const { data } = await supabase.from("cell_profile").select("cell_leader, cell_name, image_url").eq("id", 1).single();
//     if (data) setProfile(data);
//   }, []);

//   useEffect(() => { fetchProfile(); }, [fetchProfile]);

//   // ── Realtime: cell_profile ────────────────────────────────────────────────
//   useEffect(() => {
//     const ch = supabase.channel("topbar:profile")
//       .on("postgres_changes", { event: "UPDATE", schema: "public", table: "cell_profile" }, payload => {
//         const n = payload.new as any;
//         setProfile({ cell_leader: n.cell_leader, cell_name: n.cell_name, image_url: n.image_url });
//         push("success", "Profile Updated", "Cell profile has been updated.");
//       })
//       .subscribe();
//     return () => { supabase.removeChannel(ch); };
//   }, [push]);

//   // ── Realtime: members ─────────────────────────────────────────────────────
//   useEffect(() => {
//     const ch = supabase.channel("topbar:members")
//       .on("postgres_changes", { event: "INSERT", schema: "public", table: "members" }, payload => {
//         const name = (payload.new as any)?.name ?? "A member";
//         push("info", "New Member Added", `${name} has been added to the cell.`);
//       })
//       .on("postgres_changes", { event: "DELETE", schema: "public", table: "members" }, payload => {
//         push("warning", "Member Removed", "A member has been removed from the cell.");
//       })
//       .on("postgres_changes", { event: "UPDATE", schema: "public", table: "members" }, () => {
//         push("info", "Member Updated", "A member's details have been updated.");
//       })
//       .subscribe();
//     return () => { supabase.removeChannel(ch); };
//   }, [push]);

//   // ── Realtime: meetings ────────────────────────────────────────────────────
//   useEffect(() => {
//     const ch = supabase.channel("topbar:meetings")
//       .on("postgres_changes", { event: "INSERT", schema: "public", table: "meetings" }, payload => {
//         const n = payload.new as any;
//         push("info", "New Meeting Created", `"${n?.title ?? "Meeting"}" scheduled for ${n?.date ?? ""}.`);
//       })
//       .on("postgres_changes", { event: "UPDATE", schema: "public", table: "meetings" }, payload => {
//         const n = payload.new as any;
//         if (n?.saved === true) push("success", "Attendance Saved", `Attendance for "${n?.title ?? "meeting"}" has been recorded.`);
//       })
//       .on("postgres_changes", { event: "DELETE", schema: "public", table: "meetings" }, () => {
//         push("warning", "Meeting Deleted", "A meeting has been removed.");
//       })
//       .subscribe();
//     return () => { supabase.removeChannel(ch); };
//   }, [push]);

//   // ── Realtime: programs ────────────────────────────────────────────────────
//   useEffect(() => {
//     const ch = supabase.channel("topbar:programs")
//       .on("postgres_changes", { event: "INSERT", schema: "public", table: "programs" }, payload => {
//         const n = payload.new as any;
//         push("info", "Program Added", `"${n?.title ?? "Program"}" has been scheduled.`);
//       })
//       .on("postgres_changes", { event: "DELETE", schema: "public", table: "programs" }, () => {
//         push("warning", "Program Deleted", "A program has been removed.");
//       })
//       .subscribe();
//     return () => { supabase.removeChannel(ch); };
//   }, [push]);

//   // ── Realtime: celebrations ────────────────────────────────────────────────
//   useEffect(() => {
//     const ch = supabase.channel("topbar:celebrations")
//       .on("postgres_changes", { event: "INSERT", schema: "public", table: "celebrations" }, payload => {
//         const n = payload.new as any;
//         push("success", "Celebration Added", `${n?.name ?? "Someone"}'s ${n?.event ?? "celebration"} has been added.`);
//       })
//       .subscribe();
//     return () => { supabase.removeChannel(ch); };
//   }, [push]);

//   // ── Close panel on outside click ──────────────────────────────────────────
//   useEffect(() => {
//     const h = (e: MouseEvent) => {
//       if (panelRef.current && !panelRef.current.contains(e.target as Node)) setNotifOpen(false);
//     };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, []);

//   // Focus search input when mobile search opens
//   useEffect(() => {
//     if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
//   }, [searchOpen]);

//   // ── Theme tokens ──────────────────────────────────────────────────────────
//   const bg         = isDark ? "#111318" : "#ffffff";
//   const bd         = isDark ? "#1e2028" : "#f0f0f0";
//   const sbg        = isDark ? "#1a1d27" : "#f5f6f8";
//   const ic         = isDark ? "#6b7280" : "#9ca3af";
//   const tp         = isDark ? "#f3f4f6" : "#0f1117";
//   const ts         = isDark ? "#6b7280" : "#9ca3af";
//   const panelBg    = isDark ? "#15171e" : "#ffffff";
//   const panelBd    = isDark ? "#1e2028" : "#e5e7eb";
//   const userBg     = isDark ? "#1a1d27" : "#f5f6f8";
//   const hoverBg    = isDark ? "#1e2130" : "#f3f4f6";
//   const unreadHighlight = isDark ? "rgba(6,182,212,0.07)" : "rgba(6,182,212,0.05)";

//   const shortName = profile.cell_leader.split(" ").slice(0, 2).join(" ");

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <>
//       {/* ── Mobile search overlay ───────────────────────────────────────────── */}
//       {searchOpen && (
//         <div style={{
//           position: "fixed", inset: 0, zIndex: 999,
//           background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)",
//           backdropFilter: "blur(2px)",
//         }} onClick={() => setSearchOpen(false)}>
//           <div style={{
//             position: "absolute", top: 0, left: 0, right: 0,
//             background: bg, borderBottom: `1px solid ${bd}`,
//             padding: "12px 14px", display: "flex", gap: 10, alignItems: "center",
//           }} onClick={e => e.stopPropagation()}>
//             <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 16, height: 16, flexShrink: 0 }}>
//               <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
//             </svg>
//             <input
//               ref={searchRef}
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               placeholder="Search members..."
//               style={{
//                 flex: 1, height: 40, border: "none", background: "transparent",
//                 color: isDark ? "#e5e7eb" : "#111", fontSize: 15,
//                 fontFamily: "inherit", outline: "none",
//               }}
//             />
//             <button onClick={() => setSearchOpen(false)} style={{ border: "none", background: sbg, borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//               <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke={ic} style={{ width: 14, height: 14 }}>
//                 <path d="M18 6 6 18M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       <header style={{
//         height: 60,
//         background: bg,
//         borderBottom: `1px solid ${bd}`,
//         display: "flex",
//         alignItems: "center",
//         padding: "0 14px",
//         gap: 8,
//         position: "sticky",
//         top: 0,
//         zIndex: 40,
//         fontFamily: "'DM Sans', system-ui, sans-serif",
//         transition: "background 0.3s, border-color 0.3s",
//       }}>

//         {/* ── Desktop search ──────────────────────────────────────────────────── */}
//         <div style={{ flex: 1, maxWidth: 380, position: "relative", display: "none" }} id="topbar-search-desktop">
//           <style>{`
//             @media (min-width: 540px) { #topbar-search-desktop { display: block !important; } #topbar-search-mobile-btn { display: none !important; } }
//             @media (max-width: 539px) { #topbar-search-desktop { display: none !important; } }
//             @media (max-width: 379px) { #topbar-user-name { display: none !important; } }
//           `}</style>
//           <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic}
//             style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, pointerEvents: "none" }}>
//             <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
//           </svg>
//           <input
//             value={search} onChange={e => setSearch(e.target.value)}
//             placeholder="Search members..."
//             style={{
//               width: "100%", height: 38, paddingLeft: 34, paddingRight: 14,
//               borderRadius: 19, border: "1.5px solid transparent",
//               background: sbg, color: isDark ? "#e5e7eb" : "#374151",
//               fontSize: 13, fontFamily: "inherit", outline: "none",
//               boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
//             }}
//             onFocus={e => { e.target.style.borderColor = "#06b6d4"; e.target.style.boxShadow = "0 0 0 3px rgba(6,182,212,0.15)"; }}
//             onBlur={e => { e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "none"; }}
//           />
//         </div>

//         {/* ── Mobile search icon ───────────────────────────────────────────────── */}
//         <button id="topbar-search-mobile-btn"
//           onClick={() => setSearchOpen(true)}
//           style={{ width: 36, height: 36, borderRadius: 9, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
//           onMouseEnter={e => (e.currentTarget.style.background = sbg)}
//           onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
//         >
//           <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 18, height: 18 }}>
//             <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
//           </svg>
//         </button>

//         {/* ── Right controls ───────────────────────────────────────────────────── */}
//         <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>

//           {/* Theme toggle */}
//           <button onClick={toggleTheme} title="Toggle theme"
//             style={{ width: 36, height: 36, borderRadius: 9, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}
//             onMouseEnter={e => (e.currentTarget.style.background = sbg)}
//             onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
//           >
//             {isDark ? (
//               <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#facc15" style={{ width: 18, height: 18 }}>
//                 <circle cx="12" cy="12" r="5" />
//                 <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
//                 <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
//                 <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
//                 <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
//               </svg>
//             ) : (
//               <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 18, height: 18 }}>
//                 <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
//               </svg>
//             )}
//           </button>

//           {/* ── Bell ──────────────────────────────────────────────────────────── */}
//           <div style={{ position: "relative" }} ref={panelRef}>
//             <button onClick={() => setNotifOpen(o => !o)}
//               style={{
//                 width: 36, height: 36, borderRadius: 9, border: "none",
//                 background: notifOpen ? sbg : "transparent", cursor: "pointer",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 position: "relative", transition: "background 0.15s", flexShrink: 0,
//               }}
//               onMouseEnter={e => (e.currentTarget.style.background = sbg)}
//               onMouseLeave={e => { if (!notifOpen) e.currentTarget.style.background = "transparent"; }}
//             >
//               <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 18, height: 18 }}>
//                 <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//                 <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//               </svg>
//               {unread > 0 && (
//                 <span style={{
//                   position: "absolute", top: -2, right: -2,
//                   minWidth: 16, height: 16, borderRadius: 8, padding: "0 3px",
//                   background: "#ef4444", color: "#fff",
//                   fontSize: 9, fontWeight: 800, lineHeight: "16px",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   border: `2px solid ${bg}`,
//                 }}>
//                   {unread > 99 ? "99+" : unread}
//                 </span>
//               )}
//             </button>

//             {/* ── Notifications panel ─────────────────────────────────────────── */}
//             {notifOpen && (
//               <div style={{
//                 position: "absolute",
//                 right: 0,
//                 top: 42,
//                 width: "min(340px, calc(100vw - 20px))",
//                 borderRadius: 16,
//                 background: panelBg,
//                 border: `1px solid ${panelBd}`,
//                 boxShadow: isDark ? "0 24px 60px rgba(0,0,0,0.65)" : "0 24px 60px rgba(0,0,0,0.14)",
//                 overflow: "hidden",
//                 zIndex: 200,
//               }}>
//                 {/* Panel header */}
//                 <div style={{
//                   display: "flex", alignItems: "center", justifyContent: "space-between",
//                   padding: "13px 16px", borderBottom: `1px solid ${panelBd}`,
//                 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                     <span style={{ fontSize: 13, fontWeight: 700, color: tp }}>Notifications</span>
//                     {unread > 0 && (
//                       <span style={{ background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 20 }}>
//                         {unread} new
//                       </span>
//                     )}
//                   </div>
//                   <div style={{ display: "flex", gap: 10 }}>
//                     {unread > 0 && (
//                       <button onClick={() => setNotifs(p => p.map(n => ({ ...n, read: true })))}
//                         style={{ fontSize: 11, fontWeight: 600, color: "#06b6d4", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit" }}>
//                         Mark all read
//                       </button>
//                     )}
//                     {notifs.length > 0 && (
//                       <button onClick={() => setNotifs([])}
//                         style={{ fontSize: 11, fontWeight: 600, color: ts, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit" }}>
//                         Clear all
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Panel body */}
//                 <div style={{ maxHeight: 360, overflowY: "auto" }}>
//                   {notifs.length === 0 ? (
//                     <div style={{ padding: "36px 20px", textAlign: "center" }}>
//                       <div style={{ fontSize: 30, marginBottom: 10 }}>🔔</div>
//                       <div style={{ fontSize: 13, fontWeight: 600, color: tp }}>No notifications yet</div>
//                       <div style={{ fontSize: 11, color: ts, marginTop: 4 }}>
//                         Activity from members, attendance,<br />programs & celebrations appears here
//                       </div>
//                     </div>
//                   ) : (
//                     notifs.map(n => {
//                       const meta = TYPE_META[n.type];
//                       const notifBg = isDark ? meta.darkBg : meta.lightBg;
//                       return (
//                         <div key={n.id}
//                           onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}
//                           style={{
//                             display: "flex", gap: 11, padding: "11px 14px",
//                             borderBottom: `1px solid ${panelBd}`,
//                             background: !n.read ? unreadHighlight : "transparent",
//                             transition: "background 0.15s", cursor: "pointer",
//                           }}
//                           onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
//                           onMouseLeave={e => (e.currentTarget.style.background = !n.read ? unreadHighlight : "transparent")}
//                         >
//                           {/* Icon badge */}
//                           <div style={{
//                             width: 28, height: 28, borderRadius: 8, background: notifBg, flexShrink: 0,
//                             display: "flex", alignItems: "center", justifyContent: "center",
//                             fontSize: 12, fontWeight: 800, color: meta.color, marginTop: 1,
//                           }}>
//                             {meta.icon}
//                           </div>

//                           <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={{ display: "flex", justifyContent: "space-between", gap: 4, alignItems: "flex-start" }}>
//                               <span style={{ fontSize: 12, fontWeight: 700, color: tp, lineHeight: 1.35 }}>{n.title}</span>
//                               <button
//                                 onClick={e => { e.stopPropagation(); setNotifs(p => p.filter(x => x.id !== n.id)); }}
//                                 style={{ border: "none", background: "none", cursor: "pointer", color: ts, fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0, fontFamily: "inherit" }}>
//                                 ×
//                               </button>
//                             </div>
//                             <p style={{ fontSize: 11, color: ts, margin: "3px 0 5px", lineHeight: 1.5 }}>{n.message}</p>
//                             <span style={{ fontSize: 10, color: isDark ? "#4b5563" : "#c4c9d4" }}>{timeAgo(n.timestamp)}</span>
//                           </div>

//                           {!n.read && (
//                             <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#06b6d4", flexShrink: 0, marginTop: 9 }} />
//                           )}
//                         </div>
//                       );
//                     })
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ── User card ─────────────────────────────────────────────────────── */}
//           <div style={{
//             display: "flex", alignItems: "center", gap: 8,
//             padding: "5px 10px 5px 5px",
//             background: userBg, borderRadius: 11, flexShrink: 0,
//             transition: "background 0.3s",
//           }}>
//             {/* Avatar */}
//             <div style={{
//               width: 32, height: 32, borderRadius: 8,
//               overflow: "hidden", flexShrink: 0,
//               background: isDark ? "#2a2d3a" : "#e5e7eb",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               border: profile.image_url ? "2px solid #06b6d4" : `2px solid ${isDark ? "#2a2d3a" : "#e5e7eb"}`,
//               transition: "border-color 0.3s",
//             }}>
//               {profile.image_url ? (
//                 <img src={profile.image_url} alt={profile.cell_leader} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//               ) : (
//                 <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 15, height: 15 }}>
//                   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
//                 </svg>
//               )}
//             </div>

//             {/* Name block — hidden below 380px */}
//             <div id="topbar-user-name" style={{ display: "flex", flexDirection: "column" }}>
//               <div style={{ fontSize: 12, fontWeight: 700, color: tp, lineHeight: 1.3, whiteSpace: "nowrap", transition: "color 0.3s" }}>
//                 {shortName}
//               </div>
//               <div style={{ fontSize: 10, color: ts, whiteSpace: "nowrap", transition: "color 0.3s" }}>Cell Leader</div>
//             </div>
//           </div>

//         </div>
//       </header>
//     </>
//   );
// }













"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/app/components/ThemeProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// ── Types ─────────────────────────────────────────────────────────────────────
type NotifType = "success" | "warning" | "info" | "error";

interface AppNotification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

type CellProfile = {
  cell_leader: string;
  cell_name: string;
  image_url: string | null;
};

// ── Search result type ────────────────────────────────────────────────────────
type SearchResult = {
  id: string;
  label: string;
  sub: string;
  href: string;
  category: string;
  icon: string;
};

declare global {
  interface WindowEventMap {
    "oasis:notify": CustomEvent<{ type: NotifType; title: string; message: string }>;
  }
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function makeNotif(type: NotifType, title: string, message: string): AppNotification {
  return { id: uid(), type, title, message, timestamp: Date.now(), read: false };
}

const TYPE_META: Record<NotifType, { lightBg: string; darkBg: string; color: string; icon: string }> = {
  success: { lightBg: "#d1fae5", darkBg: "rgba(16,185,129,0.18)", color: "#059669", icon: "✓" },
  warning: { lightBg: "#fef3c7", darkBg: "rgba(245,158,11,0.18)",  color: "#d97706", icon: "!" },
  info:    { lightBg: "#dbeafe", darkBg: "rgba(59,130,246,0.18)",   color: "#2563eb", icon: "i" },
  error:   { lightBg: "#fee2e2", darkBg: "rgba(239,68,68,0.18)",    color: "#dc2626", icon: "✕" },
};

// ── Static nav pages (always searchable) ─────────────────────────────────────
const NAV_PAGES: SearchResult[] = [
  { id: "p-dashboard",  label: "Dashboard",  sub: "Overview & stats",          href: "/dashboard",             category: "Pages", icon: "▦" },
  { id: "p-members",    label: "Members",    sub: "Manage cell members",        href: "/dashboard/members",     category: "Pages", icon: "👥" },
  { id: "p-attendance", label: "Attendance", sub: "Track meeting attendance",   href: "/dashboard/attendance",  category: "Pages", icon: "📋" },
  { id: "p-programs",   label: "Programs",   sub: "Upcoming events & programs", href: "/dashboard/programs",    category: "Pages", icon: "⭐" },
  { id: "p-settings",   label: "Settings",   sub: "Profile & account",          href: "/dashboard/settings",    category: "Pages", icon: "⚙️" },
];

export default function Topbar() {
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  const [notifOpen, setNotifOpen]   = useState(false);
  const [notifs, setNotifs]         = useState<AppNotification[]>([]);
  const [profile, setProfile]       = useState<CellProfile>({ cell_leader: "Cell Leader", cell_name: "OASIS", image_url: null });
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch]         = useState("");
  const [results, setResults]       = useState<SearchResult[]>([]);
  const [searching, setSearching]   = useState(false);
  const [showResults, setShowResults] = useState(false);

  const panelRef      = useRef<HTMLDivElement>(null);
  const searchRef     = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const searchBoxRef  = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length;

  // ── Push notification ─────────────────────────────────────────────────────
  const push = useCallback((type: NotifType, title: string, message: string) => {
    setNotifs(prev => [makeNotif(type, title, message), ...prev].slice(0, 40));
  }, []);

  useEffect(() => {
    const h = (e: CustomEvent<{ type: NotifType; title: string; message: string }>) => {
      push(e.detail.type, e.detail.title, e.detail.message);
    };
    window.addEventListener("oasis:notify", h);
    return () => window.removeEventListener("oasis:notify", h);
  }, [push]);

  // ── Fetch profile ─────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    const { data } = await supabase.from("cell_profile").select("cell_leader, cell_name, image_url").eq("id", 1).single();
    if (data) setProfile(data);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // ── Realtime subscriptions ────────────────────────────────────────────────
  useEffect(() => {
    const ch = supabase.channel("topbar:profile")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "cell_profile" }, payload => {
        const n = payload.new as any;
        setProfile({ cell_leader: n.cell_leader, cell_name: n.cell_name, image_url: n.image_url });
        push("success", "Profile Updated", "Cell profile has been updated.");
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [push]);

  useEffect(() => {
    const ch = supabase.channel("topbar:members")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "members" }, payload => {
        push("info", "New Member Added", `${(payload.new as any)?.name ?? "A member"} has been added.`);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "members" }, () => {
        push("warning", "Member Removed", "A member has been removed from the cell.");
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "members" }, () => {
        push("info", "Member Updated", "A member's details have been updated.");
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [push]);

  useEffect(() => {
    const ch = supabase.channel("topbar:meetings")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "meetings" }, payload => {
        const n = payload.new as any;
        push("info", "New Meeting Created", `"${n?.title ?? "Meeting"}" on ${n?.date ?? ""}.`);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "meetings" }, payload => {
        const n = payload.new as any;
        if (n?.saved === true) push("success", "Attendance Saved", `Attendance for "${n?.title ?? "meeting"}" recorded.`);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "meetings" }, () => {
        push("warning", "Meeting Deleted", "A meeting has been removed.");
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [push]);

  useEffect(() => {
    const ch = supabase.channel("topbar:programs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "programs" }, payload => {
        const n = payload.new as any;
        push("info", "Program Added", `"${n?.title ?? "Program"}" scheduled.`);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "programs" }, () => {
        push("warning", "Program Deleted", "A program has been removed.");
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [push]);

  useEffect(() => {
    const ch = supabase.channel("topbar:celebrations")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "celebrations" }, payload => {
        const n = payload.new as any;
        push("success", "Celebration Added", `${n?.name ?? "Someone"}'s ${n?.event ?? "celebration"} added.`);
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [push]);

  // ── Global search ─────────────────────────────────────────────────────────
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setShowResults(false); return; }
    setSearching(true);
    setShowResults(true);
    const lower = q.toLowerCase();

    // 1. Match static pages
    const pageMatches = NAV_PAGES.filter(p =>
      p.label.toLowerCase().includes(lower) || p.sub.toLowerCase().includes(lower)
    );

    // 2. Search members
    const { data: members } = await supabase
      .from("members")
      .select("id, name, phone, gender")
      .ilike("name", `%${q}%`)
      .limit(5);

    const memberResults: SearchResult[] = (members ?? []).map(m => ({
      id: `m-${m.id}`,
      label: m.name,
      sub: `${m.gender ?? "Member"} · ${m.phone ?? ""}`,
      href: "/dashboard/members",
      category: "Members",
      icon: "👤",
    }));

    // 3. Search programs
    const { data: programs } = await supabase
      .from("programs")
      .select("id, title, date, venue")
      .ilike("title", `%${q}%`)
      .limit(4);

    const programResults: SearchResult[] = (programs ?? []).map(p => ({
      id: `pr-${p.id}`,
      label: p.title,
      sub: `${p.date ?? ""} · ${p.venue ?? ""}`,
      href: "/dashboard/programs",
      category: "Programs",
      icon: "⭐",
    }));

    // 4. Search meetings
    const { data: meetings } = await supabase
      .from("meetings")
      .select("id, title, date")
      .ilike("title", `%${q}%`)
      .limit(3);

    const meetingResults: SearchResult[] = (meetings ?? []).map(m => ({
      id: `mt-${m.id}`,
      label: m.title,
      sub: `Meeting · ${m.date ?? ""}`,
      href: "/dashboard/attendance",
      category: "Attendance",
      icon: "📋",
    }));

    // 5. Search celebrations
    const { data: celebrations } = await supabase
      .from("celebrations")
      .select("id, name, event")
      .ilike("name", `%${q}%`)
      .limit(3);

    const celebResults: SearchResult[] = (celebrations ?? []).map(c => ({
      id: `c-${c.id}`,
      label: c.name,
      sub: c.event ?? "Celebration",
      href: "/dashboard/members",
      category: "Celebrations",
      icon: "🎉",
    }));

    setResults([...pageMatches, ...memberResults, ...meetingResults, ...programResults, ...celebResults]);
    setSearching(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => runSearch(search), 250);
    return () => clearTimeout(t);
  }, [search, runSearch]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => mobileSearchRef.current?.focus(), 50);
  }, [searchOpen]);

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const bg       = isDark ? "#111318" : "#ffffff";
  const bd       = isDark ? "#1e2028" : "#f0f0f0";
  const sbg      = isDark ? "#1a1d27" : "#f5f6f8";
  const ic       = isDark ? "#6b7280" : "#9ca3af";
  const tp       = isDark ? "#f3f4f6" : "#0f1117";
  const ts       = isDark ? "#6b7280" : "#9ca3af";
  const panelBg  = isDark ? "#15171e" : "#ffffff";
  const panelBd  = isDark ? "#1e2028" : "#e5e7eb";
  const userBg   = isDark ? "#1a1d27" : "#f5f6f8";
  const hoverBg  = isDark ? "#1e2130" : "#f3f4f6";
  const dropBg   = isDark ? "#16181f" : "#ffffff";
  const dropBd   = isDark ? "#1e2028" : "#e5e7eb";
  const unreadHL = isDark ? "rgba(6,182,212,0.07)" : "rgba(6,182,212,0.05)";

  const shortName = profile.cell_leader.split(" ").slice(0, 2).join(" ");

  // Group results by category
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const SearchDropdown = ({ mobile = false }: { mobile?: boolean }) => (
    showResults && (search.trim()) ? (
      <div style={{
        position: mobile ? "fixed" : "absolute",
        top: mobile ? 60 : "calc(100% + 6px)",
        left: mobile ? 0 : 0,
        right: mobile ? 0 : "auto",
        width: mobile ? "100%" : "100%",
        maxHeight: 380,
        overflowY: "auto",
        background: dropBg,
        border: mobile ? "none" : `1px solid ${dropBd}`,
        borderTop: mobile ? `1px solid ${dropBd}` : undefined,
        borderRadius: mobile ? 0 : 14,
        boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.6)" : "0 20px 50px rgba(0,0,0,0.12)",
        zIndex: 500,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        {searching ? (
          <div style={{ padding: "24px", textAlign: "center", color: ts, fontSize: 13 }}>Searching…</div>
        ) : results.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 13, color: tp, fontWeight: 600 }}>No results for "{search}"</div>
            <div style={{ fontSize: 11, color: ts, marginTop: 4 }}>Try a member name, page, or program</div>
          </div>
        ) : (
          Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ padding: "10px 14px 4px", fontSize: 10, fontWeight: 700, color: ts, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {cat}
              </div>
              {items.map(r => (
                <div key={r.id}
                  onClick={() => { router.push(r.href); setSearch(""); setShowResults(false); setSearchOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", cursor: "pointer",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: sbg, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 15,
                  }}>
                    {r.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: tp, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: ts, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.sub}</div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 14, height: 14, flexShrink: 0 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    ) : null
  );

  return (
    <>
      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin    { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        #topbar-search-desktop { display: none; }
        #topbar-search-mobile-btn { display: flex; }
        #topbar-user-name { display: none; }
        @media (min-width: 540px) {
          #topbar-search-desktop { display: block !important; }
          #topbar-search-mobile-btn { display: none !important; }
        }
        @media (min-width: 640px) {
          #topbar-user-name { display: flex !important; }
        }
      `}</style>

      {/* ── Mobile search overlay ─────────────────────────────────────────────── */}
      {searchOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 490,
          background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)",
          backdropFilter: "blur(2px)",
          animation: "fadeIn 0.15s ease",
        }} onClick={() => { setSearchOpen(false); setShowResults(false); setSearch(""); }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            background: bg, borderBottom: `1px solid ${bd}`,
            padding: "10px 14px", display: "flex", gap: 10, alignItems: "center",
            zIndex: 491,
          }} onClick={e => e.stopPropagation()}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 16, height: 16, flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={mobileSearchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search anything — members, programs, pages…"
              style={{
                flex: 1, height: 40, border: "none", background: "transparent",
                color: isDark ? "#e5e7eb" : "#111", fontSize: 14,
                fontFamily: "inherit", outline: "none",
              }}
            />
            <button onClick={() => { setSearchOpen(false); setShowResults(false); setSearch(""); }}
              style={{ border: "none", background: sbg, borderRadius: 8, width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke={ic} style={{ width: 13, height: 13 }}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <SearchDropdown mobile />
        </div>
      )}

      {/* ── Main header ──────────────────────────────────────────────────────── */}
      <header style={{
        height: 60, background: bg, borderBottom: `1px solid ${bd}`,
        display: "flex", alignItems: "center", padding: "0 14px", gap: 8,
        position: "sticky", top: 0, zIndex: 40,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        transition: "background 0.3s, border-color 0.3s",
      }}>

        {/* ── Desktop search box ────────────────────────────────────────────────── */}
        <div id="topbar-search-desktop" style={{ flex: 1, maxWidth: 400, position: "relative" }} ref={searchBoxRef}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic}
            style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={searchRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => { if (search.trim()) setShowResults(true); }}
            placeholder="Search members, programs, pages…"
            style={{
              width: "100%", height: 38, paddingLeft: 34, paddingRight: 14,
              borderRadius: 19, border: "1.5px solid transparent",
              background: sbg, color: isDark ? "#e5e7eb" : "#374151",
              fontSize: 13, fontFamily: "inherit", outline: "none",
              boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocusCapture={e => { e.target.style.borderColor = "#06b6d4"; e.target.style.boxShadow = "0 0 0 3px rgba(6,182,212,0.15)"; }}
            onBlur={e => { e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "none"; }}
          />
          <SearchDropdown />
        </div>

        {/* ── Mobile search button ──────────────────────────────────────────────── */}
        <button id="topbar-search-mobile-btn"
          onClick={() => setSearchOpen(true)}
          style={{ width: 36, height: 36, borderRadius: 9, border: "none", background: "transparent", cursor: "pointer", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.background = sbg)}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 18, height: 18 }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        {/* ── Right controls ────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>

          {/* Theme toggle */}
          <button onClick={toggleTheme} title="Toggle theme"
            style={{ width: 36, height: 36, borderRadius: 9, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = sbg)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#facc15" style={{ width: 18, height: 18 }}>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 18, height: 18 }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* ── Bell ──────────────────────────────────────────────────────────────── */}
          <div style={{ position: "relative" }} ref={panelRef}>
            <button onClick={() => setNotifOpen(o => !o)}
              style={{
                width: 36, height: 36, borderRadius: 9, border: "none",
                background: notifOpen ? sbg : "transparent", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", transition: "background 0.15s", flexShrink: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = sbg)}
              onMouseLeave={e => { if (!notifOpen) e.currentTarget.style.background = "transparent"; }}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 18, height: 18 }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unread > 0 && (
                <span style={{
                  position: "absolute", top: -2, right: -2,
                  minWidth: 16, height: 16, borderRadius: 8, padding: "0 3px",
                  background: "#ef4444", color: "#fff",
                  fontSize: 9, fontWeight: 800, lineHeight: "16px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `2px solid ${bg}`,
                }}>
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </button>

            {/* Notifications panel */}
            {notifOpen && (
              <div style={{
                position: "fixed",
                right: 14,
                top: 68,
                width: "min(340px, calc(100vw - 28px))",
                borderRadius: 16,
                background: panelBg,
                border: `1px solid ${panelBd}`,
                boxShadow: isDark ? "0 24px 60px rgba(0,0,0,0.65)" : "0 24px 60px rgba(0,0,0,0.14)",
                overflow: "hidden",
                zIndex: 200,
                animation: "slideUp 0.18s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: `1px solid ${panelBd}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: tp }}>Notifications</span>
                    {unread > 0 && (
                      <span style={{ background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 20 }}>
                        {unread} new
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {unread > 0 && (
                      <button onClick={() => setNotifs(p => p.map(n => ({ ...n, read: true })))}
                        style={{ fontSize: 11, fontWeight: 600, color: "#06b6d4", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit" }}>
                        Mark all read
                      </button>
                    )}
                    {notifs.length > 0 && (
                      <button onClick={() => setNotifs([])}
                        style={{ fontSize: 11, fontWeight: 600, color: ts, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit" }}>
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ maxHeight: 360, overflowY: "auto" }}>
                  {notifs.length === 0 ? (
                    <div style={{ padding: "36px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 30, marginBottom: 10 }}>🔔</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: tp }}>No notifications yet</div>
                      <div style={{ fontSize: 11, color: ts, marginTop: 4 }}>Activity from members, attendance,<br />programs & celebrations appears here</div>
                    </div>
                  ) : (
                    notifs.map(n => {
                      const meta = TYPE_META[n.type];
                      return (
                        <div key={n.id}
                          onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}
                          style={{
                            display: "flex", gap: 11, padding: "11px 14px",
                            borderBottom: `1px solid ${panelBd}`,
                            background: !n.read ? unreadHL : "transparent",
                            transition: "background 0.15s", cursor: "pointer",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
                          onMouseLeave={e => (e.currentTarget.style.background = !n.read ? unreadHL : "transparent")}
                        >
                          <div style={{
                            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                            background: isDark ? meta.darkBg : meta.lightBg,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 800, color: meta.color, marginTop: 1,
                          }}>
                            {meta.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 4, alignItems: "flex-start" }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: tp, lineHeight: 1.35 }}>{n.title}</span>
                              <button onClick={e => { e.stopPropagation(); setNotifs(p => p.filter(x => x.id !== n.id)); }}
                                style={{ border: "none", background: "none", cursor: "pointer", color: ts, fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }}>
                                ×
                              </button>
                            </div>
                            <p style={{ fontSize: 11, color: ts, margin: "3px 0 5px", lineHeight: 1.5 }}>{n.message}</p>
                            <span style={{ fontSize: 10, color: isDark ? "#4b5563" : "#c4c9d4" }}>{timeAgo(n.timestamp)}</span>
                          </div>
                          {!n.read && (
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#06b6d4", flexShrink: 0, marginTop: 9 }} />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── User avatar → Settings ─────────────────────────────────────────── */}
          <Link href="/dashboard/settings" style={{ textDecoration: "none" }}>
            <div
              title="Go to Settings"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "5px 10px 5px 5px",
                background: userBg, borderRadius: 11, flexShrink: 0,
                transition: "background 0.15s, box-shadow 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = isDark ? "#22263a" : "#eceef2";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 2px #06b6d4";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = userBg;
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 32, height: 32, borderRadius: 8, overflow: "hidden", flexShrink: 0,
                background: isDark ? "#2a2d3a" : "#e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: profile.image_url ? "2px solid #06b6d4" : `2px solid ${isDark ? "#2a2d3a" : "#e5e7eb"}`,
              }}>
                {profile.image_url ? (
                  <img src={profile.image_url} alt={profile.cell_leader} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke={ic} style={{ width: 15, height: 15 }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              {/* Name — hidden on small screens */}
              <div id="topbar-user-name" style={{ flexDirection: "column" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: tp, lineHeight: 1.3, whiteSpace: "nowrap" }}>
                  {shortName}
                </div>
                <div style={{ fontSize: 10, color: ts, whiteSpace: "nowrap" }}>Cell Leader</div>
              </div>
            </div>
          </Link>

        </div>
      </header>
    </>
  );
}