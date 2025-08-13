<script lang="ts">
	import { Loader2 } from '@lucide/svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		loading?: boolean;
		icon?: import('svelte').ComponentType;
		onclick?: () => void;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		icon,
		onclick,
		class: className = '',
		children
	}: Props = $props();

	const isDisabled = $derived(disabled || loading);
</script>

<button
	{onclick}
	disabled={isDisabled}
	class="wk-button wk-button-{variant} wk-button-{size} {className}"
>
	{#if loading}
		<Loader2 class="wk-button-icon animate-spin" />
	{:else if icon}
		<svelte:component this={icon} class="wk-button-icon" />
	{/if}
	{#if children}
		{@render children()}
	{/if}
</button>

<style>
	.wk-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--wk-spacing-xs);
		border-radius: var(--wk-radius-button);
		font-weight: 500;
		transition: var(--wk-transition-fast);
		cursor: pointer;
		border: none;
		outline: none;
	}

	.wk-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Sizes */
	.wk-button-sm {
		padding: 0.375rem 0.75rem;
		font-size: var(--wk-font-size-sm);
	}

	.wk-button-md {
		padding: 0.5rem 1rem;
		font-size: var(--wk-font-size-base);
	}

	.wk-button-lg {
		padding: 0.75rem 1.5rem;
		font-size: var(--wk-font-size-lg);
	}

	/* Variants */
	.wk-button-primary {
		background-color: var(--wk-color-primary);
		color: var(--wk-color-button-text);
	}

	.wk-button-primary:hover:not(:disabled) {
		background-color: var(--wk-color-primary-hover);
	}

	.wk-button-secondary {
		background-color: transparent;
		color: var(--wk-color-text);
		border: 1px solid var(--wk-color-border);
	}

	.wk-button-secondary:hover:not(:disabled) {
		background-color: var(--wk-color-hover);
	}

	.wk-button-danger {
		background-color: var(--wk-color-error);
		color: white;
	}

	.wk-button-danger:hover:not(:disabled) {
		background-color: var(--wk-color-error-dark);
	}

	.wk-button-ghost {
		background-color: transparent;
		color: var(--wk-color-text-secondary);
	}

	.wk-button-ghost:hover:not(:disabled) {
		background-color: var(--wk-color-hover);
		color: var(--wk-color-text);
	}

	:global(.wk-button-icon) {
		width: 1rem;
		height: 1rem;
	}

	/* Mobile optimization */
	@media (max-width: 640px) {
		.wk-button {
			min-height: 44px; /* Touch target size */
		}

		.wk-button-sm {
			min-height: 40px;
		}
	}
</style>
