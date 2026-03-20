<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<div class="campaign-detail">
	<a href="/admin/emails" class="back-link">Back to campaigns</a>
	<h1>{data.campaign.subject}</h1>
	<span class="status-badge">{data.campaign.status}</span>

	{#if form?.success}
		<p class="success">Campaign sent successfully.</p>
	{/if}
	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	<div class="info">
		<p><strong>Active subscribers:</strong> {data.activeSubscriberCount}</p>
		{#if data.campaign.sent_at}
			<p>
				<strong>Sent:</strong>
				{new Date(data.campaign.sent_at).toLocaleDateString('en-GB', {
					day: 'numeric',
					month: 'long',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})}
			</p>
		{/if}
	</div>

	<div class="preview">
		<h3>HTML Preview</h3>
		<div class="preview-box">{@html data.campaign.body_html}</div>
	</div>

	{#if data.campaign.status === 'draft'}
		<form method="POST" action="?/send" use:enhance>
			<button type="submit" class="btn-send"
				>Send to {data.activeSubscriberCount} subscribers</button
			>
		</form>
	{/if}
</div>

<style>
	.back-link {
		font-size: 0.85rem;
		color: #6b7280;
		text-decoration: none;
	}

	h1 {
		font-family: var(--font-display);
		font-size: 1.5rem;
		margin: 0.5rem 0 0.5rem;
	}

	.status-badge {
		display: inline-block;
		background: #e5e7eb;
		color: #374151;
		font-size: 0.7rem;
		padding: 0.2rem 0.6rem;
		border-radius: 10px;
		font-weight: 600;
		text-transform: uppercase;
		margin-bottom: 1rem;
	}

	.info {
		margin-bottom: 1.5rem;
		font-size: 0.85rem;
		color: #374151;
	}

	.info p {
		margin-bottom: 0.25rem;
	}

	.preview {
		margin-bottom: 1.5rem;
	}

	h3 {
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.preview-box {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 1.5rem;
		max-width: 600px;
	}

	.btn-send {
		background: #059669;
		color: #fff;
		border: none;
		padding: 0.65rem 1.5rem;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-send:hover {
		opacity: 0.9;
	}

	.success {
		background: #f0fdf4;
		color: #15803d;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.85rem;
		margin: 0.75rem 0;
	}

	.error {
		background: #fef2f2;
		color: #b91c1c;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.85rem;
		margin: 0.75rem 0;
	}
</style>
