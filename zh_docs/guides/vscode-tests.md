# 在Visual Studio代码上运行测试


通过使用Mocha集成插件，你可以从[Visual Studio Code](https://code.visualstudio.com)运行测试，我们推荐使用[Mocha Test Explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter)。

要使用Mocha Test Explorer，你需要按照以下说明安装它。

通过运行这个命令在本地安装Mocha:


```
npm install --save-dev mocha
```

然后，在项目根目录下创建一个名为`.mocharc.json`的文件，内容如下:

```json
{
  "require": "hardhat/register",
  "timeout": 20000
}
```

最后，你可以为这个VS Code命令`test-explorer.run-test-at-cursor`设置一个快捷键，你会发现能够对当前正在编辑的文件运行测试。


## 运行TypeScript测试


从[Visual Studio Code](https://code.visualstudio.com)运行用TypeScript编写的测试需要两个额外的步骤。

首先，你必须把`.mocharc.json`改成这样:


```json{2}
{
  "require": "ts-node/register/files",
  "timeout": 20000
}
```

然后，需将vscode选项`"mochaExplorer.files"`设置为`"test/**/*.{j,t}s"`。

如果需要任何帮助或反馈，你可以在[Hardhat Support Discord服务器](https://hardhat.org/discord)找到我们。