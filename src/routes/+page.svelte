<script>
	import Hero from '$lib/components/Hero.svelte';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Brighter Intelligence Labs — Bespoke AI Systems for Business</title>
	<meta name="description" content="We design and deploy bespoke AI systems that run real business workflows. Infrastructure-level thinking with cost control, governance, and observability built in." />
	<meta property="og:title" content="Brighter Intelligence Labs" />
	<meta property="og:description" content="We design and deploy bespoke AI systems that run real business workflows." />
</svelte:head>

<Hero
	headline="We design and deploy bespoke AI systems that run real business workflows"
	subline="Infrastructure-level thinking with cost control, governance, and observability built in. Not another chatbot — a system engineered for your operations."
	image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
/>

<!-- Problem Section -->
<section class="section">
	<div class="container">
		<div class="problem-grid">
			<div class="problem-content">
				<h2>The gap between AI demos and production systems is where most projects fail</h2>
				<p>
					Every company is experimenting with AI. Few are deploying it in production. The reason isn't capability — it's infrastructure. Without orchestration, cost control, and governance, AI projects stall between proof-of-concept and real operations.
				</p>
				<p>
					We build the systems layer that makes AI actually work in your business. Not features. Not demos. Production systems that run real workflows, with full visibility into what they're doing and what they cost.
				</p>
			</div>
			<div class="problem-image">
				<img
					src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80"
					alt="Strategic planning session with whiteboard"
					loading="lazy"
				/>
			</div>
		</div>
	</div>
</section>

<!-- What We Build -->
<section class="section section-alt">
	<div class="container">
		<h2 class="section-heading">What we build</h2>
		<p class="section-subheading">Three ways we help businesses deploy AI that works.</p>
		<div class="services-grid">
			<ServiceCard
				title="AI Workflow Systems"
				description="End-to-end agentic workflows for your business processes. Research pipelines, content engines, operational automation — tailored to your domain and integrated with your stack."
				href="/systems#workflow-systems"
			/>
			<ServiceCard
				title="Intelligent Operations"
				description="The control plane for AI already in production. Cost visibility, governance, audit trails, and kill switches. Know exactly what your AI is doing and what it costs."
				href="/systems#intelligent-operations"
			/>
			<ServiceCard
				title="Infrastructure Consulting"
				description="Architecture review and deployment advisory before you build. We've seen what fails in production — let us review your approach before you commit."
				href="/systems#consulting"
			/>
		</div>
	</div>
</section>

<!-- How We're Different -->
<section class="section">
	<div class="container">
		<h2 class="section-heading">How we're different</h2>
		<div class="diff-grid">
			<div class="diff-item">
				<h3>Infrastructure-level thinking</h3>
				<p>Most agencies build features. We build the systems that run them. Design at the orchestration layer, not the feature layer.</p>
			</div>
			<div class="diff-item">
				<h3>Economic routing</h3>
				<p>Every system has cost control engineered in. Model routing, token budgeting, caching. You know exactly what you're spending and why.</p>
			</div>
			<div class="diff-item">
				<h3>Governance from day one</h3>
				<p>Audit trails, approval workflows, permission systems, budget ceilings. Not bolted on later — built in from the start.</p>
			</div>
			<div class="diff-item">
				<h3>Production-first</h3>
				<p>We don't build demos. Everything we deploy is designed to run in production, under load, with real data and real consequences.</p>
			</div>
		</div>
	</div>
</section>

<!-- Latest Insights -->
{#if data.articles.length > 0}
<section class="section section-alt">
	<div class="container">
		<div class="insights-header">
			<h2>Latest insights</h2>
			<a href="/insights" class="btn btn-secondary">View all &rarr;</a>
		</div>
		<div class="insights-list">
			{#each data.articles.slice(0, 3) as article}
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
	</div>
</section>
{/if}

<!-- Lifestyle Image Break -->
<section class="image-break">
	<img
		src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80"
		alt="Modern city architecture reflecting innovation and progress"
		loading="lazy"
	/>
</section>

<CtaBlock />

<style>
	.problem-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-xl);
		align-items: center;
	}

	.problem-content h2 {
		margin-bottom: var(--space-md);
	}

	.problem-content p {
		color: var(--color-text-secondary);
		margin-bottom: var(--space-sm);
		line-height: 1.7;
	}

	.problem-image {
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.problem-image img {
		width: 100%;
		height: 360px;
		object-fit: cover;
	}

	.section-heading {
		margin-bottom: var(--space-xs);
	}

	.section-subheading {
		color: var(--color-text-secondary);
		font-size: var(--text-lg);
		margin-bottom: var(--space-xl);
	}

	.services-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-md);
	}

	.diff-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-lg);
	}

	.diff-item h3 {
		font-size: var(--text-lg);
		margin-bottom: var(--space-xs);
	}

	.diff-item p {
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.insights-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-md);
	}

	.insights-list {
		max-width: var(--max-width-prose);
	}

	.image-break {
		height: 400px;
		overflow: hidden;
	}

	.image-break img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (max-width: 768px) {
		.problem-grid {
			grid-template-columns: 1fr;
		}

		.services-grid {
			grid-template-columns: 1fr;
		}

		.diff-grid {
			grid-template-columns: 1fr;
		}

		.image-break {
			height: 240px;
		}
	}
</style>
