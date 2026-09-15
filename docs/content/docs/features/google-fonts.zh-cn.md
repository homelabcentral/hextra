---
title: Google Fonts
weight: 1
---

Hextra 提供一流的 Google Fonts 支持：可为**标题**、**正文**和**代码**分别独立配置字体，使用 Google 现代的可变字体 `axes` 语法，并提供字体加载失败时的回退字体栈。

<!--more-->

## 快速开始

在站点的 `hugo.yaml` 中启用字体：

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true

    heading:
      family: "Sora"
      axes: "wght@100..800"
      display: "swap"

    body:
      family: "Inter"
      axes: "ital,wght@0,400;0,500;1,400"
      display: "swap"

    code:
      family: "JetBrains Mono"
      axes: "wght@400;500"
      display: "swap"

    mono:
      family: "IBM Plex Mono"
      axes: "wght@400;500;600"
      display: "swap"

    # Used while fonts load and if Google Fonts is unreachable
    fallbacks:
      heading: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      code: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace"
      mono: "SFMono-Regular, 'SF Mono', ui-monospace, Consolas, 'Liberation Mono', Menlo, monospace"
```

就这么简单——不需要覆盖模板，也不需要自定义 CSS。

{{< callout type="warning" >}}
设置 `enable: true` 时，请定义 `heading`、`body` 和 `code` 以及它们的 `fallbacks`，CSS 变量生成会读取全部内容。`mono` 是例外 —— 它是可选的，省略时会回退到普通等宽字体栈。
{{< /callout >}}

## 参数

| 参数                | 类型    | 说明                                                                                                            |
| ------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| `enable`            | boolean | 总开关。为 `false`（或省略）时，主题使用系统字体栈，不从 Google 加载任何内容。                                  |
| `<group>.family`    | string  | 与 Google Fonts 完全一致的字体家族名称，例如 `"Inter"`、`"JetBrains Mono"`。允许包含空格——会自动进行 URL 编码。 |
| `<group>.axes`      | string  | 来自 Google Fonts 嵌入 URL 的可变字体 axes 规格（见下文）。                                                     |
| `<group>.display`   | string  | `font-display` 策略：`auto`、`block`、`swap`、`fallback` 或 `optional`。除非有特殊理由，否则使用 `swap`。       |
| `fallbacks.<group>` | string  | 追加在 Google 字体之后的 CSS 字体栈。                                                                           |

`<group>` 为 `heading`、`body`、`code` 或 `mono` 之一。

## `code` 与 `mono` 的区别

两者是有意分开的。

`code` 用于**供阅读的代码** —— 代码块、行内代码、语法高亮、gist、导入的源码以及笔记本单元格源码。

`mono` 用于**等宽的界面元素** —— `<kbd>` 按键、`<samp>` 输出、搜索快捷键徽标、笔记本执行计数、色板十六进制标签，以及任何使用 `font-mono` 工具类的地方。它们属于界面，而非代码。

`mono` 是唯一可选的分组。省略 `family` 时，这些位置仅使用 `fallbacks.mono` 字体栈，不产生任何请求。

并非所有 Google Fonts 家族都是可变字体。IBM Plex Mono 只接受离散字重 —— `wght@400;500;600` —— 像 `wght@400..600` 这样的范围会被以 HTTP 400 拒绝。

## 查找 `axes` 值

Google Fonts 已从简单的字重列表转向基于 axes 的 URL 格式。获取正确值的方法：

{{% steps %}}

### 挑选字体

打开 [fonts.google.com](https://fonts.google.com/)，选择一款字体，挑选你需要的样式/字重，然后点击 **Get font** → **Get embed code**。

### 复制嵌入 URL

嵌入代码中包含类似这样的链接：

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

### 提取 family 和 axes

`:` 之前的所有内容是 family（`Inter`）；`:` 和 `&` 之间的所有内容是 axes 字符串（`ital,wght@0,400;0,500;0,600;0,700;1,400`）。

{{% /steps %}}

常见的 axes 模式：

| 模式                       | 含义                                               |
| -------------------------- | -------------------------------------------------- |
| `wght@400;700`             | 静态字重 400 和 700                                |
| `wght@100..800`            | 完整可变字重范围 100–800（可变字体只需一个小文件） |
| `ital,wght@0,400;1,400`    | 字重 400 的常规体和斜体                            |
| `opsz,wght@6..12,200..900` | 光学尺寸 + 字重范围                                |

{{< callout type="info" >}}
对于可变字体，优先使用范围语法（`wght@100..800`）——一次请求即可获得所有字重，而不是每个静态字重一个文件。
{{< /callout >}}

## 内部工作原理

三个部分协同工作，全部在构建时完成（没有客户端 JavaScript）：

{{% steps %}}

### `layouts/_partials/google-fonts.html`

由 `head.html` 引入。当 `params.fonts.enable` 为 true 时，它会为 `fonts.googleapis.com` 和 `fonts.gstatic.com` 输出 `<link rel="preconnect">` 提示，然后为每个已配置的字体组输出一个样式表 `<link>`，由 `family`、`axes` 和 `display` 拼装出 `css2` URL。每个字体组都包裹在 `with` 中，因此未配置的组不会产生任何请求。

### `assets/css/variables.css`

这个文件会作为 Hugo 模板执行（`resources.ExecuteAsTemplate`），因此可以在构建时读取站点参数。它在 `:root` 上定义三个 CSS 自定义属性：

```css
:root {
  --font-heading: "Sora", system-ui, ...;
  --font-body: "Inter", system-ui, ...;
  --font-code: "JetBrains Mono", ui-monospace, ...;
}
```

字体被禁用时，这些变量会解析为普通的系统字体栈——其余的 CSS 完全无需感知差异。

### `assets/css/fonts.css`

应用这些变量：`html` 使用 `var(--font-body)`，`h1`–`h6`（以及排版插件的标题）使用 `var(--font-heading)`，`pre`、`code`、`kbd`、`samp` 和 Hextra 代码块使用 `var(--font-code)`。在生产构建中，该文件会在 `head.html` 中被拼接进编译后的样式表。

{{% /steps %}}

## 配置方案

### 全站统一字体

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
    heading: { family: "Inter", axes: "wght@100..900", display: "swap" }
    body:    { family: "Inter", axes: "wght@100..900", display: "swap" }
    code:    { family: "JetBrains Mono", axes: "wght@400;500", display: "swap" }
    fallbacks:
      heading: "system-ui, sans-serif"
      body: "system-ui, sans-serif"
      code: "ui-monospace, monospace"
```

