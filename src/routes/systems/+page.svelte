<script>
	import ServiceDetail from '$lib/components/ServiceDetail.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
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

<ServiceDetail
	tag="Core Offering"
	heading="AI Workflow Systems"
	body="End-to-end agentic workflows for your business processes. We take your business process and turn it into an intelligent system that runs itself — with governance, cost control, and full visibility."
	features={[
		'Bespoke multi-agent system tailored to your domain',
		'Integration with your existing tools and data sources',
		'Economic model routing — right model for each task',
		'Governance, audit trails, and approval workflows built in',
		'Real-time cost monitoring and budget controls'
	]}
	steps={[
		{ name: 'Discovery', desc: 'Map processes & define metrics', done: true },
		{ name: 'Architecture', desc: 'Design orchestration layer', done: true },
		{ name: 'Build', desc: 'Implement with your team', active: true },
		{ name: 'Deploy', desc: 'With monitoring & controls' },
		{ name: 'Optimise', desc: 'Tune routing, reduce costs' }
	]}
/>

<ServiceDetail
	tag="For Teams Running AI"
	heading="Intelligent Operations"
	body="Already running AI agents? We'll give you the control plane — cost visibility, governance, audit trails, and kill switches. Know exactly what your AI is doing and what it costs."
	features={[
		'Real-time cost tracking across all AI operations',
		'Governance layer with approval gates and permissions',
		'Audit logging for compliance and debugging',
		'Budget ceilings with automatic enforcement',
		'Custom operations dashboard'
	]}
	steps={[
		{ name: 'Audit', desc: 'Assess gaps & cost leaks', done: true },
		{ name: 'Instrument', desc: 'Deploy monitoring', active: true },
		{ name: 'Control', desc: 'Budget ceilings & gates' },
		{ name: 'Dashboard', desc: 'Live ops visibility' }
	]}
	alt
/>

<ServiceDetail
	tag="Advisory"
	heading="Infrastructure Consulting"
	body="Before you build, let us review your architecture. We've seen what fails in production — model selection mistakes, orchestration anti-patterns, cost blowouts, governance gaps. A few days of expert review can save months of rework."
	features={[
		'Architecture review of current or planned AI systems',
		'Recommendations for model routing and cost optimisation',
		'Governance and compliance gap analysis',
		'Production readiness assessment',
		'Written report with prioritised action plan'
	]}
	engagement
/>

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
		font-size: 15px;
		font-weight: 300;
		color: var(--body);
		line-height: 1.72;
		max-width: 520px;
	}
</style>
