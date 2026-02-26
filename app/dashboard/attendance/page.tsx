

// 'use client';

// import { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//   Plus, Eye, Calendar, Users, TrendingUp, TrendingDown,
//   CheckSquare, Square, Save, Loader2, ChevronDown, ChevronRight, Trash2,
// } from 'lucide-react';
// import { createClient } from '@supabase/supabase-js';
// import { useTheme } from '@/app/components/ThemeProvider';
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle,
// } from '@/components/ui/dialog';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
// );

// type Member = { id: number; name: string; phone: string };
// type AttendanceRecord = { id?: number; meeting_id: number; member_id: number; present: boolean };
// type Meeting = { id: number; title: string; date: string; saved: boolean; created_at?: string; attendance: AttendanceRecord[] };

// function useWindowWidth() {
//   const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
//   useEffect(() => {
//     const h = () => setWidth(window.innerWidth);
//     window.addEventListener('resize', h);
//     return () => window.removeEventListener('resize', h);
//   }, []);
//   return width;
// }

// const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// function formatDate(iso: string) {
//   if (!iso) return '';
//   const d = new Date(iso + 'T00:00:00');
//   return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
// }
// function formatDateShort(iso: string) {
//   if (!iso) return '';
//   const d = new Date(iso + 'T00:00:00');
//   return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`.toUpperCase();
// }

// export default function AttendancePage() {
//   const { isDark } = useTheme();
//   const windowWidth = useWindowWidth();
//   const isMobile = windowWidth < 768;

//   const pageBg      = isDark ? '#0f1117' : '#f8f9fb';
//   const cardBg      = isDark ? '#16181f' : '#ffffff';
//   const cardBd      = isDark ? '#1e2028' : '#e5e7eb';
//   const headBg      = isDark ? '#111318' : '#f9fafb';
//   const textPrimary = isDark ? '#f3f4f6' : '#111827';
//   const textMuted   = isDark ? '#6b7280' : '#6b7280';
//   const textSub     = isDark ? '#9ca3af' : '#9ca3af';
//   const inputBg     = isDark ? '#1a1d27' : '#ffffff';
//   const inputBd     = isDark ? '#2a2d3a' : '#e5e7eb';
//   const dividerBd   = isDark ? '#1e2028' : '#f0f0f0';
//   const rowHover    = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
//   const rowPresent  = isDark ? 'rgba(34,197,94,0.08)' : '#f0fdf4';

//   const [members,         setMembers]         = useState<Member[]>([]);
//   const [meetings,        setMeetings]        = useState<Meeting[]>([]);
//   const [activeMeetingId, setActiveMeetingId] = useState<number | null>(null);
//   const [loading,         setLoading]         = useState(true);
//   const [saving,          setSaving]          = useState(false);
//   const [draftAttendance, setDraftAttendance] = useState<Record<number, boolean>>({});
//   const [newMeetingOpen,  setNewMeetingOpen]  = useState(false);
//   const [newTitle,        setNewTitle]        = useState('');
//   const [newDate,         setNewDate]         = useState('');
//   const [creating,        setCreating]        = useState(false);
//   const [historyView,     setHistoryView]     = useState<Meeting | null>(null);
//   const [savedToast,      setSavedToast]      = useState(false);

//   // Collapsible section states
//   const [collapsedHistory,      setCollapsedHistory]      = useState(false);
//   const [collapsedConsistent,   setCollapsedConsistent]   = useState(false);
//   const [collapsedInconsistent, setCollapsedInconsistent] = useState(false);

//   // Delete state
//   const [deletingId,     setDeletingId]     = useState<number | null>(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

//   const fetchMembers = useCallback(async () => {
//     const { data } = await supabase.from('members').select('id, name, phone').order('created_at', { ascending: true });
//     if (data) setMembers(data);
//   }, []);

//   const fetchMeetings = useCallback(async () => {
//     const { data: md, error } = await supabase.from('meetings').select('*').order('date', { ascending: true });
//     if (error || !md) return;
//     const { data: ad } = await supabase.from('attendance_records').select('*');
//     const enriched: Meeting[] = md.map(m => ({ ...m, attendance: (ad || []).filter(a => a.meeting_id === m.id) }));
//     setMeetings(enriched);
//     setActiveMeetingId(prev => {
//       if (prev !== null) return prev;
//       const last = enriched[enriched.length - 1];
//       return last ? last.id : null;
//     });
//   }, []);

//   useEffect(() => {
//     const init = async () => { setLoading(true); await Promise.all([fetchMembers(), fetchMeetings()]); setLoading(false); };
//     init();
//   }, [fetchMembers, fetchMeetings]);

//   useEffect(() => {
//     const s1 = supabase.channel('meetings-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, fetchMeetings).subscribe();
//     const s2 = supabase.channel('attendance-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_records' }, fetchMeetings).subscribe();
//     const s3 = supabase.channel('members-rt-att').on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, fetchMembers).subscribe();
//     return () => { supabase.removeChannel(s1); supabase.removeChannel(s2); supabase.removeChannel(s3); };
//   }, [fetchMeetings, fetchMembers]);

//   useEffect(() => {
//     if (activeMeetingId === null) return;
//     const meeting = meetings.find(m => m.id === activeMeetingId);
//     if (!meeting) return;
//     const map: Record<number, boolean> = {};
//     if (meeting.saved) {
//       meeting.attendance.forEach(a => { map[a.member_id] = a.present; });
//     } else {
//       members.forEach(m => { map[m.id] = meeting.attendance.find(a => a.member_id === m.id)?.present ?? false; });
//     }
//     setDraftAttendance(map);
//   }, [activeMeetingId, meetings, members]);

//   const activeMeeting = meetings.find(m => m.id === activeMeetingId) ?? null;
//   const savedMeetings = meetings.filter(m => m.saved);
//   const totalMembers  = members.length;
//   const presentCount  = Object.values(draftAttendance).filter(Boolean).length;
//   const absentCount   = totalMembers - presentCount;

//   // Fixed: recalculate fresh from savedMeetings every render, last 2 saved meetings
//   const consistencyStats = useMemo(() => {
//     const lastTwo = savedMeetings.slice(-2);
//     if (lastTwo.length === 0) return { consistent: [] as Member[], inconsistent: [] as Member[], meetingCount: 0 };
//     const scores = members.map(m => ({
//       member: m,
//       score: lastTwo.filter(mt => mt.attendance.find(a => a.member_id === m.id && a.present)).length,
//       total: lastTwo.length,
//     }));
//     return {
//       consistent:   scores.filter(s => s.score === s.total).map(s => s.member),
//       inconsistent: scores.filter(s => s.score === 0).map(s => s.member),
//       meetingCount: lastTwo.length,
//     };
//   }, [savedMeetings, members]);

