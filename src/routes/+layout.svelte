<script>
	import '../styles/global.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Brighter Intelligence Labs — Bespoke AI Systems for Business</title>
	<meta name="description" content="We design and deploy bespoke AI systems that run real business workflows. Infrastructure-level thinking with cost control, governance, and observability built in." />
</svelte:head>

<Nav />
<main>
	{@render children()}
</main>
<Footer />

<style>
	main {
		min-height: 100vh;
	}
</style>
