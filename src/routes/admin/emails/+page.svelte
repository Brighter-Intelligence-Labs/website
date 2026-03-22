<script lang="ts">
	let { data } = $props();

	function formatDate(d: string | null) {
		if (!d) return '-';
		return new Date(d).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<div class="emails-page">
	<div class="page-header">
		<h1>Email Campaigns</h1>
		<a href="/admin/emails/new" class="btn-new">New Campaign</a>
	</div>

	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th>Subject</th>
					<th>Status</th>
					<th>Sent</th>
					<th>Created</th>
				</tr>
			</thead>
			<tbody>
				{#each data.campaigns as campaign}
					<tr>
						<td>
							<a href="/admin/emails/{campaign.id}">{campaign.subject}</a>
						</td>
						<td>
							<span class="status-badge" class:sent={campaign.status === 'sent'}>
								{campaign.status}
							</span>
						</td>
						<td>{formatDate(campaign.sent_at)}</td>
						<td>{formatDate(campaign.created_at)}</td>
					</tr>
				{/each}
				{#if data.campaigns.length === 0}
					<tr>
						<td colspan="4" class="empty">No campaigns yet.</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<style>
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	h1 {
		font-family: var(--font-display);
		font-size: 1.8rem;
	}

	.btn-new {
		background: var(--accent);
		color: #fff;
		padding: 0.5rem 1.2rem;
		border-radius: 6px;
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 600;
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

	td a {
		color: var(--accent);
		text-decoration: none;
		font-weight: 500;
	}

	td a:hover {
		text-decoration: underline;
	}

	.status-badge {
		font-size: 0.7rem;
		padding: 0.15rem 0.5rem;
		border-radius: 10px;
		font-weight: 600;
		text-transform: capitalize;
		background: #e5e7eb;
		color: #374151;
	}

	.status-badge.sent {
		background: #d1fae5;
		color: #065f46;
	}

	.empty {
		text-align: center;
		color: #9ca3af;
		padding: 2rem !important;
	}
</style>
