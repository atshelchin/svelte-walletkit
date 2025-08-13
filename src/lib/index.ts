// Core exports
export { default as WalletKit } from './WalletKit.svelte';

// Components
export { default as NetworkSelector } from './presentation/components/NetworkSelector.svelte';
export { default as NetworkManager } from './presentation/components/NetworkManager.svelte';
export { default as NetworkQuickEdit } from './presentation/components/NetworkQuickEdit.svelte';

// Stores
export { networkStore } from './presentation/stores/networkStore.svelte.js';

// Theme System
export {
	initializeTheme,
	updateTheme,
	getCurrentTheme,
	setThemeMode,
	applyPresetTheme
} from './infrastructure/theme/initTheme.js';

// Types
export type {
	NetworkConfig,
	WalletConfig,
	Connector,
	WalletAccount
} from './domain/types/WalletTypes.js';

export type {
	WalletKitTheme,
	ThemeMode,
	PresetTheme,
	ThemeConfig
} from './domain/types/ThemeTypes.js';
