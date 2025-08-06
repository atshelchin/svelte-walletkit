# WalletKit API Documentation

## 1. Installation & Setup

### 1.1 NPM Installation
```bash
npm install walletkit
# or
pnpm add walletkit
# or
yarn add walletkit
```

### 1.2 Standalone Installation
```html
<!-- Latest version -->
<script src="https://cdn.walletkit.io/latest/walletkit.min.js"></script>
<link rel="stylesheet" href="https://cdn.walletkit.io/latest/walletkit.min.css">

<!-- Specific version -->
<script src="https://cdn.walletkit.io/v1.0.0/walletkit.min.js"></script>
```

## 2. Svelte Component API

### 2.1 Basic Usage

```svelte
<script>
  import { WalletKit } from 'walletkit';
  import { mainnet, polygon, arbitrum } from 'walletkit/chains';
</script>

<WalletKit 
  networks={[mainnet, polygon, arbitrum]}
  projectId="your-walletconnect-project-id"
  theme="auto"
  locale="en"
/>
```

### 2.2 Main Component: `<WalletKit>`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `networks` | `Network[]` | `[mainnet]` | Supported networks for the dApp |
| `projectId` | `string` | `undefined` | WalletConnect project ID |
| `theme` | `'light' \| 'dark' \| 'auto' \| Theme` | `'auto'` | Theme configuration |
| `locale` | `string` | `'en'` | Language locale |
| `position` | `Position` | `'bottom-right'` | Widget position (standalone mode) |
| `config` | `WalletKitConfig` | `{}` | Advanced configuration |
| `connectors` | `Connector[]` | `[...]` | Custom wallet connectors |
| `defaultChainId` | `number` | `1` | Default chain to connect |
| `autoConnect` | `boolean` | `true` | Auto-reconnect on page load |

#### Events

```svelte
<WalletKit
  on:connect={(e) => console.log('Connected:', e.detail.address)}
  on:disconnect={() => console.log('Disconnected')}
  on:chainChanged={(e) => console.log('Chain changed:', e.detail.chainId)}
  on:accountChanged={(e) => console.log('Account changed:', e.detail.address)}
  on:error={(e) => console.error('Error:', e.detail.error)}
/>
```

### 2.3 Connect Button Component

```svelte
<script>
  import { ConnectButton } from 'walletkit';
</script>

<ConnectButton
  showBalance={true}
  showNetwork={true}
  showAvatar={true}
  accountModalOpen={false}
  chainModalOpen={false}
  label="Connect Wallet"
  className="custom-button"
/>
```

#### ConnectButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showBalance` | `boolean` | `true` | Display wallet balance |
| `showNetwork` | `boolean` | `true` | Display current network |
| `showAvatar` | `boolean` | `true` | Display ENS avatar |
| `label` | `string` | `'Connect Wallet'` | Button label when disconnected |
| `accountModalOpen` | `boolean` | `false` | Control account modal |
| `chainModalOpen` | `boolean` | `false` | Control chain modal |
| `className` | `string` | `''` | Custom CSS classes |

### 2.4 Composables API (Svelte 5 Runes)

```svelte
<script>
  import { 
    useAccount, 
    useNetwork, 
    useBalance, 
    useConnect,
    useDisconnect,
    useSignMessage,
    useSendTransaction,
    useWaitForTransaction,
    useEnsName,
    useEnsAvatar
  } from 'walletkit';
  
  // Account composable with Svelte 5 runes
  const account = useAccount();
  // account.address, account.connector, account.isConnected, account.isConnecting
  
  // Network composable
  const network = useNetwork();
  // network.chain, network.chains, network.isLoading, network.switchNetwork()
  
  // Balance composable
  const balance = useBalance(() => ({
    address: account.address,
    token: '0x...' // Optional token address
  }));
  // balance.value, balance.formatted, balance.symbol, balance.decimals
  
  // Connect composable
  const connect = useConnect();
  // connect.connect(), connect.connectors, connect.error, connect.isLoading
  
  // Sign message composable
  const signMessage = useSignMessage();
  // signMessage.sign(), signMessage.data, signMessage.error, signMessage.isLoading
</script>
```

### 2.5 State API (Svelte 5 Runes)

