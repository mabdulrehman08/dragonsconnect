import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gmtnsgvgydsfdvyyywyy.supabase.co";
const supabaseAnonKey = "dragonsconnect/process.env";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
