<div align="center">
  <h1 align="center">Hextra</h1>
  <sup align="center"><a href="README.md">English</a> | <a href="README.zh-cn.md">简体中文</a> ｜ <a href="README.fa.md">فارسی</a></sup>
  <p align="center">用于创建美观的静态站点的现代化, 响应式, 功能强大的 Hugo 主题.</p>

演示 → [homelabcentral.github.io/hextra](https://homelabcentral.github.io/hextra/)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/5097752/263550533-c18343ca-3848-4230-b5c0-ee989d7916da.png">
  <img alt="Hextra" src="https://user-images.githubusercontent.com/5097752/263550528-663599f9-17a1-4686-b5c4-3da233b5034d.png">
</picture>

<div align="right">
<a href="https://github.com/homelabcentral/hextra/actions/workflows/pages.yml"><img alt="GitHub Actions Status" src="https://github.com/homelabcentral/hextra/actions/workflows/pages.yml/badge.svg"></a>
</div>

## 特性

- **美观的设计** - 受 Nextra 的启发，Hextra 利用 Tailwind CSS 提供现代化的设计，使您的网站看起来美观有加.
- **响应式布局和深色模式支持** - 在任何设备上看起来都足够美观, 无论是手机, 平板电脑或者电脑. 深色模式的支持使 Hextra 可以应对各种照明环境.
- **快速且轻量** - 由 Hugo 强力支持, Hugo 是一个快如闪电的静态站点生成器, 这一切都只需一个可执行文件, Hextra 始终保持最小化, 无需 Javascript 或者 Node.js.
- **全文搜索** - 集成了 Flexsearch 的全文搜索, 无需额外的配置.
- **功能齐全** - Markdown, 代码高亮, LaTex 数学公式, diagrams 图表和 Shortcodes 都可以用于丰富你的内容. 目录, 面包屑导航, 分页, 侧边栏等均由 Hextra 自动生成。
- **多语言和 SEO Ready** - Hugo 的多语言模式使得构建多语言网站更简单. 具有 SEO tags, Open Graph, 和 Twitter Cards 等诸多开箱即用的功能.
- **无障碍支持** - 交互组件使用语义化标记、友好的键盘交互以及自动化无障碍检查，以便在常见辅助技术工作流中保持良好的可用性。

## 快速开始

### 作为 Hugo 模块安装

需要 [Hugo extended](https://gohugo.io/installation/) 0.146.0 或更高版本, 以及 [Go](https://go.dev/dl/) —— Hugo 依赖它来解析模块.

```shell
hugo new site my-site --format=yaml
cd my-site
hugo mod init github.com/username/my-site
hugo mod get github.com/homelabcentral/hextra
```

然后在 `hugo.yaml` 中添加导入:

```yaml
module:
  imports:
    - path: github.com/homelabcentral/hextra

# 可选: 启用主题的分类法, 包括 `series`. Hugo 只接受项目配置中的合并策略,
# 因此主题自身无法设置这一项.
taxonomies:
  _merge: shallow
```

不会有任何文件被复制到你的站点中. Hugo 会把主题保存在自己的模块缓存里, 站点使用的版本只在 `go.mod` 中占一行. 升级是显式的:

```shell
hugo mod get -u github.com/homelabcentral/hextra          # 最新发布版本
hugo mod get github.com/homelabcentral/hextra@v0.13.0     # 指定版本
```

### 使用

转至[文档](https://homelabcentral.github.io/hextra/zh-cn/docs)

## 贡献

该项目正在积极开发中. 欢迎贡献!

## 许可证

[MIT License](./LICENSE)
