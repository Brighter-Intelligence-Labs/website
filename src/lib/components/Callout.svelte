<script>
	let { type = 'insight' } = $props();
</script>

<aside class="callout callout-{type}">
	<slot />
</aside>

<style>
	.callout {
		border-left: 3px solid var(--accent);
		background: var(--accent-light);
		padding: var(--space-5) var(--space-6);
		margin: var(--space-8) 0;
		border-radius: 0 var(--radius) var(--radius) 0;
		font-size: var(--text-sm);
		line-height: 1.6;
		color: #7a3518;
	}

	.callout-warning {
		border-left-color: #D97706;
		background: #FEF3C7;
		color: #92400E;
	}

	.callout :global(strong) {
		font-weight: 600;
		color: inherit;
	}
</style>
