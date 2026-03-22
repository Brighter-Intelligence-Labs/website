<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<div class="login-wrap">
	<div class="login-card">
		<h1>Admin Login</h1>
		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}
		<form method="POST" use:enhance>
			<label>
				Email
				<input type="email" name="email" required />
			</label>
			<label>
				Password
				<input type="password" name="password" required />
			</label>
			<button type="submit">Sign in</button>
		</form>
	</div>
</div>

<style>
	.login-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #f8fafc;
		font-family: var(--font-ui);
	}

	.login-card {
		background: #fff;
		padding: 2.5rem;
		border-radius: 12px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		width: 100%;
		max-width: 380px;
	}

	h1 {
		font-family: var(--font-display);
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	label {
		display: block;
		font-size: 0.85rem;
		font-weight: 500;
		color: #374151;
		margin-bottom: 1rem;
	}

	input {
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

	input:focus {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 3px rgba(200, 90, 42, 0.1);
	}

	button {
		width: 100%;
		padding: 0.7rem;
		background: var(--accent);
		color: #fff;
		border: none;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		margin-top: 0.5rem;
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
		text-align: center;
	}
</style>
