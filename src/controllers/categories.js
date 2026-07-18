// Import model functions
import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId
} from '../models/categories.js';


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


// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage
};