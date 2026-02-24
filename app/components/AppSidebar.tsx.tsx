





// components/AppSidebar.tsx
'use client';

import { Home, Users, Calendar, BookOpen, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';                     // ← Add this
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';                // ← optional: for active link styling

// Optional: if you want to highlight the current page
import { usePathname } from 'next/navigation';

export default function AppSidebar() {
  const pathname = usePathname();   // ← optional (for active state)

  return (
    <aside className="hidden md:flex md:w-72 flex-col  bg-white">
      <div className="p-8 pb-6 mt-5 mb-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
          oasis <span className="font-light">portal</span>
        </h1>
      </div>

      <div className="flex-1 px-4 pb-6 ">
        <nav className="space-y-1 ">
          <p className="px-3 mb-4  font-medium uppercase tracking-wider text-zinc-400 text-sm">
            MENU
          </p>

          {/* Dashboard */}
          <Link href="/dashboard" passHref legacyBehavior>
            <Button
              variant="secondary"
              className={cn(
                "w-full justify-start gap-3 py-6 mb-4 text-base font-medium",
                pathname === '/dashboard' 
                  ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-100" 
                  : "bg-zinc-100 text-zinc-900 hover:bg-zinc-100"
              )}
            >
              <Home className="h-5 w-5" />
              DASHBOARD
            </Button>
          </Link>

          {/* Members */}
          <Link href="/members" passHref legacyBehavior>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 py-6 text-base  mb-4",
                pathname === '/members'
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Users className="h-5 w-5" />
              MEMBERS
            </Button>
          </Link>

          {/* Attendance */}
          <Link href="/attendance" passHref legacyBehavior>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 py-6 text-base  mb-4",
                pathname?.startsWith('/attendance')
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Calendar className="h-5 w-5" />
              ATTENDANCE
            </Button>
          </Link>

          {/* Programs */}
          <Link href="/programs" passHref legacyBehavior>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 py-6 text-base",
                pathname?.startsWith('/programs')
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <BookOpen className="h-5 w-5" />
              PROGRAMS
            </Button>
          </Link>

          <Separator className="my-6 bg-zinc-200" />





          {/* Settings */}
          <Link href="/settings" passHref legacyBehavior>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 py-6 text-base  mt-50",
                pathname === '/settings'
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Settings className="h-5 w-5" />
              SETTINGS
            </Button>
          </Link>

          {/* Log out – usually handled differently (form or API call) */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 py-6 text-base text-red-600 hover:bg-red-50 hover:text-red-700"
            // onClick={() => { /* signOut() logic here */ }}
          >
            <LogOut className="h-5 w-5" />
            Log out
          </Button>
        </nav>
      </div>
    </aside>
  );
}