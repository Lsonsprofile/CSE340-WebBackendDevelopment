// Import the model function
import { getAllProjects } from '../models/projects.js';

// Define the controller
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

// Export the controller
export { showProjectsPage };