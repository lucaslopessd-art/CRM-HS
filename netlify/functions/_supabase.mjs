import { createClient } from '@supabase/supabase-js';

export function getClient() {
  const URL = process.env.SUPABASE_URL;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!URL || !KEY) return null;
  return createClient(URL, KEY, { auth: { persistSession: false } });
}
