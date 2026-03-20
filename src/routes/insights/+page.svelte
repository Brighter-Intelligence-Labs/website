<script>
	import CategoryFilter from '$lib/components/CategoryFilter.svelte';

	let { data } = $props();
	let activeCategory = $state('all');

	let filtered = $derived(
		activeCategory === 'all'
			? data.articles
			: data.articles.filter((a) => a.meta.category === activeCategory)
	);
</script>

<svelte:head>
	<title>Insights — Brighter Intelligence Labs</title>
	<meta name="description" content="Technical insights on AI systems, agent orchestration, cost control, and governance. Deep-dives from the team building production AI infrastructure." />
</svelte:head>

<section class="section">
	<div class="container">
		<header class="insights-header">
			<div class="eyebrow">Insights</div>
			<h1>Latest thinking</h1>
			<p class="insights-subline">
				Technical deep-dives on building AI systems that work in production.
				Opinionated, evidence-backed, no fluff.
			</p>
		</header>

		<CategoryFilter categories={data.categories} bind:active={activeCategory} />

		{#if filtered.length > 0}
			<div class="insights-featured">
				<a class="insight-card-large" href="/insights/{filtered[0].meta.slug}">
					<div class="insight-meta">
						<span class="insight-tag">{filtered[0].meta.category}</span>
						<span class="insight-date">{new Date(filtered[0].meta.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
					</div>
					<h3>{filtered[0].meta.title}</h3>
					{#if filtered[0].meta.excerpt}
						<p class="excerpt">{filtered[0].meta.excerpt}</p>
					{/if}
					<div class="insight-footer">
						<span class="insight-read">{filtered[0].meta.readTime} read</span>
						<span class="read-more">Read →</span>
					</div>
				</a>
				{#each filtered.slice(1, 3) as article}
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

			{#if filtered.length > 3}
				<div class="insights-grid">
					{#each filtered.slice(3) as article}
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
			{/if}
		{/if}

		{#if filtered.length === 0}
			<p class="no-articles">No articles in this category yet. Check back soon.</p>
		{/if}
	</div>
</section>

<style>
	.insights-header {
		margin-bottom: var(--space-10);
	}

	.insights-header h1 {
		margin-bottom: var(--space-4);
	}

	.insights-subline {
		font-size: 15px;
		font-weight: 300;
		color: var(--body);
		line-height: 1.72;
		max-width: 520px;
	}

	/* Featured layout: large card + 2 side cards */
	.insights-featured {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 16px;
		margin-bottom: 16px;
	}

	.insight-card-large {
		background: var(--surface);
		border: 0.5px solid var(--border);
		border-radius: 10px;
		padding: 28px;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		transition: box-shadow 0.2s ease, transform 0.2s ease;
	}

	.insight-card-large:hover {
		box-shadow: 0 4px 20px rgba(0,0,0,0.07);
		transform: translateY(-2px);
	}

	.insight-card-large h3 {
		font-family: var(--fd);
		font-size: clamp(18px, 2vw, 24px);
		font-weight: 400;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		line-height: 1.25;
		margin-bottom: 14px;
		flex: 1;
	}

	.excerpt {
		font-size: 14px;
		font-weight: 300;
		color: var(--body);
		line-height: 1.65;
		margin-bottom: 20px;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Standard cards */
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
		margin-bottom: 14px;
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

	.insight-card h3 {
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

	.insights-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	.no-articles {
		color: var(--text-muted);
		font-size: var(--text-sm);
		font-weight: 300;
		padding: var(--space-12) 0;
	}

	@media (max-width: 900px) {
		.insights-featured { grid-template-columns: 1fr; }
		.insights-grid { grid-template-columns: 1fr; }
	}
</style>
