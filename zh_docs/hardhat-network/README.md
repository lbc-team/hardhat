# Hardhat Network

Hardhat内置了Hardhat Network，这是一个为开发而设计的本地以太坊网络。它允许你部署合约，运行测试和调试代码。


## Hardhat Network是如何工作的？

- 它在收到每笔交易后，立即按顺序出块，没有任何延迟。
- 底层是基于 `@ethereumjs/vm` EVM 实现, 与ganache、Remix和Ethereum Studio 使用的相同EVM。
- 支持以下的硬分叉:
  - byzantium
  - constantinople
  - petersburg
  - istanbul
  - muirGlacier

## 如何使用它?

- 当 `defaultNetwork `为空或设置为 `hardhat `时，则Hardhat 默认在启动运行实例。
- 它以用来运行测试、以及在控制台、脚本和任务中使用它。
- 插件（ethers.js, web3.js, Waffle, Truffle等）会直接连接到其提供者。
- T不需要对你的测试或脚本做任何修改。
- 它只是另一个网络，它可以与`--network`一起使用。

## 从钱包和其他软件连接到Hardhat网络

Hardhat Network可以以独立的方式运行，以便外部客户端可以连接到它。这可以是MetaMask、Dapp前端，或一个脚本。要以这种方式运行Hardhat Network，请运行:

```
npx hardhat node
```

它将启动Hardhat Network，并作为一个公开的JSON-RPC和WebSocket服务器。

然后，只要将钱包或应用程序连接到`http://localhost:8545` 。

如果你想把Hardhat连接到这个节点，你只需要使用`--network localhost`来运行命令。


## Solidity 堆栈跟踪

Hardhat Network 拥有一流的Solidity支持。它总是知道哪些正在运行的智能合约，具体做什么，以及为什么失败。

如果一个交易或调用失败，Hardhat Network将抛出一个异常。
这个异常将组合 JavaScript 和 Solidity 栈追踪：从 JavaScript/TypeScript 开始的堆栈追踪，直到你
到合约的调用，并继续完整的 Solidity 调用堆栈。

这是一个使用 `TruffleContract` 的Hardhat Network异常的示例:



```
Error: Transaction reverted: function selector was not recognized and there's no fallback function
  at ERC721Mock.<unrecognized-selector> (contracts/mocks/ERC721Mock.sol:9)
  at ERC721Mock._checkOnERC721Received (contracts/token/ERC721/ERC721.sol:334)
  at ERC721Mock._safeTransferFrom (contracts/token/ERC721/ERC721.sol:196)
  at ERC721Mock.safeTransferFrom (contracts/token/ERC721/ERC721.sol:179)
  at ERC721Mock.safeTransferFrom (contracts/token/ERC721/ERC721.sol:162)
  at TruffleContract.safeTransferFrom (node_modules/@nomiclabs/truffle-contract/lib/execute.js:157:24)
  at Context.<anonymous> (test/token/ERC721/ERC721.behavior.js:321:26)
```

最后两行对应的是执行失败交易的JavaScript测试代码。
其余的是 Solidity 堆栈跟踪。
这样你就能清楚地知道为什么测试没有通过。


## 自动错误信息

Hardhat Network 总是知道你的交易或调用失败的原因，利用这些信息调试合约将更容易。

当一个交易无故失败时，Hardhat Network会在以下情况下创建一个明确的错误信息：

- 附加ETH调用一个非 payable 函数

- 发送ETH到一个没有可支付的回退或接收功能的合约上

- 在没有回退函数的情况下调用一个不存在的函数

- 用不正确的参数调用一个函数

- 调用一个没有返回正确参数数量的外部函数

- 在一个非合约账户上调用一个外部函数

- 由于外部调用的参数而无法执行（例如发送过多的ETH）。

- 没有使用 `DELEGATECALL` 调用库

- 不正确地调用预编译的合约

