/**
 * Address Value Object - 地址值对象
 * 不可变的以太坊地址表示
 */
export class Address {
	private readonly value: string;

	constructor(address: string) {
		if (!Address.isValidAddress(address)) {
			throw new Error(`Invalid Ethereum address: ${address}`);
		}
		this.value = address.toLowerCase();
	}

	/**
	 * 验证以太坊地址格式
	 */
	static isValidAddress(address: string): boolean {
		return /^0x[a-fA-F0-9]{40}$/.test(address);
	}

	/**
	 * 获取地址字符串
	 */
	toString(): string {
		return this.value;
	}

	/**
	 * 获取校验和地址（EIP-55）
	 */
	toChecksumAddress(): string {
		// 这里应该实现 EIP-55 校验和算法
		// 简化示例，实际应使用 viem 的 getAddress
		return this.value;
	}

	/**
	 * 获取缩短的地址显示
	 */
	toShortString(): string {
		return `${this.value.slice(0, 6)}...${this.value.slice(-4)}`;
	}

	/**
	 * 检查地址是否有效
	 */
	isValid(): boolean {
		return Address.isValidAddress(this.value);
	}

	/**
	 * 比较两个地址是否相等
	 */
	equals(other: Address): boolean {
		return this.value === other.value;
	}
}
