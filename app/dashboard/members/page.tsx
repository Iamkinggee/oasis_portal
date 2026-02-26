
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import {
//   Trash2,
//   Eye,
//   Pencil,
//   Plus,
//   Users,
//   X,
//   Search,
// } from 'lucide-react';

// import { createClient } from '@supabase/supabase-js';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogClose,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// // ── Supabase Client ──────────────────────────────────────────────────────────
// // Replace with your actual Supabase URL and anon key from Project Settings > API
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
// );

// // ── Types ────────────────────────────────────────────────────────────────────
// type Member = {
//   id: number;
//   name: string;
//   phone: string;
//   birthday_date?: string;
//   bio?: string;
//   gender?: 'Male' | 'Female';
//   join_date?: string;
//   created_at?: string;
// };

// type Celebration = {
//   id: number;
//   name: string;
//   day: number;
//   month: number;
//   event: string;
//   color: string;
//   created_at?: string;
// };

// // ── Helpers ──────────────────────────────────────────────────────────────────
// const MONTH_NAMES = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December'
// ];

// // ── Page Component ───────────────────────────────────────────────────────────
// export default function MembersPage() {
//   const [members, setMembers] = useState<Member[]>([]);
//   const [celebrations, setCelebrations] = useState<Celebration[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');

//   // Current month is live — updates automatically
//   const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);
//   const [currentMonthName, setCurrentMonthName] = useState(() => MONTH_NAMES[new Date().getMonth()]);

//   const [showAllMembers, setShowAllMembers] = useState(false);
//   const [viewMember, setViewMember] = useState<Member | null>(null);
//   const [editMember, setEditMember] = useState<Member | null>(null);
//   const [addMemberOpen, setAddMemberOpen] = useState(false);
//   const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null);

//   const [newMember, setNewMember] = useState<Partial<Member>>({});
//   const [editedMember, setEditedMember] = useState<Partial<Member>>({});

//   const [addCelebOpen, setAddCelebOpen] = useState(false);
//   const [editCeleb, setEditCeleb] = useState<Celebration | null>(null);
//   const [deleteCelebId, setDeleteCelebId] = useState<number | null>(null);
//   const [newCeleb, setNewCeleb] = useState<Partial<Celebration>>({});
//   const [editedCeleb, setEditedCeleb] = useState<Partial<Celebration>>({});

//   // ── Keep month in sync with real time ────────────────────────────────────
//   useEffect(() => {
//     const checkMonth = () => {
//       const now = new Date();
//       const m = now.getMonth() + 1;
//       setCurrentMonth(m);
//       setCurrentMonthName(MONTH_NAMES[now.getMonth()]);
//     };
//     checkMonth();
//     // Check every hour in case the month rolls over
//     const interval = setInterval(checkMonth, 3600 * 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // ── Fetch members ─────────────────────────────────────────────────────────
//   const fetchMembers = useCallback(async () => {
//     const { data, error } = await supabase
//       .from('members')
//       .select('*')
//       .order('created_at', { ascending: true });
//     if (!error && data) setMembers(data);
//   }, []);

//   // ── Fetch celebrations for current month ──────────────────────────────────
//   const fetchCelebrations = useCallback(async () => {
//     const { data, error } = await supabase
//       .from('celebrations')
//       .select('*')
//       .eq('month', currentMonth)
//       .order('day', { ascending: true });
//     if (!error && data) setCelebrations(data);
//   }, [currentMonth]);

//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       await Promise.all([fetchMembers(), fetchCelebrations()]);
//       setLoading(false);
//     };
//     init();
//   }, [fetchMembers, fetchCelebrations]);

//   // ── Realtime subscriptions ────────────────────────────────────────────────
//   useEffect(() => {
//     const membersSub = supabase
//       .channel('members-channel')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
//         fetchMembers();
//       })
//       .subscribe();

//     const celebSub = supabase
//       .channel('celebrations-channel')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'celebrations' }, () => {
//         fetchCelebrations();
//       })
//       .subscribe();

//     return () => {
//       supabase.removeChannel(membersSub);
//       supabase.removeChannel(celebSub);
//     };
//   }, [fetchMembers, fetchCelebrations]);

//   // ── Filtered members based on search ─────────────────────────────────────
//   const filteredMembers = members.filter(m =>
//     m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     m.phone.includes(searchQuery)
//   );
//   const displayedMembers = showAllMembers ? filteredMembers : filteredMembers.slice(0, 7);

//   // ── Member Handlers ───────────────────────────────────────────────────────
//   const handleDeleteMember = async () => {
//     if (deleteMemberId !== null) {
//       await supabase.from('members').delete().eq('id', deleteMemberId);
//       setDeleteMemberId(null);
//     }
//   };

//   const handleAddMember = async () => {
//     if (newMember.name?.trim() && newMember.phone?.trim()) {
//       await supabase.from('members').insert([{
//         name: newMember.name,
//         phone: newMember.phone,
//         gender: newMember.gender || null,
//         join_date: newMember.join_date || null,
//         birthday_date: newMember.birthday_date || null,
//         bio: newMember.bio || null,
//       }]);
//       setNewMember({});
//       setAddMemberOpen(false);
//     }
//   };

//   const handleSaveMemberEdit = async () => {
//     if (editMember && editedMember.name?.trim() && editedMember.phone?.trim()) {
//       await supabase.from('members').update({
//         name: editedMember.name,
//         phone: editedMember.phone,
//         gender: editedMember.gender || null,
//         join_date: editedMember.join_date || null,
//         birthday_date: editedMember.birthday_date || null,
//         bio: editedMember.bio || null,
//       }).eq('id', editMember.id);
//       setEditMember(null);
//       setEditedMember({});
//     }
//   };

//   const openEditMember = (member: Member) => {
//     setEditMember(member);
//     setEditedMember({ ...member });
//   };

//   // ── Celebration Handlers ──────────────────────────────────────────────────
//   const handleAddCelebration = async () => {
//     if (newCeleb.name?.trim() && newCeleb.day && newCeleb.event?.trim()) {
//       await supabase.from('celebrations').insert([{
//         name: newCeleb.name,
//         day: newCeleb.day,
//         month: newCeleb.month || currentMonth,
//         event: newCeleb.event,
//         color: newCeleb.color || 'bg-red-100 text-red-700 border-red-300',
//       }]);
//       setNewCeleb({});
//       setAddCelebOpen(false);
//     }
//   };

//   const handleSaveCelebEdit = async () => {
//     if (editCeleb && editedCeleb.name?.trim() && editedCeleb.event?.trim()) {
//       await supabase.from('celebrations').update({
//         name: editedCeleb.name,
//         day: editedCeleb.day,
//         month: editedCeleb.month,
//         event: editedCeleb.event,
//         color: editedCeleb.color,
//       }).eq('id', editCeleb.id);
//       setEditCeleb(null);
//       setEditedCeleb({});
//     }
//   };

//   const handleDeleteCelebration = async () => {
//     if (deleteCelebId !== null) {
//       await supabase.from('celebrations').delete().eq('id', deleteCelebId);
//       setDeleteCelebId(null);
//     }
//   };

//   const openEditCeleb = (celeb: Celebration) => {
//     setEditCeleb(celeb);
//     setEditedCeleb({ ...celeb });
//   };

//   return (
//     <div className="space-y-8 pb-20 px-2 sm:px-0">
//       {/* ── Header ───────────────────────────────────────────────────────────── */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-zinc-800 tracking-tight">
//             LIST OF MEMBERS
//           </h1>
//           <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-600">
//             <div className="flex items-center gap-2">
//               <div className="rounded-full bg-pink-100 p-2">
//                 <Users className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
//               </div>
//               <span className="font-medium text-lg sm:text-xl">{members.length} members</span>
//             </div>
//           </div>
//         </div>

//         <Button
//           onClick={() => setAddMemberOpen(true)}
//           className="h-10 sm:h-11 px-4 sm:px-6 gap-2 bg-zinc-900 hover:bg-zinc-800 text-white w-full sm:w-auto"
//         >
//           <Plus className="h-4 w-4" />
//           Add New Member
//         </Button>
//       </div>

//       {/* ── Members List ─────────────────────────────────────────────────────── */}
//       <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
//         <CardContent className="p-4 sm:p-7 pt-4">
//           {/* Search */}
//           <div className="mb-4 sm:mb-6 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
//             <Input
//               placeholder="Search by name or phone..."
//               className="h-11 pl-9 rounded-xl w-full"
//               value={searchQuery}
//               onChange={e => setSearchQuery(e.target.value)}
//             />
//           </div>

//           {loading ? (
//             <div className="py-16 text-center text-zinc-400">Loading members…</div>
//           ) : (
//             <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader className="bg-zinc-50">
//                     <TableRow className="h-12 sm:h-14">
//                       <TableHead className="pl-4 sm:pl-7 text-zinc-600 font-medium text-sm sm:text-base">
//                         Name
//                       </TableHead>
//                       <TableHead className="text-zinc-600 font-medium text-sm sm:text-base hidden sm:table-cell">
//                         Phone
//                       </TableHead>
//                       <TableHead className="text-right pr-4 sm:pr-7 text-zinc-600 font-medium text-sm sm:text-base">
//                         Actions
//                       </TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {displayedMembers.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={3} className="text-center py-10 text-zinc-400">
//                           {searchQuery ? 'No members match your search.' : 'No members yet. Add one!'}
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       displayedMembers.map((member, idx) => (
//                         <TableRow key={member.id} className="h-14 sm:h-16 hover:bg-zinc-50/70">
//                           <TableCell className="pl-4 sm:pl-7 text-zinc-800 text-sm sm:text-[15px]">
//                             <div className="font-medium">{idx + 1}. {member.name}</div>
//                             {/* Phone shown below name on mobile */}
//                             <div className="text-zinc-500 text-xs sm:hidden mt-0.5">{member.phone}</div>
//                           </TableCell>
//                           <TableCell className="text-zinc-600 text-sm hidden sm:table-cell">
//                             {member.phone}
//                           </TableCell>
//                           <TableCell className="text-right pr-4 sm:pr-7">
//                             <div className="flex items-center justify-end gap-1">
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-8 w-8 sm:h-9 sm:w-9 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full"
//                                 onClick={() => setDeleteMemberId(member.id)}
//                               >
//                                 <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
//                                 onClick={() => setViewMember(member)}
//                               >
//                                 <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
//                                 onClick={() => openEditMember(member)}
//                               >
//                                 <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           )}

//           {filteredMembers.length > 7 && (
//             <div className="mt-4 sm:mt-6 text-center">
//               <Button variant="link" onClick={() => setShowAllMembers(!showAllMembers)}>
//                 {showAllMembers ? 'Show Fewer' : `View All (${filteredMembers.length}) >>`}
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* ── Upcoming Celebrations ────────────────────────────────────────────── */}
//       <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
//         <CardHeader className="bg-zinc-50/80 pb-4 pt-5 sm:pt-6 px-4 sm:px-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//           <CardTitle className="text-xl sm:text-2xl font-semibold text-zinc-800">
//             Upcoming Celebrations
//           </CardTitle>
//           <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
//             <Badge variant="outline" className="px-3 py-1 sm:px-4 sm:py-1.5 bg-zinc-100 border-zinc-300 font-medium text-sm sm:text-[15px]">
//               MONTH: {currentMonthName}
//             </Badge>
//             <Button
//               variant="outline"
//               size="sm"
//               className="gap-1.5 bg-zinc-900 text-white"
//               onClick={() => setAddCelebOpen(true)}
//             >
//               <Plus className="h-4 w-4" />
//               Add
//             </Button>
//           </div>
//         </CardHeader>

//         <CardContent className="p-4 sm:p-7 pt-2">
//           <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader className="bg-zinc-50">
//                   <TableRow className="h-12 sm:h-14">
//                     <TableHead className="pl-4 sm:pl-7 text-zinc-600 font-medium text-sm sm:text-base">Names</TableHead>
//                     <TableHead className="w-16 sm:w-24 text-zinc-600 font-medium text-sm sm:text-base">Day</TableHead>
//                     <TableHead className="w-32 sm:w-40 text-zinc-600 font-medium text-sm sm:text-base">Event</TableHead>
//                     <TableHead className="w-24 sm:w-32 text-right pr-4 sm:pr-7 text-zinc-600 font-medium text-sm sm:text-base">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {celebrations.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={4} className="text-center py-10 text-zinc-400">
//                         No celebrations for {currentMonthName}.
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     celebrations.map((item, idx) => (
//                       <TableRow key={item.id} className="h-14 sm:h-16 hover:bg-zinc-50/70">
//                         <TableCell className="pl-4 sm:pl-7 font-medium text-zinc-800 text-sm sm:text-[15px]">
//                           {idx + 1}. {item.name}
//                         </TableCell>
//                         <TableCell className="text-zinc-600 text-sm sm:text-base">{item.day}</TableCell>
//                         <TableCell>
//                           <Badge variant="outline" className={`${item.color} px-2 sm:px-3 py-1 text-xs sm:text-sm`}>
//                             {item.event}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="text-right pr-4 sm:pr-7">
//                           <div className="flex justify-end gap-1">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8 sm:h-9 sm:w-9 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full"
//                               onClick={() => setDeleteCelebId(item.id)}
//                             >
//                               <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
//                               onClick={() => openEditCeleb(item)}
//                             >
//                               <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* ── Delete Member Confirmation ───────────────────────────────────────── */}
//       <AlertDialog open={deleteMemberId !== null} onOpenChange={() => setDeleteMemberId(null)}>
//         <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl bg-white shadow-2xl">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
//             <AlertDialogDescription>
//               Remove <strong>{members.find(m => m.id === deleteMemberId)?.name}</strong> permanently?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteMember}>
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* ── Member View Dialog ───────────────────────────────────────────────── */}
//       <Dialog open={!!viewMember} onOpenChange={() => setViewMember(null)}>
//         <DialogContent className="w-[92vw] sm:max-w-lg rounded-2xl p-5 sm:p-7 bg-white border border-zinc-200 shadow-2xl">
//           <DialogHeader className="pb-4 sm:pb-5">
//             <DialogTitle className="text-xl sm:text-2xl font-bold pr-8">{viewMember?.name}</DialogTitle>
//             <DialogClose asChild>
//               <Button variant="ghost" size="icon" className="absolute right-4 sm:right-6 top-4 sm:top-6">
//                 <X className="h-5 w-5" />
//               </Button>
//             </DialogClose>
//           </DialogHeader>
//           <div className="space-y-4 sm:space-y-6">
//             {[
//               { label: 'Phone', value: viewMember?.phone },
//               { label: 'Gender', value: viewMember?.gender || '—' },
//               { label: 'Joined', value: viewMember?.join_date || '—' },
//               { label: 'Birthday', value: viewMember?.birthday_date || '—' },
//               { label: 'Bio', value: viewMember?.bio || 'No bio provided.' },
//             ].map(row => (
//               <div key={row.label} className="grid grid-cols-[90px,1fr] sm:grid-cols-[100px,1fr] gap-2 sm:gap-3">
//                 <div className="text-xs sm:text-sm font-medium text-zinc-500">{row.label}</div>
//                 <div className="text-sm sm:text-base text-zinc-700">{row.value}</div>
//               </div>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ── Add Member Dialog ────────────────────────────────────────────────── */}
//       <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
//         <DialogContent className="w-[92vw] sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
//           <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 shrink-0">
//             <DialogTitle className="text-xl sm:text-2xl font-bold">Add New Member</DialogTitle>
//           </DialogHeader>
//           <div className="overflow-y-auto flex-1 px-5 sm:px-7 pb-2 space-y-4 sm:space-y-5">
//             <div className="space-y-2">
//               <Label>Full Name *</Label>
//               <Input
//                 value={newMember.name || ''}
//                 onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
//                 placeholder="e.g. Esteemed Bro. John Ezra"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Phone Number *</Label>
//               <Input
//                 value={newMember.phone || ''}
//                 onChange={e => setNewMember(p => ({ ...p, phone: e.target.value }))}
//                 placeholder="e.g. 08137999368"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-3 sm:gap-4">
//               <div className="space-y-2">
//                 <Label>Gender</Label>
//                 <Select onValueChange={v => setNewMember(p => ({ ...p, gender: v as any }))}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white">
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Join Date</Label>
//                 <Input type="date" onChange={e => setNewMember(p => ({ ...p, join_date: e.target.value }))} />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Birthday Date</Label>
//               <Input type="date" onChange={e => setNewMember(p => ({ ...p, birthday_date: e.target.value }))} />
//             </div>
//             <div className="space-y-2">
//               <Label>Bio / Notes</Label>
//               <Textarea
//                 value={newMember.bio || ''}
//                 onChange={e => setNewMember(p => ({ ...p, bio: e.target.value }))}
//                 rows={3}
//                 placeholder="Optional notes about this member..."
//               />
//             </div>
//           </div>
//           <DialogFooter className="px-5 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 gap-2">
//             <Button variant="outline" onClick={() => setAddMemberOpen(false)}>Cancel</Button>
//             <Button
//               disabled={!newMember.name?.trim() || !newMember.phone?.trim()}
//               onClick={handleAddMember}
//               className="bg-green-700 text-white hover:bg-green-600"
//             >
//               Add Member
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ── Edit Member Dialog ───────────────────────────────────────────────── */}
//       <Dialog open={!!editMember} onOpenChange={() => setEditMember(null)}>
//         <DialogContent className="w-[92vw] sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
//           <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 shrink-0">
//             <DialogTitle className="text-xl sm:text-2xl font-bold">Edit Member</DialogTitle>
//           </DialogHeader>
//           <div className="overflow-y-auto flex-1 px-5 sm:px-7 pb-2 space-y-4 sm:space-y-5">
//             <div className="space-y-2">
//               <Label>Full Name *</Label>
//               <Input
//                 value={editedMember.name || ''}
//                 onChange={e => setEditedMember(p => ({ ...p, name: e.target.value }))}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Phone Number *</Label>
//               <Input
//                 value={editedMember.phone || ''}
//                 onChange={e => setEditedMember(p => ({ ...p, phone: e.target.value }))}
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-3 sm:gap-4">
//               <div className="space-y-2">
//                 <Label>Gender</Label>
//                 <Select
//                   value={editedMember.gender}
//                   onValueChange={v => setEditedMember(p => ({ ...p, gender: v as any }))}
//                 >
//                   <SelectTrigger><SelectValue /></SelectTrigger>
//                   <SelectContent className="bg-white">
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Join Date</Label>
//                 <Input
//                   type="date"
//                   value={editedMember.join_date || ''}
//                   onChange={e => setEditedMember(p => ({ ...p, join_date: e.target.value }))}
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Birthday Date</Label>
//               <Input
//                 type="date"
//                 value={editedMember.birthday_date || ''}
//                 onChange={e => setEditedMember(p => ({ ...p, birthday_date: e.target.value }))}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Bio / Notes</Label>
//               <Textarea
//                 value={editedMember.bio || ''}
//                 onChange={e => setEditedMember(p => ({ ...p, bio: e.target.value }))}
//                 rows={3}
//               />
//             </div>
//           </div>
//           <DialogFooter className="px-5 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 gap-2">
//             <Button variant="outline" onClick={() => setEditMember(null)}>Cancel</Button>
//             <Button
//               disabled={!editedMember.name?.trim() || !editedMember.phone?.trim()}
//               onClick={handleSaveMemberEdit}
//               className="bg-emerald-600 text-white hover:bg-emerald-700"
//             >
//               Save Changes
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ── Add Celebration Dialog ───────────────────────────────────────────── */}
//       <Dialog open={addCelebOpen} onOpenChange={setAddCelebOpen}>
//         <DialogContent className="w-[92vw] sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
//           <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 shrink-0">
//             <DialogTitle className="text-xl sm:text-2xl font-bold">Add Celebration</DialogTitle>
//           </DialogHeader>
//           <div className="overflow-y-auto flex-1 px-5 sm:px-7 pb-2 space-y-4 sm:space-y-5">
//             <div className="space-y-2">
//               <Label>Member Name</Label>
//               <Select onValueChange={v => setNewCeleb(p => ({ ...p, name: v }))}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select a member" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-white z-[200]" position="popper" sideOffset={4}>
//                   {members.map(m => (
//                     <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid grid-cols-2 gap-3 sm:gap-4">
//               <div className="space-y-2">
//                 <Label>Month</Label>
//                 <Select
//                   value={String(newCeleb.month || currentMonth)}
//                   onValueChange={v => setNewCeleb(p => ({ ...p, month: Number(v) }))}
//                 >
//                   <SelectTrigger><SelectValue /></SelectTrigger>
//                   <SelectContent className="bg-white z-[200]" position="popper" sideOffset={4}>
//                     {MONTH_NAMES.map((mn, i) => (
//                       <SelectItem key={i + 1} value={String(i + 1)}>{mn}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Day of Month</Label>
//                 <Input
//                   type="number"
//                   min={1}
//                   max={31}
//                   value={newCeleb.day || ''}
//                   onChange={e => setNewCeleb(p => ({ ...p, day: Number(e.target.value) }))}
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Event</Label>
//               <Input
//                 value={newCeleb.event || ''}
//                 onChange={e => setNewCeleb(p => ({ ...p, event: e.target.value }))}
//                 placeholder="e.g. Birthday, Wedding Anniversary"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Color Theme</Label>
//               <Select onValueChange={v => setNewCeleb(p => ({ ...p, color: v }))}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select color" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-white z-[200]" position="popper" sideOffset={4}>
//                   <SelectItem value="bg-red-100 text-red-700 border-red-300">🔴 Red (Birthday)</SelectItem>
//                   <SelectItem value="bg-green-100 text-green-700 border-green-300">🟢 Green (Anniversary)</SelectItem>
//                   <SelectItem value="bg-blue-100 text-blue-700 border-blue-300">🔵 Blue</SelectItem>
//                   <SelectItem value="bg-purple-100 text-purple-700 border-purple-300">🟣 Purple</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <DialogFooter className="px-5 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 gap-2">
//             <Button variant="outline" onClick={() => setAddCelebOpen(false)}>Cancel</Button>
//             <Button
//               disabled={!newCeleb.name?.trim() || !newCeleb.day || !newCeleb.event?.trim()}
//               onClick={handleAddCelebration}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white"
//             >
//               Add Celebration
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ── Edit Celebration Dialog ──────────────────────────────────────────── */}
//       <Dialog open={!!editCeleb} onOpenChange={() => setEditCeleb(null)}>
//         <DialogContent className="w-[92vw] sm:max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
//           <DialogHeader className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 shrink-0">
//             <DialogTitle className="text-xl sm:text-2xl font-bold">Edit Celebration</DialogTitle>
//           </DialogHeader>
//           <div className="overflow-y-auto flex-1 px-5 sm:px-7 pb-2 space-y-4 sm:space-y-5">
//             <div className="space-y-2">
//               <Label>Member Name</Label>
//               <Select
//                 value={editedCeleb.name}
//                 onValueChange={v => setEditedCeleb(p => ({ ...p, name: v }))}
//               >
//                 <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
//                 <SelectContent className="bg-white z-[200]" position="popper" sideOffset={4}>
//                   {members.map(m => (
//                     <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid grid-cols-2 gap-3 sm:gap-4">
//               <div className="space-y-2">
//                 <Label>Month</Label>
//                 <Select
//                   value={String(editedCeleb.month || '')}
//                   onValueChange={v => setEditedCeleb(p => ({ ...p, month: Number(v) }))}
//                 >
//                   <SelectTrigger><SelectValue /></SelectTrigger>
//                   <SelectContent className="bg-white z-[200]" position="popper" sideOffset={4}>
//                     {MONTH_NAMES.map((mn, i) => (
//                       <SelectItem key={i + 1} value={String(i + 1)}>{mn}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Day of Month</Label>
//                 <Input
//                   type="number"
//                   min={1}
//                   max={31}
//                   value={editedCeleb.day || ''}
//                   onChange={e => setEditedCeleb(p => ({ ...p, day: Number(e.target.value) }))}
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Event</Label>
//               <Input
//                 value={editedCeleb.event || ''}
//                 onChange={e => setEditedCeleb(p => ({ ...p, event: e.target.value }))}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Color Theme</Label>
//               <Select
//                 value={editedCeleb.color}
//                 onValueChange={v => setEditedCeleb(p => ({ ...p, color: v }))}
//               >
//                 <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
//                 <SelectContent className="bg-white z-[200]" position="popper" sideOffset={4}>
//                   <SelectItem value="bg-red-100 text-red-700 border-red-300">🔴 Red (Birthday)</SelectItem>
//                   <SelectItem value="bg-green-100 text-green-700 border-green-300">🟢 Green (Anniversary)</SelectItem>
//                   <SelectItem value="bg-blue-100 text-blue-700 border-blue-300">🔵 Blue</SelectItem>
//                   <SelectItem value="bg-purple-100 text-purple-700 border-purple-300">🟣 Purple</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <DialogFooter className="px-5 sm:px-7 py-4 sm:py-5 border-t border-zinc-100 shrink-0 gap-2">
//             <Button variant="outline" onClick={() => setEditCeleb(null)}>Cancel</Button>
//             <Button
//               disabled={!editedCeleb.name?.trim() || !editedCeleb.event?.trim()}
//               onClick={handleSaveCelebEdit}
//               className="bg-emerald-600 hover:bg-emerald-700 text-white"
//             >
//               Save Changes
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ── Delete Celebration Confirmation ──────────────────────────────────── */}
//       <AlertDialog open={deleteCelebId !== null} onOpenChange={() => setDeleteCelebId(null)}>
//         <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl bg-white shadow-2xl">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete this celebration?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={handleDeleteCelebration}>
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }











