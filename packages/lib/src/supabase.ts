import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { Database } from './types_db'; // We will assume we generate this later or mock it for now

export const createClient = () => {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
};

// Placeholder for type generation workflow
// In a real scenario, we would run `supabase gen types`
export type { Database };
