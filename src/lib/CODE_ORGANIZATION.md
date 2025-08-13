# WalletKit Code Organization

## Overview

This document describes the code organization principles and reusable components in WalletKit to ensure maintainability, avoid duplication, and optimize for mobile devices.

## Key Principles

### 1. Component Size Limit

- **Maximum 400 lines per Svelte component**
- Large components are split into smaller, focused components
- Complex logic is extracted into services or utilities

### 2. Code Reusability

- Common UI elements are in `src/lib/presentation/components/shared/`
- Utilities are in `src/lib/utils/`
- Theme system uses CSS variables for consistency

### 3. Mobile-First Design

- Touch targets minimum 44x44px
- Bottom sheets on mobile instead of centered modals
- Responsive units (rem, %, vw/vh) over fixed pixels
- Safe area handling for devices with notches

## Shared Components

### Button (`shared/Button.svelte`)

Reusable button with variants and sizes:

```svelte
<Button variant="primary" size="md" icon={Save} loading={isSaving}>Save Changes</Button>
```

### Input (`shared/Input.svelte`)

Consistent input field with validation:

```svelte
<Input
	label="Network Name"
	bind:value={networkName}
	error={errors.name}
	placeholder="Enter network name"
/>
```

### Modal (`shared/Modal.svelte`)

Responsive modal with mobile bottom sheet support:

```svelte
<Modal
	isOpen={showModal}
	onClose={() => (showModal = false)}
	title="Edit Network"
	mobileBottomSheet={true}
>
	<!-- Content -->
</Modal>
```

### Card (`shared/Card.svelte`)

Visual grouping with optional icon:

```svelte
<Card title="Network Settings" icon={Globe} iconColor="primary">
	<!-- Card content -->
</Card>
```

### Badge (`shared/Badge.svelte`)

Status indicators:

```svelte
<Badge variant="success" size="sm">Active</Badge>
<Badge variant="warning">Pending</Badge>
```

### IconButton (`shared/IconButton.svelte`)

Icon-only buttons with consistent styling:

```svelte
<IconButton icon={Trash2} variant="error" onclick={handleDelete} title="Delete" />
```

## Utility Functions

### Device Detection (`utils/device.ts`)

```typescript
import { isMobile, isTablet, isTouchDevice } from '$lib/utils/device';

// Usage
if (isMobile()) {
	// Show mobile-optimized UI
}
```

## Theme System

### CSS Variables

All components use theme CSS variables:

- Colors: `var(--wk-color-primary)`
- Spacing: `var(--wk-spacing-md)`
- Radius: `var(--wk-radius-button)`
- Shadows: `var(--wk-shadow-modal)`

### Theme Initialization

```typescript
import { initializeTheme } from '@svelte-walletkit/theme';

initializeTheme({
	mode: 'auto', // 'light', 'dark', or 'auto'
	preset: 'rounded', // 'default', 'minimal', 'rounded', 'sharp', 'soft'
	custom: {
		colors: {
			primary: '#8b5cf6'
		}
	}
});
```

## Mobile Optimizations

### Touch-Friendly Interactions

- All interactive elements have minimum 44x44px touch targets
- Increased padding on mobile devices
- Larger font sizes to prevent zoom on iOS

### Responsive Layouts

```css
/* Mobile-first approach */
.component {
	padding: var(--wk-spacing-sm);
}

@media (min-width: 768px) {
	.component {
		padding: var(--wk-spacing-md);
	}
}
```

### Bottom Sheets

On mobile devices, modals appear as bottom sheets for better ergonomics:

- Swipe handle for dismissal indication
- Maximum 85vh height
- Rounded top corners only

## Best Practices

### Component Composition

```svelte
<!-- Bad: Everything in one large component -->
<NetworkManager>
	<!-- 700+ lines of code -->
</NetworkManager>

<!-- Good: Split into smaller components -->
<Modal>
	<NetworkForm />
	<NetworkList />
	<NetworkValidator />
</Modal>
```

### State Management

- Use Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Keep shared state in stores
- Component state stays local

### Performance

- Lazy load heavy components
- Use CSS transforms for animations
- Minimize re-renders with proper reactivity

## File Structure

```
src/lib/
├── presentation/
│   ├── components/
│   │   ├── shared/       # Reusable UI components
│   │   ├── network/      # Network-specific components
│   │   └── wallet/       # Wallet-specific components
│   └── stores/           # Svelte stores
├── application/
│   └── services/         # Business logic
├── infrastructure/
│   ├── theme/           # Theme system
│   └── network/         # Network utilities
├── domain/
│   └── types/           # TypeScript types
└── utils/               # Utility functions
```

## Testing Approach

- Unit tests for utilities
- Component tests for shared components
- Integration tests for user flows
- Mobile device testing via responsive design

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management in modals
- Screen reader compatibility
