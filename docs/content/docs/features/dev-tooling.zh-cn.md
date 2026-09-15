---
title: 开发工具
weight: 6
---

Hextra 在 npm 脚本之上提供了一套完整的开发工作流：自带文档的 **Makefile**、基于 Docker Compose 的 **devcontainer**（内置常驻预览服务器），以及基于 act 的**本地 CI**。

<!--more-->

## Makefile

运行 `make help` 查看完整的带注释列表。按工作流划分的重要目标如下：

### 开发

| 目标             | 作用                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------- |
| `make dev`       | 启动带完整主题管线的开发服务器（每次重新构建时写入 `hugo_stats.json`）                |
| `make serve`     | 启动不带主题管线的开发服务器——只编辑内容时启动更快                                    |
| `make stats`     | 重新生成 `docs/hugo_stats.json`（Tailwind 用于摇树优化的类清单）                      |
| `make css`       | 编译生产环境 CSS——会先重新生成 stats，因此结果始终正确                                |
| `make css-watch` | 文件变化时重新编译 CSS；与 `make dev` 并行运行                                        |
| `make skill`     | 重新生成 `skills/hextra/` 中的技能参考，并依据 `VERSION` 标记 `.claude-plugin/*.json` |

### 撰写内容

| 目标                                   | 作用                                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `make new-blog NAME=my-post`           | 以草稿形式创建博客文章（`docs/content/blog/my-post.md`），带标签、摘要标记和注释掉的 author/cover/pinned 字段 |
| `make new-doc NAME=guide/my-page`      | 创建带标题和标签的文档页；`weight` 保持注释状态以便手动排序                                                   |
| `make new-doc-auto NAME=guide/my-page` | 类似 `new-doc`，但 `weight` 会自动设为该章节最后一页的下一个值                                                |
| `make new-page NAME=showcase/thing`    | 通过默认原型在 `docs/content/` 下创建任意页面                                                                 |

### 构建与预览

