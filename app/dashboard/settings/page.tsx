
// 'use client';

// import { useState, useRef, useEffect, useCallback } from 'react';
// import { useTheme } from '@/app/components/ThemeProvider';
// import {
//   Pencil, Upload, Trash2, Download, Check, Loader2,
//   FileSpreadsheet, FileText, User, Phone, Mail, Clock,
//   MapPin, Calendar, Shield,
// } from 'lucide-react';
// import { createClient } from '@supabase/supabase-js';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
//   AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
// } from '@/components/ui/alert-dialog';

// // ── Supabase ──────────────────────────────────────────────────────────────────
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
// );

// // ── Types ─────────────────────────────────────────────────────────────────────
// type ProfileData = {
//   cell_name: string;
//   cell_leader: string;
//   meeting_day: string;
//   email: string;
//   time: string;
//   phone_no: string;
//   venue: string;
//   image_url: string | null;
// };

// type ReportSection = { key: string; label: string; description: string; checked: boolean };

// // Blank profile — no hardcoded values
// const blankProfile: ProfileData = {
//   cell_name: '',
//   cell_leader: '',
//   meeting_day: '',
//   email: '',
//   time: '',
//   phone_no: '',
//   venue: '',
//   image_url: null,
// };

// function formatDate(iso: string) {
//   if (!iso) return '';
//   return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
//     weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
//   });
// }

// // ── Field row component (dark-mode aware via CSS vars) ────────────────────────
// function Field({ icon, label, value, isDark }: { icon: React.ReactNode; label: string; value: string; isDark: boolean }) {
//   return (
//     <div style={{
//       display: 'flex', gap: 14, alignItems: 'flex-start',
//       padding: '14px 16px', borderRadius: 12,
//       background: isDark ? '#1a1d27' : '#f8f9fb',
//       border: `1px solid ${isDark ? '#1e2028' : '#efefef'}`,
//     }}>
//       <div style={{
//         width: 36, height: 36, borderRadius: 9, flexShrink: 0,
//         background: isDark ? '#13151c' : '#fff',
//         border: `1px solid ${isDark ? '#2a2d3a' : '#e8e8e8'}`,
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         color: isDark ? '#6b7280' : '#9ca3af',
//       }}>
//         {icon}
//       </div>
//       <div>
//         <p style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#4b5563' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
//           {label}
//         </p>
//         <p style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f3f4f6' : '#111827', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
//           {value || '—'}
//         </p>
//       </div>
//     </div>
//   );
// }

// // ── Page ──────────────────────────────────────────────────────────────────────
// export default function SettingsPage() {
//   const { isDark } = useTheme();

//   const [profile, setProfile] = useState<ProfileData>(blankProfile);
//   const [editOpen, setEditOpen] = useState(false);
//   const [editData, setEditData] = useState<ProfileData>(blankProfile);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
//   const [deleteConfirmText, setDeleteConfirmText] = useState('');
//   const [deleting, setDeleting] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [savedToast, setSavedToast] = useState(false);
//   const [reportOpen, setReportOpen] = useState(false);
//   const [reportFormat, setReportFormat] = useState<'excel' | 'a4' | null>(null);
//   const [generating, setGenerating] = useState(false);

//   const [sections, setSections] = useState<ReportSection[]>([
//     { key: 'cell_info',    label: 'Cell Information',   description: 'Name, leader, venue, contact details', checked: true },
//     { key: 'members',      label: 'Members List',        description: 'All member names & phone numbers',    checked: true },
//     { key: 'attendance',   label: 'Attendance Records',  description: 'All meetings with per-member status', checked: true },
//     { key: 'celebrations', label: 'Celebrations',        description: 'Birthdays & anniversaries',           checked: true },
//     { key: 'programs',     label: 'Programs',            description: 'All scheduled programs & events',     checked: true },
//   ]);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // ── Fetch profile ─────────────────────────────────────────────────────────
//   const fetchProfile = useCallback(async () => {
//     const { data } = await supabase.from('cell_profile').select('*').eq('id', 1).single();
//     if (data) setProfile(data);
//     setLoading(false);
//   }, []);

//   useEffect(() => { fetchProfile(); }, [fetchProfile]);

//   useEffect(() => {
//     const sub = supabase.channel('settings:profile')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'cell_profile' }, fetchProfile)
//       .subscribe();
//     return () => { supabase.removeChannel(sub); };
//   }, [fetchProfile]);

//   // ── Image upload ──────────────────────────────────────────────────────────
//   const handleImageUpload = async (file: File) => {
//     setUploading(true);
//     const ext = file.name.split('.').pop() ?? 'jpg';
//     const path = `profile/cell-${Date.now()}.${ext}`;
//     const { error } = await supabase.storage.from('cell-images').upload(path, file, { upsert: true });
//     if (!error) {
//       const { data: { publicUrl } } = supabase.storage.from('cell-images').getPublicUrl(path);
//       setEditData(p => ({ ...p, image_url: publicUrl }));
//     }
//     setUploading(false);
//   };

//   // ── Save profile ──────────────────────────────────────────────────────────
//   const handleSave = async () => {
//     setSaving(true);
//     const { error } = await supabase.from('cell_profile').update({
//       cell_name: editData.cell_name,
//       cell_leader: editData.cell_leader,
//       meeting_day: editData.meeting_day,
//       email: editData.email,
//       time: editData.time,
//       phone_no: editData.phone_no,
//       venue: editData.venue,
//       image_url: editData.image_url,
//       updated_at: new Date().toISOString(),
//     }).eq('id', 1);
//     setSaving(false);
//     if (!error) {
//       setProfile({ ...editData });
//       setEditOpen(false);
//       setSavedToast(true);
//       setTimeout(() => setSavedToast(false), 2500);
//     }
//   };

//   // ── Delete account ────────────────────────────────────────────────────────
//   const handleDelete = async () => {
//     setDeleting(true);

//     // 1. Get the current authenticated user before deleting anything
//     const { data: { user } } = await supabase.auth.getUser();

//     // 2. Delete all data across every table
//     await Promise.allSettled([
//       supabase.from('attendance_records').delete().neq('id', 0),
//       supabase.from('meetings').delete().neq('id', 0),
//       supabase.from('celebrations').delete().neq('id', 0),
//       supabase.from('programs').delete().neq('id', 0),
//       supabase.from('members').delete().neq('id', 0),
//     ]);

//     // 3. Reset cell_profile to fully blank
//     await supabase.from('cell_profile').update({
//       cell_name: '',
//       cell_leader: '',
//       meeting_day: '',
//       email: '',
//       time: '',
//       phone_no: '',
//       venue: '',
//       image_url: null,
//       updated_at: new Date().toISOString(),
//     }).eq('id', 1);

//     // 4. Delete the auth user (removes email from Supabase Auth entirely).
//     //    Uses a server-side API route with the service-role key since the
//     //    client SDK cannot call admin.deleteUser() on itself.
//     if (user?.id) {
//       try {
//         await fetch('/api/delete-account', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ userId: user.id }),
//         });
//       } catch (_) {
//         // Non-fatal — continue with sign-out even if admin delete fails
//       }
//     }

//     // 5. Sign out of Supabase auth session
//     await supabase.auth.signOut();

//     // 6. Clear localStorage/sessionStorage
//     try { localStorage.clear(); sessionStorage.clear(); } catch (_) {}

//     // 7. Redirect to login page
//     window.location.replace('/login');
//   };

//   // ── Report data fetch ─────────────────────────────────────────────────────
//   const fetchReportData = async () => {
//     const keys = sections.filter(s => s.checked).map(s => s.key);
//     const result: Record<string, any> = { profile };
//     if (keys.includes('members')) {
//       const { data } = await supabase.from('members').select('*').order('created_at');
//       result.members = data ?? [];
//     }
//     if (keys.includes('attendance')) {
//       const [{ data: m }, { data: r }, { data: mb }] = await Promise.all([
//         supabase.from('meetings').select('*').order('date'),
//         supabase.from('attendance_records').select('*'),
//         supabase.from('members').select('id, name'),
//       ]);
//       result.meetings = m ?? [];
//       result.records = r ?? [];
//       result.membersMap = Object.fromEntries((mb ?? []).map(x => [x.id, x.name]));
//     }
//     if (keys.includes('celebrations')) {
//       const { data } = await supabase.from('celebrations').select('*').order('month').order('day');
//       result.celebrations = data ?? [];
//     }
//     if (keys.includes('programs')) {
//       const { data } = await supabase.from('programs').select('*').order('date');
//       result.programs = data ?? [];
//     }
//     return result;
//   };

//   // ── Excel export ──────────────────────────────────────────────────────────
//   const generateExcel = async () => {
//     setGenerating(true);
//     const d = await fetchReportData();
//     const keys = sections.filter(s => s.checked).map(s => s.key);
//     const XLSX = (await import('xlsx')).default;
//     const wb = XLSX.utils.book_new();
//     const MONTHS = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

