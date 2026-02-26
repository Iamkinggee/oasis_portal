




// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useTheme } from "@/app/components/ThemeProvider";
// import { createClient } from "@/lib/supabase/client";

// type PageId = "dashboard" | "members" | "attendance" | "programs" | "settings";

// interface NavItem {
//   id: PageId;
//   label: string;
//   href: string;
//   icon: React.ReactNode;
//   mobileIcon: React.ReactNode;
// }

// const NAV_ITEMS: NavItem[] = [
//   {
//     id: "dashboard",
//     label: "DASHBOARD",
//     href: "/dashboard",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
//         <rect x="3" y="3" width="7" height="7" rx="1" />
//         <rect x="14" y="3" width="7" height="7" rx="1" />
//         <rect x="3" y="14" width="7" height="7" rx="1" />
//         <rect x="14" y="14" width="7" height="7" rx="1" />
//       </svg>
//     ),
//     mobileIcon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
//         <rect x="3" y="3" width="7" height="7" rx="1" />
//         <rect x="14" y="3" width="7" height="7" rx="1" />
//         <rect x="3" y="14" width="7" height="7" rx="1" />
//         <rect x="14" y="14" width="7" height="7" rx="1" />
//       </svg>
//     ),
//   },
//   {
//     id: "members",
//     label: "MEMBERS",
//     href: "/dashboard/members",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
//         <circle cx="9" cy="7" r="4" />
//         <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
//         <path d="M19 8v6M22 11h-6" />
//       </svg>
//     ),
//     mobileIcon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
//         <circle cx="9" cy="7" r="4" />
//         <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
//         <path d="M19 8v6M22 11h-6" />
//       </svg>
//     ),
//   },
//   {
//     id: "attendance",
//     label: "ATTENDANCE",
//     href: "/dashboard/attendance",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
//         <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
//         <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
//         <path d="M9 12l2 2 4-4" />
//       </svg>
//     ),
//     mobileIcon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
//         <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
//         <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
//         <path d="M9 12l2 2 4-4" />
//       </svg>
//     ),
//   },
//   {
//     id: "programs",
//     label: "PROGRAMS",
//     href: "/dashboard/programs",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
//         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//       </svg>
//     ),
//     mobileIcon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
//         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//       </svg>
//     ),
//   },
// ];

// export default function Sidebar({ activePage }: { activePage: PageId }) {
//   const { isDark }  = useTheme();
//   const router      = useRouter();
//   const supabase    = createClient();

//   const [hovered,     setHovered]     = useState<string | null>(null);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [loggingOut,  setLoggingOut]  = useState(false);
//   const [logoutError, setLogoutError] = useState<string | null>(null);

//   const handleLogout = async () => {
//     setLoggingOut(true);
//     setLogoutError(null);
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       setLogoutError("Failed to sign out. Please try again.");
//       setLoggingOut(false);
//       return;
//     }
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     router.push("/Heropage");
//     router.refresh();
//   };

//   // ── Theme tokens ──────────────────────────────────────────────────────────
//   const bg          = isDark ? "#111318" : "#ffffff";
//   const border      = isDark ? "#1e2028" : "#f0f0f0";
//   const labelColor  = isDark ? "#4b5262" : "#b0b7c3";
//   const logoColor   = isDark ? "#ffffff" : "#0f1117";
//   const modalBg     = isDark ? "#16181f" : "#ffffff";
//   const modalBorder = isDark ? "#1e2028" : "#e5e7eb";
//   const textPrimary = isDark ? "#f3f4f6" : "#0f1117";
//   const textMuted   = isDark ? "#6b7280" : "#9ca3af";
//   const cancelHover = isDark ? "#1a1d27" : "#f5f6f8";
//   const mobileBg    = isDark ? "#111318" : "#ffffff";

//   // ── Settings nav item helper ──────────────────────────────────────────────
//   const settingsActive = activePage === "settings";

//   return (
//     <>
//       <style>{`
//         /* Desktop sidebar */
//         .oasis-sidebar {
//           display: flex;
//         }
//         /* Mobile bottom nav */
//         .oasis-bottom-nav {
//           display: none;
//         }
//         @media (max-width: 767px) {
//           .oasis-sidebar {
//             display: none !important;
//           }
//           .oasis-bottom-nav {
//             display: flex !important;
//           }
//         }
//         @keyframes fadeIn  { from { opacity: 0 }                         to { opacity: 1 } }
//         @keyframes slideUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
//         @keyframes spin    { from { transform: rotate(0deg) }            to { transform: rotate(360deg) } }
//       `}</style>

//       {/* ════════════════════════════════════════════════════════════════════
//           DESKTOP SIDEBAR
//       ════════════════════════════════════════════════════════════════════ */}
//       <aside className="oasis-sidebar" style={{
//         width: 220, minHeight: "100vh", flexShrink: 0,
//         background: bg, borderRight: `1px solid ${border}`,
//         flexDirection: "column",
//         fontFamily: "'DM Sans', system-ui, sans-serif",
//         transition: "background 0.3s, border-color 0.3s",
//         position: "sticky", top: 0, height: "100vh",
//       }}>
//         {/* Logo */}
//         <div style={{ padding: "28px 24px 20px" }}>
//           <Link href="/dashboard" style={{ textDecoration: "none" }}>
//             <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: logoColor }}>



