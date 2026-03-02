


// 'use client';

// // app/dashboard/settings/page.tsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Multi-tenant · Light default · Dark via useTheme
// //
// // Required DB migration (run once in Supabase SQL editor):
// //   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS meeting_day  text DEFAULT '';
// //   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS meeting_time text DEFAULT '';
// //   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS venue        text DEFAULT '';
// // ─────────────────────────────────────────────────────────────────────────────

// import { useState, useEffect, useRef } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import { useRouter } from 'next/navigation';
// import { useTheme } from '@/app/components/ThemeProvider';

// // ── Types ─────────────────────────────────────────────────────────────────────
// type CellProfile = {
//   id: number;
//   user_id: string;
//   cell_name: string;
//   leader_name: string;
//   phone: string;
//   email: string;
//   address: string;
//   meeting_day: string;
//   meeting_time: string;
//   venue: string;
//   image_url: string | null;
// };

// const defaultProfile: Omit<CellProfile, 'id' | 'user_id'> = {
//   cell_name: '', leader_name: '', phone: '', email: '',
//   address: '', meeting_day: '', meeting_time: '', venue: '', image_url: null,
// };

// type ExportSection = 'cell' | 'members' | 'attendance' | 'celebrations' | 'programs';
// type ExportFormat  = 'xlsx' | 'pdf';

// const EXPORT_SECTIONS: { id: ExportSection; label: string; sub: string }[] = [
//   { id: 'cell',         label: 'Cell Information',  sub: 'Name, leader, venue, contact details' },
//   { id: 'members',      label: 'Members List',       sub: 'All member names & phone numbers'     },
//   { id: 'attendance',   label: 'Attendance Records', sub: 'All meetings with per-member status'  },
//   { id: 'celebrations', label: 'Celebrations',       sub: 'Birthdays & anniversaries'            },
//   { id: 'programs',     label: 'Programs',           sub: 'All scheduled programs & events'      },
// ];

// // ── Theme tokens ──────────────────────────────────────────────────────────────
// function useTokens(isDark: boolean) {
//   return {
//     pageBg:   isDark ? '#0d0f14' : '#f0f2f5',
//     cardBg:   isDark ? '#151720' : '#ffffff',
//     cardBg2:  isDark ? '#1a1d26' : '#f8f9fb',
//     border:   isDark ? '#22252f' : '#e8eaed',
//     border2:  isDark ? '#2a2e3a' : '#dde0e6',
//     tp:       isDark ? '#f1f2f5' : '#0f1117',
//     ts:       isDark ? '#9ca3af' : '#6b7280',
//     tss:      isDark ? '#4b5563' : '#9ca3af',
//     iconBg:   isDark ? '#1e2130' : '#eef0f4',
//     inputBg:  isDark ? '#1a1d26' : '#f4f5f8',
//     inputBd:  isDark ? '#2a2e3a' : '#dde0e6',
//     hoverBg:  isDark ? '#1e2130' : '#f0f2f6',
//     modalBg:  isDark ? '#13151d' : '#ffffff',
//     overlay:  isDark ? 'rgba(0,0,0,0.80)' : 'rgba(0,0,0,0.50)',
//     checkOn:  isDark ? '#6366f1' : '#4f46e5',
//     checkBg:  isDark ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.07)',
//     checkBd:  isDark ? 'rgba(99,102,241,0.4)'  : 'rgba(79,70,229,0.3)',
//     fmtOnBg:  isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
//     fmtOnBd:  isDark ? '#3b82f6' : '#2563eb',
//     fmtOnTxt: isDark ? '#60a5fa' : '#2563eb',
//     cyan:     '#06b6d4',
//   };
// }

// // ── SVG Icons ─────────────────────────────────────────────────────────────────
// const ic = (color: string) => ({ viewBox: '0 0 24 24', fill: 'none' as const, stroke: color, strokeWidth: 1.8, style: { width: 18, height: 18 } as React.CSSProperties });
// function IconPerson({ c }: { c: string })   { return <svg {...ic(c)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
// function IconCalendar({ c }: { c: string }) { return <svg {...ic(c)}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
// function IconClock({ c }: { c: string })    { return <svg {...ic(c)}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>; }
// function IconPin({ c }: { c: string })      { return <svg {...ic(c)}><path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
// function IconMail({ c }: { c: string })     { return <svg {...ic(c)}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>; }
// function IconPhone({ c }: { c: string })    { return <svg {...ic(c)}><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 5.18 2 2 0 0 1 5.09 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z"/></svg>; }
// function IconEdit({ c }: { c: string })     { return <svg {...ic(c)}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
// function IconDownload({ c }: { c: string }) { return <svg {...ic(c)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
// function IconTrash({ c }: { c: string })    { return <svg {...ic(c)}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
// function IconCheck({ c }: { c: string })    { return <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={3} style={{ width: 12, height: 12 }}><path d="M20 6 9 17l-5-5"/></svg>; }
// function IconCamera({ c }: { c: string })   { return <svg {...ic(c)}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
// function IconWarn({ c }: { c: string })     { return <svg {...ic(c)} style={{ width: 28, height: 28 }}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }

// // ── Info card ─────────────────────────────────────────────────────────────────
// function InfoCard({ icon, label, value, t }: { icon: React.ReactNode; label: string; value: string; t: ReturnType<typeof useTokens> }) {
//   return (
//     <div style={{ background: t.cardBg2, border: `1px solid ${t.border}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
//       <div style={{ width: 38, height: 38, borderRadius: 10, background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
//       <div style={{ minWidth: 0 }}>
//         <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: t.ts, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
//         <div style={{ fontSize: 14, fontWeight: 700, color: t.tp, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || '—'}</div>
//       </div>
//     </div>
//   );
// }

// // ── Delete Confirmation Modal ─────────────────────────────────────────────────
// function DeleteConfirmModal({ onConfirm, onClose, deleting, t }: {
//   onConfirm: () => void; onClose: () => void; deleting: boolean; t: ReturnType<typeof useTokens>;
// }) {
//   const items = [
//     'All members & their data',
//     'All attendance records & meetings',
//     'All celebrations',
//     'All programs',
//     'Cell profile information',
//     'Your login email & account',
//   ];
//   return (
//     <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: t.overlay, backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn 0.15s ease' }}
//       onClick={() => { if (!deleting) onClose(); }}>
//       <div onClick={e => e.stopPropagation()} style={{ background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: 18, width: '100%', maxWidth: 500, padding: '32px 32px 28px', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', animation: 'slideUp 0.18s ease' }}>

//         {/* Title row — shield icon + heading */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
//           <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(220,38,38,0.12)', border: '1.5px solid rgba(220,38,38,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//             <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} style={{ width: 22, height: 22 }}>
//               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
//             </svg>
//           </div>
//           <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#dc2626', letterSpacing: '-0.3px' }}>Delete Account?</h2>
//         </div>

//         {/* Body */}
//         <p style={{ margin: '0 0 14px', fontSize: 14, color: t.tp, lineHeight: 1.65 }}>
//           This will <strong>permanently delete</strong> everything associated with your account:
//         </p>
//         <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
//           {items.map(item => (
//             <li key={item} style={{ fontSize: 13.5, color: t.ts, display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.4 }}>
//               <span style={{ color: t.tp, fontWeight: 700, fontSize: 16, lineHeight: '20px', flexShrink: 0 }}>•</span>
//               {item}
//             </li>
//           ))}
//         </ul>
//         <p style={{ margin: '0 0 28px', fontSize: 13.5, color: t.ts, lineHeight: 1.55 }}>
//           You will be{' '}
//           <span style={{ color: '#dc2626', fontWeight: 700 }}>logged out immediately</span>.
//           {' '}This cannot be undone.
//         </p>

//         {/* Buttons */}
//         <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
//           <button
//             onClick={onClose} disabled={deleting}
//             style={{ padding: '12px 28px', borderRadius: 11, border: `1.5px solid ${t.border2}`, background: 'transparent', color: t.tp, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: deleting ? 0.5 : 1, transition: 'background 0.15s' }}
//             onMouseEnter={e => (e.currentTarget.style.background = t.hoverBg)}
//             onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
//           >Cancel</button>
//           <button
//             onClick={onConfirm} disabled={deleting}
//             style={{ padding: '12px 28px', borderRadius: 11, border: 'none', background: '#dc2626', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: deleting ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}
//             onMouseEnter={e => { if (!deleting) (e.currentTarget as HTMLElement).style.background = '#b91c1c'; }}
//             onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#dc2626'}
//           >
//             {deleting ? (
//               <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Deleting…</>
//             ) : 'Yes, Continue'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Export Modal (fetches real data) ──────────────────────────────────────────
// function ExportModal({ onClose, t, userId }: { onClose: () => void; t: ReturnType<typeof useTokens>; userId: string }) {
//   const supabase = createClient();
//   const [selected, setSelected] = useState<Set<ExportSection>>(
//     new Set(['cell', 'members', 'attendance', 'celebrations', 'programs'])
//   );
//   const [format, setFormat]  = useState<ExportFormat>('pdf');
//   const [generating, setGen] = useState(false);
//   const [genError, setGenError] = useState<string | null>(null);

//   function toggle(id: ExportSection) {
//     setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
//   }

//   // ── Fetch all selected data from Supabase ──────────────────────────────────
//   async function fetchData() {
//     const out: Record<string, any[]> = {};

//     if (selected.has('cell')) {
//       const { data } = await supabase.from('cell_profile').select('*').eq('user_id', userId).single();
//       out.cell = data ? [data] : [];
//     }
//     if (selected.has('members')) {
//       const { data } = await supabase.from('members').select('*').eq('user_id', userId);
//       out.members = data ?? [];
//     }
//     if (selected.has('attendance')) {
//       const { data: meetings } = await supabase.from('meetings').select('*').eq('user_id', userId);
//       const { data: records }  = await supabase.from('attendance_records').select('*').eq('user_id', userId);
//       out.meetings    = meetings ?? [];
//       out.attendance  = records  ?? [];
//     }
//     if (selected.has('celebrations')) {
//       const { data } = await supabase.from('celebrations').select('*').eq('user_id', userId);
//       out.celebrations = data ?? [];
//     }
//     if (selected.has('programs')) {
//       const { data } = await supabase.from('programs').select('*').eq('user_id', userId);
//       out.programs = data ?? [];
//     }
//     return out;
//   }

//   // ── XLSX export using SheetJS (loaded from CDN) ────────────────────────────
//   async function exportXlsx(data: Record<string, any[]>) {
//     if (!(window as any).XLSX) {
//       await new Promise<void>((res, rej) => {
//         const s = document.createElement('script');
//         s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
//         s.onload = () => res();
//         s.onerror = () => rej(new Error('Failed to load SheetJS'));
//         document.head.appendChild(s);
//       });
//     }
//     const XLSX = (window as any).XLSX;
//     const wb = XLSX.utils.book_new();

//     const labelMap: Record<string, string> = {
//       cell: 'Cell Info', members: 'Members', meetings: 'Meetings',
//       attendance: 'Attendance', celebrations: 'Celebrations', programs: 'Programs',
//     };

//     for (const [key, rows] of Object.entries(data)) {
//       if (!rows.length) continue;
//       const clean = rows.map(r => {
//         const { id, user_id, ...rest } = r as any;
//         return rest;
//       });
//       const ws = XLSX.utils.json_to_sheet(clean);
//       const colWidths = Object.keys(clean[0]).map(k => ({ wch: Math.max(k.length, 16) }));
//       ws['!cols'] = colWidths;
//       XLSX.utils.book_append_sheet(wb, ws, labelMap[key] ?? key);
//     }

//     XLSX.writeFile(wb, `oasis-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
//   }

//   // ── A4 PDF export via print-to-PDF ────────────────────────────────────────
//   function exportPdf(data: Record<string, any[]>) {
//     const cellInfo   = data.cell?.[0];
//     const members    = data.members      ?? [];
//     const meetings   = data.meetings     ?? [];
//     const attendance = data.attendance   ?? [];
//     const celebs     = data.celebrations ?? [];
//     const programs   = data.programs     ?? [];

//     const now    = new Date();
//     const dtStr  = now.toLocaleString('en-GB', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' });
//     const dayStr = now.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

//     const cellName   = cellInfo?.cell_name    || 'Oasis';
//     const leaderName = cellInfo?.leader_name  || '';
//     const leaderEmail= cellInfo?.email        || '';
//     const leaderPhone= cellInfo?.phone        || '';

//     const S = {
//       page:  'font-family:"Helvetica Neue",Arial,sans-serif;margin:0;padding:0;color:#111;font-size:12px;background:#fff;',
//       wrap:  'max-width:680px;margin:0 auto;padding:28px 32px 48px;',
//       hdr:   'display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:2.5px solid #111;margin-bottom:32px;',
//       hLeft: 'display:flex;flex-direction:column;',
//       hName: 'font-size:26px;font-weight:900;margin:0 0 2px;letter-spacing:-0.5px;',
//       hSub:  'font-size:11px;color:#6b7280;margin:0;',
//       hRight:'text-align:right;font-size:11px;line-height:1.7;color:#374151;',
//       hRL:   'font-weight:700;font-size:12px;color:#111;',
//       secHdr:'font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;margin:32px 0 10px;',
//       ciWrap:'border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:8px;',
//       ciRow: 'display:flex;border-bottom:1px solid #e5e7eb;',
//       ciKey: 'width:140px;padding:9px 14px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;background:#f8fafc;flex-shrink:0;',
//       ciVal: 'padding:9px 14px;font-size:13px;font-weight:600;color:#111;',
//       tbl:   'width:100%;border-collapse:collapse;font-size:12px;',
//       th:    'padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;border-bottom:1.5px solid #e5e7eb;background:#fff;',
//       td:    'padding:8px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top;',
//       tdAlt: 'padding:8px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top;background:#fafafa;',
//       badge: 'display:inline-block;background:#f3f4f6;border-radius:20px;padding:1px 8px;font-size:10px;font-weight:700;color:#6b7280;margin-left:8px;vertical-align:middle;',
//       present:'font-weight:700;color:#16a34a;',
//       absent: 'font-weight:700;color:#dc2626;',
//       mtgHdr:'font-weight:800;font-size:13px;color:#111;margin:20px 0 6px;display:flex;justify-content:space-between;align-items:baseline;',
//       mtgSub:'font-size:11px;color:#6b7280;font-weight:400;',
//       footer:'margin-top:48px;padding-top:14px;border-top:1.5px solid #e5e7eb;display:flex;justify-content:space-between;font-size:10px;color:#9ca3af;',
//     };

//     function ciRow(key: string, val: string) {
//       return `<div style="${S.ciRow}"><div style="${S.ciKey}">${key}</div><div style="${S.ciVal}">${val||'—'}</div></div>`;
//     }

//     function tblRow(cells: string[], alt: boolean) {
//       return `<tr>${cells.map(c => `<td style="${alt?S.tdAlt:S.td}">${c??'—'}</td>`).join('')}</tr>`;
//     }

//     function fmt(d: string|null|undefined) {
//       if (!d) return '—';
//       const parsed = new Date(d);
//       if (isNaN(parsed.getTime())) return d;
//       return parsed.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'long', year:'numeric' });
//     }

//     let body = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${cellName} — Report</title>
// <style>
//   *{box-sizing:border-box;}
//   body{${S.page}}
//   @media print{@page{size:A4;margin:14mm 14mm 18mm;} body{padding:0;} .no-print{display:none;}}
// </style></head><body>
// <div style="${S.wrap}">

//   <!-- HEADER -->
//   <div style="${S.hdr}">
//     <div style="${S.hLeft}">
//       <h1 style="${S.hName}">${cellName}</h1>
//       <p style="${S.hSub}">Report · Generated ${dayStr}</p>
//     </div>
//     <div style="${S.hRight}">
//       <div style="${S.hRL}">${leaderName}</div>
//       <div>Cell Leader</div>
//       ${leaderEmail ? `<div>${leaderEmail}</div>` : ''}
//       ${leaderPhone ? `<div>${leaderPhone}</div>` : ''}
//     </div>
//   </div>`;

//     if (cellInfo) {
//       body += `<div style="${S.secHdr}">Cell Information</div>
// <div style="${S.ciWrap}">
//   ${ciRow('Cell Name',    cellInfo.cell_name    || '—')}
//   ${ciRow('Cell Leader',  cellInfo.leader_name  || '—')}
//   ${ciRow('Meeting Day(s)', cellInfo.meeting_day || '—')}
//   ${ciRow('Time',         cellInfo.meeting_time || '—')}
//   ${ciRow('Venue',        cellInfo.venue        || '—')}
//   ${ciRow('Email',        cellInfo.email        || '—')}
//   <div style="${S.ciRow.replace('border-bottom:1px solid #e5e7eb;','')}">
//     <div style="${S.ciKey}">Phone</div><div style="${S.ciVal}">${cellInfo.phone||'—'}</div>
//   </div>
// </div>`;
//     }

//     if (selected.has('members')) {
//       body += `<div style="${S.secHdr}">Members <span style="${S.badge}">${members.length}</span></div>`;
//       if (!members.length) {
//         body += `<p style="color:#9ca3af;font-size:12px;">No members found.</p>`;
//       } else {
//         body += `<table style="${S.tbl}"><thead><tr>
//           <th style="${S.th};width:32px">#</th>
//           <th style="${S.th}">Name</th>
//           <th style="${S.th}">Phone</th>
//           <th style="${S.th}">Gender</th>
//           <th style="${S.th}">Join Date</th>
//           <th style="${S.th}">Birthday</th>
//         </tr></thead><tbody>
//           ${members.map((m: any, i: number) => tblRow([
//             String(i+1), m.name||'—', m.phone||'—', m.gender||'—', fmt(m.date_joined||m.created_at), fmt(m.date_of_birth||m.birthday)
//           ], i%2===1)).join('')}
//         </tbody></table>`;
//       }
//     }

//     if (selected.has('attendance')) {
//       body += `<div style="${S.secHdr}">Attendance Records</div>`;
//       if (!meetings.length) {
//         body += `<p style="color:#9ca3af;font-size:12px;">No meetings found.</p>`;
//       } else {
//         meetings.forEach((mtg: any) => {
//           const recs = attendance.filter((a: any) => a.meeting_id === mtg.id);
//           const presentCount = recs.filter((a: any) => (a.status||'').toLowerCase() === 'present').length;
//           body += `<div style="${S.mtgHdr}">
//             ${mtg.title||'Meeting'} · <span style="${S.mtgSub}">${fmt(mtg.date)}</span>
//             <span style="font-size:11px;color:#6b7280;font-weight:500;">${presentCount}/${recs.length} present</span>
//           </div>`;
//           if (!recs.length) {
//             body += `<p style="color:#9ca3af;font-size:11px;margin:0 0 12px;">No attendance recorded.</p>`;
//           } else {
//             body += `<table style="${S.tbl};margin-bottom:16px;"><thead><tr>
//               <th style="${S.th};width:32px">#</th>
//               <th style="${S.th}">Member</th>
//               <th style="${S.th}">Status</th>
//             </tr></thead><tbody>
//               ${recs.map((a: any, i: number) => {
//                 const isPresent = (a.status||'').toLowerCase() === 'present';
//                 const statusCell = isPresent
//                   ? `<span style="${S.present}">✓ Present</span>`
//                   : `<span style="${S.absent}">✗ Absent</span>`;
//                 return `<tr><td style="${i%2===1?S.tdAlt:S.td}">${i+1}</td><td style="${i%2===1?S.tdAlt:S.td}">${a.member_name||a.member_id||'—'}</td><td style="${i%2===1?S.tdAlt:S.td}">${statusCell}</td></tr>`;
//               }).join('')}
//             </tbody></table>`;
//           }
//         });
//       }
//     }

//     if (selected.has('celebrations')) {
//       body += `<div style="${S.secHdr}">Celebrations <span style="${S.badge}">${celebs.length}</span></div>`;
//       if (!celebs.length) {
//         body += `<p style="color:#9ca3af;font-size:12px;">No celebrations found.</p>`;
//       } else {
//         body += `<table style="${S.tbl}"><thead><tr>
//           <th style="${S.th};width:32px">#</th>
//           <th style="${S.th}">Name</th>
//           <th style="${S.th}">Event</th>
//           <th style="${S.th}">Month</th>
//           <th style="${S.th}">Day</th>
//         </tr></thead><tbody>
//           ${celebs.map((c: any, i: number) => {
//             let month = c.month || '', day = c.day || '';
//             if (!month && c.date) {
//               const d = new Date(c.date);
//               month = d.toLocaleString('en-US', { month: 'long' });
//               day   = String(d.getDate()).padStart(2,'0');
//             }
//             return tblRow([String(i+1), c.name||'—', c.event||'—', month||'—', day||'—'], i%2===1);
//           }).join('')}
//         </tbody></table>`;
//       }
//     }

//     if (selected.has('programs')) {
//       body += `<div style="${S.secHdr}">Programs <span style="${S.badge}">${programs.length}</span></div>`;
//       if (!programs.length) {
//         body += `<p style="color:#9ca3af;font-size:12px;">No programs found.</p>`;
//       } else {
//         body += `<table style="${S.tbl}"><thead><tr>
//           <th style="${S.th};width:32px">#</th>
//           <th style="${S.th}">Title</th>
//           <th style="${S.th}">Date</th>
//           <th style="${S.th}">Time</th>
//           <th style="${S.th}">Venue</th>
//         </tr></thead><tbody>
//           ${programs.map((p: any, i: number) => tblRow([String(i+1), p.title||'—', fmt(p.date), p.time||p.meeting_time||'—', p.venue||'—'], i%2===1)).join('')}
//         </tbody></table>`;
//       }
//     }

//     body += `<div style="${S.footer}"><span>${cellName}</span><span>${dtStr}</span></div>`;
//     body += `</div></body></html>`;

//     const win = window.open('', '_blank');
//     if (!win) { alert('Please allow popups for this page to generate the PDF.'); return; }
//     win.document.write(body);
//     win.document.close();
//     win.focus();
//     setTimeout(() => { win.print(); }, 500);
//   }

//   async function handleGenerate() {
//     setGen(true);
//     setGenError(null);
//     try {
//       const data = await fetchData();
//       if (format === 'xlsx') {
//         await exportXlsx(data);
//       } else {
//         exportPdf(data);
//       }
//       onClose();
//     } catch (err: any) {
//       setGenError(err.message ?? 'Export failed. Please try again.');
//     } finally {
//       setGen(false);
//     }
//   }

//   const modalBody: React.CSSProperties = { overflowY: 'auto', flex: 1, padding: '18px 26px' };

//   return (
//     <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: t.overlay, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
//       <div onClick={e => e.stopPropagation()} style={{ background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: 18, width: '100%', maxWidth: 540, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', animation: 'slideUp 0.18s ease' }}>

//         <div style={{ padding: '22px 26px 18px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//           <div>
//             <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: t.tp }}>Export Report</h2>
//             <p style={{ margin: '4px 0 0', fontSize: 13, color: t.ts }}>Choose what to include, then pick a format.</p>
//           </div>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: t.ts, cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 2 }}>×</button>
//         </div>

//         <div style={modalBody}>
//           {genError && (
//             <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', fontSize: 13 }}>
//               {genError}
//             </div>
//           )}

//           <p style={{ margin: '0 0 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: t.ts, textTransform: 'uppercase' }}>Include Sections</p>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//             {EXPORT_SECTIONS.map(s => {
//               const on = selected.has(s.id);
//               return (
//                 <button key={s.id} onClick={() => toggle(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left', background: on ? t.checkBg : t.cardBg2, border: `1.5px solid ${on ? t.checkBd : t.border}`, transition: 'all 0.12s', fontFamily: 'inherit' }}>
//                   <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: `2px solid ${on ? t.checkOn : t.border2}`, background: on ? t.checkOn : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     {on && <IconCheck c="#fff" />}
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 14, fontWeight: 600, color: t.tp }}>{s.label}</div>
//                     <div style={{ fontSize: 12, color: t.ts, marginTop: 1 }}>{s.sub}</div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           <p style={{ margin: '20px 0 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: t.ts, textTransform: 'uppercase' }}>Format</p>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
//             {(['xlsx', 'pdf'] as ExportFormat[]).map(f => {
//               const on = format === f;
//               return (
//                 <button key={f} onClick={() => setFormat(f)} style={{ padding: '18px 14px', borderRadius: 12, cursor: 'pointer', background: on ? t.fmtOnBg : t.cardBg2, border: `1.5px solid ${on ? t.fmtOnBd : t.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.12s', fontFamily: 'inherit' }}>
//                   {f === 'xlsx'
//                     ? <svg viewBox="0 0 24 24" fill="none" stroke={on ? t.fmtOnTxt : t.ts} strokeWidth={1.5} style={{ width: 26, height: 26 }}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
//                     : <svg viewBox="0 0 24 24" fill="none" stroke={on ? t.fmtOnTxt : t.ts} strokeWidth={1.5} style={{ width: 26, height: 26 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
//                   }
//                   <div style={{ fontSize: 13, fontWeight: 600, color: on ? t.fmtOnTxt : t.ts }}>{f === 'xlsx' ? 'Excel (.xlsx)' : 'A4 Print / PDF'}</div>
//                   <div style={{ fontSize: 11, color: t.tss }}>{f === 'xlsx' ? 'Multi-sheet spreadsheet' : 'Opens print dialog'}</div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div style={{ padding: '14px 26px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//           <button onClick={onClose} style={{ padding: '10px 22px', borderRadius: 10, border: `1px solid ${t.border2}`, background: 'transparent', color: t.ts, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
//           <button onClick={handleGenerate} disabled={generating || selected.size === 0} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: '#16a34a', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, opacity: (generating || selected.size === 0) ? 0.65 : 1, fontFamily: 'inherit' }}>
//             {generating
//               ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Generating…</>
//               : <><IconDownload c="#fff" />Generate Report</>
//             }
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Edit Modal ────────────────────────────────────────────────────────────────
// function EditModal({ form, setForm, onSave, onClose, saving, uploadingImg, onImageClick, fileInputRef, onImageChange, t }: {
//   form: Omit<CellProfile, 'id' | 'user_id'>;
//   setForm: React.Dispatch<React.SetStateAction<Omit<CellProfile, 'id' | 'user_id'>>>;
//   onSave: (e: React.FormEvent) => void;
//   onClose: () => void;
//   saving: boolean; uploadingImg: boolean;
//   onImageClick: () => void;
//   fileInputRef: React.RefObject<HTMLInputElement>;
//   onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   t: ReturnType<typeof useTokens>;
// }) {
//   const fields: { label: string; key: keyof typeof defaultProfile; full?: boolean; placeholder: string }[] = [
//     { label: 'Cell Name',      key: 'cell_name',    placeholder: 'e.g. Oasis Cell'           },
//     { label: 'Cell Leader',    key: 'leader_name',  placeholder: 'e.g. John Doe'             },
//     { label: 'Meeting Day(s)', key: 'meeting_day',  placeholder: 'e.g. Tuesdays & Fridays',  full: true },
//     { label: 'Time',           key: 'meeting_time', placeholder: 'e.g. 9AM'                  },
//     { label: 'Venue',          key: 'venue',        placeholder: 'e.g. Onsite / Zoom'        },
//     { label: 'Email',          key: 'email',        placeholder: 'e.g. cell@example.com'     },
//     { label: 'Phone No',       key: 'phone',        placeholder: 'e.g. 08012345678'          },
//   ];

