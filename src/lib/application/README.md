# Application Layer（应用层）

## 概述

应用层协调领域对象来实现业务用例。它定义了应用程序的功能，但将具体实现委托给领域层和基础设施层。

## 目录结构

```
application/
├── services/       # 应用服务 - 协调多个用例
├── use-cases/      # 用例 - 单一业务操作
├── dto/           # 数据传输对象 - 层间数据传递
└── ports/         # 端口 - 外部依赖的接口定义
```

## 核心概念

### Use Cases（用例）

每个用例代表一个具体的业务操作：

- `ConnectWalletUseCase`: 连接钱包
- `DisconnectWalletUseCase`: 断开钱包
- `SwitchNetworkUseCase`: 切换网络
- `SendTransactionUseCase`: 发送交易
- `SignMessageUseCase`: 签名消息

### Ports（端口）

定义与外部系统交互的接口：

- `IWalletPort`: 钱包操作接口
- `INetworkPort`: 网络操作接口
- `IStoragePort`: 存储操作接口
- `IEventBus`: 事件总线接口

### Services（服务）

协调多个用例的高级服务：

- `WalletService`: 钱包服务
- `NetworkService`: 网络服务
- `TransactionService`: 交易服务

## 设计原则

1. **单一职责**: 每个用例只负责一个业务操作
2. **依赖倒置**: 通过端口接口依赖抽象而非具体实现
3. **错误处理**: 统一的错误处理和转换
4. **事件驱动**: 通过事件总线发布领域事件

## 使用示例

```typescript
// 创建用例
const connectWalletUseCase = new ConnectWalletUseCase(walletPort, eventBus);

// 执行用例
try {
	const wallet = await connectWalletUseCase.execute('metamask');
	console.log('Wallet connected:', wallet.address);
} catch (error) {
	console.error('Failed to connect wallet:', error);
}
```

## 测试策略

```typescript
// Mock端口进行单元测试
const mockWalletPort = {
	connect: jest.fn().mockResolvedValue({
		address: '0x123...',
		chainId: 1,
		provider: 'metamask'
	})
};

const useCase = new ConnectWalletUseCase(mockWalletPort, mockEventBus);
```
