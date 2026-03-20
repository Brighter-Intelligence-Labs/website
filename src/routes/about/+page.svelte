<script>
	import PhilosophySection from '$lib/components/PhilosophySection.svelte';
	import CoreValues from '$lib/components/CoreValues.svelte';
	import PlatformTeaser from '$lib/components/PlatformTeaser.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';
</script>

<svelte:head>
	<title>About — Brighter Intelligence Labs</title>
	<meta name="description" content="Brighter Intelligence Labs designs and deploys bespoke AI systems for business. We're systems thinkers, not hype merchants." />
</svelte:head>

<section class="section">
	<div class="container">
		<div class="about-header">
			<div class="eyebrow">About Us</div>
			<h1>We build AI systems that run real business operations</h1>
			<p class="about-lead">
				Brighter Intelligence Labs is a systems engineering company. We design, deploy, and operate bespoke AI agent systems for businesses that need more than chatbots and demos.
			</p>
		</div>
	</div>
</section>

<PhilosophySection />
<CoreValues />
<PlatformTeaser />

<CtaBlock
	headline="Interested in working together?"
	subtext="We take on a small number of engagements at a time to ensure every client gets our full attention. Start with a conversation."
/>

<style>
	.about-header {
		max-width: 640px;
	}

	.about-header h1 {
		margin-bottom: var(--space-6);
	}

	.about-lead {
		font-size: 15px;
		font-weight: 300;
		color: var(--body);
		line-height: 1.72;
		max-width: 520px;
	}
</style>
