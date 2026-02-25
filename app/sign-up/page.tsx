// // app/signup/page.tsx
// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import Link from 'next/link';
// import { useState } from 'react';

// // ── Validation Schema ────────────────────────────────────────
// const signupSchema = z.object({
//   name: z
//     .string()
//     .min(2, { message: 'Name must be at least 2 characters' })
//     .max(50, { message: 'Name is too long' })
//     .trim(),
//   email: z
//     .string()
//     .email({ message: 'Please enter a valid email' })
//     .min(1, { message: 'Email is required' })
//     .trim()
//     .toLowerCase(),
//   password: z
//     .string()
//     .min(6, { message: 'Password must be at least 6 characters' })
//     .max(128, { message: 'Password is too long' }),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ['confirmPassword'],
// });

// type SignupFormValues = z.infer<typeof signupSchema>;

// export default function SignupPage() {
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<SignupFormValues>({
//     resolver: zodResolver(signupSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//     },
//     mode: 'onChange',
//   });

//   const onSubmit = async (data: SignupFormValues) => {
//     setIsLoading(true);
//     await new Promise((r) => setTimeout(r, 1400)); // simulate network
//     console.log('Signup attempt:', data);
//     reset();
//     setIsLoading(false);
//     alert('Account created! (demo)');
//   };

//   return (
//     <div
//       className="
//         fixed inset-0 
//         h-screen w-screen 
//         bg-black 
//         overflow-hidden          // prevent any root scroll
//       "
//     >
//       <div
//         className="
//           grid md:grid-cols-2 
//           w-full h-full 
//           shadow-2xl
//         "
//       >
//         {/* Left: Image - now truly fills the entire left half */}
//         <div className="relative hidden md:block bg-gray-900">
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10 pointer-events-none" />
//           <img
//             src="https://plus.unsplash.com/premium_photo-1681505732008-0e4bd1f57457?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHlvdXRoJTIwZ3JvdXAlMjBwb3J0cmFpdCUyMGltYWdlfGVufDB8fDB8fHww"
//             // Recommended alternatives (better fill & style match to reference):
//             // src="https://thumbs.dreamstime.com/b/portrait-smiling-male-doctor-wearing-white-coat-stethoscope-busy-hospital-corridor-153648469.jpg"
//             // src="https://c8.alamy.com/comp/P4JB3H/smiling-pediatrician-wearing-white-coat-with-stethoscope-isolated-on-white-P4JB3H.jpg"
//             alt="Smiling confident doctor in white coat with stethoscope"
//             className="absolute inset-0 w-full h-full object-cover"
//             draggable={false}
//           />
//           {/* Optional branding overlay if you want */}
//           {/* <div className="absolute bottom-10 left-10 text-white z-20">
//             <h2 className="text-4xl font-bold">OASIS</h2>
//             <p className="text-xl opacity-90">Hospital Management</p>
//           </div> */}
//         </div>

//         {/* Right: Form side - scrollable, no visible scrollbar */}
//         <div className="bg-zinc-950 h-full overflow-y-auto no-scrollbar">
//           <div className="min-h-full flex flex-col justify-center px-6 py-12 sm:px-12 md:p-16 lg:p-20">
//             <div className="w-full max-w-md mx-auto">
//               <h1 className="text-4xl font-extrabold text-white mb-3">
//                 Oasis <span className="font-light">Portal</span>
//               </h1>

//               <div className="my-10">
//                 <h1 className="py-2 font-semibold text-xl uppercase tracking-wide">SIGN UP</h1>
//                 <p className="text-zinc-400 text-base">
//                   Create your credentials to join the exclusive Oasis.
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 pb-10">
//                 {/* NAME */}
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
//                     NAME:
//                   </label>
//                   <input
//                     id="name"
//                     type="text"
//                     autoComplete="name"
//                     placeholder="Enter your full name"
//                     className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
//                       ${errors.name ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
//                     {...register('name')}
//                   />
//                   {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
//                 </div>

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
//                     className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
//                       ${errors.email ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
//                     {...register('email')}
//                   />
//                   {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
//                 </div>

//                 {/* PASSWORD */}
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
//                     PASSWORD:
//                   </label>
//                   <input
//                     id="password"
//                     type="password"
//                     autoComplete="new-password"
//                     placeholder="••••••••"
//                     className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
//                       ${errors.password ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
//                     {...register('password')}
//                   />
//                   {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
//                 </div>

//                 {/* CONFIRM PASSWORD */}
//                 <div>
//                   <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
//                     CONFIRM PASSWORD:
//                   </label>
//                   <input
//                     id="confirmPassword"
//                     type="password"
//                     autoComplete="new-password"
//                     placeholder="••••••••"
//                     className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
//                       ${errors.confirmPassword ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
//                     {...register('confirmPassword')}
//                   />
//                   {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>}
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting || isLoading}
//                   className={`w-full py-4 mt-8 font-medium rounded-xl uppercase tracking-wider text-sm transition-all duration-300 border border-white/10 
//                     ${isSubmitting || isLoading
//                       ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
//                       : 'bg-black hover:bg-white hover:text-black text-white shadow-lg'}`}
//                 >
//                   {isSubmitting || isLoading ? 'Creating account...' : 'Create Account'}
//                 </button>
//               </form>

//               <p className="text-center text-zinc-500 text-sm mt-10">
//                 Already have an account?{' '}
//                 <Link href="/login" className="text-white hover:text-orange-300 font-semibold underline-offset-4 transition-colors">
//                   Log in
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }























