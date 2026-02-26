





// // app/sign-up/page.tsx
// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import Link from 'next/link';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';

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
//   const router   = useRouter();
//   const supabase = createClient();

//   const [serverError,   setServerError]   = useState<string | null>(null);
//   const [successMsg,    setSuccessMsg]     = useState<string | null>(null);
//   const [isLoading,     setIsLoading]      = useState(false);
//   const [googleLoading, setGoogleLoading]  = useState(false);

//   const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
//     useForm<SignupFormValues>({
//       resolver: zodResolver(signupSchema),
//       defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
//       mode: 'onChange',
//     });

//   // ── Email/Password Sign Up ────────────────────────────────────
//   const onSubmit = async (data: SignupFormValues) => {
//     setIsLoading(true);
//     setServerError(null);
//     setSuccessMsg(null);

//     const { error } = await supabase.auth.signUp({
//       email:    data.email,
//       password: data.password,
//       options: {
//         data: { name: data.name },             // saved to user_metadata
//         emailRedirectTo: `${window.location.origin}/auth/callback`,
//       },
//     });

//     if (error) {
//       setServerError(error.message);
//       setIsLoading(false);
//       return;
//     }

//     // Supabase sends a confirmation email by default
//     // If email confirmation is OFF in Supabase → redirect straight to dashboard
//     // If email confirmation is ON  → show success message
//     setSuccessMsg('Account created! Check your email to confirm your account.');
//     reset();
//     setIsLoading(false);

//     // Uncomment this if you turned OFF email confirmation in Supabase:
//     // router.push('/');
//     // router.refresh();
//   };

//   // ── Google OAuth ──────────────────────────────────────────────
//   const handleGoogleSignup = async () => {
//     setGoogleLoading(true);
//     setServerError(null);

//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         redirectTo: `${window.location.origin}/auth/callback`,
//         queryParams: { access_type: 'offline', prompt: 'consent' },
//       },
//     });

//     if (error) {
//       setServerError(error.message);
//       setGoogleLoading(false);
//     }
//   };

//   const busy = isSubmitting || isLoading;

//   return (
//     <div className="fixed inset-0 h-screen w-screen bg-black overflow-hidden">
//       <div className="grid md:grid-cols-2 w-full h-full shadow-2xl">

//         {/* Left: Image */}
//         <div className="relative hidden md:block bg-gray-900">
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10 pointer-events-none" />
//           <img
//             src="https://plus.unsplash.com/premium_photo-1681505732008-0e4bd1f57457?w=600&auto=format&fit=crop&q=60"
//             alt="Youth group portrait"
//             className="absolute inset-0 w-full h-full object-cover"
//             draggable={false}
//           />
//         </div>

//         {/* Right: Form */}
//         <div className="bg-zinc-950 h-full overflow-y-auto no-scrollbar">
//           <div className="min-h-full flex flex-col justify-center px-6 py-12 sm:px-12 md:p-16 lg:p-20">
//             <div className="w-full max-w-md mx-auto">


         
//           <div className='flex   md:justify-start justify-center mb-5'>
//             <span className="w-8 h-8 bg-[#111]  rounded-md grid grid-cols-2 grid-rows-2 gap-[3px] p-[5px] md:mt-1.5 mt-0">
//             <span className="bg-[#f0f0ed] rounded-[1px]" />
//             <span className="bg-[#f0f0ed] rounded-[1px]" />
//             <span className="bg-[#f0f0ed] rounded-[1px]" />
//             <span className="bg-[#f0f0ed] rounded-[1px]" />
//           </span>

//                 <h1 className="text-2xl font-light md:text-4xl  text-white mb-2">
//                 Oasis<span className="text-orange-400 md:text-4xl font-extrabold">Portal</span>
                
//               </h1>
//           </div>

//               <div className="my-10">
//                 <h2 className="py-2 font-semibold text-center md:text-start text-xl uppercase tracking-wide text-white">SIGN UP</h2>
//                 <p className="text-zinc-400 text-base text-center md:text-start">
//                   Create your credentials to join the exclusive Oasis.
//                 </p>
//               </div>

//               {/* Error Banner */}
//               {serverError && (
//                 <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
//                   <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                     <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
//                   </svg>
//                   <p className="text-sm text-red-400">{serverError}</p>
//                 </div>
//               )}

//               {/* Success Banner */}
//               {successMsg && (
//                 <div className="mb-6 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-start gap-3">
//                   <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                     <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
//                   </svg>
//                   <p className="text-sm text-green-400">{successMsg}</p>
//                 </div>
//               )}

