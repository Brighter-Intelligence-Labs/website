<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data, form } = $props();
	let article = $derived(data.article);
	let actionLoading = $state('');

	async function triggerAction(action: string) {
		actionLoading = action;
		try {
			const res = await fetch(`/api/admin/content/${article.id}/${action}`, { method: 'POST' });
			if (!res.ok) {
				const err = await res.json();
				alert(err.error || 'Action failed');
			}
			await invalidateAll();
		} finally {
			actionLoading = '';
		}
	}
</script>

<div class="editor">
	<div class="editor-header">
		<a href="/admin/content" class="back-link">Back to pipeline</a>
		<span class="status-badge">{article.status}</span>
	</div>

	{#if form?.success}
		<p class="success">Saved successfully.</p>
	{/if}
	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	<form method="POST" action="?/save" use:enhance>
		<div class="form-grid">
			<div class="form-left">
				<label>
					Title
					<input type="text" name="title" value={article.title} required />
				</label>
				<label>
					Slug
					<input type="text" name="slug" value={article.slug} required />
				</label>
				<div class="row">
					<label>
						Category
						<select name="category" value={article.category}>
							<option value="systems-thinking">Systems Thinking</option>
							<option value="agent-design">Agent Design</option>
							<option value="cost-governance">Cost Governance</option>
						</select>
					</label>
					<label>
						Read time
						<input type="text" name="read_time" value={article.read_time ?? ''} placeholder="8 min read" />
					</label>
				</div>
				<label>
					Tags (comma-separated)
					<input type="text" name="tags" value={article.tags?.join(', ') ?? ''} />
				</label>
				<label>
					Excerpt
					<textarea name="excerpt" rows="2">{article.excerpt ?? ''}</textarea>
				</label>
				<label class="checkbox-label">
					<input type="checkbox" name="featured" checked={article.featured} />
					Featured article
				</label>
			</div>

			<div class="form-center">
				<label>
					Content (Markdown)
					<textarea name="content" rows="24">{article.content ?? ''}</textarea>
				</label>
			</div>

			<div class="form-right">
				<h3>Research Notes</h3>
				<div class="notes-display">
					{#if article.research_notes}
						<pre>{article.research_notes}</pre>
					{:else}
						<p class="muted">No research yet. Click "Trigger Research" to generate.</p>
					{/if}
				</div>
				{#if article.draft_content && article.draft_content !== article.content}
					<h3>AI Draft</h3>
					<div class="notes-display">
						<pre>{article.draft_content}</pre>
					</div>
				{/if}
			</div>
		</div>

		<div class="action-bar">
			<button type="submit" class="btn-save">Save</button>
			<button
				type="button"
				class="btn-action"
				disabled={actionLoading !== ''}
				onclick={() => triggerAction('trigger-research')}
			>
				{actionLoading === 'trigger-research' ? 'Researching…' : 'Trigger Research'}
			</button>
			<button
				type="button"
				class="btn-action"
				disabled={actionLoading !== ''}
				onclick={() => triggerAction('trigger-draft')}
			>
				{actionLoading === 'trigger-draft' ? 'Drafting…' : 'Trigger Draft'}
			</button>
			<button
				type="button"
				class="btn-publish"
				disabled={actionLoading !== ''}
				onclick={() => triggerAction('publish')}
			>
				{actionLoading === 'publish' ? 'Publishing…' : 'Publish'}
			</button>
		</div>
	</form>
</div>

<style>
	.editor-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.back-link {
		font-size: 0.85rem;
		color: #6b7280;
		text-decoration: none;
	}

	.back-link:hover {
		color: var(--accent);
	}

	.status-badge {
		background: #e5e7eb;
		color: #374151;
		font-size: 0.7rem;
		padding: 0.2rem 0.6rem;
		border-radius: 10px;
		font-weight: 600;
		text-transform: uppercase;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 280px 1fr 300px;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	@media (max-width: 1200px) {
		.form-grid {
			grid-template-columns: 1fr;
		}
	}

	label {
		display: block;
		font-size: 0.8rem;
		font-weight: 500;
		color: #374151;
		margin-bottom: 0.75rem;
	}

	input,
	select,
	textarea {
		display: block;
		width: 100%;
		margin-top: 0.25rem;
		padding: 0.5rem 0.6rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.85rem;
		font-family: var(--font-ui);
		box-sizing: border-box;
	}

	textarea[name='content'] {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		line-height: 1.5;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--accent);
	}

	.row {
		display: flex;
		gap: 1rem;
	}

	.row label {
		flex: 1;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-direction: row;
	}

	.checkbox-label input {
		width: auto;
		margin: 0;
	}

	h3 {
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #374151;
	}

	.notes-display {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		padding: 0.75rem;
		max-height: 400px;
		overflow-y: auto;
		margin-bottom: 1rem;
	}

	.notes-display pre {
		white-space: pre-wrap;
		font-size: 0.78rem;
		font-family: var(--font-ui);
		line-height: 1.5;
		margin: 0;
	}

	.muted {
		color: #9ca3af;
		font-size: 0.8rem;
		font-style: italic;
	}

	.action-bar {
		display: flex;
		gap: 0.75rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
	}

	.btn-save {
		background: var(--accent);
		color: #fff;
		border: none;
		padding: 0.55rem 1.2rem;
		border-radius: 6px;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-action {
		background: #fff;
		color: #374151;
		border: 1px solid #d1d5db;
		padding: 0.55rem 1rem;
		border-radius: 6px;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.btn-action:hover:not(:disabled) {
		background: #f9fafb;
	}

	.btn-publish {
		background: #059669;
		color: #fff;
		border: none;
		padding: 0.55rem 1.2rem;
		border-radius: 6px;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		margin-left: auto;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.success {
		background: #f0fdf4;
		color: #15803d;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.error {
		background: #fef2f2;
		color: #b91c1c;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}
</style>
