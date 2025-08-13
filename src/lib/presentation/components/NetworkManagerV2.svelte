<script lang="ts">
	import type { NetworkConfig } from '$lib/domain/types/WalletTypes.js';
	import { networkStore } from '$lib/presentation/stores/networkStore.svelte';
	import Heading from '$lib/presentation/components/shared/Heading.svelte';
	import Text from '$lib/presentation/components/shared/Text.svelte';
	import ModalWrapper from '$lib/presentation/components/shared/ModalWrapper.svelte';
	import {
		X,
		Plus,
		Pencil,
		Trash2,
		Save,
		AlertCircle,
		Loader2,
		RefreshCw,
		CheckCircle,
		XCircle,
		Circle,
		Network,
		Server,
		Coins,
		Search,
		ChevronLeft,
		ChevronRight,
		Check
	} from '@lucide/svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	interface RpcValidationState {
		isValidating: boolean;
		result?: {
			valid: boolean;
			chainId?: number;
			latency?: number;
			error?: string;
		};
	}

	let { isOpen, onClose }: Props = $props();

	// 编辑状态
	let editingNetwork = $state<NetworkConfig | null>(null);
	let isAddingNew = $state(false);
	let formData = $state<Partial<NetworkConfig>>({});
	let validationErrors = $state<Record<string, string>>({});
	let isValidating = $state(false);
	let isSaving = $state(false);
	let rpcValidationStates = $state<Record<string, RpcValidationState>>({});
	
	// 搜索和分页状态
	let searchQuery = $state('');
	let currentPage = $state(1);
	let itemsPerPage = $state(10);
	
	// 反馈状态
	let saveSuccess = $state(false);
	let saveMessage = $state('');
	let showSuccessToast = $state(false);
	let toastMessage = $state('');
	let toastType = $state<'success' | 'error' | 'info'>('success');

	// 获取网络状态
	const networks = $derived(networkStore.state.networks);
	const currentNetwork = $derived(networkStore.state.currentNetwork);
	
	// 过滤的网络列表
	const filteredNetworks = $derived(() => {
		if (!searchQuery.trim()) return networks;
		const query = searchQuery.toLowerCase();
		return networks.filter(network => 
			network.name.toLowerCase().includes(query) ||
			network.chainId.toString().includes(query) ||
			network.nativeCurrency.symbol.toLowerCase().includes(query)
		);
	});
	
	// 显示Toast通知
	function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
		toastMessage = message;
		toastType = type;
		showSuccessToast = true;
		setTimeout(() => {
			showSuccessToast = false;
		}, 3000);
	}
	
	// 分页计算
	const totalPages = $derived(Math.ceil(filteredNetworks().length / itemsPerPage));
	const paginatedNetworks = $derived(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return filteredNetworks().slice(start, end);
	});
	
	// 页码数组
	const pageNumbers = $derived(() => {
		const pages = [];
		const maxVisible = 5;
		let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
		let end = Math.min(totalPages, start + maxVisible - 1);
		
		if (end - start < maxVisible - 1) {
			start = Math.max(1, end - maxVisible + 1);
		}
		
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		return pages;
	});
	
	// 重置到第一页当搜索查询改变
	$effect(() => {
		searchQuery;
		currentPage = 1;
	});

	function startAddNetwork() {
		isAddingNew = true;
		editingNetwork = null;
		formData = {
			chainId: undefined,
			name: '',
			rpcUrls: [''],
			defaultRpcUrl: '',
			nativeCurrency: {
				name: '',
				symbol: '',
				decimals: 18
			},
			blockExplorers: [''],
			defaultBlockExplorer: ''
		};
		validationErrors = {};
	}

	function startEditNetwork(network: NetworkConfig) {
		isAddingNew = false;
		editingNetwork = network;
		formData = {
			...network,
			rpcUrls: [...network.rpcUrls],
			blockExplorers: [...network.blockExplorers]
		};
		validationErrors = {};
	}

	function cancelEdit() {
		editingNetwork = null;
		isAddingNew = false;
		formData = {};
		validationErrors = {};
		rpcValidationStates = {};
		saveSuccess = false;
		saveMessage = '';
	}

	function addRpcUrl() {
		if (!formData.rpcUrls) {
			formData.rpcUrls = [];
		}
		formData.rpcUrls = [...formData.rpcUrls, ''];
		
		// 如果没有默认RPC，设置第一个为默认
		if (!formData.defaultRpcUrl && formData.rpcUrls.length === 1) {
			formData.defaultRpcUrl = formData.rpcUrls[0];
		}
	}

	function removeRpcUrl(index: number) {
		if (formData.rpcUrls) {
			formData.rpcUrls = formData.rpcUrls.filter((_, i) => i !== index);
		}
	}

	function updateRpcUrl(index: number, value: string) {
		if (formData.rpcUrls) {
			formData.rpcUrls[index] = value;
			formData.rpcUrls = [...formData.rpcUrls];
			
			// 如果这是第一个RPC且没有默认值，自动设为默认
			if (!formData.defaultRpcUrl && index === 0 && value) {
				formData.defaultRpcUrl = value;
			}
			
			// 如果修改的是默认RPC，更新默认值
			if (formData.defaultRpcUrl === formData.rpcUrls[index]) {
				formData.defaultRpcUrl = value;
			}
		}
	}

	function addBlockExplorer() {
		if (!formData.blockExplorers) {
			formData.blockExplorers = [];
		}
		formData.blockExplorers = [...formData.blockExplorers, ''];
		
		// 如果没有默认区块浏览器，设置第一个为默认
		if (!formData.defaultBlockExplorer && formData.blockExplorers.length === 1) {
			formData.defaultBlockExplorer = formData.blockExplorers[0];
		}
	}

	function removeBlockExplorer(index: number) {
		if (formData.blockExplorers) {
			formData.blockExplorers = formData.blockExplorers.filter((_, i) => i !== index);
		}
	}

	function updateBlockExplorer(index: number, value: string) {
		if (formData.blockExplorers) {
			formData.blockExplorers[index] = value;
			formData.blockExplorers = [...formData.blockExplorers];
			
			// 如果这是第一个区块浏览器且没有默认值，自动设为默认
			if (!formData.defaultBlockExplorer && index === 0 && value) {
				formData.defaultBlockExplorer = value;
			}
			
			// 如果修改的是默认区块浏览器，更新默认值
			if (formData.defaultBlockExplorer === formData.blockExplorers[index]) {
				formData.defaultBlockExplorer = value;
			}
		}
	}

	async function validateRpcUrl(url: string) {
		if (!url) {
			const states = { ...rpcValidationStates };
			delete states[url];
			rpcValidationStates = states;
			return;
		}

		rpcValidationStates = {
			...rpcValidationStates,
			[url]: { isValidating: true }
		};

		try {
			const result = await networkStore.validateRpcUrl(url, formData.chainId);
			rpcValidationStates = {
				...rpcValidationStates,
				[url]: {
					isValidating: false,
					result
				}
			};

			if (!result.valid) {
				validationErrors = {
					...validationErrors,
					[`rpc_${url}`]: result.error || 'Invalid RPC URL'
				};
			} else {
				const errors = { ...validationErrors };
				delete errors[`rpc_${url}`];
				validationErrors = errors;
			}
		} catch (error) {
			rpcValidationStates = {
				...rpcValidationStates,
				[url]: {
					isValidating: false,
					result: {
						valid: false,
						error: 'Failed to validate RPC URL'
					}
				}
			};

			validationErrors = {
				...validationErrors,
				[`rpc_${url}`]: 'Failed to validate RPC URL'
			};
		}
	}

	function validateBlockExplorer(url: string) {
		if (!url) return;

		const result = networkStore.validateBlockExplorer(url);
		if (!result.valid) {
			validationErrors = {
				...validationErrors,
				[`explorer_${url}`]: result.error || 'Invalid Block Explorer URL'
			};
		} else {
			const errors = { ...validationErrors };
			delete errors[`explorer_${url}`];
			validationErrors = errors;
		}
	}

	async function handleSave() {
		// 基本验证
		const errors: Record<string, string> = {};

		if (!formData.chainId || formData.chainId <= 0) {
			errors.chainId = 'Chain ID required';
		}

		if (!formData.name?.trim()) {
			errors.name = 'Name required';
		}

		if (!formData.rpcUrls || formData.rpcUrls.length === 0 || !formData.rpcUrls[0]) {
			errors.rpcUrls = 'RPC URL required';
		}

		// 如果没有选择默认RPC，使用第一个非空的RPC
		if (!formData.defaultRpcUrl && formData.rpcUrls) {
			const firstValidRpc = formData.rpcUrls.find(url => url && url.trim());
			if (firstValidRpc) {
				formData.defaultRpcUrl = firstValidRpc;
			} else {
				errors.defaultRpcUrl = 'Default RPC required';
			}
		}

		if (!formData.nativeCurrency?.symbol) {
			errors.currency = 'Currency required';
		}

		if (
			!formData.blockExplorers ||
			formData.blockExplorers.length === 0 ||
			!formData.blockExplorers[0]
		) {
			errors.blockExplorers = 'Explorer required';
		}

		// 如果没有选择默认区块浏览器，使用第一个非空的
		if (!formData.defaultBlockExplorer && formData.blockExplorers) {
			const firstValidExplorer = formData.blockExplorers.find(url => url && url.trim());
			if (firstValidExplorer) {
				formData.defaultBlockExplorer = firstValidExplorer;
			} else {
				errors.defaultBlockExplorer = 'Default explorer required';
			}
		}

		if (Object.keys(errors).length > 0) {
			validationErrors = errors;
			return;
		}

		// 验证网络配置
		isValidating = true;
		try {
			// 并行验证所有 RPC URLs
			const rpcValidations = formData.rpcUrls!.map((url: string) => validateRpcUrl(url));
			await Promise.all(rpcValidations);

			// 验证所有 Block Explorers
			formData.blockExplorers!.forEach((url: string) => validateBlockExplorer(url));

			// 检查是否有验证错误
			if (Object.keys(validationErrors).length > 0) {
				isValidating = false;
				return;
			}

			// 保存网络
			isSaving = true;
			
			const networkConfig: NetworkConfig = {
				chainId: formData.chainId!,
				name: formData.name!,
				rpcUrls: formData.rpcUrls!.filter((url) => url.trim()),
				defaultRpcUrl: formData.defaultRpcUrl!,
				nativeCurrency: formData.nativeCurrency!,
				blockExplorers: formData.blockExplorers!.filter((url) => url.trim()),
				defaultBlockExplorer: formData.defaultBlockExplorer!
			};

			if (isAddingNew) {
				await networkStore.addNetwork(networkConfig);
				console.log('Network added:', networkConfig);
				showToast('✨ Network added and saved!', 'success');
			} else {
				await networkStore.updateNetwork(editingNetwork!.chainId, networkConfig, false);
				console.log('Network updated:', networkConfig);
				showToast('✅ Network updated and saved!', 'success');
			}

			// 延迟关闭编辑界面
			setTimeout(() => {
				cancelEdit();
			}, 1500);
		} catch (error) {
			validationErrors = {
				save: error instanceof Error ? error.message : 'Failed to save network'
			};
		} finally {
			isValidating = false;
			isSaving = false;
		}
	}

	async function handleDelete(network: NetworkConfig) {
		// 检查是否可以删除
		if (!networkStore.canDeleteNetwork(network.chainId)) {
			showToast('⚠️ Only custom networks can be deleted', 'error');
			return;
		}

		if (confirm(`Are you sure you want to delete "${network.name}"?\n\nThis action cannot be undone.`)) {
			try {
				networkStore.removeNetwork(network.chainId);
				showToast(`🗑️ ${network.name} deleted successfully`, 'success');
			} catch (error) {
				showToast(error instanceof Error ? error.message : 'Failed to delete network', 'error');
			}
		}
	}

	function handleResetToPresets() {
		if (
			confirm(
				'Are you sure you want to reset all networks to presets? This will remove all custom networks and modifications.'
			)
		) {
			networkStore.resetToPresetNetworks();
			showToast('🔄 Networks reset to defaults', 'info');
		}
	}
