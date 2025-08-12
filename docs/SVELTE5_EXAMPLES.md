# Svelte 5 Code Examples for WalletKit

## 1. Component with Props and State

```svelte
<!-- ConnectButton.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useWallet } from '$lib/composables/useWallet';

	interface Props {
		showBalance?: boolean;
		showNetwork?: boolean;
		showAvatar?: boolean;
		label?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		showBalance = true,
		showNetwork = true,
		showAvatar = true,
		label = 'Connect Wallet',
		class: className = '',
		children
	}: Props = $props();

	const wallet = useWallet();

	// Local state with runes
	let isDropdownOpen = $state(false);
	let isModalOpen = $state(false);

	// Derived state
	let buttonText = $derived(() => {
		if (wallet.isConnected) {
			return wallet.displayAddress;
		}
		return label;
	});

	// Event handlers
	function handleClick() {
		if (wallet.isConnected) {
			isDropdownOpen = !isDropdownOpen;
		} else {
			isModalOpen = true;
		}
	}

	// Effects
	$effect(() => {
		if (!wallet.isConnected) {
			isDropdownOpen = false;
		}
	});
</script>

<button class="connect-button {className}" onclick={handleClick} aria-expanded={isDropdownOpen}>
	{#if wallet.isConnecting}
		<span class="spinner" />
		Connecting...
	{:else}
		{buttonText}
	{/if}

	{#if children}
		{@render children()}
	{/if}
</button>

{#if isDropdownOpen}
	<div class="dropdown">
		<!-- Dropdown content -->
	</div>
{/if}
```

## 2. Modal Component with Snippets

```svelte
<!-- WalletModal.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		onclose?: () => void;
		title?: string;
		header?: Snippet;
		footer?: Snippet;
		children: Snippet;
	}

	let {
		open = $bindable(),
		onclose,
		title = 'Connect Wallet',
		header,
		footer,
		children
	}: Props = $props();

	// Handle escape key
	$effect(() => {
		if (!open) return;

		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				open = false;
				onclose?.();
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => document.removeEventListener('keydown', handleKeydown);
	});

	// Handle backdrop click
	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			open = false;
			onclose?.();
		}
	}
</script>

{#if open}
	<div class="modal-backdrop" onclick={handleBackdropClick}>
		<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
			<div class="modal-header">
				{#if header}
					{@render header()}
				{:else}
					<h2 id="modal-title">{title}</h2>
				{/if}
				<button
					class="close-button"
					onclick={() => {
						open = false;
						onclose?.();
					}}
					aria-label="Close modal"
				>
					×
				</button>
			</div>

			<div class="modal-body">
				{@render children()}
			</div>

			{#if footer}
				<div class="modal-footer">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
```

## 3. Composable with Runes

```typescript
// useWallet.ts
import { WalletManager } from '$lib/core/WalletManager';
import type { Connector } from '$lib/types';

export function useWallet() {
	const manager = new WalletManager();

	// Reactive state
	const address = $derived(manager.state.address);
	const chainId = $derived(manager.state.chainId);
	const isConnected = $derived(manager.state.connected);
	const isConnecting = $state(false);
	const error = $state<Error | null>(null);

	// Derived values
	const displayAddress = $derived(() => {
		if (!address) return '';
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	});

	// Methods
	async function connect(connectorId?: string) {
		isConnecting = true;
		error = null;

		try {
			await manager.connect(connectorId || 'injected');
		} catch (e) {
			error = e as Error;
		} finally {
			isConnecting = false;
		}
	}

	async function disconnect() {
		await manager.disconnect();
	}

	async function switchChain(chainId: number) {
		const connector = manager.state.connector;
		if (!connector) throw new Error('No active connector');

		await connector.switchChain(chainId);
	}

	// Auto-reconnect effect
	$effect(() => {
		const stored = localStorage.getItem('walletkit:connector');
		if (stored && !isConnected) {
			connect(stored);
		}
	});

	return {
		// State
		address,
		chainId,
		isConnected,
		isConnecting,
		error,
		displayAddress,

		// Methods
		connect,
		disconnect,
		switchChain,

		// Manager instance for advanced usage
		manager
	};
}
```

## 4. Network Selector with State

