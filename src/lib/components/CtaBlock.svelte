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
		<div>
			<h2>{headline}</h2>
			<p>{subtext}</p>
		</div>
		<a href={ctaHref} class="btn-cta">{ctaText}</a>
	</div>
</section>

<style>
	.cta-block {
		padding: var(--section-padding-y) 0;
		background: var(--black);
	}

	.cta-inner {
		max-width: var(--max-width-page);
		margin: 0 auto;
		padding: 0 var(--section-padding-x);
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 48px;
		align-items: center;
	}

	.cta-inner h2 {
		font-family: var(--fd);
		font-size: clamp(24px, 3vw, 34px);
		font-weight: 300;
		letter-spacing: -0.02em;
		color: var(--white);
		margin-bottom: 10px;
	}

	.cta-inner p {
		font-size: 14px;
		font-weight: 300;
		color: rgba(240,236,230,0.45);
		line-height: 1.65;
		max-width: 480px;
	}

	.btn-cta {
		display: inline-block;
		font-size: 13px;
		font-weight: 500;
		color: var(--black);
		background: var(--white);
		padding: 12px 24px;
		border-radius: 4px;
		border: none;
		cursor: pointer;
		white-space: nowrap;
		text-decoration: none;
		letter-spacing: -0.01em;
		font-family: var(--fb);
		transition: opacity 0.15s;
	}

	.btn-cta:hover {
		opacity: 0.9;
		color: var(--black);
	}

	@media (max-width: 900px) {
		.cta-inner { grid-template-columns: 1fr; }
	}
</style>
