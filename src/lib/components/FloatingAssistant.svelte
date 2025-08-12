<script lang="ts">
  import { draggable } from '$lib/actions/draggable';
  import { walletStore } from '$lib/stores/wallet.svelte';
  import AccountPanel from './AccountPanel.svelte';
  
  let isOpen = $state(false);
  let position = $state<{ side: 'left' | 'right'; y: number }>({
    side: 'right',
    y: window.innerHeight / 2
  });
  let isDragging = $state(false);
  
  // Prevent panel toggle when dragging
  let clickStartTime = 0;
  let hasDragged = false;
  
  function handleMouseDown() {
    clickStartTime = Date.now();
    hasDragged = false;
  }
  
  function handleClick() {
    // Only toggle if it was a quick click (not a drag)
    const clickDuration = Date.now() - clickStartTime;
    if (clickDuration < 200 && !hasDragged) {
      isOpen = !isOpen;
    }
  }
  
  function handleDragStart() {
    hasDragged = true;
    isDragging = true;
  }
  
  function handleDragEnd(pos: { side: 'left' | 'right'; y: number }) {
    position = pos;
    isDragging = false;
  }
  
  // Public API methods for standalone mode
  export function open() {
    isOpen = true;
  }
  
  export function close() {
    isOpen = false;
  }
  
  export function toggle() {
    isOpen = !isOpen;
  }
  
  $effect(() => {
    // Update status indicator color based on connection
    const indicator = document.querySelector('.wk-status-indicator');
    if (indicator) {
      (indicator as HTMLElement).style.background = walletStore.isConnected ? '#10b981' : '#ef4444';
    }
  });
</script>

<div id="walletkit-widget-root" class:wk-dragging={isDragging}>
  <!-- Floating Assistant Button -->
  <button
    class="wk-floating-assistant"
    class:wk-dragging={isDragging}
    use:draggable={{
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      disabled: isOpen
    }}
    onmousedown={handleMouseDown}
    onclick={handleClick}
    aria-label="Open wallet assistant"
  >
    <div class="wk-assistant-icon">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
        <path d="M15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11Z" fill="currentColor"/>
        <path d="M8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11Z" fill="currentColor"/>
        <path d="M12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z" fill="currentColor"/>
      </svg>
    </div>
    <div class="wk-status-indicator"></div>
  </button>
  
  <!-- Account Panel -->
  {#if isOpen}
    <AccountPanel 
      {position}
      onclose={() => isOpen = false}
    />
  {/if}
</div>

<style>
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
  
  #walletkit-widget-root :global(.wk-snapping) {
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
    animation: float 3s ease-in-out infinite;
    user-select: none;
    -webkit-user-select: none;
    border: none;
    padding: 0;
  }
  
  .wk-floating-assistant.wk-dragging {
    animation: none !important;
    cursor: grabbing;
    transform: scale(1.1) !important;
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.5);
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .wk-floating-assistant:hover:not(.wk-dragging) {
    transform: scale(1.05);
    box-shadow: 0 6px 32px rgba(99, 102, 241, 0.4);
  }
  
  .wk-floating-assistant:active:not(.wk-dragging) {
    transform: scale(0.98);
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
    background: #ef4444;
    border: 2px solid white;
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
</style>