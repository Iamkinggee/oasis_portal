


// 'use client';

// import { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//   Plus, Trash2, Bell, Calendar, Clock, MapPin,
//   FileText, ChevronRight, Search, AlertTriangle,
//   MessageCircle, Mail, Phone, Copy, CheckCheck, Loader2, X,
// } from 'lucide-react';
// import { createClient } from '@supabase/supabase-js';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel,
//   AlertDialogContent, AlertDialogDescription,
//   AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
// } from '@/components/ui/alert-dialog';

// // ── Supabase ──────────────────────────────────────────────────────────────────
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
// );

// // ── Types ─────────────────────────────────────────────────────────────────────
// type Program = {
//   id: number;
//   title: string;
//   date: string;
//   time: string;
//   venue: string;
//   description: string;
//   created_at: string;
// };

// type Member = {
//   id: number;
//   name: string;
//   phone: string;
// };

// type ReminderChannel = 'whatsapp' | 'sms' | 'email';

// // ── Helpers ───────────────────────────────────────────────────────────────────
// function formatDate(iso: string) {
//   if (!iso) return '';
//   const d = new Date(iso + 'T00:00:00');
//   return d.toLocaleDateString('en-US', {
//     weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
//   }).toUpperCase();
// }

// function formatMonth(iso: string) {
//   if (!iso) return '';
//   const d = new Date(iso + 'T00:00:00');
//   return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
// }

// function daysFromNow(iso: string): string {
//   const today = new Date(); today.setHours(0, 0, 0, 0);
//   const target = new Date(iso + 'T00:00:00');
//   const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
//   if (diff === 0) return 'TODAY';
//   if (diff === 1) return 'TOMORROW';
//   if (diff < 0) return `${Math.abs(diff)} DAYS AGO`;
//   return `${diff} DAYS TO GO`;
// }

// function daysTag(iso: string): 'past' | 'today' | 'upcoming' {
//   const today = new Date(); today.setHours(0, 0, 0, 0);
//   const target = new Date(iso + 'T00:00:00');
//   const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
//   if (diff < 0) return 'past';
//   if (diff === 0) return 'today';
//   return 'upcoming';
// }

// function formatTime(t: string) {
//   if (!t) return '';
//   const [h, m] = t.split(':').map(Number);
//   const ampm = h >= 12 ? 'PM' : 'AM';
//   return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
// }

// // Normalise phone: strip non-digits, ensure leading +
// function normalisePhone(raw: string): string {
//   const digits = raw.replace(/\D/g, '');
//   // Nigerian numbers: if starts with 0, replace with 234
//   if (digits.startsWith('0')) return '234' + digits.slice(1);
//   return digits;
// }

// function buildReminderMessage(program: Program): string {
//   return `📢 *PROGRAM REMINDER*\n\n*${program.title}*\n\n📅 Date: ${formatDate(program.date)}\n⏰ Time: ${formatTime(program.time)}${program.venue ? `\n📍 Venue: ${program.venue}` : ''}${program.description ? `\n\n${program.description}` : ''}\n\nPlease make plans to attend. God bless you! 🙏`;
// }

