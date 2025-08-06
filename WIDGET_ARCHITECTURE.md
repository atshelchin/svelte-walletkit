# WalletKit Widget Architecture

## 1. Widget as a Service Layer

The WalletKit widget operates as a self-contained UI component that can be embedded into any web application, providing wallet connectivity, authentication, and subscription management without requiring the host application to handle Web3 complexity.

```
┌─────────────────────────────────────────────────────┐
│                 Host Application                      │
│                  (Any HTML Page)                      │
├─────────────────────────────────────────────────────┤
│              WalletKit Widget Layer                   │
│         (Iframe or Direct DOM Injection)              │
├─────────────────────────────────────────────────────┤
│                Widget Components                      │
│  - Floating Button                                    │
│  - Expandable Panel                                   │
│  - Modal System                                       │
│  - Notification Toast                                 │
├─────────────────────────────────────────────────────┤
│              Core Services                            │
│  - Wallet Management                                  │
│  - Network Management                                 │
│  - Subscription System                                │
│  - SIWE Authentication                                │
├─────────────────────────────────────────────────────┤
│              Communication Bridge                     │
│  - PostMessage API                                    │
│  - Event System                                       │
│  - State Synchronization                              │
└─────────────────────────────────────────────────────┘
```

## 2. Subscription Contract Integration

### 2.1 Contract Configuration

```typescript
interface SubscriptionConfig {
  // Contract details
  contractAddress: string;
  chainId: number;
  abi: ContractABI;
  
  // Subscription plans
  plans: SubscriptionPlan[];
  
  // Payment options
  paymentToken?: {
    address: string;
    symbol: string;
    decimals: number;
  };
  
  // Business logic
  gracePeriod?: number; // Days after expiration
  trialDuration?: number; // Free trial days
  autoRenew?: boolean;
  
  // UI customization
  theme?: {
    primaryColor: string;
    accentColor: string;
  };
  
  // Enforcement
  enforceSubscription?: boolean;
  blockedFeatures?: string[];
}
```

### 2.2 Contract Interface

```solidity
// Expected contract interface
interface ISubscriptionContract {
  // Core functions
  function subscribe(uint256 planId, uint256 duration) external payable;
  function cancelSubscription() external;
  function renewSubscription() external payable;
  
  // Query functions
  function getSubscription(address user) external view returns (Subscription);
  function isActive(address user) external view returns (bool);
  function getPlan(uint256 planId) external view returns (Plan);
  
  // Events
  event Subscribed(address user, uint256 planId, uint256 expiresAt);
  event Cancelled(address user);
  event Renewed(address user, uint256 expiresAt);
}
```

## 3. Widget Communication Protocol

### 3.1 Host to Widget Messages

```typescript
// Message types from host application
interface HostMessage {
  type: HostMessageType;
  payload?: any;
  callback?: string; // Callback ID for responses
}

enum HostMessageType {
  // Authentication
  CHECK_AUTH = 'CHECK_AUTH',
  REQUIRE_AUTH = 'REQUIRE_AUTH',
  LOGOUT = 'LOGOUT',
  
  // Subscription
  CHECK_SUBSCRIPTION = 'CHECK_SUBSCRIPTION',
  REQUIRE_SUBSCRIPTION = 'REQUIRE_SUBSCRIPTION',
  SHOW_PLANS = 'SHOW_PLANS',
  
  // Wallet
  CONNECT_WALLET = 'CONNECT_WALLET',
  DISCONNECT_WALLET = 'DISCONNECT_WALLET',
  SWITCH_NETWORK = 'SWITCH_NETWORK',
  
  // UI Control
  SHOW_WIDGET = 'SHOW_WIDGET',
  HIDE_WIDGET = 'HIDE_WIDGET',
  SET_POSITION = 'SET_POSITION',
  
  // Feature Gates
  CHECK_FEATURE = 'CHECK_FEATURE',
  UNLOCK_FEATURE = 'UNLOCK_FEATURE'
}
```

### 3.2 Widget to Host Messages

