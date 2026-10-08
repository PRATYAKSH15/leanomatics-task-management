const { v4: uuidv4 } = require('uuid');
const initialTasks = require('../data/initialTasks');

class TaskService {
  constructor() {
    // In-memory data store as explicitly required: "Store task data only in backend memory"
    this.tasks = [...initialTasks];
  }

  /**
   * Retrieve all tasks with optional search, filtering, sorting, and pagination.
   */
  getAllTasks(query = {}) {
    const {
      search,
      status,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page,
      limit,
    } = query;

    let result = [...this.tasks];

    // Filter by search string (title or description)
    if (search && search.trim() !== '') {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (status && status !== 'all') {
      result = result.filter((task) => task.status === status);
    }

    // Filter by priority
    if (priority && priority !== 'all') {
      result = result.filter((task) => task.priority === priority);
    }

    // Sorting
    const priorityWeight = { high: 3, medium: 2, low: 1 };

    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'priority') {
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        comparison = weightA - weightB;
      } else if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        comparison = dateA - dateB;
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else {
        // Default: createdAt
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        comparison = dateA - dateB;
      }

      return sortOrder.toLowerCase() === 'asc' ? comparison : -comparison;
    });

    // Total count before pagination
    const totalItems = result.length;

    // Pagination
    if (page !== undefined && limit !== undefined) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const totalPages = Math.ceil(totalItems / limitNum) || 1;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedTasks = result.slice(startIndex, startIndex + limitNum);

      return {
        tasks: paginatedTasks,
        pagination: {
          totalItems,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      };
    }

    // If no pagination requested, return all matching items with a default pagination metadata
    return {
      tasks: result,
      pagination: {
        totalItems,
        totalPages: 1,
        currentPage: 1,
        limit: totalItems,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  /**
   * Retrieve a single task by ID.
   */
  getTaskById(id) {
    const task = this.tasks.find((t) => t.id === id);
    return task || null;
  }

  /**
   * Create a new task in memory.
   */
  createTask(taskData) {
    const now = new Date().toISOString();
    const newTask = {
      id: uuidv4(),
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate ? taskData.dueDate : null,
      createdAt: now,
      updatedAt: now,
    };

    // Prepend new task so it shows at the top by default
    this.tasks.unshift(newTask);
    return newTask;
  }

  /**
   * Update an existing task.
   */
  updateTask(id, updateData) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return null;
    }

    const currentTask = this.tasks[index];
    const updatedTask = {
      ...currentTask,
      ...(updateData.title !== undefined && { title: updateData.title.trim() }),
      ...(updateData.description !== undefined && { description: updateData.description.trim() }),
      ...(updateData.status !== undefined && { status: updateData.status }),
      ...(updateData.priority !== undefined && { priority: updateData.priority }),
      ...(updateData.dueDate !== undefined && { dueDate: updateData.dueDate || null }),
      updatedAt: new Date().toISOString(),
    };

    this.tasks[index] = updatedTask;
    return updatedTask;
  }

  /**
   * Delete a task by ID.
   */
  deleteTask(id) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return null;
    }

    const [deletedTask] = this.tasks.splice(index, 1);
    return deletedTask;
  }

  /**
   * Calculate task statistics for the dashboard.
   */
  getStats() {
    const total = this.tasks.length;
    const pending = this.tasks.filter((t) => t.status === 'pending').length;
    const in_progress = this.tasks.filter((t) => t.status === 'in_progress').length;
    const completed = this.tasks.filter((t) => t.status === 'completed').length;
    const high = this.tasks.filter((t) => t.priority === 'high').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const overdue = this.tasks.filter(
      (t) => t.status !== 'completed' && t.dueDate && t.dueDate < todayStr
    ).length;

    return {
      total,
      pending,
      in_progress,
      completed,
      high,
      overdue,
    };
  }

  /**
   * Reset in-memory store to initial tasks.
   */
  reset() {
    this.tasks = [...initialTasks];
    return this.tasks;
  }
}

// Export singleton instance
module.exports = new TaskService();