//   const inputStyle: React.CSSProperties = {
//     width: '100%', padding: '11px 13px', borderRadius: 10, boxSizing: 'border-box',
//     border: `1.5px solid ${t.inputBd}`, background: t.inputBg,
//     color: t.tp, fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
//   };

//   return (
//     <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: t.overlay, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
//       <div onClick={e => e.stopPropagation()} style={{ background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: 18, width: '100%', maxWidth: 620, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', animation: 'slideUp 0.18s ease' }}>
//         <div style={{ padding: '22px 26px 18px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: t.tp }}>Edit Profile</h2>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: t.ts, cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 2 }}>×</button>
//         </div>

//         <form onSubmit={onSave} style={{ overflowY: 'auto', flex: 1, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 20 }}>
//           {/* Avatar */}
//           <div style={{ display: 'flex', justifyContent: 'center' }}>
//             <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onImageClick}>
//               <div style={{ width: 86, height: 86, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${t.cyan}`, background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 {form.image_url ? <img src={form.image_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconPerson c={t.ts} />}
//               </div>
//               <div style={{ position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: '50%', background: t.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${t.modalBg}` }}>
//                 {uploadingImg
//                   ? <div style={{ width: 10, height: 10, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
//                   : <IconCamera c="#fff" />}
//               </div>
//             </div>
//             <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onImageChange} />
//           </div>

//           {/* Fields */}
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
//             {fields.map(({ label, key, full, placeholder }) =>
//               key !== 'image_url' && (
//                 <div key={key} style={{ gridColumn: full ? '1 / -1' : undefined }}>
//                   <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', color: t.ts, textTransform: 'uppercase', marginBottom: 5 }}>{label}</label>
//                   <input
//                     type="text"
//                     value={(form[key] as string) || ''}
//                     placeholder={placeholder}
//                     onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
//                     style={inputStyle}
//                     onFocus={e => (e.target.style.borderColor = t.cyan)}
//                     onBlur={e => (e.target.style.borderColor = t.inputBd)}
//                   />
//                 </div>
//               )
//             )}
//           </div>

//           <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4, borderTop: `1px solid ${t.border}`, marginTop: 4 }}>
//             <button type="button" onClick={onClose} style={{ padding: '11px 26px', borderRadius: 10, border: `1px solid ${t.border2}`, background: 'transparent', color: t.ts, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
//             <button type="submit" disabled={saving} style={{ padding: '11px 26px', borderRadius: 10, border: 'none', background: t.tp, color: t.cardBg, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1, fontFamily: 'inherit' }}>
//               {saving ? 'Saving…' : 'Save Changes'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function SettingsPage() {
//   const { isDark } = useTheme();
//   const t          = useTokens(isDark);
//   const supabase   = createClient();
//   const router     = useRouter();

//   const [profile,      setProfile]      = useState<CellProfile | null>(null);
//   const [form,         setForm]         = useState(defaultProfile);
//   const [loading,      setLoading]      = useState(true);
//   const [saving,       setSaving]       = useState(false);
//   const [deleting,     setDeleting]     = useState(false);
//   const [uploadingImg, setUploadingImg] = useState(false);
//   const [successMsg,   setSuccessMsg]   = useState<string | null>(null);
//   const [errorMsg,     setErrorMsg]     = useState<string | null>(null);
//   const [editOpen,     setEditOpen]     = useState(false);
//   const [exportOpen,   setExportOpen]   = useState(false);
//   const [deleteOpen,   setDeleteOpen]   = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const channelRef   = useRef<ReturnType<typeof supabase.channel> | null>(null);

//   // ── Load profile ───────────────────────────────────────────────────────────
//   useEffect(() => {
//     let mounted = true;

//     async function loadProfile() {
//       setLoading(true);
//       const { data: { user }, error: userErr } = await supabase.auth.getUser();
//       if (userErr || !user) { router.push('/login'); return; }

//       let { data, error } = await supabase.from('cell_profile').select('*').eq('user_id', user.id).single();

//       if (error && error.code === 'PGRST116') {
//         const { data: ins, error: insErr } = await supabase
//           .from('cell_profile').upsert({ user_id: user.id, ...defaultProfile }, { onConflict: 'user_id' }).select().single();
//         if (insErr) { setErrorMsg('Could not load settings.'); setLoading(false); return; }
//         data = ins;
//       } else if (error) {
//         setErrorMsg('Could not load settings.'); setLoading(false); return;
//       }

//       if (!mounted) return;
//       setProfile(data);
//       syncForm(data);
//       setLoading(false);

//       if (channelRef.current) supabase.removeChannel(channelRef.current);
//       channelRef.current = supabase
//         .channel('settings-profile')
//         .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cell_profile', filter: `user_id=eq.${user.id}` },
//           payload => { if (!mounted) return; const u = payload.new as CellProfile; setProfile(u); syncForm(u); })
//         .subscribe();
//     }

//     loadProfile();
//     return () => { mounted = false; if (channelRef.current) supabase.removeChannel(channelRef.current); };
//   }, []);

//   function syncForm(d: any) {
//     setForm({
//       cell_name: d.cell_name || '', leader_name: d.leader_name || '',
//       phone: d.phone || '', email: d.email || '', address: d.address || '',
//       meeting_day: d.meeting_day || '', meeting_time: d.meeting_time || '',
//       venue: d.venue || '', image_url: d.image_url || null,
//     });
//   }

//   // ── Save ──────────────────────────────────────────────────────────────────
//   async function handleSave(e: React.FormEvent) {
//     e.preventDefault();
//     if (!profile) return;
//     setSaving(true); setSuccessMsg(null); setErrorMsg(null);

//     const basePayload: Record<string, string> = {
//       cell_name: form.cell_name, leader_name: form.leader_name,
//       phone: form.phone, email: form.email, address: form.address,
//     };
//     const extPayload = { ...basePayload, meeting_day: form.meeting_day, meeting_time: form.meeting_time, venue: form.venue };

//     let { error } = await supabase.from('cell_profile').update(extPayload).eq('user_id', profile.user_id);
//     if (error && error.message.includes('column')) {
//       const fb = await supabase.from('cell_profile').update(basePayload).eq('user_id', profile.user_id);
//       error = fb.error;
//     }

//     setSaving(false);
//     if (error) { setErrorMsg('Save failed: ' + error.message); }
//     else { setSuccessMsg('Profile saved!'); setEditOpen(false); setTimeout(() => setSuccessMsg(null), 3000); }
//   }

//   // ── Image upload ──────────────────────────────────────────────────────────
//   async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file || !profile) return;
//     setUploadingImg(true); setErrorMsg(null);

//     const ext = file.name.split('.').pop();
//     const filePath = `${profile.user_id}/cell-logo.${ext}`;
//     await supabase.storage.from('cell-images').remove([filePath]);

//     const { error: upErr } = await supabase.storage.from('cell-images').upload(filePath, file, { upsert: true });
//     if (upErr) { setErrorMsg('Upload failed: ' + upErr.message); setUploadingImg(false); return; }

//     const { data: urlData } = supabase.storage.from('cell-images').getPublicUrl(filePath);
//     const publicUrl = urlData.publicUrl + `?v=${Date.now()}`;

//     const { error: updErr } = await supabase.from('cell_profile').update({ image_url: publicUrl }).eq('user_id', profile.user_id);
//     if (updErr) { setErrorMsg('Could not save image URL.'); }
//     else { setForm(prev => ({ ...prev, image_url: publicUrl })); setSuccessMsg('Photo updated!'); setTimeout(() => setSuccessMsg(null), 3000); }
//     setUploadingImg(false);
//   }

  
// async function handleDeleteAccount() {
//   if (!profile?.user_id) {
//     setErrorMsg('No active profile found. Please refresh.');
//     return;
//   }
//   setDeleting(true);
//   setErrorMsg(null);

//   try {
//     const { data: { session } } = await supabase.auth.getSession();
//     if (!session) throw new Error('No active session. Please log in again.');

//     const tables = ['attendance_records', 'celebrations', 'programs', 'meetings', 'members', 'cell_profile'] as const;
//     for (const table of tables) {
//       const { error } = await supabase.from(table).delete().eq('user_id', profile.user_id);
//       if (error) console.warn(`Could not delete ${table}:`, error.message);
//     }

//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 10000);

//     const res = await fetch('/api/delete-account', {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${session.access_token}`,
//       },
//       signal: controller.signal,
//     });
//     clearTimeout(timeout);

//     if (!res.ok) {
//       const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
//       throw new Error(body.error ?? `Server error ${res.status}`);
//     }

//     await supabase.auth.signOut();
//     window.location.replace('/');

//   } catch (err: any) {
//     console.error('Delete account error:', err);
//     setDeleting(false);
//     setDeleteOpen(false);

//     if (err.name === 'AbortError') {
//       setErrorMsg('Request timed out. Please try again.');
//     } else {
//       setErrorMsg('Delete failed: ' + (err.message ?? 'Unknown error'));
//     }
//   }
// }






















//   // ── Render ────────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
//         <div style={{ width: 36, height: 36, border: `3px solid ${t.border}`, borderTopColor: t.cyan, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     );
//   }

//   const infoCards = [
//     { icon: <IconPerson c={t.ts} />,   label: 'Cell Name',   value: form.cell_name    },
//     { icon: <IconPerson c={t.ts} />,   label: 'Cell Leader', value: form.leader_name  },
//     { icon: <IconCalendar c={t.ts} />, label: 'Meeting Day', value: form.meeting_day  },
//     { icon: <IconClock c={t.ts} />,    label: 'Time',        value: form.meeting_time },
//     { icon: <IconPin c={t.ts} />,      label: 'Venue',       value: form.venue        },
//     { icon: <IconMail c={t.ts} />,     label: 'Email',       value: form.email        },
//   ];

//   return (
//     <>
//       <style>{`
//         @keyframes spin    { to { transform: rotate(360deg); } }
//         @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
//         input::placeholder { color: #9ca3af; }
//       `}</style>

//       <div style={{ minHeight: '100vh', background: t.pageBg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
//         <div style={{ maxWidth: 940, margin: '0 auto', padding: '36px 20px 60px' }}>

//           {/* Heading */}
//           <div style={{ marginBottom: 32 }}>
//             <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: t.tp, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>Settings</h1>
//             <p style={{ margin: '6px 0 0', fontSize: 14, color: t.ts }}>Manage your cell profile, reports and account</p>
//           </div>

//           {/* Toasts */}
//           {successMsg && (
//             <div style={{ marginBottom: 20, padding: '12px 18px', borderRadius: 12, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.28)', color: '#16a34a', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.2s ease' }}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 16, height: 16 }}><path d="M20 6 9 17l-5-5"/></svg>
//               {successMsg}
//             </div>
//           )}
//           {errorMsg && (
//             <div style={{ marginBottom: 20, padding: '12px 18px', borderRadius: 12, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
//               {errorMsg}
//               <button onClick={() => setErrorMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
//             </div>
//           )}

//           {/* Profile card */}
//           <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: '24px 26px', marginBottom: 18, boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//                 <div style={{ width: 62, height: 62, borderRadius: 14, overflow: 'hidden', border: `2.5px solid ${t.cyan}`, background: t.iconBg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   {form.image_url ? <img src={form.image_url} alt="Cell" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconPerson c={t.ts} />}
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 20, fontWeight: 800, color: t.tp, letterSpacing: '-0.3px' }}>{form.cell_name || 'Your Cell'}</div>
//                   <div style={{ fontSize: 13, color: t.ts, marginTop: 2 }}>Leader: {form.leader_name || '—'}</div>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setEditOpen(true)}
//                 style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 11, border: `1.5px solid ${t.border2}`, background: 'transparent', color: t.tp, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
//                 onMouseEnter={e => (e.currentTarget.style.background = t.hoverBg)}
//                 onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
//               >
//                 <IconEdit c={t.tp} /> Edit
//               </button>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
//               {infoCards.map(c => <InfoCard key={c.label} {...c} t={t} />)}
//             </div>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
//               <InfoCard icon={<IconPhone c={t.ts} />} label="Phone" value={form.phone} t={t} />
//               <div />
//             </div>
//           </div>

//           {/* Action cards */}
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

//             {/* Export Report */}
//             <button
//               onClick={() => setExportOpen(true)}
//               style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: '28px 26px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'border-color 0.15s, box-shadow 0.15s', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}
//               onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#16a34a'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
//               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'; }}
//             >
//               <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(22,163,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
//                 <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} style={{ width: 22, height: 22 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
//               </div>
//               <div style={{ fontSize: 17, fontWeight: 800, color: t.tp, marginBottom: 6 }}>Export Report</div>
//               <div style={{ fontSize: 13, color: t.ts, lineHeight: 1.5 }}>Download Excel or A4 PDF with selected data</div>
//             </button>

//             {/* Delete Account */}
//             <button
//               onClick={() => setDeleteOpen(true)}
//               disabled={deleting}
//               style={{ background: isDark ? 'rgba(127,29,29,0.18)' : 'rgba(254,242,242,1)', border: `1px solid ${isDark ? 'rgba(185,28,28,0.3)' : 'rgba(252,165,165,0.6)'}`, borderRadius: 20, padding: '28px 26px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', opacity: deleting ? 0.6 : 1, transition: 'border-color 0.15s, box-shadow 0.15s', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)' }}
//               onMouseEnter={e => { if (!deleting) { (e.currentTarget as HTMLElement).style.borderColor = '#dc2626'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(220,38,38,0.1)'; } }}
//               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isDark ? 'rgba(185,28,28,0.3)' : 'rgba(252,165,165,0.6)'; (e.currentTarget as HTMLElement).style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)'; }}
//             >
//               <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(220,38,38,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
//                 <IconTrash c="#dc2626" />
//               </div>
//               <div style={{ fontSize: 17, fontWeight: 800, color: '#dc2626', marginBottom: 6 }}>{deleting ? 'Deleting…' : 'Delete Account'}</div>
//               <div style={{ fontSize: 13, color: t.ts, lineHeight: 1.5 }}>Permanently delete all cell data and log out</div>
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* ── Modals ── */}
//       {editOpen && (
//         <EditModal
//           form={form} setForm={setForm} onSave={handleSave} onClose={() => setEditOpen(false)}
//           saving={saving} uploadingImg={uploadingImg}
//           onImageClick={() => fileInputRef.current?.click()}
//           fileInputRef={fileInputRef} onImageChange={handleImageUpload} t={t}
//         />
//       )}
//       {exportOpen && <ExportModal onClose={() => setExportOpen(false)} t={t} userId={profile?.user_id ?? ''} />}
//       {deleteOpen && (
//         <DeleteConfirmModal
//           onConfirm={handleDeleteAccount}
//           onClose={() => { if (!deleting) setDeleteOpen(false); }}
//           deleting={deleting}
//           t={t}
//         />
//       )}
//     </>
//   );
// }




























// 'use client';

// // app/dashboard/settings/page.tsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Multi-tenant · Light default · Dark via useTheme
// //
// // Required DB migration (run once in Supabase SQL editor):
// //   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS meeting_day  text DEFAULT '';
// //   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS meeting_time text DEFAULT '';
// //   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS venue        text DEFAULT '';
// // ─────────────────────────────────────────────────────────────────────────────

// import { useState, useEffect, useRef } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import { useRouter } from 'next/navigation';
// import { useTheme } from '@/app/components/ThemeProvider';

// // ── Types ─────────────────────────────────────────────────────────────────────
// type CellProfile = {
//   id: number;
//   user_id: string;
//   cell_name: string;
//   leader_name: string;
//   phone: string;
//   email: string;
//   address: string;
//   meeting_day: string;
//   meeting_time: string;
//   venue: string;
//   image_url: string | null;
// };

// const defaultProfile: Omit<CellProfile, 'id' | 'user_id'> = {
//   cell_name: '', leader_name: '', phone: '', email: '',
//   address: '', meeting_day: '', meeting_time: '', venue: '', image_url: null,
// };

// type ExportSection = 'cell' | 'members' | 'attendance' | 'celebrations' | 'programs';
// type ExportFormat  = 'xlsx' | 'pdf';

// const EXPORT_SECTIONS: { id: ExportSection; label: string; sub: string }[] = [
//   { id: 'cell',         label: 'Cell Information',  sub: 'Name, leader, venue, contact details' },
//   { id: 'members',      label: 'Members List',       sub: 'All member names & phone numbers'     },
//   { id: 'attendance',   label: 'Attendance Records', sub: 'All meetings with per-member status'  },
//   { id: 'celebrations', label: 'Celebrations',       sub: 'Birthdays & anniversaries'            },
//   { id: 'programs',     label: 'Programs',           sub: 'All scheduled programs & events'      },
// ];

// // ── Theme tokens ──────────────────────────────────────────────────────────────
// function useTokens(isDark: boolean) {
//   return {
//     pageBg:   isDark ? '#0d0f14' : '#f0f2f5',
//     cardBg:   isDark ? '#151720' : '#ffffff',
//     cardBg2:  isDark ? '#1a1d26' : '#f8f9fb',
//     border:   isDark ? '#22252f' : '#e8eaed',
//     border2:  isDark ? '#2a2e3a' : '#dde0e6',
//     tp:       isDark ? '#f1f2f5' : '#0f1117',
//     ts:       isDark ? '#9ca3af' : '#6b7280',
//     tss:      isDark ? '#4b5563' : '#9ca3af',
//     iconBg:   isDark ? '#1e2130' : '#eef0f4',
//     inputBg:  isDark ? '#1a1d26' : '#f4f5f8',
//     inputBd:  isDark ? '#2a2e3a' : '#dde0e6',
//     hoverBg:  isDark ? '#1e2130' : '#f0f2f6',
//     modalBg:  isDark ? '#13151d' : '#ffffff',
//     overlay:  isDark ? 'rgba(0,0,0,0.80)' : 'rgba(0,0,0,0.50)',
//     checkOn:  isDark ? '#6366f1' : '#4f46e5',
//     checkBg:  isDark ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.07)',
//     checkBd:  isDark ? 'rgba(99,102,241,0.4)'  : 'rgba(79,70,229,0.3)',
//     fmtOnBg:  isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
//     fmtOnBd:  isDark ? '#3b82f6' : '#2563eb',
//     fmtOnTxt: isDark ? '#60a5fa' : '#2563eb',
//     cyan:     '#06b6d4',
//   };
// }

// // ── SVG Icons ─────────────────────────────────────────────────────────────────
// const ic = (color: string) => ({ viewBox: '0 0 24 24', fill: 'none' as const, stroke: color, strokeWidth: 1.8, style: { width: 18, height: 18 } as React.CSSProperties });
// function IconPerson({ c }: { c: string })   { return <svg {...ic(c)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
// function IconCalendar({ c }: { c: string }) { return <svg {...ic(c)}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
// function IconClock({ c }: { c: string })    { return <svg {...ic(c)}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>; }
// function IconPin({ c }: { c: string })      { return <svg {...ic(c)}><path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
// function IconMail({ c }: { c: string })     { return <svg {...ic(c)}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>; }
// function IconPhone({ c }: { c: string })    { return <svg {...ic(c)}><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 5.18 2 2 0 0 1 5.09 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z"/></svg>; }
// function IconEdit({ c }: { c: string })     { return <svg {...ic(c)}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
// function IconDownload({ c }: { c: string }) { return <svg {...ic(c)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
// function IconTrash({ c }: { c: string })    { return <svg {...ic(c)}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
// function IconCheck({ c }: { c: string })    { return <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={3} style={{ width: 12, height: 12 }}><path d="M20 6 9 17l-5-5"/></svg>; }
// function IconCamera({ c }: { c: string })   { return <svg {...ic(c)}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }

// // ── Info card ─────────────────────────────────────────────────────────────────
// function InfoCard({ icon, label, value, t }: { icon: React.ReactNode; label: string; value: string; t: ReturnType<typeof useTokens> }) {
//   return (
//     <div style={{ background: t.cardBg2, border: `1px solid ${t.border}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
//       <div style={{ width: 38, height: 38, borderRadius: 10, background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
//       <div style={{ minWidth: 0 }}>
//         <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: t.ts, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
//         <div style={{ fontSize: 14, fontWeight: 700, color: t.tp, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || '—'}</div>
//       </div>
//     </div>
//   );
// }

// // ── Delete Confirmation Modal ─────────────────────────────────────────────────
// function DeleteConfirmModal({ onConfirm, onClose, deleting, t }: {
//   onConfirm: () => void; onClose: () => void; deleting: boolean; t: ReturnType<typeof useTokens>;
// }) {
//   const items = [
//     'All members & their data',
//     'All attendance records & meetings',
//     'All celebrations',
//     'All programs',
//     'Cell profile information',
//     'Your login email & account',
//   ];
//   return (
//     <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: t.overlay, backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn 0.15s ease' }}
//       onClick={() => { if (!deleting) onClose(); }}>
//       <div onClick={e => e.stopPropagation()} style={{ background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: 18, width: '100%', maxWidth: 500, padding: '32px 32px 28px', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', animation: 'slideUp 0.18s ease' }}>

//         {/* Title row — shield icon + heading */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
//           <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(220,38,38,0.12)', border: '1.5px solid rgba(220,38,38,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//             <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} style={{ width: 22, height: 22 }}>
//               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
//             </svg>
//           </div>
//           <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#dc2626', letterSpacing: '-0.3px' }}>Delete Account?</h2>
//         </div>

//         {/* Body */}
//         <p style={{ margin: '0 0 14px', fontSize: 14, color: t.tp, lineHeight: 1.65 }}>
//           This will <strong>permanently delete</strong> everything associated with your account:
//         </p>
//         <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
//           {items.map(item => (
//             <li key={item} style={{ fontSize: 13.5, color: t.ts, display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.4 }}>
//               <span style={{ color: t.tp, fontWeight: 700, fontSize: 16, lineHeight: '20px', flexShrink: 0 }}>•</span>
//               {item}
//             </li>
//           ))}
//         </ul>
//         <p style={{ margin: '0 0 28px', fontSize: 13.5, color: t.ts, lineHeight: 1.55 }}>
//           You will be{' '}
//           <span style={{ color: '#dc2626', fontWeight: 700 }}>logged out immediately</span>.
//           {' '}This cannot be undone.
//         </p>

//         {/* Buttons */}
//         <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
//           <button
//             onClick={onClose} disabled={deleting}
//             style={{ padding: '12px 28px', borderRadius: 11, border: `1.5px solid ${t.border2}`, background: 'transparent', color: t.tp, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: deleting ? 0.5 : 1, transition: 'background 0.15s' }}
//             onMouseEnter={e => (e.currentTarget.style.background = t.hoverBg)}
//             onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
//           >Cancel</button>
//           <button
//             onClick={onConfirm} disabled={deleting}
//             style={{ padding: '12px 28px', borderRadius: 11, border: 'none', background: '#dc2626', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: deleting ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}
//             onMouseEnter={e => { if (!deleting) (e.currentTarget as HTMLElement).style.background = '#b91c1c'; }}
//             onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#dc2626'}
//           >
//             {deleting ? (
//               <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Deleting…</>
//             ) : 'Yes, Continue'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Export Modal (fetches real data) ──────────────────────────────────────────
// function ExportModal({ onClose, t, userId }: { onClose: () => void; t: ReturnType<typeof useTokens>; userId: string }) {
//   const supabase = createClient();
//   const [selected, setSelected] = useState<Set<ExportSection>>(
//     new Set(['cell', 'members', 'attendance', 'celebrations', 'programs'])
//   );
//   const [format, setFormat]  = useState<ExportFormat>('pdf');
//   const [generating, setGen] = useState(false);
//   const [genError, setGenError] = useState<string | null>(null);

//   function toggle(id: ExportSection) {
//     setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
//   }

//   // ── Fetch all selected data from Supabase ──────────────────────────────────
//   async function fetchData() {
//     const out: Record<string, any[]> = {};

//     if (selected.has('cell')) {
//       const { data } = await supabase.from('cell_profile').select('*').eq('user_id', userId).single();
//       out.cell = data ? [data] : [];
//     }
//     if (selected.has('members')) {
//       const { data } = await supabase.from('members').select('*').eq('user_id', userId);
//       out.members = data ?? [];
//     }
//     if (selected.has('attendance')) {
//       const { data: meetings } = await supabase.from('meetings').select('*').eq('user_id', userId);
//       const { data: records }  = await supabase.from('attendance_records').select('*').eq('user_id', userId);
//       out.meetings    = meetings ?? [];
//       out.attendance  = records  ?? [];
//     }
//     if (selected.has('celebrations')) {
//       const { data } = await supabase.from('celebrations').select('*').eq('user_id', userId);
//       out.celebrations = data ?? [];
//     }
//     if (selected.has('programs')) {
//       const { data } = await supabase.from('programs').select('*').eq('user_id', userId);
//       out.programs = data ?? [];
//     }
//     return out;
//   }

//   // ── XLSX export using SheetJS (loaded from CDN) ────────────────────────────
//   async function exportXlsx(data: Record<string, any[]>) {
//     if (!(window as any).XLSX) {
//       await new Promise<void>((res, rej) => {
//         const s = document.createElement('script');
//         s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
//         s.onload = () => res();
//         s.onerror = () => rej(new Error('Failed to load SheetJS'));
//         document.head.appendChild(s);
//       });
//     }
//     const XLSX = (window as any).XLSX;
//     const wb = XLSX.utils.book_new();

//     const labelMap: Record<string, string> = {
//       cell: 'Cell Info', members: 'Members', meetings: 'Meetings',
//       attendance: 'Attendance', celebrations: 'Celebrations', programs: 'Programs',
//     };

//     for (const [key, rows] of Object.entries(data)) {
//       if (!rows.length) continue;
//       const clean = rows.map(r => {
//         const { id, user_id, ...rest } = r as any;
//         return rest;
//       });
//       const ws = XLSX.utils.json_to_sheet(clean);
//       const colWidths = Object.keys(clean[0]).map((k: string) => ({ wch: Math.max(k.length, 16) }));
//       ws['!cols'] = colWidths;
//       XLSX.utils.book_append_sheet(wb, ws, labelMap[key] ?? key);
//     }

//     XLSX.writeFile(wb, `oasis-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
//   }

//   // ── A4 PDF export via print-to-PDF ────────────────────────────────────────
//   function exportPdf(data: Record<string, any[]>) {
//     const cellInfo   = data.cell?.[0];
//     const members    = data.members      ?? [];
//     const meetings   = data.meetings     ?? [];
//     const attendance = data.attendance   ?? [];
//     const celebs     = data.celebrations ?? [];
//     const programs   = data.programs     ?? [];

//     const now    = new Date();
//     const dtStr  = now.toLocaleString('en-GB', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' });
//     const dayStr = now.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

//     const cellName   = cellInfo?.cell_name    || 'Oasis';
//     const leaderName = cellInfo?.leader_name  || '';
//     const leaderEmail= cellInfo?.email        || '';
//     const leaderPhone= cellInfo?.phone        || '';

