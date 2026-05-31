import { createClient } from '@supabase/supabase-js';

// 👇 I-replace ni ang imong actual Supabase credentials
// Makita nimo ni sa: Supabase Dashboard → Project Settings → API
const SUPABASE_URL = 'https://ezhqqutzsqrxaqtzynso.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_e6SOLzz5xPBUEdREtxI1ow__hQgexAi'; // ang "anon public" key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