'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Trash2, Eye, Pencil, Plus, Users, X, Search, MoreVertical,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type Member = {
  id: number; name: string; phone: string;
  birthday_date?: string; bio?: string;
  gender?: 'Male' | 'Female'; join_date?: string; created_at?: string;
};

type Celebration = {
  id: number; name: string; day: number; month: number;
  event: string; color: string; created_at?: string;
};

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// ── True portal menu — mounts into document.body, escapes all overflow clips ──
function PortalMenu({ anchor, children, onClose }: {
  anchor: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (anchor.current) {
      const rect = anchor.current.getBoundingClientRect();
      // Use fixed positioning so scroll doesn't affect placement
      setPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    const h = (e: MouseEvent) => {
      if (anchor.current && !anchor.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [anchor, onClose]);

  if (!mounted) return null;

  // createPortal renders directly into body — no parent overflow can clip it
  return ReactDOM.createPortal(
    <div
      style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }}
      onMouseDown={e => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}

// ── 3-dot action menu for members ────────────────────────────────────────────
function ActionMenu({
  onView, onEdit, onDelete, isDark,
}: { onView: () => void; onEdit: () => void; onDelete: () => void; isDark: boolean }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

  const menuBg    = isDark ? '#1e2028' : '#ffffff';
  const menuBd    = isDark ? '#2a2d3a' : '#e5e7eb';
  const menuColor = isDark ? '#f3f4f6' : '#111827';
  const hoverBg   = isDark ? '#2a2d3a' : '#f3f4f6';

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        style={{
          width: 34, height: 34, borderRadius: 8, border: 'none',
          background: open ? (isDark ? '#2a2d3a' : '#f3f4f6') : 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isDark ? '#9ca3af' : '#6b7280', transition: 'background 0.15s',
        }}
      >
        <MoreVertical size={17} />
      </button>

      {open && (
        <PortalMenu anchor={btnRef as React.RefObject<HTMLElement>} onClose={close}>
          <div style={{
            background: menuBg, border: `1px solid ${menuBd}`,
            borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
            minWidth: 155, overflow: 'hidden',
            animation: 'ddFadeIn 0.12s ease',
          }}>
            {[
              { label: 'View details', icon: <Eye size={14} />, action: onView, color: menuColor },
              { label: 'Edit member',  icon: <Pencil size={14} />, action: onEdit, color: menuColor },
              { label: 'Delete',       icon: <Trash2 size={14} />, action: onDelete, color: '#ef4444' },
            ].map(({ label, icon, action, color }) => (
              <button key={label}
                onClick={() => { action(); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  width: '100%', padding: '10px 16px',
                  border: 'none', background: 'transparent',
                  color, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  transition: 'background 0.12s', textAlign: 'left', fontFamily: 'inherit',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {icon}{label}
              </button>
            ))}
          </div>
        </PortalMenu>
      )}
    </>
  );
}

// ── 3-dot action menu for celebrations ───────────────────────────────────────
function CelebActionMenu({
  onEdit, onDelete, isDark,
}: { onEdit: () => void; onDelete: () => void; isDark: boolean }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

  const menuBg    = isDark ? '#1e2028' : '#ffffff';
  const menuBd    = isDark ? '#2a2d3a' : '#e5e7eb';
  const menuColor = isDark ? '#f3f4f6' : '#111827';
  const hoverBg   = isDark ? '#2a2d3a' : '#f3f4f6';

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        style={{
          width: 34, height: 34, borderRadius: 8, border: 'none',
          background: open ? (isDark ? '#2a2d3a' : '#f3f4f6') : 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isDark ? '#9ca3af' : '#6b7280', transition: 'background 0.15s',
        }}
      >
        <MoreVertical size={17} />
      </button>

      {open && (
        <PortalMenu anchor={btnRef as React.RefObject<HTMLElement>} onClose={close}>
          <div style={{
            background: menuBg, border: `1px solid ${menuBd}`,
            borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
            minWidth: 130, overflow: 'hidden',
            animation: 'ddFadeIn 0.12s ease',
          }}>
            {[
              { label: 'Edit',   icon: <Pencil size={14} />, action: onEdit,   color: menuColor },
              { label: 'Delete', icon: <Trash2 size={14} />, action: onDelete, color: '#ef4444' },
            ].map(({ label, icon, action, color }) => (
              <button key={label}
                onClick={() => { action(); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  width: '100%', padding: '10px 16px',
                  border: 'none', background: 'transparent',
                  color, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  transition: 'background 0.12s', textAlign: 'left', fontFamily: 'inherit',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {icon}{label}
              </button>
            ))}
          </div>
        </PortalMenu>
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MembersPage() {
  const { isDark } = useTheme();

  const [members,        setMembers]        = useState<Member[]>([]);
  const [celebrations,   setCelebrations]   = useState<Celebration[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [showAllMembers, setShowAllMembers] = useState(false);

  // Use a ref so fetchCelebrations closure never goes stale
  const currentMonthRef = useRef(new Date().getMonth() + 1);
  const [currentMonth,     setCurrentMonth]     = useState(() => new Date().getMonth() + 1);
  const [currentMonthName, setCurrentMonthName] = useState(() => MONTH_NAMES[new Date().getMonth()]);

  const [viewMember,     setViewMember]     = useState<Member | null>(null);
  const [editMember,     setEditMember]     = useState<Member | null>(null);
  const [addMemberOpen,  setAddMemberOpen]  = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null);
  const [newMember,      setNewMember]      = useState<Partial<Member>>({});
  const [editedMember,   setEditedMember]   = useState<Partial<Member>>({});

  const [addCelebOpen,  setAddCelebOpen]  = useState(false);
  const [editCeleb,     setEditCeleb]     = useState<Celebration | null>(null);
  const [deleteCelebId, setDeleteCelebId] = useState<number | null>(null);
  const [newCeleb,      setNewCeleb]      = useState<Partial<Celebration>>({});
  const [editedCeleb,   setEditedCeleb]   = useState<Partial<Celebration>>({});

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const pageBg      = isDark ? '#0f1117' : '#f8f9fb';
  const cardBg      = isDark ? '#16181f' : '#ffffff';
  const cardBd      = isDark ? '#1e2028' : '#e5e7eb';
  const headBg      = isDark ? '#111318' : '#f9fafb';
  const textPrimary = isDark ? '#f3f4f6' : '#111827';
  const textMuted   = isDark ? '#6b7280' : '#6b7280';
  const textSub     = isDark ? '#9ca3af' : '#9ca3af';
  const inputBg     = isDark ? '#1a1d27' : '#ffffff';
  const inputBd     = isDark ? '#2a2d3a' : '#e5e7eb';
  const rowHover    = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const dividerBd   = isDark ? '#1e2028' : '#f0f0f0';

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const m = now.getMonth() + 1;
      currentMonthRef.current = m;
      setCurrentMonth(m);
      setCurrentMonthName(MONTH_NAMES[now.getMonth()]);
    };
    check();
    const iv = setInterval(check, 3600 * 1000);
    return () => clearInterval(iv);
  }, []);

  // fetchCelebrations reads from ref — no stale closure, no dependency on currentMonth state
  const fetchCelebrations = useCallback(async () => {
    const { data, error } = await supabase
      .from('celebrations')
      .select('*')
      .eq('month', currentMonthRef.current)
      .order('day', { ascending: true });
    if (!error && data) setCelebrations(data);
  }, []);

  const fetchMembers = useCallback(async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) setMembers(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchMembers(), fetchCelebrations()]);
      setLoading(false);
    };
    init();
  }, [fetchMembers, fetchCelebrations]);

  // Re-fetch when month ticks over
  useEffect(() => { fetchCelebrations(); }, [currentMonth, fetchCelebrations]);

  // Realtime subscriptions
  useEffect(() => {
    const ms = supabase.channel('members-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, fetchMembers)
      .subscribe();
    const cs = supabase.channel('celebrations-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'celebrations' }, fetchCelebrations)
      .subscribe();
    return () => { supabase.removeChannel(ms); supabase.removeChannel(cs); };
  }, [fetchMembers, fetchCelebrations]);

  const filteredMembers  = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.phone.includes(searchQuery)
  );
  const displayedMembers = showAllMembers ? filteredMembers : filteredMembers.slice(0, 7);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDeleteMember = async () => {
    if (deleteMemberId !== null) {
      await supabase.from('members').delete().eq('id', deleteMemberId);
      setDeleteMemberId(null);
      fetchMembers();
    }
  };

  const handleAddMember = async () => {
    if (newMember.name?.trim() && newMember.phone?.trim()) {
      await supabase.from('members').insert([{
        name: newMember.name, phone: newMember.phone,
        gender: newMember.gender || null, join_date: newMember.join_date || null,
        birthday_date: newMember.birthday_date || null, bio: newMember.bio || null,
      }]);
      setNewMember({});
      setAddMemberOpen(false);
      fetchMembers();
    }
  };

  const handleSaveMemberEdit = async () => {
    if (editMember && editedMember.name?.trim() && editedMember.phone?.trim()) {
      await supabase.from('members').update({
        name: editedMember.name, phone: editedMember.phone,
        gender: editedMember.gender || null, join_date: editedMember.join_date || null,
        birthday_date: editedMember.birthday_date || null, bio: editedMember.bio || null,
      }).eq('id', editMember.id);
      setEditMember(null);
      setEditedMember({});
      fetchMembers();
    }
  };

  const openEditMember = (m: Member) => { setEditMember(m); setEditedMember({ ...m }); };

  // Explicit fetch after insert — don't rely solely on realtime
  const handleAddCelebration = async () => {
    if (newCeleb.name?.trim() && newCeleb.day && newCeleb.event?.trim()) {
      const { error } = await supabase.from('celebrations').insert([{
        name: newCeleb.name,
        day: newCeleb.day,
        month: newCeleb.month || currentMonthRef.current,
        event: newCeleb.event,
        color: newCeleb.color || 'bg-red-100 text-red-700 border-red-300',
      }]);
      if (!error) {
        setNewCeleb({});
        setAddCelebOpen(false);
        await fetchCelebrations(); // immediate refresh
      }
    }
  };

  const handleSaveCelebEdit = async () => {
    if (editCeleb && editedCeleb.name?.trim() && editedCeleb.event?.trim()) {
      await supabase.from('celebrations').update({
        name: editedCeleb.name, day: editedCeleb.day,
        month: editedCeleb.month, event: editedCeleb.event, color: editedCeleb.color,
      }).eq('id', editCeleb.id);
      setEditCeleb(null);
      setEditedCeleb({});
      fetchCelebrations();
    }
  };

  const handleDeleteCelebration = async () => {
    if (deleteCelebId !== null) {
      await supabase.from('celebrations').delete().eq('id', deleteCelebId);
      setDeleteCelebId(null);
      fetchCelebrations();
    }
  };

  const openEditCeleb = (c: Celebration) => { setEditCeleb(c); setEditedCeleb({ ...c }); };

  const dlgStyle = { background: cardBg, borderColor: cardBd, color: textPrimary };

  return (
    <div style={{ background: pageBg, minHeight: '100vh', transition: 'background 0.3s' }}>
      <style>{`
        @keyframes ddFadeIn { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }
        .action-icons-desktop { display: flex; }
        .action-dot-mobile    { display: none; }
        .hidden-mobile        { display: table-cell; }
        .show-mobile-only     { display: none; }
        .celeb-subtext        { display: none; }
        .celeb-header         { display: flex; flex-direction: row; align-items: center; justify-content: space-between; }
        .celeb-header-title   { margin: 0 !important; }
        .celeb-add-btn        { width: auto; }
        @media (max-width: 640px) {
          .action-icons-desktop { display: none !important; }
          .action-dot-mobile    { display: flex !important; align-items: center; justify-content: flex-end; }
          .hidden-mobile        { display: none !important; }
          .show-mobile-only     { display: block !important; }
          .celeb-subtext        { display: flex !important; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
          .celeb-header         { flex-direction: column !important; align-items: stretch !important; gap: 12px; }
          .celeb-add-btn        { width: 100% !important; }
        }
      `}</style>

      <div style={{ padding: '24px 16px 96px', maxWidth: 900, margin: '0 auto' }}>

        {/* ── Page Header ──────────────────────────────────────────────────── */}
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
          <button onClick={() => setAddMemberOpen(true)} style={{ display: 'flex',justifyContent: 'center', alignItems: 'center', gap: 8, height: 44, padding: '0 22px', borderRadius: 10, background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#ffffff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', transition: 'opacity 0.15s', whiteSpace: 'nowrap', width: '100%' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            <Plus size={16} /> Add New Member
          </button>
        </div>

        {/* ── Members Table Card ───────────────────────────────────────────── */}
        <div style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16, marginBottom: 24, transition: 'background 0.3s, border-color 0.3s' }}>
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: textSub, pointerEvents: 'none' }} />
              <input placeholder="Search by name or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', height: 42, paddingLeft: 36, paddingRight: 14, borderRadius: 10, border: `1.5px solid ${inputBd}`, background: inputBg, color: textPrimary, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = '#06b6d4')}
                onBlur={e => (e.target.style.borderColor = inputBd)}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: textSub, fontSize: 14 }}>Loading members…</div>
          ) : (
            /* No overflow:auto — portal menus must not be clipped */
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
                    <tr><td colSpan={3} style={{ padding: '40px 20px', textAlign: 'center', color: textSub, fontSize: 14 }}>
                      {searchQuery ? 'No members match your search.' : 'No members yet. Add one!'}
                    </td></tr>
                  ) : displayedMembers.map((member, idx) => (
                    <tr key={member.id}
                      style={{ borderTop: `1px solid ${dividerBd}`, transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = rowHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
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
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSub; }}>
                            <Trash2 size={15} />
                          </button>
                          <button onClick={() => setViewMember(member)} title="View"
                            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#1e2028' : '#f3f4f6'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                            <Eye size={15} />
                          </button>
                          <button onClick={() => openEditMember(member)} title="Edit"
                            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#1e2028' : '#f3f4f6'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                            <Pencil size={15} />
                          </button>
                        </div>
                        <div className="action-dot-mobile">
                          <ActionMenu isDark={isDark}
                            onView={() => setViewMember(member)}
                            onEdit={() => openEditMember(member)}
                            onDelete={() => setDeleteMemberId(member.id)}
                          />
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

        {/* ── Upcoming Celebrations Card ───────────────────────────────────── */}
        <div style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16, transition: 'background 0.3s, border-color 0.3s' }}>
          <div style={{ background: headBg, padding: '18px 20px', borderBottom: `1px solid ${dividerBd}`, borderRadius: '16px 16px 0 0' }} className="celeb-header">
            <h2 style={{ fontSize: 18, fontWeight: 700, color: textPrimary, margin: 0 }} className="celeb-header-title">Upcoming Celebrations</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${isDark ? '#2a2d3a' : '#d1d5db'}`, background: isDark ? '#1a1d27' : '#f3f4f6', fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                MONTH: {currentMonthName.toUpperCase()}
              </span>
              <button onClick={() => setAddCelebOpen(true)} className="celeb-add-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 44, padding: '0 22px', borderRadius: 10, background: isDark ? '#f3f4f6' : '#111827', color: isDark ? '#111827' : '#ffffff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', transition: 'opacity 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <Plus size={16} /> Add Celebration
              </button>
            </div>
          </div>

          {/* No overflow:auto here either */}
          <div style={{ borderRadius: '0 0 16px 16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: headBg }}>
                  {['Name', 'Day', 'Event', 'Actions'].map((h, i) => (
                    <th key={h}
                      className={i === 1 ? 'hidden-mobile' : i === 2 ? 'hidden-mobile' : ''}
                      style={{ padding: '12px 20px', textAlign: i === 3 ? 'right' : 'left', fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', borderTop: `1px solid ${dividerBd}` }}
                    >{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {celebrations.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '40px 20px', textAlign: 'center', color: textSub, fontSize: 14 }}>
                    No celebrations for {currentMonthName}.
                  </td></tr>
                ) : celebrations.map((item, idx) => (
                  <tr key={item.id}
                    style={{ borderTop: `1px solid ${dividerBd}`, transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = rowHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      {/* Name */}
                      <div style={{ fontWeight: 600, fontSize: 14, color: textPrimary }}>{idx + 1}. {item.name}</div>
                      {/* Day + Event badge shown under name on mobile only */}
                      <div className="show-mobile-only celeb-subtext">
                        <span style={{ fontSize: 12, color: textSub }}>Day {item.day}</span>
                        <span className={item.color} style={{ padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600, border: '1px solid', display: 'inline-block' }}>
                          {item.event}
                        </span>
                      </div>
                    </td>
                    <td className="hidden-mobile" style={{ padding: '14px 20px', fontSize: 13, color: textMuted }}>{item.day}</td>
                    <td className="hidden-mobile" style={{ padding: '14px 20px' }}>
                      <span className={item.color} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid', display: 'inline-block' }}>
                        {item.event}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div className="action-icons-desktop" style={{ gap: 2, justifyContent: 'flex-end' }}>
                        <button onClick={() => setDeleteCelebId(item.id)} title="Delete"
                          style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSub; }}>
                          <Trash2 size={15} />
                        </button>
                        <button onClick={() => openEditCeleb(item)} title="Edit"
                          style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub, transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#1e2028' : '#f3f4f6'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                          <Pencil size={15} />
                        </button>
                      </div>
                      <div className="action-dot-mobile">
                        <CelebActionMenu isDark={isDark}
                          onEdit={() => openEditCeleb(item)}
                          onDelete={() => setDeleteCelebId(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ════ DIALOGS ════════════════════════════════════════════════════════ */}

      <AlertDialog open={deleteMemberId !== null} onOpenChange={() => setDeleteMemberId(null)}>
        <AlertDialogContent style={{ ...dlgStyle, maxWidth: 380, borderRadius: 18, border: `1px solid ${cardBd}` }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: textPrimary }}>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription style={{ color: textMuted }}>
              Remove <strong style={{ color: textPrimary }}>{members.find(m => m.id === deleteMemberId)?.name}</strong> permanently?
            </AlertDialogDescription>
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
            <DialogClose asChild>
              <button style={{ position: 'absolute', right: 20, top: 20, width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSub }}>
                <X size={18} />
              </button>
            </DialogClose>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Phone',    value: viewMember?.phone },
              { label: 'Gender',   value: viewMember?.gender || '—' },
              { label: 'Joined',   value: viewMember?.join_date || '—' },
              { label: 'Birthday', value: viewMember?.birthday_date || '—' },
              { label: 'Bio',      value: viewMember?.bio || 'No bio provided.' },
            ].map(row => (
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
          <DialogHeader style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${dividerBd}` }}>
            <DialogTitle style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>Add New Member</DialogTitle>
          </DialogHeader>
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
            <button disabled={!newMember.name?.trim() || !newMember.phone?.trim()} onClick={handleAddMember} style={primaryBtnStyle(!newMember.name?.trim() || !newMember.phone?.trim())}>Add Member</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editMember} onOpenChange={() => setEditMember(null)}>
        <DialogContent style={{ ...dlgStyle, maxWidth: 440, borderRadius: 18, border: `1px solid ${cardBd}`, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
          <DialogHeader style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${dividerBd}` }}>
            <DialogTitle style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>Edit Member</DialogTitle>
          </DialogHeader>
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

      <Dialog open={addCelebOpen} onOpenChange={setAddCelebOpen}>
        <DialogContent style={{ ...dlgStyle, maxWidth: 440, borderRadius: 18, border: `1px solid ${cardBd}`, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
          <DialogHeader style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${dividerBd}` }}>
            <DialogTitle style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>Add Celebration</DialogTitle>
          </DialogHeader>
          <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {renderField('Member Name', <Select onValueChange={v => setNewCeleb(p => ({ ...p, name: v }))}><SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue placeholder="Select a member" /></SelectTrigger><SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}>{members.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent></Select>)}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {renderField('Month', <Select value={String(newCeleb.month || currentMonth)} onValueChange={v => setNewCeleb(p => ({ ...p, month: Number(v) }))}><SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue /></SelectTrigger><SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}>{MONTH_NAMES.map((mn, i) => <SelectItem key={i+1} value={String(i+1)}>{mn}</SelectItem>)}</SelectContent></Select>)}
              {renderField('Day', <input type="number" min={1} max={31} value={newCeleb.day || ''} onChange={e => setNewCeleb(p => ({ ...p, day: Number(e.target.value) }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
            </div>
            {renderField('Event', <input value={newCeleb.event || ''} onChange={e => setNewCeleb(p => ({ ...p, event: e.target.value }))} placeholder="e.g. Birthday, Wedding Anniversary" style={inputStyle(inputBg, inputBd, textPrimary)} />)}
            {renderField('Color Theme', <Select onValueChange={v => setNewCeleb(p => ({ ...p, color: v }))}><SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue placeholder="Select color" /></SelectTrigger><SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}><SelectItem value="bg-red-100 text-red-700 border-red-300">🔴 Red (Birthday)</SelectItem><SelectItem value="bg-green-100 text-green-700 border-green-300">🟢 Green (Anniversary)</SelectItem><SelectItem value="bg-blue-100 text-blue-700 border-blue-300">🔵 Blue</SelectItem><SelectItem value="bg-purple-100 text-purple-700 border-purple-300">🟣 Purple</SelectItem></SelectContent></Select>)}
          </div>
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${dividerBd}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setAddCelebOpen(false)} style={outlineBtnStyle(cardBd, textMuted)}>Cancel</button>
            <button disabled={!newCeleb.name?.trim() || !newCeleb.day || !newCeleb.event?.trim()} onClick={handleAddCelebration} style={primaryBtnStyle(!newCeleb.name?.trim() || !newCeleb.day || !newCeleb.event?.trim())}>Add Celebration</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editCeleb} onOpenChange={() => setEditCeleb(null)}>
        <DialogContent style={{ ...dlgStyle, maxWidth: 440, borderRadius: 18, border: `1px solid ${cardBd}`, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
          <DialogHeader style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${dividerBd}` }}>
            <DialogTitle style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>Edit Celebration</DialogTitle>
          </DialogHeader>
          <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {renderField('Member Name', <Select value={editedCeleb.name} onValueChange={v => setEditedCeleb(p => ({ ...p, name: v }))}><SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue /></SelectTrigger><SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}>{members.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent></Select>)}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {renderField('Month', <Select value={String(editedCeleb.month || '')} onValueChange={v => setEditedCeleb(p => ({ ...p, month: Number(v) }))}><SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue /></SelectTrigger><SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}>{MONTH_NAMES.map((mn, i) => <SelectItem key={i+1} value={String(i+1)}>{mn}</SelectItem>)}</SelectContent></Select>)}
              {renderField('Day', <input type="number" min={1} max={31} value={editedCeleb.day || ''} onChange={e => setEditedCeleb(p => ({ ...p, day: Number(e.target.value) }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
            </div>
            {renderField('Event', <input value={editedCeleb.event || ''} onChange={e => setEditedCeleb(p => ({ ...p, event: e.target.value }))} style={inputStyle(inputBg, inputBd, textPrimary)} />)}
            {renderField('Color Theme', <Select value={editedCeleb.color} onValueChange={v => setEditedCeleb(p => ({ ...p, color: v }))}><SelectTrigger style={selectStyle(inputBg, inputBd, textPrimary)}><SelectValue /></SelectTrigger><SelectContent style={{ background: cardBg, border: `1px solid ${cardBd}`, color: textPrimary }}><SelectItem value="bg-red-100 text-red-700 border-red-300">🔴 Red (Birthday)</SelectItem><SelectItem value="bg-green-100 text-green-700 border-green-300">🟢 Green (Anniversary)</SelectItem><SelectItem value="bg-blue-100 text-blue-700 border-blue-300">🔵 Blue</SelectItem><SelectItem value="bg-purple-100 text-purple-700 border-purple-300">🟣 Purple</SelectItem></SelectContent></Select>)}
          </div>
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${dividerBd}`, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setEditCeleb(null)} style={outlineBtnStyle(cardBd, textMuted)}>Cancel</button>
            <button disabled={!editedCeleb.name?.trim() || !editedCeleb.event?.trim()} onClick={handleSaveCelebEdit} style={primaryBtnStyle(!editedCeleb.name?.trim() || !editedCeleb.event?.trim())}>Save Changes</button>
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

// ── Style helpers ─────────────────────────────────────────────────────────────
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
  return { height: 40, padding: '0 20px', borderRadius: 8, border: 'none', background: disabled ? '#374151' : '#059669', color: disabled ? '#6b7280' : '#ffffff', fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: disabled ? 0.6 : 1, transition: 'opacity 0.15s' };
}
function outlineBtnStyle(bd: string, color: string): React.CSSProperties {
  return { height: 40, padding: '0 16px', borderRadius: 8, border: `1.5px solid ${bd}`, background: 'transparent', color, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' };
}