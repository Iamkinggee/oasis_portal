
'use client';

import { useState } from 'react';
import {
  Trash2,
  Eye,
  Pencil,
  Plus,
  Users,
  X,
} from 'lucide-react';

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
  AlertDialogTrigger,
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

// ── Types ────────────────────────────────────────────────────────────────────
type Member = {
  id: number;
  name: string;
  phone: string;
  birthdayDate?: string;
  bio?: string;
  gender?: 'Male' | 'Female';
  joinDate?: string;
};

type Celebration = {
  id: number;
  name: string;
  day: number;
  event: string;
  color: string;
};

const initialMembers: Member[] = [
  { id: 1, name: 'Esteemed Bro. John Ezra', phone: '0813799936873', birthdayDate: '1990-03-04' },
  { id: 2, name: 'Esteemed Bro. James Paul', phone: '0813790333873' },
  { id: 3, name: 'Esteemed Bro. Samuel Oke', phone: '0813799033873' },
  { id: 4, name: 'Esteemed Bro. David Nwosu', phone: '0813799036873', birthdayDate: '1985-03-15' },
  { id: 5, name: 'Esteemed Bro. Peter Adeyemi', phone: '0816750688373' },
  { id: 6, name: 'Esteemed Bro. Philip Chukwu', phone: '08137993344873' },
  { id: 7, name: 'Esteemed Bro. Andrew Bello', phone: '0812890638873' },
  { id: 8, name: 'Sis. Mary Grace', phone: '0809123456789', birthdayDate: '1992-03-22' },
];

const initialCelebrations: Celebration[] = [
  { id: 1, name: 'Esteemed Bro. John Ezra', day: 4, event: 'Birthday', color: 'bg-red-100 text-red-700 border-red-300' },
  { id: 2, name: 'Esteemed Sis. Praise Oluchi', day: 21, event: 'Wedding Anniv.', color: 'bg-green-100 text-green-700 border-green-300' },
];

