import type {
	WalletKitTheme,
	ThemeMode,
	PresetTheme,
	ThemeConfig
} from '$lib/domain/types/ThemeTypes';

/**
 * 默认主题（适应性设计，能融入大部分应用）
 */
export const defaultLightTheme: WalletKitTheme = {
	colors: {
		// 使用 CSS 变量，允许继承宿主应用的颜色
		primary: 'var(--wk-primary, #3b82f6)',
		primaryHover: 'var(--wk-primary-hover, #2563eb)',
		primaryActive: 'var(--wk-primary-active, #1d4ed8)',

		success: 'var(--wk-success, #10b981)',
		successLight: 'var(--wk-success-light, #d1fae5)',
		error: 'var(--wk-error, #ef4444)',
		errorLight: 'var(--wk-error-light, #fee2e2)',
		warning: 'var(--wk-warning, #f59e0b)',
		warningLight: 'var(--wk-warning-light, #fef3c7)',
		info: 'var(--wk-info, #3b82f6)',
		infoLight: 'var(--wk-info-light, #dbeafe)',

		background: 'var(--wk-background, #ffffff)',
		backgroundSecondary: 'var(--wk-background-secondary, #f9fafb)',
		backgroundTertiary: 'var(--wk-background-tertiary, #f3f4f6)',
		backgroundOverlay: 'var(--wk-background-overlay, rgba(0, 0, 0, 0.5))',

		text: 'var(--wk-text, #111827)',
		textSecondary: 'var(--wk-text-secondary, #6b7280)',
		textTertiary: 'var(--wk-text-tertiary, #9ca3af)',
		textInverse: 'var(--wk-text-inverse, #ffffff)',

		border: 'var(--wk-border, #e5e7eb)',
		borderLight: 'var(--wk-border-light, #f3f4f6)',
		borderFocus: 'var(--wk-border-focus, #3b82f6)',

		modalBackground: 'var(--wk-modal-background, #ffffff)',
		dropdownBackground: 'var(--wk-dropdown-background, #ffffff)',
		inputBackground: 'var(--wk-input-background, #ffffff)',
		buttonBackground: 'var(--wk-button-background, #3b82f6)',
		buttonText: 'var(--wk-button-text, #ffffff)',

		hover: 'var(--wk-hover, #f3f4f6)',
		active: 'var(--wk-active, #e5e7eb)',
		disabled: 'var(--wk-disabled, #9ca3af)'
	},

	radius: {
		none: '0',
		sm: 'var(--wk-radius-sm, 0.125rem)',
		md: 'var(--wk-radius-md, 0.375rem)',
		lg: 'var(--wk-radius-lg, 0.5rem)',
		xl: 'var(--wk-radius-xl, 0.75rem)',
		full: 'var(--wk-radius-full, 9999px)',
		button: 'var(--wk-radius-button, 0.5rem)',
		input: 'var(--wk-radius-input, 0.5rem)',
		modal: 'var(--wk-radius-modal, 0.75rem)',
		dropdown: 'var(--wk-radius-dropdown, 0.5rem)'
	},

	shadows: {
		none: 'none',
		sm: 'var(--wk-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))',
		md: 'var(--wk-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1))',
		lg: 'var(--wk-shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1))',
		xl: 'var(--wk-shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.1))',
		dropdown: 'var(--wk-shadow-dropdown, 0 10px 15px -3px rgb(0 0 0 / 0.1))',
		modal: 'var(--wk-shadow-modal, 0 25px 50px -12px rgb(0 0 0 / 0.25))',
		button: 'var(--wk-shadow-button, 0 1px 3px 0 rgb(0 0 0 / 0.1))'
	},

	spacing: {
		xs: 'var(--wk-spacing-xs, 0.5rem)',
		sm: 'var(--wk-spacing-sm, 0.75rem)',
		md: 'var(--wk-spacing-md, 1rem)',
		lg: 'var(--wk-spacing-lg, 1.5rem)',
		xl: 'var(--wk-spacing-xl, 2rem)'
	},

	fonts: {
		base: 'var(--wk-font-base, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
		mono: 'var(--wk-font-mono, ui-monospace, SFMono-Regular, "SF Mono", monospace)'
	},

	fontSizes: {
		xs: 'var(--wk-font-size-xs, 0.75rem)',
		sm: 'var(--wk-font-size-sm, 0.875rem)',
		base: 'var(--wk-font-size-base, 1rem)',
		lg: 'var(--wk-font-size-lg, 1.125rem)',
		xl: 'var(--wk-font-size-xl, 1.25rem)'
	},

	transitions: {
		fast: 'var(--wk-transition-fast, 150ms ease)',
		base: 'var(--wk-transition-base, 250ms ease)',
		slow: 'var(--wk-transition-slow, 350ms ease)'
	},

	zIndex: {
		dropdown: 1000,
		modal: 1050,
		tooltip: 1100,
		notification: 1150
	}
};

