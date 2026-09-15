---
title: Favicon
weight: 5
---

favicon 资源集中放在专门的 `static/icons/` 目录中，并支持跟随访问者操作系统配色方案的**自动深色模式 favicon**。

<!--more-->

## 目录结构

favicon 不再散放在 `static/` 中，而是放在 `static/icons/` 下：

{{< filetree/container >}}
{{< filetree/folder name="static" >}}
{{< filetree/folder name="icons" >}}
{{< filetree/file name="favicon.ico" >}}
{{< filetree/file name="favicon.svg" >}}
{{< filetree/file name="favicon-dark.svg" >}}
{{< filetree/file name="favicon-16x16.png" >}}
{{< filetree/file name="favicon-32x32.png" >}}
{{< filetree/file name="apple-touch-icon.png" >}}
{{< filetree/file name="android-chrome-192x192.png" >}}
{{< filetree/file name="android-chrome-512x512.png" >}}
{{< /filetree/folder >}}
{{< filetree/file name="site.webmanifest" >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

`layouts/_partials/favicons.html`、`assets/js/core/favicon.js` 和 `static/site.webmanifest` 引用的都是 `icons/` 路径，因此站点的图标文件必须放在 `static/icons/` 中，而不是 `static/`。

## 深色模式 favicon

在 `favicon.svg` 旁边放一个 `favicon-dark.svg`：

- 构建时，`favicon.js` 会检查 `fileExists "static/icons/favicon-dark.svg"`——如果该文件不存在，则完全不会生成切换代码。
- 运行时，脚本监听 `window.matchMedia("(prefers-color-scheme: dark)")`，并在操作系统配色方案变化时，实时地将 SVG favicon `<link>`（`id="favicon-svg"`）的 `href` 在 `icons/favicon.svg` 和 `icons/favicon-dark.svg` 之间切换。

{{< callout type="info" >}}
切换跟随的是**操作系统**的配色方案，而不是站点的主题切换——浏览器标签页的 UI 由操作系统主题渲染，因此这与用户在 favicon 周围实际看到的效果一致。
{{< /callout >}}

## 设置你自己的图标

{{% steps %}}

### 生成图标集

使用 [RealFaviconGenerator](https://realfavicongenerator.net/) 等生成器，从单个 SVG 或高分辨率 PNG 生成。你需要上面列出的八个文件。

### 创建深色变体

将 `favicon.svg` 复制为 `favicon-dark.svg`，并针对深色标签页调整填充色（通常是：深色描边变为浅色）。如果你的图标在两种背景下都表现良好，可以跳过此文件——主题会优雅降级。

### 放置文件

将所有文件放入 `static/icons/`，`site.webmanifest` 保留在 `static/` 根目录。

{{% /steps %}}
