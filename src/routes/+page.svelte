<script>
	import Hero from '$lib/components/Hero.svelte';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
	import ChatContainer from '$lib/components/chat/ChatContainer.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Brighter Intelligence Labs — Bespoke AI Systems for Business</title>
	<meta name="description" content="We design and deploy bespoke AI systems that run real business workflows. Infrastructure-level thinking with cost control, governance, and observability built in." />
	<meta property="og:title" content="Brighter Intelligence Labs" />
	<meta property="og:description" content="We design and deploy bespoke AI systems that run real business workflows." />
</svelte:head>

<Hero />

<!-- Chat Section -->
<section class="section section-alt">
	<div class="container">
		<div class="chat-intro">
			<h2>Talk to our AI assistant</h2>
			<p>Get instant answers about AI systems, our approach, and how we work with clients.</p>
		</div>
		<ChatContainer />
	</div>
</section>

<!-- Problem Section -->
<section class="section">
	<div class="container">
		<div class="eyebrow">The Problem</div>
		<h2>The gap between AI demos and production systems is where most projects fail</h2>
		<div class="problem-body">
			<p>
				Every company is experimenting with AI. Few are deploying it in production. The reason isn't capability — it's infrastructure. Without orchestration, cost control, and governance, AI projects stall between proof-of-concept and real operations.
			</p>
			<p>
				We build the systems layer that makes AI actually work in your business. Not features. Not demos. Production systems that run real workflows, with full visibility into what they're doing and what they cost.
			</p>
		</div>
	</div>
</section>

<!-- What We Build -->
<section class="section section-alt">
	<div class="container">
		<div class="section-title-block">
			<div class="eyebrow">What we build</div>
			<h2>Three ways we help businesses deploy AI that works</h2>
			<p class="section-subtitle">Each engagement starts with a conversation, not a sales deck. We scope to your workflows and existing stack before recommending an approach.</p>
		</div>
		<div class="services-grid">
			<ServiceCard
				tag="Core Offering"
				title="AI Workflow Systems"
				description="End-to-end agentic workflows for your business processes. Research pipelines, content engines, operational automation — tailored to your domain."
				href="/systems#workflow-systems"
			/>
			<ServiceCard
				tag="For Teams Running AI"
				title="Intelligent Operations"
				description="Cost visibility, governance, audit trails, and kill switches. Know exactly what your AI is doing and what it costs — in real time."
				href="/systems#intelligent-operations"
			/>
			<ServiceCard
				tag="Advisory"
				title="Infrastructure Consulting"
				description="Architecture review and deployment advisory before you build. We've seen what fails in production — review before you commit."
				href="/systems#consulting"
			/>
		</div>
	</div>
</section>

<!-- How We're Different -->
<section class="section">
	<div class="container">
		<div class="section-title-block">
			<div class="eyebrow">Why us</div>
			<h2>How we're different</h2>
		</div>
		<div class="diff-grid">
			<div class="diff-item">
				<h4>Infrastructure-level thinking</h4>
				<p>Most agencies build features. We build the systems that run them. Designed at the orchestration layer, not the feature layer.</p>
			</div>
			<div class="diff-item">
				<h4>Economic routing</h4>
				<p>Every system has cost control engineered in. Model routing, token budgeting, caching. You know exactly what you're spending and why.</p>
			</div>
			<div class="diff-item">
				<h4>Governance from day one</h4>
				<p>Audit trails, approval workflows, permission systems, budget ceilings. Not bolted on later — built in from the start.</p>
			</div>
			<div class="diff-item">
				<h4>Production-first</h4>
				<p>We don't build demos. Everything we deploy is designed to run in production, under load, with real data and real consequences.</p>
			</div>
		</div>
	</div>
</section>

<!-- Latest Insights -->
{#if data.articles.length > 0}
<section class="section section-alt">
	<div class="container">
		<div class="section-title-block">
			<div class="eyebrow">Insights</div>
			<h2>Latest thinking</h2>
		</div>
		<div class="insights-grid">
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

<CtaBlock />

<style>
	.chat-intro {
		text-align: center;
		margin-bottom: var(--space-6);
	}

	.chat-intro h2 {
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		margin-bottom: var(--space-2);
	}

	.chat-intro p {
		color: var(--text-secondary);
		font-family: var(--font-body);
	}

	.problem-body {
		max-width: 640px;
		margin-top: var(--space-6);
	}

	.problem-body p {
		font-size: var(--text-base);
		color: var(--text-primary);
		font-weight: 400;
		line-height: 1.5;
		margin-bottom: var(--space-4);
	}

	.section-title-block {
		margin-bottom: var(--space-10);
	}

	.section-title-block h2 {
		margin-bottom: var(--space-4);
	}

	.section-subtitle {
		font-size: var(--text-base);
		font-weight: 400;
		color: var(--text-primary);
		line-height: 1.5;
		max-width: 520px;
	}

	.services-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
	}

	.diff-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
	}

	.diff-item {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
	}

	.diff-item h4 {
		font-size: var(--text-base);
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		margin-bottom: var(--space-2);
	}

	.diff-item p {
		font-size: var(--text-sm);
		color: var(--text-primary);
		font-weight: 400;
		line-height: 1.5;
	}

	.insights-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
	}

	@media (max-width: 1024px) {
		.services-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.insights-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.services-grid {
			grid-template-columns: 1fr;
		}

		.diff-grid {
			grid-template-columns: 1fr;
		}

		.insights-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
