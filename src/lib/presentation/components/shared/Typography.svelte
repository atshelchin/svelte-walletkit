<script lang="ts" context="module">
	export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	export type TextVariant = 'body' | 'body-small' | 'caption' | 'label';
</script>

<script lang="ts">
	interface HeadingProps {
		level?: HeadingLevel;
		class?: string;
		children?: any;
	}

	interface TextProps {
		variant?: TextVariant;
		class?: string;
		children?: any;
	}

	// Heading styles - 使用柔和的暗色模式颜色
	const headingStyles = {
		h1: 'text-3xl font-bold text-slate-900 dark:text-slate-100',
		h2: 'text-2xl font-semibold text-slate-900 dark:text-slate-200',
		h3: 'text-xl font-semibold text-slate-900 dark:text-slate-200',
		h4: 'text-lg font-medium text-slate-900 dark:text-slate-300',
		h5: 'text-base font-medium text-slate-800 dark:text-slate-300',
		h6: 'text-sm font-medium text-slate-700 dark:text-slate-400'
	};

	// Text styles
	const textStyles = {
		body: 'text-base text-slate-700 dark:text-slate-300',
		'body-small': 'text-sm text-slate-600 dark:text-slate-400',
		caption: 'text-xs text-slate-500 dark:text-slate-500',
		label: 'text-sm font-medium text-slate-700 dark:text-slate-300'
	};

	export function Heading(props: HeadingProps) {
		const { level = 'h2', class: className = '', children } = props;
		const Element = level;
		const baseStyles = headingStyles[level];
		const combinedClass = `${baseStyles} ${className}`.trim();

		return {
			Element,
			combinedClass,
			children
		};
	}

	export function Text(props: TextProps) {
		const { variant = 'body', class: className = '', children } = props;
		const baseStyles = textStyles[variant];
		const combinedClass = `${baseStyles} ${className}`.trim();

		return {
			combinedClass,
			children
		};
	}
</script>

<!-- Export individual components for easy use -->

<!-- Heading Components -->
<script lang="ts" context="module">
	// H1 - Page titles
	export function H1({ class: className = '', children, ...props }: any) {
		const styles = `${headingStyles.h1} ${className}`.trim();
		return { as: 'h1', class: styles, children, ...props };
	}

	// H2 - Section titles
	export function H2({ class: className = '', children, ...props }: any) {
		const styles = `${headingStyles.h2} ${className}`.trim();
		return { as: 'h2', class: styles, children, ...props };
	}

	// H3 - Subsection titles
	export function H3({ class: className = '', children, ...props }: any) {
		const styles = `${headingStyles.h3} ${className}`.trim();
		return { as: 'h3', class: styles, children, ...props };
	}

	// H4 - Card titles
	export function H4({ class: className = '', children, ...props }: any) {
		const styles = `${headingStyles.h4} ${className}`.trim();
		return { as: 'h4', class: styles, children, ...props };
	}

	// H5 - Small headings
	export function H5({ class: className = '', children, ...props }: any) {
		const styles = `${headingStyles.h5} ${className}`.trim();
		return { as: 'h5', class: styles, children, ...props };
	}

	// H6 - Smallest headings
	export function H6({ class: className = '', children, ...props }: any) {
		const styles = `${headingStyles.h6} ${className}`.trim();
		return { as: 'h6', class: styles, children, ...props };
	}

	// Text Components
	export function Body({ class: className = '', children, ...props }: any) {
		const styles = `${textStyles.body} ${className}`.trim();
		return { as: 'p', class: styles, children, ...props };
	}

	export function BodySmall({ class: className = '', children, ...props }: any) {
		const styles = `${textStyles['body-small']} ${className}`.trim();
		return { as: 'p', class: styles, children, ...props };
	}

	export function Caption({ class: className = '', children, ...props }: any) {
		const styles = `${textStyles.caption} ${className}`.trim();
		return { as: 'span', class: styles, children, ...props };
	}

	export function Label({ class: className = '', children, ...props }: any) {
		const styles = `${textStyles.label} ${className}`.trim();
		return { as: 'label', class: styles, children, ...props };
	}
</script>

<!-- Usage Example Component -->
{#if $$slots.default}
	<slot />
{/if}