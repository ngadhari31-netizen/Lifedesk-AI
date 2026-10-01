'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function RegisterPage() {
  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'AGENT'>('CUSTOMER');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safe client-side redirect when user is authenticated
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'ADMIN') router.push('/admin');
      else if (user.role === 'AGENT') router.push('/agent');
      else router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await register({
        name,
        email,
        password,
        role,
        language,
      });

      if (result.success) {
        if (role === 'AGENT') router.push('/agent');
        else router.push('/dashboard');
      } else {
        setError(result.error || 'Registration failed. Please check your information.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] text-[#1E2B20]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#688661] animate-spin" />
          <p className="text-sm font-semibold text-[#2D4233]">Redirecting to your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#FAF8F5] text-[#1E2B20] dot-pattern">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#688661] to-[#2D4233] text-white shadow-md border-t border-white/40">
              <Sparkles className="h-6 w-6 text-[#EAF2E8]" />
            </div>
            <span className="font-black text-2xl tracking-tight text-[#1E2B20]">
              LifeDesk AI
            </span>
          </Link>
          <h2 className="text-xl font-black text-[#1E2B20] pt-2">
            Create your account
          </h2>
          <p className="text-xs font-medium text-[#5A7A56]">
            Get instant access to 24/7 AI customer support and smart ticket triage
          </p>
        </div>

        {/* Form Card */}
        <div className="card-3d rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E3DAC9]/80 bg-white">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Maya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4 text-[#5A7A56]" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-[#5A7A56]" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-[#5A7A56]" />}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Account Role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'CUSTOMER' | 'AGENT')}
                options={[
                  { value: 'CUSTOMER', label: 'Customer' },
                  { value: 'AGENT', label: 'Support Agent' },
                ]}
              />

              <Select
                label="Preferred Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'hi', label: 'हिंदी (Hindi)' },
                  { value: 'mr', label: 'मराठी (Marathi)' },
                ]}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 bg-[#688661] hover:bg-[#536E4D] text-white"
              loading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#E3DAC9] text-center text-xs text-[#5A7A56] font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#2D4233] hover:text-[#688661] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
