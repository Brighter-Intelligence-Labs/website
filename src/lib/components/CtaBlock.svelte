<script>
	let { headline = "Ready to build a system that actually works?", subtext = "Book a free 30-minute discovery call. We'll discuss your workflows, challenges, and whether a bespoke AI system makes sense for your business.", ctaText = "Book a Discovery Call", ctaHref = "/contact" } = $props();
</script>

<section class="cta-section">
	<div class="container">
		<div class="cta-inner">
			<h2>{headline}</h2>
			<p>{subtext}</p>
			<a href={ctaHref} class="btn btn-primary btn-lg">{ctaText}</a>
		</div>
	</div>
</section>

<style>
	.cta-section {
		padding: var(--space-3xl) 0;
		background: var(--color-text);
		color: white;
	}

	.cta-inner {
		text-align: center;
		max-width: 640px;
		margin: 0 auto;
	}

	h2 {
		color: white;
		margin-bottom: var(--space-md);
	}

	p {
		color: #D1D5DB;
		font-size: var(--text-lg);
		line-height: 1.6;
		margin-bottom: var(--space-lg);
	}

	.btn-lg {
		padding: 1rem 2rem;
		font-size: var(--text-base);
	}
</style>
