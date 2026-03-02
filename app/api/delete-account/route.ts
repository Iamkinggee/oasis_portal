import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing auth token' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: { user }, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !user) {
      return NextResponse.json({ error: 'Invalid token: ' + (userErr?.message ?? 'no user') }, { status: 401 });
    }

    const { error: deleteErr } = await admin.auth.admin.deleteUser(user.id);
    if (deleteErr) {
      return NextResponse.json({ error: 'Delete failed: ' + deleteErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unknown server error' }, { status: 500 });
  }
}