</script>

<ModalWrapper {isOpen} {onClose} maxWidth="3xl" class="flex max-h-[85vh] flex-col overflow-hidden">
	<!-- Toast Notification -->
	{#if showSuccessToast}
		<div class="fixed top-4 right-4 z-50 animate-slide-in">
			<div class="flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm transition-all {toastType === 'success' ? 'bg-gradient-to-r from-emerald-500/90 to-green-500/90 text-white' : toastType === 'error' ? 'bg-gradient-to-r from-red-500/90 to-rose-500/90 text-white' : 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 text-white'}">
				<span class="text-sm font-medium">{toastMessage}</span>
			</div>
		</div>
	{/if}
	<div class="flex items-center justify-between border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-white px-4 py-4 sm:px-6 sm:py-5 dark:border-slate-700/50 dark:from-slate-800 dark:to-slate-800/50">
		<Heading level={2}>Manage Networks</Heading>
		<button
			onclick={onClose}
			class="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
		>
			<X class="h-5 w-5" />
		</button>
	</div>

	<div class="flex-1 overflow-y-auto bg-white p-4 sm:p-6 dark:bg-slate-900">
		{#if editingNetwork || isAddingNew}
			<!-- 编辑/添加网络表单 -->
			<div class="space-y-6">
				<!-- Header -->
				<div class="flex items-center justify-between border-b border-slate-200/50 pb-4 dark:border-slate-700/50">
					<div>
						<Heading level={3}>
							{isAddingNew ? 'Add New Network' : 'Edit Network'}
						</Heading>
						{#if !isAddingNew && editingNetwork}
							<Text variant="muted" class="mt-1">
								Modifying {editingNetwork.name}
							</Text>
						{/if}
					</div>
					<button
						onclick={cancelEdit}
						class="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
					>
						<X class="h-5 w-5" />
					</button>
				</div>

				<!-- Basic Information Section -->
				<div class="rounded-xl border border-slate-200/50 bg-slate-50/50 p-5 dark:border-slate-700/50 dark:bg-slate-800/30">
					<div class="mb-4 flex items-center gap-2">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
							<Network class="h-4 w-4 text-slate-600 dark:text-slate-400" />
						</div>
						<Heading level={4}>Basic Information</Heading>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="chain-id" class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
								Chain ID
							</label>
							<input
								id="chain-id"
								type="number"
								bind:value={formData.chainId}
								disabled={!isAddingNew}
								class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-400 dark:focus:ring-slate-400/20 dark:disabled:bg-slate-800/50"
								placeholder="1"
							/>
							{#if validationErrors.chainId}
								<p class="mt-1 text-xs text-red-500">{validationErrors.chainId}</p>
							{/if}
						</div>

						<div>
							<label for="network-name" class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
								Network Name
							</label>
							<input
								id="network-name"
								type="text"
								bind:value={formData.name}
								class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-400 dark:focus:ring-slate-400/20"
								placeholder="Ethereum Mainnet"
							/>
							{#if validationErrors.name}
								<p class="mt-1 text-xs text-red-500">{validationErrors.name}</p>
							{/if}
						</div>
					</div>
				</div>

				<!-- RPC Configuration Section -->
				<div class="rounded-xl border border-slate-200/50 bg-slate-50/50 p-5 dark:border-slate-700/50 dark:bg-slate-800/30">
					<div class="mb-4 flex items-center gap-2">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20">
							<Server class="h-4 w-4 text-blue-600 dark:text-blue-400" />
						</div>
						<Heading level={4}>RPC Configuration</Heading>
					</div>

					<div class="space-y-3">
						{#each formData.rpcUrls || [] as url, index (url + '_' + index)}
							{@const validationState = rpcValidationStates[url]}
							<div class="group relative rounded-lg border border-slate-200/50 bg-white p-3 transition-all hover:shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50">
								<div class="flex gap-2">
									<div class="flex-1">
										<input
											type="url"
											value={url}
											oninput={(e) => updateRpcUrl(index, e.currentTarget.value)}
											onblur={(e) => validateRpcUrl(e.currentTarget.value)}
											class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
											placeholder="https://rpc.example.com"
										/>
									</div>
									<button
										onclick={() => (formData.defaultRpcUrl = url)}
										class="rounded-lg p-2 transition-all {formData.defaultRpcUrl === url
											? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm'
											: 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'}"
										title={formData.defaultRpcUrl === url ? 'Default RPC' : 'Set as default'}
									>
										{#if formData.defaultRpcUrl === url}
											<CheckCircle class="h-4 w-4" />
										{:else}
											<Circle class="h-4 w-4" />
										{/if}
									</button>
									<button
										onclick={() => removeRpcUrl(index)}
										class="rounded-lg p-2 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
										title="Remove RPC"
									>
										<Trash2 class="h-4 w-4" />
									</button>
								</div>

								{#if validationState}
									<div class="mt-2 flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs {validationState.result?.valid
										? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
										: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}">
										{#if validationState.isValidating}
											<Loader2 class="h-3 w-3 animate-spin" />
											<span>Validating connection...</span>
										{:else if validationState.result}
											{#if validationState.result.valid}
												<CheckCircle class="h-3 w-3" />
												<span>Connected • {validationState.result.latency}ms latency</span>
											{:else}
												<XCircle class="h-3 w-3" />
												<span>{validationState.result.error || 'Connection failed'}</span>
											{/if}
										{/if}
									</div>
								{/if}
							</div>
						{/each}

						<button
							onclick={addRpcUrl}
							class="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-800/50"
						>
							<Plus class="h-4 w-4" />
							Add RPC URL
						</button>
					</div>

					{#if validationErrors.rpcUrls}
						<p class="mt-2 text-xs text-red-500">{validationErrors.rpcUrls}</p>
					{/if}
				</div>

				<!-- Native Currency Section -->
				<div class="rounded-xl border border-slate-200/50 bg-slate-50/50 p-5 dark:border-slate-700/50 dark:bg-slate-800/30">
					<div class="mb-4 flex items-center gap-2">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/10 to-yellow-500/10 dark:from-amber-500/20 dark:to-yellow-500/20">
							<Coins class="h-4 w-4 text-amber-600 dark:text-amber-400" />
						</div>
						<Heading level={4}>Native Currency</Heading>
					</div>

					<div class="grid grid-cols-3 gap-3">
						<div>
							<label for="currency-name" class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
								Name
							</label>
							<input
								id="currency-name"
								type="text"
								bind:value={formData.nativeCurrency!.name}
								class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-amber-400 dark:focus:ring-amber-400/20"
								placeholder="Ether"
							/>
						</div>
						<div>
							<label for="currency-symbol" class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
								Symbol
							</label>
							<input
								id="currency-symbol"
								type="text"
								bind:value={formData.nativeCurrency!.symbol}
								class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-amber-400 dark:focus:ring-amber-400/20"
								placeholder="ETH"
							/>
						</div>
						<div>
							<label for="currency-decimals" class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
								Decimals
							</label>
							<input
								id="currency-decimals"
								type="number"
								bind:value={formData.nativeCurrency!.decimals}
								class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-amber-400 dark:focus:ring-amber-400/20"
								placeholder="18"
							/>
						</div>
					</div>
					{#if validationErrors.currency}
						<p class="mt-2 text-xs text-red-500">{validationErrors.currency}</p>
					{/if}
				</div>

				<!-- Block Explorers Section -->
				<div class="rounded-xl border border-slate-200/50 bg-slate-50/50 p-5 dark:border-slate-700/50 dark:bg-slate-800/30">
					<div class="mb-4 flex items-center gap-2">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
							<Search class="h-4 w-4 text-purple-600 dark:text-purple-400" />
						</div>
						<Heading level={4}>Block Explorers</Heading>
					</div>

					<div class="space-y-3">
						{#each formData.blockExplorers || [] as url, index (url + '_' + index)}
							<div class="group relative rounded-lg border border-slate-200/50 bg-white p-3 transition-all hover:shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50">
								<div class="flex gap-2">
									<input
										type="url"
										value={url}
										oninput={(e) => updateBlockExplorer(index, e.currentTarget.value)}
										onblur={(e) => validateBlockExplorer(e.currentTarget.value)}
										class="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-purple-400 dark:focus:ring-purple-400/20"
										placeholder="https://etherscan.io"
									/>
									<button
										onclick={() => (formData.defaultBlockExplorer = url)}
										class="rounded-lg p-2 transition-all {formData.defaultBlockExplorer === url
											? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm'
											: 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'}"
										title={formData.defaultBlockExplorer === url ? 'Default Explorer' : 'Set as default'}
									>
										{#if formData.defaultBlockExplorer === url}
											<CheckCircle class="h-4 w-4" />
										{:else}
											<Circle class="h-4 w-4" />
										{/if}
									</button>
									<button
										onclick={() => removeBlockExplorer(index)}
										class="rounded-lg p-2 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
										title="Remove Explorer"
									>
										<Trash2 class="h-4 w-4" />
									</button>
								</div>
								{#if validationErrors[`explorer_${url}`]}
									<p class="mt-2 text-xs text-red-500">{validationErrors[`explorer_${url}`]}</p>
								{/if}
							</div>
						{/each}

						<button
							onclick={addBlockExplorer}
							class="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-800/50"
						>
							<Plus class="h-4 w-4" />
							Add Block Explorer
						</button>
					</div>

					{#if validationErrors.blockExplorers}
						<p class="mt-2 text-xs text-red-500">{validationErrors.blockExplorers}</p>
					{/if}
				</div>

				{#if validationErrors.save}
					<div class="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
						<AlertCircle class="h-4 w-4" />
						<p class="text-sm">{validationErrors.save}</p>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="flex justify-between border-t border-slate-200/50 pt-4 dark:border-slate-700/50">
					<button
						onclick={cancelEdit}
						class="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
					>
						<X class="h-4 w-4" />
						Cancel
					</button>
					<button
						onclick={handleSave}
						disabled={isValidating || isSaving}
						class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 font-medium text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isValidating || isSaving}
							<Loader2 class="h-4 w-4 animate-spin" />
							{isValidating ? 'Validating...' : 'Saving...'}
						{:else}
							<Save class="h-4 w-4" />
							Save Network
						{/if}
					</button>
				</div>
			</div>
		{:else}
			<!-- 网络列表 -->
			<div class="space-y-4">
				<!-- 顶部操作栏 -->
				<div class="space-y-3">
					<!-- 按钮组 -->
					<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div class="flex flex-wrap gap-2">
							<button
								onclick={startAddNetwork}
								class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl"
							>
								<Plus class="h-4 w-4" />
								Add Network
							</button>
							<button
								onclick={handleResetToPresets}
								class="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
							>
								<RefreshCw class="h-4 w-4" />
								Reset
							</button>
						</div>
						
						<!-- 搜索框 - 桌面端 -->
						<div class="relative hidden sm:block">
							<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<input
								type="text"
								bind:value={searchQuery}
								placeholder="Search networks..."
								class="w-56 rounded-lg border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
							/>
						</div>
					</div>
					
					<!-- 搜索框 - 移动端 -->
					<div class="relative sm:hidden">
						<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Search networks..."
							class="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
						/>
					</div>
				</div>

				<!-- 网络列表 -->
				{#if filteredNetworks().length === 0}
					<div class="flex flex-col items-center justify-center py-12 text-center">
						<div class="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
							<Search class="h-8 w-8 text-slate-400" />
						</div>
						<p class="text-lg font-medium text-slate-600 dark:text-slate-400">No networks found</p>
						<p class="mt-1 text-sm text-slate-500 dark:text-slate-500">
							{searchQuery ? 'Try adjusting your search' : 'Add a network to get started'}
						</p>
					</div>
				{:else}
					<div class="min-h-[320px]">
						<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{#each paginatedNetworks() as network (network.chainId)}
							<div class="group relative overflow-hidden rounded-xl border border-slate-200/50 bg-gradient-to-br from-white to-slate-50/50 p-3 transition-all hover:shadow-lg hover:ring-2 hover:ring-indigo-500/20 dark:border-slate-700/50 dark:from-slate-800/50 dark:to-slate-900/50 dark:hover:ring-indigo-400/20">
								<div class="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-xl transition-all group-hover:from-indigo-500/10 group-hover:to-purple-500/10"></div>
								<div class="relative">
									<div class="mb-2.5">
										<div class="flex items-center justify-between">
											<div class="min-w-0 flex-1">
												<div class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
													{network.name}
												</div>
												<div class="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
													<span class="font-medium">{network.nativeCurrency.symbol}</span>
													<span>•</span>
													<span class="font-mono">#{network.chainId}</span>
												</div>
											</div>
											<div class="flex flex-col items-end gap-1">
												{#if currentNetwork?.chainId === network.chainId}
													<span class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
														<div class="h-1 w-1 animate-pulse rounded-full bg-white"></div>
														Active
													</span>
												{/if}
												{#if !networkStore.isPresetNetwork(network.chainId)}
													<span class="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
														Custom
													</span>
												{:else if networkStore.isCustomNetwork(network.chainId)}
													<span class="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
														Modified
													</span>
												{/if}
											</div>
										</div>
									</div>

									<div class="flex items-center gap-1.5">
										<button
											onclick={() => startEditNetwork(network)}
											class="flex-1 rounded-lg bg-slate-100/80 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-600"
										>
											<Pencil class="mr-1 inline h-3 w-3" />
											Edit
										</button>
										{#if networkStore.canDeleteNetwork(network.chainId)}
											<button
												onclick={() => handleDelete(network)}
												class="rounded-lg bg-red-50/80 p-1.5 text-red-500 transition-all hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
												title="Delete network"
											>
												<Trash2 class="h-3.5 w-3.5" />
											</button>
										{/if}
									</div>
								</div>
							</div>
						{/each}
						</div>
					</div>
				{/if}

				<!-- 分页控件 -->
				{#if totalPages > 1}
					<div class="flex items-center justify-center gap-1 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
						<button
							onclick={() => currentPage = Math.max(1, currentPage - 1)}
							disabled={currentPage === 1}
							class="rounded-lg p-1.5 text-slate-500 transition-all hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700"
						>
							<ChevronLeft class="h-4 w-4" />
						</button>
						
						<div class="flex items-center gap-1">
							{#each pageNumbers() as page}
								<button
									onclick={() => currentPage = page}
									class="min-w-[1.75rem] rounded-lg px-2 py-1 text-xs font-medium transition-all {currentPage === page 
										? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm' 
										: 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'}"
								>
									{page}
								</button>
							{/each}
						</div>
						
						<button
							onclick={() => currentPage = Math.min(totalPages, currentPage + 1)}
							disabled={currentPage === totalPages}
							class="rounded-lg p-1.5 text-slate-500 transition-all hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700"
						>
							<ChevronRight class="h-4 w-4" />
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</ModalWrapper>

<style>
	@keyframes slide-in {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
	
	.animate-slide-in {
		animation: slide-in 0.3s ease-out;
	}
</style>