```svelte
<script>
  import { 
    walletState, 
    networkState, 
    balanceState,
    transactionState,
    modalState,
    themeState,
    localeState 
  } from 'walletkit/state';
  
  // Access reactive state with Svelte 5 runes
  $effect(() => {
    console.log('Current wallet:', walletState.current);
    console.log('Current network:', networkState.current);
  });
  
  // Update state
  modalState.openConnect();
  themeState.current = 'dark';
  localeState.current = 'zh';
</script>
```

## 3. JavaScript API (Standalone Mode)

### 3.1 Initialization

```javascript
// Auto-initialize with defaults
WalletKit.init();

// Custom initialization
WalletKit.init({
  networks: [
    { chainId: 1, name: 'Ethereum', rpcUrl: 'https://eth.example.com' },
    { chainId: 137, name: 'Polygon', rpcUrl: 'https://polygon.example.com' }
  ],
  projectId: 'your-walletconnect-project-id',
  theme: {
    mode: 'dark',
    primaryColor: '#6366f1',
    borderRadius: 'lg'
  },
  locale: 'en',
  position: 'bottom-right',
  autoConnect: true,
  features: {
    widget: true,
    subscription: true,
    siwe: true
  }
});
```

### 3.2 Core Methods

```javascript
// Connection management
await WalletKit.connect();
await WalletKit.connect('metamask'); // Specific connector
await WalletKit.disconnect();

// Account methods
const account = WalletKit.getAccount();
// { address: '0x...', chainId: 1, isConnected: true }

const balance = await WalletKit.getBalance();
// { value: 1000000000000000000n, formatted: '1.0', symbol: 'ETH' }

// Network methods
const network = WalletKit.getNetwork();
// { chainId: 1, name: 'Ethereum', ... }

await WalletKit.switchNetwork(137); // Switch to Polygon

WalletKit.addNetwork({
  chainId: 42161,
  name: 'Arbitrum',
  rpcUrl: 'https://arb1.arbitrum.io/rpc',
  currency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
});

// Transaction methods
const hash = await WalletKit.sendTransaction({
  to: '0x...',
  value: '1000000000000000000', // 1 ETH in wei
  data: '0x...'
});

const receipt = await WalletKit.waitForTransaction(hash);

// Signing methods
const signature = await WalletKit.signMessage('Hello World');
const typedSig = await WalletKit.signTypedData(typedData);
```

### 3.3 Event Handling

```javascript
// Subscribe to events
WalletKit.on('connect', ({ address, chainId }) => {
  console.log('Connected:', address, 'on chain:', chainId);
});

WalletKit.on('disconnect', () => {
  console.log('Disconnected');
});

WalletKit.on('chainChanged', (chainId) => {
  console.log('Chain changed to:', chainId);
});

WalletKit.on('accountChanged', (accounts) => {
  console.log('Account changed:', accounts[0]);
});

WalletKit.on('error', (error) => {
  console.error('WalletKit error:', error);
});

// Unsubscribe
const unsubscribe = WalletKit.on('connect', handler);
unsubscribe(); // Remove listener
```

### 3.4 Widget Control

```javascript
// Show/hide widget
WalletKit.show();
WalletKit.hide();
WalletKit.toggle();

// Set position
WalletKit.setPosition('top-left');

// Open specific modals
WalletKit.openConnectModal();
WalletKit.openAccountModal();
WalletKit.openNetworkModal();
WalletKit.closeModal();

// Widget state
const isVisible = WalletKit.isVisible();
const isExpanded = WalletKit.isExpanded();
```

### 3.5 SIWE (Sign-In with Ethereum)

```javascript
// Configure SIWE
WalletKit.configureSiwe({
  domain: 'example.com',
  uri: 'https://example.com',
  statement: 'Sign in to Example App',
  version: '1',
  chainId: 1,
  nonce: async () => fetch('/api/nonce').then(r => r.text()),
  verify: async (message, signature) => {
    const response = await fetch('/api/verify', {
      method: 'POST',
      body: JSON.stringify({ message, signature })
    });
    return response.ok;
  }
});

// Sign in
const session = await WalletKit.signIn();
// { address: '0x...', chainId: 1, ... }

// Sign out
await WalletKit.signOut();

// Check session
const isSignedIn = WalletKit.isSignedIn();
const session = WalletKit.getSession();
```

### 3.6 Subscription System

