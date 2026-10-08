import React from 'react';
import {
  Calendar,
  Eye,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  formatDate,
  getDueDateInfo,
  getStatusConfig,
  getPriorityConfig,
} from '../utils/helpers';

export default function TaskCard({
  task,
  onViewDetails,
  onEditTask,
  onDeleteTask,
  onQuickStatusChange,
}) {
  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const dueDateInfo = getDueDateInfo(task.dueDate, task.status);

  return (
    <article
      className={`task-card ${task.status === 'completed' ? 'task-card-completed' : ''}`}
      id={`task-card-${task.id}`}
    >
      <div className="task-card-top">
        {/* Badges Bar */}
        <div className="task-card-badges">
          {/* Priority Badge */}
          <span className={`badge-priority ${priorityConfig.badgeClass}`}>
            <span className={`priority-dot ${task.priority}`} />
            <span>{priorityConfig.shortLabel}</span>
          </span>

          {/* Due Date Indicator */}
          {task.dueDate ? (
            <span
              className={`due-date-badge ${dueDateInfo.type}`}
              title={`Due: ${formatDate(task.dueDate)}`}
            >
              <Calendar size={13} />
              <span>{dueDateInfo.label}</span>
            </span>
          ) : (
            <span className="due-date-badge none">
              <span>No due date</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="task-card-title"
          onClick={() => onViewDetails(task)}
          title="Click to view details"
        >
          {task.title}
        </h3>

        {/* Description */}
        <p className="task-card-desc">{task.description}</p>
      </div>

      {/* Card Footer */}
      <div className="task-card-footer">
        <div className="task-card-actions">
          {/* Quick Status Dropdown */}
          <select
            className="quick-status-selector"
            value={task.status}
            onChange={(e) => onQuickStatusChange(task.id, e.target.value)}
            title="Change status"
            aria-label="Change task status"
          >
            <option value="pending">⏳ Pending</option>
            <option value="in_progress">⚡ In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>

          {/* Action Icons */}
          <div className="action-buttons-group">
            <button
              type="button"
              className="btn-card-action"
              onClick={() => onViewDetails(task)}
              title="View Task Details"
              aria-label="View task details"
            >
              <Eye size={15} />
            </button>
            <button
              type="button"
              className="btn-card-action"
              onClick={() => onEditTask(task)}
              title="Edit Task"
              aria-label="Edit task"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              className="btn-card-action danger"
              onClick={() => onDeleteTask(task)}
              title="Delete Task"
              aria-label="Delete task"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
