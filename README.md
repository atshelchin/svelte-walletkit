# WalletKit

<div align="center">
  <h3>Modern Ethereum Wallet Connection Library for Svelte</h3>
  <p>Lightweight, customizable, and feature-rich wallet connection solution</p>
  
  <p>
    <a href="https://www.npmjs.com/package/@shelchin/walletkit"><img src="https://img.shields.io/npm/v/@shelchin/walletkit.svg" alt="npm version"></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
    <a href="https://bundlephobia.com/package/@shelchin/walletkit"><img src="https://img.shields.io/bundlephobia/minzip/@shelchin/walletkit" alt="Bundle Size"></a>
  </p>
</div>

[English](./README.md) | [简体中文](./README-zh.md)

## ✨ Features

- 🚀 **Lightweight** - Built with Viem instead of Wagmi, core library < 50KB gzipped
- 🌍 **Multi-Chain Support** - Seamless network switching with RPC load balancing
- 🔐 **Extensive Wallet Support** - MetaMask, WalletConnect, Coinbase, Safe, Ledger, and EIP-6963 auto-detection
- 🎨 **Fully Customizable** - Complete theming system with dark mode support
- 🌐 **i18n Ready** - Built-in internationalization support
- 📱 **Mobile Optimized** - Responsive design with touch-friendly interactions
- 🔧 **Framework Agnostic** - Use as NPM package or standalone script
- 🛡️ **Type Safe** - Full TypeScript support with comprehensive type definitions

## 📦 Installation

### NPM Package (for Svelte apps)

```bash
npm install @shelchin/walletkit
# or
pnpm add @shelchin/walletkit
# or
yarn add @shelchin/walletkit
```

### Standalone Script (for any website)

```html
<script src="https://unpkg.com/@shelchin/walletkit/dist/standalone.js"></script>
```

## 🚀 Quick Start

### Svelte Component

```svelte
<script>
  import { WalletKit, WalletButton } from '@shelchin/walletkit';
  
  const config = {
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Required for WalletConnect
    networks: [1, 137, 42161], // Ethereum, Polygon, Arbitrum
    theme: 'auto', // 'light' | 'dark' | 'auto'
    locale: 'en' // 'en' | 'zh'
  };
</script>

<WalletKit {config}>
  <WalletButton />
</WalletKit>
```

### Standalone Usage

```html
<div id="wallet-container"></div>

<script src="https://unpkg.com/@shelchin/walletkit/dist/standalone.js"></script>
<script>
  WalletKit.init({
    containerId: 'wallet-container',
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
    theme: 'dark',
    networks: [1, 137, 42161]
  });
</script>
```

## 🛠️ Advanced Configuration

### Complete Configuration Options

```typescript
interface WalletKitConfig {
  // WalletConnect Project ID (required for WalletConnect)
  projectId?: string;
  
  // Supported networks (chain IDs)
  networks?: number[];
  
  // Custom RPC endpoints
  rpcUrls?: Record<number, string[]>;
  
  // Theme configuration
  theme?: 'light' | 'dark' | 'auto' | ThemeConfig;
  
  // Localization
  locale?: 'en' | 'zh' | LocaleConfig;
  
  // Wallet options
  wallets?: {
    includeDefault?: boolean;
    custom?: WalletConfig[];
  };
  
  // Features
  features?: {
    ensResolution?: boolean;
    siwe?: boolean; // Sign-In with Ethereum
    analytics?: boolean;
  };
  
  // Custom modal options
  modal?: {
    disableBackdropClick?: boolean;
    showRecentTransactions?: boolean;
  };
}
```

### Custom Theme

```javascript
const customTheme = {
  colors: {
    primary: '#6366f1',
    background: '#ffffff',
    text: '#111827',
    border: '#e5e7eb'
  },
  radius: {
    button: '0.75rem',
    modal: '1.5rem'
  },
  fonts: {
    base: 'Inter, system-ui, sans-serif'
  }
};

WalletKit.init({
  theme: customTheme
});
```

### Custom Networks

```javascript
const customNetworks = {
  networks: [1, 137, 42161, 56], // Include BSC
  rpcUrls: {
    1: ['https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY'],
    137: ['https://polygon-rpc.com'],
    42161: ['https://arb1.arbitrum.io/rpc'],
    56: ['https://bsc-dataseed.binance.org']
  }
};
```

## 📱 Mobile Support

WalletKit is fully optimized for mobile devices with:

- Touch-friendly interface
- Bottom sheet modals on mobile
- QR code scanning for WalletConnect
- Deep linking support
- Responsive design

## 🎨 Theming

### Built-in Themes

- **Light** - Clean and modern light theme
- **Dark** - Eye-friendly dark theme
- **Auto** - Follows system preferences

### Custom Theming

```javascript
import { createTheme } from '@shelchin/walletkit';

const myTheme = createTheme({
  primary: '#8b5cf6',
  secondary: '#ec4899',
  borderRadius: 'lg',
  fontFamily: 'Roboto, sans-serif'
});
```

## 🌍 Internationalization

### Supported Languages

- English (en)
- 简体中文 (zh)

### Custom Translations

```javascript
const customLocale = {
  connect: 'Connect Wallet',
  disconnect: 'Disconnect',
  switchNetwork: 'Switch Network',
  copyAddress: 'Copy Address',
  // ... more translations
};

WalletKit.init({
  locale: customLocale
});
```

## 🔌 API Reference

### Core Methods

```typescript
// Initialize WalletKit
WalletKit.init(config: WalletKitConfig): void

// Connect wallet
WalletKit.connect(): Promise<WalletConnection>

// Disconnect wallet
WalletKit.disconnect(): Promise<void>

// Get current account
WalletKit.getAccount(): Address | null

// Switch network
WalletKit.switchNetwork(chainId: number): Promise<void>

// Sign message
WalletKit.signMessage(message: string): Promise<string>

// Send transaction
WalletKit.sendTransaction(tx: TransactionRequest): Promise<string>
```

### Event Listeners

```javascript
// Account change
WalletKit.onAccountChange((account) => {
  console.log('Account changed:', account);
});

// Network change
WalletKit.onChainChange((chainId) => {
  console.log('Network changed:', chainId);
});

// Connection status
WalletKit.onConnectionChange((connected) => {
  console.log('Connection status:', connected);
});
```

### Svelte Stores

```javascript
import { 
  account, 
  chainId, 
  connected, 
  connecting 
} from '@shelchin/walletkit';

// Use in Svelte components
$: currentAccount = $account;
$: currentChain = $chainId;
$: isConnected = $connected;
```

## 🏗️ Architecture

WalletKit follows Clean Architecture principles:

```
src/
├── lib/
│   ├── domain/          # Business logic & types
│   ├── application/     # Use cases & services
│   ├── infrastructure/  # External integrations
│   └── presentation/    # UI components
├── standalone/          # Standalone build entry
└── routes/             # Demo pages
```

## 🧪 Development

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build library
pnpm build

# Lint & format
pnpm lint
pnpm format
```

### Testing

```bash
# Unit tests
pnpm test:unit

# E2E tests
pnpm test:e2e

# Type checking
pnpm check
```

## 📄 License

MIT © 2025 WalletKit

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/@shelchin/walletkit)
- [GitHub Repository](https://github.com/shelchin2023/walletkit)
- [Live Demo](https://walletkit-demo.netlify.app)

## 💖 Sponsors

Special thanks to all our sponsors and contributors!

---

<div align="center">
  Made with ❤️ by the WalletKit team
</div>