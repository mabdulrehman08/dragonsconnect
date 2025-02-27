import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;  // From .env file
const supabaseKey = process.env.SUPABASE_KEY;  // From .env file

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