//     const S = {
//       page:  'font-family:"Helvetica Neue",Arial,sans-serif;margin:0;padding:0;color:#111;font-size:12px;background:#fff;',
//       wrap:  'max-width:680px;margin:0 auto;padding:28px 32px 48px;',
//       hdr:   'display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:2.5px solid #111;margin-bottom:32px;',
//       hLeft: 'display:flex;flex-direction:column;',
//       hName: 'font-size:26px;font-weight:900;margin:0 0 2px;letter-spacing:-0.5px;',
//       hSub:  'font-size:11px;color:#6b7280;margin:0;',
//       hRight:'text-align:right;font-size:11px;line-height:1.7;color:#374151;',
//       hRL:   'font-weight:700;font-size:12px;color:#111;',
//       secHdr:'font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;margin:32px 0 10px;',
//       ciWrap:'border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:8px;',
//       ciRow: 'display:flex;border-bottom:1px solid #e5e7eb;',
//       ciKey: 'width:140px;padding:9px 14px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;background:#f8fafc;flex-shrink:0;',
//       ciVal: 'padding:9px 14px;font-size:13px;font-weight:600;color:#111;',
//       tbl:   'width:100%;border-collapse:collapse;font-size:12px;',
//       th:    'padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;border-bottom:1.5px solid #e5e7eb;background:#fff;',
//       td:    'padding:8px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top;',
//       tdAlt: 'padding:8px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top;background:#fafafa;',
//       badge: 'display:inline-block;background:#f3f4f6;border-radius:20px;padding:1px 8px;font-size:10px;font-weight:700;color:#6b7280;margin-left:8px;vertical-align:middle;',
//       present:'font-weight:700;color:#16a34a;',
//       absent: 'font-weight:700;color:#dc2626;',
//       mtgHdr:'font-weight:800;font-size:13px;color:#111;margin:20px 0 6px;display:flex;justify-content:space-between;align-items:baseline;',
//       mtgSub:'font-size:11px;color:#6b7280;font-weight:400;',
//       footer:'margin-top:48px;padding-top:14px;border-top:1.5px solid #e5e7eb;display:flex;justify-content:space-between;font-size:10px;color:#9ca3af;',
//     };

//     function ciRow(key: string, val: string) {
//       return `<div style="${S.ciRow}"><div style="${S.ciKey}">${key}</div><div style="${S.ciVal}">${val||'—'}</div></div>`;
//     }

//     function tblRow(cells: string[], alt: boolean) {
//       return `<tr>${cells.map(c => `<td style="${alt?S.tdAlt:S.td}">${c??'—'}</td>`).join('')}</tr>`;
//     }

//     function fmt(d: string|null|undefined) {
//       if (!d) return '—';
//       const parsed = new Date(d);
//       if (isNaN(parsed.getTime())) return d;
//       return parsed.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'long', year:'numeric' });
//     }

//     let body = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${cellName} — Report</title>
// <style>
//   *{box-sizing:border-box;}
//   body{${S.page}}
//   @media print{@page{size:A4;margin:14mm 14mm 18mm;} body{padding:0;} .no-print{display:none;}}
// </style></head><body>
// <div style="${S.wrap}">

//   <!-- HEADER -->
//   <div style="${S.hdr}">
//     <div style="${S.hLeft}">
//       <h1 style="${S.hName}">${cellName}</h1>
//       <p style="${S.hSub}">Report · Generated ${dayStr}</p>
//     </div>
//     <div style="${S.hRight}">
//       <div style="${S.hRL}">${leaderName}</div>
//       <div>Cell Leader</div>
//       ${leaderEmail ? `<div>${leaderEmail}</div>` : ''}
//       ${leaderPhone ? `<div>${leaderPhone}</div>` : ''}
//     </div>
//   </div>`;

//     if (cellInfo) {
//       body += `<div style="${S.secHdr}">Cell Information</div>
// <div style="${S.ciWrap}">
//   ${ciRow('Cell Name',    cellInfo.cell_name    || '—')}
//   ${ciRow('Cell Leader',  cellInfo.leader_name  || '—')}
//   ${ciRow('Meeting Day(s)', cellInfo.meeting_day || '—')}
//   ${ciRow('Time',         cellInfo.meeting_time || '—')}
//   ${ciRow('Venue',        cellInfo.venue        || '—')}
//   ${ciRow('Email',        cellInfo.email        || '—')}
//   <div style="${S.ciRow.replace('border-bottom:1px solid #e5e7eb;','')}">
//     <div style="${S.ciKey}">Phone</div><div style="${S.ciVal}">${cellInfo.phone||'—'}</div>
//   </div>
// </div>`;
//     }

//     if (selected.has('members')) {
//       body += `<div style="${S.secHdr}">Members <span style="${S.badge}">${members.length}</span></div>`;
//       if (!members.length) {
//         body += `<p style="color:#9ca3af;font-size:12px;">No members found.</p>`;
//       } else {
//         body += `<table style="${S.tbl}"><thead><tr>
//           <th style="${S.th};width:32px">#</th>
//           <th style="${S.th}">Name</th>
//           <th style="${S.th}">Phone</th>
//           <th style="${S.th}">Gender</th>
//           <th style="${S.th}">Join Date</th>
//           <th style="${S.th}">Birthday</th>
//         </tr></thead><tbody>
//           ${members.map((m: any, i: number) => tblRow([
//             String(i+1), m.name||'—', m.phone||'—', m.gender||'—', fmt(m.date_joined||m.created_at), fmt(m.date_of_birth||m.birthday)
//           ], i%2===1)).join('')}
//         </tbody></table>`;
//       }
//     }

//     if (selected.has('attendance')) {
//       body += `<div style="${S.secHdr}">Attendance Records</div>`;
//       if (!meetings.length) {
//         body += `<p style="color:#9ca3af;font-size:12px;">No meetings found.</p>`;
//       } else {
//         meetings.forEach((mtg: any) => {
//           const recs = attendance.filter((a: any) => a.meeting_id === mtg.id);
//           const presentCount = recs.filter((a: any) => (a.status||'').toLowerCase() === 'present').length;
//           body += `<div style="${S.mtgHdr}">
//             ${mtg.title||'Meeting'} · <span style="${S.mtgSub}">${fmt(mtg.date)}</span>
//             <span style="font-size:11px;color:#6b7280;font-weight:500;">${presentCount}/${recs.length} present</span>
//           </div>`;
//           if (!recs.length) {
//             body += `<p style="color:#9ca3af;font-size:11px;margin:0 0 12px;">No attendance recorded.</p>`;
//           } else {
//             body += `<table style="${S.tbl};margin-bottom:16px;"><thead><tr>
//               <th style="${S.th};width:32px">#</th>
//               <th style="${S.th}">Member</th>
//               <th style="${S.th}">Status</th>
//             </tr></thead><tbody>
//               ${recs.map((a: any, i: number) => {
//                 const isPresent = (a.status||'').toLowerCase() === 'present';
//                 const statusCell = isPresent
//                   ? `<span style="${S.present}">✓ Present</span>`
//                   : `<span style="${S.absent}">✗ Absent</span>`;
//                 return `<tr><td style="${i%2===1?S.tdAlt:S.td}">${i+1}</td><td style="${i%2===1?S.tdAlt:S.td}">${a.member_name||a.member_id||'—'}</td><td style="${i%2===1?S.tdAlt:S.td}">${statusCell}</td></tr>`;
//               }).join('')}
//             </tbody></table>`;
//           }
//         });
//       }
//     }

//     if (selected.has('celebrations')) {
//       body += `<div style="${S.secHdr}">Celebrations <span style="${S.badge}">${celebs.length}</span></div>`;
//       if (!celebs.length) {
//         body += `<p style="color:#9ca3af;font-size:12px;">No celebrations found.</p>`;
//       } else {
//         body += `<table style="${S.tbl}"><thead><tr>
//           <th style="${S.th};width:32px">#</th>
//           <th style="${S.th}">Name</th>
//           <th style="${S.th}">Event</th>
//           <th style="${S.th}">Month</th>
//           <th style="${S.th}">Day</th>
//         </tr></thead><tbody>
//           ${celebs.map((c: any, i: number) => {
//             let month = c.month || '', day = c.day || '';
//             if (!month && c.date) {
//               const d = new Date(c.date);
//               month = d.toLocaleString('en-US', { month: 'long' });
//               day   = String(d.getDate()).padStart(2,'0');
//             }
//             return tblRow([String(i+1), c.name||'—', c.event||'—', month||'—', day||'—'], i%2===1);
//           }).join('')}
//         </tbody></table>`;
//       }
//     }

//     if (selected.has('programs')) {
//       body += `<div style="${S.secHdr}">Programs <span style="${S.badge}">${programs.length}</span></div>`;
//       if (!programs.length) {
//         body += `<p style="color:#9ca3af;font-size:12px;">No programs found.</p>`;
//       } else {
//         body += `<table style="${S.tbl}"><thead><tr>
//           <th style="${S.th};width:32px">#</th>
//           <th style="${S.th}">Title</th>
//           <th style="${S.th}">Date</th>
//           <th style="${S.th}">Time</th>
//           <th style="${S.th}">Venue</th>
//         </tr></thead><tbody>
//           ${programs.map((p: any, i: number) => tblRow([String(i+1), p.title||'—', fmt(p.date), p.time||p.meeting_time||'—', p.venue||'—'], i%2===1)).join('')}
//         </tbody></table>`;
//       }
//     }

//     body += `<div style="${S.footer}"><span>${cellName}</span><span>${dtStr}</span></div>`;
//     body += `</div></body></html>`;

//     const win = window.open('', '_blank');
//     if (!win) { alert('Please allow popups for this page to generate the PDF.'); return; }
//     win.document.write(body);
//     win.document.close();
//     win.focus();
//     setTimeout(() => { win.print(); }, 500);
//   }

//   async function handleGenerate() {
//     setGen(true);
//     setGenError(null);
//     try {
//       const data = await fetchData();
//       if (format === 'xlsx') {
//         await exportXlsx(data);
//       } else {
//         exportPdf(data);
//       }
//       onClose();
//     } catch (err: any) {
//       setGenError(err.message ?? 'Export failed. Please try again.');
//     } finally {
//       setGen(false);
//     }
//   }

//   const modalBody: React.CSSProperties = { overflowY: 'auto', flex: 1, padding: '18px 26px' };

//   return (
//     <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: t.overlay, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
//       <div onClick={e => e.stopPropagation()} style={{ background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: 18, width: '100%', maxWidth: 540, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', animation: 'slideUp 0.18s ease' }}>

//         <div style={{ padding: '22px 26px 18px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//           <div>
//             <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: t.tp }}>Export Report</h2>
//             <p style={{ margin: '4px 0 0', fontSize: 13, color: t.ts }}>Choose what to include, then pick a format.</p>
//           </div>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: t.ts, cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 2 }}>×</button>
//         </div>

//         <div style={modalBody}>
//           {genError && (
//             <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', fontSize: 13 }}>
//               {genError}
//             </div>
//           )}

//           <p style={{ margin: '0 0 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: t.ts, textTransform: 'uppercase' }}>Include Sections</p>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//             {EXPORT_SECTIONS.map(s => {
//               const on = selected.has(s.id);
//               return (
//                 <button key={s.id} onClick={() => toggle(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left', background: on ? t.checkBg : t.cardBg2, border: `1.5px solid ${on ? t.checkBd : t.border}`, transition: 'all 0.12s', fontFamily: 'inherit' }}>
//                   <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: `2px solid ${on ? t.checkOn : t.border2}`, background: on ? t.checkOn : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     {on && <IconCheck c="#fff" />}
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 14, fontWeight: 600, color: t.tp }}>{s.label}</div>
//                     <div style={{ fontSize: 12, color: t.ts, marginTop: 1 }}>{s.sub}</div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           <p style={{ margin: '20px 0 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: t.ts, textTransform: 'uppercase' }}>Format</p>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
//             {(['xlsx', 'pdf'] as ExportFormat[]).map(f => {
//               const on = format === f;
//               return (
//                 <button key={f} onClick={() => setFormat(f)} style={{ padding: '18px 14px', borderRadius: 12, cursor: 'pointer', background: on ? t.fmtOnBg : t.cardBg2, border: `1.5px solid ${on ? t.fmtOnBd : t.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.12s', fontFamily: 'inherit' }}>
//                   {f === 'xlsx'
//                     ? <svg viewBox="0 0 24 24" fill="none" stroke={on ? t.fmtOnTxt : t.ts} strokeWidth={1.5} style={{ width: 26, height: 26 }}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
//                     : <svg viewBox="0 0 24 24" fill="none" stroke={on ? t.fmtOnTxt : t.ts} strokeWidth={1.5} style={{ width: 26, height: 26 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
//                   }
//                   <div style={{ fontSize: 13, fontWeight: 600, color: on ? t.fmtOnTxt : t.ts }}>{f === 'xlsx' ? 'Excel (.xlsx)' : 'A4 Print / PDF'}</div>
//                   <div style={{ fontSize: 11, color: t.tss }}>{f === 'xlsx' ? 'Multi-sheet spreadsheet' : 'Opens print dialog'}</div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div style={{ padding: '14px 26px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//           <button onClick={onClose} style={{ padding: '10px 22px', borderRadius: 10, border: `1px solid ${t.border2}`, background: 'transparent', color: t.ts, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
//           <button onClick={handleGenerate} disabled={generating || selected.size === 0} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: '#16a34a', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, opacity: (generating || selected.size === 0) ? 0.65 : 1, fontFamily: 'inherit' }}>
//             {generating
//               ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Generating…</>
//               : <><IconDownload c="#fff" />Generate Report</>
//             }
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Edit Modal ────────────────────────────────────────────────────────────────
// function EditModal({ form, setForm, onSave, onClose, saving, uploadingImg, onImageClick, fileInputRef, onImageChange, t }: {
//   form: Omit<CellProfile, 'id' | 'user_id'>;
//   setForm: React.Dispatch<React.SetStateAction<Omit<CellProfile, 'id' | 'user_id'>>>;
//   onSave: (e: React.FormEvent) => void;
//   onClose: () => void;
//   saving: boolean; uploadingImg: boolean;
//   onImageClick: () => void;
//   // FIX: Accept null in RefObject to match React 19 useRef(null) return type
//   fileInputRef: React.RefObject<HTMLInputElement | null>;
//   onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   t: ReturnType<typeof useTokens>;
// }) {
//   const fields: { label: string; key: keyof typeof defaultProfile; full?: boolean; placeholder: string }[] = [
//     { label: 'Cell Name',      key: 'cell_name',    placeholder: 'e.g. Oasis Cell'           },
//     { label: 'Cell Leader',    key: 'leader_name',  placeholder: 'e.g. John Doe'             },
//     { label: 'Meeting Day(s)', key: 'meeting_day',  placeholder: 'e.g. Tuesdays & Fridays',  full: true },
//     { label: 'Time',           key: 'meeting_time', placeholder: 'e.g. 9AM'                  },
//     { label: 'Venue',          key: 'venue',        placeholder: 'e.g. Onsite / Zoom'        },
//     { label: 'Email',          key: 'email',        placeholder: 'e.g. cell@example.com'     },
//     { label: 'Phone No',       key: 'phone',        placeholder: 'e.g. 08012345678'          },
//   ];

//   const inputStyle: React.CSSProperties = {
//     width: '100%', padding: '11px 13px', borderRadius: 10, boxSizing: 'border-box',
//     border: `1.5px solid ${t.inputBd}`, background: t.inputBg,
//     color: t.tp, fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
//   };

//   return (
//     <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: t.overlay, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
//       <div onClick={e => e.stopPropagation()} style={{ background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: 18, width: '100%', maxWidth: 620, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', animation: 'slideUp 0.18s ease' }}>
//         <div style={{ padding: '22px 26px 18px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: t.tp }}>Edit Profile</h2>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: t.ts, cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 2 }}>×</button>
//         </div>

//         <form onSubmit={onSave} style={{ overflowY: 'auto', flex: 1, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 20 }}>
//           {/* Avatar */}
//           <div style={{ display: 'flex', justifyContent: 'center' }}>
//             <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onImageClick}>
//               <div style={{ width: 86, height: 86, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${t.cyan}`, background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 {form.image_url ? <img src={form.image_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconPerson c={t.ts} />}
//               </div>
//               <div style={{ position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: '50%', background: t.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${t.modalBg}` }}>
//                 {uploadingImg
//                   ? <div style={{ width: 10, height: 10, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
//                   : <IconCamera c="#fff" />}
//               </div>
//             </div>
//             <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onImageChange} />
//           </div>

//           {/* Fields */}
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
//             {fields.map(({ label, key, full, placeholder }) =>
//               key !== 'image_url' && (
//                 <div key={key} style={{ gridColumn: full ? '1 / -1' : undefined }}>
//                   <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', color: t.ts, textTransform: 'uppercase', marginBottom: 5 }}>{label}</label>
//                   <input
//                     type="text"
//                     value={(form[key] as string) || ''}
//                     placeholder={placeholder}
//                     onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
//                     style={inputStyle}
//                     onFocus={e => (e.target.style.borderColor = t.cyan)}
//                     onBlur={e => (e.target.style.borderColor = t.inputBd)}
//                   />
//                 </div>
//               )
//             )}
//           </div>

//           <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4, borderTop: `1px solid ${t.border}`, marginTop: 4 }}>
//             <button type="button" onClick={onClose} style={{ padding: '11px 26px', borderRadius: 10, border: `1px solid ${t.border2}`, background: 'transparent', color: t.ts, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
//             <button type="submit" disabled={saving} style={{ padding: '11px 26px', borderRadius: 10, border: 'none', background: t.tp, color: t.cardBg, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1, fontFamily: 'inherit' }}>
//               {saving ? 'Saving…' : 'Save Changes'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function SettingsPage() {
//   const { isDark } = useTheme();
//   const t          = useTokens(isDark);
//   const supabase   = createClient();
//   const router     = useRouter();

//   const [profile,      setProfile]      = useState<CellProfile | null>(null);
//   const [form,         setForm]         = useState(defaultProfile);
//   const [loading,      setLoading]      = useState(true);
//   const [saving,       setSaving]       = useState(false);
//   const [deleting,     setDeleting]     = useState(false);
//   const [uploadingImg, setUploadingImg] = useState(false);
//   const [successMsg,   setSuccessMsg]   = useState<string | null>(null);
//   const [errorMsg,     setErrorMsg]     = useState<string | null>(null);
//   const [editOpen,     setEditOpen]     = useState(false);
//   const [exportOpen,   setExportOpen]   = useState(false);
//   const [deleteOpen,   setDeleteOpen]   = useState(false);

//   // FIX: useRef<HTMLInputElement>(null) in React 19 returns RefObject<HTMLInputElement | null>
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const channelRef   = useRef<ReturnType<typeof supabase.channel> | null>(null);

//   // ── Load profile ───────────────────────────────────────────────────────────
//   useEffect(() => {
//     let mounted = true;

//     async function loadProfile() {
//       setLoading(true);
//       const { data: { user }, error: userErr } = await supabase.auth.getUser();
//       if (userErr || !user) { router.push('/login'); return; }

//       let { data, error } = await supabase.from('cell_profile').select('*').eq('user_id', user.id).single();

//       if (error && error.code === 'PGRST116') {
//         // FIX: cast to any because generated types may not include new columns yet
//         const { data: ins, error: insErr } = await supabase
//           .from('cell_profile')
//           .upsert({ user_id: user.id, ...defaultProfile } as any, { onConflict: 'user_id' })
//           .select()
//           .single();
//         if (insErr) { setErrorMsg('Could not load settings.'); setLoading(false); return; }
//         data = ins;
//       } else if (error) {
//         setErrorMsg('Could not load settings.'); setLoading(false); return;
//       }

//       if (!mounted) return;
//       setProfile(data);
//       syncForm(data);
//       setLoading(false);

//       if (channelRef.current) supabase.removeChannel(channelRef.current);
//       channelRef.current = supabase
//         .channel('settings-profile')
//         .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cell_profile', filter: `user_id=eq.${user.id}` },
//           payload => { if (!mounted) return; const u = payload.new as CellProfile; setProfile(u); syncForm(u); })
//         .subscribe();
//     }

//     loadProfile();
//     return () => { mounted = false; if (channelRef.current) supabase.removeChannel(channelRef.current); };
//   }, []);

//   function syncForm(d: any) {
//     setForm({
//       cell_name: d.cell_name || '', leader_name: d.leader_name || '',
//       phone: d.phone || '', email: d.email || '', address: d.address || '',
//       meeting_day: d.meeting_day || '', meeting_time: d.meeting_time || '',
//       venue: d.venue || '', image_url: d.image_url || null,
//     });
//   }

//   // ── Save ──────────────────────────────────────────────────────────────────
//   async function handleSave(e: React.FormEvent) {
//     e.preventDefault();
//     if (!profile) return;
//     setSaving(true); setSuccessMsg(null); setErrorMsg(null);

//     const extPayload = {
//       cell_name: form.cell_name,
//       leader_name: form.leader_name,
//       phone: form.phone,
//       email: form.email,
//       address: form.address,
//       meeting_day: form.meeting_day,
//       meeting_time: form.meeting_time,
//       venue: form.venue,
//     };

//     const basePayload = {
//       cell_name: form.cell_name,
//       leader_name: form.leader_name,
//       phone: form.phone,
//       email: form.email,
//       address: form.address,
//     };

//     // FIX: cast to any because generated types may not include new columns yet
//     let { error } = await supabase.from('cell_profile').update(extPayload as any).eq('user_id', profile.user_id);
//     if (error && error.message.includes('column')) {
//       // Fallback: save only base columns if new columns don't exist in DB yet
//       const fb = await supabase.from('cell_profile').update(basePayload as any).eq('user_id', profile.user_id);
//       error = fb.error;
//     }

//     setSaving(false);
//     if (error) { setErrorMsg('Save failed: ' + error.message); }
//     else { setSuccessMsg('Profile saved!'); setEditOpen(false); setTimeout(() => setSuccessMsg(null), 3000); }
//   }

//   // ── Image upload ──────────────────────────────────────────────────────────
//   async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file || !profile) return;
//     setUploadingImg(true); setErrorMsg(null);

//     const ext = file.name.split('.').pop();
//     const filePath = `${profile.user_id}/cell-logo.${ext}`;
//     await supabase.storage.from('cell-images').remove([filePath]);

//     const { error: upErr } = await supabase.storage.from('cell-images').upload(filePath, file, { upsert: true });
//     if (upErr) { setErrorMsg('Upload failed: ' + upErr.message); setUploadingImg(false); return; }

//     const { data: urlData } = supabase.storage.from('cell-images').getPublicUrl(filePath);
//     const publicUrl = urlData.publicUrl + `?v=${Date.now()}`;

//     // FIX: cast to any because generated types may not include image_url yet
//     const { error: updErr } = await supabase.from('cell_profile').update({ image_url: publicUrl } as any).eq('user_id', profile.user_id);
//     if (updErr) { setErrorMsg('Could not save image URL.'); }
//     else { setForm(prev => ({ ...prev, image_url: publicUrl })); setSuccessMsg('Photo updated!'); setTimeout(() => setSuccessMsg(null), 3000); }
//     setUploadingImg(false);
//   }

//   // ── Delete Account ────────────────────────────────────────────────────────
//   async function handleDeleteAccount() {
//     if (!profile?.user_id) {
//       setErrorMsg('No active profile found. Please refresh.');
//       return;
//     }
//     setDeleting(true);
//     setErrorMsg(null);

//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) throw new Error('No active session. Please log in again.');

//       const tables = ['attendance_records', 'celebrations', 'programs', 'meetings', 'members', 'cell_profile'] as const;
//       for (const table of tables) {
//         const { error } = await supabase.from(table).delete().eq('user_id', profile.user_id);
//         if (error) console.warn(`Could not delete ${table}:`, error.message);
//       }

//       const controller = new AbortController();
//       const timeout = setTimeout(() => controller.abort(), 10000);

//       const res = await fetch('/api/delete-account', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${session.access_token}`,
//         },
//         signal: controller.signal,
//       });
//       clearTimeout(timeout);

//       if (!res.ok) {
//         const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
//         throw new Error(body.error ?? `Server error ${res.status}`);
//       }

//       await supabase.auth.signOut();
//       window.location.replace('/');

//     } catch (err: any) {
//       console.error('Delete account error:', err);
//       setDeleting(false);
//       setDeleteOpen(false);

//       if (err.name === 'AbortError') {
//         setErrorMsg('Request timed out. Please try again.');
//       } else {
//         setErrorMsg('Delete failed: ' + (err.message ?? 'Unknown error'));
//       }
//     }
//   }

//   // ── Render ────────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
//         <div style={{ width: 36, height: 36, border: `3px solid ${t.border}`, borderTopColor: t.cyan, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     );
//   }

//   const infoCards = [
//     { icon: <IconPerson c={t.ts} />,   label: 'Cell Name',   value: form.cell_name    },
//     { icon: <IconPerson c={t.ts} />,   label: 'Cell Leader', value: form.leader_name  },
//     { icon: <IconCalendar c={t.ts} />, label: 'Meeting Day', value: form.meeting_day  },
//     { icon: <IconClock c={t.ts} />,    label: 'Time',        value: form.meeting_time },
//     { icon: <IconPin c={t.ts} />,      label: 'Venue',       value: form.venue        },
//     { icon: <IconMail c={t.ts} />,     label: 'Email',       value: form.email        },
//   ];

//   return (
//     <>
//       <style>{`
//         @keyframes spin    { to { transform: rotate(360deg); } }
//         @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
//         input::placeholder { color: #9ca3af; }
//       `}</style>

//       <div style={{ minHeight: '100vh', background: t.pageBg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
//         <div style={{ maxWidth: 940, margin: '0 auto', padding: '36px 20px 60px' }}>

//           {/* Heading */}
//           <div style={{ marginBottom: 32 }}>
//             <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: t.tp, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>Settings</h1>
//             <p style={{ margin: '6px 0 0', fontSize: 14, color: t.ts }}>Manage your cell profile, reports and account</p>
//           </div>

//           {/* Toasts */}
//           {successMsg && (
//             <div style={{ marginBottom: 20, padding: '12px 18px', borderRadius: 12, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.28)', color: '#16a34a', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.2s ease' }}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 16, height: 16 }}><path d="M20 6 9 17l-5-5"/></svg>
//               {successMsg}
//             </div>
//           )}
//           {errorMsg && (
//             <div style={{ marginBottom: 20, padding: '12px 18px', borderRadius: 12, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
//               {errorMsg}
//               <button onClick={() => setErrorMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
//             </div>
//           )}

//           {/* Profile card */}
//           <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: '24px 26px', marginBottom: 18, boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//                 <div style={{ width: 62, height: 62, borderRadius: 14, overflow: 'hidden', border: `2.5px solid ${t.cyan}`, background: t.iconBg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   {form.image_url ? <img src={form.image_url} alt="Cell" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconPerson c={t.ts} />}
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 20, fontWeight: 800, color: t.tp, letterSpacing: '-0.3px' }}>{form.cell_name || 'Your Cell'}</div>
//                   <div style={{ fontSize: 13, color: t.ts, marginTop: 2 }}>Leader: {form.leader_name || '—'}</div>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setEditOpen(true)}
//                 style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 11, border: `1.5px solid ${t.border2}`, background: 'transparent', color: t.tp, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
//                 onMouseEnter={e => (e.currentTarget.style.background = t.hoverBg)}
//                 onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
//               >
//                 <IconEdit c={t.tp} /> Edit
//               </button>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
//               {infoCards.map(c => <InfoCard key={c.label} {...c} t={t} />)}
//             </div>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
//               <InfoCard icon={<IconPhone c={t.ts} />} label="Phone" value={form.phone} t={t} />
//               <div />
//             </div>
//           </div>

//           {/* Action cards */}
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

