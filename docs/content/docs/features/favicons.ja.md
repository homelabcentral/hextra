---
title: ファビコン
weight: 5
---

ファビコン用アセットは専用の `static/icons/` ディレクトリにまとめられ、訪問者の OS のカラースキームに追従する**自動ダークモードファビコン**をサポートします。

<!--more-->

## ディレクトリ構成

ファビコンは `static/` 直下ではなく、`static/icons/` 配下に置かれます：

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

`layouts/_partials/favicons.html`、`assets/js/core/favicon.js`、`static/site.webmanifest` はすべて `icons/` パスを参照するため、サイトのアイコンファイルは（`static/` ではなく）`static/icons/` に置く必要があります。

## ダークモードファビコン

`favicon.svg` の隣に `favicon-dark.svg` を置くだけです：

- ビルド時に、`favicon.js` は `fileExists "static/icons/favicon-dark.svg"` をチェックします。ファイルが存在しなければ、切り替えコードは一切実行されません。
- ランタイムでは、スクリプトが `window.matchMedia("(prefers-color-scheme: dark)")` を監視し、OS のスキームが変わるたびに、SVG ファビコンの `<link>`（`id="favicon-svg"`）の `href` を `icons/favicon.svg` と `icons/favicon-dark.svg` の間でリアルタイムに切り替えます。

{{< callout type="info" >}}
切り替えは、サイトのテーマトグルではなく **OS** のカラースキームに追従します。ブラウザのタブ UI は OS のテーマでレンダリングされるため、これはファビコンの周囲でユーザーが実際に目にするものと一致します。
{{< /callout >}}

## 独自アイコンのセットアップ

{{% steps %}}

### アイコン一式を生成する

[RealFaviconGenerator](https://realfavicongenerator.net/) のようなジェネレータを使い、1 つの SVG または高解像度 PNG から生成します。上に挙げた 8 つのファイルが必要です。

### ダークバリアントを作成する

`favicon.svg` を `favicon-dark.svg` として複製し、ダークなタブ向けに塗りを調整します（通常は、暗いストロークを明るくします）。アイコンが両方の背景ですでに機能する場合、このファイルは省略できます。テーマは問題なくグレースフルに動作します。

### 配置する

すべてを `static/icons/` に置き、`site.webmanifest` は `static/` 直下に残します。

{{% /steps %}}
