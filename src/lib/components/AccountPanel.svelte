<script lang="ts">
	import { walletStore } from '$lib/stores/wallet.svelte';

	interface Props {
		position: { side: 'left' | 'right' };
		onclose: () => void;
	}

	let { position, onclose }: Props = $props();

	let showPlans = $state(false);

	async function handleConnect() {
		await walletStore.connect();
	}

	function handleDisconnect() {
		walletStore.disconnect();
	}

	async function handleSubscribe(planId: string) {
		if (!walletStore.isConnected) {
			alert('Please connect your wallet first');
			return;
		}

		await walletStore.purchaseSubscription(planId);
		showPlans = false;
	}

	function formatExpiry(timestamp: number | null) {
		if (!timestamp) return '-';
		return new Date(timestamp).toLocaleDateString();
	}
</script>

<div
	class="wk-panel"
	class:wk-panel-left={position.side === 'left'}
	class:wk-panel-right={position.side === 'right'}
>
	<div class="wk-panel-header">
		<h3>Account Center</h3>
		<button class="wk-close-btn" onclick={onclose}>×</button>
	</div>

	<div class="wk-panel-body">
		<!-- Connection Section -->
		<div class="wk-section">
			{#if !walletStore.isConnected}
				<div class="wk-not-connected">
					<div class="wk-icon-wallet">
						<svg
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"
								fill="currentColor"
							/>
						</svg>
					</div>
					<h4>Connect Your Wallet</h4>
					<p>Connect your wallet to access all features</p>
					<button
						class="wk-connect-btn"
						onclick={handleConnect}
						disabled={walletStore.isConnecting}
					>
						{walletStore.isConnecting ? 'Connecting...' : 'Connect Wallet'}
					</button>
				</div>
			{:else}
				<div class="wk-connected">
					<div class="wk-account-info">
						<div class="wk-account-avatar"></div>
						<div class="wk-account-details">
							<div class="wk-account-address">{walletStore.displayAddress}</div>
							<div class="wk-account-balance">{walletStore.balance} ETH</div>
						</div>
					</div>
					<button class="wk-disconnect-btn" onclick={handleDisconnect}>Disconnect</button>
				</div>

				<!-- Network Section -->
				<div class="wk-network-section">
					<div class="wk-section-title">Network</div>
					<div class="wk-network-selector">
						<div class="wk-current-network">
							<span class="wk-network-dot"></span>
							<span>Ethereum Mainnet</span>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Subscription Section -->
		<div class="wk-section">
			<div class="wk-section-title">Subscription</div>

			{#if !walletStore.subscription.isActive}
				<div class="wk-subscription-status">
					<div class="wk-subscription-icon">⭐</div>
					<h4>No Active Subscription</h4>
					<p>Subscribe to unlock premium features</p>
					<button class="wk-subscribe-btn" onclick={() => (showPlans = true)}> View Plans </button>
				</div>
			{:else}
				<div class="wk-subscription-active">
					<div class="wk-subscription-badge">{walletStore.subscription.plan}</div>
					<div class="wk-subscription-details">
						<div>Active until: {formatExpiry(walletStore.subscription.expiresAt)}</div>
						<button class="wk-manage-btn">Manage Subscription</button>
					</div>
				</div>
			{/if}

			<!-- Subscription Plans -->
			{#if showPlans}
				<div class="wk-plans-modal">
					<button class="wk-back-btn" onclick={() => (showPlans = false)}>← Back</button>
					<div class="wk-plans-grid">
						<div class="wk-plan-card">
							<h4>Basic</h4>
							<div class="wk-plan-price">0.01 ETH/month</div>
							<ul class="wk-plan-features">
								<li>✓ Basic features</li>
								<li>✓ 10 API calls/day</li>
							</ul>
							<button class="wk-plan-select" onclick={() => handleSubscribe('1')}>
								Select Basic
							</button>
						</div>
						<div class="wk-plan-card wk-plan-featured">
							<div class="wk-plan-badge">POPULAR</div>
							<h4>Pro</h4>
							<div class="wk-plan-price">0.05 ETH/month</div>
							<ul class="wk-plan-features">
								<li>✓ All features</li>
								<li>✓ Unlimited API calls</li>
								<li>✓ Priority support</li>
							</ul>
							<button class="wk-plan-select" onclick={() => handleSubscribe('2')}>
								Select Pro
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.wk-panel {
		position: absolute;
		bottom: 80px;
		width: 380px;
		background: var(--wk-color-modal-background);
		border-radius: var(--wk-radius-modal);
		box-shadow: var(--wk-shadow-modal);
		display: flex;
		flex-direction: column;
		max-height: 600px;
		animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border: 1px solid var(--wk-color-border);
	}

	.wk-panel.wk-panel-left {
		right: auto;
		left: 0;
	}

	.wk-panel.wk-panel-right {
		left: auto;
		right: 0;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.wk-panel-header {
		padding: var(--wk-spacing-lg);
		border-bottom: 1px solid var(--wk-color-border);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.wk-panel-header h3 {
		margin: 0;
		font-size: var(--wk-font-size-lg);
		font-weight: 600;
		color: var(--wk-color-text);
	}

	.wk-close-btn {
		background: none;
		border: none;
		font-size: 24px;
		cursor: pointer;
		color: var(--wk-color-text-secondary);
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--wk-radius-md);
		transition: var(--wk-transition-fast);
	}

	.wk-close-btn:hover {
		background: var(--wk-color-hover);
	}

	.wk-panel-body {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
	}

	.wk-section {
		margin-bottom: 24px;
	}

	.wk-section:last-child {
		margin-bottom: 0;
	}

	.wk-section-title {
		font-size: var(--wk-font-size-sm);
		font-weight: 600;
		color: var(--wk-color-text-secondary);
		margin-bottom: var(--wk-spacing-sm);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.wk-not-connected {
		text-align: center;
		padding: var(--wk-spacing-lg);
		background: var(--wk-color-background-secondary);
		border-radius: var(--wk-radius-lg);
	}

	.wk-icon-wallet {
		color: var(--wk-color-primary);
		margin-bottom: var(--wk-spacing-md);
		display: flex;
		justify-content: center;
	}

	.wk-not-connected h4 {
		margin: 0 0 8px 0;
		font-size: var(--wk-font-size-base);
		color: var(--wk-color-text);
	}

	.wk-not-connected p {
		margin: 0 0 var(--wk-spacing-md) 0;
		color: var(--wk-color-text-secondary);
		font-size: var(--wk-font-size-sm);
	}

	.wk-connect-btn,
	.wk-subscribe-btn,
	.wk-plan-select {
		background: var(--wk-color-button-background);
		color: var(--wk-color-button-text);
		border: none;
		padding: var(--wk-spacing-sm) var(--wk-spacing-lg);
		border-radius: var(--wk-radius-button);
		font-size: var(--wk-font-size-sm);
		font-weight: 600;
		cursor: pointer;
		transition: var(--wk-transition-base);
	}

	.wk-connect-btn:hover:not(:disabled),
	.wk-subscribe-btn:hover,
	.wk-plan-select:hover {
		transform: translateY(-2px);
		box-shadow: var(--wk-shadow-button);
		background: var(--wk-color-primary-hover);
	}

	.wk-connect-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.wk-connected {
		padding: var(--wk-spacing-md);
		background: var(--wk-color-background-secondary);
		border-radius: var(--wk-radius-lg);
	}

	.wk-account-info {
		display: flex;
		align-items: center;
		margin-bottom: 16px;
	}

	.wk-account-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		margin-right: 12px;
	}

	.wk-account-address {
		font-family: var(--wk-font-mono);
		font-size: var(--wk-font-size-sm);
		font-weight: 600;
		color: var(--wk-color-text);
	}

	.wk-account-balance {
		color: var(--wk-color-text-secondary);
		font-size: var(--wk-font-size-sm);
		margin-top: 4px;
	}

	.wk-disconnect-btn,
	.wk-manage-btn {
		background: var(--wk-color-background-tertiary);
		color: var(--wk-color-text);
		border: none;
		padding: var(--wk-spacing-xs) var(--wk-spacing-md);
		border-radius: var(--wk-radius-md);
		font-size: var(--wk-font-size-sm);
		cursor: pointer;
		transition: var(--wk-transition-fast);
		width: 100%;
	}

	.wk-disconnect-btn:hover,
	.wk-manage-btn:hover {
		background: var(--wk-color-hover);
	}

	.wk-network-section {
		margin-top: 16px;
	}

	.wk-network-selector {
		display: flex;
		align-items: center;
		padding: var(--wk-spacing-sm);
		background: var(--wk-color-background);
		border: 1px solid var(--wk-color-border);
		border-radius: var(--wk-radius-md);
		cursor: pointer;
		transition: var(--wk-transition-fast);
	}

	.wk-network-selector:hover {
		border-color: var(--wk-color-border-focus);
		background: var(--wk-color-hover);
	}

	.wk-current-network {
		flex: 1;
		display: flex;
		align-items: center;
		color: var(--wk-color-text);
	}

	.wk-network-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #10b981;
		margin-right: 8px;
	}

	.wk-subscription-status {
		text-align: center;
		padding: var(--wk-spacing-lg);
		background: var(--wk-color-warning-light);
		border-radius: var(--wk-radius-lg);
	}

	.wk-subscription-icon {
		font-size: 48px;
		margin-bottom: var(--wk-spacing-sm);
	}

	.wk-subscription-status h4 {
		margin: 0 0 8px 0;
		font-size: var(--wk-font-size-base);
		color: var(--wk-color-text);
	}

	.wk-subscription-status p {
		margin: 0 0 var(--wk-spacing-md) 0;
		color: var(--wk-color-text-secondary);
		font-size: var(--wk-font-size-sm);
	}

	.wk-subscription-active {
		padding: var(--wk-spacing-md);
		background: var(--wk-color-success-light);
		border-radius: var(--wk-radius-lg);
	}

	.wk-subscription-badge {
		display: inline-block;
		background: var(--wk-color-success);
		color: var(--wk-color-text-inverse);
		padding: 4px 8px;
		border-radius: var(--wk-radius-sm);
		font-size: var(--wk-font-size-xs);
		font-weight: 600;
		margin-bottom: 8px;
	}

	.wk-subscription-details {
		color: var(--wk-color-text);
		font-size: var(--wk-font-size-sm);
	}

	.wk-subscription-details div {
		margin-bottom: 8px;
	}

	.wk-plans-modal {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--wk-color-modal-background);
		padding: var(--wk-spacing-lg);
		overflow-y: auto;
		border-radius: var(--wk-radius-modal);
	}

	.wk-back-btn {
		background: none;
		border: none;
		color: var(--wk-color-primary);
		font-size: var(--wk-font-size-sm);
		cursor: pointer;
		padding: var(--wk-spacing-xs) 0;
		margin-bottom: var(--wk-spacing-md);
		transition: var(--wk-transition-fast);
	}

	.wk-back-btn:hover {
		color: var(--wk-color-primary-hover);
	}

	.wk-plans-grid {
		display: grid;
		gap: 16px;
	}

	.wk-plan-card {
		padding: var(--wk-spacing-lg);
		border: 2px solid var(--wk-color-border);
		border-radius: var(--wk-radius-lg);
		position: relative;
		background: var(--wk-color-background);
	}

	.wk-plan-featured {
		border-color: var(--wk-color-primary);
		box-shadow: 0 0 0 1px var(--wk-color-primary);
	}

	.wk-plan-badge {
		position: absolute;
		top: -10px;
		right: 20px;
		background: var(--wk-color-primary);
		color: var(--wk-color-text-inverse);
		padding: 4px 12px;
		border-radius: var(--wk-radius-lg);
		font-size: 11px;
		font-weight: 600;
	}

	.wk-plan-card h4 {
		margin: 0 0 8px 0;
		font-size: var(--wk-font-size-lg);
		color: var(--wk-color-text);
	}

	.wk-plan-price {
		font-size: var(--wk-font-size-xl);
		font-weight: 600;
		color: var(--wk-color-primary);
		margin-bottom: var(--wk-spacing-md);
	}

	.wk-plan-features {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--wk-spacing-md) 0;
	}

	.wk-plan-features li {
		padding: var(--wk-spacing-xs) 0;
		font-size: var(--wk-font-size-sm);
		color: var(--wk-color-text-secondary);
	}

	@media (max-width: 480px) {
		.wk-panel {
			width: calc(100vw - 40px);
			max-width: 380px;
		}
	}
</style>
