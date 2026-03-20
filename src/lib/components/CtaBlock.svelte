<script>
	let {
		headline = "Ready to build a system that actually works?",
		subtext = "Book a free 30-minute discovery call. We'll discuss your workflows, challenges, and whether a bespoke AI system makes sense for your business.",
		ctaText = "Book a Discovery Call",
		ctaHref = "/contact"
	} = $props();
</script>

<section class="cta-block">
	<div class="cta-inner">
		<div class="cta-copy">
			<h2 class="cta-title">{headline}</h2>
			<p class="cta-sub">{subtext}</p>
		</div>
		<a href={ctaHref} class="btn-cta">{ctaText}</a>
	</div>
</section>

<style>
	.cta-block {
		background: var(--black);
		padding: var(--section-padding-y) 0;
	}

	.cta-inner {
		max-width: var(--max-width-page);
		margin: 0 auto;
		padding: 0 var(--section-padding-x);
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--space-16);
		align-items: center;
	}

	.cta-title {
		font-family: var(--font-display);
		font-weight: 400;
		letter-spacing: -0.01em;
		line-height: 1.15;
		color: var(--white);
		margin-bottom: var(--space-4);
	}

	.cta-sub {
		font-size: var(--text-base);
		color: rgba(250, 249, 247, 0.65);
		font-weight: 400;
		line-height: 1.5;
	}

	.btn-cta {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--black);
		background: var(--white);
		padding: var(--space-4) var(--space-8);
		border-radius: var(--radius-sm);
		text-decoration: none;
		white-space: nowrap;
		letter-spacing: -0.01em;
		flex-shrink: 0;
		transition: opacity 0.15s ease;
	}

	.btn-cta:hover {
		opacity: 0.9;
		color: var(--black);
	}

	@media (max-width: 768px) {
		.cta-inner {
			grid-template-columns: 1fr;
			gap: var(--space-8);
		}

		.btn-cta {
			display: block;
			text-align: center;
			width: 100%;
		}
	}
</style>