//     if (keys.includes('cell_info')) {
//       const ws = XLSX.utils.aoa_to_sheet([
//         ['CELL INFORMATION REPORT'],
//         ['Generated', new Date().toLocaleString()],
//         [],
//         ['Field', 'Value'],
//         ['Cell Name', d.profile.cell_name],
//         ['Cell Leader', d.profile.cell_leader],
//         ['Meeting Day(s)', d.profile.meeting_day],
//         ['Time', d.profile.time],
//         ['Venue', d.profile.venue],
//         ['Email', d.profile.email],
//         ['Phone', d.profile.phone_no],
//       ]);
//       ws['!cols'] = [{ wch: 20 }, { wch: 40 }];
//       XLSX.utils.book_append_sheet(wb, ws, 'Cell Info');
//     }
//     if (keys.includes('members') && d.members) {
//       const rows = [
//         ['#', 'Name', 'Phone', 'Gender', 'Join Date', 'Birthday'],
//         ...d.members.map((m: any, i: number) => [i + 1, m.name, m.phone, m.gender ?? '—', m.join_date ? formatDate(m.join_date) : '—', m.birthday_date ? formatDate(m.birthday_date) : '—']),
//         [], ['Total', d.members.length],
//       ];
//       const ws = XLSX.utils.aoa_to_sheet(rows);
//       ws['!cols'] = [{ wch: 4 }, { wch: 34 }, { wch: 16 }, { wch: 10 }, { wch: 18 }, { wch: 18 }];
//       XLSX.utils.book_append_sheet(wb, ws, 'Members');
//     }
//     if (keys.includes('attendance') && d.meetings) {
//       const names = Object.values(d.membersMap ?? {}) as string[];
//       const rows = [['Meeting', 'Date', 'Present', 'Absent', 'Total', ...names]];
//       d.meetings.forEach((m: any) => {
//         const recs = (d.records ?? []).filter((r: any) => r.meeting_id === m.id);
//         const present = recs.filter((r: any) => r.present).length;
//         const statuses = Object.keys(d.membersMap ?? {}).map(id => {
//           const rec = recs.find((r: any) => r.member_id === Number(id));
//           return rec?.present ? 'Present' : 'Absent';
//         });
//         rows.push([m.title, m.date, present, names.length - present, names.length, ...statuses]);
//       });
//       const ws = XLSX.utils.aoa_to_sheet(rows);
//       ws['!cols'] = [{ wch: 22 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, ...names.map(() => ({ wch: 20 }))];
//       XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
//     }
//     if (keys.includes('celebrations') && d.celebrations) {
//       const ws = XLSX.utils.aoa_to_sheet([
//         ['#', 'Name', 'Event', 'Month', 'Day'],
//         ...d.celebrations.map((c: any, i: number) => [i + 1, c.name, c.event, MONTHS[c.month] ?? c.month, c.day]),
//       ]);
//       ws['!cols'] = [{ wch: 4 }, { wch: 34 }, { wch: 20 }, { wch: 14 }, { wch: 6 }];
//       XLSX.utils.book_append_sheet(wb, ws, 'Celebrations');
//     }
//     if (keys.includes('programs') && d.programs) {
//       const ws = XLSX.utils.aoa_to_sheet([
//         ['#', 'Title', 'Date', 'Time', 'Venue', 'Description'],
//         ...d.programs.map((p: any, i: number) => [i + 1, p.title, p.date, p.time, p.venue ?? '—', p.description ?? '—']),
//       ]);
//       ws['!cols'] = [{ wch: 4 }, { wch: 40 }, { wch: 14 }, { wch: 10 }, { wch: 26 }, { wch: 40 }];
//       XLSX.utils.book_append_sheet(wb, ws, 'Programs');
//     }

//     const name = `${(d.profile.cell_name || 'Cell').replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
//     XLSX.writeFile(wb, name);
//     setGenerating(false);
//     setReportOpen(false);
//   };

//   // ── A4 HTML print report ──────────────────────────────────────────────────
//   const generateA4 = async () => {
//     setGenerating(true);
//     const d = await fetchReportData();
//     const keys = sections.filter(s => s.checked).map(s => s.key);
//     const MONTHS = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

//     let body = '';

//     if (keys.includes('cell_info')) {
//       body += `<div class="sec"><div class="sec-title">Cell Information</div><div class="info-block">
//         ${[['Cell Name', d.profile.cell_name], ['Cell Leader', d.profile.cell_leader], ['Meeting Day(s)', (d.profile.meeting_day ?? '').replace(/\n/g,' · ')], ['Time', d.profile.time], ['Venue', d.profile.venue], ['Email', d.profile.email], ['Phone', d.profile.phone_no]]
//           .map(([l, v]) => `<div class="row"><span class="lbl">${l}</span><span class="val">${v || '—'}</span></div>`).join('')}
//       </div></div>`;
//     }
//     if (keys.includes('members') && d.members) {
//       body += `<div class="sec"><div class="sec-title">Members (${d.members.length})</div>
//         <table><thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Gender</th><th>Join Date</th><th>Birthday</th></tr></thead><tbody>
//         ${d.members.map((m: any, i: number) => `<tr><td>${i+1}</td><td>${m.name}</td><td>${m.phone}</td><td>${m.gender??'—'}</td><td>${m.join_date?formatDate(m.join_date):'—'}</td><td>${m.birthday_date?formatDate(m.birthday_date):'—'}</td></tr>`).join('')}
//         </tbody></table></div>`;
//     }
//     if (keys.includes('attendance') && d.meetings) {
//       const entries = Object.entries(d.membersMap ?? {});
//       body += `<div class="sec"><div class="sec-title">Attendance Records</div>`;
//       d.meetings.forEach((m: any) => {
//         const recs = (d.records ?? []).filter((r: any) => r.meeting_id === m.id);
//         const pc = recs.filter((r: any) => r.present).length;
//         body += `<div style="margin-bottom:16px;">
//           <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
//             <strong>${m.title} · ${formatDate(m.date)}</strong>
//             <span style="color:#6b7280;">${pc}/${entries.length} present</span>
//           </div>
//           <table><thead><tr><th>#</th><th>Member</th><th>Status</th></tr></thead><tbody>
//           ${entries.map(([id, name], i) => {
//             const rec = recs.find((r: any) => r.member_id === Number(id));
//             return `<tr><td>${i+1}</td><td>${name}</td><td class="${rec?.present?'present':'absent'}">${rec?.present?'✓ Present':'✗ Absent'}</td></tr>`;
//           }).join('')}
//           </tbody></table></div>`;
//       });
//       body += `</div>`;
//     }
//     if (keys.includes('celebrations') && d.celebrations) {
//       body += `<div class="sec"><div class="sec-title">Celebrations (${d.celebrations.length})</div>
//         <table><thead><tr><th>#</th><th>Name</th><th>Event</th><th>Month</th><th>Day</th></tr></thead><tbody>
//         ${d.celebrations.map((c: any, i: number) => `<tr><td>${i+1}</td><td>${c.name}</td><td>${c.event}</td><td>${MONTHS[c.month]??c.month}</td><td>${String(c.day).padStart(2,'0')}</td></tr>`).join('')}
//         </tbody></table></div>`;
//     }
//     if (keys.includes('programs') && d.programs) {
//       body += `<div class="sec"><div class="sec-title">Programs (${d.programs.length})</div>
//         <table><thead><tr><th>#</th><th>Title</th><th>Date</th><th>Time</th><th>Venue</th></tr></thead><tbody>
//         ${d.programs.map((p: any, i: number) => `<tr><td>${i+1}</td><td>${p.title}</td><td>${formatDate(p.date)}</td><td>${p.time}</td><td>${p.venue??'—'}</td></tr>`).join('')}
//         </tbody></table></div>`;
//     }

//     const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
//     <title>${d.profile.cell_name || 'Cell'} — Report</title>
//     <style>
//       @page{size:A4;margin:16mm} *{box-sizing:border-box;margin:0;padding:0}
//       body{font-family:Arial,sans-serif;font-size:11px;color:#111;background:#fff}
//       .page{max-width:780px;margin:0 auto;padding:20px}
//       .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #111;padding-bottom:14px;margin-bottom:22px}
//       .hdr-l h1{font-size:22px;font-weight:900;letter-spacing:-0.5px}
//       .hdr-l p{font-size:11px;color:#6b7280;margin-top:4px}
//       .hdr-r{text-align:right;font-size:10px;color:#6b7280}
//       .hdr-r strong{font-size:13px;color:#111;display:block;margin-bottom:2px}
//       .sec{margin-bottom:28px;page-break-inside:avoid}
//       .sec-title{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.07em;color:#fff;background:#111;padding:6px 12px;border-radius:4px;margin-bottom:10px;display:inline-block}
//       .info-block{border:1px solid #e5e7eb;border-radius:8px;overflow:hidden}
//       .row{display:flex;padding:8px 14px;border-bottom:1px solid #f3f4f6}
//       .row:last-child{border-bottom:none}
//       .lbl{font-weight:700;color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:0.05em;min-width:120px}
//       .val{font-weight:600;color:#111}
//       table{width:100%;border-collapse:collapse;font-size:10.5px}
//       th{background:#f4f4f5;font-weight:700;text-align:left;padding:7px 10px;border:1px solid #e4e4e7;font-size:10px;text-transform:uppercase;letter-spacing:0.04em;color:#52525b}
//       td{padding:6px 10px;border:1px solid #e4e4e7;vertical-align:top}
//       tr:nth-child(even) td{background:#fafafa}
//       .present{color:#059669;font-weight:700} .absent{color:#dc2626;font-weight:700}
//       .footer{margin-top:30px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:9px;color:#9ca3af;text-align:center}
//     </style></head><body><div class="page">
//     <div class="hdr">
//       <div class="hdr-l"><h1>${d.profile.cell_name || 'Cell Report'}</h1>
//         <p>Report · Generated ${new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
//       </div>
//       <div class="hdr-r"><strong>${d.profile.cell_leader || '—'}</strong>Cell Leader<br/>${d.profile.email||''}<br/>${d.profile.phone_no||''}</div>
//     </div>
//     ${body}
//     <div class="footer">${d.profile.cell_name||'Cell Report'} · ${new Date().toLocaleString()}</div>
//     </div><script>window.onload=()=>window.print()</script></body></html>`;

