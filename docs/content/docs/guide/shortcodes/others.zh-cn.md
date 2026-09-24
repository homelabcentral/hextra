---
title: 其他短代码
linkTitle: 其他
next: /docs/guide/deploy-site
---

{{< callout type="warning" >}}
其中部分为Hugo内置短代码。
这些短代码稳定性较低，可能随时变更。
{{< /callout >}}

## 徽章

### 示例

{{< badge "default" >}}
{{< badge content="border" border=false >}}
{{< badge content="color" color="green" >}}
{{< badge content="link" link="https://github.com/homelabcentral/hextra/releases" >}}
{{< badge content="icon" icon="sparkles" >}}
### 使用

#### 默认

{{< badge "徽章" >}}
```
{{</* badge "徽章" */>}}
```

#### 颜色

{{< badge content="徽章" >}}
{{< badge content="徽章" color="purple" >}}
{{< badge content="徽章" color="indigo" >}}
{{< badge content="徽章" color="blue" >}}
{{< badge content="徽章" color="green" >}}
{{< badge content="徽章" color="yellow" >}}
{{< badge content="徽章" color="amber" >}}
{{< badge content="徽章" color="orange" >}}
{{< badge content="徽章" color="red" >}}
```
{{</* badge content="徽章" */>}}
{{</* badge content="徽章" color="purple" */>}}
{{</* badge content="徽章" color="indigo" */>}}
{{</* badge content="徽章" color="blue" */>}}
{{</* badge content="徽章" color="green" */>}}
{{</* badge content="徽章" color="yellow" */>}}
{{</* badge content="徽章" color="amber" */>}}
{{</* badge content="徽章" color="orange" */>}}
{{</* badge content="徽章" color="red" */>}}
```

{{< badge content="徽章" border=false >}}
{{< badge content="徽章" color="purple" border=false >}}
{{< badge content="徽章" color="indigo" border=false >}}
{{< badge content="徽章" color="blue" border=false >}}
{{< badge content="徽章" color="green" border=false >}}
{{< badge content="徽章" color="yellow" border=false >}}
{{< badge content="徽章" color="amber" border=false >}}
{{< badge content="徽章" color="orange" border=false >}}
{{< badge content="徽章" color="red" border=false >}}
```
{{</* badge content="徽章" border=false */>}}
{{</* badge content="徽章" color="purple" border=false */>}}
{{</* badge content="徽章" color="indigo" border=false */>}}
{{</* badge content="徽章" color="blue" border=false */>}}
{{</* badge content="徽章" color="green" border=false */>}}
{{</* badge content="徽章" color="yellow" border=false */>}}
{{</* badge content="徽章" color="amber" border=false */>}}
{{</* badge content="徽章" color="orange" border=false */>}}
{{</* badge content="徽章" color="red" border=false */>}}
```

#### 尺寸

{{< badge content="Extra small" size="xs" icon="sparkles" >}}
{{< badge content="Small" size="sm" icon="sparkles" >}}
{{< badge content="Medium" size="md" icon="sparkles" >}}
{{< badge content="Large" size="lg" icon="sparkles" >}}
{{< badge content="Extra large" size="xl" icon="sparkles" >}}

```
{{</* badge content="Extra small" size="xs" icon="sparkles" */>}}
{{</* badge content="Small" size="sm" icon="sparkles" */>}}
{{</* badge content="Medium" size="md" icon="sparkles" */>}}
{{</* badge content="Large" size="lg" icon="sparkles" */>}}
{{</* badge content="Extra large" size="xl" icon="sparkles" */>}}
```

默认值是 `md`，也就是 `size` 出现之前所有徽章的渲染尺寸——新增这个参数不会改变既有站点的外观。图标随档位一起变化，因此徽章不会带上属于其他尺寸的图标。未知的尺寸不是错误：构建时给出警告，并按 `md` 渲染。

两端是为中间档位不擅长的两种场景准备的。`xs` 用于标题旁的计数、版本号或状态这类边注，`xl` 则是希望与正文同样大小阅读的页首徽章。

带链接的 `xs` 或 `sm` 徽章即使药丸本身更小，也会保持 24&times;24 CSS 像素的点击区域，这正是 [WCAG 2.2 SC 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum) 在 AA 级别的要求。标签很短时同样如此：只有一个字符的徽章仍然是 24&times;24 的目标，药丸居中其内。

#### 图标

{{< badge content="Bundled" icon="sparkles" >}}
{{< badge content="Remote" icon="simple:hugo" >}}
{{< badge content="Project file" icon="file:icons/hexagon.svg" >}}

```
{{</* badge content="Bundled" icon="sparkles" */>}}
{{</* badge content="Remote" icon="simple:hugo" */>}}
{{</* badge content="Project file" icon="file:icons/hexagon.svg" */>}}
```

`icon` 接受 [Icon](/docs/guide/shortcodes/icon) 短代码接受的任何名称：`data/icons.yaml` 中的条目、远程的 `provider:name`，或以 `file:` 开头、指向项目内某个 SVG 的路径。

`file:` 路径先按当前页面包（page bundle）的资源解析，再回退到站点的 `assets/` 目录——`file:icons/hexagon.svg` 会找到 `assets/icons/hexagon.svg`。文件是内联展开而非外链，因此它像其他图标一样按 `size` 档位缩放；不带 `fill` 或 `stroke` 的 SVG 会通过 `currentColor` 继承徽章的文字颜色。只有根 `<svg>` 元素会被改写，所以文件内嵌套的 `<svg>` 会保留它自己的尺寸与类名。没有 `viewBox` 的文件也能保持比例。

只支持 SVG。指向 PNG 的路径，或指向并不存在的文件，会让构建失败，而不是渲染成空白。

#### 变体

{{< badge content="徽章" icon="sparkles" >}}
{{< badge content="Releases" link="https://github.com/homelabcentral/hextra/releases" icon="github" >}}
```
{{</* badge content="徽章" icon="sparkles" */>}}
{{</* badge content="Releases" link="https://github.com/homelabcentral/hextra/releases" icon="github" */>}}
```

### 选项

| 姓名      | 描述                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| `content` | 徽章的文字。                                                                                               |
| `link`    | 徽章的链接。                                                                                               |
| `icon`    | 徽章的图标。可以是内置名称、远程的 `provider:name`，或指向项目内 SVG 的 `file:<path>`。                     |
| `size`    | 徽章的尺寸。<br/> `xs`, `sm`, `md` (默认), `lg`, `xl`.                                                      |
| `color`   | 徽章的颜色。 <br/> `gray` (默认), `purple`, `indigo`, `blue`, `green`, `yellow`, `amber`, `orange`, `red`. |
| `class`   | 徽章的等级。                                                                                               |
| `border`  | 添加或删除边框 (默认：true).                                                                               |

## YouTube

嵌入YouTube视频。

```
{{</* youtube 视频ID */>}}
```

效果：

{{< youtube id=dQw4w9WgXcQ loading=lazy >}}

更多信息，请参阅 [Hugo 的 YouTube 短代码](https://gohugo.io/content-management/shortcodes/#youtube)。

## PDF

通过PDF短代码可在内容中嵌入PDF文件。

```
{{</* pdf "https://example.com/sample.pdf" */>}}
```

也可将PDF文件置于项目目录中并使用相对路径。

```
{{</* pdf "path/to/file.pdf" */>}}
```

示例：

{{< pdf "https://upload.wikimedia.org/wikipedia/commons/1/13/Example.pdf" >}}