//             {/* Export Report */}
//             <button
//               onClick={() => setExportOpen(true)}
//               style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: '28px 26px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'border-color 0.15s, box-shadow 0.15s', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}
//               onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#16a34a'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
//               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'; }}
//             >
//               <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(22,163,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
//                 <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} style={{ width: 22, height: 22 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
//               </div>
//               <div style={{ fontSize: 17, fontWeight: 800, color: t.tp, marginBottom: 6 }}>Export Report</div>
//               <div style={{ fontSize: 13, color: t.ts, lineHeight: 1.5 }}>Download Excel or A4 PDF with selected data</div>
//             </button>

//             {/* Delete Account */}
//             <button
//               onClick={() => setDeleteOpen(true)}
//               disabled={deleting}
//               style={{ background: isDark ? 'rgba(127,29,29,0.18)' : 'rgba(254,242,242,1)', border: `1px solid ${isDark ? 'rgba(185,28,28,0.3)' : 'rgba(252,165,165,0.6)'}`, borderRadius: 20, padding: '28px 26px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', opacity: deleting ? 0.6 : 1, transition: 'border-color 0.15s, box-shadow 0.15s', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)' }}
//               onMouseEnter={e => { if (!deleting) { (e.currentTarget as HTMLElement).style.borderColor = '#dc2626'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(220,38,38,0.1)'; } }}
//               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isDark ? 'rgba(185,28,28,0.3)' : 'rgba(252,165,165,0.6)'; (e.currentTarget as HTMLElement).style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)'; }}
//             >
//               <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(220,38,38,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
//                 <IconTrash c="#dc2626" />
//               </div>
//               <div style={{ fontSize: 17, fontWeight: 800, color: '#dc2626', marginBottom: 6 }}>{deleting ? 'Deleting…' : 'Delete Account'}</div>
//               <div style={{ fontSize: 13, color: t.ts, lineHeight: 1.5 }}>Permanently delete all cell data and log out</div>
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* ── Modals ── */}
//       {editOpen && (
//         <EditModal
//           form={form} setForm={setForm} onSave={handleSave} onClose={() => setEditOpen(false)}
//           saving={saving} uploadingImg={uploadingImg}
//           onImageClick={() => fileInputRef.current?.click()}
//           fileInputRef={fileInputRef} onImageChange={handleImageUpload} t={t}
//         />
//       )}
//       {exportOpen && <ExportModal onClose={() => setExportOpen(false)} t={t} userId={profile?.user_id ?? ''} />}
//       {deleteOpen && (
//         <DeleteConfirmModal
//           onConfirm={handleDeleteAccount}
//           onClose={() => { if (!deleting) setDeleteOpen(false); }}
//           deleting={deleting}
//           t={t}
//         />
//       )}
//     </>
//   );
// }
















// 'use client';

// // app/dashboard/settings/page.tsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Multi-tenant · Light default · Dark via useTheme · Mobile responsive
// //
// // Required DB migration (run once in Supabase SQL editor):
// //   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS meeting_day  text DEFAULT '';
// //   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS meeting_time text DEFAULT '';
// //   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS venue        text DEFAULT '';
// // ─────────────────────────────────────────────────────────────────────────────

// import { useState, useEffect, useRef } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import { useRouter } from 'next/navigation';
// import { useTheme } from '@/app/components/ThemeProvider';

// // ── Responsive hook ───────────────────────────────────────────────────────────
// function useIsMobile(breakpoint = 640) {
//   const [isMobile, setIsMobile] = useState(false);
//   useEffect(() => {
//     const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
//     setIsMobile(mq.matches);
//     const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
//     mq.addEventListener('change', handler);
//     return () => mq.removeEventListener('change', handler);
//   }, [breakpoint]);
//   return isMobile;
// }

// // ── Types ─────────────────────────────────────────────────────────────────────
// type CellProfile = {
//   id: number;
//   user_id: string;
//   cell_name: string;
//   leader_name: string;
//   phone: string;
//   email: string;
//   address: string;
//   meeting_day: string;
//   meeting_time: string;
//   venue: string;
//   image_url: string | null;
// };

// const defaultProfile: Omit<CellProfile, 'id' | 'user_id'> = {
//   cell_name: '', leader_name: '', phone: '', email: '',
//   address: '', meeting_day: '', meeting_time: '', venue: '', image_url: null,
// };

// type ExportSection = 'cell' | 'members' | 'attendance' | 'celebrations' | 'programs';
// type ExportFormat  = 'xlsx' | 'pdf';

// const EXPORT_SECTIONS: { id: ExportSection; label: string; sub: string }[] = [
//   { id: 'cell',         label: 'Cell Information',  sub: 'Name, leader, venue, contact details' },
//   { id: 'members',      label: 'Members List',       sub: 'All member names & phone numbers'     },
//   { id: 'attendance',   label: 'Attendance Records', sub: 'All meetings with per-member status'  },
//   { id: 'celebrations', label: 'Celebrations',       sub: 'Birthdays & anniversaries'            },
//   { id: 'programs',     label: 'Programs',           sub: 'All scheduled programs & events'      },
// ];

// // ── Theme tokens ──────────────────────────────────────────────────────────────
// function useTokens(isDark: boolean) {
//   return {
//     pageBg:   isDark ? '#0d0f14' : '#f0f2f5',
//     cardBg:   isDark ? '#151720' : '#ffffff',
//     cardBg2:  isDark ? '#1a1d26' : '#f8f9fb',
//     border:   isDark ? '#22252f' : '#e8eaed',
//     border2:  isDark ? '#2a2e3a' : '#dde0e6',
//     tp:       isDark ? '#f1f2f5' : '#0f1117',
//     ts:       isDark ? '#9ca3af' : '#6b7280',
//     tss:      isDark ? '#4b5563' : '#9ca3af',
//     iconBg:   isDark ? '#1e2130' : '#eef0f4',
//     inputBg:  isDark ? '#1a1d26' : '#f4f5f8',
//     inputBd:  isDark ? '#2a2e3a' : '#dde0e6',
//     hoverBg:  isDark ? '#1e2130' : '#f0f2f6',
//     modalBg:  isDark ? '#13151d' : '#ffffff',
//     overlay:  isDark ? 'rgba(0,0,0,0.80)' : 'rgba(0,0,0,0.50)',
//     checkOn:  isDark ? '#6366f1' : '#4f46e5',
//     checkBg:  isDark ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.07)',
//     checkBd:  isDark ? 'rgba(99,102,241,0.4)'  : 'rgba(79,70,229,0.3)',
//     fmtOnBg:  isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
//     fmtOnBd:  isDark ? '#3b82f6' : '#2563eb',
//     fmtOnTxt: isDark ? '#60a5fa' : '#2563eb',
//     cyan:     '#06b6d4',
//   };
// }

// // ── SVG Icons ─────────────────────────────────────────────────────────────────
// const ic = (color: string) => ({ viewBox: '0 0 24 24', fill: 'none' as const, stroke: color, strokeWidth: 1.8, style: { width: 18, height: 18 } as React.CSSProperties });
// function IconPerson({ c }: { c: string })   { return <svg {...ic(c)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
// function IconCalendar({ c }: { c: string }) { return <svg {...ic(c)}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
// function IconClock({ c }: { c: string })    { return <svg {...ic(c)}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>; }
// function IconPin({ c }: { c: string })      { return <svg {...ic(c)}><path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
// function IconMail({ c }: { c: string })     { return <svg {...ic(c)}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>; }
// function IconPhone({ c }: { c: string })    { return <svg {...ic(c)}><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 5.18 2 2 0 0 1 5.09 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z"/></svg>; }
// function IconEdit({ c }: { c: string })     { return <svg {...ic(c)}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
// function IconDownload({ c }: { c: string }) { return <svg {...ic(c)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
// function IconTrash({ c }: { c: string })    { return <svg {...ic(c)}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
// function IconCheck({ c }: { c: string })    { return <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={3} style={{ width: 12, height: 12 }}><path d="M20 6 9 17l-5-5"/></svg>; }
// function IconCamera({ c }: { c: string })   { return <svg {...ic(c)}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }

// // ── Info card ─────────────────────────────────────────────────────────────────
// function InfoCard({ icon, label, value, t }: { icon: React.ReactNode; label: string; value: string; t: ReturnType<typeof useTokens> }) {
//   return (
//     <div style={{ background: t.cardBg2, border: `1px solid ${t.border}`, borderRadius: 14, padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 11 }}>
//       <div style={{ width: 34, height: 34, borderRadius: 9, background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
//       <div style={{ minWidth: 0 }}>
//         <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: t.ts, textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
//         <div style={{ fontSize: 13, fontWeight: 700, color: t.tp, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || '—'}</div>
//       </div>
//     </div>
//   );
// }

// // ── Delete Confirmation Modal ─────────────────────────────────────────────────
// function DeleteConfirmModal({ onConfirm, onClose, deleting, t, isMobile }: {
//   onConfirm: () => void; onClose: () => void; deleting: boolean;
//   t: ReturnType<typeof useTokens>; isMobile: boolean;
// }) {
//   const items = [
//     'All members & their data',
//     'All attendance records & meetings',
//     'All celebrations',
//     'All programs',
//     'Cell profile information',
//     'Your login email & account',
//   ];

//   const innerStyle: React.CSSProperties = isMobile
//     ? { position: 'fixed', inset: 0, background: t.modalBg, display: 'flex', flexDirection: 'column', padding: '0 0 28px', overflowY: 'auto', animation: 'slideUp 0.18s ease' }
//     : { background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: 18, width: '100%', maxWidth: 500, padding: '32px 32px 28px', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', animation: 'slideUp 0.18s ease' };

//   return (
//     <div
//       style={{ position: 'fixed', inset: 0, zIndex: 2000, background: isMobile ? 'transparent' : t.overlay, backdropFilter: isMobile ? 'none' : 'blur(6px)', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'center', padding: isMobile ? 0 : 20, animation: 'fadeIn 0.15s ease' }}
//       onClick={() => { if (!deleting) onClose(); }}
//     >
//       <div onClick={e => e.stopPropagation()} style={innerStyle}>

//         {/* Mobile top bar */}
//         {isMobile && (
//           <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px 0' }}>
//             <button onClick={() => { if (!deleting) onClose(); }} style={{ background: 'none', border: 'none', color: t.ts, cursor: 'pointer', fontSize: 26, lineHeight: 1, padding: 4 }}>×</button>
//           </div>
//         )}

//         <div style={{ padding: isMobile ? '16px 20px 0' : 0, flex: 1 }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
//             <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(220,38,38,0.12)', border: '1.5px solid rgba(220,38,38,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} style={{ width: 22, height: 22 }}>
//                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
//               </svg>
//             </div>
//             <h2 style={{ margin: 0, fontSize: isMobile ? 20 : 22, fontWeight: 900, color: '#dc2626', letterSpacing: '-0.3px' }}>Delete Account?</h2>
//           </div>

//           <p style={{ margin: '0 0 14px', fontSize: 14, color: t.tp, lineHeight: 1.65 }}>
//             This will <strong>permanently delete</strong> everything associated with your account:
//           </p>
//           <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
//             {items.map(item => (
//               <li key={item} style={{ fontSize: 13.5, color: t.ts, display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.4 }}>
//                 <span style={{ color: t.tp, fontWeight: 700, fontSize: 16, lineHeight: '20px', flexShrink: 0 }}>•</span>
//                 {item}
//               </li>
//             ))}
//           </ul>
//           <p style={{ margin: '0 0 28px', fontSize: 13.5, color: t.ts, lineHeight: 1.55 }}>
//             You will be{' '}
//             <span style={{ color: '#dc2626', fontWeight: 700 }}>logged out immediately</span>.
//             {' '}This cannot be undone.
//           </p>
//         </div>

//         <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, justifyContent: 'flex-end', padding: isMobile ? '0 20px' : 0 }}>
//           <button
//             onClick={onConfirm} disabled={deleting}
//             style={{ padding: '13px 28px', borderRadius: 11, border: 'none', background: '#dc2626', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: deleting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s' }}
//             onMouseEnter={e => { if (!deleting) (e.currentTarget as HTMLElement).style.background = '#b91c1c'; }}
//             onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#dc2626'}
//           >
//             {deleting ? (
//               <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Deleting…</>
//             ) : 'Yes, Continue'}
//           </button>
//           <button
//             onClick={onClose} disabled={deleting}
//             style={{ padding: '13px 28px', borderRadius: 11, border: `1.5px solid ${t.border2}`, background: 'transparent', color: t.tp, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: deleting ? 0.5 : 1 }}
//             onMouseEnter={e => (e.currentTarget.style.background = t.hoverBg)}
//             onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
//           >Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Export Modal ──────────────────────────────────────────────────────────────
// function ExportModal({ onClose, t, userId, isMobile }: {
//   onClose: () => void; t: ReturnType<typeof useTokens>; userId: string; isMobile: boolean;
// }) {
//   const supabase = createClient();
//   const [selected, setSelected] = useState<Set<ExportSection>>(
//     new Set(['cell', 'members', 'attendance', 'celebrations', 'programs'])
//   );
//   const [format, setFormat]     = useState<ExportFormat>('pdf');
//   const [generating, setGen]    = useState(false);
//   const [genError, setGenError] = useState<string | null>(null);

//   function toggle(id: ExportSection) {
//     setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
//   }

//   async function fetchData() {
//     const out: Record<string, any[]> = {};
//     if (selected.has('cell')) {
//       const { data } = await supabase.from('cell_profile').select('*').eq('user_id', userId).single();
//       out.cell = data ? [data] : [];
//     }
//     if (selected.has('members')) {
//       const { data } = await supabase.from('members').select('*').eq('user_id', userId);
//       out.members = data ?? [];
//     }
//     if (selected.has('attendance')) {
//       const { data: meetings } = await supabase.from('meetings').select('*').eq('user_id', userId);
//       const { data: records }  = await supabase.from('attendance_records').select('*').eq('user_id', userId);
//       out.meetings   = meetings ?? [];
//       out.attendance = records  ?? [];
//     }
//     if (selected.has('celebrations')) {
//       const { data } = await supabase.from('celebrations').select('*').eq('user_id', userId);
//       out.celebrations = data ?? [];
//     }
//     if (selected.has('programs')) {
//       const { data } = await supabase.from('programs').select('*').eq('user_id', userId);
//       out.programs = data ?? [];
//     }
//     return out;
//   }

//   async function exportXlsx(data: Record<string, any[]>) {
//     if (!(window as any).XLSX) {
//       await new Promise<void>((res, rej) => {
//         const s = document.createElement('script');
//         s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
//         s.onload = () => res(); s.onerror = () => rej(new Error('Failed to load SheetJS'));
//         document.head.appendChild(s);
//       });
//     }
//     const XLSX = (window as any).XLSX;
//     const wb = XLSX.utils.book_new();
//     const labelMap: Record<string, string> = { cell:'Cell Info', members:'Members', meetings:'Meetings', attendance:'Attendance', celebrations:'Celebrations', programs:'Programs' };
//     for (const [key, rows] of Object.entries(data)) {
//       if (!rows.length) continue;
//       const clean = rows.map(r => { const { id, user_id, ...rest } = r as any; return rest; });
//       const ws = XLSX.utils.json_to_sheet(clean);
//       ws['!cols'] = Object.keys(clean[0]).map((k: string) => ({ wch: Math.max(k.length, 16) }));
//       XLSX.utils.book_append_sheet(wb, ws, labelMap[key] ?? key);
//     }
//     XLSX.writeFile(wb, `oasis-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
//   }

//   function exportPdf(data: Record<string, any[]>) {
//     const cellInfo   = data.cell?.[0];
//     const members    = data.members      ?? [];
//     const meetings   = data.meetings     ?? [];
//     const attendance = data.attendance   ?? [];
//     const celebs     = data.celebrations ?? [];
//     const programs   = data.programs     ?? [];
//     const now = new Date();
//     const dtStr  = now.toLocaleString('en-GB',{ day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit' });
//     const dayStr = now.toLocaleDateString('en-GB',{ weekday:'long',day:'numeric',month:'long',year:'numeric' });
//     const cellName   = cellInfo?.cell_name   || 'Oasis';
//     const leaderName = cellInfo?.leader_name || '';
//     const leaderEmail= cellInfo?.email       || '';
//     const leaderPhone= cellInfo?.phone       || '';
//     const S = {
//       page:'font-family:"Helvetica Neue",Arial,sans-serif;margin:0;padding:0;color:#111;font-size:12px;background:#fff;',
//       wrap:'max-width:680px;margin:0 auto;padding:28px 32px 48px;',
//       hdr:'display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:2.5px solid #111;margin-bottom:32px;',
//       hLeft:'display:flex;flex-direction:column;', hName:'font-size:26px;font-weight:900;margin:0 0 2px;letter-spacing:-0.5px;',
//       hSub:'font-size:11px;color:#6b7280;margin:0;', hRight:'text-align:right;font-size:11px;line-height:1.7;color:#374151;',
//       hRL:'font-weight:700;font-size:12px;color:#111;',
//       secHdr:'font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;margin:32px 0 10px;',
//       ciWrap:'border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:8px;',
//       ciRow:'display:flex;border-bottom:1px solid #e5e7eb;',
//       ciKey:'width:140px;padding:9px 14px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;background:#f8fafc;flex-shrink:0;',
//       ciVal:'padding:9px 14px;font-size:13px;font-weight:600;color:#111;',
//       tbl:'width:100%;border-collapse:collapse;font-size:12px;',
//       th:'padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;border-bottom:1.5px solid #e5e7eb;background:#fff;',
//       td:'padding:8px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top;',
//       tdAlt:'padding:8px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top;background:#fafafa;',
//       badge:'display:inline-block;background:#f3f4f6;border-radius:20px;padding:1px 8px;font-size:10px;font-weight:700;color:#6b7280;margin-left:8px;vertical-align:middle;',
//       present:'font-weight:700;color:#16a34a;', absent:'font-weight:700;color:#dc2626;',
//       mtgHdr:'font-weight:800;font-size:13px;color:#111;margin:20px 0 6px;display:flex;justify-content:space-between;align-items:baseline;',
//       mtgSub:'font-size:11px;color:#6b7280;font-weight:400;',
//       footer:'margin-top:48px;padding-top:14px;border-top:1.5px solid #e5e7eb;display:flex;justify-content:space-between;font-size:10px;color:#9ca3af;',
//     };
//     const ciR = (k: string, v: string) => `<div style="${S.ciRow}"><div style="${S.ciKey}">${k}</div><div style="${S.ciVal}">${v||'—'}</div></div>`;
//     const tR  = (cells: string[], alt: boolean) => `<tr>${cells.map(c=>`<td style="${alt?S.tdAlt:S.td}">${c??'—'}</td>`).join('')}</tr>`;
//     const fmt = (d: string|null|undefined) => { if(!d) return '—'; const p=new Date(d); return isNaN(p.getTime())?d:p.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'long',year:'numeric'}); };
//     let body = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${cellName} — Report</title>
// <style>*{box-sizing:border-box;}body{${S.page}}@media print{@page{size:A4;margin:14mm 14mm 18mm;}body{padding:0;}.no-print{display:none;}}</style></head><body>
// <div style="${S.wrap}"><div style="${S.hdr}"><div style="${S.hLeft}"><h1 style="${S.hName}">${cellName}</h1><p style="${S.hSub}">Report · Generated ${dayStr}</p></div>
// <div style="${S.hRight}"><div style="${S.hRL}">${leaderName}</div><div>Cell Leader</div>${leaderEmail?`<div>${leaderEmail}</div>`:''} ${leaderPhone?`<div>${leaderPhone}</div>`:''}</div></div>`;
//     if (cellInfo) {
//       body += `<div style="${S.secHdr}">Cell Information</div><div style="${S.ciWrap}">${ciR('Cell Name',cellInfo.cell_name||'—')}${ciR('Cell Leader',cellInfo.leader_name||'—')}${ciR('Meeting Day(s)',cellInfo.meeting_day||'—')}${ciR('Time',cellInfo.meeting_time||'—')}${ciR('Venue',cellInfo.venue||'—')}${ciR('Email',cellInfo.email||'—')}<div style="${S.ciRow.replace('border-bottom:1px solid #e5e7eb;','')}"><div style="${S.ciKey}">Phone</div><div style="${S.ciVal}">${cellInfo.phone||'—'}</div></div></div>`;
//     }
//     if (selected.has('members')) {
//       body += `<div style="${S.secHdr}">Members <span style="${S.badge}">${members.length}</span></div>`;
//       if (!members.length) body += `<p style="color:#9ca3af;font-size:12px;">No members found.</p>`;
//       else body += `<table style="${S.tbl}"><thead><tr><th style="${S.th};width:32px">#</th><th style="${S.th}">Name</th><th style="${S.th}">Phone</th><th style="${S.th}">Gender</th><th style="${S.th}">Join Date</th><th style="${S.th}">Birthday</th></tr></thead><tbody>${members.map((m:any,i:number)=>tR([String(i+1),m.name||'—',m.phone||'—',m.gender||'—',fmt(m.date_joined||m.created_at),fmt(m.date_of_birth||m.birthday)],i%2===1)).join('')}</tbody></table>`;
//     }
//     if (selected.has('attendance')) {
//       body += `<div style="${S.secHdr}">Attendance Records</div>`;
//       if (!meetings.length) body += `<p style="color:#9ca3af;font-size:12px;">No meetings found.</p>`;
//       else meetings.forEach((mtg:any)=>{
//         const recs=attendance.filter((a:any)=>a.meeting_id===mtg.id);
//         const pc=recs.filter((a:any)=>(a.status||'').toLowerCase()==='present').length;
//         body+=`<div style="${S.mtgHdr}">${mtg.title||'Meeting'} · <span style="${S.mtgSub}">${fmt(mtg.date)}</span><span style="font-size:11px;color:#6b7280;font-weight:500;">${pc}/${recs.length} present</span></div>`;
//         if(!recs.length) body+=`<p style="color:#9ca3af;font-size:11px;margin:0 0 12px;">No attendance recorded.</p>`;
//         else body+=`<table style="${S.tbl};margin-bottom:16px;"><thead><tr><th style="${S.th};width:32px">#</th><th style="${S.th}">Member</th><th style="${S.th}">Status</th></tr></thead><tbody>${recs.map((a:any,i:number)=>{const ip=(a.status||'').toLowerCase()==='present';const sc=ip?`<span style="${S.present}">✓ Present</span>`:`<span style="${S.absent}">✗ Absent</span>`;return`<tr><td style="${i%2===1?S.tdAlt:S.td}">${i+1}</td><td style="${i%2===1?S.tdAlt:S.td}">${a.member_name||a.member_id||'—'}</td><td style="${i%2===1?S.tdAlt:S.td}">${sc}</td></tr>`;}).join('')}</tbody></table>`;
//       });
//     }
//     if (selected.has('celebrations')) {
//       body+=`<div style="${S.secHdr}">Celebrations <span style="${S.badge}">${celebs.length}</span></div>`;
//       if(!celebs.length) body+=`<p style="color:#9ca3af;font-size:12px;">No celebrations found.</p>`;
//       else body+=`<table style="${S.tbl}"><thead><tr><th style="${S.th};width:32px">#</th><th style="${S.th}">Name</th><th style="${S.th}">Event</th><th style="${S.th}">Month</th><th style="${S.th}">Day</th></tr></thead><tbody>${celebs.map((c:any,i:number)=>{let month=c.month||'',day=c.day||'';if(!month&&c.date){const d=new Date(c.date);month=d.toLocaleString('en-US',{month:'long'});day=String(d.getDate()).padStart(2,'0');}return tR([String(i+1),c.name||'—',c.event||'—',month||'—',day||'—'],i%2===1);}).join('')}</tbody></table>`;
//     }
//     if (selected.has('programs')) {
//       body+=`<div style="${S.secHdr}">Programs <span style="${S.badge}">${programs.length}</span></div>`;
//       if(!programs.length) body+=`<p style="color:#9ca3af;font-size:12px;">No programs found.</p>`;
//       else body+=`<table style="${S.tbl}"><thead><tr><th style="${S.th};width:32px">#</th><th style="${S.th}">Title</th><th style="${S.th}">Date</th><th style="${S.th}">Time</th><th style="${S.th}">Venue</th></tr></thead><tbody>${programs.map((p:any,i:number)=>tR([String(i+1),p.title||'—',fmt(p.date),p.time||p.meeting_time||'—',p.venue||'—'],i%2===1)).join('')}</tbody></table>`;
//     }
//     body+=`<div style="${S.footer}"><span>${cellName}</span><span>${dtStr}</span></div></div></body></html>`;
//     const win = window.open('', '_blank');
//     if (!win) { alert('Please allow popups for this page to generate the PDF.'); return; }
//     win.document.write(body); win.document.close(); win.focus();
//     setTimeout(() => { win.print(); }, 500);
//   }

//   async function handleGenerate() {
//     setGen(true); setGenError(null);
//     try {
//       const data = await fetchData();
//       if (format === 'xlsx') await exportXlsx(data); else exportPdf(data);
//       onClose();
//     } catch (err: any) {
//       setGenError(err.message ?? 'Export failed. Please try again.');
//     } finally { setGen(false); }
//   }

//   const wrapStyle: React.CSSProperties = isMobile
//     ? { position: 'fixed', inset: 0, background: t.modalBg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }
//     : { background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: 18, width: '100%', maxWidth: 540, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', animation: 'slideUp 0.18s ease' };

//   return (
//     <div
//       style={{ position: 'fixed', inset: 0, zIndex: 1000, background: isMobile ? 'transparent' : t.overlay, backdropFilter: isMobile ? 'none' : 'blur(4px)', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'center', padding: isMobile ? 0 : 16 }}
//       onClick={onClose}
//     >
//       <div onClick={e => e.stopPropagation()} style={wrapStyle}>

//         {/* Header */}
//         <div style={{ padding: isMobile ? '18px 20px 14px' : '22px 26px 18px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
//           <div>
//             <h2 style={{ margin: 0, fontSize: isMobile ? 17 : 19, fontWeight: 800, color: t.tp }}>Export Report</h2>
//             <p style={{ margin: '4px 0 0', fontSize: 13, color: t.ts }}>Choose what to include, then pick a format.</p>
//           </div>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: t.ts, cursor: 'pointer', fontSize: 24, lineHeight: 1, padding: 2 }}>×</button>
//         </div>

