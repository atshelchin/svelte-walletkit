# WalletKit Technical Architecture

## 1. System Overview

WalletKit employs a layered architecture pattern with clear separation of concerns, enabling both NPM package usage and standalone JavaScript deployment. The architecture prioritizes modularity, testability, and minimal dependencies while maintaining maximum flexibility.

```
┌─────────────────────────────────────────────────────┐
│                   Application Layer                  │
│  (Svelte Components / Standalone Widget)             │
├─────────────────────────────────────────────────────┤
│                   Core Services Layer                │
│  (State Management / Event System / i18n / Theme)    │
├─────────────────────────────────────────────────────┤
│                   Provider Layer                     │
│  (Wallet Connectors / Network Manager / RPC Client)  │
├─────────────────────────────────────────────────────┤
│                   Foundation Layer                   │
│  (viem / WalletConnect / Crypto Utilities)          │
└─────────────────────────────────────────────────────┘
```

## 2. Core Architecture Patterns

### 2.1 Rune-Based State Management (Svelte 5)

Using Svelte 5's runes for reactive state management:

```typescript
// Centralized state with runes
class WalletState {
  connected = $state(false);
  address = $state<string | null>(null);
  chainId = $state(1);
  balance = $state<bigint>(0n);
  connector = $state<Connector | null>(null);
  
  // Derived state
  isConnected = $derived(this.connected && this.address !== null);
  
  // Methods
  connect(connector: Connector, address: string) {
    this.connector = connector;
    this.address = address;
    this.connected = true;
  }
  
  disconnect() {
    this.connected = false;
    this.address = null;
    this.connector = null;
  }
}

class NetworkState {
  current = $state<Network>(mainnet);
  available = $state<Network[]>([]);
  supported = $state<Network[]>([]);
  rpcs = $state<Map<number, RpcEndpoint[]>>(new Map());
  
  // Derived state
  currentChainId = $derived(this.current.chainId);
  isSupported = $derived((chainId: number) => 
    this.supported.some(n => n.chainId === chainId)
  );
}
```

### 2.2 Event-Driven Architecture

A unified event system for cross-component communication:

```typescript
class EventBus {
  // Core events
  - accountChanged
  - chainChanged
  - connect
  - disconnect
  - message
  - error
}
```

### 2.3 Connector Pattern

Abstract interface for all wallet connection methods:

```typescript
interface Connector {
  id: string;
  name: string;
  icon: string;
  
  connect(): Promise<Account>;
  disconnect(): Promise<void>;
  switchChain(chainId: number): Promise<void>;
  signMessage(message: string): Promise<string>;
  sendTransaction(tx: Transaction): Promise<Hash>;
}
```

## 3. Module Architecture

### 3.1 Core Modules

#### 3.1.1 WalletManager (Svelte 5)
```typescript
class WalletManager {
  private connectors = new Map<string, Connector>();
  private activeConnector = $state<Connector | null>(null);
  state = new WalletState(); // Using rune-based state class
  
  async connect(connectorId: string): Promise<void>;
  async disconnect(): Promise<void>;
  async switchAccount(address: string): Promise<void>;
  getConnectors(): Connector[];
  
  // Effect for auto-reconnect
  constructor() {
    $effect(() => {
      if (this.state.connected) {
        this.persistConnection();
      }
    });
  }
}
```

#### 3.1.2 NetworkManager (Svelte 5)
```typescript
class NetworkManager {
  private networks = new Map<number, Network>();
  private rpcManager: RpcManager;
  state = new NetworkState(); // Using rune-based state class
  
  addNetwork(network: Network): void;
  removeNetwork(chainId: number): void;
  async switchNetwork(chainId: number): Promise<void>;
  getSupportedNetworks(): Network[];
  validateNetwork(chainId: number): boolean;
  
  // Reactive network validation
  isCurrentValid = $derived(() => 
    this.validateNetwork(this.state.currentChainId)
  );
}
```

#### 3.1.3 RpcManager
```typescript
class RpcManager {
  private endpoints = $state<Map<number, RpcEndpoint[]>>(new Map());
  private healthMonitor: HealthMonitor;
  private loadBalancer: LoadBalancer;
  
  addEndpoint(chainId: number, endpoint: RpcEndpoint): void;
  getProvider(chainId: number): Provider;
  async checkHealth(endpoint: RpcEndpoint): Promise<boolean>;
  rotateEndpoint(chainId: number): void;
  
  // Auto health check with effect
  constructor() {
    $effect(() => {
      this.scheduleHealthChecks();
    });
  }
}
```

