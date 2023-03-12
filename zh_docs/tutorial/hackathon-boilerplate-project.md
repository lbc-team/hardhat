# Hardhat 前端模板

如果要快速开始使用dApp或使用前端查看整个项目，可以使用我们的[hackathon模板库](https://github.com/NomicFoundation/hardhat-boilerplate)。

代码：https://github.com/NomicFoundation/hardhat-boilerplate

##  前端模板哪些内容有

- 本中使用的Solidity合约
- 使用ethers.js和Waffle的测试用例
- 使用ethers.js与合约进行交互的最小前端

### Solidity 合约与测试

在项目仓库的根目录中，你会发现本文的`Token`合约已经放在里面，回顾一下，他实现的内容：

- 代币有固定发行总量。
- 所有发行总量都分配给了部署合约的地址。
- 任何人都可以接收代币。
- 任何人拥有代币的人都可以转让代币。
- 代币不可分割。 你可以转让1、2、3或37个代币，但不能转让2.5个代币。


### 前端

在 `frontend/` 下你会发现一个简单的前端应用，它允许用户执行以下两项操作：

- 查看已连接钱包的账户余额
- 转账代币

这是一个单独的npm项目，是使用 `create-react-app` 创建的，这意味着它使用了webpack和babel。

### 前端文件目录结构

- `src/` 包含了所有代码
  - `src/components` 包含了 react 组件。
    - `Dapp.js` 是唯一具有业务逻辑的文件。 如果用作模板使用，请在此处用自己的代码替换它。
    - 其他组件仅渲染HTML，没有逻辑
    - `src/contracts` 具有合约的ABI和地址，这些由部署脚本自动生成。

## 如何使用它

首先克隆代码库，然后部署合约：

```
cd hardhat-hackathon-boilerplate/
npm install
npx hardhat node
```

在这里，我们仅需要安装npm项目的依赖项，然后运行`npx hardhat node`启动一个可以供MetaMask连接的**Hardhat 网络**。 在同一目录下的另一个终端中运行：

```
npx hardhat --network localhost run scripts/deploy.js
```

这会将合约部署到**Hardhat 网络**。 完成此运行后：

```
cd frontend
npm install
npm run start
```

启动react Web应用后，在浏览器中打开[http://localhost:3000/](http://localhost:3000/)，你应该看到以下内容：


![img](https://img.learnblockchain.cn/pics/20200811150131.png)
 
在MetaMask中将你的网络设置为`localhost:8545`，然后单击“Connect Wallet”按钮。 然后，你应该看到以下内容：

![img](https://img.learnblockchain.cn/pics/20200811150224.png)

前端代码正在检测到当前钱包余额为“ 0”，因此你将无法使用转账功能。运行：

```
npx hardhat --network localhost faucet <your address>
```

这运行的是自定义**Hardhat**任务（faucet），该任务使用部署帐户的余额向你的地址发送100 MBT和1 ETH。 之后你就可以将代币发送到另一个地址。


你可以在[`/tasks/faucet.js`](https://github.com/nomiclabs/hardhat-hackathon-boilerplate/blob/master/tasks/faucet.js)中查看任务的代码， 它需要在`hardhat.config.js`引入。

```
$ npx hardhat --network localhost faucet 0x0987a41e73e69f60c5071ce3c8f7e730f9a60f90
Transferred 1 ETH and 100 tokens to 0x0987a41e73e69f60c5071ce3c8f7e730f9a60f90
```

在运行`npx hardhat node`的终端中，你还应该看到：

```{10-11}
eth_sendTransaction
  Contract call:       Token#transfer
  Transaction:         0x460526d98b86f7886cd0f218d6618c96d27de7c745462ff8141973253e89b7d4
  From:                0xc783df8a850f42e7f7e57013759c285caa701eb6
  To:                  0x7c2c195cd6d34b8f845992d380aadb2730bb9c6f
  Value:               0 ETH
  Gas used:            37098 of 185490
  Block #8:            0x6b6cd29029b31f30158bfbd12faf2c4ac4263068fd12b6130f5655e70d1bc257

  console.log:
    Transferring from 0xc783df8a850f42e7f7e57013759c285caa701eb6 to 0x0987a41e73e69f60c5071ce3c8f7e730f9a60f90 100 tokens
```

上面显示了合约中`transfer()`函数的`console.log`输出，这是运行水龙头任务后Web应用的界面：

![front-6](https://img.learnblockchain.cn/pics/20200811151458.png)


试着去阅读这份代码。 里面有很多注释解释了代码所做的事情，它清楚地表明哪些代码是以太坊模板，哪些是实际的dApp逻辑。 让我们在项目中重用它非常方便。
