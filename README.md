# Cleanomatics - Full-Stack Task Management System

A modern, high-performance full-stack Task Management application built with a **Node.js + Express REST API** backend and a **React 19 + Vite** frontend. Features an executive light-theme design, in-memory data persistence, interactive Swagger OpenAPI docs, and full search, filtering, and pagination capabilities.

---

## 🌟 Key Features

### 🖥️ Frontend (React 19 + Vite)
- **Executive Light Theme**: Clean, accessible palette with high-contrast slate typography, crisp card surfaces, and subtle borders.
- **Bonus Dark Mode**: Sleek dark theme toggle with state persisted to `localStorage`.
- **Dashboard & Interactive Metrics**:
  - Live metric counters: *Total, Pending, In Progress, Completed, High Priority, Overdue*.
  - Clicking any metric counter instantly filters the task list!
- **Dual View Modes**:
  - **Grid Cards View**: Card-based overview with line clamp, priority pills, relative due dates, and quick actions.
  - **Table View**: Compact, tabular data layout for quick desktop auditing.
- **Search & Debouncing**:
  - Debounced real-time search across task titles and descriptions.
  - One-click clear search button.
- **Multi-Filter & Sorting**:
  - Filter by Status (*Pending, In Progress, Completed*).
  - Filter by Priority (*Low, Medium, High*).
  - Sort by *Created Date, Due Date, Priority, or Title* with Ascending/Descending toggle.
  - One-click "Reset Filters" action.
- **Task Management CRUD**:
  - **Create Task Modal**: Validates required fields with character limits and date preset shortcuts (*Today, Tomorrow, +1 Week, +2 Weeks*).
  - **Edit Task Modal**: Pre-populates all existing data with live validation.
  - **Task Details Modal/Drawer**: Full view displaying formatted timestamps, timeline urgency, full markdown description, and quick action shortcuts.
  - **Quick Status Changer**: Change task status immediately from cards or table without opening edit mode.
  - **Safe Deletion**: Confirmation dialog with task title to prevent accidental loss.
- **Feedback & Resilience**:
  - Animated toast notification system for success and error alerts.
  - Shimmer skeleton loaders while fetching data.
  - Illustrated empty state with direct call-to-action.
  - Live backend connection indicator with auto-reconnect ping.

### ⚙️ Backend (Node.js + Express)
- **Clean Architectural Separation**:
  - `routes/`: Maps endpoints and registers middleware.
  - `controllers/`: Handles HTTP request/response flow.
  - `services/`: In-memory data store logic, querying, sorting, and pagination.
  - `middleware/`: Centralized error handler and request validator.
  - `swagger/`: OpenAPI 3.0 specification.
- **In-Memory Store**: Pure backend memory persistence (no DB/Firebase) pre-seeded with realistic initial tasks.
- **Interactive Swagger UI**: Explore and test API endpoints live at `http://localhost:5000/api-docs`.
- **Comprehensive Validation**:
  - Required title (3–150 chars) and description (5–2000 chars).
  - Enum validations for status and priority.
  - Date format validation.
  - Informative validation error responses with specific field messages.
- **CORS & Environment Variables**: Configurable via `.env` file.

---

## 🏗️ Architecture & Project Structure

```text
Cleanomatics/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js                   # Environment variables configuration
│   │   ├── controllers/
│   │   │   └── task.controller.js       # HTTP controllers for tasks
│   │   ├── data/
│   │   │   └── initialTasks.js          # In-memory seed tasks
│   │   ├── middleware/
│   │   │   ├── errorHandler.js          # Centralized error handler & 404 handler
│   │   │   └── validation.js            # Input validation middleware
│   │   ├── routes/
│   │   │   └── task.routes.js           # REST API routes
│   │   ├── services/
│   │   │   └── task.service.js          # In-memory business logic & querying
│   │   ├── swagger/
│   │   │   └── swaggerDocument.js       # OpenAPI 3.0 spec definition
│   │   ├── app.js                       # Express configuration & middleware
│   │   └── server.js                    # Server startup script
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── test-api.js                      # Automated API integration tests
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg                  # Brand SVG favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Header with brand, health status, Swagger link & theme toggle
│   │   │   ├── StatCards.jsx            # Interactive summary counters
│   │   │   ├── FilterBar.jsx            # Debounced search, status/priority filters, sort & view toggle
│   │   │   ├── TaskList.jsx             # Orchestrates cards, table, skeletons, and empty state
│   │   │   ├── TaskCard.jsx             # Grid card view component
│   │   │   ├── TaskTable.jsx            # Tabular view component
│   │   │   ├── TaskModal.jsx            # Create and Edit task modal with validation
│   │   │   ├── TaskDetailModal.jsx      # Complete task detail drawer
│   │   │   ├── DeleteConfirmModal.jsx   # Safe delete confirmation dialog
│   │   │   ├── Pagination.jsx           # Page navigation & page-size dropdown
│   │   │   ├── Toast.jsx                # Toast notifications
│   │   │   └── EmptyState.jsx           # Illustrated empty state
│   │   ├── context/
│   │   │   └── ThemeContext.jsx         # Light (default) & dark theme provider
│   │   ├── services/
│   │   │   └── api.js                   # Centralized API service layer
│   │   ├── styles/
│   │   │   └── index.css                # Global design system, light/dark tokens & responsive styles
│   │   ├── utils/
│   │   │   └── helpers.js               # Date formatters, badges config, and debounce
│   │   ├── App.jsx                      # Main dashboard application
│   │   └── main.jsx                     # Application entry point
│   ├── .env.example
│   ├── .env
│   ├── index.html                       # HTML root with Inter & Outfit Google Fonts
│   ├── package.json
│   └── vite.config.js                   # Vite config with backend API proxy
│
├── postman/
│   └── Cleanomatics_Task_Management_API.postman_collection.json
├── .gitignore
├── package.json                         # Workspace root scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22+ recommended)
- **npm**: v9.0.0 or higher

---

### Step 1: Clone & Install Dependencies

From the workspace root directory:

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install
```

