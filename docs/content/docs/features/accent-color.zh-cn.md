---
title: 强调色
weight: 2
---

Hextra 使用一套以 `oklch` 定义的 **11 级强调色调色板**来设定强调色，而不是全部从一个色相派生。每一级色阶都可以独立调整。

<!--more-->

## 为什么用调色板而不是单一色相？

从单一的色相/饱和度组合派生 10 级色阶，会产生浑浊的中间色调，并且在两端对比度不佳。手工挑选（或由生成器生成）的调色板允许每级色阶独立调整——而且 `oklch` 能在不同色相之间保持感知亮度一致，因此橙色强调色和蓝色强调色在 `500` 这一级*看起来*同样明亮。

这次替换现在已经彻底完成。`--color-primary-*` 色阶以及它背后的三个 HSL 变量都已删除，最后还在用它们的地方——站点上所有的焦点环，以及两处 `contrast-more` 边框——都改为直接使用强调色调色板。已经没有任何 `primary` 颜色可供设置。

## 覆盖强调色

将这十一个变量添加到站点的 `assets/css/custom.css` 中（Hextra 会自动加载该文件）：

```css {filename="assets/css/custom.css"}
:root {
  --color-accent-color-50: oklch(0.977 0.013 236.62);
  --color-accent-color-100: oklch(0.951 0.026 236.824);
  --color-accent-color-200: oklch(0.901 0.058 230.902);
  --color-accent-color-300: oklch(0.828 0.111 230.318);
  --color-accent-color-400: oklch(0.746 0.16 232.661);
  --color-accent-color-500: oklch(0.685 0.169 237.323);
  --color-accent-color-600: oklch(0.588 0.158 241.966);
  --color-accent-color-700: oklch(0.5 0.134 242.749);
  --color-accent-color-800: oklch(0.443 0.11 240.79);
  --color-accent-color-900: oklch(0.391 0.09 240.876);
  --color-accent-color-950: oklch(0.293 0.066 243.157);
}
```

无需重新构建主题——这些是运行时 CSS 变量，在 `custom.css` 中覆盖它们即可一次性重新着色所有使用强调色的元素。

## 使用 UI Colors 生成调色板

获取这十一级色阶值的推荐方式是 [uicolors.app](https://uicolors.app)——一个免费的 Tailwind 风格调色板生成器：

{{% steps %}}

### 输入品牌色

打开 [uicolors.app](https://uicolors.app/create)，在顶部输入框中键入或粘贴你的基础色（十六进制，例如 `#0ea5e9`），或点击随机按钮进行探索。生成器会将你的颜色作为锚点色阶，并围绕它构建完整的 `50`–`950` 色阶梯度。

### 微调梯度

在页面展示的示例 UI 卡片上预览调色板。你可以调整色相、饱和度和亮度曲线，直到中间色阶（`500`/`600`）符合你的品牌，同时两端保持可用（浅色的 `50`/`100` 背景、深色的 `900`/`950` 表面）。

### 导出色阶

点击 **Export** 并选择一种适合 CSS 的格式。以下两个选项可以直接使用：

- **Tailwind (OKLCH)** —— 与主题的原生格式一致，首选
- **Tailwind (HEX)** —— 同样可用；任何有效的 CSS 颜色值都可以

### 将值映射到 `custom.css`

将导出的每级色阶复制到对应的 `--color-accent-color-*` 变量中——`50` 对应 `50`，`100` 对应 `100`，依此类推：

```css {filename="assets/css/custom.css"}
:root {
  /* "tangerine" palette from uicolors.app */
  --color-accent-color-50: oklch(0.98 0.016 73.684);
  --color-accent-color-100: oklch(0.954 0.038 75.164);
  --color-accent-color-200: oklch(0.901 0.076 70.697);
  --color-accent-color-300: oklch(0.837 0.128 66.29);
  --color-accent-color-400: oklch(0.75 0.183 55.934);
  --color-accent-color-500: oklch(0.705 0.213 47.604);
  --color-accent-color-600: oklch(0.646 0.222 41.116);
  --color-accent-color-700: oklch(0.553 0.195 38.402);
  --color-accent-color-800: oklch(0.47 0.157 37.304);
  --color-accent-color-900: oklch(0.408 0.123 38.172);
  --color-accent-color-950: oklch(0.266 0.079 36.259);
}
```

重新加载站点——链接、标签页、高亮以及所有其他使用强调色的元素会立即应用新的调色板。

{{% /steps %}}

## 内部工作原理

`assets/css/styles.css` 中有两个层次：

1. **原始调色板** —— `--color-accent-color-50` … `--color-accent-color-950` 定义在 `:root` 上，默认值为上文所示的蓝色。这是你要覆盖的层。

2. **Tailwind 主题令牌** —— 调色板被映射为 Tailwind v4 颜色令牌：

   ```css
   --color-hextra-accent-500: var(--color-accent-color-500);
   /* ...one line per shade... */
   ```

   由于 Tailwind v4 会从 `--color-*` 变量派生工具类，这使得 `hx:text-hextra-accent-600`、`hx:bg-hextra-accent-200` 和 `hx:border-hextra-accent-500` 等类可以在主题模板中随处使用。

这层间接映射很重要：模板引用的是稳定的 `hextra-accent-*` 令牌，而你的覆盖只触及底层的 `accent-color-*` 层。

## 强调色的应用范围

所有先前使用 HSL 主色的组件现在都使用强调色调色板：

| 组件               | 强调色用途                                        |
| ------------------ | ------------------------------------------------- |
| 标签页             | 选中标签的边框与文字；悬停下划线                  |
| 侧边栏             | 当前项高亮（浅色和深色模式）                      |
| 搜索               | 结果高亮、搜索框聚焦边框                          |
| 标签               | 标签边框                                          |
| 卡片               | 悬停时的卡片边框                                  |
| Hero 按钮          | 聚焦光环                                          |
| 主题切换与语言切换 | 悬停/激活状态                                     |
| 代码块             | 复制按钮、[行高亮](code-blocks#line-highlighting) |
| 链接与首页         | 强调色文字和装饰                                  |

## 色阶使用约定

构建自定义组件时，请遵循与主题相同的约定：

- `50`–`200` —— 柔和的背景（浅色模式高亮、悬停填充）
- `300`–`500` —— 边框、光环、装饰
- `500`–`600` —— “品牌”色阶：链接文字、选中状态
- `700`–`950` —— 深色模式的背景和边框（例如，深色模式下行高亮以 `950` 为背景，配合 `500` 的边框）