```typescript
// Message types from widget to host
interface WidgetMessage {
  type: WidgetMessageType;
  payload: any;
  requestId?: string; // For request/response pairing
}

enum WidgetMessageType {
  // Status updates
  READY = 'READY',
  WALLET_CONNECTED = 'WALLET_CONNECTED',
  WALLET_DISCONNECTED = 'WALLET_DISCONNECTED',
  NETWORK_CHANGED = 'NETWORK_CHANGED',
  
  // Authentication events
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILED = 'AUTH_FAILED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // Subscription events
  SUBSCRIPTION_ACTIVE = 'SUBSCRIPTION_ACTIVE',
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',
  SUBSCRIPTION_PURCHASED = 'SUBSCRIPTION_PURCHASED',
  SUBSCRIPTION_CANCELLED = 'SUBSCRIPTION_CANCELLED',
  
  // Transaction events
  TRANSACTION_SENT = 'TRANSACTION_SENT',
  TRANSACTION_CONFIRMED = 'TRANSACTION_CONFIRMED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  
  // Responses
  RESPONSE = 'RESPONSE',
  ERROR = 'ERROR'
}
```

## 4. Widget UI Components

### 4.1 Floating Action Button (FAB)

```svelte
<!-- FloatingButton.svelte -->
<script lang="ts">
  import { widgetState } from '$lib/widget/state';
  
  interface Props {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    offset?: { x: number; y: number };
  }
  
  let { position, offset = { x: 20, y: 20 } }: Props = $props();
  
  let isExpanded = $state(false);
  let hasNotification = $derived(widgetState.pendingActions > 0);
  
  function toggle() {
    isExpanded = !isExpanded;
    widgetState.setExpanded(isExpanded);
  }
</script>

<button 
  class="fab fab--{position}"
  class:expanded={isExpanded}
  class:notification={hasNotification}
  onclick={toggle}
  style="--offset-x: {offset.x}px; --offset-y: {offset.y}px"
>
  {#if widgetState.isConnected}
    <WalletIcon />
    {#if hasNotification}
      <span class="badge">{widgetState.pendingActions}</span>
    {/if}
  {:else}
    <ConnectIcon />
  {/if}
</button>
```

### 4.2 Expandable Panel

```svelte
<!-- WidgetPanel.svelte -->
<script lang="ts">
  import { widgetState } from '$lib/widget/state';
  import { subscriptionManager } from '$lib/widget/subscription';
  
  let activeTab = $state<'wallet' | 'subscription' | 'settings'>('wallet');
  
  let subscriptionStatus = $derived(subscriptionManager.status);
  let requiresAction = $derived(
    !widgetState.isConnected || 
    !subscriptionStatus.isActive
  );
</script>

<div class="widget-panel" class:expanded={widgetState.isExpanded}>
  <header class="widget-header">
    <h3>WalletKit</h3>
    <button onclick={() => widgetState.setExpanded(false)}>×</button>
  </header>
  
  <nav class="widget-tabs">
    <button 
      class:active={activeTab === 'wallet'}
      onclick={() => activeTab = 'wallet'}
    >
      Wallet
    </button>
    <button 
      class:active={activeTab === 'subscription'}
      onclick={() => activeTab = 'subscription'}
    >
      Subscription
    </button>
    <button 
      class:active={activeTab === 'settings'}
      onclick={() => activeTab = 'settings'}
    >
      Settings
    </button>
  </nav>
  
  <div class="widget-content">
    {#if activeTab === 'wallet'}
      <WalletTab />
    {:else if activeTab === 'subscription'}
      <SubscriptionTab />
    {:else}
      <SettingsTab />
    {/if}
  </div>
  
  {#if requiresAction}
    <div class="widget-cta">
      {#if !widgetState.isConnected}
        <button onclick={connectWallet}>Connect Wallet</button>
      {:else if !subscriptionStatus.isActive}
        <button onclick={showSubscriptionPlans}>Subscribe Now</button>
      {/if}
    </div>
  {/if}
</div>
```

### 4.3 Subscription Management UI

