-- ==============================================================================
-- SAHAYA: Senior Citizen & NGO Welfare Portal
-- Supabase PostgreSQL Initial Migration Schema
-- Version: 20261024000001
-- Description: Core tables, constraints, indexes, RLS policies, and seed data.
-- ==============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL CHECK ("role" IN ('senior', 'ngo', 'volunteer')),
  "phone" TEXT,
  "gender" TEXT,
  "age" INTEGER,
  "address" TEXT,
  "city" TEXT,
  "state" TEXT,
  "pincode" TEXT,
  "emergencyContactName" TEXT,
  "emergencyContactPhone" TEXT,
  "medicalConditions" TEXT,
  "organizationName" TEXT,
  "ngoRegistrationNo" TEXT,
  "skills" JSONB DEFAULT '[]'::jsonb,
  "availability" TEXT,
  "rating" NUMERIC(3, 2) DEFAULT 5.0,
  "completedTasksCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VOLUNTEERS TABLE
CREATE TABLE IF NOT EXISTS public.volunteers (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "city" TEXT,
  "state" TEXT,
  "skills" JSONB DEFAULT '[]'::jsonb,
  "rating" NUMERIC(3, 2) DEFAULT 5.0,
  "activeTasks" INTEGER DEFAULT 0,
  "completedTasks" INTEGER DEFAULT 0,
  "verified" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ASSISTANCE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.requests (
  "id" TEXT PRIMARY KEY,
  "seniorId" TEXT,
  "seniorName" TEXT NOT NULL,
  "seniorAge" INTEGER,
  "seniorPhone" TEXT,
  "seniorAddress" TEXT,
  "city" TEXT,
  "state" TEXT,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "priority" TEXT NOT NULL DEFAULT 'routine',
  "isEmergency" BOOLEAN DEFAULT FALSE,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "landmark" TEXT,
  "preferredTiming" TEXT,
  "assignedVolunteerId" TEXT,
  "assignedVolunteerName" TEXT,
  "assignedVolunteerPhone" TEXT,
  "assignedNgoId" TEXT,
  "assignedNgoName" TEXT,
  "assignedAt" TIMESTAMPTZ,
  "startedAt" TIMESTAMPTZ,
  "completedAt" TIMESTAMPTZ,
  "volunteerNotes" JSONB DEFAULT '[]'::jsonb,
  "feedback" JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WELFARE SCHEMES TABLE
CREATE TABLE IF NOT EXISTS public.schemes (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "shortDescription" TEXT,
  "fullDescription" TEXT,
  "governingBody" TEXT,
  "sourceType" TEXT DEFAULT 'government',
  "benefitValue" TEXT,
  "helplinePhone" TEXT,
  "category" TEXT NOT NULL,
  "minAge" INTEGER DEFAULT 60,
  "maxAge" INTEGER,
  "gender" TEXT DEFAULT 'all',
  "widowOnly" BOOLEAN DEFAULT FALSE,
  "incomeCriteria" TEXT DEFAULT 'any',
  "maxAnnualIncome" NUMERIC,
  "disabilityOnly" BOOLEAN DEFAULT FALSE,
  "areaCriteria" TEXT DEFAULT 'all',
  "applicableStates" JSONB DEFAULT '["All India"]'::jsonb,
  "requiredDocuments" JSONB DEFAULT '[]'::jsonb,
  "benefits" TEXT NOT NULL,
  "officialLink" TEXT,
  "applySteps" JSONB DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "roleTarget" TEXT NOT NULL DEFAULT 'all',
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "timestamp" TIMESTAMPTZ DEFAULT NOW(),
  "read" BOOLEAN DEFAULT FALSE,
  "relatedRequestId" TEXT,
  "type" TEXT DEFAULT 'info',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  "id" TEXT PRIMARY KEY,
  "requestId" TEXT NOT NULL,
  "seniorId" TEXT,
  "seniorName" TEXT,
  "volunteerId" TEXT,
  "volunteerName" TEXT,
  "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  "comment" TEXT NOT NULL,
  "submittedAt" TIMESTAMPTZ DEFAULT NOW(),
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_senior_id ON public.requests("seniorId");
CREATE INDEX IF NOT EXISTS idx_requests_volunteer_id ON public.requests("assignedVolunteerId");
CREATE INDEX IF NOT EXISTS idx_requests_ngo_id ON public.requests("assignedNgoId");
CREATE INDEX IF NOT EXISTS idx_requests_emergency ON public.requests("isEmergency");
CREATE INDEX IF NOT EXISTS idx_volunteers_city ON public.volunteers(city);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON public.schemes(category);
CREATE INDEX IF NOT EXISTS idx_schemes_min_age ON public.schemes("minAge");
CREATE INDEX IF NOT EXISTS idx_notifications_role_target ON public.notifications("roleTarget");
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications("userId");
CREATE INDEX IF NOT EXISTS idx_feedback_request_id ON public.feedback("requestId");

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Service Role Key retains full bypass permissions on all tables.
-- App table access policies (Allow SELECT, INSERT, UPDATE, DELETE for backend API operations)
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