*(Alternatively, run `npm run install:all` from the root directory).*

---

### Step 2: Configure Environment Variables

#### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

*(Both directories already contain pre-configured `.env` and `.env.example` files).*

---

### Step 3: Run the Application

Open two terminal windows:

#### Terminal 1 — Backend Server:
```bash
cd backend
npm run dev
# or npm start
```
> Backend runs at: **http://localhost:5000**  
> Swagger Documentation at: **http://localhost:5000/api-docs**

#### Terminal 2 — Frontend Application:
```bash
cd frontend
npm run dev
```
> Frontend runs at: **http://localhost:5173**

Open **http://localhost:5173** in your browser to view the application in the **Light Theme**.

---

## 📡 REST API Documentation

### Endpoints Overview

| Method | Endpoint | Description | Query / Body Params | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Health & uptime check | None | `200` |
| **GET** | `/api/tasks` | Get all tasks | `search`, `status`, `priority`, `sortBy`, `sortOrder`, `page`, `limit` | `200` |
| **GET** | `/api/tasks/stats` | Dashboard statistics | None | `200` |
| **GET** | `/api/tasks/:id` | Get single task by ID | `id` in URL parameter | `200`, `404` |
| **POST** | `/api/tasks` | Create a new task | `{ title, description, status?, priority?, dueDate? }` | `201`, `400` |
| **PUT** | `/api/tasks/:id` | Update an existing task | `{ title?, description?, status?, priority?, dueDate? }` | `200`, `400`, `404` |
| **PATCH** | `/api/tasks/:id/status` | Quick status change | `{ status }` | `200`, `400`, `404` |
| **DELETE** | `/api/tasks/:id` | Delete a task | `id` in URL parameter | `200`, `404` |
| **POST** | `/api/tasks/reset` | Reset to seed demo tasks | None | `200` |

---

### Sample Requests & Responses

#### 1. Create a Task (`POST /api/tasks`)
**Request Body:**
```json
{
  "title": "Complete Cleanomatics assignment",
  "description": "Build the full-stack task management application with light theme and REST APIs.",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2026-10-15"
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "id": "e7c2c54e-bf2d-4581-9bd3-74d1253a697e",
    "title": "Complete Cleanomatics assignment",
    "description": "Build the full-stack task management application with light theme and REST APIs.",
    "status": "in_progress",
    "priority": "high",
    "dueDate": "2026-10-15",
    "createdAt": "2026-10-08T11:00:00.000Z",
    "updatedAt": "2026-10-08T11:00:00.000Z"
  }
}
```

#### 2. Validation Error Example (`POST /api/tasks` with empty fields)
**Response (`400 Bad Request`):**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "title", "message": "Title is required and cannot be empty." },
    { "field": "description", "message": "Description is required and cannot be empty." }
  ]
}
```

---

## 🧪 Automated Testing

An automated API integration test suite is included in `backend/test-api.js`.

To run the automated tests against the backend:
```bash
cd backend
node test-api.js
```

All 7 core CRUD workflows, validation scenarios, and statistical calculations are validated automatically.

---

## 📮 Postman Collection & Swagger

1. **Swagger UI**: Visit `http://localhost:5000/api-docs` when the backend is running.
2. **Postman**: Import `postman/Cleanomatics_Task_Management_API.postman_collection.json` into Postman to test all endpoints with pre-populated parameters.

---

## 🎨 Design Philosophy & Evaluation Highlights

- **Light Theme Excellence**: Designed from the ground up for high readability, modern micro-interactions, clean card elevations, and color-coded status badges.
- **Atomic Components**: Reusable UI components with clear props and responsibilities.
- **Dedicated Service Layer**: Clean separation of frontend network concerns in `api.js`.
- **Zero Database / Realtime DB Dependency**: Adheres strictly to the in-memory backend specification.
- **Complete Bonus Features**: Debounced search, multi-filter combinations, custom sorting, pagination with page-size selector, dark mode toggle, and Swagger documentation.
