

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus, Eye, Calendar, Users, TrendingUp, TrendingDown,
  CheckSquare, Square, Save, Loader2,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ── Supabase ──────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// ── Types ─────────────────────────────────────────────────────────────────────
type Member = {
  id: number;
  name: string;
  phone: string;
};

type AttendanceRecord = {
  id?: number;
  meeting_id: number;
  member_id: number;
  present: boolean;
};

type Meeting = {
  id: number;
  title: string;
  date: string;
  saved: boolean;
  created_at?: string;
  attendance: AttendanceRecord[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
];

function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
  }).toUpperCase();
}

function formatDateShort(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`.toUpperCase();
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AttendancePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeMeetingId, setActiveMeetingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // local draft attendance for the active (unsaved) meeting
  const [draftAttendance, setDraftAttendance] = useState<Record<number, boolean>>({});

  const [newMeetingOpen, setNewMeetingOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [creating, setCreating] = useState(false);

  const [historyViewMeeting, setHistoryViewMeeting] = useState<Meeting | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  // ── Fetch members from DB ─────────────────────────────────────────────────
  const fetchMembers = useCallback(async () => {
    const { data } = await supabase
      .from('members')
      .select('id, name, phone')
      .order('created_at', { ascending: true });
    if (data) setMembers(data);
  }, []);

  // ── Fetch all meetings + their attendance ─────────────────────────────────
  const fetchMeetings = useCallback(async () => {
    const { data: meetingsData, error } = await supabase
      .from('meetings')
      .select('*')
      .order('date', { ascending: true });
    if (error || !meetingsData) return;

    // fetch attendance for all meetings
    const { data: attendanceData } = await supabase
      .from('attendance_records')
      .select('*');

    const enriched: Meeting[] = meetingsData.map(m => ({
      ...m,
      attendance: (attendanceData || []).filter(a => a.meeting_id === m.id),
    }));

    setMeetings(enriched);

    // set active to most recent by default (only on first load)
    setActiveMeetingId(prev => {
      if (prev !== null) return prev;
      const last = enriched[enriched.length - 1];
      return last ? last.id : null;
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchMembers(), fetchMeetings()]);
      setLoading(false);
    };
    init();
  }, [fetchMembers, fetchMeetings]);

  // ── Realtime ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const meetingsSub = supabase
      .channel('meetings-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, fetchMeetings)
      .subscribe();
    const attendanceSub = supabase
      .channel('attendance-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_records' }, fetchMeetings)
      .subscribe();
    const membersSub = supabase
      .channel('members-rt-attendance')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, fetchMembers)
      .subscribe();

    return () => {
      supabase.removeChannel(meetingsSub);
      supabase.removeChannel(attendanceSub);
      supabase.removeChannel(membersSub);
    };
  }, [fetchMeetings, fetchMembers]);

  // ── Sync draft when active meeting changes ────────────────────────────────
  useEffect(() => {
    if (activeMeetingId === null) return;
    const meeting = meetings.find(m => m.id === activeMeetingId);
    if (!meeting) return;

    if (meeting.saved) {
      // populate draft from saved data for display
      const map: Record<number, boolean> = {};
      meeting.attendance.forEach(a => { map[a.member_id] = a.present; });
      setDraftAttendance(map);
    } else {
      // new unsaved meeting — start all absent
      const map: Record<number, boolean> = {};
      members.forEach(m => {
        const existing = meeting.attendance.find(a => a.member_id === m.id);
        map[m.id] = existing?.present ?? false;
      });
      setDraftAttendance(map);
    }
  }, [activeMeetingId, meetings, members]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const activeMeeting = meetings.find(m => m.id === activeMeetingId) ?? null;
  const savedMeetings = meetings.filter(m => m.saved);
  const totalMembers = members.length;
  const presentCount = Object.values(draftAttendance).filter(Boolean).length;
  const absentCount = totalMembers - presentCount;

  // Consistency based on last 2 saved meetings
  const consistencyStats = useMemo(() => {
    const lastTwo = savedMeetings.slice(-2);
    if (lastTwo.length === 0) return { consistent: [] as Member[], inconsistent: [] as Member[] };
    const scores = members.map(m => {
      const attended = lastTwo.filter(mt =>
        mt.attendance.find(a => a.member_id === m.id)?.present
      ).length;
      return { member: m, score: attended, total: lastTwo.length };
    });
    return {
      consistent: scores.filter(s => s.score === s.total).map(s => s.member),
      inconsistent: scores.filter(s => s.score === 0).map(s => s.member),
    };
  }, [savedMeetings, members]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleCreateMeeting = async () => {
    if (!newTitle.trim() || !newDate) return;
    setCreating(true);
    const { data, error } = await supabase
      .from('meetings')
      .insert([{ title: newTitle.trim(), date: newDate, saved: false }])
      .select()
      .single();

    if (!error && data) {
      setActiveMeetingId(data.id);
      // initialise draft all absent
      const map: Record<number, boolean> = {};
      members.forEach(m => { map[m.id] = false; });
      setDraftAttendance(map);
    }
    setNewTitle('');
    setNewDate('');
    setNewMeetingOpen(false);
    setCreating(false);
  };

  const toggleAttendance = (memberId: number, field: 'present' | 'absent') => {
    if (activeMeeting?.saved) return;
    setDraftAttendance(prev => ({ ...prev, [memberId]: field === 'present' }));
  };

  const handleSave = async () => {
    if (!activeMeeting || activeMeeting.saved) return;
    setSaving(true);

    // Upsert attendance records
    const records = members.map(m => ({
      meeting_id: activeMeeting.id,
      member_id: m.id,
      present: draftAttendance[m.id] ?? false,
    }));

    const { error: attendanceError } = await supabase
      .from('attendance_records')
      .upsert(records, { onConflict: 'meeting_id,member_id' });

    if (attendanceError) {
      console.error('Attendance save error:', attendanceError);
      setSaving(false);
      return;
    }

    // Mark meeting as saved
    const { error: meetingError } = await supabase
      .from('meetings')
      .update({ saved: true })
      .eq('id', activeMeeting.id);

    if (!meetingError) {
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);
    }

    setSaving(false);
  };

  const switchToMeeting = (meetingId: number) => {
    setActiveMeetingId(meetingId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28 relative px-2 sm:px-0">

      {/* ── Saved Toast ─────────────────────────────────────────────────────── */}
      {savedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
          <CheckSquare className="h-4 w-4" /> Attendance saved successfully!
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight">ATTENDANCE</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {activeMeeting
              ? `Active: ${activeMeeting.title} · ${formatDateShort(activeMeeting.date)}`
              : 'No active meeting — create one to start'}
          </p>
        </div>
        <Button
          onClick={() => setNewMeetingOpen(true)}
          className="h-10 sm:h-11 px-4 sm:px-6 gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> NEW MEETING
        </Button>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {[
          { icon: <Users className="h-4 w-4 text-zinc-400" />, label: 'Total', value: totalMembers },
          { icon: <CheckSquare className="h-4 w-4 text-green-500" />, label: 'Present', value: presentCount },
          { icon: <Square className="h-4 w-4 text-red-400" />, label: 'Absent', value: absentCount },
        ].map(s => (
          <div
            key={s.label}
            className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 shadow-sm flex-1 min-w-[90px] justify-center sm:justify-start sm:flex-none sm:px-5 sm:py-3"
          >
            {s.icon}
            <span className="text-xs sm:text-sm font-semibold text-zinc-700">
              {s.label}: {String(s.value).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

        {/* ── Attendance Sheet ──────────────────────────────────────────────── */}
        <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-zinc-50 px-4 sm:px-7 pt-5 pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-zinc-500 text-xs sm:text-sm font-semibold">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {activeMeeting ? formatDate(activeMeeting.date) : '—'}
                </span>
              </div>
              {activeMeeting?.saved && (
                <Badge className="bg-green-100 text-green-700 border-green-300 border text-xs shrink-0">
                  Saved ✓
                </Badge>
              )}
            </div>

            {/* Meeting selector tabs (scrollable on mobile) */}
            {meetings.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {meetings.map(m => (
                  <button
                    key={m.id}
                    onClick={() => switchToMeeting(m.id)}
                    className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      m.id === activeMeetingId
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {m.title} · {formatDateShort(m.date)}
                  </button>
                ))}
              </div>
            )}

            {/* Column headers */}
            <div className="mt-3 grid grid-cols-[1fr_64px_64px] sm:grid-cols-[1fr_80px_80px] gap-2 text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest pr-1">
              <span>Member</span>
              <span className="text-center">Present</span>
              <span className="text-center">Absent</span>
            </div>
          </CardHeader>

          <CardContent className="px-3 sm:px-7 py-3 sm:py-4">
            {!activeMeeting ? (
              <div className="text-center py-16 text-zinc-400 text-sm">
                No meeting selected. Create a new meeting to get started.
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-16 text-zinc-400 text-sm">
                No members found. Add members first on the Members page.
              </div>
            ) : (
              <div className="space-y-0.5">
                {members.map((member, idx) => {
                  const present = draftAttendance[member.id] ?? false;
                  const locked = activeMeeting.saved;
                  return (
                    <div
                      key={member.id}
                      className={`grid grid-cols-[1fr_64px_64px] sm:grid-cols-[1fr_80px_80px] gap-2 items-center py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl transition-colors ${
                        present ? 'bg-green-50' : 'hover:bg-zinc-50'
                      }`}
                    >
                      <span className="text-xs sm:text-[15px] font-medium text-zinc-800 truncate pr-2">
                        {idx + 1}. {member.name}
                      </span>

                      {/* Present */}
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

                      {/* Absent */}
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
            )}
          </CardContent>
        </Card>

        {/* ── Right Column ─────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* History */}
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-zinc-50 px-4 sm:px-6 pt-4 sm:pt-5 pb-3">
              <CardTitle className="text-xs font-bold tracking-widest text-zinc-700 uppercase">
                History
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 pt-2 space-y-2">
              {savedMeetings.length === 0 ? (
                <p className="text-xs text-zinc-400 py-2">No saved meetings yet.</p>
              ) : (
                // show all saved meetings, most recent first
                [...savedMeetings].reverse().map(m => {
                  const pc = m.attendance.filter(a => a.present).length;
                  const isActive = m.id === activeMeetingId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setHistoryViewMeeting(m)}
                      className={`w-full text-left rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-bold tracking-wide transition-all hover:shadow-md ${
                        isActive
                          ? 'border-zinc-800 bg-zinc-900 text-white'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{m.title.toUpperCase()} – {formatDateShort(m.date)}</span>
                        <Eye className="h-3.5 w-3.5 opacity-60 shrink-0" />
                      </div>
                      <div className={`mt-0.5 text-[11px] font-normal ${isActive ? 'text-zinc-300' : 'text-zinc-400'}`}>
                        {pc} / {totalMembers} present
                      </div>
                    </button>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Most Consistent */}
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-zinc-50 px-4 sm:px-6 pt-4 sm:pt-5 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                <CardTitle className="text-xs font-bold tracking-widest text-zinc-700 uppercase">Most Consistent</CardTitle>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Attended all of last 2 saved meetings</p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 pt-2 space-y-1">
              {consistencyStats.consistent.length === 0 ? (
                <p className="text-xs text-zinc-400 py-1">None found in last 2 meetings.</p>
              ) : (
                consistencyStats.consistent.map((m, i) => (
                  <div key={m.id} className="flex items-center gap-2 py-1">
                    <TrendingUp className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    <span className="text-xs sm:text-sm text-zinc-700 truncate">{i + 1}. {m.name}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Most Inconsistent */}
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-zinc-50 px-4 sm:px-6 pt-4 sm:pt-5 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
                <CardTitle className="text-xs font-bold tracking-widest text-zinc-700 uppercase">Most Inconsistent</CardTitle>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Missed all of last 2 saved meetings</p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 pt-2 space-y-1">
              {consistencyStats.inconsistent.length === 0 ? (
                <p className="text-xs text-zinc-400 py-1">None found in last 2 meetings.</p>
              ) : (
                consistencyStats.inconsistent.map((m, i) => (
                  <div key={m.id} className="flex items-center gap-2 py-1">
                    <TrendingDown className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <span className="text-xs sm:text-sm text-zinc-700 truncate">{i + 1}. {m.name}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Save Button (floating) ───────────────────────────────────────────── */}
      {activeMeeting && !activeMeeting.saved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-xs sm:max-w-none sm:w-auto">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto h-12 px-8 sm:px-12 bg-green-600 hover:bg-green-500 text-white text-sm sm:text-base font-bold rounded-2xl shadow-2xl gap-2"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="h-4 w-4" /> Save Attendance</>
            )}
          </Button>
        </div>
      )}

      {/* ── New Meeting Dialog ───────────────────────────────────────────────── */}
      <Dialog open={newMeetingOpen} onOpenChange={setNewMeetingOpen}>
        <DialogContent className="w-[92vw] sm:max-w-sm rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col">
          <DialogHeader className="px-6 sm:px-7 pt-6 sm:pt-7 pb-4 shrink-0">
            <DialogTitle className="text-xl font-bold text-zinc-800">New Meeting</DialogTitle>
          </DialogHeader>
          <div className="px-6 sm:px-7 pb-2 space-y-4 sm:space-y-5">
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
          <DialogFooter className="px-6 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 mt-4 gap-2">
            <Button variant="outline" onClick={() => setNewMeetingOpen(false)}>Cancel</Button>
            <Button
              disabled={!newTitle.trim() || !newDate || creating}
              onClick={handleCreateMeeting}
              className="bg-zinc-900 hover:bg-zinc-800 text-white"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Meeting'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── History View Dialog ──────────────────────────────────────────────── */}
      <Dialog open={!!historyViewMeeting} onOpenChange={() => setHistoryViewMeeting(null)}>
        <DialogContent className="w-[92vw] sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl p-0 flex flex-col max-h-[85vh]">
          <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 shrink-0 border-b border-zinc-100">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-bold text-zinc-800 truncate">
                  {historyViewMeeting?.title}
                </DialogTitle>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  {historyViewMeeting ? formatDate(historyViewMeeting.date) : ''}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xl sm:text-2xl font-bold text-zinc-800">
                  {historyViewMeeting?.attendance.filter(a => a.present).length}
                  <span className="text-sm font-normal text-zinc-400">/{totalMembers}</span>
                </div>
                <div className="text-xs text-zinc-400">present</div>
              </div>
            </div>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-4 sm:px-7 py-3 sm:py-4 space-y-1">
            {members.map((member, idx) => {
              const present = historyViewMeeting?.attendance.find(a => a.member_id === member.id)?.present;
              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl gap-2 ${
                    present ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium text-zinc-800 truncate">
                    {idx + 1}. {member.name}
                  </span>
                  <Badge
                    className={`shrink-0 text-xs ${present
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-red-100 text-red-600 border border-red-300'
                    }`}
                  >
                    {present ? 'Present' : 'Absent'}
                  </Badge>
                </div>
              );
            })}
          </div>
          <div className="px-4 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0">
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