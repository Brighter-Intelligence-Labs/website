<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<div class="new-article">
	<h1>New Article</h1>

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	<form method="POST" use:enhance>
		<label>
			Title
			<input type="text" name="title" required value={form?.title ?? ''} />
		</label>
		<label>
			Slug
			<input
				type="text"
				name="slug"
				required
				value={form?.slug ?? ''}
				placeholder="auto-generated-from-title"
			/>
		</label>
		<label>
			Category
			<select name="category" required>
				<option value="systems-thinking">Systems Thinking</option>
				<option value="agent-design">Agent Design</option>
				<option value="cost-governance">Cost Governance</option>
			</select>
		</label>
		<label>
			Excerpt
			<textarea name="excerpt" rows="2">{form?.excerpt ?? ''}</textarea>
		</label>
		<label>
			Tags (comma-separated)
			<input type="text" name="tags" value={form?.tags ?? ''} placeholder="ai, agents, ops" />
		</label>
		<button type="submit">Create Article</button>
	</form>
</div>

<style>
	h1 {
		font-family: var(--font-display);
		font-size: 1.8rem;
		margin-bottom: 1.5rem;
	}

	form {
		max-width: 560px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: block;
		font-size: 0.85rem;
		font-weight: 500;
		color: #374151;
	}

	input,
	select,
	textarea {
		display: block;
		width: 100%;
		margin-top: 0.35rem;
		padding: 0.6rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.9rem;
		font-family: var(--font-ui);
		box-sizing: border-box;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--accent);
	}

	button {
		background: var(--accent);
		color: #fff;
		border: none;
		padding: 0.7rem 1.5rem;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		align-self: flex-start;
	}

	button:hover {
		opacity: 0.9;
	}

	.error {
		background: #fef2f2;
		color: #b91c1c;
		padding: 0.6rem 0.8rem;
		border-radius: 6px;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}
</style>
