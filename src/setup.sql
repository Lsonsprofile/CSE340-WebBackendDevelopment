CREATE TABLE public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
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