```svelte
<!-- SubscriptionTab.svelte -->
<script lang="ts">
  import { subscriptionManager } from '$lib/widget/subscription';
  import { formatDate, formatPrice } from '$lib/utils';
  
  let status = $derived(subscriptionManager.status);
  let plans = $derived(subscriptionManager.plans);
  let selectedPlan = $state<number | null>(null);
  let isProcessing = $state(false);
  
  async function subscribe() {
    if (!selectedPlan) return;
    
    isProcessing = true;
    try {
      await subscriptionManager.subscribe(selectedPlan);
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="subscription-tab">
  {#if status.isActive}
    <div class="subscription-status">
      <h4>Active Subscription</h4>
      <p>Plan: {status.planName}</p>
      <p>Expires: {formatDate(status.expiresAt)}</p>
      
      <div class="features">
        <h5>Your Features:</h5>
        <ul>
          {#each status.features as feature}
            <li>{feature}</li>
          {/each}
        </ul>
      </div>
      
      <button onclick={() => subscriptionManager.cancel()}>
        Cancel Subscription
      </button>
    </div>
  {:else}
    <div class="subscription-plans">
      <h4>Choose a Plan</h4>
      
      {#each plans as plan}
        <div 
          class="plan-card"
          class:selected={selectedPlan === plan.id}
          onclick={() => selectedPlan = plan.id}
        >
          <h5>{plan.name}</h5>
          <p class="price">{formatPrice(plan.price)} / {plan.duration} days</p>
          <ul class="features">
            {#each plan.features as feature}
              <li>{feature}</li>
            {/each}
          </ul>
        </div>
      {/each}
      
      <button 
        onclick={subscribe}
        disabled={!selectedPlan || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Subscribe'}
      </button>
    </div>
  {/if}
</div>
```

## 5. Widget State Management

```typescript
// WidgetState.ts
class WidgetState {
  // Connection state
  isConnected = $state(false);
  address = $state<string | null>(null);
  chainId = $state<number | null>(null);
  
  // UI state
  isExpanded = $state(false);
  position = $state<Position>('bottom-right');
  theme = $state<'light' | 'dark'>('auto');
  
  // Subscription state
  subscription = $state<SubscriptionStatus | null>(null);
  
  // Authentication state
  isAuthenticated = $state(false);
  session = $state<Session | null>(null);
  
  // Pending actions
  pendingActions = $derived(() => {
    let count = 0;
    if (!this.isConnected) count++;
    if (!this.subscription?.isActive) count++;
    if (!this.isAuthenticated) count++;
    return count;
  });
  
  // Methods
  setExpanded(expanded: boolean) {
    this.isExpanded = expanded;
    this.notifyHost('WIDGET_EXPANDED', { expanded });
  }
  
  updateSubscription(status: SubscriptionStatus) {
    this.subscription = status;
    this.notifyHost('SUBSCRIPTION_STATUS', status);
  }
  
  private notifyHost(type: string, payload: any) {
    window.parent.postMessage({ type, payload }, '*');
  }
}
```

## 6. Security Considerations

### 6.1 Iframe Sandboxing

```typescript
// Widget loader with security
class WidgetLoader {
  private iframe: HTMLIFrameElement;
  private origin: string;
  private allowedOrigins: string[];
  
  load(config: WidgetConfig) {
    this.iframe = document.createElement('iframe');
    
    // Security attributes
    this.iframe.sandbox = 'allow-scripts allow-same-origin allow-popups';
    this.iframe.allow = 'ethereum; clipboard-write';
    
    // CSP header
    this.iframe.csp = "default-src 'self'; connect-src https:";
    
    // Load widget
    this.iframe.src = `${WIDGET_URL}?config=${encodeConfig(config)}`;
    
    // Message validation
    window.addEventListener('message', (event) => {
      if (!this.allowedOrigins.includes(event.origin)) {
        console.warn('Rejected message from:', event.origin);
        return;
      }
      
      this.handleMessage(event.data);
    });
  }
}
```

### 6.2 Message Validation

