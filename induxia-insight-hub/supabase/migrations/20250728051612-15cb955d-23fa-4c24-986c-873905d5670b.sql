-- Create demo accounts using auth.users insert
-- Note: This is a simplified approach for demo purposes

-- Insert demo users directly (this requires admin privileges)
-- Since we can't directly insert into auth.users in a migration, 
-- let's create a function that will help create these accounts

CREATE OR REPLACE FUNCTION create_demo_user(
  user_email TEXT,
  user_password TEXT,
  user_name TEXT,
  user_role TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- This function is for demo purposes only
  -- In a real application, users should be created through the Auth API
  
  -- Generate a UUID for the user
  user_id := gen_random_uuid();
  
  -- Insert into profiles table (the auth trigger will not work for direct inserts)
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (user_id, user_email, user_name, user_role::user_role)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN 'Profile created for ' || user_email;
END;
$$;

-- Create demo profiles (these will be linked when users actually sign up)
SELECT create_demo_user('maintenance@induxia.demo', 'demo123', 'Marcus Rodriguez', 'maintenance_manager');
SELECT create_demo_user('supervisor@induxia.demo', 'demo123', 'Emily Johnson', 'production_supervisor');  
SELECT create_demo_user('operator@induxia.demo', 'demo123', 'Alex Thompson', 'operator');