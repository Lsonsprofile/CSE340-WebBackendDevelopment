// Import project model functions
import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

// Import category model function
import {
    getCategoriesByProjectId
} from '../models/categories.js';

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


// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage
};