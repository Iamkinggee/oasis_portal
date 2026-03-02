// // app/auth/callback/route.ts
// import { createClient } from '@/lib/supabase/server'
// import { NextResponse } from 'next/server'

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url)
//   const code  = searchParams.get('code')
//   const next  = searchParams.get('next') ?? '/'
//   const error = searchParams.get('error')

//   // Handle OAuth errors (user cancelled, etc.)
//   if (error) {
//     console.error('OAuth error:', error)
//     return NextResponse.redirect(`${origin}/login?error=${error}`)
//   }

//   if (code) {
//     const supabase = await createClient()

//     const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

//     if (!exchangeError) {
//       // ✅ Successfully signed in — redirect to dashboard
//       const forwardedHost = request.headers.get('x-forwarded-host')
//       const isLocalEnv    = process.env.NODE_ENV === 'development'

//       if (isLocalEnv) {
//         return NextResponse.redirect(`${origin}${next}`)
//       } else if (forwardedHost) {
//         return NextResponse.redirect(`https://${forwardedHost}${next}`)
//       } else {
//         return NextResponse.redirect(`${origin}${next}`)
//       }
//     }

//     console.error('Code exchange error:', exchangeError)
//   }

//   // Something went wrong
//   return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
// }

















// app/auth/callback/route.ts
// Handles OAuth (Google) redirects and magic-link confirmations.
// Supabase redirects here after successful OAuth or email confirmation.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get('code');
  const next  = searchParams.get('next') ?? '/dashboard';
  const error = searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    console.error('[auth/callback] OAuth error:', error);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Successful auth — forward to dashboard (or wherever 'next' points)
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv    = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }

    console.error('[auth/callback] Code exchange error:', exchangeError.message);
  }

  // Fallback — something went wrong
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}