-- ============================================================
-- 1. CREATE TABLES
-- ============================================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

-- ============================================================
-- 2. INSERT ORGANIZATIONS (with explicit IDs)
-- ============================================================

INSERT INTO organization (organization_id, name, description, contact_email, logo_filename)
VALUES
(1, 'BrightFuture Builders',
 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
 'info@brightfuturebuilders.org',
 'brightfuture-logo.png'),

(2, 'GreenHarvest Growers',
 'An urban farming collective promoting food sustainability and education in local neighborhoods.',
 'contact@greenharvest.org',
 'greenharvest-logo.png'),

(3, 'UnityServe Volunteers',
 'A volunteer coordination group supporting local charities and service initiatives.',
 'hello@unityserve.org',
 'unityserve-logo.png'),

(9, 'SolarPath Initiative',
 'SolarPath Initiative is a nonprofit dedicated to expanding access to renewable energy in underserved communities. The organization provides solar-powered solutions for schools, clinics, and community centers, while also offering training programs to promote green jobs and sustainable living.',
 'info@solarpath.org',
 'placeholder-logo.png'),

(10, 'Grader Network',
 'help educators',
 'grader@example.edu',
 'placeholder-logo.png');

-- ============================================================
-- 3. INSERT PROJECTS (with explicit IDs)
-- ============================================================

INSERT INTO project (project_id, organization_id, title, description, location, project_date)
VALUES
(1, 1, 'Downtown Housing Renovation',
 'Renovating abandoned homes into affordable housing units.',
 'Downtown District',
 '2026-08-15'),

(2, 1, 'Community Center Construction',
 'Building a new community center with classrooms and event space.',
 'Westside Neighborhood',
 '2026-09-20'),

(3, 1, 'Senior Home Repairs',
 'Repairing roofs, plumbing, and accessibility features for elderly residents.',
 'Oakwood Estates',
 '2026-10-05'),

(4, 1, 'Playground Build Day',
 'Constructing a safe playground for the local elementary school building',
 'Maple Street School',
 '2026-07-29'),

(5, 1, 'Emergency Shelter Expansion',
 'Adding 20 new beds to the regional emergency shelter.',
 'Riverside Shelter',
 '2026-11-12'),

(6, 2, 'Urban Garden Initiative',
 'Converting vacant lots into productive vegetable gardens.',
 'Eastside Blocks',
 '2026-08-01'),

(7, 2, 'School Greenhouse Program',
 'Installing greenhouses at three local schools for education.',
 'Lincoln High School',
 '2026-09-10'),

(8, 2, 'Food Bank Harvest Drive',
 'Growing and harvesting fresh produce for the food bank.',
 'GreenHarvest Farm',
 '2026-10-20'),

(9, 2, 'Composting Workshop Series',
 'Teaching residents how to compost and reduce food waste.',
 'Community Library',
 '2026-08-25'),

(10, 2, 'Orchard Planting Day',
 'Planting 50 fruit trees in public parks and schoolyards.',
 'Memorial Park',
 '2026-11-03'),

(11, 3, 'Park Cleanup Weekend',
 'Clearing trash, painting benches, and landscaping city parks.',
 'Central Park',
 '2026-07-18'),

(12, 3, 'Meal Delivery Program',
 'Preparing and delivering hot meals to homebound seniors.',
 'Community Kitchen',
 '2026-08-08'),

(13, 3, 'Back-to-School Supply Drive',
 'Collecting and distributing backpacks and school supplies.',
 'Town Hall',
 '2026-08-21'),

(14, 3, 'Winter Coat Distribution',
 'Collecting and distributing warm coats to families in need.',
 'UnityServe Center',
 '2026-11-15'),

(15, 3, 'Neighborhood Literacy Tutoring',
 'After-school reading and homework help for elementary students.',
 'Public Library',
 '2026-09-05'),

(16, 9, 'Solar Schools Program',
 'This project equips rural schools with solar panels to provide reliable electricity for classrooms, computer labs, and evening study sessions. It also includes training workshops for teachers and students on renewable energy awareness and maintenance.',
 'Kaduna, Nigeria',
 '2026-09-15'),

(17, 10, 'grading',
 'help schools grade assignments',
 'online',
 '2026-08-27');

-- ============================================================
-- 4. INSERT CATEGORIES (with explicit IDs)
-- ============================================================

INSERT INTO category (category_id, category_name)
VALUES
(1, 'Construction & Repair'),
(2, 'Environmental & Gardening'),
(3, 'Community Outreach'),
(4, 'Education & Tutoring'),
(5, 'Food & Nutrition'),
(6, 'school research project'),
(7, 'Grading');

-- ============================================================
-- 5. ASSOCIATE PROJECTS WITH CATEGORIES (all links)
-- ============================================================

INSERT INTO project_category (project_id, category_id)
VALUES
(1, 1),
(2, 1),
(3, 1),
(5, 1),
(6, 2),
(6, 5),
(7, 2),
(8, 2),
(8, 5),
(9, 2),
(10, 2),
(11, 3),
(12, 5),
(14, 3),
(15, 3),
(15, 4),
(13, 3),
(13, 4),
(13, 6),
(4, 1),
(17, 7),
(17, 6);

