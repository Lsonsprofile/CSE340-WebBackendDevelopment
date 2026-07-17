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

// Export both functions so they can be imported and used in controllers
export { getAllOrganizations, getOrganizationDetails };
