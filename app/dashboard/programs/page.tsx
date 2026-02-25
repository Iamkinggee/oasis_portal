// 'use client';

// import { useState, useMemo } from 'react';
// import {
//   Plus, Trash2, Bell, X, Calendar, Clock, MapPin,
//   FileText, ChevronRight, Search, AlertTriangle
// } from 'lucide-react';
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

// // ── Types ─────────────────────────────────────────────────────────────────────
// type Program = {
//   id: number;
//   title: string;
//   date: string;       // YYYY-MM-DD
//   time: string;       // HH:MM
//   venue: string;
//   description: string;
//   createdAt: string;
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────
// function formatDate(iso: string) {
//   if (!iso) return '';
//   const d = new Date(iso + 'T00:00:00');
//   return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
// }

// function formatMonth(iso: string) {
//   if (!iso) return '';
//   const d = new Date(iso + 'T00:00:00');
//   return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
// }

// function daysFromNow(iso: string): string {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const target = new Date(iso + 'T00:00:00');
//   const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
//   if (diff === 0) return 'TODAY';
//   if (diff === 1) return 'TOMORROW';
//   if (diff < 0) return `${Math.abs(diff)} DAYS AGO`;
//   return `${diff} DAYS TO GO`;
// }

// function daysTag(iso: string) {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const target = new Date(iso + 'T00:00:00');
//   const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
//   if (diff < 0) return 'past';
//   if (diff === 0) return 'today';
//   return 'upcoming';
// }

// function formatTime(t: string) {
//   if (!t) return '';
//   const [h, m] = t.split(':').map(Number);
//   const ampm = h >= 12 ? 'PM' : 'AM';
//   const hour = h % 12 || 12;
//   return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
// }

// // ── Seed Data ─────────────────────────────────────────────────────────────────
// const TODAY = new Date();
// const addDays = (n: number) => {
//   const d = new Date(TODAY);
//   d.setDate(d.getDate() + n);
//   return d.toISOString().split('T')[0];
// };

// const seedPrograms: Program[] = [
//   {
//     id: 1,
//     title: 'HEALING STREAMS LIVE HEALING SERVICE',
//     date: addDays(3),
//     time: '09:00',
//     venue: 'Church Auditorium',
//     description: 'A powerful healing service where testimonies of healing will be shared and prayers offered for all who attend.',
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: 2,
//     title: 'REACHOUT WORLD DAY',
//     date: addDays(3),
//     time: '10:00',
//     venue: 'City Park',
//     description: 'Annual outreach program to reach the community with the gospel. All members are expected to participate.',
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: 3,
//     title: 'HEALING STREAMS LIVE HEALING SERVICE',
//     date: addDays(3),
//     time: '14:00',
//     venue: 'Online / Zoom',
//     description: 'Evening session of the Healing Streams service, broadcast live online.',
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: 4,
//     title: 'HEALING STREAMS LIVE HEALING SERVICE',
//     date: addDays(3),
//     time: '17:00',
//     venue: 'Fellowship Hall',
//     description: 'Final session of the Healing Streams program for the month.',
//     createdAt: new Date().toISOString(),
//   },
// ];

