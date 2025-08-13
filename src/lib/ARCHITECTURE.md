# WalletKit DDD Architecture

## 架构概述

WalletKit 采用领域驱动设计（DDD）架构，实现高内聚、低耦合的代码组织结构。

```
src/lib/
├── domain/              # 领域层 - 核心业务逻辑
│   ├── entities/       # 实体
│   ├── value-objects/  # 值对象
│   ├── events/         # 领域事件
│   ├── errors/         # 领域错误
│   └── types/          # 领域类型定义
│
├── application/         # 应用层 - 用例和服务
│   ├── services/       # 应用服务
│   ├── use-cases/      # 用例
│   ├── dto/           # 数据传输对象
│   └── ports/         # 端口接口（依赖倒置）
│
├── infrastructure/      # 基础设施层 - 外部依赖
│   ├── blockchain/     # 区块链交互（viem）
│   ├── wallet/         # 钱包连接器
│   ├── storage/        # 本地存储
│   ├── network/        # 网络管理
│   └── adapters/       # 适配器实现
│
├── presentation/        # 表现层 - UI组件
│   ├── components/     # Svelte组件
│   ├── stores/         # Svelte stores
│   ├── actions/        # Svelte actions
│   └── themes/         # 主题配置
│
└── shared/             # 共享层 - 工具和常量
    ├── utils/          # 工具函数
    ├── constants/      # 常量定义
    ├── i18n/          # 国际化
    └── config/        # 配置
```

## 层次职责

### 1. Domain Layer（领域层）

**职责**：包含核心业务逻辑，不依赖任何外部框架或库

- **Entities**: Wallet, Network, Transaction
- **Value Objects**: Address, ChainId, Balance
- **Events**: WalletConnected, NetworkChanged, TransactionSent
- **Types**: 领域专用类型定义

### 2. Application Layer（应用层）

**职责**：协调领域对象，实现业务用例

- **Services**: WalletService, NetworkService, TransactionService
- **Use Cases**: ConnectWallet, SwitchNetwork, SendTransaction
- **Ports**: 定义与外部系统的接口
- **DTO**: 数据传输对象

### 3. Infrastructure Layer（基础设施层）

**职责**：实现技术细节和外部依赖

- **Blockchain**: Viem集成，RPC管理
- **Wallet**: MetaMask, WalletConnect等具体实现
- **Storage**: LocalStorage, SessionStorage适配器
- **Network**: RPC负载均衡，健康检查

### 4. Presentation Layer（表现层）

**职责**：用户界面和交互

- **Components**: 可复用的Svelte组件
- **Stores**: 状态管理（使用Svelte 5 runes）
- **Actions**: DOM操作和指令
- **Themes**: 视觉样式和主题系统

### 5. Shared Layer（共享层）

**职责**：横切关注点和公共工具

- **Utils**: 通用工具函数
- **Constants**: 全局常量
- **I18n**: 多语言支持
- **Config**: 配置管理

## 依赖规则

```
Presentation → Application → Domain
     ↓            ↓
Infrastructure ← Ports (Interface)
     ↓
  Shared
```

1. **依赖方向**：外层依赖内层，内层不知道外层的存在
2. **依赖倒置**：通过端口（接口）实现依赖倒置
3. **单向依赖**：避免循环依赖

## 示例：钱包连接流程

```typescript
// 1. Domain Layer - 定义实体
// domain/entities/Wallet.ts
export class Wallet {
  constructor(
    public readonly address: Address,
    public readonly chainId: ChainId,
    public readonly provider: string
  ) {}
}

// 2. Application Layer - 定义用例
// application/use-cases/ConnectWallet.ts
export class ConnectWalletUseCase {
  constructor(
    private walletPort: IWalletPort,
    private eventBus: IEventBus
  ) {}

  async execute(provider: string): Promise<Wallet> {
    const connection = await this.walletPort.connect(provider);
    const wallet = new Wallet(
      new Address(connection.address),
      new ChainId(connection.chainId),
      provider
    );

    this.eventBus.emit(new WalletConnectedEvent(wallet));
    return wallet;
  }
}

// 3. Infrastructure Layer - 实现具体连接
// infrastructure/wallet/MetaMaskConnector.ts
export class MetaMaskConnector implements IWalletPort {
  async connect(): Promise<ConnectionResult> {
    // MetaMask specific implementation
  }
}

// 4. Presentation Layer - UI组件
// presentation/components/ConnectButton.svelte
<script>
  import { connectWallet } from '../controllers/WalletController';

  async function handleConnect() {
    await connectWallet('metamask');
  }
</script>
```

## 测试策略

### 单元测试

- **Domain Layer**: 纯函数测试，无需mock
- **Application Layer**: Mock端口接口
- **Infrastructure Layer**: 集成测试
- **Presentation Layer**: 组件测试

### 测试示例

```typescript
// domain/entities/Wallet.test.ts
describe('Wallet Entity', () => {
	it('should create valid wallet', () => {
		const wallet = new Wallet(new Address('0x...'), new ChainId(1), 'metamask');
		expect(wallet.isValid()).toBe(true);
	});
});

// application/use-cases/ConnectWallet.test.ts
describe('ConnectWallet UseCase', () => {
	it('should connect wallet', async () => {
		const mockPort = createMockWalletPort();
		const useCase = new ConnectWalletUseCase(mockPort);

		const wallet = await useCase.execute('metamask');
		expect(wallet).toBeDefined();
		expect(mockPort.connect).toHaveBeenCalled();
	});
});
```

## 优势

1. **高内聚**：相关功能聚合在一起
2. **低耦合**：层与层之间通过接口通信
3. **可测试**：每层可独立测试
4. **可维护**：清晰的职责划分
5. **可扩展**：易于添加新功能
6. **技术无关**：核心业务逻辑不依赖具体技术

## 迁移计划

1. **Phase 1**: 创建新的目录结构
2. **Phase 2**: 迁移核心功能到domain层
3. **Phase 3**: 实现application层服务
4. **Phase 4**: 重构infrastructure层
5. **Phase 5**: 更新presentation层组件
6. **Phase 6**: 添加完整的测试覆盖