// app/sign-up/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name is too long' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email' })
    .min(1, { message: 'Email is required' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(128, { message: 'Password is too long' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [serverError,   setServerError]   = useState<string | null>(null);
  const [successMsg,    setSuccessMsg]     = useState<string | null>(null);
  const [isLoading,     setIsLoading]      = useState(false);
  const [googleLoading, setGoogleLoading]  = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<SignupFormValues>({
      resolver: zodResolver(signupSchema),
      defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
      mode: 'onChange',
    });

  // ── Email/Password Sign Up ────────────────────────────────────
  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setServerError(null);
    setSuccessMsg(null);

    const { error } = await supabase.auth.signUp({
      email:    data.email,
      password: data.password,
      options: {
        data: { name: data.name },             // saved to user_metadata
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setServerError(error.message);
      setIsLoading(false);
      return;
    }

    // Supabase sends a confirmation email by default
    // If email confirmation is OFF in Supabase → redirect straight to dashboard
    // If email confirmation is ON  → show success message
    setSuccessMsg('Account created! Check your email to confirm your account.');
    reset();
    setIsLoading(false);

    // Uncomment this if you turned OFF email confirmation in Supabase:
    // router.push('/');
    // router.refresh();
  };

  // ── Google OAuth ──────────────────────────────────────────────
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setServerError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });

    if (error) {
      setServerError(error.message);
      setGoogleLoading(false);
    }
  };

  const busy = isSubmitting || isLoading;

  return (
    <div className="fixed inset-0 h-screen w-screen bg-black overflow-hidden">
      <div className="grid md:grid-cols-2 w-full h-full shadow-2xl">

        {/* Left: Image */}
        <div className="relative hidden md:block bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10 pointer-events-none" />
          <img
            src="https://plus.unsplash.com/premium_photo-1681505732008-0e4bd1f57457?w=600&auto=format&fit=crop&q=60"
            alt="Youth group portrait"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Right: Form */}
        <div className="bg-zinc-950 h-full overflow-y-auto no-scrollbar">
          <div className="min-h-full flex flex-col justify-center px-6 py-12 sm:px-12 md:p-16 lg:p-20">
            <div className="w-full max-w-md mx-auto">

              <h1 className="text-4xl font-extrabold text-white mb-3">
                Oasis <span className="font-light">Portal</span>
              </h1>

              <div className="my-10">
                <h2 className="py-2 font-semibold text-xl uppercase tracking-wide text-white">SIGN UP</h2>
                <p className="text-zinc-400 text-base">
                  Create your credentials to join the exclusive Oasis.
                </p>
              </div>

              {/* Error Banner */}
              {serverError && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm text-red-400">{serverError}</p>
                </div>
              )}

              {/* Success Banner */}
              {successMsg && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
                  </svg>
                  <p className="text-sm text-green-400">{successMsg}</p>
                </div>
              )}

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={googleLoading || busy}
                className="w-full flex items-center justify-center gap-3 py-4 mb-6 rounded-xl border border-zinc-700 bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 hover:border-zinc-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-950 px-3 text-zinc-500 tracking-widest">or</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-10">
                {/* NAME */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">NAME:</label>
                  <input
                    id="name" type="text" autoComplete="name" placeholder="Enter your full name"
                    className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
                      ${errors.name ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
                    {...register('name')}
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                {/* EMAIL */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">EMAIL:</label>
                  <input
                    id="email" type="email" autoComplete="email" placeholder="you@example.com"
                    className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
                      ${errors.email ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
                    {...register('email')}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                {/* PASSWORD */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">PASSWORD:</label>
                  <input
                    id="password" type="password" autoComplete="new-password" placeholder="••••••••"
                    className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
                      ${errors.password ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
                    {...register('password')}
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">CONFIRM PASSWORD:</label>
                  <input
                    id="confirmPassword" type="password" autoComplete="new-password" placeholder="••••••••"
                    className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
                      ${errors.confirmPassword ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={busy || googleLoading}
                  className={`w-full py-4 mt-4 font-medium rounded-xl uppercase tracking-wider text-sm transition-all duration-300 border border-white/10
                    ${busy ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-black hover:bg-white hover:text-black text-white shadow-lg'}`}
                >
                  {busy ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-zinc-500 text-sm mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-white hover:text-orange-300 font-semibold underline-offset-4 transition-colors">
                  Log in
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


