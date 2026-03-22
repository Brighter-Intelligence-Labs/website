<script lang="ts">
	import { theme } from '$lib/stores/theme'
	import { onMount } from 'svelte'

	$: isDark = $theme === 'dark' || (
		$theme === 'auto' &&
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-color-scheme: dark)').matches
	)

	function toggle() {
		theme.set(isDark ? 'light' : 'dark')
	}

	onMount(() => theme.init())
</script>

<button
	class="theme-toggle"
	on:click={toggle}
	aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
	title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if isDark}
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.3"/>
			<line x1="8" y1="1" x2="8" y2="2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
			<line x1="8" y1="13.5" x2="8" y2="15" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
			<line x1="1" y1="8" x2="2.5" y2="8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
			<line x1="13.5" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
			<line x1="2.93" y1="2.93" x2="4.01" y2="4.01" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
			<line x1="11.99" y1="11.99" x2="13.07" y2="13.07" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
			<line x1="2.93" y1="13.07" x2="4.01" y2="11.99" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
			<line x1="11.99" y1="4.01" x2="13.07" y2="2.93" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
		</svg>
	{:else}
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M13.5 10.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 8 8z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 6px;
		border: 0.5px solid var(--border, #e2ddd8);
		background: transparent;
		color: var(--muted, #b0aaa4);
		cursor: pointer;
		transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
		flex-shrink: 0;
	}

	.theme-toggle:hover {
		color: var(--text-primary, #1a1a1a);
		border-color: var(--text-primary, #1a1a1a);
		background: transparent;
	}
</style>
