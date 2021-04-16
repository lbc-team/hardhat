# 创建任务


本指南将探讨在Hardhat中创建任务，这是用于自动化的核心组件。

任务是一个带有相关元数据的JavaScript异步函数。 这些元数据被Hardhat用来自动化处理一些事情。如：参数解析、验证和帮助信息都会被处理。

在Hardhat中，能做的一切都被定义为任务。开箱即用的默认动作是内置任务，它们也是使用与用户相同的API来实现的。

要查看项目中当前可用的任务，运行`npx hardhat`:

```
$ npx hardhat
Hardhat version 2.0.0

Usage: hardhat [GLOBAL OPTIONS] <TASK> [TASK OPTIONS]

GLOBAL OPTIONS:

  --config              A Hardhat config file.
  --emoji               Use emoji in messages.
  --help                Shows this message, or a task's help if its name is provided
  --max-memory          The maximum amount of memory that Hardhat can use.
  --network             The network to connect to.
  --show-stack-traces   Show stack traces.
  --tsconfig            Reserved hardhat argument -- Has no effect.
  --verbose             Enables Hardhat verbose logging
  --version             Shows hardhat's version.


AVAILABLE TASKS:

  check         Check whatever you need
  clean         Clears the cache and deletes all artifacts
  compile       Compiles the entire project, building all artifacts
  console       Opens a hardhat console
  flatten       Flattens and prints contracts and their dependencies
  help          Prints this message
  node          Starts a JSON-RPC server on top of Hardhat Network
  run           Runs a user-defined script after compiling the project
  test          Runs mocha tests

To get help for a specific task run: npx hardhat help [task]
```

你也可以创建一个任务来重新设置开发环境的状态、与你的合约进行交互或打包项目。

我们将展示创建任务的完整过程，这个任务将会与智能合约交互。

Hardhat中的任务是异步JavaScript函数，它可以访问[Hardhat运行时环境（HRE）](../advanced/hardhat-runtime-environment.md)，通过HRE你可以访问配置、参数、其他的任务程序以及插件可能注入的任何对象。

在我们的例子中，我们将使用Web3.js与合约进行交互，所以我们将安装[Web3.js插件](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-web3)，它会将Web3.js实例注入Hardhat环境中。

```
npm install --save-dev @nomiclabs/hardhat-web3 web3
```

_看看[Hardhat插件列表](../plugins/README.md) 还有什么其他可用的库._

任务创建代码可以放在`hardhat.config.js`中(或者其他名字的配置文件)。 这是一个创建简单任务的好地方。 如果你的任务比较复杂，也完全可以把代码分成几个文件，从配置文件中用`require`引入。

_如果你正在编写一个Hardhat插件来添加任务，它们也可以在一个单独的npm包中创建。了解更多关于通过插件创建任务的信息，请查看我们的[构建插件部分](../advanced/building-plugins.md)._。

**配置文件总是在启动时执行，然后才执行其他事情**，最好记住这一点。 我们将加载Web3.js插件，并添加任务创建代码。

在本教程中，我们将创建一个任务来在终端获取账户的余额。你可以通过Hardhat的config DSL来实现，其可以在`hardhat.config.js`的全局范围内使用:

```js
require("@nomiclabs/hardhat-web3");

task("balance", "Prints an account's balance")
  .setAction(async () => {});

module.exports = {};
```

保存文件后，你应该已经可以在Hardhat中看到任务了:

```
$ npx hardhat
Hardhat version 1.0.0

Usage: hardhat [GLOBAL OPTIONS] <TASK> [TASK OPTIONS]

GLOBAL OPTIONS:

  --config              A Hardhat config file.
  --emoji               Use emoji in messages.
  --help                Shows this message.
  --network             The network to connect to. (default: "hardhat")
  --show-stack-traces   Show stack traces.
  --version             Shows hardhat's version.


AVAILABLE TASKS:

  balance       Prints an account's balance
  clean         Clears the cache and deletes all artifacts
  compile       Compiles the entire project, building all artifacts
  console       Opens a hardhat console
  flatten       Flattens and prints all contracts and their dependencies
  help          Prints this message
  run           Runs a user-defined script after compiling the project
  test          Runs mocha tests

To get help for a specific task run: npx hardhat help [task]
```

