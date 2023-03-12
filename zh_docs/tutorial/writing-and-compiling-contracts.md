# 4. 编写和编译合约

我们创建一个简单的智能合约，合约实现代币转让。 代币合约最常用于兑换或价值存储。 这里，我们不深入讨论合约的Solidity代码，但是一些实现逻辑你需要知道：

- 代币有固定发行总量。
- 所有发行总量都分配给了部署合约的地址。
- 任何人都可以接收代币。
- 任何人拥有代币的人都可以转让代币。
- 代币不可分割。 你可以转让1、2、3或37个代币，但不能转让2.5个代币。

::: tip
你可能听说过[ERC20](https://learnblockchain.cn/tags/ERC20)，它是以太坊中的代币标准。 DAI，USDC，MKR和ZRX之类的代币都遵循ERC20标准，使这些代币都可以与任何能处理ERC20代币的软件兼容。 **为了简单起见，我们要构建的代币不是ERC20**。
:::

## 编写合约

首先创建一个名为 `contracts` 的新目录，然后在目录内创建一个名为`Token.sol`的文件。

将下面的代码粘贴到文件中，花一点时间阅读代码。 它很简单，并且有很多解释[Solidity基础语法](https://learnblockchain.cn/docs/solidity/)的注释。

::: tip
在文本编辑器中添加相应的插件(搜索Solidity 或 Ethereum 插件)可以支持Solidity语法高亮，我们建议使用Visual Studio Code或Sublime Text 3。
:::

```solidity
// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;


// This is the main building block for smart contracts.
contract Token {
    // Some string type variables to identify the token.
    // The `public` modifier makes a variable readable from outside the contract.
    string public name = "My Hardhat Token";
    string public symbol = "MBT";

    // 固定发行量，保存在一个无符号整型里
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    /**
     * 合约构造函数
     *
     * The `constructor` is executed only once when the contract is created.
     */
    constructor() {
        // The totalSupply is assigned to transaction sender, which is the account
        // that is deploying the contract.
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    /**
     * 代币转账.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function transfer(address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // Transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    /**
     * 返回账号的代币余额，只读函数。
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
```

::: tip
`*.sol` 是 Solidity 合约文件的后缀。 我们建议将文件名与其包含的合约名一致，这是一种常见的做法。
:::

## 编译合约

要编译合约，请在终端中运行 `npx hardhat compile` 。 `compile`任务是内置任务之一。

```
$ npx hardhat compile
Compiling 1 file with 0.8.9
Compilation finished successfully
```

合约已成功编译了。