### 杂志风格（衬线标题）

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
    heading: { family: "Fraunces", axes: "opsz,wght@9..144,300..900", display: "swap" }
    body:    { family: "Source Sans 3", axes: "wght@300..700", display: "swap" }
    code:    { family: "IBM Plex Mono", axes: "wght@400;500", display: "swap" }
    fallbacks:
      heading: "Georgia, 'Times New Roman', serif"
      body: "system-ui, sans-serif"
      code: "ui-monospace, monospace"
```

### 本演示站点

你正在阅读的这个站点标题使用 Sora，正文使用 Mozilla Text，代码使用 Google Sans Code——实际配置参见 [`docs/hugo.yaml`](https://github.com/homelabcentral/hextra/blob/main/docs/hugo.yaml)。

## 故障排查

- **字体没有变化** —— 检查字体家族名称是否与 Google Fonts 完全一致（包括空格和大小写），并强制刷新：样式表链接只在 `params.fonts.enable` 为 true 时才会出现。
- **某些字重呈现为伪粗体** —— 请求的 `axes` 中不包含该字重。添加它（或改用范围语法）。
- **加载时出现布局偏移** —— 这是 `display: swap` 的预期行为；选择字体度量相近的回退字体栈可以缓解，或使用 `display: optional` 在慢速网络下优先使用回退字体。
- **隐私/GDPR** —— 字体由 Google 的 CDN 提供。如果必须自托管，请保持 `fonts.enable: false`，改为在 `assets/css/custom.css` 中添加 `@font-face` 规则，然后自行设置 `--font-heading`/`--font-body`/`--font-code` 变量。
