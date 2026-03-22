<script>
	import HeroKanban from '$lib/components/HeroKanban.svelte';

	let {
		eyebrow = 'Bespoke AI Systems for Business',
		headline = 'We design and deploy bespoke AI systems that run real business workflows',
		subline = 'Infrastructure-level thinking with cost control, governance, and observability built in. Not another chatbot — a system engineered for your operations.',
		ctaText = 'Book a Discovery Call',
		ctaHref = '/contact'
	} = $props();

	let heroInner;
	let dragging = $state(false);

	function onPointerDown(e) {
		if (window.innerWidth <= 768) return;
		dragging = true;
		e.preventDefault();
		document.body.style.cursor = 'col-resize';
		document.body.style.userSelect = 'none';

		function onPointerMove(e) {
			const rect = heroInner.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const pct = Math.min(Math.max(x / rect.width * 100, 30), 75);
			heroInner.style.gridTemplateColumns = `${pct}fr auto ${100 - pct}fr`;
		}

		function onPointerUp() {
			dragging = false;
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onPointerUp);
		}

		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);
	}
</script>

<section class="hero">
	<div class="hero-inner" bind:this={heroInner}>
		<div class="hero-eyebrow">{eyebrow}</div>
		<div class="hero-copy">
			<h1 class="hero-h1">{headline}</h1>
			<p class="hero-sub">{subline}</p>
			<div class="hero-actions">
				<a href={ctaHref} class="btn-primary">{ctaText}</a>
				<a href="/insights" class="btn-ghost">Read Our Insights</a>
			</div>
		</div>
		<div
			class="resize-handle"
			class:active={dragging}
			onpointerdown={onPointerDown}
			role="separator"
			aria-orientation="vertical"
			aria-label="Resize hero columns"
		>
			<div class="handle-grip"></div>
		</div>
		<div class="hero-anim-wrap">
			<HeroKanban />
		</div>
	</div>
</section>

<style>
	.hero {
		padding: var(--section-padding-y) 0;
		background: var(--surface);
	}

	.hero-inner {
		max-width: var(--max-width-page);
		margin: 0 auto;
		padding: 0 var(--section-padding-x);
		display: grid;
		grid-template-columns: 4.5fr auto 6fr;
		grid-template-rows: auto 1fr;
		gap: 0;
		align-items: start;
	}

	.hero-eyebrow {
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: var(--space-5);
		grid-column: 1 / -1;
		grid-row: 1;
	}

	.hero-h1 {
		margin-bottom: var(--space-6);
	}

	.hero-sub {
		font-size: var(--text-base);
		color: var(--text-primary);
		font-weight: 400;
		line-height: 1.5;
		margin-bottom: var(--space-8);
		max-width: 480px;
	}

	.hero-actions {
		display: flex;
		gap: var(--space-4);
		align-items: center;
	}

	.hero-copy {
		grid-row: 2;
		padding-right: var(--space-16);
	}

	/* ── Resize handle ────────────────────────────── */
	.resize-handle {
		grid-row: 2;
		width: 24px;
		margin: 0 -12px;
		cursor: col-resize;
		display: flex;
		align-items: center;
		justify-content: center;
		align-self: stretch;
		position: relative;
		z-index: 3;
		touch-action: none;
	}

	.resize-handle::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 1px;
		background: var(--border);
		transition: background 0.15s ease;
	}

	.resize-handle:hover::before,
	.resize-handle.active::before {
		background: var(--accent);
	}

	.handle-grip {
		width: 6px;
		height: 32px;
		border-radius: 3px;
		background: var(--border);
		position: relative;
		z-index: 1;
		transition: background 0.15s ease, transform 0.15s ease;
	}

	.resize-handle:hover .handle-grip,
	.resize-handle.active .handle-grip {
		background: var(--accent);
		transform: scaleY(1.2);
	}

	.hero-anim-wrap {
		grid-row: 2;
		align-self: stretch;
	}

	.hero-anim-wrap :global(.hero-anim) {
		height: 100%;
	}

	@media (max-width: 768px) {
		.hero-inner {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto;
		}

		.hero-eyebrow {
			margin-bottom: var(--space-3);
		}

		.hero-copy {
			padding-right: 0;
		}

		.resize-handle {
			display: none;
		}

		.hero-anim-wrap {
			display: none;
		}
	}
</style>