/**
 * 默认暗色主题
 */
export const defaultDarkTheme: WalletKitTheme = {
	...defaultLightTheme,
	colors: {
		...defaultLightTheme.colors,
		primary: 'var(--wk-primary, #60a5fa)',
		primaryHover: 'var(--wk-primary-hover, #93bbfc)',
		primaryActive: 'var(--wk-primary-active, #3b82f6)',

		success: 'var(--wk-success, #34d399)',
		successLight: 'var(--wk-success-light, #064e3b)',
		error: 'var(--wk-error, #f87171)',
		errorLight: 'var(--wk-error-light, #7f1d1d)',
		warning: 'var(--wk-warning, #fbbf24)',
		warningLight: 'var(--wk-warning-light, #78350f)',
		info: 'var(--wk-info, #60a5fa)',
		infoLight: 'var(--wk-info-light, #1e3a8a)',

		background: 'var(--wk-background, #111827)',
		backgroundSecondary: 'var(--wk-background-secondary, #1f2937)',
		backgroundTertiary: 'var(--wk-background-tertiary, #374151)',
		backgroundOverlay: 'var(--wk-background-overlay, rgba(0, 0, 0, 0.7))',

		text: 'var(--wk-text, #f9fafb)',
		textSecondary: 'var(--wk-text-secondary, #d1d5db)',
		textTertiary: 'var(--wk-text-tertiary, #9ca3af)',
		textInverse: 'var(--wk-text-inverse, #111827)',

		border: 'var(--wk-border, #374151)',
		borderLight: 'var(--wk-border-light, #1f2937)',
		borderFocus: 'var(--wk-border-focus, #60a5fa)',

		modalBackground: 'var(--wk-modal-background, #1f2937)',
		dropdownBackground: 'var(--wk-dropdown-background, #1f2937)',
		inputBackground: 'var(--wk-input-background, #111827)',
		buttonBackground: 'var(--wk-button-background, #60a5fa)',
		buttonText: 'var(--wk-button-text, #111827)',

		hover: 'var(--wk-hover, #374151)',
		active: 'var(--wk-active, #4b5563)',
		disabled: 'var(--wk-disabled, #6b7280)'
	}
};

/**
 * 主题管理器
 */
export class ThemeManager {
	private static instance: ThemeManager;
	private currentTheme: WalletKitTheme;
	private mode: ThemeMode = 'auto';

	private constructor() {
		this.currentTheme = this.getSystemTheme();
		this.applyTheme();
		this.setupSystemThemeListener();
	}

	static getInstance(): ThemeManager {
		if (!ThemeManager.instance) {
			ThemeManager.instance = new ThemeManager();
		}
		return ThemeManager.instance;
	}

	/**
	 * 配置主题
	 */
	configure(config: ThemeConfig): void {
		if (config.mode) {
			this.mode = config.mode;
		}

		if (config.preset) {
			this.applyPreset(config.preset);
		}

		if (config.custom) {
			this.mergeCustomTheme(config.custom);
		}

		this.applyTheme();
	}

	/**
	 * 获取当前主题
	 */
	getCurrentTheme(): WalletKitTheme {
		return this.currentTheme;
	}

	/**
	 * 获取系统主题
	 */
	private getSystemTheme(): WalletKitTheme {
		if (this.mode === 'dark') {
			return defaultDarkTheme;
		}

		if (this.mode === 'light') {
			return defaultLightTheme;
		}

		// Auto mode - detect system preference
		if (typeof window !== 'undefined' && window.matchMedia) {
			const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			return isDark ? defaultDarkTheme : defaultLightTheme;
		}

		return defaultLightTheme;
	}

