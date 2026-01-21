/*
  # Migrate existing stakeholders to stakeholder_roles

  Migrate stakeholders that have application_id set directly to the new stakeholder_roles table.
  This handles the transition from the old schema (stakeholders.application_id) to the new schema (stakeholder_roles).
*/

INSERT INTO stakeholder_roles (stakeholder_id, application_id, role, created_at)
SELECT 
  s.id,
  s.application_id,
  s.role,
  s.created_at
FROM stakeholders s
WHERE s.application_id IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM stakeholder_roles sr
  WHERE sr.stakeholder_id = s.id
  AND sr.application_id = s.application_id
  AND sr.role = s.role
)
ON CONFLICT (stakeholder_id, application_id, role) DO NOTHING;
