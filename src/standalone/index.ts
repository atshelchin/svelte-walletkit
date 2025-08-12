/**
 * Standalone entry point for WalletKit Widget
 * This file creates a self-contained widget that can be embedded with a script tag
 */

import { mount, unmount } from 'svelte';
import FloatingAssistant from '$lib/components/FloatingAssistant.svelte';
import { walletStore } from '$lib/stores/wallet.svelte';

// Declare global interface
declare global {
	interface Window {
		WalletKitWidget?: {
			isConnected: () => boolean;
			getAccount: () => { address: string | null; chainId: number; balance: string } | null;
			checkSubscription: (callback?: (status: unknown) => void) => unknown;
			connect: () => Promise<void>;
			disconnect: () => void;
			promptConnect: () => void;
			requireSubscription: (callback?: (hasAccess: boolean) => void) => boolean;
			open: () => void;
			close: () => void;
			toggle: () => void;
			show: () => void;
			hide: () => void;
			on: (eventName: string, handler: (detail: unknown) => void) => () => void;
			destroy: () => void;
		};
	}
}

(function () {
	'use strict';

	// Prevent multiple initializations
	if (window.WalletKitWidget) {
		console.warn('WalletKit Widget is already initialized');
		return;
	}

	// Parse configuration from script tag
	const scriptTag = document.currentScript as HTMLScriptElement;
	const config = {
		position: scriptTag?.getAttribute('data-position') || 'bottom-right',
		theme: scriptTag?.getAttribute('data-theme') || 'light',
		subscriptionContract: scriptTag?.getAttribute('data-subscription-contract'),
		chainId: parseInt(scriptTag?.getAttribute('data-chain-id') || '1')
	};

	// Create container for the widget
	const container = document.createElement('div');
	container.id = 'walletkit-widget-container';
	document.body.appendChild(container);

	// Mount the Svelte component
	const widget = mount(FloatingAssistant, {
		target: container,
		props: {}
	});

	// Event handlers registry
	const eventHandlers: Record<string, Array<(detail: unknown) => void>> = {};

	// Create public API
	window.WalletKitWidget = {
		// State queries
		isConnected: () => walletStore.isConnected,

		getAccount: () => {
			if (!walletStore.isConnected) return null;
			return {
				address: walletStore.address,
				chainId: walletStore.chainId,
				balance: walletStore.balance
			};
		},

		checkSubscription: (callback?: (status: unknown) => void) => {
			const status = walletStore.subscription;
			if (callback) {
				callback(status);
			}
			return status;
		},

		// Actions
		connect: async () => {
			await walletStore.connect();
		},

		disconnect: () => {
			walletStore.disconnect();
		},

		promptConnect: () => {
			if (!walletStore.isConnected) {
				widget.open();
			}
		},

		requireSubscription: (callback?: (hasAccess: boolean) => void) => {
			const hasAccess = walletStore.subscription.isActive;
			if (!hasAccess) {
				widget.open();
			}
			if (callback) {
				callback(hasAccess);
			}
			return hasAccess;
		},

		// Widget control
		open: () => widget.open(),
		close: () => widget.close(),
		toggle: () => widget.toggle(),

		show: () => {
			const container = document.getElementById('walletkit-widget-container');
			if (container) {
				container.style.display = 'block';
			}
		},

		hide: () => {
			const container = document.getElementById('walletkit-widget-container');
			if (container) {
				container.style.display = 'none';
			}
		},

		// Event handling
		on: (eventName: string, handler: (detail: unknown) => void) => {
			if (!eventHandlers[eventName]) {
				eventHandlers[eventName] = [];
			}
			eventHandlers[eventName].push(handler);

			// Listen to custom events
			const eventListener = (e: Event) => {
				const customEvent = e as CustomEvent;
				handler(customEvent.detail);
			};

			window.addEventListener(`walletkit:${eventName}`, eventListener);

			// Return unsubscribe function
			return () => {
				const index = eventHandlers[eventName].indexOf(handler);
				if (index > -1) {
					eventHandlers[eventName].splice(index, 1);
				}
				window.removeEventListener(`walletkit:${eventName}`, eventListener);
			};
		},

		// Cleanup
		destroy: () => {
			unmount(widget);
			const container = document.getElementById('walletkit-widget-container');
			if (container) {
				container.remove();
			}
			delete window.WalletKitWidget;
		}
	};

	// Dispatch ready event
	window.dispatchEvent(new CustomEvent('walletkit:ready'));

	// Log initialization
	console.log('WalletKit Widget initialized', config);
})();
