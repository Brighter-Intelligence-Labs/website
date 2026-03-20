<script>
	let {
		eyebrow = 'Bespoke AI Systems for Business',
		headline = 'We design and deploy bespoke AI systems that run real business workflows',
		subline = 'Infrastructure-level thinking with cost control, governance, and observability built in. Not another chatbot — a system engineered for your operations.',
		ctaText = 'Book a Discovery Call',
		ctaHref = '/contact',
		stats = [
			{ value: '~<em>60</em>%', label: 'Cost reduction vs. single-model routing' },
			{ value: '<em>100</em>%', label: 'Audit trail coverage from day one' },
			{ value: '<em>5</em>', label: 'Days typical consulting engagement' },
			{ value: 'Full<em>.</em>', label: 'Observability built in, not bolted on' }
		]
	} = $props();
</script>

<section class="hero">
	<div class="hero-inner">
		<div class="hero-copy">
			<div class="hero-eyebrow">{eyebrow}</div>
			<h1 class="hero-h1">{headline}</h1>
			<p class="hero-sub">{subline}</p>
			<div class="hero-actions">
				<a href={ctaHref} class="btn-primary">{ctaText}</a>
				<a href="/insights" class="btn-ghost">Read Our Insights</a>
			</div>
		</div>
		<div class="hero-stats">
			<div class="stat-block">
				{#each stats as stat}
					<div class="stat">
						<div class="stat-val">{@html stat.value}</div>
						<div class="stat-label">{stat.label}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		padding: var(--section-padding-y) var(--section-padding-x);
		background: var(--surface);
	}

	.hero-inner {
		max-width: var(--max-width-page);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 3fr 2fr;
		gap: var(--space-16);
		align-items: start;
	}

	.hero-eyebrow {
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: var(--space-5);
	}

	.hero-h1 {
		margin-bottom: var(--space-6);
	}

	.hero-sub {
		font-size: var(--text-base);
		color: var(--text-secondary);
		font-weight: 300;
		line-height: 1.7;
		margin-bottom: var(--space-8);
		max-width: 480px;
	}

	.hero-actions {
		display: flex;
		gap: var(--space-4);
		align-items: center;
	}

	.stat-block {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		background: var(--border);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.stat {
		background: var(--surface);
		padding: var(--space-6);
	}

	.stat-val {
		font-size: var(--text-3xl);
		font-weight: 300;
		letter-spacing: -0.03em;
		line-height: 1;
		margin-bottom: var(--space-2);
		color: var(--text-primary);
	}

	.stat-val :global(em) {
		color: var(--accent);
		font-style: normal;
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--text-muted);
		line-height: 1.45;
		font-weight: 400;
	}

	@media (max-width: 768px) {
		.hero-inner {
			grid-template-columns: 1fr;
			gap: var(--space-10);
		}
	}
</style>
