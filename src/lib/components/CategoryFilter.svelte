<script>
	let { categories, active = 'all' } = $props();
</script>

<div class="filter-bar">
	<button
		class="filter-tag"
		class:active={active === 'all'}
		onclick={() => active = 'all'}
	>
		All
	</button>
	{#each categories as category}
		<button
			class="filter-tag"
			class:active={active === category}
			onclick={() => active = category}
		>
			{category}
		</button>
	{/each}
</div>

<style>
	.filter-bar {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: var(--space-lg);
	}

	.filter-tag {
		padding: 0.375rem 1rem;
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-muted);
		background: transparent;
		border: 1.5px solid var(--color-border);
		border-radius: 100px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.filter-tag:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.filter-tag.active {
		background: var(--color-accent);
		border-color: var(--color-accent);
		color: white;
	}
</style>
