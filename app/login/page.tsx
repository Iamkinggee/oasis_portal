


// // app/login/page.tsx
// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import Link from 'next/link';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// // ── Validation Schema ────────────────────────────────────────
// const loginSchema = z.object({
//   email: z
//     .string()
//     .email({ message: 'Please enter a valid email' })
//     .min(1, { message: 'Email is required' }),
//   password: z
//     .string()
//     .min(6, { message: 'Password must be at least 6 characters' })
//     .max(128, { message: 'Password is too long' }),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// export default function LoginPage() {
//   const router = useRouter();
//   const [serverError, setServerError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: '', password: '' },
//     mode: 'onChange',
//   });

//   const onSubmit = async (data: LoginFormValues) => {
//     setIsLoading(true);
//     setServerError(null);

//     try {
//       const res = await fetch(`${API_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: data.email, password: data.password }),
//       });

//       const json = await res.json();

//       if (!res.ok) {
//         // Server returned an error (401, 400, etc.)
//         setServerError(json.message || 'Login failed. Please try again.');
//         return;
//       }

//       // ✅ Success — save token and redirect
//       localStorage.setItem('token', json.token);
//       localStorage.setItem('user', JSON.stringify(json.user));
//       router.push('/'); // redirect to dashboard

//     } catch (err) {
//       // Network error — backend not reachable
//       setServerError('Cannot connect to server. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const busy = isSubmitting || isLoading;

//   return (
//     <div className="fixed inset-0 h-screen w-screen bg-black overflow-hidden">
//       <div className="grid md:grid-cols-2 w-full h-full shadow-2xl">

//         {/* Left: Image */}
//         <div className="relative hidden md:block bg-gray-800">
//           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10 pointer-events-none" />
//           <img
//             src="https://images.unsplash.com/photo-1660547923766-1214fc9e0a83?w=600&auto=format&fit=crop&q=60"
//             alt="Community togetherness"
//             className="absolute inset-0 w-full h-full object-cover"
//             draggable={false}
//           />
//         </div>

//         {/* Right: Form */}
//         <div className="bg-zinc-950 h-full overflow-y-auto no-scrollbar">
//           <div className="min-h-full flex flex-col justify-center px-6 py-10 sm:px-12 md:p-12 lg:p-16">
//             <div className="w-full max-w-md mx-auto">

//               {/* Logo */}
//               <h1 className="text-4xl font-extrabold text-white mb-2">
//                 Oasis <span className="text-white text-4xl font-light">Portal</span>
//               </h1>

//               <div className="my-10">
//                 <h2 className="py-2 font-semibold text-lg uppercase tracking-wide text-white">LOGIN</h2>
//                 <p className="text-zinc-400">Enter your credentials to log into your account.</p>
//               </div>

//               {/* ── Server Error Banner ──────────────────────────────── */}
//               {serverError && (
//                 <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
//                   <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                     <circle cx="12" cy="12" r="10" />
//                     <line x1="12" y1="8" x2="12" y2="12" />
//                     <line x1="12" y1="16" x2="12.01" y2="16" />
//                   </svg>
//                   <p className="text-sm text-red-400">{serverError}</p>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-8">

//                 {/* EMAIL */}
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
//                     EMAIL:
//                   </label>
//                   <input
//                     id="email"
//                     type="email"
//                     autoComplete="email"
//                     placeholder="you@example.com"
//                     className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none transition-all
//                       ${errors.email
//                         ? 'border-red-600 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
//                         : 'border-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30'
//                       }`}
//                     {...register('email')}
//                   />
//                   {errors.email && (
//                     <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
//                   )}
//                 </div>

//                 {/* PASSWORD */}
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
//                     PASSWORD:
//                   </label>
//                   <input
//                     id="password"
//                     type="password"
//                     autoComplete="current-password"
//                     placeholder="••••••••"
//                     className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none transition-all
//                       ${errors.password
//                         ? 'border-red-600 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
//                         : 'border-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30'
//                       }`}
//                     {...register('password')}
//                   />
//                   {errors.password && (
//                     <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
//                   )}
//                 </div>