//         {/* Scrollable body */}
//         <div style={{ overflowY: 'auto', flex: 1, padding: isMobile ? '16px 20px' : '18px 26px' }}>
//           {genError && (
//             <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', fontSize: 13 }}>{genError}</div>
//           )}
//           <p style={{ margin: '0 0 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: t.ts, textTransform: 'uppercase' }}>Include Sections</p>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//             {EXPORT_SECTIONS.map(s => {
//               const on = selected.has(s.id);
//               return (
//                 <button key={s.id} onClick={() => toggle(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 12, cursor: 'pointer', textAlign: 'left', background: on ? t.checkBg : t.cardBg2, border: `1.5px solid ${on ? t.checkBd : t.border}`, transition: 'all 0.12s', fontFamily: 'inherit' }}>
//                   <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: `2px solid ${on ? t.checkOn : t.border2}`, background: on ? t.checkOn : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     {on && <IconCheck c="#fff" />}
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 14, fontWeight: 600, color: t.tp }}>{s.label}</div>
//                     <div style={{ fontSize: 12, color: t.ts, marginTop: 1 }}>{s.sub}</div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           <p style={{ margin: '20px 0 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: t.ts, textTransform: 'uppercase' }}>Format</p>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
//             {(['xlsx', 'pdf'] as ExportFormat[]).map(f => {
//               const on = format === f;
//               return (
//                 <button key={f} onClick={() => setFormat(f)} style={{ padding: isMobile ? '14px 10px' : '18px 14px', borderRadius: 12, cursor: 'pointer', background: on ? t.fmtOnBg : t.cardBg2, border: `1.5px solid ${on ? t.fmtOnBd : t.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.12s', fontFamily: 'inherit' }}>
//                   {f === 'xlsx'
//                     ? <svg viewBox="0 0 24 24" fill="none" stroke={on ? t.fmtOnTxt : t.ts} strokeWidth={1.5} style={{ width: 26, height: 26 }}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
//                     : <svg viewBox="0 0 24 24" fill="none" stroke={on ? t.fmtOnTxt : t.ts} strokeWidth={1.5} style={{ width: 26, height: 26 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
//                   }
//                   <div style={{ fontSize: 12, fontWeight: 600, color: on ? t.fmtOnTxt : t.ts, textAlign: 'center' }}>{f === 'xlsx' ? 'Excel (.xlsx)' : 'A4 Print / PDF'}</div>
//                   {!isMobile && <div style={{ fontSize: 11, color: t.tss, textAlign: 'center' }}>{f === 'xlsx' ? 'Multi-sheet spreadsheet' : 'Opens print dialog'}</div>}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Footer buttons */}
//         <div style={{ padding: isMobile ? '12px 20px 20px' : '14px 26px', borderTop: `1px solid ${t.border}`, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10, justifyContent: 'flex-end', flexShrink: 0 }}>
//           <button onClick={handleGenerate} disabled={generating || selected.size === 0} style={{ padding: '13px 22px', borderRadius: 10, border: 'none', background: '#16a34a', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: (generating || selected.size === 0) ? 0.65 : 1, fontFamily: 'inherit' }}>
//             {generating
//               ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Generating…</>
//               : <><IconDownload c="#fff" />Generate Report</>
//             }
//           </button>
//           <button onClick={onClose} style={{ padding: '12px 22px', borderRadius: 10, border: `1px solid ${t.border2}`, background: 'transparent', color: t.ts, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Edit Modal ────────────────────────────────────────────────────────────────
// function EditModal({ form, setForm, onSave, onClose, saving, uploadingImg, onImageClick, fileInputRef, onImageChange, t, isMobile }: {
//   form: Omit<CellProfile, 'id' | 'user_id'>;
//   setForm: React.Dispatch<React.SetStateAction<Omit<CellProfile, 'id' | 'user_id'>>>;
//   onSave: (e: React.FormEvent) => void;
//   onClose: () => void;
//   saving: boolean; uploadingImg: boolean;
//   onImageClick: () => void;
//   // FIX: React 19 useRef(null) returns RefObject<T | null>
//   fileInputRef: React.RefObject<HTMLInputElement | null>;
//   onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   t: ReturnType<typeof useTokens>;
//   isMobile: boolean;
// }) {
//   const fields: { label: string; key: keyof typeof defaultProfile; full?: boolean; placeholder: string }[] = [
//     { label: 'Cell Name',      key: 'cell_name',    placeholder: 'e.g. Oasis Cell'          },
//     { label: 'Cell Leader',    key: 'leader_name',  placeholder: 'e.g. John Doe'            },
//     { label: 'Meeting Day(s)', key: 'meeting_day',  placeholder: 'e.g. Tuesdays & Fridays', full: true },
//     { label: 'Time',           key: 'meeting_time', placeholder: 'e.g. 9AM'                 },
//     { label: 'Venue',          key: 'venue',        placeholder: 'e.g. Onsite / Zoom'       },
//     { label: 'Email',          key: 'email',        placeholder: 'e.g. cell@example.com'    },
//     { label: 'Phone No',       key: 'phone',        placeholder: 'e.g. 08012345678'         },
//   ];

//   const inputStyle: React.CSSProperties = {
//     width: '100%', padding: '11px 13px', borderRadius: 10, boxSizing: 'border-box',
//     border: `1.5px solid ${t.inputBd}`, background: t.inputBg,
//     color: t.tp, fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
//   };

//   const wrapStyle: React.CSSProperties = isMobile
//     ? { position: 'fixed', inset: 0, background: t.modalBg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }
//     : { background: t.modalBg, border: `1px solid ${t.border}`, borderRadius: 18, width: '100%', maxWidth: 620, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', animation: 'slideUp 0.18s ease' };

//   return (
//     <div
//       style={{ position: 'fixed', inset: 0, zIndex: 1000, background: isMobile ? 'transparent' : t.overlay, backdropFilter: isMobile ? 'none' : 'blur(4px)', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'center', padding: isMobile ? 0 : 16 }}
//       onClick={onClose}
//     >
//       <div onClick={e => e.stopPropagation()} style={wrapStyle}>

//         {/* Header */}
//         <div style={{ padding: isMobile ? '18px 20px 14px' : '22px 26px 18px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
//           <h2 style={{ margin: 0, fontSize: isMobile ? 17 : 19, fontWeight: 800, color: t.tp }}>Edit Profile</h2>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: t.ts, cursor: 'pointer', fontSize: 24, lineHeight: 1, padding: 2 }}>×</button>
//         </div>

//         <form onSubmit={onSave} style={{ overflowY: 'auto', flex: 1, padding: isMobile ? '20px 20px' : '22px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>

//           {/* Avatar */}
//           <div style={{ display: 'flex', justifyContent: 'center' }}>
//             <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onImageClick}>
//               <div style={{ width: 86, height: 86, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${t.cyan}`, background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 {form.image_url ? <img src={form.image_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconPerson c={t.ts} />}
//               </div>
//               <div style={{ position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: '50%', background: t.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${t.modalBg}` }}>
//                 {uploadingImg
//                   ? <div style={{ width: 10, height: 10, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
//                   : <IconCamera c="#fff" />}
//               </div>
//             </div>
//             <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onImageChange} />
//           </div>

//           {/* Fields: single column on mobile, two columns on desktop */}
//           <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
//             {fields.map(({ label, key, full, placeholder }) =>
//               key !== 'image_url' && (
//                 <div key={key} style={{ gridColumn: (full && !isMobile) ? '1 / -1' : undefined }}>
//                   <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', color: t.ts, textTransform: 'uppercase', marginBottom: 5 }}>{label}</label>
//                   <input
//                     type="text"
//                     value={(form[key] as string) || ''}
//                     placeholder={placeholder}
//                     onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
//                     style={inputStyle}
//                     onFocus={e => (e.target.style.borderColor = t.cyan)}
//                     onBlur={e => (e.target.style.borderColor = t.inputBd)}
//                   />
//                 </div>
//               )
//             )}
//           </div>

//           {/* Buttons */}
//           <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10, justifyContent: 'flex-end', paddingTop: 4, borderTop: `1px solid ${t.border}`, marginTop: 4 }}>
//             <button type="submit" disabled={saving} style={{ padding: '13px 26px', borderRadius: 10, border: 'none', background: t.tp, color: t.cardBg, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1, fontFamily: 'inherit' }}>
//               {saving ? 'Saving…' : 'Save Changes'}
//             </button>
//             <button type="button" onClick={onClose} style={{ padding: '12px 26px', borderRadius: 10, border: `1px solid ${t.border2}`, background: 'transparent', color: t.ts, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function SettingsPage() {
//   const { isDark } = useTheme();
//   const t          = useTokens(isDark);
//   const supabase   = createClient();
//   const router     = useRouter();
//   const isMobile   = useIsMobile();

//   const [profile,      setProfile]      = useState<CellProfile | null>(null);
//   const [form,         setForm]         = useState(defaultProfile);
//   const [loading,      setLoading]      = useState(true);
//   const [saving,       setSaving]       = useState(false);
//   const [deleting,     setDeleting]     = useState(false);
//   const [uploadingImg, setUploadingImg] = useState(false);
//   const [successMsg,   setSuccessMsg]   = useState<string | null>(null);
//   const [errorMsg,     setErrorMsg]     = useState<string | null>(null);
//   const [editOpen,     setEditOpen]     = useState(false);
//   const [exportOpen,   setExportOpen]   = useState(false);
//   const [deleteOpen,   setDeleteOpen]   = useState(false);

//   // FIX: React 19 useRef(null) returns RefObject<T | null>
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const channelRef   = useRef<ReturnType<typeof supabase.channel> | null>(null);

//   useEffect(() => {
//     let mounted = true;
//     async function loadProfile() {
//       setLoading(true);
//       const { data: { user }, error: userErr } = await supabase.auth.getUser();
//       if (userErr || !user) { router.push('/login'); return; }

//       let { data, error } = await supabase.from('cell_profile').select('*').eq('user_id', user.id).single();

//       if (error && error.code === 'PGRST116') {
//         // FIX: cast to any — generated types may not yet include new columns
//         const { data: ins, error: insErr } = await supabase
//           .from('cell_profile')
//           .upsert({ user_id: user.id, ...defaultProfile } as any, { onConflict: 'user_id' })
//           .select().single();
//         if (insErr) { setErrorMsg('Could not load settings.'); setLoading(false); return; }
//         data = ins;
//       } else if (error) {
//         setErrorMsg('Could not load settings.'); setLoading(false); return;
//       }

//       if (!mounted) return;
//       setProfile(data);
//       syncForm(data);
//       setLoading(false);

//       if (channelRef.current) supabase.removeChannel(channelRef.current);
//       channelRef.current = supabase
//         .channel('settings-profile')
//         .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cell_profile', filter: `user_id=eq.${user.id}` },
//           payload => { if (!mounted) return; const u = payload.new as CellProfile; setProfile(u); syncForm(u); })
//         .subscribe();
//     }
//     loadProfile();
//     return () => { mounted = false; if (channelRef.current) supabase.removeChannel(channelRef.current); };
//   }, []);

//   function syncForm(d: any) {
//     setForm({
//       cell_name: d.cell_name || '', leader_name: d.leader_name || '',
//       phone: d.phone || '', email: d.email || '', address: d.address || '',
//       meeting_day: d.meeting_day || '', meeting_time: d.meeting_time || '',
//       venue: d.venue || '', image_url: d.image_url || null,
//     });
//   }

//   async function handleSave(e: React.FormEvent) {
//     e.preventDefault();
//     if (!profile) return;
//     setSaving(true); setSuccessMsg(null); setErrorMsg(null);

//     const extPayload = {
//       cell_name: form.cell_name, leader_name: form.leader_name,
//       phone: form.phone, email: form.email, address: form.address,
//       meeting_day: form.meeting_day, meeting_time: form.meeting_time, venue: form.venue,
//     };
//     const basePayload = {
//       cell_name: form.cell_name, leader_name: form.leader_name,
//       phone: form.phone, email: form.email, address: form.address,
//     };

//     // FIX: cast to any — generated types may not yet include new columns
//     let { error } = await supabase.from('cell_profile').update(extPayload as any).eq('user_id', profile.user_id);
//     if (error && error.message.includes('column')) {
//       const fb = await supabase.from('cell_profile').update(basePayload as any).eq('user_id', profile.user_id);
//       error = fb.error;
//     }

//     setSaving(false);
//     if (error) { setErrorMsg('Save failed: ' + error.message); }
//     else { setSuccessMsg('Profile saved!'); setEditOpen(false); setTimeout(() => setSuccessMsg(null), 3000); }
//   }

//   async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file || !profile) return;
//     setUploadingImg(true); setErrorMsg(null);

//     const ext = file.name.split('.').pop();
//     const filePath = `${profile.user_id}/cell-logo.${ext}`;
//     await supabase.storage.from('cell-images').remove([filePath]);

//     const { error: upErr } = await supabase.storage.from('cell-images').upload(filePath, file, { upsert: true });
//     if (upErr) { setErrorMsg('Upload failed: ' + upErr.message); setUploadingImg(false); return; }

//     const { data: urlData } = supabase.storage.from('cell-images').getPublicUrl(filePath);
//     const publicUrl = urlData.publicUrl + `?v=${Date.now()}`;

//     // FIX: cast to any
//     const { error: updErr } = await supabase.from('cell_profile').update({ image_url: publicUrl } as any).eq('user_id', profile.user_id);
//     if (updErr) { setErrorMsg('Could not save image URL.'); }
//     else { setForm(prev => ({ ...prev, image_url: publicUrl })); setSuccessMsg('Photo updated!'); setTimeout(() => setSuccessMsg(null), 3000); }
//     setUploadingImg(false);
//   }

//   async function handleDeleteAccount() {
//     if (!profile?.user_id) { setErrorMsg('No active profile found. Please refresh.'); return; }
//     setDeleting(true); setErrorMsg(null);
//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) throw new Error('No active session. Please log in again.');

//       const tables = ['attendance_records', 'celebrations', 'programs', 'meetings', 'members', 'cell_profile'] as const;
//       for (const table of tables) {
//         const { error } = await supabase.from(table).delete().eq('user_id', profile.user_id);
//         if (error) console.warn(`Could not delete ${table}:`, error.message);
//       }

//       const controller = new AbortController();
//       const timeout = setTimeout(() => controller.abort(), 10000);
//       const res = await fetch('/api/delete-account', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
//         signal: controller.signal,
//       });
//       clearTimeout(timeout);

//       if (!res.ok) {
//         const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
//         throw new Error(body.error ?? `Server error ${res.status}`);
//       }

//       await supabase.auth.signOut();
//       window.location.replace('/');
//     } catch (err: any) {
//       console.error('Delete account error:', err);
//       setDeleting(false); setDeleteOpen(false);
//       setErrorMsg(err.name === 'AbortError' ? 'Request timed out. Please try again.' : 'Delete failed: ' + (err.message ?? 'Unknown error'));
//     }
//   }

//   // ── Render ────────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
//         <div style={{ width: 36, height: 36, border: `3px solid ${t.border}`, borderTopColor: t.cyan, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     );
//   }

//   const infoCards = [
//     { icon: <IconPerson c={t.ts} />,   label: 'Cell Name',   value: form.cell_name    },
//     { icon: <IconPerson c={t.ts} />,   label: 'Cell Leader', value: form.leader_name  },
//     { icon: <IconCalendar c={t.ts} />, label: 'Meeting Day', value: form.meeting_day  },
//     { icon: <IconClock c={t.ts} />,    label: 'Time',        value: form.meeting_time },
//     { icon: <IconPin c={t.ts} />,      label: 'Venue',       value: form.venue        },
//     { icon: <IconMail c={t.ts} />,     label: 'Email',       value: form.email        },
//     { icon: <IconPhone c={t.ts} />,    label: 'Phone',       value: form.phone        },
//   ];

//   return (
//     <>
//       <style>{`
//         @keyframes spin    { to { transform: rotate(360deg); } }
//         @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
//         input::placeholder { color: #9ca3af; }
//       `}</style>

//       <div style={{ minHeight: '100vh', background: t.pageBg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
//         <div style={{ maxWidth: 940, margin: '0 auto', padding: isMobile ? '22px 14px 48px' : '36px 20px 60px' }}>

//           {/* Heading */}
//           <div style={{ marginBottom: isMobile ? 18 : 32 }}>
//             <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 28, fontWeight: 900, color: t.tp, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>Settings</h1>
//             <p style={{ margin: '5px 0 0', fontSize: 13, color: t.ts }}>Manage your cell profile, reports and account</p>
//           </div>

//           {/* Toasts */}
//           {successMsg && (
//             <div style={{ marginBottom: 14, padding: '11px 14px', borderRadius: 12, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.28)', color: '#16a34a', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.2s ease' }}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 15, height: 15, flexShrink: 0 }}><path d="M20 6 9 17l-5-5"/></svg>
//               {successMsg}
//             </div>
//           )}
//           {errorMsg && (
//             <div style={{ marginBottom: 14, padding: '11px 14px', borderRadius: 12, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
//               <span style={{ flex: 1 }}>{errorMsg}</span>
//               <button onClick={() => setErrorMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 20, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
//             </div>
//           )}

//           {/* ── Profile card ── */}
//           <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: isMobile ? '16px 14px' : '24px 26px', marginBottom: 12, boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}>

//             {/* Avatar + name + edit button */}
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 10 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 11 : 16, minWidth: 0 }}>
//                 <div style={{ width: isMobile ? 48 : 62, height: isMobile ? 48 : 62, borderRadius: 13, overflow: 'hidden', border: `2.5px solid ${t.cyan}`, background: t.iconBg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   {form.image_url ? <img src={form.image_url} alt="Cell" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconPerson c={t.ts} />}
//                 </div>
//                 <div style={{ minWidth: 0 }}>
//                   <div style={{ fontSize: isMobile ? 15 : 20, fontWeight: 800, color: t.tp, letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{form.cell_name || 'Your Cell'}</div>
//                   <div style={{ fontSize: 12, color: t.ts, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Leader: {form.leader_name || '—'}</div>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setEditOpen(true)}
//                 style={{ display: 'flex', alignItems: 'center', gap: 6, padding: isMobile ? '8px 13px' : '10px 20px', borderRadius: 11, border: `1.5px solid ${t.border2}`, background: 'transparent', color: t.tp, fontSize: isMobile ? 13 : 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, transition: 'background 0.15s', whiteSpace: 'nowrap' }}
//                 onMouseEnter={e => (e.currentTarget.style.background = t.hoverBg)}
//                 onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
//               >
//                 <IconEdit c={t.tp} /> Edit
//               </button>
//             </div>

//             {/* Info cards: always 2-column grid (compact on mobile) */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? 7 : 10 }}>
//               {infoCards.map(c => <InfoCard key={c.label} {...c} t={t} />)}
//             </div>
//           </div>

//           {/* ── Action cards: stack on mobile, side-by-side on desktop ── */}
//           <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>

//             {/* Export Report */}
//             <button
//               onClick={() => setExportOpen(true)}
//               style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: isMobile ? '18px 16px' : '28px 26px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'border-color 0.15s, box-shadow 0.15s', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: isMobile ? 'center' : 'flex-start', gap: isMobile ? 14 : 0 }}
//               onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#16a34a'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
//               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'; }}
//             >
//               <div style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, borderRadius: 13, background: 'rgba(22,163,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? 0 : 14, flexShrink: 0 }}>
//                 <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} style={{ width: 20, height: 20 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
//               </div>
//               <div>
//                 <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: t.tp, marginBottom: 3 }}>Export Report</div>
//                 <div style={{ fontSize: 13, color: t.ts, lineHeight: 1.5 }}>Download Excel or A4 PDF with selected data</div>
//               </div>
//             </button>

//             {/* Delete Account */}
//             <button
//               onClick={() => setDeleteOpen(true)}
//               disabled={deleting}
//               style={{ background: isDark ? 'rgba(127,29,29,0.18)' : 'rgba(254,242,242,1)', border: `1px solid ${isDark ? 'rgba(185,28,28,0.3)' : 'rgba(252,165,165,0.6)'}`, borderRadius: 20, padding: isMobile ? '18px 16px' : '28px 26px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', opacity: deleting ? 0.6 : 1, transition: 'border-color 0.15s, box-shadow 0.15s', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: isMobile ? 'center' : 'flex-start', gap: isMobile ? 14 : 0 }}
//               onMouseEnter={e => { if (!deleting) { (e.currentTarget as HTMLElement).style.borderColor = '#dc2626'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(220,38,38,0.1)'; } }}
//               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isDark ? 'rgba(185,28,28,0.3)' : 'rgba(252,165,165,0.6)'; (e.currentTarget as HTMLElement).style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)'; }}
//             >
//               <div style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, borderRadius: 13, background: 'rgba(220,38,38,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? 0 : 14, flexShrink: 0 }}>
//                 <IconTrash c="#dc2626" />
//               </div>
//               <div>
//                 <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: '#dc2626', marginBottom: 3 }}>{deleting ? 'Deleting…' : 'Delete Account'}</div>
//                 <div style={{ fontSize: 13, color: t.ts, lineHeight: 1.5 }}>Permanently delete all cell data and log out</div>
//               </div>
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* ── Modals ── */}
//       {editOpen && (
//         <EditModal
//           form={form} setForm={setForm} onSave={handleSave} onClose={() => setEditOpen(false)}
//           saving={saving} uploadingImg={uploadingImg}
//           onImageClick={() => fileInputRef.current?.click()}
//           fileInputRef={fileInputRef} onImageChange={handleImageUpload}
//           t={t} isMobile={isMobile}
//         />
//       )}
//       {exportOpen && (
//         <ExportModal onClose={() => setExportOpen(false)} t={t} userId={profile?.user_id ?? ''} isMobile={isMobile} />
//       )}
//       {deleteOpen && (
//         <DeleteConfirmModal
//           onConfirm={handleDeleteAccount}
//           onClose={() => { if (!deleting) setDeleteOpen(false); }}
//           deleting={deleting}
//           t={t} isMobile={isMobile}
//         />
//       )}
//     </>
//   );
// }


















// 'use client';

// // app/dashboard/settings/page.tsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Multi-tenant · Light default · Dark via useTheme · Fully responsive
// //
// // Required DB migration (run once in Supabase SQL editor):
// //   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS meeting_day  text DEFAULT '';
// //   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS meeting_time text DEFAULT '';
// //   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS venue        text DEFAULT '';
// // ─────────────────────────────────────────────────────────────────────────────

// import { useState, useEffect, useRef } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import { useRouter } from 'next/navigation';
// import { useTheme } from '@/app/components/ThemeProvider';

// // ── Types ─────────────────────────────────────────────────────────────────────
// type CellProfile = {
//   id: number;
//   user_id: string;
//   cell_name: string;
//   leader_name: string;
//   phone: string;
//   email: string;
//   address: string;
//   meeting_day: string;
//   meeting_time: string;
//   venue: string;
//   image_url: string | null;
// };

// const defaultProfile: Omit<CellProfile, 'id' | 'user_id'> = {
//   cell_name: '', leader_name: '', phone: '', email: '',
//   address: '', meeting_day: '', meeting_time: '', venue: '', image_url: null,
// };

// type ExportSection = 'cell' | 'members' | 'attendance' | 'celebrations' | 'programs';
// type ExportFormat  = 'xlsx' | 'pdf';

// const EXPORT_SECTIONS: { id: ExportSection; label: string; sub: string }[] = [
//   { id: 'cell',         label: 'Cell Information',  sub: 'Name, leader, venue, contact details' },
//   { id: 'members',      label: 'Members List',       sub: 'All member names & phone numbers'     },
//   { id: 'attendance',   label: 'Attendance Records', sub: 'All meetings with per-member status'  },
//   { id: 'celebrations', label: 'Celebrations',       sub: 'Birthdays & anniversaries'            },
//   { id: 'programs',     label: 'Programs',           sub: 'All scheduled programs & events'      },
// ];

// // ── Theme tokens ──────────────────────────────────────────────────────────────
// function useTokens(isDark: boolean) {
//   return {
//     pageBg:   isDark ? '#0d0f14' : '#f0f2f5',
//     cardBg:   isDark ? '#151720' : '#ffffff',
//     cardBg2:  isDark ? '#1a1d26' : '#f8f9fb',
//     border:   isDark ? '#22252f' : '#e8eaed',
//     border2:  isDark ? '#2a2e3a' : '#dde0e6',
//     tp:       isDark ? '#f1f2f5' : '#0f1117',
//     ts:       isDark ? '#9ca3af' : '#6b7280',
//     tss:      isDark ? '#4b5563' : '#9ca3af',
//     iconBg:   isDark ? '#1e2130' : '#eef0f4',
//     inputBg:  isDark ? '#1a1d26' : '#f4f5f8',
//     inputBd:  isDark ? '#2a2e3a' : '#dde0e6',
//     hoverBg:  isDark ? '#1e2130' : '#f0f2f6',
//     modalBg:  isDark ? '#13151d' : '#ffffff',
//     overlay:  isDark ? 'rgba(0,0,0,0.80)' : 'rgba(0,0,0,0.50)',
//     checkOn:  isDark ? '#6366f1' : '#4f46e5',
//     checkBg:  isDark ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.07)',
//     checkBd:  isDark ? 'rgba(99,102,241,0.4)'  : 'rgba(79,70,229,0.3)',
//     fmtOnBg:  isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
//     fmtOnBd:  isDark ? '#3b82f6' : '#2563eb',
//     fmtOnTxt: isDark ? '#60a5fa' : '#2563eb',
//     cyan:     '#06b6d4',
//   };
// }

// // ── CSS (injected once, uses real media queries) ───────────────────────────────
// const RESPONSIVE_CSS = `
//   @keyframes spin    { to { transform: rotate(360deg); } }
//   @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
//   @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }

//   *, *::before, *::after { box-sizing: border-box; }
//   input::placeholder { color: #9ca3af; }

//   /* ── Page wrapper ── */
//   .sp-page   { min-height: 100vh; font-family: 'DM Sans', system-ui, sans-serif; }
//   .sp-inner  { max-width: 940px; margin: 0 auto; padding: 36px 20px 60px; }

//   /* ── Profile card ── */
//   .sp-profile-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
//   .sp-avatar-wrap    { display: flex; align-items: center; gap: 16px; min-width: 0; }
//   .sp-avatar         { width: 62px; height: 62px; border-radius: 14px; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
//   .sp-cell-name      { font-size: 20px; font-weight: 800; letter-spacing: -0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//   .sp-cell-leader    { font-size: 13px; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//   .sp-edit-btn       { display: flex; align-items: center; gap: 7px; padding: 10px 20px; border-radius: 11px; font-size: 14px; font-weight: 700; cursor: pointer; flex-shrink: 0; white-space: nowrap; transition: background 0.15s; }

//   /* ── Info cards grid ── */
//   .sp-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
//   .sp-info-card { border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
//   .sp-info-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
//   .sp-info-label{ font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 3px; }
//   .sp-info-value{ font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

//   /* ── Action cards grid ── */
//   .sp-action-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
//   .sp-action-card { border-radius: 20px; padding: 28px 26px; cursor: pointer; text-align: left; font-family: inherit; transition: border-color 0.15s, box-shadow 0.15s; display: flex; flex-direction: column; align-items: flex-start; gap: 0; }
//   .sp-action-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; flex-shrink: 0; }
//   .sp-action-title{ font-size: 17px; font-weight: 800; margin-bottom: 4px; }
//   .sp-action-sub  { font-size: 13px; line-height: 1.5; }

//   /* ── Modal ── */
//   .sp-modal-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; }
//   .sp-modal-box     { border-radius: 18px; width: 100%; max-width: 540px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 32px 80px rgba(0,0,0,0.25); animation: slideUp 0.18s ease; }
//   .sp-modal-box-lg  { max-width: 620px; max-height: 92vh; }
//   .sp-modal-head    { padding: 22px 26px 18px; display: flex; justify-content: space-between; align-items: flex-start; flex-shrink: 0; }
//   .sp-modal-body    { overflow-y: auto; flex: 1; padding: 18px 26px; }
//   .sp-modal-foot    { padding: 14px 26px; display: flex; gap: 10px; justify-content: flex-end; flex-shrink: 0; }
//   .sp-modal-close   { background: none; border: none; cursor: pointer; font-size: 24px; line-height: 1; padding: 2px; }

//   /* Edit form grid */
//   .sp-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
//   .sp-field-full { grid-column: 1 / -1; }

