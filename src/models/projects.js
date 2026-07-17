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

export {
  getAllProjects,
  getProjectsByOrganization
};