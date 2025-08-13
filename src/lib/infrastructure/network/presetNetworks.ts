import type { NetworkConfig } from '$lib/domain/types/WalletTypes.js';

/**
 * 预设的网络配置
 */
export const PRESET_NETWORKS: NetworkConfig[] = [
	{
		chainId: 1,
		name: 'Ethereum Mainnet',
		rpcUrls: ['https://eth.llamarpc.com', 'https://rpc.ankr.com/eth', 'https://cloudflare-eth.com'],
		defaultRpcUrl: 'https://eth.llamarpc.com',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorers: ['https://etherscan.io', 'https://www.oklink.com/eth'],
		defaultBlockExplorer: 'https://etherscan.io'
	},
	{
		chainId: 5,
		name: 'Goerli Testnet',
		rpcUrls: [
			'https://rpc.ankr.com/eth_goerli',
			'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
		],
		defaultRpcUrl: 'https://rpc.ankr.com/eth_goerli',
		nativeCurrency: {
			name: 'Goerli Ether',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorers: ['https://goerli.etherscan.io'],
		defaultBlockExplorer: 'https://goerli.etherscan.io'
	},
	{
		chainId: 11155111,
		name: 'Sepolia Testnet',
		rpcUrls: [
			'https://rpc.sepolia.org',
			'https://rpc2.sepolia.org',
			'https://rpc.ankr.com/eth_sepolia'
		],
		defaultRpcUrl: 'https://rpc.sepolia.org',
		nativeCurrency: {
			name: 'Sepolia Ether',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorers: ['https://sepolia.etherscan.io'],
		defaultBlockExplorer: 'https://sepolia.etherscan.io'
	},
	{
		chainId: 137,
		name: 'Polygon',
		rpcUrls: [
			'https://polygon-rpc.com',
			'https://rpc.ankr.com/polygon',
			'https://polygon-mainnet.public.blastapi.io'
		],
		defaultRpcUrl: 'https://polygon-rpc.com',
		nativeCurrency: {
			name: 'MATIC',
			symbol: 'MATIC',
			decimals: 18
		},
		blockExplorers: ['https://polygonscan.com', 'https://www.oklink.com/polygon'],
		defaultBlockExplorer: 'https://polygonscan.com'
	},
	{
		chainId: 80001,
		name: 'Polygon Mumbai',
		rpcUrls: ['https://rpc-mumbai.maticvigil.com', 'https://rpc.ankr.com/polygon_mumbai'],
		defaultRpcUrl: 'https://rpc-mumbai.maticvigil.com',
		nativeCurrency: {
			name: 'MATIC',
			symbol: 'MATIC',
			decimals: 18
		},
		blockExplorers: ['https://mumbai.polygonscan.com'],
		defaultBlockExplorer: 'https://mumbai.polygonscan.com'
	},
	{
		chainId: 56,
		name: 'BNB Smart Chain',
		rpcUrls: [
			'https://bsc-dataseed.binance.org',
			'https://bsc-dataseed1.binance.org',
			'https://bsc-dataseed2.binance.org',
			'https://rpc.ankr.com/bsc'
		],
		defaultRpcUrl: 'https://bsc-dataseed.binance.org',
		nativeCurrency: {
			name: 'BNB',
			symbol: 'BNB',
			decimals: 18
		},
		blockExplorers: ['https://bscscan.com', 'https://www.oklink.com/bsc'],
		defaultBlockExplorer: 'https://bscscan.com'
	},
	{
		chainId: 97,
		name: 'BNB Smart Chain Testnet',
		rpcUrls: [
			'https://data-seed-prebsc-1-s1.binance.org:8545',
			'https://data-seed-prebsc-2-s1.binance.org:8545'
		],
		defaultRpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
		nativeCurrency: {
			name: 'tBNB',
			symbol: 'tBNB',
			decimals: 18
		},
		blockExplorers: ['https://testnet.bscscan.com'],
		defaultBlockExplorer: 'https://testnet.bscscan.com'
	},
	{
		chainId: 42161,
		name: 'Arbitrum One',
		rpcUrls: ['https://arb1.arbitrum.io/rpc', 'https://rpc.ankr.com/arbitrum'],
		defaultRpcUrl: 'https://arb1.arbitrum.io/rpc',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorers: ['https://arbiscan.io', 'https://www.oklink.com/arbitrum'],
		defaultBlockExplorer: 'https://arbiscan.io'
	},
	{
		chainId: 421613,
		name: 'Arbitrum Goerli',
		rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
		defaultRpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
		nativeCurrency: {
			name: 'Arbitrum Goerli Ether',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorers: ['https://goerli.arbiscan.io'],
		defaultBlockExplorer: 'https://goerli.arbiscan.io'
	},
	{
		chainId: 10,
		name: 'Optimism',
		rpcUrls: ['https://mainnet.optimism.io', 'https://rpc.ankr.com/optimism'],
		defaultRpcUrl: 'https://mainnet.optimism.io',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorers: ['https://optimistic.etherscan.io', 'https://www.oklink.com/optimism'],
		defaultBlockExplorer: 'https://optimistic.etherscan.io'
	},
	{
		chainId: 420,
		name: 'Optimism Goerli',
		rpcUrls: ['https://goerli.optimism.io'],
		defaultRpcUrl: 'https://goerli.optimism.io',
		nativeCurrency: {
			name: 'Goerli Ether',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorers: ['https://goerli-optimism.etherscan.io'],
		defaultBlockExplorer: 'https://goerli-optimism.etherscan.io'
	},
	{
		chainId: 43114,
		name: 'Avalanche C-Chain',
		rpcUrls: ['https://api.avax.network/ext/bc/C/rpc', 'https://rpc.ankr.com/avalanche'],
		defaultRpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
		nativeCurrency: {
			name: 'Avalanche',
			symbol: 'AVAX',
			decimals: 18
		},
		blockExplorers: ['https://snowtrace.io', 'https://www.oklink.com/avalanche'],
		defaultBlockExplorer: 'https://snowtrace.io'
	},
	{
		chainId: 43113,
		name: 'Avalanche Fuji Testnet',
		rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc', 'https://rpc.ankr.com/avalanche_fuji'],
		defaultRpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
		nativeCurrency: {
			name: 'Avalanche',
			symbol: 'AVAX',
			decimals: 18
		},
		blockExplorers: ['https://testnet.snowtrace.io'],
		defaultBlockExplorer: 'https://testnet.snowtrace.io'
	},
	{
		chainId: 250,
		name: 'Fantom Opera',
		rpcUrls: ['https://rpc.ftm.tools', 'https://rpc.ankr.com/fantom'],
		defaultRpcUrl: 'https://rpc.ftm.tools',
		nativeCurrency: {
			name: 'Fantom',
			symbol: 'FTM',
			decimals: 18
		},
		blockExplorers: ['https://ftmscan.com', 'https://www.oklink.com/fantom'],
		defaultBlockExplorer: 'https://ftmscan.com'
	},
	{
		chainId: 4002,
		name: 'Fantom Testnet',
		rpcUrls: ['https://rpc.testnet.fantom.network'],
		defaultRpcUrl: 'https://rpc.testnet.fantom.network',
		nativeCurrency: {
			name: 'Fantom',
			symbol: 'FTM',
			decimals: 18
		},
		blockExplorers: ['https://testnet.ftmscan.com'],
		defaultBlockExplorer: 'https://testnet.ftmscan.com'
	},
	{
		chainId: 8453,
		name: 'Base',
		rpcUrls: ['https://mainnet.base.org', 'https://base.publicnode.com'],
		defaultRpcUrl: 'https://mainnet.base.org',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorers: ['https://basescan.org', 'https://www.oklink.com/base'],
		defaultBlockExplorer: 'https://basescan.org'
	},
	{
		chainId: 84531,
		name: 'Base Goerli',
		rpcUrls: ['https://goerli.base.org'],
		defaultRpcUrl: 'https://goerli.base.org',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorers: ['https://goerli.basescan.org'],
		defaultBlockExplorer: 'https://goerli.basescan.org'
	}
];

/**
 * 获取预设网络列表
 */
export function getPresetNetworks(): NetworkConfig[] {
	return PRESET_NETWORKS;
}

/**
 * 根据 chainId 获取预设网络
 */
export function getPresetNetwork(chainId: number): NetworkConfig | undefined {
	return PRESET_NETWORKS.find((network) => network.chainId === chainId);
}

/**
 * 检查是否为预设网络
 */
export function isPresetNetwork(chainId: number): boolean {
	return PRESET_NETWORKS.some((network) => network.chainId === chainId);
}
