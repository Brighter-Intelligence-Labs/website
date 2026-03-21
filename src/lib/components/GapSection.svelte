<section class="gap-section">
	<div class="gap-grid">
		<div class="eyebrow">The problem</div>
		<div>
			<h2>The gap between AI demos and production systems is where most projects fail</h2>
			<p class="lead" style="margin-bottom:28px">Every company is experimenting with AI. Few are deploying it in production. The reason isn't capability — it's infrastructure. Without orchestration, cost control, and governance, AI projects stall between proof-of-concept and real operations.</p>
			<p class="lead">We build the systems layer that makes AI actually work in your business. Not features. Not demos. Production systems that run real workflows, with full visibility into what they're doing and what they cost.</p>
		</div>

		<div class="diagnostic">
			<div class="diag-header">
				<div class="diag-col-label before">Without a system layer</div>
				<div class="diag-divider"></div>
				<div class="diag-col-label after">With BI BLADE ©</div>
			</div>
			<div class="diag-body">
				<div class="diag-side">
					<div class="diag-step">
						<div class="step-dot fail"></div>
						<span class="step-name">Ingest &amp; classify</span>
						<span class="step-badge badge-fail">Stalled</span>
					</div>
					<div class="diag-step">
						<div class="step-dot warn"></div>
						<span class="step-name">Risk assessment</span>
						<span class="step-badge badge-fail">Timeout</span>
					</div>
					<div class="diag-step">
						<div class="step-dot fail"></div>
						<span class="step-name">Draft output</span>
						<span class="step-badge badge-fail">No audit</span>
					</div>
					<div class="diag-step">
						<div class="step-dot fail"></div>
						<span class="step-name">Approval</span>
						<span class="step-badge badge-fail">Unknown</span>
					</div>
				</div>
				<div class="diag-divider"></div>
				<div class="diag-side">
					<div class="diag-step">
						<div class="step-dot ok"></div>
						<span class="step-name">Ingest &amp; classify</span>
						<span class="step-badge badge-ok">Done 0.4s</span>
					</div>
					<div class="diag-step">
						<div class="step-dot pulse"></div>
						<span class="step-name">Risk assessment</span>
						<span class="step-badge badge-run">Running</span>
					</div>
					<div class="diag-step">
						<div class="step-dot queued"></div>
						<span class="step-name">Draft output</span>
						<span class="step-badge badge-queued">Queued</span>
					</div>
					<div class="diag-step">
						<div class="step-dot queued"></div>
						<span class="step-name">Approval gate</span>
						<span class="step-badge badge-queued">Pending</span>
					</div>
				</div>
			</div>
			<div class="diag-meta">
				<div class="meta-item">Cost: <span class="unknown">???</span></div>
				<div class="meta-divider"></div>
				<div class="meta-item">Cost: <span class="known">$0.22</span></div>
			</div>
			<div class="diag-meta" style="border-top:none;padding-top:0">
				<div class="meta-item">Audit trail: <span class="unknown">None</span></div>
				<div class="meta-divider"></div>
				<div class="meta-item">Audit trail: <span class="known">Full</span></div>
			</div>
		</div>
	</div>
</section>

<style>
	.gap-section {
		padding: var(--section-padding-y) 0;
		background: var(--surface);
	}

	.gap-grid {
		max-width: var(--max-width-page);
		margin: 0 auto;
		padding: 0 var(--section-padding-x);
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 64px;
		align-items: center;
	}

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
		margin-bottom: var(--space-3);
	}

	.lead {
		font-size: 17px;
		font-weight: 400;
		color: var(--text-primary);
		line-height: 1.72;
		max-width: 560px;
	}

	/* Diagnostic panel */
	.diagnostic {
		border: 0.5px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
		background: var(--surface);
	}

	.diag-header {
		display: grid;
		grid-template-columns: 1fr 1px 1fr;
		border-bottom: 0.5px solid var(--border);
	}

	.diag-col-label {
		padding: 10px 16px;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.diag-col-label.before { color: #c05050; }
	.diag-col-label.after  { color: var(--green); }

	.diag-divider { background: var(--border); }

	.diag-body {
		display: grid;
		grid-template-columns: 1fr 1px 1fr;
		gap: 0;
	}

	.diag-side { padding: 16px; }

	.diag-step {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 0;
		border-bottom: 0.5px solid var(--border);
	}

	.diag-step:last-child { border-bottom: none; }

	.step-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.step-dot.fail  { background: #c05050; }
	.step-dot.warn  { background: #c8952a; }
	.step-dot.ok    { background: var(--green); }
	.step-dot.pulse { background: var(--accent); animation: pulse 1.4s ease-in-out infinite; }
	.step-dot.queued { background: var(--border); }

	.step-name {
		font-size: 11px;
		font-weight: 400;
		color: var(--text-primary);
		flex: 1;
	}

	.step-badge {
		font-size: 9px;
		font-weight: 600;
		padding: 2px 6px;
		border-radius: 3px;
		letter-spacing: 0.04em;
	}

	.badge-fail { color: #c05050; background: #faeaea; border: 0.5px solid #f0c0c0; }
	.badge-ok   { color: var(--green); background: var(--grl); border: 0.5px solid var(--grb); }
	.badge-run  { color: var(--accent); background: var(--acl); border: 0.5px solid var(--acb); }
	.badge-queued { color: var(--text-muted); background: var(--surface-2); border: 0.5px solid var(--border); }

	.diag-meta {
		border-top: 0.5px solid var(--border);
		display: grid;
		grid-template-columns: 1fr 1px 1fr;
		align-items: center;
	}

	.meta-item {
		font-size: 10px;
		color: var(--text-muted);
		padding: 10px 16px;
	}

	.meta-item span {
		font-weight: 600;
		font-size: 11px;
	}

	.meta-item span.unknown { color: #c05050; }
	.meta-item span.known   { color: var(--green); }

	.meta-divider {
		width: 1px;
		align-self: stretch;
		background: var(--border);
	}

	@media (max-width: 900px) {
		.gap-grid { grid-template-columns: 1fr; column-gap: 0; }
		.eyebrow { margin-bottom: var(--space-3); }
		.diagnostic { margin-top: 32px; }
		.diag-col-label { padding: 10px 10px; font-size: 9px; letter-spacing: 0.06em; }
		.diag-side { padding: 10px; }
		.diag-step { gap: 6px; }
		.step-name { font-size: 10px; }
		.step-badge { font-size: 8px; padding: 2px 4px; white-space: nowrap; }
		.meta-item { padding: 8px 10px; }
	}
</style>