#### 3.1.4 ThemeManager (Svelte 5)
```typescript
class ThemeManager {
  private themes = new Map<string, Theme>();
  currentTheme = $state('auto');
  private cssVariables = $state<Map<string, string>>(new Map());
  
  // Derived theme based on system preference
  activeTheme = $derived(() => {
    if (this.currentTheme === 'auto') {
      return this.detectSystemPreference();
    }
    return this.currentTheme;
  });
  
  registerTheme(id: string, theme: Theme): void;
  setTheme(id: string): void;
  applyCustomization(overrides: Partial<Theme>): void;
  detectSystemPreference(): 'light' | 'dark';
  
  // Apply theme with effect
  constructor() {
    $effect(() => {
      this.applyThemeVariables(this.activeTheme);
    });
  }
}
```

#### 3.1.5 LocalizationManager (Svelte 5)
```typescript
class LocalizationManager {
  private translations = new Map<string, TranslationSet>();
  currentLocale = $state('en');
  
  // Derived translations
  activeTranslations = $derived(() => 
    this.translations.get(this.currentLocale) || this.translations.get('en')
  );
  
  loadTranslations(locale: string, translations: TranslationSet): void;
  setLocale(locale: string): void;
  t = $derived((key: string, params?: Record<string, any>) => {
    const translation = this.activeTranslations?.[key] || key;
    return this.interpolate(translation, params);
  });
  detectBrowserLocale(): string;
}
```

### 3.2 Connector Implementations

#### 3.2.1 InjectedConnector
```typescript
class InjectedConnector implements Connector {
  private provider: EIP1193Provider;
  private eip6963Providers: Map<string, ProviderInfo>;
  
  async detectProviders(): Promise<ProviderInfo[]>;
  async requestAccounts(): Promise<string[]>;
  async watchAsset(asset: Asset): Promise<boolean>;
}
```

#### 3.2.2 WalletConnectConnector
```typescript
class WalletConnectConnector implements Connector {
  private client: WalletConnectClient;
  private session: Session | null;
  private qrModal: QrModal;
  
  async initializeClient(projectId: string): Promise<void>;
  async createSession(): Promise<void>;
  async restoreSession(): Promise<void>;
  displayQrCode(uri: string): void;
}
```

#### 3.2.3 CoinbaseWalletConnector
```typescript
class CoinbaseWalletConnector implements Connector {
  private sdk: CoinbaseWalletSDK;
  private provider: CoinbaseWalletProvider;
  
  async setupSmartWallet(): Promise<void>;
  async createPasskey(): Promise<void>;
}
```

#### 3.2.4 SafeConnector
```typescript
class SafeConnector implements Connector {
  private safe: SafeAppsSDK;
  private isInSafeContext: boolean;
  
  async detectSafeContext(): Promise<boolean>;
  async getOwners(): Promise<string[]>;
  async proposeTransaction(tx: Transaction): Promise<void>;
}
```

### 3.3 UI Component Architecture

#### 3.3.1 Component Hierarchy
```
<WalletKit>
  ├── <ConnectButton>
  │   ├── <AccountDisplay>
  │   └── <NetworkIndicator>
  ├── <WalletModal>
  │   ├── <WalletList>
  │   ├── <QrCodeDisplay>
  │   └── <ConnectionStatus>
  ├── <NetworkModal>
  │   ├── <NetworkList>
  │   ├── <AddNetworkForm>
  │   └── <RpcSettings>
  └── <FloatingWidget>
      ├── <WidgetTrigger>
      └── <WidgetPanel>
```

#### 3.3.2 Component Communication
```typescript
// Context-based prop drilling avoidance
interface WalletKitContext {
  wallet: WalletManager;
  network: NetworkManager;
  theme: ThemeManager;
  i18n: LocalizationManager;
  config: WalletKitConfig;
}
```

### 3.4 Subscription System Architecture

#### 3.4.1 SubscriptionManager
```typescript
class SubscriptionManager {
  private contract: SubscriptionContract;
  private state: Writable<SubscriptionState>;
  
  async checkSubscription(address: string): Promise<SubscriptionInfo>;
  async subscribe(plan: Plan, duration: number): Promise<void>;
  async cancelSubscription(): Promise<void>;
  watchSubscriptionEvents(): Unsubscriber;
}
```

#### 3.4.2 Contract Interface
```typescript
interface SubscriptionContract {
  address: string;
  abi: Abi;
  
  getSubscriptionStatus(address: string): Promise<Status>;
  subscribe(plan: number, duration: number): Promise<Hash>;
  renew(): Promise<Hash>;
  cancel(): Promise<Hash>;
}
```

## 4. Data Flow Architecture

### 4.1 Unidirectional Data Flow
```
User Action → Event → Store Update → UI Update
     ↑                                    ↓
     └──────── Side Effects ←─────────────┘
```

