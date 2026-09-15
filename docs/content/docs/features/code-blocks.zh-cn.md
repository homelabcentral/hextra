---
title: 代码块
weight: 4
---

Hextra 重新设计了代码块样式，使其更清爽、更有“编辑器感”：两种模式下均有可见边框、更小的圆角、基于调色板的背景，以及强调色的行高亮。所有改动都位于 `assets/css/highlight.css`，无需任何配置——它们会应用于每一个围栏代码块。

<!--more-->

## 行高亮

按 Hugo 的标准方式高亮行；它们会使用[强调色调色板](accent-color)着色：

````markdown {filename="Markdown"}
```go {hl_lines=[3,4]}
package main

import "fmt"       // highlighted
func main() {}     // highlighted
```
````

渲染效果如下：

```go {hl_lines=[3,4]}
package main

import "fmt"       // highlighted
func main() {}     // highlighted
```

渲染方式：

- **浅色模式**：`hextra-accent-200` 背景（60% 不透明度），配合 2px 的 `hextra-accent-500` 左边框
- **深色模式**：`hextra-accent-950` 背景（60% 不透明度），配合相同的 `hextra-accent-500` 边框

由于使用的是强调色令牌，更换强调色会自动为高亮重新着色。

## 行号

带有 `linenos=table` 的代码块会获得特殊的边框处理。Chroma 将带行号的代码渲染为一个双单元格表格（行号 | 代码），这会破坏简单的边框方案。边框会被拆分到两个单元格上：

- 第一个单元格（`.lntd:first-child pre`）：左边框 + 上下边框，左侧圆角
- 最后一个单元格（`.lntd:last-child pre`）：右边框 + 上下边框，右侧圆角

最终效果是环绕整个表格的一条连续边框。代码单元格内的高亮行也会去掉左侧强调色边框（否则它会出现在块中间，即行号和代码之间）。

````markdown {filename="Markdown"}
```go {linenos=table,hl_lines=[2]}
package main
func main() {}
```
````

渲染效果如下：

```go {linenos=table,hl_lines=[2]}
package main
func main() {}
```

## 文件名标题栏

````markdown {filename="Markdown"}
```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
```
````

渲染效果如下：

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
```

文件名栏紧贴在代码块顶部，拥有自己的边框和调色板背景（浅色为 `neutral-200`，深色为 `neutral-800`），视觉上就像一个编辑器标签页。

## 文件类型图标

设置了文件名时，标题栏会显示一个与文件扩展名匹配的单色图标（找不到时回退到代码围栏的语言）。图标继承标题栏的文字颜色，因此会自动适配浅色和深色模式：

````markdown {filename="Markdown"}
```js {filename="app.js"}
console.log("Hello!");
```
````

渲染效果如下：

```js {filename="app.js"}
console.log("Hello!");
```

默认图标使用 [Simple Icons](https://simpleicons.org) 提供的语言和工具图标，并已内置于主题中，因此离线构建也能正常工作。可以通过 `icon` 属性为单个代码块覆盖解析出的图标，通过创建自己的 `data/codeblock-icons.yaml` 扩展扩展名/语言映射，或者完全禁用该功能：

```yaml {filename="hugo.yaml"}
params:
  highlight:
    filenameIcon:
      enable: false
```

完整参考请参阅[语法高亮](../guide/syntax-highlighting#file-type-icon)。

## 综合使用

文件名、行号和强调色高亮可以组合使用：

````markdown {filename="Markdown"}
```python {filename="hello.py",linenos=table,hl_lines=[2,5]}
def say_hello():
    print("Hello!")

def main():
    say_hello()
```
````

渲染效果如下：

```python {filename="hello.py",linenos=table,hl_lines=[2,5]}
def say_hello():
    print("Hello!")

def main():
    say_hello()
```

## 代码字体

启用 [Google Fonts](google-fonts) 后，代码块（以及行内代码）会通过 `var(--font-code)` 使用配置的 `code` 字体——无需额外设置。

## 自定义

一切都由调色板和强调色令牌驱动，因此常规的覆盖方式同样适用——在 `assets/css/custom.css` 中设置变量。注意 `--hx-` 前缀：Hextra 以 `@import "tailwindcss" prefix(hx)` 引入 Tailwind，连同输出的自定义属性一起加了前缀，因此不带前缀的 `--color-neutral-950` 并不是任何地方会读取的名字：

```css {filename="assets/css/custom.css"}
:root {
  /* Lighter code block background in dark mode */
  --hx-color-neutral-950: oklch(9% 0 0);
}
```

对于结构性改动（圆角、边框宽度），直接覆盖对应的类：

```css {filename="assets/css/custom.css"}
.hextra-code-block pre:not(.lntable pre) {
  border-radius: 0.5rem; /* back to a rounder look */
}
```
