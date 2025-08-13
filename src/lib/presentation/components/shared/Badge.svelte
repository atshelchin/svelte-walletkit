<script lang="ts">
	interface Props {
		variant?: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { variant = 'default', size = 'md', class: className = '', children }: Props = $props();
</script>

<span class="wk-badge wk-badge-{variant} wk-badge-{size} {className}">
	{#if children}
		{@render children()}
	{/if}
</span>

<style>
	.wk-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--wk-radius-md);
		font-weight: 500;
		transition: var(--wk-transition-fast);
	}

	/* Size variants */
	.wk-badge-sm {
		padding: 0.125rem 0.5rem;
		font-size: var(--wk-font-size-xs);
	}

	.wk-badge-md {
		padding: 0.25rem 0.75rem;
		font-size: var(--wk-font-size-sm);
	}

	.wk-badge-lg {
		padding: 0.375rem 1rem;
		font-size: var(--wk-font-size-base);
	}

	/* Variant styles */
	.wk-badge-default {
		background-color: var(--wk-color-background-tertiary);
		color: var(--wk-color-text-secondary);
	}

	.wk-badge-primary {
		background-color: var(--wk-color-primary);
		color: var(--wk-color-button-text);
		opacity: 0.9;
	}

	.wk-badge-success {
		background-color: var(--wk-color-success-light);
		color: var(--wk-color-success);
	}

	.wk-badge-error {
		background-color: var(--wk-color-error-light);
		color: var(--wk-color-error);
	}

	.wk-badge-warning {
		background-color: var(--wk-color-warning-light);
		color: var(--wk-color-warning);
	}

	.wk-badge-info {
		background-color: var(--wk-color-info-light);
		color: var(--wk-color-info);
	}
</style>
