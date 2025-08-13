# WalletKit

<div align="center">
  <h3>现代化的以太坊钱包连接库 for Svelte</h3>
  <p>轻量级、可定制、功能丰富的钱包连接解决方案</p>
  
  <p>
    <a href="https://www.npmjs.com/package/@shelchin/walletkit"><img src="https://img.shields.io/npm/v/@shelchin/walletkit.svg" alt="npm version"></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
    <a href="https://bundlephobia.com/package/@shelchin/walletkit"><img src="https://img.shields.io/bundlephobia/minzip/@shelchin/walletkit" alt="Bundle Size"></a>
  </p>
</div>

[English](./README.md) | [简体中文](./README-zh.md)

## ✨ 特性

- 🚀 **轻量级** - 使用 Viem 而非 Wagmi，核心库 < 50KB gzipped
- 🌍 **多链支持** - 无缝网络切换，支持 RPC 负载均衡
- 🔐 **广泛的钱包支持** - MetaMask、WalletConnect、Coinbase、Safe、Ledger 以及 EIP-6963 自动检测
- 🎨 **完全可定制** - 完整的主题系统，支持暗黑模式
- 🌐 **国际化支持** - 内置多语言支持
- 📱 **移动端优化** - 响应式设计，触摸友好的交互
- 🔧 **框架无关** - 可作为 NPM 包或独立脚本使用
- 🛡️ **类型安全** - 完整的 TypeScript 支持和类型定义

## 📦 安装

### NPM 包（Svelte 应用推荐）

```bash
npm install @shelchin/walletkit
# 或
pnpm add @shelchin/walletkit
# 或
yarn add @shelchin/walletkit
```

### 独立脚本（适用于任何网站）

```html
<script src="https://unpkg.com/@shelchin/walletkit/dist/standalone.js"></script>
```

## 🚀 快速开始

### Svelte 组件

```svelte
<script>
  import { WalletKit, WalletButton } from '@shelchin/walletkit';
  
  const config = {
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // WalletConnect 必需
    networks: [1, 137, 42161], // 以太坊、Polygon、Arbitrum
    theme: 'auto', // 'light' | 'dark' | 'auto'
    locale: 'zh' // 'en' | 'zh'
  };
</script>

<WalletKit {config}>
  <WalletButton />
</WalletKit>
```

### 独立使用

```html
<div id="wallet-container"></div>

<script src="https://unpkg.com/@shelchin/walletkit/dist/standalone.js"></script>
<script>
  WalletKit.init({
    containerId: 'wallet-container',
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
    theme: 'dark',
    networks: [1, 137, 42161]
  });
</script>
```

## 🛠️ 高级配置

### 完整配置选项

```typescript
interface WalletKitConfig {
  // WalletConnect 项目 ID（使用 WalletConnect 时必需）
  projectId?: string;
  
  // 支持的网络（链 ID）
  networks?: number[];
  
  // 自定义 RPC 端点
  rpcUrls?: Record<number, string[]>;
  
  // 主题配置
  theme?: 'light' | 'dark' | 'auto' | ThemeConfig;
  
  // 本地化
  locale?: 'en' | 'zh' | LocaleConfig;
  
  // 钱包选项
  wallets?: {
    includeDefault?: boolean;
    custom?: WalletConfig[];
  };
  
  // 功能特性
  features?: {
    ensResolution?: boolean;
    siwe?: boolean; // 使用以太坊登录
    analytics?: boolean;
  };
  
  // 自定义模态框选项
  modal?: {
    disableBackdropClick?: boolean;
    showRecentTransactions?: boolean;
  };
}
```

### 自定义主题

```javascript
const customTheme = {
  colors: {
    primary: '#6366f1',
    background: '#ffffff',
    text: '#111827',
    border: '#e5e7eb'
  },
  radius: {
    button: '0.75rem',
    modal: '1.5rem'
  },
  fonts: {
    base: 'Inter, system-ui, sans-serif'
  }
};

WalletKit.init({
  theme: customTheme
});
```

### 自定义网络

```javascript
const customNetworks = {
  networks: [1, 137, 42161, 56], // 包含 BSC
  rpcUrls: {
    1: ['https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY'],
    137: ['https://polygon-rpc.com'],
    42161: ['https://arb1.arbitrum.io/rpc'],
    56: ['https://bsc-dataseed.binance.org']
  }
};
```

