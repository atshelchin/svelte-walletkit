<script lang="ts">
	import NetworkSelector from '$lib/presentation/components/NetworkSelector.svelte';
	import { networkStore } from '$lib/presentation/stores/networkStore.svelte';
	import {
		Network,
		Settings,
		Globe,
		Activity,
		Database,
		Plus,
		RefreshCw,
		Zap,
		Shield,
		Server
	} from '@lucide/svelte';

	// 获取网络状态
	const currentNetwork = $derived(networkStore.state.currentNetwork);
	const networks = $derived(networkStore.state.networks);

	function isTestnet(chainId: number): boolean {
		// 常见的测试网 chainIds
		const testnetChainIds = [5, 11155111, 80001, 97, 421613, 420, 43113, 4002, 84531];
		return testnetChainIds.includes(chainId);
	}
</script>

<div
	class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
>
	<!-- Header -->
	<div
		class="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/80"
	>
		<div class="mx-auto max-w-5xl px-6 py-8">
			<div class="flex items-center gap-4">
				<div
					class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25"
				>
					<Network class="h-7 w-7 text-white" />
				</div>
				<div>
					<h1
						class="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:to-slate-300"
					>
						Network Management
					</h1>
					<p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
						Configure and manage blockchain networks
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-5xl px-6 py-8">
		<div class="space-y-8">
			<!-- Network Selector Configurations -->
			<div
				class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-800/50 dark:ring-slate-700/50"
			>
				<div
					class="border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-white px-6 py-5 dark:border-slate-700/50 dark:from-slate-800 dark:to-slate-800/50"
				>
					<div class="flex items-center gap-3">
						<Settings class="h-5 w-5 text-indigo-500" />
						<h2 class="text-xl font-semibold text-slate-900 dark:text-white">
							Network Selector Configurations
						</h2>
					</div>
				</div>

				<div class="divide-y divide-slate-200/50 dark:divide-slate-700/50">
					<!-- Default Configuration -->
					<div class="px-6 py-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
						<div class="mb-4">
							<h3 class="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
								<span class="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
								></span>
								Default Configuration
							</h3>
							<p class="text-sm text-slate-600 dark:text-slate-400">
								Only Ethereum & Base, editing allowed, no custom networks
							</p>
						</div>
						<div
							class="rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 dark:from-slate-900/50 dark:to-slate-800/30"
						>
							<NetworkSelector />
						</div>
					</div>

					<!-- Extended Networks -->
					<div class="px-6 py-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
						<div class="mb-4">
							<h3 class="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
								<span class="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
								></span>
								Extended Networks
							</h3>
							<p class="text-sm text-slate-600 dark:text-slate-400">
								Ethereum, Base, Polygon, Arbitrum - no custom networks
							</p>
						</div>
						<div
							class="rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 dark:from-slate-900/50 dark:to-slate-800/30"
						>
							<NetworkSelector
								supportedChainIds={[1, 8453, 137, 42161]}
								allowCustomNetworks={false}
							/>
						</div>
					</div>

					<!-- All Networks + Custom -->
					<div class="px-6 py-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
						<div class="mb-4">
							<h3 class="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
								<span class="h-2 w-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
								></span>
								All Networks + Custom
							</h3>
							<p class="text-sm text-slate-600 dark:text-slate-400">
								All preset networks + ability to add custom networks
							</p>
						</div>
						<div
							class="rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 dark:from-slate-900/50 dark:to-slate-800/30"
						>
							<NetworkSelector supportedChainIds={undefined} allowCustomNetworks={true} />
						</div>
					</div>

					<!-- Read-only Mode -->
					<div class="px-6 py-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
						<div class="mb-4">
							<h3 class="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
								<span class="h-2 w-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
								></span>
								Read-only Mode
							</h3>
							<p class="text-sm text-slate-600 dark:text-slate-400">
								Only Ethereum & Base, no editing allowed
							</p>
						</div>
						<div
							class="rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 dark:from-slate-900/50 dark:to-slate-800/30"
						>
							<NetworkSelector allowEditNetwork={false} />
						</div>
					</div>

					<!-- RPC Load Balancing -->
					<div class="px-6 py-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
						<div class="mb-4">
							<h3 class="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
								<span class="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
								></span>
								RPC Load Balancing Enabled
							</h3>
							<p class="text-sm text-slate-600 dark:text-slate-400">
								Edit mode allows managing multiple RPC URLs
							</p>
						</div>
						<div
							class="rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 dark:from-slate-900/50 dark:to-slate-800/30"
						>
							<NetworkSelector enableRpcLoadBalancing={true} />
						</div>
					</div>
				</div>
			</div>

			<!-- Current Network Info -->
			{#if currentNetwork}
				<div
					class="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20"
				>
					<div class="rounded-2xl bg-white dark:bg-slate-900">
						<div class="px-6 py-5">
							<div class="mb-4 flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600"
								>
									<Activity class="h-5 w-5 text-white" />
								</div>
								<h2 class="text-xl font-semibold text-slate-900 dark:text-white">
									Current Network
								</h2>
							</div>
							<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
								<div class="space-y-1">
									<div
										class="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400"
									>
										Name
									</div>
									<div class="font-semibold text-slate-900 dark:text-white">
										{currentNetwork.name}
									</div>
								</div>
								<div class="space-y-1">
									<div
										class="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400"
									>
										Chain ID
									</div>
									<div class="font-mono font-semibold text-slate-900 dark:text-white">
										{currentNetwork.chainId}
									</div>
								</div>
								<div class="space-y-1">
									<div
										class="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400"
									>
										Currency
									</div>
									<div class="font-semibold text-slate-900 dark:text-white">
										{currentNetwork.nativeCurrency.symbol}
									</div>
								</div>
								<div class="space-y-1">
									<div
										class="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400"
									>
										Type
									</div>
									<div class="inline-flex items-center gap-1.5">
										{#if networkStore.isCustomNetwork(currentNetwork.chainId)}
											<Shield class="h-4 w-4 text-purple-500" />
											<span class="font-semibold text-purple-600 dark:text-purple-400">Custom</span>
										{:else}
											<Zap class="h-4 w-4 text-indigo-500" />
											<span class="font-semibold text-indigo-600 dark:text-indigo-400">Preset</span>
										{/if}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Network Statistics -->
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
				<div
					class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 transition-all hover:shadow-md dark:bg-slate-800/50 dark:ring-slate-700/50"
				>
					<div
						class="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-2xl"
					></div>
					<div class="relative">
						<div class="mb-2 flex items-center gap-2">
							<Globe class="h-5 w-5 text-indigo-500" />
							<div class="text-3xl font-bold text-slate-900 dark:text-white">
								{networks.length}
							</div>
						</div>
						<div class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Networks</div>
					</div>
				</div>

				<div
					class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 transition-all hover:shadow-md dark:bg-slate-800/50 dark:ring-slate-700/50"
				>
					<div
						class="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-emerald-500/10 to-green-500/10 blur-2xl"
					></div>
					<div class="relative">
						<div class="mb-2 flex items-center gap-2">
							<Server class="h-5 w-5 text-emerald-500" />
							<div class="text-3xl font-bold text-slate-900 dark:text-white">
								{networks.filter((n) => !isTestnet(n.chainId)).length}
							</div>
						</div>
						<div class="text-sm font-medium text-slate-600 dark:text-slate-400">Mainnets</div>
					</div>
				</div>

				<div
					class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 transition-all hover:shadow-md dark:bg-slate-800/50 dark:ring-slate-700/50"
				>
					<div
						class="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-amber-500/10 to-yellow-500/10 blur-2xl"
					></div>
					<div class="relative">
						<div class="mb-2 flex items-center gap-2">
							<Database class="h-5 w-5 text-amber-500" />
							<div class="text-3xl font-bold text-slate-900 dark:text-white">
								{networks.filter((n) => isTestnet(n.chainId)).length}
							</div>
						</div>
						<div class="text-sm font-medium text-slate-600 dark:text-slate-400">Testnets</div>
					</div>
				</div>

				<div
					class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 transition-all hover:shadow-md dark:bg-slate-800/50 dark:ring-slate-700/50"
				>
					<div
						class="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-2xl"
					></div>
					<div class="relative">
						<div class="mb-2 flex items-center gap-2">
							<Shield class="h-5 w-5 text-purple-500" />
							<div class="text-3xl font-bold text-slate-900 dark:text-white">
								{networks.filter((n) => !networkStore.isPresetNetwork(n.chainId)).length}
							</div>
						</div>
						<div class="text-sm font-medium text-slate-600 dark:text-slate-400">
							Custom Networks
						</div>
					</div>
				</div>
			</div>

			<!-- Available Networks -->
			<div
				class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-800/50 dark:ring-slate-700/50"
			>
				<div
					class="border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-white px-6 py-5 dark:border-slate-700/50 dark:from-slate-800 dark:to-slate-800/50"
				>
					<h2 class="text-xl font-semibold text-slate-900 dark:text-white">Available Networks</h2>
				</div>
				<div class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
					{#each networks as network (network.chainId)}
						<div
							class="group relative overflow-hidden rounded-xl border border-slate-200/50 bg-gradient-to-br from-white to-slate-50/50 p-5 transition-all hover:shadow-md hover:ring-1 hover:ring-indigo-500/20 dark:border-slate-700/50 dark:from-slate-800/50 dark:to-slate-900/50"
						>
							<div class="mb-3 flex items-start justify-between">
								<h3 class="font-semibold text-slate-900 dark:text-white">
									{network.name}
								</h3>
								<div class="flex flex-wrap gap-1.5">
									{#if currentNetwork?.chainId === network.chainId}
										<span
											class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-2.5 py-0.5 text-xs font-medium text-white"
										>
											Active
										</span>
									{/if}
									{#if networkStore.isCustomNetwork(network.chainId)}
										<span
											class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2.5 py-0.5 text-xs font-medium text-white"
										>
											Custom
										</span>
									{/if}
									{#if isTestnet(network.chainId)}
										<span
											class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-xs font-medium text-white"
										>
											Testnet
										</span>
									{/if}
								</div>
							</div>

							<div class="space-y-2 text-sm">
								<div class="flex items-center justify-between">
									<span class="text-slate-500 dark:text-slate-400">Chain ID</span>
									<span class="font-mono font-medium text-slate-700 dark:text-slate-300">
										{network.chainId}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-slate-500 dark:text-slate-400">Currency</span>
									<span class="font-medium text-slate-700 dark:text-slate-300">
										{network.nativeCurrency.symbol}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-slate-500 dark:text-slate-400">RPCs</span>
									<span class="font-medium text-slate-700 dark:text-slate-300">
										{network.rpcUrls.length}
									</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-slate-500 dark:text-slate-400">Explorers</span>
									<span class="font-medium text-slate-700 dark:text-slate-300">
										{network.blockExplorers.length}
									</span>
								</div>
							</div>

							{#if currentNetwork?.chainId !== network.chainId}
								<button
									onclick={() => networkStore.switchNetwork(network.chainId)}
									class="mt-4 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-md"
								>
									Switch Network
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Test Actions -->
			<div
				class="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-lg dark:from-slate-800 dark:to-slate-900"
			>
				<div class="mb-4 flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur"
					>
						<Settings class="h-5 w-5 text-white" />
					</div>
					<h2 class="text-xl font-semibold text-white">Test Actions</h2>
				</div>
				<div class="flex flex-wrap gap-3">
					<button
						onclick={() => {
							console.log('Reset button clicked');
							console.log('NetworkStore state before:', networkStore.state);
							try {
								networkStore.resetToPresetNetworks();
								console.log('NetworkStore state after:', networkStore.state);
								alert('Networks reset to presets successfully!');
							} catch (err) {
								console.error('Failed to reset networks:', err);
								alert(`Failed to reset networks: ${err}`);
							}
						}}
						class="group flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 font-medium text-white backdrop-blur transition-all hover:bg-white/20"
					>
						<RefreshCw class="h-4 w-4 transition-transform group-hover:rotate-180" />
						Reset to Presets
					</button>
					<button
						onclick={async () => {
							console.log('Add network button clicked');
							console.log('NetworkStore state before:', networkStore.state);
							try {
								// 使用公共的测试网络，不需要本地运行节点
								await networkStore.addNetwork({
									chainId: 1337,
									name: 'Custom Test Network',
									rpcUrls: ['https://rpc.ankr.com/eth_goerli'],
									defaultRpcUrl: 'https://rpc.ankr.com/eth_goerli',
									nativeCurrency: {
										name: 'Test Ether',
										symbol: 'tETH',
										decimals: 18
									},
									blockExplorers: ['https://goerli.etherscan.io'],
									defaultBlockExplorer: 'https://goerli.etherscan.io'
								});
								console.log('NetworkStore state after:', networkStore.state);
								alert('Test network added successfully!');
							} catch (err) {
								console.error('Failed to add test network:', err);
								alert(`Failed to add test network: ${err}`);
							}
						}}
						class="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2.5 font-medium text-white shadow-sm transition-all hover:from-emerald-600 hover:to-green-600 hover:shadow-md"
					>
						<Plus class="h-4 w-4" />
						Add Test Network
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
