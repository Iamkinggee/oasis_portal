'use client';

import { useState, useRef } from 'react';
import { Pencil, Upload, Trash2, Download, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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

// ── Types ─────────────────────────────────────────────────────────────────────
type ProfileData = {
  cellName: string;
  cellLeader: string;
  meetingDay: string;
  email: string;
  time: string;
  phoneNo: string;
  venue: string;
  imageUrl: string | null;
};

const defaultProfile: ProfileData = {
  cellName: 'OASIS 1F',
  cellLeader: 'PRAISE JOHN',
  meetingDay: 'TUESDAYS: BIBLE STUDY\nFRIDAY: PRAYER MEETING',
  email: 'iamkingjohn@gmail.com',
  time: '9PM',
  phoneNo: '0813567321',
  venue: 'ONLINE AND ONSITE',
  imageUrl: null,
};

// ── Field Display ─────────────────────────────────────────────────────────────
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">{label}</p>
      <p className="text-sm font-bold text-zinc-900 whitespace-pre-line leading-snug">{value || '—'}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<ProfileData>(defaultProfile);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [savedToast, setSavedToast] = useState(false);
  const [exportToast, setExportToast] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const editImageInputRef = useRef<HTMLInputElement>(null);

  // ── Image Upload ─────────────────────────────────────────────────────────
  const handleImageUpload = (file: File, target: 'profile' | 'edit') => {
    const reader = new FileReader();
    reader.onload = e => {
      const url = e.target?.result as string;
      if (target === 'profile') {
        setProfile(p => ({ ...p, imageUrl: url }));
      } else {
        setEditData(p => ({ ...p, imageUrl: url }));
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
  const openEdit = () => {
    setEditData({ ...profile });
    setEditOpen(true);
  };

  const handleSave = () => {
    setProfile({ ...editData });
    setEditOpen(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  // ── Export ───────────────────────────────────────────────────────────────
  const handleExport = () => {
    const data = {
      cellName: profile.cellName,
      cellLeader: profile.cellLeader,
      meetingDay: profile.meetingDay,
      email: profile.email,
      time: profile.time,
      phoneNo: profile.phoneNo,
      venue: profile.venue,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.cellName.replace(/\s+/g, '_')}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2500);
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = () => {
    setProfile(defaultProfile);
    setDeleteOpen(false);
    setDeleteConfirmText('');
  };

  return (
    <div className="space-y-8 pb-20 relative">

      {/* ── Toasts ──────────────────────────────────────────────────────────── */}
      {savedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
          <Check className="h-4 w-4" /> Profile saved successfully!
        </div>
      )}
      {exportToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2">
          <Download className="h-4 w-4" /> Data exported!
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <h1 className="text-2xl font-bold text-zinc-800 tracking-tight">SETTINGS</h1>

      {/* ── Profile Card ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-lg border border-zinc-100 p-8">
        <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-8">Profile</h2>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Left: Fields ──────────────────────────────────────────────── */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
            <Field label="Cell Name:" value={profile.cellName} />
            <Field label="Cell Leader" value={profile.cellLeader} />
            <Field label="Meeting Day :" value={profile.meetingDay} />
            <Field label="Email:" value={profile.email} />
            <Field label="Time:" value={profile.time} />
            <Field label="Phone No:" value={profile.phoneNo} />
            <Field label="Venue:" value={profile.venue} />
          </div>

          {/* ── Right: Image ──────────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              <div
                className="h-36 w-36 rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-zinc-300 transition-colors"
                onClick={() => imageInputRef.current?.click()}
              >
                {profile.imageUrl ? (
                  <img src={profile.imageUrl} alt="Cell" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Upload className="h-6 w-6 text-zinc-400 mx-auto mb-1" />
                    <span className="text-xs font-semibold text-zinc-500 tracking-wide">UPLOAD<br />IMAGE</span>
                  </div>
                )}
              </div>
              {/* Edit icon overlay */}
              <button
                onClick={() => imageInputRef.current?.click()}
                className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-white border border-zinc-200 shadow flex items-center justify-center hover:bg-zinc-50 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5 text-zinc-600" />
              </button>
            </div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'profile');
              }}
            />
            {profile.imageUrl && (
              <button
                onClick={() => setProfile(p => ({ ...p, imageUrl: null }))}
                className="text-xs text-red-500 hover:text-red-700 underline"
              >
                Remove image
              </button>
            )}
          </div>
        </div>

        {/* ── Action Buttons ──────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button
            onClick={openEdit}
            variant="outline"
            className="h-11 px-8 border-zinc-300 font-bold tracking-widest text-zinc-700 hover:bg-zinc-50 rounded-xl"
          >
            EDIT
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            className="h-11 px-8 border-zinc-300 font-bold tracking-widest text-zinc-700 hover:bg-zinc-50 rounded-xl gap-2"
          >
            <Download className="h-4 w-4" />
            EXPORT DATA
          </Button>
          <Button
            onClick={() => setDeleteOpen(true)}
            className="h-11 px-8 bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest rounded-xl gap-2"
          >
            <Trash2 className="h-4 w-4" />
            DELETE ACCOUNT
          </Button>
        </div>
      </div>

      {/* ── Edit Dialog ──────────────────────────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl bg-white border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] p-0">
          <DialogHeader className="px-7 pt-7 pb-4 shrink-0 border-b border-zinc-100">
            <DialogTitle className="text-xl font-bold text-zinc-800">Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 px-7 py-5 space-y-5">

            {/* Image upload in edit dialog */}
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div
                  className="h-24 w-24 rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-zinc-300 transition-colors"
                  onClick={() => editImageInputRef.current?.click()}
                >
                  {editData.imageUrl ? (
                    <img src={editData.imageUrl} alt="Cell" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload className="h-5 w-5 text-zinc-400 mx-auto" />
                      <span className="text-[10px] text-zinc-400 font-medium">UPLOAD</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => editImageInputRef.current?.click()}
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white border border-zinc-200 shadow flex items-center justify-center"
                >
                  <Pencil className="h-3 w-3 text-zinc-600" />
                </button>
              </div>
              <input
                ref={editImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'edit');
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Cell Name</Label>
                <Input
                  value={editData.cellName}
                  onChange={e => setEditData(p => ({ ...p, cellName: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Cell Leader</Label>
                <Input
                  value={editData.cellLeader}
                  onChange={e => setEditData(p => ({ ...p, cellLeader: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Meeting Day(s)</Label>
              <Textarea
                value={editData.meetingDay}
                onChange={e => setEditData(p => ({ ...p, meetingDay: e.target.value }))}
                rows={2}
                placeholder="e.g. TUESDAYS: BIBLE STUDY&#10;FRIDAY: PRAYER MEETING"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Time</Label>
                <Input
                  value={editData.time}
                  onChange={e => setEditData(p => ({ ...p, time: e.target.value }))}
                  className="h-10"
                  placeholder="e.g. 9PM"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Venue</Label>
                <Input
                  value={editData.venue}
                  onChange={e => setEditData(p => ({ ...p, venue: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Email</Label>
                <Input
                  type="email"
                  value={editData.email}
                  onChange={e => setEditData(p => ({ ...p, email: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Phone No</Label>
                <Input
                  value={editData.phoneNo}
                  onChange={e => setEditData(p => ({ ...p, phoneNo: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-7 py-5 border-t border-zinc-100 shrink-0">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ───────────────────────────────────────── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl bg-white shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-600 text-sm leading-relaxed">
              This will permanently delete all your cell data including members, attendance records, and settings. This action{' '}
              <strong>cannot be undone</strong>.
              <br /><br />
              Type <strong>DELETE</strong> below to confirm:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-1 py-2">
            <Input
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value.toUpperCase())}
              placeholder="Type DELETE to confirm"
              className="border-red-200 focus-visible:ring-red-400"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteConfirmText !== 'DELETE'}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}