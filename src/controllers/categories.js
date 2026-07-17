// Import the model function
import { getAllCategories } from '../models/categories.js';

// Define the controller
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

// Export the controller
export { showCategoriesPage };