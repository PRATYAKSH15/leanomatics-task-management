const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const {
  validateCreateTask,
  validateUpdateTask,
  validateUpdateStatus,
} = require('../middleware/validation');

// Dashboard statistics
router.get('/stats', (req, res, next) => taskController.getStats(req, res, next));

// Reset tasks in-memory helper
router.post('/reset', (req, res, next) => taskController.resetTasks(req, res, next));

// GET /api/tasks - list all tasks with optional search, filter, sort, pagination
router.get('/', (req, res, next) => taskController.getAllTasks(req, res, next));

// GET /api/tasks/:id - retrieve task by ID
router.get('/:id', (req, res, next) => taskController.getTaskById(req, res, next));

// POST /api/tasks - create new task
router.post('/', validateCreateTask, (req, res, next) =>
  taskController.createTask(req, res, next)
);

// PUT /api/tasks/:id - update existing task
router.put('/:id', validateUpdateTask, (req, res, next) =>
  taskController.updateTask(req, res, next)
);

// PATCH /api/tasks/:id/status - quick status toggle
router.patch('/:id/status', validateUpdateStatus, (req, res, next) =>
  taskController.updateTaskStatus(req, res, next)
);

// DELETE /api/tasks/:id - delete task
router.delete('/:id', (req, res, next) => taskController.deleteTask(req, res, next));

module.exports = router;
