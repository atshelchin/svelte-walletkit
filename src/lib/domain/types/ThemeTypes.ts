/**
 * WalletKit 主题配置
 */
export interface WalletKitTheme {
	// 颜色系统
	colors: {
		// 主色调
		primary: string;
		primaryHover: string;
		primaryActive: string;

		// 语义颜色
		success: string;
		successLight: string;
		error: string;
		errorLight: string;
		warning: string;
		warningLight: string;
		info: string;
		infoLight: string;

		// 背景色
		background: string;
		backgroundSecondary: string;
		backgroundTertiary: string;
		backgroundOverlay: string;

		// 前景色（文字）
		text: string;
		textSecondary: string;
		textTertiary: string;
		textInverse: string;

		// 边框
		border: string;
		borderLight: string;
		borderFocus: string;

		// 特殊用途
		modalBackground: string;
		dropdownBackground: string;
		inputBackground: string;
		buttonBackground: string;
		buttonText: string;

		// 状态颜色
		hover: string;
		active: string;
		disabled: string;
	};

	// 圆角
	radius: {
		none: string;
		sm: string;
		md: string;
		lg: string;
		xl: string;
		full: string;
		button: string;
		input: string;
		modal: string;
		dropdown: string;
	};

	// 阴影
	shadows: {
		none: string;
		sm: string;
		md: string;
		lg: string;
		xl: string;
		dropdown: string;
		modal: string;
		button: string;
	};

	// 间距
	spacing: {
		xs: string;
		sm: string;
		md: string;
		lg: string;
		xl: string;
	};

	// 字体
	fonts: {
		base: string;
		mono: string;
	};

	// 字体大小
	fontSizes: {
		xs: string;
		sm: string;
		base: string;
		lg: string;
		xl: string;
	};

	// 过渡动画
	transitions: {
		fast: string;
		base: string;
		slow: string;
	};

	// z-index 层级
	zIndex: {
		dropdown: number;
		modal: number;
		tooltip: number;
		notification: number;
	};
}

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * 预设主题名称
 */
export type PresetTheme = 'default' | 'minimal' | 'rounded' | 'sharp' | 'soft';

/**
 * 主题配置选项
 */
export interface ThemeConfig {
	mode?: ThemeMode;
	preset?: PresetTheme;
	custom?: Partial<WalletKitTheme>;
}