- 试图部署一个超过[EIP-170](https://eips.ethereum.org/EIPS/eip-170)规定的字节码大小限制的合约。

## `console.log`

Hardhat Network 允许在 Solidity 代码中调用 `console.log()` 来打印日志信息和合约变量。你可以在样本项目中看到一个例子。按照 [快速启动](/getting-started/README.md#快速开始) 中的步骤来尝试。

- call调用和交易中都可以使用`console.log`。它在 `view` 函数中工作，但在 `pure` 函数中不起作用。
- 无论调用或交易是失败还是成功，都可以进行打印。
- 要使用它，你需要导入 `hardhat/console.sol`.
- `console.log` 最多支持4 个参数，支持以下类型，顺序不限：
  - `uint`
  - `string`
  - `bool`
  - `address`
- 还有上述类型的单参数API，以及额外的`bytes`, `bytes1`...直到`bytes32`类型：
  - `console.logInt(int i)`
  - `console.logUint(uint i)`
  - `console.logString(string memory s)`
  - `console.logBool(bool b)`
  - `console.logAddress(address a)`
  - `console.logBytes(bytes memory b)`
  - `console.logBytes1(bytes1 b)`
  - `console.logBytes2(bytes2 b)`
  - ...
  - `console.logBytes32(bytes32 b)`

- `console.log` 实现了与Node.js的[`console.log`](https://nodejs.org/dist/latest-v12.x/docs/api/console.html#console_console_log_data_args)相同的格式化选项，后者使用了[`util.format`](https://nodejs.org/dist/latest-v12.x/docs/api/util.html#util_util_format_format_args)。
  - 例如: `console.log("Changing owner from %s to %s", currentOwner, newOwner)`
- 可以和任何库一起工作： ethers.js, web3.js, waffle, truffle-contract, 等等.
- `console.log` 是用标准的Solidity实现，然后在Hardhat Network中会检测到这些输出。这使得在任何其他工具也可以编译（如Remix、Waffle或Truffle）。
- `console.log` 调用也可以在其他网络中运行，例如mainnet、kovan、ropsten等，但在这些网络中不起作用，但会花费少量的Gas。

## 分叉主网

Hardhat网络默认是空的，除了一些有初始余额的账户。但有时，拥有一个模拟主网状态的本地网络会更有用，这就是主网forking的作用。

要分叉主网，你需要连接一个URL连接到主网节点。例如，使用Alchemy，你可以用这个命令启动一个本地节点来分叉主网:

```
npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/<key>
```

必须用你自己的Alchemy API密钥替换命令中的`<key>`。

完成之后，你可以在你的节点中做任何在Hardhat网络中做的事情：查看控制台日志，获得堆栈跟踪或使用默认账户来部署新的合约。

如果你想让这成为默认行为，你可以通过修改Hardhat配置来做到这一点：

```js
networks: {
  hardhat: {
    forking: {
      url: "https://eth-mainnet.alchemyapi.io/v2/<key>"
    }
  }
}
```

在此配置下，如果你执行一个使用Hardhat网络的任务，该任务将启动一个分叉的节点并在其上运行。

你还可以用分叉的Hardhat网络做其他事情，请查看[指南](../guides/mainnet-forking.md)以了解更多。


## 挖矿模式

Hardhat支持两种交易的挖矿模式：


- **Automine（自动）**: 发送的每笔交易都会自动包含在一个新的区块中。
  
- **Interval mining（间隔挖矿）**: 定期挖一个新区块，其中包括尽可能多的待处理交易。


你可以使用其中的一种，也可以两种都用，或者两种都不用。在默认情况下，只有自动模式被启用。


### 配置挖矿模式

你可以在Hardhat网络设置下配置挖矿模式：

```js
networks: {
  hardhat: {
    mining: {
      auto: false,
      interval: 5000
    }
  }
}
```

在这个例子中，禁用了自动挖矿，间隔挖矿被设置为每5秒产生一个新的区块每。 你也可以将间隔挖矿配置为在随机延迟后生成一个新的区块：


```js
networks: {
  hardhat: {
    mining: {
      auto: false,
      interval: [3000, 6000]
    }
  }
}
```

在这种情况下，一个新的区块将在3至6秒的随机延迟后被开采出来。
例如，第一个区块可能在4秒后被开采，第二个区块在5.5秒后被开采，以此类推。


### 手动挖矿

你可以这样禁用前两种挖矿模式：

```js
networks: {
  hardhat: {
    mining: {
      auto: false,
      interval: 0
    }
  }
}
```

这意味着Hardhat网络将不会开采新的区块，但你可以使用 `evm_mine` RPC 方法手动开采新区块。这将产生一个新区块，其中将包括尽可能多的待处理交易。


### Mempool 行为

当automine（自动挖矿）被禁用时，每一个发送的交易都会被添加到mempool中，mempool中包含了所有未来可以开采的交易。
Hardhat网络的mempool遵循与geth相同的规则，这意味着：

- Gas价格较高的交易会排在前面（先执行）
- 如果有两笔交易可以包括在内，而且两笔交易的Gas价格相同，那么先收到的那笔交易就先执行。
- 如果一个交易是无效的（例如，它的nonce低于发送它的地址的nonce
的nonce），则该交易被放弃。

你可以通过使用 pending 区块标签来获得将包括在下一个区块中的待处理交易列表：


```js
const pendingBlock = await network.provider.send("eth_getBlockByNumber", ["pending", false])
```

### 使用RPC方法配置挖矿模式

你可以使用两个RPC方法（`evm_setAutomine` 和 `evm_setIntervalMining`）在运行时改变挖矿模式。
例如，要禁用自动挖矿

```js
await network.provider.send("evm_setAutomine", [false])
```

并启用间隔挖矿：


```js
await network.provider.send("evm_setIntervalMining", [5000])
```

## 日志

Hardhat Network基于其跟踪基础设施提供丰富的日志记录，这将有助于开发和调试智能合约。

例如，一个成功的交易和一个失败的调用将看起来像这样：

```
eth_sendTransaction
  Contract deployment: Greeter
  Contract address: 0x8858eeb3dfffa017d4bce9801d340d36cf895ccf
  Transaction: 0x7ea2754e53f09508d42bd3074046f90595bedd61fcdf75a4764453454733add0
  From: 0xc783df8a850f42e7f7e57013759c285caa701eb6
  Value: 0 ETH
  Gas used: 568851 of 2844255
  Block: #2 - Hash: 0x4847b316b12170c576999183da927c2f2056aa7d8f49f6e87430e6654a56dab0

  console.log:
    Deploying a Greeter with greeting: Hello, world!

eth_call
  Contract call: Greeter#greet
  From: 0xc783df8a850f42e7f7e57013759c285caa701eb6

  Error: VM Exception while processing transaction: revert Not feeling like it
      at Greeter.greet (contracts/Greeter.sol:14)
      at process._tickCallback (internal/process/next_tick.js:68:7)
```

当使用Hardhat Network的节点（即`npx hardhat node`）时，默认启用日志功能，但当在进程中使用Hardhat Network提供者时，则禁用。
参见 [Hardhat Network's config](../config/README.md#hardhat-network) 以了解更多关于如何控制日志记录。


## Hardhat网络初始状态

Hardhat Network默认用此状态初始化：

- 一个全新的区块链，只是有创世区块。
- 220个账户，每个账户有10000个ETH，助记词为: `"test test test test test test test test test test test junk"`. 地址是:
  - `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
  - `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
  - `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
  - `0x90F79bf6EB2c4f870365E785982E1f101E93b906`
  - `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
  - `0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc`
  - `0x976EA74026E726554dB657fA54763abd0C3a0aa9`
  - `0x14dC79964da2C08b23698B3D3cc7Ca32193d9955`
  - `0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f`
  - `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`
  - `0xBcd4042DE499D14e55001CcbB24a551F3b954096`
  - `0x71bE63f3384f5fb98995898A86B02Fb2426c5788`
  - `0xFABB0ac9d68B0B445fB7357272Ff202C5651694a`
  - `0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec`
  - `0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097`
  - `0xcd3B766CCDd6AE721141F452C550Ca635964ce71`
  - `0x2546BcD3c84621e976D8185a91A922aE77ECEc30`
  - `0xbDA5747bFD65F08deb54cb465eB87D40e51B197E`
  - `0xdD2FD4581271e230360230F9337D5c0430Bf44C0`
  - `0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199`

若要定制，请看一下[配置部分](/config/README.md#hardhat-network)。

## JSON-RPC 支持的方法

### 支持的方法

- `eth_accounts`
- `eth_blockNumber`
- `eth_call`
- `eth_chainId`
- `eth_coinbase`
- `eth_estimateGas`
- `eth_gasPrice`
- `eth_getBalance`
- `eth_getBlockByHash`
- `eth_getBlockByNumber`
- `eth_getBlockTransactionCountByHash`
- `eth_getBlockTransactionCountByNumber`
- `eth_getCode`
- `eth_getFilterChanges`
- `eth_getFilterLogs`
- `eth_getLogs`
- `eth_getStorageAt`
- `eth_getTransactionByBlockHashAndIndex`
- `eth_getTransactionByBlockNumberAndIndex`
- `eth_getTransactionByHash`
- `eth_getTransactionCount`
- `eth_getTransactionReceipt`
- `eth_mining`
- `eth_newBlockFilter`
- `eth_newFilter`
- `eth_newPendingTransactionFilter`
- `eth_pendingTransactions`
- `eth_sendRawTransaction`
- `eth_sendTransaction`
- `eth_signTypedData`
- `eth_sign`
- `eth_subscribe`
- `eth_syncing`
- `eth_uninstallFilter`
- `eth_unsubscribe`
- `net_listening`
- `net_peerCount`
- `net_version`
- `web3_clientVersion`
- `web3_sha3`

#### Hardhat网络方法

- `hardhat_addCompilationResult` – 添加关于编译合约的信息
- `hardhat_impersonateAccount` – 参考 [Mainnet Forking guide](../guides/mainnet-forking.md)
- `hardhat_stopImpersonatingAccount` – 参考 [Mainnet Forking guide](../guides/mainnet-forking.md)
- `hardhat_reset` – 参考 [Mainnet Forking guide](../guides/mainnet-forking.md)
- `hardhat_setLoggingEnabled` – 启用或禁用Hardhat网络的日志记录

#### 用于测试和 Debug 的方法

- `evm_increaseTime` – 和 Ganache 里一样，增加区块时间。
- `evm_mine` – 和 Ganache 里一样，出块。
- `evm_revert` – 和 Ganache 里一样。
- `evm_snapshot` – 和 Ganache 里一样，快照区块。
- `evm_setNextBlockTimestamp` - 类似 `evm_increaseTime`, 但是在下一个区块里使用准确的时间戳出块。

### 不支持的方法

- `eth_compileLLL`
- `eth_compileSerpent`
- `eth_compileSolidity`
- `eth_getCompilers`
- `eth_getProof`
- `eth_getUncleByBlockHashAndIndex`
- `eth_getUncleByBlockNumberAndIndex`
- `eth_getUncleCountByBlockHash`
- `eth_getUncleCountByBlockNumber`
- `eth_getWork`
- `eth_hashrate`
- `eth_protocolVersion`
- `eth_signTransaction`
- `eth_submitHashrate`
- `eth_submitWork`

## 限制

### 支持的 Solidity 版本

Hardhat Network可以运行任何智能合约，但它只理解Solidity 0.5.1和更新的版本。

如果你用旧版本的 Solidity 编译，或使用其他语言，你可以使用 Hardhat Network，但Solidity 堆栈跟踪将不会生效。


### Solidity 优化器支持

Hardhat Network可以与经过编译优化的智能合约一起工作。
但这可能会导致堆栈跟踪的行数有些偏差。

我们建议在测试和调试合约时，在没有优化的情况下编译合约。
