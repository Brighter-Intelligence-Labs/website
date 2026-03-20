<script>
	import Hero from '$lib/components/Hero.svelte';
	import GapSection from '$lib/components/GapSection.svelte';
	import ServiceCards from '$lib/components/ServiceCards.svelte';
	import Differentiators from '$lib/components/Differentiators.svelte';
	import InsightsPreview from '$lib/components/InsightsPreview.svelte';
	import CtaBlock from '$lib/components/CtaBlock.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Brighter Intelligence Labs — Bespoke AI Systems for Business</title>
	<meta name="description" content="We design and deploy bespoke AI systems that run real business workflows. Infrastructure-level thinking with cost control, governance, and observability built in." />
	<meta property="og:title" content="Brighter Intelligence Labs" />
	<meta property="og:description" content="We design and deploy bespoke AI systems that run real business workflows." />
</svelte:head>

<Hero />
<GapSection />
<ServiceCards />
<Differentiators />

{#if data.articles.length > 0}
	<InsightsPreview articles={data.articles} />
{/if}

<CtaBlock />
