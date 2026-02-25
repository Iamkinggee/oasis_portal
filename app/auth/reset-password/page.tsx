// app/auth/reset-password/page.tsx
// User lands here after clicking the reset link in their email
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(128, { message: 'Password is too long' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg,  setSuccessMsg]  = useState<string | null>(null);
  const [isLoading,   setIsLoading]   = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking,     setChecking]     = useState(true);

  // Verify the user has a valid reset session from the email link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setValidSession(!!session);
      setChecking(false);
    };
    checkSession();
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { password: '', confirmPassword: '' },
      mode: 'onChange',
    });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setServerError(null);

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      setServerError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccessMsg('Password updated successfully! Redirecting...');
    setTimeout(() => {
      router.push('/');
      router.refresh();
    }, 2000);
  };

  const busy = isSubmitting || isLoading;

  // Loading state
  if (checking) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  // Invalid/expired link
  if (!validSession) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Link Expired or Invalid</h2>
          <p className="text-zinc-400 text-sm">
            This password reset link has expired or already been used.
            Please request a new one.
          </p>
          <a
            href="/forgot-password"
            className="inline-block mt-4 px-6 py-3 bg-white text-black font-semibold rounded-xl text-sm hover:bg-zinc-200 transition-colors"
          >
            Request New Link
          </a>
        </div>
      </div>
    );
  }

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
                  Reset Password
                </h2>
                <p className="text-zinc-400">Enter your new password below.</p>
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
                  <p className="text-sm text-green-400">{successMsg}</p>
                </div>
              )}

              {!successMsg && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-8">

                  {/* NEW PASSWORD */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                      NEW PASSWORD:
                    </label>
                    <input
                      id="password"
                      type="password"
                      autoComplete="new-password"
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
                      className={`w-full px-5 py-4 bg-zinc-900 border rounded-xl placeholder-zinc-500 text-white focus:outline-none transition-all
                        ${errors.confirmPassword
                          ? 'border-red-600 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                          : 'border-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30'
                        }`}
                      {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>
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
                        Updating password...
                      </span>
                    ) : 'Update Password'}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}