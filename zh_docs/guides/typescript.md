#  TypeScript支持


在本指南中，我们将一步步演示Hardhat项目与TypeScript一起协作。 意味着你可以用[TypeScript](https://www.typescriptlang.org/)编写Hardhat配置、任务、脚本和测试。

关于Hardhat的概述，请参考[入门指南](../getting-started)。


## 启用TypeScript支持

如果配置文件以`.ts`结尾，并一有效的TypeScript编写，Hardhat会自动启用TypeScript支持。不过也还需要做一些改动才能正常使用。


### 安装依赖

Hardhat在背后使用TypeScript和`ts-node`，所以你需要安装它们。
打开终端，进入Hardhat项目，并运行:


```
npm install --save-dev ts-node typescript
```

为了能够在TypeScript中编写测试，你还需要这些包:


```
npm install --save-dev chai @types/node @types/mocha @types/chai
```

### TypeScript配置

你可以很容易地把一个JavaScript Hardhat配置文件变成一个TypeScript文件。 看看是如何做到的，先从一个全新的Hardhat项目开始。

打开终端，进入一个空的文件夹，运行`npx hardhat`，然后通过向导步骤来创建一个示例项目。 完成后，你的项目目录应该是这样的：


```
$ ls -l
total 1200
drwxr-xr-x    3 pato  wheel      96 Oct 20 12:50 contracts/
-rw-r--r--    1 pato  wheel     567 Oct 20 12:50 hardhat.config.js
drwxr-xr-x  434 pato  wheel   13888 Oct 20 12:52 node_modules/
-rw-r--r--    1 pato  wheel  604835 Oct 20 12:52 package-lock.json
-rw-r--r--    1 pato  wheel     460 Oct 20 12:52 package.json
drwxr-xr-x    3 pato  wheel      96 Oct 20 12:50 scripts/
drwxr-xr-x    3 pato  wheel      96 Oct 20 12:50 test/
```

然后，你应该按照上面[安装依赖](#安装依赖)一节中提到的步骤进行。

现在，我们要把配置文件从`hardhat.config.js`改名为`hardhat.config.ts`，运行：

```
mv hardhat.config.js hardhat.config.ts
```

还需要对配置进行三个改变，使其与TypeScript一起工作：


1. 必须用 `import `而不是 `require `加载插件。
2. 需要显式导入Hardhat配置函数，比如`task`。
3. 如果你正在自定义任务，它们需要明确地访问[Hardhat运行时环境]，作为一个参数。

例如，示例项目的配置原来是这样：

```js{1,5-6,19-21}
require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
};
```

变更后为：

```typescript{1-2,6-7,17-19}
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  solidity: "0.7.3",
};
```

所有要做的就是这些，现在你可以在TypeScript中编写配置，测试，任务和脚本。


## 用TypeScript编写测试和脚本

要编写智能合约测试和脚本，你很可能需要访问以太坊库来与智能合约交互。 这可以是[hardhat-ethers](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-ethers)或[hardhat-web3](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-web3)，它们都会将实例注入[Hardhat运行时环境（HRE）](../advanced/hardhat-runtime-environment.md)。

当使用JavaScript时，HRE中的所有属性都会被注入到全局作用域中，也可以通过显式获取HRE来获得。当使用TypeScript时，则需要显式地导入所有变量。

一个测试示例:


```typescript
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("Token", function () {
  let accounts: Signer[];

  beforeEach(async function () {
    accounts = await ethers.getSigners();
  });

  it("should do something right", async function () {
    // Do something with the accounts
  });
});
```

一个脚本示例:

```typescript
import { run, ethers } from "hardhat";

async function main() {
  await run("compile");

  const accounts = await ethers.getSigners();

  console.log("Accounts:", accounts.map(a => a.address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## 类型安全配置

使用TypeScript的一个好处是，你可以有一个类型安全的配置，并避免错别字和其他常见错误。

要做到这一点，你必须这样写你的配置：


```ts
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  // Your type-safe config goes here
};

export default config;
```

## 使用`tsconfig.json`文件自定义TypeScript

Hardhat不需要一个`tsconfig.json`文件就可以工作，但你仍然可以创建一个。

如果你不知道`tsconfig.json`文件是什么，或者你不确定自己是否关心它。
我们建议你跳过本节。


如果你确定你需要一个`tsconfig.json`文件，这里有一个模板作为基础：

```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist"
  },
  "include": ["./scripts", "./test"],
  "files": ["./hardhat.config.ts"]
}
```

无论你如何修改它，请确保你的配置文件包含在你的项目中。 最简单的方法是将其路径保留在`files`数组中。

## 性能优化

在底层，Hardhat使用[ts-node](https://www.npmjs.com/package/ts-node)来支持TypeScript。 默认情况下，它将在每次运行时重新编译并进行类型检查。 根据你项目的大小，这个过程可能会变得很慢。

你可以通过防止`ts-node`对你的项目进行类型检查来使Hardhat运行得更快。可以通过把
`TS_NODE_TRANSPILE_ONLY`环境变量设置为`1`就可以实现。

例如，你可以像这样更快地运行基于TypeScript的测试`TS_NODE_TRANSPILE_ONLY=1 npx hardhat test`。


## 直接用`ts-node`运行测试和脚本

当不使用CLI运行Hardhat脚本时，你需要使用`ts-node`的[`--files`标志](https://www.npmjs.com/package/ts-node#help-my-types-are-missing)。

也可以用`TS_NODE_FILES=true`启用。
