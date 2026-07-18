// Import Express framework
import express from 'express';

// Import controller functions for handling different routes
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

// Create a new router instance
const router = express.Router();

// Route for homepage
router.get('/', showHomePage);

// Route for organizations page
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for projects page
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Route for categories page
router.get('/categories', showCategoriesPage);
router.get('/categories/:id', showCategoryDetailsPage);

// Route for testing error page
router.get('/test-error', testErrorPage);

// Export router so it can be used in app.js
export default router;
