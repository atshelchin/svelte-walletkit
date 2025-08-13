<script lang="ts">
	import type { NetworkConfig } from '$lib/domain/types/WalletTypes.js';
	import { networkStore } from '$lib/presentation/stores/networkStore.svelte';
	import NetworkQuickEdit from './NetworkQuickEdit.svelte';
	import NetworkManager from './NetworkManager.svelte';
	import { ChevronDown, Globe, Check, Edit2, Plus } from '@lucide/svelte';

	interface Props {
		class?: string;
		supportedChainIds?: number[]; // 支持的网络链 ID，不传则显示所有
		allowCustomNetworks?: boolean; // 是否允许添加自定义网络，默认 false
		allowEditNetwork?: boolean; // 是否允许编辑网络，默认 true
		enableRpcLoadBalancing?: boolean; // 是否启用 RPC 负载均衡，默认 false
		onManageClick?: () => void;
	}

	let {
		class: className = '',
		supportedChainIds = [1, 8453], // 默认只支持以太坊主网和 Base
		allowCustomNetworks = false,
		allowEditNetwork = true,
		enableRpcLoadBalancing = false,
		onManageClick
	}: Props = $props();

	let isOpen = $state(false);
	let dropdownRef = $state<HTMLDivElement>();
	let editingNetwork = $state<NetworkConfig | null>(null);
	let showFullManager = $state(false);

	// 获取网络状态
	const allNetworks = $derived(networkStore.state.networks);
	const currentNetwork = $derived(networkStore.state.currentNetwork);
	const isLoading = $derived(networkStore.state.isLoading);

	// 过滤网络
	const networks = $derived(() => {
		let filtered = allNetworks;

		// 如果不允许自定义网络，过滤支持的网络
		if (!allowCustomNetworks && supportedChainIds) {
			filtered = filtered.filter((n) => supportedChainIds.includes(n.chainId));
		}

		return filtered;
	});

	// 网络分组
	const mainnetNetworks = $derived(networks().filter((n) => !isTestnet(n.chainId)));
	const testnetNetworks = $derived(networks().filter((n) => isTestnet(n.chainId)));

	function isTestnet(chainId: number): boolean {
		// 常见的测试网 chainIds
		const testnetChainIds = [5, 11155111, 80001, 97, 421613, 420, 43113, 4002, 84531];
		return testnetChainIds.includes(chainId);
	}

	function getNetworkIcon(network: NetworkConfig): string {
		// 可以根据网络返回不同的图标
		switch (network.chainId) {
			case 1:
				return '🔷'; // Ethereum
			case 137:
				return '🟣'; // Polygon
			case 56:
				return '🟡'; // BSC
			case 42161:
				return '🔵'; // Arbitrum
			case 10:
				return '🔴'; // Optimism
			case 43114:
				return '🔺'; // Avalanche
			case 250:
				return '👻'; // Fantom
			case 8453:
				return '🔷'; // Base
			default:
				return '🌐';
		}
	}

	async function handleNetworkSelect(network: NetworkConfig) {
		if (network.chainId === currentNetwork?.chainId) {
			isOpen = false;
			return;
		}

		try {
			await networkStore.switchNetwork(network.chainId);
			isOpen = false;
		} catch (error) {
			console.error('Failed to switch network:', error);
		}
	}

	function handleManageClick() {
		isOpen = false;
		if (onManageClick) {
			onManageClick();
		} else {
			showFullManager = true;
		}
	}

	function handleEditNetwork(e: Event, network: NetworkConfig) {
		e.stopPropagation();
		editingNetwork = network;
		isOpen = false;
	}

	// 点击外部关闭
	$effect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
				isOpen = false;
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	});
</script>

