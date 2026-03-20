<script>
	let { headline, subline, ctaText = 'Book a Discovery Call', ctaHref = '/contact', image = '' } = $props();
</script>

<section class="hero">
	<div class="container hero-inner">
		<div class="hero-content">
			<h1>{headline}</h1>
			<p class="hero-subline">{subline}</p>
			<div class="hero-actions">
				<a href={ctaHref} class="btn btn-primary">{ctaText}</a>
				<a href="/insights" class="btn btn-secondary">Read Our Insights</a>
			</div>
		</div>
		{#if image}
			<div class="hero-image">
				<img src={image} alt="Team collaborating on AI system architecture" loading="eager" />
			</div>
		{/if}
	</div>
</section>

<style>
	.hero {
		padding: var(--space-3xl) 0;
		background: var(--color-surface);
	}

	.hero-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-xl);
		align-items: center;
	}

	.hero-content h1 {
		margin-bottom: var(--space-md);
	}

	.hero-subline {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin-bottom: var(--space-lg);
		max-width: 540px;
	}

	.hero-actions {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	.hero-image {
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.hero-image img {
		width: 100%;
		height: 400px;
		object-fit: cover;
	}

	@media (max-width: 768px) {
		.hero-inner {
			grid-template-columns: 1fr;
		}

		.hero-image {
			order: -1;
		}

		.hero-image img {
			height: 280px;
		}
	}
</style>
