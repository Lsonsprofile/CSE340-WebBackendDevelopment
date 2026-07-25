// Import the database connection object from db.js
import db from './db.js';

// Define an async function to fetch all organizations
const getAllOrganizations = async () => {
  // SQL query to select organization fields from the organization table
  const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organization;
  `;
  // Execute the query against the database
  const result = await db.query(query);
  // Return all rows (all organizations) from the result
  return result.rows; 
};

// Define an async function to fetch details for a single organization by ID
const getOrganizationDetails = async (id) => {
  // SQL query to select organization fields where the ID matches
  const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organization
    WHERE organization_id = $1;
  `;
  // Execute the query, passing the ID as a parameter to prevent SQL injection
  const result = await db.query(query, [id]);
  // Return the first row if found, otherwise return null
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Creates a new organization in the database.
 * @param {string} name - The name of the organization.
 * @param {string} description - A description of the organization.
 * @param {string} contactEmail - The contact email for the organization.
 * @param {string} logoFilename - The filename of the organization's logo.
 * @returns {string} The id of the newly created organization record.
 */
const createOrganization = async (name, description, contactEmail, logoFilename) => {
   const query = `
      INSERT INTO organization (name, description, contact_email, logo_filename)
      VALUES ($1, $2, $3, $4)
      RETURNING organization_id
   `;

   const queryParams = [name, description, contactEmail, logoFilename];
   const result = await db.query(query, queryParams);

   if (result.rows.length === 0) {
      throw new Error('Failed to create organization');
   }

   if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Created new organization with ID:', result.rows[0].organization_id);
   }

   return result.rows[0].organization_id;
};



/**
 * Updates an existing organization in the database.
 * @param {number} organizationId - The ID of the organization.
 * @param {string} name - The updated organization name.
 * @param {string} description - The updated organization description.
 * @param {string} contactEmail - The updated contact email.
 * @param {string} logoFilename - The updated logo filename.
 */
const updateOrganization = async (
   organizationId,
   name,
   description,
   contactEmail,
   logoFilename
) => {

   // SQL query to update an organization
   const query = `
      UPDATE organization
      SET
         name = $1,
         description = $2,
         contact_email = $3,
         logo_filename = $4
      WHERE organization_id = $5
      RETURNING organization_id;
   `;

   // Values that replace the SQL placeholders
   const queryParams = [
      name,
      description,
      contactEmail,
      logoFilename,
      organizationId
   ];

   // Execute the SQL query
   const result = await db.query(query, queryParams);

   // Check whether an organization was updated
   if (result.rows.length === 0) {
      throw new Error('Failed to update organization');
   }

   // Log the update when SQL logging is enabled
   if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Updated organization with ID:', organizationId);
   }

   // Return the updated organization ID
   return result.rows[0].organization_id;
};



// Export both functions so they can be imported and used in controllers
export {
   getAllOrganizations,
   getOrganizationDetails,
   createOrganization,
   updateOrganization
};