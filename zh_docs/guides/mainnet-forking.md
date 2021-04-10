# Fork 主网

你可以启动一个Fork主网的Hardhat Network实例。 Fork主网意思是模拟具有与主网相同的状态的网络，但它将作为本地开发网络工作。 这样你就可以与部署的协议进行交互，并在本地测试复杂的交互。

要使用此功能，你需要连接到存档节点。 建议使用[Alchemy]。


## 从主网进行Fork

最简单的方法是通过命令行来启动一个节点来尝试这个功能：


```
npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/<key>
```

你也可以将Hardhat Network配置为总是进行 fork ：


```js
networks: {
  hardhat: {
    forking: {
      url: "https://eth-mainnet.alchemyapi.io/v2/<key>"
    }
  }
}
```

通过访问主网上存在的任何状态，Hardhat Network将拉取数据并透明地暴露它，就像使用本地数据一样。


## 锁定（Pinning）区块

Hardhat网络默认会从最新的主网区块进行Fork。 虽然根据环境，这可能是实用的，但我们建议从一个特定的块号Fork，以建立一个依赖于Fork的测试套件。

这么做有两个原因:

- 测试运行的状态可能会在运行之间发生变化。 这可能会导致你的测试或脚本有不同的表现。
- 锁定区块启用了缓存。 每次从主网获取数据时，Hardhat Network都会将其缓存在磁盘上，以加快未来的访问速度。 如果你不锁定区块，每一个新的块都会有新的数据，缓存就没有用了。 我们测算出，使用锁定区块后，速度可提高20倍。

这就是为什么我们推荐[Alchemy]的原因，因为他们的免费访问额度里包含了档案数据。

锁定区块号使用:

```js
networks: {
  hardhat: {
    forking: {
      url: "https://eth-mainnet.alchemyapi.io/v2/<key>",
      blockNumber: 11095000
    }
  }
}
```

如果你使用`node`任务，你也可以用`--fork-block-number`标志指定一个块号。


```
npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/<key> --fork-block-number 11095000
```

## 冒充账户

一旦你有了主网网络的本地实例，将它们设置在你的测试所需的特定状态下，就可能是下一步要做的。 为了方便，Hardhat Network允许你冒充特定账户和合约地址发送交易。


使用`hardhat_impersonateAccount`RPC方法，传递要冒充的地址作为参数，来冒充一个账户。

```tsx
await hre.network.provider.request({
  method: "hardhat_impersonateAccount",
  params: ["0x364d6D0333432C3Ac016Ca832fb8594A8cE43Ca6"]}
)
```

调用`hardhat_stopImpersonatingAccount`停止冒充:

```tsx
await hre.network.provider.request({
  method: "hardhat_stopImpersonatingAccount",
  params: ["0x364d6D0333432C3Ac016Ca832fb8594A8cE43Ca6"]}
)
```

如果你正在使用[`hardhat-ethers`](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-ethers)，调用`getSigner`来使用冒充账户。

```
const signer = await ethers.provider.getSigner("0x364d6D0333432C3Ac016Ca832fb8594A8cE43Ca6")
signer.sendTransaction(...)
```

## 重置Fork

你可以在运行时里操作Fork，如重置回全新的Fork状态、从另一个区块号Fork，或者通过调用`hardhat_reset`禁用Fork:


```ts
await network.provider.request({
  method: "hardhat_reset",
  params: [{
    forking: {
      jsonRpcUrl: "https://eth-mainnet.alchemyapi.io/v2/<key>",
      blockNumber: 11095000
    }
  }]
})
```

你可以通过传递空参数来禁用Fork:

```ts
await network.provider.request({
  method: "hardhat_reset",
  params: []
})
```

这将重置Hardhat Network，在[这里](../hardhat-network/README.md#hardhat-network-initial-state)描述的状态下启动一个新的实例。

This will reset Hardhat Network, starting a new instance in the state described [here](../hardhat-network/README.md#hardhat-network-initial-state).

## 故障排除

### "Project ID does not have access to archive state"

在没有存档插件的情况下使用Infura，你只能在最近的区块中访问区块链的状态。 为了避免这个问题，你可以使用本地归档节点，或者像[Alchemy]这样提供归档数据的服务。


[Alchemy]: https://alchemyapi.io/?r=7d60e34c-b30a-4ffa-89d4-3c4efea4e14b
