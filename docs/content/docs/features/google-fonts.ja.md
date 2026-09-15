---
title: Google Fonts
weight: 1
---

Hextra は本格的な Google Fonts サポートを備えています。**見出し**・**本文**・**コード**それぞれに個別のフォントを設定でき、Google のモダンなバリアブルフォント `axes` 構文を使い、フォントの読み込みに失敗した場合のフォールバックスタックも備えています。

<!--more-->

## クイックスタート

サイトの `hugo.yaml` でフォントを有効にします：

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

これだけです。テンプレートの上書きもカスタム CSS も必要ありません。

{{< callout type="warning" >}}
`enable: true` を設定する場合は、`heading`、`body`、`code` とそれぞれの `fallbacks` を定義してください。CSS 変数の生成はそのすべてを読み取ります。`mono` は例外で任意です。省略すると素の等幅スタックにフォールバックします。
{{< /callout >}}

## パラメータ

| パラメータ          | 型      | 説明                                                                                                                          |
| ------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `enable`            | boolean | マスタースイッチ。`false`（または未指定）の場合、テーマはシステムフォントスタックを使い、Google からは何も読み込みません。    |
| `<group>.family`    | string  | Google Fonts の正確なファミリー名。例：`"Inter"`、`"JetBrains Mono"`。スペースは使用可能で、自動的に URL エンコードされます。 |
| `<group>.axes`      | string  | Google Fonts の埋め込み URL に含まれるバリアブルフォントの axes 指定（下記参照）。                                            |
| `<group>.display`   | string  | `font-display` 戦略：`auto`、`block`、`swap`、`fallback`、`optional`。特別な理由がなければ `swap` を使ってください。          |
| `fallbacks.<group>` | string  | Google フォントの後に追加される CSS フォントスタック。                                                                        |

`<group>` は `heading`、`body`、`code`、`mono` のいずれかです。

## `code` と `mono` の違い

この二つは意図的に分かれています。

`code` は**読むためのコード**向けです — コードブロック、インラインコード、シンタックスハイライト、gist、インポートしたソース、ノートブックのセルソース。

`mono` は**等幅の UI 要素**向けです — `<kbd>` キー、`<samp>` 出力、検索ショートカットのバッジ、ノートブックの実行回数、カラースウォッチの HEX ラベル、そして `font-mono` ユーティリティを使うすべて。これらはコードではなく UI です。

`mono` は唯一の任意グループです。`family` を省略すると、これらの面は `fallbacks.mono` スタックのみを使い、リクエストは発生しません。

Google Fonts のすべてのファミリーがバリアブルフォントではありません。IBM Plex Mono は個別のウェイトを取り — `wght@400;500;600` — `wght@400..600` のような範囲指定は HTTP 400 で拒否されます。

## `axes` 値の調べ方

Google Fonts は、単純なウェイト一覧から axes ベースの URL 形式に移行しました。正しい値を得るには：

{{% steps %}}

### フォントを選ぶ

[fonts.google.com](https://fonts.google.com/) でフォントを選び、必要なスタイル／ウェイトを選択してから、**Get font** → **Get embed code** をクリックします。

### 埋め込み URL をコピーする

埋め込みコードには次のようなリンクが含まれています：

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

### family と axes を抽出する

`:` の前がファミリー（`Inter`）、`:` と `&` の間が axes 文字列（`ital,wght@0,400;0,500;0,600;0,700;1,400`）です。

{{% /steps %}}

よく使う axes パターン：

| パターン                   | 意味                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `wght@400;700`             | 静的ウェイト 400 と 700                                                                |
| `wght@100..800`            | 100〜800 の完全なバリアブルウェイト範囲（バリアブルフォントなら 1 つの小さなファイル） |
| `ital,wght@0,400;1,400`    | ウェイト 400 のレギュラーとイタリック                                                  |
| `opsz,wght@6..12,200..900` | オプティカルサイズ + ウェイトの範囲                                                    |

{{< callout type="info" >}}
バリアブルフォントには範囲構文（`wght@100..800`）を推奨します。静的ウェイトごとに 1 ファイルではなく、1 リクエストですべてのウェイトが手に入ります。
{{< /callout >}}

## 内部の仕組み

3 つのパーツが連携し、すべてビルド時に動作します（クライアントサイド JavaScript はありません）：

{{% steps %}}

### `layouts/_partials/google-fonts.html`

`head.html` からインクルードされます。`params.fonts.enable` が true のとき、`fonts.googleapis.com` と `fonts.gstatic.com` への `<link rel="preconnect">` ヒントを出力し、続いて設定済みグループごとに 1 つのスタイルシート `<link>` を出力します。`css2` URL は `family`、`axes`、`display` から組み立てられます。各グループは `with` でラップされているため、設定のないグループはリクエストを発生させません。

### `assets/css/variables.css`

このファイルは Hugo テンプレートとして実行される（`resources.ExecuteAsTemplate`）ため、ビルド時にサイトのパラメータを読み取れます。`:root` に 3 つの CSS カスタムプロパティを定義します：

```css
:root {
  --font-heading: "Sora", system-ui, ...;
  --font-body: "Inter", system-ui, ...;
  --font-code: "JetBrains Mono", ui-monospace, ...;
}
```

フォントが無効な場合、これらはプレーンなシステムスタックに解決されます。残りの CSS はその違いを一切意識する必要がありません。

### `assets/css/fonts.css`

変数を適用します。`html` には `var(--font-body)`、`h1`〜`h6`（およびタイポグラフィプラグインの見出し）には `var(--font-heading)`、`pre`、`code`、`kbd`、`samp`、Hextra のコードブロックには `var(--font-code)` が適用されます。本番ビルドでは、このファイルは `head.html` でコンパイル済みスタイルシートに連結されます。

{{% /steps %}}

## レシピ

### すべてを 1 つのフォントで

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

### エディトリアルな雰囲気（セリフ体の見出し）

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

### このデモサイト

いま読んでいるこのサイトは、見出しに Sora、本文に Mozilla Text、コードに Google Sans Code を使っています。実際の設定は [`docs/hugo.yaml`](https://github.com/homelabcentral/hextra/blob/main/docs/hugo.yaml) を参照してください。

## トラブルシューティング

- **フォントが変わらない** — ファミリー名が Google Fonts と正確に一致しているか（スペースや大文字小文字を含めて）確認し、ハードリフレッシュしてください。スタイルシートのリンクは `params.fonts.enable` が true のときのみ出力されます。
- **一部のウェイトが疑似ボールドでレンダリングされる** — 指定した `axes` にそのウェイトが含まれていません。追加するか、範囲構文を使ってください。
- **読み込み時にレイアウトシフトが起きる** — `display: swap` では想定内の挙動です。メトリクスの近いフォールバックスタックを選んで軽減するか、低速な接続ではフォールバックを優先する `display: optional` を使ってください。
- **プライバシー／GDPR** — フォントは Google の CDN から配信されます。セルフホストが必要な場合は、`fonts.enable: false` のままにして `assets/css/custom.css` に `@font-face` ルールを追加し、`--font-heading`/`--font-body`/`--font-code` 変数を自分で設定してください。
