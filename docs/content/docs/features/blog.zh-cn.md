---
title: 博客布局
weight: 8
---

博客是一套可配置的三栏布局：左侧是身份栏，中间是文章列表或正文，右侧是一列小部件。一切都由站点配置中的 `params.blog` 驱动——没有 `params.blog` 配置块的站点会原样渲染单栏标记。

<!--more-->

## 布局一览

| 栏位   | 内容                                                | 配置键                                    |
| ------ | --------------------------------------------------- | ----------------------------------------- |
| 左侧栏 | 头像、名称、标语、导航链接、赞助卡片、语言/主题切换 | `params.blog.rail`                        |
| 中间   | 文章卡片（列表页）或文章正文                        | `params.blog.list`, `params.blog.article` |
| 右侧栏 | 最近更新、置顶文章、热门标签                        | `params.blog.widgets`                     |

每个功能都是可选启用的：定义一个配置块即开启，显式设置 `enable: false` 则将其关闭。侧栏在 `md` 断点以下会被隐藏，此时身份区块改为在内容栏顶部以横幅形式呈现。

## 身份栏

```yaml {filename="hugo.yaml"}
params:
  blog:
    rail:
      onArticle: true # also show the rail on individual posts
      profile:
        avatar: images/space.jpg
        name: Hextra
        tagline: Notes, release announcements and guides.
      sponsor:
        title: Support Hextra
        text: Hextra is built in the open, with no ads and no trackers.
        url: "https://github.com/sponsors/your-account"
        label: Become a sponsor →
        icon: heart
```

- 导航链接来自 `blog` 菜单（配置中的 `menus.blog`）——带有标签的条目会成为侧栏导航。
- 每个元素仅在对应的键存在时才渲染：省略 `sponsor` 就不会出现赞助卡片。
- 侧栏底部固定着与文档侧边栏相同的粘性语言和主题切换面板，无需滚动回顶部即可切换。
- 单个页面可以在 front matter 中通过 `blog: { rail: false }` 选择不显示侧栏。

## 文章卡片

```yaml {filename="hugo.yaml"}
params:
  blog:
    list:
      displayTags: true
      sortBy: date # date | lastmod | publishDate | title | weight
      sortOrder: desc
      pagerSize: 20
      card:
        enable: true
        cover: true
        readingTime: true
        layout: vertical # vertical | horizontal
        termLayout: horizontal # vertical | horizontal
```

启用 `card.enable` 后，列表页会将每篇文章渲染为带封面图、阅读时长和摘要的卡片——并且整张卡片都可点击，而不仅仅是标题。卡片模式下列表页标题会被隐藏，因为侧栏已经标识了页面身份。移除 `card` 配置块即可回退到普通列表。

`layout` 决定博客列表的卡片形状，`termLayout` 决定标签页的卡片形状。`vertical` 把封面放在文字上方，高度随内容增长；`horizontal` 把封面放在行首侧 40%，并从 `sm` 断点起让所有卡片等高。两个取值在两种页面上都可用，上面的默认值与这些键加入之前的渲染结果一致。

卡片摘要依次取自文章前置参数中的 `summary`、`description`，最后才是 Hugo 自己的摘要——`<!--more-->` 之后的文字，没有标记时则取开头几句。只有 `summary` 是卡片专用的：`description` 还会填充 `<meta name="description">` 和 `og:description`，所以当读者该看到的句子和爬虫该索引的句子不同时，两个都要设置。

```yaml {filename="content/blog/shipping-v2.md"}
---
title: "发布 v2"
summary: "为卡片写的两行，精准利落。"
description: "搜索引擎和链接预览会索引的那句话。"
---
```

## 文章页

```yaml {filename="hugo.yaml"}
params:
  blog:
    article:
      displayPagination: true
      cover: true
      readingTime: true
      tags: true
      related:
        count: 3
```

`related.count` 会在文章末尾根据共同标签渲染一个“相关文章”区块。

### 分享按钮

