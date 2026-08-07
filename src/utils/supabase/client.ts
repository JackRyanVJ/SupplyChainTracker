import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kkyfwtezolkwfplzpyqt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreWZ3dGV6b2xrd2ZwbHpweXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDM0MjEsImV4cCI6MjEwMTY3OTQyMX0.eoisNt1SAYA6iqDyyy5h0KfqqhbQFBH1H2PoOBHV5ac';

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