```javascript
// Configure subscription contract with network
WalletKit.configureSubscription({
  contractAddress: '0x1234...', // Contract address
  chainId: 137, // Polygon network
  abi: [...], // Contract ABI
  plans: [
    { 
      id: 1, 
      name: 'Basic', 
      price: '10000000000000000', // 0.01 ETH
      duration: 30, // days
      features: ['feature1', 'feature2']
    },
    { 
      id: 2, 
      name: 'Pro', 
      price: '50000000000000000', // 0.05 ETH
      duration: 30,
      features: ['feature1', 'feature2', 'feature3']
    }
  ],
  // Optional: Custom payment tokens
  paymentToken: {
    address: '0xUSDC...', // USDC on Polygon
    symbol: 'USDC',
    decimals: 6
  }
});

// Check subscription status (auto-switches to correct network)
const status = await WalletKit.checkSubscription();
// { 
//   isActive: true, 
//   plan: 'Pro', 
//   expiresAt: 1234567890,
//   chainId: 137,
//   features: ['feature1', 'feature2', 'feature3']
// }

// Subscribe to a plan (handles network switching)
await WalletKit.subscribe({
  planId: 2,
  duration: 30, // days
  autoSwitch: true // Auto-switch to subscription network
});

// Cancel subscription
await WalletKit.cancelSubscription();

// Listen to subscription events
WalletKit.on('subscriptionChanged', (status) => {
  console.log('Subscription status:', status);
});

// Communication with host application
WalletKit.subscription.query((query) => {
  switch(query.type) {
    case 'hasValidSubscription':
      return status.isActive;
    case 'getSubscriptionLevel':
      return status.plan;
    case 'getFeatures':
      return status.features;
    case 'requiresSubscription':
      if (!status.isActive) {
        WalletKit.openSubscriptionModal();
        return false;
      }
      return true;
  }
});

// Host application communication
window.WalletKit.subscription.check(); // Returns subscription status
window.WalletKit.subscription.require(); // Opens modal if no subscription
window.WalletKit.subscription.hasFeature('premium'); // Check specific feature
```

### 3.7 Widget Communication API

```javascript
// Initialize widget with subscription focus
WalletKit.init({
  widget: {
    mode: 'subscription', // Focus on subscription features
    position: 'bottom-right',
    theme: 'dark',
    autoExpand: false,
    showOnLoad: true
  },
  subscription: {
    contractAddress: '0x...',
    chainId: 137,
    abi: [...],
    enforceSubscription: true, // Block features without subscription
    gracePeriod: 3, // Days after expiration
    trialDuration: 7 // Free trial days
  }
});

// Host application queries widget
const api = window.WalletKit;

// Authentication queries
api.isConnected(); // Check wallet connection
api.isAuthenticated(); // Check SIWE authentication
api.requireAuth(); // Request authentication (opens modal if needed)

// Subscription queries
api.hasSubscription(); // Check active subscription
api.getSubscriptionTier(); // Get current tier (basic/pro/enterprise)
api.canAccessFeature('advanced-analytics'); // Feature gate check
api.requireSubscription(); // Request subscription (opens modal if needed)

// User actions
api.promptConnect(); // Show connect modal
api.promptSubscribe(); // Show subscription modal
api.promptUpgrade(); // Show upgrade modal

// Listen to widget events from host
api.on('userConnected', (data) => {
  console.log('User connected:', data.address);
  // Enable features
});

api.on('subscriptionPurchased', (data) => {
  console.log('Subscription purchased:', data.plan);
  // Unlock premium features
});

api.on('authenticationComplete', (session) => {
  console.log('User authenticated:', session);
  // Store session
});

// Advanced communication patterns
api.communicate({
  action: 'checkAccess',
  feature: 'premium-charts',
  callback: (hasAccess) => {
    if (hasAccess) {
      showPremiumCharts();
    } else {
      api.promptSubscribe({
        message: 'Premium charts require a Pro subscription',
        highlightPlan: 'pro'
      });
    }
  }
});

// Programmatic control
api.setSubscriptionMessage('Subscribe to unlock all features');
api.setTrialMessage('Start your 7-day free trial');
api.showNotification('Your subscription expires in 3 days');
```

### 3.8 Cross-Frame Communication

