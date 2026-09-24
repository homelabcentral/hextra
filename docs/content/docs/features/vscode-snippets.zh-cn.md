---
title: VS Code 代码片段
weight: 7
---

Hextra 提供 `.vscode/hextra.code-snippets` —— 115 个手写的 VS Code 代码片段，覆盖每一个 Hextra shortcode、布局所读取的页面 front matter 键，以及渲染钩子能识别的代码围栏属性。在 VS Code 中打开仓库即可立即使用；不需要扩展，也不需要配置。

<!--more-->

## 为什么需要

Hextra 的功能只能通过阅读文档来发现。撰写页面意味着要记住卡片标签颜色是 `tagColor`（而不是 `tagType`）、马赛克画廊项使用 `span="wide"`、行高亮写作 `hl_lines=[2,4]`，还有五个 shortcode 需要使用[百分号写法](#notation-is-not-uniform)而不是常见的尖括号。这些代码片段把这一切都收纳到一个前缀加一次 `Tab` 之后。

文件中的每个参数名都取自 `layouts/_shortcodes/` 中的 `.Get "…"` 调用，每个枚举值都取自 `layouts/_partials/shortcodes/` 中的样式映射——而不是可能过时的文档。

## 使用方法

在任意 Markdown 文件中键入前缀并按 `Tab`。所有前缀都以 `hx` 开头，因此绝不会与通用的 Markdown 代码片段冲突：

| 前缀      | 覆盖范围        |
| --------- | --------------- |
| `hx`      | 所有 shortcode  |
| `hxfm-`   | Front matter 块 |
| `hxcode-` | 围栏代码块变体  |

枚举参数是**选项占位符**——用 `Tab` 跳到它们上面时，VS Code 会以下拉框形式列出有效值，而不是让你自由输入：

| 参数                           | 选项                                                                    |
| ------------------------------ | ----------------------------------------------------------------------- |
| `callout type`                 | `default` `info` `warning` `error` `important`                          |
| `badge color`, `card tagColor` | `gray` `purple` `indigo` `blue` `green` `yellow` `orange` `amber` `red` |
| `gallery type`                 | `grid` `mosaic` `masonry` `carousel`                                    |
| `gallery-item span`            | `wide` `tall` `large`                                                   |
| `filetree/folder state`        | `open` `closed`                                                         |
| `card method`                  | `Resize` `Fit` `Fill` `Crop`                                            |
| `width` (front matter)         | `normal` `wide` `full`                                                  |
| `linenos`                      | `table` `inline`                                                        |

因此 `hxcallout` + `Tab` 会先带你进入 type 下拉框，然后是内容主体：

```markdown
{{</* callout type="info" */>}}
Content
{{</* /callout */>}}
```

## 写法并不统一

有五个 shortcode 使用百分号分隔符，以便其内部内容按 Markdown 渲染；其余的使用尖括号。用错会导致内容被渲染成字面文本。代码片段为每个 shortcode 内置了正确的写法：

| 写法            | Shortcode                                   |
| --------------- | ------------------------------------------- |
| `{{%/* … */%}}` | `steps`, `details`, `include`, `ltr`, `rtl` |
| `{{</* … */>}}` | 其余全部                                    |

## 参考

### Shortcode

| 前缀                    | 插入内容                                             |
| ----------------------- | ---------------------------------------------------- |
| `hxcallout`             | 提示框；type 决定颜色和默认图标                      |
| `hxcallout-emoji`       | 带自定义 emoji 的提示框                              |
| `hxcallout-icon`        | 带指定图标名的提示框                                 |
| `hxcards`               | 含两张卡片的卡片网格容器                             |
| `hxcard`                | 单张卡片——链接、标题、图标、副标题                   |
| `hxcard-tag`            | 带徽章标签的卡片——`tagColor`、`tagIcon`、`tagBorder` |
| `hxcard-image`          | 图片卡片——`method`/`options` 传给 Hugo 图片处理      |
| `hxtabs`                | 含两个标签页的标签页界面                             |
| `hxtab`                 | 单个标签页——`name`、`icon`、`selected`               |
| `hxsteps`               | 使用 h3 标题的编号步骤列表                           |
| `hxdetails`             | 可折叠区块                                           |
| `hxfiletree`            | 含一个文件夹和一个文件的文件树                       |
| `hxfiletree-folder`     | 文件夹节点                                           |
| `hxfiletree-file`       | 文件节点                                             |
| `hxgallery`             | 含两个项目的画廊容器                                 |
| `hxgallery-item`        | 本地画廊图片                                         |
| `hxgallery-item-remote` | 远程画廊图片，带必需的 `width`/`height`              |
| `hxbadge`               | 徽章——内容、颜色、图标                               |
| `hxbadge-inline`        | 徽章，位置参数简写形式                               |
| `hxbadge-link`          | 包在链接中的徽章                                     |
| `hxicon`                | 内置 SVG 图标                                        |
| `hxicon-remote`         | 远程图标——`lucide:` / `tabler:` / `simple:`          |
| `hxjupyter`             | Jupyter notebook 嵌入                                |
| `hxpdf`                 | PDF 嵌入                                             |
| `hxasciinema`           | 带播放选项的 Asciinema 录像                          |
| `hxterm`                | 术语表词条                                           |
| `hxinclude`             | 内联引入另一页面的内容                               |
| `hxaccordion`           | 含两个折叠区块的手风琴容器                           |
| `hxaccordion-item`      | 单个手风琴区块                                       |
| `hxarticle`             | 指向站内另一页面的卡片 —— 标题、摘要、封面           |
| `hxbutton`              | 通过 `href` 生成的按钮式链接                         |
| `hxbutton-page`         | 通过 `pageRef` 链接到站内页面的按钮                  |
| `hxcta`                 | 行动号召按钮                                         |
| `hxlead`                | 导语段落                                             |
| `hxborderless`          | 无单元格边框的参考表格                               |
| `hxkeywords`            | 含两个关键词的关键词容器                             |
| `hxkeyword`             | 单个关键词                                           |
| `hxstats`               | 含两项指标的指标网格                                 |
| `hxstat`                | 单项指标                                             |
| `hxtimeline`            | 含一个条目的时间线容器                               |
| `hxtimeline-item`       | 单个时间线条目 —— `badge`、`badgeColor`、`badgeIcon`、`icon` |
| `hxswatches`            | 由位置参数十六进制色值组成的调色板                   |
| `hxlist`                | 按 `where`/`value` 过滤的页面列表                    |
| `hxad`                  | 在此处插入一个广告 — 需要配置 `params.ads`           |
| `hxadprovider`          | 指定广告网络、格式与对齐方式的广告                   |
| `hxchart`               | 由内联配置生成的 Chart.js 图表                       |
| `hxtypeit`              | 打字机效果，每行一条字符串                           |
| `hxvideo`               | 带播放控件的自托管视频                               |
| `hxvideo-autoplay`      | 背景式视频 —— autoplay 隐含 muted                    |
| `hxyoutube`             | 点击后才加载播放器的 YouTube 嵌入                    |
| `hxemail`               | 经过混淆的 mailto 链接                               |
| `hxgithub`              | GitHub 仓库卡片                                      |
| `hxgitlab`              | 按命名空间路径的 GitLab 项目卡片                     |
| `hxgitlab-id`           | 按数字 ID 的 GitLab 项目卡片                         |
| `hxgitea`               | Gitea 仓库卡片                                       |
| `hxforgejo`             | Forgejo 仓库卡片                                     |
| `hxcodeberg`            | Codeberg 仓库卡片                                    |
| `hxhuggingface`         | Hugging Face 模型卡片                                |
| `hxhuggingface-dataset` | Hugging Face 数据集卡片                              |
| `hxansible`             | Ansible Galaxy 角色卡片                              |
| `hxansible-collection`  | Ansible Galaxy 集合卡片                              |
| `hxgist`                | 以主题代码块渲染的 GitHub gist                       |
| `hxgist-live`           | 在读者浏览器中刷新的 gist                            |
| `hxcodeimporter`        | 将 URL 上的文件作为代码块引入                        |
| `hxcodeimporter-lines`  | 带行号与高亮的引入片段                               |
| `hxcodeimporter-live`   | 在读者浏览器中刷新的引入文件                         |
| `hxltr`                 | 在 RTL 页面中强制从左到右                            |
| `hxrtl`                 | 在 LTR 页面中强制从右到左                            |
| `hxhero`                | `hextra-home` 页面的完整 hero 区块                   |
| `hxhero-container`      | 带侧边图片的 hero 容器                               |
| `hxhero-headline`       | Hero 主标题                                          |
| `hxhero-subtitle`       | Hero 副标题                                          |
| `hxhero-badge`          | 主标题上方的药丸徽章                                 |
| `hxhero-button`         | Hero 行动号召按钮                                    |
| `hxhero-section`        | 首页布局的章节标题                                   |
| `hxfeature-grid`        | 含两张卡片的特性网格                                 |
| `hxfeature-card`        | 特性卡片                                             |
| `hxfeature-card-image`  | 带背景图和渐变的特性卡片                             |

### Front matter

| 前缀           | 插入内容                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| `hxfm-docs`    | 文档页——`title`、`weight`、`toc`、`breadcrumbs`、`math`、`excludeSearch` |
| `hxfm-section` | 章节 `_index.md` —— `prev`/`next`、`sidebar.open`、`cascade.type`        |
| `hxfm-blog`    | 博客文章——`date`、`authors`、`tags`                                      |
| `hxfm-series`  | 系列配置块——`series`、`seriesOrder`、`seriesOpened`                      |
| `hxfm-home`    | 首页——`layout: hextra-home`                                              |
| `hxfm-sidebar` | `sidebar:` 块——`open`、`exclude`、`hide`                                 |
| `hxfm-width`   | 页面宽度覆盖——`normal` 80rem、`wide` 90rem、`full` 100%                  |
| `hxfm-cascade` | 向子页面级联参数（例如 `reversePagination`）                             |

### 代码块

| 前缀             | 插入内容                                           |
| ---------------- | -------------------------------------------------- |
| `hxcode`         | 带 `filename` 标题栏的代码围栏                     |
| `hxcode-lines`   | 带 `linenos`、`hl_lines`、`linenostart` 的代码围栏 |
| `hxcode-baseurl` | 文件名标题栏通过 `base_url` 链接到源码的代码围栏   |
| `hxmermaid`      | Mermaid 图表围栏                                   |
| `hxmath`         | 展示型数学公式块（需要 `math: true`）              |

## 文件格式

每个代码片段是一个 JSON 对象。每个条目都限定 `scope` 为 `markdown`，带有一条注明其数据来源的 `description`，并使用 `${n|a,b|}` 表示枚举：

```json {filename=".vscode/hextra.code-snippets"}
{
  "Hextra: callout": {
    "scope": "markdown",
    "prefix": "hxcallout",
    "body": ["{{</* callout type=\"${1|default,info,warning,error,important|}\" */>}}", "  ${2:Content}", "{{</* /callout */>}}"],
    "description": "Callout box. Each type picks its own color and default icon (layouts/_shortcodes/callout.html)."
  }
}
```

VS Code 会自动加载 `.vscode/` 中的任何 `*.code-snippets` 文件，因此 `settings.json` 中没有任何相关引用。

{{< callout type="info" >}}
已弃用的参数被有意排除在外。`tabs` 仍接受 `items=` 和 `defaultIndex=`，`card` 仍接受 `tagType=`，但这三者都会在构建时触发 `warnf`——代码片段改用 `tab name=`、`tab selected=` 和 `tagColor=`。
{{< /callout >}}

## 保持同步

这些代码片段是手写的，因此当某个 shortcode 新增或重命名参数时可能会过时。下面这条单行命令会将文件中的每个 `param=` 与主题中实际的 `.Get` 调用进行交叉核对，并打印所有不匹配项：

```bash
node -e '
const fs=require("fs"), cp=require("child_process");
const s=JSON.parse(fs.readFileSync(".vscode/hextra.code-snippets","utf8"));
const known={};
for(const f of cp.execSync("find layouts/_shortcodes -name \x27*.html\x27").toString().trim().split("\n")){
  const name=f.replace("layouts/_shortcodes/","").replace(/\.html$/,"");
  known[name]=new Set([...fs.readFileSync(f,"utf8").matchAll(/\.Get "([a-zA-Z0-9_-]+)"/g)].map(m=>m[1]));
}
const bad=[];
for(const [t,sn] of Object.entries(s))
  for(const m of sn.body.join("\n").matchAll(/\{\{[<%] ([a-zA-Z0-9\/-]+)([^}]*)/g)){
    if(m[1].startsWith("/")) continue;
    if(!(m[1] in known)){ bad.push(`${t}: unknown shortcode ${m[1]}`); continue; }
    for(const p of m[2].matchAll(/([a-zA-Z0-9_]+)=/g))
      if(!known[m[1]].has(p[1])) bad.push(`${t}: ${m[1]} has no param ${p[1]}`);
  }
console.log(bad.length ? bad.join("\n") : "ALL PARAMS MATCH SOURCE");
'
```

在任何涉及 `layouts/_shortcodes/` 的改动之后值得运行一次——参见[开发工具](dev-tooling)。

## 在你自己的站点中使用

该文件是自包含的，不依赖本仓库的目录结构。可以将它复制到任何使用 Hextra 的 Hugo 站点：

```bash
mkdir -p .vscode
curl -o .vscode/hextra.code-snippets \
  https://raw.githubusercontent.com/homelabcentral/hextra/main/.vscode/hextra.code-snippets
```

若想在所有项目中可用而不限于单个项目，将同一文件放入用户代码片段目录：

| 平台    | 路径                                                |
| ------- | --------------------------------------------------- |
| macOS   | `~/Library/Application Support/Code/User/snippets/` |
| Linux   | `~/.config/Code/User/snippets/`                     |
| Windows | `%APPDATA%\Code\User\snippets\`                     |

{{< callout type="warning" >}}
全局安装后，这些代码片段会在你打开的每个 Markdown 文件中触发——包括非 Hugo 项目，在那里 `hxcallout` 插入的语法会被渲染成字面文本。除非你写的内容大部分都是 Hextra，否则建议使用按项目的 `.vscode/` 副本。
{{< /callout >}}

## 它们还会生成 Agent 技能包

这些代码片段同时也服务于 [`skills/hextra/`](https://github.com/homelabcentral/hextra/tree/main/skills/hextra)——一个教编码 Agent 撰写 Hextra 站点的技能包。在那里，shortcode 模板才是权威来源：`npm run build:skill` 直接从 `layouts/_shortcodes/` 读取参数名、默认值和是否必填，而代码片段则提供模板不易表达的枚举值与可复制粘贴的示例。生成器会交叉核对两者，并报告任何使用了模板并不读取的参数的代码片段，因此手写的代码片段不会悄悄偏离实现。
