/**
 * WalletKit Theme Creation Utilities
 *
 * Provides simple APIs for creating custom themes
 */

import type { WalletKitTheme } from '$lib/domain/types/ThemeTypes.js';

export interface SimpleThemeConfig {
	// Brand colors (only need to provide main color, variations are auto-generated)
	primary?: string;
	secondary?: string;
	accent?: string;

	// Semantic colors (optional overrides)
	success?: string;
	error?: string;
	warning?: string;
	info?: string;

	// Style preferences
	borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
	shadowIntensity?: 'none' | 'subtle' | 'normal' | 'strong';
	spacing?: 'compact' | 'normal' | 'comfortable' | 'spacious';

	// Font preferences
	fontFamily?: string;
	fontSize?: 'small' | 'normal' | 'large';

	// Mode-specific overrides
	dark?: {
		background?: string;
		text?: string;
		border?: string;
	};
	light?: {
		background?: string;
		text?: string;
		border?: string;
	};
}

/**
 * Create a complete theme from simple configuration
 */
export function createTheme(config: SimpleThemeConfig = {}): Partial<WalletKitTheme> {
	// Default values
	const primary = config.primary || '#6366f1';
	const secondary = config.secondary || '#8b5cf6';
	const accent = config.accent || '#ec4899';

	// Generate color variations
	const primaryVariations = generateColorVariations(primary);
	const secondaryVariations = generateColorVariations(secondary);

	// Determine radius values
	const radiusMap = {
		none: '0',
		sm: '0.375rem',
		md: '0.75rem',
		lg: '1rem',
		xl: '1.5rem',
		full: '9999px'
	};
	const radius = radiusMap[config.borderRadius || 'lg'];

	// Determine shadow values
	const shadowMap = {
		none: {
			sm: 'none',
			md: 'none',
			lg: 'none',
			xl: 'none'
		},
		subtle: {
			sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
			md: '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
			lg: '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
			xl: '0 8px 12px -2px rgba(0, 0, 0, 0.08)'
		},
		normal: {
			sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
			md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
			lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
			xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
		},
		strong: {
			sm: '0 2px 4px 0 rgba(0, 0, 0, 0.15)',
			md: '0 6px 10px -1px rgba(0, 0, 0, 0.15)',
			lg: '0 15px 25px -3px rgba(0, 0, 0, 0.15)',
			xl: '0 30px 40px -5px rgba(0, 0, 0, 0.15)'
		}
	};
	const shadows = shadowMap[config.shadowIntensity || 'normal'];

	// Determine spacing values
	const spacingMap = {
		compact: {
			xs: '0.125rem',
			sm: '0.25rem',
			md: '0.5rem',
			lg: '0.75rem',
			xl: '1rem'
		},
		normal: {
			xs: '0.25rem',
			sm: '0.5rem',
			md: '1rem',
			lg: '1.5rem',
			xl: '2rem'
		},
		comfortable: {
			xs: '0.375rem',
			sm: '0.75rem',
			md: '1.25rem',
			lg: '2rem',
			xl: '3rem'
		},
		spacious: {
			xs: '0.5rem',
			sm: '1rem',
			md: '1.5rem',
			lg: '2.5rem',
			xl: '4rem'
		}
	};
	const spacing = spacingMap[config.spacing || 'normal'];

	// Font sizes
	const fontSizeMap = {
		small: {
			xs: '0.7rem',
			sm: '0.8rem',
			base: '0.9rem',
			lg: '1rem',
			xl: '1.125rem'
		},
		normal: {
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem'
		},
		large: {
			xs: '0.875rem',
			sm: '1rem',
			base: '1.125rem',
			lg: '1.25rem',
			xl: '1.5rem'
		}
	};
	const fontSizes = fontSizeMap[config.fontSize || 'normal'];

	return {
		colors: {
			primary: primaryVariations.base,
			primaryDark: primaryVariations.dark,
			primaryLight: primaryVariations.light,
			primaryHover: adjustBrightness(primaryVariations.base, -10),
			primaryActive: adjustBrightness(primaryVariations.base, -20),
			secondary: secondaryVariations.base,
			secondaryDark: secondaryVariations.dark,
			secondaryLight: secondaryVariations.light,
			accent: accent,

			background: config.light?.background || '#ffffff',
			backgroundSecondary: config.light?.background
				? adjustBrightness(config.light.background, -5)
				: '#f9fafb',
			backgroundTertiary: config.light?.background
				? adjustBrightness(config.light.background, -10)
				: '#f3f4f6',
			backgroundOverlay: 'rgba(0, 0, 0, 0.5)',

			text: config.light?.text || '#111827',
			textSecondary: config.light?.text ? adjustBrightness(config.light.text, 40) : '#6b7280',
			textTertiary: config.light?.text ? adjustBrightness(config.light.text, 60) : '#9ca3af',
			textInverse: '#ffffff',

			border: config.light?.border || '#e5e7eb',
			borderLight: config.light?.border ? adjustBrightness(config.light.border, 10) : '#f3f4f6',
			borderFocus: primaryVariations.base,
			borderHover: config.light?.border ? adjustBrightness(config.light.border, -10) : '#d1d5db',

			success: config.success || '#10b981',
			successLight: config.success ? adjustBrightness(config.success, 40) : '#d1fae5',
			successDark: config.success ? adjustBrightness(config.success, -20) : '#059669',

			error: config.error || '#ef4444',
			errorLight: config.error ? adjustBrightness(config.error, 40) : '#fee2e2',
			errorDark: config.error ? adjustBrightness(config.error, -20) : '#dc2626',

			warning: config.warning || '#f59e0b',
			warningLight: config.warning ? adjustBrightness(config.warning, 40) : '#fef3c7',
			warningDark: config.warning ? adjustBrightness(config.warning, -20) : '#d97706',

			info: config.info || '#3b82f6',
			infoLight: config.info ? adjustBrightness(config.info, 40) : '#dbeafe',
			infoDark: config.info ? adjustBrightness(config.info, -20) : '#2563eb',

			buttonPrimary: primaryVariations.base,
			buttonPrimaryHover: primaryVariations.dark,
			buttonPrimaryText: '#ffffff',

			buttonSecondary: '#f3f4f6',
			buttonSecondaryHover: '#e5e7eb',
			buttonSecondaryText: '#374151',

			buttonGhost: 'transparent',
			buttonGhostHover: 'rgba(0, 0, 0, 0.05)',
			buttonGhostText: '#6b7280',
			
			modalBackground: '#ffffff',
			dropdownBackground: '#ffffff',
			inputBackground: '#ffffff',
			buttonBackground: primaryVariations.base,
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
			input: radius,
			button: radius,
			card: config.borderRadius === 'full' ? '1.5rem' : radius,
			modal: config.borderRadius === 'none' ? '0' : '1.5rem',
			dropdown: radius,
			tooltip: config.borderRadius === 'full' ? radius : '0.5rem'
		},
		shadows: {
			none: 'none',
			sm: shadows.sm,
			md: shadows.md,
			lg: shadows.lg,
			xl: shadows.xl,
			modal: shadows.xl,
			button: shadows.sm,
			dropdown: shadows.lg
		},
		spacing: {
			...spacing,
			button: `${spacing.sm} ${spacing.md}`,
			input: `${spacing.sm} ${spacing.sm}`,
			card: spacing.md,
			modal: spacing.lg
		},
		fonts: {
			base: config.fontFamily || 'system-ui, -apple-system, sans-serif',
			body: config.fontFamily || 'system-ui, -apple-system, sans-serif',
			heading: config.fontFamily || 'system-ui, -apple-system, sans-serif',
			mono: 'ui-monospace, monospace'
		},
		fontSizes,
		transitions: {
			fast: 'all 150ms ease-in-out',
			base: 'all 250ms ease-in-out',
			normal: 'all 250ms ease-in-out',
			slow: 'all 350ms ease-in-out'
		},
		zIndex: {
			dropdown: 1000,
			sticky: 1020,
			modal: 1030,
			popover: 1040,
			tooltip: 1050,
			notification: 1060
		}
	};
}

