import React from 'react';
import TaskCard from './TaskCard';
import TaskTable from './TaskTable';
import EmptyState from './EmptyState';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function TaskList({
  tasks,
  isLoading,
  error,
  viewMode,
  isFiltered,
  onResetFilters,
  onOpenCreateModal,
  onViewDetails,
  onEditTask,
  onDeleteTask,
  onQuickStatusChange,
  onRetry,
}) {
  // Loading State
  if (isLoading) {
    return (
      <div className="task-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className="empty-state-box"
        style={{ borderColor: '#FCA5A5', backgroundColor: 'var(--bg-card)' }}
      >
        <div
          className="empty-icon-circle"
          style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
        >
          <AlertCircle size={32} />
        </div>
        <h3 className="empty-state-title" style={{ color: '#DC2626' }}>
          Failed to load tasks
        </h3>
        <p className="empty-state-desc">{error}</p>
        <button
          type="button"
          className="btn-primary"
          onClick={onRetry}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={15} />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  // Empty State
  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        isFiltered={isFiltered}
        onResetFilters={onResetFilters}
        onOpenCreateModal={onOpenCreateModal}
      />
    );
  }

  // Table View
  if (viewMode === 'table') {
    return (
      <TaskTable
        tasks={tasks}
        onViewDetails={onViewDetails}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onQuickStatusChange={onQuickStatusChange}
      />
    );
  }

  // Grid Cards View (Default)
  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onViewDetails={onViewDetails}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onQuickStatusChange={onQuickStatusChange}
        />
      ))}
    </div>
  );
}
