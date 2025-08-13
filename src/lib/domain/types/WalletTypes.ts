/**
 * 钱包提供者类型
 */
export type WalletProvider =
	| 'metamask'
	| 'walletconnect'
	| 'coinbase'
	| 'safe'
	| 'ledger'
	| 'trezor'
	| 'injected'
	| 'unknown';

/**
 * 钱包连接状态
 */
export enum WalletConnectionStatus {
	DISCONNECTED = 'disconnected',
	CONNECTING = 'connecting',
	CONNECTED = 'connected',
	ERROR = 'error'
}

/**
 * 钱包能力
 */
export interface WalletCapabilities {
	signMessage: boolean;
	signTypedData: boolean;
	switchNetwork: boolean;
	addNetwork: boolean;
	watchAsset: boolean;
}

/**
 * 网络配置
 */
export interface NetworkConfig {
	chainId: number;
	name: string;
	rpcUrls: string[];
	defaultRpcUrl: string;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	blockExplorers: string[];
	defaultBlockExplorer: string;
}

/**
 * 交易请求
 */
export interface TransactionRequest {
	from: string;
	to: string;
	value?: string;
	data?: string;
	gas?: string;
	gasPrice?: string;
	maxFeePerGas?: string;
	maxPriorityFeePerGas?: string;
	nonce?: number;
}