//               {/* Google Button */}
//               <button
//                 type="button"
//                 onClick={handleGoogleSignup}
//                 disabled={googleLoading || busy}
//                 className="w-full flex items-center justify-center gap-3 py-4 mb-6 rounded-xl border border-zinc-700 bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 hover:border-zinc-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {googleLoading ? (
//                   <>
//                     <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                     </svg>
//                     Connecting to Google...
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5" viewBox="0 0 24 24">
//                       <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                       <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                       <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//                       <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                     </svg>
//                     Continue with Google
//                   </>
//                 )}
//               </button>

//               {/* Divider */}
//               <div className="relative mb-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-zinc-800" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-zinc-950 px-3 text-zinc-500 tracking-widest">or</span>
//                 </div>
//               </div>

//               {/* Form */}
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-10">
//                 {/* NAME */}
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">NAME:</label>
//                   <input
//                     id="name" type="text" autoComplete="name" placeholder="Enter your full name"
//                     className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
//                       ${errors.name ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
//                     {...register('name')}
//                   />
//                   {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
//                 </div>

//                 {/* EMAIL */}
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">EMAIL:</label>
//                   <input
//                     id="email" type="email" autoComplete="email" placeholder="you@example.com"
//                     className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
//                       ${errors.email ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
//                     {...register('email')}
//                   />
//                   {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
//                 </div>

//                 {/* PASSWORD */}
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">PASSWORD:</label>
//                   <input
//                     id="password" type="password" autoComplete="new-password" placeholder="••••••••"
//                     className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
//                       ${errors.password ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
//                     {...register('password')}
//                   />
//                   {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
//                 </div>

//                 {/* CONFIRM PASSWORD */}
//                 <div>
//                   <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">CONFIRM PASSWORD:</label>
//                   <input
//                     id="confirmPassword" type="password" autoComplete="new-password" placeholder="••••••••"
//                     className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
//                       ${errors.confirmPassword ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
//                     {...register('confirmPassword')}
//                   />
//                   {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>}
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={busy || googleLoading}
//                   className={`w-full py-4 mt-4 font-medium rounded-xl uppercase tracking-wider text-sm transition-all duration-300 border border-white/10
//                     ${busy ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-black hover:bg-white hover:text-black text-white shadow-lg'}`}
//                 >
//                   {busy ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                       </svg>
//                       Creating account...
//                     </span>
//                   ) : 'Create Account'}
//                 </button>
//               </form>

//               <p className="text-center text-zinc-500 text-sm mt-4">
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
import { useTheme, getTokens } from '@/hooks/useTheme';

