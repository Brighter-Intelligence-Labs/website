<script>
	let { data } = $props();

	const formattedDate = new Date(data.meta.date).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
</script>

<svelte:head>
	<title>{data.meta.title} — Brighter Intelligence Labs</title>
	<meta name="description" content={data.meta.excerpt} />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.excerpt} />
	<meta property="og:type" content="article" />
</svelte:head>

<article class="article">
	<div class="container">
		<header class="article-header prose">
			<span class="tag">{data.meta.category}</span>
			<h1>{data.meta.title}</h1>
			<div class="article-meta">
				<span>{data.meta.author}</span>
				<span class="meta-sep">&middot;</span>
				<span>{formattedDate}</span>
				<span class="meta-sep">&middot;</span>
				<span>{data.meta.readTime} read</span>
			</div>
		</header>
		<div class="prose article-body">
			<data.content />
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
</style>
