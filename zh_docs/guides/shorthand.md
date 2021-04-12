# 缩写 (hh) 与自动补全

`hardhat-shorthand`是一个NPM包，其安装了一个全局可访问的二进制执行文件：`hh`，用来运行在项目本地安装的`hardhat`，并支持shell运行时，为任务的自动补全。

## 安装

要使用Hardhat缩写，需要在全局范围内安装:

```
npm i -g hardhat-shorthand
```

安装之后，运行`hh`就相当于运行`npx hardhat`。 例如，你可以运行`hh compile` 替代运行`npx hardhat compile`。

要启用自动补全支持，你还需要安装`hardhat-completion`，它是`hardhat-shorthand`附带的，运行 `hardhat-completion install`，并参照安装说明完成安装：


```
$ hardhat-completion install
✔ Which Shell do you use ? · zsh
✔ We will install completion to ~/.zshrc, is it ok ? (y/N) · true
=> Added tabtab source line in "~/.zshrc" file
=> Added tabtab source line in "~/.config/tabtab/zsh/__tabtab.zsh" file
=> Wrote completion script to /home/fvictorio/.config/tabtab/zsh/hh.zsh file

      => Tabtab source line added to ~/.zshrc for hh package.

      Make sure to reload your SHELL.
```

尝试一下，打开一个**新的**终端，进入你的Hardhat项目目录，试着输入`hh`，然后输入tab：


![](/hh.gif)

## 背景

出于最佳实践，Hardhat项目使用本地安装的NPM包 `hardhat`，以确保在项目中工作的每个人都在使用同一版本。 这就是为什么你需要使用`npx`或npm脚本来运行Hardhat。

这种方法的缺点是没有办法直接为`hardhat`命令提供自动补全建议，同时也使CLI命令变得更长，这就是`hh`解决的两个问题。



## 故障排除

### "Autocompletion is not working"

首先，确保你用`hardhat-completion install`安装了自动补全脚本，然后重新加载shell或者打开一个新的终端再试一次。

如果你还是有问题，请确认你的Hardhat配置没有任何问题。 你可以通过运行`hh`来实现。 如果命令打印可以出帮助信息，那么你的配置就没有问题。 如果不可以，你就会知道问题出在哪里。

