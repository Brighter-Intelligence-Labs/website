<script>
	import ArticleCard from '$lib/components/ArticleCard.svelte';
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

		<div class="insights-grid">
			{#each filtered as article}
				<ArticleCard
					title={article.meta.title}
					excerpt={article.meta.excerpt}
					category={article.meta.category}
					date={article.meta.date}
					readTime={article.meta.readTime}
					slug={article.meta.slug}
				/>
			{/each}
		</div>

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
		font-size: var(--text-base);
		color: var(--text-secondary);
		font-weight: 300;
		line-height: 1.65;
		max-width: 520px;
	}

	.insights-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
	}

	.no-articles {
		color: var(--text-muted);
		font-size: var(--text-sm);
		font-weight: 300;
		padding: var(--space-12) 0;
	}

	@media (max-width: 1024px) {
		.insights-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.insights-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
