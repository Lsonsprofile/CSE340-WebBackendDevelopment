// Import the model function
import {getAllOrganizations, getOrganizationDetails} from '../models/organizations.js';

import { getProjectsByOrganization } from '../models/projects.js';




// Define the controller
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        // Get the organization ID from the URL
        const organizationId = req.params.id;

        // Get the organization details
        const organization = await getOrganizationDetails(organizationId);

        // If the organization doesn't exist, create a 404 error
        if (!organization) {
            const err = new Error('Organization not found');
            err.status = 404;
            return next(err);
        }

        // Get all projects for this organization
        const projects = await getProjectsByOrganization(organizationId);

        // Render the details page
        res.render('organization-details', {
            title: organization.name,
            organization,
            projects
        });
    } catch (err) {
        next(err);
    }
};
// Export the controllers
export {
    showOrganizationsPage, showOrganizationDetailsPage
};