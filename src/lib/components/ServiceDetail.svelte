<script>
	import { onMount } from 'svelte';

	let {
		tag = '',
		heading = '',
		body = '',
		features = [],
		steps = [],
		engagement = false,
		alt = false
	} = $props();

	let pipelineEl;

	onMount(() => {
		if (!pipelineEl || engagement) return;
		const stepEls = pipelineEl.querySelectorAll('.ps-inner');
		let activeIdx = -1;
		stepEls.forEach((s, i) => {
			if (s.classList.contains('active-step')) activeIdx = i;
		});
		if (activeIdx < 0) return;
		let cur = activeIdx;
		const interval = setInterval(() => {
			stepEls.forEach(s => { s.classList.remove('active-step'); s.classList.remove('done-step'); });
			for (let i = 0; i < cur; i++) stepEls[i].classList.add('done-step');
			stepEls[cur].classList.add('active-step');
			cur = (cur + 1) % stepEls.length;
		}, 2200);
		return () => clearInterval(interval);
	});
</script>

<section class="service-detail" class:alt>
	<div class="sd-grid">
		<div class="sd-tag">{tag}</div>
		<div>
			<h2>{heading}</h2>
			<p class="lead">{body}</p>
			{#if features.length > 0}
				<div class="feature-list">
					{#each features as feature}
						<div class="feature-item">{feature}</div>
					{/each}
				</div>
			{/if}
		</div>
		<div>
			{#if engagement}
				<!-- Engagement format card for consulting -->
				<div class="engage-card">
					<div class="engage-header">
						<div class="engage-label">Typical engagement</div>
						<div class="engage-duration">2–5 days</div>
					</div>
					<div class="engage-body">
						<div class="engage-row">
							<span class="engage-day accent">Day 1</span>
							Kickoff &amp; architecture walkthrough with your engineering team
						</div>
						<div class="engage-row">
							<span class="engage-day muted">2–4</span>
							Hands-on review of systems, code, infrastructure decisions
						</div>
						<div class="engage-row">
							<span class="engage-day green">Final</span>
							Detailed recommendations report with prioritised action plan
						</div>
					</div>
				</div>
			{:else}
				<!-- Pipeline diagram -->
				<div class="pipeline-wrap" bind:this={pipelineEl}>
					<div class="pipeline-label">How it works</div>
					<div class="pipeline-steps">
						{#each steps as step, i}
							<div class="ps-item" style="animation-delay:{0.1 + i * 0.15}s">
								<div class="ps-inner" class:done-step={step.done} class:active-step={step.active}>
									<div class="ps-num">{String(i + 1).padStart(2, '0')}</div>
									<div class="ps-name">{step.name}</div>
									<div class="ps-desc">{step.desc}</div>
								</div>
								{#if i < steps.length - 1}
									<div class="ps-arrow">›</div>
								{:else}
									<div class="ps-arrow" style="visibility:hidden">›</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.service-detail {
		padding: var(--section-padding-y) 0;
		background: var(--surface);
	}

	.service-detail.alt { background: var(--bg); }

	.sd-grid {
		max-width: var(--max-width-page);
		margin: 0 auto;
		padding: 0 var(--section-padding-x);
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 64px;
		align-items: start;
	}

	.sd-tag {
		display: inline-block;
		width: fit-content;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
		background: var(--acl);
		border: 0.5px solid var(--acb);
		padding: 3px 10px;
		border-radius: 3px;
		margin-bottom: 20px;
		grid-column: 1 / -1;
	}

	h2 {
		font-family: var(--fd);
		font-size: clamp(24px, 3vw, 36px);
		font-weight: 400;
		line-height: 1.15;
		letter-spacing: -0.015em;
		color: var(--text-primary);
		margin-bottom: 14px;
	}

	.lead {
		font-size: 17px;
		font-weight: 400;
		color: var(--text-primary);
		line-height: 1.72;
		max-width: 560px;
		margin-bottom: 20px;
	}

	.feature-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 20px;
	}

	.feature-item {
		display: flex;
		align-items: baseline;
		gap: 10px;
		font-size: 13px;
		font-weight: 400;
		color: var(--text-primary);
		line-height: 1.5;
	}

	.feature-item::before {
		content: '';
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--accent);
		flex-shrink: 0;
		margin-top: 6px;
	}

	/* Pipeline */
	.pipeline-wrap {
		background: var(--surface-2);
		border: 0.5px solid var(--border);
		border-radius: 10px;
		padding: 28px 24px;
	}

	.pipeline-label {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 20px;
	}

	.pipeline-steps {
		display: flex;
		align-items: stretch;
	}

	.ps-item {
		flex: 1;
		display: flex;
		align-items: center;
		opacity: 0;
		animation: stepReveal 0.4s ease forwards;
	}

	.ps-inner {
		flex: 1;
		background: var(--surface);
		border: 0.5px solid var(--border);
		border-radius: 6px;
		padding: 14px 12px;
		position: relative;
		overflow: hidden;
		transition: border-color 0.4s, box-shadow 0.4s;
	}

	:global(.ps-inner.active-step) {
		border-color: rgba(200,90,42,0.4);
		box-shadow: 0 1px 8px rgba(200,90,42,0.08);
	}

	:global(.ps-inner.done-step) {
		border-color: var(--grb);
	}

	.ps-inner::after {
		content: '';
		position: absolute;
		bottom: 0; left: 0; right: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--accent), #e87a3a);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.8s ease;
	}

	:global(.ps-inner.done-step)::after {
		transform: scaleX(1);
		background: linear-gradient(90deg, var(--green), #4ade80);
	}

	.ps-num {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.1em;
		color: var(--accent);
		text-transform: uppercase;
		margin-bottom: 4px;
	}

	.ps-name {
		font-size: 11px;
		font-weight: 500;
		color: var(--text-primary);
	}

	.ps-desc {
		font-size: 9px;
		color: var(--text-muted);
		margin-top: 3px;
		line-height: 1.4;
	}

	.ps-arrow {
		width: 20px;
		flex-shrink: 0;
		text-align: center;
		color: var(--border);
		font-size: 12px;
	}

	/* Engagement card */
	.engage-card {
		border: 0.5px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
		background: var(--surface);
	}

	.engage-header {
		padding: 18px 20px;
		border-bottom: 0.5px solid var(--border);
		background: var(--surface-2);
	}

	.engage-label {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 4px;
	}

	.engage-duration {
		font-size: 22px;
		font-weight: 300;
		letter-spacing: -0.025em;
		color: var(--text-primary);
	}

	.engage-body {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.engage-row {
		display: flex;
		gap: 10px;
		font-size: 13px;
		font-weight: 300;
		color: var(--text-primary);
	}

	.engage-day {
		flex-shrink: 0;
		font-weight: 600;
	}

	.engage-day.accent { color: var(--accent); }
	.engage-day.muted  { color: var(--text-muted); font-weight: 500; }
	.engage-day.green  { color: var(--green); }

	@media (max-width: 900px) {
		.sd-grid { grid-template-columns: 1fr; gap: 40px; }
		.pipeline-steps { flex-direction: column; }
		.ps-arrow { transform: rotate(90deg); width: 100%; height: 16px; }
	}
</style>
