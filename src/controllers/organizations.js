// Import model functions
import {
    getAllOrganizations,
    getOrganizationDetails
} from '../models/organizations.js';

import { getProjectsByOrganization } from '../models/projects.js';


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


// Export controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage
};