<div bind:this={dropdownRef} class="relative {className}">
	<button
		onclick={() => (isOpen = !isOpen)}
		disabled={isLoading}
		class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
	>
		{#if currentNetwork}
			<span class="text-lg">{getNetworkIcon(currentNetwork)}</span>
			<span class="font-medium">{currentNetwork.name}</span>
		{:else}
			<Globe class="h-5 w-5" />
			<span>Select Network</span>
		{/if}
		<ChevronDown class="ml-1 h-4 w-4" />
	</button>

	{#if isOpen}
		<div
			class="absolute top-full z-50 mt-2 flex max-h-96 w-72 flex-col rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="flex-1 overflow-y-auto">
				<div class="p-2">
					{#if mainnetNetworks.length > 0}
						<div class="mb-2">
							<div
								class="sticky top-0 bg-white px-3 py-2 text-xs font-semibold text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400"
							>
								Mainnet
							</div>
							{#each mainnetNetworks as network (network.chainId)}
								<div
									class="group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
									class:bg-blue-50={currentNetwork?.chainId === network.chainId}
									class:dark:bg-blue-900={currentNetwork?.chainId === network.chainId}
								>
									<button
										onclick={() => handleNetworkSelect(network)}
										class="flex flex-1 items-center gap-3 text-left"
									>
										<span class="text-lg">{getNetworkIcon(network)}</span>
										<div class="flex-1">
											<div class="font-medium">{network.name}</div>
											<div class="text-xs text-gray-500 dark:text-gray-400">
												Chain ID: {network.chainId}
											</div>
										</div>
										{#if currentNetwork?.chainId === network.chainId}
											<Check class="h-4 w-4 text-blue-500" />
										{/if}
										{#if networkStore.isCustomNetwork(network.chainId)}
											<span class="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-600"
												>Custom</span
											>
										{/if}
									</button>
									{#if allowEditNetwork}
										<button
											onclick={(e) => handleEditNetwork(e, network)}
											class="rounded p-1.5 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600"
											title="Edit network"
										>
											<Edit2 class="h-3.5 w-3.5" />
										</button>
									{/if}
								</div>
							{/each}
						</div>
					{/if}

					{#if testnetNetworks.length > 0}
						<div class="mb-2">
							<div
								class="sticky top-0 bg-white px-3 py-2 text-xs font-semibold text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400"
							>
								Testnet
							</div>
							{#each testnetNetworks as network (network.chainId)}
								<div
									class="group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
									class:bg-blue-50={currentNetwork?.chainId === network.chainId}
									class:dark:bg-blue-900={currentNetwork?.chainId === network.chainId}
								>
									<button
										onclick={() => handleNetworkSelect(network)}
										class="flex flex-1 items-center gap-3 text-left"
									>
										<span class="text-lg">{getNetworkIcon(network)}</span>
										<div class="flex-1">
											<div class="font-medium">{network.name}</div>
											<div class="text-xs text-gray-500 dark:text-gray-400">
												Chain ID: {network.chainId}
											</div>
										</div>
										{#if currentNetwork?.chainId === network.chainId}
											<Check class="h-4 w-4 text-blue-500" />
										{/if}
										{#if networkStore.isCustomNetwork(network.chainId)}
											<span class="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-600"
												>Custom</span
											>
										{/if}
									</button>
									{#if allowEditNetwork}
										<button
											onclick={(e) => handleEditNetwork(e, network)}
											class="rounded p-1.5 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600"
											title="Edit network"
										>
											<Edit2 class="h-3.5 w-3.5" />
										</button>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			{#if allowCustomNetworks}
				<div class="border-t border-gray-200 p-2 dark:border-gray-700">
					<button
						onclick={handleManageClick}
						class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<Plus class="h-4 w-4" />
						<span>Add Custom Network</span>
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- 快速编辑模态框 -->
{#if editingNetwork}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="w-full max-w-md rounded-lg bg-white dark:bg-gray-800">
			<NetworkQuickEdit
				network={editingNetwork}
				{enableRpcLoadBalancing}
				onClose={() => (editingNetwork = null)}
			/>
		</div>
	</div>
{/if}

<!-- 完整网络管理器（仅在允许自定义网络时） -->
{#if showFullManager && allowCustomNetworks}
	<NetworkManager isOpen={true} onClose={() => (showFullManager = false)} />
{/if}
