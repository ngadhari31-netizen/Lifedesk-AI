'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

// Support both old format (arrays) and new format (data object from analytics API)
interface AnalyticsChartsProps {
  // Old format
  ticketsByCategory?: Array<{ name: string; count: number }>;
  ticketsByPriority?: Array<{ priority: string; count: number }>;
  ticketsByStatus?: Array<{ status: string; count: number }>;
  resolutionTrends?: Array<{ day: string; created: number; resolved: number }>;
  // New format (from /api/analytics/overview response)
  data?: {
    ticketsByStatus?: Record<string, number>;
    ticketsByPriority?: Record<string, number>;
    recentTickets?: unknown[];
    overview?: unknown;
  } | null;
  loading?: boolean;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4', '#3b82f6'];
const PRIORITY_COLORS: Record<string, string> = {
  LOW: '#94a3b8',
  MEDIUM: '#6366f1',
  HIGH: '#f59e0b',
  URGENT: '#ef4444',
};

export function AnalyticsCharts({
  ticketsByCategory,
  ticketsByPriority,
  ticketsByStatus,
  resolutionTrends,
  data,
  loading,
}: AnalyticsChartsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading charts...
      </div>
    );
  }

  // Normalize from either format
  const statusData: Array<{ status: string; count: number }> = ticketsByStatus ||
    (data?.ticketsByStatus
      ? Object.entries(data.ticketsByStatus).map(([status, count]) => ({ status, count: count as number }))
      : []);

  const priorityData: Array<{ priority: string; count: number }> = ticketsByPriority ||
    (data?.ticketsByPriority
      ? Object.entries(data.ticketsByPriority).map(([priority, count]) => ({ priority, count: count as number }))
      : []);

  const categoryData: Array<{ name: string; count: number }> = ticketsByCategory || [];

  const trendsData = resolutionTrends || [
    { day: 'Mon', created: 8, resolved: 6 },
    { day: 'Tue', created: 12, resolved: 9 },
    { day: 'Wed', created: 7, resolved: 11 },
    { day: 'Thu', created: 15, resolved: 13 },
    { day: 'Fri', created: 10, resolved: 8 },
    { day: 'Sat', created: 5, resolved: 6 },
    { day: 'Sun', created: 3, resolved: 4 },
  ];

  return (
    <div className="space-y-5">
      {/* Resolution Trends */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Weekly Resolution Trends</h3>
          <p className="text-xs text-slate-500">Tickets created vs resolved</p>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendsData}>
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" fontSize={11} stroke="#888" />
              <YAxis fontSize={11} stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="created" stroke="#6366f1" fillOpacity={1} fill="url(#colorCreated)" name="Created" />
              <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status & Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status Pie */}
        {statusData.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">Status Breakdown</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="status"
                  >
                    {statusData.map((_, index) => (
                      <Cell key={`s-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Priority Bar */}
        {priorityData.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">Priority Levels</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="priority" fontSize={10} stroke="#888" />
                  <YAxis fontSize={10} stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                  <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                    {priorityData.map((entry) => (
                      <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority] || '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
