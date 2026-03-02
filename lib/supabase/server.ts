// // lib/supabase/server.ts
// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'

// export async function createClient() {
//   const cookieStore = await cookies()

//   return createServerClient(
   
//      process.env.NEXT_PUBLIC_SUPABASE_URL!,
//      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll()
//         },
//         setAll(cookiesToSet) {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options)
//             )
//           } catch {
//             // Called from Server Component — middleware handles refresh
//           }
//         },
//       },
//     }
//   )
// }












// lib/supabase/server.ts
// Server-side Supabase client for Server Components, Route Handlers, and Server Actions.
// Uses cookies() for session — requires Next.js 13+ App Router.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from Server Components where cookies are read-only.
            // This is safe to ignore — the middleware handles session refresh.
          }
        },
      },
    }
  );
}