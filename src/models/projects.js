import db from './db.js';

// this gets all projects in the database
const getAllProjects = async () => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      p.organization_id,
      o.name AS organization_name
    FROM public.project p
    INNER JOIN public.organization o
      ON p.organization_id = o.organization_id
    ORDER BY p.project_date;
  `;

  const result = await db.query(query);

  return result.rows;
};

// this gets all projects for a specific organization
const getProjectsByOrganization = async (organizationId) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      p.organization_id
    FROM public.project p
    WHERE p.organization_id = $1
    ORDER BY p.project_date;
  `;

  const result = await db.query(query, [organizationId]);

  return result.rows;

  
};


const getUpcomingProjects = async (numberOfProjects) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      p.organization_id,
      o.name AS organization_name
    FROM public.project p
    INNER JOIN public.organization o
      ON p.organization_id = o.organization_id
    WHERE p.project_date >= CURRENT_DATE
    ORDER BY p.project_date
    LIMIT $1;
  `;

  const result = await db.query(query, [numberOfProjects]);

  return result.rows;
};

// this gets the details for a specific project
const getProjectDetails = async (id) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      p.organization_id,
      o.name AS organization_name
    FROM public.project p
    INNER JOIN public.organization o
      ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;

  const result = await db.query(query, [id]);

  return result.rows[0];
};

// gets all categories for a specific project
const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT
      c.category_id,
      c.category_name
    FROM public.category c
    INNER JOIN public.project_category pc
      ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.category_name;
  `;

  const result = await db.query(query, [projectId]);

  return result.rows;
};


/**
 * Creates a new service project in the database.
 * @param {string} title - The project title.
 * @param {string} description - The project description.
 * @param {string} location - The project location.
 * @param {string} projectDate - The project date.
 * @param {number} organizationId - The organization ID.
 * @returns {number} The ID of the newly created project.
 */
const createProject = async (
   title,
   description,
   location,
   projectDate,
   organizationId
) => {

   // SQL query to insert a new project
   const query = `
      INSERT INTO project (
         title,
         description,
         location,
         project_date,
         organization_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
   `;

   // Values that replace the SQL placeholders
   const queryParams = [
      title,
      description,
      location,
      projectDate,
      organizationId
   ];

   // Execute the SQL query
   const result = await db.query(query, queryParams);

   // Check whether the project was created
   if (result.rows.length === 0) {
      throw new Error('Failed to create project');
   }

   // Log the new project when SQL logging is enabled
   if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Created new project with ID:', result.rows[0].project_id);
   }

   // Return the new project ID
   return result.rows[0].project_id;
};




/**
 * Updates an existing service project.
 * @param {number} projectId - The project ID.
 * @param {string} title - The updated project title.
 * @param {string} description - The updated project description.
 * @param {string} location - The updated project location.
 * @param {string} projectDate - The updated project date.
 * @param {number} organizationId - The updated organization ID.
 * @returns {number} The updated project ID.
 */
const updateProject = async (
   projectId,
   title,
   description,
   location,
   projectDate,
   organizationId
) => {

   // SQL query to update the project
   const query = `
      UPDATE project
      SET
         title = $1,
         description = $2,
         location = $3,
         project_date = $4,
         organization_id = $5
      WHERE project_id = $6
      RETURNING project_id;
   `;

   // Values that replace the SQL placeholders
   const queryParams = [
      title,
      description,
      location,
      projectDate,
      organizationId,
      projectId
   ];

   // Execute the SQL query
   const result = await db.query(query, queryParams);

   // Check whether the project was updated
   if (result.rows.length === 0) {
      throw new Error('Failed to update project');
   }

   // Log the update when SQL logging is enabled
   if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Updated project with ID:', projectId);
   }

   // Return the updated project ID
   return result.rows[0].project_id;
};



export {
   getAllProjects,
   getProjectsByOrganization,
   getUpcomingProjects,
   getProjectDetails,
   getCategoriesByProjectId,
   createProject,
   updateProject
};