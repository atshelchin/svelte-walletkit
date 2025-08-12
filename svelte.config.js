import adapter from '@sveltejs/adapter-static';
// import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// GitHub Pages requires assets to be in the root of the build folder
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		paths: {
			// Set base path for GitHub Pages deployment
			// This will be replaced by the BASE_PATH env variable in CI
			base: process.env.BASE_PATH || ''
		},
		prerender: {
			// This tells SvelteKit to prerender all pages
			entries: ['*']
		}
	}
};

export default config;
