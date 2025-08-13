<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeTheme } from './infrastructure/theme/initTheme.js';
	import type { ThemeConfig } from './domain/types/ThemeTypes.js';

	interface Props {
		theme?: ThemeConfig;
		children?: import('svelte').Snippet;
	}

	let { theme, children }: Props = $props();

	onMount(() => {
		// Initialize theme on mount
		initializeTheme(theme);
	});

	// Re-initialize theme if config changes
	$effect(() => {
		if (theme) {
			initializeTheme(theme);
		}
	});
</script>

<!-- WalletKit wrapper component that provides theme context -->
<div class="walletkit-root">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.walletkit-root {
		/* Ensure theme variables are scoped properly */
		color: var(--wk-color-text);
		font-family: var(--wk-font-base);
		font-size: var(--wk-font-size-base);
	}
</style>
