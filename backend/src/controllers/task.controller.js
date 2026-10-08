const taskService = require('../services/task.service');

class TaskController {
  /**
   * GET /api/tasks
   * Retrieve all tasks with optional search, filtering, sorting, and pagination.
   */
  getAllTasks(req, res, next) {
    try {
      const { search, status, priority, sortBy, sortOrder, page, limit } = req.query;

      const result = taskService.getAllTasks({
        search,
        status,
        priority,
        sortBy,
        sortOrder,
        page,
        limit,
      });

      return res.status(200).json({
        success: true,
        data: result.tasks,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks/stats
   * Retrieve statistics for dashboard summary cards.
   */
  getStats(req, res, next) {
    try {
      const stats = taskService.getStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks/:id
   * Retrieve a single task by ID.
   */
  getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = taskService.getTaskById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task with ID "${id}" was not found.`,
        });
      }

      return res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/tasks
   * Create a new task.
   */
  createTask(req, res, next) {
    try {
      const newTask = taskService.createTask(req.body);
      return res.status(201).json({
        success: true,
        message: 'Task created successfully.',
        data: newTask,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/tasks/:id
   * Update an existing task.
   */
  updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const updatedTask = taskService.updateTask(id, req.body);

      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          message: `Task with ID "${id}" was not found.`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully.',
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/tasks/:id/status
   * Quick status update endpoint.
   */
  updateTaskStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedTask = taskService.updateTask(id, { status });

      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          message: `Task with ID "${id}" was not found.`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task status updated successfully.',
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/tasks/:id
   * Delete a task by ID.
   */
  deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const deletedTask = taskService.deleteTask(id);

      if (!deletedTask) {
        return res.status(404).json({
          success: false,
          message: `Task with ID "${id}" was not found.`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully.',
        data: deletedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/tasks/reset
   * Reset in-memory tasks to seed data.
   */
  resetTasks(req, res, next) {
    try {
      const tasks = taskService.reset();
      return res.status(200).json({
        success: true,
        message: 'In-memory tasks reset to default initial state.',
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
