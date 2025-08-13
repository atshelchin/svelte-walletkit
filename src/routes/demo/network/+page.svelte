<script lang="ts">
	import NetworkSelector from '$lib/presentation/components/NetworkSelector.svelte';
	import { networkStore } from '$lib/presentation/stores/networkStore.svelte';

	// 获取网络状态
	const currentNetwork = $derived(networkStore.state.currentNetwork);
	const networks = $derived(networkStore.state.networks);
	// const error = $derived(networkStore.state.error);  // Unused variable

	function isTestnet(chainId: number): boolean {
		// 常见的测试网 chainIds
		const testnetChainIds = [5, 11155111, 80001, 97, 421613, 420, 43113, 4002, 84531];
		return testnetChainIds.includes(chainId);
	}
</script>

<div class="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
	<div class="mx-auto max-w-4xl">
		<h1 class="mb-8 text-3xl font-bold">Network Management Demo</h1>

		<div class="space-y-8">
			<!-- Different Network Selector Configurations -->
			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<h2 class="mb-6 text-xl font-semibold">Network Selector Configurations</h2>

				<div class="space-y-6">
					<!-- Default: Ethereum & Base only, edit allowed -->
					<div>
						<h3 class="mb-2 font-medium">Default Configuration</h3>
						<p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
							Only Ethereum & Base, editing allowed, no custom networks
						</p>
						<NetworkSelector />
					</div>

					<!-- More networks, no custom -->
					<div>
						<h3 class="mb-2 font-medium">Extended Networks</h3>
						<p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
							Ethereum, Base, Polygon, Arbitrum - no custom networks
						</p>
						<NetworkSelector
							supportedChainIds={[1, 8453, 137, 42161]}
							allowCustomNetworks={false}
						/>
					</div>

					<!-- All networks with custom support -->
					<div>
						<h3 class="mb-2 font-medium">All Networks + Custom</h3>
						<p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
							All preset networks + ability to add custom networks
						</p>
						<NetworkSelector supportedChainIds={undefined} allowCustomNetworks={true} />
					</div>

					<!-- Read-only mode -->
					<div>
						<h3 class="mb-2 font-medium">Read-only Mode</h3>
						<p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
							Only Ethereum & Base, no editing allowed
						</p>
						<NetworkSelector allowEditNetwork={false} />
					</div>

					<!-- RPC Load Balancing mode -->
					<div>
						<h3 class="mb-2 font-medium">RPC Load Balancing Enabled</h3>
						<p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
							Edit mode allows managing multiple RPC URLs
						</p>
						<NetworkSelector enableRpcLoadBalancing={true} />
					</div>
				</div>
			</div>

			<!-- Current Network Info -->
			{#if currentNetwork}
				<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
					<h2 class="mb-4 text-xl font-semibold">Current Network</h2>
					<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
						<div>
							<div class="text-sm text-gray-500 dark:text-gray-400">Name</div>
							<div class="font-medium">{currentNetwork.name}</div>
						</div>
						<div>
							<div class="text-sm text-gray-500 dark:text-gray-400">Chain ID</div>
							<div class="font-medium">{currentNetwork.chainId}</div>
						</div>
						<div>
							<div class="text-sm text-gray-500 dark:text-gray-400">Currency</div>
							<div class="font-medium">{currentNetwork.nativeCurrency.symbol}</div>
						</div>
						<div>
							<div class="text-sm text-gray-500 dark:text-gray-400">Type</div>
							<div class="font-medium">
								{networkStore.isCustomNetwork(currentNetwork.chainId) ? 'Custom' : 'Preset'}
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Network Statistics -->
			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<h2 class="mb-4 text-xl font-semibold">Network Statistics</h2>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
					<div class="text-center">
						<div class="text-2xl font-bold text-blue-500">{networks.length}</div>
						<div class="text-sm text-gray-600 dark:text-gray-400">Total Networks</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-green-500">
							{networks.filter((n) => !isTestnet(n.chainId)).length}
						</div>
						<div class="text-sm text-gray-600 dark:text-gray-400">Mainnets</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-yellow-500">
							{networks.filter((n) => isTestnet(n.chainId)).length}
						</div>
						<div class="text-sm text-gray-600 dark:text-gray-400">Testnets</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-purple-500">
							{networks.filter((n) => networkStore.isCustomNetwork(n.chainId)).length}
						</div>
						<div class="text-sm text-gray-600 dark:text-gray-400">Custom Networks</div>
					</div>
				</div>
			</div>

			<!-- Available Networks -->
			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<h2 class="mb-4 text-xl font-semibold">Available Networks</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each networks as network (network.chainId)}
						<div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
							<div class="mb-2 flex items-center justify-between">
								<h3 class="font-medium">{network.name}</h3>
								<div class="flex gap-2">
									{#if currentNetwork?.chainId === network.chainId}
										<span
											class="rounded bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900 dark:text-green-300"
										>
											Active
										</span>
									{/if}
									{#if networkStore.isCustomNetwork(network.chainId)}
										<span
											class="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700 dark:bg-purple-900 dark:text-purple-300"
										>
											Custom
										</span>
									{/if}
									{#if isTestnet(network.chainId)}
										<span
											class="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
										>
											Testnet
										</span>
									{/if}
								</div>
							</div>
							<div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
								<p>Chain ID: {network.chainId}</p>
								<p>Currency: {network.nativeCurrency.symbol}</p>
								<p>RPCs: {network.rpcUrls.length}</p>
								<p>Explorers: {network.blockExplorers.length}</p>
							</div>
							{#if currentNetwork?.chainId !== network.chainId}
								<button
									onclick={() => networkStore.switchNetwork(network.chainId)}
									class="mt-3 w-full rounded bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-600"
								>
									Switch to this network
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Test Actions -->
			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<h2 class="mb-4 text-xl font-semibold">Test Actions</h2>
				<div class="flex flex-wrap gap-4">
					<button
						onclick={() => networkStore.resetToPresetNetworks()}
						class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
					>
						Reset to Presets
					</button>
					<button
						onclick={async () => {
							// Add a test custom network
							try {
								await networkStore.addNetwork({
									chainId: 31337,
									name: 'Local Hardhat',
									rpcUrls: ['http://127.0.0.1:8545'],
									defaultRpcUrl: 'http://127.0.0.1:8545',
									nativeCurrency: {
										name: 'Ether',
										symbol: 'ETH',
										decimals: 18
									},
									blockExplorers: ['http://localhost:3000'],
									defaultBlockExplorer: 'http://localhost:3000'
								});
								alert('Test network added successfully!');
							} catch (err) {
								alert(`Failed to add test network: ${err}`);
							}
						}}
						class="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
					>
						Add Test Network
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
