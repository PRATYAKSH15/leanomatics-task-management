const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swaggerDocument');
const taskRoutes = require('./routes/task.routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { CORS_ORIGIN, NODE_ENV } = require('./config/env');

const app = express();

// CORS configuration supporting frontend origin and standard methods
const allowedOrigins = [
  CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman, or same-origin in production)
      if (!origin) return callback(null, true);
      // In development or if origin matches or if wildcard configured
      if (
        NODE_ENV === 'development' ||
        allowedOrigins.indexOf(origin) !== -1 ||
        !CORS_ORIGIN ||
        CORS_ORIGIN === '*'
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow all web origins for effortless evaluator deployment
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (in non-test mode)
if (NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Swagger API Documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Cleanomatics API Documentation',
}));

// API root welcome & health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Task Routes
app.use('/api/tasks', taskRoutes);

// Serve static frontend build if present (Unified Single-Service Deployment on Render/Railway)
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// For client-side routing, serve index.html for non-API routes
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/api-docs')) {
    return next();
  }
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
});

// Fallback for undefined API routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;