### 4.2 State Composition (Svelte 5)
```typescript
// Derived state with runes
class AccountState {
  constructor(
    private wallet: WalletState,
    private network: NetworkState
  ) {}
  
  // Reactive derived values
  address = $derived(this.wallet.address);
  chainId = $derived(this.network.currentChainId);
  isConnected = $derived(this.wallet.connected);
  
  // Computed state
  displayAddress = $derived(() => {
    if (!this.address) return '';
    return `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
  });
}
```

### 4.3 Effect Management (Svelte 5)
```typescript
// Component with effects
class WalletComponent {
  wallet = new WalletManager();
  network = new NetworkManager();
  
  constructor() {
    // Auto-cleanup with $effect
    $effect(() => {
      console.log('Wallet changed:', this.wallet.state.address);
    });
    
    $effect(() => {
      console.log('Network changed:', this.network.state.current);
    });
    
    // Effect with cleanup
    $effect(() => {
      const interval = setInterval(() => {
        this.wallet.checkConnection();
      }, 5000);
      
      return () => clearInterval(interval);
    });
  }
}
```

## 5. Build System Architecture

### 5.1 Dual Build Output

#### 5.1.1 NPM Package Build
```javascript
// vite.lib.config.js
{
  build: {
    lib: {
      entry: 'src/lib/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `walletkit.${format}.js`
    },
    rollupOptions: {
      external: ['svelte', 'viem'],
      output: {
        globals: { svelte: 'Svelte', viem: 'viem' }
      }
    }
  }
}
```

#### 5.1.2 Standalone Build
```javascript
// vite.standalone.config.js
{
  build: {
    lib: {
      entry: 'src/standalone/index.ts',
      formats: ['umd'],
      name: 'WalletKit',
      fileName: 'walletkit.standalone'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
}
```

### 5.2 Code Splitting Strategy
```typescript
// Lazy load heavy dependencies
const WalletConnectConnector = () => import('./connectors/walletconnect');
const LedgerConnector = () => import('./connectors/ledger');
const SafeConnector = () => import('./connectors/safe');
```

## 6. Storage Architecture

### 6.1 Storage Layers
```typescript
interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

class LocalStorageAdapter implements StorageAdapter {}
class SessionStorageAdapter implements StorageAdapter {}
class IndexedDBAdapter implements StorageAdapter {}
```

### 6.2 Encrypted Storage
```typescript
class SecureStorage {
  private adapter: StorageAdapter;
  private encryptionKey: CryptoKey;
  
  async encrypt(data: any): Promise<string>;
  async decrypt(encrypted: string): Promise<any>;
  async store(key: string, value: any): Promise<void>;
  async retrieve(key: string): Promise<any>;
}
```

## 7. Communication Architecture

### 7.1 Cross-Frame Communication (Standalone Mode)
```typescript
class FrameBridge {
  private iframe: HTMLIFrameElement;
  private origin: string;
  private handlers: Map<string, Handler>;
  
  postMessage(type: string, payload: any): void;
  onMessage(type: string, handler: Handler): void;
  establishHandshake(): Promise<void>;
}
```

### 7.2 Provider Communication
```typescript
class ProviderProxy {
  private provider: EIP1193Provider;
  private middleware: Middleware[];
  
  async request(args: RequestArgs): Promise<any>;
  addMiddleware(middleware: Middleware): void;
  handleProviderEvents(): void;
}
```

## 8. Security Architecture

### 8.1 Security Layers
```typescript
class SecurityManager {
  validateAddress(address: string): boolean;
  validateTransaction(tx: Transaction): boolean;
  checkPhishing(url: string): Promise<boolean>;
  sanitizeInput(input: string): string;
  verifySignature(message: string, signature: string): boolean;
}
```

### 8.2 CSP Compliance
```typescript
// Content Security Policy safe operations
class CSPSafeRenderer {
  renderHTML(template: string, data: any): string;
  injectStyles(styles: string): void;
  loadExternalScript(url: string): Promise<void>;
}
```

## 9. Testing Architecture

### 9.1 Test Structure
```
tests/
├── unit/
│   ├── connectors/
│   ├── managers/
│   └── utils/
├── integration/
│   ├── wallet-flows/
│   └── network-switching/
├── e2e/
│   ├── connect-disconnect.spec.ts
│   └── transaction-flow.spec.ts
└── fixtures/
    ├── mock-provider.ts
    └── test-networks.ts
```

### 9.2 Mock System
```typescript
class MockProvider implements EIP1193Provider {
  private accounts: string[];
  private chainId: number;
  private responses: Map<string, any>;
  
  async request({ method, params }: RequestArgs): Promise<any>;
  setResponse(method: string, response: any): void;
  simulateEvent(event: string, data: any): void;
}
```

## 10. Performance Optimization

### 10.1 Lazy Loading Strategy
```typescript
// Component-level code splitting
const NetworkModal = lazy(() => import('./NetworkModal.svelte'));
const WalletDetails = lazy(() => import('./WalletDetails.svelte'));

// Feature-level code splitting
const enableLedger = async () => {
  const { LedgerConnector } = await import('./connectors/ledger');
  return new LedgerConnector();
};
```

### 10.2 Caching Strategy
```typescript
class CacheManager {
  private memory: LRUCache;
  private persistent: IndexedDBCache;
  
  async get(key: string, loader: () => Promise<any>): Promise<any>;
  invalidate(pattern: string): void;
  preload(keys: string[]): Promise<void>;
}
```

### 10.3 Bundle Optimization
```javascript
// Rollup plugins for optimization
{
  plugins: [
    terser({
      compress: {
        drop_console: true,
        pure_funcs: ['console.log']
      }
    }),
    visualizer({
      filename: 'bundle-analysis.html'
    }),
    compression({
      algorithm: 'gzip'
    })
  ]
}
```

## 11. Plugin Architecture

### 11.1 Plugin System
```typescript
interface Plugin {
  name: string;
  version: string;
  install(kit: WalletKit): void;
}

class PluginManager {
  private plugins: Map<string, Plugin>;
  
  register(plugin: Plugin): void;
  unregister(name: string): void;
  execute(hook: string, ...args: any[]): void;
}
```

### 11.2 Extension Points
```typescript
// Hooks for plugin integration
interface Hooks {
  beforeConnect: (connector: Connector) => void;
  afterConnect: (account: Account) => void;
  beforeTransaction: (tx: Transaction) => Transaction;
  afterTransaction: (receipt: Receipt) => void;
  onError: (error: Error) => void;
}
```

## 12. Development Tools

### 12.1 DevTools Integration
```typescript
class WalletKitDevTools {
  private enabled: boolean;
  private logger: Logger;
  
  logStateChange(store: string, value: any): void;
  logRpcRequest(method: string, params: any[]): void;
  logEvent(event: string, data: any): void;
  exportState(): string;
  importState(state: string): void;
}
```

### 12.2 Development Mode Features
```typescript
if (import.meta.env.DEV) {
  // Enable verbose logging
  // Show performance metrics
  // Enable hot module replacement
  // Show debug UI elements
}
```

## 13. Migration Strategy

### 13.1 Version Management
```typescript
class MigrationManager {
  private currentVersion: string;
  private migrations: Map<string, Migration>;
  
  async migrate(): Promise<void>;
  async backup(): Promise<Backup>;
  async restore(backup: Backup): Promise<void>;
}
```

### 13.2 Backward Compatibility
```typescript
// Adapter pattern for legacy API support
class LegacyAdapter {
  constructor(private walletKit: WalletKit) {}
  
  // Map old API to new API
  connectWallet() { return this.walletKit.connect(); }
  getAccount() { return this.walletKit.account; }
}
```

## 14. Deployment Architecture

### 14.1 CDN Distribution
```yaml
# CDN structure
cdn.walletkit.io/
├── latest/
│   ├── walletkit.min.js
│   └── walletkit.min.css
├── v1.0.0/
│   ├── walletkit.min.js
│   └── walletkit.min.css
└── experimental/
    └── walletkit.next.js
```

### 14.2 NPM Distribution
```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./standalone": {
      "default": "./dist/walletkit.standalone.js"
    },
    "./styles": {
      "default": "./dist/walletkit.css"
    }
  }
}
```

## 15. Architecture Decision Records (ADRs)

### ADR-001: Svelte 5 Runes Over Stores
**Decision**: Use Svelte 5's runes (`$state`, `$derived`, `$effect`) instead of stores
**Rationale**: Better performance, cleaner syntax, automatic cleanup, fine-grained reactivity

### ADR-002: Viem Over Ethers.js
**Decision**: Use viem as the Ethereum library
**Rationale**: Smaller bundle, better TypeScript support, modern API

### ADR-003: Monolithic Build for Standalone
**Decision**: Bundle all dependencies in standalone build
**Rationale**: Zero-configuration usage, no dependency conflicts

### ADR-004: Event-Driven Architecture
**Decision**: Use events for cross-component communication
**Rationale**: Loose coupling, easier testing, plugin support

### ADR-005: CSS Custom Properties for Theming
**Decision**: Use CSS variables instead of CSS-in-JS
**Rationale**: Better performance, easier customization, no runtime overhead