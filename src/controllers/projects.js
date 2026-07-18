// Import project model functions
import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';


// Import category model function
import {
    getCategoriesByProjectId
} from '../models/categories.js';


const NUMBER_OF_UPCOMING_PROJECTS = 5;


// Display all upcoming projects
const showProjectsPage = async (req, res) => {

    // Get projects from database
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    const title = 'Upcoming Service Projects';


    // Send data to EJS
    res.render('projects', {
        title,
        projects
    });
};



// Display one project details page
const showProjectDetailsPage = async (req, res) => {

    // Get project id from URL
    const { id } = req.params;


    // Get project information
    const project = await getProjectDetails(id);


    // Get categories connected to this project
    const categories = await getCategoriesByProjectId(id);


    // Page title
    const title = project.title;


    // Send data to EJS
    res.render('project-details', {
        title,
        project,
        categories
    });
};


// Export controllers
export {
    showProjectsPage,
    showProjectDetailsPage
};