// function tagColor(tag: string) {
//   if (tag === 'today') return 'bg-amber-100 text-amber-700 border-amber-300';
//   if (tag === 'past') return 'bg-zinc-100 text-zinc-500 border-zinc-300';
//   return 'bg-green-100 text-green-700 border-green-300';
// }

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function ProgramPage() {
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [members, setMembers] = useState<Member[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');

//   // Dialogs
//   const [createOpen, setCreateOpen] = useState(false);
//   const [viewProgram, setViewProgram] = useState<Program | null>(null);
//   const [deleteId, setDeleteId] = useState<number | null>(null);
//   const [reminderProgram, setReminderProgram] = useState<Program | null>(null);
//   const [reminderChannel, setReminderChannel] = useState<ReminderChannel>('whatsapp');
//   const [copiedBroadcast, setCopiedBroadcast] = useState(false);
//   const [copiedMember, setCopiedMember] = useState<number | null>(null);

//   const [toast, setToast] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);

//   // Form
//   const [form, setForm] = useState({ title: '', date: '', time: '', venue: '', description: '' });
//   const [formError, setFormError] = useState('');

//   // ── Fetch ─────────────────────────────────────────────────────────────────
//   const fetchPrograms = useCallback(async () => {
//     const { data } = await supabase
//       .from('programs')
//       .select('*')
//       .order('date', { ascending: true });
//     if (data) setPrograms(data);
//   }, []);

//   const fetchMembers = useCallback(async () => {
//     const { data } = await supabase
//       .from('members')
//       .select('id, name, phone')
//       .order('created_at', { ascending: true });
//     if (data) setMembers(data);
//   }, []);

//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       await Promise.all([fetchPrograms(), fetchMembers()]);
//       setLoading(false);
//     };
//     init();
//   }, [fetchPrograms, fetchMembers]);

//   // ── Realtime ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const sub = supabase
//       .channel('programs-rt')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'programs' }, fetchPrograms)
//       .subscribe();
//     return () => { supabase.removeChannel(sub); };
//   }, [fetchPrograms]);

//   // ── Derived ───────────────────────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     if (!search.trim()) return programs;
//     const q = search.toLowerCase();
//     return programs.filter(p =>
//       p.title.toLowerCase().includes(q) || (p.venue || '').toLowerCase().includes(q)
//     );
//   }, [programs, search]);

//   const grouped = useMemo(() => {
//     const map = new Map<string, Program[]>();
//     filtered.forEach(p => {
//       const key = formatMonth(p.date);
//       if (!map.has(key)) map.set(key, []);
//       map.get(key)!.push(p);
//     });
//     return map;
//   }, [filtered]);

//   // ── Handlers ─────────────────────────────────────────────────────────────
//   const showToast = (msg: string) => {
//     setToast(msg);
//     setTimeout(() => setToast(null), 3000);
//   };

//   const handleCreate = async () => {
//     if (!form.title.trim() || !form.date || !form.time) {
//       setFormError('Title, date and time are required.');
//       return;
//     }
//     setSaving(true);
//     const { error } = await supabase.from('programs').insert([{
//       title: form.title.trim().toUpperCase(),
//       date: form.date,
//       time: form.time,
//       venue: form.venue.trim() || null,
//       description: form.description.trim() || null,
//     }]);
//     setSaving(false);
//     if (error) { setFormError('Failed to save. Please try again.'); return; }
//     setForm({ title: '', date: '', time: '', venue: '', description: '' });
//     setFormError('');
//     setCreateOpen(false);
//     showToast('Program created successfully!');
//   };

//   const handleDelete = async () => {
//     if (deleteId === null) return;
//     await supabase.from('programs').delete().eq('id', deleteId);
//     if (viewProgram?.id === deleteId) setViewProgram(null);
//     setDeleteId(null);
//     showToast('Program deleted.');
//   };

//   // ── Reminder actions ──────────────────────────────────────────────────────
//   const getReminderLink = (member: Member, program: Program, channel: ReminderChannel): string => {
//     const msg = buildReminderMessage(program);
//     const phone = normalisePhone(member.phone);
//     const encoded = encodeURIComponent(msg);
//     if (channel === 'whatsapp') return `https://wa.me/${phone}?text=${encoded}`;
//     if (channel === 'sms') return `sms:+${phone}?body=${encoded}`;
//     if (channel === 'email') return `mailto:?to=&subject=${encodeURIComponent(program.title)}&body=${encoded}`;
//     return '#';
//   };

//   const handleCopyBroadcast = async (program: Program) => {
//     await navigator.clipboard.writeText(buildReminderMessage(program));
//     setCopiedBroadcast(true);
//     setTimeout(() => setCopiedBroadcast(false), 2000);
//   };

//   const handleCopyMember = async (idx: number, member: Member, program: Program) => {
//     await navigator.clipboard.writeText(buildReminderMessage(program));
//     setCopiedMember(idx);
//     setTimeout(() => setCopiedMember(null), 1800);
//   };

//   const channelIcon = (ch: ReminderChannel) => {
//     if (ch === 'whatsapp') return <MessageCircle className="h-4 w-4" />;
//     if (ch === 'sms') return <Phone className="h-4 w-4" />;
//     return <Mail className="h-4 w-4" />;
//   };

//   const channelColor = (ch: ReminderChannel) => {
//     if (ch === 'whatsapp') return 'bg-green-600 hover:bg-green-500';
//     if (ch === 'sms') return 'bg-blue-600 hover:bg-blue-500';
//     return 'bg-indigo-600 hover:bg-indigo-500';
//   };

//   const channelLabel = (ch: ReminderChannel) => {
//     if (ch === 'whatsapp') return 'WhatsApp';
//     if (ch === 'sms') return 'SMS';
//     return 'Email';
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[40vh]">
//         <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 sm:space-y-8 pb-20 relative px-2 sm:px-0">

//       {/* ── Toast ──────────────────────────────────────────────────────────── */}
//       {toast && (
//         <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold whitespace-nowrap">
//           {toast}
//         </div>
//       )}

//       {/* ── Header ─────────────────────────────────────────────────────────── */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <h1 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight">PROGRAM</h1>
//         <Button
//           onClick={() => setCreateOpen(true)}
//           className="h-10 sm:h-11 px-4 sm:px-6 gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl w-full sm:w-auto"
//         >
//           <Plus className="h-4 w-4" /> CREATE PROGRAM
//         </Button>
//       </div>

//       {/* ── Search ─────────────────────────────────────────────────────────── */}
//       <div className="relative max-w-sm">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
//         <Input
//           placeholder="Search programs..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="pl-9 h-11 rounded-xl"
//         />
//       </div>

//       {/* ── Program Groups ──────────────────────────────────────────────────── */}
//       {grouped.size === 0 ? (
//         <div className="text-center py-20 text-zinc-400">
//           <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
//           <p className="text-sm">{search ? 'No programs match your search.' : 'No programs yet. Create one!'}</p>
//         </div>
//       ) : (
//         Array.from(grouped.entries()).map(([month, progs]) => (
//           <div key={month} className="space-y-3 sm:space-y-4">
//             <h2 className="text-xs sm:text-sm font-bold text-zinc-500 tracking-widest">
//               MONTH: {month}
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
//               {progs.map(prog => {
//                 const tag = daysTag(prog.date);
//                 return (
//                   <div
//                     key={prog.id}
//                     onClick={() => setViewProgram(prog)}
//                     className="group relative bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
//                   >
//                     <div className={`h-1 w-full ${
//                       tag === 'today' ? 'bg-amber-400' :
//                       tag === 'past' ? 'bg-zinc-300' : 'bg-green-500'
//                     }`} />
//                     <div className="p-4 sm:p-5">
//                       <p className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 tracking-widest mb-2">
//                         {formatDate(prog.date)}
//                       </p>
//                       <h3 className="font-black text-zinc-800 text-sm sm:text-[15px] leading-tight mb-3 line-clamp-3 tracking-tight">
//                         {prog.title}
//                       </h3>
//                       {prog.venue && (
//                         <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3">
//                           <MapPin className="h-3 w-3 shrink-0" />
//                           <span className="truncate">{prog.venue}</span>
//                         </div>
//                       )}
//                       <div className="flex items-center justify-between">
//                         <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 ${tagColor(tag)}`}>
//                           {daysFromNow(prog.date)}
//                         </Badge>
//                         <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))
//       )}

//       {/* ════════════════════════════════════════════════════════════════════
//           VIEW PROGRAM DIALOG
//       ════════════════════════════════════════════════════════════════════ */}
//       <Dialog open={!!viewProgram} onOpenChange={() => setViewProgram(null)}>
//         <DialogContent className="w-[92vw] sm:max-w-lg rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col max-h-[90vh]">
//           {viewProgram && (
//             <>
//               <div className={`h-2 w-full rounded-t-2xl shrink-0 ${
//                 daysTag(viewProgram.date) === 'today' ? 'bg-amber-400' :
//                 daysTag(viewProgram.date) === 'past' ? 'bg-zinc-300' : 'bg-green-500'
//               }`} />
//               <DialogHeader className="px-5 sm:px-7 pt-4 sm:pt-5 pb-3 sm:pb-4 shrink-0">
//                 <Badge variant="outline" className={`text-[10px] font-bold mb-2 w-fit ${tagColor(daysTag(viewProgram.date))}`}>
//                   {daysFromNow(viewProgram.date)}
//                 </Badge>
//                 <DialogTitle className="text-lg sm:text-xl font-black text-zinc-800 leading-tight tracking-tight">
//                   {viewProgram.title}
//                 </DialogTitle>
//               </DialogHeader>
//               <div className="overflow-y-auto flex-1 px-5 sm:px-7 pb-2 space-y-4">
//                 <div className="grid grid-cols-1 gap-2.5">
//                   {[
//                     { icon: <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />, label: 'Date', value: formatDate(viewProgram.date) },
//                     { icon: <Clock className="h-4 w-4 text-zinc-400 shrink-0" />, label: 'Time', value: formatTime(viewProgram.time) },
//                     ...(viewProgram.venue ? [{ icon: <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />, label: 'Venue', value: viewProgram.venue }] : []),
//                   ].map(row => (
//                     <div key={row.label} className="flex items-center gap-3 bg-zinc-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
//                       {row.icon}
//                       <div>
//                         <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">{row.label}</p>
//                         <p className="text-xs sm:text-sm font-semibold text-zinc-800">{row.value}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {viewProgram.description && (
//                   <div>
//                     <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5">Description</p>
//                     <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">{viewProgram.description}</p>
//                   </div>
//                 )}
//               </div>
//               <div className="px-5 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 flex gap-2 sm:gap-3">
//                 <Button
//                   variant="outline"
//                   className="flex-1 gap-1.5 sm:gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs sm:text-sm"
//                   onClick={() => setDeleteId(viewProgram.id)}
//                 >
//                   <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Delete
//                 </Button>
//                 <Button
//                   className="flex-1 gap-1.5 sm:gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm"
//                   onClick={() => { setReminderProgram(viewProgram); setViewProgram(null); setReminderChannel('whatsapp'); }}
//                 >
//                   <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Send Reminder
//                 </Button>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* ════════════════════════════════════════════════════════════════════
//           CREATE PROGRAM DIALOG
//       ════════════════════════════════════════════════════════════════════ */}
//       <Dialog open={createOpen} onOpenChange={v => { setCreateOpen(v); setFormError(''); }}>
//         <DialogContent className="w-[92vw] sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col max-h-[90vh]">
//           <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 shrink-0">
//             <DialogTitle className="text-xl sm:text-2xl font-bold text-zinc-800">Create Program</DialogTitle>
//           </DialogHeader>
//           <div className="overflow-y-auto flex-1 px-5 sm:px-7 pb-2 space-y-4 sm:space-y-5">
//             {formError && (
//               <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
//                 <AlertTriangle className="h-4 w-4 shrink-0" /> {formError}
//               </div>
//             )}
//             <div className="space-y-2">
//               <Label className="font-medium text-zinc-700">Program Title *</Label>
//               <Input
//                 placeholder="e.g. Healing Streams Live Service"
//                 value={form.title}
//                 onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
//                 className="h-11"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-3 sm:gap-4">
//               <div className="space-y-2">
//                 <Label className="font-medium text-zinc-700">Date *</Label>
//                 <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="h-11" />
//               </div>
//               <div className="space-y-2">
//                 <Label className="font-medium text-zinc-700">Time *</Label>
//                 <Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="h-11" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label className="font-medium text-zinc-700">Venue</Label>
//               <Input
//                 placeholder="e.g. Church Auditorium, Online"
//                 value={form.venue}
//                 onChange={e => setForm(p => ({ ...p, venue: e.target.value }))}
//                 className="h-11"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label className="font-medium text-zinc-700">Description</Label>
//               <Textarea
//                 placeholder="Describe the program..."
//                 value={form.description}
//                 onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
//                 rows={4}
//               />
//             </div>
//           </div>
//           <DialogFooter className="px-5 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 gap-2">
//             <Button variant="outline" onClick={() => { setCreateOpen(false); setFormError(''); }}>Cancel</Button>
//             <Button onClick={handleCreate} disabled={saving} className="bg-zinc-900 hover:bg-zinc-800 text-white gap-2">
//               {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
//               Save Program
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ════════════════════════════════════════════════════════════════════
//           DELETE CONFIRM DIALOG
//       ════════════════════════════════════════════════════════════════════ */}
//       <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
//         <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl bg-white shadow-2xl">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Program?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. The program will be permanently removed.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* ════════════════════════════════════════════════════════════════════
//           SEND REMINDER DIALOG
//       ════════════════════════════════════════════════════════════════════ */}
//       <Dialog open={!!reminderProgram} onOpenChange={v => { if (!v) setReminderProgram(null); }}>
//         <DialogContent className="w-[92vw] sm:max-w-lg rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col max-h-[92vh]">
//           <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-6 pb-3 shrink-0 border-b border-zinc-100">
//             <DialogTitle className="text-lg sm:text-xl font-bold text-zinc-800">Send Reminder</DialogTitle>
//             {reminderProgram && (
//               <div className="mt-2 bg-zinc-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 space-y-0.5">
//                 <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">Program</p>
//                 <p className="font-bold text-zinc-800 text-sm sm:text-base leading-snug">{reminderProgram.title}</p>
//                 <p className="text-xs text-zinc-500">
//                   {formatDate(reminderProgram.date)} · {formatTime(reminderProgram.time)}
//                   {reminderProgram.venue ? ` · ${reminderProgram.venue}` : ''}
//                 </p>
//               </div>
//             )}
//           </DialogHeader>

//           {reminderProgram && (
//             <div className="overflow-y-auto flex-1 px-5 sm:px-7 py-4 space-y-5">

//               {/* ── Channel selector ─────────────────────────────────────── */}
//               <div>
//                 <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Choose Channel</p>
//                 <div className="grid grid-cols-3 gap-2">
//                   {(['whatsapp', 'sms', 'email'] as ReminderChannel[]).map(ch => (
//                     <button
//                       key={ch}
//                       onClick={() => setReminderChannel(ch)}
//                       className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-bold transition-all ${
//                         reminderChannel === ch
//                           ? ch === 'whatsapp' ? 'border-green-500 bg-green-50 text-green-700'
//                           : ch === 'sms' ? 'border-blue-500 bg-blue-50 text-blue-700'
//                           : 'border-indigo-500 bg-indigo-50 text-indigo-700'
//                           : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'
//                       }`}
//                     >
//                       {ch === 'whatsapp' && <MessageCircle className="h-5 w-5" />}
//                       {ch === 'sms' && <Phone className="h-5 w-5" />}
//                       {ch === 'email' && <Mail className="h-5 w-5" />}
//                       {channelLabel(ch)}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* ── Message preview ──────────────────────────────────────── */}
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Message Preview</p>
//                   <button
//                     onClick={() => handleCopyBroadcast(reminderProgram)}
//                     className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-lg"
//                   >
//                     {copiedBroadcast ? <CheckCheck className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
//                     {copiedBroadcast ? 'Copied!' : 'Copy'}
//                   </button>
//                 </div>
//                 <pre className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-700 whitespace-pre-wrap leading-relaxed font-sans">
//                   {buildReminderMessage(reminderProgram)}
//                 </pre>
//               </div>

//               {/* ── Members list ─────────────────────────────────────────── */}
//               <div>
//                 <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
//                   Send to Members ({members.length})
//                 </p>
//                 {members.length === 0 ? (
//                   <p className="text-xs text-zinc-400">No members found in database.</p>
//                 ) : (
//                   <div className="space-y-2">
//                     {members.map((member, i) => {
//                       const link = getReminderLink(member, reminderProgram, reminderChannel);
//                       return (
//                         <div
//                           key={member.id}
//                           className="flex items-center gap-2 sm:gap-3 bg-zinc-50 rounded-xl px-3 py-2.5 border border-zinc-100"
//                         >
//                           <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
//                           <div className="flex-1 min-w-0">
//                             <p className="text-xs sm:text-sm font-medium text-zinc-800 truncate">{member.name}</p>
//                             <p className="text-[11px] text-zinc-400">{member.phone}</p>
//                           </div>
//                           <div className="flex items-center gap-1.5 shrink-0">
//                             {/* Copy for this member */}
//                             <button
//                               onClick={() => handleCopyMember(i, member, reminderProgram)}
//                               title="Copy message"
//                               className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 transition-colors"
//                             >
//                               {copiedMember === i
//                                 ? <CheckCheck className="h-3.5 w-3.5 text-green-600" />
//                                 : <Copy className="h-3.5 w-3.5" />
//                               }
//                             </button>
//                             {/* Open channel link */}
//                             <a
//                               href={link}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               title={`Send via ${channelLabel(reminderChannel)}`}
//                               className={`h-8 px-2.5 flex items-center gap-1 rounded-lg text-white text-xs font-semibold transition-colors ${channelColor(reminderChannel)}`}
//                             >
//                               {channelIcon(reminderChannel)}
//                               <span className="hidden sm:inline">{channelLabel(reminderChannel)}</span>
//                             </a>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           <div className="px-5 sm:px-7 py-4 border-t border-zinc-100 shrink-0">
//             <Button
//               className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
//               onClick={() => setReminderProgram(null)}
//             >
//               Done
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

































// 'use client';

// import { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//   Plus, Trash2, Bell, Calendar, Clock, MapPin,
//   FileText, ChevronRight, Search, AlertTriangle,
//   MessageCircle, Mail, Phone, Copy, CheckCheck, Loader2,
// } from 'lucide-react';
// import { createClient } from '@supabase/supabase-js';
// import { useTheme } from '@/app/components/ThemeProvider';
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel,
//   AlertDialogContent, AlertDialogDescription,
//   AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
// } from '@/components/ui/alert-dialog';

// // ── Supabase ──────────────────────────────────────────────────────────────────
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
// );

// // ── Types ─────────────────────────────────────────────────────────────────────
// type Program = {
//   id: number;
//   title: string;
//   date: string;
//   time: string;
//   venue: string;
//   description: string;
//   created_at: string;
// };

// type Member = { id: number; name: string; phone: string };
// type ReminderChannel = 'whatsapp' | 'sms' | 'email';

// // ── Helpers ───────────────────────────────────────────────────────────────────
// function formatDate(iso: string) {
//   if (!iso) return '';
//   const d = new Date(iso + 'T00:00:00');
//   return d.toLocaleDateString('en-US', {
//     weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
//   }).toUpperCase();
// }

// function formatMonth(iso: string) {
//   if (!iso) return '';
//   const d = new Date(iso + 'T00:00:00');
//   return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
// }

// function daysFromNow(iso: string): string {
//   const today = new Date(); today.setHours(0, 0, 0, 0);
//   const target = new Date(iso + 'T00:00:00');
//   const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
//   if (diff === 0) return 'TODAY';
//   if (diff === 1) return 'TOMORROW';
//   if (diff < 0) return `${Math.abs(diff)} DAYS AGO`;
//   return `${diff} DAYS TO GO`;
// }

// function daysTag(iso: string): 'past' | 'today' | 'upcoming' {
//   const today = new Date(); today.setHours(0, 0, 0, 0);
//   const target = new Date(iso + 'T00:00:00');
//   const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
//   if (diff < 0) return 'past';
//   if (diff === 0) return 'today';
//   return 'upcoming';
// }

// function formatTime(t: string) {
//   if (!t) return '';
//   const [h, m] = t.split(':').map(Number);
//   const ampm = h >= 12 ? 'PM' : 'AM';
//   return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
// }

// function normalisePhone(raw: string): string {
//   const digits = raw.replace(/\D/g, '');
//   if (digits.startsWith('0')) return '234' + digits.slice(1);
//   return digits;
// }

// function buildReminderMessage(program: Program): string {
//   return `📢 *PROGRAM REMINDER*\n\n*${program.title}*\n\n📅 Date: ${formatDate(program.date)}\n⏰ Time: ${formatTime(program.time)}${program.venue ? `\n📍 Venue: ${program.venue}` : ''}${program.description ? `\n\n${program.description}` : ''}\n\nPlease make plans to attend. God bless you! 🙏`;
// }

// // ── Tag accent bar color (always the same, just the indicator) ────────────────
// function tagBarColor(tag: string) {
//   if (tag === 'today') return '#f59e0b';
//   if (tag === 'past') return '#a1a1aa';
//   return '#22c55e';
// }

// function tagBadgeStyle(tag: string, isDark: boolean): React.CSSProperties {
//   if (tag === 'today') return { background: isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7', color: isDark ? '#fbbf24' : '#92400e', border: `1px solid ${isDark ? 'rgba(245,158,11,0.3)' : '#fcd34d'}` };
//   if (tag === 'past')  return { background: isDark ? 'rgba(161,161,170,0.12)' : '#f4f4f5', color: isDark ? '#a1a1aa' : '#71717a', border: `1px solid ${isDark ? 'rgba(161,161,170,0.2)' : '#d4d4d8'}` };
//   return { background: isDark ? 'rgba(34,197,94,0.12)' : '#f0fdf4', color: isDark ? '#4ade80' : '#15803d', border: `1px solid ${isDark ? 'rgba(34,197,94,0.25)' : '#86efac'}` };
// }

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function ProgramPage() {
//   const { isDark } = useTheme();

//   // ── Theme tokens ────────────────────────────────────────────────────────────
//   const pageBg       = isDark ? '#0f1117' : '#f8f9fb';
//   const cardBg       = isDark ? '#16181f' : '#ffffff';
//   const cardBd       = isDark ? '#1e2028' : '#e5e7eb';
//   const cardHoverBd  = isDark ? '#2d2f3a' : '#d1d5db';
//   const headBg       = isDark ? '#111318' : '#f9fafb';
//   const textPrimary  = isDark ? '#f3f4f6' : '#111827';
//   const textMuted    = isDark ? '#6b7280' : '#6b7280';
//   const textSub      = isDark ? '#9ca3af' : '#9ca3af';
//   const inputBg      = isDark ? '#1a1d27' : '#ffffff';
//   const inputBd      = isDark ? '#2a2d3a' : '#e5e7eb';
//   const dividerBd    = isDark ? '#1e2028' : '#f0f0f0';
//   const rowBg        = isDark ? '#1a1d27' : '#f9fafb';
//   const sectionLabel = { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: textMuted };

//   const [programs,        setPrograms]        = useState<Program[]>([]);
//   const [members,         setMembers]         = useState<Member[]>([]);
//   const [loading,         setLoading]         = useState(true);
//   const [search,          setSearch]          = useState('');
//   const [createOpen,      setCreateOpen]      = useState(false);
//   const [viewProgram,     setViewProgram]     = useState<Program | null>(null);
//   const [deleteId,        setDeleteId]        = useState<number | null>(null);
//   const [reminderProgram, setReminderProgram] = useState<Program | null>(null);
//   const [reminderChannel, setReminderChannel] = useState<ReminderChannel>('whatsapp');
//   const [copiedBroadcast, setCopiedBroadcast] = useState(false);
//   const [copiedMember,    setCopiedMember]    = useState<number | null>(null);
//   const [toast,           setToast]           = useState<string | null>(null);
//   const [saving,          setSaving]          = useState(false);
//   const [form,            setForm]            = useState({ title: '', date: '', time: '', venue: '', description: '' });
//   const [formError,       setFormError]       = useState('');

//   const fetchPrograms = useCallback(async () => {
//     const { data } = await supabase.from('programs').select('*').order('date', { ascending: true });
//     if (data) setPrograms(data);
//   }, []);

//   const fetchMembers = useCallback(async () => {
//     const { data } = await supabase.from('members').select('id, name, phone').order('created_at', { ascending: true });
//     if (data) setMembers(data);
//   }, []);

//   useEffect(() => {
//     const init = async () => { setLoading(true); await Promise.all([fetchPrograms(), fetchMembers()]); setLoading(false); };
//     init();
//   }, [fetchPrograms, fetchMembers]);

//   useEffect(() => {
//     const sub = supabase.channel('programs-rt')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'programs' }, fetchPrograms)
//       .subscribe();
//     return () => { supabase.removeChannel(sub); };
//   }, [fetchPrograms]);

//   const filtered = useMemo(() => {
//     if (!search.trim()) return programs;
//     const q = search.toLowerCase();
//     return programs.filter(p => p.title.toLowerCase().includes(q) || (p.venue || '').toLowerCase().includes(q));
//   }, [programs, search]);

//   const grouped = useMemo(() => {
//     const map = new Map<string, Program[]>();
//     filtered.forEach(p => {
//       const key = formatMonth(p.date);
//       if (!map.has(key)) map.set(key, []);
//       map.get(key)!.push(p);
//     });
//     return map;
//   }, [filtered]);

//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

//   const handleCreate = async () => {
//     if (!form.title.trim() || !form.date || !form.time) { setFormError('Title, date and time are required.'); return; }
//     setSaving(true);
//     const { error } = await supabase.from('programs').insert([{
//       title: form.title.trim().toUpperCase(), date: form.date, time: form.time,
//       venue: form.venue.trim() || null, description: form.description.trim() || null,
//     }]);
//     setSaving(false);
//     if (error) { setFormError('Failed to save. Please try again.'); return; }
//     setForm({ title: '', date: '', time: '', venue: '', description: '' });
//     setFormError(''); setCreateOpen(false);
//     showToast('Program created successfully!');
//   };

//   const handleDelete = async () => {
//     if (deleteId === null) return;
//     await supabase.from('programs').delete().eq('id', deleteId);
//     if (viewProgram?.id === deleteId) setViewProgram(null);
//     setDeleteId(null); showToast('Program deleted.');
//   };

//   const getReminderLink = (member: Member, program: Program, channel: ReminderChannel): string => {
//     const msg = buildReminderMessage(program);
//     const phone = normalisePhone(member.phone);
//     const encoded = encodeURIComponent(msg);
//     if (channel === 'whatsapp') return `https://wa.me/${phone}?text=${encoded}`;
//     if (channel === 'sms') return `sms:+${phone}?body=${encoded}`;
//     return `mailto:?to=&subject=${encodeURIComponent(program.title)}&body=${encoded}`;
//   };

//   const handleCopyBroadcast = async (program: Program) => {
//     await navigator.clipboard.writeText(buildReminderMessage(program));
//     setCopiedBroadcast(true); setTimeout(() => setCopiedBroadcast(false), 2000);
//   };

//   const handleCopyMember = async (idx: number, member: Member, program: Program) => {
//     await navigator.clipboard.writeText(buildReminderMessage(program));
//     setCopiedMember(idx); setTimeout(() => setCopiedMember(null), 1800);
//   };

//   const channelLabel = (ch: ReminderChannel) => ch === 'whatsapp' ? 'WhatsApp' : ch === 'sms' ? 'SMS' : 'Email';
//   const channelBg    = (ch: ReminderChannel, active: boolean) => {
//     if (!active) return { background: cardBg, borderColor: cardBd, color: textMuted };
//     if (ch === 'whatsapp') return { background: isDark ? 'rgba(34,197,94,0.12)' : '#f0fdf4', borderColor: '#22c55e', color: isDark ? '#4ade80' : '#15803d' };
//     if (ch === 'sms')      return { background: isDark ? 'rgba(59,130,246,0.12)' : '#eff6ff', borderColor: '#3b82f6', color: isDark ? '#60a5fa' : '#1d4ed8' };
//     return { background: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', borderColor: '#6366f1', color: isDark ? '#818cf8' : '#4338ca' };
//   };
//   const channelSendBg = (ch: ReminderChannel) => {
//     if (ch === 'whatsapp') return '#16a34a';
//     if (ch === 'sms')      return '#2563eb';
//     return '#4f46e5';
//   };

//   // ── Inline input/textarea style ──────────────────────────────────────────
//   const inputStyle: React.CSSProperties = {
//     height: 44, padding: '0 12px', borderRadius: 8, border: `1.5px solid ${inputBd}`,
//     background: inputBg, color: textPrimary, fontSize: 14, fontFamily: 'inherit',
//     outline: 'none', width: '100%', boxSizing: 'border-box',
//   };
//   const textareaStyle: React.CSSProperties = {
//     padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${inputBd}`,
//     background: inputBg, color: textPrimary, fontSize: 14, fontFamily: 'inherit',
//     outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: 96,
//   };
//   const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: textSub, letterSpacing: '0.04em', display: 'block', marginBottom: 6 };
//   const btnPrimary: React.CSSProperties = { height: 42, padding: '0 20px', borderRadius: 8, border: 'none', background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#ffffff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 };
//   const btnSecondary: React.CSSProperties = { height: 42, padding: '0 16px', borderRadius: 8, border: `1.5px solid ${cardBd}`, background: 'transparent', color: textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' };
//   const btnDanger: React.CSSProperties = { height: 42, padding: '0 16px', borderRadius: 8, border: `1.5px solid ${isDark ? 'rgba(239,68,68,0.3)' : '#fca5a5'}`, background: isDark ? 'rgba(239,68,68,0.08)' : '#fff1f2', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 };

//   // ── Dialog shared wrapper style ────────────────────────────────────────────
//   const dialogStyle: React.CSSProperties = {
//     background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 20,
//     padding: 0, display: 'flex', flexDirection: 'column', color: textPrimary,
//     maxHeight: '90vh',
//   };
//   const dialogHead: React.CSSProperties = { padding: '20px 22px 16px', borderBottom: `1px solid ${dividerBd}`, flexShrink: 0 };
//   const dialogFoot: React.CSSProperties = { padding: '14px 22px 18px', borderTop: `1px solid ${dividerBd}`, flexShrink: 0 };

//   if (loading) return (
//     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
//       <Loader2 style={{ width: 32, height: 32, color: textSub, animation: 'spin 1s linear infinite' }} />
//       <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
//     </div>
//   );

//   return (
//     <div style={{ background: pageBg, minHeight: '100vh', padding: '20px 16px 80px', boxSizing: 'border-box', transition: 'background 0.3s' }}>
//       <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

//       {/* Toast */}
//       {toast && (
//         <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#ffffff', padding: '10px 20px', borderRadius: 14, fontSize: 13, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', whiteSpace: 'nowrap' }}>
//           {toast}
//         </div>
//       )}

//       <div style={{ maxWidth: 1200, margin: '0 auto' }}>

//         {/* ── Header ── */}
//         <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
//           <h1 style={{ fontSize: 20, fontWeight: 800, color: textPrimary, letterSpacing: '-0.3px', margin: 0 }}>PROGRAM</h1>
//           <button onClick={() => setCreateOpen(true)} style={{ ...btnPrimary, height: 44, padding: '0 20px', fontSize: 13 }}>
//             <Plus size={15} /> CREATE PROGRAM
//           </button>
//         </div>

//         {/* ── Search ── */}
//         <div style={{ position: 'relative', maxWidth: 340, marginBottom: 24 }}>
//           <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: textSub, pointerEvents: 'none' }} />
//           <input
//             placeholder="Search programs..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             style={{ ...inputStyle, paddingLeft: 36, height: 44 }}
//           />
//         </div>

//         {/* ── Program Groups ── */}
//         {grouped.size === 0 ? (
//           <div style={{ textAlign: 'center', padding: '80px 0', color: textSub }}>
//             <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
//             <p style={{ fontSize: 14 }}>{search ? 'No programs match your search.' : 'No programs yet. Create one!'}</p>
//           </div>
//         ) : (
//           Array.from(grouped.entries()).map(([month, progs]) => (
//             <div key={month} style={{ marginBottom: 32 }}>
//               <h2 style={{ ...sectionLabel, marginBottom: 12 }}>MONTH: {month}</h2>
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
//                 {progs.map(prog => {
//                   const tag = daysTag(prog.date);
//                   return (
//                     <div
//                       key={prog.id}
//                       onClick={() => setViewProgram(prog)}
//                       style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.18s', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}
//                       onMouseEnter={e => { e.currentTarget.style.borderColor = cardHoverBd; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)'; }}
//                       onMouseLeave={e => { e.currentTarget.style.borderColor = cardBd; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'; }}
//                     >
//                       {/* accent bar */}
//                       <div style={{ height: 4, background: tagBarColor(tag) }} />
//                       <div style={{ padding: '14px 16px' }}>
//                         <p style={{ fontSize: 10, fontWeight: 700, color: textSub, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
//                           {formatDate(prog.date)}
//                         </p>
//                         <h3 style={{ fontSize: 14, fontWeight: 800, color: textPrimary, lineHeight: 1.3, marginBottom: 10, letterSpacing: '-0.2px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
//                           {prog.title}
//                         </h3>
//                         {prog.venue && (
//                           <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: textSub, fontSize: 12, marginBottom: 10 }}>
//                             <MapPin size={11} style={{ flexShrink: 0 }} />
//                             <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prog.venue}</span>
//                           </div>
//                         )}
//                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                           <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, ...tagBadgeStyle(tag, isDark) }}>
//                             {daysFromNow(prog.date)}
//                           </span>
//                           <ChevronRight size={14} color={textSub} />
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* ══════════════════════════════════════════════════════════════════
//           VIEW PROGRAM DIALOG
//       ══════════════════════════════════════════════════════════════════ */}
//       <Dialog open={!!viewProgram} onOpenChange={() => setViewProgram(null)}>
//         <DialogContent style={{ ...dialogStyle, width: 'min(92vw, 500px)' }}>
//           {viewProgram && (() => {
//             const tag = daysTag(viewProgram.date);
//             return (
//               <>
//                 <div style={{ height: 4, background: tagBarColor(tag), borderRadius: '20px 20px 0 0', flexShrink: 0 }} />
//                 <div style={dialogHead}>
//                   <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, ...tagBadgeStyle(tag, isDark), display: 'inline-block', marginBottom: 10 }}>
//                     {daysFromNow(viewProgram.date)}
//                   </span>
//                   <h2 style={{ fontSize: 20, fontWeight: 800, color: textPrimary, margin: 0, lineHeight: 1.2 }}>{viewProgram.title}</h2>
//                 </div>

//                 <div style={{ overflowY: 'auto', flex: 1, padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
//                   {[
//                     { icon: <Calendar size={15} color={textSub} />, label: 'Date', value: formatDate(viewProgram.date) },
//                     { icon: <Clock size={15} color={textSub} />, label: 'Time', value: formatTime(viewProgram.time) },
//                     ...(viewProgram.venue ? [{ icon: <MapPin size={15} color={textSub} />, label: 'Venue', value: viewProgram.venue }] : []),
//                   ].map(row => (
//                     <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: rowBg, borderRadius: 12, padding: '10px 14px', border: `1px solid ${dividerBd}` }}>
//                       <span style={{ flexShrink: 0 }}>{row.icon}</span>
//                       <div>
//                         <p style={{ ...sectionLabel, fontSize: 9, margin: '0 0 2px' }}>{row.label}</p>
//                         <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0 }}>{row.value}</p>
//                       </div>
//                     </div>
//                   ))}
//                   {viewProgram.description && (
//                     <div style={{ paddingTop: 4 }}>
//                       <p style={{ ...sectionLabel, fontSize: 9, marginBottom: 6 }}>Description</p>
//                       <p style={{ fontSize: 13, color: isDark ? '#d1d5db' : '#374151', lineHeight: 1.6, margin: 0 }}>{viewProgram.description}</p>
//                     </div>
//                   )}
//                 </div>

//                 <div style={{ ...dialogFoot, display: 'flex', gap: 10 }}>
//                   <button style={{ ...btnDanger, flex: 1, justifyContent: 'center' }} onClick={() => setDeleteId(viewProgram.id)}>
//                     <Trash2 size={14} /> Delete
//                   </button>
//                   <button
//                     style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}
//                     onClick={() => { setReminderProgram(viewProgram); setViewProgram(null); setReminderChannel('whatsapp'); }}
//                   >
//                     <Bell size={14} /> Send Reminder
//                   </button>
//                 </div>
//               </>
//             );
//           })()}
//         </DialogContent>
//       </Dialog>

//       {/* ══════════════════════════════════════════════════════════════════
//           CREATE PROGRAM DIALOG
//       ══════════════════════════════════════════════════════════════════ */}
//       <Dialog open={createOpen} onOpenChange={v => { setCreateOpen(v); setFormError(''); }}>
//         <DialogContent style={{ ...dialogStyle, width: 'min(92vw, 460px)' }}>
//           <div style={dialogHead}>
//             <h2 style={{ fontSize: 18, fontWeight: 700, color: textPrimary, margin: 0 }}>Create Program</h2>
//           </div>

//           <div style={{ overflowY: 'auto', flex: 1, padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
//             {formError && (
//               <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: isDark ? 'rgba(239,68,68,0.1)' : '#fff1f2', border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : '#fca5a5'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ef4444' }}>
//                 <AlertTriangle size={15} style={{ flexShrink: 0 }} /> {formError}
//               </div>
//             )}
//             <div>
//               <label style={labelStyle}>Program Title *</label>
//               <input placeholder="e.g. Healing Streams Live Service" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
//             </div>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//               <div>
//                 <label style={labelStyle}>Date *</label>
//                 <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ ...inputStyle, colorScheme: isDark ? 'dark' : 'light' }} />
//               </div>
//               <div>
//                 <label style={labelStyle}>Time *</label>
//                 <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} style={{ ...inputStyle, colorScheme: isDark ? 'dark' : 'light' }} />
//               </div>
//             </div>
//             <div>
//               <label style={labelStyle}>Venue</label>
//               <input placeholder="e.g. Church Auditorium, Online" value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} style={inputStyle} />
//             </div>
//             <div>
//               <label style={labelStyle}>Description</label>
//               <textarea placeholder="Describe the program..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={textareaStyle} rows={4} />
//             </div>
//           </div>

//           <div style={{ ...dialogFoot, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//             <button style={btnSecondary} onClick={() => { setCreateOpen(false); setFormError(''); }}>Cancel</button>
//             <button disabled={saving} onClick={handleCreate} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
//               {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
//               Save Program
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ══════════════════════════════════════════════════════════════════
//           DELETE CONFIRM DIALOG
//       ══════════════════════════════════════════════════════════════════ */}
//       <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
//         <AlertDialogContent style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 18, maxWidth: 'min(90vw, 400px)', color: textPrimary }}>
//           <AlertDialogHeader>
//             <AlertDialogTitle style={{ color: textPrimary }}>Delete Program?</AlertDialogTitle>
//             <AlertDialogDescription style={{ color: textSub }}>
//               This action cannot be undone. The program will be permanently removed.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textMuted, borderRadius: 8 }}>Cancel</AlertDialogCancel>
//             <AlertDialogAction style={{ background: '#ef4444', color: '#fff', borderRadius: 8, border: 'none' }} onClick={handleDelete}>
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* ══════════════════════════════════════════════════════════════════
//           SEND REMINDER DIALOG
//       ══════════════════════════════════════════════════════════════════ */}
//       <Dialog open={!!reminderProgram} onOpenChange={v => { if (!v) setReminderProgram(null); }}>
//         <DialogContent style={{ ...dialogStyle, width: 'min(92vw, 520px)', maxHeight: '92vh' }}>
//           <div style={{ ...dialogHead, borderBottom: `1px solid ${dividerBd}` }}>
//             <h2 style={{ fontSize: 17, fontWeight: 700, color: textPrimary, margin: '0 0 12px' }}>Send Reminder</h2>
//             {reminderProgram && (
//               <div style={{ background: rowBg, borderRadius: 12, padding: '10px 14px', border: `1px solid ${dividerBd}` }}>
//                 <p style={{ ...sectionLabel, fontSize: 9, marginBottom: 4 }}>Program</p>
//                 <p style={{ fontSize: 14, fontWeight: 700, color: textPrimary, margin: '0 0 2px' }}>{reminderProgram.title}</p>
//                 <p style={{ fontSize: 11, color: textSub, margin: 0 }}>
//                   {formatDate(reminderProgram.date)} · {formatTime(reminderProgram.time)}
//                   {reminderProgram.venue ? ` · ${reminderProgram.venue}` : ''}
//                 </p>
//               </div>
//             )}
//           </div>

//           {reminderProgram && (
//             <div style={{ overflowY: 'auto', flex: 1, padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

//               {/* Channel selector */}
//               <div>
//                 <p style={{ ...sectionLabel, marginBottom: 10 }}>Choose Channel</p>
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
//                   {(['whatsapp', 'sms', 'email'] as ReminderChannel[]).map(ch => {
//                     const active = reminderChannel === ch;
//                     const cs = channelBg(ch, active);
//                     return (
//                       <button key={ch} onClick={() => setReminderChannel(ch)}
//                         style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', borderRadius: 12, border: `2px solid ${cs.borderColor}`, background: cs.background, color: cs.color, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
//                         {ch === 'whatsapp' && <MessageCircle size={18} />}
//                         {ch === 'sms'      && <Phone size={18} />}
//                         {ch === 'email'    && <Mail size={18} />}
//                         {channelLabel(ch)}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Message preview */}
//               <div>
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
//                   <p style={sectionLabel}>Message Preview</p>
//                   <button
//                     onClick={() => handleCopyBroadcast(reminderProgram)}
//                     style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: copiedBroadcast ? '#22c55e' : textMuted, background: rowBg, border: `1px solid ${dividerBd}`, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
//                   >
//                     {copiedBroadcast ? <CheckCheck size={12} /> : <Copy size={12} />}
//                     {copiedBroadcast ? 'Copied!' : 'Copy'}
//                   </button>
//                 </div>
//                 <pre style={{ background: rowBg, border: `1px solid ${dividerBd}`, borderRadius: 12, padding: '12px 14px', fontSize: 12, color: isDark ? '#d1d5db' : '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontFamily: 'inherit', margin: 0, overflowX: 'auto' }}>
//                   {buildReminderMessage(reminderProgram)}
//                 </pre>
//               </div>

//               {/* Members list */}
//               <div>
//                 <p style={{ ...sectionLabel, marginBottom: 10 }}>Send to Members ({members.length})</p>
//                 {members.length === 0 ? (
//                   <p style={{ fontSize: 12, color: textSub }}>No members found in database.</p>
//                 ) : (
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//                     {members.map((member, i) => {
//                       const link = getReminderLink(member, reminderProgram, reminderChannel);
//                       return (
//                         <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: rowBg, borderRadius: 12, padding: '8px 12px', border: `1px solid ${dividerBd}` }}>
//                           <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
//                           <div style={{ flex: 1, minWidth: 0 }}>
//                             <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</p>
//                             <p style={{ fontSize: 11, color: textSub, margin: 0 }}>{member.phone}</p>
//                           </div>
//                           <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
//                             <button
//                               onClick={() => handleCopyMember(i, member, reminderProgram)}
//                               title="Copy message"
//                               style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: `1px solid ${dividerBd}`, background: cardBg, cursor: 'pointer', color: copiedMember === i ? '#22c55e' : textSub, transition: 'all 0.15s' }}
//                             >
//                               {copiedMember === i ? <CheckCheck size={13} /> : <Copy size={13} />}
//                             </button>
//                             <a
//                               href={link}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               title={`Send via ${channelLabel(reminderChannel)}`}
//                               style={{ height: 32, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, background: channelSendBg(reminderChannel), color: '#fff', fontSize: 11, fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.15s' }}
//                               onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
//                               onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
//                             >
//                               {reminderChannel === 'whatsapp' && <MessageCircle size={12} />}
//                               {reminderChannel === 'sms'      && <Phone size={12} />}
//                               {reminderChannel === 'email'    && <Mail size={12} />}
//                               <span>{channelLabel(reminderChannel)}</span>
//                             </a>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           <div style={{ ...dialogFoot }}>
//             <button style={{ ...btnPrimary, width: '100%', justifyContent: 'center', height: 44 }} onClick={() => setReminderProgram(null)}>
//               Done
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
  Plus, Trash2, Bell, Calendar, Clock, MapPin,
  FileText, ChevronRight, Search, AlertTriangle,
  MessageCircle, Mail, Phone, Copy, CheckCheck, Loader2,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useTheme } from '@/app/components/ThemeProvider';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// ── Supabase ──────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// ── Types ─────────────────────────────────────────────────────────────────────
type Program = {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  created_at: string;
};

type Member = { id: number; name: string; phone: string };
type ReminderChannel = 'whatsapp' | 'sms' | 'email';

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
  }).toUpperCase();
}

