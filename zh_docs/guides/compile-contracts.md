# 编译合约

要在Hardhat项目中编译你的合约，使用内置任务`compile`。

```
$ npx hardhat compile
Compiling...
Compiled 1 contract successfully
```

编译后的工件默认保存在`artifacts/`目录下，或者配置为任何其他路径。请查看[路径配置部分](../config/README.md#path-configuration)来了解如何更改它。如果这个目录不存在，就会被创建。

初次编译后，Hardhat会在下次编译时尽量减少工作量。例如，如果你在上次编译后没有修改任何文件，那么什么也不会被编译。如果你只修改了一个文件，那么只有该文件和其他受其影响的文件会被重新编译。

```
$ npx hardhat compile
Nothing to compile
```

要强制编译，你可以使用`--force`参数，或者运行`npx hardhat clean`来清除缓存并删除工件。

## 配置编译器

如果你需要自定义Solidity编译器选项，那么你可以通过你的`hardhat.config.js`中的`solidity`配置字段来实现。使用这个字段的最简单方法是设置编译器版本的简写，我们建议总是这样做：

```js
module.exports = {
  solidity: "0.7.1"
}
```

我们建议总是设置一个编译器版本，以避免意外行为或编译错误，因为Solidity的新版本已经发布。

也允许对编译器进行更多的控制：

```js
module.exports = {
  solidity: {
    version: "0.7.1",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  }
}
```

`settings`与[Input  JSON](https://solidity.readthedocs.io/en/v0.7.2/using-the-compiler.html#input-description)中的`settings`条目具有相同的模式参数，可以传递给编译器。一些常用的设置是：

- `optimizer`：有`enabled`和`runs`键。默认值：`{ enabled: false, runs:200 }`.
- `evmVersion`：控制目标evm版本的字符串。`homestead`、`tangerineWhistle`、`spuriousDragon`、`byzantium`、`constantinople`、`petersburg`、`istanbul`和`berlin`中的一个。默认值：由`solc`管理。

如果有任何一个合约的版本pragma不满足所配置的编译器版本，那么Hardhat将抛出一个错误。

### 支持多个Solidity版本

Hardhat 支持使用不同的、不兼容的 solc 版本的项目。例如，如果你有一个项目，其中一些文件使用Solidity 0.5，而另一些文件使用0.6，你可以像这样配置Hardhat来使用与这些文件兼容的编译器版本:

```js
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.5"
      },
      {
        version: "0.6.7",
        settings: { } 
      }
    ]
  }
}
```

这意味着设置了`pragma solidity ^0.5.0`的文件将被solc 0.5.5编译，而一个带有`pragma solidity ^0.6.0`的文件将被solc 0.6.7编译。

可能会出现这样的情况：一个文件可以用多个配置好的编译器编译，比如一个文件的 `pragma solidity >=0.5.0`，在这种情况下，将使用最高版本的兼容编译器（本例中为0.6.7）。在这种情况下，将使用最高版本的兼容编译器(本例中为0.6.7)。如果你不希望发生这种情况，你可以通过使用`overrides`来指定每个文件应该使用哪个编译器。

```js{4-7}
module.exports = {
  solidity: {
    compilers: [...],
    overrides: {
      "contracts/Foo.sol": {
        version: "0.5.5",
        settings: { }
      }
    }
  }
}
```

在这种情况下，`contracts/Foo.sol`将被编译成solc 0.5.5，而不管`solidity.compilers`条目中是什么。

请记住：

- overrides是完整的编译器配置，所以如果你有任何额外的设置，你也应该为overrides设置它们。
- 即使在Windows上，你也必须使用斜线(`/`)。

## 工件(Artifacts)

用Hardhat编译时，每个编译后的合约会产生两个文件（不是每个`.sol`文件）：一个工件和一个调试文件。

一个**工件**拥有部署和与合约交互所需的所有信息。这些信息与大多数工具兼容，包括Truffle的artifact格式。每个工件都由一个以下属性的 json 组成。

- `contractName`: 合约名称的字符串。

- `abi`：合约ABI的[JSON描述](https://solidity.readthedocs.io/en/latest/abi-spec.html#abi-json)。

- `bytecode`：一个``0x``前缀的未连接部署字节码的十六进制字符串。如果合约不可部署，则有``0x``字符串。

- `deployedBytecode`：一个``0x``前缀的十六进制字符串，表示未链接的运行时/部署的字节码。如果合约不可部署，则有``0x``字符串。

- `linkReferences`：字节码的链接参考对象[由solc返回](https://solidity.readthedocs.io/en/latest/using-the-compiler.html)。如果合约不需要链接，该值包含一个空对象。

- `deployedLinkReferences`：已部署的字节码的链接参考对象[由solc返回](https://solidity.readthedocs.io/en/latest/using-the-compiler.html)。如果合约不需要链接，该值包含一个空对象。


在**调试文件**中包含了重现编译和调试合约所需的所有信息：这包括原始solc输入和输出，以及用于编译的solc版本。

### 构建信息文件

Hardhat通过一次编译尽可能小的文件集来优化编译。一起编译的文件具有相同的solc输入和输出。由于在每个调试文件中都包含这些信息则意味着浪费，所以这些信息被重复复制在构建信息文件中，这些文件被放在`artifacts/build-info`中。每个合约的调试文件都包含了相对构建信息文件的相对路径，每个构建信息文件都包含了solc输入、solc输出和使用的solc版本。

你不应该直接与这些文件交互。

### 工件

[HRE] 有一个带有辅助方法的`artifacts`对象。例如，你可以通过调用`hre.artifacts.getArtifactPaths()`来获得一个包含所有工件路径的列表。

你也可以通过调用`hre.artifacts.readArtifacts("Bar")`来使用合约的名称来读取工件，这样就可以得到`Bar`合约的工件内容。这只有在整个项目中只有一个合约`Bar`的情况下才行得通，但如果有两个`Foo`合约，调用`hre.artifacts.readArtifact("Foo")`，就会抛出一个错误。为了消除这种情况，你必须使用合约的**完全限定名**：`hre.artifacts.readArtifact("contracts/Foo.sol:Foo")`。

### 目录结构
`artifacts/`目录的结构遵循合约的原始目录结构。例如，如果你的合约是这样的：

```
contracts
├── Foo.sol
├── Bar.sol
└── Qux.sol
```

那么你的工件目录的结构可能是这样的:

```
artifacts
└── contracts
    ├── Foo.sol
    │   ├── Foo.json
    │   ├── Foo.dbg.json
    │   ├── Foo2.json
    │   └── Foo2.dbg.json
    ├── Bar.sol
    │   ├── Bar.json
    │   └── Bar.dbg.json
    └── Qux.sol
        ├── Foo.json
        └── Foo.dbg.json
```

你的源代码中的每个 Solidity 文件都会在 artifacts 结构中得到一个目录。每个目录会为文件中的每一个合约生成一个工件(`.json`)文件和一个调试(`.dbg.json`)文件。例如`Foo.sol`，里面包含两个合约。

两个Solidity文件可以有相同名称的合约，这种结构允许这样做。

如果你有任何帮助或反馈，你可以在[Hardhat Support Discord服务器](https://hardhat.org/discord)找到我们。

[HRE]: ../advanced/hardhat-runtime-environment.md