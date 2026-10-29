-- ==============================================================================
-- SAHAYA: Enable Full Access Policies for App Tables
-- Version: 20261025000002
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/irjaenygiqfouidtayjt/sql/new
-- ==============================================================================

-- 1. Grant schema and table usage to all roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 2. Drop restrictive or single-operation policies
DROP POLICY IF EXISTS "Users read own profile" ON public.users;
DROP POLICY IF EXISTS "Public user insert" ON public.users;
DROP POLICY IF EXISTS "Public user update" ON public.users;
DROP POLICY IF EXISTS "Allow all operations for users" ON public.users;

DROP POLICY IF EXISTS "Public volunteers read access" ON public.volunteers;
DROP POLICY IF EXISTS "Allow all operations for volunteers" ON public.volunteers;

DROP POLICY IF EXISTS "Requests read access" ON public.requests;
DROP POLICY IF EXISTS "Public request creation" ON public.requests;
DROP POLICY IF EXISTS "Public requests update" ON public.requests;
DROP POLICY IF EXISTS "Allow all operations for requests" ON public.requests;

DROP POLICY IF EXISTS "Public schemes read access" ON public.schemes;
DROP POLICY IF EXISTS "Allow all operations for schemes" ON public.schemes;

DROP POLICY IF EXISTS "Notifications read access" ON public.notifications;
DROP POLICY IF EXISTS "Allow all operations for notifications" ON public.notifications;

DROP POLICY IF EXISTS "Public feedback read access" ON public.feedback;
DROP POLICY IF EXISTS "Public feedback insert" ON public.feedback;
DROP POLICY IF EXISTS "Public feedback update" ON public.feedback;
DROP POLICY IF EXISTS "Allow all operations for feedback" ON public.feedback;

-- 3. Create comprehensive policies for all 6 tables (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow all operations for users" 
  ON public.users FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations for volunteers" 
  ON public.volunteers FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations for requests" 
  ON public.requests FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations for schemes" 
  ON public.schemes FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations for notifications" 
  ON public.notifications FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations for feedback" 
  ON public.feedback FOR ALL 
  USING (true) 
  WITH CHECK (true);
