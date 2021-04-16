const defaultSlugify = require("@vuepress/shared-utils/lib/slugify");
const plugins = require("./plugins.js");
const pluginsChildren = [];

plugins.forEach((plugin) => {
  let readmePath = "/plugins/" + plugin.normalizedName + ".md";

  pluginsChildren.push([readmePath, plugin.name, 0]);
});

module.exports = {
  title:
    "Hardhat | 为专业人士开发的以太坊开发环境 by Nomic Labs",
  description:
    "Hardhat 是一个以太坊开发环境：编译合约并在开发网络上运行、获取Solidity的调用堆栈、console.log等。",
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "Home", link: "/" },
      // { text: "Hardhat Network", link: "/hardhat-network/" },
      { text: "插件", link: "/plugins/" },
      { text: "文档", link: "/getting-started/" },
      { text: "入门教程", link: "/tutorial/" },
    ],
    lastUpdated: true,
    repo: "nomiclabs/hardhat",
    docsDir: "docs",
    docsBranch: "website",
    editLinkText: "帮助我们改善页面!",
    editLinks: true,
    sidebarDepth: 1,
    displayAllHeaders: true,
    sidebar: {
      "/tutorial/": [
        {
          title: "入门教程",
          collapsable: false,
          depth: 1,
          children: [
            ["", "1. Hardhat概述", 1],
            [
              "setting-up-the-environment.md",
              "2. 环境搭建",
              0,
            ],
            [
              "creating-a-new-hardhat-project.md",
              "3. 创建新的 Hardhat 项目",
              0,
            ],
            [
              "writing-and-compiling-contracts.md",
              "4. 编写和编译合约",
              0,
            ],
            ["testing-contracts.md", "5. 测试合约", 0],
            [
              "debugging-with-hardhat-network.md",
              "6. 用 Hardhat Network 调试",
              0,
            ],
            [
              "deploying-to-a-live-network.md",
              "7. 部署到真实网络",
              0,
            ],
            [
              "hackathon-boilerplate-project.md",
              "8. Hardhat 前端模板",
              0,
            ],
            ["final-thoughts.md", "9. 最后想法", 0],
          ],
        },
      ],
      "/": [
        ["/getting-started/", "开始", 1],
        ["/config/", "配置项", 0],
        ["/hardhat-network/", "Hardhat 网络", 0],
        {
          title: "指南",
          url: "/guides/",
          collapsable: false,
          depth: 1,
          children: [
            ["/guides/migrate-from-buidler.md", "从 Buidler 迁移", 0],
            ["/guides/project-setup.md", "启动项目", 0],
            ["/guides/compile-contracts.md", "编译合约", 0],
            ["/guides/waffle-testing.md", "使用ethers.js & Waffle测试", 0],
            ["/guides/truffle-testing.md", "使用Web3.js & Truffle测试", 0],
            ["/guides/truffle-migration.md", "从 Truffle 迁移", 0],
            ["/guides/deploying.md", "部署合约", 0],
            ["/guides/scripts.md", "编写脚本", 0],
            ["/guides/mainnet-forking.md", "Fork 主网", 0],
            ["/guides/hardhat-console.md", "使用Hardhat 控制台", 0],
            ["/guides/create-task.md", "创建人物", 0],
            ["/guides/ganache-tests.md", "用Ganache运行测试", 0],
            ["/guides/vscode-tests.md", "在VS Code上运行测试", 0],
            ["/guides/typescript.md", "TypeScript 支持", 0],
            ["/guides/shorthand.md", "缩写 (hh) 和自动补全", 0],
          ],
        },
        {
          title: "高级",
          collapsable: false,
          children: [
            [
              "/advanced/hardhat-runtime-environment.html",
              "Hardhat Runtime Environment (HRE)",
              0,
            ],
            ["/advanced/building-plugins.html", "Building plugins", 0],
            [
              "/advanced/migrating-buidler-plugin.html",
              "Migrating a Buidler plugin",
              0,
            ],
          ],
        },
        {
          title: "Troubleshooting",
          collapsable: false,
          children: [
            ["/troubleshooting/verbose-logging.html", "Verbose logging", 0],
            ["/troubleshooting/common-problems.html", "Common problems", 0],
            ["/errors/", "Error codes", 0],
          ],
        },
        {
          title: "Reference",
          collapsable: false,
          children: [
            ["/reference/solidity-support.html", "Solidity support", 0],
          ],
        },
        "/buidler-documentation.html",
        {
          title: "Plugins",
          collapsable: false,
          children: pluginsChildren,
        },
      ],
    },
    algolia: {
      apiKey: '70d2567dd1257c8a53bbb823a0085f02',
      indexName: 'hardhat'
    }
  },
  head: [
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
    ],
    ["link", { rel: "manifest", href: "/site.webmanifest" }],
    ["meta", { name: "msapplication-config", content: "/browserconfig.xml" }],
    ["meta", { name: "msapplication-TileColor", content: "#ffffff" }],
    ["meta", { name: "theme-color", content: "#ffffff" }],
    ["link", { rel: "shortcut icon", href: "/favicon.ico" }],
    ["link", { rel: "icon", sizes: "16x16 32x32", href: "/favicon.ico" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@HardhatHQ" }],
    ["meta", { name: "twitter:creator", content: "@NomicLabs" }],
    [
      "meta",
      {
        name: "twitter:title",
        content: "为专业人士开发的以太坊开发环境",
      },
    ],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://hardhat.org/card.png",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Compile, deploy, test and debug your Ethereum software. Get Solidity stack traces, console.log, mainnet forking and more.",
      },
    ],
    [
      "meta",
      {
        property: "og:title",
        content:
          "Ethereum development environment for professionals by Nomic Labs",
      },
    ],
    [
      "meta",
      {
        property: "og:image",
        content: "https://hardhat.org/card.png",
      },
    ],
    ["meta", { property: "og:image:width", content: "2400" }],
    ["meta", { property: "og:image:height", content: "1250" }],
  ],
  markdown: {
    slugify: (title) => {
      const buidlerErrorTitle = /(^BDLR\d+):/i;
      const hardhatErrorTitle = /(^HH\d+):/i;

      const matchBuidler = buidlerErrorTitle.exec(title);

      if (matchBuidler !== null) {
        return matchBuidler[1];
      }

      const matchHardhat = hardhatErrorTitle.exec(title);

      if (matchHardhat !== null) {
        return matchHardhat[1];
      }

      return defaultSlugify(title);
    },
  },
  plugins: [
    ["@vuepress/google-analytics", { ga: "UA-117668706-2" }],
    [
      "vuepress-plugin-container",
      {
        type: "tip",
        defaultTitle: {
          "/": "TIP",
        },
      },
    ],
    [
      "vuepress-plugin-container",
      {
        type: "warning",
        defaultTitle: {
          "/": "WARNING",
        },
      },
    ],
  ],
};
