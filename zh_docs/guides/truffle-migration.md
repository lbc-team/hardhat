# 从Truffle迁移到

Hardhat是一个任务运行器，方便构建以太坊智能合约。 它可以帮助开发人员管理和自动化构建智能合约过程中固有的重复性任务，并围绕这一工作流程轻松引入更多功能。 这意味着在最核心的功能是进行编译和测试。

Hardhat的大部分功能来自于插件，作为开发者，你可以自由选择你想使用的插件。 Truffle 4和5的插件可以让你轻松迁移到Hardhat。

要将现有的Truffle项目迁移到Hardhat上，主要有以下两件事要考虑：测试和部署。


### 测试

谈到单元测试，有两个Hardhat插件支持Truffle测试API ： `hardhat-truffle4`和`hardhat-truffle5`。两个插件都支持Solidity 4+ 版本。 使用他们就可以用Hardhat运行现有的测试。

如果你想了解编写Truffle测试在Hardhat中运行的细节，可以阅读[这个指南](./truffle-testing.md)，但没有必要迁移你现有的测试用例。

#### 迁徙和 hardhat-truffle 固件

如果你的项目使用[Truffle Migrations](https://www.trufflesuite.com/docs/truffle/getting-started/running-migrations)来初始化你的测试环境(即测试调用`Contract.deployed()`)，那么要运行测试还需要做一些工作。

Truffle插件目前并不完全支持Migrations。相反，需要调整你的Migrations，使之成为一个Hardhat的 hardhat-truffle 固件。
这个文件位于`test/truffle-fixture.js`，部署你的合约并对每个你想测试的合约抽象调用`setAsDeployed()`方法。

例如，这个迁移：

```js
const Greeter = artifacts.require("Greeter");

module.exports = function(deployer) {
  deployer.deploy(Greeter);
};

```

应该会成为 hardhat-truffle 固件的方式：

```js
const Greeter = artifacts.require("Greeter");

module.exports = async () => {
  const greeter = await Greeter.new();
  Greeter.setAsDeployed(greeter);
}
```

这些固件将在Mocha的`before`上运行，它在每个`contract()`函数运行之前运行，就像Truffle迁移做的那样。


如果你有多个迁移，你不需要创建多个hardhat-truffle 固件文件。 你可以从同一份文件中部署所有的合约。

一旦为你的迁移编写了Hardhat-truffle固件并完成了设置，你就可以运行你的测试了。
使用`npx hardhat test`。 查看[Truffle测试指南](/guides/truffle-testing.md)，了解更多关于在Hardhat上使用的Truffle的信息。


### 部署

说到部署，目前还没有实现Hardhat部署系统的插件，这有一些想法[的公开Issue](https://github.com/nomiclabs/hardhat/issues/381)，我们希望你能提出意见，如何最好地设计它。


### Truffle 4和Web3.js的同步调用

Truffle 4 使用Web3.js`0.20.x`，支持做同步调用。
这些都是`hardhat-web3-legacy`插件（集成Web3.js`0.20.x`的插件）不支持的。


相反，你应该使用Web3.js提供的promisified版本 `pweb3`。 它会作为一个测试和任务中的全局可用的变量，并可在[Hardhat Runtime Environment](.../advanced/hardhat-runtime-environment.md)中使用。
它的API与Web3.js相同，但异步操作会返回promises。


例如，这段代码:

```js
console.log(web3.eth.accounts)
```

应成为:

```js
console.log(await web3.eth.getAccounts())
```


如果你有任何帮助或反馈，你可以在[Hardhat Support Discord服务器](https://hardhat.org/discord)找到我们。