//     const blob = new Blob([html], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     window.open(url, '_blank');
//     setTimeout(() => URL.revokeObjectURL(url), 8000);
//     setGenerating(false);
//     setReportOpen(false);
//   };

//   // ── Theme tokens ──────────────────────────────────────────────────────────
//   const bg          = isDark ? '#111318' : '#f5f6f8';
//   const cardBg      = isDark ? '#16181f' : '#ffffff';
//   const cardBd      = isDark ? '#1e2028' : '#ebebeb';
//   const cardShadow  = isDark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 16px rgba(0,0,0,0.05)';
//   const headingCol  = isDark ? '#f3f4f6' : '#0f1117';
//   const subCol      = isDark ? '#6b7280' : '#9ca3af';
//   const dividerCol  = isDark ? '#1e2028' : '#f0f0f0';
//   const inputBg     = isDark ? '#1a1d27' : '#fff';
//   const inputBd     = isDark ? '#2a2d3a' : '#e5e7eb';
//   const inputColor  = isDark ? '#e5e7eb' : '#111827';
//   const labelColor  = isDark ? '#9ca3af' : '#6b7280';

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', background: bg }}>
//         <Loader2 style={{ width: 28, height: 28, animation: 'spin 1s linear infinite', color: '#06b6d4' }} />
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight: '100vh', background: bg, padding: '0 0 80px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

//       {/* ── Saved toast ──────────────────────────────────────────────────────── */}
//       {savedToast && (
//         <div style={{
//           position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
//           zIndex: 9999, background: '#059669', color: '#fff',
//           padding: '10px 22px', borderRadius: 14, fontSize: 13, fontWeight: 700,
//           display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
//           whiteSpace: 'nowrap',
//         }}>
//           <Check style={{ width: 16, height: 16 }} /> Profile saved!
//         </div>
//       )}

//       <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 14px' }}>

//         {/* ── Page header ──────────────────────────────────────────────────────── */}
//         <div style={{ marginBottom: 24 }}>
//           <h1 style={{ fontSize: 22, fontWeight: 800, color: headingCol, letterSpacing: '-0.3px' }}>SETTINGS</h1>
//           <p style={{ fontSize: 13, color: subCol, marginTop: 4 }}>Manage your cell profile, reports and account</p>
//         </div>

//         {/* ── Profile card ─────────────────────────────────────────────────────── */}
//         <div style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 20, boxShadow: cardShadow, marginBottom: 20, overflow: 'hidden' }}>
//           {/* Card header */}
//           <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${dividerCol}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//               {/* Avatar */}
//               <div style={{
//                 width: 56, height: 56, borderRadius: 14, overflow: 'hidden', flexShrink: 0,
//                 background: isDark ? '#2a2d3a' : '#e5e7eb',
//                 border: `3px solid ${profile.image_url ? '#06b6d4' : (isDark ? '#2a2d3a' : '#e5e7eb')}`,
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//               }}>
//                 {profile.image_url ? (
//                   <img src={profile.image_url} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                 ) : (
//                   <User style={{ width: 22, height: 22, color: isDark ? '#6b7280' : '#9ca3af' }} />
//                 )}
//               </div>
//               <div>
//                 <div style={{ fontSize: 16, fontWeight: 800, color: headingCol, lineHeight: 1.3 }}>
//                   {profile.cell_name || 'Your Cell'}
//                 </div>
//                 <div style={{ fontSize: 12, color: subCol, marginTop: 2 }}>
//                   {profile.cell_leader ? `Leader: ${profile.cell_leader}` : 'No profile set up yet'}
//                 </div>
//               </div>
//             </div>
//             {/* Edit button */}
//             <button
//               onClick={() => { setEditData({ ...profile }); setEditOpen(true); }}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
//                 borderRadius: 10, border: `1px solid ${inputBd}`,
//                 background: inputBg, color: headingCol, fontSize: 13, fontWeight: 600,
//                 cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.15s',
//               }}
//             >
//               <Pencil style={{ width: 14, height: 14 }} /> Edit
//             </button>
//           </div>

//           {/* Fields grid */}
//           <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
//             <Field icon={<User style={{ width: 15, height: 15 }} />}    label="Cell Name"    value={profile.cell_name}    isDark={isDark} />
//             <Field icon={<User style={{ width: 15, height: 15 }} />}    label="Cell Leader"  value={profile.cell_leader}  isDark={isDark} />
//             <Field icon={<Calendar style={{ width: 15, height: 15 }} />} label="Meeting Day"  value={profile.meeting_day}  isDark={isDark} />
//             <Field icon={<Clock style={{ width: 15, height: 15 }} />}   label="Time"         value={profile.time}         isDark={isDark} />
//             <Field icon={<MapPin style={{ width: 15, height: 15 }} />}  label="Venue"        value={profile.venue}        isDark={isDark} />
//             <Field icon={<Mail style={{ width: 15, height: 15 }} />}    label="Email"        value={profile.email}        isDark={isDark} />
//             <Field icon={<Phone style={{ width: 15, height: 15 }} />}   label="Phone"        value={profile.phone_no}     isDark={isDark} />
//           </div>
//         </div>

//         {/* ── Action cards row ──────────────────────────────────────────────────── */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>

//           {/* Export report */}
//           <button
//             onClick={() => { setReportFormat(null); setReportOpen(true); }}
//             style={{
//               background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 18,
//               padding: '20px', textAlign: 'left', cursor: 'pointer',
//               boxShadow: cardShadow, transition: 'transform 0.15s, box-shadow 0.15s',
//             }}
//             onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = isDark ? '0 8px 30px rgba(0,0,0,0.4)' : '0 8px 30px rgba(0,0,0,0.1)'; }}
//             onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = cardShadow; }}
//           >
//             <div style={{ width: 42, height: 42, borderRadius: 12, background: isDark ? 'rgba(16,185,129,0.15)' : '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
//               <Download style={{ width: 20, height: 20, color: '#059669' }} />
//             </div>
//             <div style={{ fontSize: 14, fontWeight: 700, color: headingCol }}>Export Report</div>
//             <div style={{ fontSize: 12, color: subCol, marginTop: 4 }}>Download Excel or A4 PDF with selected data</div>
//           </button>

//           {/* Delete account */}
//           <button
//             onClick={() => { setDeleteStep(1); setDeleteConfirmText(''); setDeleteOpen(true); }}
//             style={{
//               background: isDark ? 'rgba(239,68,68,0.07)' : '#fff5f5', border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : '#fecaca'}`, borderRadius: 18,
//               padding: '20px', textAlign: 'left', cursor: 'pointer',
//               boxShadow: cardShadow, transition: 'transform 0.15s, box-shadow 0.15s',
//             }}
//             onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
//             onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; }}
//           >
//             <div style={{ width: 42, height: 42, borderRadius: 12, background: isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
//               <Trash2 style={{ width: 20, height: 20, color: '#dc2626' }} />
//             </div>
//             <div style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>Delete Account</div>
//             <div style={{ fontSize: 12, color: subCol, marginTop: 4 }}>Permanently delete all cell data and log out</div>
//           </button>

//         </div>
//       </div>

//       {/* ════════════════════════════════════════════════════════════════════════
//           EDIT PROFILE DIALOG
//       ════════════════════════════════════════════════════════════════════════ */}
//       <Dialog open={editOpen} onOpenChange={setEditOpen}>
//         <DialogContent className="w-[95vw] sm:max-w-lg rounded-2xl p-0 flex flex-col max-h-[92vh]"
//           style={{ background: cardBg, border: `1px solid ${cardBd}` }}>
//           <DialogHeader className="px-5 pt-5 pb-4 shrink-0" style={{ borderBottom: `1px solid ${dividerCol}` }}>
//             <DialogTitle style={{ fontSize: 20, fontWeight: 800, color: headingCol }}>Edit Profile</DialogTitle>
//           </DialogHeader>

