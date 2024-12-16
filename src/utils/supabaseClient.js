import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://akewebrdogqhqpixvczc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrZXdlYnJkb2dxaHFwaXh2Y3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMzkyMDcsImV4cCI6MjA0OTkxNTIwN30.YOMBbKVK7TW57CL8s0PCxtoX8tcBbSNCcFm0Emnouaw";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase Key:', process.env.SUPABASE_KEY);
