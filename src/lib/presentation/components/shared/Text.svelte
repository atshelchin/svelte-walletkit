<script lang="ts">
	import type { Snippet } from 'svelte';
	
	type Variant = 'body' | 'body-small' | 'caption' | 'label' | 'muted';

	interface Props {
		variant?: Variant;
		class?: string;
		as?: 'p' | 'span' | 'div' | 'label';
		children: Snippet;
	}

	let { variant = 'body', class: className = '', as = 'p', children }: Props = $props();

	// 统一的文本样式 - 暗色模式使用柔和的颜色
	const styles = {
		body: 'text-base text-slate-700 dark:text-slate-300',
		'body-small': 'text-sm text-slate-600 dark:text-slate-400',
		caption: 'text-xs text-slate-500 dark:text-slate-500',
		label: 'text-sm font-medium text-slate-700 dark:text-slate-300',
		muted: 'text-sm text-slate-500 dark:text-slate-400'
	};

	const baseStyles = styles[variant];
	const combinedClass = `${baseStyles} ${className}`.trim();
</script>

<svelte:element this={as} class={combinedClass}>
	{@render children()}
</svelte:element>
