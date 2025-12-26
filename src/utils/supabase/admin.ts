import { createClient } from '@supabase/supabase-js'

// SECURITY WARNING: This client has full access to your database.
// Only use this in trusted server contexts (API Routes, Server Actions).
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
