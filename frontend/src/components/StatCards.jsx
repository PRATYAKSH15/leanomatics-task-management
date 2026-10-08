import React from 'react';
import {
  Layers,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  CalendarX,
} from 'lucide-react';

export default function StatCards({ stats, activeStatus, activePriority, onSelectFilter }) {
  const cards = [
    {
      id: 'total',
      label: 'Total Tasks',
      value: stats?.total ?? 0,
      icon: Layers,
      type: 'total',
      isActive: activeStatus === 'all' && activePriority === 'all',
      onClick: () => onSelectFilter({ status: 'all', priority: 'all' }),
    },
    {
      id: 'pending',
      label: 'Pending',
      value: stats?.pending ?? 0,
      icon: Clock,
      type: 'pending',
      isActive: activeStatus === 'pending',
      onClick: () => onSelectFilter({ status: 'pending' }),
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      value: stats?.in_progress ?? 0,
      icon: PlayCircle,
      type: 'in_progress',
      isActive: activeStatus === 'in_progress',
      onClick: () => onSelectFilter({ status: 'in_progress' }),
    },
    {
      id: 'completed',
      label: 'Completed',
      value: stats?.completed ?? 0,
      icon: CheckCircle2,
      type: 'completed',
      isActive: activeStatus === 'completed',
      onClick: () => onSelectFilter({ status: 'completed' }),
    },
    {
      id: 'high',
      label: 'High Priority',
      value: stats?.high ?? 0,
      icon: AlertTriangle,
      type: 'high',
      isActive: activePriority === 'high',
      onClick: () => onSelectFilter({ priority: 'high' }),
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: stats?.overdue ?? 0,
      icon: CalendarX,
      type: 'overdue',
      isActive: false,
      onClick: () => {
        // Filter tasks that need attention
        onSelectFilter({ status: 'pending' });
      },
    },
  ];

  return (
    <section className="stat-cards-grid" aria-label="Task Summary Statistics">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`stat-card ${card.type} ${card.isActive ? 'active' : ''}`}
            onClick={card.onClick}
            role="button"
            tabIndex={0}
            title={`Filter by ${card.label}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                card.onClick();
              }
            }}
          >
            <div className="stat-card-header">
              <span className="stat-card-label">{card.label}</span>
              <div className="stat-icon-wrapper">
                <IconComponent size={16} strokeWidth={2.2} />
              </div>
            </div>
            <div className="stat-card-value">{card.value}</div>
          </div>
        );
      })}
    </section>
  );
}
