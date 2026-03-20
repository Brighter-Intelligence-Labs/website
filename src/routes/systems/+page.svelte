<script>
	import StepProcess from '$lib/components/StepProcess.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';

	const workflowSteps = [
		{ title: 'Discovery' },
		{ title: 'Architecture' },
		{ title: 'Build' },
		{ title: 'Deploy' },
		{ title: 'Optimise' }
	];

	const opsSteps = [
		{ title: 'Audit' },
		{ title: 'Instrument' },
		{ title: 'Control' },
		{ title: 'Dashboard' }
	];
</script>

<svelte:head>
	<title>Systems — Brighter Intelligence Labs</title>
	<meta name="description" content="Bespoke AI workflow systems, intelligent operations dashboards, and infrastructure consulting. Engineered for real business operations." />
</svelte:head>

<section class="section">
	<div class="container">
		<header class="page-header">
			<div class="eyebrow">Our Services</div>
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
		<div class="system-block">
			<div class="system-content">
				<div class="tag">Core Offering</div>
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
			</div>
			<div class="system-diagram">
				<StepProcess steps={workflowSteps} label="How it works — AI Workflow Systems" />
			</div>
		</div>
	</div>
</section>

<!-- Intelligent Operations -->
<section class="section" id="intelligent-operations">
	<div class="container">
		<div class="system-block">
			<div class="system-content">
				<div class="tag">For Teams Running AI</div>
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
			</div>
			<div class="system-diagram">
				<StepProcess steps={opsSteps} label="How it works — Intelligent Operations" />
			</div>
		</div>
	</div>
</section>

<!-- Consulting -->
<section class="section section-alt" id="consulting">
	<div class="container">
		<div class="system-block">
			<div class="system-content">
				<div class="tag">Advisory</div>
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
		margin-bottom: var(--space-4);
	}

	.page-subline {
		font-size: var(--text-base);
		color: var(--text-primary);
		font-weight: 400;
		line-height: 1.5;
		max-width: 520px;
	}

	.system-block {
		display: flex;
		flex-direction: column;
		gap: var(--space-10);
	}

	.system-content h2 {
		margin-top: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.system-content h3 {
		margin-top: var(--space-8);
		margin-bottom: var(--space-4);
		font-size: var(--text-lg);
	}

	.system-lead {
		font-size: var(--text-base);
		color: var(--text-primary);
		font-weight: 400;
		line-height: 1.5;
		max-width: 600px;
	}

	.system-content ul {
		list-style: none;
		padding: 0;
	}

	.system-content li {
		padding: var(--space-2) 0;
		padding-left: var(--space-5);
		position: relative;
		color: var(--text-primary);
		font-size: var(--text-sm);
		font-weight: 400;
		line-height: 1.5;
	}

	.system-content li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 13px;
		width: 6px;
		height: 6px;
		background: var(--accent);
		border-radius: 50%;
	}

	.consult-note {
		margin-top: var(--space-8);
		padding: var(--space-5) var(--space-6);
		background: var(--accent-light);
		border-left: 3px solid var(--accent);
		border-radius: 0 var(--radius) var(--radius) 0;
	}

	.consult-note p {
		font-size: var(--text-sm);
		color: #7a3518;
		margin: 0;
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.system-block {
			gap: var(--space-8);
		}
	}
</style>
