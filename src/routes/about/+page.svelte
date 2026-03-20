<script>
	import CtaBlock from '$lib/components/CtaBlock.svelte';
</script>

<svelte:head>
	<title>About — Brighter Intelligence Labs</title>
	<meta name="description" content="Brighter Intelligence Labs designs and deploys bespoke AI systems for business. We're systems thinkers, not hype merchants." />
</svelte:head>

<section class="section">
	<div class="container">
		<div class="about-hero">
			<div class="about-content">
				<h1>We build AI systems that run real business operations</h1>
				<p class="about-lead">
					Brighter Intelligence Labs is a systems engineering company. We design, deploy, and operate bespoke AI agent systems for businesses that need more than chatbots and demos.
				</p>
			</div>
			<div class="about-image">
				<img
					src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80"
					alt="Team collaborating in a modern workspace"
					loading="lazy"
				/>
			</div>
		</div>
	</div>
</section>

<section class="section section-alt">
	<div class="container">
		<div class="philosophy prose">
			<h2>Our philosophy</h2>
			<p>
				Most companies building with AI are stuck in a loop: impressive demos that never make it to production. The gap isn't capability — it's infrastructure. Orchestration. Cost control. Governance. The unglamorous engineering that turns a prototype into a system.
			</p>
			<p>
				We exist to close that gap. Every system we build has cost control engineered in from day one. Every workflow has governance and audit trails. Every deployment is designed for production, not for a pitch deck.
			</p>
			<p>
				We're opinionated about how AI systems should be built. We believe in economic routing over brute-force model selection. We believe governance is a feature, not a constraint. We believe the orchestration layer is the hardest — and most valuable — part of any AI system.
			</p>

			<h2>What we're building</h2>
			<p>
				Behind every client engagement is our internal platform — a composable orchestration layer that lets us deploy bespoke AI systems faster and with more reliability. This isn't a product we're selling today. It's the infrastructure that makes our client work better.
			</p>
			<p>
				Over time, this platform will evolve. But right now, our focus is simple: build outstanding systems for our clients, refine the patterns, and share what we learn through our writing.
			</p>

			<h2>Our approach</h2>
		</div>

		<div class="values-grid">
			<div class="value">
				<h3>Systems over features</h3>
				<p>We think in systems, not features. A feature solves one problem. A system runs your business process end-to-end, adapts when requirements change, and scales when volume grows.</p>
			</div>
			<div class="value">
				<h3>Transparency over mystique</h3>
				<p>No black boxes. No proprietary magic. We show you exactly how your system works, what it costs, and why it makes the decisions it does.</p>
			</div>
			<div class="value">
				<h3>Production over prototype</h3>
				<p>We don't build demos. Everything we deploy is designed to run under load, with real data, handling edge cases that demos never encounter.</p>
			</div>
			<div class="value">
				<h3>Pragmatism over hype</h3>
				<p>We use the right tool for the job, not the trendiest. Sometimes that's a frontier model. Sometimes it's a regex. We optimise for outcomes, not impressiveness.</p>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="about-image-full">
			<img
				src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80"
				alt="Modern office environment with natural light"
				loading="lazy"
			/>
		</div>
	</div>
</section>

<CtaBlock
	headline="Interested in working together?"
	subtext="We take on a small number of engagements at a time to ensure every client gets our full attention. Start with a conversation."
/>

<style>
	.about-hero {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-xl);
		align-items: center;
	}

	.about-content h1 {
		margin-bottom: var(--space-md);
	}

	.about-lead {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.about-image {
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.about-image img {
		width: 100%;
		height: 400px;
		object-fit: cover;
	}

	.philosophy {
		margin-bottom: var(--space-xl);
	}

	.values-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-lg);
		max-width: var(--max-width-page);
	}

	.value h3 {
		font-size: var(--text-lg);
		margin-bottom: var(--space-xs);
	}

	.value p {
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.about-image-full {
		border-radius: var(--radius-lg);
		overflow: hidden;
		max-height: 400px;
	}

	.about-image-full img {
		width: 100%;
		height: 400px;
		object-fit: cover;
	}

	@media (max-width: 768px) {
		.about-hero {
			grid-template-columns: 1fr;
		}

		.values-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
