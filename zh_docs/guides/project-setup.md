# 启动项目

Hardhat项目是安装了 `hardhat `包和 `hardhat.config.js `文件的`npm`项目。

如果你在一个没有这些文件的文件夹中运行`npx hardhat`，你将会看到两个选项以方便创建项目。

```bash
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

如果选择_创建一个空的hardhat.config.js_，Hardhat将创建一个包含以下内容的`hardhat.config.js`:

```js
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
};
```

然后，你需要安装Hardhat:

```
npm install --save-dev hardhat
```

而这足以使用默认的项目结构来运行Hardhat。

### 样本Hardhat项目

如果你选择_创建一个示例项目_一个简单的项目创建向导会问你一些问题，然后创建一个结构如下的项目:

```
contracts/
scripts/
test/
hardhat.config.js
```

这些是Hardhat项目的默认路径。

- `contracts/`是合约的源文件所在的地方。
- `test/`是你的测试文件所在的地方。
- `scripts/`是简单的自动化脚本的所在。

如果你需要改变这些路径，请查看[路径配置部分](../config/README.md#path-configuration)。

### 测试和以太坊网络

当需要测试合约时，Hardhat带有一些内置的默认值：

- 将采用内置的[Hardhat网络](../hardhat-network/README.md)作为开发网络进行测试。
- [Mocha](https://mochajs.org/)作为测试运行器。

如果你需要使用外部网络，比如以太坊 testnet、mainnet或者其他一些特定的节点软件，你可以使用`hardhat.config.js`中导出的对象中的`networks`配置项进行设置，这是Hardhat项目管理设置的方式。

然后可以使用CLI 参数 `--network` 来改变网络。

请看[网络配置部分](../config/README.md#networks-configuration)来了解更多关于设置不同网络的信息。

### 插件和依赖

在创建示例项目时，你可能已经看到了这个信息：

```
You need to install these dependencies to run the sample project:
  npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

这源于Hardhat的大部分功能来自于插件，所以请查看官方列表的[插件部分](../plugins/README.md)，看看是否有其他看起来有趣的插件。

示例项目使用了`@nomiclabs/hardhat-waffle`插件，它依赖于`@nomiclabs/hardhat-ethers`插件。它们将Ethers.js和Waffle工具集成到项目中。

要使用一个插件，第一步总是使用`npm`或`yarn`安装它，然后在配置文件中引入它：

```js
require("@nomiclabs/hardhat-waffle");

module.exports = {};
```

插件对于Hardhat项目来说是很重要的，所以一定要查看有哪些可用的插件，也可以建立自己的插件。

如果你有任何帮助或反馈，你可以在[Hardhat Support Discord服务器](https://hardhat.org/discord)找到我们。