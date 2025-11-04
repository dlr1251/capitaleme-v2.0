-- ============================================
-- Dashboard Setup Script for Supabase
-- ============================================
-- This script sets up:
-- 1. Profiles table (if not exists)
-- 2. RLS policies for profiles
-- 3. RLS policies for content tables (visas, guides, clkr_articles, blog_posts)
-- 4. Helper function to create admin user
-- ============================================

-- ============================================
-- 1. CREATE PROFILES TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'agent', 'lawyer', 'admin', 'super_admin')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email_verified BOOLEAN DEFAULT false,
    verification_status VARCHAR(20) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    verification_submitted_at TIMESTAMP WITH TIME ZONE,
    verification_reviewed_at TIMESTAMP WITH TIME ZONE,
    verification_reviewed_by UUID REFERENCES auth.users(id),
    verification_rejection_reason TEXT,
    phone_verified BOOLEAN DEFAULT false,
    address TEXT,
    date_of_birth DATE,
    nationality VARCHAR(100)
);

-- Create index on role for faster admin checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. RLS POLICIES FOR PROFILES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Users can insert their own profile (for initial creation)
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Note: We don't create a policy for admins to read all profiles
-- because it would cause infinite recursion (checking admin role requires reading profiles)
-- Instead, admins will use the service role key on the server side

-- ============================================
-- 3. ADD MISSING FIELDS TO CONTENT TABLES (if not exists)
-- ============================================

-- Add published and archived fields to visas table
DO $$ 
BEGIN
    -- Add published field if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'visas' 
        AND column_name = 'published'
    ) THEN
        ALTER TABLE public.visas ADD COLUMN published BOOLEAN DEFAULT false;
        CREATE INDEX IF NOT EXISTS idx_visas_published ON public.visas(published);
    END IF;
    
    -- Add archived field if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'visas' 
        AND column_name = 'archived'
    ) THEN
        ALTER TABLE public.visas ADD COLUMN archived BOOLEAN DEFAULT false;
        CREATE INDEX IF NOT EXISTS idx_visas_archived ON public.visas(archived);
    END IF;
END $$;

-- Add published and archived fields to guides table (if not exists)
DO $$ 
BEGIN
    -- Add published field if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'guides' 
        AND column_name = 'published'
    ) THEN
        ALTER TABLE public.guides ADD COLUMN published BOOLEAN DEFAULT false;
        CREATE INDEX IF NOT EXISTS idx_guides_published ON public.guides(published);
    END IF;
    
    -- Add archived field if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'guides' 
        AND column_name = 'archived'
    ) THEN
        ALTER TABLE public.guides ADD COLUMN archived BOOLEAN DEFAULT false;
        CREATE INDEX IF NOT EXISTS idx_guides_archived ON public.guides(archived);
    END IF;
END $$;

-- Add published and archived fields to clkr_articles table (if not exists)
DO $$ 
BEGIN
    -- Add published field if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'clkr_articles' 
        AND column_name = 'published'
    ) THEN
        ALTER TABLE public.clkr_articles ADD COLUMN published BOOLEAN DEFAULT false;
        CREATE INDEX IF NOT EXISTS idx_clkr_articles_published ON public.clkr_articles(published);
    END IF;
    
    -- Add archived field if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'clkr_articles' 
        AND column_name = 'archived'
    ) THEN
        ALTER TABLE public.clkr_articles ADD COLUMN archived BOOLEAN DEFAULT false;
        CREATE INDEX IF NOT EXISTS idx_clkr_articles_archived ON public.clkr_articles(archived);
    END IF;
END $$;

-- Add published and archived fields to blog_posts table (if not exists)
DO $$ 
BEGIN
    -- Add published field if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'blog_posts' 
        AND column_name = 'published'
    ) THEN
        ALTER TABLE public.blog_posts ADD COLUMN published BOOLEAN DEFAULT false;
        CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
    END IF;
    
    -- Add archived field if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'blog_posts' 
        AND column_name = 'archived'
    ) THEN
        ALTER TABLE public.blog_posts ADD COLUMN archived BOOLEAN DEFAULT false;
        CREATE INDEX IF NOT EXISTS idx_blog_posts_archived ON public.blog_posts(archived);
    END IF;
