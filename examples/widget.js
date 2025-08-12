/**
 * WalletKit Floating Widget - Proof of Concept
 * A standalone Web3 account center that can be integrated with one line of code
 */

(function () {
	'use strict';

	// Prevent multiple initializations
	if (window.WalletKitWidget) {
		console.warn('WalletKit Widget is already initialized');
		return;
	}

	// Widget configuration from script tag attributes
	const scriptTag = document.currentScript;
	const config = {
		position: scriptTag?.getAttribute('data-position') || 'bottom-right',
		theme: scriptTag?.getAttribute('data-theme') || 'light',
		subscriptionContract: scriptTag?.getAttribute('data-subscription-contract'),
		subscriptionNetwork: scriptTag?.getAttribute('data-subscription-network') || '1'
	};

	// Widget state
	const state = {
		isOpen: false,
		isConnected: false,
		account: null,
		subscription: {
			isActive: false,
			plan: null,
			expiresAt: null
		},
		position: {
			x: 0,
			y: 0,
			side: 'right' // 'left' or 'right'
		},
		isDragging: false
	};

	// Create widget HTML structure
	function createWidgetHTML() {
		const widgetHTML = `
      <div id="walletkit-widget-root">
        <!-- Floating Assistant -->
        <div class="wk-floating-assistant" id="wk-assistant">
          <div class="wk-assistant-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
              <path d="M15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11Z" fill="currentColor"/>
              <path d="M8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11Z" fill="currentColor"/>
              <path d="M12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="wk-status-indicator"></div>
          <div class="wk-notification-badge" style="display: none;">1</div>
        </div>
        
        <!-- Account Panel -->
        <div class="wk-panel" id="wk-panel" style="display: none;">
          <div class="wk-panel-header">
            <h3>Account Center</h3>
            <button class="wk-close-btn" id="wk-close">×</button>
          </div>
          
          <div class="wk-panel-body">
            <!-- Connection Section -->
            <div class="wk-section" id="wk-connection-section">
              <div class="wk-not-connected" id="wk-not-connected">
                <div class="wk-icon-wallet">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <h4>Connect Your Wallet</h4>
                <p>Connect your wallet to access all features</p>
                <button class="wk-connect-btn" id="wk-connect-btn">Connect Wallet</button>
              </div>
              
              <div class="wk-connected" id="wk-connected" style="display: none;">
                <div class="wk-account-info">
                  <div class="wk-account-avatar"></div>
                  <div class="wk-account-details">
                    <div class="wk-account-address" id="wk-account-address">0x0000...0000</div>
                    <div class="wk-account-balance" id="wk-account-balance">0.00 ETH</div>
                  </div>
                </div>
                <button class="wk-disconnect-btn" id="wk-disconnect-btn">Disconnect</button>
              </div>
            </div>
            
            <!-- Network Section -->
            <div class="wk-section wk-network-section" id="wk-network-section" style="display: none;">
              <div class="wk-section-title">Network</div>
              <div class="wk-network-selector">
                <div class="wk-current-network">
                  <span class="wk-network-dot"></span>
                  <span id="wk-network-name">Ethereum Mainnet</span>
                </div>
                <select class="wk-network-select" id="wk-network-select">
                  <option value="1">Ethereum</option>
                  <option value="137">Polygon</option>
                  <option value="42161">Arbitrum</option>
                  <option value="10">Optimism</option>
                </select>
              </div>
            </div>
            
            <!-- Subscription Section -->
            <div class="wk-section wk-subscription-section" id="wk-subscription-section">
              <div class="wk-section-title">Subscription</div>
              <div class="wk-subscription-status" id="wk-no-subscription">
                <div class="wk-subscription-icon">⭐</div>
                <h4>No Active Subscription</h4>
                <p>Subscribe to unlock premium features</p>
                <button class="wk-subscribe-btn" id="wk-subscribe-btn">View Plans</button>
              </div>
              
              <div class="wk-subscription-active" id="wk-active-subscription" style="display: none;">
                <div class="wk-subscription-badge">PRO</div>
                <div class="wk-subscription-details">
                  <div>Active until: <span id="wk-subscription-expires">-</span></div>
                  <button class="wk-manage-btn">Manage Subscription</button>
                </div>
              </div>
              
              <!-- Subscription Plans Modal -->
              <div class="wk-plans-modal" id="wk-plans-modal" style="display: none;">
                <div class="wk-plans-grid">
                  <div class="wk-plan-card">
                    <h4>Basic</h4>
                    <div class="wk-plan-price">0.01 ETH/month</div>
                    <ul class="wk-plan-features">
                      <li>✓ Basic features</li>
                      <li>✓ 10 API calls/day</li>
                    </ul>
                    <button class="wk-plan-select" data-plan="1">Select Basic</button>
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
                    <button class="wk-plan-select" data-plan="2">Select Pro</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

		// Create container and add to DOM
		const container = document.createElement('div');
		container.innerHTML = widgetHTML;
		document.body.appendChild(container.firstElementChild);
	}

	// Create and inject styles
	function injectStyles() {
		const styles = `
      #walletkit-widget-root {
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 999999;
        font-family: system-ui, -apple-system, sans-serif;
        transition: none;
      }
      
      #walletkit-widget-root.wk-dragging {
        transition: none !important;
      }
      
      #walletkit-widget-root.wk-snapping {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .wk-floating-assistant {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        cursor: move;
        box-shadow: 0 4px 24px rgba(99, 102, 241, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        animation: wk-float 3s ease-in-out infinite;
        user-select: none;
        -webkit-user-select: none;
      }
      
      .wk-floating-assistant.wk-dragging {
        animation: none !important;
        cursor: grabbing;
        transform: scale(1.1) !important;
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.5);
      }
      
      @keyframes wk-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      .wk-floating-assistant:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 32px rgba(99, 102, 241, 0.4);
      }
      
      .wk-floating-assistant:active {
        transform: scale(0.95);
      }
      
      .wk-assistant-icon {
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .wk-status-indicator {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${state.isConnected ? '#10b981' : '#ef4444'};
        border: 2px solid white;
        animation: wk-pulse 2s ease-in-out infinite;
      }
      
      @keyframes wk-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .wk-notification-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #ef4444;
        color: white;
        font-size: 11px;
        font-weight: bold;
        padding: 2px 6px;
        border-radius: 10px;
        border: 2px solid white;
      }
      
      .wk-panel {
        position: absolute;
        bottom: 80px;
        width: 380px;
        background: ${config.theme === 'dark' ? '#1f2937' : 'white'};
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        max-height: 600px;
        animation: wk-slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        color: ${config.theme === 'dark' ? '#f3f4f6' : '#1f2937'};
      }
      
      .wk-panel.wk-panel-left {
        right: auto;
        left: 0;
      }
      
      .wk-panel.wk-panel-right {
        left: auto;
        right: 0;
      }
      
      @keyframes wk-slideIn {
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
        border-bottom: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .wk-panel-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
      
      .wk-close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s;
      }
      
      .wk-close-btn:hover {
        background: ${config.theme === 'dark' ? '#374151' : '#f3f4f6'};
      }
      
      .wk-panel-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }
      
      .wk-section {
        margin-bottom: 24px;
      }
      
      .wk-section-title {
        font-size: 14px;
        font-weight: 600;
        color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .wk-not-connected {
        text-align: center;
        padding: 24px;
        background: ${config.theme === 'dark' ? '#111827' : '#f9fafb'};
        border-radius: 12px;
      }
      
      .wk-icon-wallet {
        color: ${config.theme === 'dark' ? '#6366f1' : '#6366f1'};
        margin-bottom: 16px;
      }
      
      .wk-not-connected h4 {
        margin: 0 0 8px 0;
        font-size: 16px;
      }
      
      .wk-not-connected p {
        margin: 0 0 16px 0;
        color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
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
      
      .wk-connect-btn:hover, .wk-subscribe-btn:hover, .wk-plan-select:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }
      
      .wk-connected {
        padding: 16px;
        background: ${config.theme === 'dark' ? '#111827' : '#f9fafb'};
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
      }
      
      .wk-account-balance {
        color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
        font-size: 14px;
        margin-top: 4px;
      }
      
      .wk-disconnect-btn {
        background: ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
        color: ${config.theme === 'dark' ? '#f3f4f6' : '#374151'};
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        width: 100%;
      }
      
      .wk-disconnect-btn:hover {
        background: ${config.theme === 'dark' ? '#4b5563' : '#d1d5db'};
      }
      
      .wk-network-selector {
        display: flex;
        align-items: center;
        padding: 12px;
        background: ${config.theme === 'dark' ? '#111827' : '#f9fafb'};
        border-radius: 8px;
      }
      
      .wk-current-network {
        flex: 1;
        display: flex;
        align-items: center;
      }
      
      .wk-network-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        margin-right: 8px;
      }
      
      .wk-network-select {
        background: transparent;
        border: none;
        color: inherit;
        font-size: 14px;
        cursor: pointer;
        outline: none;
      }
      
      .wk-subscription-status {
        text-align: center;
        padding: 24px;
        background: ${config.theme === 'dark' ? '#111827' : '#fef3c7'};
        border-radius: 12px;
      }
      
      .wk-subscription-icon {
        font-size: 48px;
        margin-bottom: 12px;
      }
      
      .wk-subscription-status h4 {
        margin: 0 0 8px 0;
        font-size: 16px;
      }
      
      .wk-subscription-status p {
        margin: 0 0 16px 0;
        color: ${config.theme === 'dark' ? '#9ca3af' : '#92400e'};
        font-size: 14px;
      }
      
      .wk-subscription-active {
        padding: 16px;
        background: ${config.theme === 'dark' ? '#065f46' : '#d1fae5'};
        border-radius: 12px;
      }
      
      .wk-subscription-badge {
        display: inline-block;
        background: ${config.theme === 'dark' ? '#10b981' : '#059669'};
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      
      .wk-plans-modal {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${config.theme === 'dark' ? '#1f2937' : 'white'};
        padding: 20px;
        overflow-y: auto;
      }
      
      .wk-plans-grid {
        display: grid;
        gap: 16px;
      }
      
      .wk-plan-card {
        padding: 20px;
        border: 2px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
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
      }
      
      @media (max-width: 480px) {
        .wk-panel {
          width: calc(100vw - 40px);
          max-width: 380px;
        }
      }
    `;

		const styleSheet = document.createElement('style');
		styleSheet.textContent = styles;
		document.head.appendChild(styleSheet);
	}

	// Initialize widget functionality
	function initializeWidget() {
		const widgetRoot = document.getElementById('walletkit-widget-root');
		const assistant = document.getElementById('wk-assistant');
		const panel = document.getElementById('wk-panel');
		const closeBtn = document.getElementById('wk-close');
		const connectBtn = document.getElementById('wk-connect-btn');
		const disconnectBtn = document.getElementById('wk-disconnect-btn');
		const subscribeBtn = document.getElementById('wk-subscribe-btn');
		const plansModal = document.getElementById('wk-plans-modal');

		// Initialize drag functionality
		initializeDragging(widgetRoot, assistant, panel);

		// Toggle panel - only on click, not drag
		let isDragClick = false;
		assistant.addEventListener('mousedown', () => {
			isDragClick = true;
		});

		assistant.addEventListener('click', () => {
			// Only toggle panel if it was a click, not a drag
			if (isDragClick && !state.isDragging) {
				state.isOpen = !state.isOpen;
				panel.style.display = state.isOpen ? 'flex' : 'none';

				if (state.isOpen) {
					emitEvent('panel:opened');
				} else {
					emitEvent('panel:closed');
				}
			}
			isDragClick = false;
		});

		// Close panel
		closeBtn.addEventListener('click', () => {
			state.isOpen = false;
			panel.style.display = 'none';
			emitEvent('panel:closed');
		});

		// Connect wallet
		connectBtn.addEventListener('click', async () => {
			// Simulate wallet connection
			state.isConnected = true;
			state.account = '0x' + Math.random().toString(16).substring(2, 42);

			updateConnectionUI();
			emitEvent('connected', { address: state.account });
		});

		// Disconnect wallet
		disconnectBtn.addEventListener('click', () => {
			state.isConnected = false;
			state.account = null;

			updateConnectionUI();
			emitEvent('disconnected');
		});

		// Show subscription plans
		subscribeBtn.addEventListener('click', () => {
			plansModal.style.display = 'block';
		});

		// Handle plan selection
		document.querySelectorAll('.wk-plan-select').forEach((btn) => {
			btn.addEventListener('click', (e) => {
				const planId = e.target.getAttribute('data-plan');
				handleSubscription(planId);
			});
		});
	}

	// Update UI based on connection state
	function updateConnectionUI() {
		const notConnected = document.getElementById('wk-not-connected');
		const connected = document.getElementById('wk-connected');
		const networkSection = document.getElementById('wk-network-section');
		const statusIndicator = document.querySelector('.wk-status-indicator');

		if (state.isConnected) {
			notConnected.style.display = 'none';
			connected.style.display = 'block';
			networkSection.style.display = 'block';
			statusIndicator.style.background = '#10b981';

			// Update account display
			const addressEl = document.getElementById('wk-account-address');
			addressEl.textContent =
				state.account.substring(0, 6) + '...' + state.account.substring(state.account.length - 4);
		} else {
			notConnected.style.display = 'block';
			connected.style.display = 'none';
			networkSection.style.display = 'none';
			statusIndicator.style.background = '#ef4444';
		}
	}

	// Handle subscription
	function handleSubscription(planId) {
		if (!state.isConnected) {
			alert('Please connect your wallet first');
			return;
		}

		// Simulate subscription purchase
		state.subscription = {
			isActive: true,
			plan: planId === '1' ? 'Basic' : 'Pro',
			expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
		};

		updateSubscriptionUI();
		emitEvent('subscriptionChanged', {
			status: 'active',
			isActive: true,
			plan: state.subscription.plan
		});

		// Hide plans modal
		document.getElementById('wk-plans-modal').style.display = 'none';
	}

	// Update subscription UI
	function updateSubscriptionUI() {
		const noSub = document.getElementById('wk-no-subscription');
		const activeSub = document.getElementById('wk-active-subscription');

		if (state.subscription.isActive) {
			noSub.style.display = 'none';
			activeSub.style.display = 'block';

			const expiresEl = document.getElementById('wk-subscription-expires');
			expiresEl.textContent = new Date(state.subscription.expiresAt).toLocaleDateString();
		} else {
			noSub.style.display = 'block';
			activeSub.style.display = 'none';
		}
	}

	// Dragging functionality
	function initializeDragging(widgetRoot, assistant, panel) {
		let dragStartX = 0;
		let dragStartY = 0;
		let startX = 0;
		let startY = 0;
		let hasMoved = false;

		function handleMouseDown(e) {
			// Prevent dragging when panel is open
			if (state.isOpen) return;

			dragStartX = e.clientX;
			dragStartY = e.clientY;

			// Get current position
			const rect = widgetRoot.getBoundingClientRect();
			startX = rect.left;
			startY = rect.top;

			hasMoved = false;

			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);

			// Prevent text selection
			e.preventDefault();
		}

		function handleMouseMove(e) {
			if (
				!hasMoved &&
				(Math.abs(e.clientX - dragStartX) > 5 || Math.abs(e.clientY - dragStartY) > 5)
			) {
				hasMoved = true;
				state.isDragging = true;
				widgetRoot.classList.add('wk-dragging');
				assistant.classList.add('wk-dragging');
			}

			if (hasMoved) {
				const deltaX = e.clientX - dragStartX;
				const deltaY = e.clientY - dragStartY;

				const newX = startX + deltaX;
				const newY = startY + deltaY;

				// Apply position directly during drag
				widgetRoot.style.left = newX + 'px';
				widgetRoot.style.top = newY + 'px';
				widgetRoot.style.right = 'auto';
				widgetRoot.style.transform = 'none';
			}
		}

		function handleMouseUp() {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);

			if (hasMoved) {
				// Snap to edge
				snapToEdge(widgetRoot, panel);

				setTimeout(() => {
					state.isDragging = false;
					widgetRoot.classList.remove('wk-dragging');
					assistant.classList.remove('wk-dragging');
				}, 50);
			}
		}

		// Touch support for mobile
		function handleTouchStart(e) {
			if (state.isOpen) return;

			const touch = e.touches[0];
			dragStartX = touch.clientX;
			dragStartY = touch.clientY;

			const rect = widgetRoot.getBoundingClientRect();
			startX = rect.left;
			startY = rect.top;

			hasMoved = false;
		}

		function handleTouchMove(e) {
			const touch = e.touches[0];

			if (
				!hasMoved &&
				(Math.abs(touch.clientX - dragStartX) > 5 || Math.abs(touch.clientY - dragStartY) > 5)
			) {
				hasMoved = true;
				state.isDragging = true;
				widgetRoot.classList.add('wk-dragging');
				assistant.classList.add('wk-dragging');
				e.preventDefault(); // Prevent scrolling
			}

			if (hasMoved) {
				const deltaX = touch.clientX - dragStartX;
				const deltaY = touch.clientY - dragStartY;

				const newX = startX + deltaX;
				const newY = startY + deltaY;

				widgetRoot.style.left = newX + 'px';
				widgetRoot.style.top = newY + 'px';
				widgetRoot.style.right = 'auto';
				widgetRoot.style.transform = 'none';
			}
		}

		function handleTouchEnd() {
			if (hasMoved) {
				snapToEdge(widgetRoot, panel);

				setTimeout(() => {
					state.isDragging = false;
					widgetRoot.classList.remove('wk-dragging');
					assistant.classList.remove('wk-dragging');
				}, 50);
			}
		}

		assistant.addEventListener('mousedown', handleMouseDown);
		assistant.addEventListener('touchstart', handleTouchStart, { passive: false });
		assistant.addEventListener('touchmove', handleTouchMove, { passive: false });
		assistant.addEventListener('touchend', handleTouchEnd);
	}

	// Snap to edge function
	function snapToEdge(widgetRoot, panel) {
		const rect = widgetRoot.getBoundingClientRect();
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		// Calculate center position
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		// Determine which edge is closer (left or right)
		const distanceToLeft = centerX;
		const distanceToRight = windowWidth - centerX;

		// Add snapping animation class
		widgetRoot.classList.add('wk-snapping');

		// Constrain Y position to keep widget on screen
		let finalY = centerY;
		const minY = rect.height / 2 + 20;
		const maxY = windowHeight - rect.height / 2 - 20;
		finalY = Math.max(minY, Math.min(maxY, finalY));

		if (distanceToLeft < distanceToRight) {
			// Snap to left edge
			state.position.side = 'left';
			widgetRoot.style.left = '20px';
			widgetRoot.style.right = 'auto';
			panel.classList.remove('wk-panel-right');
			panel.classList.add('wk-panel-left');
		} else {
			// Snap to right edge
			state.position.side = 'right';
			widgetRoot.style.right = '20px';
			widgetRoot.style.left = 'auto';
			panel.classList.remove('wk-panel-left');
			panel.classList.add('wk-panel-right');
		}

		// Set vertical position
		widgetRoot.style.top = finalY + 'px';
		widgetRoot.style.transform = 'translateY(-50%)';

		// Store position
		state.position.x = state.position.side === 'left' ? 20 : windowWidth - rect.width - 20;
		state.position.y = finalY;

		// Remove snapping animation class after animation completes
		setTimeout(() => {
			widgetRoot.classList.remove('wk-snapping');
		}, 300);
	}

	// Event system
	const eventHandlers = {};

	function emitEvent(eventName, data) {
		// Internal handlers
		if (eventHandlers[eventName]) {
			eventHandlers[eventName].forEach((handler) => handler(data));
		}

		// Dispatch custom event for external listeners
		window.dispatchEvent(new CustomEvent(`walletkit:${eventName}`, { detail: data }));
	}

	// Public API
	window.WalletKitWidget = {
		// State queries
		isConnected: () => state.isConnected,
		getAccount: () => state.account,
		checkSubscription: (callback) => {
			callback(state.subscription);
		},

		// Actions
		promptConnect: () => {
			if (!state.isConnected) {
				state.isOpen = true;
				document.getElementById('wk-panel').style.display = 'flex';
			}
		},

		requireSubscription: (callback) => {
			if (!state.subscription.isActive) {
				state.isOpen = true;
				document.getElementById('wk-panel').style.display = 'flex';
				document.getElementById('wk-plans-modal').style.display = 'block';
				callback(false);
			} else {
				callback(true);
			}
		},

		// Event handling
		on: (eventName, handler) => {
			if (!eventHandlers[eventName]) {
				eventHandlers[eventName] = [];
			}
			eventHandlers[eventName].push(handler);

			// Return unsubscribe function
			return () => {
				const index = eventHandlers[eventName].indexOf(handler);
				if (index > -1) {
					eventHandlers[eventName].splice(index, 1);
				}
			};
		},

		// Utility
		show: () => {
			document.getElementById('walletkit-widget-root').style.display = 'block';
		},

		hide: () => {
			document.getElementById('walletkit-widget-root').style.display = 'none';
		},

		destroy: () => {
			document.getElementById('walletkit-widget-root').remove();
		}
	};

	// Initialize on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			createWidgetHTML();
			injectStyles();
			initializeWidget();
			emitEvent('ready');
		});
	} else {
		createWidgetHTML();
		injectStyles();
		initializeWidget();
		emitEvent('ready');
	}
})();
