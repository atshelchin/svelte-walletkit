import type { NetworkConfig } from '$lib/domain/types/WalletTypes.js';
import { NetworkValidator } from '$lib/infrastructure/network/NetworkValidator.js';

export interface NetworkManagerOptions {
	storageKey?: string;
	presetNetworks?: NetworkConfig[];
}

export class NetworkManager {
	private networks: Map<number, NetworkConfig> = new Map();
	private currentChainId: number | null = null;
	private readonly storageKey: string;
	private readonly presetNetworks: NetworkConfig[];
	private listeners: Set<(event: NetworkEvent) => void> = new Set();

	constructor(options: NetworkManagerOptions = {}) {
		this.storageKey = options.storageKey || 'walletkit_networks';
		this.presetNetworks = options.presetNetworks || [];
		this.loadNetworks();
	}

	/**
	 * 加载网络配置
	 */
	private loadNetworks(): void {
		// 首先加载预设网络
		this.presetNetworks.forEach((network) => {
			this.networks.set(network.chainId, network);
		});

		// 然后加载用户自定义网络（会覆盖预设网络）
		if (typeof localStorage !== 'undefined') {
			try {
				const stored = localStorage.getItem(this.storageKey);
				if (stored) {
					const customNetworks = JSON.parse(stored) as NetworkConfig[];
					customNetworks.forEach((network) => {
						this.networks.set(network.chainId, network);
					});
				}
			} catch (error) {
				console.error('Failed to load custom networks:', error);
			}
		}
	}

	/**
	 * 保存用户自定义网络到本地存储
	 */
	private saveCustomNetworks(): void {
		if (typeof localStorage !== 'undefined') {
			try {
				// 只保存非预设网络或已修改的预设网络
				const customNetworks = Array.from(this.networks.values()).filter((network) => {
					const preset = this.presetNetworks.find((p) => p.chainId === network.chainId);
					return !preset || JSON.stringify(preset) !== JSON.stringify(network);
				});
				localStorage.setItem(this.storageKey, JSON.stringify(customNetworks));
			} catch (error) {
				console.error('Failed to save custom networks:', error);
			}
		}
	}

	/**
	 * 添加新网络
	 */
	async addNetwork(network: NetworkConfig): Promise<void> {
		// 检查网络是否已存在
		if (this.networks.has(network.chainId)) {
			throw new Error(`Network with chainId ${network.chainId} already exists`);
		}

		// 验证网络配置
		const validation = await NetworkValidator.validateNetworkConfig(network);
		if (!validation.valid) {
			throw new Error(`Invalid network configuration: ${validation.errors.join(', ')}`);
		}

		// 添加网络
		this.networks.set(network.chainId, network);
		this.saveCustomNetworks();

		// 触发事件
		this.emit({
			type: 'network-added',
			network
		});
	}

	/**
	 * 更新网络配置
	 */
	async updateNetwork(
		chainId: number,
		updates: Partial<NetworkConfig>,
		skipFullValidation = false
	): Promise<void> {
		const oldNetwork = this.networks.get(chainId);
		if (!oldNetwork) {
			throw new Error(`Network with chainId ${chainId} not found`);
		}

		// 创建新配置
		const newNetwork: NetworkConfig = {
			...oldNetwork,
			...updates,
			chainId // 确保 chainId 不变
		};

		// 如果跳过完整验证，只验证默认 RPC
		if (skipFullValidation) {
			// 只验证默认 RPC URL
			if (newNetwork.defaultRpcUrl) {
				const validation = await NetworkValidator.validateRpcUrl(newNetwork.defaultRpcUrl, chainId);
				if (!validation.valid) {
					throw new Error(`Invalid default RPC: ${validation.error}`);
				}
			}
		} else {
			// 完整验证
			const validation = await NetworkValidator.validateNetworkUpdate(oldNetwork, newNetwork);
			if (!validation.valid) {
				throw new Error(`Invalid network update: ${validation.errors.join(', ')}`);
			}
		}

		// 更新网络
		this.networks.set(chainId, newNetwork);
		this.saveCustomNetworks();

		// 触发事件
		this.emit({
			type: 'network-updated',
			network: newNetwork,
			oldNetwork
		});
	}

	/**
	 * 删除网络
	 */
	removeNetwork(chainId: number): void {
		const network = this.networks.get(chainId);
		if (!network) {
			throw new Error(`Network with chainId ${chainId} not found`);
		}

		// 不允许删除当前正在使用的网络
		if (this.currentChainId === chainId) {
			throw new Error('Cannot remove currently active network');
		}

		// 删除网络
		this.networks.delete(chainId);
		this.saveCustomNetworks();

		// 触发事件
		this.emit({
			type: 'network-removed',
			network
		});
	}

