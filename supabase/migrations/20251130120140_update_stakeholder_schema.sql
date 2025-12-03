/*
  # Update Stakeholder Schema for Multi-Role Support

  1. Changes
    - Modify `stakeholders` table to include department and position/description
    - Create `stakeholder_roles` junction table for many-to-many stakeholder-application-role relationships
    - This allows one stakeholder to have multiple roles across different applications
    - Maintains backward compatibility with existing stakeholder data

  2. New Tables
    - `stakeholder_roles`
      - `id` (uuid, primary key)
      - `stakeholder_id` (uuid, foreign key)
      - `application_id` (uuid, foreign key)
      - `role` (text) - The role they have in this application
      - `created_at` (timestamptz)

  3. Modified Tables
    - `stakeholders`
      - Add `department` (text) for organizational grouping
      - Add `position` (text) for role description/title
      - Keep existing fields for backward compatibility

  4. Security
    - Enable RLS on `stakeholder_roles` table
    - Only authenticated admins can manage stakeholders
    - Regular users can view stakeholder information
*/

-- Add new columns to stakeholders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stakeholders' AND column_name = 'department'
  ) THEN
    ALTER TABLE stakeholders ADD COLUMN department text DEFAULT 'General';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stakeholders' AND column_name = 'position'
  ) THEN
    ALTER TABLE stakeholders ADD COLUMN position text DEFAULT '';
  END IF;
END $$;

-- Create stakeholder_roles table for many-to-many relationships
CREATE TABLE IF NOT EXISTS stakeholder_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stakeholder_id uuid NOT NULL REFERENCES stakeholders(id) ON DELETE CASCADE,
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(stakeholder_id, application_id, role)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stakeholder_roles_stakeholder_id ON stakeholder_roles(stakeholder_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_roles_application_id ON stakeholder_roles(application_id);

-- Enable RLS on stakeholder_roles
ALTER TABLE stakeholder_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stakeholder_roles
CREATE POLICY "Stakeholder roles are viewable by authenticated users"
  ON stakeholder_roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Stakeholder roles are manageable by admins"
  ON stakeholder_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Update stakeholders RLS to allow regular users to view
DROP POLICY IF EXISTS "Stakeholders are viewable by authenticated users" ON stakeholders;

CREATE POLICY "Stakeholders are viewable by authenticated users"
  ON stakeholders
  FOR SELECT
  TO authenticated
  USING (true);