```javascript
// Widget iframe communication protocol
WalletKit.init({
  iframe: {
    sandbox: 'allow-scripts allow-same-origin',
    csp: "default-src 'self'",
    origin: 'https://widget.walletkit.io'
  },
  messaging: {
    allowedOrigins: ['https://app.example.com'],
    timeout: 5000
  }
});

// Host -> Widget messages
window.WalletKit.postMessage({
  type: 'CHECK_SUBSCRIPTION',
  payload: { userId: '123' }
});

window.WalletKit.postMessage({
  type: 'REQUIRE_AUTH',
  payload: { 
    message: 'Please sign in to continue',
    redirectUrl: '/dashboard'
  }
});

// Widget -> Host messages
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://widget.walletkit.io') return;
  
  const { type, payload } = event.data;
  
  switch(type) {
    case 'WALLET_CONNECTED':
      handleWalletConnect(payload.address, payload.chainId);
      break;
      
    case 'SUBSCRIPTION_STATUS':
      updateSubscriptionUI(payload.isActive, payload.tier);
      break;
      
    case 'AUTH_SUCCESS':
      handleAuthSuccess(payload.session);
      break;
      
    case 'TRANSACTION_SENT':
      trackTransaction(payload.hash);
      break;
      
    case 'ERROR':
      handleError(payload.error);
      break;
  }
});

// Secure handshake
WalletKit.establishConnection({
  secret: 'shared-secret',
  onReady: () => {
    console.log('Widget ready');
    // Start communication
  },
  onError: (error) => {
    console.error('Widget connection failed:', error);
  }
});
```

## 4. Configuration API

### 4.1 WalletKitConfig Interface

```typescript
interface WalletKitConfig {
  // Network configuration
  networks: Network[];
  defaultChainId?: number;
  supportedChainIds?: number[]; // Restrict to specific chains
  
  // RPC configuration
  rpc?: {
    [chainId: number]: string | string[] | RpcConfig;
  };
  rpcLoadBalancing?: boolean;
  rpcHealthCheck?: boolean;
  rpcTimeout?: number;
  
  // Connector configuration
  connectors?: Connector[];
  walletConnectProjectId?: string;
  walletConnectMetadata?: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
  
  // UI configuration
  theme?: ThemeConfig;
  locale?: string;
  position?: Position;
  modal?: {
    size?: 'sm' | 'md' | 'lg';
    backdrop?: boolean;
    closeOnEsc?: boolean;
    closeOnBackdropClick?: boolean;
  };
  
  // Features
  features?: {
    widget?: boolean;
    siwe?: boolean;
    subscription?: boolean;
    ens?: boolean;
    analytics?: boolean;
  };
  
  // Behavior
  autoConnect?: boolean;
  autoReconnect?: boolean;
  cacheProvider?: boolean;
  debug?: boolean;
}
```

### 4.2 Network Configuration

```typescript
interface Network {
  chainId: number;
  name: string;
  network?: string; // 'mainnet', 'testnet', etc.
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: string;
    public?: string;
    websocket?: string;
  };
  blockExplorers?: {
    default: {
      name: string;
      url: string;
    };
  };
  iconUrl?: string;
  testnet?: boolean;
}

// Predefined networks
import { 
  mainnet, 
  goerli, 
  sepolia,
  polygon, 
  polygonMumbai,
  arbitrum, 
  arbitrumGoerli,
  optimism, 
  optimismGoerli,
  base,
  baseGoerli,
  bsc,
  bscTestnet,
  avalanche,
  fantom,
  gnosis
} from 'walletkit/chains';
```

### 4.3 Theme Configuration

```typescript
interface ThemeConfig {
  mode?: 'light' | 'dark' | 'auto';
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    surface?: string;
    text?: string;
    textSecondary?: string;
    border?: string;
    error?: string;
    warning?: string;
    success?: string;
    info?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: {
      xs?: string;
      sm?: string;
      md?: string;
      lg?: string;
      xl?: string;
    };
    fontWeight?: {
      light?: number;
      regular?: number;
      medium?: number;
      bold?: number;
    };
  };
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  borderRadius?: {
    none?: string;
    sm?: string;
    md?: string;
    lg?: string;
    full?: string;
  };
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  transitions?: {
    fast?: string;
    normal?: string;
    slow?: string;
  };
}

// Predefined themes
import { lightTheme, darkTheme, midnightTheme } from 'walletkit/themes';
```

### 4.4 Connector Configuration