```svelte
<!-- NetworkSelector.svelte -->
<script lang="ts">
	import { useNetwork } from '$lib/composables/useNetwork';
	import type { Network } from '$lib/types';

	interface Props {
		networks?: Network[];
		showTestnets?: boolean;
		class?: string;
	}

	let { networks, showTestnets = false, class: className = '' }: Props = $props();

	const network = useNetwork();

	// Local state
	let isOpen = $state(false);
	let searchQuery = $state('');

	// Filtered networks
	let filteredNetworks = $derived(() => {
		let list = networks || network.available;

		if (!showTestnets) {
			list = list.filter((n) => !n.testnet);
		}

		if (searchQuery) {
			list = list.filter((n) => n.name.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		return list;
	});

	// Handle network switch
	async function handleSwitch(chainId: number) {
		await network.switch(chainId);
		isOpen = false;
		searchQuery = '';
	}
</script>

<div class="network-selector {className}">
	<button class="network-button" onclick={() => (isOpen = !isOpen)} aria-expanded={isOpen}>
		{#if network.current}
			<img src={network.current.iconUrl} alt="" />
			{network.current.name}
		{:else}
			Select Network
		{/if}
	</button>

	{#if isOpen}
		<div class="network-dropdown">
			<input
				type="search"
				bind:value={searchQuery}
				placeholder="Search networks..."
				class="network-search"
			/>

			<ul class="network-list">
				{#each filteredNetworks as net (net.chainId)}
					<li>
						<button
							class="network-item"
							class:active={net.chainId === network.currentChainId}
							onclick={() => handleSwitch(net.chainId)}
						>
							<img src={net.iconUrl} alt="" />
							<span>{net.name}</span>
							{#if net.testnet}
								<span class="badge">Testnet</span>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
```

## 5. Transaction Component with Effects

```svelte
<!-- TransactionButton.svelte -->
<script lang="ts">
	import { useTransaction } from '$lib/composables/useTransaction';
	import type { TransactionRequest } from '$lib/types';

	interface Props {
		to: string;
		value?: bigint;
		data?: string;
		onSuccess?: (hash: string) => void;
		onError?: (error: Error) => void;
		children: Snippet;
	}

	let { to, value = 0n, data, onSuccess, onError, children }: Props = $props();

	const tx = useTransaction();

	// Local state
	let hash = $state<string | null>(null);
	let receipt = $state<any>(null);

	// Build transaction
	let transaction = $derived<TransactionRequest>(() => ({
		to,
		value,
		data
	}));

	// Send transaction
	async function send() {
		try {
			hash = await tx.send(transaction);
			onSuccess?.(hash);
		} catch (error) {
			onError?.(error as Error);
		}
	}

	// Watch for confirmation
	$effect(() => {
		if (!hash) return;

		tx.waitForReceipt(hash).then((r) => {
			receipt = r;
		});
	});

	// Status text
	let statusText = $derived(() => {
		if (tx.isPending) return 'Sending...';
		if (hash && !receipt) return 'Confirming...';
		if (receipt) return 'Confirmed!';
		return 'Send Transaction';
	});
</script>

<button
	onclick={send}
	disabled={tx.isPending || !to}
	class="tx-button"
	class:pending={tx.isPending}
	class:confirmed={receipt}
>
	{@render children()}
	<span class="status">{statusText}</span>
</button>
```

## 6. Theme Provider with Context

```svelte
<!-- ThemeProvider.svelte -->
<script lang="ts">
	import { setContext } from 'svelte';
	import { ThemeManager } from '$lib/core/ThemeManager';
	import type { Theme } from '$lib/types';

	interface Props {
		theme?: 'light' | 'dark' | 'auto';
		customTheme?: Partial<Theme>;
		children: Snippet;
	}

	let { theme = 'auto', customTheme, children }: Props = $props();

	const themeManager = new ThemeManager();

	// Set initial theme
	themeManager.currentTheme = theme;

	// Apply custom theme if provided
	if (customTheme) {
		themeManager.applyCustomization(customTheme);
	}

	// Provide context
	setContext('theme', themeManager);

	// Watch for system preference changes
	$effect(() => {
		if (themeManager.currentTheme !== 'auto') return;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = () => themeManager.updateSystemPreference();

		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	});

	// Apply CSS variables
	$effect(() => {
		const root = document.documentElement;
		const variables = themeManager.getCssVariables();

		for (const [key, value] of variables) {
			root.style.setProperty(key, value);
		}
	});
</script>

<div class="walletkit-theme" data-theme={themeManager.activeTheme}>
	{@render children()}
</div>
```

## 7. Balance Display with Auto-refresh