function formatMonth(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
}

function daysFromNow(iso: string): string {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(iso + 'T00:00:00');
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'TODAY';
  if (diff === 1) return 'TOMORROW';
  if (diff < 0) return `${Math.abs(diff)} DAYS AGO`;
  return `${diff} DAYS TO GO`;
}

function daysTag(iso: string): 'past' | 'today' | 'upcoming' {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(iso + 'T00:00:00');
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return 'past';
  if (diff === 0) return 'today';
  return 'upcoming';
}

function formatTime(t: string) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) return '234' + digits.slice(1);
  return digits;
}

function buildReminderMessage(program: Program): string {
  return `📢 *PROGRAM REMINDER*\n\n*${program.title}*\n\n📅 Date: ${formatDate(program.date)}\n⏰ Time: ${formatTime(program.time)}${program.venue ? `\n📍 Venue: ${program.venue}` : ''}${program.description ? `\n\n${program.description}` : ''}\n\nPlease make plans to attend. God bless you! 🙏`;
}

// ── Tag accent bar color (always the same, just the indicator) ────────────────
function tagBarColor(tag: string) {
  if (tag === 'today') return '#f59e0b';
  if (tag === 'past') return '#a1a1aa';
  return '#22c55e';
}

function tagBadgeStyle(tag: string, isDark: boolean): React.CSSProperties {
  if (tag === 'today') return { background: isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7', color: isDark ? '#fbbf24' : '#92400e', border: `1px solid ${isDark ? 'rgba(245,158,11,0.3)' : '#fcd34d'}` };
  if (tag === 'past')  return { background: isDark ? 'rgba(161,161,170,0.12)' : '#f4f4f5', color: isDark ? '#a1a1aa' : '#71717a', border: `1px solid ${isDark ? 'rgba(161,161,170,0.2)' : '#d4d4d8'}` };
  return { background: isDark ? 'rgba(34,197,94,0.12)' : '#f0fdf4', color: isDark ? '#4ade80' : '#15803d', border: `1px solid ${isDark ? 'rgba(34,197,94,0.25)' : '#86efac'}` };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProgramPage() {
  const { isDark } = useTheme();

  // ── Theme tokens ────────────────────────────────────────────────────────────
  const pageBg       = isDark ? '#0f1117' : '#f8f9fb';
  const cardBg       = isDark ? '#16181f' : '#ffffff';
  const cardBd       = isDark ? '#1e2028' : '#e5e7eb';
  const cardHoverBd  = isDark ? '#2d2f3a' : '#d1d5db';
  const headBg       = isDark ? '#111318' : '#f9fafb';
  const textPrimary  = isDark ? '#f3f4f6' : '#111827';
  const textMuted    = isDark ? '#6b7280' : '#6b7280';
  const textSub      = isDark ? '#9ca3af' : '#9ca3af';
  const inputBg      = isDark ? '#1a1d27' : '#ffffff';
  const inputBd      = isDark ? '#2a2d3a' : '#e5e7eb';
  const dividerBd    = isDark ? '#1e2028' : '#f0f0f0';
  const rowBg        = isDark ? '#1a1d27' : '#f9fafb';
  const sectionLabel = { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: textMuted };

  const [programs,        setPrograms]        = useState<Program[]>([]);
  const [members,         setMembers]         = useState<Member[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [search,          setSearch]          = useState('');
  const [createOpen,      setCreateOpen]      = useState(false);
  const [viewProgram,     setViewProgram]     = useState<Program | null>(null);
  const [deleteId,        setDeleteId]        = useState<number | null>(null);
  const [reminderProgram, setReminderProgram] = useState<Program | null>(null);
  const [reminderChannel, setReminderChannel] = useState<ReminderChannel>('whatsapp');
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);
  const [copiedMember,    setCopiedMember]    = useState<number | null>(null);
  const [toast,           setToast]           = useState<string | null>(null);
  const [saving,          setSaving]          = useState(false);
  const [form,            setForm]            = useState({ title: '', date: '', time: '', venue: '', description: '' });
  const [formError,       setFormError]       = useState('');

  const fetchPrograms = useCallback(async () => {
    const { data } = await supabase.from('programs').select('*').order('date', { ascending: true });
    if (data) setPrograms(data);
  }, []);

  const fetchMembers = useCallback(async () => {
    const { data } = await supabase.from('members').select('id, name, phone').order('created_at', { ascending: true });
    if (data) setMembers(data);
  }, []);

  useEffect(() => {
    const init = async () => { setLoading(true); await Promise.all([fetchPrograms(), fetchMembers()]); setLoading(false); };
    init();
  }, [fetchPrograms, fetchMembers]);

  useEffect(() => {
    const sub = supabase.channel('programs-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'programs' }, fetchPrograms)
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [fetchPrograms]);

  const filtered = useMemo(() => {
    if (!search.trim()) return programs;
    const q = search.toLowerCase();
    return programs.filter(p => p.title.toLowerCase().includes(q) || (p.venue || '').toLowerCase().includes(q));
  }, [programs, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, Program[]>();
    filtered.forEach(p => {
      const key = formatMonth(p.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return map;
  }, [filtered]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.date || !form.time) { setFormError('Title, date and time are required.'); return; }
    setSaving(true);
    const { error } = await supabase.from('programs').insert([{
      title: form.title.trim().toUpperCase(), date: form.date, time: form.time,
      venue: form.venue.trim() || null, description: form.description.trim() || null,
    }]);
    setSaving(false);
    if (error) { setFormError('Failed to save. Please try again.'); return; }
    setForm({ title: '', date: '', time: '', venue: '', description: '' });
    setFormError(''); setCreateOpen(false);
    showToast('Program created successfully!');
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await supabase.from('programs').delete().eq('id', deleteId);
    if (viewProgram?.id === deleteId) setViewProgram(null);
    setDeleteId(null); showToast('Program deleted.');
  };

  const getReminderLink = (member: Member, program: Program, channel: ReminderChannel): string => {
    const msg = buildReminderMessage(program);
    const phone = normalisePhone(member.phone);
    const encoded = encodeURIComponent(msg);
    if (channel === 'whatsapp') return `https://wa.me/${phone}?text=${encoded}`;
    if (channel === 'sms') return `sms:+${phone}?body=${encoded}`;
    return `mailto:?to=&subject=${encodeURIComponent(program.title)}&body=${encoded}`;
  };

  const handleCopyBroadcast = async (program: Program) => {
    await navigator.clipboard.writeText(buildReminderMessage(program));
    setCopiedBroadcast(true); setTimeout(() => setCopiedBroadcast(false), 2000);
  };

  const handleCopyMember = async (idx: number, member: Member, program: Program) => {
    await navigator.clipboard.writeText(buildReminderMessage(program));
    setCopiedMember(idx); setTimeout(() => setCopiedMember(null), 1800);
  };

  const channelLabel = (ch: ReminderChannel) => ch === 'whatsapp' ? 'WhatsApp' : ch === 'sms' ? 'SMS' : 'Email';
  const channelBg    = (ch: ReminderChannel, active: boolean) => {
    if (!active) return { background: cardBg, borderColor: cardBd, color: textMuted };
    if (ch === 'whatsapp') return { background: isDark ? 'rgba(34,197,94,0.12)' : '#f0fdf4', borderColor: '#22c55e', color: isDark ? '#4ade80' : '#15803d' };
    if (ch === 'sms')      return { background: isDark ? 'rgba(59,130,246,0.12)' : '#eff6ff', borderColor: '#3b82f6', color: isDark ? '#60a5fa' : '#1d4ed8' };
    return { background: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', borderColor: '#6366f1', color: isDark ? '#818cf8' : '#4338ca' };
  };
  const channelSendBg = (ch: ReminderChannel) => {
    if (ch === 'whatsapp') return '#16a34a';
    if (ch === 'sms')      return '#2563eb';
    return '#4f46e5';
  };

  // ── Inline input/textarea style ──────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    height: 44, padding: '0 12px', borderRadius: 8, border: `1.5px solid ${inputBd}`,
    background: inputBg, color: textPrimary, fontSize: 14, fontFamily: 'inherit',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  };
  const textareaStyle: React.CSSProperties = {
    padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${inputBd}`,
    background: inputBg, color: textPrimary, fontSize: 14, fontFamily: 'inherit',
    outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: 96,
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: textSub, letterSpacing: '0.04em', display: 'block', marginBottom: 6 };
  const btnPrimary: React.CSSProperties = { height: 42, padding: '0 20px', borderRadius: 8, border: 'none', background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#ffffff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 };
  const btnSecondary: React.CSSProperties = { height: 42, padding: '0 16px', borderRadius: 8, border: `1.5px solid ${cardBd}`, background: 'transparent', color: textMuted, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' };
  const btnDanger: React.CSSProperties = { height: 42, padding: '0 16px', borderRadius: 8, border: `1.5px solid ${isDark ? 'rgba(239,68,68,0.3)' : '#fca5a5'}`, background: isDark ? 'rgba(239,68,68,0.08)' : '#fff1f2', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 };

  // ── Dialog shared wrapper style ────────────────────────────────────────────
  const dialogStyle: React.CSSProperties = {
    background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 20,
    padding: 0, display: 'flex', flexDirection: 'column', color: textPrimary,
    maxHeight: '90vh',
  };
  const dialogHead: React.CSSProperties = { padding: '20px 22px 16px', borderBottom: `1px solid ${dividerBd}`, flexShrink: 0 };
  const dialogFoot: React.CSSProperties = { padding: '14px 22px 18px', borderTop: `1px solid ${dividerBd}`, flexShrink: 0 };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
      <Loader2 style={{ width: 32, height: 32, color: textSub, animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <div suppressHydrationWarning style={{ background: pageBg, minHeight: '100vh', padding: '20px 16px 80px', boxSizing: 'border-box', transition: 'background 0.3s' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#ffffff', padding: '10px 20px', borderRadius: 14, fontSize: 13, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: textPrimary, letterSpacing: '-0.3px', margin: 0 }}>PROGRAM</h1>
          <button onClick={() => setCreateOpen(true)} style={{ ...btnPrimary, height: 44, padding: '0 20px', fontSize: 13 }}>
            <Plus size={15} /> CREATE PROGRAM
          </button>
        </div>

        {/* ── Search ── */}
        <div style={{ position: 'relative', maxWidth: 340, marginBottom: 24 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: textSub, pointerEvents: 'none' }} />
          <input
            placeholder="Search programs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 36, height: 44 }}
          />
        </div>

        {/* ── Program Groups ── */}
        {grouped.size === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: textSub }}>
            <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>{search ? 'No programs match your search.' : 'No programs yet. Create one!'}</p>
          </div>
        ) : (
          Array.from(grouped.entries()).map(([month, progs]) => (
            <div key={month} style={{ marginBottom: 32 }}>
              <h2 style={{ ...sectionLabel, marginBottom: 12 }}>MONTH: {month}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                {progs.map(prog => {
                  const tag = daysTag(prog.date);
                  return (
                    <div
                      key={prog.id}
                      onClick={() => setViewProgram(prog)}
                      style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.18s', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = cardHoverBd; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = cardBd; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'; }}
                    >
                      {/* accent bar */}
                      <div style={{ height: 4, background: tagBarColor(tag) }} />
                      <div style={{ padding: '14px 16px' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: textSub, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                          {formatDate(prog.date)}
                        </p>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: textPrimary, lineHeight: 1.3, marginBottom: 10, letterSpacing: '-0.2px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {prog.title}
                        </h3>
                        {prog.venue && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: textSub, fontSize: 12, marginBottom: 10 }}>
                            <MapPin size={11} style={{ flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prog.venue}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, ...tagBadgeStyle(tag, isDark) }}>
                            {daysFromNow(prog.date)}
                          </span>
                          <ChevronRight size={14} color={textSub} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          VIEW PROGRAM DIALOG
      ══════════════════════════════════════════════════════════════════ */}
      <Dialog open={!!viewProgram} onOpenChange={() => setViewProgram(null)}>
        <DialogContent style={{ ...dialogStyle, width: 'min(92vw, 500px)' }}>
          <DialogTitle style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
            {viewProgram?.title ?? 'View Program'}
          </DialogTitle>
          {viewProgram && (() => {
            const tag = daysTag(viewProgram.date);
            return (
              <>
                <div style={{ height: 4, background: tagBarColor(tag), borderRadius: '20px 20px 0 0', flexShrink: 0 }} />
                <div style={dialogHead}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, ...tagBadgeStyle(tag, isDark), display: 'inline-block', marginBottom: 10 }}>
                    {daysFromNow(viewProgram.date)}
                  </span>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: textPrimary, margin: 0, lineHeight: 1.2 }}>{viewProgram.title}</h2>
                </div>

                <div style={{ overflowY: 'auto', flex: 1, padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { icon: <Calendar size={15} color={textSub} />, label: 'Date', value: formatDate(viewProgram.date) },
                    { icon: <Clock size={15} color={textSub} />, label: 'Time', value: formatTime(viewProgram.time) },
                    ...(viewProgram.venue ? [{ icon: <MapPin size={15} color={textSub} />, label: 'Venue', value: viewProgram.venue }] : []),
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: rowBg, borderRadius: 12, padding: '10px 14px', border: `1px solid ${dividerBd}` }}>
                      <span style={{ flexShrink: 0 }}>{row.icon}</span>
                      <div>
                        <p style={{ ...sectionLabel, fontSize: 9, margin: '0 0 2px' }}>{row.label}</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0 }}>{row.value}</p>
                      </div>
                    </div>
                  ))}
                  {viewProgram.description && (
                    <div style={{ paddingTop: 4 }}>
                      <p style={{ ...sectionLabel, fontSize: 9, marginBottom: 6 }}>Description</p>
                      <p style={{ fontSize: 13, color: isDark ? '#d1d5db' : '#374151', lineHeight: 1.6, margin: 0 }}>{viewProgram.description}</p>
                    </div>
                  )}
                </div>

                <div style={{ ...dialogFoot, display: 'flex', gap: 10 }}>
                  <button style={{ ...btnDanger, flex: 1, justifyContent: 'center' }} onClick={() => setDeleteId(viewProgram.id)}>
                    <Trash2 size={14} /> Delete
                  </button>
                  <button
                    style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}
                    onClick={() => { setReminderProgram(viewProgram); setViewProgram(null); setReminderChannel('whatsapp'); }}
                  >
                    <Bell size={14} /> Send Reminder
                  </button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════
          CREATE PROGRAM DIALOG
      ══════════════════════════════════════════════════════════════════ */}
      <Dialog open={createOpen} onOpenChange={v => { setCreateOpen(v); setFormError(''); }}>
        <DialogContent style={{ ...dialogStyle, width: 'min(92vw, 460px)' }}>
          <div style={dialogHead}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: textPrimary, margin: 0 }}>Create Program</h2>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {formError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: isDark ? 'rgba(239,68,68,0.1)' : '#fff1f2', border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : '#fca5a5'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ef4444' }}>
                <AlertTriangle size={15} style={{ flexShrink: 0 }} /> {formError}
              </div>
            )}
            <div>
              <label style={labelStyle}>Program Title *</label>
              <input placeholder="e.g. Healing Streams Live Service" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Date *</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ ...inputStyle, colorScheme: isDark ? 'dark' : 'light' }} />
              </div>
              <div>
                <label style={labelStyle}>Time *</label>
                <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} style={{ ...inputStyle, colorScheme: isDark ? 'dark' : 'light' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Venue</label>
              <input placeholder="e.g. Church Auditorium, Online" value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea placeholder="Describe the program..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={textareaStyle} rows={4} />
            </div>
          </div>

          <div style={{ ...dialogFoot, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button style={btnSecondary} onClick={() => { setCreateOpen(false); setFormError(''); }}>Cancel</button>
            <button disabled={saving} onClick={handleCreate} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
              {saving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              Save Program
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════
          DELETE CONFIRM DIALOG
      ══════════════════════════════════════════════════════════════════ */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 18, maxWidth: 'min(90vw, 400px)', color: textPrimary }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: textPrimary }}>Delete Program?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: textSub }}>
              This action cannot be undone. The program will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textMuted, borderRadius: 8 }}>Cancel</AlertDialogCancel>
            <AlertDialogAction style={{ background: '#ef4444', color: '#fff', borderRadius: 8, border: 'none' }} onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ══════════════════════════════════════════════════════════════════
          SEND REMINDER DIALOG
      ══════════════════════════════════════════════════════════════════ */}
      <Dialog open={!!reminderProgram} onOpenChange={v => { if (!v) setReminderProgram(null); }}>
        <DialogContent style={{ ...dialogStyle, width: 'min(92vw, 520px)', maxHeight: '92vh' }}>
          <DialogTitle style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
            Send Reminder – {reminderProgram?.title ?? ''}
          </DialogTitle>
          <div style={{ ...dialogHead, borderBottom: `1px solid ${dividerBd}` }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: textPrimary, margin: '0 0 12px' }}>Send Reminder</h2>
            {reminderProgram && (
              <div style={{ background: rowBg, borderRadius: 12, padding: '10px 14px', border: `1px solid ${dividerBd}` }}>
                <p style={{ ...sectionLabel, fontSize: 9, marginBottom: 4 }}>Program</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: textPrimary, margin: '0 0 2px' }}>{reminderProgram.title}</p>
                <p style={{ fontSize: 11, color: textSub, margin: 0 }}>
                  {formatDate(reminderProgram.date)} · {formatTime(reminderProgram.time)}
                  {reminderProgram.venue ? ` · ${reminderProgram.venue}` : ''}
                </p>
              </div>
            )}
          </div>

          {reminderProgram && (
            <div style={{ overflowY: 'auto', flex: 1, padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Channel selector */}
              <div>
                <p style={{ ...sectionLabel, marginBottom: 10 }}>Choose Channel</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {(['whatsapp', 'sms', 'email'] as ReminderChannel[]).map(ch => {
                    const active = reminderChannel === ch;
                    const cs = channelBg(ch, active);
                    return (
                      <button key={ch} onClick={() => setReminderChannel(ch)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0', borderRadius: 12, border: `2px solid ${cs.borderColor}`, background: cs.background, color: cs.color, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                        {ch === 'whatsapp' && <MessageCircle size={18} />}
                        {ch === 'sms'      && <Phone size={18} />}
                        {ch === 'email'    && <Mail size={18} />}
                        {channelLabel(ch)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message preview */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={sectionLabel}>Message Preview</p>
                  <button
                    onClick={() => handleCopyBroadcast(reminderProgram)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: copiedBroadcast ? '#22c55e' : textMuted, background: rowBg, border: `1px solid ${dividerBd}`, borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                  >
                    {copiedBroadcast ? <CheckCheck size={12} /> : <Copy size={12} />}
                    {copiedBroadcast ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre style={{ background: rowBg, border: `1px solid ${dividerBd}`, borderRadius: 12, padding: '12px 14px', fontSize: 12, color: isDark ? '#d1d5db' : '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontFamily: 'inherit', margin: 0, overflowX: 'auto' }}>
                  {buildReminderMessage(reminderProgram)}
                </pre>
              </div>

              {/* Members list */}
              <div>
                <p style={{ ...sectionLabel, marginBottom: 10 }}>Send to Members ({members.length})</p>
                {members.length === 0 ? (
                  <p style={{ fontSize: 12, color: textSub }}>No members found in database.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {members.map((member, i) => {
                      const link = getReminderLink(member, reminderProgram, reminderChannel);
                      return (
                        <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: rowBg, borderRadius: 12, padding: '8px 12px', border: `1px solid ${dividerBd}` }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</p>
                            <p style={{ fontSize: 11, color: textSub, margin: 0 }}>{member.phone}</p>
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            <button
                              onClick={() => handleCopyMember(i, member, reminderProgram)}
                              title="Copy message"
                              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: `1px solid ${dividerBd}`, background: cardBg, cursor: 'pointer', color: copiedMember === i ? '#22c55e' : textSub, transition: 'all 0.15s' }}
                            >
                              {copiedMember === i ? <CheckCheck size={13} /> : <Copy size={13} />}
                            </button>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Send via ${channelLabel(reminderChannel)}`}
                              style={{ height: 32, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, background: channelSendBg(reminderChannel), color: '#fff', fontSize: 11, fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.15s' }}
                              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                              {reminderChannel === 'whatsapp' && <MessageCircle size={12} />}
                              {reminderChannel === 'sms'      && <Phone size={12} />}
                              {reminderChannel === 'email'    && <Mail size={12} />}
                              <span>{channelLabel(reminderChannel)}</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ ...dialogFoot }}>
            <button style={{ ...btnPrimary, width: '100%', justifyContent: 'center', height: 44 }} onClick={() => setReminderProgram(null)}>
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}