//                   <div className='justify-center px-7'>
//             <span className="w-5 h-5 bg-[#111]  rounded-md grid grid-cols-2 grid-rows-2 gap-0.75 p-1.25 mt-1">
//             <span className="bg-[#f0f0ed] rounded-[1px]" />
//             <span className="bg-[#f0f0ed] rounded-[1px]" />
//             <span className="bg-[#f0f0ed] rounded-[1px]" />
//             <span className="bg-[#f0f0ed] rounded-[1px]" />
//           </span>

               
//           </div>






//               <span style={{ fontWeight: 300 }}>oasis</span>
//               <span style={{ fontWeight: 900 }}>Portal</span>
//             </span>
//           </Link>
//         </div>

//         {/* Menu label */}
//         <div style={{ padding: "0 24px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: labelColor, textTransform: "uppercase" }} className="mt-5">
//           Menu
//         </div>

//         {/* Nav */}
//         <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
//           {NAV_ITEMS.map((item) => {
//             const isActive  = activePage === item.id;
//             const isHovered = hovered === item.id;
//             return (
//               <Link key={item.id} href={item.href}
//                 onMouseEnter={() => setHovered(item.id)}
//                 onMouseLeave={() => setHovered(null)}
//                 style={{
//                   display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
//                   borderRadius: 12, fontFamily: "inherit", fontSize: 12, fontWeight: 700,
//                   letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.15s",
//                   background: isActive ? (isDark ? "#ffffff" : "#0f1117") : isHovered ? (isDark ? "#1a1d27" : "#f5f6f8") : "transparent",
//                   color: isActive ? (isDark ? "#0f1117" : "#ffffff") : isDark ? "#6b7280" : "#6b7280",
//                 }}>
//                 <span style={{ display: "flex", alignItems: "center", color: isActive ? (isDark ? "#0f1117" : "#ffffff") : isDark ? "#6b7280" : "#9ca3af" }}>
//                   {item.icon}
//                 </span>
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Bottom */}
//         <div style={{ borderTop: `1px solid ${border}`, padding: "12px", display: "flex", flexDirection: "column", gap: 2 }}>
//           {/* Settings */}
//           <Link href="/dashboard/settings"
//             onMouseEnter={() => setHovered("settings")}
//             onMouseLeave={() => setHovered(null)}
//             style={{
//               display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
//               borderRadius: 12, fontFamily: "inherit", fontSize: 12, fontWeight: 700,
//               letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.15s",
//               background: settingsActive ? (isDark ? "#ffffff" : "#0f1117") : hovered === "settings" ? (isDark ? "#1a1d27" : "#f5f6f8") : "transparent",
//               color: settingsActive ? (isDark ? "#0f1117" : "#ffffff") : isDark ? "#6b7280" : "#6b7280",
//             }}>
//             <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}
//               stroke={settingsActive ? (isDark ? "#0f1117" : "#fff") : "#9ca3af"}
//               style={{ width: 15, height: 15 }}>
//               <circle cx="12" cy="12" r="3" />
//               <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
//             </svg>
//             SETTINGS
//           </Link>

//           {/* Logout */}
//           <button onClick={() => setShowConfirm(true)}
//             onMouseEnter={() => setHovered("logout")}
//             onMouseLeave={() => setHovered(null)}
//             style={{
//               display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
//               borderRadius: 12, border: "none", cursor: "pointer", width: "100%",
//               fontFamily: "inherit", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
//               transition: "all 0.15s",
//               background: hovered === "logout" ? "rgba(239,68,68,0.08)" : "transparent",
//               color: "#ef4444",
//             }}>
//             <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#ef4444" style={{ width: 15, height: 15 }}>
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//               <polyline points="16 17 21 12 16 7" />
//               <line x1="21" y1="12" x2="9" y2="12" />
//             </svg>
//             Log out
//           </button>
//         </div>
//       </aside>

//       {/* ════════════════════════════════════════════════════════════════════
//           MOBILE BOTTOM NAV
//       ════════════════════════════════════════════════════════════════════ */}
//       <nav className="oasis-bottom-nav" style={{
//         position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
//         background: mobileBg,
//         borderTop: `1px solid ${border}`,
//         padding: "0 4px",
//         paddingBottom: "env(safe-area-inset-bottom, 0px)",
//         fontFamily: "'DM Sans', system-ui, sans-serif",
//         boxShadow: isDark ? "0 -4px 24px rgba(0,0,0,0.4)" : "0 -4px 24px rgba(0,0,0,0.06)",
//         justifyContent: "space-around",
//         alignItems: "stretch",
//       }}>
//         {/* Main nav items */}
//         {NAV_ITEMS.map((item) => {
//           const isActive = activePage === item.id;
//           return (
//             <Link key={item.id} href={item.href} style={{
//               flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
//               justifyContent: "center", gap: 3, padding: "10px 4px 8px",
//               textDecoration: "none", transition: "all 0.15s",
//               color: isActive ? (isDark ? "#ffffff" : "#0f1117") : isDark ? "#4b5563" : "#9ca3af",
//               position: "relative",
//             }}>
//               {/* Active indicator dot */}
//               {isActive && (
//                 <div style={{
//                   position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
//                   width: 20, height: 2, borderRadius: 2,
//                   background: isDark ? "#ffffff" : "#0f1117",
//                 }} />
//               )}
//               <span style={{
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 width: 36, height: 28, borderRadius: 9,
//                 background: isActive ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(15,17,23,0.08)") : "transparent",
//                 transition: "background 0.15s",
//               }}>
//                 {item.mobileIcon}
//               </span>
//               <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}>
//                 {item.label === "ATTENDANCE" ? "ATTEND." : item.label}
//               </span>
//             </Link>
//           );
//         })}