// ── Page Component ───────────────────────────────────────────────────────────
export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [celebrations, setCelebrations] = useState<Celebration[]>(initialCelebrations);

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

  const displayedMembers = showAllMembers ? members : members.slice(0, 7);

  // ── Member Handlers ───────────────────────────────────────────────────────
  const handleDeleteMember = () => {
    if (deleteMemberId !== null) {
      setMembers(prev => prev.filter(m => m.id !== deleteMemberId));
      setDeleteMemberId(null);
    }
  };

  const handleAddMember = () => {
    if (newMember.name?.trim() && newMember.phone?.trim()) {
      const nextId = Math.max(...members.map(m => m.id), 0) + 1;
      setMembers(prev => [...prev, { id: nextId, ...newMember } as Member]);
      setNewMember({});
      setAddMemberOpen(false);
    }
  };

  const handleSaveMemberEdit = () => {
    if (editMember && editedMember.name?.trim() && editedMember.phone?.trim()) {
      setMembers(prev =>
        prev.map(m =>
          m.id === editMember.id ? { ...editMember, ...editedMember } : m
        )
      );
      setEditMember(null);
      setEditedMember({});
    }
  };

  const openEditMember = (member: Member) => {
    setEditMember(member);
    setEditedMember({ ...member });
  };

  // ── Celebration Handlers ──────────────────────────────────────────────────
  const handleAddCelebration = () => {
    if (newCeleb.name?.trim() && newCeleb.day && newCeleb.event?.trim()) {
      const nextId = Math.max(...celebrations.map(c => c.id), 0) + 1;
      setCelebrations(prev => [...prev, { id: nextId, ...newCeleb } as Celebration]);
      setNewCeleb({});
      setAddCelebOpen(false);
    }
  };

  const handleSaveCelebEdit = () => {
    if (editCeleb && editedCeleb.name?.trim() && editedCeleb.event?.trim()) {
      setCelebrations(prev =>
        prev.map(c =>
          c.id === editCeleb.id ? { ...editCeleb, ...editedCeleb } : c
        )
      );
      setEditCeleb(null);
      setEditedCeleb({});
    }
  };

  const handleDeleteCelebration = () => {
    if (deleteCelebId !== null) {
      setCelebrations(prev => prev.filter(c => c.id !== deleteCelebId));
      setDeleteCelebId(null);
    }
  };

  const openEditCeleb = (celeb: Celebration) => {
    setEditCeleb(celeb);
    setEditedCeleb({ ...celeb });
  };

  return (
    <div className="space-y-10 pb-20">
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-zinc-800 tracking-tight">
            LIST OF MEMBERS
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2 text-zinc-600">
            <div className="flex items-center gap-2.5">
              <div className="rounded-full bg-pink-100 p-2">
                <Users className="h-5 w-5 text-pink-600" />
              </div>
              <span className="font-medium text-xl">{members.length} members</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setAddMemberOpen(true)}
          className="h-11 px-6 gap-2 bg-zinc-900 hover:bg-zinc-800 text-white"
        >
          <Plus className="h-4 w-4" />
          Add New Member
        </Button>
      </div>

      {/* ── Members List ─────────────────────────────────────────────────────── */}
      <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-7 pt-4">
          <div className="mb-6">
            <Input placeholder="Search members..." className="h-11 max-w-sm rounded-xl" />
          </div>

          <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow className="h-14">
                  <TableHead className="pl-7 text-zinc-600 font-medium text-base">Name</TableHead>
                  <TableHead className="text-right pr-7 text-zinc-600 font-medium text-base">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedMembers.map((member, idx) => (
                  <TableRow key={member.id} className="h-16 hover:bg-zinc-50/70">
                    <TableCell className="pl-7 font-medium text-zinc-800 text-[15px]">
                      {idx + 1}. {member.name}
                      <span className="ml-20"> – </span>
                      <span className="ml-20">{member.phone}</span>
                    </TableCell>
                    <TableCell className="text-right pr-7">
                      <div className="flex items-center justify-end gap-1.5">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                              onClick={() => setDeleteMemberId(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-md rounded-2xl bg-white shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Remove <strong>{member.name}</strong> permanently?
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

                        <Button variant="ghost" size="icon" onClick={() => setViewMember(member)}>
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="icon" onClick={() => openEditMember(member)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => setShowAllMembers(!showAllMembers)}>
              {showAllMembers ? 'Show Fewer' : 'View All >>'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Upcoming Celebrations ────────────────────────────────────────────── */}
      <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-zinc-50/80 pb-4 pt-6 px-7 flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-zinc-800">
            Upcoming Celebrations
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-1.5 bg-zinc-100 border-zinc-300 p-2 font-medium text-[15px]">
              MONTH : March
            </Badge>
            <Button variant="outline" size="sm" className="gap-1.5 bg-zinc-900 text-white" onClick={() => setAddCelebOpen(true)}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-7 pt-2">
          <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow className="h-14">
                  <TableHead className="pl-7">Names</TableHead>
                  <TableHead className="w-24">DAY</TableHead>
                  <TableHead className="w-40">Event</TableHead>
                  <TableHead className="w-32 text-right pr-7">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {celebrations.map((item, idx) => (
                  <TableRow key={item.id} className="h-16 hover:bg-zinc-50/70">
                    <TableCell className="pl-7 font-medium">
                      {idx + 1}. {item.name}
                    </TableCell>
                    <TableCell>{item.day}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${item.color} px-3 py-1`}>
                        {item.event}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-7">
                      <div className="flex justify-end gap-1.5">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteCelebId(item.id)}>
                              <Trash2 className="h-4 w-4 text-zinc-500 hover:text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-md rounded-2xl bg-white shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Celebration?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Remove <strong>{item.event}</strong> for {item.name}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteCelebration}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button variant="ghost" size="icon" onClick={() => openEditCeleb(item)}>
                          <Pencil className="h-4 w-4 hover:text-emerald-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 text-center">
            <Button variant="link">View All</Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Member View Dialog ───────────────────────────────────────────────── */}
      <Dialog open={!!viewMember} onOpenChange={() => setViewMember(null)}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-7 bg-white border border-zinc-200 shadow-2xl">
          <DialogHeader className="pb-5">
            <DialogTitle className="text-2xl font-bold">{viewMember?.name}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute right-6 top-6">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-[100px,1fr] gap-3">
              <div className="text-sm font-medium text-zinc-500">Phone</div>
              <div>{viewMember?.phone}</div>
            </div>
            <div className="grid grid-cols-[100px,1fr] gap-3">
              <div className="text-sm font-medium text-zinc-500">Gender</div>
              <div>{viewMember?.gender || '—'}</div>
            </div>
            <div className="grid grid-cols-[100px,1fr] gap-3">
              <div className="text-sm font-medium text-zinc-500">Joined</div>
              <div>{viewMember?.joinDate || '—'}</div>
            </div>
            <div className="grid grid-cols-[100px,1fr] gap-3">
              <div className="text-sm font-medium text-zinc-500">Birthday</div>
              <div>{viewMember?.birthdayDate || '—'}</div>
            </div>
            <div className="grid grid-cols-[100px,1fr] gap-3">
              <div className="text-sm font-medium text-zinc-500">Bio</div>
              <div className="text-zinc-700">{viewMember?.bio || 'No bio provided.'}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Member Dialog ────────────────────────────────────────────────── */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
          <DialogHeader className="px-7 pt-7 pb-4 shrink-0">
            <DialogTitle className="text-2xl font-bold">Add New Member</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-7 pb-2 space-y-5">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={newMember.name || ''}
                onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                value={newMember.phone || ''}
                onChange={e => setNewMember(p => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <Input type="date" onChange={e => setNewMember(p => ({ ...p, joinDate: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Birthday Date</Label>
              <Input type="date" onChange={e => setNewMember(p => ({ ...p, birthdayDate: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Bio / Notes</Label>
              <Textarea
                value={newMember.bio || ''}
                onChange={e => setNewMember(p => ({ ...p, bio: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="px-7 py-5 border-t border-zinc-100 shrink-0">
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
        <DialogContent className="sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
          <DialogHeader className="px-7 pt-7 pb-4 shrink-0">
            <DialogTitle className="text-2xl font-bold">Edit Member</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-7 pb-2 space-y-5">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={editedMember.gender}
                  onValueChange={v => setEditedMember(p => ({ ...p, gender: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
                  value={editedMember.joinDate || ''}
                  onChange={e => setEditedMember(p => ({ ...p, joinDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Birthday Date</Label>
              <Input
                type="date"
                value={editedMember.birthdayDate || ''}
                onChange={e => setEditedMember(p => ({ ...p, birthdayDate: e.target.value }))}
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
          <DialogFooter className="px-7 py-5 border-t border-zinc-100 shrink-0">
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
        <DialogContent className="sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
          <DialogHeader className="px-7 pt-7 pb-4 shrink-0">
            <DialogTitle className="text-2xl font-bold">Add Celebration</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-7 pb-2 space-y-5">
            <div className="space-y-2">
              <Label>Name</Label>
              <Select onValueChange={v => setNewCeleb(p => ({ ...p, name: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent
                  className="bg-white z-[200]"
                  position="popper"
                  sideOffset={4}
                >
                  {members.map(m => (
                    <SelectItem key={m.id} value={m.name}>
                      {m.name}
                    </SelectItem>
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
            <div className="space-y-2">
              <Label>Event</Label>
              <Input
                value={newCeleb.event || ''}
                onChange={e => setNewCeleb(p => ({ ...p, event: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Color Theme</Label>
              <Select onValueChange={v => setNewCeleb(p => ({ ...p, color: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent
                  className="bg-white z-[200]"
                  position="popper"
                  sideOffset={4}
                >
                  <SelectItem value="bg-red-100 text-red-700 border-red-300">Red (Birthday)</SelectItem>
                  <SelectItem value="bg-green-100 text-green-700 border-green-300">Green (Anniversary)</SelectItem>
                  <SelectItem value="bg-blue-100 text-blue-700 border-blue-300">Blue</SelectItem>
                  <SelectItem value="bg-purple-100 text-purple-700 border-purple-300">Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="px-7 py-5 border-t border-zinc-100 shrink-0">
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
        <DialogContent className="sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
          <DialogHeader className="px-7 pt-7 pb-4 shrink-0">
            <DialogTitle className="text-2xl font-bold">Edit Celebration</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-7 pb-2 space-y-5">
            <div className="space-y-2">
              <Label>Name</Label>
              <Select
                value={editedCeleb.name}
                onValueChange={v => setEditedCeleb(p => ({ ...p, name: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent
                  className="bg-white z-[200]"
                  position="popper"
                  sideOffset={4}
                >
                  {members.map(m => (
                    <SelectItem key={m.id} value={m.name}>
                      {m.name}
                    </SelectItem>
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
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="bg-white z-[200]"
                  position="popper"
                  sideOffset={4}
                >
                  <SelectItem value="bg-red-100 text-red-700 border-red-300">Red (Birthday)</SelectItem>
                  <SelectItem value="bg-green-100 text-green-700 border-green-300">Green (Anniversary)</SelectItem>
                  <SelectItem value="bg-blue-100 text-blue-700 border-blue-300">Blue</SelectItem>
                  <SelectItem value="bg-purple-100 text-purple-700 border-purple-300">Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="px-7 py-5 border-t border-zinc-100 shrink-0">
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
        <AlertDialogContent className="max-w-md rounded-2xl bg-white shadow-2xl">
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