//   /* Export format grid */
//   .sp-fmt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

//   /* ── TABLET (≤ 768px) ── */
//   @media (max-width: 768px) {
//     .sp-inner       { padding: 28px 16px 52px; }
//     .sp-action-card { padding: 22px 18px; flex-direction: row; align-items: center; gap: 14px; }
//     .sp-action-icon { margin-bottom: 0; width: 44px; height: 44px; }
//     .sp-action-title{ font-size: 15px; }
//   }

//   /* ── MOBILE (≤ 540px) ── */
//   @media (max-width: 540px) {
//     .sp-inner        { padding: 20px 12px 48px; }
//     .sp-avatar        { width: 48px; height: 48px; border-radius: 12px; }
//     .sp-cell-name     { font-size: 15px; }
//     .sp-cell-leader   { font-size: 12px; }
//     .sp-edit-btn      { padding: 8px 13px; font-size: 13px; gap: 5px; }

//     /* Info grid: single column on mobile */
//     .sp-info-grid    { grid-template-columns: 1fr; gap: 7px; }
//     .sp-info-card    { padding: 12px 14px; gap: 12px; }
//     .sp-info-icon    { width: 34px; height: 34px; border-radius: 9px; }
//     .sp-info-label   { font-size: 10px; }
//     .sp-info-value   { font-size: 13px; }
//     .sp-info-spacer  { display: none; }

//     /* Action cards: single column, horizontal layout */
//     .sp-action-grid  { grid-template-columns: 1fr; gap: 9px; }
//     .sp-action-card  { padding: 16px 14px; }
//     .sp-action-icon  { width: 38px; height: 38px; border-radius: 11px; }
//     .sp-action-title { font-size: 14px; }
//     .sp-action-sub   { font-size: 12px; }

//     /* Modals go full-screen */
//     .sp-modal-overlay { padding: 0; align-items: flex-end; background: transparent !important; backdrop-filter: none !important; }
//     .sp-modal-box     { max-width: 100%; max-height: 95vh; border-radius: 20px 20px 0 0; box-shadow: 0 -8px 40px rgba(0,0,0,0.3); animation: slideUp 0.22s ease; }
//     .sp-modal-box-lg  { max-width: 100%; max-height: 97vh; }
//     .sp-modal-head    { padding: 18px 18px 14px; }
//     .sp-modal-body    { padding: 14px 18px; }
//     .sp-modal-foot    { padding: 12px 18px 20px; flex-direction: column-reverse; }
//     .sp-modal-foot button { width: 100%; justify-content: center; }

//     /* Edit modal: single column fields */
//     .sp-field-grid   { grid-template-columns: 1fr; }
//     .sp-field-full   { grid-column: 1; }

//     /* Delete modal button order */
//     .sp-del-btns     { flex-direction: column; }
//   }

//   /* ── TINY (≤ 360px) ── */
//   @media (max-width: 360px) {
//     .sp-inner        { padding: 14px 10px 44px; }
//     .sp-info-card    { padding: 10px 12px; gap: 10px; }
//     .sp-info-icon    { width: 30px; height: 30px; }
//     .sp-info-label   { font-size: 9px; }
//     .sp-info-value   { font-size: 12px; }
//     .sp-edit-btn      { padding: 7px 10px; font-size: 12px; }
//   }
// `;

// // ── SVG Icons ─────────────────────────────────────────────────────────────────
// const ic = (color: string) => ({ viewBox: '0 0 24 24', fill: 'none' as const, stroke: color, strokeWidth: 1.8, style: { width: 18, height: 18 } as React.CSSProperties });
// function IconPerson({ c }: { c: string })   { return <svg {...ic(c)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
// function IconCalendar({ c }: { c: string }) { return <svg {...ic(c)}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
// function IconClock({ c }: { c: string })    { return <svg {...ic(c)}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>; }
// function IconPin({ c }: { c: string })      { return <svg {...ic(c)}><path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
// function IconMail({ c }: { c: string })     { return <svg {...ic(c)}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>; }
// function IconPhone({ c }: { c: string })    { return <svg {...ic(c)}><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 5.18 2 2 0 0 1 5.09 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z"/></svg>; }
// function IconEdit({ c }: { c: string })     { return <svg {...ic(c)}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
// function IconDownload({ c }: { c: string }) { return <svg {...ic(c)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
// function IconTrash({ c }: { c: string })    { return <svg {...ic(c)}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
// function IconCheck({ c }: { c: string })    { return <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={3} style={{ width: 12, height: 12 }}><path d="M20 6 9 17l-5-5"/></svg>; }
// function IconCamera({ c }: { c: string })   { return <svg {...ic(c)}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }

// // ── Spinner ───────────────────────────────────────────────────────────────────
// function Spinner({ size = 14, color = '#fff' }: { size?: number; color?: string }) {
//   return <div style={{ width: size, height: size, border: `2px solid ${color}33`, borderTopColor: color, borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />;
// }

// // ── Info Card ─────────────────────────────────────────────────────────────────
// function InfoCard({ icon, label, value, t }: { icon: React.ReactNode; label: string; value: string; t: ReturnType<typeof useTokens> }) {
//   return (
//     <div className="sp-info-card" style={{ background: t.cardBg2, border: `1px solid ${t.border}` }}>
//       <div className="sp-info-icon" style={{ background: t.iconBg }}>{icon}</div>
//       <div style={{ minWidth: 0 }}>
//         <div className="sp-info-label" style={{ color: t.ts }}>{label}</div>
//         <div className="sp-info-value" style={{ color: t.tp }}>{value || '—'}</div>
//       </div>
//     </div>
//   );
// }

// // ── Delete Confirm Modal ──────────────────────────────────────────────────────
// function DeleteConfirmModal({ onConfirm, onClose, deleting, t }: {
//   onConfirm: () => void; onClose: () => void; deleting: boolean; t: ReturnType<typeof useTokens>;
// }) {
//   const items = [
//     'All members & their data',
//     'All attendance records & meetings',
//     'All celebrations & programs',
//     'Cell profile information',
//     'Your login email & account',
//   ];
//   return (
//     <div
//       className="sp-modal-overlay"
//       style={{ background: t.overlay, backdropFilter: 'blur(6px)', zIndex: 2000 }}
//       onClick={() => { if (!deleting) onClose(); }}
//     >
//       <div
//         className="sp-modal-box"
//         onClick={e => e.stopPropagation()}
//         style={{ background: t.modalBg, border: `1px solid ${t.border}` }}
//       >
//         {/* Header */}
//         <div className="sp-modal-head" style={{ borderBottom: `1px solid ${t.border}` }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(220,38,38,0.12)', border: '1.5px solid rgba(220,38,38,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} style={{ width: 20, height: 20 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
//             </div>
//             <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#dc2626' }}>Delete Account?</h2>
//           </div>
//           <button className="sp-modal-close" onClick={onClose} disabled={deleting} style={{ color: t.ts }}>×</button>
//         </div>

//         {/* Body */}
//         <div className="sp-modal-body">
//           <p style={{ margin: '0 0 12px', fontSize: 14, color: t.tp, lineHeight: 1.6 }}>
//             This will <strong>permanently delete</strong> everything associated with your account:
//           </p>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
//             {items.map(item => (
//               <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
//                 <span style={{ color: t.tp, fontWeight: 700, fontSize: 15, lineHeight: '20px', flexShrink: 0 }}>•</span>
//                 <span style={{ fontSize: 13.5, color: t.ts, lineHeight: 1.4 }}>{item}</span>
//               </div>
//             ))}
//           </div>
//           <p style={{ margin: 0, fontSize: 13.5, color: t.ts, lineHeight: 1.55 }}>
//             You will be <span style={{ color: '#dc2626', fontWeight: 700 }}>logged out immediately</span>. This cannot be undone.
//           </p>
//         </div>

//         {/* Footer */}
//         <div className="sp-modal-foot sp-del-btns" style={{ borderTop: `1px solid ${t.border}` }}>
//           <button
//             onClick={onConfirm} disabled={deleting}
//             style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: '#dc2626', color: '#fff', fontSize: 14, fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: deleting ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}
//           >
//             {deleting ? <><Spinner />Deleting…</> : 'Yes, Delete Everything'}
//           </button>
//           <button
//             onClick={onClose} disabled={deleting}
//             style={{ padding: '12px 24px', borderRadius: 10, border: `1.5px solid ${t.border2}`, background: 'transparent', color: t.tp, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: deleting ? 0.5 : 1 }}
//           >Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Export Modal ──────────────────────────────────────────────────────────────
// function ExportModal({ onClose, t, userId }: { onClose: () => void; t: ReturnType<typeof useTokens>; userId: string }) {
//   const supabase = createClient();
//   const [selected, setSelected] = useState<Set<ExportSection>>(new Set(['cell','members','attendance','celebrations','programs']));
//   const [format, setFormat]     = useState<ExportFormat>('pdf');
//   const [generating, setGen]    = useState(false);
//   const [genError, setGenError] = useState<string | null>(null);

//   const toggle = (id: ExportSection) =>
//     setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

//   async function fetchData() {
//     const out: Record<string, any[]> = {};
//     if (selected.has('cell')) {
//       const { data } = await supabase.from('cell_profile').select('*').eq('user_id', userId).single();
//       out.cell = data ? [data] : [];
//     }
//     if (selected.has('members')) {
//       const { data } = await supabase.from('members').select('*').eq('user_id', userId);
//       out.members = data ?? [];
//     }
//     if (selected.has('attendance')) {
//       const { data: meetings } = await supabase.from('meetings').select('*').eq('user_id', userId);
//       const { data: records }  = await supabase.from('attendance_records').select('*').eq('user_id', userId);
//       out.meetings   = meetings ?? [];
//       out.attendance = records  ?? [];
//     }
//     if (selected.has('celebrations')) {
//       const { data } = await supabase.from('celebrations').select('*').eq('user_id', userId);
//       out.celebrations = data ?? [];
//     }
//     if (selected.has('programs')) {
//       const { data } = await supabase.from('programs').select('*').eq('user_id', userId);
//       out.programs = data ?? [];
//     }
//     return out;
//   }

//   async function exportXlsx(data: Record<string, any[]>) {
//     if (!(window as any).XLSX) {
//       await new Promise<void>((res, rej) => {
//         const s = document.createElement('script');
//         s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
//         s.onload = () => res(); s.onerror = () => rej(new Error('Failed to load SheetJS'));
//         document.head.appendChild(s);
//       });
//     }
//     const XLSX = (window as any).XLSX;
//     const wb = XLSX.utils.book_new();
//     const lm: Record<string, string> = { cell:'Cell Info', members:'Members', meetings:'Meetings', attendance:'Attendance', celebrations:'Celebrations', programs:'Programs' };
//     for (const [key, rows] of Object.entries(data)) {
//       if (!rows.length) continue;
//       const clean = rows.map((r: any) => { const { id, user_id, ...rest } = r; return rest; });
//       const ws = XLSX.utils.json_to_sheet(clean);
//       ws['!cols'] = Object.keys(clean[0]).map((k: string) => ({ wch: Math.max(k.length, 16) }));
//       XLSX.utils.book_append_sheet(wb, ws, lm[key] ?? key);
//     }
//     XLSX.writeFile(wb, `oasis-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
//   }

//   function exportPdf(data: Record<string, any[]>) {
//     const cellInfo   = data.cell?.[0];
//     const members    = data.members      ?? [];
//     const meetings   = data.meetings     ?? [];
//     const attendance = data.attendance   ?? [];
//     const celebs     = data.celebrations ?? [];
//     const programs   = data.programs     ?? [];
//     const now = new Date();
//     const dtStr  = now.toLocaleString('en-GB', { day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit' });
//     const dayStr = now.toLocaleDateString('en-GB', { weekday:'long',day:'numeric',month:'long',year:'numeric' });
//     const cellName = cellInfo?.cell_name || 'Oasis';
//     const S = {
//       page:'font-family:"Helvetica Neue",Arial,sans-serif;margin:0;padding:0;color:#111;font-size:12px;background:#fff;',
//       wrap:'max-width:680px;margin:0 auto;padding:28px 32px 48px;',
//       hdr:'display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:2.5px solid #111;margin-bottom:32px;',
//       hName:'font-size:26px;font-weight:900;margin:0 0 2px;letter-spacing:-0.5px;',
//       hSub:'font-size:11px;color:#6b7280;margin:0;',
//       hRight:'text-align:right;font-size:11px;line-height:1.7;color:#374151;',
//       hRL:'font-weight:700;font-size:12px;color:#111;',
//       secHdr:'font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;margin:32px 0 10px;',
//       ciWrap:'border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:8px;',
//       ciRow:'display:flex;border-bottom:1px solid #e5e7eb;',
//       ciKey:'width:140px;padding:9px 14px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;background:#f8fafc;flex-shrink:0;',
//       ciVal:'padding:9px 14px;font-size:13px;font-weight:600;color:#111;',
//       tbl:'width:100%;border-collapse:collapse;font-size:12px;',
//       th:'padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;border-bottom:1.5px solid #e5e7eb;',
//       td:'padding:8px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top;',
//       tdAlt:'padding:8px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top;background:#fafafa;',
//       badge:'display:inline-block;background:#f3f4f6;border-radius:20px;padding:1px 8px;font-size:10px;font-weight:700;color:#6b7280;margin-left:8px;vertical-align:middle;',
//       present:'font-weight:700;color:#16a34a;', absent:'font-weight:700;color:#dc2626;',
//       footer:'margin-top:48px;padding-top:14px;border-top:1.5px solid #e5e7eb;display:flex;justify-content:space-between;font-size:10px;color:#9ca3af;',
//     };
//     const ciR = (k: string, v: string) => `<div style="${S.ciRow}"><div style="${S.ciKey}">${k}</div><div style="${S.ciVal}">${v||'—'}</div></div>`;
//     const tR  = (cells: string[], alt: boolean) => `<tr>${cells.map(c => `<td style="${alt?S.tdAlt:S.td}">${c??'—'}</td>`).join('')}</tr>`;
//     const fmt = (d: string|null|undefined) => { if(!d) return '—'; const p=new Date(d); return isNaN(p.getTime())?d:p.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'long',year:'numeric'}); };
//     let body = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${cellName} — Report</title>
// <style>*{box-sizing:border-box;}body{${S.page}}@media print{@page{size:A4;margin:14mm 14mm 18mm;}body{padding:0;}}</style></head><body>
// <div style="${S.wrap}"><div style="${S.hdr}">
// <div><h1 style="${S.hName}">${cellName}</h1><p style="${S.hSub}">Report · Generated ${dayStr}</p></div>
// <div style="${S.hRight}"><div style="${S.hRL}">${cellInfo?.leader_name||''}</div><div>Cell Leader</div>${cellInfo?.email?`<div>${cellInfo.email}</div>`:''} ${cellInfo?.phone?`<div>${cellInfo.phone}</div>`:''}</div></div>`;
//     if (cellInfo) body += `<div style="${S.secHdr}">Cell Information</div><div style="${S.ciWrap}">${ciR('Cell Name',cellInfo.cell_name||'')}${ciR('Cell Leader',cellInfo.leader_name||'')}${ciR('Meeting Day',cellInfo.meeting_day||'')}${ciR('Time',cellInfo.meeting_time||'')}${ciR('Venue',cellInfo.venue||'')}${ciR('Email',cellInfo.email||'')}${ciR('Phone',cellInfo.phone||'')}</div>`;
//     if (selected.has('members')) {
//       body += `<div style="${S.secHdr}">Members <span style="${S.badge}">${members.length}</span></div>`;
//       if (!members.length) body += `<p style="color:#9ca3af;font-size:12px;">No members found.</p>`;
//       else body += `<table style="${S.tbl}"><thead><tr><th style="${S.th}">#</th><th style="${S.th}">Name</th><th style="${S.th}">Phone</th><th style="${S.th}">Gender</th><th style="${S.th}">Join Date</th><th style="${S.th}">Birthday</th></tr></thead><tbody>${members.map((m:any,i:number)=>tR([String(i+1),m.name||'—',m.phone||'—',m.gender||'—',fmt(m.date_joined||m.created_at),fmt(m.date_of_birth||m.birthday)],i%2===1)).join('')}</tbody></table>`;
//     }
//     if (selected.has('attendance')) {
//       body += `<div style="${S.secHdr}">Attendance Records</div>`;
//       if (!meetings.length) body += `<p style="color:#9ca3af;font-size:12px;">No meetings found.</p>`;
//       else meetings.forEach((mtg:any) => {
//         const recs = attendance.filter((a:any) => a.meeting_id === mtg.id);
//         const pc = recs.filter((a:any) => (a.status||'').toLowerCase() === 'present').length;
//         body += `<div style="font-weight:800;font-size:13px;margin:20px 0 6px;">${mtg.title||'Meeting'} · <span style="font-size:11px;color:#6b7280;font-weight:400;">${fmt(mtg.date)}</span> <span style="font-size:11px;color:#6b7280;">${pc}/${recs.length} present</span></div>`;
//         if (!recs.length) body += `<p style="color:#9ca3af;font-size:11px;margin:0 0 12px;">No attendance recorded.</p>`;
//         else body += `<table style="${S.tbl};margin-bottom:16px;"><thead><tr><th style="${S.th}">#</th><th style="${S.th}">Member</th><th style="${S.th}">Status</th></tr></thead><tbody>${recs.map((a:any,i:number)=>{const ip=(a.status||'').toLowerCase()==='present';return`<tr><td style="${i%2===1?S.tdAlt:S.td}">${i+1}</td><td style="${i%2===1?S.tdAlt:S.td}">${a.member_name||a.member_id||'—'}</td><td style="${i%2===1?S.tdAlt:S.td}"><span style="${ip?S.present:S.absent}">${ip?'✓ Present':'✗ Absent'}</span></td></tr>`;}).join('')}</tbody></table>`;
//       });
//     }
//     if (selected.has('celebrations')) {
//       body += `<div style="${S.secHdr}">Celebrations <span style="${S.badge}">${celebs.length}</span></div>`;
//       if (!celebs.length) body += `<p style="color:#9ca3af;font-size:12px;">No celebrations found.</p>`;
//       else body += `<table style="${S.tbl}"><thead><tr><th style="${S.th}">#</th><th style="${S.th}">Name</th><th style="${S.th}">Event</th><th style="${S.th}">Month</th><th style="${S.th}">Day</th></tr></thead><tbody>${celebs.map((c:any,i:number)=>{let m=c.month||'',d=c.day||'';if(!m&&c.date){const dt=new Date(c.date);m=dt.toLocaleString('en-US',{month:'long'});d=String(dt.getDate()).padStart(2,'0');}return tR([String(i+1),c.name||'—',c.event||'—',m||'—',d||'—'],i%2===1);}).join('')}</tbody></table>`;
//     }
//     if (selected.has('programs')) {
//       body += `<div style="${S.secHdr}">Programs <span style="${S.badge}">${programs.length}</span></div>`;
//       if (!programs.length) body += `<p style="color:#9ca3af;font-size:12px;">No programs found.</p>`;
//       else body += `<table style="${S.tbl}"><thead><tr><th style="${S.th}">#</th><th style="${S.th}">Title</th><th style="${S.th}">Date</th><th style="${S.th}">Time</th><th style="${S.th}">Venue</th></tr></thead><tbody>${programs.map((p:any,i:number)=>tR([String(i+1),p.title||'—',fmt(p.date),p.time||p.meeting_time||'—',p.venue||'—'],i%2===1)).join('')}</tbody></table>`;
//     }
//     body += `<div style="${S.footer}"><span>${cellName}</span><span>${dtStr}</span></div></div></body></html>`;
//     const win = window.open('', '_blank');
//     if (!win) { alert('Please allow popups for this page to generate the PDF.'); return; }
//     win.document.write(body); win.document.close(); win.focus();
//     setTimeout(() => win.print(), 500);
//   }

//   async function handleGenerate() {
//     setGen(true); setGenError(null);
//     try {
//       const data = await fetchData();
//       if (format === 'xlsx') await exportXlsx(data); else exportPdf(data);
//       onClose();
//     } catch (err: any) {
//       setGenError(err.message ?? 'Export failed. Please try again.');
//     } finally { setGen(false); }
//   }

//   return (
//     <div className="sp-modal-overlay" style={{ background: t.overlay, backdropFilter: 'blur(4px)' }} onClick={onClose}>
//       <div className="sp-modal-box" onClick={e => e.stopPropagation()} style={{ background: t.modalBg, border: `1px solid ${t.border}` }}>

//         <div className="sp-modal-head" style={{ borderBottom: `1px solid ${t.border}` }}>
//           <div>
//             <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.tp }}>Export Report</h2>
//             <p style={{ margin: '4px 0 0', fontSize: 13, color: t.ts }}>Choose sections and format.</p>
//           </div>
//           <button className="sp-modal-close" onClick={onClose} style={{ color: t.ts }}>×</button>
//         </div>

//         <div className="sp-modal-body">
//           {genError && <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', fontSize: 13 }}>{genError}</div>}

//           <p style={{ margin: '0 0 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: t.ts, textTransform: 'uppercase' }}>Include Sections</p>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
//             {EXPORT_SECTIONS.map(s => {
//               const on = selected.has(s.id);
//               return (
//                 <button key={s.id} onClick={() => toggle(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 13px', borderRadius: 11, cursor: 'pointer', textAlign: 'left', background: on ? t.checkBg : t.cardBg2, border: `1.5px solid ${on ? t.checkBd : t.border}`, transition: 'all 0.12s', fontFamily: 'inherit' }}>
//                   <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: `2px solid ${on ? t.checkOn : t.border2}`, background: on ? t.checkOn : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     {on && <IconCheck c="#fff" />}
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 14, fontWeight: 600, color: t.tp }}>{s.label}</div>
//                     <div style={{ fontSize: 12, color: t.ts, marginTop: 1 }}>{s.sub}</div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           <p style={{ margin: '18px 0 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: t.ts, textTransform: 'uppercase' }}>Format</p>
//           <div className="sp-fmt-grid">
//             {(['xlsx', 'pdf'] as ExportFormat[]).map(f => {
//               const on = format === f;
//               return (
//                 <button key={f} onClick={() => setFormat(f)} style={{ padding: '16px 12px', borderRadius: 12, cursor: 'pointer', background: on ? t.fmtOnBg : t.cardBg2, border: `1.5px solid ${on ? t.fmtOnBd : t.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, transition: 'all 0.12s', fontFamily: 'inherit' }}>
//                   {f === 'xlsx'
//                     ? <svg viewBox="0 0 24 24" fill="none" stroke={on ? t.fmtOnTxt : t.ts} strokeWidth={1.5} style={{ width: 24, height: 24 }}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
//                     : <svg viewBox="0 0 24 24" fill="none" stroke={on ? t.fmtOnTxt : t.ts} strokeWidth={1.5} style={{ width: 24, height: 24 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
//                   }
//                   <div style={{ fontSize: 12, fontWeight: 700, color: on ? t.fmtOnTxt : t.ts, textAlign: 'center' }}>{f === 'xlsx' ? 'Excel (.xlsx)' : 'A4 Print / PDF'}</div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="sp-modal-foot" style={{ borderTop: `1px solid ${t.border}` }}>
//           <button onClick={handleGenerate} disabled={generating || selected.size === 0} style={{ padding: '12px 20px', borderRadius: 10, border: 'none', background: '#16a34a', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, opacity: (generating || selected.size === 0) ? 0.65 : 1, fontFamily: 'inherit', flex: 1, justifyContent: 'center' }}>
//             {generating ? <><Spinner />Generating…</> : <><IconDownload c="#fff" />Generate Report</>}
//           </button>
//           <button onClick={onClose} style={{ padding: '12px 20px', borderRadius: 10, border: `1px solid ${t.border2}`, background: 'transparent', color: t.ts, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Edit Modal ────────────────────────────────────────────────────────────────
// function EditModal({ form, setForm, onSave, onClose, saving, uploadingImg, onImageClick, fileInputRef, onImageChange, t }: {
//   form: Omit<CellProfile, 'id' | 'user_id'>;
//   setForm: React.Dispatch<React.SetStateAction<Omit<CellProfile, 'id' | 'user_id'>>>;
//   onSave: (e: React.FormEvent) => void;
//   onClose: () => void;
//   saving: boolean; uploadingImg: boolean;
//   onImageClick: () => void;
//   fileInputRef: React.RefObject<HTMLInputElement | null>;
//   onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   t: ReturnType<typeof useTokens>;
// }) {
//   const fields: { label: string; key: keyof typeof defaultProfile; full?: boolean; placeholder: string }[] = [
//     { label: 'Cell Name',      key: 'cell_name',    placeholder: 'e.g. Oasis Cell'          },
//     { label: 'Cell Leader',    key: 'leader_name',  placeholder: 'e.g. John Doe'            },
//     { label: 'Meeting Day(s)', key: 'meeting_day',  placeholder: 'e.g. Tuesdays & Fridays', full: true },
//     { label: 'Time',           key: 'meeting_time', placeholder: 'e.g. 9AM'                 },
//     { label: 'Venue',          key: 'venue',        placeholder: 'e.g. Onsite / Zoom'       },
//     { label: 'Email',          key: 'email',        placeholder: 'e.g. cell@example.com'    },
//     { label: 'Phone No',       key: 'phone',        placeholder: 'e.g. 08012345678'         },
//   ];

//   const inputStyle: React.CSSProperties = {
//     width: '100%', padding: '11px 13px', borderRadius: 10,
//     border: `1.5px solid ${t.inputBd}`, background: t.inputBg,
//     color: t.tp, fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
//   };

//   return (
//     <div className="sp-modal-overlay" style={{ background: t.overlay, backdropFilter: 'blur(4px)' }} onClick={onClose}>
//       <div className="sp-modal-box sp-modal-box-lg" onClick={e => e.stopPropagation()} style={{ background: t.modalBg, border: `1px solid ${t.border}` }}>

//         <div className="sp-modal-head" style={{ borderBottom: `1px solid ${t.border}` }}>
//           <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.tp }}>Edit Profile</h2>
//           <button className="sp-modal-close" onClick={onClose} style={{ color: t.ts }}>×</button>
//         </div>

//         <form onSubmit={onSave} style={{ overflowY: 'auto', flex: 1, padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>
//           {/* Avatar */}
//           <div style={{ display: 'flex', justifyContent: 'center' }}>
//             <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onImageClick}>
//               <div style={{ width: 84, height: 84, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${t.cyan}`, background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 {form.image_url ? <img src={form.image_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconPerson c={t.ts} />}
//               </div>
//               <div style={{ position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: '50%', background: t.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${t.modalBg}` }}>
//                 {uploadingImg ? <Spinner size={10} /> : <IconCamera c="#fff" />}
//               </div>
//             </div>
//             <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onImageChange} />
//           </div>

//           {/* Fields */}
//           <div className="sp-field-grid">
//             {fields.map(({ label, key, full, placeholder }) =>
//               key !== 'image_url' && (
//                 <div key={key} className={full ? 'sp-field-full' : ''}>
//                   <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', color: t.ts, textTransform: 'uppercase', marginBottom: 5 }}>{label}</label>
//                   <input
//                     type="text"
//                     value={(form[key] as string) || ''}
//                     placeholder={placeholder}
//                     onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
//                     style={inputStyle}
//                     onFocus={e => (e.target.style.borderColor = t.cyan)}
//                     onBlur={e => (e.target.style.borderColor = t.inputBd)}
//                   />
//                 </div>
//               )
//             )}
//           </div>

