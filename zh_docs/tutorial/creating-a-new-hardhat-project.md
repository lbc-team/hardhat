# 3. 创建新的 Hardhat 项目

我们将使用npm 命令行安装**hardhat**。 NPM是一个Node.js软件包管理器和一个JavaScript代码库。

打开一个新终端并运行以下命令：

```
mkdir hardhat-tutorial 
cd hardhat-tutorial 
npm init --yes 
npm install --save-dev hardhat 
```

::: tip
安装**Hardhat**将安装一些以太坊JavaScript依赖项，因此请耐心等待。
:::

在安装**Hardhat**的目录下运行：

```
npx hardhat
```

使用键盘选择"创建一个新的hardhat.config.js（`Create an empty hardhat.config.js`）" ，然后回车。


```{15}
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
  Create a sample project
❯ Create an empty hardhat.config.js
  Quit
```

在运行**Hardhat**时，它将从当前工作目录开始搜索最接近的`hardhat.config.js`文件。 这个文件通常位于项目的根目录下，一个空的`hardhat.config.js`足以使**Hardhat**正常工作。

## Hardhat 架构

**Hardhat**是围绕**task(任务)**和**plugins(插件)**的概念设计的。 **Hardhat **的大部分功能来自插件，作为开发人员，你[可以自由选择](/plugins/) 你要使用的插件。

### Tasks(任务)

每次在命令行运行**Hardhat**时，都是在运行任务。 例如 `npx hardhat compile`正在运行`compile`任务。 要查看项目中当前可用的任务，运行`npx hardhat`。 通过运行`npx hardhat help [task]`，可以探索任何任务。

::: tip
你可以创建自己的任务。 请查看[创建任务](/guides/create-task.md) 指南.
:::

### Plugins(插件)

**Hardhat** 不限制选择哪种工具，但是它确实内置了一些插件，所有这些也都可以覆盖。 大多数时候，使用给定工具的方法是将其集成到**Hardhat**中作为插件。

在本教程中，我们将使用Ethers.js和Waffle插件。 通过他们与以太坊进行交互并测试合约。 稍后将解释它们的用法。 要安装它们，请在项目目录中运行：

```
npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
```

将高亮行`require("@nomiclabs/hardhat-waffle");` 添加到你的`hardhat.config.js`中，如下所示：

```js {1}
require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
};
```

We're only requiring `hardhat-waffle` here because it depends on `hardhat-ethers` so adding both isn't necessary.
