import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
    console.error("Missing SUPABASE_URL environment variable");
    throw new Error("SUPABASE_URL is not configured");
}

if (!key) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
}

export const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
});

