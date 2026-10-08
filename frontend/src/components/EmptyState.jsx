import React from 'react';
import { ClipboardList, Plus, RotateCcw } from 'lucide-react';

export default function EmptyState({ isFiltered, onResetFilters, onOpenCreateModal }) {
  return (
    <div className="empty-state-box">
      <div className="empty-icon-circle">
        <ClipboardList size={32} strokeWidth={1.8} />
      </div>
      <h3 className="empty-state-title">
        {isFiltered ? 'No tasks match your filters' : 'No tasks created yet'}
      </h3>
      <p className="empty-state-desc">
        {isFiltered
          ? 'Try adjusting your search query, status, or priority filter to find what you are looking for.'
          : 'Organize your work by creating your very first task. Track progress, set priorities, and stay productive.'}
      </p>

      {isFiltered ? (
        <button
          type="button"
          className="btn-secondary"
          onClick={onResetFilters}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RotateCcw size={15} />
          <span>Reset Filters</span>
        </button>
      ) : (
        <button
          type="button"
          className="btn-primary"
          onClick={onOpenCreateModal}
          id="btn-empty-create-task"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Create Task</span>
        </button>
      )}
    </div>
  );
}
