import React from 'react';
import { CheckSquare, Plus, Sun, Moon, ExternalLink, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onOpenCreateModal, isConnected, onRefresh, isRefreshing }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-section">
          <div className="brand-logo-icon">
            <CheckSquare size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-text-wrapper">
            <span className="brand-title">Cleanomatics</span>
            <span className="brand-subtitle">Task Management System</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Connection Pill */}
          <div className="connection-pill" title={isConnected ? 'Backend API Connected' : 'Connecting to API...'}>
            <span className={`pulsing-dot ${!isConnected ? 'offline' : ''}`} />
            <span>{isConnected ? 'API Connected' : 'Connecting...'}</span>
          </div>

          {/* Refresh Data */}
          <button
            type="button"
            className="btn-icon-action"
            onClick={onRefresh}
            title="Refresh Tasks"
            disabled={isRefreshing}
          >
            <RefreshCw size={17} className={isRefreshing ? 'spin-animation' : ''} />
          </button>

          {/* Swagger Documentation Link */}
          <a
            href="http://localhost:5000/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-swagger"
            title="View Swagger OpenAPI Documentation"
          >
            <span>Swagger API</span>
            <ExternalLink size={14} />
          </a>

          {/* Theme Toggle (Light default, Dark mode bonus) */}
          <button
            type="button"
            className="btn-icon-action"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* New Task Button */}
          <button
            type="button"
            className="btn-create-task"
            onClick={onOpenCreateModal}
            id="btn-create-task-header"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
