<script>
	let { title, excerpt, category, date, readTime, slug } = $props();

	const formattedDate = new Date(date).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
</script>

<a href="/insights/{slug}" class="insight-card">
	<div class="insight-meta">
		<span class="insight-tag">{category}</span>
		<span class="insight-date">{formattedDate}</span>
	</div>
	<h3 class="insight-title">{title}</h3>
	<span class="insight-read">{readTime} read</span>
</a>

<style>
	.insight-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		text-decoration: none;
		display: block;
		transition: box-shadow 0.2s ease, transform 0.2s ease;
	}

	.insight-card:hover {
		box-shadow: var(--shadow);
		transform: translateY(-2px);
	}

	.insight-meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.insight-tag {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.insight-date {
		font-size: var(--text-xs);
		color: var(--text-muted);
	}

	.insight-title {
		font-size: var(--text-base);
		font-weight: 500;
		color: var(--text-primary);
		line-height: 1.35;
		margin-bottom: var(--space-3);
		letter-spacing: -0.01em;
	}

	.insight-read {
		font-size: var(--text-xs);
		color: var(--text-muted);
	}
</style>
