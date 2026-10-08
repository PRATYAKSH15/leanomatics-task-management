/**
 * Request validation middleware for Task Management REST APIs
 */

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Validate task creation request body
 */
function validateCreateTask(req, res, next) {
  const { title, description, status, priority, dueDate } = req.body;
  const errors = [];

  // Title validation
  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required and cannot be empty.' });
  } else if (title.trim().length > 150) {
    errors.push({ field: 'title', message: 'Title must not exceed 150 characters.' });
  }

  // Description validation
  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push({ field: 'description', message: 'Description is required and cannot be empty.' });
  } else if (description.trim().length > 2000) {
    errors.push({ field: 'description', message: 'Description must not exceed 2000 characters.' });
  }

  // Status validation (optional on creation, defaults to pending)
  if (status && !VALID_STATUSES.includes(status)) {
    errors.push({
      field: 'status',
      message: `Status must be one of: ${VALID_STATUSES.join(', ')}.`,
    });
  }

  // Priority validation (optional on creation, defaults to medium)
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    errors.push({
      field: 'priority',
      message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`,
    });
  }

  // Due Date validation (optional)
  if (dueDate) {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'dueDate', message: 'Due date must be a valid date string (e.g., YYYY-MM-DD).' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
  }

  next();
}

/**
 * Validate task update request body
 */
function validateUpdateTask(req, res, next) {
  const { title, description, status, priority, dueDate } = req.body;
  const errors = [];

  // Check if at least one field is provided
  if (
    title === undefined &&
    description === undefined &&
    status === undefined &&
    priority === undefined &&
    dueDate === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: 'At least one field (title, description, status, priority, dueDate) must be provided for update.',
    });
  }

  // Title validation if provided
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      errors.push({ field: 'title', message: 'Title cannot be empty.' });
    } else if (title.trim().length > 150) {
      errors.push({ field: 'title', message: 'Title must not exceed 150 characters.' });
    }
  }

  // Description validation if provided
  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim() === '') {
      errors.push({ field: 'description', message: 'Description cannot be empty.' });
    } else if (description.trim().length > 2000) {
      errors.push({ field: 'description', message: 'Description must not exceed 2000 characters.' });
    }
  }

  // Status validation if provided
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push({
      field: 'status',
      message: `Status must be one of: ${VALID_STATUSES.join(', ')}.`,
    });
  }

  // Priority validation if provided
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push({
      field: 'priority',
      message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`,
    });
  }

  // Due Date validation if provided
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'dueDate', message: 'Due date must be a valid date string (e.g., YYYY-MM-DD).' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
  }

  next();
}

/**
 * Validate status update endpoint
 */
function validateUpdateStatus(req, res, next) {
  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Valid status is required (${VALID_STATUSES.join(', ')}).`,
    });
  }
  next();
}

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateUpdateStatus,
};