//           <div className="overflow-y-auto flex-1" style={{ padding: '16px 20px' }}>

//             {/* Image upload */}
//             <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
//               <div style={{ position: 'relative' }}>
//                 <div
//                   onClick={() => fileInputRef.current?.click()}
//                   style={{
//                     width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
//                     background: isDark ? '#2a2d3a' : '#e5e7eb',
//                     border: `3px solid ${editData.image_url ? '#06b6d4' : (isDark ? '#2a2d3a' : '#d1d5db')}`,
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     cursor: 'pointer',
//                   }}>
//                   {uploading ? (
//                     <Loader2 style={{ width: 22, height: 22, color: '#06b6d4', animation: 'spin 1s linear infinite' }} />
//                   ) : editData.image_url ? (
//                     <img src={editData.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                   ) : (
//                     <div style={{ textAlign: 'center' }}>
//                       <Upload style={{ width: 18, height: 18, color: isDark ? '#6b7280' : '#9ca3af', margin: '0 auto 2px' }} />
//                       <span style={{ fontSize: 9, color: isDark ? '#6b7280' : '#9ca3af', fontWeight: 600 }}>PHOTO</span>
//                     </div>
//                   )}
//                 </div>
//                 <button onClick={() => fileInputRef.current?.click()}
//                   style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', border: `2px solid ${cardBg}`, background: '#06b6d4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   <Pencil style={{ width: 11, height: 11, color: '#fff' }} />
//                 </button>
//                 <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
//                   onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
//               </div>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
//               {[
//                 { label: 'Cell Name', key: 'cell_name', placeholder: 'e.g. OASIS 1F' },
//                 { label: 'Cell Leader', key: 'cell_leader', placeholder: 'Full name' },
//               ].map(f => (
//                 <div key={f.key}>
//                   <label style={{ fontSize: 11, fontWeight: 700, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>{f.label}</label>
//                   <input
//                     value={(editData as any)[f.key]}
//                     onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))}
//                     placeholder={f.placeholder}
//                     style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 10, border: `1px solid ${inputBd}`, background: inputBg, color: inputColor, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div style={{ marginBottom: 12 }}>
//               <label style={{ fontSize: 11, fontWeight: 700, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Meeting Day(s)</label>
//               <textarea
//                 value={editData.meeting_day}
//                 onChange={e => setEditData(p => ({ ...p, meeting_day: e.target.value }))}
//                 placeholder={'e.g. TUESDAYS: BIBLE STUDY\nFRIDAY: PRAYER MEETING'}
//                 rows={2}
//                 style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${inputBd}`, background: inputBg, color: inputColor, fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
//               />
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
//               {[
//                 { label: 'Time', key: 'time', placeholder: 'e.g. 9PM' },
//                 { label: 'Venue', key: 'venue', placeholder: 'Online or onsite' },
//                 { label: 'Email', key: 'email', placeholder: 'email@example.com', type: 'email' },
//                 { label: 'Phone No', key: 'phone_no', placeholder: '08xxxxxxxxx' },
//               ].map(f => (
//                 <div key={f.key}>
//                   <label style={{ fontSize: 11, fontWeight: 700, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>{f.label}</label>
//                   <input
//                     type={f.type ?? 'text'}
//                     value={(editData as any)[f.key]}
//                     onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))}
//                     placeholder={f.placeholder}
//                     style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 10, border: `1px solid ${inputBd}`, background: inputBg, color: inputColor, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div style={{ padding: '14px 20px', borderTop: `1px solid ${dividerCol}`, display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
//             <button onClick={() => setEditOpen(false)}
//               style={{ padding: '9px 20px', borderRadius: 10, border: `1px solid ${inputBd}`, background: 'transparent', color: headingCol, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
//               Cancel
//             </button>
//             <button onClick={handleSave} disabled={saving}
//               style={{ padding: '9px 22px', borderRadius: 10, border: 'none', background: '#111827', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, opacity: saving ? 0.7 : 1 }}>
//               {saving && <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />}
//               Save Changes
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ════════════════════════════════════════════════════════════════════════
//           EXPORT REPORT DIALOG
//       ════════════════════════════════════════════════════════════════════════ */}
//       <Dialog open={reportOpen} onOpenChange={setReportOpen}>
//         <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl p-0 flex flex-col max-h-[92vh]"
//           style={{ background: cardBg, border: `1px solid ${cardBd}` }}>
//           <DialogHeader className="px-5 pt-5 pb-3 shrink-0" style={{ borderBottom: `1px solid ${dividerCol}` }}>
//             <DialogTitle style={{ fontSize: 19, fontWeight: 800, color: headingCol }}>Export Report</DialogTitle>
//             <p style={{ fontSize: 12, color: subCol, marginTop: 3 }}>Choose what to include, then pick a format.</p>
//           </DialogHeader>

//           <div className="overflow-y-auto flex-1" style={{ padding: '16px 20px' }}>

//             {/* Sections */}
//             <p style={{ fontSize: 10, fontWeight: 700, color: subCol, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
//               Include Sections
//             </p>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               {sections.map(s => (
//                 <button key={s.key} onClick={() => setSections(p => p.map(x => x.key === s.key ? { ...x, checked: !x.checked } : x))}
//                   style={{
//                     display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px',
//                     borderRadius: 12, border: `2px solid ${s.checked ? (isDark ? '#4b5563' : '#111') : (isDark ? '#1e2028' : '#e5e7eb')}`,
//                     background: s.checked ? (isDark ? '#1a1d27' : '#f8f9fb') : 'transparent',
//                     cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
//                   }}>
//                   <div style={{
//                     width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
//                     background: s.checked ? '#111827' : 'transparent',
//                     border: `2px solid ${s.checked ? '#111827' : (isDark ? '#4b5563' : '#d1d5db')}`,
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   }}>
//                     {s.checked && <Check style={{ width: 11, height: 11, color: '#fff' }} />}
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 13, fontWeight: 700, color: headingCol }}>{s.label}</div>
//                     <div style={{ fontSize: 11, color: subCol, marginTop: 2 }}>{s.description}</div>
//                   </div>
//                 </button>
//               ))}
//             </div>

