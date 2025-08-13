<script lang="ts">
	import { Wallet, Shield, Zap, Globe, Palette, Code2, Github, Package, Book } from 'lucide-svelte';
</script>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
	<!-- Hero Section -->
	<div class="relative overflow-hidden">
		<div class="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25"></div>
		<div class="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
			<div class="text-center">
				<div class="mb-8 flex justify-center">
					<div class="relative rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-1">
						<div class="rounded-full bg-white p-4 dark:bg-gray-900">
							<Wallet class="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
						</div>
					</div>
				</div>
				
				<h1 class="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
					WalletKit
				</h1>
				<p class="mt-4 text-xl text-gray-600 dark:text-gray-300">
					Modern Ethereum Wallet Connection Library for Svelte
				</p>
				<p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
					A lightweight, customizable, and feature-rich wallet connection solution built with Svelte 5 and Viem. 
					No wagmi dependency, just pure performance.
				</p>
				
				<div class="mt-10 flex items-center justify-center gap-x-6">
					<a
						href="/demo/network"
						class="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						View Demo
					</a>
					<a
						href="https://github.com/shelchin2023/walletkit"
						class="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
					>
						<Github class="h-4 w-4" />
						GitHub
					</a>
				</div>

				<!-- Quick Install -->
				<div class="mx-auto mt-12 max-w-xl">
					<div class="rounded-lg bg-gray-900 p-4">
						<code class="text-sm text-gray-300">
							npm install @shelchin/walletkit
						</code>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Features Grid -->
	<div class="mx-auto max-w-7xl px-6 py-24 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
				Everything You Need
			</h2>
			<p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
				Built for modern dApps with developer experience in mind
			</p>
		</div>

		<div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
			<!-- Feature 1 -->
			<div class="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<div class="mb-4 inline-flex rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
					<Zap class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Lightweight & Fast</h3>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Built with Viem instead of Wagmi for a smaller bundle size. Core library &lt; 50KB gzipped.
				</p>
			</div>

			<!-- Feature 2 -->
			<div class="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<div class="mb-4 inline-flex rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
					<Globe class="h-6 w-6 text-purple-600 dark:text-purple-400" />
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Multi-Chain Support</h3>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Seamless network switching with RPC load balancing and custom network support.
				</p>
			</div>

			<!-- Feature 3 -->
			<div class="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<div class="mb-4 inline-flex rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
					<Shield class="h-6 w-6 text-green-600 dark:text-green-400" />
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Wallet Support</h3>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					MetaMask, WalletConnect, Coinbase, Safe, Ledger, and auto-detection via EIP-6963.
				</p>
			</div>

			<!-- Feature 4 -->
			<div class="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<div class="mb-4 inline-flex rounded-lg bg-pink-50 p-3 dark:bg-pink-900/20">
					<Palette class="h-6 w-6 text-pink-600 dark:text-pink-400" />
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Fully Customizable</h3>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Complete theming system, i18n support, and customizable UI components.
				</p>
			</div>

			<!-- Feature 5 -->
			<div class="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<div class="mb-4 inline-flex rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
					<Code2 class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Framework Agnostic</h3>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Use as NPM package in Svelte or embed in any website via script tag.
				</p>
			</div>

			<!-- Feature 6 -->
			<div class="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<div class="mb-4 inline-flex rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
					<Package class="h-6 w-6 text-blue-600 dark:text-blue-400" />
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Built-in Features</h3>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					SIWE authentication, ENS resolution, transaction management, and more.
				</p>
			</div>
		</div>
	</div>

	<!-- Usage Examples -->
	<div class="bg-gray-50 dark:bg-gray-900/50">
		<div class="mx-auto max-w-7xl px-6 py-24 lg:px-8">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
					Quick Start
				</h2>
				<p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
					Get up and running in minutes
				</p>
			</div>

			<div class="mx-auto mt-16 max-w-4xl">
				<!-- Svelte Usage -->
				<div class="rounded-lg bg-gray-900 p-6">
					<div class="mb-4 text-sm font-medium text-gray-400">Svelte Component</div>
					<pre class="overflow-x-auto text-sm text-gray-300"><code>{`<script>
  import { WalletKit, WalletButton } from '@shelchin/walletkit';
</script>

<WalletKit 
  theme="auto"
  locale="en"
  networks={[1, 137, 42161]}
>
  <WalletButton />
</WalletKit>`}</code></pre>
				</div>

				<!-- Standalone Usage -->
				<div class="mt-8 rounded-lg bg-gray-900 p-6">
					<div class="mb-4 text-sm font-medium text-gray-400">Standalone HTML</div>
					<pre class="overflow-x-auto text-sm text-gray-300"><code>{`<script src="https://unpkg.com/@shelchin/walletkit/dist/standalone.js"></script>
<script>
  WalletKit.init({
    containerId: 'wallet-container',
    theme: 'dark',
    networks: [1, 137, 42161]
  });
</script>`}</code></pre>
				</div>
			</div>
		</div>
	</div>

	<!-- Demo Links -->
	<div class="mx-auto max-w-7xl px-6 py-24 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
				Explore Demos
			</h2>
			<p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
				See WalletKit in action with interactive examples
			</p>
		</div>

		<div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
			<a
				href="/demo/network"
				class="group relative rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
			>
				<h3 class="font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
					Network Manager
				</h3>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Multi-chain support with custom networks
				</p>
			</a>

			<a
				href="/demo/theme"
				class="group relative rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
			>
				<h3 class="font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
					Theme Customizer
				</h3>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Full theming system with live preview
				</p>
			</a>

			<a
				href="/demo/wallet"
				class="group relative rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
			>
				<h3 class="font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
					Wallet Connection
				</h3>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Connect various wallet providers
				</p>
			</a>

			<a
				href="/demo/components"
				class="group relative rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
			>
				<h3 class="font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
					UI Components
				</h3>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Pre-built components showcase
				</p>
			</a>
		</div>
	</div>

	<!-- Footer -->
	<footer class="border-t border-gray-200 dark:border-gray-700">
		<div class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<div class="flex items-center gap-4">
					<a href="https://github.com/shelchin2023/walletkit" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
						<Github class="h-5 w-5" />
					</a>
					<a href="https://www.npmjs.com/package/@shelchin/walletkit" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
						<Package class="h-5 w-5" />
					</a>
					<a href="https://github.com/shelchin2023/walletkit/blob/main/README.md" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
						<Book class="h-5 w-5" />
					</a>
				</div>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					© 2025 WalletKit. MIT License.
				</p>
			</div>
		</div>
	</footer>
</div>

<style>
	.bg-grid-slate-100 {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(203 213 225 / 0.2)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
	}
	.dark .bg-grid-slate-700\/25 {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(51 65 85 / 0.25)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
	}
</style>