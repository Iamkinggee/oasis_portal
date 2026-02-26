// // middleware.ts  ← goes at ROOT of your Next.js project
// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function proxy(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({ request })

//   const supabase = createServerClient(

//      process.env.NEXT_PUBLIC_SUPABASE_URL!,
//      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) =>
//             request.cookies.set(name, value)
//           )
//           supabaseResponse = NextResponse.next({ request })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options)
//           )
//         },
//       },
//     }
//   )

//   // Refresh session so it doesn't expire
//   const { data: { user } } = await supabase.auth.getUser()

//   // Protect dashboard routes — redirect to login if not authenticated
//   const protectedRoutes = ['/', '/members', '/attendance', '/programs', '/settings']
//   const isProtected = protectedRoutes.some(
//     route => request.nextUrl.pathname === route ||
//     request.nextUrl.pathname.startsWith(route + '/')
//   )

//   if (isProtected && !user) {
//     const url = request.nextUrl.clone()
//     url.pathname = '/Heropage'
//     return NextResponse.redirect(url)
//   }

//   // Redirect logged-in users away from login/signup
//   const authRoutes = ['/login', '/sign-up']
//   const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)
//   if (isAuthRoute && user) {
//     const url = request.nextUrl.clone()
//     url.pathname = '/'
//     return NextResponse.redirect(url)
//   }

//   return supabaseResponse
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }











// middleware.ts  ← goes at ROOT of your Next.js project
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — MUST be called before any auth checks
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── Protect all /dashboard routes ────────────────────────────────────────
  // If user hits any /dashboard page without a valid session → hero page
  if (pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/Heropage'
    return NextResponse.redirect(url)
  }

  // ── Redirect logged-in users away from auth pages ─────────────────────
  // If already signed in and they visit /login or /sign-up → dashboard
  const authRoutes = ['/login', '/sign-up']
  if (authRoutes.includes(pathname) && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Run on all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}