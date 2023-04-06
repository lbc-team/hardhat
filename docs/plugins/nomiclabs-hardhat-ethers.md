---
editLink: false
---

[![npm](https://img.shields.io/npm/v/@nomiclabs/hardhat-ethers.svg)](https://www.npmjs.com/package/@nomiclabs/hardhat-ethers)
[![hardhat](https://hardhat.org/buidler-plugin-badge.svg?1)](https://hardhat.org)

# hardhat-ethers

用于与 [ethers.js](https://github.com/ethers-io/ethers.js/) 集成的 [Hardhat](https://hardhat.org) 插件。 

## 是什么
这个插件使 Hardhat 可以使用以太坊库 `ethers.js`，它允许您以简单的方式与以太坊区块链进行交互。

## 安装

```bash
npm install --save-dev @nomiclabs/hardhat-ethers 'ethers@^5.0.0'
```

并将以下语句添加到您的`hardhat.config.js`:

```js
require("@nomiclabs/hardhat-ethers");
```

如果您使用的是 TypeScript，添加以下语句到您的 `hardhat.config.ts`:

```js
import "@nomiclabs/hardhat-ethers";
```

## 任务

这个插件不会创建额外的任务。

## 环境扩展

此插件将一个 ethers 对象添加到 Hardhat 运行时环境。

此对象与  ethers.js 具有相同的 API，并具有一些额外的特定于 Hardhat 的功能。


### Provider对象

一个 provider 字段被添加到 ethers，这是一个自动连接到选定的网络的 ethers.providers.Provider


### Helpers

这些 helpers 被添加到`ethers` 对象:

```typescript
interface Libraries {
  [libraryName: string]: string;
}

interface FactoryOptions {
  signer?: ethers.Signer;
  libraries?: Libraries;
}

function getContractFactory(name: string): Promise<ethers.ContractFactory>;

function getContractFactory(name: string, signer: ethers.Signer): Promise<ethers.ContractFactory>;

function getContractFactory(name: string, factoryOptions: FactoryOptions): Promise<ethers.ContractFactory>;


function getContractAt(nameOrAbi: string | any[], address: string, signer?: ethers.Signer): Promise<ethers.Contract>;

function getSigners() => Promise<ethers.Signer[]>;

function getSigner(address: string) => Promise<ethers.Signer>;
```

默认情况下，这些 helpers 返回的`Contracts`和`ContractFactorys`连接到`getSigners`返回的第一个 signer。

如果没有找到 signer，`getContractAt` 将返回只读的（read-only） `contracts`。

## 用法

您不需要采取任何其他步骤即可使此插件正常工作。

在您需要的任何地方（任务、脚本、测试等）安装它并通过Hardhat运行时环境访问 ethers。

例如，在您的`hardhat.config.js`中：
```js
require("@nomiclabs/hardhat-ethers");

// 任务操作函数接收 Hardhat 运行时环境作为第二个参数
task(
  "blockNumber",
  "Prints the current block number",
  async (_, { ethers }) => {
    await ethers.provider.getBlockNumber().then((blockNumber) => {
      console.log("Current block number: " + blockNumber);
    });
  }
);

module.exports = {};
```

然后运行 `npx hardhat blockNumber` 进行尝试。

阅读关于 [Hardhat Runtime Environment](https://hardhat.org/advanced/hardhat-runtime-environment.html) 的文档，了解如何以不同的方式访问 HRE，以便在任何可以访问 HRE 的地方使用ethers.js。
### 库连接

有些 `contracts` 在部署之前需要与库连接。您可以使用如下对象将其库的地址传递给 `getContractFactory` 函数：

```js
const contractFactory = await this.env.ethers.getContractFactory(
  "Example",
  {
    libraries: {
      ExampleLib: "0x..."
    }
  }
);
```
这允许您为 `Example` 合约创建一个合约工厂，并将其 `ExampleLib` 库引用连接到地址 `“0x…”`。

若要创建合约工厂，必须连接所有库。将抛出一个错误，通知您任何丢失的库。

### 故障排除

#### 事件未发出

Ethers.js 轮询网络来检查是否发出了某些事件（使用 WebSocketProvider 时除外；见下文）。 此轮询每 4 秒进行一次。 如果您的脚本或测试未发出事件，则很可能在轮询机制检测到事件之前执行已完成。

如果您使用 `WebSocketProvider` 连接到 Hardhat 节点，则应立即发出事件。 但请记住，您必须手动创建此提供程序，因为 Hardhat 仅支持通过 http 配置网络。 也就是说，您不能添加具有 ws://127.0.0.1:8545 等 URL 的本地主机网络。

#### 未使用 hardhat.config 中的 Gas 交易参数

使用此插件时，hardhat.config 中的 `gas`、`gasPrice` 和 `gasMultiplier` 参数不会自动应用于交易。 为了向您的交易提供此类值，请将它们指定为交易本身的重写。