现在来实现我们想要的功能。我们需要从用户那里获得账户地址，这可以通过给任务添加一个参数来实现。


```js
require("@nomiclabs/hardhat-web3");

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async () => {});

module.exports = {};
```

当你为任务添加参数时，Hardhat将为你处理其帮助信息:

```
$ npx hardhat help balance
Hardhat version 1.0.0

Usage: hardhat [GLOBAL OPTIONS] balance --account <STRING>

OPTIONS:

  --account     The account's address

balance: Prints an account's balance

For global options help run: hardhat help
```

现在我们来看看账户的余额。 [Hardhat 运行时环境](../advanced/hardhat-runtime-environment.md)在全局范围内可用。通过使用Hardhat的[Web3.js插件](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-web3)，可以访问Web3.js实例：

```js
require("@nomiclabs/hardhat-web3");

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async taskArgs => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);

    console.log(web3.utils.fromWei(balance, "ether"), "ETH");
  });

module.exports = {};
```

最后，我们可以运行这个任务:

```
$ npx hardhat balance --account 0x080f632fb4211cfc19d1e795f3f3109f221d44c9
100 ETH
```

就这样简单，实现了你的第一个全功能的Hardhat任务，让你以简单的方式与以太坊区块链交互。

## 高级用法

你可以在`hardhat.config.js`文件中创建自己的任务。 Config DSL在全局环境中可用，具有定义任务的功能。 如果你喜欢保持内容明确，并利用编辑器的自动补全功能，你也可以用`require("hardhat/config")`导入DSL。

创建任务是通过调用`task`函数来完成的。它将返回一个`TaskDefinition`对象，可以用来定义任务的参数。

你可以定义的最简单的任务是

```js
task("hello", "Prints 'Hello, World!'", async function(taskArguments, hre, runSuper) {
  console.log("Hello, World!");
});
```

`task`的第一个参数是任务名称。第二个是它的描述，用于在CLI中打印帮助信息。第三个是一个异步函数，它接收以下参数:

- `taskArguments` 是一个包含任务的CLI解析的参数对象。在此例下，它是一个空对象。

- `hre` 是[Hardhat 运行时环境](../advanced/hardhat-runtime-environment.md).

- `runSuper` 只有在覆盖现有的任务时才有意义，这一点我们接下来会学习。其目的是让你运行原来任务的动作。

定义动作的参数是可选的。 Hardhat运行时环境和`runSuper`也将在全局范围内可用。我们可以这样重写 `hello `任务：


```js
task("hello", "Prints 'Hello, World!'", async () => {
  console.log("Hello, World!");
});
```

### 任务的action要求

编写任务的唯一要求是，其action返回的`Promise`在它启动的每个async进程结束之前不能解析出结果。

这是一个action不符合这个要求的任务的示例:

```js
task("BAD", "This task is broken", async () => {
  setTimeout(() => {
    throw new Error(
      "This tasks' action returned a promise that resolved before I was thrown"
    );
  }, 1000);
});
```

这另一个任务使用`Promise` 等待超时触发。

```js
task("delayed-hello", "Prints 'Hello, World!' after a second", async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Hello, World!");
      resolve();
    }, 1000);
  });
});
```