//         {/* Settings */}
//         <Link href="/dashboard/settings" style={{
//           flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
//           justifyContent: "center", gap: 3, padding: "10px 4px 8px",
//           textDecoration: "none", transition: "all 0.15s",
//           color: settingsActive ? (isDark ? "#ffffff" : "#0f1117") : isDark ? "#4b5563" : "#9ca3af",
//           position: "relative",
//         }}>
//           {settingsActive && (
//             <div style={{
//               position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
//               width: 20, height: 2, borderRadius: 2,
//               background: isDark ? "#ffffff" : "#0f1117",
//             }} />
//           )}
//           <span style={{
//             display: "flex", alignItems: "center", justifyContent: "center",
//             width: 36, height: 28, borderRadius: 9,
//             background: settingsActive ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(15,17,23,0.08)") : "transparent",
//             transition: "background 0.15s",
//           }}>
//             <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
//               <circle cx="12" cy="12" r="3" />
//               <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
//             </svg>
//           </span>
//           <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}>SETTINGS</span>
//         </Link>

//         {/* Logout */}
//         <button onClick={() => setShowConfirm(true)} style={{
//           flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
//           justifyContent: "center", gap: 3, padding: "10px 4px 8px",
//           border: "none", background: "transparent", cursor: "pointer",
//           fontFamily: "inherit", transition: "all 0.15s",
//           color: "#ef4444",
//         }}>
//           <span style={{
//             display: "flex", alignItems: "center", justifyContent: "center",
//             width: 36, height: 28, borderRadius: 9,
//           }}>
//             <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#ef4444" style={{ width: 20, height: 20 }}>
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//               <polyline points="16 17 21 12 16 7" />
//               <line x1="21" y1="12" x2="9" y2="12" />
//             </svg>
//           </span>
//           <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}>LOG OUT</span>
//         </button>
//       </nav>

//       {/* ════════════════════════════════════════════════════════════════════
//           LOGOUT CONFIRM MODAL (shared desktop + mobile)
//       ════════════════════════════════════════════════════════════════════ */}
//       {showConfirm && (
//         <div onClick={() => { if (!loggingOut) { setShowConfirm(false); setLogoutError(null); } }}
//           style={{
//             position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
//             backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
//             zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center",
//             padding: 16, animation: "fadeIn 0.15s ease",
//           }}>
//           <div onClick={e => e.stopPropagation()}
//             style={{
//               background: modalBg, border: `1px solid ${modalBorder}`,
//               borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 360,
//               boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
//               fontFamily: "'DM Sans', system-ui, sans-serif",
//               animation: "slideUp 0.2s ease",
//             }}>
//             <div style={{
//               width: 52, height: 52, borderRadius: 14, background: "rgba(239,68,68,0.1)",
//               border: "1px solid rgba(239,68,68,0.2)",
//               display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
//             }}>
//               <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#ef4444" style={{ width: 24, height: 24 }}>
//                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                 <polyline points="16 17 21 12 16 7" />
//                 <line x1="21" y1="12" x2="9" y2="12" />
//               </svg>
//             </div>
//             <h2 style={{ fontSize: 18, fontWeight: 800, color: textPrimary, margin: "0 0 8px" }}>Sign out?</h2>
//             <p style={{ fontSize: 13, color: textMuted, margin: "0 0 24px", lineHeight: 1.6 }}>
//               You'll need to log back in to access the dashboard. Any unsaved changes will be lost.
//             </p>

//             {logoutError && (
//               <div style={{
//                 marginBottom: 16, padding: "10px 14px", borderRadius: 10,
//                 background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
//                 fontSize: 12, color: "#ef4444",
//               }}>
//                 {logoutError}
//               </div>
//             )}

//             <div style={{ display: "flex", gap: 10 }}>
//               <button onClick={() => { setShowConfirm(false); setLogoutError(null); }} disabled={loggingOut}
//                 style={{
//                   flex: 1, padding: "12px 0", borderRadius: 12, border: `1px solid ${modalBorder}`,
//                   background: "transparent", color: textMuted, fontSize: 13, fontWeight: 700,
//                   cursor: loggingOut ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.15s",
//                 }}
//                 onMouseEnter={e => { if (!loggingOut) e.currentTarget.style.background = cancelHover; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
//                 Cancel
//               </button>
//               <button onClick={handleLogout} disabled={loggingOut}
//                 style={{
//                   flex: 1, padding: "12px 0", borderRadius: 12, border: "none",
//                   background: "#ef4444", color: "#ffffff", fontSize: 13, fontWeight: 700,
//                   cursor: loggingOut ? "not-allowed" : "pointer", fontFamily: "inherit",
//                   opacity: loggingOut ? 0.8 : 1,
//                   display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//                 }}
//                 onMouseEnter={e => { if (!loggingOut) e.currentTarget.style.background = "#dc2626"; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = "#ef4444"; }}>
//                 {loggingOut ? (
//                   <>
//                     <svg style={{ width: 14, height: 14, animation: "spin 0.8s linear infinite" }} fill="none" viewBox="0 0 24 24">
//                       <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
//                       <path style={{ opacity: 0.75 }} fill="white" d="M4 12a8 8 0 018-8v8z" />
//                     </svg>
//                     Signing out...
//                   </>
//                 ) : "Sign out"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



























// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useTheme } from "@/app/components/ThemeProvider";
// import { createClient } from "@/lib/supabase/client";

// type PageId = "dashboard" | "members" | "attendance" | "programs" | "settings";

// interface NavItem {
//   id: PageId;
//   label: string;
//   href: string;
//   icon: React.ReactNode;
//   mobileIcon: React.ReactNode;
// }

// const NAV_ITEMS: NavItem[] = [
//   {
//     id: "dashboard",
//     label: "DASHBOARD",
//     href: "/dashboard",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
//         <rect x="3" y="3" width="7" height="7" rx="1" />
//         <rect x="14" y="3" width="7" height="7" rx="1" />
//         <rect x="3" y="14" width="7" height="7" rx="1" />
//         <rect x="14" y="14" width="7" height="7" rx="1" />
//       </svg>
//     ),
//     mobileIcon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
//         <rect x="3" y="3" width="7" height="7" rx="1" />
//         <rect x="14" y="3" width="7" height="7" rx="1" />
//         <rect x="3" y="14" width="7" height="7" rx="1" />
//         <rect x="14" y="14" width="7" height="7" rx="1" />
//       </svg>
//     ),
//   },
//   {
//     id: "members",
//     label: "MEMBERS",
//     href: "/dashboard/members",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
//         <circle cx="9" cy="7" r="4" />
//         <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
//         <path d="M19 8v6M22 11h-6" />
//       </svg>
//     ),
//     mobileIcon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
//         <circle cx="9" cy="7" r="4" />
//         <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
//         <path d="M19 8v6M22 11h-6" />
//       </svg>
//     ),
//   },
//   {
//     id: "attendance",
//     label: "ATTENDANCE",
//     href: "/dashboard/attendance",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
//         <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
//         <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
//         <path d="M9 12l2 2 4-4" />
//       </svg>
//     ),
//     mobileIcon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
//         <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
//         <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
//         <path d="M9 12l2 2 4-4" />
//       </svg>
//     ),
//   },
//   {
//     id: "programs",
//     label: "PROGRAMS",
//     href: "/dashboard/programs",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
//         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//       </svg>
//     ),
//     mobileIcon: (
//       <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
//         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//       </svg>
//     ),
//   },
// ];

// export default function Sidebar({ activePage }: { activePage: PageId }) {
//   const { isDark }  = useTheme();
//   const router      = useRouter();
//   const supabase    = createClient();

//   const [hovered,     setHovered]     = useState<string | null>(null);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [loggingOut,  setLoggingOut]  = useState(false);
//   const [logoutError, setLogoutError] = useState<string | null>(null);

//   const handleLogout = async () => {
//     setLoggingOut(true);
//     setLogoutError(null);
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       setLogoutError("Failed to sign out. Please try again.");
//       setLoggingOut(false);
//       return;
//     }
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     router.push("/Heropage");
//     router.refresh();
//   };

//   // ── Theme tokens ──────────────────────────────────────────────────────────
//   const bg          = isDark ? "#111318" : "#ffffff";
//   const border      = isDark ? "#1e2028" : "#f0f0f0";
//   const labelColor  = isDark ? "#4b5262" : "#b0b7c3";
//   const logoColor   = isDark ? "#ffffff" : "#0f1117";
//   const modalBg     = isDark ? "#16181f" : "#ffffff";
//   const modalBorder = isDark ? "#1e2028" : "#e5e7eb";
//   const textPrimary = isDark ? "#f3f4f6" : "#0f1117";
//   const textMuted   = isDark ? "#6b7280" : "#9ca3af";
//   const cancelHover = isDark ? "#1a1d27" : "#f5f6f8";
//   const mobileBg    = isDark ? "#111318" : "#ffffff";

//   const settingsActive = activePage === "settings";

//   return (
//     <>
//       <style>{`
//         /* Desktop sidebar */
//         .oasis-sidebar {
//           display: flex;
//         }
//         /* Mobile bottom nav */
//         .oasis-bottom-nav {
//           display: none;
//         }
//         @media (max-width: 767px) {
//           .oasis-sidebar {
//             display: none !important;
//           }
//           .oasis-bottom-nav {
//             display: flex !important;
//           }
//         }
//         @keyframes fadeIn  { from { opacity: 0 }                         to { opacity: 1 } }
//         @keyframes slideUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
//         @keyframes spin    { from { transform: rotate(0deg) }            to { transform: rotate(360deg) } }
//       `}</style>