//           <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4, borderTop: `1px solid ${t.border}`, marginTop: 4 }}>
//             <button type="submit" disabled={saving} style={{ padding: '12px 26px', borderRadius: 10, border: 'none', background: t.tp, color: t.cardBg, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1, fontFamily: 'inherit' }}>
//               {saving ? 'Saving…' : 'Save Changes'}
//             </button>
//             <button type="button" onClick={onClose} style={{ padding: '12px 26px', borderRadius: 10, border: `1px solid ${t.border2}`, background: 'transparent', color: t.ts, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function SettingsPage() {
//   const { isDark } = useTheme();
//   const t          = useTokens(isDark);
//   const supabase   = createClient();
//   const router     = useRouter();

//   const [profile,      setProfile]      = useState<CellProfile | null>(null);
//   const [form,         setForm]         = useState(defaultProfile);
//   const [loading,      setLoading]      = useState(true);
//   const [saving,       setSaving]       = useState(false);
//   const [deleting,     setDeleting]     = useState(false);
//   const [uploadingImg, setUploadingImg] = useState(false);
//   const [successMsg,   setSuccessMsg]   = useState<string | null>(null);
//   const [errorMsg,     setErrorMsg]     = useState<string | null>(null);
//   const [editOpen,     setEditOpen]     = useState(false);
//   const [exportOpen,   setExportOpen]   = useState(false);
//   const [deleteOpen,   setDeleteOpen]   = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const channelRef   = useRef<ReturnType<typeof supabase.channel> | null>(null);

//   useEffect(() => {
//     let mounted = true;
//     async function loadProfile() {
//       setLoading(true);
//       const { data: { user }, error: userErr } = await supabase.auth.getUser();
//       if (userErr || !user) { router.push('/login'); return; }

//       let { data, error } = await supabase.from('cell_profile').select('*').eq('user_id', user.id).single();
//       if (error && error.code === 'PGRST116') {
//         const { data: ins, error: insErr } = await supabase
//           .from('cell_profile')
//           .upsert({ user_id: user.id, ...defaultProfile } as any, { onConflict: 'user_id' })
//           .select().single();
//         if (insErr) { setErrorMsg('Could not load settings.'); setLoading(false); return; }
//         data = ins;
//       } else if (error) {
//         setErrorMsg('Could not load settings.'); setLoading(false); return;
//       }

//       if (!mounted) return;
//       setProfile(data); syncForm(data); setLoading(false);

//       if (channelRef.current) supabase.removeChannel(channelRef.current);
//       channelRef.current = supabase
//         .channel('settings-profile')
//         .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cell_profile', filter: `user_id=eq.${user.id}` },
//           payload => { if (!mounted) return; const u = payload.new as CellProfile; setProfile(u); syncForm(u); })
//         .subscribe();
//     }
//     loadProfile();
//     return () => { mounted = false; if (channelRef.current) supabase.removeChannel(channelRef.current); };
//   }, []);

//   function syncForm(d: any) {
//     setForm({
//       cell_name: d.cell_name||'', leader_name: d.leader_name||'',
//       phone: d.phone||'', email: d.email||'', address: d.address||'',
//       meeting_day: d.meeting_day||'', meeting_time: d.meeting_time||'',
//       venue: d.venue||'', image_url: d.image_url||null,
//     });
//   }

//   async function handleSave(e: React.FormEvent) {
//     e.preventDefault();
//     if (!profile) return;
//     setSaving(true); setSuccessMsg(null); setErrorMsg(null);
//     const extPayload = { cell_name:form.cell_name, leader_name:form.leader_name, phone:form.phone, email:form.email, address:form.address, meeting_day:form.meeting_day, meeting_time:form.meeting_time, venue:form.venue };
//     const basePayload = { cell_name:form.cell_name, leader_name:form.leader_name, phone:form.phone, email:form.email, address:form.address };
//     let { error } = await supabase.from('cell_profile').update(extPayload as any).eq('user_id', profile.user_id);
//     if (error && error.message.includes('column')) {
//       const fb = await supabase.from('cell_profile').update(basePayload as any).eq('user_id', profile.user_id);
//       error = fb.error;
//     }
//     setSaving(false);
//     if (error) setErrorMsg('Save failed: ' + error.message);
//     else { setSuccessMsg('Profile saved!'); setEditOpen(false); setTimeout(() => setSuccessMsg(null), 3000); }
//   }

//   async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file || !profile) return;
//     setUploadingImg(true); setErrorMsg(null);
//     const ext = file.name.split('.').pop();
//     const filePath = `${profile.user_id}/cell-logo.${ext}`;
//     await supabase.storage.from('cell-images').remove([filePath]);
//     const { error: upErr } = await supabase.storage.from('cell-images').upload(filePath, file, { upsert: true });
//     if (upErr) { setErrorMsg('Upload failed: ' + upErr.message); setUploadingImg(false); return; }
//     const { data: urlData } = supabase.storage.from('cell-images').getPublicUrl(filePath);
//     const publicUrl = urlData.publicUrl + `?v=${Date.now()}`;
//     const { error: updErr } = await supabase.from('cell_profile').update({ image_url: publicUrl } as any).eq('user_id', profile.user_id);
//     if (updErr) setErrorMsg('Could not save image URL.');
//     else { setForm(prev => ({ ...prev, image_url: publicUrl })); setSuccessMsg('Photo updated!'); setTimeout(() => setSuccessMsg(null), 3000); }
//     setUploadingImg(false);
//   }

//   async function handleDeleteAccount() {
//     if (!profile?.user_id) { setErrorMsg('No active profile found. Please refresh.'); return; }
//     setDeleting(true); setErrorMsg(null);
//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) throw new Error('No active session. Please log in again.');
//       const tables = ['attendance_records','celebrations','programs','meetings','members','cell_profile'] as const;
//       for (const table of tables) {
//         const { error } = await supabase.from(table).delete().eq('user_id', profile.user_id);
//         if (error) console.warn(`Could not delete ${table}:`, error.message);
//       }
//       const controller = new AbortController();
//       const timeout = setTimeout(() => controller.abort(), 10000);
//       const res = await fetch('/api/delete-account', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
//         signal: controller.signal,
//       });
//       clearTimeout(timeout);
//       if (!res.ok) {
//         const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
//         throw new Error(body.error ?? `Server error ${res.status}`);
//       }
//       await supabase.auth.signOut();
//       window.location.replace('/');
//     } catch (err: any) {
//       setDeleting(false); setDeleteOpen(false);
//       setErrorMsg(err.name === 'AbortError' ? 'Request timed out. Please try again.' : 'Delete failed: ' + (err.message ?? 'Unknown error'));
//     }
//   }

//   if (loading) {
//     return (
//       <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:260 }}>
//         <style>{RESPONSIVE_CSS}</style>
//         <div style={{ width:36, height:36, border:`3px solid #22252f`, borderTopColor:'#06b6d4', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
//       </div>
//     );
//   }

//   const infoCards = [
//     { icon: <IconPerson c={t.ts} />,   label: 'Cell Name',   value: form.cell_name    },
//     { icon: <IconPerson c={t.ts} />,   label: 'Cell Leader', value: form.leader_name  },
//     { icon: <IconCalendar c={t.ts} />, label: 'Meeting Day', value: form.meeting_day  },
//     { icon: <IconClock c={t.ts} />,    label: 'Time',        value: form.meeting_time },
//     { icon: <IconPin c={t.ts} />,      label: 'Venue',       value: form.venue        },
//     { icon: <IconMail c={t.ts} />,     label: 'Email',       value: form.email        },
//     { icon: <IconPhone c={t.ts} />,    label: 'Phone',       value: form.phone        },
//   ];

//   return (
//     <>
//       <style>{RESPONSIVE_CSS}</style>

//       <div className="sp-page" style={{ background: t.pageBg }}>
//         <div className="sp-inner">

//           {/* Heading */}
//           <div style={{ marginBottom: 24 }}>
//             <h1 style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 900, color: t.tp, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>Settings</h1>
//             <p style={{ margin: '5px 0 0', fontSize: 13, color: t.ts }}>Manage your cell profile, reports and account</p>
//           </div>

//           {/* Toasts */}
//           {successMsg && (
//             <div style={{ marginBottom: 14, padding: '11px 14px', borderRadius: 12, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.28)', color: '#16a34a', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.2s ease' }}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 15, height: 15, flexShrink: 0 }}><path d="M20 6 9 17l-5-5"/></svg>
//               {successMsg}
//             </div>
//           )}
//           {errorMsg && (
//             <div style={{ marginBottom: 14, padding: '11px 14px', borderRadius: 12, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
//               <span style={{ flex: 1 }}>{errorMsg}</span>
//               <button onClick={() => setErrorMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 20, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
//             </div>
//           )}

//           {/* ── Profile Card ── */}
//           <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 'clamp(14px, 3vw, 24px) clamp(14px, 3vw, 26px)', marginBottom: 12, boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}>

//             {/* Avatar + name + edit */}
//             <div className="sp-profile-header">
//               <div className="sp-avatar-wrap">
//                 <div className="sp-avatar" style={{ border: `2.5px solid ${t.cyan}`, background: t.iconBg }}>
//                   {form.image_url ? <img src={form.image_url} alt="Cell" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <IconPerson c={t.ts} />}
//                 </div>
//                 <div style={{ minWidth: 0 }}>
//                   <div className="sp-cell-name" style={{ color: t.tp }}>{form.cell_name || 'Your Cell'}</div>
//                   <div className="sp-cell-leader" style={{ color: t.ts }}>Leader: {form.leader_name || '—'}</div>
//                 </div>
//               </div>
//               <button
//                 className="sp-edit-btn"
//                 onClick={() => setEditOpen(true)}
//                 style={{ border: `1.5px solid ${t.border2}`, background: 'transparent', color: t.tp, fontFamily: 'inherit' }}
//                 onMouseEnter={e => (e.currentTarget.style.background = t.hoverBg)}
//                 onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
//               >
//                 <IconEdit c={t.tp} /> Edit
//               </button>
//             </div>

//             {/* Info grid */}
//             <div className="sp-info-grid">
//               {infoCards.map((c, i) => (
//                 <InfoCard
//                   key={c.label}
//                   icon={c.icon}
//                   label={c.label}
//                   value={c.value}
//                   t={t}
//                   // Last card spans full width on desktop when total is odd
//                   fullWidth={i === infoCards.length - 1 && infoCards.length % 2 === 1}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* ── Action Cards ── */}
//           <div className="sp-action-grid">

//             {/* Export Report */}
//             <button
//               className="sp-action-card"
//               onClick={() => setExportOpen(true)}
//               style={{ background: t.cardBg, border: `1px solid ${t.border}`, fontFamily: 'inherit', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}
//               onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#16a34a'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
//               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'; }}
//             >
//               <div className="sp-action-icon" style={{ background: 'rgba(22,163,74,0.12)' }}>
//                 <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} style={{ width: 20, height: 20 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
//               </div>
//               <div>
//                 <div className="sp-action-title" style={{ color: t.tp }}>Export Report</div>
//                 <div className="sp-action-sub" style={{ color: t.ts }}>Download Excel or A4 PDF with selected data</div>
//               </div>
//             </button>

//             {/* Delete Account */}
//             <button
//               className="sp-action-card"
//               onClick={() => setDeleteOpen(true)}
//               disabled={deleting}
//               style={{ background: isDark ? 'rgba(127,29,29,0.18)' : 'rgba(254,242,242,1)', border: `1px solid ${isDark ? 'rgba(185,28,28,0.3)' : 'rgba(252,165,165,0.6)'}`, fontFamily: 'inherit', opacity: deleting ? 0.6 : 1, boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)' }}
//               onMouseEnter={e => { if (!deleting) { (e.currentTarget as HTMLElement).style.borderColor = '#dc2626'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(220,38,38,0.1)'; } }}
//               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isDark ? 'rgba(185,28,28,0.3)' : 'rgba(252,165,165,0.6)'; (e.currentTarget as HTMLElement).style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)'; }}
//             >
//               <div className="sp-action-icon" style={{ background: 'rgba(220,38,38,0.12)' }}>
//                 <IconTrash c="#dc2626" />
//               </div>
//               <div>
//                 <div className="sp-action-title" style={{ color: '#dc2626' }}>{deleting ? 'Deleting…' : 'Delete Account'}</div>
//                 <div className="sp-action-sub" style={{ color: t.ts }}>Permanently delete all cell data and log out</div>
//               </div>
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* ── Modals ── */}
//       {editOpen && (
//         <EditModal
//           form={form} setForm={setForm} onSave={handleSave} onClose={() => setEditOpen(false)}
//           saving={saving} uploadingImg={uploadingImg}
//           onImageClick={() => fileInputRef.current?.click()}
//           fileInputRef={fileInputRef} onImageChange={handleImageUpload} t={t}
//         />
//       )}
//       {exportOpen && <ExportModal onClose={() => setExportOpen(false)} t={t} userId={profile?.user_id ?? ''} />}
//       {deleteOpen && (
//         <DeleteConfirmModal
//           onConfirm={handleDeleteAccount}
//           onClose={() => { if (!deleting) setDeleteOpen(false); }}
//           deleting={deleting} t={t}
//         />
//       )}
//     </>
//   );
// }
























'use client';

// app/dashboard/settings/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Multi-tenant · Light default · Dark via useTheme · Fully responsive
//
// Required DB migration (run once in Supabase SQL editor):
//   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS meeting_day  text DEFAULT '';
//   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS meeting_time text DEFAULT '';
//   ALTER TABLE cell_profile ADD COLUMN IF NOT EXISTS venue        text DEFAULT '';
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/components/ThemeProvider';

// ── Types ─────────────────────────────────────────────────────────────────────
type CellProfile = {
  id: number;
  user_id: string;
  cell_name: string;
  leader_name: string;
  phone: string;
  email: string;
  address: string;
  meeting_day: string;
  meeting_time: string;
  venue: string;
  image_url: string | null;
};

const defaultProfile: Omit<CellProfile, 'id' | 'user_id'> = {
  cell_name: '', leader_name: '', phone: '', email: '',
  address: '', meeting_day: '', meeting_time: '', venue: '', image_url: null,
};

type ExportSection = 'cell' | 'members' | 'attendance' | 'celebrations' | 'programs';
type ExportFormat  = 'xlsx' | 'pdf';

const EXPORT_SECTIONS: { id: ExportSection; label: string; sub: string }[] = [
  { id: 'cell',         label: 'Cell Information',  sub: 'Name, leader, venue, contact details' },
  { id: 'members',      label: 'Members List',       sub: 'All member names & phone numbers'     },
  { id: 'attendance',   label: 'Attendance Records', sub: 'All meetings with per-member status'  },
  { id: 'celebrations', label: 'Celebrations',       sub: 'Birthdays & anniversaries'            },
  { id: 'programs',     label: 'Programs',           sub: 'All scheduled programs & events'      },
];

// ── Theme tokens ──────────────────────────────────────────────────────────────
function useTokens(isDark: boolean) {
  return {
    pageBg:   isDark ? '#0d0f14' : '#f0f2f5',
    cardBg:   isDark ? '#151720' : '#ffffff',
    cardBg2:  isDark ? '#1a1d26' : '#f8f9fb',
    border:   isDark ? '#22252f' : '#e8eaed',
    border2:  isDark ? '#2a2e3a' : '#dde0e6',
    tp:       isDark ? '#f1f2f5' : '#0f1117',
    ts:       isDark ? '#9ca3af' : '#6b7280',
    tss:      isDark ? '#4b5563' : '#9ca3af',
    iconBg:   isDark ? '#1e2130' : '#eef0f4',
    inputBg:  isDark ? '#1a1d26' : '#f4f5f8',
    inputBd:  isDark ? '#2a2e3a' : '#dde0e6',
    hoverBg:  isDark ? '#1e2130' : '#f0f2f6',
    modalBg:  isDark ? '#13151d' : '#ffffff',
    overlay:  isDark ? 'rgba(0,0,0,0.80)' : 'rgba(0,0,0,0.50)',
    checkOn:  isDark ? '#6366f1' : '#4f46e5',
    checkBg:  isDark ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.07)',
    checkBd:  isDark ? 'rgba(99,102,241,0.4)'  : 'rgba(79,70,229,0.3)',
    fmtOnBg:  isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
    fmtOnBd:  isDark ? '#3b82f6' : '#2563eb',
    fmtOnTxt: isDark ? '#60a5fa' : '#2563eb',
    cyan:     '#06b6d4',
  };
}