//             {/* Format picker */}
//             <p style={{ fontSize: 10, fontWeight: 700, color: subCol, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '18px 0 10px' }}>
//               Format
//             </p>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//               {[
//                 { key: 'excel', icon: <FileSpreadsheet style={{ width: 28, height: 28 }} />, label: 'Excel (.xlsx)', sub: 'Multi-sheet spreadsheet', activeColor: '#059669', activeBg: isDark ? 'rgba(5,150,105,0.12)' : '#ecfdf5', activeBd: '#059669' },
//                 { key: 'a4',    icon: <FileText style={{ width: 28, height: 28 }} />, label: 'A4 Print / PDF', sub: 'Opens print dialog', activeColor: '#2563eb', activeBg: isDark ? 'rgba(37,99,235,0.12)' : '#eff6ff', activeBd: '#2563eb' },
//               ].map(f => (
//                 <button key={f.key} onClick={() => setReportFormat(f.key as any)}
//                   style={{
//                     display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 10px',
//                     borderRadius: 14, cursor: 'pointer',
//                     border: `2px solid ${reportFormat === f.key ? f.activeBd : (isDark ? '#1e2028' : '#e5e7eb')}`,
//                     background: reportFormat === f.key ? f.activeBg : 'transparent',
//                     color: reportFormat === f.key ? f.activeColor : subCol,
//                     transition: 'all 0.15s',
//                   }}>
//                   {f.icon}
//                   <span style={{ fontSize: 12, fontWeight: 700 }}>{f.label}</span>
//                   <span style={{ fontSize: 10, color: subCol, textAlign: 'center' }}>{f.sub}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div style={{ padding: '14px 20px', borderTop: `1px solid ${dividerCol}`, display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
//             <button onClick={() => setReportOpen(false)}
//               style={{ padding: '9px 20px', borderRadius: 10, border: `1px solid ${inputBd}`, background: 'transparent', color: headingCol, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
//               Cancel
//             </button>
//             <button
//               disabled={!reportFormat || sections.every(s => !s.checked) || generating}
//               onClick={() => reportFormat === 'excel' ? generateExcel() : generateA4()}
//               style={{
//                 padding: '9px 22px', borderRadius: 10, border: 'none',
//                 background: reportFormat === 'a4' ? '#2563eb' : '#059669',
//                 color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
//                 fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7,
//                 opacity: (!reportFormat || sections.every(s => !s.checked) || generating) ? 0.45 : 1,
//               }}>
//               {generating
//                 ? <><Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> Generating…</>
//                 : <><Download style={{ width: 14, height: 14 }} /> Generate Report</>
//               }
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ════════════════════════════════════════════════════════════════════════
//           DELETE ACCOUNT DIALOG — 2 steps
//       ════════════════════════════════════════════════════════════════════════ */}
//       <AlertDialog open={deleteOpen} onOpenChange={v => { if (!v) { setDeleteOpen(false); setDeleteConfirmText(''); setDeleteStep(1); } }}>
//         <AlertDialogContent className="w-[95vw] sm:max-w-md rounded-2xl"
//           style={{ background: cardBg, border: `1px solid ${isDark ? '#3f1515' : '#fecaca'}` }}>
//           <AlertDialogHeader>
//             <AlertDialogTitle style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', fontSize: 18, fontWeight: 800 }}>
//               <div style={{ width: 36, height: 36, borderRadius: 9, background: isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <Shield style={{ width: 18, height: 18, color: '#dc2626' }} />
//               </div>
//               {deleteStep === 1 ? 'Delete Account?' : 'Final Confirmation'}
//             </AlertDialogTitle>
//             <AlertDialogDescription asChild>
//               <div>
//                 {deleteStep === 1 ? (
//                   <div style={{ fontSize: 13, color: isDark ? '#9ca3af' : '#6b7280', lineHeight: 1.7, marginTop: 6 }}>
//                     <p>This will <strong style={{ color: isDark ? '#f3f4f6' : '#111' }}>permanently delete</strong> everything associated with your account:</p>
//                     <ul style={{ margin: '10px 0 0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
//                       {['All members & their data', 'All attendance records & meetings', 'All celebrations', 'All programs', 'Cell profile information', 'Your login email & account'].map(item => (
//                         <li key={item} style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>• {item}</li>
//                       ))}
//                     </ul>
//                     <p style={{ marginTop: 10 }}>You will be <strong style={{ color: '#dc2626' }}>logged out immediately</strong>. This cannot be undone.</p>
//                   </div>
//                 ) : (
//                   <div style={{ fontSize: 13, color: isDark ? '#9ca3af' : '#6b7280', lineHeight: 1.7, marginTop: 6 }}>
//                     <p>Type <strong style={{ color: '#dc2626' }}>DELETE</strong> in all caps below to confirm:</p>
//                     <input
//                       value={deleteConfirmText}
//                       onChange={e => setDeleteConfirmText(e.target.value.toUpperCase())}
//                       placeholder="Type DELETE here"
//                       autoFocus
//                       style={{
//                         width: '100%', height: 42, padding: '0 14px', marginTop: 12,
//                         borderRadius: 10, border: `2px solid ${deleteConfirmText === 'DELETE' ? '#dc2626' : (isDark ? '#3f1515' : '#fecaca')}`,
//                         background: isDark ? '#1a0808' : '#fff5f5', color: '#dc2626',
//                         fontSize: 15, fontWeight: 700, fontFamily: 'inherit', outline: 'none',
//                         letterSpacing: '0.05em', boxSizing: 'border-box',
//                       }}
//                     />
//                   </div>
//                 )}
//               </div>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter style={{ gap: 8, marginTop: 4 }}>
//             <AlertDialogCancel
//               onClick={() => { setDeleteOpen(false); setDeleteConfirmText(''); setDeleteStep(1); }}
//               style={{ borderRadius: 10, background: 'transparent', border: `1px solid ${inputBd}`, color: headingCol, fontFamily: 'inherit' }}>
//               Cancel
//             </AlertDialogCancel>
//             {deleteStep === 1 ? (
//               <button
//                 onClick={() => setDeleteStep(2)}
//                 style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
//                 Yes, Continue
//               </button>
//             ) : (
//               <button
//                 disabled={deleteConfirmText !== 'DELETE' || deleting}
//                 onClick={handleDelete}
//                 style={{
//                   padding: '9px 20px', borderRadius: 10, border: 'none',
//                   background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 700,
//                   cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'not-allowed',
//                   fontFamily: 'inherit', opacity: (deleteConfirmText !== 'DELETE' || deleting) ? 0.45 : 1,
//                   display: 'flex', alignItems: 'center', gap: 7,
//                 }}>
//                 {deleting
//                   ? <><Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> Deleting…</>
//                   : <><Trash2 style={{ width: 13, height: 13 }} /> Delete Everything & Log Out</>
//                 }
//               </button>
//             )}
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//     </div>
//   );
// }















'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/components/ThemeProvider';
import {
  Pencil, Upload, Trash2, Download, Check, Loader2,
  FileSpreadsheet, FileText, User, Phone, Mail, Clock,
  MapPin, Calendar, Shield,
} from 'lucide-react';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// ── Supabase ──────────────────────────────────────────────────────────────────
// Use the same browser client as the sidebar so session teardown is consistent
const supabase = createBrowserClient();

// ── Types ─────────────────────────────────────────────────────────────────────
type ProfileData = {
  cell_name: string;
  cell_leader: string;
  meeting_day: string;
  email: string;
  time: string;
  phone_no: string;
  venue: string;
  image_url: string | null;
};

type ReportSection = { key: string; label: string; description: string; checked: boolean };

// Blank profile — no hardcoded values
const blankProfile: ProfileData = {
  cell_name: '',
  cell_leader: '',
  meeting_day: '',
  email: '',
  time: '',
  phone_no: '',
  venue: '',
  image_url: null,
};

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
  });
}