//       {/* ════════════════════════════════════════════════════════════════════
//           DESKTOP SIDEBAR
//       ════════════════════════════════════════════════════════════════════ */}
//       <aside className="oasis-sidebar" style={{
//         width: 220, minHeight: "100vh", flexShrink: 0,
//         background: bg, borderRight: `1px solid ${border}`,
//         flexDirection: "column",
//         fontFamily: "'DM Sans', system-ui, sans-serif",
//         transition: "background 0.3s, border-color 0.3s",
//         position: "sticky", top: 0, height: "100vh",
//       }}>
//         {/* Logo */}
//         <div style={{ padding: "28px 24px 20px" }}>
//           <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
//             <span style={{
//               width: 26, height: 26, background: "#111", borderRadius: 6,
//               display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr",
//               gap: 3, padding: 5, flexShrink: 0,
//             }}>
//               {[0,1,2,3].map(i => (
//                 <span key={i} style={{ background: "#f0f0ed", borderRadius: 1 }} />
//               ))}
//             </span>
//             <span style={{ fontSize: 20, letterSpacing: "-0.5px", color: logoColor, lineHeight: 1 }}>
//               <span style={{ fontWeight: 300 }}>oasis</span>
//               <span style={{ fontWeight: 900 }}>Portal</span>
//             </span>
//           </Link>
//         </div>

//         {/* Menu label */}
//         <div style={{ padding: "0 24px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: labelColor, textTransform: "uppercase" }} className="mt-5">
//           Menu
//         </div>

//         {/* Nav */}
//         <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
//           {NAV_ITEMS.map((item) => {
//             const isActive  = activePage === item.id;
//             const isHovered = hovered === item.id;
//             return (
//               <Link key={item.id} href={item.href}
//                 onMouseEnter={() => setHovered(item.id)}
//                 onMouseLeave={() => setHovered(null)}
//                 style={{
//                   display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
//                   borderRadius: 12, fontFamily: "inherit", fontSize: 12, fontWeight: 700,
//                   letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.15s",
//                   background: isActive ? (isDark ? "#ffffff" : "#0f1117") : isHovered ? (isDark ? "#1a1d27" : "#f5f6f8") : "transparent",
//                   color: isActive ? (isDark ? "#0f1117" : "#ffffff") : isDark ? "#6b7280" : "#6b7280",
//                 }}>
//                 <span style={{ display: "flex", alignItems: "center", color: isActive ? (isDark ? "#0f1117" : "#ffffff") : isDark ? "#6b7280" : "#9ca3af" }}>
//                   {item.icon}
//                 </span>
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Bottom */}
//         <div style={{ borderTop: `1px solid ${border}`, padding: "12px", display: "flex", flexDirection: "column", gap: 2 }}>
//           {/* Settings */}
//           <Link href="/dashboard/settings"
//             onMouseEnter={() => setHovered("settings")}
//             onMouseLeave={() => setHovered(null)}
//             style={{
//               display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
//               borderRadius: 12, fontFamily: "inherit", fontSize: 12, fontWeight: 700,
//               letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.15s",
//               background: settingsActive ? (isDark ? "#ffffff" : "#0f1117") : hovered === "settings" ? (isDark ? "#1a1d27" : "#f5f6f8") : "transparent",
//               color: settingsActive ? (isDark ? "#0f1117" : "#ffffff") : isDark ? "#6b7280" : "#6b7280",
//             }}>
//             <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}
//               stroke={settingsActive ? (isDark ? "#0f1117" : "#fff") : "#9ca3af"}
//               style={{ width: 15, height: 15 }}>
//               <circle cx="12" cy="12" r="3" />
//               <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
//             </svg>
//             SETTINGS
//           </Link>

//           {/* Logout */}
//           <button onClick={() => setShowConfirm(true)}
//             onMouseEnter={() => setHovered("logout")}
//             onMouseLeave={() => setHovered(null)}
//             style={{
//               display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
//               borderRadius: 12, border: "none", cursor: "pointer", width: "100%",
//               fontFamily: "inherit", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
//               transition: "all 0.15s",
//               background: hovered === "logout" ? "rgba(239,68,68,0.08)" : "transparent",
//               color: "#ef4444",
//             }}>
//             <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#ef4444" style={{ width: 15, height: 15 }}>
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//               <polyline points="16 17 21 12 16 7" />
//               <line x1="21" y1="12" x2="9" y2="12" />
//             </svg>
//             Log out
//           </button>
//         </div>
//       </aside>

