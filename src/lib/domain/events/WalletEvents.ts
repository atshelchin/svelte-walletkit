import type { Wallet } from '../entities/Wallet.js';
import type { DomainEvent } from '../../application/ports/IEventBus.js';

/**
 * 钱包连接事件
 */
export class WalletConnectedEvent implements DomainEvent {
	readonly type = 'WALLET_CONNECTED';
	readonly timestamp: number;

	constructor(
		public readonly payload: {
			wallet: Wallet;
		}
	) {
		this.timestamp = Date.now();
	}
}

/**
 * 钱包断开事件
 */
export class WalletDisconnectedEvent implements DomainEvent {
	readonly type = 'WALLET_DISCONNECTED';
	readonly timestamp: number;

	constructor(
		public readonly payload: {
			address: string;
			reason?: string;
		}
	) {
		this.timestamp = Date.now();
	}
}

/**
 * 网络切换事件
 */
export class NetworkChangedEvent implements DomainEvent {
	readonly type = 'NETWORK_CHANGED';
	readonly timestamp: number;

	constructor(
		public readonly payload: {
			fromChainId: number;
			toChainId: number;
		}
	) {
		this.timestamp = Date.now();
	}
}

/**
 * 交易发送事件
 */
export class TransactionSentEvent implements DomainEvent {
	readonly type = 'TRANSACTION_SENT';
	readonly timestamp: number;

	constructor(
		public readonly payload: {
			hash: string;
			from: string;
			to: string;
			value?: string;
			chainId: number;
		}
	) {
		this.timestamp = Date.now();
	}
}