```yaml {filename="hugo.yaml"}
params:
  blog:
    article:
      share:
        links:
          - name: X
            icon: x-twitter
            url: "https://x.com/intent/tweet?url={url}&text={title}"
          - name: Mastodon
            icon: mastodon
            # Mastodon is federated: this targets one instance's /share
            # route. Swap the host for your own.
            url: "https://mastodon.social/share?text={title}%20{url}"
          - name: Copy link
            icon: link
            type: copy
```

`{url}` 和 `{title}` 会被替换为文章的永久链接和标题。设置了 `type: copy`（且没有 `url`）的条目会将永久链接复制到剪贴板，而不是跳转外链。X、LinkedIn、Bluesky、Facebook、Mastodon 和 Telegram 均可使用其标准分享端点——完整配置参见 `docs/hugo.yaml`。

## 系列文章

把相关文章归为一个系列后，系列中的每篇文章都会获得一个可折叠的全系列目录，以及按系列顺序排列的上一篇/下一篇导航。

```yaml {filename="content/blog/guide-google-fonts.md"}
---
title: "Guide: Adding Google Fonts"
series:
  - Guides
seriesOrder: 2
---
```

只有 `series` 是必需的。`seriesOrder` 决定文章在系列中的位置；未设置的文章按 `weight`、再按日期排序，并排在已编号的文章之后。

显示给读者的篇号取决于排序后的位置，而不是 `seriesOrder` 的值。把六篇中的第 3 篇下线后，其余文章会重新编号而不会留下空缺；两篇都写 `seriesOrder: 4` 也不会得到重复的标签。

无需配置 `[taxonomies]`：系列直接从 front matter 解析，并限定在当前语言内，因此不同语言的翻译不会混在一起。站点级选项：

```yaml {filename="hugo.yaml"}
params:
  blog:
    article:
      series:
        enable: true # 该配置块用于启用模块，设为 false 则禁用
        opened: false # 默认展开列表
```

与其他博客功能一样，该模块需要显式启用：添加上面的配置块即可开启；未配置 `params.blog.article.series` 的站点，无论文章是否声明 `series`，渲染结果都与之前完全一致。`series: false` 是 `enable: false` 的简写。单篇文章可用 `seriesOpened: true` 覆盖默认展开状态。

对于系列中的文章，系列导航会取代按日期排序的分页导航，文章末尾只保留一组导航控件，避免两种顺序互相冲突。只有一篇文章的系列不会渲染任何内容，仍使用普通分页导航。

分页导航自身的开关优先级更高，因为它们是显式声明的，而是否属于某个系列则不是：`displayPagination: false` 会同时隐藏两者；在 front matter 中设置了 `prev`/`next`（包括 `prev: false`）的文章，仍保留它自己配置的分页导航。不过系列顺序会覆盖 `reversePagination`——后者只是把同一批文章按日期排列。

为 Blowfish 主题撰写的文章无需修改即可使用：`series_order` 会被当作 `seriesOrder` 的别名。

## 小部件

```yaml {filename="hugo.yaml"}
params:
  blog:
    widgets:
      recent:
        count: 5
      pinned:
        count: 3
      tags:
        count: 12
```

在右侧栏按以下顺序渲染：

- **最近更新** —— 按日期排列的最新文章。
- **置顶** —— front matter 中带有 `pinned: true` 的文章。
- **热门标签** —— 使用最多的标签，链接到各自的标签页。

每个小部件仅在其配置块存在时才显示；`count` 会覆盖默认值（5 / 3 / 10）。

## 标签与归档

标签列表页和单个标签页共用同一套博客外壳——包括侧栏、卡片和小部件——因此按标签浏览的体验与浏览博客本身一致。

归档页按年份对文章分组：

```yaml {filename="hugo.yaml"}
params:
  archives:
    section: blog # source section
    dateFormat: "Jan 02"
```

## 目录中的标签

在文档页和文章页上，页面标签可以以小圆片的形式渲染在目录标题下方：

```yaml {filename="hugo.yaml"}
params:
  toc:
    displayTags: true
```
