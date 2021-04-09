# 使用ethers.js和Waffle进行测试

在Hardhat中编写智能合约测试是使用JavaScript或TypeScript完成的。

在本指南中，我们将向你展示如何使用[Ethers.js](https://docs.ethers.io/)，这是一个与以太坊交互的JavaScript库。
和[Waffle](https://getwaffle.io/)在其之上构建的一个简单的智能合约测试库。 这是我们的建议选择的测试方式。

我们通过Hardhat的示例项目来看看如何使用它。

::: tip
Ethers和Waffle支持TypeScript。 了解如何使用TypeScript设置Hardhat[这里](./typescript.md)。
:::

## 设置

在空目录下[安装Hardhat](/getting-started/README.md#installation)，完成后，运行`npx hardhat`。


```
$ npx hardhat
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

Welcome to Hardhat v2.0.0

? What do you want to do? …
❯ Create a sample project
  Create an empty hardhat.config.js
  Quit
```

选择 `创建一个样本项目（Create a sample project）`。 这将创建一些文件并安装`@nomiclabs/hardhat-ethers`、`@nomiclabs/hardhat-waffle`插件和其他必要的包。


::: tip
Hardhat会让你知道如何安装，但如果你错过了，你可以用`npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers`来安装。
:::

查看`hardhat.config.js`文件，你会发现Waffle插件已经启用。


<<< @/../packages/hardhat-core/sample-project/hardhat.config.js{1}

::: tip
不在需要 `require("@nomiclabs/hardhat-ethers")`，  因为  `hardhat-waffle` 已经做到了
:::

## 测试

使用Waffle的测试是用[Mocha](https://mochajs.org/)和[Chai](https://www.chaijs.com/)一起编写的。 如果你没有听说过它们，它们是超级流行的JavaScript测试工具。

在`test`文件夹中，你会发现`sample-test.js`。 我们来看一下，并在接下来一一解释。


<<< @/../packages/hardhat-core/sample-project/test/sample-test.js

在终端上运行`npx hardhat test`， 你应该看到以下输出：

```
$ npx hardhat test

  Contract: Greeter
    ✓ Should return the new greeting once it's changed (762ms)

  1 passing (762ms)
```

这意味着测试通过了。 现在我们来解释一下每一行代码：

```js
const { expect } = require("chai");
```

我们需要的是 `Chai`，它是一个断言库。 这些断言函数被称为 `匹配器`，我们在这里使用的这些函数其实来自Waffle。

这就是为什么我们要使用`hardhat-waffle`插件的原因，这使得我们更容易从以太坊中断言值。 查看Waffle文档中的[本节](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html)，了解以太坊专用匹配器的整个列表。


::: warning
有些Waffle匹配器会返回一个Promise而不是立即执行。 如果你要调用或发送交易，一定要查看Waffle的文档，并`await`这些Promise。 否则你的测试可能会在没有运行所有检查的情况下通过。
:::

```js
describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    // ...
  });
});
```

这个包装器只是遵循Mocha提出的测试结构，但你可能已经注意到在`it`的回调函数中使用了`async`。 与以太坊网络和智能合约的交互是异步操作，因此大多数API和库都使用JavaScript的`Promise`来返回值。 使用 `async`可以让我们通过 `await`等待对合约和Hardhat网络节点的调用。


```js
const Greeter = await ethers.getContractFactory("Greeter");
```

`ethers.js`中的`ContractFactory`是一个用于部署新的智能合约的抽象，所以这里的`Greeter`是我们的greeter合约实例的工厂。


```js
const greeter = await Greeter.deploy("Hello, world!");
```

在 `ContractFactory`上调用 `deploy()`将开始部署，并返回一个解析为 `Contract`的 `Promise`。 这是一个合约对象，在这个对象上可以条用每个智能合约函数。 这里我们要把字符串 `Hello, world!`传递给合约的构造函数。

一旦合约部署完毕，就可以在`greeter`上调用合约方法，用它们来获取合约的状态。


```js
expect(await greeter.greet()).to.equal("Hello, world!");
```

在这里，我们使用`Contract`实例来调用Solidity代码中的智能合约函数。 `greet()`返回迎接者的问候语，我们正在检查它是否等于`Hello, world!`，因为它应该相等。 这里，我们使用了Chai匹配器`expect`、`to`和`equal`。

```js
await greeter.setGreeting("Hola, mundo!");
expect(await greeter.greet()).to.equal("Hola, mundo!");
```

我们可以用相同的方式修改合约的状态， 调用 `setGreeting`将设置一个新的问候信息。 在解析了 `Promise`之后，我们再进行一次断言，以验证问候语是否真正改变了。

### 用不同的账户进行测试

如果你需要从默认账户以外的账户发送交易，你可以使用Ethers.js提供的`connect()`方法。

第一步是要从`ethers`中获取`Signers`对象：


```js
const [owner, addr1] = await ethers.getSigners();
```

Ethers.js中的 `Signer`是一个代表以太坊账户的对象，它用于向合约和其他账户发送交易。 这里得到的是所连接的节点中的账户列表，这里的节点是**[Hardhat网络](../hardhat-network/README.md)**，并获得了第一和第二个账户。



::: tip
要了解更多关于 `Signer `的信息，可以查看 [Signers 文档](https://docs.ethers.io/v5/api/signer/#Wallet).
:::

`ethers`变量在全局作用域可用。 如果你喜欢代码显示表达，你可以在顶部添加这一行：


```js
const { ethers } = require("hardhat");
```

最后，如果要从另一个账户执行一个合约的方法，你需要做的就是将正在执行方法的 `Contract`与账号 `connect`起来。


```js
await greeter.connect(addr1).setGreeting("Hallo, Erde!");
```

## 迁移现有的Waffle项目


如果你从头开始一个项目，并希望使用Waffle，你可以跳过本节。 如果你正在建立一个现有的Waffle项目来使用Hardhat，你需要迁移Waffle提供的[配置选项](https://ethereum-waffle.readthedocs.io/en/latest/configuration.html)。 下表是Waffle配置与其Hardhat对应的配置的对应关系。

|Waffle|Hardhat|
|---|---|
|`sourcesPath`|`paths.sources`|
|`targetPath`|`paths.artifacts`|
|`solcVersion`|`solc.version` (仅版本号)|
|`compilerOptions.evmVersion`|`solc.evmVersion`|
|`compilerOptions.optimizer`|`solc.optimizer`|

举个例子，这个Waffle配置文件：

```json
{
  "sourcesPath": "./some_custom/contracts_path",
  "targetPath": "../some_custom/build",
  "solcVersion": "v0.4.24+commit.e67f0147",
  "compilerOptions": {
    "evmVersion": "constantinople",
    "optimizer": {
      "enabled": true,
      "runs": 200
    }
  }
}
```

会转换为这个Hardhat配置：

```js
module.exports = {
  paths: {
    sources: "./some_custom/contracts_path",
    artifacts: "../some_custom/build",
  },
  solidity: {
    version: "0.4.24", // Note that this only has the version number
    settings: {
      evmVersion: "constantinople",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
```

如果你要将现有的Waffle项目迁移到Hardhat，那么你需要的最少配置是改变Hardhat的编译输出路径，因为Waffle默认使用不同的路径：

```js
require("@nomiclabs/hardhat-waffle");

module.exports = {
  paths: {
    artifacts: "./build",
  },
};
```

### 调整测试

和之前使用单独的Waffle进行测试有所不同。

例如，不再这样写：

```js
const { deployContract } = require("ethereum-waffle");
```

应该是：:

```typescript
const { waffle } = require("hardhat");
const { deployContract } = waffle;
```

::: warning
从 `ethereum-waffle`导入Waffle的函数，可能会导致多个问题。

例如，Waffle有一个400万[默认的 gas 限制](https://github.com/EthWorks/Waffle/blob/3.0.2/waffle-cli/src/deployContract.ts#L4-L7) ，对于合约部署交易的Gas，通常过低。


请确保你从 [Hardhat Runtime Environment](../advanced/hardhat-runtime-environment.md) 的`waffle`字段中导入它们。 它是一个Waffle的改编版本，与Hardhat配合得很好。

:::

另外，你不需要调用`chai.use`。 这个初始化已经由`@nomiclabs/hardhat-waffle`处理。 只要确保在你的Hardhat配置中包含`require("@nomiclabs/hardhat-waffle");`。

最后，不需要初始化一个`MockProvider`，只需要使用插件的provider就可以了，就像这样:


```js
const { waffle } = require("hardhat");
const provider = waffle.provider;
```

用`npx hardhat test`运行你的测试，当一个交易失败时，你应该得到堆栈记录。
