<script>
	let { title, excerpt, category, date, readTime, slug } = $props();

	const categorySlug = category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
	const formattedDate = new Date(date).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
</script>

<a href="/insights/{slug}" class="article-card">
	<div class="article-card-meta">
		<span class="tag">{category}</span>
		<span class="article-date">{formattedDate}</span>
	</div>
	<h3>{title}</h3>
	<p>{excerpt}</p>
	<span class="article-read-time">{readTime} read</span>
</a>

<style>
	.article-card {
		display: block;
		padding: var(--space-lg) 0;
		border-bottom: 1px solid var(--color-border);
		text-decoration: none;
		color: var(--color-text);
		transition: opacity 0.15s ease;
	}

	.article-card:hover {
		color: var(--color-text);
	}

	.article-card:hover h3 {
		color: var(--color-accent);
	}

	.article-card-meta {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-xs);
	}

	.article-date {
		font-size: var(--text-sm);
		color: var(--color-muted);
	}

	h3 {
		font-size: var(--text-xl);
		margin-bottom: var(--space-xs);
		transition: color 0.15s ease;
	}

	p {
		color: var(--color-text-secondary);
		font-size: var(--text-base);
		line-height: 1.6;
		margin-bottom: var(--space-xs);
	}

	.article-read-time {
		font-size: var(--text-sm);
		color: var(--color-muted);
	}
</style>
