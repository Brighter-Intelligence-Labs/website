<script>
	let { title, description, tag = '', href = '#' } = $props();
</script>

<div class="service-card">
	{#if tag}
		<div class="service-tag">{tag}</div>
	{/if}
	<h3 class="service-title">{title}</h3>
	<p class="service-body">{description}</p>
	<a {href} class="service-link">Learn more</a>
</div>

<style>
	.service-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: var(--space-8) var(--space-6);
		transition: box-shadow 0.2s ease, border-color 0.2s ease;
	}

	.service-card:hover {
		box-shadow: var(--shadow);
		border-color: var(--border-light);
	}

	.service-tag {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: var(--space-4);
	}

	.service-title {
		font-size: var(--text-lg);
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		margin-bottom: var(--space-3);
		line-height: 1.25;
	}

	.service-body {
		font-size: var(--text-sm);
		color: var(--text-primary);
		font-weight: 400;
		line-height: 1.5;
		margin-bottom: var(--space-5);
	}

	.service-link {
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--text-primary);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
	}

	.service-link::after {
		content: '\2192';
		font-weight: 300;
	}

	.service-link:hover {
		color: var(--text-primary);
	}
</style>
