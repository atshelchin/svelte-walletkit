import type { Address } from '../../domain/value-objects/Address.js';
import type { ChainId } from '../../domain/value-objects/ChainId.js';
import type { WalletProvider, TransactionRequest } from '../../domain/types/WalletTypes.js';

/**
 * 钱包端口接口
 * 定义与钱包交互的抽象接口（依赖倒置原则）
 */
export interface IWalletPort {
	/**
	 * 连接钱包
	 */
	connect(): Promise<WalletConnection>;

	/**
	 * 断开连接
	 */
	disconnect(): Promise<void>;

	/**
	 * 获取当前账户
	 */
	getAccount(): Promise<Address | null>;

	/**
	 * 获取当前链ID
	 */
	getChainId(): Promise<ChainId>;

	/**
	 * 切换网络
	 */
	switchNetwork(chainId: ChainId): Promise<void>;

	/**
	 * 签名消息
	 */
	signMessage(message: string): Promise<string>;

	/**
	 * 发送交易
	 */
	sendTransaction(tx: TransactionRequest): Promise<string>;

	/**
	 * 监听账户变化
	 */
	onAccountChange(callback: (account: Address | null) => void): () => void;

	/**
	 * 监听链变化
	 */
	onChainChange(callback: (chainId: ChainId) => void): () => void;
}

/**
 * 钱包连接结果
 */
export interface WalletConnection {
	address: string;
	chainId: number;
	provider: WalletProvider;
}