	/**
	 * 应用预设主题
	 */
	private applyPreset(preset: PresetTheme): void {
		switch (preset) {
			case 'minimal':
				// 极简主题 - 更少的阴影和边框
				this.currentTheme = {
					...this.currentTheme,
					shadows: {
						...this.currentTheme.shadows,
						sm: 'none',
						md: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
						dropdown: '0 2px 8px 0 rgb(0 0 0 / 0.08)',
						modal: '0 4px 16px 0 rgb(0 0 0 / 0.1)'
					}
				};
				break;

			case 'rounded':
				// 圆润主题
				this.currentTheme = {
					...this.currentTheme,
					radius: {
						...this.currentTheme.radius,
						button: '1rem',
						input: '1rem',
						modal: '1.5rem',
						dropdown: '1rem'
					}
				};
				break;

			case 'sharp':
				// 锐利主题
				this.currentTheme = {
					...this.currentTheme,
					radius: {
						...this.currentTheme.radius,
						button: '0.125rem',
						input: '0.125rem',
						modal: '0.125rem',
						dropdown: '0.125rem'
					}
				};
				break;

			case 'soft':
				// 柔和主题
				this.currentTheme = {
					...this.currentTheme,
					shadows: {
						...this.currentTheme.shadows,
						sm: '0 2px 4px 0 rgb(0 0 0 / 0.03)',
						md: '0 4px 8px 0 rgb(0 0 0 / 0.06)',
						dropdown: '0 8px 16px 0 rgb(0 0 0 / 0.08)',
						modal: '0 16px 32px 0 rgb(0 0 0 / 0.12)'
					}
				};
				break;
		}
	}

	/**
	 * 合并自定义主题
	 */
	private mergeCustomTheme(custom: Partial<WalletKitTheme>): void {
		this.currentTheme = {
			...this.currentTheme,
			...custom,
			colors: {
				...this.currentTheme.colors,
				...(custom.colors || {})
			},
			radius: {
				...this.currentTheme.radius,
				...(custom.radius || {})
			},
			shadows: {
				...this.currentTheme.shadows,
				...(custom.shadows || {})
			},
			spacing: {
				...this.currentTheme.spacing,
				...(custom.spacing || {})
			},
			fonts: {
				...this.currentTheme.fonts,
				...(custom.fonts || {})
			},
			fontSizes: {
				...this.currentTheme.fontSizes,
				...(custom.fontSizes || {})
			},
			transitions: {
				...this.currentTheme.transitions,
				...(custom.transitions || {})
			},
			zIndex: {
				...this.currentTheme.zIndex,
				...(custom.zIndex || {})
			}
		};
	}

	/**
	 * 应用主题到 DOM
	 */
	private applyTheme(): void {
		if (typeof document === 'undefined') return;

		const root = document.documentElement;
		const theme = this.currentTheme;

		// 设置 CSS 变量
		Object.entries(theme.colors).forEach(([key, value]) => {
			root.style.setProperty(`--wk-color-${this.kebabCase(key)}`, value);
		});

		Object.entries(theme.radius).forEach(([key, value]) => {
			root.style.setProperty(`--wk-radius-${this.kebabCase(key)}`, value);
		});

		Object.entries(theme.shadows).forEach(([key, value]) => {
			root.style.setProperty(`--wk-shadow-${this.kebabCase(key)}`, value);
		});

		Object.entries(theme.spacing).forEach(([key, value]) => {
			root.style.setProperty(`--wk-spacing-${key}`, value);
		});

		Object.entries(theme.fonts).forEach(([key, value]) => {
			root.style.setProperty(`--wk-font-${this.kebabCase(key)}`, value);
		});

		Object.entries(theme.fontSizes).forEach(([key, value]) => {
			root.style.setProperty(`--wk-font-size-${key}`, String(value));
		});

		Object.entries(theme.transitions).forEach(([key, value]) => {
			root.style.setProperty(`--wk-transition-${key}`, String(value));
		});

		// z-index 作为 CSS 变量
		Object.entries(theme.zIndex).forEach(([key, value]) => {
			root.style.setProperty(`--wk-z-${this.kebabCase(key)}`, value.toString());
		});
	}

	/**
	 * 监听系统主题变化
	 */
	private setupSystemThemeListener(): void {
		if (typeof window === 'undefined' || !window.matchMedia) return;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', (e) => {
			if (this.mode === 'auto') {
				this.currentTheme = e.matches ? defaultDarkTheme : defaultLightTheme;
				this.applyTheme();
			}
		});
	}

	/**
	 * 转换为 kebab-case
	 */
	private kebabCase(str: string): string {
		return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
	}
}

export const themeManager = ThemeManager.getInstance();
