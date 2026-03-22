<section class="values-section">
<div class="section-inner">
	<div class="title-block">
		<div class="eyebrow">Our approach</div>
		<h2>Core values</h2>
	</div>
	<div class="values-grid">
		<div class="value-item">
			<div class="value-number">01</div>
			<h4>Systems over features</h4>
			<p>We think in systems, not features. A feature solves one problem. A system runs your business process end-to-end, adapts when requirements change, and scales when volume grows.</p>
		</div>
		<div class="value-item">
			<div class="value-number">02</div>
			<h4>Transparency over mystique</h4>
			<p>No black boxes. No proprietary magic. We show you exactly how your system works, what it costs, and why it makes the decisions it does.</p>
		</div>
		<div class="value-item">
			<div class="value-number">03</div>
			<h4>Production over prototype</h4>
			<p>We don't build demos. Everything we deploy is designed to run under load, with real data, handling edge cases that demos never encounter.</p>
		</div>
		<div class="value-item">
			<div class="value-number">04</div>
			<h4>Pragmatism over hype</h4>
			<p>We use the right tool for the job, not the trendiest. Sometimes that's a frontier model. Sometimes it's a regex. We optimise for outcomes, not impressiveness.</p>
		</div>
	</div>
</div>
</section>

<style>
	.values-section {
		padding: var(--section-padding-y) 0;
		background: var(--surface);
	}

	.section-inner {
		max-width: var(--max-width-page);
		margin: 0 auto;
		padding: 0 var(--section-padding-x);
	}

	.title-block { margin-bottom: 40px; }

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

	.values-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		background: var(--border);
		border: 0.5px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
	}

	.value-item {
		background: var(--surface);
		padding: 32px 28px;
	}

	.value-number {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--accent);
		margin-bottom: 12px;
	}

	h4 {
		font-size: 16px;
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		margin-bottom: 8px;
	}

	.value-item p {
		font-size: 13px;
		font-weight: 400;
		color: var(--text-primary);
		line-height: 1.65;
	}

	@media (max-width: 900px) {
		.values-grid { grid-template-columns: 1fr; }
	}
</style>