const signupSchema = z
  .object({
    name:            z.string().min(2, { message: 'Name must be at least 2 characters' }).max(50).trim(),
    email:           z.string().email({ message: 'Please enter a valid email' }).trim().toLowerCase(),
    password:        z.string().min(6, { message: 'Password must be at least 6 characters' }).max(128),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function SignupPage() {
  const router   = useRouter();
  const supabase = createClient();
  const { dark, toggleTheme } = useTheme();
  const t = getTokens(dark);

  const [serverError,   setServerError]  = useState<string | null>(null);
  const [isLoading,     setIsLoading]    = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [signedUp,      setSignedUp]     = useState(false); // ← success state

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<SignupFormValues>({
      resolver: zodResolver(signupSchema),
      defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
      mode: 'onChange',
    });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setServerError(null);

    const { error } = await supabase.auth.signUp({
      email:    data.email,
      password: data.password,
      options:  { data: { name: data.name }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) { setServerError(error.message); setIsLoading(false); return; }

    // Email confirmation OFF → account is live, show success & redirect to login
    reset();
    setIsLoading(false);
    setSignedUp(true);
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setServerError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback`, queryParams: { access_type: 'offline', prompt: 'consent' } },
    });
    if (error) { setServerError(error.message); setGoogleLoading(false); }
  };

  const busy = isSubmitting || isLoading;

  // ── Success screen ────────────────────────────────────────────────────────
  if (signedUp) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center px-6 transition-colors duration-300 ${t.outerBg}`}>
        <div className={`w-full max-w-sm rounded-2xl border p-8 sm:p-10 text-center shadow-xl transition-colors duration-300 ${t.formPanelBg} ${dark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          {/* Checkmark */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
            </svg>
          </div>

          <h2 className={`text-xl font-bold uppercase tracking-wide mb-2 ${t.headline}`}>Account Created!</h2>
          <p className={`text-sm mb-8 ${t.subtitle}`}>
            Your account has been successfully created. Head to the login page to sign in.
          </p>

          <Link
            href="/login"
            className={`block w-full py-3.5 rounded-xl font-medium text-sm uppercase tracking-wider transition-all duration-200 border ${t.submitIdle}`}
          >
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  // ── Form screen ───────────────────────────────────────────────────────────
  return (
    <div className={`fixed inset-0 h-screen w-screen overflow-hidden transition-colors duration-300 ${t.outerBg}`}>
      <div className="grid md:grid-cols-2 w-full h-full relative">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium border transition-all duration-300 cursor-pointer ${t.toggle}`}
        >
          <span>{dark ? '☀️' : '🌙'}</span>
          <span className="hidden sm:inline">{dark ? 'Light' : 'Dark'}</span>
        </button>

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
        <div className={`h-full overflow-y-auto no-scrollbar transition-colors duration-300 ${t.formPanelBg}`}>
          <div className="min-h-full flex flex-col justify-center px-6 py-12 sm:px-12 md:p-16 lg:p-20">
            <div className="w-full max-w-md mx-auto">

              {/* Logo */}
                 <div className="flex items-center gap-2 md:justify-start justify-center mb-5">
                <span className="w-8 h-8 bg-zinc-900 rounded-md grid grid-cols-2 grid-rows-2 gap-[3px] p-[5px] shrink-0">
                  {[0,1,2,3].map(i => <span key={i} className="bg-[#f0f0ed] rounded-[1px]" />)}
                </span>
                <h1 className={`text-xl md:text-2xl font-light leading-none mb-0 ${t.headline}`}>
                  Oasis<span className={`font-extrabold ${t.logoAccent}`}>Portal</span>
                </h1>
              </div>

              <div className="my-8 sm:my-5 text-center md:text-start">
                <h2 className={`py-2 font-semibold  uppercase tracking-wide ${t.headline}`}>Sign Up</h2>
                <p className={t.subtitle}>Create your credentials to join the exclusive Oasis.</p>
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

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={googleLoading || busy}
                className={`w-full flex items-center justify-center gap-3 py-4 mb-6 rounded-xl border text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${t.googleBg} ${t.googleBorder} ${t.googleText}`}
              >
                {googleLoading ? <><Spinner />Connecting to Google...</> : <><GoogleIcon />Continue with Google</>}
              </button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${t.dividerLine}`} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`px-3 tracking-widest ${t.dividerLabel}`}>or</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-10">

                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-2 ${t.label}`}>NAME:</label>
                  <input
                    id="name" type="text" autoComplete="name" placeholder="Enter your full name"
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-1 transition-all ${t.inputBg} ${t.inputText} ${t.placeholder}
                      ${errors.name ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : `${t.inputBorder} ${t.inputFocus}`}`}
                    {...register('name')}
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 ${t.label}`}>EMAIL:</label>
                  <input
                    id="email" type="email" autoComplete="email" placeholder="you@example.com"
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-1 transition-all ${t.inputBg} ${t.inputText} ${t.placeholder}
                      ${errors.email ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : `${t.inputBorder} ${t.inputFocus}`}`}
                    {...register('email')}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="password" className={`block text-sm font-medium mb-2 ${t.label}`}>PASSWORD:</label>
                  <input
                    id="password" type="password" autoComplete="new-password" placeholder="••••••••"
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-1 transition-all ${t.inputBg} ${t.inputText} ${t.placeholder}
                      ${errors.password ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : `${t.inputBorder} ${t.inputFocus}`}`}
                    {...register('password')}
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${t.label}`}>CONFIRM PASSWORD:</label>
                  <input
                    id="confirmPassword" type="password" autoComplete="new-password" placeholder="••••••••"
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-1 transition-all ${t.inputBg} ${t.inputText} ${t.placeholder}
                      ${errors.confirmPassword ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : `${t.inputBorder} ${t.inputFocus}`}`}
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={busy || googleLoading}
                  className={`w-full py-4 mt-2 font-medium rounded-xl uppercase tracking-wider text-sm transition-all duration-300 border
                    ${busy ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-transparent' : t.submitIdle}`}
                >
                  {busy
                    ? <span className="flex items-center justify-center gap-2"><Spinner />Creating account...</span>
                    : 'Create Account'}
                </button>
              </form>

              <p className={`text-center text-sm ${t.muted}`}>
                Already have an account?{' '}
                <Link href="/login" className={`font-semibold underline-offset-4 transition-colors ${t.link}`}>Log in</Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}