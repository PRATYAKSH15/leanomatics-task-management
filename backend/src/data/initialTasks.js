/**
 * Initial seed tasks for the Task Management System in-memory store.
 * Provides realistic initial data across pending, in_progress, and completed states.
 */
const initialTasks = [
  {
    id: "task-001",
    title: "Design System & UI Components Architecture",
    description: "Establish atomic design guidelines, typography scales, light/dark color tokens, and accessible interactive primitives for the dashboard.",
    status: "completed",
    priority: "high",
    dueDate: "2026-10-10",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "task-002",
    title: "Develop REST API Endpoints with Express",
    description: "Implement clean architecture with dedicated controllers, validation middleware, and in-memory service layer handling all CRUD operations.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-10-12",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "task-003",
    title: "Setup Interactive Swagger OpenAPI Documentation",
    description: "Integrate swagger-ui-express to provide interactive schema exploration, live testing, and exportable API collection.",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-10-14",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "task-004",
    title: "Implement Debounced Search & Multi-Filter Querying",
    description: "Add client and server-side debounced search by title and description, alongside status and priority filtering.",
    status: "pending",
    priority: "medium",
    dueDate: "2026-10-15",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "task-005",
    title: "Configure Automated Quality Assurance & Unit Tests",
    description: "Verify that all edge cases in validation, sorting, error handlers, and pagination return accurate HTTP status codes.",
    status: "pending",
    priority: "low",
    dueDate: "2026-10-18",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-006",
    title: "Audit Web Accessibility (WCAG 2.1 AA Compliance)",
    description: "Ensure keyboard navigability, high-contrast ratios for light theme, ARIA labels, and responsive layout scaling across mobile and desktop.",
    status: "pending",
    priority: "low",
    dueDate: "2026-10-20",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

module.exports = initialTasks;
