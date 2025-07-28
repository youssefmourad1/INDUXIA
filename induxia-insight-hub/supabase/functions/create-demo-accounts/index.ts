import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Creating demo accounts...');

    const demoAccounts = [
      {
        email: 'maintenance@induxia.demo',
        password: 'demo123',
        name: 'Marcus Rodriguez',
        role: 'maintenance_manager'
      },
      {
        email: 'supervisor@induxia.demo',
        password: 'demo123',
        name: 'Emily Johnson',
        role: 'production_supervisor'
      },
      {
        email: 'operator@induxia.demo',
        password: 'demo123',
        name: 'Alex Thompson',
        role: 'operator'
      }
    ];

    const results = [];

    for (const account of demoAccounts) {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true, // Auto-confirm for demo accounts
        user_metadata: {
          name: account.name,
          role: account.role
        }
      });

      if (authError) {
        console.error(`Error creating auth user for ${account.email}:`, authError);
        results.push({ email: account.email, success: false, error: authError.message });
        continue;
      }

      console.log(`Created auth user for ${account.email}`);
      results.push({ email: account.email, success: true, userId: authData.user?.id });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo accounts creation process completed',
        results 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in create-demo-accounts function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});