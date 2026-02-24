'use client';

import { useState, useMemo } from 'react';
import {
  Plus, Trash2, Bell, X, Calendar, Clock, MapPin,
  FileText, ChevronRight, Search, AlertTriangle
} from 'lucide-react';
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

// ── Types ─────────────────────────────────────────────────────────────────────
type Program = {
  id: number;
  title: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM
  venue: string;
  description: string;
  createdAt: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
}

function formatMonth(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
}

function daysFromNow(iso: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso + 'T00:00:00');
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'TODAY';
  if (diff === 1) return 'TOMORROW';
  if (diff < 0) return `${Math.abs(diff)} DAYS AGO`;
  return `${diff} DAYS TO GO`;
}

function daysTag(iso: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso + 'T00:00:00');
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'past';
  if (diff === 0) return 'today';
  return 'upcoming';
}

function formatTime(t: string) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

// ── Seed Data ─────────────────────────────────────────────────────────────────
const TODAY = new Date();
const addDays = (n: number) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

const seedPrograms: Program[] = [
  {
    id: 1,
    title: 'HEALING STREAMS LIVE HEALING SERVICE',
    date: addDays(3),
    time: '09:00',
    venue: 'Church Auditorium',
    description: 'A powerful healing service where testimonies of healing will be shared and prayers offered for all who attend.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'REACHOUT WORLD DAY',
    date: addDays(3),
    time: '10:00',
    venue: 'City Park',
    description: 'Annual outreach program to reach the community with the gospel. All members are expected to participate.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'HEALING STREAMS LIVE HEALING SERVICE',
    date: addDays(3),
    time: '14:00',
    venue: 'Online / Zoom',
    description: 'Evening session of the Healing Streams service, broadcast live online.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'HEALING STREAMS LIVE HEALING SERVICE',
    date: addDays(3),
    time: '17:00',
    venue: 'Fellowship Hall',
    description: 'Final session of the Healing Streams program for the month.',
    createdAt: new Date().toISOString(),
  },
];

