# 6. 用 Hardhat Network 调试

**Hardhat** 内置了 **Hardhat Network**，这是一个专为开发而设计的以太坊网络。 它允许你部署合约，运行测试和调试代码。 这是**Hardhat**所连接的默认网络，因此你无需进行任何设置即可工作。 你只需运行测试就好。

## Solidity `console.log`

在**Hardhat Network**上运行合约和测试时，你可以在Solidity代码中调用`console.log()`打印日志信息和合约变量。 你必须先从合约代码中导入**Hardhat **的`console.log`再使用它。

像这样：

```solidity{3}
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Token {
  //...
}
```

就像在JavaScript中使用一样，将一些`console.log`添加到`transfer()`函数中：

```solidity{4-9}
function transfer(address to, uint256 amount) external {
    require(balances[msg.sender] >= amount, "Not enough tokens");

    console.log(
        "Transferring from %s to %s %s tokens",
        msg.sender,
        to,
        amount
    );

    balances[msg.sender] -= amount;
    balances[to] += amount;

    emit Transfer(msg.sender, to, amount);
}
```

运行测试时，将输出日志记录：

```markup{8-11,14-17}
$ npx hardhat test

  Token contract
    Deployment
      ✓ Should set the right owner
      ✓ Should assign the total supply of tokens to the owner
    Transactions
Transferring from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 to 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 50 tokens
Transferring from 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 to 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc 50 tokens
      ✓ Should transfer tokens between accounts (373ms)
      ✓ Should fail if sender doesn’t have enough tokens
Transferring from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 to 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 50 tokens
Transferring from 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 to 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc 50 tokens
      ✓ Should update balances after transfers (187ms)


  5 passing (2s)
```

请查看[文档](/hardhat-network/README.md#console-log) 以了解有关此功能的更多信息。
