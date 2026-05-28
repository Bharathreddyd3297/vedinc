import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL || "https://iunohremqpzsrkloszbo.supabase.co";
const key = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bm9ocmVtcXB6c3JrbG9szemJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTcwMzMwNiwiZXhwIjoyMDk1Mjc5MzA2fQ.PknaPzA78a1Q__2bXzlIEJzseBYXWI5mJq92GASUzrE";

if (!url || !key) {
    console.error("Missing Supabase credentials");
    throw new Error("Supabase credentials not configured");
}

export const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
});


