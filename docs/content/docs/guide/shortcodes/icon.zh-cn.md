---
title: 图标
next: /docs/guide/shortcodes/steps
---

要在行内使用此短代码，需在配置中启用行内短代码功能：

```yaml {filename="hugo.yaml"}
enableInlineShortcodes: true
```

可用图标列表可在 [`data/icons.yaml`](https://github.com/homelabcentral/hextra/blob/main/data/icons.yaml) 中找到。

<!--more-->

## 示例

{{< icon "academic-cap" >}}
{{< icon "cake" >}}
{{< icon "gift" >}}
{{< icon "sparkles" >}}

## 使用方法

```
{{</* icon "github" */>}}
```

默认支持 [Heroicons](https://v1.heroicons.com/) v1 轮廓风格图标。

### 如何添加自定义图标

创建 `data/icons.yaml` 文件，按以下格式添加您的 SVG 图标：

```yaml {filename="data/icons.yaml"}
your-icon: <svg>您的图标 SVG 内容</svg>
```

随后即可通过短代码调用：

```
{{</* icon "your-icon" */>}}

{{</* card icon="your-icon" */>}}
```

提示：[Iconify Design](https://iconify.design/) 是寻找此类可复制 SVG 图标的优质资源平台。你也可以完全不复制，直接使用下文“远程图标包”中介绍的 `iconify:` 提供商前缀。

### 远程图标包

远程图标可以通过提供商前缀按需加载。Hextra 支持以下提供商：

| 提供商                                          | 示例                                    | 图标                              |
| ----------------------------------------------- | --------------------------------------- | --------------------------------- |
| [Lucide](https://lucide.dev/icons/)             | `{{</* icon "lucide:house" */>}}`       | {{< icon "lucide:house" >}}       |
| [Tabler Icons](https://tabler.io/icons)         | `{{</* icon "tabler:user" */>}}`        | {{< icon "tabler:user" >}}        |
| [Tabler Icons](https://tabler.io/icons)（填充） | `{{</* icon "tabler-filled:star" */>}}` | {{< icon "tabler-filled:star" >}} |
| [Simple Icons](https://simpleicons.org/)        | `{{</* icon "simple:hugo" */>}}`        | {{< icon "simple:hugo" >}}        |
| [Iconify](https://icon-sets.iconify.design/)    | `{{</* icon "iconify:mdi/server" */>}}` | {{< icon "iconify:mdi/server" >}} |

远程图标会在构建时获取，且无需任何配置：远程获取默认开启。若要关闭它或添加自定义提供商，请参阅[配置]({{% relref "docs/guide/configuration" %}})页中的“远程图标”一节。

前四个提供商指向单个图标包的扁平命名空间，因此名称就是该包中的文件名。Iconify 不同：它的名称是 `set/icon` 组合，可覆盖 [icon-sets.iconify.design](https://icon-sets.iconify.design/) 上的所有图标集 —— `iconify:mdi/server`、`iconify:simple-icons/reddit`。

默认提供商从以下 CDN URL 加载，其中 `%s` 会被替换为图标名称：

```yaml
lucide: "https://unpkg.com/lucide-static@1/icons/%s.svg"
tabler: "https://unpkg.com/@tabler/icons@3/icons/outline/%s.svg"
tabler-filled: "https://unpkg.com/@tabler/icons@3/icons/filled/%s.svg"
simple: "https://cdn.jsdelivr.net/npm/simple-icons@16/icons/%s.svg"
iconify: "https://api.iconify.design/%s.svg"
```

Tabler 将填充与描边两种变体放在不同目录，因此对应两个前缀：描边用 `tabler:`，填充用 `tabler-filled:`。填充集合小得多，且不含品牌标志 —— `tabler:brand-docker` 存在，`tabler-filled:brand-docker` 不存在。

Lucide、Tabler 和 Simple Icons 固定到软件包的主版本。Iconify 的 URL 是一个没有版本可固定的实时 API，因此即使你的仓库没有任何改动，它返回的字节也可能在两次构建之间发生变化。若这一点很重要，请把该 SVG 复制到你自己的 `data/icons.yaml` 中。

名称在不同提供商之间并不通用，看似合理的猜测通常是错的。`simple:hackernews` 会失败，因为 Simple Icons 使用该图标的法律名称收录它 —— `simple:ycombinator`。请查阅提供商自己的索引，而不要靠猜。

> [!NOTE]
> 未知的图标名称是构建错误，而不是一处空白：构建会以 `icon "..." not found` 中止。这能在 CI 中拦住拼写错误，同时也意味着一个返回 404 的远程名称会让构建失败。

远程图标名称可用于 Hextra 中任何接受图标名称的位置，包括卡片、标签页、徽章、提示框和导航栏菜单项。

## 选项

| 范围         | 描述         |
| ------------ | ------------ |
| `name`       | 图标名称     |
| `attributes` | 图标的属性。 |
