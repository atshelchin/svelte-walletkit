<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { X } from '@lucide/svelte';
	import { onMount } from 'svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		title?: string;
		showCloseButton?: boolean;
		mobileBottomSheet?: boolean;
		maxWidth?: string;
		children?: import('svelte').Snippet;
	}

	let {
		isOpen,
		onClose,
		title,
		showCloseButton = true,
		mobileBottomSheet = true,
		maxWidth = '3xl',
		children
	}: Props = $props();

	let isMobile = $state(false);

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 640;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	// Handle escape key
	$effect(() => {
		if (isOpen) {
			const handleEscape = (e: KeyboardEvent) => {
				if (e.key === 'Escape') onClose();
			};
			document.addEventListener('keydown', handleEscape);
			return () => document.removeEventListener('keydown', handleEscape);
		}
	});

	// Prevent body scroll when modal is open
	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});
</script>

{#if isOpen}
	<div class="wk-modal-overlay" onclick={onClose} onkeydown={(e) => e.key === 'Escape' && onClose()} role="button" tabindex="-1" aria-label="Close modal" transition:fade={{ duration: 200 }}>
		<div
			class="wk-modal-content wk-modal-{maxWidth} {isMobile && mobileBottomSheet
				? 'wk-modal-bottom-sheet'
				: ''}"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.key === 'Escape' && onClose()}
			role="dialog"
			aria-modal="true"
			tabindex="0"
			transition:fly={{
				y: isMobile && mobileBottomSheet ? 300 : 0,
				duration: 300
			}}
		>
			{#if title || showCloseButton}
				<div class="wk-modal-header">
					{#if title}
						<h2 class="wk-modal-title">{title}</h2>
					{/if}
					{#if showCloseButton}
						<button onclick={onClose} class="wk-modal-close">
							<X class="wk-modal-close-icon" />
						</button>
					{/if}
				</div>
			{/if}

			<div class="wk-modal-body">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.wk-modal-overlay {
		position: fixed;
		inset: 0;
		background-color: var(--wk-color-background-overlay);
		z-index: var(--wk-z-modal);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--wk-spacing-md);
	}

	.wk-modal-content {
		background-color: var(--wk-color-modal-background);
		border-radius: var(--wk-radius-modal);
		box-shadow: var(--wk-shadow-modal);
		width: 100%;
		max-height: 90vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	/* Max width variants */
	.wk-modal-sm {
		max-width: 24rem;
	}
	.wk-modal-md {
		max-width: 32rem;
	}
	.wk-modal-lg {
		max-width: 48rem;
	}
	.wk-modal-xl {
		max-width: 64rem;
	}
	.wk-modal-2xl {
		max-width: 72rem;
	}
	.wk-modal-3xl {
		max-width: 80rem;
	}
	.wk-modal-full {
		max-width: 100%;
	}

	.wk-modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--wk-spacing-md);
		border-bottom: 1px solid var(--wk-color-border);
	}

	.wk-modal-title {
		font-size: var(--wk-font-size-xl);
		font-weight: 600;
		color: var(--wk-color-text);
	}

	.wk-modal-close {
		padding: var(--wk-spacing-xs);
		border-radius: var(--wk-radius-md);
		transition: var(--wk-transition-fast);
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--wk-color-text-secondary);
	}

	.wk-modal-close:hover {
		background-color: var(--wk-color-hover);
	}

	:global(.wk-modal-close-icon) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.wk-modal-body {
		flex: 1;
		overflow-y: auto;
		padding: var(--wk-spacing-md);
	}

	/* Mobile bottom sheet */
	@media (max-width: 640px) {
		.wk-modal-overlay {
			padding: 0;
			align-items: flex-end;
		}

		.wk-modal-bottom-sheet {
			max-width: 100%;
			width: 100%;
			max-height: 85vh;
			border-radius: var(--wk-radius-modal) var(--wk-radius-modal) 0 0;
		}

		.wk-modal-header {
			position: relative;
			padding-top: var(--wk-spacing-lg);
		}

		.wk-modal-header::before {
			content: '';
			position: absolute;
			top: 0.75rem;
			left: 50%;
			transform: translateX(-50%);
			width: 2.5rem;
			height: 0.25rem;
			background-color: var(--wk-color-border);
			border-radius: var(--wk-radius-full);
		}
	}
</style>
