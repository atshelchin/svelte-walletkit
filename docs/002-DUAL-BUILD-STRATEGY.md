# 002 - Dual Build Strategy: NPM Package + Standalone Widget

## Overview

WalletKit uses a single Svelte codebase to generate two different build outputs:
1. **NPM Package**: For Svelte/SvelteKit applications
2. **Standalone Widget**: For any HTML page via script tag

## Build Architecture

```
src/
├── lib/                      # Shared components & logic
│   ├── components/          
│   │   ├── FloatingAssistant.svelte
│   │   ├── AccountPanel.svelte
│   │   ├── ConnectButton.svelte
│   │   ├── NetworkSelector.svelte
│   │   └── SubscriptionManager.svelte
│   ├── stores/
│   │   ├── wallet.svelte.ts
│   │   ├── network.svelte.ts
│   │   └── subscription.svelte.ts
│   ├── services/
│   │   └── draggable.ts
│   └── index.ts            # NPM package entry
│
└── standalone/             
    └── index.ts            # Standalone widget entry

dist/
├── walletkit.js           # NPM package (ES modules)
├── walletkit.cjs          # NPM package (CommonJS)
└── walletkit-widget.js    # Standalone (UMD, all deps bundled)
```

## Component Structure

### Shared Svelte Components

```svelte
<!-- src/lib/components/FloatingAssistant.svelte -->
<script lang="ts">
  import { draggable } from '$lib/services/draggable';
  import { walletState } from '$lib/stores/wallet.svelte';
  
  let isOpen = $state(false);
  let position = $state({ side: 'right', y: 50 });
  
  export function open() {
    isOpen = true;
  }
  
  export function close() {
    isOpen = false;
  }
</script>

<div class="floating-assistant" use:draggable={{ onSnap: updatePosition }}>
  <!-- Component content -->
</div>
```

### NPM Package Entry

```typescript
// src/lib/index.ts
// Export for Svelte applications
export { default as WalletKit } from './components/WalletKit.svelte';
export { default as ConnectButton } from './components/ConnectButton.svelte';
export { default as FloatingWidget } from './components/FloatingWidget.svelte';

// Export stores for advanced usage
export { walletState } from './stores/wallet.svelte';
export { networkState } from './stores/network.svelte';

// Export types
export type { WalletKitConfig, Network, Connector } from './types';
```

### Standalone Widget Entry

```typescript
// src/standalone/index.ts
import FloatingWidget from '$lib/components/FloatingWidget.svelte';
import { mount } from 'svelte';

// Auto-initialize when script loads
(function() {
  // Parse configuration from script tag
  const script = document.currentScript;
  const config = {
    position: script?.getAttribute('data-position') || 'bottom-right',
    theme: script?.getAttribute('data-theme') || 'auto',
    subscriptionContract: script?.getAttribute('data-subscription-contract'),
    chainId: parseInt(script?.getAttribute('data-chain-id') || '1'),
  };
  
  // Create container
  const container = document.createElement('div');
  container.id = 'walletkit-widget-root';
  document.body.appendChild(container);
  
  // Mount Svelte component
  const widget = mount(FloatingWidget, {
    target: container,
    props: config
  });
  
  // Expose global API
  window.WalletKitWidget = {
    // Proxy methods to Svelte component
    open: () => widget.open(),
    close: () => widget.close(),
    
    // State queries
    isConnected: () => widget.isConnected(),
    getAccount: () => widget.getAccount(),
    checkSubscription: (callback) => widget.checkSubscription(callback),
    
    // Actions
    connect: () => widget.connect(),
    disconnect: () => widget.disconnect(),
    requireSubscription: (callback) => widget.requireSubscription(callback),
    
    // Events
    on: (event, handler) => {
      return widget.$on(event, handler);
    },
    
    // Cleanup
    destroy: () => widget.$destroy()
  };
  
  // Dispatch ready event
  window.dispatchEvent(new CustomEvent('walletkit:ready'));
})();
```

## Vite Configuration

```javascript
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Standard SvelteKit build for development and SSR
  if (mode !== 'standalone') {
    return {
      plugins: [sveltekit()]
    };
  }
  
  // Standalone widget build
  return {
    plugins: [
      svelte({
        compilerOptions: {
          customElement: false, // Not using custom elements
          css: 'injected' // Inject CSS into JS
        }
      })
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/standalone/index.ts'),
        name: 'WalletKitWidget',
        fileName: 'walletkit-widget',
        formats: ['umd'] // Universal module for browser
      },
      outDir: 'dist',
      emptyOutDir: false,
      rollupOptions: {
        output: {
          // Include all dependencies in bundle
          inlineDynamicImports: true,
          // Single file output
          manualChunks: undefined
        }
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  };
});
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "npm run build:lib && npm run build:widget",
    "build:lib": "vite build && npm run package",
    "build:widget": "vite build --mode standalone",
    "package": "svelte-kit sync && svelte-package && publint"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./widget": {
      "default": "./dist/walletkit-widget.js"
    }
  }
}
```

## Usage Examples

### 1. NPM Package Usage (Svelte App)