// ── Field row component (dark-mode aware via CSS vars) ────────────────────────
function Field({ icon, label, value, isDark }: { icon: React.ReactNode; label: string; value: string; isDark: boolean }) {
  return (
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start',
      padding: '14px 16px', borderRadius: 12,
      background: isDark ? '#1a1d27' : '#f8f9fb',
      border: `1px solid ${isDark ? '#1e2028' : '#efefef'}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        background: isDark ? '#13151c' : '#fff',
        border: `1px solid ${isDark ? '#2a2d3a' : '#e8e8e8'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: isDark ? '#6b7280' : '#9ca3af',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#4b5563' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
          {label}
        </p>
        <p style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f3f4f6' : '#111827', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { isDark } = useTheme();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData>(blankProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<ProfileData>(blankProfile);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportFormat, setReportFormat] = useState<'excel' | 'a4' | null>(null);
  const [generating, setGenerating] = useState(false);

  const [sections, setSections] = useState<ReportSection[]>([
    { key: 'cell_info',    label: 'Cell Information',   description: 'Name, leader, venue, contact details', checked: true },
    { key: 'members',      label: 'Members List',        description: 'All member names & phone numbers',    checked: true },
    { key: 'attendance',   label: 'Attendance Records',  description: 'All meetings with per-member status', checked: true },
    { key: 'celebrations', label: 'Celebrations',        description: 'Birthdays & anniversaries',           checked: true },
    { key: 'programs',     label: 'Programs',            description: 'All scheduled programs & events',     checked: true },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch profile ─────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    const { data } = await supabase.from('cell_profile').select('*').eq('id', 1).single();
    if (data) setProfile(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  useEffect(() => {
    const sub = supabase.channel('settings:profile')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cell_profile' }, fetchProfile)
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [fetchProfile]);

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `profile/cell-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('cell-images').upload(path, file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('cell-images').getPublicUrl(path);
      setEditData(p => ({ ...p, image_url: publicUrl }));
    }
    setUploading(false);
  };

  // ── Save profile ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('cell_profile').update({
      cell_name: editData.cell_name,
      cell_leader: editData.cell_leader,
      meeting_day: editData.meeting_day,
      email: editData.email,
      time: editData.time,
      phone_no: editData.phone_no,
      venue: editData.venue,
      image_url: editData.image_url,
      updated_at: new Date().toISOString(),
    }).eq('id', 1);
    setSaving(false);
    if (!error) {
      setProfile({ ...editData });
      setEditOpen(false);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);
    }
  };

  // ── Delete account ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);

    // 1. Get the current authenticated user before deleting anything
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Delete all data across every table
    await Promise.allSettled([
      supabase.from('attendance_records').delete().neq('id', 0),
      supabase.from('meetings').delete().neq('id', 0),
      supabase.from('celebrations').delete().neq('id', 0),
      supabase.from('programs').delete().neq('id', 0),
      supabase.from('members').delete().neq('id', 0),
    ]);

    // 3. Reset cell_profile to fully blank
    await supabase.from('cell_profile').update({
      cell_name: '',
      cell_leader: '',
      meeting_day: '',
      email: '',
      time: '',
      phone_no: '',
      venue: '',
      image_url: null,
      updated_at: new Date().toISOString(),
    }).eq('id', 1);

    // 4. Delete the auth user (removes email from Supabase Auth entirely).
    //    Uses a server-side API route with the service-role key since the
    //    client SDK cannot call admin.deleteUser() on itself.
    if (user?.id) {
      try {
        await fetch('/api/delete-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
      } catch (_) {
        // Non-fatal — continue with sign-out even if admin delete fails
      }
    }

    // 5. Sign out — MUST await fully so the session cookie is cleared
    //    before Next.js middleware runs on the next navigation.
    await supabase.auth.signOut();

    // 6. Clear local storage remnants (mirrors sidebar logout exactly)
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.clear();
      sessionStorage.clear();
    } catch (_) {}

    // 7. router.push + router.refresh() — same pattern as the working sidebar
    //    logout, so middleware sees the cleared session and stays on /login.
    router.push('/login');
    router.refresh();
  };

  // ── Report data fetch ─────────────────────────────────────────────────────
  const fetchReportData = async () => {
    const keys = sections.filter(s => s.checked).map(s => s.key);
    const result: Record<string, any> = { profile };
    if (keys.includes('members')) {
      const { data } = await supabase.from('members').select('*').order('created_at');
      result.members = data ?? [];
    }
    if (keys.includes('attendance')) {
      const [{ data: m }, { data: r }, { data: mb }] = await Promise.all([
        supabase.from('meetings').select('*').order('date'),
        supabase.from('attendance_records').select('*'),
        supabase.from('members').select('id, name'),
      ]);
      result.meetings = m ?? [];
      result.records = r ?? [];
      result.membersMap = Object.fromEntries((mb ?? []).map(x => [x.id, x.name]));
    }
    if (keys.includes('celebrations')) {
      const { data } = await supabase.from('celebrations').select('*').order('month').order('day');
      result.celebrations = data ?? [];
    }
    if (keys.includes('programs')) {
      const { data } = await supabase.from('programs').select('*').order('date');
      result.programs = data ?? [];
    }
    return result;
  };

  // ── Excel export ──────────────────────────────────────────────────────────
  const generateExcel = async () => {
    setGenerating(true);
    const d = await fetchReportData();
    const keys = sections.filter(s => s.checked).map(s => s.key);
    const XLSX = (await import('xlsx')).default;
    const wb = XLSX.utils.book_new();
    const MONTHS = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

    if (keys.includes('cell_info')) {
      const ws = XLSX.utils.aoa_to_sheet([
        ['CELL INFORMATION REPORT'],
        ['Generated', new Date().toLocaleString()],
        [],
        ['Field', 'Value'],
        ['Cell Name', d.profile.cell_name],
        ['Cell Leader', d.profile.cell_leader],
        ['Meeting Day(s)', d.profile.meeting_day],
        ['Time', d.profile.time],
        ['Venue', d.profile.venue],
        ['Email', d.profile.email],
        ['Phone', d.profile.phone_no],
      ]);
      ws['!cols'] = [{ wch: 20 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, ws, 'Cell Info');
    }
    if (keys.includes('members') && d.members) {
      const rows = [
        ['#', 'Name', 'Phone', 'Gender', 'Join Date', 'Birthday'],
        ...d.members.map((m: any, i: number) => [i + 1, m.name, m.phone, m.gender ?? '—', m.join_date ? formatDate(m.join_date) : '—', m.birthday_date ? formatDate(m.birthday_date) : '—']),
        [], ['Total', d.members.length],
      ];
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = [{ wch: 4 }, { wch: 34 }, { wch: 16 }, { wch: 10 }, { wch: 18 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(wb, ws, 'Members');
    }
    if (keys.includes('attendance') && d.meetings) {
      const names = Object.values(d.membersMap ?? {}) as string[];
      const rows = [['Meeting', 'Date', 'Present', 'Absent', 'Total', ...names]];
      d.meetings.forEach((m: any) => {
        const recs = (d.records ?? []).filter((r: any) => r.meeting_id === m.id);
        const present = recs.filter((r: any) => r.present).length;
        const statuses = Object.keys(d.membersMap ?? {}).map(id => {
          const rec = recs.find((r: any) => r.member_id === Number(id));
          return rec?.present ? 'Present' : 'Absent';
        });
        rows.push([m.title, m.date, present, names.length - present, names.length, ...statuses]);
      });
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = [{ wch: 22 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, ...names.map(() => ({ wch: 20 }))];
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    }
    if (keys.includes('celebrations') && d.celebrations) {
      const ws = XLSX.utils.aoa_to_sheet([
        ['#', 'Name', 'Event', 'Month', 'Day'],
        ...d.celebrations.map((c: any, i: number) => [i + 1, c.name, c.event, MONTHS[c.month] ?? c.month, c.day]),
      ]);
      ws['!cols'] = [{ wch: 4 }, { wch: 34 }, { wch: 20 }, { wch: 14 }, { wch: 6 }];
      XLSX.utils.book_append_sheet(wb, ws, 'Celebrations');
    }
    if (keys.includes('programs') && d.programs) {
      const ws = XLSX.utils.aoa_to_sheet([
        ['#', 'Title', 'Date', 'Time', 'Venue', 'Description'],
        ...d.programs.map((p: any, i: number) => [i + 1, p.title, p.date, p.time, p.venue ?? '—', p.description ?? '—']),
      ]);
      ws['!cols'] = [{ wch: 4 }, { wch: 40 }, { wch: 14 }, { wch: 10 }, { wch: 26 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, ws, 'Programs');
    }

    const name = `${(d.profile.cell_name || 'Cell').replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, name);
    setGenerating(false);
    setReportOpen(false);
  };

  // ── A4 HTML print report ──────────────────────────────────────────────────
  const generateA4 = async () => {
    setGenerating(true);
    const d = await fetchReportData();
    const keys = sections.filter(s => s.checked).map(s => s.key);
    const MONTHS = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

    let body = '';

    if (keys.includes('cell_info')) {
      body += `<div class="sec"><div class="sec-title">Cell Information</div><div class="info-block">
        ${[['Cell Name', d.profile.cell_name], ['Cell Leader', d.profile.cell_leader], ['Meeting Day(s)', (d.profile.meeting_day ?? '').replace(/\n/g,' · ')], ['Time', d.profile.time], ['Venue', d.profile.venue], ['Email', d.profile.email], ['Phone', d.profile.phone_no]]
          .map(([l, v]) => `<div class="row"><span class="lbl">${l}</span><span class="val">${v || '—'}</span></div>`).join('')}
      </div></div>`;
    }
    if (keys.includes('members') && d.members) {
      body += `<div class="sec"><div class="sec-title">Members (${d.members.length})</div>
        <table><thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Gender</th><th>Join Date</th><th>Birthday</th></tr></thead><tbody>
        ${d.members.map((m: any, i: number) => `<tr><td>${i+1}</td><td>${m.name}</td><td>${m.phone}</td><td>${m.gender??'—'}</td><td>${m.join_date?formatDate(m.join_date):'—'}</td><td>${m.birthday_date?formatDate(m.birthday_date):'—'}</td></tr>`).join('')}
        </tbody></table></div>`;
    }
    if (keys.includes('attendance') && d.meetings) {
      const entries = Object.entries(d.membersMap ?? {});
      body += `<div class="sec"><div class="sec-title">Attendance Records</div>`;
      d.meetings.forEach((m: any) => {
        const recs = (d.records ?? []).filter((r: any) => r.meeting_id === m.id);
        const pc = recs.filter((r: any) => r.present).length;
        body += `<div style="margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <strong>${m.title} · ${formatDate(m.date)}</strong>
            <span style="color:#6b7280;">${pc}/${entries.length} present</span>
          </div>
          <table><thead><tr><th>#</th><th>Member</th><th>Status</th></tr></thead><tbody>
          ${entries.map(([id, name], i) => {
            const rec = recs.find((r: any) => r.member_id === Number(id));
            return `<tr><td>${i+1}</td><td>${name}</td><td class="${rec?.present?'present':'absent'}">${rec?.present?'✓ Present':'✗ Absent'}</td></tr>`;
          }).join('')}
          </tbody></table></div>`;
      });
      body += `</div>`;
    }
    if (keys.includes('celebrations') && d.celebrations) {
      body += `<div class="sec"><div class="sec-title">Celebrations (${d.celebrations.length})</div>
        <table><thead><tr><th>#</th><th>Name</th><th>Event</th><th>Month</th><th>Day</th></tr></thead><tbody>
        ${d.celebrations.map((c: any, i: number) => `<tr><td>${i+1}</td><td>${c.name}</td><td>${c.event}</td><td>${MONTHS[c.month]??c.month}</td><td>${String(c.day).padStart(2,'0')}</td></tr>`).join('')}
        </tbody></table></div>`;
    }
    if (keys.includes('programs') && d.programs) {
      body += `<div class="sec"><div class="sec-title">Programs (${d.programs.length})</div>
        <table><thead><tr><th>#</th><th>Title</th><th>Date</th><th>Time</th><th>Venue</th></tr></thead><tbody>
        ${d.programs.map((p: any, i: number) => `<tr><td>${i+1}</td><td>${p.title}</td><td>${formatDate(p.date)}</td><td>${p.time}</td><td>${p.venue??'—'}</td></tr>`).join('')}
        </tbody></table></div>`;
    }

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <title>${d.profile.cell_name || 'Cell'} — Report</title>
    <style>
      @page{size:A4;margin:16mm} *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Arial,sans-serif;font-size:11px;color:#111;background:#fff}
      .page{max-width:780px;margin:0 auto;padding:20px}
      .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #111;padding-bottom:14px;margin-bottom:22px}
      .hdr-l h1{font-size:22px;font-weight:900;letter-spacing:-0.5px}
      .hdr-l p{font-size:11px;color:#6b7280;margin-top:4px}
      .hdr-r{text-align:right;font-size:10px;color:#6b7280}
      .hdr-r strong{font-size:13px;color:#111;display:block;margin-bottom:2px}
      .sec{margin-bottom:28px;page-break-inside:avoid}
      .sec-title{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.07em;color:#fff;background:#111;padding:6px 12px;border-radius:4px;margin-bottom:10px;display:inline-block}
      .info-block{border:1px solid #e5e7eb;border-radius:8px;overflow:hidden}
      .row{display:flex;padding:8px 14px;border-bottom:1px solid #f3f4f6}
      .row:last-child{border-bottom:none}
      .lbl{font-weight:700;color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:0.05em;min-width:120px}
      .val{font-weight:600;color:#111}
      table{width:100%;border-collapse:collapse;font-size:10.5px}
      th{background:#f4f4f5;font-weight:700;text-align:left;padding:7px 10px;border:1px solid #e4e4e7;font-size:10px;text-transform:uppercase;letter-spacing:0.04em;color:#52525b}
      td{padding:6px 10px;border:1px solid #e4e4e7;vertical-align:top}
      tr:nth-child(even) td{background:#fafafa}
      .present{color:#059669;font-weight:700} .absent{color:#dc2626;font-weight:700}
      .footer{margin-top:30px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:9px;color:#9ca3af;text-align:center}
    </style></head><body><div class="page">
    <div class="hdr">
      <div class="hdr-l"><h1>${d.profile.cell_name || 'Cell Report'}</h1>
        <p>Report · Generated ${new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>
      <div class="hdr-r"><strong>${d.profile.cell_leader || '—'}</strong>Cell Leader<br/>${d.profile.email||''}<br/>${d.profile.phone_no||''}</div>
    </div>
    ${body}
    <div class="footer">${d.profile.cell_name||'Cell Report'} · ${new Date().toLocaleString()}</div>
    </div><script>window.onload=()=>window.print()</script></body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 8000);
    setGenerating(false);
    setReportOpen(false);
  };

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const bg          = isDark ? '#111318' : '#f5f6f8';
  const cardBg      = isDark ? '#16181f' : '#ffffff';
  const cardBd      = isDark ? '#1e2028' : '#ebebeb';
  const cardShadow  = isDark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 16px rgba(0,0,0,0.05)';
  const headingCol  = isDark ? '#f3f4f6' : '#0f1117';
  const subCol      = isDark ? '#6b7280' : '#9ca3af';
  const dividerCol  = isDark ? '#1e2028' : '#f0f0f0';
  const inputBg     = isDark ? '#1a1d27' : '#fff';
  const inputBd     = isDark ? '#2a2d3a' : '#e5e7eb';
  const inputColor  = isDark ? '#e5e7eb' : '#111827';
  const labelColor  = isDark ? '#9ca3af' : '#6b7280';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', background: bg }}>
        <Loader2 style={{ width: 28, height: 28, animation: 'spin 1s linear infinite', color: '#06b6d4' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '0 0 80px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Saved toast ──────────────────────────────────────────────────────── */}
      {savedToast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, background: '#059669', color: '#fff',
          padding: '10px 22px', borderRadius: 14, fontSize: 13, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          whiteSpace: 'nowrap',
        }}>
          <Check style={{ width: 16, height: 16 }} /> Profile saved!
        </div>
      )}

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 14px' }}>

        {/* ── Page header ──────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: headingCol, letterSpacing: '-0.3px' }}>SETTINGS</h1>
          <p style={{ fontSize: 13, color: subCol, marginTop: 4 }}>Manage your cell profile, reports and account</p>
        </div>

        {/* ── Profile card ─────────────────────────────────────────────────────── */}
        <div style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 20, boxShadow: cardShadow, marginBottom: 20, overflow: 'hidden' }}>
          {/* Card header */}
          <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${dividerCol}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Avatar */}
              <div style={{
                width: 56, height: 56, borderRadius: 14, overflow: 'hidden', flexShrink: 0,
                background: isDark ? '#2a2d3a' : '#e5e7eb',
                border: `3px solid ${profile.image_url ? '#06b6d4' : (isDark ? '#2a2d3a' : '#e5e7eb')}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {profile.image_url ? (
                  <img src={profile.image_url} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User style={{ width: 22, height: 22, color: isDark ? '#6b7280' : '#9ca3af' }} />
                )}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: headingCol, lineHeight: 1.3 }}>
                  {profile.cell_name || 'Your Cell'}
                </div>
                <div style={{ fontSize: 12, color: subCol, marginTop: 2 }}>
                  {profile.cell_leader ? `Leader: ${profile.cell_leader}` : 'No profile set up yet'}
                </div>
              </div>
            </div>
            {/* Edit button */}
            <button
              onClick={() => { setEditData({ ...profile }); setEditOpen(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                borderRadius: 10, border: `1px solid ${inputBd}`,
                background: inputBg, color: headingCol, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.15s',
              }}
            >
              <Pencil style={{ width: 14, height: 14 }} /> Edit
            </button>
          </div>

          {/* Fields grid */}
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            <Field icon={<User style={{ width: 15, height: 15 }} />}    label="Cell Name"    value={profile.cell_name}    isDark={isDark} />
            <Field icon={<User style={{ width: 15, height: 15 }} />}    label="Cell Leader"  value={profile.cell_leader}  isDark={isDark} />
            <Field icon={<Calendar style={{ width: 15, height: 15 }} />} label="Meeting Day"  value={profile.meeting_day}  isDark={isDark} />
            <Field icon={<Clock style={{ width: 15, height: 15 }} />}   label="Time"         value={profile.time}         isDark={isDark} />
            <Field icon={<MapPin style={{ width: 15, height: 15 }} />}  label="Venue"        value={profile.venue}        isDark={isDark} />
            <Field icon={<Mail style={{ width: 15, height: 15 }} />}    label="Email"        value={profile.email}        isDark={isDark} />
            <Field icon={<Phone style={{ width: 15, height: 15 }} />}   label="Phone"        value={profile.phone_no}     isDark={isDark} />
          </div>
        </div>

        {/* ── Action cards row ──────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>

          {/* Export report */}
          <button
            onClick={() => { setReportFormat(null); setReportOpen(true); }}
            style={{
              background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 18,
              padding: '20px', textAlign: 'left', cursor: 'pointer',
              boxShadow: cardShadow, transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = isDark ? '0 8px 30px rgba(0,0,0,0.4)' : '0 8px 30px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = cardShadow; }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 12, background: isDark ? 'rgba(16,185,129,0.15)' : '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Download style={{ width: 20, height: 20, color: '#059669' }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: headingCol }}>Export Report</div>
            <div style={{ fontSize: 12, color: subCol, marginTop: 4 }}>Download Excel or A4 PDF with selected data</div>
          </button>

          {/* Delete account */}
          <button
            onClick={() => { setDeleteStep(1); setDeleteConfirmText(''); setDeleteOpen(true); }}
            style={{
              background: isDark ? 'rgba(239,68,68,0.07)' : '#fff5f5', border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : '#fecaca'}`, borderRadius: 18,
              padding: '20px', textAlign: 'left', cursor: 'pointer',
              boxShadow: cardShadow, transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 12, background: isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Trash2 style={{ width: 20, height: 20, color: '#dc2626' }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>Delete Account</div>
            <div style={{ fontSize: 12, color: subCol, marginTop: 4 }}>Permanently delete all cell data and log out</div>
          </button>

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          EDIT PROFILE DIALOG
      ════════════════════════════════════════════════════════════════════════ */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-[95vw] sm:max-w-lg rounded-2xl p-0 flex flex-col max-h-[92vh]"
          style={{ background: cardBg, border: `1px solid ${cardBd}` }}>
          <DialogHeader className="px-5 pt-5 pb-4 shrink-0" style={{ borderBottom: `1px solid ${dividerCol}` }}>
            <DialogTitle style={{ fontSize: 20, fontWeight: 800, color: headingCol }}>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto flex-1" style={{ padding: '16px 20px' }}>

            {/* Image upload */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
                    background: isDark ? '#2a2d3a' : '#e5e7eb',
                    border: `3px solid ${editData.image_url ? '#06b6d4' : (isDark ? '#2a2d3a' : '#d1d5db')}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}>
                  {uploading ? (
                    <Loader2 style={{ width: 22, height: 22, color: '#06b6d4', animation: 'spin 1s linear infinite' }} />
                  ) : editData.image_url ? (
                    <img src={editData.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <Upload style={{ width: 18, height: 18, color: isDark ? '#6b7280' : '#9ca3af', margin: '0 auto 2px' }} />
                      <span style={{ fontSize: 9, color: isDark ? '#6b7280' : '#9ca3af', fontWeight: 600 }}>PHOTO</span>
                    </div>
                  )}
                </div>
                <button onClick={() => fileInputRef.current?.click()}
                  style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', border: `2px solid ${cardBg}`, background: '#06b6d4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pencil style={{ width: 11, height: 11, color: '#fff' }} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {[
                { label: 'Cell Name', key: 'cell_name', placeholder: 'e.g. OASIS 1F' },
                { label: 'Cell Leader', key: 'cell_leader', placeholder: 'Full name' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input
                    value={(editData as any)[f.key]}
                    onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 10, border: `1px solid ${inputBd}`, background: inputBg, color: inputColor, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Meeting Day(s)</label>
              <textarea
                value={editData.meeting_day}
                onChange={e => setEditData(p => ({ ...p, meeting_day: e.target.value }))}
                placeholder={'e.g. TUESDAYS: BIBLE STUDY\nFRIDAY: PRAYER MEETING'}
                rows={2}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${inputBd}`, background: inputBg, color: inputColor, fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {[
                { label: 'Time', key: 'time', placeholder: 'e.g. 9PM' },
                { label: 'Venue', key: 'venue', placeholder: 'Online or onsite' },
                { label: 'Email', key: 'email', placeholder: 'email@example.com', type: 'email' },
                { label: 'Phone No', key: 'phone_no', placeholder: '08xxxxxxxxx' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type ?? 'text'}
                    value={(editData as any)[f.key]}
                    onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 10, border: `1px solid ${inputBd}`, background: inputBg, color: inputColor, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '14px 20px', borderTop: `1px solid ${dividerCol}`, display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
            <button onClick={() => setEditOpen(false)}
              style={{ padding: '9px 20px', borderRadius: 10, border: `1px solid ${inputBd}`, background: 'transparent', color: headingCol, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              style={{ padding: '9px 22px', borderRadius: 10, border: 'none', background: '#111827', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, opacity: saving ? 0.7 : 1 }}>
              {saving && <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />}
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════════
          EXPORT REPORT DIALOG
      ════════════════════════════════════════════════════════════════════════ */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl p-0 flex flex-col max-h-[92vh]"
          style={{ background: cardBg, border: `1px solid ${cardBd}` }}>
          <DialogHeader className="px-5 pt-5 pb-3 shrink-0" style={{ borderBottom: `1px solid ${dividerCol}` }}>
            <DialogTitle style={{ fontSize: 19, fontWeight: 800, color: headingCol }}>Export Report</DialogTitle>
            <p style={{ fontSize: 12, color: subCol, marginTop: 3 }}>Choose what to include, then pick a format.</p>
          </DialogHeader>

          <div className="overflow-y-auto flex-1" style={{ padding: '16px 20px' }}>

            {/* Sections */}
            <p style={{ fontSize: 10, fontWeight: 700, color: subCol, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Include Sections
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sections.map(s => (
                <button key={s.key} onClick={() => setSections(p => p.map(x => x.key === s.key ? { ...x, checked: !x.checked } : x))}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px',
                    borderRadius: 12, border: `2px solid ${s.checked ? (isDark ? '#4b5563' : '#111') : (isDark ? '#1e2028' : '#e5e7eb')}`,
                    background: s.checked ? (isDark ? '#1a1d27' : '#f8f9fb') : 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    background: s.checked ? '#111827' : 'transparent',
                    border: `2px solid ${s.checked ? '#111827' : (isDark ? '#4b5563' : '#d1d5db')}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {s.checked && <Check style={{ width: 11, height: 11, color: '#fff' }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: headingCol }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: subCol, marginTop: 2 }}>{s.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Format picker */}
            <p style={{ fontSize: 10, fontWeight: 700, color: subCol, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '18px 0 10px' }}>
              Format
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { key: 'excel', icon: <FileSpreadsheet style={{ width: 28, height: 28 }} />, label: 'Excel (.xlsx)', sub: 'Multi-sheet spreadsheet', activeColor: '#059669', activeBg: isDark ? 'rgba(5,150,105,0.12)' : '#ecfdf5', activeBd: '#059669' },
                { key: 'a4',    icon: <FileText style={{ width: 28, height: 28 }} />, label: 'A4 Print / PDF', sub: 'Opens print dialog', activeColor: '#2563eb', activeBg: isDark ? 'rgba(37,99,235,0.12)' : '#eff6ff', activeBd: '#2563eb' },
              ].map(f => (
                <button key={f.key} onClick={() => setReportFormat(f.key as any)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 10px',
                    borderRadius: 14, cursor: 'pointer',
                    border: `2px solid ${reportFormat === f.key ? f.activeBd : (isDark ? '#1e2028' : '#e5e7eb')}`,
                    background: reportFormat === f.key ? f.activeBg : 'transparent',
                    color: reportFormat === f.key ? f.activeColor : subCol,
                    transition: 'all 0.15s',
                  }}>
                  {f.icon}
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{f.label}</span>
                  <span style={{ fontSize: 10, color: subCol, textAlign: 'center' }}>{f.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '14px 20px', borderTop: `1px solid ${dividerCol}`, display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
            <button onClick={() => setReportOpen(false)}
              style={{ padding: '9px 20px', borderRadius: 10, border: `1px solid ${inputBd}`, background: 'transparent', color: headingCol, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancel
            </button>
            <button
              disabled={!reportFormat || sections.every(s => !s.checked) || generating}
              onClick={() => reportFormat === 'excel' ? generateExcel() : generateA4()}
              style={{
                padding: '9px 22px', borderRadius: 10, border: 'none',
                background: reportFormat === 'a4' ? '#2563eb' : '#059669',
                color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7,
                opacity: (!reportFormat || sections.every(s => !s.checked) || generating) ? 0.45 : 1,
              }}>
              {generating
                ? <><Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> Generating…</>
                : <><Download style={{ width: 14, height: 14 }} /> Generate Report</>
              }
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════════
          DELETE ACCOUNT DIALOG — 2 steps
      ════════════════════════════════════════════════════════════════════════ */}
      <AlertDialog open={deleteOpen} onOpenChange={v => { if (!v) { setDeleteOpen(false); setDeleteConfirmText(''); setDeleteStep(1); } }}>
        <AlertDialogContent className="w-[95vw] sm:max-w-md rounded-2xl"
          style={{ background: cardBg, border: `1px solid ${isDark ? '#3f1515' : '#fecaca'}` }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', fontSize: 18, fontWeight: 800 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield style={{ width: 18, height: 18, color: '#dc2626' }} />
              </div>
              {deleteStep === 1 ? 'Delete Account?' : 'Final Confirmation'}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                {deleteStep === 1 ? (
                  <div style={{ fontSize: 13, color: isDark ? '#9ca3af' : '#6b7280', lineHeight: 1.7, marginTop: 6 }}>
                    <p>This will <strong style={{ color: isDark ? '#f3f4f6' : '#111' }}>permanently delete</strong> everything associated with your account:</p>
                    <ul style={{ margin: '10px 0 0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {['All members & their data', 'All attendance records & meetings', 'All celebrations', 'All programs', 'Cell profile information', 'Your login email & account'].map(item => (
                        <li key={item} style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>• {item}</li>
                      ))}
                    </ul>
                    <p style={{ marginTop: 10 }}>You will be <strong style={{ color: '#dc2626' }}>logged out immediately</strong>. This cannot be undone.</p>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: isDark ? '#9ca3af' : '#6b7280', lineHeight: 1.7, marginTop: 6 }}>
                    <p>Type <strong style={{ color: '#dc2626' }}>DELETE</strong> in all caps below to confirm:</p>
                    <input
                      value={deleteConfirmText}
                      onChange={e => setDeleteConfirmText(e.target.value.toUpperCase())}
                      placeholder="Type DELETE here"
                      autoFocus
                      style={{
                        width: '100%', height: 42, padding: '0 14px', marginTop: 12,
                        borderRadius: 10, border: `2px solid ${deleteConfirmText === 'DELETE' ? '#dc2626' : (isDark ? '#3f1515' : '#fecaca')}`,
                        background: isDark ? '#1a0808' : '#fff5f5', color: '#dc2626',
                        fontSize: 15, fontWeight: 700, fontFamily: 'inherit', outline: 'none',
                        letterSpacing: '0.05em', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter style={{ gap: 8, marginTop: 4 }}>
            <AlertDialogCancel
              onClick={() => { setDeleteOpen(false); setDeleteConfirmText(''); setDeleteStep(1); }}
              style={{ borderRadius: 10, background: 'transparent', border: `1px solid ${inputBd}`, color: headingCol, fontFamily: 'inherit' }}>
              Cancel
            </AlertDialogCancel>
            {deleteStep === 1 ? (
              <button
                onClick={() => setDeleteStep(2)}
                style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Yes, Continue
              </button>
            ) : (
              <button
                disabled={deleteConfirmText !== 'DELETE' || deleting}
                onClick={handleDelete}
                style={{
                  padding: '9px 20px', borderRadius: 10, border: 'none',
                  background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 700,
                  cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit', opacity: (deleteConfirmText !== 'DELETE' || deleting) ? 0.45 : 1,
                  display: 'flex', alignItems: 'center', gap: 7,
                }}>
                {deleting
                  ? <><Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> Deleting…</>
                  : <><Trash2 style={{ width: 13, height: 13 }} /> Delete Everything & Log Out</>
                }
              </button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}