// const ALL_MEMBERS = [
//   'Esteemed Bro. John Ezra',
//   'Esteemed Bro. James Paul',
//   'Esteemed Bro. Samuel Oke',
//   'Esteemed Bro. David Nwosu',
//   'Esteemed Bro. Peter Adeyemi',
//   'Esteemed Bro. Philip Chukwu',
//   'Esteemed Bro. Andrew Bello',
//   'Sis. Mary Grace',
// ];

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function ProgramPage() {
//   const [programs, setPrograms] = useState<Program[]>(seedPrograms);
//   const [search, setSearch] = useState('');

//   // Dialogs
//   const [createOpen, setCreateOpen] = useState(false);
//   const [viewProgram, setViewProgram] = useState<Program | null>(null);
//   const [deleteId, setDeleteId] = useState<number | null>(null);
//   const [reminderProgram, setReminderProgram] = useState<Program | null>(null);
//   const [reminderSent, setReminderSent] = useState(false);
//   const [toast, setToast] = useState<string | null>(null);

//   // New program form
//   const [form, setForm] = useState({
//     title: '', date: '', time: '', venue: '', description: '',
//   });
//   const [formError, setFormError] = useState('');

//   // ── Derived ───────────────────────────────────────────────────────────────
//   const filtered = useMemo(() => {
//     if (!search.trim()) return programs;
//     const q = search.toLowerCase();
//     return programs.filter(p =>
//       p.title.toLowerCase().includes(q) ||
//       p.venue.toLowerCase().includes(q)
//     );
//   }, [programs, search]);

//   // Group by month
//   const grouped = useMemo(() => {
//     const map = new Map<string, Program[]>();
//     filtered.forEach(p => {
//       const key = formatMonth(p.date);
//       if (!map.has(key)) map.set(key, []);
//       map.get(key)!.push(p);
//     });
//     return map;
//   }, [filtered]);

//   // ── Handlers ──────────────────────────────────────────────────────────────
//   const showToast = (msg: string) => {
//     setToast(msg);
//     setTimeout(() => setToast(null), 3000);
//   };

//   const handleCreate = () => {
//     if (!form.title.trim() || !form.date || !form.time) {
//       setFormError('Title, date and time are required.');
//       return;
//     }
//     const nextId = Math.max(...programs.map(p => p.id), 0) + 1;
//     setPrograms(prev => [...prev, {
//       id: nextId,
//       title: form.title.trim().toUpperCase(),
//       date: form.date,
//       time: form.time,
//       venue: form.venue.trim(),
//       description: form.description.trim(),
//       createdAt: new Date().toISOString(),
//     }]);
//     setForm({ title: '', date: '', time: '', venue: '', description: '' });
//     setFormError('');
//     setCreateOpen(false);
//     showToast('Program created successfully!');
//   };

//   const handleDelete = () => {
//     if (deleteId === null) return;
//     setPrograms(prev => prev.filter(p => p.id !== deleteId));
//     if (viewProgram?.id === deleteId) setViewProgram(null);
//     setDeleteId(null);
//     showToast('Program deleted.');
//   };

//   const handleSendReminder = () => {
//     setReminderSent(true);
//     setTimeout(() => {
//       setReminderSent(false);
//       setReminderProgram(null);
//       showToast(`Reminder sent to ${ALL_MEMBERS.length} members!`);
//     }, 1800);
//   };

//   const tagColor = (tag: string) => {
//     if (tag === 'today') return 'bg-amber-100 text-amber-700 border-amber-300';
//     if (tag === 'past') return 'bg-zinc-100 text-zinc-500 border-zinc-300';
//     return 'bg-green-100 text-green-700 border-green-300';
//   };

//   return (
//     <div className="space-y-8 pb-20 relative">

//       {/* ── Toast ──────────────────────────────────────────────────────────── */}
//       {toast && (
//         <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-semibold">
//           {toast}
//         </div>
//       )}

//       {/* ── Header ─────────────────────────────────────────────────────────── */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <h1 className="text-2xl font-bold text-zinc-800 tracking-tight">PROGRAM</h1>
//         <Button
//           onClick={() => setCreateOpen(true)}
//           className="h-11 px-6 gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl"
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
//           <p>No programs found.</p>
//         </div>
//       ) : (
//         Array.from(grouped.entries()).map(([month, progs]) => (
//           <div key={month} className="space-y-4">
//             <h2 className="text-sm font-bold text-zinc-500 tracking-widest">
//               MONTH: {month}
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {progs.map(prog => {
//                 const tag = daysTag(prog.date);
//                 return (
//                   <div
//                     key={prog.id}
//                     onClick={() => setViewProgram(prog)}
//                     className="group relative bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
//                   >
//                     {/* Top accent bar */}
//                     <div className={`h-1 w-full ${
//                       tag === 'today' ? 'bg-amber-400' :
//                       tag === 'past' ? 'bg-zinc-300' : 'bg-green-500'
//                     }`} />

//                     <div className="p-5">
//                       <p className="text-[11px] font-semibold text-zinc-400 tracking-widest mb-2">
//                         {formatDate(prog.date)}
//                       </p>
//                       <h3 className="font-black text-zinc-800 text-[15px] leading-tight mb-3 line-clamp-3 tracking-tight">
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

//       {/* ══════════════════════════════════════════════════════════════════════
//           ── VIEW PROGRAM DIALOG ──────────────────────────────────────────────
//       ══════════════════════════════════════════════════════════════════════ */}
//       <Dialog open={!!viewProgram} onOpenChange={() => setViewProgram(null)}>
//         <DialogContent className="sm:max-w-lg rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col max-h-[90vh]">
//           {viewProgram && (
//             <>
//               {/* Accent top */}
//               <div className={`h-2 w-full rounded-t-2xl shrink-0 ${
//                 daysTag(viewProgram.date) === 'today' ? 'bg-amber-400' :
//                 daysTag(viewProgram.date) === 'past' ? 'bg-zinc-300' : 'bg-green-500'
//               }`} />

//               <DialogHeader className="px-7 pt-5 pb-4 shrink-0">
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="flex-1">
//                     <Badge variant="outline" className={`text-[10px] font-bold mb-3 ${tagColor(daysTag(viewProgram.date))}`}>
//                       {daysFromNow(viewProgram.date)}
//                     </Badge>
//                     <DialogTitle className="text-xl font-black text-zinc-800 leading-tight tracking-tight">
//                       {viewProgram.title}
//                     </DialogTitle>
//                   </div>
//                 </div>
//               </DialogHeader>

//               <div className="overflow-y-auto flex-1 px-7 pb-2 space-y-5">
//                 {/* Meta */}
//                 <div className="grid grid-cols-1 gap-3">
//                   <div className="flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-3">
//                     <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
//                     <div>
//                       <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">Date</p>
//                       <p className="text-sm font-semibold text-zinc-800">{formatDate(viewProgram.date)}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-3">
//                     <Clock className="h-4 w-4 text-zinc-400 shrink-0" />
//                     <div>
//                       <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">Time</p>
//                       <p className="text-sm font-semibold text-zinc-800">{formatTime(viewProgram.time)}</p>
//                     </div>
//                   </div>
//                   {viewProgram.venue && (
//                     <div className="flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-3">
//                       <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
//                       <div>
//                         <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">Venue</p>
//                         <p className="text-sm font-semibold text-zinc-800">{viewProgram.venue}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Description */}
//                 {viewProgram.description && (
//                   <div>
//                     <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2">Description</p>
//                     <p className="text-sm text-zinc-700 leading-relaxed">{viewProgram.description}</p>
//                   </div>
//                 )}
//               </div>

//               {/* Actions */}
//               <div className="px-7 py-5 border-t border-zinc-100 shrink-0 flex gap-3">
//                 <Button
//                   variant="outline"
//                   className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
//                   onClick={() => { setDeleteId(viewProgram.id); }}
//                 >
//                   <Trash2 className="h-4 w-4" /> Delete
//                 </Button>
//                 <Button
//                   className="flex-1 gap-2 bg-zinc-900 hover:bg-zinc-800 text-white"
//                   onClick={() => { setReminderProgram(viewProgram); setViewProgram(null); }}
//                 >
//                   <Bell className="h-4 w-4" /> Send Reminder
//                 </Button>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* ══════════════════════════════════════════════════════════════════════
//           ── CREATE PROGRAM DIALOG ────────────────────────────────────────────
//       ══════════════════════════════════════════════════════════════════════ */}
//       <Dialog open={createOpen} onOpenChange={v => { setCreateOpen(v); setFormError(''); }}>
//         <DialogContent className="sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col max-h-[90vh]">
//           <DialogHeader className="px-7 pt-7 pb-4 shrink-0">
//             <DialogTitle className="text-2xl font-bold text-zinc-800">Create Program</DialogTitle>
//           </DialogHeader>

//           <div className="overflow-y-auto flex-1 px-7 pb-2 space-y-5">
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
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label className="font-medium text-zinc-700">Date *</Label>
//                 <Input
//                   type="date"
//                   value={form.date}
//                   onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
//                   className="h-11"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className="font-medium text-zinc-700">Time *</Label>
//                 <Input
//                   type="time"
//                   value={form.time}
//                   onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
//                   className="h-11"
//                 />
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

//           <DialogFooter className="px-7 py-5 border-t border-zinc-100 shrink-0">
//             <Button variant="outline" onClick={() => { setCreateOpen(false); setFormError(''); }}>Cancel</Button>
//             <Button onClick={handleCreate} className="bg-zinc-900 hover:bg-zinc-800 text-white">
//               Save Program
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ══════════════════════════════════════════════════════════════════════
//           ── DELETE CONFIRM DIALOG ────────────────────────────────────────────
//       ══════════════════════════════════════════════════════════════════════ */}
//       <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
//         <AlertDialogContent className="max-w-md rounded-2xl bg-white shadow-2xl">
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

//       {/* ══════════════════════════════════════════════════════════════════════
//           ── SEND REMINDER DIALOG ─────────────────────────────────────────────
//       ══════════════════════════════════════════════════════════════════════ */}
//       <Dialog open={!!reminderProgram} onOpenChange={v => { if (!v) setReminderProgram(null); }}>
//         <DialogContent className="sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col">
//           <DialogHeader className="px-7 pt-7 pb-4 shrink-0">
//             <DialogTitle className="text-xl font-bold text-zinc-800">Send Reminder</DialogTitle>
//           </DialogHeader>

//           <div className="px-7 pb-4 space-y-4">
//             {/* Program summary */}
//             <div className="bg-zinc-50 rounded-xl px-4 py-4 space-y-1">
//               <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">Program</p>
//               <p className="font-bold text-zinc-800">{reminderProgram?.title}</p>
//               <p className="text-sm text-zinc-500">
//                 {reminderProgram ? formatDate(reminderProgram.date) : ''} · {reminderProgram ? formatTime(reminderProgram.time) : ''}
//               </p>
//               {reminderProgram?.venue && (
//                 <p className="text-sm text-zinc-500 flex items-center gap-1">
//                   <MapPin className="h-3 w-3" /> {reminderProgram.venue}
//                 </p>
//               )}
//             </div>

//             {/* Recipients */}
//             <div>
//               <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest mb-2">
//                 Recipients ({ALL_MEMBERS.length} members)
//               </p>
//               <div className="space-y-1 max-h-48 overflow-y-auto">
//                 {ALL_MEMBERS.map((name, i) => (
//                   <div key={i} className="flex items-center gap-2 py-1.5 px-3 bg-zinc-50 rounded-lg text-sm text-zinc-700">
//                     <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
//                     {name}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <DialogFooter className="px-7 py-5 border-t border-zinc-100 shrink-0">
//             <Button variant="outline" onClick={() => setReminderProgram(null)}>Cancel</Button>
//             <Button
//               onClick={handleSendReminder}
//               disabled={reminderSent}
//               className="bg-zinc-900 hover:bg-zinc-800 text-white gap-2 min-w-[160px]"
//             >
//               {reminderSent ? (
//                 <>
//                   <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Sending...
//                 </>
//               ) : (
//                 <>
//                   <Bell className="h-4 w-4" /> Send to All Members
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
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
  MessageCircle, Mail, Phone, Copy, CheckCheck, Loader2, X,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

type Member = {
  id: number;
  name: string;
  phone: string;
};

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

// Normalise phone: strip non-digits, ensure leading +
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  // Nigerian numbers: if starts with 0, replace with 234
  if (digits.startsWith('0')) return '234' + digits.slice(1);
  return digits;
}

function buildReminderMessage(program: Program): string {
  return `📢 *PROGRAM REMINDER*\n\n*${program.title}*\n\n📅 Date: ${formatDate(program.date)}\n⏰ Time: ${formatTime(program.time)}${program.venue ? `\n📍 Venue: ${program.venue}` : ''}${program.description ? `\n\n${program.description}` : ''}\n\nPlease make plans to attend. God bless you! 🙏`;
}

function tagColor(tag: string) {
  if (tag === 'today') return 'bg-amber-100 text-amber-700 border-amber-300';
  if (tag === 'past') return 'bg-zinc-100 text-zinc-500 border-zinc-300';
  return 'bg-green-100 text-green-700 border-green-300';
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [viewProgram, setViewProgram] = useState<Program | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [reminderProgram, setReminderProgram] = useState<Program | null>(null);
  const [reminderChannel, setReminderChannel] = useState<ReminderChannel>('whatsapp');
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);
  const [copiedMember, setCopiedMember] = useState<number | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [form, setForm] = useState({ title: '', date: '', time: '', venue: '', description: '' });
  const [formError, setFormError] = useState('');

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchPrograms = useCallback(async () => {
    const { data } = await supabase
      .from('programs')
      .select('*')
      .order('date', { ascending: true });
    if (data) setPrograms(data);
  }, []);

  const fetchMembers = useCallback(async () => {
    const { data } = await supabase
      .from('members')
      .select('id, name, phone')
      .order('created_at', { ascending: true });
    if (data) setMembers(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchPrograms(), fetchMembers()]);
      setLoading(false);
    };
    init();
  }, [fetchPrograms, fetchMembers]);

  // ── Realtime ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const sub = supabase
      .channel('programs-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'programs' }, fetchPrograms)
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [fetchPrograms]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return programs;
    const q = search.toLowerCase();
    return programs.filter(p =>
      p.title.toLowerCase().includes(q) || (p.venue || '').toLowerCase().includes(q)
    );
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

  // ── Handlers ─────────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.date || !form.time) {
      setFormError('Title, date and time are required.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('programs').insert([{
      title: form.title.trim().toUpperCase(),
      date: form.date,
      time: form.time,
      venue: form.venue.trim() || null,
      description: form.description.trim() || null,
    }]);
    setSaving(false);
    if (error) { setFormError('Failed to save. Please try again.'); return; }
    setForm({ title: '', date: '', time: '', venue: '', description: '' });
    setFormError('');
    setCreateOpen(false);
    showToast('Program created successfully!');
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await supabase.from('programs').delete().eq('id', deleteId);
    if (viewProgram?.id === deleteId) setViewProgram(null);
    setDeleteId(null);
    showToast('Program deleted.');
  };

  // ── Reminder actions ──────────────────────────────────────────────────────
  const getReminderLink = (member: Member, program: Program, channel: ReminderChannel): string => {
    const msg = buildReminderMessage(program);
    const phone = normalisePhone(member.phone);
    const encoded = encodeURIComponent(msg);
    if (channel === 'whatsapp') return `https://wa.me/${phone}?text=${encoded}`;
    if (channel === 'sms') return `sms:+${phone}?body=${encoded}`;
    if (channel === 'email') return `mailto:?to=&subject=${encodeURIComponent(program.title)}&body=${encoded}`;
    return '#';
  };

  const handleCopyBroadcast = async (program: Program) => {
    await navigator.clipboard.writeText(buildReminderMessage(program));
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2000);
  };

  const handleCopyMember = async (idx: number, member: Member, program: Program) => {
    await navigator.clipboard.writeText(buildReminderMessage(program));
    setCopiedMember(idx);
    setTimeout(() => setCopiedMember(null), 1800);
  };

  const channelIcon = (ch: ReminderChannel) => {
    if (ch === 'whatsapp') return <MessageCircle className="h-4 w-4" />;
    if (ch === 'sms') return <Phone className="h-4 w-4" />;
    return <Mail className="h-4 w-4" />;
  };

  const channelColor = (ch: ReminderChannel) => {
    if (ch === 'whatsapp') return 'bg-green-600 hover:bg-green-500';
    if (ch === 'sms') return 'bg-blue-600 hover:bg-blue-500';
    return 'bg-indigo-600 hover:bg-indigo-500';
  };

  const channelLabel = (ch: ReminderChannel) => {
    if (ch === 'whatsapp') return 'WhatsApp';
    if (ch === 'sms') return 'SMS';
    return 'Email';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 relative px-2 sm:px-0">

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight">PROGRAM</h1>
        <Button
          onClick={() => setCreateOpen(true)}
          className="h-10 sm:h-11 px-4 sm:px-6 gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> CREATE PROGRAM
        </Button>
      </div>

      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Search programs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 h-11 rounded-xl"
        />
      </div>

      {/* ── Program Groups ──────────────────────────────────────────────────── */}
      {grouped.size === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{search ? 'No programs match your search.' : 'No programs yet. Create one!'}</p>
        </div>
      ) : (
        Array.from(grouped.entries()).map(([month, progs]) => (
          <div key={month} className="space-y-3 sm:space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-zinc-500 tracking-widest">
              MONTH: {month}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {progs.map(prog => {
                const tag = daysTag(prog.date);
                return (
                  <div
                    key={prog.id}
                    onClick={() => setViewProgram(prog)}
                    className="group relative bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
                  >
                    <div className={`h-1 w-full ${
                      tag === 'today' ? 'bg-amber-400' :
                      tag === 'past' ? 'bg-zinc-300' : 'bg-green-500'
                    }`} />
                    <div className="p-4 sm:p-5">
                      <p className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 tracking-widest mb-2">
                        {formatDate(prog.date)}
                      </p>
                      <h3 className="font-black text-zinc-800 text-sm sm:text-[15px] leading-tight mb-3 line-clamp-3 tracking-tight">
                        {prog.title}
                      </h3>
                      {prog.venue && (
                        <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{prog.venue}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 ${tagColor(tag)}`}>
                          {daysFromNow(prog.date)}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* ════════════════════════════════════════════════════════════════════
          VIEW PROGRAM DIALOG
      ════════════════════════════════════════════════════════════════════ */}
      <Dialog open={!!viewProgram} onOpenChange={() => setViewProgram(null)}>
        <DialogContent className="w-[92vw] sm:max-w-lg rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col max-h-[90vh]">
          {viewProgram && (
            <>
              <div className={`h-2 w-full rounded-t-2xl shrink-0 ${
                daysTag(viewProgram.date) === 'today' ? 'bg-amber-400' :
                daysTag(viewProgram.date) === 'past' ? 'bg-zinc-300' : 'bg-green-500'
              }`} />
              <DialogHeader className="px-5 sm:px-7 pt-4 sm:pt-5 pb-3 sm:pb-4 shrink-0">
                <Badge variant="outline" className={`text-[10px] font-bold mb-2 w-fit ${tagColor(daysTag(viewProgram.date))}`}>
                  {daysFromNow(viewProgram.date)}
                </Badge>
                <DialogTitle className="text-lg sm:text-xl font-black text-zinc-800 leading-tight tracking-tight">
                  {viewProgram.title}
                </DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto flex-1 px-5 sm:px-7 pb-2 space-y-4">
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { icon: <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />, label: 'Date', value: formatDate(viewProgram.date) },
                    { icon: <Clock className="h-4 w-4 text-zinc-400 shrink-0" />, label: 'Time', value: formatTime(viewProgram.time) },
                    ...(viewProgram.venue ? [{ icon: <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />, label: 'Venue', value: viewProgram.venue }] : []),
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-3 bg-zinc-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                      {row.icon}
                      <div>
                        <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">{row.label}</p>
                        <p className="text-xs sm:text-sm font-semibold text-zinc-800">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {viewProgram.description && (
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5">Description</p>
                    <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">{viewProgram.description}</p>
                  </div>
                )}
              </div>
              <div className="px-5 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 flex gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-1.5 sm:gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs sm:text-sm"
                  onClick={() => setDeleteId(viewProgram.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Delete
                </Button>
                <Button
                  className="flex-1 gap-1.5 sm:gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm"
                  onClick={() => { setReminderProgram(viewProgram); setViewProgram(null); setReminderChannel('whatsapp'); }}
                >
                  <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Send Reminder
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════
          CREATE PROGRAM DIALOG
      ════════════════════════════════════════════════════════════════════ */}
      <Dialog open={createOpen} onOpenChange={v => { setCreateOpen(v); setFormError(''); }}>
        <DialogContent className="w-[92vw] sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col max-h-[90vh]">
          <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-zinc-800">Create Program</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-5 sm:px-7 pb-2 space-y-4 sm:space-y-5">
            {formError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {formError}
              </div>
            )}
            <div className="space-y-2">
              <Label className="font-medium text-zinc-700">Program Title *</Label>
              <Input
                placeholder="e.g. Healing Streams Live Service"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="font-medium text-zinc-700">Date *</Label>
                <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-zinc-700">Time *</Label>
                <Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-medium text-zinc-700">Venue</Label>
              <Input
                placeholder="e.g. Church Auditorium, Online"
                value={form.venue}
                onChange={e => setForm(p => ({ ...p, venue: e.target.value }))}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-medium text-zinc-700">Description</Label>
              <Textarea
                placeholder="Describe the program..."
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="px-5 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 gap-2">
            <Button variant="outline" onClick={() => { setCreateOpen(false); setFormError(''); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving} className="bg-zinc-900 hover:bg-zinc-800 text-white gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════
          DELETE CONFIRM DIALOG
      ════════════════════════════════════════════════════════════════════ */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl bg-white shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The program will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ════════════════════════════════════════════════════════════════════
          SEND REMINDER DIALOG
      ════════════════════════════════════════════════════════════════════ */}
      <Dialog open={!!reminderProgram} onOpenChange={v => { if (!v) setReminderProgram(null); }}>
        <DialogContent className="w-[92vw] sm:max-w-lg rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col max-h-[92vh]">
          <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-6 pb-3 shrink-0 border-b border-zinc-100">
            <DialogTitle className="text-lg sm:text-xl font-bold text-zinc-800">Send Reminder</DialogTitle>
            {reminderProgram && (
              <div className="mt-2 bg-zinc-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 space-y-0.5">
                <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">Program</p>
                <p className="font-bold text-zinc-800 text-sm sm:text-base leading-snug">{reminderProgram.title}</p>
                <p className="text-xs text-zinc-500">
                  {formatDate(reminderProgram.date)} · {formatTime(reminderProgram.time)}
                  {reminderProgram.venue ? ` · ${reminderProgram.venue}` : ''}
                </p>
              </div>
            )}
          </DialogHeader>

          {reminderProgram && (
            <div className="overflow-y-auto flex-1 px-5 sm:px-7 py-4 space-y-5">

              {/* ── Channel selector ─────────────────────────────────────── */}
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Choose Channel</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['whatsapp', 'sms', 'email'] as ReminderChannel[]).map(ch => (
                    <button
                      key={ch}
                      onClick={() => setReminderChannel(ch)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        reminderChannel === ch
                          ? ch === 'whatsapp' ? 'border-green-500 bg-green-50 text-green-700'
                          : ch === 'sms' ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'
                      }`}
                    >
                      {ch === 'whatsapp' && <MessageCircle className="h-5 w-5" />}
                      {ch === 'sms' && <Phone className="h-5 w-5" />}
                      {ch === 'email' && <Mail className="h-5 w-5" />}
                      {channelLabel(ch)}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Message preview ──────────────────────────────────────── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Message Preview</p>
                  <button
                    onClick={() => handleCopyBroadcast(reminderProgram)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-lg"
                  >
                    {copiedBroadcast ? <CheckCheck className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedBroadcast ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-700 whitespace-pre-wrap leading-relaxed font-sans">
                  {buildReminderMessage(reminderProgram)}
                </pre>
              </div>

              {/* ── Members list ─────────────────────────────────────────── */}
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Send to Members ({members.length})
                </p>
                {members.length === 0 ? (
                  <p className="text-xs text-zinc-400">No members found in database.</p>
                ) : (
                  <div className="space-y-2">
                    {members.map((member, i) => {
                      const link = getReminderLink(member, reminderProgram, reminderChannel);
                      return (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 sm:gap-3 bg-zinc-50 rounded-xl px-3 py-2.5 border border-zinc-100"
                        >
                          <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-zinc-800 truncate">{member.name}</p>
                            <p className="text-[11px] text-zinc-400">{member.phone}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Copy for this member */}
                            <button
                              onClick={() => handleCopyMember(i, member, reminderProgram)}
                              title="Copy message"
                              className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 transition-colors"
                            >
                              {copiedMember === i
                                ? <CheckCheck className="h-3.5 w-3.5 text-green-600" />
                                : <Copy className="h-3.5 w-3.5" />
                              }
                            </button>
                            {/* Open channel link */}
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Send via ${channelLabel(reminderChannel)}`}
                              className={`h-8 px-2.5 flex items-center gap-1 rounded-lg text-white text-xs font-semibold transition-colors ${channelColor(reminderChannel)}`}
                            >
                              {channelIcon(reminderChannel)}
                              <span className="hidden sm:inline">{channelLabel(reminderChannel)}</span>
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

          <div className="px-5 sm:px-7 py-4 border-t border-zinc-100 shrink-0">
            <Button
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
              onClick={() => setReminderProgram(null)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}