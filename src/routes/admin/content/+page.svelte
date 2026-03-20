<script lang="ts">
	import { enhance } from '$app/forms';
	let { data } = $props();

	const columns = ['idea', 'researching', 'drafting', 'review', 'approved', 'published'] as const;

	const articlesByStatus = $derived(
		columns.map((status) => ({
			status,
			articles: data.articles.filter((a) => a.status === status)
		}))
	);

	function formatDate(date: string | null) {
		if (!date) return '';
		return new Date(date).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short'
		});
	}
</script>

<div class="content-page">
	<div class="page-header">
		<h1>Content Pipeline</h1>
		<a href="/admin/content/new" class="btn-new">New Article</a>
	</div>

	<div class="kanban">
		{#each articlesByStatus as column}
			<div class="kanban-column">
				<div class="column-header">
					<span class="column-title">{column.status}</span>
					<span class="column-count">{column.articles.length}</span>
				</div>
				<div class="column-cards">
					{#each column.articles as article}
						<a href="/admin/content/{article.id}" class="card">
							<span class="card-title">{article.title}</span>
							<div class="card-meta">
								<span class="card-category">{article.category}</span>
								<span class="card-date">{formatDate(article.updated_at)}</span>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/each}
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

	.kanban {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		padding-bottom: 1rem;
	}

	.kanban-column {
		min-width: 200px;
		flex: 1;
	}

	.column-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.column-title {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #6b7280;
	}

	.column-count {
		background: #e5e7eb;
		color: #374151;
		font-size: 0.7rem;
		padding: 0.1rem 0.45rem;
		border-radius: 10px;
		font-weight: 600;
	}

	.column-cards {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 0.75rem;
		text-decoration: none;
		color: inherit;
		transition:
			box-shadow 0.15s,
			border-color 0.15s;
	}

	.card:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		border-color: #d1d5db;
	}

	.card-title {
		display: block;
		font-size: 0.85rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 0.4rem;
		line-height: 1.3;
	}

	.card-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-category {
		font-size: 0.7rem;
		color: var(--accent);
		font-weight: 500;
	}

	.card-date {
		font-size: 0.7rem;
		color: #9ca3af;
	}
</style>