| 目标           | 作用                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------- |
| `make build`   | 完整的生产构建，输出到 `docs/public`（先编译 CSS），不含草稿——即最终发布的内容            |
| `make preview` | **包含草稿**的生产构建，由常驻预览容器在 [localhost:8043](http://localhost:8043) 提供服务 |

### 测试

| 目标                              | 作用                                                                                           |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| `make verify`                     | 按顺序执行全部流程——先格式化并重新生成，再重新检查、构建并运行测试套件。提交前使用的命令       |
| `make test`                       | 先执行 `fmt-check` 与 `skill-check`，然后对不含草稿的全新生产构建运行完整 Playwright 测试套件  |
| `make test-a11y`                  | 仅运行无障碍测试（WCAG 2.2 AA）                                                                |
| `make test-mobile` / `test-build` | 移动端菜单和构建输出测试套件                                                                   |
| `make test-preview`               | 重新构建预览（含草稿），然后针对运行中的预览容器执行测试套件——你测试的正是 8043 持续提供的内容 |
| `make fmt-check`                  | 只校验格式而不写入——CI 运行的就是它                                                            |
| `make skill-check`                | 校验生成的技能参考与插件清单是否为最新                                                         |
| `make report`                     | 在 [localhost:9323](http://localhost:9323) 上提供最近一次 Playwright HTML 报告                 |

### 发布

| 目标                       | 作用                                                              |
| -------------------------- | ----------------------------------------------------------------- |
| `make bump VERSION=0.13.0` | 设置 `VERSION`，并将 `.claude-plugin/*.json` 重新标记为同一版本号 |

仓库根目录的 `VERSION` 是整个仓库中唯一的版本号，也是唯一会触发发布的文件：修改它的提交推送到 `main` 后，会打上 `v<VERSION>` 标签并发布 GitHub Release。`bump` 一步完成写入文件与重新生成清单，并会拒绝格式错误的版本、与当前相同的版本，以及标签已存在的版本。它只修改文件——在提交合并之前不会发布任何东西，所以趁现在用 `npm run changelog` 预览发布说明。

### 日常维护

| 目标                                       | 作用                                                                    |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `make fmt`                                 | 用 Prettier 格式化模板、CSS 和 JS                                       |
| `make doctor`                              | 诊断工具链问题（Hugo/Node 版本、过期二进制）                            |
| `make reset`                               | 清除并重新安装 `node_modules`——修复宿主机/devcontainer 之间的二进制冲突 |
| `make clean` / `clean-stats` / `clean-all` | 删除构建输出、stats 变动或全部内容                                      |

{{< callout type="info" >}}
依赖链正是关键所在：`make css` 依赖 `stats`，`make build` 依赖 `css`。原生 npm 脚本要求你记住“先重新生成 stats，再构建 CSS”这套两步流程（[原因](https://github.com/homelabcentral/hextra/blob/main/AGENTS.md)）；Makefile 将其固化了下来。
{{< /callout >}}

此外还有一个 `npm run watch:css` 脚本，与 `make css-watch` 等效，供偏好 npm 的用户使用。

## 内容脚手架

`new-*` 目标封装了 `hugo new`，因此 front matter 来自 `docs/archetypes/` 中的原型（`blog.md`、`docs.md`、`docs-weighted.md`、`default.md`），并且会拒绝覆盖已存在的文件。`NAME` 带不带 `.md` 扩展名均可，嵌套路径也没问题（`NAME=guide/deep/page`）。

值得了解的细节：

- **博客文章初始为草稿**（`draft: true`）：在 `1313` 和 `8043` 上可见，在移除该标志之前不会包含在 `make build` 中。
- **`new-doc-auto` 会计算 `weight`**：创建时扫描目标文件夹的现有页面，取最大值加一。草稿页面不计入，间隔式的 weight 约定（10、20、30……）会得到 31 而不是 40。
- **仅限英文** —— 翻译版本（`.fa.md`、`.ja.md`、`.zh-cn.md`）需手动复制到旁边，与现有内容布局保持一致。

## Devcontainer

devcontainer 不使用普通镜像，而是通过 **Docker Compose**（`.devcontainer/docker-compose.yml`）运行，包含两个服务：

- **`dev`** —— 编辑器附加到的 Go devcontainer 镜像，仓库挂载在 `/workspaces/hextra`。Devcontainer features 会安装 Hugo Extended（固定版本）和 Node 22；`postCreateCommand` 运行 `npm install`，容器首次打开即可直接构建。一组精选的 VS Code 扩展（Tailwind、Hugo、Prettier、Git Graph 等）已预先配置好。
- **`preview`** —— 一个极小（约 258 kB）的静态文件服务器（`pierrezemb/gostatic`），以只读方式提供 `docs/public` 的内容，并设置 `Cache-Control: no-store`，让你永远不会调试到过期页面。它随开发容器一起启动并保持运行：重新执行 `make build`（或 `make preview`）即可更新所服务的站点，无需重启容器。

`devcontainer-lock.json` 已纳入版本控制以保证工具版本可复现。`.vscode/hextra.code-snippets` 在容器内和普通宿主机检出中都会被自动加载——参见 [VS Code 代码片段](vscode-snippets)。

一个命名卷会在容器内遮蔽 `node_modules`，让容器保留自己的 Linux 原生 npm 二进制文件（例如 `lightningcss`），而宿主机保留 macOS 的版本——在任意一侧运行 `npm install` 都不会再破坏另一侧。

### 端口

两个端口都会自动转发到宿主机（`devcontainer.json` 中的 `forwardPorts`）：

| 端口   | 服务                                         | 提供的内容                                |
| ------ | -------------------------------------------- | ----------------------------------------- |
| `1313` | Hugo 开发服务器（`make dev` / `make serve`） | 实时重载的开发构建                        |
| `8043` | 常驻 `preview` 容器                          | 来自 `docs/public` 的最近一次**生产**构建 |

这一区分很重要：`1313` 提供快速的实时重建，而 `8043` 展示生产构建——经过压缩、垃圾回收和摇树优化的 CSS。两者都包含草稿（`make preview` 会传入 `-D`，以便以生产形态检查未发布的文章）；只有 `make build` 的输出不含草稿。发布前请检查 `8043`。

{{< callout type="warning" >}}
`make test` 和 `make build` 会将配置中的 `baseURL` 写入 `docs/public`，因此执行其中任何一个之后，`8043` 上的预览所提供的构建的绝对 URL 会指向别处。重新运行 `make preview` 即可恢复——或者使用 `make test-preview`，它直接测试预览构建本身，并保持 `8043` 正确。在 devcontainer 内，`test-preview` 通过 `http://preview:8043`（compose 服务名）访问容器；在宿主机检出中，可通过 `PREVIEW_TEST_URL=http://localhost:8043` 覆盖。
{{< /callout >}}

### 典型工作流

{{% steps %}}

### 在容器中打开

VS Code → "Reopen in Container"。首次打开会自动安装 Hugo、Node 和 npm 依赖。

### 开发

运行 `make dev` 并在 [localhost:1313](http://localhost:1313) 上迭代。编辑样式时并行运行 `make css-watch`。

### 验证生产构建

`make preview` 执行生产构建，结果立即在 [localhost:8043](http://localhost:8043) 上生效——无需重启服务器，预览容器直接提供刷新后的文件。

{{% /steps %}}

## 使用 act 运行本地 CI

仓库的 GitHub Actions 工作流可以通过 [act](https://nektosact.com) 在本地 Docker 中运行，因此可以在推送前先跑一遍 PR 的检查。默认值放在 `.actrc` 中（运行器镜像、面向 Apple Silicon 的 amd64 架构、容器复用），Makefile 负责包装这些调用：

| 目标             | 作用                                                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `make ci-dry`    | 对所有工作流做空跑（`act -n`）：遍历作业图并打印每个步骤，但不启动容器——几秒内校验工作流语法与接线，不拉取镜像                                  |
| `make ci`        | 运行所有由 `pull_request` 触发的工作流——可访问性、构建输出与移动端菜单——与 PR 完全一致，每个作业一个容器                                        |
| `make ci-a11y`   | 可访问性工作流（`test-accessibility.yml`）：先做生产构建，再用 axe-core 对每个英文页面执行 WCAG 2.2 AA 检查                                     |
| `make ci-build`  | 构建输出工作流（`test-build.yml`）：先做生产构建，再运行 asciidoc、render-link 与 search-data 断言                                              |
| `make ci-mobile` | 移动端菜单工作流（`test-mobile-menu.yml`）：先做生产构建，再运行 Playwright 的移动端导航测试套件                                                |
| `make ci-pages`  | Pages 部署（`pages.yml`）的 **build** 作业——验证站点能以 GitHub Pages 的方式构建。deploy 作业被排除：它需要 GitHub 的 OIDC 令牌，无法在本地运行 |

每个目标在开始前都会检查 act 是否已安装（`brew install act`）以及 Docker 是否在运行。

{{< callout type="info" >}}
首次运行较慢：act 会拉取约 2 GB 的运行器镜像，工作流还会在作业容器内下载 Hugo 和 Playwright 浏览器。`.actrc` 设置了 `--reuse`，作业容器会在多次运行之间保留，因此后续运行会跳过这些步骤。想从头再来时，删除 `act-*` 容器即可。
{{< /callout >}}

上传测试报告的工作流步骤（`actions/upload-artifact`）会与 act 自己启动的本地产物服务器通信（`.actrc` 中的 `--artifact-server-path`）；上传的产物位于 `/tmp/act-artifacts` 下。

在 devcontainer 内，act CLI 与 Docker CLI 已预装（devcontainer features），并挂载了宿主机的 Docker socket。但要注意，此时 act 的作业容器是在宿主机守护进程上以**兄弟**身份运行，而非嵌套运行——绑定挂载必须能在宿主机上解析，因此从宿主机检出目录运行 `make ci` 才是可靠路径；容器内的 act 请视为尽力而为。
