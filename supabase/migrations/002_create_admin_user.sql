-- ============================================
-- CREATE ADMIN USER
-- ============================================
-- Instructions:
-- 1. First, create a user in Supabase Auth (Dashboard > Authentication > Users > Add User)
-- 2. Replace 'your-email@example.com' with the actual email
-- 3. Run this script to make that user an admin
-- ============================================

-- Option 1: Create admin profile for existing user by email
-- Replace 'your-email@example.com' with your admin email
SELECT create_admin_user('your-email@example.com', 'admin');

-- Option 2: Or manually insert/update the profile
-- Replace the UUID and email with your actual values
-- First, get your user ID:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then create/update the profile:
-- INSERT INTO public.profiles (id, email, role)
-- VALUES ('your-user-uuid-here', 'your-email@example.com', 'admin')
-- ON CONFLICT (id) 
-- DO UPDATE SET 
--     role = 'admin',
--     updated_at = NOW();

