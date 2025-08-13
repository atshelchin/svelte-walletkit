/**
 * WalletKit Design System
 *
 * Design Philosophy:
 * - Modern and Clean: Minimalist approach with purposeful use of space
 * - Soft and Approachable: Rounded corners, gentle shadows, smooth transitions
 * - Vibrant yet Professional: Strategic use of gradients and accent colors
 * - Accessibility First: High contrast ratios and clear visual hierarchy
 *
 * Visual Identity:
 * - Primary: Indigo-based gradient system
 * - Accent: Complementary warm tones (coral, amber)
 * - Neutral: Custom gray scale with slight blue undertone
 * - Success/Error/Warning: Semantic colors with consistent saturation
 */

export interface WalletKitDesignTokens {
	colors: {
		// Brand Colors
		primary: {
			50: string;
			100: string;
			200: string;
			300: string;
			400: string;
			500: string;
			600: string;
			700: string;
			800: string;
			900: string;
			950: string;
		};
		// Accent Colors
		accent: {
			coral: string;
			amber: string;
			teal: string;
			purple: string;
		};
		// Neutral Colors (Custom gray with blue undertone)
		neutral: {
			50: string;
			100: string;
			200: string;
			300: string;
			400: string;
			500: string;
			600: string;
			700: string;
			800: string;
			900: string;
			950: string;
		};
		// Semantic Colors
		semantic: {
			success: string;
			successLight: string;
			successDark: string;
			error: string;
			errorLight: string;
			errorDark: string;
			warning: string;
			warningLight: string;
			warningDark: string;
			info: string;
			infoLight: string;
			infoDark: string;
		};
		// Gradients
		gradients: {
			primary: string;
			secondary: string;
			accent: string;
			surface: string;
			overlay: string;
		};
	};
	spacing: {
		px: string;
		0: string;
		0.5: string;
		1: string;
		1.5: string;
		2: string;
		2.5: string;
		3: string;
		3.5: string;
		4: string;
		5: string;
		6: string;
		7: string;
		8: string;
		9: string;
		10: string;
		12: string;
		14: string;
		16: string;
		20: string;
	};
	typography: {
		fonts: {
			sans: string;
			mono: string;
		};
		sizes: {
			xs: string;
			sm: string;
			base: string;
			lg: string;
			xl: string;
			'2xl': string;
			'3xl': string;
			'4xl': string;
		};
		weights: {
			thin: string;
			light: string;
			normal: string;
			medium: string;
			semibold: string;
			bold: string;
			extrabold: string;
		};
		lineHeights: {
			tight: string;
			snug: string;
			normal: string;
			relaxed: string;
			loose: string;
		};
	};
	borderRadius: {
		none: string;
		sm: string;
		md: string;
		lg: string;
		xl: string;
		'2xl': string;
		'3xl': string;
		full: string;
	};
	shadows: {
		none: string;
		sm: string;
		md: string;
		lg: string;
		xl: string;
		'2xl': string;
		inner: string;
		glow: string;
		glowLg: string;
	};
	animations: {
		durations: {
			instant: string;
			fast: string;
			normal: string;
			slow: string;
		};
		easings: {
			linear: string;
			easeIn: string;
			easeOut: string;
			easeInOut: string;
			spring: string;
		};
	};
	effects: {
		blur: {
			sm: string;
			md: string;
			lg: string;
			xl: string;
		};
		opacity: {
			0: string;
			5: string;
			10: string;
			20: string;
			30: string;
			40: string;
			50: string;
			60: string;
			70: string;
			80: string;
			90: string;
			100: string;
		};
	};
}

