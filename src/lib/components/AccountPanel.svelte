<script lang="ts">
  import { walletStore } from '$lib/stores/wallet.svelte';
  
  interface Props {
    position: { side: 'left' | 'right'; y: number };
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
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="currentColor"/>
            </svg>
          </div>
          <h4>Connect Your Wallet</h4>
          <p>Connect your wallet to access all features</p>
          <button class="wk-connect-btn" onclick={handleConnect} disabled={walletStore.isConnecting}>
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
          <button class="wk-subscribe-btn" onclick={() => showPlans = true}>
            View Plans
          </button>
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
          <button class="wk-back-btn" onclick={() => showPlans = false}>← Back</button>
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
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    max-height: 600px;
    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .wk-panel-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }
  
  .wk-close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s;
  }
  
  .wk-close-btn:hover {
    background: #f3f4f6;
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
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .wk-not-connected {
    text-align: center;
    padding: 24px;
    background: #f9fafb;
    border-radius: 12px;
  }
  
  .wk-icon-wallet {
    color: #6366f1;
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
  }
  
  .wk-not-connected h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #1f2937;
  }
  
  .wk-not-connected p {
    margin: 0 0 16px 0;
    color: #6b7280;
    font-size: 14px;
  }
  
  .wk-connect-btn, .wk-subscribe-btn, .wk-plan-select {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .wk-connect-btn:hover:not(:disabled), 
  .wk-subscribe-btn:hover, 
  .wk-plan-select:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
  
  .wk-connect-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .wk-connected {
    padding: 16px;
    background: #f9fafb;
    border-radius: 12px;
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
    font-family: monospace;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
  }
  
  .wk-account-balance {
    color: #6b7280;
    font-size: 14px;
    margin-top: 4px;
  }
  
  .wk-disconnect-btn, .wk-manage-btn {
    background: #e5e7eb;
    color: #374151;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
  }
  
  .wk-disconnect-btn:hover, .wk-manage-btn:hover {
    background: #d1d5db;
  }
  
  .wk-network-section {
    margin-top: 16px;
  }
  
  .wk-network-selector {
    display: flex;
    align-items: center;
    padding: 12px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
  
  .wk-current-network {
    flex: 1;
    display: flex;
    align-items: center;
    color: #1f2937;
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
    padding: 24px;
    background: #fef3c7;
    border-radius: 12px;
  }
  
  .wk-subscription-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }
  
  .wk-subscription-status h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #1f2937;
  }
  
  .wk-subscription-status p {
    margin: 0 0 16px 0;
    color: #92400e;
    font-size: 14px;
  }
  
  .wk-subscription-active {
    padding: 16px;
    background: #d1fae5;
    border-radius: 12px;
  }
  
  .wk-subscription-badge {
    display: inline-block;
    background: #059669;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .wk-subscription-details {
    color: #065f46;
    font-size: 14px;
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
    background: white;
    padding: 20px;
    overflow-y: auto;
    border-radius: 16px;
  }
  
  .wk-back-btn {
    background: none;
    border: none;
    color: #6366f1;
    font-size: 14px;
    cursor: pointer;
    padding: 8px 0;
    margin-bottom: 16px;
  }
  
  .wk-plans-grid {
    display: grid;
    gap: 16px;
  }
  
  .wk-plan-card {
    padding: 20px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    position: relative;
  }
  
  .wk-plan-featured {
    border-color: #6366f1;
    box-shadow: 0 0 0 1px #6366f1;
  }
  
  .wk-plan-badge {
    position: absolute;
    top: -10px;
    right: 20px;
    background: #6366f1;
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
  }
  
  .wk-plan-card h4 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #1f2937;
  }
  
  .wk-plan-price {
    font-size: 24px;
    font-weight: 600;
    color: #6366f1;
    margin-bottom: 16px;
  }
  
  .wk-plan-features {
    list-style: none;
    padding: 0;
    margin: 0 0 16px 0;
  }
  
  .wk-plan-features li {
    padding: 8px 0;
    font-size: 14px;
    color: #4b5563;
  }
  
  @media (max-width: 480px) {
    .wk-panel {
      width: calc(100vw - 40px);
      max-width: 380px;
    }
  }
</style>