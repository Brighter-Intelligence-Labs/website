<section class="service-section">
<div class="section-inner">
	<div class="title-block">
		<div class="eyebrow">What we build</div>
		<h2>Three ways we help businesses deploy AI that works</h2>
		<p class="lead">Each engagement starts with a conversation, not a sales deck. We scope to your workflows and existing stack before recommending an approach.</p>
	</div>
	<div class="service-grid">
		<a class="service-card" href="/systems#workflow-systems">
			<div class="service-icon">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
					<rect x="1" y="4" width="4" height="4" rx="1" stroke="var(--accent)" stroke-width="1.2"/>
					<rect x="7" y="4" width="4" height="4" rx="1" stroke="var(--accent)" stroke-width="1.2"/>
					<rect x="13" y="4" width="4" height="4" rx="1" stroke="var(--text-primary)" stroke-width="1.2"/>
					<line x1="5" y1="6" x2="7" y2="6" stroke="var(--accent)" stroke-width="1.2"/>
					<line x1="11" y1="6" x2="13" y2="6" stroke="var(--text-primary)" stroke-width="1.2"/>
					<rect x="4" y="11" width="10" height="3" rx="1" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="2 1.5"/>
				</svg>
			</div>
			<div class="service-tag">Core Offering</div>
			<h3>AI Workflow Systems</h3>
			<p>End-to-end agentic workflows for your business processes. Research pipelines, content engines, operational automation — tailored to your domain and integrated with your stack.</p>
			<span class="service-link">Learn more</span>
		</a>
		<a class="service-card" href="/systems#intelligent-operations">
			<div class="service-icon">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
					<circle cx="9" cy="9" r="7" stroke="var(--text-primary)" stroke-width="1.2"/>
					<path d="M6 9l2 2 4-4" stroke="var(--green)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
					<circle cx="9" cy="9" r="3.5" stroke="var(--accent)" stroke-width="0.8" stroke-dasharray="2 1.5"/>
				</svg>
			</div>
			<div class="service-tag">For Teams Running AI</div>
			<h3>Intelligent Operations</h3>
			<p>The control plane for AI already in production. Cost visibility, governance, audit trails, and kill switches. Know exactly what your AI is doing and what it costs.</p>
			<span class="service-link">Learn more</span>
		</a>
		<a class="service-card" href="/systems#consulting">
			<div class="service-icon">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
					<path d="M2 14l4-4 3 3 7-9" stroke="var(--accent)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
					<circle cx="14" cy="4" r="2" fill="var(--accent)" opacity="0.3"/>
					<circle cx="14" cy="4" r="1" fill="var(--accent)"/>
				</svg>
			</div>
			<div class="service-tag">Advisory</div>
			<h3>Infrastructure Consulting</h3>
			<p>Architecture review and deployment advisory before you build. We've seen what fails in production — let us review your approach before you commit.</p>
			<span class="service-link">Learn more</span>
		</a>
	</div>
</div>
</section>

<style>
	.service-section {
		padding: var(--section-padding-y) 0;
		background: var(--bg);
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

	.lead {
		font-size: 17px;
		font-weight: 400;
		color: var(--text-primary);
		line-height: 1.72;
		max-width: 520px;
	}

	.service-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	.service-card {
		background: var(--surface);
		border: 0.5px solid var(--border);
		border-radius: 10px;
		padding: 28px 24px;
		display: flex;
		flex-direction: column;
		transition: box-shadow 0.2s ease, transform 0.2s ease;
		cursor: pointer;
		text-decoration: none;
	}

	.service-card:hover {
		box-shadow: 0 4px 20px rgba(0,0,0,0.08);
		transform: translateY(-2px);
	}

	.service-icon {
		width: 36px;
		height: 36px;
		border-radius: 8px;
		background: var(--surface-2);
		border: 0.5px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16px;
		flex-shrink: 0;
	}

	.service-tag {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 10px;
	}

	h3 {
		font-size: 17px;
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		margin-bottom: 10px;
		line-height: 1.25;
	}

	.service-card p {
		font-size: 13px;
		font-weight: 300;
		color: var(--text-primary);
		line-height: 1.65;
		flex: 1;
		margin-bottom: 18px;
	}

	.service-link {
		font-size: 13px;
		font-weight: 500;
		color: var(--text-primary);
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.service-link::after { content: '→'; font-weight: 300; }

	@media (max-width: 900px) {
		.service-grid { grid-template-columns: 1fr; }
	}
</style>
