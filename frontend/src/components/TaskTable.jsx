import React from 'react';
import {
  Calendar,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  formatDate,
  getDueDateInfo,
  getStatusConfig,
  getPriorityConfig,
} from '../utils/helpers';

export default function TaskTable({
  tasks,
  onViewDetails,
  onEditTask,
  onDeleteTask,
  onQuickStatusChange,
}) {
  return (
    <div className="table-container">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Created</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const priorityConfig = getPriorityConfig(task.priority);
            const dueDateInfo = getDueDateInfo(task.dueDate, task.status);

            return (
              <tr key={task.id} id={`task-row-${task.id}`}>
                {/* Title & snippet */}
                <td>
                  <div
                    className="table-title-cell"
                    onClick={() => onViewDetails(task)}
                    title="Click to view details"
                  >
                    {task.title}
                  </div>
                  <div className="table-desc-text">{task.description}</div>
                </td>

                {/* Status Dropdown */}
                <td>
                  <select
                    className="quick-status-selector"
                    value={task.status}
                    onChange={(e) => onQuickStatusChange(task.id, e.target.value)}
                    title="Change status"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="in_progress">⚡ In Progress</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </td>

                {/* Priority */}
                <td>
                  <span className={`badge-priority ${priorityConfig.badgeClass}`}>
                    <span className={`priority-dot ${task.priority}`} />
                    <span>{priorityConfig.shortLabel}</span>
                  </span>
                </td>

                {/* Due Date */}
                <td>
                  {task.dueDate ? (
                    <span className={`due-date-badge ${dueDateInfo.type}`}>
                      <Calendar size={13} />
                      <span>{dueDateInfo.label}</span>
                    </span>
                  ) : (
                    <span className="due-date-badge none">No due date</span>
                  )}
                </td>

                {/* Created Date */}
                <td>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {formatDate(task.createdAt)}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="action-buttons-group" style={{ justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn-card-action"
                      onClick={() => onViewDetails(task)}
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-card-action"
                      onClick={() => onEditTask(task)}
                      title="Edit Task"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-card-action danger"
                      onClick={() => onDeleteTask(task)}
                      title="Delete Task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
