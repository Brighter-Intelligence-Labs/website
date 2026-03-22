<script lang="ts">
	import StreamingText from './StreamingText.svelte';

	type Message = { id: string; role: 'user' | 'assistant'; content: string; streaming?: boolean };
	let { message }: { message: Message } = $props();

	function renderMarkdown(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.+?)\*/g, '<em>$1</em>')
			.replace(/`(.+?)`/g, '<code>$1</code>')
			.replace(
				/\[(.+?)\]\((.+?)\)/g,
				'<a href="$2" target="_blank" rel="noopener">$1</a>'
			)
			.replace(/\n/g, '<br>');
	}
</script>

<div class="bubble-wrapper" class:user={message.role === 'user'}>
	<div
		class="bubble"
		class:user={message.role === 'user'}
		class:assistant={message.role === 'assistant'}
	>
		{#if message.streaming}
			<StreamingText text={message.content} />
		{:else}
			<div class="content">{@html renderMarkdown(message.content)}</div>
		{/if}
	</div>
</div>

<style>
	.bubble-wrapper {
		display: flex;
		justify-content: flex-start;
	}

	.bubble-wrapper.user {
		justify-content: flex-end;
	}

	.bubble {
		max-width: 78%;
		padding: var(--space-3) var(--space-4);
		border-radius: 12px;
		font-family: var(--font-body);
		font-size: 0.92rem;
		line-height: 1.65;
	}

	.bubble.user {
		background: var(--accent);
		color: #fff;
		border-bottom-right-radius: 4px;
	}

	.bubble.assistant {
		background: var(--surface-2);
		color: var(--text-primary);
		border-bottom-left-radius: 4px;
	}

	.content :global(a) {
		color: var(--accent);
		text-decoration: underline;
	}

	.content :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		background: rgba(0, 0, 0, 0.08);
		padding: 0.1em 0.35em;
		border-radius: 3px;
	}
</style>