//       {/* ════════════════════════════════════════════════════════════════════
//           MOBILE BOTTOM NAV
//       ════════════════════════════════════════════════════════════════════ */}
//       <nav className="oasis-bottom-nav" style={{
//         position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
//         background: mobileBg,
//         borderTop: `1px solid ${border}`,
//         padding: "0 4px",
//         paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
//         fontFamily: "'DM Sans', system-ui, sans-serif",
//         boxShadow: isDark ? "0 -4px 24px rgba(0,0,0,0.4)" : "0 -4px 24px rgba(0,0,0,0.06)",
//         justifyContent: "space-around",
//         alignItems: "stretch",
//         transition: "background 0.3s, border-color 0.3s",
//       }}>
//         {/* Main nav items */}
//         {NAV_ITEMS.map((item) => {
//           const isActive = activePage === item.id;
//           return (
//             <Link key={item.id} href={item.href} style={{
//               flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
//               justifyContent: "center", gap: 3, padding: "10px 4px 8px",
//               textDecoration: "none", transition: "all 0.15s",
//               color: isActive ? (isDark ? "#ffffff" : "#0f1117") : isDark ? "#4b5563" : "#9ca3af",
//               position: "relative",
//             }}>
//               {isActive && (
//                 <div style={{
//                   position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
//                   width: 20, height: 2, borderRadius: 2,
//                   background: isDark ? "#ffffff" : "#0f1117",
//                 }} />
//               )}
//               <span style={{
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 width: 36, height: 28, borderRadius: 9,
//                 background: isActive ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(15,17,23,0.08)") : "transparent",
//                 transition: "background 0.15s",
//               }}>
//                 {item.mobileIcon}
//               </span>
//               <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}>
//                 {item.label === "ATTENDANCE" ? "ATTEND." : item.label}
//               </span>
//             </Link>
//           );
//         })}

//         {/* Settings */}
//         <Link href="/dashboard/settings" style={{
//           flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
//           justifyContent: "center", gap: 3, padding: "10px 4px 8px",
//           textDecoration: "none", transition: "all 0.15s",
//           color: settingsActive ? (isDark ? "#ffffff" : "#0f1117") : isDark ? "#4b5563" : "#9ca3af",
//           position: "relative",
//         }}>
//           {settingsActive && (
//             <div style={{
//               position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
//               width: 20, height: 2, borderRadius: 2,
//               background: isDark ? "#ffffff" : "#0f1117",
//             }} />
//           )}
//           <span style={{
//             display: "flex", alignItems: "center", justifyContent: "center",
//             width: 36, height: 28, borderRadius: 9,
//             background: settingsActive ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(15,17,23,0.08)") : "transparent",
//             transition: "background 0.15s",
//           }}>
//             <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
//               <circle cx="12" cy="12" r="3" />
//               <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
//             </svg>
//           </span>
//           <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}>SETTINGS</span>
//         </Link>

//         {/* Logout */}
//         <button onClick={() => setShowConfirm(true)} style={{
//           flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
//           justifyContent: "center", gap: 3, padding: "10px 4px 8px",
//           border: "none", background: "transparent", cursor: "pointer",
//           fontFamily: "inherit", transition: "all 0.15s",
//           color: "#ef4444",
//         }}>
//           <span style={{
//             display: "flex", alignItems: "center", justifyContent: "center",
//             width: 36, height: 28, borderRadius: 9,
//           }}>
//             <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#ef4444" style={{ width: 20, height: 20 }}>
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//               <polyline points="16 17 21 12 16 7" />
//               <line x1="21" y1="12" x2="9" y2="12" />
//             </svg>
//           </span>
//           <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}>LOG OUT</span>
//         </button>
//       </nav>

//       {/* ════════════════════════════════════════════════════════════════════
//           LOGOUT CONFIRM MODAL (shared desktop + mobile)
//       ════════════════════════════════════════════════════════════════════ */}
//       {showConfirm && (
//         <div onClick={() => { if (!loggingOut) { setShowConfirm(false); setLogoutError(null); } }}
//           style={{
//             position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
//             backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
//             zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center",
//             padding: 16, animation: "fadeIn 0.15s ease",
//           }}>
//           <div onClick={e => e.stopPropagation()}
//             style={{
//               background: modalBg, border: `1px solid ${modalBorder}`,
//               borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 360,
//               boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
//               fontFamily: "'DM Sans', system-ui, sans-serif",
//               animation: "slideUp 0.2s ease",
//             }}>
//             <div style={{
//               width: 52, height: 52, borderRadius: 14, background: "rgba(239,68,68,0.1)",
//               border: "1px solid rgba(239,68,68,0.2)",
//               display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
//             }}>
//               <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#ef4444" style={{ width: 24, height: 24 }}>
//                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                 <polyline points="16 17 21 12 16 7" />
//                 <line x1="21" y1="12" x2="9" y2="12" />
//               </svg>
//             </div>
//             <h2 style={{ fontSize: 18, fontWeight: 800, color: textPrimary, margin: "0 0 8px" }}>Sign out?</h2>
//             <p style={{ fontSize: 13, color: textMuted, margin: "0 0 24px", lineHeight: 1.6 }}>
//               You'll need to log back in to access the dashboard. Any unsaved changes will be lost.
//             </p>

//             {logoutError && (
//               <div style={{
//                 marginBottom: 16, padding: "10px 14px", borderRadius: 10,
//                 background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
//                 fontSize: 12, color: "#ef4444",
//               }}>
//                 {logoutError}
//               </div>
//             )}

