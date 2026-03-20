<script>
	import CtaBlock from '$lib/components/CtaBlock.svelte';
</script>

<svelte:head>
	<title>About — Brighter Intelligence Labs</title>
	<meta name="description" content="Brighter Intelligence Labs designs and deploys bespoke AI systems for business. We're systems thinkers, not hype merchants." />
</svelte:head>

<section class="section">
	<div class="container">
		<div class="about-header">
			<div class="eyebrow">About Us</div>
			<h1>We build AI systems that run real business operations</h1>
			<p class="about-lead">
				Brighter Intelligence Labs is a systems engineering company. We design, deploy, and operate bespoke AI agent systems for businesses that need more than chatbots and demos.
			</p>
		</div>
	</div>
</section>

<section class="section section-alt">
	<div class="container">
		<div class="philosophy prose">
			<div class="eyebrow">Philosophy</div>
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
		</div>

		<div class="values-section">
			<div class="eyebrow">Our approach</div>
			<h2>Core values</h2>
			<div class="values-grid">
				<div class="value">
					<h4>Systems over features</h4>
					<p>We think in systems, not features. A feature solves one problem. A system runs your business process end-to-end, adapts when requirements change, and scales when volume grows.</p>
				</div>
				<div class="value">
					<h4>Transparency over mystique</h4>
					<p>No black boxes. No proprietary magic. We show you exactly how your system works, what it costs, and why it makes the decisions it does.</p>
				</div>
				<div class="value">
					<h4>Production over prototype</h4>
					<p>We don't build demos. Everything we deploy is designed to run under load, with real data, handling edge cases that demos never encounter.</p>
				</div>
				<div class="value">
					<h4>Pragmatism over hype</h4>
					<p>We use the right tool for the job, not the trendiest. Sometimes that's a frontier model. Sometimes it's a regex. We optimise for outcomes, not impressiveness.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<CtaBlock
	headline="Interested in working together?"
	subtext="We take on a small number of engagements at a time to ensure every client gets our full attention. Start with a conversation."
/>

<style>
	.about-header {
		max-width: 640px;
	}

	.about-header h1 {
		margin-bottom: var(--space-6);
	}

	.about-lead {
		font-size: var(--text-base);
		color: var(--text-secondary);
		font-weight: 300;
		line-height: 1.7;
		max-width: 520px;
	}

	.philosophy {
		margin-bottom: var(--space-16);
	}

	.values-section {
		margin-bottom: var(--space-4);
	}

	.values-section h2 {
		margin-bottom: var(--space-10);
	}

	.values-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
	}

	.value {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
	}

	.value h4 {
		font-size: var(--text-base);
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		margin-bottom: var(--space-2);
	}

	.value p {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		font-weight: 300;
		line-height: 1.6;
	}

	@media (max-width: 640px) {
		.values-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
