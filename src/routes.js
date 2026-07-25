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
   processAssignCategoriesForm
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

// Create a new router instance
const router = express.Router();

// Route for homepage
router.get('/', showHomePage);

// Route for organizations page
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization form
router.get('/new-organization', showNewOrganizationForm);

// Route for new organization form submission
router.post(
   '/new-organization',
   organizationValidation,
   processNewOrganizationForm
);

// Route to display the edit organization form
router.get(
   '/edit-organization/:id',
   showEditOrganizationForm
);

// Route to process the edit organization form
router.post(
   '/edit-organization/:id',
   organizationValidation,
   processEditOrganizationForm
);

// Route for projects page
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Route to display the new project form
router.get(
   '/new-project',
   showNewProjectForm
);

// Route to process the new project form
router.post(
   '/new-project',
   projectValidation,
   processNewProjectForm
);

// Route to display the edit project form
router.get(
   '/edit-project/:id',
   showEditProjectForm
);

// Route to process the edit project form
router.post(
   '/edit-project/:id',
   projectValidation,
   processEditProjectForm
);


// Route for categories page
router.get('/categories', showCategoriesPage);
router.get('/categories/:id', showCategoryDetailsPage);

// Route to display the assign categories form
router.get(
   '/assign-categories/:projectId',
   showAssignCategoriesForm
);

// Route to process the assign categories form
router.post(
   '/assign-categories/:projectId',
   processAssignCategoriesForm
);

// Route for testing error page
router.get('/test-error', testErrorPage);

// Export router so it can be used in app.js
export default router;