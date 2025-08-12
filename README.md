# WalletKit

[![npm version](https://img.shields.io/npm/v/@shelchin/walletkit.svg)](https://www.npmjs.com/package/@shelchin/walletkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/atshelchin/walletkit/actions/workflows/ci.yml/badge.svg)](https://github.com/atshelchin/walletkit/actions/workflows/ci.yml)
[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://atshelchin.github.io/walletkit)

A modern, lightweight Ethereum wallet connection library for Svelte applications with dual usage modes - as an NPM package for Svelte apps or as a standalone widget for any HTML page.

## ✨ Features

- 🎯 **Dual Usage Modes**: NPM package for Svelte apps AND standalone JavaScript for any HTML page
- 🚀 **Lightweight**: Built with viem instead of wagmi for significantly smaller bundle size
- 🌐 **Advanced Network Management**: RPC load balancing, custom networks, multi-chain support
- 💼 **Extensive Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, Safe, Ledger, and all EIP-6963 wallets
- 🔐 **Security First**: SIWE authentication, encrypted sessions, input validation
- 🎨 **Full Customization**: Complete theming system, i18n support, widget mode
- 📱 **Mobile Optimized**: Responsive design, mobile wallet deep linking
- 🔥 **Developer Experience**: Full TypeScript support, comprehensive docs, event-driven architecture

## 📦 Installation

### NPM Package (Recommended for Svelte Apps)

```bash
npm install @shelchin/walletkit
# or
pnpm add @shelchin/walletkit
# or
yarn add @shelchin/walletkit
```

### Standalone Widget (For Any HTML Page)

```html
<!-- Add to your HTML -->
<script src="https://unpkg.com/@shelchin/walletkit/dist/widget.umd.cjs"></script>
```

## 🚀 Quick Start

### Svelte Application

```svelte
<script>
	import { WalletKit } from '@shelchin/walletkit';
	import { onMount } from 'svelte';

	let walletKit;

	onMount(() => {
		walletKit = new WalletKit({
			projectId: 'your-walletconnect-project-id', // Get from https://cloud.walletconnect.com
			networks: [1, 137, 56], // Ethereum, Polygon, BSC
			theme: 'auto', // 'light', 'dark', or 'auto'
			locale: 'en' // 'en', 'zh', etc.
		});
	});

	async function connectWallet() {
		const account = await walletKit.connect();
		console.log('Connected:', account);
	}
</script>

<button on:click={connectWallet}> Connect Wallet </button>
```

### Standalone Widget

```html
<!DOCTYPE html>
<html>
	<head>
		<title>WalletKit Example</title>
	</head>
	<body>
		<!-- Your content -->

		<!-- Add WalletKit widget -->
		<script src="https://unpkg.com/@shelchin/walletkit/dist/widget.umd.cjs"></script>
		<script>
			// Initialize the widget
			WalletKitWidget.init({
				position: { side: 'right' }, // 'left' or 'right'
				theme: 'light',
				networks: [1, 137],
				projectId: 'your-walletconnect-project-id'
			});

			// Listen for wallet events
			WalletKitWidget.on('connect', (account) => {
				console.log('Wallet connected:', account);
			});

			WalletKitWidget.on('disconnect', () => {
				console.log('Wallet disconnected');
			});
		</script>
	</body>
</html>
```

## 🛠️ Configuration

### WalletKit Options

```typescript
interface WalletKitConfig {
	// Required
	projectId?: string; // WalletConnect project ID

	// Network Configuration
	networks?: number[]; // Chain IDs to support
	defaultNetwork?: number; // Default chain ID
	rpcUrls?: Record<number, string[]>; // Custom RPC URLs

	// UI Configuration
	theme?: 'light' | 'dark' | 'auto';
	locale?: 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr';
	position?: { side: 'left' | 'right' };

	// Features
	enableAnalytics?: boolean;
	enableSIWE?: boolean; // Sign-In with Ethereum
	enableENS?: boolean; // ENS resolution

	// Callbacks
	onConnect?: (account: string) => void;
	onDisconnect?: () => void;
	onNetworkChange?: (chainId: number) => void;
}
```

## 📚 API Reference

### Core Methods

```typescript
// Connect wallet
const account = await walletKit.connect();

// Disconnect wallet
await walletKit.disconnect();

// Get current account
const account = walletKit.getAccount();

// Get current network
const chainId = walletKit.getChainId();

// Switch network
await walletKit.switchNetwork(137); // Switch to Polygon

// Sign message
const signature = await walletKit.signMessage('Hello World');

// Send transaction
const hash = await walletKit.sendTransaction({
	to: '0x...',
	value: '1000000000000000000', // 1 ETH in wei
	data: '0x'
});
```

### Widget-Specific Methods

```javascript
// Show/hide widget
WalletKitWidget.show();
WalletKitWidget.hide();

// Update configuration
WalletKitWidget.updateConfig({ theme: 'dark' });

// Destroy widget
WalletKitWidget.destroy();
```

## 🎨 Theming

### Using CSS Variables

```css
:root {
	--walletkit-primary: #667eea;
	--walletkit-primary-hover: #5a67d8;
	--walletkit-background: #ffffff;
	--walletkit-text: #333333;
	--walletkit-border: #e2e8f0;
	--walletkit-radius: 8px;
	--walletkit-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Custom Theme Object

```javascript
const customTheme = {
	colors: {
		primary: '#667eea',
		background: '#ffffff',
		text: '#333333',
		border: '#e2e8f0'
	},
	fonts: {
		body: 'Inter, sans-serif'
	},
	radii: {
		button: '8px',
		modal: '12px'
	}
};

walletKit.setTheme(customTheme);
```

## 🌍 Internationalization

Supports multiple languages out of the box:

```javascript
// Change language
walletKit.setLocale('zh'); // Switch to Chinese

// Available locales
// 'en' - English (default)
// 'zh' - Chinese
// 'ja' - Japanese
// 'ko' - Korean
// 'es' - Spanish
// 'fr' - French
```

## 🔧 Development

### Setup

```bash
# Clone the repository
git clone https://github.com/atshelchin/walletkit.git
cd walletkit

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build

```bash
# Build library for NPM
pnpm build:lib

# Build standalone widget
pnpm build:widget

# Build documentation site
pnpm build:docs

# Build everything
pnpm build
```

### Testing

```bash
# Run unit tests
pnpm test:unit

# Run E2E tests
pnpm test:e2e

# Run all tests
pnpm test
```

## 📋 Supported Wallets

- **Injected Wallets**: MetaMask, Brave Wallet, Opera Wallet, etc.
- **WalletConnect**: 300+ wallets via WalletConnect protocol
- **Coinbase Wallet**: Including Smart Wallet support
- **Safe**: Gnosis Safe multi-sig wallets
- **Ledger**: Hardware wallet support
- **Trezor**: Hardware wallet support
- **EIP-6963**: Auto-detection of installed wallets

## 🌐 Supported Networks

Default support for:

- Ethereum Mainnet
- Polygon
- Binance Smart Chain
- Arbitrum
- Optimism
- Avalanche
- And more...

Easy to add custom networks:

```javascript
walletKit.addNetwork({
	chainId: 42161,
	name: 'Arbitrum One',
	rpcUrls: ['https://arb1.arbitrum.io/rpc'],
	nativeCurrency: {
		name: 'Ether',
		symbol: 'ETH',
		decimals: 18
	},
	blockExplorers: ['https://arbiscan.io']
});
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Svelte](https://svelte.dev) and [SvelteKit](https://kit.svelte.dev)
- Ethereum interactions powered by [viem](https://viem.sh)
- Wallet connections via [WalletConnect](https://walletconnect.com)
- UI components styled with [Tailwind CSS](https://tailwindcss.com)

## 📞 Support

- 📧 Email: support@walletkit.io
- 💬 Discord: [Join our community](https://discord.gg/walletkit)
- 🐦 Twitter: [@walletkit](https://twitter.com/walletkit)
- 📖 Documentation: [https://atshelchin.github.io/walletkit](https://atshelchin.github.io/walletkit)
- 🐛 Issues: [GitHub Issues](https://github.com/atshelchin/walletkit/issues)

---

<p align="center">Made with ❤️ by the WalletKit Team</p>
