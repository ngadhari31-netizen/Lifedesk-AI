'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Mail, Lock, User, Headphones, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const { login, quickLogin, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickLoadingRole, setQuickLoadingRole] = useState<string | null>(null);
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
      const result = await login(email, password);
      if (!result.success) {
        if (result.error?.toLowerCase().includes('not found') || result.error?.toLowerCase().includes('invalid')) {
          setError('Account not found or password incorrect. If you do not have an account yet, click Create Account below.');
        } else {
          setError(result.error || 'Invalid credentials');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'CUSTOMER' | 'AGENT' | 'ADMIN') => {
    setError(null);
    setQuickLoadingRole(role);
    try {
      await quickLogin(role);
    } catch (err: any) {
      setError(err?.message || 'Quick login failed. Please try again.');
    } finally {
      setQuickLoadingRole(null);
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
            Welcome back
          </h2>
          <p className="text-xs font-medium text-[#5A7A56]">
            Sign in to access your customer tickets or support agent workspace
          </p>
        </div>

        {/* 1-Click Fast Judge Access Card */}
        <div className="card-3d p-4 rounded-2xl space-y-2.5 border border-[#E3DAC9]/80 shadow-sm bg-white/80">
          <div className="flex items-center justify-between text-xs font-black text-[#1E2B20]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#688661]" />
              Hackathon 1-Click Fast Access
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#688661] bg-[#EAF2E8] px-2 py-0.5 rounded-full font-bold">
              Instant Demo
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              disabled={loading || !!quickLoadingRole}
              onClick={() => handleQuickLogin('CUSTOMER')}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E3DAC9] hover:bg-[#F4F0E8] text-left transition-all shadow-xs active:translate-y-0.5 text-xs font-semibold disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EAF2E8] flex items-center justify-center text-[#536E4D]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#1E2B20]">Customer Portal (Rahul)</div>
                  <div className="text-[10px] text-[#5A7A56]">customer@lifedesk.ai</div>
                </div>
              </div>
              {quickLoadingRole === 'CUSTOMER' ? (
                <Loader2 className="w-4 h-4 text-[#688661] animate-spin" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 text-[#688661]" />
              )}
            </button>

            <button
              type="button"
              disabled={loading || !!quickLoadingRole}
              onClick={() => handleQuickLogin('AGENT')}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E3DAC9] hover:bg-[#F4F0E8] text-left transition-all shadow-xs active:translate-y-0.5 text-xs font-semibold disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#D2E3CF] flex items-center justify-center text-[#3D5438]">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#1E2B20]">Support Agent (Alex Rivera)</div>
                  <div className="text-[10px] text-[#5A7A56]">agent@lifedesk.ai</div>
                </div>
              </div>
              {quickLoadingRole === 'AGENT' ? (
                <Loader2 className="w-4 h-4 text-[#688661] animate-spin" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 text-[#688661]" />
              )}
            </button>

            <button
              type="button"
              disabled={loading || !!quickLoadingRole}
              onClick={() => handleQuickLogin('ADMIN')}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E3DAC9] hover:bg-[#F4F0E8] text-left transition-all shadow-xs active:translate-y-0.5 text-xs font-semibold disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#2D4233] flex items-center justify-center text-[#FAF8F5]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#1E2B20]">System Admin &amp; Fraud Ops (Sarah)</div>
                  <div className="text-[10px] text-[#5A7A56]">admin@lifedesk.ai</div>
                </div>
              </div>
              {quickLoadingRole === 'ADMIN' ? (
                <Loader2 className="w-4 h-4 text-[#688661] animate-spin" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 text-[#688661]" />
              )}
            </button>
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <div className="card-3d rounded-2xl p-6 shadow-sm border border-[#E3DAC9]/80 bg-white">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-[#5A7A56]" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-[#5A7A56]" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 bg-[#688661] hover:bg-[#536E4D] text-white"
              loading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#E3DAC9] text-center text-xs text-[#5A7A56] font-medium">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-[#2D4233] hover:text-[#688661] hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
