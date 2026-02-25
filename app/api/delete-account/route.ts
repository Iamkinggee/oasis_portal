// app/api/delete-account/route.ts
// Server-side route — safe to use SUPABASE_SERVICE_ROLE_KEY here.
// The client SDK cannot call admin.deleteUser() on itself, so we
// do it here with elevated privileges.

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only env var
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Delete the auth user — this removes their email from Supabase Auth entirely
    const { error } = await adminSupabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error('[delete-account] admin.deleteUser error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[delete-account] unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}