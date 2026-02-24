'use client';

import { useState, useMemo } from 'react';
import { Plus, X, Eye, Calendar, Users, TrendingUp, TrendingDown, CheckSquare, Square, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ── Types ─────────────────────────────────────────────────────────────────────
type Member = {
  id: number;
  name: string;
};

type AttendanceRecord = {
  memberId: number;
  present: boolean;
};

type Meeting = {
  id: number;
  title: string;         // e.g. "Bible Study"
  date: string;          // ISO YYYY-MM-DD
  attendance: AttendanceRecord[];
  saved: boolean;
};

// ── Static Members (mirrors MembersPage) ─────────────────────────────────────
const ALL_MEMBERS: Member[] = [
  { id: 1, name: 'Esteemed Bro. John Ezra' },
  { id: 2, name: 'Esteemed Bro. James Paul' },
  { id: 3, name: 'Esteemed Bro. Samuel Oke' },
  { id: 4, name: 'Esteemed Bro. David Nwosu' },
  { id: 5, name: 'Esteemed Bro. Peter Adeyemi' },
  { id: 6, name: 'Esteemed Bro. Philip Chukwu' },
  { id: 7, name: 'Esteemed Bro. Andrew Bello' },
  { id: 8, name: 'Sis. Mary Grace' },
];

// ── Seed History ──────────────────────────────────────────────────────────────
const seedMeetings: Meeting[] = [
  {
    id: 1,
    title: 'Bible Study',
    date: '2026-04-05',
    saved: true,
    attendance: ALL_MEMBERS.map((m, i) => ({ memberId: m.id, present: i < 6 })),
  },
  {
    id: 2,
    title: 'Prayer Meeting',
    date: '2026-06-05',
    saved: true,
    attendance: ALL_MEMBERS.map((m, i) => ({ memberId: m.id, present: i < 5 })),
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
}

function formatDateShort(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AttendancePage() {
  const [meetings, setMeetings] = useState<Meeting[]>(seedMeetings);
  const [activeMeetingId, setActiveMeetingId] = useState<number>(seedMeetings[seedMeetings.length - 1].id);

  // New meeting dialog
  const [newMeetingOpen, setNewMeetingOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  // History view dialog
  const [historyViewMeeting, setHistoryViewMeeting] = useState<Meeting | null>(null);

  // Saved toast
  const [savedToast, setSavedToast] = useState(false);

  const activeMeeting = meetings.find(m => m.id === activeMeetingId)!;
  const savedMeetings = meetings.filter(m => m.saved);
  const lastTwo = savedMeetings.slice(-2);

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalMembers = ALL_MEMBERS.length;
  const presentCount = activeMeeting
    ? activeMeeting.attendance.filter(a => a.present).length
    : 0;
  const absentCount = totalMembers - presentCount;

  // Most consistent / inconsistent in last 2 saved meetings
  const consistencyStats = useMemo(() => {
    if (lastTwo.length === 0) return { consistent: [], inconsistent: [] };
    const scores = ALL_MEMBERS.map(m => {
      const attendedCount = lastTwo.filter(mt =>
        mt.attendance.find(a => a.memberId === m.id)?.present
      ).length;
      return { member: m, score: attendedCount, total: lastTwo.length };
    });
    const consistent = scores.filter(s => s.score === s.total).map(s => s.member);
    const inconsistent = scores.filter(s => s.score === 0).map(s => s.member);
    return { consistent, inconsistent };
  }, [lastTwo]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleCreateMeeting = () => {
    if (!newTitle.trim() || !newDate) return;
    const nextId = Math.max(...meetings.map(m => m.id), 0) + 1;
    const fresh: Meeting = {
      id: nextId,
      title: newTitle.trim(),
      date: newDate,
      saved: false,
      attendance: ALL_MEMBERS.map(m => ({ memberId: m.id, present: false })),
    };
    setMeetings(prev => [...prev, fresh]);
    setActiveMeetingId(nextId);
    setNewTitle('');
    setNewDate('');
    setNewMeetingOpen(false);
  };

  const toggleAttendance = (memberId: number, field: 'present' | 'absent') => {
    if (activeMeeting?.saved) return; // locked after save
    setMeetings(prev =>
      prev.map(m => {
        if (m.id !== activeMeetingId) return m;
        return {
          ...m,
          attendance: m.attendance.map(a =>
            a.memberId === memberId
              ? { ...a, present: field === 'present' }
              : a
          ),
        };
      })
    );
  };

  const handleSave = () => {
    setMeetings(prev =>
      prev.map(m => m.id === activeMeetingId ? { ...m, saved: true } : m)
    );
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const isPresent = (memberId: number) =>
    activeMeeting?.attendance.find(a => a.memberId === memberId)?.present ?? false;

  return (
    <div className="space-y-8 pb-24 relative">
      {/* ── Saved Toast ─────────────────────────────────────────────────────── */}
      {savedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
          <CheckSquare className="h-4 w-4" /> Attendance saved successfully!
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800 tracking-tight">ATTENDANCE</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {activeMeeting ? `Active: ${activeMeeting.title} · ${formatDateShort(activeMeeting.date)}` : 'No active meeting'}
          </p>
        </div>
        <Button
          onClick={() => setNewMeetingOpen(true)}
          className="h-11 px-6 gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl"
        >
          <Plus className="h-4 w-4" /> NEW MEETING
        </Button>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-5 py-3 shadow-sm">
          <Users className="h-4 w-4 text-zinc-400" />
          <span className="text-sm font-semibold text-zinc-700">Total : {String(totalMembers).padStart(2, '0')}</span>
        </div>
        <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-5 py-3 shadow-sm">
          <CheckSquare className="h-4 w-4 text-green-500" />
          <span className="text-sm font-semibold text-zinc-700">Present : {String(presentCount).padStart(2, '0')}</span>
        </div>
        <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-5 py-3 shadow-sm">
          <Square className="h-4 w-4 text-red-400" />
          <span className="text-sm font-semibold text-zinc-700">Absent : {String(absentCount).padStart(2, '0')}</span>
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* ── Attendance Sheet ──────────────────────────────────────────────── */}
        <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-zinc-50 px-7 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500 text-sm font-semibold">
                <Calendar className="h-4 w-4" />
                {activeMeeting ? formatDate(activeMeeting.date) : '—'}
              </div>
              {activeMeeting?.saved && (
                <Badge className="bg-green-100 text-green-700 border-green-300 border text-xs">
                  Saved
                </Badge>
              )}
            </div>
            {/* Column headers */}
            <div className="mt-4 grid grid-cols-[1fr_80px_80px] gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest pr-2">
              <span>Member</span>
              <span className="text-center">Present</span>
              <span className="text-center">Absent</span>
            </div>
          </CardHeader>
          <CardContent className="px-7 py-4">
            {activeMeeting ? (
              <div className="space-y-1">
                {ALL_MEMBERS.map((member, idx) => {
                  const present = isPresent(member.id);
                  const locked = activeMeeting.saved;
                  return (
                    <div
                      key={member.id}
                      className={`grid grid-cols-[1fr_80px_80px] gap-2 items-center py-3 px-3 rounded-xl transition-colors ${
                        present ? 'bg-green-50' : 'hover:bg-zinc-50'
                      }`}
                    >
                      <span className="text-[15px] font-medium text-zinc-800">
                        {idx + 1}. {member.name}
                      </span>
                      {/* Present checkbox */}
                      <div className="flex justify-center">
                        <button
                          disabled={locked}
                          onClick={() => toggleAttendance(member.id, 'present')}
                          className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-all ${
                            present
                              ? 'bg-indigo-600 border-indigo-600'
                              : 'border-zinc-300 hover:border-indigo-400'
                          } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {present && (
                            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {/* Absent checkbox */}
                      <div className="flex justify-center">
                        <button
                          disabled={locked}
                          onClick={() => toggleAttendance(member.id, 'absent')}
                          className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-all ${
                            !present
                              ? 'bg-red-500 border-red-500'
                              : 'border-zinc-300 hover:border-red-400'
                          } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {!present && (
                            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-zinc-400">
                No meeting selected. Create a new meeting to get started.
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Right Column ─────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* History */}
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-zinc-50 px-6 pt-5 pb-3">
              <CardTitle className="text-sm font-bold tracking-widest text-zinc-700 uppercase">History</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-5 pt-2 space-y-2">
              {savedMeetings.length === 0 ? (
                <p className="text-xs text-zinc-400 py-2">No saved meetings yet.</p>
              ) : (
                savedMeetings.map(m => {
                  const presentCount = m.attendance.filter(a => a.present).length;
                  const isActive = m.id === activeMeetingId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setHistoryViewMeeting(m)}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-xs font-bold tracking-wide transition-all hover:shadow-md ${
                        isActive
                          ? 'border-zinc-800 bg-zinc-900 text-white'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{m.title.toUpperCase()} – {formatDateShort(m.date)}</span>
                        <Eye className="h-3.5 w-3.5 opacity-60" />
                      </div>
                      <div className={`mt-1 text-[11px] font-normal ${isActive ? 'text-zinc-300' : 'text-zinc-400'}`}>
                        {presentCount} / {totalMembers} present
                      </div>
                    </button>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Most Consistent */}
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-zinc-50 px-6 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                <CardTitle className="text-sm font-bold tracking-widest text-zinc-700 uppercase">Most Consistent</CardTitle>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Attended all of last 2 meetings</p>
            </CardHeader>
            <CardContent className="px-6 pb-5 pt-2 space-y-1">
              {consistencyStats.consistent.length === 0 ? (
                <p className="text-xs text-zinc-400 py-1">None found in last 2 meetings.</p>
              ) : (
                consistencyStats.consistent.map((m, i) => (
                  <div key={m.id} className="flex items-center gap-2 py-1">
                    <TrendingUp className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    <span className="text-sm text-zinc-700">{i + 1}. {m.name}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Most Inconsistent */}
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-zinc-50 px-6 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <CardTitle className="text-sm font-bold tracking-widest text-zinc-700 uppercase">Most Inconsistent</CardTitle>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Missed all of last 2 meetings</p>
            </CardHeader>
            <CardContent className="px-6 pb-5 pt-2 space-y-1">
              {consistencyStats.inconsistent.length === 0 ? (
                <p className="text-xs text-zinc-400 py-1">None found in last 2 meetings.</p>
              ) : (
                consistencyStats.inconsistent.map((m, i) => (
                  <div key={m.id} className="flex items-center gap-2 py-1">
                    <TrendingDown className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <span className="text-sm text-zinc-700">{i + 1}. {m.name}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Save Button ──────────────────────────────────────────────────────── */}
      {activeMeeting && !activeMeeting.saved && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <Button
            onClick={handleSave}
            className="h-12 px-12 bg-green-600 hover:bg-green-500 text-white text-base font-bold rounded-2xl shadow-2xl gap-2"
          >
            <Save className="h-4 w-4" /> Save Attendance
          </Button>
        </div>
      )}

      {/* ── New Meeting Dialog ───────────────────────────────────────────────── */}
      <Dialog open={newMeetingOpen} onOpenChange={setNewMeetingOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col">
          <DialogHeader className="px-7 pt-7 pb-4 shrink-0">
            <DialogTitle className="text-xl font-bold text-zinc-800">New Meeting</DialogTitle>
          </DialogHeader>
          <div className="px-7 pb-2 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700">Meeting Title</Label>
              <Input
                placeholder="e.g. Bible Study, Prayer Meeting"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700">Date</Label>
              <Input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="h-11"
              />
            </div>
          </div>
          <DialogFooter className="px-7 py-5 border-t border-zinc-100 shrink-0 mt-4">
            <Button variant="outline" onClick={() => setNewMeetingOpen(false)}>Cancel</Button>
            <Button
              disabled={!newTitle.trim() || !newDate}
              onClick={handleCreateMeeting}
              className="bg-zinc-900 hover:bg-zinc-800 text-white"
            >
              Create Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── History View Dialog ──────────────────────────────────────────────── */}
      <Dialog open={!!historyViewMeeting} onOpenChange={() => setHistoryViewMeeting(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col max-h-[85vh]">
          <DialogHeader className="px-7 pt-7 pb-4 shrink-0 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-zinc-800">
                  {historyViewMeeting?.title}
                </DialogTitle>
                <p className="text-sm text-zinc-500 mt-1">
                  {historyViewMeeting ? formatDate(historyViewMeeting.date) : ''}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-zinc-800">
                  {historyViewMeeting?.attendance.filter(a => a.present).length}
                  <span className="text-base font-normal text-zinc-400">/{totalMembers}</span>
                </div>
                <div className="text-xs text-zinc-400">present</div>
              </div>
            </div>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-7 py-4 space-y-1">
            {ALL_MEMBERS.map((member, idx) => {
              const present = historyViewMeeting?.attendance.find(a => a.memberId === member.id)?.present;
              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl ${
                    present ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <span className="text-sm font-medium text-zinc-800">
                    {idx + 1}. {member.name}
                  </span>
                  <Badge
                    className={present
                      ? 'bg-green-100 text-green-700 border border-green-300 text-xs'
                      : 'bg-red-100 text-red-600 border border-red-300 text-xs'
                    }
                  >
                    {present ? 'Present' : 'Absent'}
                  </Badge>
                </div>
              );
            })}
          </div>
          <div className="px-7 py-5 border-t border-zinc-100 shrink-0">
            <Button
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
              onClick={() => setHistoryViewMeeting(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}