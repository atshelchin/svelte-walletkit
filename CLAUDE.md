# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Vision

WalletKit is a comprehensive Ethereum wallet connection library for Svelte applications that provides:

1. **Dual usage modes**: NPM package for Svelte apps AND standalone JavaScript for any HTML page
2. **No wagmi dependency**: Uses lightweight viem instead for smaller bundle size
3. **Complete network management**: RPC load balancing, custom networks, multi-chain support
4. **Extensive wallet support**: Injected wallets, WalletConnect, Coinbase Smart Wallet, Safe, Ledger
5. **Built-in features**: SIWE authentication, subscription system, ENS resolution
6. **Superior customization**: Full theming system, i18n support, widget mode
7. **Framework-agnostic option**: Can be embedded in any website via script tag

## Key Technical Decisions

### Architecture Decisions

- **Svelte stores over Redux/MobX**: Native Svelte stores for better integration and smaller bundle
- **Viem over Ethers.js**: Modern, TypeScript-first, smaller bundle size
- **Event-driven architecture**: Enables loose coupling and plugin support
- **CSS Custom Properties for theming**: Better performance than CSS-in-JS
- **Monolithic standalone build**: Zero-configuration usage for non-Svelte apps

### Design Principles

- **Minimal code, maximum functionality**: Clean architecture with no unnecessary abstractions
- **Progressive enhancement**: Works in basic mode, enhances with features as needed
- **Mobile-first**: All features work perfectly on mobile devices
- **Type safety**: Full TypeScript support with comprehensive type definitions
- **Security by default**: No private key storage, encrypted sessions, input validation

## Development Commands

### Core Development

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build the library and prepare for packaging
- `pnpm preview` - Preview production build locally
- `pnpm prepack` - Prepare library for npm publication (runs sync, package, and publint)

### Testing

- `pnpm test` - Run all tests (unit and e2e)
- `pnpm test:unit` - Run Vitest unit tests in watch mode
- `pnpm test:unit -- --run` - Run unit tests once
- `pnpm test:e2e` - Run Playwright end-to-end tests

### Code Quality

- `pnpm lint` - Check code formatting and run ESLint
- `pnpm format` - Auto-format code with Prettier
- `pnpm check` - Run svelte-check for TypeScript errors
- `pnpm check:watch` - Run svelte-check in watch mode

## Project Structure

### Core Modules Location

- `src/lib/core/` - Core services (WalletManager, NetworkManager, RpcManager)
- `src/lib/connectors/` - Wallet connector implementations
- `src/lib/components/` - Svelte UI components
- `src/lib/stores/` - Svelte stores for state management
- `src/lib/utils/` - Utility functions and helpers
- `src/lib/themes/` - Theme configurations
- `src/lib/i18n/` - Internationalization setup
- `src/standalone/` - Standalone JavaScript bundle entry

### Key Files

- `src/lib/index.ts` - Main library export for NPM package
- `src/standalone/index.ts` - Entry point for standalone build
- `messages/*.json` - Translation files for i18n
- `src/lib/types.ts` - TypeScript type definitions

## Implementation Phases

Currently planning Phase 1 (MVP):

1. Basic wallet connection (MetaMask)
2. Network switching
3. Account management
4. Simple UI components
5. Light/dark theme

Future phases include WalletConnect, multi-wallet support, RPC load balancing, full i18n, SIWE, subscription system, and hardware wallet support.

## Key Implementation Notes

### State Management (Svelte 5)

- Use Svelte 5 runes (`$state`, `$derived`, `$effect`) for reactive state
- Prefer runes over stores for new components
- Use `$state.snapshot()` for immutable state snapshots
- Keep shared state in `src/lib/stores/` using `$state` runes
- Export state objects with rune-based reactivity

### Component Development (Svelte 5)

- Use Svelte 5 runes syntax (`$props()`, `$state()`, `$effect()`)
- All components should accept `class` prop for custom styling
- Use snippets instead of slots for better type safety and performance
- Implement proper accessibility (ARIA labels, keyboard navigation)
- Components should be composable and reusable
- Use `$bindable` props for two-way binding when needed
- Prefer `onclick` over `on:click` (Svelte 5 event syntax)

### Wallet Connectors

- Each connector implements the `Connector` interface
- Connectors are lazy-loaded to reduce initial bundle size
- Support for EIP-6963 (wallet discovery) is required

### Network Management

- Networks are identified by chainId (number)
- Support dynamic network addition/removal
- RPC endpoints support load balancing and health checks
- Must handle network switching gracefully

### Internationalization

- Use Paraglide for i18n (already configured)
- All user-facing text must be translatable
- Support dynamic locale switching
- Number/date formatting per locale

### Testing Requirements

- Unit tests for all utility functions
- Integration tests for wallet connections
- E2E tests for critical user flows
- Mock providers for testing without real wallets

## Technology Stack

- **Framework**: SvelteKit with Svelte 5
- **Build**: Vite with TypeScript
- **Styling**: Tailwind CSS (via @tailwindcss/vite)
- **Testing**: Vitest (browser + node environments) and Playwright
- **i18n**: Paraglide.js with English and Chinese locales
- **Ethereum**: viem for blockchain interactions
- **Package Manager**: pnpm

## Documentation References

- `REQUIREMENTS.md` - Comprehensive feature requirements
- `ARCHITECTURE.md` - Technical architecture and design patterns
- `API.md` - Complete API documentation for both NPM and standalone usage

## Important Constraints

- Must NOT depend on wagmi (use viem directly)
- Bundle size for core library must be < 50KB gzipped
- Must support both NPM and standalone usage
- All features must work on mobile browsers
- Must maintain backward compatibility in minor versions
- Svelte components must not exceed 400 lines of code
- Avoid code duplication - extract common patterns into utilities or shared components
- Mobile-first design with touch-friendly interactions

## Code Quality Guidelines

### Component Architecture

- **Maximum 400 lines per Svelte component**: Split large components into smaller, focused ones
- **Extract reusable UI elements**: Common buttons, inputs, modals should be separate components
- **Use composition over duplication**: Create base components that can be extended
- **Separate concerns**: Business logic in services, UI logic in components, state in stores

### Mobile Optimization

- **Touch targets**: Minimum 44x44px for all interactive elements
- **Responsive design**: Use relative units (rem, %, vw/vh) instead of fixed pixels
- **Performance**: Lazy load heavy components, minimize re-renders
- **Gestures**: Support swipe gestures for modals and dropdowns
- **Viewport**: Ensure proper viewport meta tag and prevent zoom on input focus
- **Bottom sheets**: Use bottom sheets instead of centered modals on mobile
- **Safe areas**: Account for notches and home indicators on mobile devices

### Code Reusability Patterns

- **Shared components**: `src/lib/presentation/components/shared/`
  - Button, Input, Modal, Dropdown, Card, Badge, etc.
- **Utility functions**: `src/lib/utils/`
  - Validation, formatting, device detection, etc.
- **Composables**: `src/lib/composables/`
  - Reusable logic hooks (useModal, useToast, useValidation, etc.)
- **Theme constants**: Use CSS variables from theme system
- **Icon components**: Create reusable icon wrapper components

### Mobile-First CSS

```css
/* Start with mobile styles */
.component {
	padding: var(--wk-spacing-sm);
	font-size: var(--wk-font-size-base);
}

/* Tablet and up */
@media (min-width: 768px) {
	.component {
		padding: var(--wk-spacing-md);
	}
}

/* Desktop */
@media (min-width: 1024px) {
	.component {
		padding: var(--wk-spacing-lg);
	}
}
```
