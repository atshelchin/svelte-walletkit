<script lang="ts">
	import { Palette, Sun, Moon, Download, Upload, Code, X } from '@lucide/svelte';
	import type { WalletKitTheme } from '$lib/domain/types/ThemeTypes.js';

	interface Props {
		isOpen?: boolean;
		onClose?: () => void;
		onThemeChange?: (theme: Partial<WalletKitTheme>) => void;
	}

	let { isOpen = false, onClose, onThemeChange }: Props = $props();

	let activeTab = $state<'colors' | 'typography' | 'spacing' | 'effects'>('colors');
	let currentMode = $state<'light' | 'dark'>('light');
	let showPreview = $state(true);
	let showCode = $state(false);

	// Theme state
	let customTheme = $state<WalletKitTheme>({
		colors: {
			primary: '#6366f1',
			primaryDark: '#4f46e5',
			primaryLight: '#818cf8',
			primaryHover: '#4f46e5',
			primaryActive: '#4338ca',
			secondary: '#8b5cf6',
			background: '#ffffff',
			backgroundSecondary: '#f9fafb',
			backgroundTertiary: '#f3f4f6',
			backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
			text: '#111827',
			textSecondary: '#6b7280',
			textTertiary: '#9ca3af',
			textInverse: '#ffffff',
			border: '#e5e7eb',
			borderLight: '#f3f4f6',
			borderFocus: '#6366f1',
			success: '#10b981',
			successLight: '#d1fae5',
			error: '#ef4444',
			errorLight: '#fee2e2',
			warning: '#f59e0b',
			warningLight: '#fef3c7',
			info: '#3b82f6',
			infoLight: '#dbeafe',
			modalBackground: '#ffffff',
			dropdownBackground: '#ffffff',
			inputBackground: '#ffffff',
			buttonBackground: '#6366f1',
			buttonText: '#ffffff',
			hover: '#f3f4f6',
			active: '#e5e7eb',
			disabled: '#9ca3af'
		},
		radius: {
			none: '0',
			sm: '0.25rem',
			md: '0.5rem',
			lg: '0.75rem',
			xl: '1rem',
			full: '9999px',
			button: '0.75rem',
			input: '0.75rem',
			card: '1rem',
			modal: '1.5rem',
			dropdown: '0.5rem'
		},
		spacing: {
			xs: '0.25rem',
			sm: '0.5rem',
			md: '1rem',
			lg: '1.5rem',
			xl: '2rem'
		},
		shadows: {
			none: 'none',
			sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
			md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
			lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
			xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
			dropdown: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
			modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
			button: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
		},
		fonts: {
			base: 'Inter, system-ui, sans-serif',
			mono: 'ui-monospace, monospace'
		},
		fontSizes: {
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem'
		},
		transitions: {
			fast: '150ms ease',
			base: '250ms ease',
			slow: '500ms ease'
		},
		zIndex: {
			dropdown: 100,
			modal: 200,
			tooltip: 300,
			notification: 400
		}
	});

	// Preset themes
	const presetThemes = [
		{
			name: 'WalletKit Default',
			id: 'default',
			primary: '#6366f1',
			secondary: '#8b5cf6',
			accent: '#ec4899'
		},
		{
			name: 'Ocean Blue',
			id: 'ocean',
			primary: '#0ea5e9',
			secondary: '#06b6d4',
			accent: '#14b8a6'
		},
		{
			name: 'Sunset',
			id: 'sunset',
			primary: '#f97316',
			secondary: '#fb923c',
			accent: '#fbbf24'
		},
		{
			name: 'Forest',
			id: 'forest',
			primary: '#16a34a',
			secondary: '#22c55e',
			accent: '#84cc16'
		},
		{
			name: 'Purple Dream',
			id: 'purple',
			primary: '#9333ea',
			secondary: '#a855f7',
			accent: '#c084fc'
		},
		{
			name: 'Minimal',
			id: 'minimal',
			primary: '#000000',
			secondary: '#374151',
			accent: '#6b7280'
		}
	];

	// Apply theme changes
	function applyTheme() {
		if (onThemeChange) {
			onThemeChange(customTheme);
		}
		// Apply to CSS variables
		updateCSSVariables();
	}

	function updateCSSVariables() {
		const root = document.documentElement;

		// Update color variables
		if (customTheme.colors) {
			Object.entries(customTheme.colors).forEach(([key, value]) => {
				root.style.setProperty(`--wk-color-${kebabCase(key)}`, value);
			});
		}

		// Update radius variables
		if (customTheme.radius) {
			Object.entries(customTheme.radius).forEach(([key, value]) => {
				root.style.setProperty(`--wk-radius-${kebabCase(key)}`, value);
			});
		}

		// Update spacing variables
		if (customTheme.spacing) {
			Object.entries(customTheme.spacing).forEach(([key, value]) => {
				root.style.setProperty(`--wk-spacing-${key}`, value);
			});
		}

		// Update shadow variables
		if (customTheme.shadows) {
			Object.entries(customTheme.shadows).forEach(([key, value]) => {
				root.style.setProperty(`--wk-shadow-${key}`, value);
			});
		}
	}

	function kebabCase(str: string): string {
		return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
	}

	// Export theme configuration
	function exportTheme() {
		const themeConfig = {
			name: 'Custom Theme',
			version: '1.0.0',
			theme: customTheme
		};

		const blob = new Blob([JSON.stringify(themeConfig, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'walletkit-theme.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	// Import theme configuration
	function importTheme(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const config = JSON.parse(e.target?.result as string);
					if (config.theme) {
						customTheme = { ...customTheme, ...config.theme };
						applyTheme();
					}
				} catch (error) {
					console.error('Failed to import theme:', error);
				}
			};
			reader.readAsText(file);
		}
	}

	// Generate theme code
	function generateThemeCode(): string {
		return `// WalletKit Custom Theme Configuration
import type { WalletKitTheme } from '@shelchin/svelte-walletkit';

export const customTheme: Partial<WalletKitTheme> = ${JSON.stringify(customTheme, null, 2)};

// Usage:
// import { WalletKit } from '@shelchin/svelte-walletkit';
// import { customTheme } from './theme';
// 
// <WalletKit theme={customTheme} />`;
	}

	// Apply preset theme
	function applyPreset(preset: (typeof presetThemes)[0]) {
		customTheme.colors = {
			...customTheme.colors,
			primary: preset.primary,
			primaryDark: adjustColor(preset.primary, -20),
			primaryLight: adjustColor(preset.primary, 20),
			secondary: preset.secondary,
			secondaryDark: adjustColor(preset.secondary, -20),
			secondaryLight: adjustColor(preset.secondary, 20)
		};
		applyTheme();
	}

	// Color adjustment helper
	function adjustColor(color: string, amount: number): string {
		const num = parseInt(color.replace('#', ''), 16);
		const r = Math.max(0, Math.min(255, (num >> 16) + amount));
		const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
		const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
		return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
	}

	// Live preview components
	// Removed unused PreviewButton function - functionality is now inline in the template
</script>

{#if isOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-black/60 backdrop-blur"
		onclick={onClose}
		onkeydown={(e) => e.key === 'Escape' && onClose?.()}
		role="button"
		tabindex="-1"
		aria-label="Close theme customizer"
	></div>

	<!-- Customizer Panel -->
	<div
		class="fixed top-0 right-0 z-50 h-full w-[480px] overflow-hidden bg-white shadow-2xl dark:bg-gray-900"
	>
		<!-- Header -->
		<div
			class="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 dark:border-gray-700"
		>
			<div class="flex items-center gap-3">
				<Palette class="h-5 w-5 text-white" />
				<h2 class="text-lg font-semibold text-white">Theme Customizer</h2>
			</div>
			<div class="flex items-center gap-2">
				<button
					onclick={() => (currentMode = currentMode === 'light' ? 'dark' : 'light')}
					class="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
				>
					{#if currentMode === 'light'}
						<Sun class="h-4 w-4" />
					{:else}
						<Moon class="h-4 w-4" />
					{/if}
				</button>
				<button
					onclick={onClose}
					class="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
				>
					<X class="h-4 w-4" />
				</button>
			</div>
		</div>

		<!-- Tabs -->
		<div class="flex border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
			{#each ['colors', 'typography', 'spacing', 'effects'] as const as tab (tab)}
				<button
					onclick={() => (activeTab = tab as typeof activeTab)}
					class="flex-1 px-4 py-3 text-sm font-medium transition-colors {activeTab === tab
						? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
						: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'}"
				>
					{tab.charAt(0).toUpperCase() + tab.slice(1)}
				</button>
			{/each}
		</div>

		<!-- Content -->
		<div class="flex-1 overflow-y-auto p-6">
			{#if activeTab === 'colors'}
				<!-- Preset Themes -->
				<div class="mb-6">
					<h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Preset Themes</h3>
					<div class="grid grid-cols-3 gap-2">
						{#each presetThemes as preset (preset.name)}
							<button
								onclick={() => applyPreset(preset)}
								class="group relative overflow-hidden rounded-lg border border-gray-200 p-3 transition-all hover:shadow-md dark:border-gray-700"
							>
								<div class="mb-2 flex gap-1">
									<div class="h-4 w-4 rounded" style="background: {preset.primary}"></div>
									<div class="h-4 w-4 rounded" style="background: {preset.secondary}"></div>
									<div class="h-4 w-4 rounded" style="background: {preset.accent}"></div>
								</div>
								<div class="text-xs font-medium text-gray-700 dark:text-gray-300">
									{preset.name}
								</div>
							</button>
						{/each}
					</div>
				</div>

				<!-- Color Inputs -->
				<div class="space-y-4">
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Brand Colors</h3>

					{#each Object.entries(customTheme.colors || {}).slice(0, 6) as [key, value] (key)}
						<div class="flex items-center justify-between">
							<label for="color-{key}" class="text-sm text-gray-600 dark:text-gray-400">
								{key.replace(/([A-Z])/g, ' $1').trim()}
							</label>
							<div class="flex items-center gap-2">
								<input
									id="color-{key}"
									type="color"
									{value}
									oninput={(e) => {
										if (customTheme.colors) {
											(customTheme.colors as Record<string, string>)[key] = e.currentTarget.value;
											applyTheme();
										}
									}}
									class="h-8 w-8 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
								/>
								<input
									type="text"
									{value}
									oninput={(e) => {
										if (customTheme.colors) {
											(customTheme.colors as Record<string, string>)[key] = e.currentTarget.value;
											applyTheme();
										}
									}}
									class="w-24 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-800"
								/>
							</div>
						</div>
					{/each}
				</div>
			{:else if activeTab === 'typography'}
				<div class="space-y-4">
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Font Sizes</h3>
					{#each Object.entries(customTheme.fontSizes || {}) as [key, value] (key)}
						<div class="flex items-center justify-between">
							<label for="fontSize-{key}" class="text-sm text-gray-600 dark:text-gray-400"
								>{key}</label
							>
							<input
								id="fontSize-{key}"
								type="text"
								{value}
								oninput={(e) => {
									if (customTheme.fontSizes) {
										(customTheme.fontSizes as Record<string, string>)[key] = e.currentTarget.value;
										applyTheme();
									}
								}}
								class="w-24 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-800"
							/>
						</div>
					{/each}
				</div>
			{:else if activeTab === 'spacing'}
				<div class="space-y-4">
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Spacing Scale</h3>
					{#each Object.entries(customTheme.spacing || {}) as [key, value] (key)}
						<div class="flex items-center justify-between">
							<label for="spacing-{key}" class="text-sm text-gray-600 dark:text-gray-400"
								>{key}</label
							>
							<div class="flex items-center gap-2">
								<div class="bg-indigo-500" style="width: {value}; height: 1rem;"></div>
								<input
									id="spacing-{key}"
									type="text"
									{value}
									oninput={(e) => {
										if (customTheme.spacing) {
											(customTheme.spacing as Record<string, string>)[key] = e.currentTarget.value;
											applyTheme();
										}
									}}
									class="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-800"
								/>
							</div>
						</div>
					{/each}

					<h3 class="mt-6 text-sm font-medium text-gray-700 dark:text-gray-300">Border Radius</h3>
					{#each Object.entries(customTheme.radius || {}) as [key, value] (key)}
						<div class="flex items-center justify-between">
							<label for="radius-{key}" class="text-sm text-gray-600 dark:text-gray-400"
								>{key}</label
							>
							<div class="flex items-center gap-2">
								<div class="h-8 w-8 bg-indigo-500" style="border-radius: {value};"></div>
								<input
									id="radius-{key}"
									type="text"
									{value}
									oninput={(e) => {
										if (customTheme.radius) {
											(customTheme.radius as Record<string, string>)[key] = e.currentTarget.value;
											applyTheme();
										}
									}}
									class="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-800"
								/>
							</div>
						</div>
					{/each}
				</div>
			{:else if activeTab === 'effects'}
				<div class="space-y-4">
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Shadows</h3>
					{#each Object.entries(customTheme.shadows || {}) as [key, value] (key)}
						<div class="space-y-2">
							<label for="shadow-{key}" class="text-sm text-gray-600 dark:text-gray-400"
								>{key}</label
							>
							<div
								class="h-12 w-full rounded-lg bg-white dark:bg-gray-800"
								style="box-shadow: {value};"
							></div>
							<input
								id="shadow-{key}"
								type="text"
								{value}
								oninput={(e) => {
									if (customTheme.shadows) {
										(customTheme.shadows as Record<string, string>)[key] = e.currentTarget.value;
										applyTheme();
									}
								}}
								class="w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-800"
							/>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Preview Section -->
		{#if showPreview}
			<div class="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
				<div class="mb-3 flex items-center justify-between">
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Live Preview</h3>
					<button
						onclick={() => (showCode = !showCode)}
						class="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
					>
						<Code class="h-4 w-4" />
					</button>
				</div>

				{#if showCode}
					<pre class="overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-300">
						<code>{generateThemeCode()}</code>
					</pre>
				{:else}
					<div class="space-y-3">
						<!-- Preview Components -->
						<div class="flex gap-2">
							<button
								class="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
								style="background: {customTheme.colors?.primary}; border-radius: {customTheme.radius
									?.button}; box-shadow: {customTheme.shadows?.sm};"
							>
								Primary Button
							</button>
							<button
								class="rounded-lg border px-4 py-2 text-sm font-medium transition-all"
								style="border-color: {customTheme.colors?.border}; color: {customTheme.colors
									?.text}; border-radius: {customTheme.radius?.button};"
							>
								Secondary Button
							</button>
						</div>

						<div
							class="rounded-lg p-4"
							style="background: {customTheme.colors
								?.backgroundSecondary}; border-radius: {customTheme.radius
								?.card}; box-shadow: {customTheme.shadows?.md};"
						>
							<div class="mb-2 text-sm font-medium" style="color: {customTheme.colors?.text};">
								Sample Card
							</div>
							<div class="text-xs" style="color: {customTheme.colors?.textSecondary};">
								This is how your theme looks in action
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Actions -->
		<div
			class="flex gap-2 border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
		>
			<button
				onclick={exportTheme}
				class="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
			>
				<Download class="h-4 w-4" />
				Export
			</button>
			<label
				class="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
			>
				<Upload class="h-4 w-4" />
				Import
				<input type="file" accept=".json" class="hidden" onchange={importTheme} />
			</label>
			<button
				onclick={applyTheme}
				class="ml-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
			>
				Apply Theme
			</button>
		</div>
	</div>
{/if}

<style>
	/* Custom scrollbar for the customizer */
	:global(.theme-customizer-scroll) {
		scrollbar-width: thin;
		scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
	}

	:global(.theme-customizer-scroll::-webkit-scrollbar) {
		width: 6px;
	}

	:global(.theme-customizer-scroll::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(.theme-customizer-scroll::-webkit-scrollbar-thumb) {
		background-color: rgba(156, 163, 175, 0.5);
		border-radius: 3px;
	}
</style>