```typescript
interface ConnectorConfig {
  id: string;
  name: string;
  icon?: string;
  priority?: number;
  hidden?: boolean;
  
  // Connector-specific options
  options?: {
    // InjectedConnector
    shimDisconnect?: boolean;
    getProvider?: () => any;
    
    // WalletConnectConnector
    qrcode?: boolean;
    projectId?: string;
    metadata?: AppMetadata;
    
    // CoinbaseWalletConnector
    appName?: string;
    appLogoUrl?: string;
    darkMode?: boolean;
  };
}

// Creating custom connectors
class CustomConnector implements Connector {
  readonly id = 'custom';
  readonly name = 'Custom Wallet';
  readonly ready = true;
  
  async connect(): Promise<Account> {
    // Implementation
  }
  
  async disconnect(): Promise<void> {
    // Implementation
  }
  
  // ... other required methods
}
```

## 5. Advanced API

### 5.1 Provider Access

```javascript
// Get raw provider
const provider = WalletKit.getProvider();

// Use with viem
import { createPublicClient, createWalletClient, custom } from 'viem';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: custom(provider)
});

const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(provider)
});

// Direct provider requests
const blockNumber = await provider.request({
  method: 'eth_blockNumber'
});
```

### 5.2 Custom RPC Configuration

```javascript
WalletKit.configureRpc({
  1: {
    urls: [
      'https://eth-mainnet.g.alchemy.com/v2/KEY',
      'https://mainnet.infura.io/v3/KEY',
      'https://rpc.ankr.com/eth'
    ],
    loadBalancing: 'round-robin', // or 'random', 'fastest'
    healthCheck: {
      enabled: true,
      interval: 30000, // 30 seconds
      timeout: 5000
    }
  },
  137: 'https://polygon-rpc.com' // Simple string config
});

// Add custom RPC at runtime
WalletKit.addRpc(1, 'https://custom-eth-rpc.com');

// Test RPC endpoint
const isHealthy = await WalletKit.testRpc('https://eth.example.com');
```

### 5.3 ENS Integration

```javascript
// Resolve ENS names
const address = await WalletKit.resolveEnsName('vitalik.eth');

// Reverse resolution
const ensName = await WalletKit.lookupEnsName('0x...');

// Get ENS avatar
const avatarUrl = await WalletKit.getEnsAvatar('vitalik.eth');

// Get ENS records
const records = await WalletKit.getEnsRecords('vitalik.eth', [
  'avatar',
  'email',
  'url',
  'twitter',
  'github'
]);
```

### 5.4 Plugin System

```javascript
// Create a plugin
const myPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  install(walletKit) {
    // Add custom functionality
    walletKit.myCustomMethod = () => {
      console.log('Custom method called');
    };
    
    // Hook into events
    walletKit.on('connect', () => {
      console.log('Plugin: User connected');
    });
    
    // Add custom connector
    walletKit.addConnector(new MyCustomConnector());
  }
};

// Install plugin
WalletKit.use(myPlugin);

// Use plugin functionality
WalletKit.myCustomMethod();
```

### 5.5 Analytics Integration

```javascript
WalletKit.configureAnalytics({
  provider: 'google', // or 'mixpanel', 'segment', 'custom'
  trackingId: 'GA-XXXXX',
  events: {
    walletConnected: true,
    walletDisconnected: true,
    networkSwitched: true,
    transactionSent: true,
    transactionFailed: true
  },
  customTracker: (event, data) => {
    // Custom tracking implementation
    console.log('Track:', event, data);
  }
});

// Manual tracking
WalletKit.track('custom_event', {
  category: 'engagement',
  value: 123
});
```

### 5.6 Multi-Chain Support

```javascript
// Connect to multiple chains simultaneously
const connections = await WalletKit.connectMultiChain([1, 137, 42161]);

// Get accounts for all chains
const accounts = WalletKit.getMultiChainAccounts();
// { 1: '0x...', 137: '0x...', 42161: '0x...' }

// Switch between chain contexts
WalletKit.setActiveChain(137);

// Execute on specific chain
const result = await WalletKit.onChain(42161, async () => {
  return WalletKit.sendTransaction({...});
});
```

## 6. TypeScript Support

### 6.1 Type Definitions

```typescript
import type {
  WalletKitConfig,
  Network,
  Connector,
  Account,
  Transaction,
  TransactionReceipt,
  Theme,
  Locale,
  SubscriptionPlan,
  SiweMessage
} from 'walletkit';
```

### 6.2 Generic Types