	/**
	 * 获取所有网络
	 */
	getAllNetworks(): NetworkConfig[] {
		return Array.from(this.networks.values());
	}

	/**
	 * 获取过滤后的网络列表
	 * @param options 过滤选项
	 */
	getFilteredNetworks(options?: { chainIds?: number[]; includeCustom?: boolean }): NetworkConfig[] {
		let networks = Array.from(this.networks.values());

		if (options?.chainIds) {
			// 如果指定了 chainIds，只返回这些网络
			networks = networks.filter((n) => options.chainIds!.includes(n.chainId));
		}

		if (options?.includeCustom === false) {
			// 如果不包含自定义网络，过滤掉纯自定义网络（不在预设中的）
			networks = networks.filter((n) => this.presetNetworks.some((p) => p.chainId === n.chainId));
		}

		return networks;
	}

	/**
	 * 获取指定网络
	 */
	getNetwork(chainId: number): NetworkConfig | undefined {
		return this.networks.get(chainId);
	}

	/**
	 * 获取当前网络
	 */
	getCurrentNetwork(): NetworkConfig | null {
		if (!this.currentChainId) {
			return null;
		}
		return this.networks.get(this.currentChainId) || null;
	}

	/**
	 * 切换当前网络
	 */
	async switchNetwork(chainId: number, skipValidation = false): Promise<void> {
		const network = this.networks.get(chainId);
		if (!network) {
			throw new Error(`Network with chainId ${chainId} not found`);
		}

		// 只在需要时验证网络的默认 RPC 是否可用
		if (!skipValidation) {
			const validation = await NetworkValidator.validateRpcUrl(network.defaultRpcUrl, chainId);
			if (!validation.valid) {
				throw new Error(`Network RPC is not available: ${validation.error}`);
			}
		}

		const oldChainId = this.currentChainId;
		this.currentChainId = chainId;

		// 触发事件
		this.emit({
			type: 'network-switched',
			network,
			oldChainId
		});
	}

	/**
	 * 重置为预设网络
	 */
	resetToPresetNetworks(): void {
		this.networks.clear();
		this.presetNetworks.forEach((network) => {
			this.networks.set(network.chainId, network);
		});
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(this.storageKey);
		}

		this.emit({
			type: 'networks-reset'
		});
	}

	/**
	 * 检查是否为预设网络
	 */
	isPresetNetwork(chainId: number): boolean {
		return this.presetNetworks.some((network) => network.chainId === chainId);
	}

	/**
	 * 检查是否为自定义网络
	 */
	isCustomNetwork(chainId: number): boolean {
		if (!this.networks.has(chainId)) {
			return false;
		}
		const network = this.networks.get(chainId)!;
		const preset = this.presetNetworks.find((p) => p.chainId === chainId);
		return !preset || JSON.stringify(preset) !== JSON.stringify(network);
	}

	/**
	 * 订阅网络事件
	 */
	subscribe(listener: (event: NetworkEvent) => void): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	/**
	 * 触发事件
	 */
	private emit(event: NetworkEvent): void {
		this.listeners.forEach((listener) => listener(event));
	}

	/**
	 * 验证 RPC URL
	 */
	async validateRpcUrl(rpcUrl: string, expectedChainId?: number) {
		return NetworkValidator.validateRpcUrl(rpcUrl, expectedChainId);
	}

	/**
	 * 验证区块浏览器
	 */
	validateBlockExplorer(explorerUrl: string) {
		return NetworkValidator.validateBlockExplorer(explorerUrl);
	}
}

// 网络事件类型
export type NetworkEvent =
	| { type: 'network-added'; network: NetworkConfig }
	| { type: 'network-updated'; network: NetworkConfig; oldNetwork: NetworkConfig }
	| { type: 'network-removed'; network: NetworkConfig }
	| { type: 'network-switched'; network: NetworkConfig; oldChainId: number | null }
	| { type: 'networks-reset' };

// 导出单例实例
let networkManagerInstance: NetworkManager | null = null;

export function getNetworkManager(options?: NetworkManagerOptions): NetworkManager {
	if (!networkManagerInstance) {
		networkManagerInstance = new NetworkManager(options);
	}
	return networkManagerInstance;
}

export function resetNetworkManager(): void {
	networkManagerInstance = null;
}
