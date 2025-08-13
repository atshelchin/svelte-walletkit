# Domain Layer（领域层）

## 概述

领域层是整个应用的核心，包含业务逻辑和规则。这一层完全独立于任何框架、数据库或外部服务。

## 目录结构

```
domain/
├── entities/        # 实体 - 具有唯一标识的业务对象
├── value-objects/   # 值对象 - 不可变的值表示
├── events/         # 领域事件 - 业务事件
├── errors/         # 领域错误 - 业务异常
└── types/          # 类型定义 - 领域相关的类型
```

## 核心概念

### Entities（实体）

- `Wallet`: 钱包实体，代表一个连接的钱包账户
- `Network`: 网络实体，代表一个区块链网络
- `Transaction`: 交易实体，代表一笔区块链交易

### Value Objects（值对象）

- `Address`: 以太坊地址
- `ChainId`: 链ID
- `Balance`: 余额
- `TransactionHash`: 交易哈希

### Domain Events（领域事件）

- `WalletConnectedEvent`: 钱包连接事件
- `WalletDisconnectedEvent`: 钱包断开事件
- `NetworkChangedEvent`: 网络切换事件
- `TransactionSentEvent`: 交易发送事件

## 设计原则

1. **不可变性**: 值对象一旦创建就不可修改
2. **自验证**: 实体和值对象在创建时自动验证其有效性
3. **业务规则封装**: 所有业务规则都在领域对象内部实现
4. **无外部依赖**: 不依赖任何框架或外部库

## 使用示例

```typescript
// 创建值对象
const address = new Address('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4');
const chainId = new ChainId(1);

// 创建实体
const wallet = new Wallet(address, chainId, 'metamask');

// 使用业务方法
if (wallet.isValid()) {
	console.log(wallet.getDisplayName());
}
```