手动创建一个 `承诺 `可能看起来很有挑战，但如果你使用 `async`/`await`和基于`Promise`的API，你就不必这样做。 例如，你可以使用npm包[`delay`](https://www.npmjs.com/package/delay)来获得`setTimeout`的`Promise`版本。


### 定义参数

Hardhat任务可以接收`--named`参数的值、`--flags`、位置参数和可变参数。 可变参数的作用就像JavaScript的rest参数一样。 Config DSL `task`函数返回一个对象，其中包含定义所有对象的方法。 一旦定义，Hardhat就会控制解析参数、验证参数和打印帮助信息。

在 `hello` 任务中添加一个可选的参数，可以像这样:


```js
task("hello", "Prints a greeting'")
  .addOptionalParam("greeting", "The greeting to print", "Hello, World!")
  .setAction(async ({ greeting }) => console.log(greeting));
```

并将用`npx hardhat hello --greeting Hola`运行。

#### 位置参数限制

位置参数和可变参数不必命名，具有编程语言的常见限制:

- 位置参数都不能跟在可变参数后面
- 必需/强制参数不能跟在可变参数后面。

如果不遵守这些限制，将导致在加载Hardhat时抛出异常。


#### 类型验证

Hardhat负责验证和解析为每个参数提供的值。 你可以声明一个参数的类型，Hardhat会获取CLI字符串并将其转换为你想要的类型。 如果这次转换失败，它将打印一条错误信息解释原因。

在Config DSL中，通过`types`对象，可以使用许多类型。 这个对象在处理`hardhat.config.js`之前就会被注入到全局作用域内，但你也可以用`const { types } = require("hardhat/config")`显式导入它，并利用编辑器的自动补全功能。

为任务参数定义类型的示例：


```js
task("hello", "Prints 'Hello' multiple times")
  .addOptionalParam("times", "The number of times to print 'Hello'", 1, types.int)
  .setAction(async ({ times }) => {
    for (let i = 0; i < times; i++) {
      console.log("Hello");
    }
  });
```

如果用 `npx hardhat hello --times notanumber `调用，将提示错误。


### 覆盖任务

定义一个与现有任务名称相同的任务将覆盖(override)它。这对于改变或扩展内置和插件提供的任务的行为很有用。

任务覆盖的工作原理与扩展类时的重载方法非常相似。你可以设置自己的动作，可以调用之前的动作。 覆盖任务时，唯一的限制是不能添加或删除参数。

任务覆盖顺序是很重要的，因为使用`runSuper`函数，动作只能调用之前紧接的定义。

覆盖内置任务是定制和扩展Hardhat的好方法。 要知道哪些任务可以覆盖，请查看[src/builtin-tasks](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-core/src/builtin-tasks)。



#### `runSuper` 函数

`runSuper` 是一个可用于覆盖任务动作的函数。 它可以作为任务的第三个参数调用，也可以直接从全局对象中使用。

这个函数的作用就像[JavaScript的`super`关键字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super)一样，它调用任务之前定义的动作。

如果任务没有覆盖之前定义的任务，调用`runSuper`将导致错误。 要检查调用它是否不会失败，可以使用`boolean`字段`runSuper.isDefined`来判断。

`runSuper` 函数接收一个可选参数：任务参数对象。 如果没有提供这个参数，将使把调用动作的任务参数传递给它。


### 子任务

创建具有大量逻辑的任务，将使扩展或定制它们变得很难。而多个小而集中的任务，更好互相调用，以便于扩展。 如果你以这种方式设计任务，用户如果只想改变其中的一个小部分，可以覆盖你的一个子任务。

例如，`compile`任务就是通过若干任务的管道来实现的。它只是调用了`compile:get-source-paths`、`compile:get-dependency-graph`和`compile:build-artifacts`等子任务。 我们建议在中间任务前加上主任务和冒号作为前缀。

为了避免帮助信息被大量的中间任务所干扰，你可以使用`subtask`配置DSL函数来定义这些任务。 `subtask`函数的工作原理几乎和`task`完全一样。 唯一不同的是，用它定义的任务不会被包含在帮助信息中。

你可以使用`run`函数运行一个子任务或任何任务。`run`函数需要两个参数：要运行的任务名称以及参数对象。

这是一个任务运行子任务的例子:

```js
task("hello-world", "Prints a hello world message")
  .setAction(async () => {
    await run("print", {message: "Hello, World!"})
  });

subtask("print", "Prints a message")
  .addParam("message", "The message to print")
  .setAction(async (taskArgs) => {
    console.log(taskArgs.message)
  });
``` 

