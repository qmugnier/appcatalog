/*
  # Application Catalog Database Schema

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `app_code` (text, unique) - Format: XX9 (e.g., "HR1", "FN3")
      - `name` (text, not null)
      - `description` (text)
      - `functional_domains` (text array)
      - `technical_stack` (text array)
      - `status` (enum: Active, Inactive, Deprecated, Under Development)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `stakeholders`
      - `id` (uuid, primary key)
      - `application_id` (uuid, foreign key)
      - `role` (text)
      - `name` (text)
      - `email` (text)
      - `created_at` (timestamptz)
    
    - `application_relationships`
      - `id` (uuid, primary key)
      - `source_app_id` (uuid, foreign key)
      - `target_app_code` (text)
      - `relationship_type` (enum: functional, technical)
      - `created_at` (timestamptz)
    
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (enum: user, admin)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin users can manage all data
    - Regular users can only read data
*/

-- Create custom types
CREATE TYPE application_status AS ENUM ('Active', 'Inactive', 'Deprecated', 'Under Development');
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE relationship_type AS ENUM ('functional', 'technical');

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_code text UNIQUE NOT NULL CHECK (app_code ~ '^[A-Z]{2}[0-9]$'),
  name text NOT NULL,
  description text DEFAULT '',
  functional_domains text[] DEFAULT '{}',
  technical_stack text[] DEFAULT '{}',
  status application_status DEFAULT 'Under Development',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stakeholders table
CREATE TABLE IF NOT EXISTS stakeholders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  role text NOT NULL,
  name text NOT NULL,
  email text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Application relationships table
CREATE TABLE IF NOT EXISTS application_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_app_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  target_app_code text NOT NULL,
  relationship_type relationship_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(source_app_id, target_app_code, relationship_type)
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_app_code ON applications(app_code);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_functional_domains ON applications USING GIN(functional_domains);
CREATE INDEX IF NOT EXISTS idx_applications_technical_stack ON applications USING GIN(technical_stack);
CREATE INDEX IF NOT EXISTS idx_stakeholders_application_id ON stakeholders(application_id);
CREATE INDEX IF NOT EXISTS idx_application_relationships_source_app_id ON application_relationships(source_app_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for applications table
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for applications
CREATE POLICY "Applications are viewable by authenticated users"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Applications are manageable by admins"
  ON applications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for stakeholders
CREATE POLICY "Stakeholders are viewable by authenticated users"
  ON stakeholders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Stakeholders are manageable by admins"
  ON stakeholders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for application_relationships
CREATE POLICY "Relationships are viewable by authenticated users"
  ON application_relationships
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Relationships are manageable by admins"
  ON application_relationships
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for users
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Insert sample data
INSERT INTO applications (app_code, name, description, functional_domains, technical_stack, status) VALUES
('HR1', 'Employee Management System', 'Comprehensive HRMS for employee lifecycle management, from onboarding to offboarding. Includes payroll, benefits, performance reviews, and talent management.', '{"Human Resources"}', '{"React", "Node.js", "PostgreSQL", "Docker", "AWS"}', 'Active'),
('FN1', 'Financial Planning Tool', 'Advanced budget planning and financial analysis platform with real-time reporting, forecasting, and expense tracking capabilities.', '{"Finance", "Analytics"}', '{"Angular", "Java", "Spring Boot", "MongoDB", "Azure"}', 'Active'),
('MK1', 'Digital Marketing Hub', 'Integrated marketing automation platform for campaign management, lead nurturing, social media management, and performance analytics.', '{"Marketing", "Analytics"}', '{"Vue.js", "Python", "Django", "Redis", "GCP"}', 'Active'),
('SL1', 'Sales Force Automation', 'CRM and sales automation platform with pipeline management, opportunity tracking, quote generation, and sales analytics.', '{"Sales", "Analytics"}', '{"React", "C#", ".NET", "PostgreSQL", "Kubernetes"}', 'Active'),
('IT1', 'IT Service Management', 'Comprehensive ITSM platform for incident management, change management, asset tracking, and service catalog management.', '{"IT Operations"}', '{"Angular", "Node.js", "Express.js", "MongoDB", "Docker"}', 'Active'),
('CS1', 'Customer Support Portal', 'Multi-channel customer support platform with ticketing system, knowledge base, live chat, and customer satisfaction tracking.', '{"Customer Service"}', '{"React", "Python", "FastAPI", "PostgreSQL", "AWS"}', 'Active'),
('SC1', 'Supply Chain Management', 'End-to-end supply chain visibility platform with inventory management, supplier relationship management, and logistics optimization.', '{"Supply Chain"}', '{"Vue.js", "Java", "Spring Boot", "MongoDB", "Microservices"}', 'Under Development'),
('AN1', 'Business Intelligence Platform', 'Enterprise-wide business intelligence and data analytics platform with dashboard creation, data visualization, and predictive analytics.', '{"Analytics"}', '{"React", "Python", "Apache Spark", "PostgreSQL", "Kubernetes"}', 'Active'),
('SE1', 'Security Operations Center', 'Centralized security monitoring and incident response platform with threat detection, vulnerability management, and compliance reporting.', '{"Security", "Compliance"}', '{"Angular", "C#", ".NET Core", "Redis", "Azure"}', 'Active'),
('CM1', 'Compliance Management System', 'Regulatory compliance tracking and management system with audit trails, policy management, and automated compliance reporting.', '{"Compliance"}', '{"Vue.js", "Node.js", "MongoDB", "Docker", "GCP"}', 'Active');

-- Insert sample stakeholders
INSERT INTO stakeholders (application_id, role, name, email) 
SELECT 
  a.id,
  'applicationArchitect',
  'John Smith',
  'john.smith@company.com'
FROM applications a WHERE a.app_code = 'HR1';

INSERT INTO stakeholders (application_id, role, name, email) 
SELECT 
  a.id,
  'productOwner',
  'Sarah Johnson',
  'sarah.johnson@company.com'
FROM applications a WHERE a.app_code = 'HR1';

INSERT INTO stakeholders (application_id, role, name, email) 
SELECT 
  a.id,
  'leadDeveloper',
  'Michael Brown',
  'michael.brown@company.com'
FROM applications a WHERE a.app_code = 'FN1';

-- Insert sample relationships
INSERT INTO application_relationships (source_app_id, target_app_code, relationship_type)
SELECT a.id, 'FN1', 'functional'
FROM applications a WHERE a.app_code = 'HR1';

INSERT INTO application_relationships (source_app_id, target_app_code, relationship_type)
SELECT a.id, 'IT1', 'technical'
FROM applications a WHERE a.app_code = 'HR1';

INSERT INTO application_relationships (source_app_id, target_app_code, relationship_type)
SELECT a.id, 'AN1', 'functional'
FROM applications a WHERE a.app_code = 'FN1';

-- Insert sample users
INSERT INTO users (id, email, name, role) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@company.com', 'Admin User', 'admin'),
('550e8400-e29b-41d4-a716-446655440001', 'user@company.com', 'Regular User', 'user');