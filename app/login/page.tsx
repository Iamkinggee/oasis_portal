// // app/login/page.tsx
// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import Link from 'next/link';
// import { useState } from 'react';

// // ── Validation Schema ────────────────────────────────────────
// const loginSchema = z.object({
//   name: z
//     .string()
//     .min(2, { message: 'Name must be at least 2 characters' })
//     .max(50, { message: 'Name is too long' })
//     .trim(),
//   password: z
//     .string()
//     .min(6, { message: 'Password must be at least 6 characters' })
//     .max(128, { message: 'Password is too long' }),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// export default function LoginPage() {
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { name: '', password: '' },
//     mode: 'onChange',
//   });

//   const onSubmit = async (data: LoginFormValues) => {
//     setIsLoading(true);
//     await new Promise((r) => setTimeout(r, 1200)); // simulate network
//     console.log('Login attempt:', data);
//     reset();
//     setIsLoading(false);
//     alert('Login successful! (demo)');
//   };

//   return (
//     <div
//       className="
//         fixed inset-0 
//         h-screen w-screen 
//         bg-black 
//         overflow-hidden
//       "
//     >
//       <div
//         className="
//           grid md:grid-cols-2 
//           w-full h-full 
//           shadow-2xl
//         "
//       >
//         {/* Left: Image - fully covers the entire left half */}
//         <div className="relative hidden md:block bg-gray-800">
//           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10 pointer-events-none" />
//           <img
//             src="https://images.unsplash.com/photo-1660547923766-1214fc9e0a83?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG9nZXRoZXJuZXNzfGVufDB8fDB8fHww"
          
//             alt="Confident smiling male doctor in white coat with stethoscope"
//             className="absolute inset-0 w-full h-full object-cover"
//             draggable={false}
//           />
//         </div>

//         {/* Right: Form */}
//         <div className="bg-zinc-950 h-full overflow-y-auto no-scrollbar">
//           <div className="min-h-full flex flex-col justify-center px-6 py-10 sm:px-12 md:p-12 lg:p-16">
//             <div className="w-full max-w-md mx-auto">
//               <h1 className="text-4xl font-extrabold text-white mb-2">
//                 Oasis <span className="text-white text-4xl font-light">Portal</span>
//               </h1>

//               <div className="my-10">
//                 <h1 className="py-2 font-semibold text-lg uppercase tracking-wide">LOGIN</h1>
//                 <p className="text-zinc-400">
//                   Enter your credentials to log into your account.
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-8">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
//                     NAME:
//                   </label>
//                   <input
//                     id="name"
//                     type="text"
//                     autoComplete="username"
//                     placeholder="Enter your name"
//                     className={`
//                       w-full px-5 py-4 bg-zinc-900 border rounded-xl
//                       placeholder-zinc-500 text-white focus:outline-none transition-all
//                       ${errors.name ? 'border-red-600 focus:border-red-500 focus:ring-1 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30'}
//                     `}
//                     {...register('name')}
//                   />
//                   {errors.name && (
//                     <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
//                     PASSWORD:
//                   </label>
//                   <input
//                     id="password"
//                     type="password"
//                     autoComplete="current-password"
//                     placeholder="••••••••"
//                     className={`
//                       w-full px-5 py-4 bg-zinc-900 border rounded-xl
//                       placeholder-zinc-500 text-white focus:outline-none transition-all
//                       ${errors.password ? 'border-red-600 focus:border-red-500 focus:ring-1 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30'}
//                     `}
//                     {...register('password')}
//                   />
//                   {errors.password && (
//                     <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
//                   )}
//                 </div>


//                    <p className=" text-zinc-500 text-sm mt-8">
              
//                 <Link
//                   href="/sign-up"  // fixed from /sign-up to match your signup route
//                   className="text-white justify-end hover:text-orange-300  underline-offset-4 transition-colors"
//                 >
//                     Forgot Password?
//                 </Link>
//               </p>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting || isLoading}
//                   className={`
//                     w-full py-4 mt-6 font-medium rounded-xl uppercase tracking-wider text-sm
//                     transition-all duration-300 border border-white/10 
//                     ${isSubmitting || isLoading
//                       ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
//                       : 'bg-black hover:bg-white hover:text-black text-white shadow-md'}
//                   `}
//                 >
//                   {isSubmitting || isLoading ? 'Signing in...' : 'Sign In'}
//                 </button>
//               </form>

//               <p className="text-center text-zinc-500 text-sm mt-8">
//                 Don't have an account?{' '}
//                 <Link
//                   href="/sign-up"  // fixed from /sign-up to match your signup route
//                   className="text-white hover:text-orange-300  underline-offset-4 transition-colors"
//                 >
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

// ── Validation Schema ────────────────────────────────────────
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const json = await res.json();

      if (!res.ok) {
        // Server returned an error (401, 400, etc.)
        setServerError(json.message || 'Login failed. Please try again.');
        return;
      }

      // ✅ Success — save token and redirect
      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.user));
      router.push('/'); // redirect to dashboard

    } catch (err) {
      // Network error — backend not reachable
      setServerError('Cannot connect to server. Please try again later.');
    } finally {
      setIsLoading(false);
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

              {/* ── Server Error Banner ──────────────────────────────── */}
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
                  disabled={busy}
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