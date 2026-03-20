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
			<h1>Insights</h1>
			<p class="insights-subline">
				Technical deep-dives on building AI systems that work in production.
				Opinionated, evidence-backed, no fluff.
			</p>
		</header>

		<CategoryFilter categories={data.categories} bind:active={activeCategory} />

		<div class="articles-list">
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
		margin-bottom: var(--space-xl);
	}

	.insights-header h1 {
		margin-bottom: var(--space-sm);
	}

	.insights-subline {
		color: var(--color-text-secondary);
		font-size: var(--text-lg);
		max-width: 560px;
	}

	.articles-list {
		max-width: var(--max-width-prose);
	}

	.no-articles {
		color: var(--color-muted);
		padding: var(--space-xl) 0;
	}
</style>
