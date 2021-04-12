# 使用Ganache运行测试

我们建议使用内置的[Hardhat网络](../hardhat-network/README.md)网络来测试
智能合约，因为它会生成[JavaScript绑定和Solidity堆栈记录](../hardhat-network/README.md#solidity-stack-traces)使得调试更加容易。

如果你依旧想使用Ganache来运行测试，可以通过两种方式来实现。


## 手动运行Ganache

要使用Ganache，你其实不需要做任何特别的事情，只要启动Ganache并使用如下命令运行Hardhat：


```
npx hardhat --network localhost test
```

## 使用 `hardhat-ganache` 插件

如果你不想每次都手动启动和停止Ganache，你可以使用 `hardhat-ganache` 插件.

该插件创建了一个名为 `ganache` 的网络，并自动在运行测试和脚本之前和之后启动和停止Ganache。

要使用它，你必须用`npm`安装它：


```
npm install --save-dev @nomiclabs/hardhat-ganache
```

并在你的`hardhat.config.js`的开头添加这行：


```js
require("@nomiclabs/hardhat-ganache");
```

最后，你可以用进行测试
 
```
npx hardhat --network ganache test
```
