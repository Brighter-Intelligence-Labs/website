<script lang="ts">
	let { data } = $props();

	const formattedDate = new Date(data.meta.date).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});

	// Simple markdown-to-HTML renderer for article content stored in Supabase
	function renderMarkdown(md: string) {
		return md
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/^### (.+)$/gm, '<h3>$1</h3>')
			.replace(/^## (.+)$/gm, '<h2>$1</h2>')
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.+?)\*/g, '<em>$1</em>')
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
			.replace(/\n\n/g, '</p><p>')
			.replace(/^/, '<p>')
			.replace(/$/, '</p>')
			.replace(/<p><h([23])>/g, '<h$1>')
			.replace(/<\/h([23])><\/p>/g, '</h$1>');
	}
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
		<header class="article-header">
			<div class="tag">{data.meta.category}</div>
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
			{@html renderMarkdown(data.articleContent)}
		</div>
	</div>
</article>

<style>
	.article {
		padding: var(--section-padding-y) 0;
	}

	.article-header {
		max-width: var(--max-width-prose);
		margin-bottom: var(--space-12);
	}

	.article-header h1 {
		margin-top: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.article-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--text-muted);
		font-size: var(--text-xs);
		font-weight: 400;
	}

	.meta-sep {
		color: var(--border);
	}

	.article-body {
		max-width: var(--max-width-prose);
	}
</style>
