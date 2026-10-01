'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import { User, Mail, CheckCircle, Save, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function ProfilePage() {
  const { user, loading, language, setLanguage } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setSelectedLang(user.language || language || 'en');
      fetch('/api/tickets')
        .then((r) => r.json())
        .then((d) => { if (d.tickets) setTicketCount(d.tickets.length); })
        .catch(console.error);
    }
  }, [user, loading, router, language]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F7F7' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3F72AF', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await setLanguage(selectedLang);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const roleColor = user.role === 'ADMIN' ? '#112D4E' : user.role === 'AGENT' ? '#3F72AF' : '#3F72AF';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F7F7' }}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold flex items-center gap-2.5" style={{ color: '#112D4E' }}>
              <User className="w-6 h-6" style={{ color: '#3F72AF' }} />
              My Profile
            </h1>
            <p className="text-xs mt-1" style={{ color: '#3F72AF' }}>Manage your account identity, language, and support preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            {/* User Overview Card */}
            <div
              className="rounded-3xl p-6 text-center space-y-4 border"
              style={{
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(16px)',
                borderColor: '#DBE2EF',
                boxShadow: '0 8px 32px rgba(63,114,175,0.12), 0 2px 0 #DBE2EF',
              }}
            >
              {/* Avatar */}
              <div
                className="w-20 h-20 rounded-full font-extrabold text-2xl flex items-center justify-center mx-auto border-4"
                style={{
                  background: 'linear-gradient(135deg, #3F72AF 0%, #112D4E 100%)',
                  color: '#F9F7F7',
                  borderColor: '#DBE2EF',
                  boxShadow: '0 4px 16px rgba(63,114,175,0.25)',
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-extrabold text-base" style={{ color: '#112D4E' }}>{user.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: '#3F72AF' }}>{user.email}</p>
                <div className="mt-2.5">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: '#DBE2EF', color: '#112D4E' }}
                  >
                    {user.role} ACCESS
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t text-left space-y-2.5" style={{ borderColor: '#DBE2EF' }}>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: '#3F72AF' }}>Total Tickets</span>
                  <span className="font-bold" style={{ color: '#112D4E' }}>{ticketCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: '#3F72AF' }}>Language</span>
                  <span className="font-bold uppercase" style={{ color: '#3F72AF' }}>{selectedLang}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: '#3F72AF' }}>Security Status</span>
                  <span className="font-bold flex items-center gap-1" style={{ color: '#3F72AF' }}>
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Settings Form */}
            <div
              className="md:col-span-2 rounded-3xl p-6 sm:p-8 space-y-5 border"
              style={{
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(16px)',
                borderColor: '#DBE2EF',
                boxShadow: '0 8px 32px rgba(63,114,175,0.12), 0 2px 0 #DBE2EF',
              }}
            >
              <h3 className="text-sm font-bold pb-3 border-b" style={{ color: '#112D4E', borderColor: '#DBE2EF' }}>
                Personal Preferences
              </h3>

              {savedSuccess && (
                <div
                  className="p-3 rounded-xl border text-xs flex items-center gap-2"
                  style={{ background: '#DBE2EF', borderColor: '#3F72AF', color: '#112D4E' }}
                >
                  <CheckCircle className="w-4 h-4" style={{ color: '#3F72AF' }} />
                  <span>Preferences saved successfully!</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <Input
                  label="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User className="w-4 h-4" />}
                  disabled
                />
                <Input
                  label="Registered Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  disabled
                />
                <Select
                  label="Default Preferred Language"
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  options={[
                    { value: 'en', label: 'English (Default)' },
                    { value: 'hi', label: 'हिंदी (Hindi)' },
                    { value: 'mr', label: 'मराठी (Marathi)' },
                  ]}
                />
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                    style={{
                      background: 'linear-gradient(135deg, #3F72AF 0%, #112D4E 100%)',
                      color: '#F9F7F7',
                      boxShadow: '0 4px 16px rgba(63,114,175,0.3)',
                    }}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving…' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
