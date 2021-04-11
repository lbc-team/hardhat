# 使用Hardhat控制台

Hardhat内置了一个交互式JavaScript控制台。 你可以通过运行`npx hardhat console`来使用它:

```
$ npx hardhat console
All contracts have already been compiled, skipping compilation.
>
```

`compile`任务将在打开控制台提示符之前被调用，但你可以用 `no-compile` 参数跳过编译。

控制台的执行环境与任务的执行环境相同。 意味着配置已被处理，[Hardhat运行时环境]已被初始化并注入全局作用域。 例如，可以在全局范围内访问`config`对象：


```
> config
{ defaultNetwork: 'hardhat',
  solc:
   { version: '0.5.8', optimizer: { enabled: false, runs: 200 } },
  
  ...
 
}
>
```

如果你使用`hardhat-ethers`插件，则会初始化`ethers`对象：

```
> ethers
{ provider:
   EthersProviderWrapper {
       
  ...

  },
  getContract: [AsyncFunction: getContract],
  signers: [AsyncFunction: signers] }
>
```

如果你使用的了`hardhat-truffle5`插件，那么`artifacts`对象也会初始化。


任何已经注入[Hardhat运行时环境]的内容都会神奇地在全局范围内可用，如果你是那种比较明确的开发者，也可以明确引入HRE，并获得自动补全：


TODO-HH: 重新运行：

```
> const hardhat = require("hardhat")
undefined
> hardhat.
hardhat.__defineGetter__      hardhat.__defineSetter__      hardhat.__lookupGetter__      hardhat.__lookupSetter__      hardhat.__proto__
hardhat.hasOwnProperty        hardhat.isPrototypeOf         hardhat.propertyIsEnumerable  hardhat.toLocaleString        hardhat.toString
hardhat.valueOf

hardhat._runTaskDefinition    hardhat.constructor           hardhat.injectToGlobal

hardhat._extenders            hardhat.hardhatArguments      hardhat.config                hardhat.ethereum              hardhat.ethers
hardhat.network               hardhat.run                   hardhat.tasks

>
```

你还会注意到，控制台具有方便的历史记录功能（大多数交互式终端也具有），即使跨不同会话，你可以试试按上方向键。


### 异步操作和顶层设计的await

与以太坊网络和智能合约的交互是异步操作，因此大多数API和库是使用JavaScript的`Promise`来作为返回值。

为了更方便，Hardhat的控制台支持在顶层直接使用 `await` （例如：`console.log(await web3.eth.getBalance()`）。 要使用此功能，需要使用Node 10或更高版本。


如果你有任何帮助或反馈，你可以在[Hardhat Support Discord服务器](https://hardhat.org/discord)找到我们。



[Hardhat运行时环境]: ../advanced/hardhat-runtime-environment.md
