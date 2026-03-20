import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/types/database.types';

function createAdminClient(): SupabaseClient<Database> | null {
	if (!PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || PUBLIC_SUPABASE_URL === 'placeholder') {
		return null;
	}
	try {
		return createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
			auth: { persistSession: false }
		});
	} catch {
		return null;
	}
}

export const supabaseAdmin = createAdminClient();
