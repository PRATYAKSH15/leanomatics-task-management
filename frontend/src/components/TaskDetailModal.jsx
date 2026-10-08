import React from 'react';
import {
  X,
  Calendar,
  Clock,
  Pencil,
  Trash2,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import {
  formatDate,
  formatDateTime,
  getDueDateInfo,
  getStatusConfig,
  getPriorityConfig,
} from '../utils/helpers';

export default function TaskDetailModal({
  isOpen,
  task,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  if (!isOpen || !task) return null;

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const dueDateInfo = getDueDateInfo(task.dueDate, task.status);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span className={`badge-priority ${priorityConfig.badgeClass}`}>
              <span className={`priority-dot ${task.priority}`} />
              <span>{priorityConfig.label}</span>
            </span>
            <span className={`badge-status ${statusConfig.badgeClass}`}>
              {statusConfig.label}
            </span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Title */}
          <div>
            <h2 style={{ fontSize: '1.35rem', lineHeight: 1.3, color: 'var(--text-main)' }}>
              {task.title}
            </h2>
          </div>

          {/* Quick Status Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
            }}
          >
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Current Status:
            </span>
            <select
              className="quick-status-selector"
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              style={{ fontSize: '0.8125rem' }}
            >
              <option value="pending">⏳ Pending</option>
              <option value="in_progress">⚡ In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          {/* Description Section */}
          <div className="detail-section">
            <span className="detail-section-title">Description</span>
            <div className="detail-desc-box">{task.description}</div>
          </div>

          {/* Metadata Section */}
          <div className="detail-section">
            <span className="detail-section-title">Task Timelines & Metadata</span>
            <div className="detail-meta-grid">
              {/* Due Date */}
              <div className="detail-meta-item">
                <span className="detail-meta-label">Due Date</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
                  <span className={`detail-meta-val ${dueDateInfo.isOverdue ? 'overdue' : ''}`}>
                    {task.dueDate ? formatDate(task.dueDate) : 'None set'}
                  </span>
                </div>
                {task.dueDate && (
                  <span style={{ fontSize: '0.75rem', color: dueDateInfo.isOverdue ? '#DC2626' : 'var(--text-muted)' }}>
                    ({dueDateInfo.label})
                  </span>
                )}
              </div>

              {/* Task ID */}
              <div className="detail-meta-item">
                <span className="detail-meta-label">Task Reference ID</span>
                <span className="detail-meta-val" style={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                  {task.id}
                </span>
              </div>

              {/* Created At */}
              <div className="detail-meta-item">
                <span className="detail-meta-label">Created At</span>
                <span className="detail-meta-val">
                  {formatDateTime(task.createdAt)}
                </span>
              </div>

              {/* Updated At */}
              <div className="detail-meta-item">
                <span className="detail-meta-label">Last Updated</span>
                <span className="detail-meta-val">
                  {formatDateTime(task.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn-danger"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>

          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              <Pencil size={16} />
              <span>Edit Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
