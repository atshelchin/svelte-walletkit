<script lang="ts">
	import { ThemeCustomizer } from '$lib/presentation/components/ThemeCustomizer.svelte';
	import { presetThemes, exportThemeToCSS } from '$lib/infrastructure/theme/createTheme.js';
	import Button from '$lib/presentation/components/shared/Button.svelte';
	import Card from '$lib/presentation/components/shared/Card.svelte';
	import Input from '$lib/presentation/components/shared/Input.svelte';
	import Badge from '$lib/presentation/components/shared/Badge.svelte';
	import Modal from '$lib/presentation/components/shared/Modal.svelte';
	import {
		Palette,
		Moon,
		Sun,
		Download,
		Settings,
		ChevronRight,
		Zap,
		Heart,
		Star
	} from '@lucide/svelte';

	let showCustomizer = $state(false);
	let selectedPreset = $state('default');
	let isDarkMode = $state(false);
	let showModal = $state(false);

	// Apply preset theme
	function applyPreset(presetName: string) {
		selectedPreset = presetName;
		const theme = presetThemes[presetName as keyof typeof presetThemes];

		// Apply theme to CSS variables
		const root = document.documentElement;
		if (theme.colors) {
			Object.entries(theme.colors).forEach(([key, value]) => {
				root.style.setProperty(`--wk-color-${kebabCase(key)}`, value);
			});
		}
		if (theme.radius) {
			Object.entries(theme.radius).forEach(([key, value]) => {
				root.style.setProperty(`--wk-radius-${kebabCase(key)}`, value);
			});
		}
		if (theme.shadows) {
			Object.entries(theme.shadows).forEach(([key, value]) => {
				root.style.setProperty(`--wk-shadow-${kebabCase(key)}`, value);
			});
		}
	}

	function kebabCase(str: string): string {
		return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
	}

	// Toggle dark mode
	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		document.documentElement.classList.toggle('dark', isDarkMode);
	}

	// Download theme configuration
	function downloadTheme() {
		const theme = presetThemes[selectedPreset as keyof typeof presetThemes];
		const css = exportThemeToCSS(theme);

		const blob = new Blob([css], { type: 'text/css' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `walletkit-theme-${selectedPreset}.css`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div
	class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950"
>
	<!-- Header -->
	<div
		class="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80"
	>
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
					>
						<Palette class="h-6 w-6 text-white" />
					</div>
					<div>
						<h1
							class="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:to-gray-300"
						>
							WalletKit Theme System
						</h1>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							Beautiful, customizable themes for your wallet interface
						</p>
					</div>
				</div>

				<div class="flex items-center gap-3">
					<button
						onclick={toggleDarkMode}
						class="rounded-xl p-3 text-gray-600 transition-all hover:bg-gray-100 hover:shadow-md dark:text-gray-400 dark:hover:bg-gray-800"
					>
						{#if isDarkMode}
							<Moon class="h-5 w-5" />
						{:else}
							<Sun class="h-5 w-5" />
						{/if}
					</button>
					<button
						onclick={() => (showCustomizer = true)}
						class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl"
					>
						<Settings class="h-4 w-4" />
						Customize Theme
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<!-- Preset Themes Section -->
		<div class="mb-12">
			<h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Preset Themes</h2>
			<p class="mb-8 text-gray-600 dark:text-gray-400">
				Choose from our carefully crafted theme presets or create your own
			</p>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each Object.keys(presetThemes) as preset (preset)}
					<button
						onclick={() => applyPreset(preset)}
						class="group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all {selectedPreset ===
						preset
							? 'border-indigo-500 bg-indigo-50 shadow-lg dark:border-indigo-400 dark:bg-indigo-900/20'
							: 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'}"
					>
						{#if selectedPreset === preset}
							<div class="absolute top-3 right-3">
								<div
									class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white"
								>
									<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
										<path
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										/>
									</svg>
								</div>
							</div>
						{/if}

						<div class="mb-4 flex gap-2">
							<div class="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"></div>
							<div class="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600"></div>
							<div class="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-red-600"></div>
						</div>

						<h3 class="mb-1 font-semibold text-gray-900 capitalize dark:text-white">
							{preset.replace(/_/g, ' ')}
						</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							{preset === 'default' && 'Clean and modern design'}
							{preset === 'minimal' && 'Simple and elegant'}
							{preset === 'vibrant' && 'Bold and colorful'}
							{preset === 'ocean' && 'Cool blue tones'}
							{preset === 'sunset' && 'Warm orange hues'}
							{preset === 'forest' && 'Natural green palette'}
							{preset === 'candy' && 'Sweet and playful'}
							{preset === 'professional' && 'Corporate and serious'}
							{preset === 'neon' && 'Bright and electric'}
						</p>
					</button>
				{/each}
			</div>
		</div>

		<!-- Component Preview Section -->
		<div class="mb-12">
			<h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Component Preview</h2>
			<p class="mb-8 text-gray-600 dark:text-gray-400">
				See how your theme looks across different components
			</p>

			<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<!-- Buttons -->
				<Card>
					<h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Buttons</h3>
					<div class="space-y-3">
						<div class="flex flex-wrap gap-3">
							<Button variant="primary">Primary Button</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="danger">Danger</Button>
						</div>
						<div class="flex flex-wrap gap-3">
							<Button variant="primary" size="sm">Small</Button>
							<Button variant="primary" size="md">Medium</Button>
							<Button variant="primary" size="lg">Large</Button>
						</div>
						<div class="flex flex-wrap gap-3">
							<Button variant="primary" disabled>Disabled</Button>
							<Button variant="primary" loading>Loading...</Button>
						</div>
					</div>
				</Card>

				<!-- Forms -->
				<Card>
					<h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Form Elements</h3>
					<div class="space-y-4">
						<Input label="Email Address" placeholder="you@example.com" type="email" />
						<Input label="Password" placeholder="Enter your password" type="password" />
						<div class="flex gap-3">
							<Input label="First Name" placeholder="John" />
							<Input label="Last Name" placeholder="Doe" />
						</div>
					</div>
				</Card>

				<!-- Badges -->
				<Card>
					<h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Badges & Tags</h3>
					<div class="flex flex-wrap gap-3">
						<Badge variant="primary">Primary</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="success">Success</Badge>
						<Badge variant="warning">Warning</Badge>
						<Badge variant="danger">Danger</Badge>
						<Badge variant="info">Info</Badge>
					</div>

					<div class="mt-6 flex flex-wrap gap-3">
						<Badge variant="primary" size="sm">Small</Badge>
						<Badge variant="primary" size="md">Medium</Badge>
						<Badge variant="primary" size="lg">Large</Badge>
					</div>
				</Card>

				<!-- Cards -->
				<Card>
					<h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Nested Cards</h3>
					<div class="space-y-3">
						<div
							class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
						>
							<div class="mb-2 flex items-center gap-2">
								<Zap class="h-5 w-5 text-yellow-500" />
								<span class="font-medium">Quick Actions</span>
							</div>
							<p class="text-sm text-gray-600 dark:text-gray-400">
								Perform common tasks with one click
							</p>
						</div>

						<div
							class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
						>
							<div class="mb-2 flex items-center gap-2">
								<Heart class="h-5 w-5 text-red-500" />
								<span class="font-medium">Favorites</span>
							</div>
							<p class="text-sm text-gray-600 dark:text-gray-400">Access your most used features</p>
						</div>
					</div>
				</Card>
			</div>
		</div>

		<!-- Features Section -->
		<div
			class="rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20"
		>
			<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Theme System Features</h2>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				<div class="rounded-2xl bg-white/80 p-6 backdrop-blur-sm dark:bg-gray-800/80">
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600"
					>
						<Palette class="h-6 w-6 text-white" />
					</div>
					<h3 class="mb-2 font-semibold text-gray-900 dark:text-white">Easy Customization</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						Simple API to create and apply custom themes with just a few lines of code.
					</p>
				</div>

				<div class="rounded-2xl bg-white/80 p-6 backdrop-blur-sm dark:bg-gray-800/80">
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600"
					>
						<Star class="h-6 w-6 text-white" />
					</div>
					<h3 class="mb-2 font-semibold text-gray-900 dark:text-white">Preset Themes</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						Choose from 9+ professionally designed themes or create your own.
					</p>
				</div>

				<div class="rounded-2xl bg-white/80 p-6 backdrop-blur-sm dark:bg-gray-800/80">
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-red-600"
					>
						<Settings class="h-6 w-6 text-white" />
					</div>
					<h3 class="mb-2 font-semibold text-gray-900 dark:text-white">Visual Customizer</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						Real-time theme editor with live preview and export functionality.
					</p>
				</div>
			</div>

			<div class="mt-8 flex justify-center gap-4">
				<button
					onclick={() => (showModal = true)}
					class="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-gray-900 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800 dark:text-white"
				>
					View Example Modal
					<ChevronRight class="h-4 w-4" />
				</button>
				<button
					onclick={downloadTheme}
					class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl"
				>
					<Download class="h-4 w-4" />
					Export Theme CSS
				</button>
			</div>
		</div>
	</div>

	<!-- Theme Customizer -->
	<ThemeCustomizer isOpen={showCustomizer} onClose={() => (showCustomizer = false)} />

	<!-- Example Modal -->
	<Modal isOpen={showModal} onClose={() => (showModal = false)} title="Example Modal">
		<div class="space-y-4">
			<p class="text-gray-600 dark:text-gray-400">
				This is an example modal showcasing the theme system. Notice how all the colors, shadows,
				and border radius values adapt to the selected theme.
			</p>

			<div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
				<h4 class="mb-2 font-medium text-gray-900 dark:text-white">Theme Details</h4>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					Current theme: <span class="font-medium capitalize">{selectedPreset}</span>
				</p>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					Mode: <span class="font-medium">{isDarkMode ? 'Dark' : 'Light'}</span>
				</p>
			</div>

			<div class="flex justify-end gap-3">
				<Button variant="secondary" onclick={() => (showModal = false)}>Cancel</Button>
				<Button variant="primary" onclick={() => (showModal = false)}>Confirm</Button>
			</div>
		</div>
	</Modal>
</div>
