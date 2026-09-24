---
title: アイコン
next: /docs/guide/shortcodes/steps
---

このショートコードをインラインで使用するには、設定でインラインショートコードを有効にする必要があります:

```yaml {filename="hugo.yaml"}
enableInlineShortcodes: true
```

利用可能なアイコンの一覧は [`data/icons.yaml`](https://github.com/homelabcentral/hextra/blob/main/data/icons.yaml) で確認できます。

<!--more-->

## 例

{{< icon "academic-cap" >}}
{{< icon "cake" >}}
{{< icon "gift" >}}
{{< icon "sparkles" >}}

## 使用方法

```
{{</* icon "github" */>}}
```

[Heroicons](https://v1.heroicons.com/) v1 のアウトラインアイコンがデフォルトで利用可能です。

### 独自のアイコンを追加する方法

`data/icons.yaml` ファイルを作成し、以下の形式で独自の SVG アイコンを追加します:

```yaml {filename="data/icons.yaml"}
your-icon: <svg>your icon svg content</svg>
```

追加したアイコンは以下のようにショートコードで使用できます:

```
{{</* icon "your-icon" */>}}

{{</* card icon="your-icon" */>}}
```

ヒント: [Iconify Design](https://iconify.design/) は、このようにコピーする SVG アイコンを探すのに最適な場所です。コピーせずに使うこともできます。後述の「リモートアイコンパック」で説明する `iconify:` プロバイダープレフィックスを使ってください。

### ファイルからのアイコン

プロジェクトにすでにある SVG は、`data/icons.yaml` に貼り付けなくても使えます。パスの先頭に `file:` を付けると、テーマがそのファイルを直接読み込みます:

{{< icon "file:icons/hexagon.svg" >}}

```
{{</* icon "file:icons/hexagon.svg" */>}}

{{</* badge content="Badge" icon="file:icons/hexagon.svg" */>}}
```

パスはまずショートコードが呼ばれたページバンドルのリソースとして解決され、次にサイトの `assets/` ディレクトリに対して解決されます。`file:icons/hexagon.svg` は `assets/icons/hexagon.svg` を見つけ、ページバンドル内の `index.md` の隣にあるロゴはファイル名だけで参照できます。

ファイルはリンクではなくインラインに展開されます。これが他のアイコンと同じ振る舞いになる理由で、CSS がサイズを決め、`fill` も `stroke` も持たない SVG は `currentColor` で周囲の文字色を受け継ぎます。テーマが書き換えるのはルートの `<svg>` 要素だけです。その `width`、`height`、`class` は周囲のサイズ指定と衝突しないように取り除かれ、`<script>` 要素は `<script>…</script>` と自己終了形の `<script/>` の両方が削除されます。それ以外はすべてそのまま出力されます。インラインに展開された時点でクラス名がグローバルになる `<style>` も、`on*` イベント属性も同様です。これはサニタイズではありません。`file:` のアイコンは自分の `layouts/` にあるテンプレートと同じように扱ってください。自分のページに展開される自分のマークアップなので、内容を管理できるファイルだけを指定してください。

対応するのは SVG だけで、しかも実際に存在するパスだけです。`.png` や、対応するファイルのない名前は、空で描画されるのではなく、そのパスを示すメッセージとともにビルドを失敗させます。

### リモートアイコンパック

リモートアイコンは、プロバイダープレフィックスを使って必要なものだけ読み込めます。Hextra は以下のプロバイダーをサポートしています:

| プロバイダー                                          | 例                                      | アイコン                          |
| ----------------------------------------------------- | --------------------------------------- | --------------------------------- |
| [Lucide](https://lucide.dev/icons/)                   | `{{</* icon "lucide:house" */>}}`       | {{< icon "lucide:house" >}}       |
| [Tabler Icons](https://tabler.io/icons)               | `{{</* icon "tabler:user" */>}}`        | {{< icon "tabler:user" >}}        |
| [Tabler Icons](https://tabler.io/icons)（塗りつぶし） | `{{</* icon "tabler-filled:star" */>}}` | {{< icon "tabler-filled:star" >}} |
| [Simple Icons](https://simpleicons.org/)              | `{{</* icon "simple:hugo" */>}}`        | {{< icon "simple:hugo" >}}        |
| [Iconify](https://icon-sets.iconify.design/)          | `{{</* icon "iconify:mdi/server" */>}}` | {{< icon "iconify:mdi/server" >}} |

リモートアイコンはビルド時に取得され、設定は不要です。リモート取得はデフォルトで有効になっています。無効にする方法や独自のプロバイダーを追加する方法は、[設定]({{% relref "docs/guide/configuration" %}})ページの「リモートアイコン」を参照してください。

最初の 4 つのプロバイダーは単一パックのフラットな名前空間を参照するため、名前はそのパック内のファイル名そのものです。Iconify だけは異なり、名前が `set/icon` のペアで、[icon-sets.iconify.design](https://icon-sets.iconify.design/) にあるすべてのセットに届きます — `iconify:mdi/server`、`iconify:simple-icons/reddit`。

デフォルトのプロバイダーは以下の CDN URL から読み込まれ、`%s` がアイコン名に置き換えられます:

```yaml
lucide: "https://unpkg.com/lucide-static@1/icons/%s.svg"
tabler: "https://unpkg.com/@tabler/icons@3/icons/outline/%s.svg"
tabler-filled: "https://unpkg.com/@tabler/icons@3/icons/filled/%s.svg"
simple: "https://cdn.jsdelivr.net/npm/simple-icons@16/icons/%s.svg"
iconify: "https://api.iconify.design/%s.svg"
```

Tabler は塗りつぶしとアウトラインを別ディレクトリで配布しているため、プレフィックスも 2 つあります。アウトラインが `tabler:`、塗りつぶしが `tabler-filled:` です。塗りつぶしのセットはかなり小さく、ブランドマークを含みません — `tabler:brand-docker` はありますが、`tabler-filled:brand-docker` はありません。

Lucide、Tabler、Simple Icons はパッケージのメジャーバージョンに固定されています。Iconify の URL は固定するバージョンを持たないライブ API なので、リポジトリ側が何も変わらなくても、返ってくるバイト列がビルドごとに変わり得ます。それが問題になる場合は、SVG を自分の `data/icons.yaml` にコピーしてください。

名前はプロバイダー間で共通ではなく、もっともらしい推測はたいてい外れます。`simple:hackernews` は失敗します。Simple Icons がそのアイコンを法人名で収録しているためです — `simple:ycombinator`。推測せず、各プロバイダー自身の一覧で確認してください。

> [!NOTE]
> 未知のアイコン名は空白ではなくビルドエラーです。ビルドは `icon "..." not found` で停止します。CI でタイプミスを捕まえられる一方、404 になるリモート名はビルドを落とすということでもあります。

リモートアイコン名は、カード、タブ、バッジ、コールアウト、ナビゲーションバーメニュー項目など、Hextra がアイコン名を受け付ける場所ならどこでも使用できます。

## オプション

| パラメータ   | 説明             |
| ------------ | ---------------- |
| `name`       | アイコン名       |
| `attributes` | アイコンの属性。 |
