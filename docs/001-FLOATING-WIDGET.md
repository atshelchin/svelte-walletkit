# 001 - Floating Account Widget Requirements

## 概述

WalletKit Floating Widget 是一个可以通过一行代码集成到任何网页的Web3账户中心组件。它以悬浮助手的形式存在于网页边缘，为用户提供完整的钱包连接、账户管理和订阅服务功能，而宿主应用无需开发任何UI。

## 核心理念

### 一行代码集成
```html
<script src="https://cdn.walletkit.io/widget.js" data-app-id="YOUR_APP_ID"></script>
```

### 视觉呈现
- **悬浮助手**：一个可爱的角色形象（如小助手、机器人或吉祥物）悬浮在网页边缘
- **位置可配置**：支持右下角、左下角、右侧中部等位置
- **动画效果**：闲置时有呼吸动画，hover时有反馈动画
- **最小化干扰**：不影响网页主体内容的使用

### 交互模式
1. **点击悬浮助手** → 展开账户中心面板
2. **面板功能**：
   - 钱包连接/断开
   - 账户信息显示
   - 网络切换
   - 订阅状态查看
   - 订阅计划购买
   - 交易历史

## 技术架构

### 1. 独立封装
```javascript
// 完全独立的命名空间，避免冲突
window.WalletKitWidget = {
  init: function(config) {},
  show: function() {},
  hide: function() {},
  api: {
    isConnected: function() {},
    getAccount: function() {},
    hasSubscription: function() {},
    // ...更多API
  }
};
```

### 2. 样式隔离
- 使用 Shadow DOM 或 iframe 完全隔离样式
- 不受宿主页面CSS影响
- 不影响宿主页面样式

### 3. 通信接口
```javascript
// 宿主应用查询状态
const isLoggedIn = await WalletKitWidget.api.isConnected();
const hasActiveSubscription = await WalletKitWidget.api.hasSubscription();

// 监听事件
WalletKitWidget.on('connected', (account) => {
  console.log('User connected:', account);
});

WalletKitWidget.on('subscriptionPurchased', (plan) => {
  enablePremiumFeatures();
});

// 主动触发操作
WalletKitWidget.api.requireAuth(); // 如果未登录，自动打开连接面板
WalletKitWidget.api.requireSubscription(); // 如果无订阅，自动打开购买面板
```

## 最小化实现方案

### 第一阶段：基础悬浮组件
```html
<!DOCTYPE html>
<html>
<head>
  <title>Demo App</title>
</head>
<body>
  <h1>My Web Application</h1>
  
  <!-- 一行代码引入WalletKit Widget -->
  <script>
    (function() {
      // 1. 创建悬浮助手容器
      const widget = document.createElement('div');
      widget.id = 'walletkit-widget';
      widget.innerHTML = `
        <div class="wk-floating-assistant">
          <img src="assistant-icon.svg" alt="Assistant" />
          <span class="wk-status-dot"></span>
        </div>
        <div class="wk-panel" style="display:none;">
          <div class="wk-panel-header">
            <h3>Account Center</h3>
            <button class="wk-close">×</button>
          </div>
          <div class="wk-panel-body">
            <!-- 动态内容 -->
          </div>
        </div>
      `;
      
      // 2. 注入样式
      const style = document.createElement('style');
      style.textContent = `
        #walletkit-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
        }
        
        .wk-floating-assistant {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .wk-floating-assistant:hover {
          transform: scale(1.1);
        }
        
        .wk-floating-assistant img {
          width: 40px;
          height: 40px;
        }
        
        .wk-status-dot {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          border: 2px solid white;
        }
        
        .wk-panel {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
        }
        
        .wk-panel-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .wk-panel-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }
      `;
      
      // 3. 添加到页面
      document.head.appendChild(style);
      document.body.appendChild(widget);
      
      // 4. 绑定交互
      const assistant = widget.querySelector('.wk-floating-assistant');
      const panel = widget.querySelector('.wk-panel');
      const closeBtn = widget.querySelector('.wk-close');
      
      assistant.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
      });
      
      closeBtn.addEventListener('click', () => {
        panel.style.display = 'none';
      });
      
      // 5. 暴露API
      window.WalletKitWidget = {
        isConnected: () => {
          // 返回连接状态
          return localStorage.getItem('wk_connected') === 'true';
        },
        
        connect: async () => {
          // 触发连接流程
          panel.style.display = 'flex';
          // ... 连接逻辑
        },
        
        on: (event, callback) => {
          // 事件监听
          window.addEventListener('wk_' + event, callback);
        },
        
        emit: (event, data) => {
          window.dispatchEvent(new CustomEvent('wk_' + event, { detail: data }));
        }
      };
    })();
  </script>
</body>
</html>
```

