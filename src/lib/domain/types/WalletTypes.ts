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

/**
 * 钱包账户信息
 */
export interface WalletAccount {
	address: string;
	chainId: number;
	isConnected: boolean;
}

/**
 * 钱包配置
 */
export interface WalletConfig {
	provider: WalletProvider;
	autoConnect?: boolean;
	chainId?: number;
	rpcUrl?: string;
}

/**
 * 连接器接口
 */
export interface Connector {
	id: string;
	name: string;
	icon?: string;
	ready: boolean;
	connect(): Promise<WalletAccount>;
	disconnect(): Promise<void>;
	getAccount(): Promise<WalletAccount | null>;
	switchChain(chainId: number): Promise<void>;
	watchAsset?(asset: { type: string; options: Record<string, unknown> }): Promise<void>;
	onAccountsChanged?(callback: (accounts: string[]) => void): void;
	onChainChanged?(callback: (chainId: number) => void): void;
	onDisconnect?(callback: () => void): void;
}
