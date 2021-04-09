# 7. 部署到真实网络
准备好与其他人分享dApp后，你可能要做的就是将其部署到真实的以太坊网络中。 这样，其他人可以访问不在本地系统上运行的实例。

具有真实价值的以太坊网络被称为“主网”，然后还有一些不具有真实价值但能够很好地模拟主网的网络，它可以被其他人共享阶段的环境。 这些被称为“测试网”，以太坊有多个测试网：*Ropsten*，*Kovan*，*Rinkeby*和*Goerli*。 我们建议你将合约部署到*Ropsten*测试网。

在应用软件层，部署到测试网与部署到主网相同。 唯一的区别是你连接到哪个网络。 让我们研究一下使用ethers.js部署合约的代码是什么样的。

主要概念是`Signer`，`ContractFactory`和`Contract`，我们在[测试][testing](testing-contracts.md) 部分中对此进行了解释。与测试相比，并没有什么新的内容，因为当在测试合约时，实际上是在向开发网络进行部署。 因此代码非常相似或相同。

让我们在项目根目录的目录下创建一个新的目录`scripts`，并将以下内容粘贴到 `deploy.js`文件中：

```js
async function main() {

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

为了在运行任何任务时指示**Hardhat**连接到特定的以太坊网络，可以使用`--network`参数。 像这样：

```
npx hardhat run scripts/deploy.js --network <network-name>
```

在这种情况下，如果不使用`--network` 参数来运行它，则代码将再次部署在**Hardhat network **上，因此，当**Hardhat** network 关闭后，部署实际上会丢失，但是它用来测试我们的部署代码时仍然有用：

```
$ npx hardhat run scripts/deploy.js
Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance: 10000000000000000000000
Token address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## 部署到远程网络

要部署到诸如主网或任何测试网之类的线上网络，你需要在`hardhat.config.js` 文件中添加一个`network`条目。 在此示例中，我们将使用Ropsten，但你可以类似地添加其他网络：

```js{5,11,15-20}
require("@nomiclabs/hardhat-waffle");

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "KEY";

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const ROPSTEN_PRIVATE_KEY = "YOUR ROPSTEN PRIVATE KEY";

module.exports = {
  solidity: "0.7.3",
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${ROPSTEN_PRIVATE_KEY}`]
    }
  }
};
```

我们使用了 [Alchemy](https://alchemyapi.io/?r=7d60e34c-b30a-4ffa-89d4-3c4efea4e14b), 但是你将url指向其他任何以太坊节点或网关都是可以。请填入你自己的 `ALCHEMY_API_KEY` 。

要在Ropsten上进行部署，你需要将ropsten-ETH发送到将要进行部署的地址中。 你可以从水龙头（免费分发测试使用的ETH服务）获得一些用于测试网的ETH。 [这是Ropsten的一个水龙头](https://faucet.metamask.io/)，你必须在进行交易之前将Metamask的网络更改为Ropsten。

::: tip
你可以通过以下链接为其他测试网获取一些ETH

* [Kovan faucet](https://faucet.kovan.network/)
* [Rinkeby faucet](https://faucet.rinkeby.io/)
* [Goerli faucet](https://goerli-faucet.slock.it/)
:::

最后运行：
```
npx hardhat run scripts/deploy.js --network ropsten
```

如果一切顺利，你应该看到已部署的合约地址。

