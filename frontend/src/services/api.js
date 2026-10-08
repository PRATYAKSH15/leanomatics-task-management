/**
 * Cleanomatics Task Management - API Client Service Layer
 * Centralized HTTP service handling all backend REST interactions.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Custom error class with status and field errors
 */
export class ApiError extends Error {
  constructor(message, status = 500, errors = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Generic request helper with JSON parsing and standardized error handling
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      const errorList = data?.errors || [];
      throw new ApiError(errorMessage, response.status, errorList);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or server unreachable error
    throw new ApiError(
      error.message || 'Unable to connect to server. Please ensure the backend is running.',
      0
    );
  }
}

export const taskApi = {
  /**
   * Fetch tasks with query parameters (search, filter, sort, pagination)
   */
  async getTasks(params = {}) {
    const query = new URLSearchParams();
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const qs = query.toString();
    const endpoint = `/tasks${qs ? `?${qs}` : ''}`;
    return await request(endpoint, { method: 'GET' });
  },

  /**
   * Fetch single task by ID
   */
  async getTaskById(id) {
    return await request(`/tasks/${id}`, { method: 'GET' });
  },

  /**
   * Create a new task
   */
  async createTask(taskData) {
    return await request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Update an existing task
   */
  async updateTask(id, updateData) {
    return await request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Quick status update
   */
  async updateTaskStatus(id, status) {
    return await request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Delete a task by ID
   */
  async deleteTask(id) {
    return await request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Fetch dashboard statistics
   */
  async getStats() {
    return await request('/tasks/stats', { method: 'GET' });
  },

  /**
   * Reset tasks to seed data
   */
  async resetTasks() {
    return await request('/tasks/reset', { method: 'POST' });
  },

  /**
   * Check backend health
   */
  async checkHealth() {
    return await request('/health', { method: 'GET' });
  },
};
