# 使用Web3.js和Truffle进行测试

Hardhat允许你使用Truffle来测试你的智能合约。 这主要因为兼容[`@truffle/contract`](https://www.npmjs.com/package/@truffle/contract)包与智能合约进行交互。

Truffle 4和Truffle 5分别使用`@nomiclabs/hardhat-truffle4`和`@nomiclabs/hardhat-truffle5`插件支持。 都能与Solidity 4+配合使用。

让我们来看看如何做到创建一个新的Hardhat项目。


运行这些开始:

```
mkdir my-project
cd my-project
npm init --yes
npm install --save-dev hardhat
```

现在在你的项目文件夹中运行`npx hardhat`并选择`创建一个空的hardhat.config.js`。

现在让我们安装`Truffle`和`Web3.js`插件，以及`web3.js`本身。


```
npm install --save-dev @nomiclabs/hardhat-truffle5 @nomiclabs/hardhat-web3 web3
```

在你的Hardhat配置文件中引入并启用Truffle 5插件：

```js{1}
require("@nomiclabs/hardhat-truffle5");

module.exports = {
  solidity: "0.7.3"
};
```

在项目中创建一个名为 `contracts`的文件夹。 添加一个名为`Greeter.sol`的文件，复制并粘贴下面的代码：

```solidity
pragma solidity ^0.7.0;

contract Greeter {

    string greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }

}
```

## 编写测试

在项目根目录下新建一个名为 `test`的目录，并创建一个名为 `Greeter.js`的新文件。

我们先来看看下面的代码。 稍后将在下一步解释它，但现在只把代码粘贴到`Greeter.js`中：

```js
const Greeter = artifacts.require("Greeter");

// 传统的 Truffle 测试
contract("Greeter", accounts => {
  it("Should return the new greeting once it's changed", async function() {
    const greeter = await Greeter.new("Hello, world!");
    assert.equal(await greeter.greet(), "Hello, world!");

    await greeter.setGreeting("Hola, mundo!");

    assert.equal(await greeter.greet(), "Hola, mundo!");
  });
});

// Vanilla Mocha 测试，集成Mocha工具增强了兼容性
describe("Greeter contract", function() {
  let accounts;

  before(async function() {
    accounts = await web3.eth.getAccounts();
  });

  describe("Deployment", function() {
    it("Should deploy with the right greeting", async function() {
      const greeter = await Greeter.new("Hello, world!");
      assert.equal(await greeter.greet(), "Hello, world!");

      const greeter2 = await Greeter.new("Hola, mundo!");
      assert.equal(await greeter2.greet(), "Hola, mundo!");
    });
  });
});
```

正如你在第一行中所看到的，artifacts对象存在于全局作用域中，你可以使用它来访问Truffle合约抽象。


```js
const Greeter = artifacts.require("Greeter");
````

这个例子显示了两种测试方法：

- 使用 `contract()`，这是Truffle的传统测试方法。
- 使用 `describe()`， 这是使用Mocha进行测试的传统方式。

Truffle用Mocha来运行测试，但一些集成Mocha的工具并不兼容 `contract()`，因此不总是能很好地工作。 我们建议使用`describe()`方法。


你可以通过运行`npx hardhat test`来运行这些测试。:
```
$ npx hardhat test

Contract: Greeter
    ✓ Should return the new greeting once it's changed (265ms)

  Greeter contract
    Deployment
      ✓ Should deploy with the right greeting (114ms)


  2 passing (398ms)
```

如果你想使用Truffle Migrations来初始化你的测试，并在合约抽象上调用`deployed()`，`@nomiclabs/hardhat-truffle4`和`@nomiclabs/hardhat-truffle5`都提供了附加固件功能来实现它。 请看[Truffle迁移指南](./truffle-migration.md)了解更多。


## 使用Web3.js

要在测试中使用Web3.js，它的一个实例在全局范围内是可用的。 你可以在`sample-test.js`中的`describe()`测试中看到这一点：


```js{20}
const Greeter = artifacts.require("Greeter");

// Traditional Truffle test
contract("Greeter", accounts => {
  it("Should return the new greeting once it's changed", async function() {
    const greeter = await Greeter.new("Hello, world!");
    assert.equal(await greeter.greet(), "Hello, world!");

    await greeter.setGreeting("Hola, mundo!");

    assert.equal(await greeter.greet(), "Hola, mundo!");
  });
});

// Vanilla Mocha test. Increased compatibility with tools that integrate Mocha.
describe("Greeter contract", function() {
  let accounts;

  before(async function() {
    accounts = await web3.eth.getAccounts();
  });

  describe("Deployment", function() {
    it("Should deploy with the right greeting", async function() {
      const greeter = await Greeter.new("Hello, world!");
      assert.equal(await greeter.greet(), "Hello, world!");

      const greeter2 = await Greeter.new("Hola, mundo!");
      assert.equal(await greeter2.greet(), "Hola, mundo!");
    });
  });
});
```

查看该插件的 [README file](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-truffle5) f以获取更多相关信息。


[Hardhat Runtime Environment]: /documentation/#hardhat-runtime-environment-hre

