import { createServerClient } from '@supabase/ssr';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

const hasSupabase =
	PUBLIC_SUPABASE_URL &&
	PUBLIC_SUPABASE_ANON_KEY &&
	PUBLIC_SUPABASE_URL !== 'placeholder' &&
	PUBLIC_SUPABASE_ANON_KEY !== 'placeholder';

const supabaseHandle: Handle = async ({ event, resolve }) => {
	if (!hasSupabase) {
		event.locals.safeGetSession = async () => ({ session: null, user: null });
		event.locals.session = null;
		event.locals.user = null;
		return resolve(event);
	}

	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) return { session: null, user: null };
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) return { session: null, user: null };
		return { session, user };
	};

	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const sessionTokenHandle: Handle = async ({ event, resolve }) => {
	let token = event.cookies.get('chat_session');
	if (!token) {
		token = randomUUID();
		event.cookies.set('chat_session', token, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365
		});
	}
	event.locals.sessionToken = token;
	return resolve(event);
};

export const handle = sequence(supabaseHandle, sessionTokenHandle);
