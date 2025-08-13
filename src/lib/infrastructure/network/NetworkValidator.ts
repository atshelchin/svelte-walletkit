import type { NetworkConfig } from '$lib/domain/types/WalletTypes.js';
import { createPublicClient, http } from 'viem';

export class NetworkValidator {
	/**
	 * 验证 RPC URL 的连通性和 chainId
	 */
	static async validateRpcUrl(
		rpcUrl: string,
		expectedChainId?: number
	): Promise<{
		valid: boolean;
		chainId?: number;
		latency?: number;
		error?: string;
	}> {
		const startTime = performance.now();

		try {
			const client = createPublicClient({
				transport: http(rpcUrl, {
					timeout: 5000
				})
			});

			const chainId = await client.getChainId();

			// 尝试获取最新区块以验证连接
			await client.getBlockNumber();

			const latency = Math.round(performance.now() - startTime);

			if (expectedChainId && chainId !== expectedChainId) {
				return {
					valid: false,
					chainId,
					latency,
					error: `ChainId mismatch`
				};
			}

			return {
				valid: true,
				chainId,
				latency
			};
		} catch (error) {
			return {
				valid: false,
				error: error instanceof Error ? error.message : 'Failed to connect to RPC'
			};
		}
	}

	/**
	 * 验证多个 RPC URLs
	 */
	static async validateRpcUrls(
		rpcUrls: string[],
		expectedChainId?: number
	): Promise<{
		validUrls: string[];
		invalidUrls: { url: string; error: string }[];
	}> {
		const validUrls: string[] = [];
		const invalidUrls: { url: string; error: string }[] = [];

		await Promise.all(
			rpcUrls.map(async (url) => {
				const result = await this.validateRpcUrl(url, expectedChainId);
				if (result.valid) {
					validUrls.push(url);
				} else {
					invalidUrls.push({ url, error: result.error || 'Unknown error' });
				}
			})
		);

		return { validUrls, invalidUrls };
	}

	/**
	 * 验证区块浏览器 URL
	 */
	static validateBlockExplorer(explorerUrl: string): {
		valid: boolean;
		error?: string;
	} {
		try {
			// 验证 URL 格式
			const url = new URL(explorerUrl);

			// 检查协议
			if (!['http:', 'https:'].includes(url.protocol)) {
				return {
					valid: false,
					error: 'URL must use HTTP or HTTPS protocol'
				};
			}

			// 检查是否有主机名
			if (!url.hostname) {
				return {
					valid: false,
					error: 'Invalid URL: missing hostname'
				};
			}

			// 基本的主机名格式验证
			const hostnamePattern =
				/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
			if (
				!hostnamePattern.test(url.hostname) &&
				url.hostname !== 'localhost' &&
				!url.hostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
			) {
				return {
					valid: false,
					error: 'Invalid hostname format'
				};
			}

			return { valid: true };
		} catch {
			return {
				valid: false,
				error: 'Invalid URL format'
			};
		}
	}

	/**
	 * 验证完整的网络配置
	 */
	static async validateNetworkConfig(config: NetworkConfig): Promise<{
		valid: boolean;
		errors: string[];
	}> {
		const errors: string[] = [];

		// 验证基本字段
		if (!config.chainId || config.chainId <= 0) {
			errors.push('Invalid chainId');
		}

		if (!config.name || config.name.trim() === '') {
			errors.push('Network name is required');
		}

		if (!config.rpcUrls || config.rpcUrls.length === 0) {
			errors.push('At least one RPC URL is required');
		}

		if (!config.defaultRpcUrl) {
			errors.push('Default RPC URL is required');
		}

		if (config.defaultRpcUrl && !config.rpcUrls.includes(config.defaultRpcUrl)) {
			errors.push('Default RPC URL must be in the rpcUrls list');
		}

		if (!config.nativeCurrency || !config.nativeCurrency.symbol) {
			errors.push('Native currency information is required');
		}

		if (!config.blockExplorers || config.blockExplorers.length === 0) {
			errors.push('At least one block explorer is required');
		}

		if (!config.defaultBlockExplorer) {
			errors.push('Default block explorer is required');
		}

		if (
			config.defaultBlockExplorer &&
			!config.blockExplorers.includes(config.defaultBlockExplorer)
		) {
			errors.push('Default block explorer must be in the blockExplorers list');
		}

		// 如果基本验证通过，进行网络验证
		if (errors.length === 0) {
			// 验证默认 RPC URL
			const rpcResult = await this.validateRpcUrl(config.defaultRpcUrl, config.chainId);
			if (!rpcResult.valid) {
				errors.push(`Default RPC URL validation failed: ${rpcResult.error}`);
			}

			// 验证其他 RPC URLs
			const otherRpcUrls = config.rpcUrls.filter((url: string) => url !== config.defaultRpcUrl);
			if (otherRpcUrls.length > 0) {
				const { invalidUrls } = await this.validateRpcUrls(otherRpcUrls, config.chainId);
				invalidUrls.forEach(({ url, error }) => {
					errors.push(`RPC URL ${url} validation failed: ${error}`);
				});
			}

			// 验证默认区块浏览器
			const explorerResult = this.validateBlockExplorer(config.defaultBlockExplorer);
			if (!explorerResult.valid) {
				errors.push(`Default block explorer validation failed: ${explorerResult.error}`);
			}
		}

		return {
			valid: errors.length === 0,
			errors
		};
	}

	/**
	 * 验证网络配置更新（chainId 不可变）
	 */
	static async validateNetworkUpdate(
		oldConfig: NetworkConfig,
		newConfig: NetworkConfig
	): Promise<{
		valid: boolean;
		errors: string[];
	}> {
		const errors: string[] = [];

		// 确保 chainId 不变
		if (oldConfig.chainId !== newConfig.chainId) {
			errors.push('ChainId cannot be changed');
			return { valid: false, errors };
		}

		// 验证新配置
		return this.validateNetworkConfig(newConfig);
	}
}
