import { Wallet } from '../../domain/entities/Wallet.js';
import { Address } from '../../domain/value-objects/Address.js';
import { ChainId } from '../../domain/value-objects/ChainId.js';
import type { IWalletPort } from '../ports/IWalletPort.js';
import type { IEventBus } from '../ports/IEventBus.js';
import type { WalletProvider } from '../../domain/types/WalletTypes.js';
import { WalletConnectedEvent } from '../../domain/events/WalletEvents.js';

/**
 * 连接钱包用例
 * 处理钱包连接的业务逻辑
 */
export class ConnectWalletUseCase {
	constructor(
		private walletPort: IWalletPort,
		private eventBus: IEventBus
	) {}

	/**
	 * 执行钱包连接
	 * @param provider 钱包提供者类型
	 * @returns 连接的钱包实体
	 */
	async execute(provider: WalletProvider): Promise<Wallet> {
		try {
			// 1. 通过端口连接钱包
			const connection = await this.walletPort.connect();

			// 2. 创建值对象
			const address = new Address(connection.address);
			const chainId = new ChainId(connection.chainId);

			// 3. 创建钱包实体
			const wallet = new Wallet(address, chainId, provider);

			// 4. 验证钱包有效性
			if (!wallet.isValid()) {
				throw new Error('Connected wallet is invalid');
			}

			// 5. 发布领域事件
			await this.eventBus.publish(new WalletConnectedEvent(wallet));

			// 6. 设置事件监听
			this.setupEventListeners();

			return wallet;
		} catch {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			throw new Error(`Failed to connect wallet: ${errorMessage}`);
		}
	}

	/**
	 * 设置事件监听器
	 */
	private setupEventListeners(): void {
		// 监听账户变化
		this.walletPort.onAccountChange(async (newAddress) => {
			if (newAddress) {
				await this.eventBus.publish({
					type: 'ACCOUNT_CHANGED',
					payload: { address: newAddress.toString() }
				});
			}
		});

		// 监听链变化
		this.walletPort.onChainChange(async (newChainId) => {
			await this.eventBus.publish({
				type: 'CHAIN_CHANGED',
				payload: { chainId: newChainId.toNumber() }
			});
		});
	}
}
