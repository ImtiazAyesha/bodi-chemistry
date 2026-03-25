import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vqmengmrbcuqgihbxouy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbWVuZ21yYmN1cWdpaGJ4b3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTM4MzMsImV4cCI6MjA4OTQyOTgzM30.CiQyGnzpERrLarmjIYuw9VL6xWN6YLu3Tcs33czMAks';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