//             <div style={{ display: "flex", gap: 10 }}>
//               <button onClick={() => { setShowConfirm(false); setLogoutError(null); }} disabled={loggingOut}
//                 style={{
//                   flex: 1, padding: "12px 0", borderRadius: 12, border: `1px solid ${modalBorder}`,
//                   background: "transparent", color: textMuted, fontSize: 13, fontWeight: 700,
//                   cursor: loggingOut ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.15s",
//                 }}
//                 onMouseEnter={e => { if (!loggingOut) e.currentTarget.style.background = cancelHover; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
//                 Cancel
//               </button>
//               <button onClick={handleLogout} disabled={loggingOut}
//                 style={{
//                   flex: 1, padding: "12px 0", borderRadius: 12, border: "none",
//                   background: "#ef4444", color: "#ffffff", fontSize: 13, fontWeight: 700,
//                   cursor: loggingOut ? "not-allowed" : "pointer", fontFamily: "inherit",
//                   opacity: loggingOut ? 0.8 : 1,
//                   display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//                 }}
//                 onMouseEnter={e => { if (!loggingOut) e.currentTarget.style.background = "#dc2626"; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = "#ef4444"; }}>
//                 {loggingOut ? (
//                   <>
//                     <svg style={{ width: 14, height: 14, animation: "spin 0.8s linear infinite" }} fill="none" viewBox="0 0 24 24">
//                       <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
//                       <path style={{ opacity: 0.75 }} fill="white" d="M4 12a8 8 0 018-8v8z" />
//                     </svg>
//                     Signing out...
//                   </>
//                 ) : "Sign out"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }






















"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/components/ThemeProvider";
import { createClient } from "@/lib/supabase/client";

type PageId = "dashboard" | "members" | "attendance" | "programs" | "settings";