export const lightTheme: WalletKitDesignTokens = {
	colors: {
		primary: {
			50: '#eef2ff',
			100: '#e0e7ff',
			200: '#c7d2fe',
			300: '#a5b4fc',
			400: '#818cf8',
			500: '#6366f1', // Main brand color
			600: '#4f46e5',
			700: '#4338ca',
			800: '#3730a3',
			900: '#312e81',
			950: '#1e1b4b'
		},
		accent: {
			coral: '#ff6b6b',
			amber: '#ffc107',
			teal: '#20c997',
			purple: '#9333ea'
		},
		neutral: {
			50: '#f8fafc',
			100: '#f1f5f9',
			200: '#e2e8f0',
			300: '#cbd5e1',
			400: '#94a3b8',
			500: '#64748b',
			600: '#475569',
			700: '#334155',
			800: '#1e293b',
			900: '#0f172a',
			950: '#020617'
		},
		semantic: {
			success: '#10b981',
			successLight: '#d1fae5',
			successDark: '#059669',
			error: '#ef4444',
			errorLight: '#fee2e2',
			errorDark: '#dc2626',
			warning: '#f59e0b',
			warningLight: '#fef3c7',
			warningDark: '#d97706',
			info: '#3b82f6',
			infoLight: '#dbeafe',
			infoDark: '#2563eb'
		},
		gradients: {
			primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			secondary: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
			accent: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
			surface: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
			overlay: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)'
		}
	},
	spacing: {
		px: '1px',
		0: '0',
		0.5: '0.125rem',
		1: '0.25rem',
		1.5: '0.375rem',
		2: '0.5rem',
		2.5: '0.625rem',
		3: '0.75rem',
		3.5: '0.875rem',
		4: '1rem',
		5: '1.25rem',
		6: '1.5rem',
		7: '1.75rem',
		8: '2rem',
		9: '2.25rem',
		10: '2.5rem',
		12: '3rem',
		14: '3.5rem',
		16: '4rem',
		20: '5rem'
	},
	typography: {
		fonts: {
			sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
			mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
		},
		sizes: {
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.5rem',
			'3xl': '1.875rem',
			'4xl': '2.25rem'
		},
		weights: {
			thin: '100',
			light: '300',
			normal: '400',
			medium: '500',
			semibold: '600',
			bold: '700',
			extrabold: '800'
		},
		lineHeights: {
			tight: '1.25',
			snug: '1.375',
			normal: '1.5',
			relaxed: '1.625',
			loose: '2'
		}
	},
	borderRadius: {
		none: '0',
		sm: '0.25rem',
		md: '0.5rem',
		lg: '0.75rem',
		xl: '1rem',
		'2xl': '1.5rem',
		'3xl': '2rem',
		full: '9999px'
	},
	shadows: {
		none: 'none',
		sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
		'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
		inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
		glow: '0 0 20px rgba(99, 102, 241, 0.3)',
		glowLg: '0 0 40px rgba(99, 102, 241, 0.4)'
	},
	animations: {
		durations: {
			instant: '0ms',
			fast: '150ms',
			normal: '300ms',
			slow: '500ms'
		},
		easings: {
			linear: 'linear',
			easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
			easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
			easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
			spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
		}
	},
	effects: {
		blur: {
			sm: 'blur(4px)',
			md: 'blur(8px)',
			lg: 'blur(12px)',
			xl: 'blur(20px)'
		},
		opacity: {
			0: '0',
			5: '0.05',
			10: '0.1',
			20: '0.2',
			30: '0.3',
			40: '0.4',
			50: '0.5',
			60: '0.6',
			70: '0.7',
			80: '0.8',
			90: '0.9',
			100: '1'
		}
	}
};

export const darkTheme: WalletKitDesignTokens = {
	...lightTheme,
	colors: {
		...lightTheme.colors,
		primary: {
			50: '#1e1b4b',
			100: '#312e81',
			200: '#3730a3',
			300: '#4338ca',
			400: '#4f46e5',
			500: '#6366f1', // Main brand color stays consistent
			600: '#818cf8',
			700: '#a5b4fc',
			800: '#c7d2fe',
			900: '#e0e7ff',
			950: '#eef2ff'
		},
		neutral: {
			50: '#020617',
			100: '#0f172a',
			200: '#1e293b',
			300: '#334155',
			400: '#475569',
			500: '#64748b',
			600: '#94a3b8',
			700: '#cbd5e1',
			800: '#e2e8f0',
			900: '#f1f5f9',
			950: '#f8fafc'
		},
		semantic: {
			success: '#10b981',
			successLight: '#064e3b',
			successDark: '#34d399',
			error: '#ef4444',
			errorLight: '#7f1d1d',
			errorDark: '#f87171',
			warning: '#f59e0b',
			warningLight: '#78350f',
			warningDark: '#fbbf24',
			info: '#3b82f6',
			infoLight: '#1e3a8a',
			infoDark: '#60a5fa'
		},
		gradients: {
			primary: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
			secondary: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
			accent: 'linear-gradient(135deg, #312e81 0%, #4f46e5 100%)',
			surface: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
			overlay: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)'
		}
	},
	shadows: {
		...lightTheme.shadows,
		sm: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
		md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
		lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
		xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
		'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
		glow: '0 0 30px rgba(99, 102, 241, 0.5)',
		glowLg: '0 0 60px rgba(99, 102, 241, 0.6)'
	}
};
