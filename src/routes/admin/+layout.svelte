<script lang="ts">
	import { page } from '$app/stores';
	let { children } = $props();

	const navItems = [
		{ href: '/admin', label: 'Dashboard' },
		{ href: '/admin/content', label: 'Content' },
		{ href: '/admin/subscribers', label: 'Subscribers' },
		{ href: '/admin/emails', label: 'Emails' }
	];

	const isLoginPage = $derived($page.url.pathname === '/admin/login');
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="admin-shell">
		<aside class="sidebar">
			<div class="logo">BIL Admin</div>
			<nav>
				{#each navItems as item}
					<a href={item.href} class:active={$page.url.pathname === item.href}>{item.label}</a>
				{/each}
			</nav>
			<form method="POST" action="/admin?/logout">
				<button type="submit">Sign out</button>
			</form>
		</aside>
		<main class="admin-main">
			{@render children()}
		</main>
	</div>
{/if}

<style>
	.admin-shell {
		display: flex;
		min-height: 100vh;
		font-family: var(--font-ui);
	}

	.sidebar {
		width: 220px;
		background: #1a1a2e;
		color: #e2e8f0;
		padding: 1.5rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
	}

	.logo {
		font-weight: 700;
		font-size: 1.1rem;
		color: var(--accent);
		padding: 0 0.5rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		margin-bottom: 0.5rem;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	nav a {
		display: block;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		color: #94a3b8;
		text-decoration: none;
		font-size: 0.9rem;
		transition:
			background 0.15s,
			color 0.15s;
	}

	nav a:hover,
	nav a.active {
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
	}

	button[type='submit'] {
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: #94a3b8;
		padding: 0.4rem 0.75rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.85rem;
		width: 100%;
	}

	.admin-main {
		margin-left: 220px;
		flex: 1;
		padding: 2rem;
		background: #f8fafc;
		min-height: 100vh;
	}
</style>