```typescript
// Custom network type
interface CustomNetwork extends Network {
  customField: string;
}

// Type-safe configuration
const config: WalletKitConfig<CustomNetwork> = {
  networks: [
    {
      chainId: 1,
      name: 'Ethereum',
      customField: 'value',
      // ... other required fields
    }
  ]
};
```

### 6.3 Event Types

```typescript
interface WalletKitEvents {
  connect: { address: string; chainId: number };
  disconnect: void;
  chainChanged: number;
  accountChanged: string[];
  error: Error;
  message: { type: string; data: any };
}

// Type-safe event handling
WalletKit.on<keyof WalletKitEvents>('connect', (data) => {
  // data is typed as { address: string; chainId: number }
});
```

## 7. Error Handling

### 7.1 Error Types

```typescript
class WalletKitError extends Error {
  code: string;
  details?: any;
}

// Specific error types
class ConnectionError extends WalletKitError {}
class NetworkError extends WalletKitError {}
class TransactionError extends WalletKitError {}
class SignatureError extends WalletKitError {}
```

### 7.2 Error Codes

```javascript
// Common error codes
const ErrorCodes = {
  USER_REJECTED: 'user_rejected',
  UNAUTHORIZED: 'unauthorized',
  UNSUPPORTED_CHAIN: 'unsupported_chain',
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  NETWORK_ERROR: 'network_error',
  INVALID_PARAMS: 'invalid_params',
  INTERNAL_ERROR: 'internal_error'
};

// Error handling
try {
  await WalletKit.connect();
} catch (error) {
  if (error.code === ErrorCodes.USER_REJECTED) {
    console.log('User rejected connection');
  } else if (error.code === ErrorCodes.UNSUPPORTED_CHAIN) {
    console.log('Chain not supported');
  } else {
    console.error('Unknown error:', error);
  }
}
```

## 8. Migration Guide

### 8.1 From RainbowKit

```javascript
// RainbowKit
import { ConnectButton } from '@rainbow-me/rainbowkit';
<ConnectButton />

// WalletKit
import { ConnectButton } from 'walletkit';
<ConnectButton />
```

### 8.2 From Web3Modal

```javascript
// Web3Modal
const web3Modal = new Web3Modal({...});
await web3Modal.connect();

// WalletKit
WalletKit.init({...});
await WalletKit.connect();
```

### 8.3 From Custom Implementation

```javascript
// Before: Direct provider usage
const provider = window.ethereum;
const accounts = await provider.request({ method: 'eth_requestAccounts' });

// After: WalletKit
await WalletKit.connect();
const { address } = WalletKit.getAccount();
```

## 9. Best Practices

### 9.1 Initialization
```javascript
// Initialize once at app startup
if (typeof window !== 'undefined') {
  WalletKit.init({
    // Configuration
  });
}
```

### 9.2 Error Boundaries (Svelte 5)
```svelte
<script>
  import { ErrorBoundary } from 'walletkit';
  
  let { config } = $props();
</script>

<ErrorBoundary>
  <WalletKit {...config} />
</ErrorBoundary>
```

### 9.3 Performance
```javascript
// Lazy load for better performance
const WalletKit = await import('walletkit');

// Preload critical assets
WalletKit.preload(['metamask', 'walletconnect']);
```

### 9.4 Security
```javascript
// Always verify signatures server-side
const isValid = await fetch('/api/verify-signature', {
  method: 'POST',
  body: JSON.stringify({ message, signature })
}).then(r => r.json());
```

## 10. Troubleshooting

### 10.1 Debug Mode
```javascript
WalletKit.init({
  debug: true, // Enable debug logging
  logLevel: 'verbose' // 'error' | 'warn' | 'info' | 'verbose'
});

// Get debug information
const debugInfo = WalletKit.getDebugInfo();
console.log(debugInfo);
```

### 10.2 Common Issues

| Issue | Solution |
|-------|----------|
| Wallet not detected | Ensure wallet extension is installed and unlocked |
| Connection timeout | Check network connectivity and RPC endpoints |
| Transaction failing | Verify gas settings and account balance |
| Modal not showing | Check CSP settings and DOM mounting |
| Style conflicts | Use scoped styles or increase specificity |

### 10.3 Support Channels
- GitHub Issues: https://github.com/walletkit/walletkit/issues
- Discord: https://discord.gg/walletkit
- Documentation: https://docs.walletkit.io
- Examples: https://github.com/walletkit/examples