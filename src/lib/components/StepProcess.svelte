<script>
	let { steps, label = '' } = $props();
</script>

<div class="pipeline-wrap">
	{#if label}
		<div class="pipeline-label">{label}</div>
	{/if}
	<div class="pipeline">
		{#each steps as step, i}
			<div class="step">
				<div class="step-inner">
					<div class="step-num">{String(i + 1).padStart(2, '0')}</div>
					<div class="step-name">{step.title}</div>
				</div>
				{#if i < steps.length - 1}
					<div class="step-arrow">&rarr;</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.pipeline-wrap {
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: var(--space-8);
	}

	.pipeline-label {
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: var(--space-5);
	}

	.pipeline {
		display: flex;
		align-items: stretch;
	}

	.step {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.step-inner {
		flex: 1;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-4);
	}

	.step-num {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.1em;
		color: var(--accent);
		text-transform: uppercase;
		margin-bottom: var(--space-1);
	}

	.step-name {
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--text-primary);
	}

	.step-arrow {
		width: 28px;
		flex-shrink: 0;
		text-align: center;
		color: var(--border);
		font-size: 14px;
	}

	@media (max-width: 640px) {
		.pipeline {
			flex-direction: column;
			gap: var(--space-2);
		}

		.step {
			flex-direction: column;
		}

		.step-inner {
			width: 100%;
		}

		.step-arrow {
			width: auto;
			height: 24px;
			line-height: 24px;
			transform: rotate(90deg);
		}
	}
</style>
