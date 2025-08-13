<script lang="ts">
	import type { Snippet } from 'svelte';

	type Level = 1 | 2 | 3 | 4 | 5 | 6;

	interface Props {
		level?: Level;
		class?: string;
		children: Snippet;
	}

	let { level = 2, class: className = '', children }: Props = $props();

	// 统一的标题样式 - 暗色模式使用柔和的颜色
	const styles = {
		1: 'text-3xl font-bold text-slate-900 dark:text-slate-100',
		2: 'text-2xl font-semibold text-slate-900 dark:text-slate-200',
		3: 'text-xl font-semibold text-slate-900 dark:text-slate-200',
		4: 'text-lg font-medium text-slate-900 dark:text-slate-300',
		5: 'text-base font-medium text-slate-800 dark:text-slate-300',
		6: 'text-sm font-medium text-slate-700 dark:text-slate-400'
	};

	const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	const baseStyles = styles[level];
	const combinedClass = `${baseStyles} ${className}`.trim();
</script>

<svelte:element this={Tag} class={combinedClass}>
	{@render children()}
</svelte:element>
