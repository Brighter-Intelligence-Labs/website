<script>
	let { type = 'insight' } = $props();
</script>

<aside class="callout callout-{type}">
	<slot />
</aside>

<style>
	.callout {
		border-left: 3px solid var(--color-accent);
		background: var(--color-accent-light);
		padding: var(--space-md) var(--space-md);
		margin: var(--space-lg) 0;
		border-radius: 0 var(--radius) var(--radius) 0;
		font-size: var(--text-base);
		line-height: 1.6;
	}

	.callout-warning {
		border-left-color: #D97706;
		background: #FEF3C7;
	}
</style>
