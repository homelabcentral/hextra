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
