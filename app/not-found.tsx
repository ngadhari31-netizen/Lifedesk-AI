'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Home, MessageSquare, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-7 w-7" />
          </div>
        </div>

        {/* 404 Number */}
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 leading-none mb-2">
          404
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-4">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let our AI assistant help you find what you need.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Talk to AI
          </Link>
        </div>

        <Link
          href="javascript:history.back()"
          className="inline-flex items-center gap-1.5 mt-6 text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Go back to previous page
        </Link>
      </div>

      {/* Brand footer */}
      <div className="mt-12 text-center text-xs text-slate-400">
        <span className="font-semibold text-slate-600 dark:text-slate-300">AI LifeDesk</span>
        {' '}— One AI. Every Customer-Service Problem.
      </div>
    </div>
  );
}
