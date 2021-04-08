# 从Buidler迁移

Hardhat是Buidler的全新升级版。

本指南将教你如何将项目从Buidler迁移到Hardhat。

## 安装Hardhat软件包

迁移项目需要做的第一件事是安装新的npm包。

`@nomiclabs/buidler`包现在修改为`hardhat`，以前的包名是`@nomiclabs/buidler-<name>`，现在名字是`@nomiclabs/hardhat-<name>`。

例如，如果你使用`@nomiclabs/buidler`和`@nomiclabs/buidler-ethers`，你需要运行：

```
npm install --save-dev hardhat @nomiclabs/hardhat-ethers
```

如果你使用的是Buidler的全局安装，你还需要在本地目录安装Hardhat。
当前不支持Hardhat的全局安装。

## 调整config

你可以在Hardhat中使用Buidler配置，配置内容基本上没有变化。所需要做的就是按照以下步骤进行：

### 重命名配置文件

首先，需要把配置文件从`buidler.config.js`重命名为`hardhat.config.js`。或者如果你使用的是TypeScript，把`buidler.config.ts`改为`hardhat.config.ts`。

### 改变插件的加载方式

然后，必须改变插件的加载方式。不使用 `usePlugin `函数，只需用必须 require/import 导入 npm包。例如，之前是：

```js
usePlugin("@nomiclabs/buidler-ethers");
```

现在需要替换成：

```js
require("@nomiclabs/hardhat-ethers");
```

或者，如果你使用的是TypeScript，则替换为：

```ts
import "@nomiclabs/hardhat-ethers";
```

如果之前明确导入了`usePlugin`函数，也需要删除该导入，因为功能不存在了。

### 配置Hardhat网络

Buidler EVM现在修改为Hardhat网络，所以如果之前使用`buidlerevm`网络配置字段进行定制网络，需要把它改名为`hardhat`。你可以在[这里](./config/README.md#hardhat-network)了解更多关于如何定制网络，包括启用主网Fork功能。

例如，如果之前你的配置里有：

```js
networks: {
  buidlerevm: {
    blockGasLimit: 12000000
  }
}
```

你需要替换成：

```js
networks: {
  hardhat: {
    blockGasLimit: 12000000
  }
}
```

### 更新Solidity配置

Hardhat对支持多个版本的Solidity，之前使用`solc`配置修改为用`solidity`配置。

如果之前你的配置里有：

```js
solc: {
  version: "0.7.1",
  optimizer: {
    enabled: true
  }
}
```

应该把它改成这样。

```js
solidity: {
  version: "0.7.1",
  settings: {
    optimizer: {
      enabled: true
    }
  }
}
```

这是一个非常简单的配置，但Hardhat支持任意复杂的编译设置，可以精确到给单个文件设置编译器版本。查看[这里](./compile-contracts.md)以了解更多信息。

## TypeScript支持变化

当你的配置是用TypeScript写的，并且以`.ts`结尾时，Hardhat就会启用TypeScript支持。如果你使用的是TypeScript，而用一个JavaScript配置，请看[Typescript部分](./typescript.md)。

你不再需要Hardhat的`tsconfig.json`文件，建议你删除它。

如果你喜欢保留它，你应该以[这里](./typescript.md#customizing-typescript-with-a-tsconfig-json-file)的模板为基础。只要确保你删除了所有的`type-extension.d.ts`文件，并在`files`字段保留你的配置文件。

最后，如果配置里有`BuidlerConfig`类型，你应该把它改为`HardhatUserConfig`。

## 更新`console.sol`

如果你在合约中使用`console.log`，你需要更改`@nomiclabs/buidler/console.sol`为`hardhat/console.sol`。

如果你有这个：

```javascript
import "@nomiclabs/buidler/console.sol";
```

你应该改成：

```javascript
import "hardhat/console.sol";
```

## 导入同名问题

Hardhat支持多个同名合约。

如果你有同名名称的合约，你就不能只用名称来导入它们的artifact。

例如，如果你有一个名为 `Ownable `的合约，而依赖关系也有一个同名的合约，你将无法执行`artifacts.require(Ownable)`和`ethers.getContractFactory(Ownable)`。你需要使用合约的完整的限定名称(如`contracts/Ownable.sol:Ownable)`。

如果你尝试导入一个名称重复的合约，Hardhat将失败，并显示一个错误信息，其中包括不同选项来修复它。你所需要做的就是复制和粘贴它们。

例如，你可能需要更换

```js
const Ownable = await ethers.getContractFactory("Ownable");
```

为

```js
const Ownable = await ethers.getContractFactory("contracts/Ownable.sol:Ownable");
```

## Mocha和VSCode 配置的变化

如果你是直接用Mocha或通过VSCode Mocha插件来运行测试，请看一下[这个更新指南](./vscode-tests.md)。

## 插件更新

所有的Buidler官方插件都已经迁移到Hardhat上。

一些社区自建的插件，还没有被迁移。如果你正在使用这些插件，你必须暂时禁用它们。

你可以在[插件部分](https://hardhat.org/plugins)找到已经更新的插件。

### buidler-deploy

这个插件已经被移植了，现在叫[`hardhat-deploy`](https://github.com/wighawag/hardhat-deploy)。

如果你需要帮助，请加入[Discord](https://hardhat.org/discord)上的`#hardhat-deploy`频道。

### buidler-typechain

TypeChain插件已经迁移，现在叫[`hardhat-typechain`](https://github.com/rhlsthrm/hardhat-typechain/)。

如果你需要帮助，请加入[Discord](https://hardhat.org/discord)的 `#hardhat-typechain `频道。

### buidler-gas-reporter

这个插件已经迁移，现在叫[`hardhat-gas-reporter`](https://github.com/cgewecke/hardhat-gas-reporter/)。

如果你需要帮助，请加入[Discord](https://hardhat.org/discord)上的`#hardhat-gas-reporter`频道。

### solidity-coverage

这个插件已经被移植到Hardhat上。加入我们的 [Discord Server](https://hardhat.org/discord)，以便在发布时收到我们的公告。


