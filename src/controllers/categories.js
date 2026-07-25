// Import model functions
import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    getCategoriesByProjectId
} from '../models/categories.js';

// Import project model functions
import {
   getProjectDetails
} from '../models/projects.js';


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


// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};