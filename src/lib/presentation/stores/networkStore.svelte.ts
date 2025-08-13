import type { NetworkConfig } from '$lib/domain/types/WalletTypes.js';
import { getNetworkManager, type NetworkEvent } from '$lib/application/services/NetworkManager.js';
import { getPresetNetworks } from '$lib/infrastructure/network/presetNetworks.js';

interface NetworkState {
	networks: NetworkConfig[];
	currentNetwork: NetworkConfig | null;
	isLoading: boolean;
	error: string | null;
}

class NetworkStore {
	private manager = $state<ReturnType<typeof getNetworkManager>>();
	private unsubscribe: (() => void) | null = null;

	// 使用 Svelte 5 的 $state rune
	state = $state<NetworkState>({
		networks: [],
		currentNetwork: null,
		isLoading: false,
		error: null
	});

	constructor() {
		if (typeof window !== 'undefined') {
			this.initialize();
		}
	}

	private initialize() {
		// 初始化 NetworkManager
		this.manager = getNetworkManager({
			presetNetworks: getPresetNetworks()
		});

		// 加载初始状态
		this.loadNetworks();

		// 订阅网络事件
		this.unsubscribe = this.manager.subscribe((event: NetworkEvent) => {
			this.handleNetworkEvent(event);
		});
	}

	private loadNetworks() {
		if (!this.manager) return;

		this.state.networks = this.manager.getAllNetworks();
		this.state.currentNetwork = this.manager.getCurrentNetwork();
	}

	private handleNetworkEvent(event: NetworkEvent) {
		switch (event.type) {
			case 'network-added':
			case 'network-updated':
			case 'network-removed':
			case 'networks-reset':
				this.loadNetworks();
				break;
			case 'network-switched':
				this.state.currentNetwork = event.network;
				break;
		}
	}

	/**
	 * 添加新网络
	 */
	async addNetwork(network: NetworkConfig) {
		if (!this.manager) {
			throw new Error('NetworkManager not initialized');
		}

		this.state.isLoading = true;
		this.state.error = null;

		try {
			await this.manager.addNetwork(network);
		} catch {
			this.state.error = error instanceof Error ? error.message : 'Failed to add network';
			throw error;
		} finally {
			this.state.isLoading = false;
		}
	}

	/**
	 * 更新网络
	 */
	async updateNetwork(
		chainId: number,
		updates: Partial<NetworkConfig>,
		skipFullValidation = false
	) {
		if (!this.manager) {
			throw new Error('NetworkManager not initialized');
		}

		this.state.isLoading = true;
		this.state.error = null;

		try {
			await this.manager.updateNetwork(chainId, updates, skipFullValidation);
		} catch {
			this.state.error = error instanceof Error ? error.message : 'Failed to update network';
			throw error;
		} finally {
			this.state.isLoading = false;
		}
	}

	/**
	 * 删除网络
	 */
	removeNetwork(chainId: number) {
		if (!this.manager) {
			throw new Error('NetworkManager not initialized');
		}

		this.state.error = null;

		try {
			this.manager.removeNetwork(chainId);
		} catch {
			this.state.error = error instanceof Error ? error.message : 'Failed to remove network';
			throw error;
		}
	}

	/**
	 * 切换网络
	 */
	async switchNetwork(chainId: number, skipValidation = true) {
		if (!this.manager) {
			throw new Error('NetworkManager not initialized');
		}

		// 如果跳过验证，直接切换（用于UI选择）
		if (skipValidation) {
			this.state.error = null;
			try {
				await this.manager.switchNetwork(chainId, true);
			} catch {
				this.state.error = error instanceof Error ? error.message : 'Failed to switch network';
				throw error;
			}
		} else {
			// 带验证的切换（用于实际连接钱包等场景）
			this.state.isLoading = true;
			this.state.error = null;

			try {
				await this.manager.switchNetwork(chainId, false);
			} catch {
				this.state.error = error instanceof Error ? error.message : 'Failed to switch network';
				throw error;
			} finally {
				this.state.isLoading = false;
			}
		}
	}

	/**
	 * 获取指定网络
	 */
	getNetwork(chainId: number): NetworkConfig | undefined {
		return this.state.networks.find((n) => n.chainId === chainId);
	}

	/**
	 * 检查是否为预设网络
	 */
	isPresetNetwork(chainId: number): boolean {
		return this.manager?.isPresetNetwork(chainId) ?? false;
	}

	/**
	 * 检查是否为自定义网络
	 */
	isCustomNetwork(chainId: number): boolean {
		return this.manager?.isCustomNetwork(chainId) ?? false;
	}

	/**
	 * 检查网络是否可以被删除
	 */
	canDeleteNetwork(chainId: number): boolean {
		return this.manager?.canDeleteNetwork(chainId) ?? false;
	}

	/**
	 * 重置为预设网络
	 */
	resetToPresetNetworks() {
		if (!this.manager) {
			throw new Error('NetworkManager not initialized');
		}

		this.state.error = null;

		try {
			this.manager.resetToPresetNetworks();
		} catch {
			this.state.error = error instanceof Error ? error.message : 'Failed to reset networks';
			throw error;
		}
	}

	/**
	 * 验证 RPC URL
	 */
	async validateRpcUrl(rpcUrl: string, expectedChainId?: number) {
		if (!this.manager) {
			throw new Error('NetworkManager not initialized');
		}

		return this.manager.validateRpcUrl(rpcUrl, expectedChainId);
	}

	/**
	 * 验证区块浏览器
	 */
	validateBlockExplorer(explorerUrl: string) {
		if (!this.manager) {
			throw new Error('NetworkManager not initialized');
		}

		return this.manager.validateBlockExplorer(explorerUrl);
	}

	/**
	 * 清理资源
	 */
	destroy() {
		if (this.unsubscribe) {
			this.unsubscribe();
			this.unsubscribe = null;
		}
	}
}

// 导出单例 store
export const networkStore = new NetworkStore();
