// app/(dashboard)/layout.tsx
import type { ReactNode } from 'react';
import AppSidebar from '@/app/components/AppSidebar.tsx';
import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100 text-zinc-900">
      {/* Sidebar – visible on md+ */}
      <AppSidebar />

      {/* Right side: header + content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white px-6 md:px-10 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search members..."
                className="pl-10 bg-zinc-50 border-zinc-300 rounded-xl focus-visible:ring-zinc-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-5 md:gap-7">
            <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-900">
              <Bell className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 md:h-10 md:w-10">
                <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
                <AvatarFallback className="bg-zinc-700 text-white">BA</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="font-medium text-sm">Bro. Andrew</div>
                <div className="text-xs text-zinc-500">Cell Leader</div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-zinc-50">
          {children}
        </main>
      </div>
    </div>
  );
}