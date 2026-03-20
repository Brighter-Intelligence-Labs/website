<script lang="ts">
	let {
		onSend,
		disabled = false
	}: {
		onSend: (text: string) => void;
		disabled?: boolean;
	} = $props();

	let inputValue = $state('');

	function handleSubmit() {
		const text = inputValue.trim();
		if (!text || disabled) return;
		inputValue = '';
		onSend(text);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}
</script>

<div class="input-area">
	<textarea
		bind:value={inputValue}
		onkeydown={handleKeydown}
		placeholder="Ask about AI systems, workflows, or how we can help…"
		rows="1"
		{disabled}
		class:disabled
	></textarea>
	<button onclick={handleSubmit} {disabled} class:disabled aria-label="Send message">
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<line x1="22" y1="2" x2="11" y2="13"></line>
			<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
		</svg>
	</button>
</div>

<style>
	.input-area {
		display: flex;
		align-items: flex-end;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-top: 1px solid var(--border);
		background: var(--bg);
	}

	textarea {
		flex: 1;
		resize: none;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0.6rem 0.8rem;
		font-family: var(--font-body);
		font-size: 0.92rem;
		line-height: 1.5;
		background: var(--white);
		color: var(--text-primary);
		max-height: 120px;
		overflow-y: auto;
		transition: border-color 0.15s;
	}

	textarea:focus {
		outline: none;
		border-color: var(--accent);
	}

	button {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		border-radius: 8px;
		background: var(--accent);
		color: #fff;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.15s;
	}

	button:hover:not(.disabled) {
		opacity: 0.85;
	}

	button.disabled,
	textarea.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
