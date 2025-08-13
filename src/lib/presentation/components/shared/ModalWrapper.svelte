<script lang="ts">
	interface Props {
		isOpen: boolean;
		onClose?: () => void;
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
		class?: string;
	}

	let { isOpen, onClose, maxWidth = 'md', class: className = '' }: Props = $props();

	const maxWidthClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl',
		'3xl': 'max-w-3xl'
	};

	function handleBackdropClick() {
		onClose?.();
	}

	function handleContentClick(e: MouseEvent) {
		e.stopPropagation();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose?.();
		}
	}
</script>

{#if isOpen}
	<!-- 统一的遮罩层 - 80% 不透明度，带模糊效果 -->
	<div
		class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
		onclick={handleBackdropClick}
		onkeydown={handleKeyDown}
		role="button"
		tabindex="-1"
		aria-label="Close modal"
	></div>

	<!-- 内容容器 -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div
			class="w-full {maxWidthClasses[
				maxWidth
			]} rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-700/50 {className}"
			onclick={handleContentClick}
			role="dialog"
			aria-modal="true"
		>
			<slot />
		</div>
	</div>
{/if}
