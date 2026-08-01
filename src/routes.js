// Import Express framework
import express from 'express';

// Import controller functions for handling different routes
import { showHomePage } from './controllers/index.js';

// import validation rules for the new organization form and processNewOrganizationForm
import {
   showOrganizationsPage,
   showOrganizationDetailsPage,
   showNewOrganizationForm,
   processNewOrganizationForm,
   organizationValidation,
   showEditOrganizationForm,
   processEditOrganizationForm
} from './controllers/organizations.js';

// Import project controller functions and validation rules
import {
   showProjectsPage,
   showProjectDetailsPage,
   showNewProjectForm,
   processNewProjectForm,
   showEditProjectForm,
   processEditProjectForm,
   projectValidation
} from './controllers/projects.js';

// Import category controller functions
import {
   showCategoriesPage,
   showCategoryDetailsPage,
   showAssignCategoriesForm,
   processAssignCategoriesForm,
   showNewCategoryForm,
   processNewCategoryForm,
   showEditCategoryForm,
   processEditCategoryForm,
   categoryValidation
} from './controllers/categories.js';

// Import user controller functions
import {
   showUserRegistrationForm,
   processUserRegistrationForm,
   showLoginForm,
   processLoginForm,
   processLogout,
   requireLogin,
   requireRole,
   showDashboard,
   showUsersPage
} from './controllers/users.js';

import { testErrorPage } from './controllers/errors.js';

// Create a new router instance
const router = express.Router();

// Route for homepage
router.get('/', showHomePage);

// Route for organizations page
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization form
router.get(
   '/new-organization',
   requireRole('admin'),
   showNewOrganizationForm
);

// Route for new organization form submission
router.post(
   '/new-organization',
   requireRole('admin'),
   organizationValidation,
   processNewOrganizationForm
);

// Route to display the edit organization form
router.get(
   '/edit-organization/:id',
   requireRole('admin'),
   showEditOrganizationForm
);

// Route to process the edit organization form
router.post(
   '/edit-organization/:id',
   requireRole('admin'),
   organizationValidation,
   processEditOrganizationForm
);

// Route for projects page
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Route to display the new project form
router.get(
   '/new-project',
   requireRole('admin'),
   showNewProjectForm
);

// Route to process the new project form
router.post(
   '/new-project',
   requireRole('admin'),
   projectValidation,
   processNewProjectForm
);

// Route to display the edit project form
router.get(
   '/edit-project/:id',
   requireRole('admin'),
   showEditProjectForm
);

// Route to process the edit project form
router.post(
   '/edit-project/:id',
   requireRole('admin'),
   projectValidation,
   processEditProjectForm
);


// Route for categories page
router.get('/categories', showCategoriesPage);
router.get('/categories/:id', showCategoryDetailsPage);

// Route to display the assign categories form
router.get(
   '/assign-categories/:projectId',
   requireRole('admin'),
   showAssignCategoriesForm
);

// Route to process the assign categories form
router.post(
   '/assign-categories/:projectId',
   requireRole('admin'),
   processAssignCategoriesForm
);


// Route to display the new category form
router.get(
   '/new-category',
   requireRole('admin'),
   showNewCategoryForm
);

// Route to process the new category form
router.post(
   '/new-category',
   requireRole('admin'),
   categoryValidation,
   processNewCategoryForm
);

// Route to display the edit category form
router.get(
   '/edit-category/:id',
   requireRole('admin'),
   showEditCategoryForm
);

// Route to process the edit category form
router.post(
   '/edit-category/:id',
   requireRole('admin'),
   categoryValidation,
   processEditCategoryForm
);


// Route to display the registration form
router.get(
   '/register',
   showUserRegistrationForm
);

// Route to process the registration form
router.post(
   '/register',
   processUserRegistrationForm
);

// Route to display the login form
router.get(
   '/login',
   showLoginForm
);


// Route to process the login form
router.post(
   '/login',
   processLoginForm
);


// Route to logout user
router.get(
   '/logout',
   processLogout
);

// Protected dashboard route
router.get(
   '/dashboard',
   requireLogin,
   showDashboard
);

// Protected users page (admin only)
router.get(
   '/users',
   requireRole('admin'),
   showUsersPage
);

// Route for testing error page
router.get('/test-error', testErrorPage);

// Export router so it can be used in app.js
export default router;