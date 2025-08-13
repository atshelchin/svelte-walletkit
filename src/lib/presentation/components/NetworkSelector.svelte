<script lang="ts">
	import type { NetworkConfig } from '$lib/domain/types/WalletTypes.js';
	import { networkStore } from '$lib/presentation/stores/networkStore.svelte';
	import NetworkQuickEdit from './NetworkQuickEdit.svelte';
	import NetworkManager from './NetworkManagerV2.svelte';
	import ModalWrapper from '$lib/presentation/components/shared/ModalWrapper.svelte';
	import { ChevronDown, Globe, Check, PenLine, Plus } from '@lucide/svelte';

	interface Props {
		class?: string;
		supportedChainIds?: number[]; // 支持的网络链 ID，不传则显示所有
		allowCustomNetworks?: boolean; // 是否允许添加自定义网络，默认 false
		allowEditNetwork?: boolean; // 是否允许编辑网络，默认 true
		enableRpcLoadBalancing?: boolean; // 是否启用 RPC 负载均衡，默认 false
		onManageClick?: () => void;
		fullWidth?: boolean; // 是否占满容器宽度
		minWidth?: string; // 最小宽度
	}

	let {
		class: className = '',
		supportedChainIds = [1, 8453], // 默认只支持以太坊主网和 Base
		allowCustomNetworks = false,
		allowEditNetwork = true,
		enableRpcLoadBalancing = false,
		onManageClick,
		fullWidth = false,
		minWidth = '160px'
	}: Props = $props();

	let isOpen = $state(false);
	let dropdownRef = $state<HTMLDivElement>();
	let buttonRef = $state<HTMLButtonElement>();
	let editingNetwork = $state<NetworkConfig | null>(null);
	let showFullManager = $state(false);
	let dropdownPosition = $state<'bottom' | 'top'>('bottom');
	let dropdownStyle = $state('');

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

	function handleEditNetwork(event: Event, network: NetworkConfig) {
		event.stopPropagation();
		editingNetwork = network;
		isOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	// 检测是否移动设备
	const isMobile = $derived(() => {
		if (typeof window === 'undefined') return false;
		return window.innerWidth < 640; // sm breakpoint
	});

	// 计算下拉框位置
	function calculateDropdownPosition() {
		if (!buttonRef || !isOpen) return;

		// 移动端始终在底部显示
		if (isMobile()) {
			dropdownPosition = 'bottom';
			dropdownStyle = '';
			return;
		}

		const rect = buttonRef.getBoundingClientRect();
		const dropdownHeight = 320; // 预估下拉框高度
		const viewportHeight = window.innerHeight;
		const spaceBelow = viewportHeight - rect.bottom;
		const spaceAbove = rect.top;

		// 判断是否有足够空间在下方显示
		if (spaceBelow >= dropdownHeight || spaceBelow > spaceAbove) {
			dropdownPosition = 'bottom';
			dropdownStyle = `top: ${rect.height + 8}px;`;
		} else {
			dropdownPosition = 'top';
			dropdownStyle = `bottom: ${rect.height + 8}px;`;
		}
	}

	$effect(() => {
		if (isOpen) {
			calculateDropdownPosition();
			document.addEventListener('click', handleClickOutside);
			window.addEventListener('resize', calculateDropdownPosition);
			window.addEventListener('scroll', calculateDropdownPosition, true);
			return () => {
				document.removeEventListener('click', handleClickOutside);
				window.removeEventListener('resize', calculateDropdownPosition);
				window.removeEventListener('scroll', calculateDropdownPosition, true);
			};
		}
	});
</script>

<div bind:this={dropdownRef} class="relative {fullWidth ? 'w-full' : 'inline-block'} {className}">
	<!-- 触发按钮 -->
	<button
		bind:this={buttonRef}
		onclick={() => (isOpen = !isOpen)}
		disabled={isLoading}
		class="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 {fullWidth
			? 'w-full'
			: ''}"
		style={fullWidth ? '' : `min-width: ${minWidth};`}
	>
		<div class="flex items-center gap-2">
			{#if isLoading}
				<div
					class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500"
				></div>
			{:else if currentNetwork}
				<span class="text-base">{getNetworkIcon(currentNetwork)}</span>
				<span class="text-slate-900 dark:text-slate-200">{currentNetwork.name}</span>
			{:else}
				<Globe class="h-4 w-4 text-slate-500" />
				<span class="text-slate-500">Select Network</span>
			{/if}
		</div>
		<ChevronDown
			class="h-4 w-4 text-slate-400 transition-transform {isOpen
				? dropdownPosition === 'bottom'
					? 'rotate-180'
					: 'rotate-0'
				: dropdownPosition === 'bottom'
					? ''
					: 'rotate-180'}"
		/>
	</button>

	<!-- 下拉菜单 -->
	{#if isOpen && !isLoading}
		{#if isMobile()}
			<!-- 移动端: 全屏底部抽屉 -->
			<div
				class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
				onclick={() => (isOpen = false)}
				onkeydown={(e) => e.key === 'Escape' && (isOpen = false)}
				role="button"
				tabindex="-1"
				aria-label="Close network selector"
			></div>
			<div
				class="fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl bg-white shadow-xl dark:bg-slate-900"
			>
				<div class="mx-auto mt-3 mb-2 h-1 w-12 rounded-full bg-slate-300 dark:bg-slate-600"></div>
				<div class="max-h-[60vh] overflow-y-auto">
					{#if mainnetNetworks.length > 0}
						<div>
							<div
								class="sticky top-0 bg-gradient-to-r from-slate-50 to-white px-4 py-2 text-xs font-semibold tracking-wider text-slate-600 uppercase dark:from-slate-900 dark:to-slate-800 dark:text-slate-500"
							>
								Mainnet
							</div>
							{#each mainnetNetworks as network (network.chainId)}
								<div
									class="group mx-4 flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-indigo-50 dark:hover:bg-slate-800/50 {currentNetwork?.chainId ===
									network.chainId
										? 'bg-indigo-100 ring-1 ring-indigo-500/20 dark:bg-indigo-950/20'
										: ''}"
								>
									<button
										onclick={() => handleNetworkSelect(network)}
										class="flex flex-1 items-center gap-3 text-left"
									>
										<span class="text-lg">{getNetworkIcon(network)}</span>
										<div class="flex-1">
											<div class="font-medium text-slate-900 dark:text-slate-200">
												{network.name}
											</div>
											<div class="text-xs text-slate-500 dark:text-slate-500">
												Chain ID: {network.chainId}
											</div>
										</div>
										{#if currentNetwork?.chainId === network.chainId}
											<Check class="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
										{/if}
										{#if networkStore.isCustomNetwork(network.chainId)}
											<span
												class="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-medium text-white/90 shadow-sm"
												>Custom</span
											>
										{/if}
									</button>
									{#if allowEditNetwork}
										<button
											onclick={(e) => handleEditNetwork(e, network)}
											class="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-indigo-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
											title="Edit network"
										>
											<PenLine class="h-3.5 w-3.5" />
										</button>
									{/if}
								</div>
							{/each}
						</div>
					{/if}

					{#if testnetNetworks.length > 0}
						<div>
							<div
								class="sticky top-0 bg-gradient-to-r from-slate-50 to-white px-4 py-2 text-xs font-semibold tracking-wider text-slate-600 uppercase dark:from-slate-900 dark:to-slate-800 dark:text-slate-500"
							>
								Testnet
							</div>
							{#each testnetNetworks as network (network.chainId)}
								<div
									class="group mx-4 flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-indigo-50 dark:hover:bg-slate-800/50 {currentNetwork?.chainId ===
									network.chainId
										? 'bg-indigo-100 ring-1 ring-indigo-500/20 dark:bg-indigo-950/20'
										: ''}"
								>
									<button
										onclick={() => handleNetworkSelect(network)}
										class="flex flex-1 items-center gap-3 text-left"
									>
										<span class="text-lg">{getNetworkIcon(network)}</span>
										<div class="flex-1">
											<div class="font-medium text-slate-900 dark:text-slate-200">
												{network.name}
											</div>
											<div class="text-xs text-slate-500 dark:text-slate-500">
												Chain ID: {network.chainId}
											</div>
										</div>
										{#if currentNetwork?.chainId === network.chainId}
											<Check class="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
										{/if}
										{#if networkStore.isCustomNetwork(network.chainId)}
											<span
												class="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-medium text-white/90 shadow-sm"
												>Custom</span
											>
										{/if}
									</button>
									{#if allowEditNetwork}
										<button
											onclick={(e) => handleEditNetwork(e, network)}
											class="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-indigo-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
											title="Edit network"
										>
											<PenLine class="h-3.5 w-3.5" />
										</button>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
				{#if allowCustomNetworks}
					<div
						class="border-t border-slate-200/50 bg-white p-4 dark:border-slate-700/50 dark:bg-slate-900"
					>
						<button
							onclick={handleManageClick}
							class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-medium text-indigo-600 transition-all hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/20"
						>
							<Plus class="h-4 w-4" />
							<span>Add Custom Network</span>
						</button>
					</div>
				{/if}
			</div>
		{:else}
			<!-- 桌面端: 普通下拉 -->
			<div
				class="absolute left-0 z-50 w-64 rounded-xl border border-slate-200/50 bg-white shadow-lg ring-1 ring-slate-900/5 dark:border-slate-700/50 dark:bg-slate-900 dark:ring-white/5 {dropdownPosition ===
				'bottom'
					? 'origin-top-left'
					: 'origin-bottom-left'}"
				style={dropdownStyle}
			>
				<div
					class="max-h-80 overflow-y-auto rounded-xl bg-gradient-to-b from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50"
				>
					{#if mainnetNetworks.length > 0}
						<div>
							<div
								class="sticky top-0 bg-gradient-to-r from-slate-50 to-white px-3 py-2 text-xs font-semibold tracking-wider text-slate-600 uppercase dark:from-slate-900 dark:to-slate-800 dark:text-slate-500"
							>
								Mainnet
							</div>
							{#each mainnetNetworks as network (network.chainId)}
								<div
									class="group mx-4 flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-indigo-50 dark:hover:bg-slate-800/50 {currentNetwork?.chainId ===
									network.chainId
										? 'bg-indigo-100 ring-1 ring-indigo-500/20 dark:bg-indigo-950/20'
										: ''}"
								>
									<button
										onclick={() => handleNetworkSelect(network)}
										class="flex flex-1 items-center gap-3 text-left"
									>
										<span class="text-lg">{getNetworkIcon(network)}</span>
										<div class="flex-1">
											<div class="font-medium text-slate-900 dark:text-slate-200">
												{network.name}
											</div>
											<div class="text-xs text-slate-500 dark:text-slate-500">
												Chain ID: {network.chainId}
											</div>
										</div>
										{#if currentNetwork?.chainId === network.chainId}
											<Check class="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
										{/if}
										{#if networkStore.isCustomNetwork(network.chainId)}
											<span
												class="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-medium text-white/90 shadow-sm"
												>Custom</span
											>
										{/if}
									</button>
									{#if allowEditNetwork}
										<button
											onclick={(e) => handleEditNetwork(e, network)}
											class="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-indigo-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
											title="Edit network"
										>
											<PenLine class="h-3.5 w-3.5" />
										</button>
									{/if}
								</div>
							{/each}
						</div>
					{/if}

					{#if testnetNetworks.length > 0}
						<div>
							<div
								class="sticky top-0 bg-gradient-to-r from-slate-50 to-white px-4 py-2 text-xs font-semibold tracking-wider text-slate-600 uppercase dark:from-slate-900 dark:to-slate-800 dark:text-slate-500"
							>
								Testnet
							</div>
							{#each testnetNetworks as network (network.chainId)}
								<div
									class="group mx-4 flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-indigo-50 dark:hover:bg-slate-800/50 {currentNetwork?.chainId ===
									network.chainId
										? 'bg-indigo-100 ring-1 ring-indigo-500/20 dark:bg-indigo-950/20'
										: ''}"
								>
									<button
										onclick={() => handleNetworkSelect(network)}
										class="flex flex-1 items-center gap-3 text-left"
									>
										<span class="text-lg">{getNetworkIcon(network)}</span>
										<div class="flex-1">
											<div class="font-medium text-slate-900 dark:text-slate-200">
												{network.name}
											</div>
											<div class="text-xs text-slate-500 dark:text-slate-500">
												Chain ID: {network.chainId}
											</div>
										</div>
										{#if currentNetwork?.chainId === network.chainId}
											<Check class="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
										{/if}
										{#if networkStore.isCustomNetwork(network.chainId)}
											<span
												class="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-medium text-white/90 shadow-sm"
												>Custom</span
											>
										{/if}
									</button>
									{#if allowEditNetwork}
										<button
											onclick={(e) => handleEditNetwork(e, network)}
											class="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-indigo-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
											title="Edit network"
										>
											<PenLine class="h-3.5 w-3.5" />
										</button>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
				{#if allowCustomNetworks}
					<div
						class="rounded-b-xl border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-white p-2 dark:border-slate-700/50 dark:from-slate-800 dark:to-slate-900"
					>
						<button
							onclick={handleManageClick}
							class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-medium text-indigo-600 transition-all hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/20"
						>
							<Plus class="h-4 w-4" />
							<span>Add Custom Network</span>
						</button>
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<!-- 快速编辑模态框 -->
<ModalWrapper isOpen={!!editingNetwork} onClose={() => (editingNetwork = null)} maxWidth="md">
	{#if editingNetwork}
		<NetworkQuickEdit
			network={editingNetwork}
			{enableRpcLoadBalancing}
			onClose={() => (editingNetwork = null)}
		/>
	{/if}
</ModalWrapper>

<!-- 完整网络管理器（仅在允许自定义网络时） -->
{#if showFullManager && allowCustomNetworks}
	<NetworkManager isOpen={true} onClose={() => (showFullManager = false)} />
{/if}