//   const handleCreateMeeting = async () => {
//     if (!newTitle.trim() || !newDate) return;
//     setCreating(true);
//     const { data, error } = await supabase.from('meetings').insert([{ title: newTitle.trim(), date: newDate, saved: false }]).select().single();
//     if (!error && data) {
//       setActiveMeetingId(data.id);
//       const map: Record<number, boolean> = {};
//       members.forEach(m => { map[m.id] = false; });
//       setDraftAttendance(map);
//     }
//     setNewTitle(''); setNewDate(''); setNewMeetingOpen(false); setCreating(false);
//   };

//   const handleDeleteMeeting = async (meetingId: number) => {
//     setDeletingId(meetingId);
//     // Delete attendance records first, then the meeting
//     await supabase.from('attendance_records').delete().eq('meeting_id', meetingId);
//     await supabase.from('meetings').delete().eq('id', meetingId);
//     // If we deleted the active meeting, switch to another
//     if (activeMeetingId === meetingId) {
//       const remaining = meetings.filter(m => m.id !== meetingId);
//       setActiveMeetingId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
//     }
//     setDeletingId(null);
//     setConfirmDeleteId(null);
//   };

//   const toggleAttendance = (memberId: number, field: 'present' | 'absent') => {
//     if (activeMeeting?.saved) return;
//     setDraftAttendance(prev => ({ ...prev, [memberId]: field === 'present' }));
//   };

//   const handleSave = async () => {
//     if (!activeMeeting || activeMeeting.saved) return;
//     setSaving(true);
//     const records = members.map(m => ({ meeting_id: activeMeeting.id, member_id: m.id, present: draftAttendance[m.id] ?? false }));
//     const { error: ae } = await supabase.from('attendance_records').upsert(records, { onConflict: 'meeting_id,member_id' });
//     if (ae) { setSaving(false); return; }
//     const { error: me } = await supabase.from('meetings').update({ saved: true }).eq('id', activeMeeting.id);
//     if (!me) { setSavedToast(true); setTimeout(() => setSavedToast(false), 2500); }
//     setSaving(false);
//   };

//   if (loading) return (
//     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', background: pageBg }}>
//       <Loader2 style={{ width: 32, height: 32, color: textSub, animation: 'spin 1s linear infinite' }} />
//     </div>
//   );

//   // ── Reusable style objects ──────────────────────────────────────────────────
//   const card: React.CSSProperties        = { background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16, overflow: 'hidden', transition: 'background 0.3s, border-color 0.3s' };
//   const cardHead: React.CSSProperties    = { background: headBg, padding: isMobile ? '14px 16px' : '16px 24px', borderBottom: `1px solid ${dividerBd}` };
//   const cardBody: React.CSSProperties    = { padding: isMobile ? '10px 12px 14px' : '12px 16px 16px' };
//   const sectionLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: textMuted };
//   const colW = isMobile ? '52px' : '80px';

//   // Collapsible section header helper
//   const CollapsibleHead = ({
//     label, collapsed, onToggle, extra
//   }: { label: React.ReactNode; collapsed: boolean; onToggle: () => void; extra?: React.ReactNode }) => (
//     <div
//       style={{ ...cardHead, cursor: 'pointer', userSelect: 'none' }}
//       onClick={onToggle}
//     >
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
//           {label}
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//           {extra}
//           {collapsed
//             ? <ChevronRight size={14} color={textSub} />
//             : <ChevronDown size={14} color={textSub} />
//           }
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div  style={{ background: pageBg, minHeight: '100vh', padding: isMobile ? '20px 12px 120px' : '24px 16px 100px', transition: 'background 0.3s', boxSizing: 'border-box' }}>
//       <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

//       {/* Toast */}
//       {savedToast && (
//         <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 50, background: '#16a34a', color: '#fff', padding: '10px 20px', borderRadius: 16, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
//           <CheckSquare size={16} /> Attendance saved!
//         </div>
//       )}

//       <div style={{ maxWidth: 1100, margin: '0 auto' }}>

//         {/* ── Header ─────────────────────────────────────────────────────────── */}
//         <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 20 }}>
//           <div>
//             <h1 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 800, color: textPrimary, letterSpacing: '-0.3px', margin: 0 }}>ATTENDANCE</h1>
//             <p style={{ fontSize: 13, color: textSub, marginTop: 5, margin: '5px 0 0' }}>
//               {activeMeeting ? `Active: ${activeMeeting.title} · ${formatDateShort(activeMeeting.date)}` : 'No active meeting — create one to start'}
//             </p>
//           </div>
//           <button
//             onClick={() => setNewMeetingOpen(true)}
//             style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, padding: '0 22px', borderRadius: 10, background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#ffffff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', transition: 'opacity 0.15s', whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto', flexShrink: 0 }}
//             onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
//             onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
//           >
//             <Plus size={16} /> NEW MEETING
//           </button>
//         </div>

//         {/* ── Stats Row ──────────────────────────────────────────────────────── */}
//         <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
//           {[
//             { icon: <Users size={15} color={textSub} />,         label: 'Total',   value: totalMembers  },
//             { icon: <CheckSquare size={15} color="#22c55e" />,   label: 'Present', value: presentCount  },
//             { icon: <Square size={15} color="#ef4444" />,        label: 'Absent',  value: absentCount   },
//           ].map(s => (
//             <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 12, padding: isMobile ? '9px 12px' : '10px 20px', flex: 1 }}>
//               {s.icon}
//               <span style={{ fontSize: isMobile ? 12 : 14, fontWeight: 600, color: textPrimary, whiteSpace: 'nowrap' }}>
//                 {s.label}: {String(s.value).padStart(2, '0')}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* ── Main Grid ──────────────────────────────────────────────────────── */}
//         <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) 300px', gap: 16, alignItems: 'start' }}>

//           {/* ── Attendance Sheet ─────────────────────────────────────────────── */}
//           <div style={card}>
//             <div style={cardHead}>
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: textMuted, fontSize: isMobile ? 12 : 13, fontWeight: 600, minWidth: 0 }}>
//                   <Calendar size={14} style={{ flexShrink: 0 }} />
//                   <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                     {activeMeeting ? formatDate(activeMeeting.date) : '—'}
//                   </span>
//                 </div>
//                 {activeMeeting?.saved && (
//                   <span style={{ flexShrink: 0, padding: '3px 10px', borderRadius: 20, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', fontSize: 12, fontWeight: 600 }}>
//                     Saved ✓
//                   </span>
//                 )}
//               </div>

