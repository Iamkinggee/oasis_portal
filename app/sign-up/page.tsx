// app/signup/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';

// ── Validation Schema ────────────────────────────────────────
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
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400)); // simulate network
    console.log('Signup attempt:', data);
    reset();
    setIsLoading(false);
    alert('Account created! (demo)');
  };

  return (
    <div
      className="
        fixed inset-0 
        h-screen w-screen 
        bg-black 
        overflow-hidden          // prevent any root scroll
      "
    >
      <div
        className="
          grid md:grid-cols-2 
          w-full h-full 
          shadow-2xl
        "
      >
        {/* Left: Image - now truly fills the entire left half */}
        <div className="relative hidden md:block bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10 pointer-events-none" />
          <img
            src="https://plus.unsplash.com/premium_photo-1681505732008-0e4bd1f57457?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHlvdXRoJTIwZ3JvdXAlMjBwb3J0cmFpdCUyMGltYWdlfGVufDB8fDB8fHww"
            // Recommended alternatives (better fill & style match to reference):
            // src="https://thumbs.dreamstime.com/b/portrait-smiling-male-doctor-wearing-white-coat-stethoscope-busy-hospital-corridor-153648469.jpg"
            // src="https://c8.alamy.com/comp/P4JB3H/smiling-pediatrician-wearing-white-coat-with-stethoscope-isolated-on-white-P4JB3H.jpg"
            alt="Smiling confident doctor in white coat with stethoscope"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          {/* Optional branding overlay if you want */}
          {/* <div className="absolute bottom-10 left-10 text-white z-20">
            <h2 className="text-4xl font-bold">OASIS</h2>
            <p className="text-xl opacity-90">Hospital Management</p>
          </div> */}
        </div>

        {/* Right: Form side - scrollable, no visible scrollbar */}
        <div className="bg-zinc-950 h-full overflow-y-auto no-scrollbar">
          <div className="min-h-full flex flex-col justify-center px-6 py-12 sm:px-12 md:p-16 lg:p-20">
            <div className="w-full max-w-md mx-auto">
              <h1 className="text-4xl font-extrabold text-white mb-3">
                Oasis <span className="font-light">Portal</span>
              </h1>

              <div className="my-10">
                <h1 className="py-2 font-semibold text-xl uppercase tracking-wide">SIGN UP</h1>
                <p className="text-zinc-400 text-base">
                  Create your credentials to join the exclusive Oasis.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 pb-10">
                {/* NAME */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                    NAME:
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
                      ${errors.name ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
                    {...register('name')}
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
                </div>

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
                    className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
                      ${errors.email ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
                    {...register('email')}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                {/* PASSWORD */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                    PASSWORD:
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
                      ${errors.password ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
                    {...register('password')}
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
                    CONFIRM PASSWORD:
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:ring-1 transition-all
                      ${errors.confirmPassword ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/30'}`}
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className={`w-full py-4 mt-8 font-medium rounded-xl uppercase tracking-wider text-sm transition-all duration-300 border border-white/10 
                    ${isSubmitting || isLoading
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-black hover:bg-white hover:text-black text-white shadow-lg'}`}
                >
                  {isSubmitting || isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-zinc-500 text-sm mt-10">
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