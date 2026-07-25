// Import model functions
import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    getCategoriesByProjectId,
    createCategory,
    updateCategory
} from '../models/categories.js';

// Import project model functions
import {
   getProjectDetails
} from '../models/projects.js';

import { body, validationResult } from 'express-validator';


// Validation rules for category forms
const categoryValidation = [

   body('categoryName')

      .trim()

      .notEmpty()
      .withMessage('Category name is required')

      .isLength({ min: 3, max: 100 })
      .withMessage(
         'Category name must be between 3 and 100 characters'
      )

];




// Display all categories
const showCategoriesPage = async (req, res, next) => {

    try {

        // Get all categories from the database
        const categories = await getAllCategories();

        // Set the page title
        const title = "Service Categories";

        // Render the categories page
        res.render("categories", {
            title,
            categories
        });

    } catch (err) {

        // Pass the error to Express error handler
        next(err);
    }
};


// Display one category details page
const showCategoryDetailsPage = async (req, res, next) => {

    try {

        // Get the category ID from the URL
        const { id } = req.params;

        // Check that the ID is a positive integer
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            const err = new Error("Invalid category ID");
            err.status = 400;
            return next(err);
        }

        // Get the category from the database
        const category = await getCategoryDetails(id);

        // Check whether the category exists
        if (!category) {
            const err = new Error("Category not found");
            err.status = 404;
            return next(err);
        }

        // Get all projects in this category
        const projects = await getProjectsByCategoryId(id);

        // Set the page title
        const title = category.category_name;

        // Render the category details page
        res.render("category-details", {
            title,
            category,
            projects
        });

    } catch (err) {

        // Pass the error to Express error handler
        next(err);
    }
};



// Display the assign categories form
const showAssignCategoriesForm = async (req, res, next) => {

   try {

      // Get the project ID from the URL
      const projectId = req.params.projectId;

      // Get the project details
      const project = await getProjectDetails(projectId);

      // Check whether the project exists
      if (!project) {

         const err = new Error('Project not found');
         err.status = 404;

         return next(err);
      }

      // Get all available categories
      const categories = await getAllCategories();

      // Get the categories assigned to this project
      const assignedCategories = await getCategoriesByProjectId(projectId);

      // Set the page title
      const title = 'Assign Categories to Project';

      // Render the assign categories page
      res.render('assign-categories', {
         title,
         project,
         projectId,
         categories,
         assignedCategories
      });

   } catch (err) {

      // Pass the error to the global error handler
      next(err);
   }
};



// Process the assign categories form
const processAssignCategoriesForm = async (req, res, next) => {

   try {

      // Get the project ID from the URL
      const projectId = req.params.projectId;

      // Get the selected category IDs from the form
      const selectedCategoryIds = req.body.categoryIds || [];

      // Ensure the selected categories are always stored in an array
      const categoryIds = Array.isArray(selectedCategoryIds)
         ? selectedCategoryIds
         : [selectedCategoryIds];

      // Update the category assignments
      await updateCategoryAssignments(
         projectId,
         categoryIds
      );

      // Store a success message
      req.flash(
         'success',
         'Project categories updated successfully!'
      );

      // Redirect to the project details page
      res.redirect(`/project/${projectId}`);

   } catch (err) {

      // Pass the error to the global error handler
      next(err);
   }
};


// Display the new category form
const showNewCategoryForm = async (req, res, next) => {

   try {

      // Set the page title
      const title = 'Add New Category';

      // Render the new category page
      res.render('new-category', {
         title
      });

   } catch (err) {

      // Pass the error to the global error handler
      next(err);
   }
};


// Process the new category form
const processNewCategoryForm = async (req, res, next) => {

   try {

      // Get the validation results
      const results = validationResult(req);

      // Check whether validation failed
      if (!results.isEmpty()) {

         // Store each validation error
         results.array().forEach((error) => {
            req.flash('error', error.msg);
         });

         // Return the user to the form
         return res.redirect('/new-category');
      }

      // Get the submitted category name
      const { categoryName } = req.body;

      // Create the category
      const newCategoryId = await createCategory(categoryName);

      // Store a success message
      req.flash(
         'success',
         'New category created successfully!'
      );

      // Redirect to the new category page
      res.redirect(`/categories/${newCategoryId}`);

   } catch (err) {

      // Pass the error to the global error handler
      next(err);
   }
};



// Display the edit category form
const showEditCategoryForm = async (req, res, next) => {

   try {

      // Get the category ID
      const categoryId = req.params.id;

      // Check for a valid ID
      if (!Number.isInteger(Number(categoryId)) || Number(categoryId) <= 0) {

         const err = new Error('Invalid category ID');
         err.status = 400;

         return next(err);
      }

      // Get the category
      const category = await getCategoryDetails(categoryId);

      // Check whether it exists
      if (!category) {

         const err = new Error('Category not found');
         err.status = 404;

         return next(err);
      }

      // Page title
      const title = 'Edit Category';

      // Render the page
      res.render('edit-category', {
         title,
         category
      });

   } catch (err) {

      next(err);
   }
};


// Process the edit category form
const processEditCategoryForm = async (req, res, next) => {

   try {

      // Check validation
      const results = validationResult(req);

      if (!results.isEmpty()) {

         results.array().forEach(error => {
            req.flash('error', error.msg);
         });

         return res.redirect(`/edit-category/${req.params.id}`);
      }

      // Get values
      const categoryId = req.params.id;
      const { categoryName } = req.body;

      // Update database
      await updateCategory(
         categoryId,
         categoryName
      );

      // Success message
      req.flash(
         'success',
         'Category updated successfully!'
      );

      // Redirect
      res.redirect(`/categories/${categoryId}`);

   } catch (err) {

      next(err);
   }
};



// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    categoryValidation,
    showEditCategoryForm,
    processEditCategoryForm
};