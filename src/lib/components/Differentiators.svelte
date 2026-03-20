<section class="diff-section">
<div class="section-inner">
	<div class="title-block">
		<div class="eyebrow">How we're different</div>
		<h2>Built for production from day one</h2>
	</div>
	<div class="diff-grid">
		<div class="diff-item">
			<svg class="diff-icon" viewBox="0 0 32 32" fill="none">
				<rect x="4" y="8" width="8" height="8" rx="2" stroke="var(--accent)" stroke-width="1.2"/>
				<rect x="16" y="8" width="8" height="8" rx="2" stroke="var(--accent)" stroke-width="1.2"/>
				<rect x="4" y="20" width="8" height="8" rx="2" stroke="var(--text-muted)" stroke-width="1.2"/>
				<rect x="16" y="20" width="8" height="8" rx="2" stroke="var(--text-muted)" stroke-width="1.2"/>
				<line x1="12" y1="12" x2="16" y2="12" stroke="var(--accent)" stroke-width="1"/>
				<line x1="20" y1="16" x2="20" y2="20" stroke="var(--text-muted)" stroke-width="1"/>
				<line x1="8" y1="16" x2="8" y2="20" stroke="var(--text-muted)" stroke-width="1"/>
			</svg>
			<h4>Infrastructure-level thinking</h4>
			<p>Most agencies build features. We build the systems that run them. Designed at the orchestration layer, not the feature layer.</p>
		</div>
		<div class="diff-item">
			<svg class="diff-icon" viewBox="0 0 32 32" fill="none">
				<polyline points="4,22 10,14 16,18 22,8 28,10" stroke="var(--accent)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
				<circle cx="28" cy="10" r="2" fill="var(--accent)"/>
				<line x1="4" y1="26" x2="28" y2="26" stroke="var(--border)" stroke-width="0.8"/>
				<text x="4" y="30" font-size="7" fill="var(--text-muted)" font-family="system-ui">cost</text>
			</svg>
			<h4>Economic routing</h4>
			<p>Every system has cost control engineered in. Model routing, token budgeting, caching. You know exactly what you're spending and why.</p>
		</div>
		<div class="diff-item">
			<svg class="diff-icon" viewBox="0 0 32 32" fill="none">
				<rect x="6" y="10" width="20" height="14" rx="2" stroke="var(--text-primary)" stroke-width="1.2"/>
				<path d="M12 17l3 3 5-6" stroke="var(--green)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
				<line x1="6" y1="14" x2="26" y2="14" stroke="var(--border)" stroke-width="0.8"/>
				<circle cx="9" cy="12" r="1" fill="var(--accent)"/>
				<circle cx="12" cy="12" r="1" fill="var(--border)"/>
				<circle cx="15" cy="12" r="1" fill="var(--border)"/>
			</svg>
			<h4>Governance from day one</h4>
			<p>Audit trails, approval workflows, permission systems, budget ceilings. Not bolted on later — built in from the start.</p>
		</div>
		<div class="diff-item">
			<svg class="diff-icon" viewBox="0 0 32 32" fill="none">
				<rect x="6" y="6" width="20" height="20" rx="2" stroke="var(--text-primary)" stroke-width="1.2"/>
				<line x1="10" y1="12" x2="22" y2="12" stroke="var(--accent)" stroke-width="1.2" stroke-linecap="round"/>
				<line x1="10" y1="16" x2="18" y2="16" stroke="var(--text-muted)" stroke-width="1" stroke-linecap="round"/>
				<line x1="10" y1="20" x2="20" y2="20" stroke="var(--text-muted)" stroke-width="1" stroke-linecap="round"/>
			</svg>
			<h4>Production-first</h4>
			<p>We don't build demos. Everything we deploy is designed to run in production, under load, with real data and real consequences.</p>
		</div>
	</div>
</div>
</section>

<style>
	.diff-section {
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
		margin-bottom: var(--space-3);
	}

	.diff-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		background: var(--border);
		border: 0.5px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
	}

	.diff-item {
		background: var(--surface);
		padding: 32px 28px;
	}

	.diff-icon {
		width: 32px;
		height: 32px;
		margin-bottom: var(--space-3);
	}

	h4 {
		font-size: 15px;
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		margin-bottom: 8px;
	}

	.diff-item p {
		font-size: 13px;
		font-weight: 400;
		color: var(--text-primary);
		line-height: 1.65;
	}

	@media (max-width: 900px) {
		.diff-grid { grid-template-columns: 1fr; }
	}
</style>
