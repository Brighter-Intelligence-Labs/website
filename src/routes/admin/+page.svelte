<script lang="ts">
	let { data } = $props();
</script>

<div class="dashboard">
	<h1>Dashboard</h1>
	<div class="stats-grid">
		{#each data.statusCounts as { status, count }}
			<div class="stat-card">
				<span class="stat-count">{count}</span>
				<span class="stat-label">{status}</span>
			</div>
		{/each}
	</div>
	<div class="stats-grid" style="margin-top: 1.5rem;">
		<div class="stat-card">
			<span class="stat-count">{data.subscriberCount}</span>
			<span class="stat-label">subscribers</span>
		</div>
		<div class="stat-card">
			<span class="stat-count">{data.campaignCount}</span>
			<span class="stat-label">campaigns</span>
		</div>
	</div>
</div>

<style>
	h1 {
		font-family: var(--font-display);
		font-size: 1.8rem;
		margin-bottom: 1.5rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 1rem;
	}

	.stat-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 1.2rem;
		text-align: center;
	}

	.stat-count {
		display: block;
		font-size: 2rem;
		font-weight: 700;
		color: var(--accent);
	}

	.stat-label {
		display: block;
		font-size: 0.8rem;
		color: #6b7280;
		text-transform: capitalize;
		margin-top: 0.25rem;
	}
</style>
