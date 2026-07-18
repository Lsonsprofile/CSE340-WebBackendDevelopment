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

export {
  getAllProjects,
  getProjectsByOrganization,
  getUpcomingProjects,
  getProjectDetails,
  getCategoriesByProjectId
};