//               {meetings.length > 1 && (
//                 <div style={{ marginTop: 12, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
//                   {meetings.map(m => (
//                     <button key={m.id} onClick={() => setActiveMeetingId(m.id)}
//                       style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 8, border: `1px solid ${m.id === activeMeetingId ? (isDark ? '#f3f4f6' : '#111827') : cardBd}`, background: m.id === activeMeetingId ? (isDark ? '#f3f4f6' : '#111827') : cardBg, color: m.id === activeMeetingId ? (isDark ? '#111827' : '#ffffff') : textMuted, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
//                       {m.title} · {formatDateShort(m.date)}
//                     </button>
//                   ))}
//                 </div>
//               )}

//               <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: `1fr ${colW} ${colW}`, gap: 4 }}>
//                 {['Member', 'Present', 'Absent'].map((h, i) => (
//                   <span key={h} style={{ ...sectionLabel, textAlign: i > 0 ? 'center' : 'left', fontSize: 10 }}>{h}</span>
//                 ))}
//               </div>
//             </div>

//             <div style={{ padding: isMobile ? '6px 8px 12px' : '8px 12px 16px' }}>
//               {!activeMeeting ? (
//                 <div style={{ padding: '48px 0', textAlign: 'center', color: textSub, fontSize: 14 }}>No meeting selected.</div>
//               ) : members.length === 0 ? (
//                 <div style={{ padding: '48px 0', textAlign: 'center', color: textSub, fontSize: 14 }}>No members found.</div>
//               ) : members.map((member, idx) => {
//                 const present = draftAttendance[member.id] ?? false;
//                 const locked  = activeMeeting.saved;
//                 return (
//                   <div key={member.id}
//                     style={{ display: 'grid', gridTemplateColumns: `1fr ${colW} ${colW}`, gap: 4, alignItems: 'center', padding: isMobile ? '9px 6px' : '10px 10px', borderRadius: 10, background: present ? rowPresent : 'transparent', marginBottom: 2, transition: 'background 0.15s' }}
//                     onMouseEnter={e => { if (!present) e.currentTarget.style.background = rowHover; }}
//                     onMouseLeave={e => { if (!present) e.currentTarget.style.background = 'transparent'; }}
//                   >
//                     <span style={{ fontSize: isMobile ? 13 : 14, fontWeight: 500, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 4 }}>
//                       {idx + 1}. {member.name}
//                     </span>
//                     <div style={{ display: 'flex', justifyContent: 'center' }}>
//                       <button disabled={locked} onClick={() => toggleAttendance(member.id, 'present')}
//                         style={{ width: 26, height: 26, borderRadius: 6, border: `2px solid ${present ? '#4f46e5' : (isDark ? '#374151' : '#d1d5db')}`, background: present ? '#4f46e5' : 'transparent', cursor: locked ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: locked ? 0.6 : 1, transition: 'all 0.15s', flexShrink: 0 }}>
//                         {present && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
//                       </button>
//                     </div>
//                     <div style={{ display: 'flex', justifyContent: 'center' }}>
//                       <button disabled={locked} onClick={() => toggleAttendance(member.id, 'absent')}
//                         style={{ width: 26, height: 26, borderRadius: 6, border: `2px solid ${!present ? '#ef4444' : (isDark ? '#374151' : '#d1d5db')}`, background: !present ? '#ef4444' : 'transparent', cursor: locked ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: locked ? 0.6 : 1, transition: 'all 0.15s', flexShrink: 0 }}>
//                         {!present && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12"/></svg>}
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* ── Right Column ─────────────────────────────────────────────────── */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

