/**
 * ChainId Value Object - 链ID值对象
 * 表示区块链网络的唯一标识符
 */
export class ChainId {
	private readonly value: number;

	constructor(chainId: number) {
		if (!ChainId.isValidChainId(chainId)) {
			throw new Error(`Invalid chain ID: ${chainId}`);
		}
		this.value = chainId;
	}

	/**
	 * 验证链ID是否有效
	 */
	static isValidChainId(chainId: number): boolean {
		return Number.isInteger(chainId) && chainId > 0;
	}

	/**
	 * 预定义的主要网络
	 */
	static readonly ETHEREUM_MAINNET = new ChainId(1);
	static readonly POLYGON = new ChainId(137);
	static readonly BSC = new ChainId(56);
	static readonly ARBITRUM = new ChainId(42161);
	static readonly OPTIMISM = new ChainId(10);
	static readonly AVALANCHE = new ChainId(43114);

	/**
	 * 获取链ID数值
	 */
	toNumber(): number {
		return this.value;
	}

	/**
	 * 获取链ID字符串
	 */
	toString(): string {
		return this.value.toString();
	}

	/**
	 * 获取十六进制表示
	 */
	toHex(): string {
		return `0x${this.value.toString(16)}`;
	}

	/**
	 * 检查是否有效
	 */
	isValid(): boolean {
		return ChainId.isValidChainId(this.value);
	}

	/**
	 * 比较两个链ID是否相等
	 */
	equals(other: ChainId): boolean {
		return this.value === other.value;
	}

	/**
	 * 获取网络名称
	 */
	getNetworkName(): string {
		const networks: Record<number, string> = {
			1: 'Ethereum Mainnet',
			137: 'Polygon',
			56: 'Binance Smart Chain',
			42161: 'Arbitrum One',
			10: 'Optimism',
			43114: 'Avalanche C-Chain'
		};
		return networks[this.value] || `Chain ${this.value}`;
	}
}
