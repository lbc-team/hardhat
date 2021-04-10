# 用Hardhat编写脚本

在本指南中，我们将介绍使用Hardhat创建脚本的步骤，有关Hardhat的概述，请参阅[入门指南]( ../getting-started/README.md)



你可以使用Hardhat所有功能编写自定义脚本，一个经典的使用场景是为智能合约编写一个部署脚本。



有两种方法可以编写访问[Hardhat 运行时环境](./advanced/hardhat-runtime-environment.md)的脚本。



::: tip

Hardhat脚本对于处理简单的不需要用户参数的事情很有用，而对于与外部工具集成（比如Node.js调试器），这些工具并不适合Hardhat CLI。

如果你想自动完成更复杂的事情，并接收用户参数，你可以在这里学习如何[创建自己的任务](../guides/create-task.md)。
:::

## Hardhat CLI 依赖

你可以编写访问[Hardhat 运行时环境](./advanced/hardhat-runtime-environment.md)属性（作为全局变量）的脚本。

这些脚本必须通过Hardhat运行： `npx hardhat run script.js`。

这使得它可以很容易地移植为其他工具开发的脚本，将变量注入到全局状态中。



## 独立脚本: 将Hardhat作为一个库使用

第二种方案利用Hardhat的架构，使其更具灵活性。 Hardhat被设计为一个库，允许你发挥创造力，构建独立的CLI工具去访问你的开发环境。你只需要简单引入它：

```js
const hre = require("hardhat");
```

你可以访问所有的任务和插件，只需通过node就可以运行这些脚本，如： `node script.js`。

我们来看一个全新的Hardhat项目，运行 `npx hardhat `并依照指引步骤创建一个示例项目。 当创建完成后，你的项目目录应该是这样的：

```
$ ls -l
total 400
-rw-r--r--    1 fzeoli  staff     195 Jul 30 15:27 hardhat.config.js
drwxr-xr-x    3 fzeoli  staff      96 Jul 30 15:27 contracts
drwxr-xr-x  502 fzeoli  staff   16064 Jul 30 15:31 node_modules
-rw-r--r--    1 fzeoli  staff  194953 Jul 30 15:31 package-lock.json
-rw-r--r--    1 fzeoli  staff     365 Jul 30 15:31 package.json
drwxr-xr-x    3 fzeoli  staff      96 Jul 30 15:27 scripts
drwxr-xr-x    3 fzeoli  staff      96 Jul 30 15:27 test
```

在 `scripts/` 里面，你会发现 `sample-script.js`.  通过阅读其注释，可以更好地了解它的作用。

<<< @/../packages/hardhat-core/sample-project/scripts/sample-script.js



读完了吗？ 在用`node`运行脚本之前，你需要声明`ethers`。 这是需要的，因为Hardhat不会像调用`run`任务时那样在全局范围内注入它。

```js{2}
const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  //...
}
```

现在你已经准备好运行这个脚本了:

```
$ node scripts/sample-script.js
Greeter address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

通过顶部的[Hardhat 运行时环境](./advanced/hardhat-runtime-environment.md) , 可以以独立的方式运行脚本。当通过Hardhat运行脚本时，Hardhat总是运行编译任务。 但在独立模式下，你可能想手动调用编译，以确保所有的东西都被编译。 这是可以通过调用`hre.run('compile')`来实现。 把下面这行注释，然后用`node`重新运行脚本：

```js
await hre.run("compile");
```

```
$ node scripts/sample-script.js
Greeter address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Hardhat 参数

当你将Hardhat作为一个库使用时，你仍然可以将参数传递给它。 这是通过设置环境变量来进行的，这些变量有：

- `HARDHAT_NETWORK`: 设置要连接的网络。

- `HARDHAT_SHOW_STACK_TRACES`:  启用预期错误的JavaScript堆栈跟踪。

- `HARDHAT_VERBOSE`: 启用Hardhat verbose日志记录。

- `HARDHAT_MAX_MEMORY`: 设置Hardhat可以使用的最大内存量。
