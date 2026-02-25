
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  Eye,
  Pencil,
  Plus,
  Users,
  X,
  Search,
} from 'lucide-react';

import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ── Supabase Client ──────────────────────────────────────────────────────────
// Replace with your actual Supabase URL and anon key from Project Settings > API
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// ── Types ────────────────────────────────────────────────────────────────────
type Member = {
  id: number;
  name: string;
  phone: string;
  birthday_date?: string;
  bio?: string;
  gender?: 'Male' | 'Female';
  join_date?: string;
  created_at?: string;
};

type Celebration = {
  id: number;
  name: string;
  day: number;
  month: number;
  event: string;
  color: string;
  created_at?: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

// ── Page Component ───────────────────────────────────────────────────────────
export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Current month is live — updates automatically
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);
  const [currentMonthName, setCurrentMonthName] = useState(() => MONTH_NAMES[new Date().getMonth()]);

  const [showAllMembers, setShowAllMembers] = useState(false);
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null);

  const [newMember, setNewMember] = useState<Partial<Member>>({});
  const [editedMember, setEditedMember] = useState<Partial<Member>>({});

  const [addCelebOpen, setAddCelebOpen] = useState(false);
  const [editCeleb, setEditCeleb] = useState<Celebration | null>(null);
  const [deleteCelebId, setDeleteCelebId] = useState<number | null>(null);
  const [newCeleb, setNewCeleb] = useState<Partial<Celebration>>({});
  const [editedCeleb, setEditedCeleb] = useState<Partial<Celebration>>({});

  // ── Keep month in sync with real time ────────────────────────────────────
  useEffect(() => {
    const checkMonth = () => {
      const now = new Date();
      const m = now.getMonth() + 1;
      setCurrentMonth(m);
      setCurrentMonthName(MONTH_NAMES[now.getMonth()]);
    };
    checkMonth();
    // Check every hour in case the month rolls over
    const interval = setInterval(checkMonth, 3600 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Fetch members ─────────────────────────────────────────────────────────
  const fetchMembers = useCallback(async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) setMembers(data);
  }, []);

  // ── Fetch celebrations for current month ──────────────────────────────────
  const fetchCelebrations = useCallback(async () => {
    const { data, error } = await supabase
      .from('celebrations')
      .select('*')
      .eq('month', currentMonth)
      .order('day', { ascending: true });
    if (!error && data) setCelebrations(data);
  }, [currentMonth]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchMembers(), fetchCelebrations()]);
      setLoading(false);
    };
    init();
  }, [fetchMembers, fetchCelebrations]);

  // ── Realtime subscriptions ────────────────────────────────────────────────
  useEffect(() => {
    const membersSub = supabase
      .channel('members-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
        fetchMembers();
      })
      .subscribe();

    const celebSub = supabase
      .channel('celebrations-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'celebrations' }, () => {
        fetchCelebrations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(membersSub);
      supabase.removeChannel(celebSub);
    };
  }, [fetchMembers, fetchCelebrations]);

  // ── Filtered members based on search ─────────────────────────────────────
  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.includes(searchQuery)
  );
  const displayedMembers = showAllMembers ? filteredMembers : filteredMembers.slice(0, 7);

  // ── Member Handlers ───────────────────────────────────────────────────────
  const handleDeleteMember = async () => {
    if (deleteMemberId !== null) {
      await supabase.from('members').delete().eq('id', deleteMemberId);
      setDeleteMemberId(null);
    }
  };

  const handleAddMember = async () => {
    if (newMember.name?.trim() && newMember.phone?.trim()) {
      await supabase.from('members').insert([{
        name: newMember.name,
        phone: newMember.phone,
        gender: newMember.gender || null,
        join_date: newMember.join_date || null,
        birthday_date: newMember.birthday_date || null,
        bio: newMember.bio || null,
      }]);
      setNewMember({});
      setAddMemberOpen(false);
    }
  };

  const handleSaveMemberEdit = async () => {
    if (editMember && editedMember.name?.trim() && editedMember.phone?.trim()) {
      await supabase.from('members').update({
        name: editedMember.name,
        phone: editedMember.phone,
        gender: editedMember.gender || null,
        join_date: editedMember.join_date || null,
        birthday_date: editedMember.birthday_date || null,
        bio: editedMember.bio || null,
      }).eq('id', editMember.id);
      setEditMember(null);
      setEditedMember({});
    }
  };

  const openEditMember = (member: Member) => {
    setEditMember(member);
    setEditedMember({ ...member });
  };

  // ── Celebration Handlers ──────────────────────────────────────────────────
  const handleAddCelebration = async () => {
    if (newCeleb.name?.trim() && newCeleb.day && newCeleb.event?.trim()) {
      await supabase.from('celebrations').insert([{
        name: newCeleb.name,
        day: newCeleb.day,
        month: newCeleb.month || currentMonth,
        event: newCeleb.event,
        color: newCeleb.color || 'bg-red-100 text-red-700 border-red-300',
      }]);
      setNewCeleb({});
      setAddCelebOpen(false);
    }
  };

  const handleSaveCelebEdit = async () => {
    if (editCeleb && editedCeleb.name?.trim() && editedCeleb.event?.trim()) {
      await supabase.from('celebrations').update({
        name: editedCeleb.name,
        day: editedCeleb.day,
        month: editedCeleb.month,
        event: editedCeleb.event,
        color: editedCeleb.color,
      }).eq('id', editCeleb.id);
      setEditCeleb(null);
      setEditedCeleb({});
    }
  };

  const handleDeleteCelebration = async () => {
    if (deleteCelebId !== null) {
      await supabase.from('celebrations').delete().eq('id', deleteCelebId);
      setDeleteCelebId(null);
    }
  };

  const openEditCeleb = (celeb: Celebration) => {
    setEditCeleb(celeb);
    setEditedCeleb({ ...celeb });
  };

  return (
    <div className="space-y-8 pb-20 px-2 sm:px-0">
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight">
            LIST OF MEMBERS
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-600">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-pink-100 p-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
              </div>
              <span className="font-medium text-lg sm:text-xl">{members.length} members</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setAddMemberOpen(true)}
          className="h-10 sm:h-11 px-4 sm:px-6 gap-2 bg-zinc-900 hover:bg-zinc-800 text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add New Member
        </Button>
      </div>

      {/* ── Members List ─────────────────────────────────────────────────────── */}
      <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-4 sm:p-7 pt-4">
          {/* Search */}
          <div className="mb-4 sm:mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search by name or phone..."
              className="h-11 pl-9 rounded-xl w-full"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="py-16 text-center text-zinc-400">Loading members…</div>
          ) : (
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-zinc-50">
                    <TableRow className="h-12 sm:h-14">
                      <TableHead className="pl-4 sm:pl-7 text-zinc-600 font-medium text-sm sm:text-base">
                        Name
                      </TableHead>
                      <TableHead className="text-zinc-600 font-medium text-sm sm:text-base hidden sm:table-cell">
                        Phone
                      </TableHead>
                      <TableHead className="text-right pr-4 sm:pr-7 text-zinc-600 font-medium text-sm sm:text-base">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-10 text-zinc-400">
                          {searchQuery ? 'No members match your search.' : 'No members yet. Add one!'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedMembers.map((member, idx) => (
                        <TableRow key={member.id} className="h-14 sm:h-16 hover:bg-zinc-50/70">
                          <TableCell className="pl-4 sm:pl-7 text-zinc-800 text-sm sm:text-[15px]">
                            <div className="font-medium">{idx + 1}. {member.name}</div>
                            {/* Phone shown below name on mobile */}
                            <div className="text-zinc-500 text-xs sm:hidden mt-0.5">{member.phone}</div>
                          </TableCell>
                          <TableCell className="text-zinc-600 text-sm hidden sm:table-cell">
                            {member.phone}
                          </TableCell>
                          <TableCell className="text-right pr-4 sm:pr-7">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                onClick={() => setDeleteMemberId(member.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
                                onClick={() => setViewMember(member)}
                              >
                                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
                                onClick={() => openEditMember(member)}
                              >
                                <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {filteredMembers.length > 7 && (
            <div className="mt-4 sm:mt-6 text-center">
              <Button variant="link" onClick={() => setShowAllMembers(!showAllMembers)}>
                {showAllMembers ? 'Show Fewer' : `View All (${filteredMembers.length}) >>`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Upcoming Celebrations ────────────────────────────────────────────── */}
      <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-zinc-50/80 pb-4 pt-5 sm:pt-6 px-4 sm:px-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-zinc-800">
            Upcoming Celebrations
          </CardTitle>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <Badge variant="outline" className="px-3 py-1 sm:px-4 sm:py-1.5 bg-zinc-100 border-zinc-300 font-medium text-sm sm:text-[15px]">
              MONTH: {currentMonthName}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 bg-zinc-900 text-white"
              onClick={() => setAddCelebOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-7 pt-2">
          <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-50">
                  <TableRow className="h-12 sm:h-14">
                    <TableHead className="pl-4 sm:pl-7 text-zinc-600 font-medium text-sm sm:text-base">Names</TableHead>
                    <TableHead className="w-16 sm:w-24 text-zinc-600 font-medium text-sm sm:text-base">Day</TableHead>
                    <TableHead className="w-32 sm:w-40 text-zinc-600 font-medium text-sm sm:text-base">Event</TableHead>
                    <TableHead className="w-24 sm:w-32 text-right pr-4 sm:pr-7 text-zinc-600 font-medium text-sm sm:text-base">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {celebrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-zinc-400">
                        No celebrations for {currentMonthName}.
                      </TableCell>
                    </TableRow>
                  ) : (
                    celebrations.map((item, idx) => (
                      <TableRow key={item.id} className="h-14 sm:h-16 hover:bg-zinc-50/70">
                        <TableCell className="pl-4 sm:pl-7 font-medium text-zinc-800 text-sm sm:text-[15px]">
                          {idx + 1}. {item.name}
                        </TableCell>
                        <TableCell className="text-zinc-600 text-sm sm:text-base">{item.day}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${item.color} px-2 sm:px-3 py-1 text-xs sm:text-sm`}>
                            {item.event}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-4 sm:pr-7">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:w-9 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                              onClick={() => setDeleteCelebId(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
                              onClick={() => openEditCeleb(item)}
                            >
                              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Delete Member Confirmation ───────────────────────────────────────── */}
      <AlertDialog open={deleteMemberId !== null} onOpenChange={() => setDeleteMemberId(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl bg-white shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <strong>{members.find(m => m.id === deleteMemberId)?.name}</strong> permanently?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteMember}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Member View Dialog ───────────────────────────────────────────────── */}
      <Dialog open={!!viewMember} onOpenChange={() => setViewMember(null)}>
        <DialogContent className="w-[92vw] sm:max-w-lg rounded-2xl p-5 sm:p-7 bg-white border border-zinc-200 shadow-2xl">
          <DialogHeader className="pb-4 sm:pb-5">
            <DialogTitle className="text-xl sm:text-2xl font-bold pr-8">{viewMember?.name}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute right-4 sm:right-6 top-4 sm:top-6">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6">
            {[
              { label: 'Phone', value: viewMember?.phone },
              { label: 'Gender', value: viewMember?.gender || '—' },
              { label: 'Joined', value: viewMember?.join_date || '—' },
              { label: 'Birthday', value: viewMember?.birthday_date || '—' },
              { label: 'Bio', value: viewMember?.bio || 'No bio provided.' },
            ].map(row => (
              <div key={row.label} className="grid grid-cols-[90px,1fr] sm:grid-cols-[100px,1fr] gap-2 sm:gap-3">
                <div className="text-xs sm:text-sm font-medium text-zinc-500">{row.label}</div>
                <div className="text-sm sm:text-base text-zinc-700">{row.value}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Member Dialog ────────────────────────────────────────────────── */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="w-[92vw] sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
          <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-bold">Add New Member</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-5 sm:px-7 pb-2 space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={newMember.name || ''}
                onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Esteemed Bro. John Ezra"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                value={newMember.phone || ''}
                onChange={e => setNewMember(p => ({ ...p, phone: e.target.value }))}
                placeholder="e.g. 08137999368"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select onValueChange={v => setNewMember(p => ({ ...p, gender: v as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Join Date</Label>
                <Input type="date" onChange={e => setNewMember(p => ({ ...p, join_date: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Birthday Date</Label>
              <Input type="date" onChange={e => setNewMember(p => ({ ...p, birthday_date: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Bio / Notes</Label>
              <Textarea
                value={newMember.bio || ''}
                onChange={e => setNewMember(p => ({ ...p, bio: e.target.value }))}
                rows={3}
                placeholder="Optional notes about this member..."
              />
            </div>
          </div>
          <DialogFooter className="px-5 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 gap-2">
            <Button variant="outline" onClick={() => setAddMemberOpen(false)}>Cancel</Button>
            <Button
              disabled={!newMember.name?.trim() || !newMember.phone?.trim()}
              onClick={handleAddMember}
              className="bg-green-700 text-white hover:bg-green-600"
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Member Dialog ───────────────────────────────────────────────── */}
      <Dialog open={!!editMember} onOpenChange={() => setEditMember(null)}>
        <DialogContent className="w-[92vw] sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
          <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-bold">Edit Member</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-5 sm:px-7 pb-2 space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={editedMember.name || ''}
                onChange={e => setEditedMember(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                value={editedMember.phone || ''}
                onChange={e => setEditedMember(p => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={editedMember.gender}
                  onValueChange={v => setEditedMember(p => ({ ...p, gender: v as any }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Join Date</Label>
                <Input
                  type="date"
                  value={editedMember.join_date || ''}
                  onChange={e => setEditedMember(p => ({ ...p, join_date: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Birthday Date</Label>
              <Input
                type="date"
                value={editedMember.birthday_date || ''}
                onChange={e => setEditedMember(p => ({ ...p, birthday_date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Bio / Notes</Label>
              <Textarea
                value={editedMember.bio || ''}
                onChange={e => setEditedMember(p => ({ ...p, bio: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="px-5 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 gap-2">
            <Button variant="outline" onClick={() => setEditMember(null)}>Cancel</Button>
            <Button
              disabled={!editedMember.name?.trim() || !editedMember.phone?.trim()}
              onClick={handleSaveMemberEdit}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add Celebration Dialog ───────────────────────────────────────────── */}
      <Dialog open={addCelebOpen} onOpenChange={setAddCelebOpen}>
        <DialogContent className="w-[92vw] sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
          <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-bold">Add Celebration</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-5 sm:px-7 pb-2 space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label>Member Name</Label>
              <Select onValueChange={v => setNewCeleb(p => ({ ...p, name: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[200]" position="popper" sideOffset={4}>
                  {members.map(m => (
                    <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select
                  value={String(newCeleb.month || currentMonth)}
                  onValueChange={v => setNewCeleb(p => ({ ...p, month: Number(v) }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white z-[200]" position="popper" sideOffset={4}>
                    {MONTH_NAMES.map((mn, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>{mn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Day of Month</Label>
                <Input
                  type="number"
                  min={1}
                  max={31}
                  value={newCeleb.day || ''}
                  onChange={e => setNewCeleb(p => ({ ...p, day: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Event</Label>
              <Input
                value={newCeleb.event || ''}
                onChange={e => setNewCeleb(p => ({ ...p, event: e.target.value }))}
                placeholder="e.g. Birthday, Wedding Anniversary"
              />
            </div>
            <div className="space-y-2">
              <Label>Color Theme</Label>
              <Select onValueChange={v => setNewCeleb(p => ({ ...p, color: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[200]" position="popper" sideOffset={4}>
                  <SelectItem value="bg-red-100 text-red-700 border-red-300">🔴 Red (Birthday)</SelectItem>
                  <SelectItem value="bg-green-100 text-green-700 border-green-300">🟢 Green (Anniversary)</SelectItem>
                  <SelectItem value="bg-blue-100 text-blue-700 border-blue-300">🔵 Blue</SelectItem>
                  <SelectItem value="bg-purple-100 text-purple-700 border-purple-300">🟣 Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="px-5 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 gap-2">
            <Button variant="outline" onClick={() => setAddCelebOpen(false)}>Cancel</Button>
            <Button
              disabled={!newCeleb.name?.trim() || !newCeleb.day || !newCeleb.event?.trim()}
              onClick={handleAddCelebration}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Add Celebration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Celebration Dialog ──────────────────────────────────────────── */}
      <Dialog open={!!editCeleb} onOpenChange={() => setEditCeleb(null)}>
        <DialogContent className="w-[92vw] sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
          <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-bold">Edit Celebration</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-5 sm:px-7 pb-2 space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label>Member Name</Label>
              <Select
                value={editedCeleb.name}
                onValueChange={v => setEditedCeleb(p => ({ ...p, name: v }))}
              >
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white z-[200]" position="popper" sideOffset={4}>
                  {members.map(m => (
                    <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select
                  value={String(editedCeleb.month || '')}
                  onValueChange={v => setEditedCeleb(p => ({ ...p, month: Number(v) }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white z-[200]" position="popper" sideOffset={4}>
                    {MONTH_NAMES.map((mn, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>{mn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Day of Month</Label>
                <Input
                  type="number"
                  min={1}
                  max={31}
                  value={editedCeleb.day || ''}
                  onChange={e => setEditedCeleb(p => ({ ...p, day: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Event</Label>
              <Input
                value={editedCeleb.event || ''}
                onChange={e => setEditedCeleb(p => ({ ...p, event: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Color Theme</Label>
              <Select
                value={editedCeleb.color}
                onValueChange={v => setEditedCeleb(p => ({ ...p, color: v }))}
              >
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white z-[200]" position="popper" sideOffset={4}>
                  <SelectItem value="bg-red-100 text-red-700 border-red-300">🔴 Red (Birthday)</SelectItem>
                  <SelectItem value="bg-green-100 text-green-700 border-green-300">🟢 Green (Anniversary)</SelectItem>
                  <SelectItem value="bg-blue-100 text-blue-700 border-blue-300">🔵 Blue</SelectItem>
                  <SelectItem value="bg-purple-100 text-purple-700 border-purple-300">🟣 Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="px-5 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 gap-2">
            <Button variant="outline" onClick={() => setEditCeleb(null)}>Cancel</Button>
            <Button
              disabled={!editedCeleb.name?.trim() || !editedCeleb.event?.trim()}
              onClick={handleSaveCelebEdit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Celebration Confirmation ──────────────────────────────────── */}
      <AlertDialog open={deleteCelebId !== null} onOpenChange={() => setDeleteCelebId(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl bg-white shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this celebration?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={handleDeleteCelebration}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}













