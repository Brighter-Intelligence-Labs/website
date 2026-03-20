<script>
	let scrolled = $state(false);
	let menuOpen = $state(false);

	function handleScroll() {
		scrolled = window.scrollY > 0;
	}
</script>

<svelte:window onscroll={handleScroll} />

<nav class="nav" class:scrolled>
	<div class="nav-inner">
		<a href="/" class="nav-logo">Brighter Intelligence Labs</a>
		<button class="menu-toggle" onclick={() => menuOpen = !menuOpen} aria-label="Toggle menu">
			<span class="menu-bar"></span>
			<span class="menu-bar"></span>
			<span class="menu-bar"></span>
		</button>
		<div class="nav-links" class:open={menuOpen}>
			<a href="/insights" class="nav-link" onclick={() => menuOpen = false}>Insights</a>
			<a href="/systems" class="nav-link" onclick={() => menuOpen = false}>Systems</a>
			<a href="/about" class="nav-link" onclick={() => menuOpen = false}>About</a>
		</div>
		<a href="/contact" class="nav-cta" onclick={() => menuOpen = false}>Book a Call</a>
	</div>
</nav>

{#if menuOpen}
<div class="mobile-overlay" role="presentation">
	<div class="mobile-menu">
		<a href="/insights" class="mobile-link" onclick={() => menuOpen = false}>Insights</a>
		<a href="/systems" class="mobile-link" onclick={() => menuOpen = false}>Systems</a>
		<a href="/about" class="mobile-link" onclick={() => menuOpen = false}>About</a>
		<a href="/contact" class="mobile-link" onclick={() => menuOpen = false}>Book a Call</a>
	</div>
</div>
{/if}

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--surface);
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s ease;
	}

	.nav.scrolled {
		border-bottom-color: var(--border);
	}

	.nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--space-10);
		height: 60px;
	}

	.nav-logo {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		text-decoration: none;
	}

	.nav-logo:hover {
		color: var(--text-primary);
	}

	.nav-links {
		display: flex;
		gap: var(--space-8);
	}

	.nav-link {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 400;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.nav-link:hover {
		color: var(--text-primary);
	}

	.nav-cta {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--surface);
		background: var(--text-primary);
		padding: var(--space-2) var(--space-5);
		border-radius: var(--radius-sm);
		text-decoration: none;
		letter-spacing: -0.01em;
		transition: opacity 0.15s ease;
	}

	.nav-cta:hover {
		opacity: 0.85;
		color: var(--surface);
	}

	.menu-toggle {
		display: none;
		flex-direction: column;
		gap: 5px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
	}

	.menu-bar {
		display: block;
		width: 22px;
		height: 2px;
		background: var(--text-primary);
		border-radius: 2px;
	}

	.mobile-overlay {
		position: fixed;
		inset: 0;
		z-index: 99;
		background: var(--surface);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mobile-menu {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-8);
	}

	.mobile-link {
		font-family: var(--font-body);
		font-size: 24px;
		font-weight: 300;
		color: var(--text-primary);
		text-decoration: none;
	}

	@media (max-width: 768px) {
		.menu-toggle {
			display: flex;
		}

		.nav-links {
			display: none;
		}

		.nav-cta {
			display: none;
		}
	}

	@media (min-width: 769px) {
		.mobile-overlay {
			display: none;
		}
	}
</style>
