# 5. 测试合约

为智能合约编写自动化测试至关重要，因为事关用户资金。 为此，我们将使用**Hardhat Network**，这是一个内置的以太坊网络，专门为开发设计，并且是**Hardhat**中的默认网络。 无需进行任何设置即可使用它。 在我们的测试中，我们将使用[ethers.js](https://learnblockchain.cn/ethers_v5/)与前面构建的合约进行交互，并使用 [Mocha](https://mochajs.org/) 作为测试运行器。 

## 编写测试用例

在项目根目录中创建一个名为`test`的新目录，并创建一个名为`Token.js`的新文件。

让我们从下面的代码开始。 在后面我们将对其进行解释，但现在将其粘贴到`Token.js`中：

```js
const { expect } = require("chai");

describe("Token contract", function() {
  it("Deployment should assign the total supply of tokens to the owner", async function() {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});

```

在终端上运行`npx hardhat test`。 你应该看到以下输出：

```
$ npx hardhat test

  Token contract
    ✓ Deployment should assign the total supply of tokens to the owner (654ms)


  1 passing (663ms)
```

这意味着测试通过了。 现在我们逐行解释一下：

```js
const [owner] = await ethers.getSigners();
```

ethers.js中的`Signer` 代表以太坊账户对象。 它用于将交易发送到合约和其他帐户。 在这里，我们获得了所连接节点中的帐户列表，在本例中节点为**Hardhat Network**，并且仅保留第一个帐户。

`ethers`变量在全局作用域下都可用。 如果你希望代码更明确，则可以在顶部添加以下这一行：

```js
const { ethers } = require("hardhat");
```

::: tip
提示：要了解有关`Signer`的更多信息，可以查看[Signers文档](https://learnblockchain.cn/ethers_v5/api/signer/).
:::

```js
const Token = await ethers.getContractFactory("Token");
```

ethers.js中的`ContractFactory`是用于部署新智能合约的抽象，因此此处的`Token`是用来实例代币合约的工厂。

```js
const hardhatToken = await Token.deploy();
```

在`ContractFactory`上调用`deploy()`将启动部署，并返回解析为`Contract`的`Promise`。 该对象包含了智能合约所有函数的方法。

```js
const ownerBalance = await hardhatToken.balanceOf(owner.address);
```

部署合约后，我们可以在`hardhatToken` 上调用合约方法，通过调用`balanceOf()`来获取所有者帐户的余额。

请记住，部署合约的帐户获得了全部代币，在使用 `hardhat-ethers` 插件时，默认情况下， `ContractFactory`和`Contract`实例连接到第一个签名者。 这意味着`owner`变量中的帐户执行了部署，而`balanceOf()`应该返回全部发行量。

```js
expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
```

在这里，再次使用 `Contract` 实例调用Solidity代码中合约函数。 `totalSupply()` 返回代币的发行量，我们检查它是否等于`ownerBalance`。


判断相等，我们使用[Chai](https://www.chaijs.com/)，这是一个断言库。 这些断言函数称为“匹配器”，在此实际上使用的“匹配器”来自[Hardhat Chai Matchers](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-chai-matchers)。 它扩展了Chai，为测试智能合约提供了许多有用的匹配器。


### 使用不同的账号

如果你需要从默认帐户以外的其他帐户(或ethers.js 中的 `Signer`)发送交易来测试代码，则可以在ethers.js的`Contract`中使用`connect()`方法来将其连接到其他帐户，像这样：

```js{18}
const { expect } = require("chai");

describe("Transactions", function () {

  it("Should transfer tokens between accounts", async function() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy();
   
    // Transfer 50 tokens from owner to addr1
    await hardhatToken.transfer(addr1.address, 50);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
    
    // Transfer 50 tokens from addr1 to addr2
    await hardhatToken.connect(addr1).transfer(addr2.address, 50);
    expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
  });
});
```

### 使用fixture重用公共测试设置


在更复杂的项目中，这种设置可能涉及多个部署和其他事务。在每个测试中这样做意味着大量的代码重复。此外，在每个测试开始时执行许多事务会使测试套件变得更慢。

你可以通过使用固定程序（fixtures）来避免代码重复并提高测试套件的性能。fixture是一个设置函数，只在第一次调用时运行。在随后的调用中，Hardhat将把网络的状态重置为fixture最初执行后的状态，而不是重新运行它。

```
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Token contract", function () {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory("Token");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Token, hardhatToken, owner, addr1, addr2 };
  }

  it("Should assign the total supply of tokens to the owner", async function () {
    const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    // Transfer 50 tokens from owner to addr1
    await expect(
      hardhatToken.transfer(addr1.address, 50)
    ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

    // Transfer 50 tokens from addr1 to addr2
    // We use .connect(signer) to send a transaction from another account
    await expect(
      hardhatToken.connect(addr1).transfer(addr2.address, 50)
    ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
  });
});
```

在这里，我们写了一个`deployTokenFixture`函数，它做了必要的设置，并返回我们以后在测试中使用的每个值。然后在每个测试中，我们使用`loadFixture`来运行fixture并获得这些值。loadFixture将在第一次运行设置，并在其他测试中快速返回到该状态。


### 完整覆盖测试

我们已经介绍了测试合约所需的基础知识，以下是代币的完整测试用例，其中包含有关Mocha以及如何构组织测试的许多信息。 我们建议你通读。

```js
// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("Token contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the ContractFactory and Signers here.
    const Token = await ethers.getContractFactory("Token");
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens once its transaction has been
    // mined.
    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Token, hardhatToken, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Transfer 50 tokens from owner to addr1
      await expect(
        hardhatToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        hardhatToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    });

    it("Should emit Transfer events", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(hardhatToken.transfer(addr1.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner.
      // `require` will evaluate false and revert the transaction.
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});
```


这是 `npx hardhat test` 的输出， 结果类似这样：
```
$ npx hardhat test

  Token contract
    Deployment
      ✓ Should set the right owner
      ✓ Should assign the total supply of tokens to the owner
    Transactions
      ✓ Should transfer tokens between accounts (199ms)
      ✓ Should fail if sender doesn’t have enough tokens
      ✓ Should update balances after transfers (111ms)


  5 passing (1s)
```

请记住，当你运行`npx hardhat test`时，如果合约在上次运行测试后发生了修改，则会对其进行重新编译。
