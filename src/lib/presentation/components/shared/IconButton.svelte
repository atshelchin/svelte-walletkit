<script lang="ts">
	interface Props {
		icon: import('svelte').ComponentType;
		variant?: 'default' | 'primary' | 'success' | 'error' | 'warning';
		size?: 'sm' | 'md' | 'lg';
		title?: string;
		disabled?: boolean;
		onclick?: () => void;
		class?: string;
	}

	let {
		icon,
		variant = 'default',
		size = 'md',
		title,
		disabled = false,
		onclick,
		class: className = ''
	}: Props = $props();
</script>

<button
	{onclick}
	{disabled}
	{title}
	class="wk-icon-button wk-icon-button-{variant} wk-icon-button-{size} {className}"
>
	<svelte:component this={icon} class="wk-icon-button-icon" />
</button>

<style>
	.wk-icon-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--wk-radius-md);
		transition: var(--wk-transition-fast);
		cursor: pointer;
		border: none;
		background: transparent;
		color: var(--wk-color-text-secondary);
	}

	.wk-icon-button:hover:not(:disabled) {
		background-color: var(--wk-color-hover);
	}

	.wk-icon-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	/* Size variants */
	.wk-icon-button-sm {
		padding: 0.375rem;
	}

	.wk-icon-button-sm :global(.wk-icon-button-icon) {
		width: 0.875rem;
		height: 0.875rem;
	}

	.wk-icon-button-md {
		padding: 0.5rem;
	}

	.wk-icon-button-md :global(.wk-icon-button-icon) {
		width: 1rem;
		height: 1rem;
	}

	.wk-icon-button-lg {
		padding: 0.75rem;
	}

	.wk-icon-button-lg :global(.wk-icon-button-icon) {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Variant styles */
	.wk-icon-button-primary {
		color: var(--wk-color-primary);
	}

	.wk-icon-button-primary:hover:not(:disabled) {
		background-color: var(--wk-color-primary);
		color: var(--wk-color-button-text);
		opacity: 0.1;
	}

	.wk-icon-button-success {
		color: var(--wk-color-success);
	}

	.wk-icon-button-success:hover:not(:disabled) {
		background-color: var(--wk-color-success-light);
	}

	.wk-icon-button-error {
		color: var(--wk-color-error);
	}

	.wk-icon-button-error:hover:not(:disabled) {
		background-color: var(--wk-color-error-light);
	}

	.wk-icon-button-warning {
		color: var(--wk-color-warning);
	}

	.wk-icon-button-warning:hover:not(:disabled) {
		background-color: var(--wk-color-warning-light);
	}

	/* Mobile optimization */
	@media (max-width: 640px) {
		.wk-icon-button {
			min-width: 44px;
			min-height: 44px;
		}
	}
</style>