// ── CSS (injected once, uses real media queries) ───────────────────────────────
const RESPONSIVE_CSS = `
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }

  *, *::before, *::after { box-sizing: border-box; }
  input::placeholder { color: #9ca3af; }

  /* ── Page wrapper ── */
  .sp-page   { min-height: 100vh; font-family: 'DM Sans', system-ui, sans-serif; }
  .sp-inner  { max-width: 940px; margin: 0 auto; padding: 36px 20px 60px; }

  /* ── Profile card ── */
  .sp-profile-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
  .sp-avatar-wrap    { display: flex; align-items: center; gap: 16px; min-width: 0; }
  .sp-avatar         { width: 62px; height: 62px; border-radius: 14px; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .sp-cell-name      { font-size: 20px; font-weight: 800; letter-spacing: -0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sp-cell-leader    { font-size: 13px; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sp-edit-btn       { display: flex; align-items: center; gap: 7px; padding: 10px 20px; border-radius: 11px; font-size: 14px; font-weight: 700; cursor: pointer; flex-shrink: 0; white-space: nowrap; transition: background 0.15s; }

  /* ── Info cards grid ── */
  .sp-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .sp-info-card { border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
  .sp-info-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .sp-info-label{ font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 3px; }
  .sp-info-value{ font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ── Action cards grid ── */
  .sp-action-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .sp-action-card { border-radius: 20px; padding: 28px 26px; cursor: pointer; text-align: left; font-family: inherit; transition: border-color 0.15s, box-shadow 0.15s; display: flex; flex-direction: column; align-items: flex-start; gap: 0; }
  .sp-action-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; flex-shrink: 0; }
  .sp-action-title{ font-size: 17px; font-weight: 800; margin-bottom: 4px; }
  .sp-action-sub  { font-size: 13px; line-height: 1.5; }

  /* ── Modal ── */
  .sp-modal-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .sp-modal-box     { border-radius: 18px; width: 100%; max-width: 540px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 32px 80px rgba(0,0,0,0.25); animation: slideUp 0.18s ease; }
  .sp-modal-box-lg  { max-width: 620px; max-height: 92vh; }
  .sp-modal-head    { padding: 22px 26px 18px; display: flex; justify-content: space-between; align-items: flex-start; flex-shrink: 0; }
  .sp-modal-body    { overflow-y: auto; flex: 1; padding: 18px 26px; }
  .sp-modal-foot    { padding: 14px 26px; display: flex; gap: 10px; justify-content: flex-end; flex-shrink: 0; }
  .sp-modal-close   { background: none; border: none; cursor: pointer; font-size: 24px; line-height: 1; padding: 2px; }

  /* Edit form grid */
  .sp-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .sp-field-full { grid-column: 1 / -1; }

  /* Export format grid */
  .sp-fmt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  /* ── TABLET (≤ 768px) ── */
  @media (max-width: 768px) {
    .sp-inner       { padding: 28px 16px 52px; }
    .sp-action-card { padding: 22px 18px; flex-direction: row; align-items: center; gap: 14px; }
    .sp-action-icon { margin-bottom: 0; width: 44px; height: 44px; }
    .sp-action-title{ font-size: 15px; }
  }

  /* ── MOBILE (≤ 540px) ── */
  @media (max-width: 540px) {
    .sp-inner        { padding: 20px 12px 48px; }
    .sp-avatar        { width: 48px; height: 48px; border-radius: 12px; }
    .sp-cell-name     { font-size: 15px; }
    .sp-cell-leader   { font-size: 12px; }
    .sp-edit-btn      { padding: 8px 13px; font-size: 13px; gap: 5px; }

    /* Info grid: single column on mobile */
    .sp-info-grid    { grid-template-columns: 1fr; gap: 7px; }
    .sp-info-card    { padding: 12px 14px; gap: 12px; }
    .sp-info-icon    { width: 34px; height: 34px; border-radius: 9px; }
    .sp-info-label   { font-size: 10px; }
    .sp-info-value   { font-size: 13px; }
    .sp-info-spacer  { display: none; }

    /* Action cards: single column, horizontal layout */
    .sp-action-grid  { grid-template-columns: 1fr; gap: 9px; }
    .sp-action-card  { padding: 16px 14px; }
    .sp-action-icon  { width: 38px; height: 38px; border-radius: 11px; }
    .sp-action-title { font-size: 14px; }
    .sp-action-sub   { font-size: 12px; }

    /* Modals go full-screen */
    .sp-modal-overlay { padding: 0; align-items: flex-end; background: transparent !important; backdrop-filter: none !important; }
    .sp-modal-box     { max-width: 100%; max-height: 95vh; border-radius: 20px 20px 0 0; box-shadow: 0 -8px 40px rgba(0,0,0,0.3); animation: slideUp 0.22s ease; }
    .sp-modal-box-lg  { max-width: 100%; max-height: 97vh; }
    .sp-modal-head    { padding: 18px 18px 14px; }
    .sp-modal-body    { padding: 14px 18px; }
    .sp-modal-foot    { padding: 12px 18px 20px; flex-direction: column-reverse; }
    .sp-modal-foot button { width: 100%; justify-content: center; }

    /* Edit modal: single column fields */
    .sp-field-grid   { grid-template-columns: 1fr; }
    .sp-field-full   { grid-column: 1; }

    /* Delete modal button order */
    .sp-del-btns     { flex-direction: column; }
  }

  /* ── TINY (≤ 360px) ── */
  @media (max-width: 360px) {
    .sp-inner        { padding: 14px 10px 44px; }
    .sp-info-card    { padding: 10px 12px; gap: 10px; }
    .sp-info-icon    { width: 30px; height: 30px; }
    .sp-info-label   { font-size: 9px; }
    .sp-info-value   { font-size: 12px; }
    .sp-edit-btn      { padding: 7px 10px; font-size: 12px; }
  }
`;

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const ic = (color: string) => ({ viewBox: '0 0 24 24', fill: 'none' as const, stroke: color, strokeWidth: 1.8, style: { width: 18, height: 18 } as React.CSSProperties });
function IconPerson({ c }: { c: string })   { return <svg {...ic(c)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function IconCalendar({ c }: { c: string }) { return <svg {...ic(c)}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function IconClock({ c }: { c: string })    { return <svg {...ic(c)}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>; }
function IconPin({ c }: { c: string })      { return <svg {...ic(c)}><path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function IconMail({ c }: { c: string })     { return <svg {...ic(c)}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>; }
function IconPhone({ c }: { c: string })    { return <svg {...ic(c)}><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 5.18 2 2 0 0 1 5.09 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z"/></svg>; }
function IconEdit({ c }: { c: string })     { return <svg {...ic(c)}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function IconDownload({ c }: { c: string }) { return <svg {...ic(c)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
function IconTrash({ c }: { c: string })    { return <svg {...ic(c)}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
function IconCheck({ c }: { c: string })    { return <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={3} style={{ width: 12, height: 12 }}><path d="M20 6 9 17l-5-5"/></svg>; }
function IconCamera({ c }: { c: string })   { return <svg {...ic(c)}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ size = 14, color = '#fff' }: { size?: number; color?: string }) {
  return <div style={{ width: size, height: size, border: `2px solid ${color}33`, borderTopColor: color, borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />;
}

// ── Info Card ─────────────────────────────────────────────────────────────────
function InfoCard({ icon, label, value, t, fullWidth }: { icon: React.ReactNode; label: string; value: string; t: ReturnType<typeof useTokens>; fullWidth?: boolean }) {
  return (
    <div className="sp-info-card" style={{ background: t.cardBg2, border: `1px solid ${t.border}`, gridColumn: fullWidth ? '1 / -1' : undefined }}>
      <div className="sp-info-icon" style={{ background: t.iconBg }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div className="sp-info-label" style={{ color: t.ts }}>{label}</div>
        <div className="sp-info-value" style={{ color: t.tp }}>{value || '—'}</div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteConfirmModal({ onConfirm, onClose, deleting, t }: {
  onConfirm: () => void; onClose: () => void; deleting: boolean; t: ReturnType<typeof useTokens>;
}) {
  const items = [
    'All members & their data',
    'All attendance records & meetings',
    'All celebrations & programs',
    'Cell profile information',
    'Your login email & account',
  ];
  return (
    <div
      className="sp-modal-overlay"
      style={{ background: t.overlay, backdropFilter: 'blur(6px)', zIndex: 2000 }}
      onClick={() => { if (!deleting) onClose(); }}
    >
      <div
        className="sp-modal-box"
        onClick={e => e.stopPropagation()}
        style={{ background: t.modalBg, border: `1px solid ${t.border}` }}
      >
        {/* Header */}
        <div className="sp-modal-head" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(220,38,38,0.12)', border: '1.5px solid rgba(220,38,38,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} style={{ width: 20, height: 20 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#dc2626' }}>Delete Account?</h2>
          </div>
          <button className="sp-modal-close" onClick={onClose} disabled={deleting} style={{ color: t.ts }}>×</button>
        </div>

        {/* Body */}
        <div className="sp-modal-body">
          <p style={{ margin: '0 0 12px', fontSize: 14, color: t.tp, lineHeight: 1.6 }}>
            This will <strong>permanently delete</strong> everything associated with your account:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            {items.map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: t.tp, fontWeight: 700, fontSize: 15, lineHeight: '20px', flexShrink: 0 }}>•</span>
                <span style={{ fontSize: 13.5, color: t.ts, lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: t.ts, lineHeight: 1.55 }}>
            You will be <span style={{ color: '#dc2626', fontWeight: 700 }}>logged out immediately</span>. This cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="sp-modal-foot sp-del-btns" style={{ borderTop: `1px solid ${t.border}` }}>
          <button
            onClick={onConfirm} disabled={deleting}
            style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: '#dc2626', color: '#fff', fontSize: 14, fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: deleting ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {deleting ? <><Spinner />Deleting…</> : 'Yes, Delete Everything'}
          </button>
          <button
            onClick={onClose} disabled={deleting}
            style={{ padding: '12px 24px', borderRadius: 10, border: `1.5px solid ${t.border2}`, background: 'transparent', color: t.tp, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: deleting ? 0.5 : 1 }}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Export Modal ──────────────────────────────────────────────────────────────
function ExportModal({ onClose, t, userId }: { onClose: () => void; t: ReturnType<typeof useTokens>; userId: string }) {
  const supabase = createClient();
  const [selected, setSelected] = useState<Set<ExportSection>>(new Set(['cell','members','attendance','celebrations','programs']));
  const [format, setFormat]     = useState<ExportFormat>('pdf');
  const [generating, setGen]    = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const toggle = (id: ExportSection) =>
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  async function fetchData() {
    const out: Record<string, any[]> = {};
    if (selected.has('cell')) {
      const { data } = await supabase.from('cell_profile').select('*').eq('user_id', userId).single();
      out.cell = data ? [data] : [];
    }
    if (selected.has('members')) {
      const { data } = await supabase.from('members').select('*').eq('user_id', userId);
      out.members = data ?? [];
    }
    if (selected.has('attendance')) {
      const { data: meetings } = await supabase.from('meetings').select('*').eq('user_id', userId);
      const { data: records }  = await supabase.from('attendance_records').select('*').eq('user_id', userId);
      out.meetings   = meetings ?? [];
      out.attendance = records  ?? [];
    }
    if (selected.has('celebrations')) {
      const { data } = await supabase.from('celebrations').select('*').eq('user_id', userId);
      out.celebrations = data ?? [];
    }
    if (selected.has('programs')) {
      const { data } = await supabase.from('programs').select('*').eq('user_id', userId);
      out.programs = data ?? [];
    }
    return out;
  }

  async function exportXlsx(data: Record<string, any[]>) {
    if (!(window as any).XLSX) {
      await new Promise<void>((res, rej) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        s.onload = () => res(); s.onerror = () => rej(new Error('Failed to load SheetJS'));
        document.head.appendChild(s);
      });
    }
    const XLSX = (window as any).XLSX;
    const wb = XLSX.utils.book_new();
    const lm: Record<string, string> = { cell:'Cell Info', members:'Members', meetings:'Meetings', attendance:'Attendance', celebrations:'Celebrations', programs:'Programs' };
    for (const [key, rows] of Object.entries(data)) {
      if (!rows.length) continue;
      const clean = rows.map((r: any) => { const { id, user_id, ...rest } = r; return rest; });
      const ws = XLSX.utils.json_to_sheet(clean);
      ws['!cols'] = Object.keys(clean[0]).map((k: string) => ({ wch: Math.max(k.length, 16) }));
      XLSX.utils.book_append_sheet(wb, ws, lm[key] ?? key);
    }
    XLSX.writeFile(wb, `oasis-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  function exportPdf(data: Record<string, any[]>) {
    const cellInfo   = data.cell?.[0];
    const members    = data.members      ?? [];
    const meetings   = data.meetings     ?? [];
    const attendance = data.attendance   ?? [];
    const celebs     = data.celebrations ?? [];
    const programs   = data.programs     ?? [];
    const now = new Date();
    const dtStr  = now.toLocaleString('en-GB', { day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit' });
    const dayStr = now.toLocaleDateString('en-GB', { weekday:'long',day:'numeric',month:'long',year:'numeric' });
    const cellName = cellInfo?.cell_name || 'Oasis';
    const S = {
      page:'font-family:"Helvetica Neue",Arial,sans-serif;margin:0;padding:0;color:#111;font-size:12px;background:#fff;',
      wrap:'max-width:680px;margin:0 auto;padding:28px 32px 48px;',
      hdr:'display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:2.5px solid #111;margin-bottom:32px;',
      hName:'font-size:26px;font-weight:900;margin:0 0 2px;letter-spacing:-0.5px;',
      hSub:'font-size:11px;color:#6b7280;margin:0;',
      hRight:'text-align:right;font-size:11px;line-height:1.7;color:#374151;',
      hRL:'font-weight:700;font-size:12px;color:#111;',
      secHdr:'font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;margin:32px 0 10px;',
      ciWrap:'border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:8px;',
      ciRow:'display:flex;border-bottom:1px solid #e5e7eb;',
      ciKey:'width:140px;padding:9px 14px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;background:#f8fafc;flex-shrink:0;',
      ciVal:'padding:9px 14px;font-size:13px;font-weight:600;color:#111;',
      tbl:'width:100%;border-collapse:collapse;font-size:12px;',
      th:'padding:8px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;border-bottom:1.5px solid #e5e7eb;',
      td:'padding:8px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top;',
      tdAlt:'padding:8px 12px;border-bottom:1px solid #f3f4f6;vertical-align:top;background:#fafafa;',
      badge:'display:inline-block;background:#f3f4f6;border-radius:20px;padding:1px 8px;font-size:10px;font-weight:700;color:#6b7280;margin-left:8px;vertical-align:middle;',
      present:'font-weight:700;color:#16a34a;', absent:'font-weight:700;color:#dc2626;',
      footer:'margin-top:48px;padding-top:14px;border-top:1.5px solid #e5e7eb;display:flex;justify-content:space-between;font-size:10px;color:#9ca3af;',
    };
    const ciR = (k: string, v: string) => `<div style="${S.ciRow}"><div style="${S.ciKey}">${k}</div><div style="${S.ciVal}">${v||'—'}</div></div>`;
    const tR  = (cells: string[], alt: boolean) => `<tr>${cells.map(c => `<td style="${alt?S.tdAlt:S.td}">${c??'—'}</td>`).join('')}</tr>`;
    const fmt = (d: string|null|undefined) => { if(!d) return '—'; const p=new Date(d); return isNaN(p.getTime())?d:p.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'long',year:'numeric'}); };
    let body = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${cellName} — Report</title>
<style>*{box-sizing:border-box;}body{${S.page}}@media print{@page{size:A4;margin:14mm 14mm 18mm;}body{padding:0;}}</style></head><body>
<div style="${S.wrap}"><div style="${S.hdr}">
<div><h1 style="${S.hName}">${cellName}</h1><p style="${S.hSub}">Report · Generated ${dayStr}</p></div>
<div style="${S.hRight}"><div style="${S.hRL}">${cellInfo?.leader_name||''}</div><div>Cell Leader</div>${cellInfo?.email?`<div>${cellInfo.email}</div>`:''} ${cellInfo?.phone?`<div>${cellInfo.phone}</div>`:''}</div></div>`;
    if (cellInfo) body += `<div style="${S.secHdr}">Cell Information</div><div style="${S.ciWrap}">${ciR('Cell Name',cellInfo.cell_name||'')}${ciR('Cell Leader',cellInfo.leader_name||'')}${ciR('Meeting Day',cellInfo.meeting_day||'')}${ciR('Time',cellInfo.meeting_time||'')}${ciR('Venue',cellInfo.venue||'')}${ciR('Email',cellInfo.email||'')}${ciR('Phone',cellInfo.phone||'')}</div>`;
    if (selected.has('members')) {
      body += `<div style="${S.secHdr}">Members <span style="${S.badge}">${members.length}</span></div>`;
      if (!members.length) body += `<p style="color:#9ca3af;font-size:12px;">No members found.</p>`;
      else body += `<table style="${S.tbl}"><thead><tr><th style="${S.th}">#</th><th style="${S.th}">Name</th><th style="${S.th}">Phone</th><th style="${S.th}">Gender</th><th style="${S.th}">Join Date</th><th style="${S.th}">Birthday</th></tr></thead><tbody>${members.map((m:any,i:number)=>tR([String(i+1),m.name||'—',m.phone||'—',m.gender||'—',fmt(m.date_joined||m.created_at),fmt(m.date_of_birth||m.birthday)],i%2===1)).join('')}</tbody></table>`;
    }
    if (selected.has('attendance')) {
      body += `<div style="${S.secHdr}">Attendance Records</div>`;
      if (!meetings.length) body += `<p style="color:#9ca3af;font-size:12px;">No meetings found.</p>`;
      else meetings.forEach((mtg:any) => {
        const recs = attendance.filter((a:any) => a.meeting_id === mtg.id);
        const pc = recs.filter((a:any) => (a.status||'').toLowerCase() === 'present').length;
        body += `<div style="font-weight:800;font-size:13px;margin:20px 0 6px;">${mtg.title||'Meeting'} · <span style="font-size:11px;color:#6b7280;font-weight:400;">${fmt(mtg.date)}</span> <span style="font-size:11px;color:#6b7280;">${pc}/${recs.length} present</span></div>`;
        if (!recs.length) body += `<p style="color:#9ca3af;font-size:11px;margin:0 0 12px;">No attendance recorded.</p>`;
        else body += `<table style="${S.tbl};margin-bottom:16px;"><thead><tr><th style="${S.th}">#</th><th style="${S.th}">Member</th><th style="${S.th}">Status</th></tr></thead><tbody>${recs.map((a:any,i:number)=>{const ip=(a.status||'').toLowerCase()==='present';return`<tr><td style="${i%2===1?S.tdAlt:S.td}">${i+1}</td><td style="${i%2===1?S.tdAlt:S.td}">${a.member_name||a.member_id||'—'}</td><td style="${i%2===1?S.tdAlt:S.td}"><span style="${ip?S.present:S.absent}">${ip?'✓ Present':'✗ Absent'}</span></td></tr>`;}).join('')}</tbody></table>`;
      });
    }
    if (selected.has('celebrations')) {
      body += `<div style="${S.secHdr}">Celebrations <span style="${S.badge}">${celebs.length}</span></div>`;
      if (!celebs.length) body += `<p style="color:#9ca3af;font-size:12px;">No celebrations found.</p>`;
      else body += `<table style="${S.tbl}"><thead><tr><th style="${S.th}">#</th><th style="${S.th}">Name</th><th style="${S.th}">Event</th><th style="${S.th}">Month</th><th style="${S.th}">Day</th></tr></thead><tbody>${celebs.map((c:any,i:number)=>{let m=c.month||'',d=c.day||'';if(!m&&c.date){const dt=new Date(c.date);m=dt.toLocaleString('en-US',{month:'long'});d=String(dt.getDate()).padStart(2,'0');}return tR([String(i+1),c.name||'—',c.event||'—',m||'—',d||'—'],i%2===1);}).join('')}</tbody></table>`;
    }
    if (selected.has('programs')) {
      body += `<div style="${S.secHdr}">Programs <span style="${S.badge}">${programs.length}</span></div>`;
      if (!programs.length) body += `<p style="color:#9ca3af;font-size:12px;">No programs found.</p>`;
      else body += `<table style="${S.tbl}"><thead><tr><th style="${S.th}">#</th><th style="${S.th}">Title</th><th style="${S.th}">Date</th><th style="${S.th}">Time</th><th style="${S.th}">Venue</th></tr></thead><tbody>${programs.map((p:any,i:number)=>tR([String(i+1),p.title||'—',fmt(p.date),p.time||p.meeting_time||'—',p.venue||'—'],i%2===1)).join('')}</tbody></table>`;
    }
    body += `<div style="${S.footer}"><span>${cellName}</span><span>${dtStr}</span></div></div></body></html>`;
    const win = window.open('', '_blank');
    if (!win) { alert('Please allow popups for this page to generate the PDF.'); return; }
    win.document.write(body); win.document.close(); win.focus();
    setTimeout(() => win.print(), 500);
  }

  async function handleGenerate() {
    setGen(true); setGenError(null);
    try {
      const data = await fetchData();
      if (format === 'xlsx') await exportXlsx(data); else exportPdf(data);
      onClose();
    } catch (err: any) {
      setGenError(err.message ?? 'Export failed. Please try again.');
    } finally { setGen(false); }
  }

  return (
    <div className="sp-modal-overlay" style={{ background: t.overlay, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="sp-modal-box" onClick={e => e.stopPropagation()} style={{ background: t.modalBg, border: `1px solid ${t.border}` }}>

        <div className="sp-modal-head" style={{ borderBottom: `1px solid ${t.border}` }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.tp }}>Export Report</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: t.ts }}>Choose sections and format.</p>
          </div>
          <button className="sp-modal-close" onClick={onClose} style={{ color: t.ts }}>×</button>
        </div>

        <div className="sp-modal-body">
          {genError && <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', fontSize: 13 }}>{genError}</div>}

          <p style={{ margin: '0 0 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: t.ts, textTransform: 'uppercase' }}>Include Sections</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {EXPORT_SECTIONS.map(s => {
              const on = selected.has(s.id);
              return (
                <button key={s.id} onClick={() => toggle(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 13px', borderRadius: 11, cursor: 'pointer', textAlign: 'left', background: on ? t.checkBg : t.cardBg2, border: `1.5px solid ${on ? t.checkBd : t.border}`, transition: 'all 0.12s', fontFamily: 'inherit' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: `2px solid ${on ? t.checkOn : t.border2}`, background: on ? t.checkOn : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {on && <IconCheck c="#fff" />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.tp }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: t.ts, marginTop: 1 }}>{s.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <p style={{ margin: '18px 0 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: t.ts, textTransform: 'uppercase' }}>Format</p>
          <div className="sp-fmt-grid">
            {(['xlsx', 'pdf'] as ExportFormat[]).map(f => {
              const on = format === f;
              return (
                <button key={f} onClick={() => setFormat(f)} style={{ padding: '16px 12px', borderRadius: 12, cursor: 'pointer', background: on ? t.fmtOnBg : t.cardBg2, border: `1.5px solid ${on ? t.fmtOnBd : t.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, transition: 'all 0.12s', fontFamily: 'inherit' }}>
                  {f === 'xlsx'
                    ? <svg viewBox="0 0 24 24" fill="none" stroke={on ? t.fmtOnTxt : t.ts} strokeWidth={1.5} style={{ width: 24, height: 24 }}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke={on ? t.fmtOnTxt : t.ts} strokeWidth={1.5} style={{ width: 24, height: 24 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
                  }
                  <div style={{ fontSize: 12, fontWeight: 700, color: on ? t.fmtOnTxt : t.ts, textAlign: 'center' }}>{f === 'xlsx' ? 'Excel (.xlsx)' : 'A4 Print / PDF'}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sp-modal-foot" style={{ borderTop: `1px solid ${t.border}` }}>
          <button onClick={handleGenerate} disabled={generating || selected.size === 0} style={{ padding: '12px 20px', borderRadius: 10, border: 'none', background: '#16a34a', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, opacity: (generating || selected.size === 0) ? 0.65 : 1, fontFamily: 'inherit', flex: 1, justifyContent: 'center' }}>
            {generating ? <><Spinner />Generating…</> : <><IconDownload c="#fff" />Generate Report</>}
          </button>
          <button onClick={onClose} style={{ padding: '12px 20px', borderRadius: 10, border: `1px solid ${t.border2}`, background: 'transparent', color: t.ts, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ form, setForm, onSave, onClose, saving, uploadingImg, onImageClick, fileInputRef, onImageChange, t }: {
  form: Omit<CellProfile, 'id' | 'user_id'>;
  setForm: React.Dispatch<React.SetStateAction<Omit<CellProfile, 'id' | 'user_id'>>>;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
  saving: boolean; uploadingImg: boolean;
  onImageClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: ReturnType<typeof useTokens>;
}) {
  const fields: { label: string; key: keyof typeof defaultProfile; full?: boolean; placeholder: string }[] = [
    { label: 'Cell Name',      key: 'cell_name',    placeholder: 'e.g. Oasis Cell'          },
    { label: 'Cell Leader',    key: 'leader_name',  placeholder: 'e.g. John Doe'            },
    { label: 'Meeting Day(s)', key: 'meeting_day',  placeholder: 'e.g. Tuesdays & Fridays', full: true },
    { label: 'Time',           key: 'meeting_time', placeholder: 'e.g. 9AM'                 },
    { label: 'Venue',          key: 'venue',        placeholder: 'e.g. Onsite / Zoom'       },
    { label: 'Email',          key: 'email',        placeholder: 'e.g. cell@example.com'    },
    { label: 'Phone No',       key: 'phone',        placeholder: 'e.g. 08012345678'         },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 13px', borderRadius: 10,
    border: `1.5px solid ${t.inputBd}`, background: t.inputBg,
    color: t.tp, fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
  };

  return (
    <div className="sp-modal-overlay" style={{ background: t.overlay, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="sp-modal-box sp-modal-box-lg" onClick={e => e.stopPropagation()} style={{ background: t.modalBg, border: `1px solid ${t.border}` }}>

        <div className="sp-modal-head" style={{ borderBottom: `1px solid ${t.border}` }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.tp }}>Edit Profile</h2>
          <button className="sp-modal-close" onClick={onClose} style={{ color: t.ts }}>×</button>
        </div>

        <form onSubmit={onSave} style={{ overflowY: 'auto', flex: 1, padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onImageClick}>
              <div style={{ width: 84, height: 84, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${t.cyan}`, background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {form.image_url ? <img src={form.image_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <IconPerson c={t.ts} />}
              </div>
              <div style={{ position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: '50%', background: t.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${t.modalBg}` }}>
                {uploadingImg ? <Spinner size={10} /> : <IconCamera c="#fff" />}
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onImageChange} />
          </div>

          {/* Fields */}
          <div className="sp-field-grid">
            {fields.map(({ label, key, full, placeholder }) =>
              key !== 'image_url' && (
                <div key={key} className={full ? 'sp-field-full' : ''}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', color: t.ts, textTransform: 'uppercase', marginBottom: 5 }}>{label}</label>
                  <input
                    type="text"
                    value={(form[key] as string) || ''}
                    placeholder={placeholder}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = t.cyan)}
                    onBlur={e => (e.target.style.borderColor = t.inputBd)}
                  />
                </div>
              )
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4, borderTop: `1px solid ${t.border}`, marginTop: 4 }}>
            <button type="submit" disabled={saving} style={{ padding: '12px 26px', borderRadius: 10, border: 'none', background: t.tp, color: t.cardBg, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1, fontFamily: 'inherit' }}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} style={{ padding: '12px 26px', borderRadius: 10, border: `1px solid ${t.border2}`, background: 'transparent', color: t.ts, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { isDark } = useTheme();
  const t          = useTokens(isDark);
  const supabase   = createClient();
  const router     = useRouter();

  const [profile,      setProfile]      = useState<CellProfile | null>(null);
  const [form,         setForm]         = useState(defaultProfile);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [successMsg,   setSuccessMsg]   = useState<string | null>(null);
  const [errorMsg,     setErrorMsg]     = useState<string | null>(null);
  const [editOpen,     setEditOpen]     = useState(false);
  const [exportOpen,   setExportOpen]   = useState(false);
  const [deleteOpen,   setDeleteOpen]   = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const channelRef   = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      setLoading(true);
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) { router.push('/login'); return; }

      let { data, error } = await supabase.from('cell_profile').select('*').eq('user_id', user.id).single();
      if (error && error.code === 'PGRST116') {
        const { data: ins, error: insErr } = await (supabase as any)
          .from('cell_profile')
          .upsert({ user_id: user.id, ...defaultProfile }, { onConflict: 'user_id' })
          .select().single();
        if (insErr) { setErrorMsg('Could not load settings.'); setLoading(false); return; }
        data = ins;
      } else if (error) {
        setErrorMsg('Could not load settings.'); setLoading(false); return;
      }

      if (!mounted) return;
      setProfile(data); syncForm(data); setLoading(false);

      if (channelRef.current) supabase.removeChannel(channelRef.current);
      channelRef.current = supabase
        .channel('settings-profile')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cell_profile', filter: `user_id=eq.${user.id}` },
          payload => { if (!mounted) return; const u = payload.new as CellProfile; setProfile(u); syncForm(u); })
        .subscribe();
    }
    loadProfile();
    return () => { mounted = false; if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, []);

  function syncForm(d: any) {
    setForm({
      cell_name: d.cell_name||'', leader_name: d.leader_name||'',
      phone: d.phone||'', email: d.email||'', address: d.address||'',
      meeting_day: d.meeting_day||'', meeting_time: d.meeting_time||'',
      venue: d.venue||'', image_url: d.image_url||null,
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true); setSuccessMsg(null); setErrorMsg(null);
    const extPayload = { cell_name:form.cell_name, leader_name:form.leader_name, phone:form.phone, email:form.email, address:form.address, meeting_day:form.meeting_day, meeting_time:form.meeting_time, venue:form.venue };
    const basePayload = { cell_name:form.cell_name, leader_name:form.leader_name, phone:form.phone, email:form.email, address:form.address };
    let { error } = await (supabase as any).from('cell_profile').update(extPayload).eq('user_id', profile.user_id);
    if (error && error.message.includes('column')) {
      const fb = await (supabase as any).from('cell_profile').update(basePayload).eq('user_id', profile.user_id);
      error = fb.error;
    }
    setSaving(false);
    if (error) setErrorMsg('Save failed: ' + error.message);
    else { setSuccessMsg('Profile saved!'); setEditOpen(false); setTimeout(() => setSuccessMsg(null), 3000); }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadingImg(true); setErrorMsg(null);
    const ext = file.name.split('.').pop();
    const filePath = `${profile.user_id}/cell-logo.${ext}`;
    await supabase.storage.from('cell-images').remove([filePath]);
    const { error: upErr } = await supabase.storage.from('cell-images').upload(filePath, file, { upsert: true });
    if (upErr) { setErrorMsg('Upload failed: ' + upErr.message); setUploadingImg(false); return; }
    const { data: urlData } = supabase.storage.from('cell-images').getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl + `?v=${Date.now()}`;
    const { error: updErr } = await (supabase as any).from('cell_profile').update({ image_url: publicUrl }).eq('user_id', profile.user_id);
    if (updErr) setErrorMsg('Could not save image URL.');
    else { setForm(prev => ({ ...prev, image_url: publicUrl })); setSuccessMsg('Photo updated!'); setTimeout(() => setSuccessMsg(null), 3000); }
    setUploadingImg(false);
  }

  async function handleDeleteAccount() {
    if (!profile?.user_id) { setErrorMsg('No active profile found. Please refresh.'); return; }
    setDeleting(true); setErrorMsg(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session. Please log in again.');
      const tables = ['attendance_records','celebrations','programs','meetings','members','cell_profile'] as const;
      for (const table of tables) {
        const { error } = await supabase.from(table).delete().eq('user_id', profile.user_id);
        if (error) console.warn(`Could not delete ${table}:`, error.message);
      }
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(body.error ?? `Server error ${res.status}`);
      }
      await supabase.auth.signOut();
      window.location.replace('/');
    } catch (err: any) {
      setDeleting(false); setDeleteOpen(false);
      setErrorMsg(err.name === 'AbortError' ? 'Request timed out. Please try again.' : 'Delete failed: ' + (err.message ?? 'Unknown error'));
    }
  }

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:260 }}>
        <style>{RESPONSIVE_CSS}</style>
        <div style={{ width:36, height:36, border:`3px solid #22252f`, borderTopColor:'#06b6d4', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const infoCards: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <IconPerson c={t.ts} />,   label: 'Cell Name',   value: form.cell_name    },
    { icon: <IconPerson c={t.ts} />,   label: 'Cell Leader', value: form.leader_name  },
    { icon: <IconCalendar c={t.ts} />, label: 'Meeting Day', value: form.meeting_day  },
    { icon: <IconClock c={t.ts} />,    label: 'Time',        value: form.meeting_time },
    { icon: <IconPin c={t.ts} />,      label: 'Venue',       value: form.venue        },
    { icon: <IconMail c={t.ts} />,     label: 'Email',       value: form.email        },
    { icon: <IconPhone c={t.ts} />,    label: 'Phone',       value: form.phone        },
  ];

  return (
    <>
      <style>{RESPONSIVE_CSS}</style>

      <div className="sp-page" style={{ background: t.pageBg }}>
        <div className="sp-inner">

          {/* Heading */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 900, color: t.tp, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>Settings</h1>
            <p style={{ margin: '5px 0 0', fontSize: 13, color: t.ts }}>Manage your cell profile, reports and account</p>
          </div>

          {/* Toasts */}
          {successMsg && (
            <div style={{ marginBottom: 14, padding: '11px 14px', borderRadius: 12, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.28)', color: '#16a34a', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeIn 0.2s ease' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 15, height: 15, flexShrink: 0 }}><path d="M20 6 9 17l-5-5"/></svg>
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div style={{ marginBottom: 14, padding: '11px 14px', borderRadius: 12, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ flex: 1 }}>{errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 20, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
            </div>
          )}

          {/* ── Profile Card ── */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 'clamp(14px, 3vw, 24px) clamp(14px, 3vw, 26px)', marginBottom: 12, boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}>

            {/* Avatar + name + edit */}
            <div className="sp-profile-header">
              <div className="sp-avatar-wrap">
                <div className="sp-avatar" style={{ border: `2.5px solid ${t.cyan}`, background: t.iconBg }}>
                  {form.image_url ? <img src={form.image_url} alt="Cell" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <IconPerson c={t.ts} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="sp-cell-name" style={{ color: t.tp }}>{form.cell_name || 'Your Cell'}</div>
                  <div className="sp-cell-leader" style={{ color: t.ts }}>Leader: {form.leader_name || '—'}</div>
                </div>
              </div>
              <button
                className="sp-edit-btn"
                onClick={() => setEditOpen(true)}
                style={{ border: `1.5px solid ${t.border2}`, background: 'transparent', color: t.tp, fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = t.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <IconEdit c={t.tp} /> Edit
              </button>
            </div>

            {/* Info grid */}
            <div className="sp-info-grid">
              {infoCards.map((c, i) => (
                <InfoCard
                  key={c.label}
                  icon={c.icon}
                  label={c.label}
                  value={c.value}
                  t={t}
                  // Last card spans full width on desktop when total is odd
                  fullWidth={i === infoCards.length - 1 && infoCards.length % 2 === 1}
                />
              ))}
            </div>
          </div>

          {/* ── Action Cards ── */}
          <div className="sp-action-grid">

            {/* Export Report */}
            <button
              className="sp-action-card"
              onClick={() => setExportOpen(true)}
              style={{ background: t.cardBg, border: `1px solid ${t.border}`, fontFamily: 'inherit', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#16a34a'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'; }}
            >
              <div className="sp-action-icon" style={{ background: 'rgba(22,163,74,0.12)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} style={{ width: 20, height: 20 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <div>
                <div className="sp-action-title" style={{ color: t.tp }}>Export Report</div>
                <div className="sp-action-sub" style={{ color: t.ts }}>Download Excel or A4 PDF with selected data</div>
              </div>
            </button>

            {/* Delete Account */}
            <button
              className="sp-action-card"
              onClick={() => setDeleteOpen(true)}
              disabled={deleting}
              style={{ background: isDark ? 'rgba(127,29,29,0.18)' : 'rgba(254,242,242,1)', border: `1px solid ${isDark ? 'rgba(185,28,28,0.3)' : 'rgba(252,165,165,0.6)'}`, fontFamily: 'inherit', opacity: deleting ? 0.6 : 1, boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { if (!deleting) { (e.currentTarget as HTMLElement).style.borderColor = '#dc2626'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(220,38,38,0.1)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isDark ? 'rgba(185,28,28,0.3)' : 'rgba(252,165,165,0.6)'; (e.currentTarget as HTMLElement).style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.04)'; }}
            >
              <div className="sp-action-icon" style={{ background: 'rgba(220,38,38,0.12)' }}>
                <IconTrash c="#dc2626" />
              </div>
              <div>
                <div className="sp-action-title" style={{ color: '#dc2626' }}>{deleting ? 'Deleting…' : 'Delete Account'}</div>
                <div className="sp-action-sub" style={{ color: t.ts }}>Permanently delete all cell data and log out</div>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* ── Modals ── */}
      {editOpen && (
        <EditModal
          form={form} setForm={setForm} onSave={handleSave} onClose={() => setEditOpen(false)}
          saving={saving} uploadingImg={uploadingImg}
          onImageClick={() => fileInputRef.current?.click()}
          fileInputRef={fileInputRef} onImageChange={handleImageUpload} t={t}
        />
      )}
      {exportOpen && <ExportModal onClose={() => setExportOpen(false)} t={t} userId={profile?.user_id ?? ''} />}
      {deleteOpen && (
        <DeleteConfirmModal
          onConfirm={handleDeleteAccount}
          onClose={() => { if (!deleting) setDeleteOpen(false); }}
          deleting={deleting} t={t}
        />
      )}
    </>
  );
}