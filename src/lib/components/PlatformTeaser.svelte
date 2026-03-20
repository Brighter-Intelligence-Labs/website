<section class="platform-section">
	<div class="platform-grid">
		<div class="eyebrow">What we're building</div>
		<div>
			<div class="title-block">
				<h2>A composable orchestration layer</h2>
			</div>
			<p class="lead" style="margin-bottom:20px">Behind every client engagement is our internal platform — a composable orchestration layer that lets us deploy bespoke AI systems faster and with more reliability.</p>
			<p class="lead">This isn't a product we're selling today. It's the infrastructure that makes our client work better. Over time, this platform will evolve. But right now, our focus is simple: build outstanding systems for our clients, refine the patterns, and share what we learn through our writing.</p>
		</div>
		<div class="platform-visual">
			<div class="platform-layer">
				<div class="plat-row">
					<div class="plat-dot" style="background:var(--accent)"></div>
					<span class="plat-label">Task orchestrator</span>
					<span class="plat-tag tag-internal">Internal</span>
				</div>
				<div class="plat-row">
					<div class="plat-dot" style="background:#4a7aaa"></div>
					<span class="plat-label">Model router</span>
					<span class="plat-tag tag-internal">Internal</span>
				</div>
				<div class="plat-row">
					<div class="plat-dot" style="background:var(--green)"></div>
					<span class="plat-label">Governance layer</span>
					<span class="plat-tag tag-internal">Internal</span>
				</div>
				<div class="plat-row">
					<div class="plat-dot" style="background:#7c6aad"></div>
					<span class="plat-label">Cost controller</span>
					<span class="plat-tag tag-internal">Internal</span>
				</div>
				<div class="plat-divider">
					<div class="plat-divider-label">Deployed per client</div>
				</div>
				<div class="plat-row client-row">
					<div class="plat-dot" style="background:var(--accent)"></div>
					<span class="plat-label">Client workflow system</span>
					<span class="plat-tag tag-client">Bespoke</span>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.platform-section {
		padding: var(--section-padding-y) 0;
		background: var(--bg);
	}

	.platform-grid {
		max-width: var(--max-width-page);
		margin: 0 auto;
		padding: 0 var(--section-padding-x);
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 48px;
		align-items: center;
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

	.lead {
		font-size: 17px;
		font-weight: 400;
		color: var(--text-primary);
		line-height: 1.72;
		max-width: 560px;
	}

	.platform-visual {
		background: var(--surface-2);
		border: 0.5px solid var(--border);
		border-radius: 10px;
		padding: 28px;
		position: relative;
		overflow: hidden;
	}

	.platform-visual::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
		background-size: 18px 18px;
		opacity: 0.6;
	}

	.platform-layer {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.plat-row {
		background: var(--surface);
		border: 0.5px solid var(--border);
		border-radius: 5px;
		padding: 10px 14px;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.plat-row.client-row {
		border: 0.5px solid var(--acb);
		background: var(--acl);
	}

	.plat-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.plat-label {
		font-size: 11px;
		font-weight: 500;
		color: var(--text-primary);
		flex: 1;
	}

	.plat-tag {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.06em;
		padding: 2px 6px;
		border-radius: 3px;
	}

	.tag-internal { color: var(--text-muted); background: var(--surface-2); border: 0.5px solid var(--border); }
	.tag-client   { color: var(--accent); background: var(--acl); border: 0.5px solid var(--acb); }

	.plat-divider {
		border-top: 0.5px dashed var(--border);
		margin: 10px 0;
		padding-top: 10px;
	}

	.plat-divider-label {
		font-size: 9px;
		color: var(--text-muted);
		margin-bottom: 8px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	@media (max-width: 900px) {
		.platform-grid { grid-template-columns: 1fr; column-gap: 0; }
		.eyebrow { margin-bottom: 0; }
	}
</style>
