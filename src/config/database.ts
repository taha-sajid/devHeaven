import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration. Please check your .env file.');
}

export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseKey);
export const supabase: SupabaseClient = supabaseAdmin;
export default supabase;