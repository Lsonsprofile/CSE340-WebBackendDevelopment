// Import project model functions
import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';

import {
    getCategoriesByProjectId
} from "../models/categories.js";

// Import organization model functions
import {
   getAllOrganizations
} from '../models/organizations.js';

// Import express-validator
import { body, validationResult } from 'express-validator';

// Validation rules for the new project form
const projectValidation = [

   // Validate the project title
   body('title')

      // Remove extra spaces
      .trim()

      // Make sure the field is not empty
      .notEmpty()
      .withMessage('Project title is required')

      // Require between 3 and 200 characters
      .isLength({ min: 3, max: 200 })
      .withMessage('Project title must be between 3 and 200 characters'),

   // Validate the project description
   body('description')

      // Remove extra spaces
      .trim()

      // Make sure the field is not empty
      .notEmpty()
      .withMessage('Project description is required')

      // Limit the description length
      .isLength({ max: 1000 })
      .withMessage('Project description cannot exceed 1000 characters'),

   // Validate the project location
   body('location')

      // Remove extra spaces
      .trim()

      // Make sure the field is not empty
      .notEmpty()
      .withMessage('Project location is required')

      // Limit the location length
      .isLength({ max: 200 })
      .withMessage('Project location cannot exceed 200 characters'),

   // Validate the project date
   body('date')

      // Make sure the field is not empty
      .notEmpty()
      .withMessage('Project date is required')

      // Make sure it is a valid date
      .isISO8601()
      .withMessage('Please provide a valid project date'),

   // Validate the organization
   body('organizationId')

      // Make sure the field is not empty
      .notEmpty()
      .withMessage('Please select an organization')

      // Make sure it is an integer
      .isInt()
      .withMessage('Invalid organization selected')
];

// Number of projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;


// Display all upcoming projects
const showProjectsPage = async (req, res, next) => {

    try {

        // Get projects from the database
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

        // Set the page title
        const title = "Upcoming Service Projects";

        // Render the projects page
        res.render("projects", {
            title,
            projects
        });

    } catch (err) {

        // Pass the error to Express error handler
        next(err);
    }
};


// Display one project details page
const showProjectDetailsPage = async (req, res, next) => {

    try {

        // Get the project ID from the URL
        const { id } = req.params;

        // Check that the ID is a positive integer
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            const err = new Error("Invalid project ID");
            err.status = 400;
            return next(err);
        }

        // Get the project from the database
        const project = await getProjectDetails(id);

        // Check whether the project exists
        if (!project) {
            const err = new Error("Project not found");
            err.status = 404;
            return next(err);
        }

        // Get all categories for this project
        const categories = await getCategoriesByProjectId(id);

        // Set the page title
        const title = project.title;

        // Render the project details page
        res.render("project-details", {
            title,
            project,
            categories
        });

    } catch (err) {

        // Pass the error to Express error handler
        next(err);
    }
};



// Display the new project form
const showNewProjectForm = async (req, res, next) => {

   try {

      // Get all organizations from the database
      const organizations = await getAllOrganizations();

      // Set the page title
      const title = 'Add New Project';

      // Render the new project page
      res.render('new-project', {
         title,
         organizations
      });

   } catch (err) {

      // Pass the error to the global error handler
      next(err);
   }
};


// Process the new project form
const processNewProjectForm = async (req, res, next) => {

   try {

      // Get the validation results
      const results = validationResult(req);

      // Check whether validation failed
      if (!results.isEmpty()) {

         // Store each validation error as a flash message
         results.array().forEach((error) => {
            req.flash('error', error.msg);
         });

         // Return the user to the form
         return res.redirect('/new-project');
      }

      // Get the submitted form data
      const {
         title,
         description,
         location,
         date,
         organizationId
      } = req.body;

      // Create the new project
      const newProjectId = await createProject(
         title,
         description,
         location,
         date,
         organizationId
      );

      // Store a success message
      req.flash('success', 'New service project created successfully!');

      // Redirect to the new project's details page
      res.redirect(`/project/${newProjectId}`);

   } catch (err) {

      // Pass the error to the global error handler
      next(err);
   }
};


// Display the edit project form
const showEditProjectForm = async (req, res, next) => {

   try {

      // Get the project ID from the URL
      const projectId = req.params.id;

      // Check that the ID is a positive integer
      if (!Number.isInteger(Number(projectId)) || Number(projectId) <= 0) {

         const err = new Error('Invalid project ID');
         err.status = 400;

         return next(err);
      }

      // Get the project details
      const project = await getProjectDetails(projectId);

      // Check whether the project exists
      if (!project) {

         const err = new Error('Project not found');
         err.status = 404;

         return next(err);
      }

      // Get all organizations
      const organizations = await getAllOrganizations();

      // Set the page title
      const title = 'Edit Project';

      // Render the edit project page
      res.render('edit-project', {
         title,
         project,
         organizations
      });

   } catch (err) {

      // Pass the error to the global error handler
      next(err);
   }
};



// Process the edit project form
const processEditProjectForm = async (req, res, next) => {

   try {

      // Get the project ID from the URL
      const projectId = req.params.id;

      // Get the submitted form data
      const {
         title,
         description,
         location,
         date,
         organizationId
      } = req.body;

      // Update the project
      await updateProject(
         projectId,
         title,
         description,
         location,
         date,
         organizationId
      );

      // Store a success message
      req.flash(
         'success',
         'Project updated successfully!'
      );

      // Redirect to the project details page
      res.redirect(`/project/${projectId}`);

   } catch (err) {

      // Pass the error to the global error handler
      next(err);
   }
};




// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
};