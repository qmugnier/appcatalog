/*
  # Deduplicate stakeholders and migrate roles to stakeholder_roles table

  This migration:
  1. Creates a mapping of duplicate stakeholders to their primary record
  2. Migrates all role information from stakeholders to stakeholder_roles
  3. Updates stakeholder_roles to use the primary stakeholder ID
  4. Removes duplicate stakeholder records
  5. Removes the redundant role and application_id columns from stakeholders
*/

-- Step 1: Migrate role data from stakeholders to stakeholder_roles for records that have roles
INSERT INTO stakeholder_roles (stakeholder_id, application_id, role, created_at)
SELECT 
  s.id,
  s.application_id,
  s.role,
  s.created_at
FROM stakeholders s
WHERE s.application_id IS NOT NULL
AND s.role IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM stakeholder_roles sr
  WHERE sr.stakeholder_id = s.id
  AND sr.application_id = s.application_id
  AND sr.role = s.role
)
ON CONFLICT (stakeholder_id, application_id, role) DO NOTHING;

-- Step 2: Create a CTE to identify the primary stakeholder for each group of duplicates
-- (keeping the first created one as the primary)
WITH duplicate_groups AS (
  SELECT 
    id,
    email,
    name,
    ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(name)), LOWER(TRIM(COALESCE(email, ''))) ORDER BY created_at ASC) as rn
  FROM stakeholders
),
primary_stakeholders AS (
  SELECT 
    id,
    name,
    email,
    ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(name)), LOWER(TRIM(COALESCE(email, ''))) ORDER BY created_at ASC) as rn
  FROM stakeholders
),
duplicates_to_remove AS (
  SELECT s.id as duplicate_id, ps.id as primary_id
  FROM stakeholders s
  JOIN primary_stakeholders ps ON 
    LOWER(TRIM(s.name)) = LOWER(TRIM(ps.name)) AND
    LOWER(TRIM(COALESCE(s.email, ''))) = LOWER(TRIM(COALESCE(ps.email, '')))
  WHERE s.id != ps.id
)
-- Step 3: Update stakeholder_roles to point to primary stakeholder ID
UPDATE stakeholder_roles sr
SET stakeholder_id = dtr.primary_id
FROM duplicates_to_remove dtr
WHERE sr.stakeholder_id = dtr.duplicate_id;

-- Step 4: Delete duplicate stakeholders (keeping only the first one per name/email)
DELETE FROM stakeholders
WHERE id IN (
  SELECT s.id
  FROM stakeholders s
  WHERE EXISTS (
    SELECT 1
    FROM stakeholders s2
    WHERE LOWER(TRIM(s.name)) = LOWER(TRIM(s2.name)) AND
          LOWER(TRIM(COALESCE(s.email, ''))) = LOWER(TRIM(COALESCE(s2.email, ''))) AND
          s.created_at > s2.created_at
  )
);

-- Step 5: Remove the application_id column
ALTER TABLE stakeholders DROP COLUMN IF EXISTS application_id;

-- Step 6: Remove the role column
ALTER TABLE stakeholders DROP COLUMN IF EXISTS role;

