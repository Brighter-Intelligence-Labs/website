// Vitest setup file
// Mock SvelteKit's $env modules for testing
import { vi } from 'vitest';

vi.mock('$env/static/private', () => ({
	SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
	ANTHROPIC_API_KEY: 'test-anthropic-key',
	OPENAI_API_KEY: 'test-openai-key',
	AWS_ACCESS_KEY_ID: 'test-aws-key',
	AWS_SECRET_ACCESS_KEY: 'test-aws-secret',
	AWS_REGION: 'us-east-1',
	AWS_SES_FROM_ADDRESS: 'test@example.com',
	AWS_SES_REPLY_TO: 'reply@example.com'
}));

vi.mock('$env/static/public', () => ({
	PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
	PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
	PUBLIC_SITE_URL: 'http://localhost:5173'
}));