```svelte
<!-- Balance.svelte -->
<script lang="ts">
	import { useBalance } from '$lib/composables/useBalance';

	interface Props {
		address?: string;
		token?: string;
		decimals?: number;
		refreshInterval?: number;
		showSymbol?: boolean;
	}

	let {
		address,
		token,
		decimals = 18,
		refreshInterval = 10000,
		showSymbol = true
	}: Props = $props();

	const balance = useBalance(() => ({
		address,
		token,
		decimals
	}));

	// Auto-refresh effect
	$effect(() => {
		if (!address || refreshInterval <= 0) return;

		const interval = setInterval(() => {
			balance.refetch();
		}, refreshInterval);

		return () => clearInterval(interval);
	});

	// Format balance
	let formatted = $derived(() => {
		if (!balance.data) return '0';
		return balance.format();
	});
</script>

<span class="balance" class:loading={balance.isLoading}>
	{formatted}
	{#if showSymbol && balance.symbol}
		<span class="symbol">{balance.symbol}</span>
	{/if}
</span>
```

## 8. WalletKit Main Component

```svelte
<!-- WalletKit.svelte -->
<script lang="ts">
	import { setContext } from 'svelte';
	import { WalletKitCore } from '$lib/core/WalletKitCore';
	import ThemeProvider from './ThemeProvider.svelte';
	import LocaleProvider from './LocaleProvider.svelte';
	import ConnectButton from './ConnectButton.svelte';
	import type { WalletKitConfig, Network } from '$lib/types';

	interface Props {
		networks?: Network[];
		projectId?: string;
		theme?: 'light' | 'dark' | 'auto';
		locale?: string;
		config?: WalletKitConfig;
		autoConnect?: boolean;
		children?: Snippet;
	}

	let {
		networks = [],
		projectId,
		theme = 'auto',
		locale = 'en',
		config = {},
		autoConnect = true,
		children
	}: Props = $props();

	// Initialize core
	const core = new WalletKitCore({
		networks,
		projectId,
		...config,
		autoConnect
	});

	// Provide context
	setContext('walletkit', core);

	// Auto-connect on mount
	$effect(() => {
		if (autoConnect) {
			core.autoConnect();
		}
	});

	// Clean up on unmount
	$effect(() => {
		return () => {
			core.destroy();
		};
	});
</script>

<ThemeProvider {theme}>
	<LocaleProvider {locale}>
		<div class="walletkit">
			{#if children}
				{@render children()}
			{:else}
				<ConnectButton />
			{/if}
		</div>
	</LocaleProvider>
</ThemeProvider>
```

## 9. State Management with Classes

```typescript
// WalletState.ts
export class WalletState {
	// Reactive state
	connected = $state(false);
	address = $state<string | null>(null);
	chainId = $state(1);
	balance = $state<bigint>(0n);
	connector = $state<Connector | null>(null);

	// Derived state
	isConnected = $derived(this.connected && this.address !== null);

	displayAddress = $derived(() => {
		if (!this.address) return '';
		return `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
	});

	networkName = $derived(() => {
		const network = NETWORKS.get(this.chainId);
		return network?.name || `Chain ${this.chainId}`;
	});

	// Methods
	connect(connector: Connector, address: string, chainId: number) {
		this.connector = connector;
		this.address = address;
		this.chainId = chainId;
		this.connected = true;
	}

	disconnect() {
		this.connected = false;
		this.address = null;
		this.connector = null;
		this.balance = 0n;
	}

	updateBalance(balance: bigint) {
		this.balance = balance;
	}

	switchChain(chainId: number) {
		this.chainId = chainId;
	}

	// Persistence effect
	constructor() {
		$effect(() => {
			if (this.connected && this.address) {
				localStorage.setItem('walletkit:account', this.address);
				localStorage.setItem('walletkit:chainId', String(this.chainId));
			} else {
				localStorage.removeItem('walletkit:account');
				localStorage.removeItem('walletkit:chainId');
			}
		});
	}
}
```

## 10. Advanced Pattern: Action with Runes

```svelte
<!-- Component using actions -->
<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';

	let isOpen = $state(false);

	function handleClickOutside() {
		isOpen = false;
	}
</script>

<div use:clickOutside={handleClickOutside}>
	<!-- Content -->
</div>
```

```typescript
// clickOutside.ts - Action implementation
export function clickOutside(node: HTMLElement, callback: () => void) {
	function handleClick(event: MouseEvent) {
		if (!node.contains(event.target as Node)) {
			callback();
		}
	}

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
```

## Key Svelte 5 Patterns Used

1. **`$props()`** - Type-safe props with destructuring
2. **`$state()`** - Reactive state declarations
3. **`$derived()`** - Computed/derived values
4. **`$effect()`** - Side effects with automatic cleanup
5. **`$bindable()`** - Two-way binding for props
6. **Snippets** - Instead of slots for better type safety
7. **Event handlers** - Using `onclick` instead of `on:click`
8. **Classes with runes** - Reactive class properties
9. **Composables** - Reusable logic with runes
10. **Context API** - For dependency injection
