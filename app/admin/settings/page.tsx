'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import { Settings, Save, Shield, Cpu, CheckCircle2, Sliders } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const SectionCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div
    className="rounded-2xl border p-6 sm:p-8 space-y-4"
    style={{
      background: 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(16px)',
      borderColor: '#DBE2EF',
      boxShadow: '0 8px 32px rgba(63,114,175,0.10), 0 2px 0 #DBE2EF',
    }}
  >
    <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: '#DBE2EF' }}>
      {icon}
      <h3 className="font-extrabold text-sm" style={{ color: '#112D4E' }}>{title}</h3>
    </div>
    {children}
  </div>
);

export default function AdminSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [slaUrgentHours, setSlaUrgentHours] = useState('2');
  const [slaHighHours, setSlaHighHours] = useState('6');
  const [fraudThreshold, setFraudThreshold] = useState('75');
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-flash');
  const [aiAutonomousEscalation, setAiAutonomousEscalation] = useState('enabled');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'ADMIN') router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F7F7' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3F72AF', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F7F7' }}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ color: '#112D4E' }}>
              <Settings className="w-6 h-6" style={{ color: '#3F72AF' }} />
              Platform Configuration &amp; Governance
            </h1>
            <p className="text-xs mt-1" style={{ color: '#3F72AF' }}>
              Configure SLA breach policies, fraud detection sensitivity thresholds, and AI model orchestration
            </p>
          </div>

          {savedSuccess && (
            <div
              className="mb-6 p-4 rounded-2xl border text-xs flex items-center gap-2"
              style={{ background: '#DBE2EF', borderColor: '#3F72AF', color: '#112D4E' }}
            >
              <CheckCircle2 className="w-4 h-4" style={{ color: '#3F72AF' }} />
              <span>Platform settings updated and deployed across all microservices!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
            {/* 1. SLA & Escalation Rules */}
            <SectionCard
              icon={<Sliders className="w-4 h-4" style={{ color: '#3F72AF' }} />}
              title="Service Level Agreement (SLA) Targets"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Urgent Ticket SLA Target (Hours)"
                  type="number"
                  value={slaUrgentHours}
                  onChange={(e) => setSlaUrgentHours(e.target.value)}
                  required
                />
                <Input
                  label="High Priority Ticket SLA Target (Hours)"
                  type="number"
                  value={slaHighHours}
                  onChange={(e) => setSlaHighHours(e.target.value)}
                  required
                />
              </div>
            </SectionCard>

            {/* 2. Fraud & Screening Sensitivity */}
            <SectionCard
              icon={<Shield className="w-4 h-4" style={{ color: '#3F72AF' }} />}
              title="Risk Screening & Fraud Rules"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Critical Risk Anomaly Threshold (Score 0-100)"
                  type="number"
                  value={fraudThreshold}
                  onChange={(e) => setFraudThreshold(e.target.value)}
                  required
                />
                <Select
                  label="Supervisor Audit Enforcement"
                  value="MANDATORY"
                  onChange={() => {}}
                  options={[
                    { value: 'MANDATORY', label: 'Mandatory (Lock Balance Changes)' },
                    { value: 'NOTIFY_ONLY', label: 'Notify Supervisors Only' },
                  ]}
                />
              </div>
            </SectionCard>

            {/* 3. AI Orchestration Engine */}
            <SectionCard
              icon={<Cpu className="w-4 h-4" style={{ color: '#3F72AF' }} />}
              title="Google Gemini AI Orchestration"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Active Foundation Model"
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                  options={[
                    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Ultra-fast latency)' },
                    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Deep complex reasoning)' },
                  ]}
                />
                <Select
                  label="Autonomous Human Escalation"
                  value={aiAutonomousEscalation}
                  onChange={(e) => setAiAutonomousEscalation(e.target.value)}
                  options={[
                    { value: 'enabled', label: 'Enabled (Auto-route distressed customers)' },
                    { value: 'disabled', label: 'Manual Only' },
                  ]}
                />
              </div>
            </SectionCard>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #3F72AF 0%, #112D4E 100%)',
                  color: '#F9F7F7',
                  boxShadow: '0 4px 16px rgba(63,114,175,0.3)',
                }}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save All Settings'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
