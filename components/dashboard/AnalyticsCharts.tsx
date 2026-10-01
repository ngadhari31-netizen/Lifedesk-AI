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

interface AnalyticsChartsProps {
  ticketsByCategory?: Array<{ name: string; count: number }>;
  ticketsByPriority?: Array<{ priority: string; count: number }>;
  ticketsByStatus?: Array<{ status: string; count: number }>;
  resolutionTrends?: Array<{ day: string; created: number; resolved: number }>;
  data?: {
    ticketsByStatus?: Record<string, number>;
    ticketsByPriority?: Record<string, number>;
    recentTickets?: unknown[];
    overview?: unknown;
  } | null;
  loading?: boolean;
}

const BRAND_COLORS = ['#3F72AF', '#112D4E', '#5A8DC4', '#2E5E9B', '#DBE2EF', '#7BA4D0'];
const PRIORITY_COLORS: Record<string, string> = {
  LOW: '#DBE2EF',
  MEDIUM: '#3F72AF',
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
      <div className="flex items-center justify-center py-16 text-[#3F72AF]">
        <div className="w-6 h-6 border-2 border-[#3F72AF] border-t-transparent rounded-full animate-spin mr-2" />
        Loading charts...
      </div>
    );
  }

  const statusData: Array<{ status: string; count: number }> =
    ticketsByStatus ||
    (data?.ticketsByStatus
      ? Object.entries(data.ticketsByStatus).map(([status, count]) => ({
          status,
          count: count as number,
        }))
      : []);

  const priorityData: Array<{ priority: string; count: number }> =
    ticketsByPriority ||
    (data?.ticketsByPriority
      ? Object.entries(data.ticketsByPriority).map(([priority, count]) => ({
          priority,
          count: count as number,
        }))
      : []);

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
      <div className="card-3d rounded-2xl p-5 shadow-md">
        <div className="mb-4">
          <h3 className="font-extrabold text-sm text-[#112D4E]">Weekly Resolution Trends</h3>
          <p className="text-xs text-[#3F72AF] font-medium">Tickets created vs resolved</p>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendsData}>
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3F72AF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3F72AF" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#112D4E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#112D4E" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#DBE2EF" />
              <XAxis dataKey="day" fontSize={11} stroke="#112D4E" opacity={0.7} />
              <YAxis fontSize={11} stroke="#112D4E" opacity={0.7} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#112D4E',
                  borderRadius: '12px',
                  border: '1px solid #3F72AF',
                  color: '#F9F7F7',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              />
              <Area type="monotone" dataKey="created" stroke="#3F72AF" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" name="Created" />
              <Area type="monotone" dataKey="resolved" stroke="#112D4E" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status & Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statusData.length > 0 && (
          <div className="card-3d rounded-2xl p-5 shadow-md">
            <h3 className="font-extrabold text-sm text-[#112D4E] mb-4">Status Breakdown</h3>
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
                      <Cell key={`s-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#112D4E',
                      borderRadius: '12px',
                      border: '1px solid #3F72AF',
                      color: '#F9F7F7',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {priorityData.length > 0 && (
          <div className="card-3d rounded-2xl p-5 shadow-md">
            <h3 className="font-extrabold text-sm text-[#112D4E] mb-4">Priority Levels</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#DBE2EF" />
                  <XAxis dataKey="priority" fontSize={10} stroke="#112D4E" opacity={0.7} />
                  <YAxis fontSize={10} stroke="#112D4E" opacity={0.7} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#112D4E',
                      borderRadius: '12px',
                      border: '1px solid #3F72AF',
                      color: '#F9F7F7',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {priorityData.map((entry) => (
                      <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority] || '#3F72AF'} />
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