interface NavItem {
  id: PageId;
  label: string;
  href: string;
  icon: React.ReactNode;
  mobileIcon: React.ReactNode;
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
    mobileIcon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
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
    mobileIcon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
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
    mobileIcon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
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
    mobileIcon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function Sidebar({ activePage }: { activePage: PageId }) {
  const { isDark } = useTheme();
  const router     = useRouter();
  const supabase   = createClient();

  const [hovered,     setHovered]     = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loggingOut,  setLoggingOut]  = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);

    // Clear any local storage immediately
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect instantly — don't wait for signOut() to finish.
    // The onAuthStateChange listener in DashboardShell will fire
    // once signOut resolves and handle any cleanup.
    // Middleware will block the dashboard on next load.
    router.replace("/Heropage");

    // Fire sign-out in background — no await, no blocking
    supabase.auth.signOut();
  };

  // ── Theme tokens ────────────────────────────────────────────────────────
  const bg          = isDark ? "#111318" : "#ffffff";
  const border      = isDark ? "#1e2028" : "#f0f0f0";
  const labelColor  = isDark ? "#4b5262" : "#b0b7c3";
  const logoColor   = isDark ? "#ffffff" : "#0f1117";
  const modalBg     = isDark ? "#16181f" : "#ffffff";
  const modalBorder = isDark ? "#1e2028" : "#e5e7eb";
  const textPrimary = isDark ? "#f3f4f6" : "#0f1117";
  const textMuted   = isDark ? "#6b7280" : "#9ca3af";
  const cancelHover = isDark ? "#1a1d27" : "#f5f6f8";
  const mobileBg    = isDark ? "#111318" : "#ffffff";

  const settingsActive = activePage === "settings";

  return (
    <>
      <style>{`
        .oasis-sidebar   { display: flex; }
        .oasis-bottom-nav { display: none; }
        @media (max-width: 767px) {
          .oasis-sidebar    { display: none !important; }
          .oasis-bottom-nav { display: flex !important; }
        }
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes spin    { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP SIDEBAR
      ══════════════════════════════════════════════════════════════════ */}
      <aside className="oasis-sidebar" style={{
        width: 220, minHeight: "100vh", flexShrink: 0,
        background: bg, borderRight: `1px solid ${border}`,
        flexDirection: "column",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        transition: "background 0.3s, border-color 0.3s",
        position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Logo */}
        <div style={{ padding: "28px 24px 20px" }}>
          <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              width: 26, height: 26, background: "#111", borderRadius: 6,
              display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr",
              gap: 3, padding: 5, flexShrink: 0,
            }}>
              {[0,1,2,3].map(i => <span key={i} style={{ background: "#f0f0ed", borderRadius: 1 }} />)}
            </span>
            <span style={{ fontSize: 20, letterSpacing: "-0.5px", color: logoColor, lineHeight: 1 }}>
              <span style={{ fontWeight: 300 }}>oasis</span>
              <span style={{ fontWeight: 900 }}>Portal</span>
            </span>
          </Link>
        </div>

        {/* Menu label */}
        <div style={{ padding: "0 24px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: labelColor, textTransform: "uppercase" }} className="mt-5">
          Menu
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map((item) => {
            const isActive  = activePage === item.id;
            const isHovered = hovered === item.id;
            return (
              <Link key={item.id} href={item.href}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                  borderRadius: 12, fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.15s",
                  background: isActive ? (isDark ? "#ffffff" : "#0f1117") : isHovered ? (isDark ? "#1a1d27" : "#f5f6f8") : "transparent",
                  color: isActive ? (isDark ? "#0f1117" : "#ffffff") : isDark ? "#6b7280" : "#6b7280",
                }}>
                <span style={{ display: "flex", alignItems: "center", color: isActive ? (isDark ? "#0f1117" : "#ffffff") : isDark ? "#6b7280" : "#9ca3af" }}>
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
          <Link href="/dashboard/settings"
            onMouseEnter={() => setHovered("settings")}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
              borderRadius: 12, fontFamily: "inherit", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.15s",
              background: settingsActive ? (isDark ? "#ffffff" : "#0f1117") : hovered === "settings" ? (isDark ? "#1a1d27" : "#f5f6f8") : "transparent",
              color: settingsActive ? (isDark ? "#0f1117" : "#ffffff") : isDark ? "#6b7280" : "#6b7280",
            }}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}
              stroke={settingsActive ? (isDark ? "#0f1117" : "#fff") : "#9ca3af"}
              style={{ width: 15, height: 15 }}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            SETTINGS
          </Link>

          {/* Logout */}
          <button suppressHydrationWarning
            onClick={() => setShowConfirm(true)}
            onMouseEnter={() => setHovered("logout")}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
              borderRadius: 12, border: "none", cursor: "pointer", width: "100%",
              fontFamily: "inherit", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
              transition: "all 0.15s",
              background: hovered === "logout" ? "rgba(239,68,68,0.08)" : "transparent",
              color: "#ef4444",
            }}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#ef4444" style={{ width: 15, height: 15 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE BOTTOM NAV
      ══════════════════════════════════════════════════════════════════ */}
      <nav className="oasis-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: mobileBg, borderTop: `1px solid ${border}`,
        padding: "0 4px",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        boxShadow: isDark ? "0 -4px 24px rgba(0,0,0,0.4)" : "0 -4px 24px rgba(0,0,0,0.06)",
        justifyContent: "space-around", alignItems: "stretch",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <Link key={item.id} href={item.href} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 3, padding: "10px 4px 8px",
              textDecoration: "none", transition: "all 0.15s",
              color: isActive ? (isDark ? "#ffffff" : "#0f1117") : isDark ? "#4b5563" : "#9ca3af",
              position: "relative",
            }}>
              {isActive && (
                <div style={{
                  position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
                  width: 20, height: 2, borderRadius: 2,
                  background: isDark ? "#ffffff" : "#0f1117",
                }} />
              )}
              <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 28, borderRadius: 9,
                background: isActive ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(15,17,23,0.08)") : "transparent",
                transition: "background 0.15s",
              }}>
                {item.mobileIcon}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}>
                {item.label === "ATTENDANCE" ? "ATTEND." : item.label}
              </span>
            </Link>
          );
        })}

        {/* Settings */}
        <Link href="/dashboard/settings" style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 3, padding: "10px 4px 8px",
          textDecoration: "none", transition: "all 0.15s",
          color: settingsActive ? (isDark ? "#ffffff" : "#0f1117") : isDark ? "#4b5563" : "#9ca3af",
          position: "relative",
        }}>
          {settingsActive && (
            <div style={{
              position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
              width: 20, height: 2, borderRadius: 2,
              background: isDark ? "#ffffff" : "#0f1117",
            }} />
          )}
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 28, borderRadius: 9,
            background: settingsActive ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(15,17,23,0.08)") : "transparent",
            transition: "background 0.15s",
          }}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}>SETTINGS</span>
        </Link>

        {/* Logout */}
        <button suppressHydrationWarning
          onClick={() => setShowConfirm(true)}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3, padding: "10px 4px 8px",
            border: "none", background: "transparent", cursor: "pointer",
            fontFamily: "inherit", transition: "all 0.15s", color: "#ef4444",
          }}>
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 28, borderRadius: 9,
          }}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#ef4444" style={{ width: 20, height: 20 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}>LOG OUT</span>
        </button>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════
          LOGOUT CONFIRM MODAL
      ══════════════════════════════════════════════════════════════════ */}
      {showConfirm && (
        <div
          onClick={() => { if (!loggingOut) setShowConfirm(false); }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
            zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, animation: "fadeIn 0.15s ease",
          }}>
          <div onClick={e => e.stopPropagation()}
            style={{
              background: modalBg, border: `1px solid ${modalBorder}`,
              borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 360,
              boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              animation: "slideUp 0.2s ease",
            }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
            }}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#ef4444" style={{ width: 24, height: 24 }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 800, color: textPrimary, margin: "0 0 8px" }}>Sign out?</h2>
            <p style={{ fontSize: 13, color: textMuted, margin: "0 0 24px", lineHeight: 1.6 }}>
              You'll need to log back in to access the dashboard. Any unsaved changes will be lost.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loggingOut}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 12, border: `1px solid ${modalBorder}`,
                  background: "transparent", color: textMuted, fontSize: 13, fontWeight: 700,
                  cursor: loggingOut ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (!loggingOut) e.currentTarget.style.background = cancelHover; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 12, border: "none",
                  background: "#ef4444", color: "#ffffff", fontSize: 13, fontWeight: 700,
                  cursor: loggingOut ? "not-allowed" : "pointer", fontFamily: "inherit",
                  opacity: loggingOut ? 0.8 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
                onMouseEnter={e => { if (!loggingOut) e.currentTarget.style.background = "#dc2626"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#ef4444"; }}>
                {loggingOut ? (
                  <>
                    <svg style={{ width: 14, height: 14, animation: "spin 0.8s linear infinite" }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="white" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing out...
                  </>
                ) : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}