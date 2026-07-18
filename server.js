// Import a function to test the database connection
import { testConnection } from './src/models/db.js';

// Import the router you defined in routes.js
import router from './src/routes.js';

// Import the Express framework
import express from 'express';

// Import tools for working with file paths
import { fileURLToPath } from 'url';
import path from 'path';

// Get the current environment (default to production if not set)
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Get the port number (default to 3000 if not set)
const PORT = process.env.PORT || 3000;

// Get the full path of this file
const __filename = fileURLToPath(import.meta.url);

// Get the folder path of this file
const __dirname = path.dirname(__filename);

// Create an Express application instance
const app = express();

// Serve static files (CSS, JS, images) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set the folder where EJS templates are stored
app.set('views', path.join(__dirname, 'src/views'));

// Middleware: log every request (only in development mode)
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware: make NODE_ENV available to all EJS templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// Mount the router so all routes defined in routes.js are active
app.use(router);

// Catch-all middleware for 404 Not Found errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };
    
    res.status(status).render(`errors/${template}`, context);
});

// Start the server and test the database connection
app.listen(PORT, async () => {
  try {
    await testConnection(); // test database connection
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