//                 {/* Forgot password */}
//                 <div className="flex justify-end">
//                   <Link href="/forgot-password" className="text-sm text-zinc-500 hover:text-orange-300 transition-colors">
//                     Forgot Password?
//                   </Link>
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   disabled={busy}
//                   className={`w-full py-4 font-medium rounded-xl uppercase tracking-wider text-sm transition-all duration-300 border border-white/10
//                     ${busy
//                       ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
//                       : 'bg-black hover:bg-white hover:text-black text-white shadow-md'
//                     }`}
//                 >
//                   {busy ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                       </svg>
//                       Signing in...
//                     </span>
//                   ) : 'Sign In'}
//                 </button>
//               </form>

//               <p className="text-center text-zinc-500 text-sm">
//                 Don't have an account?{' '}
//                 <Link href="/sign-up" className="text-white hover:text-orange-300 underline-offset-4 transition-colors">
//                   Sign up
//                 </Link>
//               </p>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }















// app/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// ── Validation Schema ─────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email' })
    .min(1, { message: 'Email is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(128, { message: 'Password is too long' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [serverError,   setServerError]   = useState<string | null>(null);
  const [isLoading,     setIsLoading]     = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  // ── Email/Password Login (Supabase) ───────────────────────────
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email:    data.email,
      password: data.password,
    });

    if (error) {
      setServerError(error.message);
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  // ── Google OAuth (Supabase) ───────────────────────────────────
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setServerError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      setServerError(error.message || 'Google sign-in failed.');
      setGoogleLoading(false);
    }
  };

  const busy = isSubmitting || isLoading;

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black overflow-hidden">
      <div className="grid md:grid-cols-2 w-full h-full shadow-2xl">

        {/* Left: Image */}
        <div className="relative hidden md:block bg-gray-800">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10 pointer-events-none" />
          <img
            src="https://images.unsplash.com/photo-1660547923766-1214fc9e0a83?w=600&auto=format&fit=crop&q=60"
            alt="Community togetherness"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Right: Form */}
        <div className="bg-zinc-950 h-full overflow-y-auto no-scrollbar">
          <div className="min-h-full flex flex-col justify-center px-6 py-10 sm:px-12 md:p-12 lg:p-16">
            <div className="w-full max-w-md mx-auto">

              {/* Logo */}
              <h1 className="text-4xl font-extrabold text-white mb-2">
                Oasis <span className="text-white text-4xl font-light">Portal</span>
              </h1>

              <div className="my-10">
                <h2 className="py-2 font-semibold text-lg uppercase tracking-wide text-white">LOGIN</h2>
                <p className="text-zinc-400">Enter your credentials to log into your account.</p>
              </div>

              {/* ── Server Error Banner ───────────────────────────── */}
              {serverError && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm text-red-400">{serverError}</p>
                </div>
              )}

              {/* ── Google Sign In ────────────────────────────────── */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading || busy}
                className="w-full flex items-center justify-center gap-3 py-4 mb-6 rounded-xl border border-zinc-700 bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 hover:border-zinc-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              {/* ── Divider ───────────────────────────────────────── */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-950 px-3 text-zinc-500 tracking-widest">or</span>
                </div>
              </div>

              {/* ── Form ─────────────────────────────────────────── */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-8">

                {/* EMAIL */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                    EMAIL:
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none transition-all
                      ${errors.email
                        ? 'border-red-600 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                        : 'border-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30'
                      }`}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                    PASSWORD:
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none transition-all
                      ${errors.password
                        ? 'border-red-600 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                        : 'border-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30'
                      }`}
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-sm text-zinc-500 hover:text-orange-300 transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={busy || googleLoading}
                  className={`w-full py-4 font-medium rounded-xl uppercase tracking-wider text-sm transition-all duration-300 border border-white/10
                    ${busy
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-black hover:bg-white hover:text-black text-white shadow-md'
                    }`}
                >
                  {busy ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>

              <p className="text-center text-zinc-500 text-sm">
                Don't have an account?{' '}
                <Link href="/sign-up" className="text-white hover:text-orange-300 underline-offset-4 transition-colors">
                  Sign up
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}