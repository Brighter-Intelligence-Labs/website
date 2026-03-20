<script>
	let { steps } = $props();
</script>

<div class="steps">
	{#each steps as step, i}
		<div class="step">
			<div class="step-number">{i + 1}</div>
			<div class="step-content">
				<h4>{step.title}</h4>
				<p>{step.description}</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.steps {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.step {
		display: flex;
		gap: var(--space-md);
		align-items: flex-start;
	}

	.step-number {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: var(--text-sm);
		color: var(--color-accent);
		background: var(--color-accent-light);
		border-radius: 50%;
	}

	.step-content h4 {
		font-size: var(--text-base);
		margin-bottom: 0.25rem;
	}

	.step-content p {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		line-height: 1.6;
	}
</style>
