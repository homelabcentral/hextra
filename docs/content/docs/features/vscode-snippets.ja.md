---
title: VS Code スニペット
weight: 7
---

Hextra には `.vscode/hextra.code-snippets` が同梱されています。115 個の手書きスニペットが、Hextra のすべてのショートコード、レイアウトが読み取るページのフロントマターキー、レンダーフックが解釈するコードフェンス属性をカバーする、手書きの 89 個の VS Code スニペットです。リポジトリを VS Code で開けばすぐに使えます。拡張機能も設定も不要です。

<!--more-->

## なぜ必要か

Hextra の機能は、ドキュメントを読まないと見つけられません。ページを書くということは、カードのタグ色が（`tagType` ではなく）`tagColor` であること、モザイクギャラリーの項目が `span="wide"` を取ること、行ハイライトが `hl_lines=[2,4]` であること、そして 5 つのショートコードには通常の山括弧ではなく[パーセント記法](#notation-is-not-uniform)が必要なことを覚えておくということです。スニペットはそのすべてを、プレフィックスと `Tab` キーの向こう側に隠してくれます。

ファイル内のすべてのパラメータ名は `layouts/_shortcodes/` の `.Get "…"` 呼び出しから、すべての列挙値は `layouts/_partials/shortcodes/` のスタイルマップから取られています。乖離しうるドキュメントからではありません。

## 使い方

任意の Markdown ファイルでプレフィックスを入力して `Tab` を押します。すべてのプレフィックスは `hx` で始まるので、一般的な Markdown スニペットと衝突することはありません：

| プレフィックス | 対象                                   |
| -------------- | -------------------------------------- |
| `hx`           | すべてのショートコード                 |
| `hxfm-`        | フロントマターブロック                 |
| `hxcode-`      | フェンス付きコードブロックのバリアント |

列挙型のパラメータは**選択式プレースホルダー**です。`Tab` で移動すると、VS Code が自由入力ではなくドロップダウンで有効な値を提示します：

| パラメータ                     | 選択肢                                                                  |
| ------------------------------ | ----------------------------------------------------------------------- |
| `callout type`                 | `default` `info` `warning` `error` `important`                          |
| `badge color`, `card tagColor` | `gray` `purple` `indigo` `blue` `green` `yellow` `orange` `amber` `red` |
| `gallery type`                 | `grid` `mosaic` `masonry` `carousel`                                    |
| `gallery-item span`            | `wide` `tall` `large`                                                   |
| `filetree/folder state`        | `open` `closed`                                                         |
| `card method`                  | `Resize` `Fit` `Fill` `Crop`                                            |
| `width` (front matter)         | `normal` `wide` `full`                                                  |
| `linenos`                      | `table` `inline`                                                        |

つまり `hxcallout` + `Tab` で type のドロップダウンに移動し、その後は本文に移ります：

```markdown
{{</* callout type="info" */>}}
Content
{{</* /callout */>}}
```

## 記法は統一されていない

5 つのショートコードは、内側のコンテンツを Markdown としてレンダリングするためにパーセントデリミタを使います。残りは山括弧を使います。これを間違えると、コンテンツがリテラルテキストとしてレンダリングされてしまいます。スニペットにはそれぞれ正しい記法が組み込まれています：

| 記法            | ショートコード                              |
| --------------- | ------------------------------------------- |
| `{{%/* … */%}}` | `steps`, `details`, `include`, `ltr`, `rtl` |
| `{{</* … */>}}` | それ以外すべて                              |

## リファレンス

### ショートコード

| プレフィックス          | 挿入されるもの                                               |
| ----------------------- | ------------------------------------------------------------ |
| `hxcallout`             | コールアウトボックス。type が色とデフォルトアイコンを決める  |
| `hxcallout-emoji`       | カスタム絵文字付きコールアウト                               |
| `hxcallout-icon`        | アイコン名を明示指定したコールアウト                         |
| `hxcards`               | カード 2 枚入りのカードグリッドコンテナ                      |
| `hxcard`                | 単一カード — リンク、タイトル、アイコン、サブタイトル        |
| `hxcard-tag`            | バッジタグ付きカード — `tagColor`、`tagIcon`、`tagBorder`    |
| `hxcard-image`          | 画像カード — `method`/`options` は Hugo の画像処理に渡される |
| `hxtabs`                | タブ 2 つ入りのタブインターフェース                          |
| `hxtab`                 | タブ 1 つ — `name`、`icon`、`selected`                       |
| `hxsteps`               | h3 見出し付きの番号付きステップリスト                        |
| `hxdetails`             | 折りたたみブロック                                           |
| `hxfiletree`            | フォルダとファイル入りのファイルツリー                       |
| `hxfiletree-folder`     | フォルダノード                                               |
| `hxfiletree-file`       | ファイルノード                                               |
| `hxgallery`             | 項目 2 つ入りのギャラリーコンテナ                            |
| `hxgallery-item`        | ローカルのギャラリー画像                                     |
| `hxgallery-item-remote` | リモートのギャラリー画像。必須の `width`/`height` 付き       |
| `hxbadge`               | バッジ — コンテンツ、色、アイコン                            |
| `hxbadge-inline`        | バッジ、位置引数による短縮形                                 |
| `hxbadge-link`          | リンクでラップされたバッジ                                   |
| `hxicon`                | 組み込みの SVG アイコン                                      |
| `hxicon-remote`         | リモートアイコン — `lucide:` / `tabler:` / `simple:`         |
| `hxjupyter`             | Jupyter ノートブックの埋め込み                               |
| `hxpdf`                 | PDF の埋め込み                                               |
| `hxasciinema`           | 再生オプション付きの Asciinema 録画                          |
| `hxterm`                | 用語集の用語                                                 |
| `hxinclude`             | 別ページのコンテンツをインライン展開                         |
| `hxaccordion`           | 2 つのセクションを持つアコーディオンコンテナ                 |
| `hxaccordion-item`      | アコーディオンのセクション 1 つ                              |
| `hxarticle`             | 別ページのカード — タイトル、要約、カバー画像                |
| `hxbutton`              | `href` によるボタン風リンク                                  |
| `hxbutton-page`         | `pageRef` でサイト内ページへリンクするボタン                 |
| `hxcta`                 | コールトゥアクションボタン                                   |
| `hxlead`                | リード段落                                                   |
| `hxborderless`          | 罫線なしのリファレンス表                                     |
| `hxkeywords`            | キーワード 2 つを含むキーワードコンテナ                      |
| `hxkeyword`             | キーワード 1 つ                                              |
| `hxstats`               | 指標 2 つを並べたグリッド                                    |
| `hxstat`                | 指標 1 つ                                                    |
| `hxtimeline`            | エントリ 1 つを含むタイムラインコンテナ                      |
| `hxtimeline-item`       | タイムラインのエントリ — `badge`、`badgeColor`、`badgeIcon`、`icon` |
| `hxswatches`            | 位置引数の 16 進コードによるカラーパレット                   |
| `hxlist`                | `where`/`value` で絞り込んだページ一覧                       |
| `hxad`                  | この位置に広告を 1 つ — `params.ads` の設定が必要            |
| `hxadprovider`          | ネットワーク・形式・配置を明示した広告                       |
| `hxchart`               | インライン設定による Chart.js のグラフ                       |
| `hxtypeit`              | タイプライター効果、1 行につき 1 文字列                      |
| `hxvideo`               | コントロール付きのセルフホスト動画                           |
| `hxvideo-autoplay`      | 背景向け動画 — autoplay は muted を含意                      |
| `hxyoutube`             | クリックで初めてプレーヤーを読み込む YouTube 埋め込み        |
| `hxemail`               | 難読化された mailto リンク                                   |
| `hxgithub`              | GitHub リポジトリカード                                      |
| `hxgitlab`              | 名前空間パスによる GitLab プロジェクトカード                 |
| `hxgitlab-id`           | 数値 ID による GitLab プロジェクトカード                     |
| `hxgitea`               | Gitea リポジトリカード                                       |
| `hxforgejo`             | Forgejo リポジトリカード                                     |
| `hxcodeberg`            | Codeberg リポジトリカード                                    |
| `hxhuggingface`         | Hugging Face モデルカード                                    |
| `hxhuggingface-dataset` | Hugging Face データセットカード                              |
| `hxansible`             | Ansible Galaxy ロールカード                                  |
| `hxansible-collection`  | Ansible Galaxy コレクションカード                            |
| `hxgist`                | テーマのコードブロックとして描画する GitHub gist             |
| `hxgist-live`           | 読者のブラウザーで更新される gist                            |
| `hxcodeimporter`        | URL のファイルをコードブロックとして取り込む                 |
| `hxcodeimporter-lines`  | 行番号とハイライト付きの取り込み抜粋                         |
| `hxcodeimporter-live`   | 読者のブラウザーで更新される取り込みファイル                 |
| `hxltr`                 | RTL ページ内で左から右へ強制                                 |
| `hxrtl`                 | LTR ページ内で右から左へ強制                                 |
| `hxhero`                | `hextra-home` ページ用の完全なヒーローブロック               |
| `hxhero-container`      | サイド画像付きのヒーローコンテナ                             |
| `hxhero-headline`       | ヒーローの見出し                                             |
| `hxhero-subtitle`       | ヒーローのサブタイトル                                       |
| `hxhero-badge`          | 見出しの上のピル型バッジ                                     |
| `hxhero-button`         | ヒーローの CTA ボタン                                        |
| `hxhero-section`        | ホームレイアウトのセクション見出し                           |
| `hxfeature-grid`        | カード 2 枚入りのフィーチャーグリッド                        |
| `hxfeature-card`        | フィーチャーカード                                           |
| `hxfeature-card-image`  | 背景画像とグラデーション付きのフィーチャーカード             |

### フロントマター

| プレフィックス | 挿入されるもの                                                                        |
| -------------- | ------------------------------------------------------------------------------------- |
| `hxfm-docs`    | ドキュメントページ — `title`、`weight`、`toc`、`breadcrumbs`、`math`、`excludeSearch` |
| `hxfm-section` | セクションの `_index.md` — `prev`/`next`、`sidebar.open`、`cascade.type`              |
| `hxfm-blog`    | ブログ記事 — `date`、`authors`、`tags`                                                |
| `hxfm-series`  | シリーズのブロック — `series`、`seriesOrder`、`seriesOpened`                          |
| `hxfm-home`    | ホームページ — `layout: hextra-home`                                                  |
| `hxfm-sidebar` | `sidebar:` ブロック — `open`、`exclude`、`hide`                                       |
| `hxfm-width`   | ページ幅の上書き — `normal` 80rem、`wide` 90rem、`full` 100%                          |
| `hxfm-cascade` | パラメータを子孫ページにカスケード（例：`reversePagination`）                         |

### コードブロック

| プレフィックス   | 挿入されるもの                                                   |
| ---------------- | ---------------------------------------------------------------- |
| `hxcode`         | `filename` ヘッダー付きのフェンス                                |
| `hxcode-lines`   | `linenos`、`hl_lines`、`linenostart` 付きのフェンス              |
| `hxcode-baseurl` | ファイル名ヘッダーが `base_url` 経由でソースにリンクするフェンス |
| `hxmermaid`      | Mermaid ダイアグラムのフェンス                                   |
| `hxmath`         | ディスプレイ数式ブロック（`math: true` が必要）                  |

## ファイル形式

スニペットごとに 1 つの JSON オブジェクトです。すべてのエントリは `markdown` にスコープされ、信頼できる情報源を示す `description` を持ち、列挙値には `${n|a,b|}` を使います：

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

VS Code は `.vscode/` 内の任意の `*.code-snippets` ファイルを自動的に読み込むため、`settings.json` からの参照は不要です。

{{< callout type="info" >}}
非推奨のパラメータは意図的に含めていません。`tabs` は今でも `items=` と `defaultIndex=` を受け付け、`card` も `tagType=` を受け付けますが、いずれもビルド時に `warnf` を出力します。スニペットでは代わりに `tab name=`、`tab selected=`、`tagColor=` を使っています。
{{< /callout >}}

## 同期を保つ

スニペットは手書きなので、ショートコードのパラメータが追加・改名されると乖離する可能性があります。次のワンライナーは、ファイル内のすべての `param=` をテーマの実際の `.Get` 呼び出しと突き合わせ、不一致があれば出力します：

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

`layouts/_shortcodes/` に触れる変更のあとに実行する価値があります — [開発ツール](dev-tooling)を参照してください。

## 自分のサイトで使う

このファイルは自己完結していて、このリポジトリのレイアウトに依存しません。Hextra を使っている任意の Hugo サイトにコピーできます：

```bash
mkdir -p .vscode
curl -o .vscode/hextra.code-snippets \
  https://raw.githubusercontent.com/homelabcentral/hextra/main/.vscode/hextra.code-snippets
```

1 つのプロジェクトだけでなくすべてのプロジェクトで使いたい場合は、同じファイルをユーザースニペットディレクトリに置きます：

| プラットフォーム | パス                                                |
| ---------------- | --------------------------------------------------- |
| macOS            | `~/Library/Application Support/Code/User/snippets/` |
| Linux            | `~/.config/Code/User/snippets/`                     |
| Windows          | `%APPDATA%\Code\User\snippets\`                     |

{{< callout type="warning" >}}
グローバルにインストールすると、開いたすべての Markdown ファイルでスニペットが発動します。Hugo 以外のプロジェクトでも、です。そこでは `hxcallout` はリテラルテキストとしてレンダリングされる構文を挿入してしまいます。書くものの大半が Hextra でない限り、プロジェクトごとの `.vscode/` へのコピーをおすすめします。
{{< /callout >}}

## エージェント用スキルも生成します

これらのスニペットは [`skills/hextra/`](https://github.com/homelabcentral/hextra/tree/main/skills/hextra) にも供給されます。これはコーディングエージェントに Hextra サイトの執筆方法を教えるスキルパッケージです。そこではショートコードのテンプレートが信頼できる情報源であり、`npm run build:skill` はパラメータ名・デフォルト値・必須かどうかを `layouts/_shortcodes/` から直接読み取ります。スニペットは、テンプレートでは表現しにくい列挙値とコピー&ペースト可能な例に使われます。ジェネレーターは両者を突き合わせ、どのテンプレートも読まないパラメータを含むスニペットを報告するため、手書きのスニペットが実装から静かに乖離することはありません。