```typescript
// Secure message handling
class MessageValidator {
  private schema = {
    type: 'string',
    payload: 'object',
    timestamp: 'number',
    nonce: 'string'
  };
  
  validate(message: any): boolean {
    // Type checking
    for (const [key, type] of Object.entries(this.schema)) {
      if (typeof message[key] !== type) return false;
    }
    
    // Timestamp validation (5 minute window)
    const age = Date.now() - message.timestamp;
    if (age > 5 * 60 * 1000) return false;
    
    // Nonce verification (prevent replay)
    if (this.usedNonces.has(message.nonce)) return false;
    this.usedNonces.add(message.nonce);
    
    return true;
  }
}
```

## 7. Mobile Responsiveness

```css
/* Widget responsive design */
.widget-panel {
  position: fixed;
  width: 360px;
  max-width: 90vw;
  height: 600px;
  max-height: 80vh;
}

/* Mobile breakpoint */
@media (max-width: 768px) {
  .widget-panel {
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    bottom: 0;
    border-radius: 0;
  }
  
  .fab {
    width: 56px;
    height: 56px;
  }
}

/* Landscape mode */
@media (orientation: landscape) and (max-height: 500px) {
  .widget-panel {
    height: 100vh;
    width: 50vw;
    right: 0;
  }
}
```

## 8. Performance Optimization

### 8.1 Lazy Loading

```typescript
// Load components on demand
class WidgetCore {
  private modules = new Map<string, () => Promise<any>>();
  
  constructor() {
    // Register lazy modules
    this.modules.set('subscription', () => import('./subscription'));
    this.modules.set('wallet', () => import('./wallet'));
    this.modules.set('auth', () => import('./auth'));
  }
  
  async loadModule(name: string) {
    const loader = this.modules.get(name);
    if (!loader) throw new Error(`Module ${name} not found`);
    
    return await loader();
  }
}
```

### 8.2 State Persistence

```typescript
// Efficient state persistence
class StatePersistence {
  private storage = localStorage;
  private key = 'walletkit:widget';
  
  save = debounce((state: WidgetState) => {
    const data = {
      address: state.address,
      chainId: state.chainId,
      subscription: state.subscription,
      session: state.session,
      theme: state.theme,
      position: state.position
    };
    
    this.storage.setItem(this.key, JSON.stringify(data));
  }, 1000);
  
  restore(): Partial<WidgetState> | null {
    const data = this.storage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }
}
```

## 9. Example Integration

### 9.1 Basic HTML Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>My dApp</title>
</head>
<body>
  <!-- Your application content -->
  
  <!-- WalletKit Widget -->
  <script src="https://cdn.walletkit.io/widget.js"></script>
  <script>
    WalletKit.init({
      subscription: {
        contractAddress: '0x123...',
        chainId: 137,
        abi: [...],
        plans: [
          { id: 1, name: 'Basic', price: '10000000000000000' },
          { id: 2, name: 'Pro', price: '50000000000000000' }
        ]
      },
      widget: {
        position: 'bottom-right',
        theme: 'dark'
      }
    });
    
    // Check subscription before showing premium content
    if (WalletKit.hasSubscription()) {
      showPremiumContent();
    } else {
      WalletKit.on('subscriptionPurchased', () => {
        showPremiumContent();
      });
    }
  </script>
</body>
</html>
```

### 9.2 React Integration

```tsx
// React component wrapper
import { useEffect, useState } from 'react';

function useWalletKit() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  
  useEffect(() => {
    // Initialize widget
    window.WalletKit.init({
      subscription: {
        contractAddress: process.env.REACT_APP_SUBSCRIPTION_CONTRACT,
        chainId: 137
      }
    });
    
    // Listen to events
    window.WalletKit.on('walletConnected', ({ address }) => {
      setIsConnected(true);
    });
    
    window.WalletKit.on('subscriptionChanged', ({ isActive }) => {
      setHasSubscription(isActive);
    });
    
    // Check initial state
    setIsConnected(window.WalletKit.isConnected());
    setHasSubscription(window.WalletKit.hasSubscription());
  }, []);
  
  return { isConnected, hasSubscription };
}

function App() {
  const { isConnected, hasSubscription } = useWalletKit();
  
  return (
    <div>
      {hasSubscription ? (
        <PremiumContent />
      ) : (
        <button onClick={() => window.WalletKit.promptSubscribe()}>
          Unlock Premium Features
        </button>
      )}
    </div>
  );
}
```