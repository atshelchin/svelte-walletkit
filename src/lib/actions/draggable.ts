/**
 * Svelte action for making elements draggable with edge snapping
 */

export interface DraggableOptions {
  onDragStart?: () => void;
  onDragEnd?: (position: { side: 'left' | 'right'; y: number }) => void;
  onSnap?: (side: 'left' | 'right', y: number) => void;
  disabled?: boolean;
}

export function draggable(node: HTMLElement, options: DraggableOptions = {}) {
  let dragStartX = 0;
  let dragStartY = 0;
  let startX = 0;
  let startY = 0;
  let hasMoved = false;
  let isDragging = false;
  
  const parent = node.parentElement!;
  
  function handleMouseDown(e: MouseEvent) {
    if (options.disabled) return;
    
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    
    const rect = parent.getBoundingClientRect();
    startX = rect.left;
    startY = rect.top;
    
    hasMoved = false;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    e.preventDefault();
  }
  
  function handleMouseMove(e: MouseEvent) {
    if (!hasMoved && (Math.abs(e.clientX - dragStartX) > 5 || Math.abs(e.clientY - dragStartY) > 5)) {
      hasMoved = true;
      isDragging = true;
      node.classList.add('wk-dragging');
      parent.classList.add('wk-dragging');
      options.onDragStart?.();
    }
    
    if (hasMoved) {
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      
      const newX = startX + deltaX;
      const newY = startY + deltaY;
      
      parent.style.left = newX + 'px';
      parent.style.top = newY + 'px';
      parent.style.right = 'auto';
      parent.style.transform = 'none';
    }
  }
  
  function handleMouseUp(e: MouseEvent) {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    if (hasMoved) {
      snapToEdge();
      
      setTimeout(() => {
        isDragging = false;
        node.classList.remove('wk-dragging');
        parent.classList.remove('wk-dragging');
      }, 50);
    }
  }
  
  function handleTouchStart(e: TouchEvent) {
    if (options.disabled) return;
    
    const touch = e.touches[0];
    dragStartX = touch.clientX;
    dragStartY = touch.clientY;
    
    const rect = parent.getBoundingClientRect();
    startX = rect.left;
    startY = rect.top;
    
    hasMoved = false;
  }
  
  function handleTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    
    if (!hasMoved && (Math.abs(touch.clientX - dragStartX) > 5 || Math.abs(touch.clientY - dragStartY) > 5)) {
      hasMoved = true;
      isDragging = true;
      node.classList.add('wk-dragging');
      parent.classList.add('wk-dragging');
      options.onDragStart?.();
      e.preventDefault();
    }
    
    if (hasMoved) {
      const deltaX = touch.clientX - dragStartX;
      const deltaY = touch.clientY - dragStartY;
      
      const newX = startX + deltaX;
      const newY = startY + deltaY;
      
      parent.style.left = newX + 'px';
      parent.style.top = newY + 'px';
      parent.style.right = 'auto';
      parent.style.transform = 'none';
    }
  }
  
  function handleTouchEnd(e: TouchEvent) {
    if (hasMoved) {
      snapToEdge();
      
      setTimeout(() => {
        isDragging = false;
        node.classList.remove('wk-dragging');
        parent.classList.remove('wk-dragging');
      }, 50);
    }
  }
  
  function snapToEdge() {
    const rect = parent.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceToLeft = centerX;
    const distanceToRight = windowWidth - centerX;
    
    parent.classList.add('wk-snapping');
    
    let finalY = centerY;
    const minY = rect.height / 2 + 20;
    const maxY = windowHeight - rect.height / 2 - 20;
    finalY = Math.max(minY, Math.min(maxY, finalY));
    
    let side: 'left' | 'right';
    
    if (distanceToLeft < distanceToRight) {
      side = 'left';
      parent.style.left = '20px';
      parent.style.right = 'auto';
    } else {
      side = 'right';
      parent.style.right = '20px';
      parent.style.left = 'auto';
    }
    
    parent.style.top = finalY + 'px';
    parent.style.transform = 'translateY(-50%)';
    
    options.onSnap?.(side, finalY);
    options.onDragEnd?.({ side, y: finalY });
    
    setTimeout(() => {
      parent.classList.remove('wk-snapping');
    }, 300);
  }
  
  // Add event listeners
  node.addEventListener('mousedown', handleMouseDown);
  node.addEventListener('touchstart', handleTouchStart, { passive: false });
  node.addEventListener('touchmove', handleTouchMove, { passive: false });
  node.addEventListener('touchend', handleTouchEnd);
  
  // Return destroy function for cleanup
  return {
    update(newOptions: DraggableOptions) {
      options = newOptions;
    },
    destroy() {
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchmove', handleTouchMove);
      node.removeEventListener('touchend', handleTouchEnd);
    }
  };
}