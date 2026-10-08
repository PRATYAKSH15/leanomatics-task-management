/**
 * Utility functions for Task Management UI
 */

/**
 * Format ISO date string into readable date (e.g. "Oct 12, 2026")
 */
export function formatDate(dateString) {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format full timestamp with time (e.g. "Oct 12, 2026 at 3:45 PM")
 */
export function formatDateTime(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Calculate due date status badge and days relative to today
 */
export function getDueDateInfo(dueDateString, status) {
  if (!dueDateString) {
    return { label: 'No due date', type: 'none', isOverdue: false };
  }

  if (status === 'completed') {
    return {
      label: formatDate(dueDateString),
      type: 'completed',
      isOverdue: false,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateString);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      label: `Overdue by ${overdueDays} ${overdueDays === 1 ? 'day' : 'days'}`,
      type: 'overdue',
      isOverdue: true,
    };
  } else if (diffDays === 0) {
    return {
      label: 'Due Today',
      type: 'today',
      isOverdue: false,
    };
  } else if (diffDays === 1) {
    return {
      label: 'Due Tomorrow',
      type: 'soon',
      isOverdue: false,
    };
  } else if (diffDays <= 3) {
    return {
      label: `Due in ${diffDays} days`,
      type: 'soon',
      isOverdue: false,
    };
  } else {
    return {
      label: formatDate(dueDateString),
      type: 'future',
      isOverdue: false,
    };
  }
}

/**
 * Get display info for task status
 */
export function getStatusConfig(status) {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        badgeClass: 'badge-status-completed',
        color: '#10B981',
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        badgeClass: 'badge-status-progress',
        color: '#0284C7',
      };
    case 'pending':
    default:
      return {
        label: 'Pending',
        badgeClass: 'badge-status-pending',
        color: '#D97706',
      };
  }
}

/**
 * Get display info for task priority
 */
export function getPriorityConfig(priority) {
  switch (priority) {
    case 'high':
      return {
        label: 'High Priority',
        shortLabel: 'High',
        badgeClass: 'badge-priority-high',
        color: '#DC2626',
      };
    case 'medium':
      return {
        label: 'Medium Priority',
        shortLabel: 'Medium',
        badgeClass: 'badge-priority-medium',
        color: '#D97706',
      };
    case 'low':
    default:
      return {
        label: 'Low Priority',
        shortLabel: 'Low',
        badgeClass: 'badge-priority-low',
        color: '#16A34A',
      };
  }
}

/**
 * Debounce function for search input (Bonus Requirement #91)
 */
export function debounce(func, delay = 350) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
