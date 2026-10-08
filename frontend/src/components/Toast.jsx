import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 3500);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />;
      case 'error':
        return <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />;
      case 'info':
      default:
        return <Info size={18} style={{ color: '#6366F1', flexShrink: 0 }} />;
    }
  };

  return (
    <div className={`toast ${toast.type || 'info'}`} role="status">
      <div className="toast-content">
        {getIcon()}
        <span>{toast.message}</span>
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss toast"
      >
        <X size={15} />
      </button>
    </div>
  );
}
