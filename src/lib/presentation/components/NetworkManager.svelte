<script lang="ts">
	import type { NetworkConfig } from '$lib/domain/types/WalletTypes.js';
	import { networkStore } from '$lib/presentation/stores/networkStore.svelte';
	import Heading from '$lib/presentation/components/shared/Heading.svelte';
	import Text from '$lib/presentation/components/shared/Text.svelte';
	import ModalWrapper from '$lib/presentation/components/shared/ModalWrapper.svelte';
	import {
		X,
		Plus,
		Edit,
		Trash2,
		Save,
		AlertTriangle,
		Loader,
		RefreshCw,
		CheckCircle2,
		XCircle,
		Globe,
		Circle,
		Network,
		Server,
		Coins,
		Search as SearchIcon,
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
	let saveSuccess = $state(false);
	let saveError = $state('');

	// 获取网络状态
	const networks = $derived(networkStore.state.networks);
	const currentNetwork = $derived(networkStore.state.currentNetwork);

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
	}

	function addRpcUrl() {
		if (!formData.rpcUrls) {
			formData.rpcUrls = [];
		}
		formData.rpcUrls = [...formData.rpcUrls, ''];
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
		}
	}

	function addBlockExplorer() {
		if (!formData.blockExplorers) {
			formData.blockExplorers = [];
		}
		formData.blockExplorers = [...formData.blockExplorers, ''];
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
		}
	}

	async function validateRpcUrl(url: string) {
		if (!url) {
			// 清除该 URL 的验证状态
			const states = { ...rpcValidationStates };
			delete states[url];
			rpcValidationStates = states;
			return;
		}

		// 设置验证中状态
		rpcValidationStates = {
			...rpcValidationStates,
			[url]: { isValidating: true }
		};

		try {
			const result = await networkStore.validateRpcUrl(url, formData.chainId);

			// 更新验证状态
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
				// 清除该 URL 的错误
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
			// 清除该 URL 的错误
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

		if (!formData.defaultRpcUrl) {
			errors.defaultRpcUrl = 'Default RPC required';
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

		if (!formData.defaultBlockExplorer) {
			errors.defaultBlockExplorer = 'Default explorer required';
		}

		if (Object.keys(errors).length > 0) {
			validationErrors = errors;
			return;
		}

		// 验证网络配置 - 并行验证所有 RPC
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
			} else {
				// NetworkManager 中始终进行完整验证
				await networkStore.updateNetwork(editingNetwork!.chainId, networkConfig, false);
			}

			cancelEdit();
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
		// 再次检查是否可以删除
		if (!networkStore.canDeleteNetwork(network.chainId)) {
			alert('This network cannot be deleted. Only custom networks can be removed.');
			return;
		}

		if (confirm(`Are you sure you want to delete "${network.name}"?\n\nThis action cannot be undone.`)) {
			try {
				networkStore.removeNetwork(network.chainId);
			} catch (error) {
				alert(error instanceof Error ? error.message : 'Failed to delete network');
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
		}
	}
</script>

<ModalWrapper {isOpen} {onClose} maxWidth="3xl" class="flex max-h-[90vh] flex-col overflow-hidden">
	<div
		class="flex items-center justify-between border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-white px-6 py-5 dark:border-slate-700/50 dark:from-slate-800 dark:to-slate-800/50"
	>
		<Heading level={2}>Manage Networks</Heading>
		<button
			onclick={onClose}
			class="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
		>
			<X class="h-5 w-5" />
		</button>
	</div>

	<div class="flex-1 overflow-y-auto bg-white p-6 dark:bg-slate-900">
		{#if editingNetwork || isAddingNew}
			<div class="space-y-6">
				<!-- Header -->
				<div
					class="flex items-center justify-between border-b border-slate-200/50 pb-4 dark:border-slate-700/50"
				>
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
				<div
					class="rounded-xl border border-slate-200/50 bg-slate-50/50 p-5 dark:border-slate-700/50 dark:bg-slate-800/30"
				>
					<div class="mb-4 flex items-center gap-2">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800"
						>
							<Network class="h-4 w-4 text-slate-600 dark:text-slate-400" />
						</div>
						<Heading level={4}>Basic Information</Heading>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
								Chain ID
							</label>
							<input
								type="number"
								bind:value={formData.chainId}
								disabled={!isAddingNew}
								class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-400 dark:focus:ring-slate-400/20 dark:disabled:bg-slate-800/50"
								placeholder="1"
							/>
							{#if validationErrors.chainId}
								<p class="mt-1 text-xs text-red-500">{validationErrors.chainId}</p>
							{/if}
						</div>

						<div>
							<label class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
								Network Name
							</label>
							<input
								type="text"
								bind:value={formData.name}
								class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-400 dark:focus:ring-slate-400/20"
								placeholder="Ethereum Mainnet"
							/>
							{#if validationErrors.name}
								<p class="mt-1 text-xs text-red-500">{validationErrors.name}</p>
							{/if}
						</div>
					</div>
				</div>

				<!-- RPC Configuration Section -->
				<div
					class="space-y-4 rounded-xl border border-slate-200/50 bg-slate-50/50 p-5 dark:border-slate-700/50 dark:bg-slate-800/30"
				>
					<div class="mb-2 flex items-center gap-2">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800"
						>
							<Server class="h-4 w-4 text-slate-600 dark:text-slate-400" />
						</div>
						<Heading level={4}>RPC Configuration</Heading>
					</div>

					{#each formData.rpcUrls || [] as url, index (url + '_' + index)}
						{@const validationState = rpcValidationStates[url]}
						<div class="space-y-2">
							<div class="flex gap-2">
								<div class="flex-1">
									<input
										type="url"
										value={url}
										oninput={(e) => updateRpcUrl(index, e.currentTarget.value)}
										onblur={(e) => validateRpcUrl(e.currentTarget.value)}
										class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-400 dark:focus:ring-slate-400/20"
										placeholder="https://rpc.example.com"
									/>
								</div>
								<button
									onclick={() => (formData.defaultRpcUrl = url)}
									class="rounded-lg p-2 transition-colors {formData.defaultRpcUrl === url
										? 'bg-green-50 text-green-500 dark:bg-green-900/20'
										: 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
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
									class="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900"
									title="Remove RPC"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>

							{#if validationState}
								<div
									class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs {validationState
										.result?.valid
										? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
										: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'}"
								>
									{#if validationState.isValidating}
										<Loader2 class="h-3 w-3 animate-spin" />
										<span>Checking...</span>
									{:else if validationState.result}
										{#if validationState.result.valid}
											<CheckCircle class="h-3 w-3" />
											<span>{validationState.result.latency}ms</span>
										{:else if validationState.result.error?.includes('ChainId mismatch')}
											<XCircle class="h-3 w-3" />
											<span
												>Chain ID mismatch: got {validationState.result.chainId}, expected {formData.chainId}</span
											>
										{:else}
											<XCircle class="h-3 w-3" />
											<span>Connection failed</span>
										{/if}
									{/if}
								</div>
							{/if}
						</div>
					{/each}

					<button
						onclick={addRpcUrl}
						class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
					>
						<Plus class="h-3.5 w-3.5" />
						Add RPC URL
					</button>

					{#if validationErrors.rpcUrls}
						<p class="text-xs text-red-500">{validationErrors.rpcUrls}</p>
					{/if}
				</div>

				<!-- Native Currency Section -->
				<div
					class="rounded-xl border border-slate-200/50 bg-slate-50/50 p-5 dark:border-slate-700/50 dark:bg-slate-800/30"
				>
					<div class="mb-4 flex items-center gap-2">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800"
						>
							<Coins class="h-4 w-4 text-slate-600 dark:text-slate-400" />
						</div>
						<Heading level={4}>Native Currency</Heading>
					</div>

					<div class="grid grid-cols-3 gap-3">
						<div>
							<label
								for="currency-name"
								class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400"
							>
								Name
							</label>
							<input
								id="currency-name"
								type="text"
								bind:value={formData.nativeCurrency!.name}
								class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-400 dark:focus:ring-slate-400/20"
								placeholder="Ether"
							/>
						</div>
						<div>
							<label
								for="currency-symbol"
								class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400"
							>
								Symbol
							</label>
							<input
								id="currency-symbol"
								type="text"
								bind:value={formData.nativeCurrency!.symbol}
								class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-400 dark:focus:ring-slate-400/20"
								placeholder="ETH"
							/>
						</div>
						<div>
							<label
								for="currency-decimals"
								class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400"
							>
								Decimals
							</label>
							<input
								id="currency-decimals"
								type="number"
								bind:value={formData.nativeCurrency!.decimals}
								class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-400 dark:focus:ring-slate-400/20"
								placeholder="18"
							/>
						</div>
					</div>
					{#if validationErrors.currency}
						<p class="mt-2 text-xs text-red-500">{validationErrors.currency}</p>
					{/if}
				</div>

				<!-- Block Explorers Section -->
				<div
					class="space-y-4 rounded-xl border border-slate-200/50 bg-slate-50/50 p-5 dark:border-slate-700/50 dark:bg-slate-800/30"
				>
					<div class="mb-4 flex items-center gap-2">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800"
						>
							<Search class="h-4 w-4 text-slate-600 dark:text-slate-400" />
						</div>
						<Heading level={4}>Block Explorers</Heading>
					</div>

					{#each formData.blockExplorers || [] as url, index (url + '_' + index)}
						<div class="flex gap-2">
							<input
								type="url"
								value={url}
								oninput={(e) => updateBlockExplorer(index, e.currentTarget.value)}
								onblur={(e) => validateBlockExplorer(e.currentTarget.value)}
								class="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-400 dark:focus:ring-slate-400/20"
								placeholder="https://etherscan.io"
							/>
							<button
								onclick={() => (formData.defaultBlockExplorer = url)}
								class="rounded-lg p-2 transition-colors {formData.defaultBlockExplorer === url
									? 'bg-green-50 text-green-500 dark:bg-green-900/20'
									: 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
								title={formData.defaultBlockExplorer === url
									? 'Default Explorer'
									: 'Set as default'}
							>
								{#if formData.defaultBlockExplorer === url}
									<CheckCircle class="h-4 w-4" />
								{:else}
									<Circle class="h-4 w-4" />
								{/if}
							</button>
							<button
								onclick={() => removeBlockExplorer(index)}
								class="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900"
								title="Remove Explorer"
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
						{#if validationErrors[`explorer_${url}`]}
							<p class="ml-2 text-xs text-red-500">{validationErrors[`explorer_${url}`]}</p>
						{/if}
					{/each}

					<button
						onclick={addBlockExplorer}
						class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
					>
						<Plus class="h-3.5 w-3.5" />
						Add Block Explorer
					</button>

					{#if validationErrors.blockExplorers}
						<p class="text-xs text-red-500">{validationErrors.blockExplorers}</p>
					{/if}
				</div>

				{#if validationErrors.save}
					<div
						class="flex items-center gap-2 rounded-lg bg-slate-100 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
					>
						<AlertCircle class="h-4 w-4" />
						<p class="text-sm">{validationErrors.save}</p>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="flex justify-end border-t border-slate-200/50 pt-4 dark:border-slate-700/50">
					<button
						onclick={handleSave}
						disabled={isValidating || isSaving}
						class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<button
						onclick={startAddNetwork}
						class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 font-medium text-white shadow-sm transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-md"
					>
						<Plus class="h-4 w-4" />
						Add Network
					</button>
					<button
						onclick={handleResetToPresets}
						class="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
					>
						<RefreshCw class="h-4 w-4" />
						Reset to Presets
					</button>
				</div>

				<div class="space-y-2">
					{#each networks as network (network.chainId)}
						<div
							class="flex items-center justify-between rounded-lg border border-slate-200/50 bg-white p-4 transition-all hover:shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800"
						>
							<div>
								<div class="font-medium text-slate-900 dark:text-slate-300">{network.name}</div>
								<div class="text-sm text-slate-500 dark:text-slate-400">
									Chain ID: {network.chainId} | {network.nativeCurrency.symbol}
								</div>
							</div>
							<div class="flex items-center gap-2">
								{#if currentNetwork?.chainId === network.chainId}
									<span
										class="rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-2 py-0.5 text-xs font-medium text-white"
									>
										Active
									</span>
								{/if}
								{#if !networkStore.isPresetNetwork(network.chainId)}
									<span
										class="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-medium text-white"
									>
										Custom
									</span>
								{:else if networkStore.isCustomNetwork(network.chainId)}
									<span
										class="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-2 py-0.5 text-xs font-medium text-white"
									>
										Modified
									</span>
								{/if}
								<button
									onclick={() => startEditNetwork(network)}
									class="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
								>
									<Edit2 class="h-4 w-4" />
								</button>
								{#if networkStore.canDeleteNetwork(network.chainId)}
									<button
										onclick={() => handleDelete(network)}
										class="rounded-lg p-2 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/50"
										title="Delete network"
									>
										<Trash2 class="h-4 w-4" />
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</ModalWrapper>

<style>
	.hover-button:hover {
		background-color: var(--wk-color-hover);
	}

	.hover-danger-button:hover {
		background-color: var(--wk-color-error-light);
		color: var(--wk-color-error);
	}

	.hover-error-button:hover {
		background-color: var(--wk-color-error-light);
	}

	.hover-secondary-button:hover {
		background-color: var(--wk-color-secondary-light);
		opacity: 0.2;
	}

	.hover-primary-button:hover {
		background-color: var(--wk-color-primary);
		opacity: 0.1;
	}

	.input-field:focus {
		outline: none;
		border-color: var(--wk-color-border-focus);
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	.input-field:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: var(--wk-color-background-tertiary);
	}
</style>