//             {/* History — collapsible */}
//             <div style={card}>
//               <CollapsibleHead
//                 collapsed={collapsedHistory}
//                 onToggle={() => setCollapsedHistory(v => !v)}
//                 label={<span style={sectionLabel}>History</span>}
//               />
//               {!collapsedHistory && (
//                 <div style={{ ...cardBody, display: 'flex', flexDirection: 'column', gap: 8 }}>
//                   {savedMeetings.length === 0 ? (
//                     <p style={{ fontSize: 12, color: textSub, margin: 0 }}>No saved meetings yet.</p>
//                   ) : [...savedMeetings].reverse().map(m => {
//                     const pc = m.attendance.filter(a => a.present).length;
//                     const isActive = m.id === activeMeetingId;
//                     const isDeleting = deletingId === m.id;
//                     const isConfirming = confirmDeleteId === m.id;
//                     return (
//                       <div key={m.id} style={{ position: 'relative' }}>
//                         {/* Confirm delete overlay */}
//                         {isConfirming && (
//                           <div style={{ position: 'absolute', inset: 0, zIndex: 10, borderRadius: 12, background: isDark ? 'rgba(15,17,23,0.95)' : 'rgba(255,255,255,0.97)', border: `1px solid #ef4444`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 10px' }}>
//                             <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444', flex: 1 }}>Delete this meeting?</span>
//                             <button
//                               onClick={() => handleDeleteMeeting(m.id)}
//                               disabled={isDeleting}
//                               style={{ height: 28, padding: '0 10px', borderRadius: 6, border: 'none', background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700, cursor: isDeleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
//                             >
//                               {isDeleting ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : null}
//                               Yes
//                             </button>
//                             <button
//                               onClick={() => setConfirmDeleteId(null)}
//                               style={{ height: 28, padding: '0 10px', borderRadius: 6, border: `1px solid ${cardBd}`, background: 'transparent', color: textMuted, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         )}
//                         <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
//                           <button onClick={() => setHistoryView(m)}
//                             style={{ flex: 1, textAlign: 'left', borderRadius: 12, border: `1px solid ${isActive ? (isDark ? '#f3f4f6' : '#111827') : cardBd}`, background: isActive ? (isDark ? '#f3f4f6' : '#111827') : cardBg, padding: '10px 14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', boxSizing: 'border-box', minWidth: 0 }}
//                             onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = isDark ? '#4b5563' : '#9ca3af'; }}
//                             onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = isActive ? (isDark ? '#f3f4f6' : '#111827') : cardBd; }}
//                           >
//                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
//                               <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? (isDark ? '#111827' : '#ffffff') : textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                                 {m.title.toUpperCase()} – {formatDateShort(m.date)}
//                               </span>
//                               <Eye size={13} color={isActive ? (isDark ? '#111827' : '#ffffff') : textSub} style={{ flexShrink: 0 }} />
//                             </div>
//                             <div style={{ marginTop: 2, fontSize: 11, color: isActive ? (isDark ? '#374151' : '#d1d5db') : textSub }}>
//                               {pc} / {totalMembers} present
//                             </div>
//                           </button>
//                           {/* Delete button */}
//                           <button
//                             onClick={e => { e.stopPropagation(); setConfirmDeleteId(m.id); }}
//                             title="Delete meeting"
//                             style={{ flexShrink: 0, width: 36, borderRadius: 12, border: `1px solid ${cardBd}`, background: cardBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', color: textSub }}
//                             onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
//                             onMouseLeave={e => { e.currentTarget.style.borderColor = cardBd; e.currentTarget.style.color = textSub; }}
//                           >
//                             <Trash2 size={13} />
//                           </button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Most Consistent — collapsible */}
//             <div style={card}>
//               <CollapsibleHead
//                 collapsed={collapsedConsistent}
//                 onToggle={() => setCollapsedConsistent(v => !v)}
//                 label={
//                   <>
//                     <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
//                     <span style={sectionLabel}>Most Consistent</span>
//                   </>
//                 }
//               />
//               {!collapsedConsistent && (
//                 <div style={cardBody}>
//                   <p style={{ fontSize: 11, color: textSub, margin: '0 0 8px' }}>
//                     Attended all of last {consistencyStats.meetingCount} saved meeting{consistencyStats.meetingCount !== 1 ? 's' : ''}
//                   </p>
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
//                     {consistencyStats.consistent.length === 0 ? (
//                       <p style={{ fontSize: 12, color: textSub, margin: 0 }}>
//                         {consistencyStats.meetingCount === 0 ? 'No saved meetings yet.' : 'None found.'}
//                       </p>
//                     ) : consistencyStats.consistent.map((m, i) => (
//                       <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
//                         <TrendingUp size={13} color="#22c55e" style={{ flexShrink: 0 }} />
//                         <span style={{ fontSize: 13, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i + 1}. {m.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Most Inconsistent — collapsible */}
//             <div style={card}>
//               <CollapsibleHead
//                 collapsed={collapsedInconsistent}
//                 onToggle={() => setCollapsedInconsistent(v => !v)}
//                 label={
//                   <>
//                     <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef4444', display: 'inline-block', flexShrink: 0 }} />
//                     <span style={sectionLabel}>Most Inconsistent</span>
//                   </>
//                 }
//               />
//               {!collapsedInconsistent && (
//                 <div style={cardBody}>
//                   <p style={{ fontSize: 11, color: textSub, margin: '0 0 8px' }}>
//                     Missed all of last {consistencyStats.meetingCount} saved meeting{consistencyStats.meetingCount !== 1 ? 's' : ''}
//                   </p>
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
//                     {consistencyStats.inconsistent.length === 0 ? (
//                       <p style={{ fontSize: 12, color: textSub, margin: 0 }}>
//                         {consistencyStats.meetingCount === 0 ? 'No saved meetings yet.' : 'None found.'}
//                       </p>
//                     ) : consistencyStats.inconsistent.map((m, i) => (
//                       <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
//                         <TrendingDown size={13} color="#ef4444" style={{ flexShrink: 0 }} />
//                         <span style={{ fontSize: 13, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i + 1}. {m.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* ── Floating Save Button ─────────────────────────────────────────────── */}
//       {activeMeeting && !activeMeeting.saved && (
//         <div className='mb-20 md:mb-20' style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 40, width: isMobile ? 'calc(100% - 32px)' : 'auto', maxWidth: 340, boxSizing: 'border-box' }}>
//           <button onClick={handleSave} disabled={saving}
//             style={{ width: '100%', height: 52, borderRadius: 16, background: '#16a34a', color: '#fff', border: 'none',padding:6, fontSize: 15, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', fontFamily: 'inherit', opacity: saving ? 0.8 : 1 }}>
//             {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={16} className=''/> Save Attendance</>}
//           </button>
//         </div>
//       )}

//       {/* ── New Meeting Dialog ───────────────────────────────────────────────── */}
//       <Dialog open={newMeetingOpen} onOpenChange={setNewMeetingOpen}>
//         <DialogContent style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 18, padding: 0, width: isMobile ? '92vw' : '420px', maxWidth: '92vw', display: 'flex', flexDirection: 'column', color: textPrimary }}>
//           <DialogHeader style={{ padding: '22px 20px 14px', borderBottom: `1px solid ${dividerBd}` }}>
//             <DialogTitle style={{ fontSize: 17, fontWeight: 700, color: textPrimary }}>New Meeting</DialogTitle>
//           </DialogHeader>
//           <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
//             {[
//               { label: 'Meeting Title', type: 'text',  value: newTitle, set: setNewTitle, placeholder: 'e.g. Bible Study, Prayer Meeting' },
//               { label: 'Date',          type: 'date',  value: newDate,  set: setNewDate,  placeholder: '' },
//             ].map(f => (
//               <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//                 <label style={{ fontSize: 12, fontWeight: 600, color: textSub, letterSpacing: '0.04em' }}>{f.label}</label>
//                 <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
//                   style={{ height: 42, padding: '0 12px', borderRadius: 8, border: `1.5px solid ${inputBd}`, background: inputBg, color: textPrimary, fontSize: 14, fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
//               </div>
//             ))}
//           </div>
//           <div style={{ padding: '14px 20px', borderTop: `1px solid ${dividerBd}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//             <button onClick={() => setNewMeetingOpen(false)}
//               style={{ height: 40, padding: '0 16px', borderRadius: 8, border: `1.5px solid ${cardBd}`, background: 'transparent', color: textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
//               Cancel
//             </button>
//             <button disabled={!newTitle.trim() || !newDate || creating} onClick={handleCreateMeeting}
//               style={{ height: 40, padding: '0 20px', borderRadius: 8, border: 'none', background: (!newTitle.trim() || !newDate || creating) ? (isDark ? '#374151' : '#e5e7eb') : '#059669', color: (!newTitle.trim() || !newDate || creating) ? textSub : '#fff', fontSize: 13, fontWeight: 600, cursor: (!newTitle.trim() || !newDate || creating) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
//               {creating ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Creating…</> : 'Create Meeting'}
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ── History View Dialog ──────────────────────────────────────────────── */}
//       <Dialog open={!!historyView} onOpenChange={() => setHistoryView(null)}>
//         <DialogContent style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 18, padding: 0, width: isMobile ? '92vw' : '460px', maxWidth: '92vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', color: textPrimary }}>
//           <DialogHeader style={{ padding: '20px 20px 14px', borderBottom: `1px solid ${dividerBd}`, flexShrink: 0 }}>
//             <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
//               <div style={{ minWidth: 0 }}>
//                 <DialogTitle style={{ fontSize: 17, fontWeight: 700, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                   {historyView?.title}
//                 </DialogTitle>
//                 <p style={{ fontSize: 12, color: textSub, margin: '4px 0 0' }}>
//                   {historyView ? formatDate(historyView.date) : ''}
//                 </p>
//               </div>
//               <div style={{ textAlign: 'right', flexShrink: 0 }}>
//                 <div style={{ fontSize: 20, fontWeight: 700, color: textPrimary }}>
//                   {historyView?.attendance.filter(a => a.present).length}
//                   <span style={{ fontSize: 13, fontWeight: 400, color: textSub }}>/{totalMembers}</span>
//                 </div>
//                 <div style={{ fontSize: 11, color: textSub }}>present</div>
//               </div>
//             </div>
//           </DialogHeader>
//           <div style={{ overflowY: 'auto', flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
//             {members.map((member, idx) => {
//               const present = historyView?.attendance.find(a => a.member_id === member.id)?.present;
//               return (
//                 <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, background: present ? rowPresent : (isDark ? 'rgba(239,68,68,0.08)' : '#fef2f2'), gap: 8 }}>
//                   <span style={{ fontSize: 13, fontWeight: 500, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                     {idx + 1}. {member.name}
//                   </span>
//                   <span style={{ flexShrink: 0, padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid', background: present ? '#dcfce7' : '#fee2e2', color: present ? '#15803d' : '#dc2626', borderColor: present ? '#86efac' : '#fca5a5' }}>
//                     {present ? 'Present' : 'Absent'}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//           <div style={{ padding: '14px 20px', borderTop: `1px solid ${dividerBd}`, flexShrink: 0 }}>
//             <button onClick={() => setHistoryView(null)}
//               style={{ width: '100%', height: 42, borderRadius: 10, border: 'none', background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
//               Close
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }











'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus, Eye, Calendar, Users, TrendingUp, TrendingDown,
  CheckSquare, Square, Save, Loader2, ChevronDown, ChevronRight, Trash2,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useTheme } from '@/app/components/ThemeProvider';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type Member = { id: number; name: string; phone: string };
type AttendanceRecord = { id?: number; meeting_id: number; member_id: number; present: boolean };
type Meeting = { id: number; title: string; date: string; saved: boolean; created_at?: string; attendance: AttendanceRecord[] };

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return width;
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
}
function formatDateShort(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`.toUpperCase();
}

export default function AttendancePage() {
  const { isDark } = useTheme();
  const windowWidth = useWindowWidth();
  const isMobile  = windowWidth < 640;
  const isTablet  = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const pageBg      = isDark ? '#0f1117' : '#f8f9fb';
  const cardBg      = isDark ? '#16181f' : '#ffffff';
  const cardBd      = isDark ? '#1e2028' : '#e5e7eb';
  const headBg      = isDark ? '#111318' : '#f9fafb';
  const textPrimary = isDark ? '#f3f4f6' : '#111827';
  const textMuted   = isDark ? '#6b7280' : '#6b7280';
  const textSub     = isDark ? '#9ca3af' : '#9ca3af';
  const inputBg     = isDark ? '#1a1d27' : '#ffffff';
  const inputBd     = isDark ? '#2a2d3a' : '#e5e7eb';
  const dividerBd   = isDark ? '#1e2028' : '#f0f0f0';
  const rowHover    = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const rowPresent  = isDark ? 'rgba(34,197,94,0.08)' : '#f0fdf4';

  const [members,         setMembers]         = useState<Member[]>([]);
  const [meetings,        setMeetings]        = useState<Meeting[]>([]);
  const [activeMeetingId, setActiveMeetingId] = useState<number | null>(null);
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [draftAttendance, setDraftAttendance] = useState<Record<number, boolean>>({});
  const [newMeetingOpen,  setNewMeetingOpen]  = useState(false);
  const [newTitle,        setNewTitle]        = useState('');
  const [newDate,         setNewDate]         = useState('');
  const [creating,        setCreating]        = useState(false);
  const [historyView,     setHistoryView]     = useState<Meeting | null>(null);
  const [savedToast,      setSavedToast]      = useState(false);

  const [collapsedHistory,      setCollapsedHistory]      = useState(false);
  const [collapsedConsistent,   setCollapsedConsistent]   = useState(false);
  const [collapsedInconsistent, setCollapsedInconsistent] = useState(false);

  const [deletingId,      setDeletingId]      = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const fetchMembers = useCallback(async () => {
    const { data } = await supabase.from('members').select('id, name, phone').order('created_at', { ascending: true });
    if (data) setMembers(data);
  }, []);

  const fetchMeetings = useCallback(async () => {
    const { data: md, error } = await supabase.from('meetings').select('*').order('date', { ascending: true });
    if (error || !md) return;
    const { data: ad } = await supabase.from('attendance_records').select('*');
    const enriched: Meeting[] = md.map(m => ({ ...m, attendance: (ad || []).filter(a => a.meeting_id === m.id) }));
    setMeetings(enriched);
    setActiveMeetingId(prev => {
      if (prev !== null) return prev;
      const last = enriched[enriched.length - 1];
      return last ? last.id : null;
    });
  }, []);

  useEffect(() => {
    const init = async () => { setLoading(true); await Promise.all([fetchMembers(), fetchMeetings()]); setLoading(false); };
    init();
  }, [fetchMembers, fetchMeetings]);

  useEffect(() => {
    const s1 = supabase.channel('meetings-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, fetchMeetings).subscribe();
    const s2 = supabase.channel('attendance-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_records' }, fetchMeetings).subscribe();
    const s3 = supabase.channel('members-rt-att').on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, fetchMembers).subscribe();
    return () => { supabase.removeChannel(s1); supabase.removeChannel(s2); supabase.removeChannel(s3); };
  }, [fetchMeetings, fetchMembers]);

  useEffect(() => {
    if (activeMeetingId === null) return;
    const meeting = meetings.find(m => m.id === activeMeetingId);
    if (!meeting) return;
    const map: Record<number, boolean> = {};
    if (meeting.saved) {
      meeting.attendance.forEach(a => { map[a.member_id] = a.present; });
    } else {
      members.forEach(m => { map[m.id] = meeting.attendance.find(a => a.member_id === m.id)?.present ?? false; });
    }
    setDraftAttendance(map);
  }, [activeMeetingId, meetings, members]);

  const activeMeeting = meetings.find(m => m.id === activeMeetingId) ?? null;
  const savedMeetings = meetings.filter(m => m.saved);
  const totalMembers  = members.length;
  const presentCount  = Object.values(draftAttendance).filter(Boolean).length;
  const absentCount   = totalMembers - presentCount;

  const consistencyStats = useMemo(() => {
    const lastTwo = savedMeetings.slice(-2);
    if (lastTwo.length === 0) return { consistent: [] as Member[], inconsistent: [] as Member[], meetingCount: 0 };
    const scores = members.map(m => ({
      member: m,
      score: lastTwo.filter(mt => mt.attendance.find(a => a.member_id === m.id && a.present)).length,
      total: lastTwo.length,
    }));
    return {
      consistent:   scores.filter(s => s.score === s.total).map(s => s.member),
      inconsistent: scores.filter(s => s.score === 0).map(s => s.member),
      meetingCount: lastTwo.length,
    };
  }, [savedMeetings, members]);

  const handleCreateMeeting = async () => {
    if (!newTitle.trim() || !newDate) return;
    setCreating(true);
    const { data, error } = await supabase.from('meetings').insert([{ title: newTitle.trim(), date: newDate, saved: false }]).select().single();
    if (!error && data) {
      setActiveMeetingId(data.id);
      const map: Record<number, boolean> = {};
      members.forEach(m => { map[m.id] = false; });
      setDraftAttendance(map);
    }
    setNewTitle(''); setNewDate(''); setNewMeetingOpen(false); setCreating(false);
  };

  const handleDeleteMeeting = async (meetingId: number) => {
    setDeletingId(meetingId);
    await supabase.from('attendance_records').delete().eq('meeting_id', meetingId);
    await supabase.from('meetings').delete().eq('id', meetingId);
    if (activeMeetingId === meetingId) {
      const remaining = meetings.filter(m => m.id !== meetingId);
      setActiveMeetingId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const toggleAttendance = (memberId: number, field: 'present' | 'absent') => {
    if (activeMeeting?.saved) return;
    setDraftAttendance(prev => ({ ...prev, [memberId]: field === 'present' }));
  };

  const handleSave = async () => {
    if (!activeMeeting || activeMeeting.saved) return;
    setSaving(true);
    const records = members.map(m => ({ meeting_id: activeMeeting.id, member_id: m.id, present: draftAttendance[m.id] ?? false }));
    const { error: ae } = await supabase.from('attendance_records').upsert(records, { onConflict: 'meeting_id,member_id' });
    if (ae) { setSaving(false); return; }
    const { error: me } = await supabase.from('meetings').update({ saved: true }).eq('id', activeMeeting.id);
    if (!me) { setSavedToast(true); setTimeout(() => setSavedToast(false), 2500); }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', background: pageBg }}>
      <Loader2 style={{ width: 32, height: 32, color: textSub, animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const card: React.CSSProperties = {
    background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16,
    overflow: 'hidden', transition: 'background 0.3s, border-color 0.3s',
  };
  const cardHead: React.CSSProperties = {
    background: headBg,
    padding: isMobile ? '12px 14px' : '14px 20px',
    borderBottom: `1px solid ${dividerBd}`,
  };
  const cardBody: React.CSSProperties = {
    padding: isMobile ? '10px 10px 14px' : '12px 16px 16px',
  };
  const sectionLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase' as const, color: textMuted,
  };

  // Checkbox column — bigger tap target on mobile
  const colW = isMobile ? '46px' : '72px';
  const btnSize = isMobile ? 30 : 26;

  // Grid: side-by-side only on desktop
  const gridCols = isDesktop ? 'minmax(0,1fr) 300px' : '1fr';
  const pagePad  = isMobile ? '14px 12px 150px' : isTablet ? '20px 20px 120px' : '24px 24px 100px';

  const CollapsibleHead = ({
    label, collapsed, onToggle,
  }: { label: React.ReactNode; collapsed: boolean; onToggle: () => void }) => (
    <div style={{ ...cardHead, cursor: 'pointer', userSelect: 'none' as const }} onClick={onToggle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>{label}</div>
        {collapsed ? <ChevronRight size={14} color={textSub} /> : <ChevronDown size={14} color={textSub} />}
      </div>
    </div>
  );

  return (
    <div style={{ background: pageBg, minHeight: '100vh', padding: pagePad, transition: 'background 0.3s', boxSizing: 'border-box' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .no-scroll::-webkit-scrollbar { display: none; }
        .no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Toast */}
      {savedToast && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#16a34a', color: '#fff', padding: '10px 18px', borderRadius: 14, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', whiteSpace: 'nowrap', maxWidth: 'calc(100vw - 32px)' }}>
          <CheckSquare size={15} /> Attendance saved!
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 800, color: textPrimary, letterSpacing: '-0.3px', margin: 0 }}>ATTENDANCE</h1>
            <p style={{ fontSize: isMobile ? 11 : 13, color: textSub, margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeMeeting ? `${activeMeeting.title} · ${formatDateShort(activeMeeting.date)}` : 'No active meeting — create one to start'}
            </p>
          </div>
          <button
            onClick={() => setNewMeetingOpen(true)}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: isMobile ? 44 : 42, padding: '0 18px', borderRadius: 10, background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#ffffff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', transition: 'opacity 0.15s', whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto', touchAction: 'manipulation' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Plus size={15} /> NEW MEETING
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { icon: <Users size={14} color={textSub} />,       label: 'Total',   value: totalMembers },
            { icon: <CheckSquare size={14} color="#22c55e" />, label: 'Present', value: presentCount },
            { icon: <Square size={14} color="#ef4444" />,      label: 'Absent',  value: absentCount  },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 8, background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 10, padding: isMobile ? '8px 10px' : '10px 16px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <span style={{ flexShrink: 0 }}>{s.icon}</span>
              <span style={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {/* Short label on very small screens */}
                {isMobile ? s.label.slice(0, 3) : s.label}: <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{String(s.value).padStart(2, '0')}</strong>
              </span>
            </div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 14, alignItems: 'start' }}>

          {/* ── Attendance Sheet ── */}
          <div style={card}>
            <div style={cardHead}>
              {/* Date + saved badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: textMuted, fontSize: isMobile ? 11 : 12, fontWeight: 600, minWidth: 0, flex: 1 }}>
                  <Calendar size={13} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeMeeting ? formatDate(activeMeeting.date) : '—'}
                  </span>
                </div>
                {activeMeeting?.saved && (
                  <span style={{ flexShrink: 0, padding: '2px 9px', borderRadius: 20, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', fontSize: 11, fontWeight: 600 }}>
                    Saved ✓
                  </span>
                )}
              </div>

              {/* Meeting tabs — scrollable, hidden scrollbar */}
              {meetings.length > 1 && (
                <div className="no-scroll" style={{ marginTop: 10, display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, WebkitOverflowScrolling: 'touch' as any }}>
                  {meetings.map(m => (
                    <button key={m.id} onClick={() => setActiveMeetingId(m.id)}
                      style={{ flexShrink: 0, fontSize: 10, fontWeight: 600, padding: isMobile ? '5px 9px' : '5px 10px', borderRadius: 8, border: `1px solid ${m.id === activeMeetingId ? (isDark ? '#f3f4f6' : '#111827') : cardBd}`, background: m.id === activeMeetingId ? (isDark ? '#f3f4f6' : '#111827') : cardBg, color: m.id === activeMeetingId ? (isDark ? '#111827' : '#ffffff') : textMuted, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap', touchAction: 'manipulation' }}>
                      {m.title} · {formatDateShort(m.date)}
                    </button>
                  ))}
                </div>
              )}

              {/* Column headers */}
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: `1fr ${colW} ${colW}`, gap: 4 }}>
                {['Member', 'Present', 'Absent'].map((h, i) => (
                  <span key={h} style={{ ...sectionLabel, textAlign: i > 0 ? 'center' : 'left', fontSize: 10 }}>{h}</span>
                ))}
              </div>
            </div>

            {/* Member rows */}
            <div style={{ padding: isMobile ? '4px 6px 14px' : '6px 10px 16px' }}>
              {!activeMeeting ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: textSub, fontSize: 13 }}>No meeting selected.</div>
              ) : members.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: textSub, fontSize: 13 }}>No members found.</div>
              ) : members.map((member, idx) => {
                const present = draftAttendance[member.id] ?? false;
                const locked  = activeMeeting.saved;
                return (
                  <div key={member.id}
                    style={{ display: 'grid', gridTemplateColumns: `1fr ${colW} ${colW}`, gap: 4, alignItems: 'center', padding: isMobile ? '9px 4px' : '9px 8px', borderRadius: 10, background: present ? rowPresent : 'transparent', marginBottom: 1, transition: 'background 0.15s' }}
                    onMouseEnter={e => { if (!present) e.currentTarget.style.background = rowHover; }}
                    onMouseLeave={e => { e.currentTarget.style.background = present ? rowPresent : 'transparent'; }}
                  >
                    <span style={{ fontSize: isMobile ? 12 : 14, fontWeight: 500, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 4 }}>
                      {idx + 1}. {member.name}
                    </span>
                    {/* Present */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button disabled={locked} onClick={() => toggleAttendance(member.id, 'present')}
                        style={{ width: btnSize, height: btnSize, borderRadius: 7, border: `2px solid ${present ? '#4f46e5' : (isDark ? '#374151' : '#d1d5db')}`, background: present ? '#4f46e5' : 'transparent', cursor: locked ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: locked ? 0.6 : 1, transition: 'all 0.15s', flexShrink: 0, touchAction: 'manipulation' }}>
                        {present && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
                      </button>
                    </div>
                    {/* Absent */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button disabled={locked} onClick={() => toggleAttendance(member.id, 'absent')}
                        style={{ width: btnSize, height: btnSize, borderRadius: 7, border: `2px solid ${!present ? '#ef4444' : (isDark ? '#374151' : '#d1d5db')}`, background: !present ? '#ef4444' : 'transparent', cursor: locked ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: locked ? 0.6 : 1, transition: 'all 0.15s', flexShrink: 0, touchAction: 'manipulation' }}>
                        {!present && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12"/></svg>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right Column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* History */}
            <div style={card}>
              <CollapsibleHead
                collapsed={collapsedHistory}
                onToggle={() => setCollapsedHistory(v => !v)}
                label={<span style={sectionLabel}>History</span>}
              />
              {!collapsedHistory && (
                <div style={{ ...cardBody, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {savedMeetings.length === 0 ? (
                    <p style={{ fontSize: 12, color: textSub, margin: 0 }}>No saved meetings yet.</p>
                  ) : [...savedMeetings].reverse().map(m => {
                    const pc = m.attendance.filter(a => a.present).length;
                    const isActive    = m.id === activeMeetingId;
                    const isDeleting  = deletingId === m.id;
                    const isConfirming = confirmDeleteId === m.id;
                    return (
                      <div key={m.id} style={{ position: 'relative' }}>
                        {/* Confirm overlay */}
                        {isConfirming && (
                          <div style={{ position: 'absolute', inset: 0, zIndex: 10, borderRadius: 12, background: isDark ? 'rgba(15,17,23,0.96)' : 'rgba(255,255,255,0.97)', border: `1px solid #ef4444`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 10px' }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444', flex: 1 }}>Delete this meeting?</span>
                            <button onClick={() => handleDeleteMeeting(m.id)} disabled={isDeleting}
                              style={{ height: 28, padding: '0 10px', borderRadius: 6, border: 'none', background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700, cursor: isDeleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4, touchAction: 'manipulation' }}>
                              {isDeleting ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : null} Yes
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)}
                              style={{ height: 28, padding: '0 10px', borderRadius: 6, border: `1px solid ${cardBd}`, background: 'transparent', color: textMuted, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', touchAction: 'manipulation' }}>
                              Cancel
                            </button>
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
                          <button onClick={() => setHistoryView(m)}
                            style={{ flex: 1, textAlign: 'left', borderRadius: 12, border: `1px solid ${isActive ? (isDark ? '#f3f4f6' : '#111827') : cardBd}`, background: isActive ? (isDark ? '#f3f4f6' : '#111827') : cardBg, padding: '10px 12px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', boxSizing: 'border-box', minWidth: 0, touchAction: 'manipulation' }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = isDark ? '#4b5563' : '#9ca3af'; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = isActive ? (isDark ? '#f3f4f6' : '#111827') : cardBd; }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? (isDark ? '#111827' : '#ffffff') : textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {m.title.toUpperCase()} – {formatDateShort(m.date)}
                              </span>
                              <Eye size={12} color={isActive ? (isDark ? '#111827' : '#ffffff') : textSub} style={{ flexShrink: 0 }} />
                            </div>
                            <div style={{ marginTop: 2, fontSize: 11, color: isActive ? (isDark ? '#374151' : '#d1d5db') : textSub }}>
                              {pc} / {totalMembers} present
                            </div>
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setConfirmDeleteId(m.id); }}
                            title="Delete meeting"
                            style={{ flexShrink: 0, width: isMobile ? 40 : 36, borderRadius: 12, border: `1px solid ${cardBd}`, background: cardBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', color: textSub, touchAction: 'manipulation' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = cardBd; (e.currentTarget as HTMLElement).style.color = textSub; }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Most Consistent */}
            <div style={card}>
              <CollapsibleHead
                collapsed={collapsedConsistent}
                onToggle={() => setCollapsedConsistent(v => !v)}
                label={
                  <>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
                    <span style={sectionLabel}>Most Consistent</span>
                  </>
                }
              />
              {!collapsedConsistent && (
                <div style={cardBody}>
                  <p style={{ fontSize: 11, color: textSub, margin: '0 0 8px' }}>
                    Attended all of last {consistencyStats.meetingCount} saved meeting{consistencyStats.meetingCount !== 1 ? 's' : ''}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {consistencyStats.consistent.length === 0 ? (
                      <p style={{ fontSize: 12, color: textSub, margin: 0 }}>
                        {consistencyStats.meetingCount === 0 ? 'No saved meetings yet.' : 'None found.'}
                      </p>
                    ) : consistencyStats.consistent.map((m, i) => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
                        <TrendingUp size={13} color="#22c55e" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i + 1}. {m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Most Inconsistent */}
            <div style={card}>
              <CollapsibleHead
                collapsed={collapsedInconsistent}
                onToggle={() => setCollapsedInconsistent(v => !v)}
                label={
                  <>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', flexShrink: 0 }} />
                    <span style={sectionLabel}>Most Inconsistent</span>
                  </>
                }
              />
              {!collapsedInconsistent && (
                <div style={cardBody}>
                  <p style={{ fontSize: 11, color: textSub, margin: '0 0 8px' }}>
                    Missed all of last {consistencyStats.meetingCount} saved meeting{consistencyStats.meetingCount !== 1 ? 's' : ''}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {consistencyStats.inconsistent.length === 0 ? (
                      <p style={{ fontSize: 12, color: textSub, margin: 0 }}>
                        {consistencyStats.meetingCount === 0 ? 'No saved meetings yet.' : 'None found.'}
                      </p>
                    ) : consistencyStats.inconsistent.map((m, i) => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
                        <TrendingDown size={13} color="#ef4444" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i + 1}. {m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Floating Save Button ── */}
      {activeMeeting && !activeMeeting.saved && (
        <div style={{ position: 'fixed', bottom: isMobile ? 16 : 24, left: '50%', transform: 'translateX(-50%)', zIndex: 40, width: isMobile ? 'calc(100% - 24px)' : isTablet ? '400px' : 'auto', maxWidth: isMobile ? 500 : 340, boxSizing: 'border-box' }}>
          <button onClick={handleSave} disabled={saving}
            style={{ width: '100%', height: isMobile ? 56 : 52, borderRadius: 16, background: '#16a34a', color: '#fff', border: 'none', fontSize: isMobile ? 15 : 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', fontFamily: 'inherit', opacity: saving ? 0.8 : 1, touchAction: 'manipulation' }}>
            {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={16} /> Save Attendance</>}
          </button>
        </div>
      )}

      {/* ── New Meeting Dialog ── */}
      <Dialog open={newMeetingOpen} onOpenChange={setNewMeetingOpen}>
        <DialogContent style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 18, padding: 0, width: isMobile ? 'calc(100vw - 24px)' : '420px', maxWidth: '96vw', display: 'flex', flexDirection: 'column', color: textPrimary }}>
          <DialogHeader style={{ padding: '20px 18px 14px', borderBottom: `1px solid ${dividerBd}` }}>
            <DialogTitle style={{ fontSize: 16, fontWeight: 700, color: textPrimary }}>New Meeting</DialogTitle>
          </DialogHeader>
          <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Meeting Title', type: 'text', value: newTitle, set: setNewTitle, placeholder: 'e.g. Bible Study, Prayer Meeting' },
              { label: 'Date',          type: 'date', value: newDate,  set: setNewDate,  placeholder: '' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: textSub, letterSpacing: '0.04em' }}>{f.label}</label>
                <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                  style={{ height: 46, padding: '0 12px', borderRadius: 8, border: `1.5px solid ${inputBd}`, background: inputBg, color: textPrimary, fontSize: 15, fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 18px 20px', borderTop: `1px solid ${dividerBd}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setNewMeetingOpen(false)}
              style={{ height: 44, padding: '0 16px', borderRadius: 8, border: `1.5px solid ${cardBd}`, background: 'transparent', color: textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', touchAction: 'manipulation' }}>
              Cancel
            </button>
            <button disabled={!newTitle.trim() || !newDate || creating} onClick={handleCreateMeeting}
              style={{ height: 44, padding: '0 20px', borderRadius: 8, border: 'none', background: (!newTitle.trim() || !newDate || creating) ? (isDark ? '#374151' : '#e5e7eb') : '#059669', color: (!newTitle.trim() || !newDate || creating) ? textSub : '#fff', fontSize: 13, fontWeight: 600, cursor: (!newTitle.trim() || !newDate || creating) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, touchAction: 'manipulation' }}>
              {creating ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Creating…</> : 'Create Meeting'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── History View Dialog ── */}
      <Dialog open={!!historyView} onOpenChange={() => setHistoryView(null)}>
        <DialogContent style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 18, padding: 0, width: isMobile ? 'calc(100vw - 24px)' : '460px', maxWidth: '96vw', maxHeight: isMobile ? '90vh' : '85vh', display: 'flex', flexDirection: 'column', color: textPrimary }}>
          <DialogHeader style={{ padding: '18px 18px 12px', borderBottom: `1px solid ${dividerBd}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <DialogTitle style={{ fontSize: 16, fontWeight: 700, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {historyView?.title}
                </DialogTitle>
                <p style={{ fontSize: 11, color: textSub, margin: '3px 0 0' }}>
                  {historyView ? formatDate(historyView.date) : ''}
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: textPrimary, lineHeight: 1 }}>
                  {historyView?.attendance.filter(a => a.present).length}
                  <span style={{ fontSize: 13, fontWeight: 400, color: textSub }}>/{totalMembers}</span>
                </div>
                <div style={{ fontSize: 11, color: textSub, marginTop: 2 }}>present</div>
              </div>
            </div>
          </DialogHeader>
          <div style={{ overflowY: 'auto', flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 5, WebkitOverflowScrolling: 'touch' as any }}>
            {members.map((member, idx) => {
              const present = historyView?.attendance.find(a => a.member_id === member.id)?.present;
              return (
                <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '9px 10px' : '8px 12px', borderRadius: 10, background: present ? rowPresent : (isDark ? 'rgba(239,68,68,0.08)' : '#fef2f2'), gap: 8 }}>
                  <span style={{ fontSize: isMobile ? 13 : 13, fontWeight: 500, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {idx + 1}. {member.name}
                  </span>
                  <span style={{ flexShrink: 0, padding: '2px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid', background: present ? '#dcfce7' : '#fee2e2', color: present ? '#15803d' : '#dc2626', borderColor: present ? '#86efac' : '#fca5a5' }}>
                    {present ? 'Present' : 'Absent'}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '12px 18px 18px', borderTop: `1px solid ${dividerBd}`, flexShrink: 0 }}>
            <button onClick={() => setHistoryView(null)}
              style={{ width: '100%', height: 46, borderRadius: 10, border: 'none', background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', touchAction: 'manipulation' }}>
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}