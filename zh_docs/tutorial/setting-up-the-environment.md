---
prev: false
---

# 1. 环境搭建

大多数以太坊库和工具都是用JavaScript编写的，**Hardhat**也是如此。 如果你不熟悉Node.js，它是基于Chrome的V8 JavaScript引擎构建的JavaScript运行时。 这是在网络浏览器之外运行JavaScript的最受欢迎的解决方案，**Hardhat **就是建立Node.js之上。

## 安装 Node.js

如果你已经安装了的 Node.js `> = 16.0`，则可以[跳到下一节](./creating-a-new-hardhat-project.md) 如果没有，请按照以下步骤在Ubuntu，MacOS和Windows上安装它。


### Linux

#### Ubuntu

将以下命令复制并粘贴到终端中：

```
sudo apt update
sudo apt install curl git
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### MacOS

确保你已安装`git`。 否则，请遵循[这些说明](https://www.atlassian.com/git/tutorials/install-git)安装。

在MacOS上有多种安装Node.js的方法。 我们将使用 [Node 版本管理器(nvm)](http://github.com/creationix/nvm)。 将以下命令复制并粘贴到终端中：

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.2/install.sh | bash
nvm install 18
nvm use 12
nvm alias default 12
npm install npm --global # Upgrade npm to the latest version
```

### Windows

在Windows上安装Node.js需要一些手动步骤。 我们将安装git，Node.js 12.x和NPM的Windows构建工具。 下载并运行以下命令：

1. [Git的Windows安装程序](https://git-scm.com/download/win)
2. `node-v12.XX.XX-x64.msi` 在[这里](https://nodejs.org/dist/latest-v12.x)下载


## 升级 Node.js

如果你的 Node.js 版本低于  `16.0` ,  则需要通过以下指引升级。

### Linux

#### Ubuntu

1. 运行 `sudo apt remove nodejs` 删除 Node.js.
2. 在[这里](https://github.com/nodesource/distributions#debinstall) 找到你想要安装的版本
3. 运行 `sudo apt update && sudo apt install nodejs` 再次安装

### MacOS

你可以使用 [nvm](http://github.com/creationix/nvm) 切换版本. 为了升级到 Node.js `18.x` 可运行一下命令：

```
nvm install 18
nvm use 18
nvm alias default 18
npm install npm --global # 升级 npm 到最新版本
```

### Windows

参考安装时同样的方式，但选择不同的版本，[这里](https://nodejs.org/en/download/releases/) 列出了所有版本。