/**
 * Generate color variations from a base color
 */
function generateColorVariations(baseColor: string): {
	light: string;
	base: string;
	dark: string;
} {
	return {
		light: adjustBrightness(baseColor, 20),
		base: baseColor,
		dark: adjustBrightness(baseColor, -20)
	};
}

/**
 * Adjust color brightness
 */
function adjustBrightness(color: string, amount: number): string {
	// Remove # if present
	color = color.replace('#', '');

	// Parse RGB values
	const num = parseInt(color, 16);
	let r = (num >> 16) + amount;
	let g = ((num >> 8) & 0x00ff) + amount;
	let b = (num & 0x0000ff) + amount;

	// Clamp values
	r = Math.max(0, Math.min(255, r));
	g = Math.max(0, Math.min(255, g));
	b = Math.max(0, Math.min(255, b));

	// Convert back to hex
	return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

/**
 * Preset theme configurations
 */
export const presetThemes = {
	default: createTheme(),

	minimal: createTheme({
		primary: '#000000',
		secondary: '#666666',
		borderRadius: 'sm',
		shadowIntensity: 'subtle',
		spacing: 'normal'
	}),

	vibrant: createTheme({
		primary: '#ff006e',
		secondary: '#ffbe0b',
		accent: '#3a86ff',
		borderRadius: 'xl',
		shadowIntensity: 'strong',
		spacing: 'comfortable'
	}),

	ocean: createTheme({
		primary: '#006ba6',
		secondary: '#0496ff',
		accent: '#09a129',
		borderRadius: 'lg',
		shadowIntensity: 'normal'
	}),

	sunset: createTheme({
		primary: '#ff6b35',
		secondary: '#f77f00',
		accent: '#fcbf49',
		borderRadius: 'xl',
		shadowIntensity: 'strong'
	}),

	forest: createTheme({
		primary: '#2d6a4f',
		secondary: '#52b788',
		accent: '#95d5b2',
		borderRadius: 'md',
		shadowIntensity: 'subtle'
	}),

	candy: createTheme({
		primary: '#ff6ec7',
		secondary: '#ffc0cb',
		accent: '#ffb6c1',
		borderRadius: 'full',
		shadowIntensity: 'normal',
		spacing: 'comfortable'
	}),

	professional: createTheme({
		primary: '#2c3e50',
		secondary: '#34495e',
		accent: '#3498db',
		borderRadius: 'sm',
		shadowIntensity: 'subtle',
		spacing: 'compact'
	}),

	neon: createTheme({
		primary: '#00ffff',
		secondary: '#ff00ff',
		accent: '#ffff00',
		borderRadius: 'none',
		shadowIntensity: 'strong',
		dark: {
			background: '#000000',
			text: '#ffffff',
			border: '#333333'
		}
	})
};

/**
 * Export theme to CSS variables
 */
export function exportThemeToCSS(theme: Partial<WalletKitTheme>): string {
	const cssVariables: string[] = [];

	// Colors
	if (theme.colors) {
		Object.entries(theme.colors).forEach(([key, value]) => {
			cssVariables.push(`  --wk-color-${kebabCase(key)}: ${value};`);
		});
	}

	// Radius
	if (theme.radius) {
		Object.entries(theme.radius).forEach(([key, value]) => {
			cssVariables.push(`  --wk-radius-${kebabCase(key)}: ${value};`);
		});
	}

	// Shadows
	if (theme.shadows) {
		Object.entries(theme.shadows).forEach(([key, value]) => {
			cssVariables.push(`  --wk-shadow-${kebabCase(key)}: ${value};`);
		});
	}

	// Spacing
	if (theme.spacing) {
		Object.entries(theme.spacing).forEach(([key, value]) => {
			cssVariables.push(`  --wk-spacing-${key}: ${value};`);
		});
	}

	return `:root {\n${cssVariables.join('\n')}\n}`;
}

function kebabCase(str: string): string {
	return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
