<script>
	let { title, description, icon = '', href = '#' } = $props();
</script>

<a {href} class="service-card">
	{#if icon}
		<span class="service-icon">{icon}</span>
	{/if}
	<h3>{title}</h3>
	<p>{description}</p>
	<span class="service-link">Learn more &rarr;</span>
</a>

<style>
	.service-card {
		display: block;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		text-decoration: none;
		color: var(--color-text);
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.service-card:hover {
		border-color: var(--color-accent);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
		color: var(--color-text);
	}

	.service-icon {
		display: block;
		font-size: 2rem;
		margin-bottom: var(--space-sm);
	}

	h3 {
		font-size: var(--text-xl);
		margin-bottom: var(--space-xs);
	}

	p {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		line-height: 1.6;
		margin-bottom: var(--space-md);
	}

	.service-link {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-accent);
	}
</style>
