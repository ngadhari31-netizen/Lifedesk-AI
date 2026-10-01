import React from 'react';
import {
  CheckCircle2,
  Clock,
  Circle,
  Sparkles,
  UserCheck,
  Headphones,
  CheckCheck,
  ShieldCheck,
} from 'lucide-react';
import clsx from 'clsx';

interface TimelineProps {
  status: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  agentName?: string | null;
  categoryName?: string | null;
}

export function TicketTimeline({
  status,
  createdAt,
  updatedAt,
  resolvedAt,
  agentName,
  categoryName,
}: TimelineProps) {
  const steps = [
    {
      id: 'CREATED',
      title: 'Ticket Created',
      description: 'Logged by customer via 24/7 AI portal',
      icon: CheckCircle2,
      time: new Date(createdAt).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
    {
      id: 'ANALYZED',
      title: 'AI Analysis & Triage',
      description: `Classified under ${categoryName || 'Support'} & screened for risks`,
      icon: Sparkles,
      time: 'Instant (< 2s)',
    },
    {
      id: 'ASSIGNED',
      title: 'Assigned to Specialist',
      description: agentName ? `Routed to ${agentName}` : 'Assigned to Department Queue',
      icon: UserCheck,
      time: status !== 'OPEN' ? 'Assigned' : 'Pending agent',
    },
    {
      id: 'IN_PROGRESS',
      title: 'Agent Reviewing',
      description:
        status === 'WAITING_FOR_CUSTOMER'
          ? 'Waiting for customer clarification'
          : status === 'ESCALATED'
          ? 'Escalated for senior review'
          : 'Support specialist actively investigating',
      icon: Headphones,
      time: 'In Progress',
    },
    {
      id: 'RESOLVED',
      title: 'Issue Resolution',
      description: 'Resolution provided & confirmed by specialist',
      icon: CheckCheck,
      time: resolvedAt
        ? new Date(resolvedAt).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Pending',
    },
    {
      id: 'CLOSED',
      title: 'Ticket Closed',
      description: 'Customer feedback received & ticket archived',
      icon: ShieldCheck,
      time: status === 'CLOSED' ? 'Completed' : 'Upcoming',
    },
  ];

  const getStepState = (index: number) => {
    if (status === 'CLOSED') return 'completed';
    if (status === 'RESOLVED') {
      if (index <= 4) return 'completed';
      return 'upcoming';
    }
    if (status === 'IN_PROGRESS' || status === 'WAITING_FOR_CUSTOMER' || status === 'ESCALATED') {
      if (index < 3) return 'completed';
      if (index === 3) return 'current';
      return 'upcoming';
    }
    if (status === 'ASSIGNED') {
      if (index < 2) return 'completed';
      if (index === 2) return 'current';
      return 'upcoming';
    }
    if (index === 0 || index === 1) return 'completed';
    if (index === 2) return 'current';
    return 'upcoming';
  };

  return (
    <div className="card-3d rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#DBE2EF]">
        <div>
          <h3 className="font-black text-sm text-[#112D4E]">
            Visual Ticket Progress
          </h3>
          <p className="text-xs text-[#112D4E]/70 font-medium">Live operational transparency timeline</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#3F72AF]/15 text-[#3F72AF] border border-[#3F72AF]/30">
          Status: {status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#DBE2EF] ml-4 space-y-6">
        {steps.map((step, index) => {
          const state = getStepState(index);
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative group">
              {/* Timeline marker icon */}
              <div
                className={clsx(
                  'absolute -left-[35px] sm:-left-[43px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all shadow-xs',
                  state === 'completed'
                    ? 'bg-emerald-600 border-white text-white'
                    : state === 'current'
                    ? 'btn-3d border-white text-white animate-pulse'
                    : 'bg-white border-[#DBE2EF] text-[#112D4E]/40'
                )}
              >
                {state === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : state === 'current' ? (
                  <Icon className="w-4 h-4" />
                ) : (
                  <Circle className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Step info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h4
                    className={clsx(
                      'text-xs sm:text-sm font-bold',
                      state === 'completed'
                        ? 'text-[#112D4E]'
                        : state === 'current'
                        ? 'text-[#3F72AF]'
                        : 'text-[#112D4E]/50'
                    )}
                  >
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#112D4E]/70 font-medium mt-0.5">
                    {step.description}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-[#112D4E]/60 shrink-0">
                  {step.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
