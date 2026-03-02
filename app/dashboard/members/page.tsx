
// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   Trash2, Eye, Pencil, Plus, Users, X, Search, MoreVertical, Check,
// } from 'lucide-react';
// import { createClient } from '@/lib/supabase/client';
// import { useTheme } from '@/app/components/ThemeProvider';
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
//   AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,
// } from '@/components/ui/dialog';
// import ReactDOM from 'react-dom';
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from '@/components/ui/select';

// const supabase = createClient();

// type Member = {
//   id: number; name: string; phone: string;
//   birthday_date?: string; bio?: string;
//   gender?: 'Male' | 'Female'; join_date?: string; created_at?: string;
// };

// type RawCelebration = {
//   id: number; name: string; event: string;
//   event_date?: string; notes?: string; created_at?: string;
// };

// type Celebration = {
//   id: number; name: string; event: string;
//   day: number; month: number; colorKey: string;
//   event_date?: string; created_at?: string;
// };

// type CelebForm = {
//   name?: string; month?: number; day?: number; event?: string; colorKey?: string;
// };

// const MONTH_NAMES = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December',
// ];

// const COLOR_OPTIONS = [
//   { key: 'violet',  swatch: '#7c3aed', bg: '#faf5ff', text: '#7c3aed', border: '#c084fc' },
//   { key: 'fuchsia', swatch: '#a855f7', bg: '#fdf4ff', text: '#a855f7', border: '#e879f9' },
//   { key: 'pink',    swatch: '#db2777', bg: '#fdf2f8', text: '#db2777', border: '#f9a8d4' },
//   { key: 'red',     swatch: '#dc2626', bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' },
//   { key: 'orange',  swatch: '#ea580c', bg: '#fff7ed', text: '#ea580c', border: '#fdba74' },
//   { key: 'yellow',  swatch: '#ca8a04', bg: '#fefce8', text: '#ca8a04', border: '#fde047' },
//   { key: 'green',   swatch: '#16a34a', bg: '#f0fdf4', text: '#16a34a', border: '#86efac' },
//   { key: 'teal',    swatch: '#0d9488', bg: '#f0fdfa', text: '#0d9488', border: '#5eead4' },
//   { key: 'cyan',    swatch: '#0891b2', bg: '#ecfeff', text: '#0891b2', border: '#67e8f9' },
//   { key: 'blue',    swatch: '#2563eb', bg: '#eff6ff', text: '#2563eb', border: '#93c5fd' },
//   { key: 'indigo',  swatch: '#4338ca', bg: '#eef2ff', text: '#4338ca', border: '#a5b4fc' },
//   { key: 'rose',    swatch: '#e11d48', bg: '#fff1f2', text: '#e11d48', border: '#fda4af' },
// ] as const;

// type ColorKey = typeof COLOR_OPTIONS[number]['key'];
// const DEFAULT_COLOR: ColorKey = 'violet';

// function getColorOption(key?: string) {
//   return COLOR_OPTIONS.find(c => c.key === key) ?? COLOR_OPTIONS[0];
// }

// function parseDayFromDate(event_date?: string): number {
//   if (!event_date) return 0;
//   const parts = event_date.split('-');
//   return parts.length === 3 ? parseInt(parts[2], 10) : 0;
// }

// function parseMonthFromDate(event_date?: string): number {
//   if (!event_date) return 0;
//   const parts = event_date.split('-');
//   return parts.length === 3 ? parseInt(parts[1], 10) : 0;
// }

// function enrichCeleb(raw: RawCelebration): Celebration {
//   return {
//     id: raw.id,
//     name: raw.name,
//     event: raw.event,
//     day: parseDayFromDate(raw.event_date),
//     month: parseMonthFromDate(raw.event_date),
//     colorKey: raw.notes || DEFAULT_COLOR,
//     event_date: raw.event_date,
//     created_at: raw.created_at,
//   };
// }

// function ColorPillPicker({ value, onChange, eventLabel, textPrimary, textSub }: {
//   value: string; onChange: (key: string) => void;
//   eventLabel?: string; textPrimary: string; textSub: string;
// }) {
//   const selected = getColorOption(value);
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//         {COLOR_OPTIONS.map(opt => (
//           <button key={opt.key} type="button" title={opt.key.charAt(0).toUpperCase() + opt.key.slice(1)}
//             onClick={() => onChange(opt.key)}
//             style={{
//               width: 28, height: 28, borderRadius: '50%', background: opt.swatch, padding: 0,
//               border: value === opt.key ? `3px solid ${textPrimary}` : '3px solid transparent',
//               outline: value === opt.key ? `2px solid ${opt.swatch}` : 'none', outlineOffset: 1,
//               cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               transition: 'transform 0.12s, border 0.12s', flexShrink: 0,
//               transform: value === opt.key ? 'scale(1.2)' : 'scale(1)',
//             }}>
//             {value === opt.key && <Check size={13} color="#fff" strokeWidth={3} />}
//           </button>
//         ))}
//       </div>
//       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//         <span style={{ fontSize: 12, color: textSub, fontWeight: 500, whiteSpace: 'nowrap' }}>Preview:</span>
//         <span style={{
//           padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
//           border: `1.5px solid ${selected.border}`, background: selected.bg, color: selected.text, whiteSpace: 'nowrap',
//         }}>
//           {eventLabel?.trim() || 'Event Name'}
//         </span>
//       </div>
//     </div>
//   );
// }

// function EventPill({ event, colorKey, small = false }: { event: string; colorKey?: string; small?: boolean }) {
//   const { bg, text, border } = getColorOption(colorKey);
//   return (
//     <span style={{
//       padding: small ? '2px 10px' : '4px 14px', borderRadius: 999,
//       fontSize: small ? 11 : 12, fontWeight: 700,
//       border: `1.5px solid ${border}`, display: 'inline-block',
//       background: bg, color: text, letterSpacing: '0.01em', whiteSpace: 'nowrap',
//     }}>{event}</span>
//   );
// }

