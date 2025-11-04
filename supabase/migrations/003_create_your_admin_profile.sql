-- ============================================
-- CREATE ADMIN PROFILE FOR YOUR USER
-- ============================================
-- User ID: fa0d76aa-d65a-4336-8f46-93b4ea3008ea
-- ============================================

-- First, verify the user exists in auth.users
-- SELECT id, email FROM auth.users WHERE id = 'fa0d76aa-d65a-4336-8f46-93b4ea3008ea';

-- Create or update admin profile
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    status,
    email_verified,
    created_at,
    updated_at
)
VALUES (
    'fa0d76aa-d65a-4336-8f46-93b4ea3008ea',
    'admin@capitaleme.com',
    'Administrator',
    'admin',
    'active',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
    role = 'admin',
    status = 'active',
    email_verified = true,
    updated_at = NOW();

-- Verify the profile was created
SELECT id, email, full_name, role, status 
FROM public.profiles 
WHERE id = 'fa0d76aa-d65a-4336-8f46-93b4ea3008ea';

