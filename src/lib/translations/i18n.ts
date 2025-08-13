import { registerBuiltInTranslations, setupI18n } from '@shelchin/svelte-i18n';

// 导入包的内置翻译
import pkgWalletkitEn from './@shelchin/svelte-walletkit/en.json' with { type: 'json' };
import pkgWalletkitZh from './@shelchin/svelte-walletkit/zh.json' with { type: 'json' };
import pkgWalletkitJa from './@shelchin/svelte-walletkit/ja.json' with { type: 'json' };
const translations = {
	en: pkgWalletkitEn,
	zh: pkgWalletkitZh,
	ja: pkgWalletkitJa
};

// 注册内置翻译
registerBuiltInTranslations({
	'@shelchin/svelte-i18n': translations
});

// i18nConfig 配置
const i18nConfig = {
	defaultLocale: 'en',
	fallbackLocale: 'en',
	interpolation: {
		prefix: '{',
		suffix: '}'
	},
	formats: {
		date: { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const },
		time: { hour: '2-digit' as const, minute: '2-digit' as const },
		number: { minimumFractionDigits: 0, maximumFractionDigits: 2 },
		currency: { style: 'currency' as const, currency: 'USD' }
	}
};

// 导出 i18n 实例
function createI18nInstance() {
	const instance = setupI18n(i18nConfig);
	// Load built-in translations synchronously
	for (const [locale, translations] of Object.entries(packageTranslations)) {
		// @ts-expect-error - loadLanguageSync is not in the interface but exists on the implementation
		instance.loadLanguageSync(locale, translations);
	}
	return instance;
}

export const i18n = createI18nInstance();