// function PortalMenu({ anchor, children, onClose }: {
//   anchor: React.RefObject<HTMLElement>; children: React.ReactNode; onClose: () => void;
// }) {
//   const [pos, setPos] = useState({ top: 0, right: 0 });
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => {
//     setMounted(true);
//     if (anchor.current) {
//       const rect = anchor.current.getBoundingClientRect();
//       setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
//     }
//     const h = (e: MouseEvent) => { if (anchor.current && !anchor.current.contains(e.target as Node)) onClose(); };
//     document.addEventListener('mousedown', h);
//     return () => document.removeEventListener('mousedown', h);
//   }, [anchor, onClose]);
//   if (!mounted) return null;
//   return ReactDOM.createPortal(
//     <div style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }} onMouseDown={e => e.stopPropagation()}>{children}</div>,
//     document.body
//   );
// }

// function ActionMenu({ onView, onEdit, onDelete, isDark }: {
//   onView: () => void; onEdit: () => void; onDelete: () => void; isDark: boolean;
// }) {
//   const [open, setOpen] = useState(false);
//   const btnRef = useRef<HTMLButtonElement>(null);
//   const close = useCallback(() => setOpen(false), []);
//   const menuBg = isDark ? '#1e2028' : '#ffffff'; const menuBd = isDark ? '#2a2d3a' : '#e5e7eb';
//   const menuColor = isDark ? '#f3f4f6' : '#111827'; const hoverBg = isDark ? '#2a2d3a' : '#f3f4f6';
//   return (
//     <>
//       <button ref={btnRef} onClick={() => setOpen(o => !o)}
//         style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: open ? (isDark ? '#2a2d3a' : '#f3f4f6') : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#9ca3af' : '#6b7280', transition: 'background 0.15s' }}>
//         <MoreVertical size={17} />
//       </button>
//       {open && (
//         <PortalMenu anchor={btnRef as React.RefObject<HTMLElement>} onClose={close}>
//           <div style={{ background: menuBg, border: `1px solid ${menuBd}`, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.22)', minWidth: 155, overflow: 'hidden', animation: 'ddFadeIn 0.12s ease' }}>
//             {[
//               { label: 'View details', icon: <Eye size={14} />, action: onView, color: menuColor },
//               { label: 'Edit member', icon: <Pencil size={14} />, action: onEdit, color: menuColor },
//               { label: 'Delete', icon: <Trash2 size={14} />, action: onDelete, color: '#ef4444' },
//             ].map(({ label, icon, action, color }) => (
//               <button key={label} onClick={() => { action(); setOpen(false); }}
//                 style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', color, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'background 0.12s', textAlign: 'left', fontFamily: 'inherit' }}
//                 onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
//                 onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
//                 {icon}{label}
//               </button>
//             ))}
//           </div>
//         </PortalMenu>
//       )}
//     </>
//   );
// }

// function CelebActionMenu({ onEdit, onDelete, isDark }: { onEdit: () => void; onDelete: () => void; isDark: boolean }) {
//   const [open, setOpen] = useState(false);
//   const btnRef = useRef<HTMLButtonElement>(null);
//   const close = useCallback(() => setOpen(false), []);
//   const menuBg = isDark ? '#1e2028' : '#ffffff'; const menuBd = isDark ? '#2a2d3a' : '#e5e7eb';
//   const menuColor = isDark ? '#f3f4f6' : '#111827'; const hoverBg = isDark ? '#2a2d3a' : '#f3f4f6';
//   return (
//     <>
//       <button ref={btnRef} onClick={() => setOpen(o => !o)}
//         style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: open ? (isDark ? '#2a2d3a' : '#f3f4f6') : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#9ca3af' : '#6b7280', transition: 'background 0.15s' }}>
//         <MoreVertical size={17} />
//       </button>
//       {open && (
//         <PortalMenu anchor={btnRef as React.RefObject<HTMLElement>} onClose={close}>
//           <div style={{ background: menuBg, border: `1px solid ${menuBd}`, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.22)', minWidth: 130, overflow: 'hidden', animation: 'ddFadeIn 0.12s ease' }}>
//             {[
//               { label: 'Edit', icon: <Pencil size={14} />, action: onEdit, color: menuColor },
//               { label: 'Delete', icon: <Trash2 size={14} />, action: onDelete, color: '#ef4444' },
//             ].map(({ label, icon, action, color }) => (
//               <button key={label} onClick={() => { action(); setOpen(false); }}
//                 style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', color, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'background 0.12s', textAlign: 'left', fontFamily: 'inherit' }}
//                 onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
//                 onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
//                 {icon}{label}
//               </button>
//             ))}
//           </div>
//         </PortalMenu>
//       )}
//     </>
//   );
// }

// export default function MembersPage() {
//   const { isDark } = useTheme();
//   const [userId, setUserId] = useState<string | null>(null);
//   useEffect(() => { supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null)); }, []);

//   const [members, setMembers] = useState<Member[]>([]);
//   const [celebrations, setCelebrations] = useState<Celebration[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showAllMembers, setShowAllMembers] = useState(false);

//   const currentMonthRef = useRef(new Date().getMonth() + 1);
//   const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);
//   const [currentMonthName, setCurrentMonthName] = useState(() => MONTH_NAMES[new Date().getMonth()]);

//   const [viewMember, setViewMember] = useState<Member | null>(null);
//   const [editMember, setEditMember] = useState<Member | null>(null);
//   const [addMemberOpen, setAddMemberOpen] = useState(false);
//   const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null);
//   const [newMember, setNewMember] = useState<Partial<Member>>({});
//   const [editedMember, setEditedMember] = useState<Partial<Member>>({});

//   const [addCelebOpen, setAddCelebOpen] = useState(false);
//   const [editCeleb, setEditCeleb] = useState<Celebration | null>(null);
//   const [deleteCelebId, setDeleteCelebId] = useState<number | null>(null);
//   const [newCeleb, setNewCeleb] = useState<CelebForm>({ colorKey: DEFAULT_COLOR });
//   const [editedCeleb, setEditedCeleb] = useState<CelebForm>({});

//   const pageBg = isDark ? '#0f1117' : '#f8f9fb'; const cardBg = isDark ? '#16181f' : '#ffffff';
//   const cardBd = isDark ? '#1e2028' : '#e5e7eb'; const headBg = isDark ? '#111318' : '#f9fafb';
//   const textPrimary = isDark ? '#f3f4f6' : '#111827'; const textMuted = isDark ? '#6b7280' : '#6b7280';
//   const textSub = isDark ? '#9ca3af' : '#9ca3af'; const inputBg = isDark ? '#1a1d27' : '#ffffff';
//   const inputBd = isDark ? '#2a2d3a' : '#e5e7eb'; const rowHover = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
//   const dividerBd = isDark ? '#1e2028' : '#f0f0f0';

//   useEffect(() => {
//     const check = () => { const now = new Date(); const m = now.getMonth() + 1; currentMonthRef.current = m; setCurrentMonth(m); setCurrentMonthName(MONTH_NAMES[now.getMonth()]); };
//     check(); const iv = setInterval(check, 3600 * 1000); return () => clearInterval(iv);
//   }, []);

//   const fetchCelebrations = useCallback(async () => {
//     const { data, error } = await supabase.from('celebrations').select('*').order('event_date', { ascending: true });
//     if (!error && data) {
//       const month = currentMonthRef.current;
//       setCelebrations((data as RawCelebration[]).filter(c => parseMonthFromDate(c.event_date) === month).map(enrichCeleb));
//     }
//   }, []);

//   const fetchMembers = useCallback(async () => {
//     const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: true });
//     if (!error && data) setMembers(data);
//   }, []);

//   useEffect(() => {
//     const init = async () => { setLoading(true); await Promise.all([fetchMembers(), fetchCelebrations()]); setLoading(false); };
//     init();
//   }, [fetchMembers, fetchCelebrations]);

//   useEffect(() => { fetchCelebrations(); }, [currentMonth, fetchCelebrations]);

//   useEffect(() => {
//     if (!userId) return;
//     const ms = supabase.channel(`members-rt:${userId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'members', filter: `user_id=eq.${userId}` }, fetchMembers).subscribe();
//     const cs = supabase.channel(`celebrations-rt:${userId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'celebrations', filter: `user_id=eq.${userId}` }, fetchCelebrations).subscribe();
//     return () => { supabase.removeChannel(ms); supabase.removeChannel(cs); };
//   }, [userId, fetchMembers, fetchCelebrations]);

//   const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.phone.includes(searchQuery));
//   const displayedMembers = showAllMembers ? filteredMembers : filteredMembers.slice(0, 7);

//   const handleDeleteMember = async () => {
//     if (deleteMemberId !== null) { await supabase.from('members').delete().eq('id', deleteMemberId); setDeleteMemberId(null); fetchMembers(); }
//   };

//   const handleAddMember = async () => {
//     if (!newMember.name?.trim() || !newMember.phone?.trim() || !userId) return;
//     const { error } = await supabase.from('members').insert([{ user_id: userId, name: newMember.name.trim(), phone: newMember.phone.trim(), gender: newMember.gender || null, joined_at: newMember.join_date || null, dob: newMember.birthday_date || null, notes: newMember.bio || null }]);
//     if (!error) { setNewMember({}); setAddMemberOpen(false); fetchMembers(); }
//   };

//   const handleSaveMemberEdit = async () => {
//     if (!editMember || !editedMember.name?.trim() || !editedMember.phone?.trim()) return;
//     const { error } = await supabase.from('members').update({ name: editedMember.name.trim(), phone: editedMember.phone.trim(), gender: editedMember.gender || null, joined_at: editedMember.join_date || null, dob: editedMember.birthday_date || null, notes: editedMember.bio || null }).eq('id', editMember.id);
//     if (!error) { setEditMember(null); setEditedMember({}); fetchMembers(); }
//   };

//   const openEditMember = (m: Member) => { setEditMember(m); setEditedMember({ ...m }); };

//   const buildEventDate = (month: number, day: number) => `${new Date().getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

//   const handleAddCelebration = async () => {
//     if (!newCeleb.name?.trim() || !newCeleb.event?.trim() || !newCeleb.day || !userId) return;
//     const month = newCeleb.month || currentMonthRef.current;
//     const { error } = await supabase.from('celebrations').insert([{ user_id: userId, name: newCeleb.name.trim(), event: newCeleb.event.trim(), event_date: buildEventDate(month, newCeleb.day), notes: newCeleb.colorKey || DEFAULT_COLOR }]);
//     if (!error) { setNewCeleb({ colorKey: DEFAULT_COLOR }); setAddCelebOpen(false); await fetchCelebrations(); }
//   };

//   const handleSaveCelebEdit = async () => {
//     if (!editCeleb || !editedCeleb.name?.trim() || !editedCeleb.event?.trim() || !editedCeleb.day) return;
//     const month = editedCeleb.month || currentMonthRef.current;
//     const { error } = await supabase.from('celebrations').update({ name: editedCeleb.name.trim(), event: editedCeleb.event.trim(), event_date: buildEventDate(month, editedCeleb.day), notes: editedCeleb.colorKey || DEFAULT_COLOR }).eq('id', editCeleb.id);
//     if (!error) { setEditCeleb(null); setEditedCeleb({}); fetchCelebrations(); }
//   };

//   const handleDeleteCelebration = async () => {
//     if (deleteCelebId !== null) { await supabase.from('celebrations').delete().eq('id', deleteCelebId); setDeleteCelebId(null); fetchCelebrations(); }
//   };

//   const openEditCeleb = (c: Celebration) => { setEditCeleb(c); setEditedCeleb({ name: c.name, month: c.month, day: c.day, event: c.event, colorKey: c.colorKey || DEFAULT_COLOR }); };

//   const dlgStyle = { background: cardBg, borderColor: cardBd, color: textPrimary };

//   return (
//     <div style={{ background: pageBg, minHeight: '100vh', transition: 'background 0.3s' }}>
//       <style>{`
//         @keyframes ddFadeIn { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }
//         .action-icons-desktop { display: flex; } .action-dot-mobile { display: none; }
//         .hidden-mobile { display: table-cell; } .show-mobile-only { display: none; }
//         .celeb-subtext { display: none; }
//         .celeb-header { display: flex; flex-direction: row; align-items: center; justify-content: space-between; }
//         .celeb-header-title { margin: 0 !important; } .celeb-add-btn { width: auto; }
//         @media (max-width: 640px) {
//           .action-icons-desktop { display: none !important; }
//           .action-dot-mobile { display: flex !important; align-items: center; justify-content: flex-end; }
//           .hidden-mobile { display: none !important; } .show-mobile-only { display: block !important; }
//           .celeb-subtext { display: flex !important; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
//           .celeb-header { flex-direction: column !important; align-items: stretch !important; gap: 12px; }
//           .celeb-add-btn { width: 100% !important; }
//         }
//       `}</style>

//       <div style={{ padding: '24px 16px 96px', maxWidth: 900, margin: '0 auto' }}>

//         {/* Page Header */}
//         <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
//           <div>
//             <h1 style={{ fontSize: 20, fontWeight: 800, color: textPrimary, letterSpacing: '-0.3px', margin: 0 }}>LIST OF MEMBERS</h1>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
//               <div style={{ width: 34, height: 34, borderRadius: '50%', background: isDark ? 'rgba(236,72,153,0.15)' : '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <Users size={17} color="#ec4899" />
//               </div>
//               <span style={{ fontSize: 18, fontWeight: 600, color: textPrimary }}>{members.length} members</span>
//             </div>
//           </div>
//           <button onClick={() => setAddMemberOpen(true)}
//             style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, height: 44, padding: '0 22px', borderRadius: 10, background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#ffffff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', transition: 'opacity 0.15s', whiteSpace: 'nowrap', width: '100%' }}
//             onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
//             <Plus size={16} /> Add New Member
//           </button>
//         </div>

//         {/* Members Table */}
//         <div style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16, marginBottom: 24, transition: 'background 0.3s, border-color 0.3s' }}>
//           <div style={{ padding: '20px 20px 0' }}>
//             <div style={{ position: 'relative', marginBottom: 16 }}>
//               <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: textSub, pointerEvents: 'none' }} />
//               <input placeholder="Search by name or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
//                 style={{ width: '100%', height: 42, paddingLeft: 36, paddingRight: 14, borderRadius: 10, border: `1.5px solid ${inputBd}`, background: inputBg, color: textPrimary, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
//                 onFocus={e => (e.target.style.borderColor = '#06b6d4')} onBlur={e => (e.target.style.borderColor = inputBd)} />
//             </div>
//           </div>
//           {loading ? (
//             <div style={{ padding: '48px 0', textAlign: 'center', color: textSub, fontSize: 14 }}>Loading members…</div>
//           ) : (
//             <div style={{ borderRadius: '0 0 16px 16px' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 <thead>
//                   <tr style={{ background: headBg, borderTop: `1px solid ${dividerBd}` }}>
//                     <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Name</th>
//                     <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }} className="hidden-mobile">Phone</th>
//                     <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {displayedMembers.length === 0 ? (
//                     <tr><td colSpan={3} style={{ padding: '40px 20px', textAlign: 'center', color: textSub, fontSize: 14 }}>{searchQuery ? 'No members match your search.' : 'No members yet. Add one!'}</td></tr>
//                   ) : displayedMembers.map((member, idx) => (
//                     <tr key={member.id} style={{ borderTop: `1px solid ${dividerBd}`, transition: 'background 0.12s' }}
//                       onMouseEnter={e => (e.currentTarget.style.background = rowHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
//                       <td style={{ padding: '14px 20px' }}>
//                         <div style={{ fontWeight: 600, fontSize: 14, color: textPrimary }}>{idx + 1}. {member.name}</div>
//                         <div style={{ fontSize: 12, color: textSub, marginTop: 2 }} className="show-mobile-only">{member.phone}</div>
//                       </td>
//                       <td style={{ padding: '14px 20px', fontSize: 13, color: textMuted }} className="hidden-mobile">{member.phone}</td>
//                       <td style={{ padding: '14px 20px', textAlign: 'right' }}>
//                         <div className="action-icons-desktop" style={{ gap: 2, justifyContent: 'flex-end' }}>
//                           <button onClick={() => setDeleteMemberId(member.id)} title="Delete"
//                             style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
//                             onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
//                             onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSub; }}><Trash2 size={15} /></button>
//                           <button onClick={() => setViewMember(member)} title="View"
//                             style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
//                             onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#1e2028' : '#f3f4f6'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}><Eye size={15} /></button>
//                           <button onClick={() => openEditMember(member)} title="Edit"
//                             style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
//                             onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#1e2028' : '#f3f4f6'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}><Pencil size={15} /></button>
//                         </div>
//                         <div className="action-dot-mobile">
//                           <ActionMenu isDark={isDark} onView={() => setViewMember(member)} onEdit={() => openEditMember(member)} onDelete={() => setDeleteMemberId(member.id)} />
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//           {filteredMembers.length > 7 && (
//             <div style={{ padding: '14px', textAlign: 'center', borderTop: `1px solid ${dividerBd}` }}>
//               <button onClick={() => setShowAllMembers(!showAllMembers)}
//                 style={{ border: 'none', background: 'none', color: '#06b6d4', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
//                 {showAllMembers ? 'Show Fewer' : `View All (${filteredMembers.length}) →`}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Upcoming Celebrations */}
//         <div style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16, transition: 'background 0.3s, border-color 0.3s' }}>
//           <div style={{ background: headBg, padding: '18px 20px', borderBottom: `1px solid ${dividerBd}`, borderRadius: '16px 16px 0 0' }} className="celeb-header">
//             <h2 style={{ fontSize: 18, fontWeight: 700, color: textPrimary, margin: 0 }} className="celeb-header-title">Upcoming Celebrations</h2>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
//               <span style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${isDark ? '#2a2d3a' : '#d1d5db'}`, background: isDark ? '#1a1d27' : '#f3f4f6', fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
//                 MONTH: {currentMonthName.toUpperCase()}
//               </span>
//               <button onClick={() => setAddCelebOpen(true)} className="celeb-add-btn"
//                 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 44, padding: '0 22px', borderRadius: 10, background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#ffffff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', transition: 'opacity 0.15s', whiteSpace: 'nowrap' }}
//                 onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
//                 <Plus size={16} /> Add Celebration
//               </button>
//             </div>
//           </div>
//           <div style={{ borderRadius: '0 0 16px 16px' }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr style={{ background: headBg }}>
//                   {['Name', 'Date', 'Event', 'Actions'].map((h, i) => (
//                     <th key={h} className={i === 1 || i === 2 ? 'hidden-mobile' : ''}
//                       style={{ padding: '12px 20px', textAlign: i === 3 ? 'right' : 'left', fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', borderTop: `1px solid ${dividerBd}` }}>
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {celebrations.length === 0 ? (
//                   <tr><td colSpan={4} style={{ padding: '40px 20px', textAlign: 'center', color: textSub, fontSize: 14 }}>No celebrations for {currentMonthName}.</td></tr>
//                 ) : celebrations.map((item, idx) => (
//                   <tr key={item.id} style={{ borderTop: `1px solid ${dividerBd}`, transition: 'background 0.12s' }}
//                     onMouseEnter={e => (e.currentTarget.style.background = rowHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
//                     <td style={{ padding: '14px 20px' }}>
//                       <div style={{ fontWeight: 600, fontSize: 14, color: textPrimary }}>{idx + 1}. {item.name}</div>
//                       <div className="show-mobile-only celeb-subtext">
//                         <span style={{ fontSize: 12, color: textSub, whiteSpace: 'nowrap' }}>
//                           {item.day > 0 ? `${item.day} ${MONTH_NAMES[item.month - 1]?.slice(0, 3) ?? ''}` : '—'}
//                         </span>
//                         <EventPill event={item.event} colorKey={item.colorKey} small />
//                       </div>
//                     </td>
//                     {/* DATE column — parsed from event_date, no timezone shift */}
//                     <td className="hidden-mobile" style={{ padding: '14px 20px', fontSize: 13, color: textMuted, whiteSpace: 'nowrap' }}>
//                       {item.day > 0 ? `${item.day} ${MONTH_NAMES[item.month - 1] ?? ''}` : '—'}
//                     </td>
//                     <td className="hidden-mobile" style={{ padding: '14px 20px' }}>
//                       <EventPill event={item.event} colorKey={item.colorKey} />
//                     </td>
//                     <td style={{ padding: '14px 20px', textAlign: 'right' }}>
//                       <div className="action-icons-desktop" style={{ gap: 2, justifyContent: 'flex-end' }}>
//                         <button onClick={() => setDeleteCelebId(item.id)} title="Delete"
//                           style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
//                           onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
//                           onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSub; }}><Trash2 size={15} /></button>
//                         <button onClick={() => openEditCeleb(item)} title="Edit"
//                           style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
//                           onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#1e2028' : '#f3f4f6'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}><Pencil size={15} /></button>
//                       </div>
//                       <div className="action-dot-mobile">
//                         <CelebActionMenu isDark={isDark} onEdit={() => openEditCeleb(item)} onDelete={() => setDeleteCelebId(item.id)} />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* ══ DIALOGS ══ */}

//       <AlertDialog open={deleteMemberId !== null} onOpenChange={() => setDeleteMemberId(null)}>
//         <AlertDialogContent style={{ ...dlgStyle, maxWidth: 380, borderRadius: 18, border: `1px solid ${cardBd}` }}>
//           <AlertDialogHeader>
//             <AlertDialogTitle style={{ color: textPrimary }}>Confirm Deletion</AlertDialogTitle>
//             <AlertDialogDescription style={{ color: textMuted }}>Remove <strong style={{ color: textPrimary }}>{members.find(m => m.id === deleteMemberId)?.name}</strong> permanently?</AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel style={{ background: 'transparent', border: `1px solid ${cardBd}`, color: textMuted }}>Cancel</AlertDialogCancel>
//             <AlertDialogAction style={{ background: '#ef4444', color: '#fff', border: 'none' }} onClick={handleDeleteMember}>Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <Dialog open={!!viewMember} onOpenChange={() => setViewMember(null)}>
//         <DialogContent style={{ ...dlgStyle, maxWidth: 480, borderRadius: 18, border: `1px solid ${cardBd}`, padding: '28px 28px 24px' }}>
//           <DialogHeader style={{ paddingBottom: 16 }}>
//             <DialogTitle style={{ fontSize: 20, fontWeight: 700, color: textPrimary }}>{viewMember?.name}</DialogTitle>
//             <DialogClose asChild><button style={{ position: 'absolute', right: 20, top: 20, width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub }}><X size={18} /></button></DialogClose>
//           </DialogHeader>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//             {[{ label: 'Phone', value: viewMember?.phone }, { label: 'Gender', value: viewMember?.gender || '—' }, { label: 'Joined', value: viewMember?.join_date || '—' }, { label: 'Birthday', value: viewMember?.birthday_date || '—' }, { label: 'Bio', value: viewMember?.bio || 'No bio provided.' }].map(row => (
//               <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12 }}>
//                 <div style={{ fontSize: 12, fontWeight: 600, color: textSub, paddingTop: 1 }}>{row.label}</div>
//                 <div style={{ fontSize: 14, color: textPrimary }}>{row.value}</div>
//               </div>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
//         <DialogContent style={{ ...dlgStyle, maxWidth: 440, borderRadius: 18, border: `1px solid ${cardBd}`, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
//           <DialogHeader style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${dividerBd}` }}><DialogTitle style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>Add New Member</DialogTitle></DialogHeader>
//           <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
//             {renderField('Full Name *', <input value={newMember.name || ''} onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Bro. John Ezra" style={inputStyle(inputBg, inputBd, textPrimary)} />)}
//             {renderField('Phone Number *', <input value={newMember.phone || ''} onChange={e => setNewMember(p => ({ ...p, phone: e.target.value }))} placeholder="e.g. 08137999368" style={inputStyle(inputBg, inputBd, textPrimary)} />)}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//               {renderField('Gender', <Select onValueChange={v => setNewMember(p => ({ ...p, gender: v as any }))}><SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select>)}
//               {renderField('Join Date', <input type="date" onChange={e => setNewMember(p => ({ ...p, join_date: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
//             </div>
//             {renderField('Birthday Date', <input type="date" onChange={e => setNewMember(p => ({ ...p, birthday_date: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
//             {renderField('Bio / Notes', <textarea value={newMember.bio || ''} onChange={e => setNewMember(p => ({ ...p, bio: e.target.value }))} rows={3} placeholder="Optional notes..." style={{ ...inputStyle(inputBg, inputBd, textPrimary), height: 'auto', paddingTop: 10, resize: 'vertical' }} />)}
//           </div>
//           <div style={{ padding: '16px 24px', borderTop: `1px solid ${dividerBd}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//             <button onClick={() => setAddMemberOpen(false)} style={outlineBtnStyle(cardBd, textMuted)}>Cancel</button>
//             <button disabled={!newMember.name?.trim() || !newMember.phone?.trim() || !userId} onClick={handleAddMember} style={primaryBtnStyle(!newMember.name?.trim() || !newMember.phone?.trim() || !userId)}>Add Member</button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={!!editMember} onOpenChange={() => setEditMember(null)}>
//         <DialogContent style={{ ...dlgStyle, maxWidth: 440, borderRadius: 18, border: `1px solid ${cardBd}`, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
//           <DialogHeader style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${dividerBd}` }}><DialogTitle style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>Edit Member</DialogTitle></DialogHeader>
//           <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
//             {renderField('Full Name *', <input value={editedMember.name || ''} onChange={e => setEditedMember(p => ({ ...p, name: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
//             {renderField('Phone Number *', <input value={editedMember.phone || ''} onChange={e => setEditedMember(p => ({ ...p, phone: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//               {renderField('Gender', <Select value={editedMember.gender} onValueChange={v => setEditedMember(p => ({ ...p, gender: v as any }))}><SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue /></SelectTrigger><SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select>)}
//               {renderField('Join Date', <input type="date" value={editedMember.join_date || ''} onChange={e => setEditedMember(p => ({ ...p, join_date: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
//             </div>
//             {renderField('Birthday Date', <input type="date" value={editedMember.birthday_date || ''} onChange={e => setEditedMember(p => ({ ...p, birthday_date: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
//             {renderField('Bio / Notes', <textarea value={editedMember.bio || ''} onChange={e => setEditedMember(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ ...inputStyle(inputBg, inputBd, textPrimary), height: 'auto', paddingTop: 10, resize: 'vertical' }} />)}
//           </div>
//           <div style={{ padding: '16px 24px', borderTop: `1px solid ${dividerBd}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//             <button onClick={() => setEditMember(null)} style={outlineBtnStyle(cardBd, textMuted)}>Cancel</button>
//             <button disabled={!editedMember.name?.trim() || !editedMember.phone?.trim()} onClick={handleSaveMemberEdit} style={primaryBtnStyle(!editedMember.name?.trim() || !editedMember.phone?.trim())}>Save Changes</button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ── Add Celebration ── */}
//       <Dialog open={addCelebOpen} onOpenChange={v => { setAddCelebOpen(v); if (!v) setNewCeleb({ colorKey: DEFAULT_COLOR }); }}>
//         <DialogContent style={{ ...dlgStyle, maxWidth: 440, borderRadius: 18, border: `1px solid ${cardBd}`, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
//           <DialogHeader style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${dividerBd}` }}><DialogTitle style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>Add Celebration</DialogTitle></DialogHeader>
//           <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
//             {renderField('Member Name *', (
//               <Select onValueChange={v => setNewCeleb(p => ({ ...p, name: v }))}>
//                 <SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue placeholder="Select a member" /></SelectTrigger>
//                 <SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}>{members.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
//               </Select>
//             ))}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//               {renderField('Month *', (
//                 <Select value={String(newCeleb.month || currentMonth)} onValueChange={v => setNewCeleb(p => ({ ...p, month: Number(v) }))}>
//                   <SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue /></SelectTrigger>
//                   <SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}>{MONTH_NAMES.map((mn, i) => <SelectItem key={i + 1} value={String(i + 1)}>{mn}</SelectItem>)}</SelectContent>
//                 </Select>
//               ))}
//               {renderField('Day *', (
//                 <input type="number" min={1} max={31} value={newCeleb.day ?? ''} placeholder="e.g. 14"
//                   onChange={e => setNewCeleb(p => ({ ...p, day: e.target.value ? Number(e.target.value) : undefined }))}
//                   style={inputStyle(inputBg, inputBd, textPrimary)} />
//               ))}
//             </div>
//             {renderField('Event *', (
//               <input value={newCeleb.event || ''} onChange={e => setNewCeleb(p => ({ ...p, event: e.target.value }))}
//                 placeholder="e.g. Birthday, Wedding Anniversary" style={inputStyle(inputBg, inputBd, textPrimary)} />
//             ))}
//             {renderField('Pill Colour', (
//               <ColorPillPicker value={newCeleb.colorKey || DEFAULT_COLOR} onChange={key => setNewCeleb(p => ({ ...p, colorKey: key }))}
//                 eventLabel={newCeleb.event} textPrimary={textPrimary} textSub={textSub} />
//             ))}
//           </div>
//           <div style={{ padding: '16px 24px', borderTop: `1px solid ${dividerBd}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//             <button onClick={() => { setAddCelebOpen(false); setNewCeleb({ colorKey: DEFAULT_COLOR }); }} style={outlineBtnStyle(cardBd, textMuted)}>Cancel</button>
//             <button disabled={!newCeleb.name?.trim() || !newCeleb.day || !newCeleb.event?.trim() || !userId} onClick={handleAddCelebration} style={primaryBtnStyle(!newCeleb.name?.trim() || !newCeleb.day || !newCeleb.event?.trim() || !userId)}>Add Celebration</button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ── Edit Celebration ── */}
//       <Dialog open={!!editCeleb} onOpenChange={v => { if (!v) setEditCeleb(null); }}>
//         <DialogContent style={{ ...dlgStyle, maxWidth: 440, borderRadius: 18, border: `1px solid ${cardBd}`, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
//           <DialogHeader style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${dividerBd}` }}><DialogTitle style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>Edit Celebration</DialogTitle></DialogHeader>
//           <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
//             {renderField('Member Name *', (
//               <Select value={editedCeleb.name} onValueChange={v => setEditedCeleb(p => ({ ...p, name: v }))}>
//                 <SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue /></SelectTrigger>
//                 <SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}>{members.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
//               </Select>
//             ))}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//               {renderField('Month *', (
//                 <Select value={String(editedCeleb.month || '')} onValueChange={v => setEditedCeleb(p => ({ ...p, month: Number(v) }))}>
//                   <SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue /></SelectTrigger>
//                   <SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}>{MONTH_NAMES.map((mn, i) => <SelectItem key={i + 1} value={String(i + 1)}>{mn}</SelectItem>)}</SelectContent>
//                 </Select>
//               ))}
//               {renderField('Day *', (
//                 <input type="number" min={1} max={31} value={editedCeleb.day ?? ''}
//                   onChange={e => setEditedCeleb(p => ({ ...p, day: e.target.value ? Number(e.target.value) : undefined }))}
//                   style={inputStyle(inputBg, inputBd, textPrimary)} />
//               ))}
//             </div>
//             {renderField('Event *', (
//               <input value={editedCeleb.event || ''} onChange={e => setEditedCeleb(p => ({ ...p, event: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />
//             ))}
//             {renderField('Pill Colour', (
//               <ColorPillPicker value={editedCeleb.colorKey || DEFAULT_COLOR} onChange={key => setEditedCeleb(p => ({ ...p, colorKey: key }))}
//                 eventLabel={editedCeleb.event} textPrimary={textPrimary} textSub={textSub} />
//             ))}
//           </div>
//           <div style={{ padding: '16px 24px', borderTop: `1px solid ${dividerBd}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//             <button onClick={() => setEditCeleb(null)} style={outlineBtnStyle(cardBd, textMuted)}>Cancel</button>
//             <button disabled={!editedCeleb.name?.trim() || !editedCeleb.event?.trim() || !editedCeleb.day} onClick={handleSaveCelebEdit} style={primaryBtnStyle(!editedCeleb.name?.trim() || !editedCeleb.event?.trim() || !editedCeleb.day)}>Save Changes</button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <AlertDialog open={deleteCelebId !== null} onOpenChange={() => setDeleteCelebId(null)}>
//         <AlertDialogContent style={{ ...dlgStyle, maxWidth: 380, borderRadius: 18, border: `1px solid ${cardBd}` }}>
//           <AlertDialogHeader>
//             <AlertDialogTitle style={{ color: textPrimary }}>Confirm Deletion</AlertDialogTitle>
//             <AlertDialogDescription style={{ color: textMuted }}>Are you sure you want to delete this celebration?</AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel style={{ background: 'transparent', border: `1px solid ${cardBd}`, color: textMuted }}>Cancel</AlertDialogCancel>
//             <AlertDialogAction style={{ background: '#ef4444', color: '#fff', border: 'none' }} onClick={handleDeleteCelebration}>Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

// function renderField(label: string, input: React.ReactNode) {
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//       <label style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.04em' }}>{label}</label>
//       {input}
//     </div>
//   );
// }
// function inputStyle(bg: string, bd: string, color: string): React.CSSProperties {
//   return { width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: `1.5px solid ${bd}`, background: bg, color, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
// }
// function selectStyle(bg: string, bd: string, color: string): React.CSSProperties {
//   return { background: bg, border: `1.5px solid ${bd}`, color, borderRadius: 8, height: 40, fontSize: 13 };
// }
// function primaryBtnStyle(disabled: boolean): React.CSSProperties {
//   return { height: 40, padding: '0 20px', borderRadius: 8, border: 'none', background: disabled ? '#374151' : '#059669', color: disabled ? '#6b7280' : '#ffffff', fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: disabled ? 0.6 : 1 };
// }
// function outlineBtnStyle(bd: string, color: string): React.CSSProperties {
//   return { height: 40, padding: '0 16px', borderRadius: 8, border: `1.5px solid ${bd}`, background: 'transparent', color, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' };
// }


























'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Trash2, Eye, Pencil, Plus, Users, X, Search, MoreVertical, Check,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from '@/app/components/ThemeProvider';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,
} from '@/components/ui/dialog';
import ReactDOM from 'react-dom';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const supabase = createClient();

type Member = {
  id: number; name: string; phone: string;
  birthday_date?: string; bio?: string;
  gender?: 'Male' | 'Female'; join_date?: string; created_at?: string;
};

type RawCelebration = {
  id: number; name: string; event: string;
  event_date?: string; notes?: string; created_at?: string;
};

type Celebration = {
  id: number; name: string; event: string;
  day: number; month: number; colorKey: string;
  event_date?: string; created_at?: string;
};

type CelebForm = {
  name?: string; month?: number; day?: number; event?: string; colorKey?: string;
};

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const COLOR_OPTIONS = [
  { key: 'violet',  swatch: '#7c3aed', bg: '#faf5ff', text: '#7c3aed', border: '#c084fc' },
  { key: 'fuchsia', swatch: '#a855f7', bg: '#fdf4ff', text: '#a855f7', border: '#e879f9' },
  { key: 'pink',    swatch: '#db2777', bg: '#fdf2f8', text: '#db2777', border: '#f9a8d4' },
  { key: 'red',     swatch: '#dc2626', bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' },
  { key: 'orange',  swatch: '#ea580c', bg: '#fff7ed', text: '#ea580c', border: '#fdba74' },
  { key: 'yellow',  swatch: '#ca8a04', bg: '#fefce8', text: '#ca8a04', border: '#fde047' },
  { key: 'green',   swatch: '#16a34a', bg: '#f0fdf4', text: '#16a34a', border: '#86efac' },
  { key: 'teal',    swatch: '#0d9488', bg: '#f0fdfa', text: '#0d9488', border: '#5eead4' },
  { key: 'cyan',    swatch: '#0891b2', bg: '#ecfeff', text: '#0891b2', border: '#67e8f9' },
  { key: 'blue',    swatch: '#2563eb', bg: '#eff6ff', text: '#2563eb', border: '#93c5fd' },
  { key: 'indigo',  swatch: '#4338ca', bg: '#eef2ff', text: '#4338ca', border: '#a5b4fc' },
  { key: 'rose',    swatch: '#e11d48', bg: '#fff1f2', text: '#e11d48', border: '#fda4af' },
] as const;

type ColorKey = typeof COLOR_OPTIONS[number]['key'];
const DEFAULT_COLOR: ColorKey = 'violet';

function getColorOption(key?: string) {
  return COLOR_OPTIONS.find(c => c.key === key) ?? COLOR_OPTIONS[0];
}

function parseDayFromDate(event_date?: string): number {
  if (!event_date) return 0;
  const parts = event_date.split('-');
  return parts.length === 3 ? parseInt(parts[2], 10) : 0;
}

function parseMonthFromDate(event_date?: string): number {
  if (!event_date) return 0;
  const parts = event_date.split('-');
  return parts.length === 3 ? parseInt(parts[1], 10) : 0;
}

function enrichCeleb(raw: RawCelebration): Celebration {
  return {
    id: raw.id,
    name: raw.name,
    event: raw.event,
    day: parseDayFromDate(raw.event_date),
    month: parseMonthFromDate(raw.event_date),
    colorKey: raw.notes || DEFAULT_COLOR,
    event_date: raw.event_date,
    created_at: raw.created_at,
  };
}

function ColorPillPicker({ value, onChange, eventLabel, textPrimary, textSub }: {
  value: string; onChange: (key: string) => void;
  eventLabel?: string; textPrimary: string; textSub: string;
}) {
  const selected = getColorOption(value);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {COLOR_OPTIONS.map(opt => (
          <button key={opt.key} type="button" title={opt.key.charAt(0).toUpperCase() + opt.key.slice(1)}
            onClick={() => onChange(opt.key)}
            style={{
              width: 28, height: 28, borderRadius: '50%', background: opt.swatch, padding: 0,
              border: value === opt.key ? `3px solid ${textPrimary}` : '3px solid transparent',
              outline: value === opt.key ? `2px solid ${opt.swatch}` : 'none', outlineOffset: 1,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.12s, border 0.12s', flexShrink: 0,
              transform: value === opt.key ? 'scale(1.2)' : 'scale(1)',
            }}>
            {value === opt.key && <Check size={13} color="#fff" strokeWidth={3} />}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, color: textSub, fontWeight: 500, whiteSpace: 'nowrap' }}>Preview:</span>
        <span style={{
          padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
          border: `1.5px solid ${selected.border}`, background: selected.bg, color: selected.text, whiteSpace: 'nowrap',
        }}>
          {eventLabel?.trim() || 'Event Name'}
        </span>
      </div>
    </div>
  );
}

function EventPill({ event, colorKey, small = false }: { event: string; colorKey?: string; small?: boolean }) {
  const { bg, text, border } = getColorOption(colorKey);
  return (
    <span style={{
      padding: small ? '2px 10px' : '4px 14px', borderRadius: 999,
      fontSize: small ? 11 : 12, fontWeight: 700,
      border: `1.5px solid ${border}`, display: 'inline-block',
      background: bg, color: text, letterSpacing: '0.01em', whiteSpace: 'nowrap',
    }}>{event}</span>
  );
}

function PortalMenu({ anchor, children, onClose }: {
  anchor: React.RefObject<HTMLElement>; children: React.ReactNode; onClose: () => void;
}) {
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (anchor.current) {
      const rect = anchor.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    const h = (e: MouseEvent) => { if (anchor.current && !anchor.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [anchor, onClose]);
  if (!mounted) return null;
  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }} onMouseDown={e => e.stopPropagation()}>{children}</div>,
    document.body
  );
}

function ActionMenu({ onView, onEdit, onDelete, isDark }: {
  onView: () => void; onEdit: () => void; onDelete: () => void; isDark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const menuBg = isDark ? '#1e2028' : '#ffffff'; const menuBd = isDark ? '#2a2d3a' : '#e5e7eb';
  const menuColor = isDark ? '#f3f4f6' : '#111827'; const hoverBg = isDark ? '#2a2d3a' : '#f3f4f6';
  return (
    <>
      <button ref={btnRef} onClick={() => setOpen(o => !o)}
        style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: open ? (isDark ? '#2a2d3a' : '#f3f4f6') : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#9ca3af' : '#6b7280', transition: 'background 0.15s' }}>
        <MoreVertical size={17} />
      </button>
      {open && (
        <PortalMenu anchor={btnRef as React.RefObject<HTMLElement>} onClose={close}>
          <div style={{ background: menuBg, border: `1px solid ${menuBd}`, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.22)', minWidth: 155, overflow: 'hidden', animation: 'ddFadeIn 0.12s ease' }}>
            {[
              { label: 'View details', icon: <Eye size={14} />, action: onView, color: menuColor },
              { label: 'Edit member', icon: <Pencil size={14} />, action: onEdit, color: menuColor },
              { label: 'Delete', icon: <Trash2 size={14} />, action: onDelete, color: '#ef4444' },
            ].map(({ label, icon, action, color }) => (
              <button key={label} onClick={() => { action(); setOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', color, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'background 0.12s', textAlign: 'left', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {icon}{label}
              </button>
            ))}
          </div>
        </PortalMenu>
      )}
    </>
  );
}

function CelebActionMenu({ onEdit, onDelete, isDark }: { onEdit: () => void; onDelete: () => void; isDark: boolean }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const menuBg = isDark ? '#1e2028' : '#ffffff'; const menuBd = isDark ? '#2a2d3a' : '#e5e7eb';
  const menuColor = isDark ? '#f3f4f6' : '#111827'; const hoverBg = isDark ? '#2a2d3a' : '#f3f4f6';
  return (
    <>
      <button ref={btnRef} onClick={() => setOpen(o => !o)}
        style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: open ? (isDark ? '#2a2d3a' : '#f3f4f6') : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#9ca3af' : '#6b7280', transition: 'background 0.15s' }}>
        <MoreVertical size={17} />
      </button>
      {open && (
        <PortalMenu anchor={btnRef as React.RefObject<HTMLElement>} onClose={close}>
          <div style={{ background: menuBg, border: `1px solid ${menuBd}`, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.22)', minWidth: 130, overflow: 'hidden', animation: 'ddFadeIn 0.12s ease' }}>
            {[
              { label: 'Edit', icon: <Pencil size={14} />, action: onEdit, color: menuColor },
              { label: 'Delete', icon: <Trash2 size={14} />, action: onDelete, color: '#ef4444' },
            ].map(({ label, icon, action, color }) => (
              <button key={label} onClick={() => { action(); setOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', color, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'background 0.12s', textAlign: 'left', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {icon}{label}
              </button>
            ))}
          </div>
        </PortalMenu>
      )}
    </>
  );
}

export default function MembersPage() {
  const { isDark } = useTheme();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null)); }, []);

  const [members, setMembers] = useState<Member[]>([]);
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllMembers, setShowAllMembers] = useState(false);

  const currentMonthRef = useRef(new Date().getMonth() + 1);
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);
  const [currentMonthName, setCurrentMonthName] = useState(() => MONTH_NAMES[new Date().getMonth()]);

  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null);
  const [newMember, setNewMember] = useState<Partial<Member>>({});
  const [editedMember, setEditedMember] = useState<Partial<Member>>({});

  const [addCelebOpen, setAddCelebOpen] = useState(false);
  const [editCeleb, setEditCeleb] = useState<Celebration | null>(null);
  const [deleteCelebId, setDeleteCelebId] = useState<number | null>(null);
  const [newCeleb, setNewCeleb] = useState<CelebForm>({ colorKey: DEFAULT_COLOR });
  const [editedCeleb, setEditedCeleb] = useState<CelebForm>({});

  const pageBg = isDark ? '#0f1117' : '#f8f9fb'; const cardBg = isDark ? '#16181f' : '#ffffff';
  const cardBd = isDark ? '#1e2028' : '#e5e7eb'; const headBg = isDark ? '#111318' : '#f9fafb';
  const textPrimary = isDark ? '#f3f4f6' : '#111827'; const textMuted = isDark ? '#6b7280' : '#6b7280';
  const textSub = isDark ? '#9ca3af' : '#9ca3af'; const inputBg = isDark ? '#1a1d27' : '#ffffff';
  const inputBd = isDark ? '#2a2d3a' : '#e5e7eb'; const rowHover = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const dividerBd = isDark ? '#1e2028' : '#f0f0f0';

  useEffect(() => {
    const check = () => { const now = new Date(); const m = now.getMonth() + 1; currentMonthRef.current = m; setCurrentMonth(m); setCurrentMonthName(MONTH_NAMES[now.getMonth()]); };
    check(); const iv = setInterval(check, 3600 * 1000); return () => clearInterval(iv);
  }, []);

  const fetchCelebrations = useCallback(async () => {
    const { data, error } = await (supabase.from('celebrations') as any).select('*').order('event_date', { ascending: true });
    if (!error && data) {
      const month = currentMonthRef.current;
      setCelebrations((data as RawCelebration[]).filter(c => parseMonthFromDate(c.event_date) === month).map(enrichCeleb));
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    const { data, error } = await (supabase.from('members') as any).select('*').order('created_at', { ascending: true });
    if (!error && data) setMembers(data);
  }, []);

  useEffect(() => {
    const init = async () => { setLoading(true); await Promise.all([fetchMembers(), fetchCelebrations()]); setLoading(false); };
    init();
  }, [fetchMembers, fetchCelebrations]);

  useEffect(() => { fetchCelebrations(); }, [currentMonth, fetchCelebrations]);

  useEffect(() => {
    if (!userId) return;
    const ms = supabase.channel(`members-rt:${userId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'members', filter: `user_id=eq.${userId}` }, fetchMembers).subscribe();
    const cs = supabase.channel(`celebrations-rt:${userId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'celebrations', filter: `user_id=eq.${userId}` }, fetchCelebrations).subscribe();
    return () => { supabase.removeChannel(ms); supabase.removeChannel(cs); };
  }, [userId, fetchMembers, fetchCelebrations]);

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.phone.includes(searchQuery));
  const displayedMembers = showAllMembers ? filteredMembers : filteredMembers.slice(0, 7);

  const handleDeleteMember = async () => {
    if (deleteMemberId !== null) { await (supabase.from('members') as any).delete().eq('id', deleteMemberId); setDeleteMemberId(null); fetchMembers(); }
  };

  const handleAddMember = async () => {
    if (!newMember.name?.trim() || !newMember.phone?.trim() || !userId) return;
    const { error } = await (supabase.from('members') as any).insert([{ user_id: userId, name: newMember.name.trim(), phone: newMember.phone.trim(), gender: newMember.gender || null, joined_at: newMember.join_date || null, dob: newMember.birthday_date || null, notes: newMember.bio || null }]);
    if (!error) { setNewMember({}); setAddMemberOpen(false); fetchMembers(); }
  };

  const handleSaveMemberEdit = async () => {
    if (!editMember || !editedMember.name?.trim() || !editedMember.phone?.trim()) return;
    const { error } = await (supabase.from('members') as any).update({ name: editedMember.name.trim(), phone: editedMember.phone.trim(), gender: editedMember.gender || null, joined_at: editedMember.join_date || null, dob: editedMember.birthday_date || null, notes: editedMember.bio || null }).eq('id', editMember.id);
    if (!error) { setEditMember(null); setEditedMember({}); fetchMembers(); }
  };

  const openEditMember = (m: Member) => { setEditMember(m); setEditedMember({ ...m }); };

  const buildEventDate = (month: number, day: number) => `${new Date().getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const handleAddCelebration = async () => {
    if (!newCeleb.name?.trim() || !newCeleb.event?.trim() || !newCeleb.day || !userId) return;
    const month = newCeleb.month || currentMonthRef.current;
    const { error } = await (supabase.from('celebrations') as any).insert([{ user_id: userId, name: newCeleb.name.trim(), event: newCeleb.event.trim(), event_date: buildEventDate(month, newCeleb.day), notes: newCeleb.colorKey || DEFAULT_COLOR }]);
    if (!error) { setNewCeleb({ colorKey: DEFAULT_COLOR }); setAddCelebOpen(false); await fetchCelebrations(); }
  };

  const handleSaveCelebEdit = async () => {
    if (!editCeleb || !editedCeleb.name?.trim() || !editedCeleb.event?.trim() || !editedCeleb.day) return;
    const month = editedCeleb.month || currentMonthRef.current;
    const { error } = await (supabase.from('celebrations') as any).update({ name: editedCeleb.name.trim(), event: editedCeleb.event.trim(), event_date: buildEventDate(month, editedCeleb.day), notes: editedCeleb.colorKey || DEFAULT_COLOR }).eq('id', editCeleb.id);
    if (!error) { setEditCeleb(null); setEditedCeleb({}); fetchCelebrations(); }
  };

  const handleDeleteCelebration = async () => {
    if (deleteCelebId !== null) { await (supabase.from('celebrations') as any).delete().eq('id', deleteCelebId); setDeleteCelebId(null); fetchCelebrations(); }
  };

  const openEditCeleb = (c: Celebration) => { setEditCeleb(c); setEditedCeleb({ name: c.name, month: c.month, day: c.day, event: c.event, colorKey: c.colorKey || DEFAULT_COLOR }); };

  const dlgStyle = { background: cardBg, borderColor: cardBd, color: textPrimary };

  return (
    <div style={{ background: pageBg, minHeight: '100vh', transition: 'background 0.3s' }}>
      <style>{`
        @keyframes ddFadeIn { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }
        .action-icons-desktop { display: flex; } .action-dot-mobile { display: none; }
        .hidden-mobile { display: table-cell; } .show-mobile-only { display: none; }
        .celeb-subtext { display: none; }
        .celeb-header { display: flex; flex-direction: row; align-items: center; justify-content: space-between; }
        .celeb-header-title { margin: 0 !important; } .celeb-add-btn { width: auto; }
        @media (max-width: 640px) {
          .action-icons-desktop { display: none !important; }
          .action-dot-mobile { display: flex !important; align-items: center; justify-content: flex-end; }
          .hidden-mobile { display: none !important; } .show-mobile-only { display: block !important; }
          .celeb-subtext { display: flex !important; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
          .celeb-header { flex-direction: column !important; align-items: stretch !important; gap: 12px; }
          .celeb-add-btn { width: 100% !important; }
        }
      `}</style>

      <div style={{ padding: '24px 16px 96px', maxWidth: 900, margin: '0 auto' }}>

        {/* Page Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: textPrimary, letterSpacing: '-0.3px', margin: 0 }}>LIST OF MEMBERS</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: isDark ? 'rgba(236,72,153,0.15)' : '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={17} color="#ec4899" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: textPrimary }}>{members.length} members</span>
            </div>
          </div>
          <button onClick={() => setAddMemberOpen(true)}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, height: 44, padding: '0 22px', borderRadius: 10, background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#ffffff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', transition: 'opacity 0.15s', whiteSpace: 'nowrap', width: '100%' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            <Plus size={16} /> Add New Member
          </button>
        </div>

        {/* Members Table */}
        <div style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16, marginBottom: 24, transition: 'background 0.3s, border-color 0.3s' }}>
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: textSub, pointerEvents: 'none' }} />
              <input placeholder="Search by name or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', height: 42, paddingLeft: 36, paddingRight: 14, borderRadius: 10, border: `1.5px solid ${inputBd}`, background: inputBg, color: textPrimary, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = '#06b6d4')} onBlur={e => (e.target.style.borderColor = inputBd)} />
            </div>
          </div>
          {loading ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: textSub, fontSize: 14 }}>Loading members…</div>
          ) : (
            <div style={{ borderRadius: '0 0 16px 16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: headBg, borderTop: `1px solid ${dividerBd}` }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Name</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }} className="hidden-mobile">Phone</th>
                    <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedMembers.length === 0 ? (
                    <tr><td colSpan={3} style={{ padding: '40px 20px', textAlign: 'center', color: textSub, fontSize: 14 }}>{searchQuery ? 'No members match your search.' : 'No members yet. Add one!'}</td></tr>
                  ) : displayedMembers.map((member, idx) => (
                    <tr key={member.id} style={{ borderTop: `1px solid ${dividerBd}`, transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = rowHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: textPrimary }}>{idx + 1}. {member.name}</div>
                        <div style={{ fontSize: 12, color: textSub, marginTop: 2 }} className="show-mobile-only">{member.phone}</div>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: textMuted }} className="hidden-mobile">{member.phone}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div className="action-icons-desktop" style={{ gap: 2, justifyContent: 'flex-end' }}>
                          <button onClick={() => setDeleteMemberId(member.id)} title="Delete"
                            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSub; }}><Trash2 size={15} /></button>
                          <button onClick={() => setViewMember(member)} title="View"
                            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#1e2028' : '#f3f4f6'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}><Eye size={15} /></button>
                          <button onClick={() => openEditMember(member)} title="Edit"
                            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#1e2028' : '#f3f4f6'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}><Pencil size={15} /></button>
                        </div>
                        <div className="action-dot-mobile">
                          <ActionMenu isDark={isDark} onView={() => setViewMember(member)} onEdit={() => openEditMember(member)} onDelete={() => setDeleteMemberId(member.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {filteredMembers.length > 7 && (
            <div style={{ padding: '14px', textAlign: 'center', borderTop: `1px solid ${dividerBd}` }}>
              <button onClick={() => setShowAllMembers(!showAllMembers)}
                style={{ border: 'none', background: 'none', color: '#06b6d4', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {showAllMembers ? 'Show Fewer' : `View All (${filteredMembers.length}) →`}
              </button>
            </div>
          )}
        </div>

        {/* Upcoming Celebrations */}
        <div style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16, transition: 'background 0.3s, border-color 0.3s' }}>
          <div style={{ background: headBg, padding: '18px 20px', borderBottom: `1px solid ${dividerBd}`, borderRadius: '16px 16px 0 0' }} className="celeb-header">
            <h2 style={{ fontSize: 18, fontWeight: 700, color: textPrimary, margin: 0 }} className="celeb-header-title">Upcoming Celebrations</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${isDark ? '#2a2d3a' : '#d1d5db'}`, background: isDark ? '#1a1d27' : '#f3f4f6', fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                MONTH: {currentMonthName.toUpperCase()}
              </span>
              <button onClick={() => setAddCelebOpen(true)} className="celeb-add-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 44, padding: '0 22px', borderRadius: 10, background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#ffffff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', transition: 'opacity 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <Plus size={16} /> Add Celebration
              </button>
            </div>
          </div>
          <div style={{ borderRadius: '0 0 16px 16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: headBg }}>
                  {['Name', 'Date', 'Event', 'Actions'].map((h, i) => (
                    <th key={h} className={i === 1 || i === 2 ? 'hidden-mobile' : ''}
                      style={{ padding: '12px 20px', textAlign: i === 3 ? 'right' : 'left', fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', borderTop: `1px solid ${dividerBd}` }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {celebrations.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '40px 20px', textAlign: 'center', color: textSub, fontSize: 14 }}>No celebrations for {currentMonthName}.</td></tr>
                ) : celebrations.map((item, idx) => (
                  <tr key={item.id} style={{ borderTop: `1px solid ${dividerBd}`, transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = rowHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: textPrimary }}>{idx + 1}. {item.name}</div>
                      <div className="show-mobile-only celeb-subtext">
                        <span style={{ fontSize: 12, color: textSub, whiteSpace: 'nowrap' }}>
                          {item.day > 0 ? `${item.day} ${MONTH_NAMES[item.month - 1]?.slice(0, 3) ?? ''}` : '—'}
                        </span>
                        <EventPill event={item.event} colorKey={item.colorKey} small />
                      </div>
                    </td>
                    {/* DATE column — parsed from event_date, no timezone shift */}
                    <td className="hidden-mobile" style={{ padding: '14px 20px', fontSize: 13, color: textMuted, whiteSpace: 'nowrap' }}>
                      {item.day > 0 ? `${item.day} ${MONTH_NAMES[item.month - 1] ?? ''}` : '—'}
                    </td>
                    <td className="hidden-mobile" style={{ padding: '14px 20px' }}>
                      <EventPill event={item.event} colorKey={item.colorKey} />
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div className="action-icons-desktop" style={{ gap: 2, justifyContent: 'flex-end' }}>
                        <button onClick={() => setDeleteCelebId(item.id)} title="Delete"
                          style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSub; }}><Trash2 size={15} /></button>
                        <button onClick={() => openEditCeleb(item)} title="Edit"
                          style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#1e2028' : '#f3f4f6'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}><Pencil size={15} /></button>
                      </div>
                      <div className="action-dot-mobile">
                        <CelebActionMenu isDark={isDark} onEdit={() => openEditCeleb(item)} onDelete={() => setDeleteCelebId(item.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ DIALOGS ══ */}

      <AlertDialog open={deleteMemberId !== null} onOpenChange={() => setDeleteMemberId(null)}>
        <AlertDialogContent style={{ ...dlgStyle, maxWidth: 380, borderRadius: 18, border: `1px solid ${cardBd}` }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: textPrimary }}>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription style={{ color: textMuted }}>Remove <strong style={{ color: textPrimary }}>{members.find(m => m.id === deleteMemberId)?.name}</strong> permanently?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ background: 'transparent', border: `1px solid ${cardBd}`, color: textMuted }}>Cancel</AlertDialogCancel>
            <AlertDialogAction style={{ background: '#ef4444', color: '#fff', border: 'none' }} onClick={handleDeleteMember}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!viewMember} onOpenChange={() => setViewMember(null)}>
        <DialogContent style={{ ...dlgStyle, maxWidth: 480, borderRadius: 18, border: `1px solid ${cardBd}`, padding: '28px 28px 24px' }}>
          <DialogHeader style={{ paddingBottom: 16 }}>
            <DialogTitle style={{ fontSize: 20, fontWeight: 700, color: textPrimary }}>{viewMember?.name}</DialogTitle>
            <DialogClose asChild><button style={{ position: 'absolute', right: 20, top: 20, width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub }}><X size={18} /></button></DialogClose>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[{ label: 'Phone', value: viewMember?.phone }, { label: 'Gender', value: viewMember?.gender || '—' }, { label: 'Joined', value: viewMember?.join_date || '—' }, { label: 'Birthday', value: viewMember?.birthday_date || '—' }, { label: 'Bio', value: viewMember?.bio || 'No bio provided.' }].map(row => (
              <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: textSub, paddingTop: 1 }}>{row.label}</div>
                <div style={{ fontSize: 14, color: textPrimary }}>{row.value}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent style={{ ...dlgStyle, maxWidth: 440, borderRadius: 18, border: `1px solid ${cardBd}`, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
          <DialogHeader style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${dividerBd}` }}><DialogTitle style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>Add New Member</DialogTitle></DialogHeader>
          <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {renderField('Full Name *', <input value={newMember.name || ''} onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Bro. John Ezra" style={inputStyle(inputBg, inputBd, textPrimary)} />)}
            {renderField('Phone Number *', <input value={newMember.phone || ''} onChange={e => setNewMember(p => ({ ...p, phone: e.target.value }))} placeholder="e.g. 08137999368" style={inputStyle(inputBg, inputBd, textPrimary)} />)}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {renderField('Gender', <Select onValueChange={v => setNewMember(p => ({ ...p, gender: v as any }))}><SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select>)}
              {renderField('Join Date', <input type="date" onChange={e => setNewMember(p => ({ ...p, join_date: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
            </div>
            {renderField('Birthday Date', <input type="date" onChange={e => setNewMember(p => ({ ...p, birthday_date: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
            {renderField('Bio / Notes', <textarea value={newMember.bio || ''} onChange={e => setNewMember(p => ({ ...p, bio: e.target.value }))} rows={3} placeholder="Optional notes..." style={{ ...inputStyle(inputBg, inputBd, textPrimary), height: 'auto', paddingTop: 10, resize: 'vertical' }} />)}
          </div>
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${dividerBd}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setAddMemberOpen(false)} style={outlineBtnStyle(cardBd, textMuted)}>Cancel</button>
            <button disabled={!newMember.name?.trim() || !newMember.phone?.trim() || !userId} onClick={handleAddMember} style={primaryBtnStyle(!newMember.name?.trim() || !newMember.phone?.trim() || !userId)}>Add Member</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editMember} onOpenChange={() => setEditMember(null)}>
        <DialogContent style={{ ...dlgStyle, maxWidth: 440, borderRadius: 18, border: `1px solid ${cardBd}`, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
          <DialogHeader style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${dividerBd}` }}><DialogTitle style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>Edit Member</DialogTitle></DialogHeader>
          <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {renderField('Full Name *', <input value={editedMember.name || ''} onChange={e => setEditedMember(p => ({ ...p, name: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
            {renderField('Phone Number *', <input value={editedMember.phone || ''} onChange={e => setEditedMember(p => ({ ...p, phone: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {renderField('Gender', <Select value={editedMember.gender} onValueChange={v => setEditedMember(p => ({ ...p, gender: v as any }))}><SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue /></SelectTrigger><SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select>)}
              {renderField('Join Date', <input type="date" value={editedMember.join_date || ''} onChange={e => setEditedMember(p => ({ ...p, join_date: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
            </div>
            {renderField('Birthday Date', <input type="date" value={editedMember.birthday_date || ''} onChange={e => setEditedMember(p => ({ ...p, birthday_date: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
            {renderField('Bio / Notes', <textarea value={editedMember.bio || ''} onChange={e => setEditedMember(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ ...inputStyle(inputBg, inputBd, textPrimary), height: 'auto', paddingTop: 10, resize: 'vertical' }} />)}
          </div>
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${dividerBd}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setEditMember(null)} style={outlineBtnStyle(cardBd, textMuted)}>Cancel</button>
            <button disabled={!editedMember.name?.trim() || !editedMember.phone?.trim()} onClick={handleSaveMemberEdit} style={primaryBtnStyle(!editedMember.name?.trim() || !editedMember.phone?.trim())}>Save Changes</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Celebration ── */}
      <Dialog open={addCelebOpen} onOpenChange={v => { setAddCelebOpen(v); if (!v) setNewCeleb({ colorKey: DEFAULT_COLOR }); }}>
        <DialogContent style={{ ...dlgStyle, maxWidth: 440, borderRadius: 18, border: `1px solid ${cardBd}`, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
          <DialogHeader style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${dividerBd}` }}><DialogTitle style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>Add Celebration</DialogTitle></DialogHeader>
          <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {renderField('Member Name *', (
              <Select onValueChange={v => setNewCeleb(p => ({ ...p, name: v }))}>
                <SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue placeholder="Select a member" /></SelectTrigger>
                <SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}>{members.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
              </Select>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {renderField('Month *', (
                <Select value={String(newCeleb.month || currentMonth)} onValueChange={v => setNewCeleb(p => ({ ...p, month: Number(v) }))}>
                  <SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue /></SelectTrigger>
                  <SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}>{MONTH_NAMES.map((mn, i) => <SelectItem key={i + 1} value={String(i + 1)}>{mn}</SelectItem>)}</SelectContent>
                </Select>
              ))}
              {renderField('Day *', (
                <input type="number" min={1} max={31} value={newCeleb.day ?? ''} placeholder="e.g. 14"
                  onChange={e => setNewCeleb(p => ({ ...p, day: e.target.value ? Number(e.target.value) : undefined }))}
                  style={inputStyle(inputBg, inputBd, textPrimary)} />
              ))}
            </div>
            {renderField('Event *', (
              <input value={newCeleb.event || ''} onChange={e => setNewCeleb(p => ({ ...p, event: e.target.value }))}
                placeholder="e.g. Birthday, Wedding Anniversary" style={inputStyle(inputBg, inputBd, textPrimary)} />
            ))}
            {renderField('Pill Colour', (
              <ColorPillPicker value={newCeleb.colorKey || DEFAULT_COLOR} onChange={key => setNewCeleb(p => ({ ...p, colorKey: key }))}
                eventLabel={newCeleb.event} textPrimary={textPrimary} textSub={textSub} />
            ))}
          </div>
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${dividerBd}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => { setAddCelebOpen(false); setNewCeleb({ colorKey: DEFAULT_COLOR }); }} style={outlineBtnStyle(cardBd, textMuted)}>Cancel</button>
            <button disabled={!newCeleb.name?.trim() || !newCeleb.day || !newCeleb.event?.trim() || !userId} onClick={handleAddCelebration} style={primaryBtnStyle(!newCeleb.name?.trim() || !newCeleb.day || !newCeleb.event?.trim() || !userId)}>Add Celebration</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Celebration ── */}
      <Dialog open={!!editCeleb} onOpenChange={v => { if (!v) setEditCeleb(null); }}>
        <DialogContent style={{ ...dlgStyle, maxWidth: 440, borderRadius: 18, border: `1px solid ${cardBd}`, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
          <DialogHeader style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${dividerBd}` }}><DialogTitle style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>Edit Celebration</DialogTitle></DialogHeader>
          <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {renderField('Member Name *', (
              <Select value={editedCeleb.name} onValueChange={v => setEditedCeleb(p => ({ ...p, name: v }))}>
                <SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue /></SelectTrigger>
                <SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}>{members.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
              </Select>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {renderField('Month *', (
                <Select value={String(editedCeleb.month || '')} onValueChange={v => setEditedCeleb(p => ({ ...p, month: Number(v) }))}>
                  <SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue /></SelectTrigger>
                  <SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}>{MONTH_NAMES.map((mn, i) => <SelectItem key={i + 1} value={String(i + 1)}>{mn}</SelectItem>)}</SelectContent>
                </Select>
              ))}
              {renderField('Day *', (
                <input type="number" min={1} max={31} value={editedCeleb.day ?? ''}
                  onChange={e => setEditedCeleb(p => ({ ...p, day: e.target.value ? Number(e.target.value) : undefined }))}
                  style={inputStyle(inputBg, inputBd, textPrimary)} />
              ))}
            </div>
            {renderField('Event *', (
              <input value={editedCeleb.event || ''} onChange={e => setEditedCeleb(p => ({ ...p, event: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />
            ))}
            {renderField('Pill Colour', (
              <ColorPillPicker value={editedCeleb.colorKey || DEFAULT_COLOR} onChange={key => setEditedCeleb(p => ({ ...p, colorKey: key }))}
                eventLabel={editedCeleb.event} textPrimary={textPrimary} textSub={textSub} />
            ))}
          </div>
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${dividerBd}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setEditCeleb(null)} style={outlineBtnStyle(cardBd, textMuted)}>Cancel</button>
            <button disabled={!editedCeleb.name?.trim() || !editedCeleb.event?.trim() || !editedCeleb.day} onClick={handleSaveCelebEdit} style={primaryBtnStyle(!editedCeleb.name?.trim() || !editedCeleb.event?.trim() || !editedCeleb.day)}>Save Changes</button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteCelebId !== null} onOpenChange={() => setDeleteCelebId(null)}>
        <AlertDialogContent style={{ ...dlgStyle, maxWidth: 380, borderRadius: 18, border: `1px solid ${cardBd}` }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: textPrimary }}>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription style={{ color: textMuted }}>Are you sure you want to delete this celebration?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ background: 'transparent', border: `1px solid ${cardBd}`, color: textMuted }}>Cancel</AlertDialogCancel>
            <AlertDialogAction style={{ background: '#ef4444', color: '#fff', border: 'none' }} onClick={handleDeleteCelebration}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function renderField(label: string, input: React.ReactNode) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.04em' }}>{label}</label>
      {input}
    </div>
  );
}
function inputStyle(bg: string, bd: string, color: string): React.CSSProperties {
  return { width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: `1.5px solid ${bd}`, background: bg, color, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
}
function selectStyle(bg: string, bd: string, color: string): React.CSSProperties {
  return { background: bg, border: `1.5px solid ${bd}`, color, borderRadius: 8, height: 40, fontSize: 13 };
}
function primaryBtnStyle(disabled: boolean): React.CSSProperties {
  return { height: 40, padding: '0 20px', borderRadius: 8, border: 'none', background: disabled ? '#374151' : '#059669', color: disabled ? '#6b7280' : '#ffffff', fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: disabled ? 0.6 : 1 };
}
function outlineBtnStyle(bd: string, color: string): React.CSSProperties {
  return { height: 40, padding: '0 16px', borderRadius: 8, border: `1.5px solid ${bd}`, background: 'transparent', color, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' };
}