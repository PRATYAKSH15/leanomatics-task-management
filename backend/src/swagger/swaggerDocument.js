/**
 * OpenAPI 3.0.0 Specification for Cleanomatics Task Management System
 */

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Cleanomatics Task Management REST API',
    version: '1.0.0',
    description:
      'Production-ready REST API for the Task Management System with in-memory persistence, filtering, sorting, pagination, and data validation.',
    contact: {
      name: 'Full Stack Engineering Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  paths: {
    '/api/tasks': {
      get: {
        summary: 'Get all tasks',
        description: 'Retrieve tasks with optional search, status/priority filtering, sorting, and pagination.',
        parameters: [
          {
            name: 'search',
            in: 'query',
            description: 'Search string matching title or description',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'status',
            in: 'query',
            description: 'Filter by task status',
            required: false,
            schema: {
              type: 'string',
              enum: ['all', 'pending', 'in_progress', 'completed'],
            },
          },
          {
            name: 'priority',
            in: 'query',
            description: 'Filter by priority level',
            required: false,
            schema: {
              type: 'string',
              enum: ['all', 'low', 'medium', 'high'],
            },
          },
          {
            name: 'sortBy',
            in: 'query',
            description: 'Field to sort tasks by',
            required: false,
            schema: {
              type: 'string',
              enum: ['createdAt', 'dueDate', 'priority', 'title'],
              default: 'createdAt',
            },
          },
          {
            name: 'sortOrder',
            in: 'query',
            description: 'Sort direction',
            required: false,
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
            },
          },
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination (1-indexed)',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            required: false,
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          200: {
            description: 'Successful retrieval of tasks',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Task' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new task',
        description: 'Creates a task with validated title, description, status, priority, and due date.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Task created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Task created successfully.' },
                    data: { $ref: '#/components/schemas/Task' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/tasks/{id}': {
      get: {
        summary: 'Get a single task by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Unique task identifier',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Task retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Task' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update an existing task',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Unique task identifier',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TaskUpdateInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Task updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Task updated successfully.' },
                    data: { $ref: '#/components/schemas/Task' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a task',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Unique task identifier',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Task deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Task deleted successfully.' },
                    data: { $ref: '#/components/schemas/Task' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/tasks/{id}/status': {
      patch: {
        summary: 'Quick update of task status',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: ['pending', 'in_progress', 'completed'],
                    example: 'completed',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Task status updated successfully',
          },
          400: { description: 'Invalid status' },
          404: { description: 'Task not found' },
        },
      },
    },
    '/api/tasks/stats': {
      get: {
        summary: 'Get dashboard statistics',
        description: 'Returns metrics on total, pending, in-progress, completed, high-priority, and overdue tasks.',
        responses: {
          200: {
            description: 'Statistics retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer', example: 6 },
                        pending: { type: 'integer', example: 3 },
                        in_progress: { type: 'integer', example: 2 },
                        completed: { type: 'integer', example: 1 },
                        high: { type: 'integer', example: 2 },
                        overdue: { type: 'integer', example: 0 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'd3b07384-d113-46d4-8d4e-b5c6d3ffbe00' },
          title: { type: 'string', example: 'Complete assignment' },
          description: { type: 'string', example: 'Build the full-stack task manager' },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'completed'],
            example: 'pending',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            example: 'high',
          },
          dueDate: { type: 'string', format: 'date', example: '2026-10-15' },
          createdAt: { type: 'string', format: 'date-time', example: '2026-10-08T10:00:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2026-10-08T10:00:00.000Z' },
        },
      },
      TaskInput: {
        type: 'object',
        required: ['title', 'description'],
        properties: {
          title: { type: 'string', example: 'Complete assignment' },
          description: { type: 'string', example: 'Build the full-stack task manager' },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            default: 'medium',
          },
          dueDate: { type: 'string', format: 'date', example: '2026-10-15' },
        },
      },
      TaskUpdateInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Updated title' },
          description: { type: 'string', example: 'Updated description' },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'completed'],
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
          },
          dueDate: { type: 'string', format: 'date', example: '2026-10-25' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          totalItems: { type: 'integer', example: 25 },
          totalPages: { type: 'integer', example: 3 },
          currentPage: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          hasNextPage: { type: 'boolean', example: true },
          hasPrevPage: { type: 'boolean', example: false },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed.' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'title' },
                message: { type: 'string', example: 'Title is required and cannot be empty.' },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
