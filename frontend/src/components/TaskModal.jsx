import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, AlertCircle } from 'lucide-react';

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reset or populate fields when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Validation function
  const validate = (values) => {
    const errs = {};
    if (!values.title || values.title.trim() === '') {
      errs.title = 'Title is required';
    } else if (values.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters';
    } else if (values.title.trim().length > 150) {
      errs.title = 'Title cannot exceed 150 characters';
    }

    if (!values.description || values.description.trim() === '') {
      errs.description = 'Description is required';
    } else if (values.description.trim().length < 5) {
      errs.description = 'Description must be at least 5 characters';
    } else if (values.description.trim().length > 2000) {
      errs.description = 'Description cannot exceed 2000 characters';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Re-validate field if touched
    if (touched[name]) {
      const currentErrors = validate({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: currentErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const currentErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: currentErrors[name] }));
  };

  const handleDatePreset = (daysToAdd) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    const dateStr = d.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, dueDate: dateStr }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({
      title: true,
      description: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate ? formData.dueDate : null,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} id="task-modal-form">
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title-input">
                <span>
                  Title <span className="required-star">*</span>
                </span>
                <span className="form-char-count">{formData.title.length}/150</span>
              </label>
              <input
                type="text"
                id="task-title-input"
                name="title"
                className={`form-input ${touched.title && errors.title ? 'input-error' : ''}`}
                placeholder="e.g. Design User Flow & System Architecture"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={150}
                autoFocus
              />
              {touched.title && errors.title && (
                <div className="form-error-msg">
                  <AlertCircle size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  {errors.title}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-desc-input">
                <span>
                  Description <span className="required-star">*</span>
                </span>
                <span className="form-char-count">{formData.description.length}/2000</span>
              </label>
              <textarea
                id="task-desc-input"
                name="description"
                rows={4}
                className={`form-textarea ${touched.description && errors.description ? 'input-error' : ''}`}
                placeholder="Provide details, scope, acceptance criteria, or relevant links..."
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={2000}
              />
              {touched.description && errors.description && (
                <div className="form-error-msg">
                  <AlertCircle size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  {errors.description}
                </div>
              )}
            </div>

            {/* Status & Priority Row */}
            <div className="form-row">
              {/* Status */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-status-select">
                  Status
                </label>
                <select
                  id="task-status-select"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="in_progress">⚡ In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>

              {/* Priority */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-priority-select">
                  Priority
                </label>
                <select
                  id="task-priority-select"
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>

            {/* Due Date & Quick Presets */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-due-date-input">
                Due Date
              </label>
              <input
                type="date"
                id="task-due-date-input"
                name="dueDate"
                className="form-input"
                value={formData.dueDate}
                onChange={handleChange}
              />
              <div className="date-presets-row">
                <button
                  type="button"
                  className="date-preset-btn"
                  onClick={() => handleDatePreset(0)}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="date-preset-btn"
                  onClick={() => handleDatePreset(1)}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  className="date-preset-btn"
                  onClick={() => handleDatePreset(7)}
                >
                  +1 Week
                </button>
                <button
                  type="button"
                  className="date-preset-btn"
                  onClick={() => handleDatePreset(14)}
                >
                  +2 Weeks
                </button>
                {formData.dueDate && (
                  <button
                    type="button"
                    className="date-preset-btn"
                    onClick={() => setFormData((p) => ({ ...p, dueDate: '' }))}
                    style={{ color: '#DC2626' }}
                  >
                    Clear Date
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              id="btn-submit-task-modal"
            >
              <Check size={16} strokeWidth={2.5} />
              <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
