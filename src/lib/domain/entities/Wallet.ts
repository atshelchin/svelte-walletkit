import type { Address } from '../value-objects/Address.js';
import type { ChainId } from '../value-objects/ChainId.js';
import type { WalletProvider } from '../types/WalletTypes.js';

/**
 * Wallet Entity - 钱包实体
 * 代表一个连接的钱包账户
 */
export class Wallet {
	constructor(
		public readonly address: Address,
		public readonly chainId: ChainId,
		public readonly provider: WalletProvider,
		public readonly ensName?: string
	) {}

	/**
	 * 检查钱包是否有效
	 */
	isValid(): boolean {
		return this.address.isValid() && this.chainId.isValid();
	}

	/**
	 * 检查是否在指定网络
	 */
	isOnNetwork(chainId: ChainId): boolean {
		return this.chainId.equals(chainId);
	}

	/**
	 * 获取显示名称（ENS名称或缩短的地址）
	 */
	getDisplayName(): string {
		return this.ensName || this.address.toShortString();
	}

	/**
	 * 转换为普通对象
	 */
	toJSON() {
		return {
			address: this.address.toString(),
			chainId: this.chainId.toNumber(),
			provider: this.provider,
			ensName: this.ensName
		};
	}
}
