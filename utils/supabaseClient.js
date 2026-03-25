import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vqmengmrbcuqgihbxouy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TfCvrA-QalIeDKpkVaeuOg_r6IvpWlc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
