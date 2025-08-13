import { themeManager } from './ThemeManager.js';
import type { ThemeConfig } from '$lib/domain/types/ThemeTypes.js';

/**
 * Initialize the theme system with default or custom configuration
 * This should be called once when the application starts
 */
export function initializeTheme(config?: ThemeConfig) {
	// Apply default configuration
	const defaultConfig: ThemeConfig = {
		mode: 'auto', // Follow system preference by default
		preset: 'default'
	};

	// Merge with user configuration
	const finalConfig = {
		...defaultConfig,
		...config
	};

	// Configure the theme manager
	themeManager.configure(finalConfig);

	// Return the theme manager for further customization
	return themeManager;
}

/**
 * Update theme configuration at runtime
 */
export function updateTheme(config: ThemeConfig) {
	themeManager.configure(config);
}

/**
 * Get current theme configuration
 */
export function getCurrentTheme() {
	return themeManager.getCurrentTheme();
}

/**
 * Quick theme mode switcher
 */
export function setThemeMode(mode: 'light' | 'dark' | 'auto') {
	themeManager.configure({ mode });
}

/**
 * Apply a preset theme
 */
export function applyPresetTheme(preset: 'default' | 'minimal' | 'rounded' | 'sharp' | 'soft') {
	themeManager.configure({ preset });
}
