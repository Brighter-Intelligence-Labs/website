<script lang="ts">
	import MessageList from './MessageList.svelte';
	import ChatInput from './ChatInput.svelte';

	type Message = {
		id: string;
		role: 'user' | 'assistant';
		content: string;
		streaming?: boolean;
	};

	let messages = $state<Message[]>([]);
	let isStreaming = $state(false);

	$effect(() => {
		fetch('/api/chat/history')
			.then((r) => r.json())
			.then(({ messages: history }) => {
				if (history?.length) {
					messages = history.map((m: { id: string; role: string; content: string }) => ({
						id: m.id,
						role: m.role as 'user' | 'assistant',
						content: m.content
					}));
				}
			});
	});

	async function sendMessage(text: string) {
		if (isStreaming) return;

		const userMessage: Message = {
			id: crypto.randomUUID(),
			role: 'user',
			content: text
		};
		messages = [...messages, userMessage];

		const assistantMessage: Message = {
			id: crypto.randomUUID(),
			role: 'assistant',
			content: '',
			streaming: true
		};
		messages = [...messages, assistantMessage];
		isStreaming = true;

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: text })
			});

			const reader = response.body!.getReader();
			const decoder = new TextDecoder();
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');
				buffer = lines.pop() ?? '';

				for (const line of lines) {
					if (!line.startsWith('data: ')) continue;
					const data = line.slice(6);
					if (data === '[DONE]') break;
					try {
						const { text: chunk, error } = JSON.parse(data);
						if (error) throw new Error(error);
						if (chunk) {
							messages = messages.map((m) =>
								m.id === assistantMessage.id
									? { ...m, content: m.content + chunk }
									: m
							);
						}
					} catch {
						// malformed SSE line
					}
				}
			}
		} finally {
			messages = messages.map((m) =>
				m.id === assistantMessage.id ? { ...m, streaming: false } : m
			);
			isStreaming = false;
		}
	}
</script>

<div class="chat-container">
	<div class="chat-header">
		<span class="chat-label">Ask anything about AI systems</span>
	</div>
	<MessageList {messages} />
	<ChatInput onSend={sendMessage} disabled={isStreaming} />
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 760px;
		margin: 0 auto;
		height: 520px;
		border: 1px solid var(--border);
		border-radius: 12px;
		overflow: hidden;
		background: var(--bg);
		box-shadow: var(--shadow);
	}

	.chat-header {
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--border);
		background: var(--bg);
	}

	.chat-label {
		font-family: var(--font-ui);
		font-size: 0.8rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