const ALL_MEMBERS = [
  'Esteemed Bro. John Ezra',
  'Esteemed Bro. James Paul',
  'Esteemed Bro. Samuel Oke',
  'Esteemed Bro. David Nwosu',
  'Esteemed Bro. Peter Adeyemi',
  'Esteemed Bro. Philip Chukwu',
  'Esteemed Bro. Andrew Bello',
  'Sis. Mary Grace',
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>(seedPrograms);
  const [search, setSearch] = useState('');

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [viewProgram, setViewProgram] = useState<Program | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [reminderProgram, setReminderProgram] = useState<Program | null>(null);
  const [reminderSent, setReminderSent] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New program form
  const [form, setForm] = useState({
    title: '', date: '', time: '', venue: '', description: '',
  });
  const [formError, setFormError] = useState('');

  // ── Derived ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return programs;
    const q = search.toLowerCase();
    return programs.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.venue.toLowerCase().includes(q)
    );
  }, [programs, search]);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, Program[]>();
    filtered.forEach(p => {
      const key = formatMonth(p.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return map;
  }, [filtered]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = () => {
    if (!form.title.trim() || !form.date || !form.time) {
      setFormError('Title, date and time are required.');
      return;
    }
    const nextId = Math.max(...programs.map(p => p.id), 0) + 1;
    setPrograms(prev => [...prev, {
      id: nextId,
      title: form.title.trim().toUpperCase(),
      date: form.date,
      time: form.time,
      venue: form.venue.trim(),
      description: form.description.trim(),
      createdAt: new Date().toISOString(),
    }]);
    setForm({ title: '', date: '', time: '', venue: '', description: '' });
    setFormError('');
    setCreateOpen(false);
    showToast('Program created successfully!');
  };

  const handleDelete = () => {
    if (deleteId === null) return;
    setPrograms(prev => prev.filter(p => p.id !== deleteId));
    if (viewProgram?.id === deleteId) setViewProgram(null);
    setDeleteId(null);
    showToast('Program deleted.');
  };

  const handleSendReminder = () => {
    setReminderSent(true);
    setTimeout(() => {
      setReminderSent(false);
      setReminderProgram(null);
      showToast(`Reminder sent to ${ALL_MEMBERS.length} members!`);
    }, 1800);
  };

  const tagColor = (tag: string) => {
    if (tag === 'today') return 'bg-amber-100 text-amber-700 border-amber-300';
    if (tag === 'past') return 'bg-zinc-100 text-zinc-500 border-zinc-300';
    return 'bg-green-100 text-green-700 border-green-300';
  };

  return (
    <div className="space-y-8 pb-20 relative">

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-semibold">
          {toast}
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-zinc-800 tracking-tight">PROGRAM</h1>
        <Button
          onClick={() => setCreateOpen(true)}
          className="h-11 px-6 gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl"
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
          <p>No programs found.</p>
        </div>
      ) : (
        Array.from(grouped.entries()).map(([month, progs]) => (
          <div key={month} className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-500 tracking-widest">
              MONTH: {month}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {progs.map(prog => {
                const tag = daysTag(prog.date);
                return (
                  <div
                    key={prog.id}
                    onClick={() => setViewProgram(prog)}
                    className="group relative bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
                  >
                    {/* Top accent bar */}
                    <div className={`h-1 w-full ${
                      tag === 'today' ? 'bg-amber-400' :
                      tag === 'past' ? 'bg-zinc-300' : 'bg-green-500'
                    }`} />

                    <div className="p-5">
                      <p className="text-[11px] font-semibold text-zinc-400 tracking-widest mb-2">
                        {formatDate(prog.date)}
                      </p>
                      <h3 className="font-black text-zinc-800 text-[15px] leading-tight mb-3 line-clamp-3 tracking-tight">
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

      {/* ══════════════════════════════════════════════════════════════════════
          ── VIEW PROGRAM DIALOG ──────────────────────────────────────────────
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={!!viewProgram} onOpenChange={() => setViewProgram(null)}>
        <DialogContent className="sm:max-w-lg rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col max-h-[90vh]">
          {viewProgram && (
            <>
              {/* Accent top */}
              <div className={`h-2 w-full rounded-t-2xl shrink-0 ${
                daysTag(viewProgram.date) === 'today' ? 'bg-amber-400' :
                daysTag(viewProgram.date) === 'past' ? 'bg-zinc-300' : 'bg-green-500'
              }`} />

              <DialogHeader className="px-7 pt-5 pb-4 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Badge variant="outline" className={`text-[10px] font-bold mb-3 ${tagColor(daysTag(viewProgram.date))}`}>
                      {daysFromNow(viewProgram.date)}
                    </Badge>
                    <DialogTitle className="text-xl font-black text-zinc-800 leading-tight tracking-tight">
                      {viewProgram.title}
                    </DialogTitle>
                  </div>
                </div>
              </DialogHeader>

              <div className="overflow-y-auto flex-1 px-7 pb-2 space-y-5">
                {/* Meta */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-3">
                    <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">Date</p>
                      <p className="text-sm font-semibold text-zinc-800">{formatDate(viewProgram.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-3">
                    <Clock className="h-4 w-4 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">Time</p>
                      <p className="text-sm font-semibold text-zinc-800">{formatTime(viewProgram.time)}</p>
                    </div>
                  </div>
                  {viewProgram.venue && (
                    <div className="flex items-center gap-3 bg-zinc-50 rounded-xl px-4 py-3">
                      <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">Venue</p>
                        <p className="text-sm font-semibold text-zinc-800">{viewProgram.venue}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {viewProgram.description && (
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2">Description</p>
                    <p className="text-sm text-zinc-700 leading-relaxed">{viewProgram.description}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-7 py-5 border-t border-zinc-100 shrink-0 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  onClick={() => { setDeleteId(viewProgram.id); }}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
                <Button
                  className="flex-1 gap-2 bg-zinc-900 hover:bg-zinc-800 text-white"
                  onClick={() => { setReminderProgram(viewProgram); setViewProgram(null); }}
                >
                  <Bell className="h-4 w-4" /> Send Reminder
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════════
          ── CREATE PROGRAM DIALOG ────────────────────────────────────────────
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={createOpen} onOpenChange={v => { setCreateOpen(v); setFormError(''); }}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col max-h-[90vh]">
          <DialogHeader className="px-7 pt-7 pb-4 shrink-0">
            <DialogTitle className="text-2xl font-bold text-zinc-800">Create Program</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 px-7 pb-2 space-y-5">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-medium text-zinc-700">Date *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-zinc-700">Time *</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  className="h-11"
                />
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

          <DialogFooter className="px-7 py-5 border-t border-zinc-100 shrink-0">
            <Button variant="outline" onClick={() => { setCreateOpen(false); setFormError(''); }}>Cancel</Button>
            <Button onClick={handleCreate} className="bg-zinc-900 hover:bg-zinc-800 text-white">
              Save Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════════
          ── DELETE CONFIRM DIALOG ────────────────────────────────────────────
      ══════════════════════════════════════════════════════════════════════ */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-md rounded-2xl bg-white shadow-2xl">
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

      {/* ══════════════════════════════════════════════════════════════════════
          ── SEND REMINDER DIALOG ─────────────────────────────────────────────
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={!!reminderProgram} onOpenChange={v => { if (!v) setReminderProgram(null); }}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col">
          <DialogHeader className="px-7 pt-7 pb-4 shrink-0">
            <DialogTitle className="text-xl font-bold text-zinc-800">Send Reminder</DialogTitle>
          </DialogHeader>

          <div className="px-7 pb-4 space-y-4">
            {/* Program summary */}
            <div className="bg-zinc-50 rounded-xl px-4 py-4 space-y-1">
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">Program</p>
              <p className="font-bold text-zinc-800">{reminderProgram?.title}</p>
              <p className="text-sm text-zinc-500">
                {reminderProgram ? formatDate(reminderProgram.date) : ''} · {reminderProgram ? formatTime(reminderProgram.time) : ''}
              </p>
              {reminderProgram?.venue && (
                <p className="text-sm text-zinc-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {reminderProgram.venue}
                </p>
              )}
            </div>

            {/* Recipients */}
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest mb-2">
                Recipients ({ALL_MEMBERS.length} members)
              </p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {ALL_MEMBERS.map((name, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 px-3 bg-zinc-50 rounded-lg text-sm text-zinc-700">
                    <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="px-7 py-5 border-t border-zinc-100 shrink-0">
            <Button variant="outline" onClick={() => setReminderProgram(null)}>Cancel</Button>
            <Button
              onClick={handleSendReminder}
              disabled={reminderSent}
              className="bg-zinc-900 hover:bg-zinc-800 text-white gap-2 min-w-[160px]"
            >
              {reminderSent ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" /> Send to All Members
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}