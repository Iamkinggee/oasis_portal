// app/forgot-password/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email' })
    .min(1, { message: 'Email is required' }),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg,  setSuccessMsg]  = useState<string | null>(null);
  const [isLoading,   setIsLoading]   = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { email: '' },
      mode: 'onChange',
    });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setServerError(null);
    setSuccessMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setServerError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccessMsg(`Password reset link sent to ${data.email}. Check your inbox.`);
    setIsLoading(false);
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
            alt="Community"
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
                Oasis <span className="font-light">Portal</span>
              </h1>

              <div className="my-10">
                <h2 className="py-2 font-semibold text-lg uppercase tracking-wide text-white">
                  Forgot Password
                </h2>
                <p className="text-zinc-400">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Error Banner */}
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

              {/* Success Banner */}
              {successMsg && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <div>
                    <p className="text-sm text-green-400">{successMsg}</p>
                    <p className="text-xs text-zinc-500 mt-1">Didn't receive it? Check your spam folder.</p>
                  </div>
                </div>
              )}

              {/* Form — hide after success */}
              {!successMsg && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-8">
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
                        Sending link...
                      </span>
                    ) : 'Send Reset Link'}
                  </button>
                </form>
              )}

              {/* Back to login */}
              <p className="text-center text-zinc-500 text-sm mt-4">
                Remembered your password?{' '}
                <Link href="/login" className="text-white hover:text-orange-300 underline-offset-4 transition-colors">
                  Back to login
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}