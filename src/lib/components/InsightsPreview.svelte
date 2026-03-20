<script>
	let { articles = [] } = $props();
</script>

<section class="insights-section">
<div class="section-inner">
	<div class="insight-header-row">
		<div class="title-block">
			<div class="eyebrow">Latest insights</div>
			<h2>Technical thinking in the open</h2>
		</div>
		<a href="/insights" class="btn-ghost">View all →</a>
	</div>
	<div class="insight-grid">
		{#each articles.slice(0, 3) as article}
			<a class="insight-card" href="/insights/{article.meta.slug}">
				<div class="insight-meta">
					<span class="insight-tag">{article.meta.category}</span>
					<span class="insight-date">{new Date(article.meta.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
				</div>
				<h3>{article.meta.title}</h3>
				<div class="insight-footer">
					<span class="insight-read">{article.meta.readTime} read</span>
					<span class="read-more">→</span>
				</div>
			</a>
		{/each}
	</div>
</div>
</section>

<style>
	.insights-section {
		padding: var(--section-padding-y) 0;
		background: var(--bg);
	}

	.section-inner {
		max-width: var(--max-width-page);
		margin: 0 auto;
		padding: 0 var(--section-padding-x);
	}

	.insight-header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 32px;
	}

	.title-block { margin-bottom: 0; }

	.eyebrow {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: var(--space-3);
	}

	h2 {
		font-family: var(--fd);
		font-size: clamp(24px, 3vw, 36px);
		font-weight: 400;
		line-height: 1.15;
		letter-spacing: -0.015em;
		color: var(--text-primary);
	}

	.btn-ghost {
		font-size: 13px;
		font-weight: 400;
		color: var(--text-muted);
		text-decoration: none;
		transition: color 0.15s;
	}

	.btn-ghost:hover { color: var(--text-primary); }

	.insight-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	.insight-card {
		background: var(--surface);
		border: 0.5px solid var(--border);
		border-radius: 10px;
		padding: 22px;
		text-decoration: none;
		display: flex;
		flex-direction: column;
		transition: box-shadow 0.2s ease, transform 0.2s ease;
	}

	.insight-card:hover {
		box-shadow: 0 4px 16px rgba(0,0,0,0.07);
		transform: translateY(-2px);
	}

	.insight-meta {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: var(--space-3);
	}

	.insight-tag {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.insight-date {
		font-size: 11px;
		color: var(--text-muted);
	}

	h3 {
		font-size: 15px;
		font-weight: 500;
		color: var(--text-primary);
		line-height: 1.35;
		letter-spacing: -0.01em;
		margin-bottom: 10px;
		flex: 1;
	}

	.insight-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: auto;
	}

	.insight-read {
		font-size: 11px;
		color: var(--text-muted);
	}

	.read-more {
		font-size: 12px;
		font-weight: 500;
		color: var(--text-primary);
	}

	@media (max-width: 900px) {
		.insight-grid { grid-template-columns: 1fr; }
	}
</style>
