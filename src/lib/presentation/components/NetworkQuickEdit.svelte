<script lang="ts">
	import type { NetworkConfig } from '$lib/domain/types/WalletTypes.js';
	import { networkStore } from '$lib/presentation/stores/networkStore.svelte';
	import Heading from '$lib/presentation/components/shared/Heading.svelte';
	import Text from '$lib/presentation/components/shared/Text.svelte';
	import {
		Check,
		Loader,
		TriangleAlert,
		Plus,
		Trash2,
		Clock,
		CircleCheck,
		CircleX,
		Circle
	} from '@lucide/svelte';

	interface Props {
		network: NetworkConfig;
		enableRpcLoadBalancing?: boolean;
		onClose: () => void;
	}

	interface RpcValidationResult {
		url: string;
		valid: boolean;
		chainId?: number;
		latency?: number;
		error?: string;
		isValidating?: boolean;
	}

	let { network, enableRpcLoadBalancing = false, onClose }: Props = $props();

	// 简单模式数据
	let simpleFormData = $state({
		rpcUrl: network.defaultRpcUrl,
		blockExplorer: network.defaultBlockExplorer
	});

	// 负载均衡模式数据
	let balancingFormData = $state({
		rpcUrls: [...network.rpcUrls],
		defaultRpcUrl: network.defaultRpcUrl,
		blockExplorer: network.defaultBlockExplorer
	});

	let isSaving = $state(false);
	let rpcValidationResults = $state<Record<string, RpcValidationResult>>({});
	let explorerValidation = $state<{ valid: boolean; error?: string }>();

	// 简单模式验证
	async function validateSimpleRpc() {
		if (!simpleFormData.rpcUrl) return;

		const result: RpcValidationResult = {
			url: simpleFormData.rpcUrl,
			isValidating: true,
			valid: false
		};
		rpcValidationResults = {
			...rpcValidationResults,
			[simpleFormData.rpcUrl]: result
		};

		try {
			const validation = await networkStore.validateRpcUrl(simpleFormData.rpcUrl, network.chainId);
			rpcValidationResults = {
				...rpcValidationResults,
				[simpleFormData.rpcUrl]: {
					url: simpleFormData.rpcUrl,
					...validation,
					isValidating: false
				}
			};
		} catch (error) {
			rpcValidationResults = {
				...rpcValidationResults,
				[simpleFormData.rpcUrl]: {
					url: simpleFormData.rpcUrl,
					valid: false,
					error: 'Validation failed',
					isValidating: false
				}
			};
		}
	}

	// 负载均衡模式验证单个 RPC
	async function validateBalancingRpc(url: string) {
		if (!url) return;

		const result: RpcValidationResult = {
			url,
			isValidating: true,
			valid: false
		};
		rpcValidationResults = {
			...rpcValidationResults,
			[url]: result
		};

		try {
			const validation = await networkStore.validateRpcUrl(url, network.chainId);
			rpcValidationResults = {
				...rpcValidationResults,
				[url]: {
					url,
					...validation,
					isValidating: false
				}
			};
		} catch (error) {
			rpcValidationResults = {
				...rpcValidationResults,
				[url]: {
					url,
					valid: false,
					error: 'Validation failed',
					isValidating: false
				}
			};
		}
	}

	// 验证所有 RPC
	async function validateAllRpcs() {
		if (enableRpcLoadBalancing) {
			// 负载均衡模式：验证所有 RPC URLs
			const validUrls = balancingFormData.rpcUrls.filter((url) => url.trim());
			await Promise.all(validUrls.map((url) => validateBalancingRpc(url)));
		} else {
			// 简单模式：只验证单个 RPC
			await validateSimpleRpc();
		}
	}

	function validateExplorer() {
		const url = enableRpcLoadBalancing
			? balancingFormData.blockExplorer
			: simpleFormData.blockExplorer;
		if (!url) return;

		const result = networkStore.validateBlockExplorer(url);
		explorerValidation = result;
	}

	function addRpcUrl() {
		balancingFormData.rpcUrls = [...balancingFormData.rpcUrls, ''];
	}

	function removeRpcUrl(index: number) {
		const url = balancingFormData.rpcUrls[index];
		balancingFormData.rpcUrls = balancingFormData.rpcUrls.filter((_, i) => i !== index);

		// 如果删除的是默认 RPC，设置第一个为默认
		if (url === balancingFormData.defaultRpcUrl && balancingFormData.rpcUrls.length > 0) {
			balancingFormData.defaultRpcUrl = balancingFormData.rpcUrls[0];
		}

		// 清除验证结果
		const results = { ...rpcValidationResults };
		delete results[url];
		rpcValidationResults = results;
	}

	function updateRpcUrl(index: number, value: string) {
		const oldUrl = balancingFormData.rpcUrls[index];
		balancingFormData.rpcUrls[index] = value;
		balancingFormData.rpcUrls = [...balancingFormData.rpcUrls];

		// 如果修改的是默认 RPC
		if (oldUrl === balancingFormData.defaultRpcUrl) {
			balancingFormData.defaultRpcUrl = value;
		}

		// 清除旧的验证结果
		if (oldUrl !== value) {
			const results = { ...rpcValidationResults };
			delete results[oldUrl];
			rpcValidationResults = results;
		}
	}

	function setDefaultRpc(url: string) {
		balancingFormData.defaultRpcUrl = url;
	}

	async function handleSave() {
		// 根据模式验证内容
		if (enableRpcLoadBalancing) {
			// 负载均衡模式：验证所有编辑的 RPC URLs
			await validateAllRpcs();
		} else {
			// 简单模式：只验证当前编辑的单个 RPC
			await validateSimpleRpc();
		}

		validateExplorer();

		// 检查验证结果
		if (enableRpcLoadBalancing) {
			// 负载均衡模式：检查所有 RPC 验证结果
			const hasInvalidRpc = Object.values(rpcValidationResults).some((r) => !r.valid);
			if (hasInvalidRpc || (explorerValidation && !explorerValidation.valid)) {
				return;
			}
		} else {
			// 简单模式：只检查当前 RPC 的验证结果
			const currentRpcValidation = rpcValidationResults[simpleFormData.rpcUrl];
			if (currentRpcValidation && !currentRpcValidation.valid) {
				return;
			}
			if (explorerValidation && !explorerValidation.valid) {
				return;
			}
		}

		isSaving = true;
		try {
			let updates: Partial<NetworkConfig>;

			if (enableRpcLoadBalancing) {
				// 负载均衡模式
				const validRpcs = balancingFormData.rpcUrls.filter((url) => url.trim());
				updates = {
					...network,
					rpcUrls: validRpcs,
					defaultRpcUrl: balancingFormData.defaultRpcUrl,
					defaultBlockExplorer: balancingFormData.blockExplorer,
					blockExplorers: network.blockExplorers.includes(balancingFormData.blockExplorer)
						? network.blockExplorers
						: [balancingFormData.blockExplorer, ...network.blockExplorers]
				};
			} else {
				// 简单模式
				updates = {
					...network,
					defaultRpcUrl: simpleFormData.rpcUrl,
					defaultBlockExplorer: simpleFormData.blockExplorer,
					rpcUrls: network.rpcUrls.includes(simpleFormData.rpcUrl)
						? network.rpcUrls
						: [simpleFormData.rpcUrl, ...network.rpcUrls],
					blockExplorers: network.blockExplorers.includes(simpleFormData.blockExplorer)
						? network.blockExplorers
						: [simpleFormData.blockExplorer, ...network.blockExplorers]
				};
			}

			// 简单模式下跳过完整验证，只验证当前编辑的内容
			const skipFullValidation = !enableRpcLoadBalancing;
			await networkStore.updateNetwork(network.chainId, updates, skipFullValidation);
			onClose();
		} catch (error) {
			console.error('Failed to save network:', error);
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="max-h-[70vh] space-y-4 overflow-y-auto p-4">
	<div>
		<Heading level={4} class="mb-3">Edit {network.name}</Heading>
		<Text variant="caption">Chain ID: {network.chainId}</Text>
	</div>

	{#if enableRpcLoadBalancing}
		<!-- 负载均衡模式：多 RPC 管理 -->
		<div>
			<Text variant="label" as="label" class="mb-2 block">RPC URLs</Text>
			<div class="space-y-2">
				{#each balancingFormData.rpcUrls as url, index (url + '_' + index)}
					{@const validation = rpcValidationResults[url]}
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<input
								type="url"
								value={url}
								oninput={(e) => updateRpcUrl(index, e.currentTarget.value)}
								onblur={() => validateBalancingRpc(url)}
								class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
								placeholder="https://rpc.example.com"
							/>
							<button
								onclick={() => setDefaultRpc(url)}
								class="rounded-lg p-2 transition-colors {balancingFormData.defaultRpcUrl === url
									? 'bg-green-50 text-green-500 dark:bg-green-900/20'
									: 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
								title={balancingFormData.defaultRpcUrl === url ? 'Default RPC' : 'Set as default'}
							>
								{#if balancingFormData.defaultRpcUrl === url}
									<CircleCheck class="h-4 w-4" />
								{:else}
									<Circle class="h-4 w-4" />
								{/if}
							</button>
							<button
								onclick={() => removeRpcUrl(index)}
								disabled={balancingFormData.rpcUrls.length === 1}
								class="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-900/20"
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>

						{#if validation}
							<div class="ml-2 text-xs">
								{#if validation.isValidating}
									<div class="flex items-center gap-1 text-gray-500">
										<Loader class="h-3 w-3 animate-spin" />
										Validating...
									</div>
								{:else if validation.valid}
									<div class="flex items-center gap-1 text-green-600 dark:text-green-400">
										<Clock class="h-3 w-3" />
										<span>{validation.latency}ms</span>
									</div>
								{:else}
									<div class="flex items-center gap-1 text-red-600 dark:text-red-400">
										<CircleX class="h-3 w-3" />
										<span>{validation.error || 'Connection failed'}</span>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}

				<button
					onclick={addRpcUrl}
					class="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
				>
					<Plus class="h-3 w-3" />
					Add RPC URL
				</button>
			</div>
		</div>
	{:else}
		<!-- 简单模式：单个 RPC -->
		<div>
			<Text variant="label" as="label" class="mb-1 block">RPC URL</Text>
			<input
				type="url"
				bind:value={simpleFormData.rpcUrl}
				onblur={validateSimpleRpc}
				class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
				placeholder="https://rpc.example.com"
			/>

			{#if rpcValidationResults[simpleFormData.rpcUrl]}
				{@const validation = rpcValidationResults[simpleFormData.rpcUrl]}
				<div class="mt-2 text-sm">
					{#if validation?.isValidating}
						<div class="flex items-center gap-2 text-gray-500">
							<Loader class="h-4 w-4 animate-spin" />
							Validating...
						</div>
					{:else if validation?.valid}
						<div class="flex items-center gap-2 text-green-600 dark:text-green-400">
							<Clock class="h-4 w-4" />
							<span>{validation?.latency}ms</span>
						</div>
					{:else}
						<div class="flex items-center gap-2 text-red-600 dark:text-red-400">
							<TriangleAlert class="h-4 w-4" />
							<span>{validation?.error}</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Block Explorer (共用) -->
	<div>
		<Text variant="label" as="label" class="mb-1 block">Block Explorer</Text>
		{#if enableRpcLoadBalancing}
			<input
				type="url"
				bind:value={balancingFormData.blockExplorer}
				onblur={validateExplorer}
				class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
				placeholder="https://etherscan.io"
			/>
		{:else}
			<input
				type="url"
				bind:value={simpleFormData.blockExplorer}
				onblur={validateExplorer}
				class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
				placeholder="https://etherscan.io"
			/>
		{/if}

		{#if explorerValidation}
			<div class="mt-2 text-sm">
				{#if explorerValidation.valid}
					<div class="flex items-center gap-2 text-green-600 dark:text-green-400">
						<Check class="h-4 w-4" />
						<span>Valid URL</span>
					</div>
				{:else}
					<div class="flex items-center gap-2 text-red-600 dark:text-red-400">
						<TriangleAlert class="h-4 w-4" />
						<span>{explorerValidation.error}</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="flex gap-2 pt-2">
		<button
			onclick={handleSave}
			disabled={isSaving}
			class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
		>
			{#if isSaving}
				<Loader class="h-4 w-4 animate-spin" />
				Saving...
			{:else}
				<Check class="h-4 w-4" />
				Save
			{/if}
		</button>
		<button
			onclick={onClose}
			class="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
		>
			Cancel
		</button>
	</div>
</div>
