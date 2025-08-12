/**
 * Wallet state store using Svelte 5 runes
 */

export interface WalletState {
	address: string | null;
	chainId: number;
	isConnected: boolean;
	balance: string;
}

export interface SubscriptionState {
	isActive: boolean;
	plan: string | null;
	expiresAt: number | null;
}

class WalletStore {
	// Reactive state using Svelte 5 $state rune
	address = $state<string | null>(null);
	chainId = $state<number>(1);
	isConnecting = $state(false);
	balance = $state<string>('0.00');

	// Subscription state
	subscription = $state<SubscriptionState>({
		isActive: false,
		plan: null,
		expiresAt: null
	});

	// Derived state
	get isConnected() {
		return this.address !== null;
	}

	get displayAddress() {
		if (!this.address) return '';
		return `${this.address.substring(0, 6)}...${this.address.substring(this.address.length - 4)}`;
	}

	// Actions
	async connect() {
		this.isConnecting = true;

		// Simulate wallet connection
		await new Promise((resolve) => setTimeout(resolve, 1000));

		this.address = '0x' + Math.random().toString(16).substring(2, 42);
		this.chainId = 1;
		this.balance = (Math.random() * 10).toFixed(2);
		this.isConnecting = false;

		// Emit event
		this.emitEvent('connected', {
			address: this.address,
			chainId: this.chainId
		});
	}

	disconnect() {
		this.address = null;
		this.balance = '0.00';
		this.emitEvent('disconnected');
	}

	async checkSubscription() {
		// Simulate subscription check
		return this.subscription;
	}

	async purchaseSubscription(planId: string) {
		// Simulate subscription purchase
		this.subscription = {
			isActive: true,
			plan: planId === '1' ? 'Basic' : 'Pro',
			expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
		};

		this.emitEvent('subscriptionChanged', {
			status: 'active',
			isActive: true,
			plan: this.subscription.plan
		});
	}

	private emitEvent(eventName: string, data?: unknown) {
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent(`walletkit:${eventName}`, { detail: data }));
		}
	}
}

// Export singleton instance
export const walletStore = new WalletStore();
