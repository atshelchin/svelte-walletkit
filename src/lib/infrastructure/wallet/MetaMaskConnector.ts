import type { IWalletPort, WalletConnection } from '../../application/ports/IWalletPort.js';
import { Address } from '../../domain/value-objects/Address.js';
import { ChainId } from '../../domain/value-objects/ChainId.js';
import type { TransactionRequest } from '../../domain/types/WalletTypes.js';

/**
 * MetaMask钱包连接器
 * 实现IWalletPort接口，提供MetaMask特定的实现
 */
export class MetaMaskConnector implements IWalletPort {
	private ethereum: unknown;

	constructor() {
		if (typeof window !== 'undefined') {
			this.ethereum = (window as { ethereum?: unknown }).ethereum;
		}
	}

	/**
	 * 检查MetaMask是否已安装
	 */
	isInstalled(): boolean {
		return !!this.ethereum && !!(this.ethereum as { isMetaMask?: boolean }).isMetaMask;
	}

	async connect(): Promise<WalletConnection> {
		if (!this.isInstalled()) {
			throw new Error('MetaMask is not installed');
		}

		try {
			const accounts = await (
				this.ethereum as { request: (args: { method: string }) => Promise<string[]> }
			).request({
				method: 'eth_requestAccounts'
			});

			const chainId = await (
				this.ethereum as { request: (args: { method: string }) => Promise<string> }
			).request({
				method: 'eth_chainId'
			});

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

		try {
			const accounts = await (
				this.ethereum as { request: (args: { method: string }) => Promise<string[]> }
			).request({
				method: 'eth_accounts'
			});

			return accounts.length > 0 ? new Address(accounts[0]) : null;
		} catch (error) {
			return null;
		}
	}

	async getChainId(): Promise<ChainId> {
		if (!this.isInstalled()) {
			throw new Error('MetaMask is not installed');
		}

		const chainId = await this.ethereum.request({
			method: 'eth_chainId'
		});

		return new ChainId(parseInt(chainId, 16));
	}

	async switchNetwork(chainId: ChainId): Promise<void> {
		if (!this.isInstalled()) {
			throw new Error('MetaMask is not installed');
		}

		try {
			await this.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: chainId.toHex() }]
			});
		} catch (error) {
			// 如果网络未添加，可能需要添加网络
			if (error.code === 4902) {
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

		return await this.ethereum.request({
			method: 'personal_sign',
			params: [message, account.toString()]
		});
	}

	async sendTransaction(tx: TransactionRequest): Promise<string> {
		if (!this.isInstalled()) {
			throw new Error('MetaMask is not installed');
		}

		return await this.ethereum.request({
			method: 'eth_sendTransaction',
			params: [tx]
		});
	}

	onAccountChange(callback: (account: Address | null) => void): () => void {
		if (!this.isInstalled()) {
			return () => {};
		}

		const handler = (accounts: string[]) => {
			callback(accounts.length > 0 ? new Address(accounts[0]) : null);
		};

		this.ethereum.on('accountsChanged', handler);
		return () => this.ethereum.removeListener('accountsChanged', handler);
	}

	onChainChange(callback: (chainId: ChainId) => void): () => void {
		if (!this.isInstalled()) {
			return () => {};
		}

		const handler = (chainIdHex: string) => {
			callback(new ChainId(parseInt(chainIdHex, 16)));
		};

		this.ethereum.on('chainChanged', handler);
		return () => this.ethereum.removeListener('chainChanged', handler);
	}
}
