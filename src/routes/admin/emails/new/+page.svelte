<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<div class="new-campaign">
	<h1>New Email Campaign</h1>

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	<form method="POST" use:enhance>
		<label>
			Subject
			<input type="text" name="subject" required />
		</label>
		<label>
			HTML Body
			<textarea name="body_html" rows="12" required placeholder="Include unsubscribe_url placeholder for the unsubscribe link"></textarea>
		</label>
		<label>
			Plain Text Body
			<textarea name="body_text" rows="6" required placeholder="Include unsubscribe_url placeholder for the unsubscribe link"></textarea>
		</label>
		<button type="submit">Create Campaign</button>
	</form>
</div>

<style>
	h1 {
		font-family: var(--font-display);
		font-size: 1.8rem;
		margin-bottom: 1.5rem;
	}

	form {
		max-width: 640px;
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
	textarea {
		display: block;
		width: 100%;
		margin-top: 0.35rem;
		padding: 0.6rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.9rem;
		font-family: var(--font-mono);
		box-sizing: border-box;
	}

	input:focus,
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

	.error {
		background: #fef2f2;
		color: #b91c1c;
		padding: 0.6rem 0.8rem;
		border-radius: 6px;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}
</style>
