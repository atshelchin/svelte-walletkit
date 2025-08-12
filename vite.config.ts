import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
	// Widget standalone build mode
	if (mode === 'widget') {
		return {
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
					$lib: path.resolve(__dirname, './src/lib')
				}
			},

			build: {
				lib: {
					entry: path.resolve(__dirname, './src/standalone/index.ts'),
					name: 'WalletKitWidget',
					fileName: 'widget',
					formats: ['umd'] // Universal Module Definition for browser
				},

				outDir: 'dist',
				emptyOutDir: false, // Don't empty since we have other builds

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
		};
	}

	// Default SvelteKit build
	return {
		plugins: [
			tailwindcss(),
			sveltekit(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(devtoolsJson as any)()
		],
		test: {
			expect: { requireAssertions: true },
			projects: [
				{
					extends: './vite.config.ts',
					test: {
						name: 'client',
						environment: 'browser',
						browser: {
							enabled: true,
							provider: 'playwright',
							instances: [{ browser: 'chromium' }]
						},
						include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
						exclude: ['src/lib/server/**'],
						setupFiles: ['./vitest-setup-client.ts']
					}
				},
				{
					extends: './vite.config.ts',
					test: {
						name: 'server',
						environment: 'node',
						include: ['src/**/*.{test,spec}.{js,ts}'],
						exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
					}
				}
			]
		}
	};
});
