<script>
	let { title, date, author, category, readTime, excerpt, children } = $props();

	const formattedDate = new Date(date).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
</script>

<svelte:head>
	<title>{title} — Brighter Intelligence Labs</title>
	<meta name="description" content={excerpt} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={excerpt} />
	<meta property="og:type" content="article" />
</svelte:head>

<article class="article">
	<div class="container">
		<header class="article-header prose">
			<span class="tag">{category}</span>
			<h1>{title}</h1>
			<div class="article-meta">
				<span>{author}</span>
				<span class="meta-sep">&middot;</span>
				<span>{formattedDate}</span>
				<span class="meta-sep">&middot;</span>
				<span>{readTime} read</span>
			</div>
		</header>
		<div class="prose article-body">
			{@render children()}
		</div>
	</div>
</article>

<style>
	.article {
		padding: var(--space-xl) 0 var(--space-3xl);
	}

	.article-header {
		margin-bottom: var(--space-xl);
	}

	.article-header h1 {
		margin-top: var(--space-sm);
		margin-bottom: var(--space-md);
		font-size: var(--text-3xl);
	}

	.article-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-muted);
		font-size: var(--text-sm);
	}

	.meta-sep {
		color: var(--color-border);
	}

	.article-body {
		font-size: var(--text-base);
	}
</style>
