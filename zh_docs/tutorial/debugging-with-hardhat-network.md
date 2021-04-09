# 6. 用 Hardhat Network 调试

**Hardhat**内置了**Hardhat Network **，这是一个专为开发而设计的以太坊网络。 它允许你部署合约，运行测试和调试代码。 这是**Hardhat**所连接的默认网络，因此你无需进行任何设置即可工作。 你只需运行测试就好。

## Solidity `console.log`
在**Hardhat Network**上运行合约和测试时，你可以在Solidity代码中调用`console.log()`打印日志信息和合约变量。 你必须先从合约代码中导入**Hardhat **的`console.log`再使用它。

像这样：

```solidity{3}
pragma solidity ^0.6.0;

import "hardhat/console.sol";

contract Token {
  //...
}
```

就像在JavaScript中使用一样，将一些`console.log`添加到`transfer()`函数中：

```solidity{2,3}
function transfer(address to, uint256 amount) external {
    console.log("Sender balance is %s tokens", balances[msg.sender]);
    console.log("Trying to send %s tokens to %s", amount, to);

    require(balances[msg.sender] >= amount, "Not enough tokens");

    balances[msg.sender] -= amount;
    balances[to] += amount;
}
```

运行测试时，将输出日志记录：

```{8-11,14-17}
$ npx hardhat test

  Token contract
    Deployment
      ✓ Should set the right owner
      ✓ Should assign the total supply of tokens to the owner
    Transactions
Sender balance is 1000 tokens
Trying to send 50 tokens to 0xead9c93b79ae7c1591b1fb5323bd777e86e150d4
Sender balance is 50 tokens
Trying to send 50 tokens to 0xe5904695748fe4a84b40b3fc79de2277660bd1d3
      ✓ Should transfer tokens between accounts (373ms)
      ✓ Should fail if sender doesn’t have enough tokens
Sender balance is 1000 tokens
Trying to send 100 tokens to 0xead9c93b79ae7c1591b1fb5323bd777e86e150d4
Sender balance is 900 tokens
Trying to send 100 tokens to 0xe5904695748fe4a84b40b3fc79de2277660bd1d3
      ✓ Should update balances after transfers (187ms)


  5 passing (2s)
```
请查看[文档](/hardhat-network/README.md#console-log) 以了解有关此功能的更多信息。
