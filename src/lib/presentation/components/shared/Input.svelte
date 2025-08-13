<script lang="ts">
	interface Props {
		type?: string;
		value?: string | number;
		placeholder?: string;
		disabled?: boolean;
		label?: string;
		error?: string;
		onInput?: (e: Event) => void;
		onBlur?: (e: Event) => void;
		class?: string;
	}

	let {
		type = 'text',
		value = $bindable(),
		placeholder = '',
		disabled = false,
		label,
		error,
		onInput,
		onBlur,
		class: className = ''
	}: Props = $props();
</script>

{#if label}
	<label class="wk-input-label">
		{label}
	</label>
{/if}
<input
	{type}
	bind:value
	{placeholder}
	{disabled}
	oninput={onInput}
	onblur={onBlur}
	class="wk-input {className}"
	class:wk-input-error={error}
/>
{#if error}
	<p class="wk-input-error-text">{error}</p>
{/if}

<style>
	.wk-input-label {
		display: block;
		font-size: var(--wk-font-size-xs);
		font-weight: 500;
		color: var(--wk-color-text-secondary);
		margin-bottom: 0.375rem;
	}

	.wk-input {
		width: 100%;
		padding: var(--wk-spacing-xs) var(--wk-spacing-sm);
		font-size: var(--wk-font-size-sm);
		border: 1px solid var(--wk-color-border);
		border-radius: var(--wk-radius-input);
		background-color: var(--wk-color-input-background);
		color: var(--wk-color-text);
		transition: var(--wk-transition-fast);
	}

	.wk-input:focus {
		outline: none;
		border-color: var(--wk-color-border-focus);
		box-shadow: 0 0 0 3px var(--wk-color-primary-light);
	}

	.wk-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: var(--wk-color-background-tertiary);
	}

	.wk-input-error {
		border-color: var(--wk-color-error);
	}

	.wk-input-error-text {
		color: var(--wk-color-error);
		font-size: var(--wk-font-size-xs);
		margin-top: 0.25rem;
	}

	/* Mobile optimization */
	@media (max-width: 640px) {
		.wk-input {
			min-height: 44px; /* Touch target size */
			font-size: 16px; /* Prevent zoom on iOS */
		}
	}
</style>
