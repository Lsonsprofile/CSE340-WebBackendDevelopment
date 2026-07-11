CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);



INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);


-- ============================================================
-- PROJECT TABLE
-- ============================================================

CREATE TABLE public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES public.organization(organization_id)
        ON DELETE CASCADE
);

-- ============================================================
-- INSERT SERVICE PROJECTS
-- ============================================================

INSERT INTO public.project
(organization_id, title, description, location, project_date)
VALUES
-- BrightFuture Builders (organization_id = 1)
(1, 'Downtown Housing Renovation',
'Renovating abandoned homes into affordable housing units.',
'Downtown District',
'2026-08-15'),

(1, 'Community Center Construction',
'Building a new community center with classrooms and event space.',
'Westside Neighborhood',
'2026-09-20'),

(1, 'Senior Home Repairs',
'Repairing roofs, plumbing, and accessibility features for elderly residents.',
'Oakwood Estates',
'2026-10-05'),

(1, 'Playground Build Day',
'Constructing a safe playground for the local elementary school.',
'Maple Street School',
'2026-07-30'),

(1, 'Emergency Shelter Expansion',
'Adding 20 new beds to the regional emergency shelter.',
'Riverside Shelter',
'2026-11-12'),

-- GreenHarvest Growers (organization_id = 2)
(2, 'Urban Garden Initiative',
'Converting vacant lots into productive vegetable gardens.',
'Eastside Blocks',
'2026-08-01'),

(2, 'School Greenhouse Program',
'Installing greenhouses at three local schools for education.',
'Lincoln High School',
'2026-09-10'),

(2, 'Food Bank Harvest Drive',
'Growing and harvesting fresh produce for the food bank.',
'GreenHarvest Farm',
'2026-10-20'),

(2, 'Composting Workshop Series',
'Teaching residents how to compost and reduce food waste.',
'Community Library',
'2026-08-25'),

(2, 'Orchard Planting Day',
'Planting 50 fruit trees in public parks and schoolyards.',
'Memorial Park',
'2026-11-03'),

-- UnityServe Volunteers (organization_id = 3)
(3, 'Park Cleanup Weekend',
'Clearing trash, painting benches, and landscaping city parks.',
'Central Park',
'2026-07-18'),

(3, 'Meal Delivery Program',
'Preparing and delivering hot meals to homebound seniors.',
'Community Kitchen',
'2026-08-08'),

(3, 'Back-to-School Supply Drive',
'Collecting and distributing backpacks and school supplies.',
'Town Hall',
'2026-08-22'),

(3, 'Winter Coat Distribution',
'Collecting and distributing warm coats to families in need.',
'UnityServe Center',
'2026-11-15'),

(3, 'Neighborhood Literacy Tutoring',
'After-school reading and homework help for elementary students.',
'Public Library',
'2026-09-05');



CREATE TABLE public.category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE public.project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES public.project(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES public.category(category_id)
        ON DELETE CASCADE
);

-- ============================================================
-- INSERT CATEGORIES
-- ============================================================

INSERT INTO public.category (category_name) VALUES
('Construction & Repair'),      -- category_id = 1
('Environmental & Gardening'),    -- category_id = 2
('Community Outreach'),             -- category_id = 3
('Education & Tutoring'),         -- category_id = 4
('Food & Nutrition');              -- category_id = 5

-- ============================================================
-- ASSOCIATE PROJECTS WITH CATEGORIES
-- Using your exact project IDs
-- ============================================================

-- BrightFuture Builders (projects 1-5) → Construction & Repair (1)
INSERT INTO public.project_category (project_id, category_id) VALUES
(1, 1),   -- Downtown Housing Renovation
(2, 1),   -- Community Center Construction
(3, 1),   -- Senior Home Repairs
(4, 1),   -- Playground Build Day
(5, 1);   -- Emergency Shelter Expansion

-- GreenHarvest Growers (projects 6-10) → Environmental (2) + Food (5)
INSERT INTO public.project_category (project_id, category_id) VALUES
(6, 2),   -- Urban Garden Initiative
(6, 5),   -- Urban Garden Initiative also Food
(7, 2),   -- School Greenhouse Program
(8, 2),   -- Food Bank Harvest Drive
(8, 5),   -- Food Bank Harvest Drive also Food
(9, 2),   -- Composting Workshop Series
(10, 2);  -- Orchard Planting Day

-- UnityServe Volunteers (projects 11-15) → Outreach (3), Education (4), Food (5)
INSERT INTO public.project_category (project_id, category_id) VALUES
(11, 3),  -- Park Cleanup Weekend
(12, 5),  -- Meal Delivery Program
(13, 3),  -- Back-to-School Supply Drive
(13, 4),  -- Back-to-School Supply Drive also Education
(14, 3),  -- Winter Coat Distribution
(15, 3),  -- Neighborhood Literacy Tutoring
(15, 4);  -- Neighborhood Literacy Tutoring also Education