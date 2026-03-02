// // lib/supabase/client.ts
// import { createBrowserClient } from '@supabase/ssr'

// export function createClient() {
//   return createBrowserClient(   
//      process.env.NEXT_PUBLIC_SUPABASE_URL!,
//      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
//   )
// }














// lib/supabase/client.ts
// Browser-side Supabase client (singleton pattern — safe to call multiple times)

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}