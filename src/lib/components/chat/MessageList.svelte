<script lang="ts">
	import MessageBubble from './MessageBubble.svelte';

	type Message = { id: string; role: 'user' | 'assistant'; content: string; streaming?: boolean };
	let { messages }: { messages: Message[] } = $props();

	let listEl = $state<HTMLElement>();

	$effect(() => {
		messages;
		if (listEl) {
			listEl.scrollTop = listEl.scrollHeight;
		}
	});
</script>

<div class="message-list" bind:this={listEl}>
	{#if messages.length === 0}
		<div class="empty-state">
			<p>What are you working on? Ask about AI workflows, agent systems, or how we can help.</p>
		</div>
	{/if}
	{#each messages as message (message.id)}
		<MessageBubble {message} />
	{/each}
</div>

<style>
	.message-list {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		scroll-behavior: smooth;
	}

	.empty-state {
		text-align: center;
		color: var(--text-secondary);
		font-family: var(--font-body);
		font-size: 0.9rem;
		margin: auto;
		max-width: 380px;
		line-height: 1.6;
	}
</style>
