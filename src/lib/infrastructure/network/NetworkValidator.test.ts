import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NetworkValidator } from './NetworkValidator.js';
import type { NetworkConfig } from '$lib/domain/types/WalletTypes.js';
import * as viem from 'viem';

// Mock viem
vi.mock('viem', () => ({
	createPublicClient: vi.fn(),
	http: vi.fn()
}));

describe('NetworkValidator', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('validateRpcUrl', () => {
		it('should validate a valid RPC URL', async () => {
			const mockClient = {
				getChainId: vi.fn().mockResolvedValue(1),
				getBlockNumber: vi.fn().mockResolvedValue(12345678n)
			};

			vi.mocked(viem.createPublicClient).mockReturnValue(
				mockClient as unknown as ReturnType<typeof viem.createPublicClient>
			);

			const result = await NetworkValidator.validateRpcUrl('https://eth.llamarpc.com');

			expect(result.valid).toBe(true);
			expect(result.chainId).toBe(1);
			expect(result.error).toBeUndefined();
		});

		it('should detect chainId mismatch', async () => {
			const mockClient = {
				getChainId: vi.fn().mockResolvedValue(137),
				getBlockNumber: vi.fn().mockResolvedValue(12345678n)
			};

			vi.mocked(viem.createPublicClient).mockReturnValue(
				mockClient as unknown as ReturnType<typeof viem.createPublicClient>
			);

			const result = await NetworkValidator.validateRpcUrl('https://polygon-rpc.com', 1);

			expect(result.valid).toBe(false);
			expect(result.chainId).toBe(137);
			expect(result.error).toContain('ChainId mismatch');
		});

		it('should handle connection errors', async () => {
			const mockClient = {
				getChainId: vi.fn().mockRejectedValue(new Error('Connection failed'))
			};

			vi.mocked(viem.createPublicClient).mockReturnValue(
				mockClient as unknown as ReturnType<typeof viem.createPublicClient>
			);

			const result = await NetworkValidator.validateRpcUrl('https://invalid-rpc.com');

			expect(result.valid).toBe(false);
			expect(result.error).toContain('Connection failed');
		});
	});

	describe('validateRpcUrls', () => {
		it('should validate multiple RPC URLs', async () => {
			const mockClient = {
				getChainId: vi.fn().mockResolvedValue(1),
				getBlockNumber: vi.fn().mockResolvedValue(12345678n)
			};

			vi.mocked(viem.createPublicClient).mockReturnValue(
				mockClient as unknown as ReturnType<typeof viem.createPublicClient>
			);

			const urls = ['https://eth.llamarpc.com', 'https://rpc.ankr.com/eth', 'https://invalid.com'];

			// Mock the third URL to fail
			mockClient.getChainId
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce(1)
				.mockRejectedValueOnce(new Error('Invalid RPC'));

			const result = await NetworkValidator.validateRpcUrls(urls, 1);

			expect(result.validUrls).toHaveLength(2);
			expect(result.invalidUrls).toHaveLength(1);
			expect(result.invalidUrls[0].url).toBe('https://invalid.com');
		});
	});

	describe('validateBlockExplorer', () => {
		it('should validate a valid block explorer URL', () => {
			const result = NetworkValidator.validateBlockExplorer('https://etherscan.io');

			expect(result.valid).toBe(true);
			expect(result.error).toBeUndefined();
		});

		it('should handle invalid block explorer URL', () => {
			const result = NetworkValidator.validateBlockExplorer('not-a-valid-url');

			expect(result.valid).toBe(false);
			expect(result.error).toContain('Invalid URL format');
		});

		it('should reject non-HTTP(S) protocols', () => {
			const result = NetworkValidator.validateBlockExplorer('ftp://example.com');

			expect(result.valid).toBe(false);
			expect(result.error).toContain('HTTP or HTTPS protocol');
		});
	});

	describe('validateNetworkConfig', () => {
		const validConfig: NetworkConfig = {
			chainId: 1,
			name: 'Ethereum Mainnet',
			rpcUrls: ['https://eth.llamarpc.com'],
			defaultRpcUrl: 'https://eth.llamarpc.com',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18
			},
			blockExplorers: ['https://etherscan.io'],
			defaultBlockExplorer: 'https://etherscan.io'
		};

		it('should validate a valid network config', async () => {
			const mockClient = {
				getChainId: vi.fn().mockResolvedValue(1),
				getBlockNumber: vi.fn().mockResolvedValue(12345678n)
			};

			vi.mocked(viem.createPublicClient).mockReturnValue(
				mockClient as unknown as ReturnType<typeof viem.createPublicClient>
			);

			const result = await NetworkValidator.validateNetworkConfig(validConfig);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should detect invalid chainId', async () => {
			const invalidConfig = {
				...validConfig,
				chainId: -1
			};

			const result = await NetworkValidator.validateNetworkConfig(invalidConfig);

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Invalid chainId');
		});

		it('should detect missing network name', async () => {
			const invalidConfig = {
				...validConfig,
				name: ''
			};

			const result = await NetworkValidator.validateNetworkConfig(invalidConfig);

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Network name is required');
		});

		it('should detect missing RPC URLs', async () => {
			const invalidConfig = {
				...validConfig,
				rpcUrls: []
			};

			const result = await NetworkValidator.validateNetworkConfig(invalidConfig);

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('At least one RPC URL is required');
		});

		it('should detect default RPC not in list', async () => {
			const invalidConfig = {
				...validConfig,
				defaultRpcUrl: 'https://other-rpc.com'
			};

			const result = await NetworkValidator.validateNetworkConfig(invalidConfig);

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Default RPC URL must be in the rpcUrls list');
		});

		it('should detect default block explorer not in list', async () => {
			const invalidConfig = {
				...validConfig,
				defaultBlockExplorer: 'https://other-explorer.com'
			};

			const result = await NetworkValidator.validateNetworkConfig(invalidConfig);

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Default block explorer must be in the blockExplorers list');
		});
	});

	describe('validateNetworkUpdate', () => {
		const oldConfig: NetworkConfig = {
			chainId: 1,
			name: 'Ethereum Mainnet',
			rpcUrls: ['https://eth.llamarpc.com'],
			defaultRpcUrl: 'https://eth.llamarpc.com',
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18
			},
			blockExplorers: ['https://etherscan.io'],
			defaultBlockExplorer: 'https://etherscan.io'
		};

		it('should prevent chainId changes', async () => {
			const newConfig = {
				...oldConfig,
				chainId: 2
			};

			const result = await NetworkValidator.validateNetworkUpdate(oldConfig, newConfig);

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('ChainId cannot be changed');
		});

		it('should allow other changes when chainId is the same', async () => {
			const mockClient = {
				getChainId: vi.fn().mockResolvedValue(1),
				getBlockNumber: vi.fn().mockResolvedValue(12345678n)
			};

			vi.mocked(viem.createPublicClient).mockReturnValue(
				mockClient as unknown as ReturnType<typeof viem.createPublicClient>
			);

			const newConfig = {
				...oldConfig,
				name: 'Ethereum Network'
			};

			const result = await NetworkValidator.validateNetworkUpdate(oldConfig, newConfig);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});
});
