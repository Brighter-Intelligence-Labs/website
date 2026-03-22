<section class="philosophy-section">
	<div class="philosophy-grid">
		<div class="eyebrow">Our philosophy</div>
		<div class="philosophy-prose">
			<div class="title-block">
				<h2>The unglamorous engineering that turns a prototype into a system</h2>
			</div>
			<p>Most companies building with AI are stuck in a loop: impressive demos that never make it to production. The gap isn't capability — it's infrastructure. Orchestration. Cost control. Governance.</p>
			<p>We exist to close that gap. Every system we build has cost control engineered in from day one. Every workflow has governance and audit trails. Every deployment is designed for production, not for a pitch deck.</p>
			<p>We're opinionated about how AI systems should be built. We believe in economic routing over brute-force model selection. We believe governance is a feature, not a constraint. We believe the orchestration layer is the hardest — and most valuable — part of any AI system.</p>
		</div>
		<div>
			<div class="pull-quote">
				<p>"Governance is a feature, not a constraint. The orchestration layer is the hardest — and most valuable — part of any AI system."</p>
				<cite>Brighter Intelligence Labs</cite>
			</div>
			<div class="stack-diagram">
				<div class="stack-label">Our stack position</div>
				<div class="stack-rows">
					<div class="stack-row muted-row">Your business logic</div>
					<div class="stack-row accent-row">BI Labs — orchestration, governance, cost</div>
					<div class="stack-row muted-row">Foundation models &amp; infrastructure</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.philosophy-section {
		padding: var(--section-padding-y) 0;
		background: var(--bg);
	}

	.philosophy-grid {
		max-width: var(--max-width-page);
		margin: 0 auto;
		padding: 0 var(--section-padding-x);
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 64px;
		align-items: start;
	}

	.title-block { margin-bottom: 40px; }

	.eyebrow {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: var(--space-3);
		grid-column: 1 / -1;
	}

	h2 {
		font-family: var(--fd);
		font-size: clamp(24px, 3vw, 36px);
		font-weight: 400;
		line-height: 1.15;
		letter-spacing: -0.015em;
		color: var(--text-primary);
	}

	.philosophy-prose p {
		font-size: 17px;
		font-weight: 400;
		color: var(--text-primary);
		line-height: 1.8;
		margin-bottom: 18px;
	}

	.pull-quote {
		background: var(--surface-2);
		border-left: 2px solid var(--accent);
		border-radius: 0 8px 8px 0;
		padding: 28px;
	}

	.pull-quote p {
		font-family: var(--fd);
		font-size: clamp(18px, 2.2vw, 24px);
		font-weight: 400;
		line-height: 1.4;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		margin-bottom: var(--space-3);
	}

	.pull-quote cite {
		font-size: 11px;
		font-weight: 400;
		color: var(--text-muted);
		font-style: normal;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.stack-diagram {
		margin-top: 20px;
		padding: 20px;
		border: 0.5px solid var(--border);
		border-radius: 8px;
		background: var(--surface);
	}

	.stack-label {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: var(--space-3);
	}

	.stack-rows {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.stack-row {
		font-size: 12px;
		font-weight: 500;
		padding: 8px 12px;
		border-radius: 4px;
		text-align: center;
	}

	.stack-row.muted-row {
		color: var(--text-muted);
		background: var(--surface-2);
		border: 0.5px solid var(--border);
	}

	.stack-row.accent-row {
		color: var(--accent);
		font-weight: 600;
		background: var(--acl);
		border: 0.5px solid var(--acb);
	}

	@media (max-width: 900px) {
		.philosophy-grid { grid-template-columns: 1fr; column-gap: 0; }
		.eyebrow { margin-bottom: var(--space-3); }
		.pull-quote { margin-top: 32px; }
	}
</style>
