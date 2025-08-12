import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// Standalone widget build configuration
export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				customElement: false,
				css: 'injected' // Inject CSS directly into JavaScript
			}
		})
	],

	resolve: {
		alias: {
			$lib: path.resolve('./src/lib')
		}
	},

	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/standalone/index.ts'),
			name: 'WalletKitWidget',
			fileName: 'walletkit-widget',
			formats: ['umd'] // Universal Module Definition for browser
		},

		outDir: 'dist-widget',
		emptyOutDir: true,

		rollupOptions: {
			output: {
				// Bundle everything into a single file
				inlineDynamicImports: true,

				// No external dependencies - everything bundled
				globals: {},

				// Ensure proper UMD wrapper
				format: 'umd',

				// Minify variable names for smaller size
				compact: true,

				// Single chunk
				manualChunks: undefined
			}
		},

		// Minification settings
		minify: 'terser',

		// Target modern browsers
		target: 'es2020',

		// Source maps for debugging
		sourcemap: true
	},

	// Define global constants
	define: {
		'process.env.NODE_ENV': '"production"'
	}
});
