// Import database connection
import db from './db.js';


// Get all categories
const getAllCategories = async () => {

    // SQL query to get every category
    const sql = `
        SELECT
            category_id,
            category_name
        FROM public.category
        ORDER BY category_name;
    `;

    // Execute query
    const result = await db.query(sql);

    // Return database rows
    return result.rows;
};


// Get categories belonging to one project
const getCategoriesByProjectId = async (projectId) => {

    // SQL query to find project categories
    const sql = `
        SELECT
            c.category_id,
            c.category_name
        FROM public.category c

        -- Connect category table with junction table
        JOIN public.project_category pc
            ON c.category_id = pc.category_id

        -- Select categories for this project only
        WHERE pc.project_id = $1

        ORDER BY c.category_name;
    `;

    // Run query and pass project id into $1
    const result = await db.query(sql, [projectId]);

    // Return matching categories
    return result.rows;
};


// Get one category by its ID
const getCategoryDetails = async (categoryId) => {

    // SQL query to get one category
    const sql = `
        SELECT
            category_id,
            category_name
        FROM public.category
        WHERE category_id = $1;
    `;

    // Execute the query
    const result = await db.query(sql, [categoryId]);

    // Return the first matching row
    return result.rows[0];
};


// Get all projects that belong to one category
const getProjectsByCategoryId = async (categoryId) => {

    // SQL query to find projects in the selected category
    const sql = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.project_date,
            p.location,
            o.organization_id,
            o.name AS organization_name
        FROM public.project p

        JOIN public.project_category pc
            ON p.project_id = pc.project_id

        JOIN public.organization o
            ON p.organization_id = o.organization_id

        WHERE pc.category_id = $1

        ORDER BY p.project_date;
    `;

    // Execute the query
    const result = await db.query(sql, [categoryId]);

    // Return matching projects
    return result.rows;
};



// Private helper function to Assign a category to a project
const assignCategoryToProject = async (
   projectId,
   categoryId
) => {

   // SQL query to create a project-category relationship
   const query = `
      INSERT INTO project_category (
         project_id,
         category_id
      )
      VALUES ($1, $2);
   `;

   // Execute the SQL query
   await db.query(query, [
      projectId,
      categoryId
   ]);
};



// Update all category assignments for a project
const updateCategoryAssignments = async (
   projectId,
   categoryIds
) => {

   // SQL query to remove existing category assignments
   const deleteQuery = `
      DELETE FROM project_category
      WHERE project_id = $1;
   `;

   // Remove all existing category assignments
   await db.query(deleteQuery, [projectId]);

   // Assign each selected category to the project
   for (const categoryId of categoryIds) {

      // Create the new project-category relationship
      await assignCategoryToProject(
         projectId,
         categoryId
      );
   }
};


/**
 * Creates a new category in the database.
 * @param {string} categoryName - The category name.
 * @returns {number} The ID of the newly created category.
 */
const createCategory = async (categoryName) => {

   // SQL query to insert a new category
   const query = `
      INSERT INTO category (
         category_name
      )
      VALUES ($1)
      RETURNING category_id;
   `;

   // Execute the SQL query
   const result = await db.query(query, [categoryName]);

   // Check whether the category was created
   if (result.rows.length === 0) {
      throw new Error('Failed to create category');
   }

   // Log the new category when SQL logging is enabled
   if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log(
         'Created new category with ID:',
         result.rows[0].category_id
      );
   }

   // Return the new category ID
   return result.rows[0].category_id;
};


/**
 * Updates an existing category.
 * @param {number} categoryId - The category ID.
 * @param {string} categoryName - The updated category name.
 * @returns {number} The updated category ID.
 */
const updateCategory = async (
   categoryId,
   categoryName
) => {

   // SQL query to update the category
   const query = `
      UPDATE category
      SET
         category_name = $1
      WHERE category_id = $2
      RETURNING category_id;
   `;

   // Execute the SQL query
   const result = await db.query(
      query,
      [categoryName, categoryId]
   );

   // Check whether a category was updated
   if (result.rows.length === 0) {
      throw new Error('Failed to update category');
   }

   // Log the update when SQL logging is enabled
   if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log(
         'Updated category with ID:',
         categoryId
      );
   }

   // Return the updated category ID
   return result.rows[0].category_id;
};


// Export model functions
export {
    getAllCategories,
    getCategoriesByProjectId,
    getCategoryDetails,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};