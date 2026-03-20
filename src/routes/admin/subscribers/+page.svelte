<script lang="ts">
	let { data } = $props();

	function formatDate(d: string) {
		return new Date(d).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	const activeCount = $derived(data.subscribers.filter((s) => s.status === 'active').length);
</script>

<div class="subscribers-page">
	<h1>Subscribers</h1>
	<p class="subtitle">{activeCount} active / {data.subscribers.length} total</p>

	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th>Email</th>
					<th>Name</th>
					<th>Status</th>
					<th>Subscribed</th>
				</tr>
			</thead>
			<tbody>
				{#each data.subscribers as sub}
					<tr>
						<td>{sub.email}</td>
						<td>{sub.name ?? '-'}</td>
						<td>
							<span
								class="status-badge"
								class:active={sub.status === 'active'}
								class:inactive={sub.status !== 'active'}
							>
								{sub.status}
							</span>
						</td>
						<td>{formatDate(sub.subscribed_at)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	h1 {
		font-family: var(--font-display);
		font-size: 1.8rem;
		margin-bottom: 0.25rem;
	}

	.subtitle {
		color: #6b7280;
		font-size: 0.85rem;
		margin-bottom: 1.5rem;
	}

	.table-wrap {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		overflow: hidden;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;
	}

	th {
		text-align: left;
		padding: 0.75rem 1rem;
		background: #f9fafb;
		font-weight: 600;
		color: #374151;
		border-bottom: 1px solid #e5e7eb;
	}

	td {
		padding: 0.6rem 1rem;
		border-bottom: 1px solid #f3f4f6;
		color: #374151;
	}

	.status-badge {
		font-size: 0.7rem;
		padding: 0.15rem 0.5rem;
		border-radius: 10px;
		font-weight: 600;
		text-transform: capitalize;
	}

	.status-badge.active {
		background: #d1fae5;
		color: #065f46;
	}

	.status-badge.inactive {
		background: #fee2e2;
		color: #991b1b;
	}
</style>