```svelte
<!-- In a Svelte/SvelteKit app -->
<script>
  import { WalletKit, ConnectButton } from 'walletkit';
  import { walletState } from 'walletkit';
  
  const config = {
    networks: [/* ... */],
    theme: 'dark'
  };
</script>

<WalletKit {config}>
  <ConnectButton />
</WalletKit>

{#if $walletState.isConnected}
  <p>Connected: {$walletState.address}</p>
{/if}
```

### 2. Standalone Widget Usage (Any HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <h1>Welcome to my app</h1>
  
  <!-- One line integration -->
  <script 
    src="https://cdn.walletkit.io/widget.js"
    data-position="bottom-right"
    data-theme="dark"
    data-subscription-contract="0x123..."
    data-chain-id="137">
  </script>
  
  <script>
    // Use the widget API
    window.addEventListener('walletkit:ready', () => {
      WalletKitWidget.on('connected', (account) => {
        console.log('User connected:', account);
      });
      
      // Check subscription
      WalletKitWidget.requireSubscription((hasAccess) => {
        if (hasAccess) {
          enablePremiumFeatures();
        }
      });
    });
  </script>
</body>
</html>
```

## Benefits of This Approach

### 1. Code Reuse
- Same components for both build targets
- Single source of truth for business logic
- Consistent UI/UX across both modes

### 2. Maintainability
- Update once, deploy everywhere
- Shared testing infrastructure
- Unified documentation

### 3. Performance
- Svelte's compile-time optimizations
- No framework runtime in standalone build
- Tree-shaking for NPM package users

### 4. Developer Experience
- Type safety throughout
- Component composition in NPM mode
- Simple API in standalone mode

### 5. Bundle Size
- NPM package: ~30KB (excluding peer deps)
- Standalone widget: ~80KB (all inclusive)
- Both significantly smaller than React/Vue equivalents

## State Management Strategy

### Svelte 5 Runes for Shared State

```typescript
// src/lib/stores/wallet.svelte.ts
class WalletState {
  address = $state<string | null>(null);
  chainId = $state<number>(1);
  isConnecting = $state(false);
  
  get isConnected() {
    return this.address !== null;
  }
  
  async connect(connector: Connector) {
    this.isConnecting = true;
    try {
      const account = await connector.connect();
      this.address = account.address;
      this.chainId = account.chainId;
    } finally {
      this.isConnecting = false;
    }
  }
  
  disconnect() {
    this.address = null;
  }
}

export const walletState = new WalletState();
```

### Event System for Standalone Mode

```typescript
// src/lib/services/events.ts
class EventEmitter {
  private handlers = new Map<string, Set<Function>>();
  
  on(event: string, handler: Function) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.handlers.get(event)?.delete(handler);
    };
  }
  
  emit(event: string, data?: any) {
    // Internal handlers
    this.handlers.get(event)?.forEach(handler => handler(data));
    
    // Browser events for standalone mode
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(`walletkit:${event}`, { detail: data })
      );
    }
  }
}

export const events = new EventEmitter();
```

## Build Output Examples

### NPM Package Output
```javascript
// dist/index.js (ES Module)
export { WalletKit, ConnectButton, walletState, networkState };
```

### Standalone Widget Output
```javascript
// dist/walletkit-widget.js (UMD)
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? 
    module.exports = factory() :
  typeof define === 'function' && define.amd ? 
    define(factory) :
  (global = global || self, global.WalletKitWidget = factory());
}(this, function () {
  // Entire Svelte app compiled and bundled here
  // Auto-initializes and provides global API
}));
```

## Testing Strategy

### Shared Component Tests
```typescript
// src/lib/components/FloatingAssistant.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import FloatingAssistant from './FloatingAssistant.svelte';

test('opens panel on click', async () => {
  const { getByRole, getByText } = render(FloatingAssistant);
  const assistant = getByRole('button');
  
  await fireEvent.click(assistant);
  expect(getByText('Account Center')).toBeInTheDocument();
});
```

### Standalone Integration Tests
```typescript
// tests/standalone.test.ts
import { test, expect } from '@playwright/test';

test('widget loads and initializes', async ({ page }) => {
  await page.goto('/test-standalone.html');
  
  // Wait for widget to load
  await page.waitForFunction(() => window.WalletKitWidget);
  
  // Test API
  const isConnected = await page.evaluate(() => 
    window.WalletKitWidget.isConnected()
  );
  expect(isConnected).toBe(false);
});
```

## Deployment

### CDN Deployment
```bash
# Build standalone widget
npm run build:widget

# Upload to CDN
aws s3 cp dist/walletkit-widget.js s3://cdn.walletkit.io/v1.0.0/widget.js
aws s3 cp dist/walletkit-widget.js s3://cdn.walletkit.io/latest/widget.js
```

### NPM Publishing
```bash
# Build library
npm run build:lib

# Publish to NPM
npm publish
```

## Migration Path

For projects currently using the POC vanilla JS widget:

1. **Phase 1**: Replace vanilla JS with Svelte-built widget (same API)
2. **Phase 2**: Gradually migrate features to use Svelte components
3. **Phase 3**: Full Svelte implementation with all features

This ensures backward compatibility while moving to a more maintainable architecture.