<script>
	let scrolled = $state(false);
	let menuOpen = $state(false);

	function handleScroll() {
		scrolled = window.scrollY > 20;
	}
</script>

<svelte:window onscroll={handleScroll} />

<nav class="nav" class:scrolled>
	<div class="nav-inner container">
		<a href="/" class="logo">Brighter Intelligence Labs</a>
		<button class="menu-toggle" onclick={() => menuOpen = !menuOpen} aria-label="Toggle menu">
			<span class="menu-bar"></span>
			<span class="menu-bar"></span>
			<span class="menu-bar"></span>
		</button>
		<div class="nav-links" class:open={menuOpen}>
			<a href="/insights" onclick={() => menuOpen = false}>Insights</a>
			<a href="/systems" onclick={() => menuOpen = false}>Systems</a>
			<a href="/about" onclick={() => menuOpen = false}>About</a>
			<a href="/contact" class="btn btn-primary nav-cta" onclick={() => menuOpen = false}>Contact</a>
		</div>
	</div>
</nav>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(250, 250, 250, 0.9);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.nav.scrolled {
		border-bottom-color: var(--color-border);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}

	.nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 72px;
	}

	.logo {
		font-family: var(--font-heading);
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text);
		text-decoration: none;
		letter-spacing: -0.02em;
	}

	.logo:hover {
		color: var(--color-text);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.nav-links a {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.nav-links a:hover {
		color: var(--color-text);
	}

	.nav-cta {
		color: white !important;
		padding: 0.5rem 1.25rem !important;
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
		background: var(--color-text);
		border-radius: 2px;
		transition: transform 0.2s ease;
	}

	@media (max-width: 768px) {
		.menu-toggle {
			display: flex;
		}

		.nav-links {
			display: none;
			position: absolute;
			top: 72px;
			left: 0;
			right: 0;
			flex-direction: column;
			background: var(--color-bg);
			padding: var(--space-md);
			border-bottom: 1px solid var(--color-border);
			gap: var(--space-sm);
		}

		.nav-links.open {
			display: flex;
		}
	}
</style>
