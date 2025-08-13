import type { IWalletPort, WalletConnection } from '../../application/ports/IWalletPort.js';
import { Address } from '../../domain/value-objects/Address.js';
import { ChainId } from '../../domain/value-objects/ChainId.js';
import type { TransactionRequest } from '../../domain/types/WalletTypes.js';

interface MetaMaskEthereum {
	isMetaMask?: boolean;
	request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
	on: (event: string, handler: (...args: unknown[]) => void) => void;
	removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
}

/**
 * MetaMask钱包连接器
 * 实现IWalletPort接口，提供MetaMask特定的实现
 */
export class MetaMaskConnector implements IWalletPort {
	private ethereum: MetaMaskEthereum | undefined;

	constructor() {
		if (typeof window !== 'undefined') {
			this.ethereum = (window as { ethereum?: MetaMaskEthereum }).ethereum;
		}
	}

	/**
	 * 检查MetaMask是否已安装
	 */
	isInstalled(): boolean {
		return !!this.ethereum && !!this.ethereum.isMetaMask;
	}

	async connect(): Promise<WalletConnection> {
		if (!this.isInstalled()) {
			throw new Error('MetaMask is not installed');
		}

		if (!this.ethereum) {
			throw new Error('MetaMask is not available');
		}

		try {
			const accounts = await this.ethereum.request({
				method: 'eth_requestAccounts'
			}) as string[];

			const chainId = await this.ethereum.request({
				method: 'eth_chainId'
			}) as string;

			return {
				address: accounts[0],
				chainId: parseInt(chainId, 16),
				provider: 'metamask'
			};
		} catch (error) {
			throw new Error(`Failed to connect MetaMask: ${error}`);
		}
	}

	async disconnect(): Promise<void> {
		// MetaMask doesn't have a disconnect method
		// The best we can do is clear any local state
	}

	async getAccount(): Promise<Address | null> {
		if (!this.isInstalled()) {
			return null;
		}

		if (!this.ethereum) {
			return null;
		}

		try {
			const accounts = await this.ethereum.request({
				method: 'eth_accounts'
			}) as string[];

			return accounts.length > 0 ? new Address(accounts[0]) : null;
		} catch {
			return null;
		}
	}

	async getChainId(): Promise<ChainId> {
		if (!this.isInstalled()) {
			throw new Error('MetaMask is not installed');
		}

		if (!this.ethereum) {
			throw new Error('MetaMask is not available');
		}

		const chainId = await this.ethereum.request({
			method: 'eth_chainId'
		}) as string;

		return new ChainId(parseInt(chainId, 16));
	}

	async switchNetwork(chainId: ChainId): Promise<void> {
		if (!this.isInstalled()) {
			throw new Error('MetaMask is not installed');
		}

		if (!this.ethereum) {
			throw new Error('MetaMask is not available');
		}

		try {
			await this.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: chainId.toHex() }]
			});
		} catch (error: unknown) {
			// 如果网络未添加，可能需要添加网络
			if ((error as { code?: number }).code === 4902) {
				throw new Error('Network not added to MetaMask');
			}
			throw error;
		}
	}

	async signMessage(message: string): Promise<string> {
		if (!this.isInstalled()) {
			throw new Error('MetaMask is not installed');
		}

		const account = await this.getAccount();
		if (!account) {
			throw new Error('No account connected');
		}

		if (!this.ethereum) {
			throw new Error('MetaMask is not available');
		}

		return await this.ethereum.request({
			method: 'personal_sign',
			params: [message, account.toString()]
		}) as string;
	}

	async sendTransaction(tx: TransactionRequest): Promise<string> {
		if (!this.isInstalled()) {
			throw new Error('MetaMask is not installed');
		}

		if (!this.ethereum) {
			throw new Error('MetaMask is not available');
		}

		return await this.ethereum.request({
			method: 'eth_sendTransaction',
			params: [tx]
		}) as string;
	}

	onAccountChange(callback: (account: Address | null) => void): () => void {
		if (!this.isInstalled()) {
			return () => {};
		}

		const handler = (...args: unknown[]) => {
			const accounts = args[0] as string[];
			callback(accounts.length > 0 ? new Address(accounts[0]) : null);
		};

		if (!this.ethereum) {
			return () => {};
		}

		this.ethereum.on('accountsChanged', handler);
		return () => this.ethereum?.removeListener('accountsChanged', handler);
	}

	onChainChange(callback: (chainId: ChainId) => void): () => void {
		if (!this.isInstalled()) {
			return () => {};
		}

		const handler = (...args: unknown[]) => {
			const chainIdHex = args[0] as string;
			callback(new ChainId(parseInt(chainIdHex, 16)));
		};

		if (!this.ethereum) {
			return () => {};
		}

		this.ethereum.on('chainChanged', handler);
		return () => this.ethereum?.removeListener('chainChanged', handler);
	}
}
