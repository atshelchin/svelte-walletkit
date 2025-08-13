# WalletKit Theme System

The WalletKit theme system provides a flexible and customizable theming solution that seamlessly integrates with your application's design.

## Quick Start

```typescript
import { initializeTheme } from '@svelte-walletkit/theme';

// Initialize with default settings (auto mode, follows system preference)
initializeTheme();

// Or customize the theme
initializeTheme({
	mode: 'dark', // 'light', 'dark', or 'auto'
	preset: 'rounded', // 'default', 'minimal', 'rounded', 'sharp', 'soft'
	custom: {
		colors: {
			primary: '#8b5cf6', // Your brand color
			primaryHover: '#7c3aed',
			primaryActive: '#6d28d9'
		},
		radius: {
			button: '0.75rem', // Customize border radius
			modal: '1rem'
		}
	}
});
```

## CSS Variables

All theme values are exposed as CSS variables that you can override in your application:

```css
:root {
	/* Override primary color */
	--wk-primary: #8b5cf6;

	/* Override border radius */
	--wk-radius-button: 0.75rem;

	/* Override spacing */
	--wk-spacing-md: 1.25rem;
}
```

## Available Presets

### Default

Balanced design that works well with most applications.

### Minimal

Clean design with reduced shadows and subtle borders.

### Rounded

Softer appearance with increased border radius.

### Sharp

Modern, angular design with minimal border radius.

### Soft

Gentle design with lighter shadows and muted colors.

## Theme Modes

- **Light**: Light color scheme
- **Dark**: Dark color scheme
- **Auto**: Automatically follows system preference

## Custom Theme Example

```typescript
import { updateTheme } from '@svelte-walletkit/theme';

// Apply a completely custom theme
updateTheme({
	custom: {
		colors: {
			primary: '#10b981',
			background: '#fafafa',
			text: '#1a1a1a',
			border: '#e5e5e5'
		},
		fonts: {
			base: '"Inter", system-ui, sans-serif'
		},
		shadows: {
			dropdown: '0 4px 12px rgba(0, 0, 0, 0.08)',
			modal: '0 20px 40px rgba(0, 0, 0, 0.15)'
		}
	}
});
```

## Runtime Theme Switching

```typescript
import { setThemeMode, applyPresetTheme } from '@svelte-walletkit/theme';

// Switch to dark mode
setThemeMode('dark');

// Apply a preset
applyPresetTheme('minimal');
```

## Integration Tips

1. **Initialize Early**: Call `initializeTheme()` as early as possible in your app lifecycle.

2. **Match Your Brand**: Override the primary colors to match your brand:

   ```css
   :root {
   	--wk-primary: var(--your-brand-color);
   }
   ```

3. **Consistent Spacing**: Use the same spacing scale as your app:

   ```typescript
   initializeTheme({
   	custom: {
   		spacing: {
   			xs: '0.5rem',
   			sm: '1rem',
   			md: '1.5rem',
   			lg: '2rem',
   			xl: '3rem'
   		}
   	}
   });
   ```

4. **Font Integration**: Use your app's font stack:
   ```typescript
   initializeTheme({
   	custom: {
   		fonts: {
   			base: 'var(--your-font-stack)',
   			mono: 'var(--your-mono-font)'
   		}
   	}
   });
   ```
