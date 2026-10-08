import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatCards from './components/StatCards';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import TaskDetailModal from './components/TaskDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Pagination from './components/Pagination';
import Toast from './components/Toast';
import { taskApi } from './services/api';
import { RotateCcw, Plus, Sparkles } from 'lucide-react';

export default function App() {
  // Task data state
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    high: 0,
    overdue: 0,
  });

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filter & Pagination state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 6,
  });

  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch tasks from API
  const loadTasks = useCallback(async (currentFilters = filters, showSpinner = true) => {
    if (showSpinner) setIsLoading(true);
    setError(null);

    try {
      const response = await taskApi.getTasks(currentFilters);
      if (response && response.success) {
        setTasks(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
        setIsConnected(true);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError(err.message || 'Error communicating with task API.');
      setIsConnected(false);
    } finally {
      if (showSpinner) setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  // Fetch dashboard stats from API
  const loadStats = useCallback(async () => {
    try {
      const response = await taskApi.getStats();
      if (response && response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.warn('Failed to fetch stats:', err.message);
    }
  }, []);

  // Initial fetch and fetch when filters change
  useEffect(() => {
    loadTasks(filters);
  }, [filters, loadTasks]);

  useEffect(() => {
    loadStats();
  }, [tasks, loadStats]);

  // Periodic health check
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await taskApi.checkHealth();
        setIsConnected(true);
      } catch {
        setIsConnected(false);
      }
    };
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter handlers
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: filters.limit,
    });
    addToast('Filters reset to default view', 'info');
  };

  const handleStatCardFilter = ({ status, priority }) => {
    setFilters((prev) => ({
      ...prev,
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
      page: 1,
    }));
  };

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadTasks(filters, true);
    loadStats();
    addToast('Tasks refreshed', 'info');
  };

  // Reset to seed tasks
  const handleResetToSeed = async () => {
    if (!window.confirm('Reset all tasks to original seed demonstration data?')) return;
    try {
      await taskApi.resetTasks();
      loadTasks(filters, true);
      loadStats();
      addToast('Reset tasks to original demonstration dataset', 'success');
    } catch (err) {
      addToast(`Reset failed: ${err.message}`, 'error');
    }
  };

  // Create Task
  const handleCreateTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      const response = await taskApi.createTask(taskData);
      if (response && response.success) {
        setIsCreateModalOpen(false);
        addToast(`Task "${response.data.title}" created successfully!`, 'success');
        // Refresh list and stats
        loadTasks(filters, false);
        loadStats();
      }
    } catch (err) {
      addToast(err.message || 'Failed to create task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Task
  const handleUpdateTask = async (taskData) => {
    if (!taskToEdit) return;
    setIsSubmitting(true);
    try {
      const response = await taskApi.updateTask(taskToEdit.id, taskData);
      if (response && response.success) {
        setTaskToEdit(null);
        addToast(`Task "${response.data.title}" updated successfully!`, 'success');

        // If detail modal was viewing this task, update it
        if (selectedTask && selectedTask.id === taskToEdit.id) {
          setSelectedTask(response.data);
        }

        loadTasks(filters, false);
        loadStats();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Status Change (from card or table)
  const handleQuickStatusChange = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => ({ ...prev, status: newStatus }));
    }

    try {
      const response = await taskApi.updateTaskStatus(taskId, newStatus);
      if (response && response.success) {
        addToast(`Status updated to "${newStatus.replace('_', ' ')}"`, 'success');
        loadStats();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
      // Rollback by reloading
      loadTasks(filters, false);
    }
  };

  // Delete Task
  const handleConfirmDelete = async (taskId) => {
    setIsDeleting(true);
    try {
      const response = await taskApi.deleteTask(taskId);
      if (response && response.success) {
        setTaskToDelete(null);
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(null);
        }
        addToast('Task deleted successfully', 'success');
        loadTasks(filters, false);
        loadStats();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all';

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        isConnected={isConnected}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Dashboard */}
      <main className="main-content">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div>
            <h1 className="dashboard-hero-title">Task Management System</h1>
            <p className="dashboard-hero-subtitle">
              Plan, organize, and prioritize your projects with seamless REST-driven in-memory tracking.
            </p>
          </div>
          <div className="hero-quick-actions">
            <button
              type="button"
              className="btn-secondary-action"
              onClick={handleResetToSeed}
              title="Reset in-memory dataset to initial seed"
            >
              <RotateCcw size={14} />
              <span>Reset Demo Seed</span>
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
              id="btn-hero-create-task"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Dashboard Stat Summary Cards */}
        <StatCards
          stats={stats}
          activeStatus={filters.status}
          activePriority={filters.priority}
          onSelectFilter={handleStatCardFilter}
        />

        {/* Search, Filter, Sort Toolbar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalResults={pagination.totalItems}
        />

        {/* Task List / Table / Empty / Skeleton */}
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          error={error}
          viewMode={viewMode}
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onViewDetails={(task) => setSelectedTask(task)}
          onEditTask={(task) => setTaskToEdit(task)}
          onDeleteTask={(task) => setTaskToDelete(task)}
          onQuickStatusChange={handleQuickStatusChange}
          onRetry={() => loadTasks(filters, true)}
        />

        {/* Pagination Controls */}
        {!isLoading && !error && tasks.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            limit={pagination.limit}
            onPageChange={(page) => handleFilterChange({ page })}
            onLimitChange={(limit) => handleFilterChange({ limit, page: 1 })}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div>
          <strong>Cleanomatics Task Management</strong> &bull; Full-Stack Evaluation Assignment
        </div>
        <div>
          Built with React 19, Express.js REST API, Swagger OpenAPI & In-Memory Store
        </div>
      </footer>

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        isSubmitting={isSubmitting}
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={Boolean(taskToEdit)}
        onClose={() => setTaskToEdit(null)}
        onSubmit={handleUpdateTask}
        initialData={taskToEdit}
        isSubmitting={isSubmitting}
      />

      {/* Task Details Drawer / Modal */}
      <TaskDetailModal
        isOpen={Boolean(selectedTask)}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={(task) => {
          setSelectedTask(null);
          setTaskToEdit(task);
        }}
        onDelete={(task) => {
          setSelectedTask(null);
          setTaskToDelete(task);
        }}
        onStatusChange={handleQuickStatusChange}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
