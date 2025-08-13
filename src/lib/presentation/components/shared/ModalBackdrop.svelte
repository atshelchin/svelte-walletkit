<script lang="ts">
	interface Props {
		isOpen?: boolean;
		onClose?: () => void;
		zIndex?: number;
	}

	let { isOpen = false, onClose, zIndex = 50 }: Props = $props();
</script>

{#if isOpen}
	<!-- 统一的遮罩层样式 - 80% 不透明度，带模糊效果 -->
	<div
		class="fixed inset-0 bg-black/80 backdrop-blur-md"
		style="z-index: {zIndex}"
		onclick={onClose}
		role="button"
		tabindex="-1"
		onkeydown={(e) => e.key === 'Escape' && onClose?.()}
	></div>

	<!-- 内容容器 -->
	<div class="fixed inset-0 flex items-center justify-center p-4" style="z-index: {zIndex}">
		<slot />
	</div>
{/if}