## 功能模块

### 1. 账户模块
- 连接/断开钱包
- 显示地址和余额
- ENS域名解析
- 复制地址功能
- 查看交易历史

### 2. 网络模块  
- 当前网络显示
- 网络切换
- 自定义RPC
- 网络健康状态

### 3. 订阅模块
- 订阅状态展示
- 订阅计划列表
- 一键购买/续费
- 订阅历史记录
- 剩余时间提醒

### 4. 通知模块
- 连接成功/失败提示
- 交易确认提醒
- 订阅到期提醒
- 系统通知

## 配置选项

```javascript
<script 
  src="https://cdn.walletkit.io/widget.js"
  data-app-id="YOUR_APP_ID"
  data-position="bottom-right"
  data-theme="auto"
  data-lang="en"
  data-subscription-contract="0x..."
  data-subscription-network="137"
  data-features="wallet,subscription,notifications"
></script>
```

| 参数 | 说明 | 默认值 |
|-----|------|--------|
| data-app-id | 应用标识 | 必填 |
| data-position | 组件位置 | bottom-right |
| data-theme | 主题模式 | auto |
| data-lang | 语言 | en |
| data-subscription-contract | 订阅合约地址 | 可选 |
| data-subscription-network | 订阅合约网络 | 1 |
| data-features | 启用的功能模块 | wallet |

## 与宿主应用的交互示例

```javascript
// 宿主应用代码
(function() {
  // 等待Widget加载完成
  window.addEventListener('wk_ready', function() {
    
    // 检查用户是否已连接
    if (!WalletKitWidget.isConnected()) {
      // 显示连接提示
      showConnectPrompt();
    }
    
    // 检查订阅状态
    WalletKitWidget.checkSubscription((status) => {
      if (status.isActive) {
        enablePremiumFeatures();
      } else {
        showUpgradePrompt();
      }
    });
    
    // 监听连接事件
    WalletKitWidget.on('connected', (account) => {
      updateUserUI(account);
      loadUserData(account.address);
    });
    
    // 监听订阅购买
    WalletKitWidget.on('subscriptionPurchased', (plan) => {
      showSuccessMessage('Thanks for subscribing!');
      enablePremiumFeatures();
    });
    
    // 功能访问控制
    document.getElementById('premium-feature').addEventListener('click', () => {
      WalletKitWidget.requireSubscription((hasAccess) => {
        if (hasAccess) {
          openPremiumFeature();
        }
        // Widget会自动处理无订阅的情况，显示购买面板
      });
    });
  });
})();
```

## 优势总结

1. **零开发成本**：宿主应用无需开发任何Web3相关UI
2. **统一体验**：所有接入应用都有一致的用户体验
3. **维护简单**：Widget独立更新，不影响宿主应用
4. **安全隔离**：代码和样式完全隔离，避免冲突
5. **灵活通信**：丰富的API满足各种交互需求
6. **渐进增强**：可以从基础功能开始，逐步启用高级特性

## 实现优先级

1. **P0 - 核心功能**
   - 悬浮助手UI
   - 基础面板框架
   - 钱包连接功能
   - API通信接口

2. **P1 - 订阅系统**
   - 订阅状态查询
   - 购买流程
   - 网络自动切换

3. **P2 - 增强功能**
   - 多语言支持
   - 主题定制
   - 动画效果
   - 通知系统

4. **P3 - 高级特性**
   - 交易历史
   - ENS集成
   - 多链支持
   - 数据分析

## 技术挑战与解决方案

### 挑战1：样式冲突
**解决方案**：使用Shadow DOM或iframe完全隔离

### 挑战2：跨域通信
**解决方案**：使用postMessage API进行安全通信

### 挑战3：性能影响
**解决方案**：懒加载、代码分割、资源优化

### 挑战4：移动端适配
**解决方案**：响应式设计、触摸优化、自适应布局

## 参考案例

- **Intercom**：客服聊天组件的典范
- **Crisp Chat**：轻量级聊天组件
- **Drift**：营销对话组件
- **Web3Auth**：Web3登录组件
- **WalletConnect**：钱包连接标准

这些成功案例证明了"一行代码集成"模式的可行性和市场需求。