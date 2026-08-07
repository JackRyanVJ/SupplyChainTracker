'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setInfoMsg('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard/inventory'), 1200);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          throw error;
        }
        router.push('/dashboard/inventory');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Use instant demo access below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setInfoMsg('Connecting to Hot Wheels Logistics Portal...');
    if (typeof window !== 'undefined') {
      localStorage.setItem('hw_authenticated', 'true');
    }
    setTimeout(() => {
      router.push('/dashboard/inventory');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 select-none">
      <div className="max-w-md w-full">
        {/* Official Hot Wheels Image Logo */}
        <div className="text-center mb-6 flex flex-col items-center">
          <img
            src="/hw-logo-official.png"
            alt="Hot Wheels Official Logo"
            className="h-16 w-auto max-w-[200px] object-contain mb-3 drop-shadow-sm"
          />
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Supply Chain & Inventory Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tracking, AI visual inspection, INR valuation & QR serialization
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {infoMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              {infoMsg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Work Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hotwheels.supply"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-brand-orange hover:bg-brand-orangeHover text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Supabase Account' : 'Sign In with Supabase Auth'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="hover:text-orange-600 transition-colors font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Register'}
            </button>
            <span className="text-[11px] font-mono text-slate-400 font-bold">v2.4 PRO</span>
          </div>

          {/* Quick Demo Bypass */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Instant Quick Demo Access</span>
            </button>
          </div>
        </div>

        {/* Security indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Protected by Database RLS & 256-Bit SSL</span>
        </div>
      </div>
    </div>
  );
}
