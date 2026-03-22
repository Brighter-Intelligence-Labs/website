<script>
	let { categories, active = $bindable('all') } = $props();
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
		gap: var(--space-2);
		flex-wrap: wrap;
		margin-bottom: var(--space-8);
	}

	.filter-tag {
		padding: var(--space-2) var(--space-4);
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--text-muted);
		background: transparent;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.filter-tag:hover {
		border-color: var(--text-secondary);
		color: var(--text-secondary);
	}

	.filter-tag.active {
		background: var(--text-primary);
		border-color: var(--text-primary);
		color: var(--surface);
	}
</style>
