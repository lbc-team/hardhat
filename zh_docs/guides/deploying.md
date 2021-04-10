# 部署合约


谈到部署，现在还没有插件为Hardhat实现系统，这有
[一个开放的 Issue](https://github.com/nomiclabs/hardhat/issues/381)收集了一些想法，我们会重视你的意见，如何最好地设计它。

在此期间，我们建议使用脚本。 你可以从示例项目中通过类似`scripts/deploy.js`的部署脚本来部署`Greeter`合约。


```js
async function main() {
  // 获得将要部署的合约
  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  console.log("Greeter deployed to:", greeter.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

你可以按照以下步骤在`localhost`网络中进行部署：

1. 启动[本地节点](../getting-started/#connecting-a-wallet-or-dapp-to-hardhat-network)

    `npx hardhat node`

2. 打开一个新的终端，在`localhost`网络中部署智能合约

    `npx hardhat run --network localhost scripts/deploy.js`

一般来说，你可以针对在`hardhat.config.js`中配置的任何网络

`npx hardhat run --network <your-network> scripts/deploy.js`


### Truffle迁移支持


如果你想使用Truffle的迁移系统，你可以和Truffle一起使用Hardhat。
用Hardhat写的合约可以和Truffle一起工作。

你需要做的就是安装Truffle，然后按照他们的[迁移指南](https://www.trufflesuite.com/docs/truffle/getting-started/running-migrations) 部署合约就可以。

