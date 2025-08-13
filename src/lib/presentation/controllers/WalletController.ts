import { ConnectWalletUseCase } from '../../application/use-cases/ConnectWalletUseCase.js';
import { MetaMaskConnector } from '../../infrastructure/wallet/MetaMaskConnector.js';
import { EventBus } from '../../infrastructure/adapters/EventBus.js';
import type { Wallet } from '../../domain/entities/Wallet.js';
import type { WalletProvider } from '../../domain/types/WalletTypes.js';

/**
 * 钱包控制器
 * 协调UI层与应用层的交互
 */
export class WalletController {
	private connectWalletUseCase: ConnectWalletUseCase;
	private eventBus: EventBus;
	private currentWallet: Wallet | null = null;

	constructor() {
		this.eventBus = new EventBus();
		// 这里应该使用依赖注入容器来管理
		const walletPort = new MetaMaskConnector();
		this.connectWalletUseCase = new ConnectWalletUseCase(walletPort, this.eventBus);
	}

	/**
	 * 连接钱包
	 */
	async connectWallet(provider: WalletProvider): Promise<Wallet> {
		try {
			this.currentWallet = await this.connectWalletUseCase.execute(provider);
			return this.currentWallet;
		} catch {
			console.error('Failed to connect wallet:', error);
			throw error;
		}
	}

	/**
	 * 获取当前钱包
	 */
	getCurrentWallet(): Wallet | null {
		return this.currentWallet;
	}

	/**
	 * 断开钱包
	 */
	async disconnectWallet(): Promise<void> {
		this.currentWallet = null;
		await this.eventBus.publish({
			type: 'WALLET_DISCONNECTED',
			payload: {}
		});
	}

	/**
	 * 订阅钱包事件
	 */
	onWalletEvent(eventType: string, handler: (event: unknown) => void): () => void {
		return this.eventBus.subscribe(eventType, handler);
	}
}

// 导出单例实例
export const walletController = new WalletController();