END $$;

-- ============================================
-- 4. RLS POLICIES FOR CONTENT TABLES
-- ============================================

-- ========== VISAS TABLE ==========
ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read published visas" ON public.visas;
DROP POLICY IF EXISTS "Admins can manage visas" ON public.visas;
DROP POLICY IF EXISTS "Admins can read draft visas" ON public.visas;

-- Public can read published visas
CREATE POLICY "Public read published visas" ON public.visas
    FOR SELECT
    USING (published = true AND (archived IS NULL OR archived = false));

-- Admins can read all visas (including drafts and archived)
CREATE POLICY "Admins can read draft visas" ON public.visas
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Admins can insert, update, delete visas
CREATE POLICY "Admins can manage visas" ON public.visas
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- ========== GUIDES TABLE ==========
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read published guides" ON public.guides;
DROP POLICY IF EXISTS "Admins can manage guides" ON public.guides;
DROP POLICY IF EXISTS "Admins can read draft guides" ON public.guides;

-- Public can read published guides
CREATE POLICY "Public read published guides" ON public.guides
    FOR SELECT
    USING (published = true AND (archived IS NULL OR archived = false));

-- Admins can read all guides
CREATE POLICY "Admins can read draft guides" ON public.guides
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Admins can manage guides
CREATE POLICY "Admins can manage guides" ON public.guides
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- ========== CLKR_ARTICLES TABLE ==========
ALTER TABLE public.clkr_articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read published clkr" ON public.clkr_articles;
DROP POLICY IF EXISTS "Admins can manage clkr" ON public.clkr_articles;
DROP POLICY IF EXISTS "Admins can read draft clkr" ON public.clkr_articles;

-- Public can read published CLKR articles
CREATE POLICY "Public read published clkr" ON public.clkr_articles
    FOR SELECT
    USING (published = true AND (archived IS NULL OR archived = false));

-- Admins can read all CLKR articles
CREATE POLICY "Admins can read draft clkr" ON public.clkr_articles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Admins can manage CLKR articles
CREATE POLICY "Admins can manage clkr" ON public.clkr_articles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- ========== BLOG_POSTS TABLE ==========
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read published blog" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can read draft blog" ON public.blog_posts;

-- Public can read published blog posts
CREATE POLICY "Public read published blog" ON public.blog_posts
    FOR SELECT
    USING (published = true AND (archived IS NULL OR archived = false));

-- Admins can read all blog posts
CREATE POLICY "Admins can read draft blog" ON public.blog_posts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Admins can manage blog posts
CREATE POLICY "Admins can manage blog" ON public.blog_posts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- ============================================
-- 5. FUNCTION TO AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. HELPER FUNCTION TO CREATE ADMIN USER
-- ============================================
-- Usage: 
-- SELECT create_admin_user('user@example.com', 'admin');
-- This will create a profile with admin role for an existing auth user
CREATE OR REPLACE FUNCTION public.create_admin_user(user_email TEXT, user_role TEXT DEFAULT 'admin')
RETURNS BOOLEAN AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Find user by email
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found in auth.users', user_email;
    END IF;
    
    -- Insert or update profile with admin role
    INSERT INTO public.profiles (id, email, role)
    VALUES (user_id, user_email, user_role)
    ON CONFLICT (id) 
    DO UPDATE SET 
        role = user_role,
        updated_at = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. GRANT PERMISSIONS
-- ============================================
-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions on profiles table
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Grant permissions on content tables
GRANT SELECT ON public.visas TO authenticated, anon;
GRANT SELECT ON public.guides TO authenticated, anon;
GRANT SELECT ON public.clkr_articles TO authenticated, anon;
GRANT SELECT ON public.blog_posts TO authenticated, anon;

-- Admin permissions are handled by RLS policies above

-- ============================================
-- END OF SCRIPT
-- ============================================

