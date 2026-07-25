// Import model functions
import {
   getAllOrganizations,
   getOrganizationDetails,
   createOrganization,
   updateOrganization
} from '../models/organizations.js';

// Display all organizations
import { getProjectsByOrganization } from '../models/projects.js';

// Import express-validator for form validation
import { body, validationResult } from 'express-validator';


// Define validation and sanitization rules for organization form
// Validation rules for the new organization form
const organizationValidation = [

   // Validate the organization name
   body('name')

      // Remove extra spaces
      .trim()

      // Make sure the field is not empty
      .notEmpty()
      .withMessage('Organization name is required')

      // Require between 3 and 150 characters
      .isLength({ min: 3, max: 150 })
      .withMessage('Organization name must be between 3 and 150 characters'),

   // Validate the organization description
   body('description')

      // Remove extra spaces
      .trim()

      // Make sure the field is not empty
      .notEmpty()
      .withMessage('Organization description is required')

      // Limit the description to 500 characters
      .isLength({ max: 500 })
      .withMessage('Organization description cannot exceed 500 characters'),

   // Validate the contact email
   body('contactEmail')

      // Convert the email to a standard format
      .normalizeEmail()

      // Make sure the field is not empty
      .notEmpty()
      .withMessage('Contact email is required')

      // Check that the email format is valid
      .isEmail()
      .withMessage('Please provide a valid email address')
];


// Display all organizations
const showOrganizationsPage = async (req, res, next) => {

    try {

        // Get all organizations from the database
        const organizations = await getAllOrganizations();

        // Set the page title
        const title = "Partner Organizations";

        // Render the organizations page
        res.render("organizations", {
            title,
            organizations
        });

    } catch (err) {

        // Pass the error to Express error handler
        next(err);
    }
};


// Display one organization details page
const showOrganizationDetailsPage = async (req, res, next) => {

    try {

        // Get the organization ID from the URL
        const organizationId = req.params.id;

        // Check that the ID is a positive integer
        if (!Number.isInteger(Number(organizationId)) || Number(organizationId) <= 0) {
            const err = new Error("Invalid organization ID");
            err.status = 400;
            return next(err);
        }

        // Get the organization from the database
        const organization = await getOrganizationDetails(organizationId);

        // Check whether the organization exists
        if (!organization) {
            const err = new Error("Organization not found");
            err.status = 404;
            return next(err);
        }

        // Get all projects that belong to this organization
        const projects = await getProjectsByOrganization(organizationId);

        // Set the page title
        const title = organization.name;

        // Render the organization details page
        res.render("organization-details", {
            title,
            organization,
            projects
        });

    } catch (err) {

        // Pass the error to Express error handler
        next(err);
    }
};


const showNewOrganizationForm = async (req, res) => {
   const title = 'Add New Organization';

   res.render('new-organization', { title });
};


// Process the new organization form
const processNewOrganizationForm = async (req, res) => {

   // Get the validation results
   const results = validationResult(req);

   // Check whether validation failed
   if (!results.isEmpty()) {

      // Store each validation error as a flash message
      results.array().forEach((error) => {
         req.flash('error', error.msg);
      });

      // Return the user to the form
      return res.redirect('/new-organization');
   }

   // Get the form data
   const { name, description, contactEmail } = req.body;

   // Use the default logo for new organizations
   const logoFilename = 'placeholder-logo.png';

   // Create the organization
   const organizationId = await createOrganization(
      name,
      description,
      contactEmail,
      logoFilename
   );

   // Store a success message
   req.flash('success', 'Organization added successfully!');

   // Redirect to the organization details page
   res.redirect(`/organization/${organizationId}`);
};







// Display the edit organization form
const showEditOrganizationForm = async (req, res, next) => {

   try {

      // Get the organization ID from the URL
      const organizationId = req.params.id;

      // Check that the ID is a positive integer
      if (!Number.isInteger(Number(organizationId)) || Number(organizationId) <= 0) {

         const err = new Error('Invalid organization ID');
         err.status = 400;

         return next(err);
      }

      // Get the organization details from the database
      const organization = await getOrganizationDetails(organizationId);

      // Check whether the organization exists
      if (!organization) {

         const err = new Error('Organization not found');
         err.status = 404;

         return next(err);
      }

      // Set the page title
      const title = 'Edit Organization';

      // Render the edit organization page
      res.render('edit-organization', {
         title,
         organization
      });

   } catch (err) {

      // Pass the error to the global error handler
      next(err);
   }
};




// Process the edit organization form
const processEditOrganizationForm = async (req, res, next) => {

   try {

      // Get the validation results
      const results = validationResult(req);

      // Check whether validation failed
      if (!results.isEmpty()) {

         // Store each validation error as a flash message
         results.array().forEach((error) => {
            req.flash('error', error.msg);
         });

         // Return the user to the edit form
         return res.redirect(`/edit-organization/${req.params.id}`);
      }

      // Get the organization ID from the URL
      const organizationId = req.params.id;

      // Get the submitted form data
      const {
         name,
         description,
         contactEmail,
         logoFilename
      } = req.body;

      // Update the organization
      await updateOrganization(
         organizationId,
         name,
         description,
         contactEmail,
         logoFilename
      );

      // Store a success message
      req.flash('success', 'Organization updated successfully!');

      // Redirect to the organization details page
      res.redirect(`/organization/${organizationId}`);

   } catch (err) {

      // Pass the error to the global error handler
      next(err);
   }
};


// Export controller functions and middleware
export {
   showOrganizationsPage,
   showOrganizationDetailsPage,
   showNewOrganizationForm,
   processNewOrganizationForm,
   organizationValidation,
   showEditOrganizationForm,
   processEditOrganizationForm
};