import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = users.env.SUPABASE_URL;  // From .env file
const supabaseKey = users.env.SUPABASE_KEY;  // From .env file

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
