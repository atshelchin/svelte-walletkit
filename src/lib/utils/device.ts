/**
 * Device detection utilities
 */

export function isMobile(): boolean {
	if (typeof window === 'undefined') return false;
	return window.innerWidth < 640;
}

export function isTablet(): boolean {
	if (typeof window === 'undefined') return false;
	const width = window.innerWidth;
	return width >= 640 && width < 1024;
}

export function isDesktop(): boolean {
	if (typeof window === 'undefined') return false;
	return window.innerWidth >= 1024;
}

export function isTouchDevice(): boolean {
	if (typeof window === 'undefined') return false;
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function isIOS(): boolean {
	if (typeof window === 'undefined') return false;
	return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid(): boolean {
	if (typeof window === 'undefined') return false;
	return /Android/.test(navigator.userAgent);
}

export function isSafari(): boolean {
	if (typeof window === 'undefined') return false;
	return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

/**
 * Get safe area insets for devices with notches
 */
export function getSafeAreaInsets() {
	if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 };

	const computedStyle = getComputedStyle(document.documentElement);
	return {
		top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
		right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
		bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
		left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0')
	};
}
