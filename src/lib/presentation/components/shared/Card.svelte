<script lang="ts">
	interface Props {
		title?: string;
		icon?: import('svelte').ComponentType;
		iconColor?: 'primary' | 'success' | 'error' | 'warning' | 'info';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		title,
		icon,
		iconColor = 'primary',
		padding = 'md',
		class: className = '',
		children
	}: Props = $props();
</script>

<div class="wk-card wk-card-padding-{padding} {className}">
	{#if title || icon}
		<div class="wk-card-header">
			{#if icon}
				<div class="wk-card-icon wk-card-icon-{iconColor}">
					<svelte:component this={icon} class="wk-card-icon-svg" />
				</div>
			{/if}
			{#if title}
				<h4 class="wk-card-title">{title}</h4>
			{/if}
		</div>
	{/if}

	{#if children}
		<div class="wk-card-body">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.wk-card {
		background-color: var(--wk-color-background-secondary);
		border-radius: var(--wk-radius-lg);
		transition: var(--wk-transition-fast);
	}

	/* Padding variants */
	.wk-card-padding-none {
		padding: 0;
	}

	.wk-card-padding-sm {
		padding: var(--wk-spacing-sm);
	}

	.wk-card-padding-md {
		padding: var(--wk-spacing-md);
	}

	.wk-card-padding-lg {
		padding: var(--wk-spacing-lg);
	}

	.wk-card-header {
		display: flex;
		align-items: center;
		gap: var(--wk-spacing-xs);
		margin-bottom: var(--wk-spacing-sm);
	}

	.wk-card-icon {
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--wk-radius-md);
	}

	.wk-card-icon-primary {
		background-color: var(--wk-color-primary);
		opacity: 0.1;
	}

	.wk-card-icon-primary :global(.wk-card-icon-svg) {
		color: var(--wk-color-primary);
	}

	.wk-card-icon-success {
		background-color: var(--wk-color-success-light);
	}

	.wk-card-icon-success :global(.wk-card-icon-svg) {
		color: var(--wk-color-success);
	}

	.wk-card-icon-error {
		background-color: var(--wk-color-error-light);
	}

	.wk-card-icon-error :global(.wk-card-icon-svg) {
		color: var(--wk-color-error);
	}

	.wk-card-icon-warning {
		background-color: var(--wk-color-warning-light);
	}

	.wk-card-icon-warning :global(.wk-card-icon-svg) {
		color: var(--wk-color-warning);
	}

	.wk-card-icon-info {
		background-color: var(--wk-color-info-light);
	}

	.wk-card-icon-info :global(.wk-card-icon-svg) {
		color: var(--wk-color-info);
	}

	:global(.wk-card-icon-svg) {
		width: 1rem;
		height: 1rem;
	}

	.wk-card-title {
		font-weight: 500;
		color: var(--wk-color-text);
		font-size: var(--wk-font-size-base);
	}

	.wk-card-body {
		color: var(--wk-color-text);
	}

	/* Mobile optimization */
	@media (max-width: 640px) {
		.wk-card-padding-md {
			padding: var(--wk-spacing-sm);
		}

		.wk-card-padding-lg {
			padding: var(--wk-spacing-md);
		}
	}
</style>
