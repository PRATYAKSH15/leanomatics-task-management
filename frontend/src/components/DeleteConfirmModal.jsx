import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  task,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  if (!isOpen || !task) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#DC2626' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Confirm Deletion</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.25rem 1.5rem' }}>
          <p style={{ color: 'var(--text-main)', fontSize: '0.9375rem' }}>
            Are you sure you want to permanently delete:
          </p>
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              fontWeight: 600,
              color: 'var(--text-main)',
            }}
          >
            "{task.title}"
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            This action cannot be undone. The task will be removed from memory.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={() => onConfirm(task.id)}
            disabled={isDeleting}
            id="btn-confirm-delete"
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Task'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
