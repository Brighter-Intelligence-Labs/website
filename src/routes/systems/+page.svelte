<script>
	import StepProcess from '$lib/components/StepProcess.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';

	const workflowSteps = [
		{ title: 'Discovery', description: 'We map your business processes, identify high-value automation candidates, and define success metrics.' },
		{ title: 'Architecture', description: 'We design the agent system — orchestration layer, model routing, governance rules, and integration points.' },
		{ title: 'Build', description: 'We implement the system with your team, integrating with your existing stack and data sources.' },
		{ title: 'Deploy', description: 'We deploy to your infrastructure with monitoring, alerting, and cost controls from day one.' },
		{ title: 'Optimise', description: 'We monitor performance, tune model routing, and reduce costs as the system matures.' }
	];

	const opsSteps = [
		{ title: 'Audit', description: 'We assess your current AI systems, identify cost leaks, governance gaps, and operational risks.' },
		{ title: 'Instrument', description: 'We deploy monitoring, cost tracking, and audit logging across your AI operations.' },
		{ title: 'Control', description: 'We implement budget ceilings, approval workflows, and kill switches.' },
		{ title: 'Dashboard', description: 'We build a real-time operations dashboard tailored to your systems and KPIs.' }
	];
</script>

<svelte:head>
	<title>Systems — Brighter Intelligence Labs</title>
	<meta name="description" content="Bespoke AI workflow systems, intelligent operations dashboards, and infrastructure consulting. Engineered for real business operations." />
</svelte:head>

<section class="section">
	<div class="container">
		<header class="page-header">
			<h1>Systems we build</h1>
			<p class="page-subline">
				Three ways we help businesses deploy AI that works. Each engagement starts with a conversation, not a sales deck.
			</p>
		</header>
	</div>
</section>

<!-- AI Workflow Systems -->
<section class="section section-alt" id="workflow-systems">
	<div class="container">
		<div class="system-grid">
			<div class="system-content">
				<span class="tag">Core Offering</span>
				<h2>AI Workflow Systems</h2>
				<p class="system-lead">
					End-to-end agentic workflows for your business processes. We take your business process and turn it into an intelligent system that runs itself — with governance, cost control, and full visibility.
				</p>
				<h3>What you get</h3>
				<ul>
					<li>Bespoke multi-agent system tailored to your domain</li>
					<li>Integration with your existing tools and data sources</li>
					<li>Economic model routing — right model for each task</li>
					<li>Governance, audit trails, and approval workflows built in</li>
					<li>Real-time cost monitoring and budget controls</li>
				</ul>
				<h3>How it works</h3>
				<StepProcess steps={workflowSteps} />
			</div>
			<div class="system-image">
				<img
					src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
					alt="Data analytics and system monitoring dashboard"
					loading="lazy"
				/>
			</div>
		</div>
	</div>
</section>

<!-- Intelligent Operations -->
<section class="section" id="intelligent-operations">
	<div class="container">
		<div class="system-grid reverse">
			<div class="system-content">
				<span class="tag">For Teams Running AI</span>
				<h2>Intelligent Operations</h2>
				<p class="system-lead">
					Already running AI agents? We'll give you the control plane — cost visibility, governance, audit trails, and kill switches. Know exactly what your AI is doing and what it costs.
				</p>
				<h3>What you get</h3>
				<ul>
					<li>Real-time cost tracking across all AI operations</li>
					<li>Governance layer with approval gates and permissions</li>
					<li>Audit logging for compliance and debugging</li>
					<li>Budget ceilings with automatic enforcement</li>
					<li>Custom operations dashboard</li>
				</ul>
				<h3>How it works</h3>
				<StepProcess steps={opsSteps} />
			</div>
			<div class="system-image">
				<img
					src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80"
					alt="Team working together on technical implementation"
					loading="lazy"
				/>
			</div>
		</div>
	</div>
</section>

<!-- Consulting -->
<section class="section section-alt" id="consulting">
	<div class="container">
		<div class="system-grid">
			<div class="system-content">
				<span class="tag">Advisory</span>
				<h2>Infrastructure Consulting</h2>
				<p class="system-lead">
					Before you build, let us review your architecture. We've seen what fails in production — model selection mistakes, orchestration anti-patterns, cost blowouts, governance gaps. A few days of expert review can save months of rework.
				</p>
				<h3>What you get</h3>
				<ul>
					<li>Architecture review of your current or planned AI systems</li>
					<li>Recommendations for model routing and cost optimisation</li>
					<li>Governance and compliance gap analysis</li>
					<li>Production readiness assessment</li>
					<li>Written report with prioritised action plan</li>
				</ul>
				<div class="consult-note">
					<p><strong>Typical engagement:</strong> 2-5 days of hands-on review with your engineering team, followed by a detailed recommendations report.</p>
				</div>
			</div>
			<div class="system-image">
				<img
					src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"
					alt="Modern office space with collaborative work environment"
					loading="lazy"
				/>
			</div>
		</div>
	</div>
</section>

<CtaBlock
	headline="Not sure which engagement fits?"
	subtext="Start with a free 30-minute discovery call. We'll discuss your situation and recommend the right approach — no obligation, no sales pitch."
/>

<style>
	.page-header {
		max-width: 640px;
	}

	.page-header h1 {
		margin-bottom: var(--space-sm);
	}

	.page-subline {
		color: var(--color-text-secondary);
		font-size: var(--text-lg);
		line-height: 1.6;
	}

	.system-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: var(--space-xl);
		align-items: start;
	}

	.system-grid.reverse {
		grid-template-columns: 0.8fr 1.2fr;
	}

	.system-grid.reverse .system-content {
		order: 2;
	}

	.system-grid.reverse .system-image {
		order: 1;
	}

	.system-content h2 {
		margin-top: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.system-content h3 {
		margin-top: var(--space-lg);
		margin-bottom: var(--space-sm);
		font-size: var(--text-lg);
	}

	.system-lead {
		color: var(--color-text-secondary);
		font-size: var(--text-lg);
		line-height: 1.6;
	}

	.system-content ul {
		list-style: none;
		padding: 0;
	}

	.system-content li {
		padding: 0.5rem 0;
		padding-left: 1.5rem;
		position: relative;
		color: var(--color-text-secondary);
	}

	.system-content li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.875rem;
		width: 8px;
		height: 8px;
		background: var(--color-accent);
		border-radius: 50%;
	}

	.system-image {
		border-radius: var(--radius-lg);
		overflow: hidden;
		position: sticky;
		top: 100px;
	}

	.system-image img {
		width: 100%;
		height: 400px;
		object-fit: cover;
	}

	.consult-note {
		margin-top: var(--space-lg);
		padding: var(--space-md);
		background: var(--color-accent-light);
		border-radius: var(--radius);
	}

	.consult-note p {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
	}

	@media (max-width: 768px) {
		.system-grid,
		.system-grid.reverse {
			grid-template-columns: 1fr;
		}

		.system-grid.reverse .system-content,
		.system-grid.reverse .system-image {
			order: unset;
		}

		.system-image {
			position: static;
		}

		.system-image img {
			height: 240px;
		}
	}
</style>
