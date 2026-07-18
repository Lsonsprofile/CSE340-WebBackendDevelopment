// Import model functions
import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId
} from '../models/categories.js';


// Display all categories
const showCategoriesPage = async (req, res) => {

    try {

        // Get categories from the database
        const categories = await getAllCategories();

        const title = "Service Categories";

        // Render categories page
        res.render('categories', {
            title,
            categories
        });

    } catch (error) {

        console.error("Error loading categories:", error);

        res.status(500).send("Server Error");
    }
};


// Display one category details page
const showCategoryDetailsPage = async (req, res) => {

    try {

        // Get category ID from the URL
        const { id } = req.params;

        // Get category information
        const category = await getCategoryDetails(id);

        // Get all projects in this category
        const projects = await getProjectsByCategoryId(id);

        const title = category.category_name;

        // Render category details page
        res.render('category-details', {
            title,
            category,
            projects
        });

    } catch (error) {

        console.error("Error loading category details:", error);

        res.status(500).send("Server Error");
    }
};


// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage
};