## 📱 移动端支持

WalletKit 完全优化了移动设备体验：

- 触摸友好的界面
- 移动端底部弹出模态框
- WalletConnect 二维码扫描
- 深度链接支持
- 响应式设计

## 🎨 主题系统

### 内置主题

- **Light** - 干净现代的浅色主题
- **Dark** - 护眼的深色主题
- **Auto** - 跟随系统偏好设置

### 自定义主题

```javascript
import { createTheme } from '@shelchin/walletkit';

const myTheme = createTheme({
  primary: '#8b5cf6',
  secondary: '#ec4899',
  borderRadius: 'lg',
  fontFamily: 'Roboto, sans-serif'
});
```

## 🌍 国际化

### 支持的语言

- English (en)
- 简体中文 (zh)

### 自定义翻译

```javascript
const customLocale = {
  connect: '连接钱包',
  disconnect: '断开连接',
  switchNetwork: '切换网络',
  copyAddress: '复制地址',
  // ... 更多翻译
};

WalletKit.init({
  locale: customLocale
});
```

## 🔌 API 参考

### 核心方法

```typescript
// 初始化 WalletKit
WalletKit.init(config: WalletKitConfig): void

// 连接钱包
WalletKit.connect(): Promise<WalletConnection>

// 断开连接
WalletKit.disconnect(): Promise<void>

// 获取当前账户
WalletKit.getAccount(): Address | null

// 切换网络
WalletKit.switchNetwork(chainId: number): Promise<void>

// 签名消息
WalletKit.signMessage(message: string): Promise<string>

// 发送交易
WalletKit.sendTransaction(tx: TransactionRequest): Promise<string>
```

### 事件监听器

```javascript
// 账户变更
WalletKit.onAccountChange((account) => {
  console.log('账户已变更:', account);
});

// 网络变更
WalletKit.onChainChange((chainId) => {
  console.log('网络已变更:', chainId);
});

// 连接状态
WalletKit.onConnectionChange((connected) => {
  console.log('连接状态:', connected);
});
```

### Svelte Stores

```javascript
import { 
  account, 
  chainId, 
  connected, 
  connecting 
} from '@shelchin/walletkit';

// 在 Svelte 组件中使用
$: currentAccount = $account;
$: currentChain = $chainId;
$: isConnected = $connected;
```

## 🏗️ 架构设计

WalletKit 遵循清洁架构原则：

```
src/
├── lib/
│   ├── domain/          # 业务逻辑和类型
│   ├── application/     # 用例和服务
│   ├── infrastructure/  # 外部集成
│   └── presentation/    # UI 组件
├── standalone/          # 独立构建入口
└── routes/             # 演示页面
```

## 🧪 开发

### 设置

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建库
pnpm build

# 代码检查和格式化
pnpm lint
pnpm format
```

### 测试

```bash
# 单元测试
pnpm test:unit

# 端到端测试
pnpm test:e2e

# 类型检查
pnpm check
```

## 📋 功能路线图

### 已完成 ✅
- [x] 基础钱包连接（MetaMask）
- [x] 网络切换
- [x] 账户管理
- [x] 主题系统
- [x] 国际化基础架构
- [x] TypeScript 支持

### 进行中 🚧
- [ ] WalletConnect 集成
- [ ] 多钱包支持
- [ ] RPC 负载均衡
- [ ] 完整的中文翻译
- [ ] 移动端优化

### 计划中 📅
- [ ] SIWE（使用以太坊登录）
- [ ] ENS 解析
- [ ] 交易管理
- [ ] 硬件钱包支持
- [ ] 订阅系统
- [ ] 分析仪表板

## 📄 许可证

MIT © 2025 WalletKit

## 🤝 贡献

欢迎贡献！请阅读我们的[贡献指南](./CONTRIBUTING.md)了解详情。

## 🔗 链接

- [NPM 包](https://www.npmjs.com/package/@shelchin/walletkit)
- [GitHub 仓库](https://github.com/shelchin2023/walletkit)
- [在线演示](https://walletkit-demo.netlify.app)

## 💖 赞助商

特别感谢所有的赞助商和贡献者！

---

<div align="center">
  由 WalletKit 团队用 ❤️ 制作
</div>