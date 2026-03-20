<script lang="ts">
	let email = $state('');
	let name = $state('');
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');

	async function subscribe() {
		status = 'loading';
		try {
			const res = await fetch('/api/email/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, name })
			});
			status = res.ok ? 'success' : 'error';
		} catch {
			status = 'error';
		}
	}
</script>

{#if status === 'success'}
	<p class="success-msg">You're in. Check your inbox for a welcome email.</p>
{:else}
	<form
		onsubmit={(e) => {
			e.preventDefault();
			subscribe();
		}}
		class="subscribe-form"
	>
		<input type="text" bind:value={name} placeholder="Your name (optional)" />
		<input type="email" bind:value={email} placeholder="Email address" required />
		<button type="submit" disabled={status === 'loading'}>
			{status === 'loading' ? 'Subscribing...' : 'Subscribe'}
		</button>
		{#if status === 'error'}
			<p class="error-msg">Something went wrong. Try again.</p>
		{/if}
	</form>
{/if}

<style>
	.subscribe-form {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	input {
		padding: 0.5rem 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
		font-size: 0.85rem;
		font-family: var(--font-ui);
		flex: 1;
		min-width: 160px;
	}

	input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	input:focus {
		outline: none;
		border-color: var(--accent);
	}

	button {
		padding: 0.5rem 1rem;
		background: var(--accent);
		color: #fff;
		border: none;
		border-radius: 6px;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		font-family: var(--font-ui);
	}

	button:hover:not(:disabled) {
		opacity: 0.9;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.success-msg {
		color: #a7f3d0;
		font-size: 0.85rem;
	}

	.error-msg {
		color: #fca5a5;
		font-size: 0.8rem;
		width: 100%;
	}
</style>
