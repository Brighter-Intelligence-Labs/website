<script lang="ts">
	let { text }: { text: string } = $props();
</script>

<span class="streaming"
	>{text}<span class="cursor">&#9612;</span></span
>

<style>
	.streaming {
		font-family: var(--font-body);
		font-size: 0.92rem;
		line-height: 1.65;
		white-space: pre-wrap;
	}

	.cursor {
		display: inline-block;
		animation: blink 1s step-end infinite;
		color: var(--accent);
		margin-left: 1px;
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}
</style>
