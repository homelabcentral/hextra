---
title: その他のショートコード
linkTitle: その他
next: /docs/guide/deploy-site
---

{{< callout type="warning" >}}
これらの一部は Hugo 組み込みのショートコードです。
これらのショートコードは安定性が低く、いつでも変更される可能性があります。
{{< /callout >}}

## バッジ

### 例

{{< badge "default" >}}
{{< badge content="border" border=false >}}
{{< badge content="color" color="green" >}}
{{< badge content="link" link="https://github.com/homelabcentral/hextra/releases" >}}
{{< badge content="icon" icon="sparkles" >}}
### 使用法

#### デフォルト

{{< badge "Badge" >}}
```
{{</* badge "Badge" */>}}
```

#### 色

{{< badge content="Badge" >}}
{{< badge content="Badge" color="purple" >}}
{{< badge content="Badge" color="indigo" >}}
{{< badge content="Badge" color="blue" >}}
{{< badge content="Badge" color="green" >}}
{{< badge content="Badge" color="yellow" >}}
{{< badge content="Badge" color="amber" >}}
{{< badge content="Badge" color="orange" >}}
{{< badge content="Badge" color="red" >}}
```
{{</* badge content="Badge" */>}}
{{</* badge content="Badge" color="purple" */>}}
{{</* badge content="Badge" color="indigo" */>}}
{{</* badge content="Badge" color="blue" */>}}
{{</* badge content="Badge" color="green" */>}}
{{</* badge content="Badge" color="yellow" */>}}
{{</* badge content="Badge" color="amber" */>}}
{{</* badge content="Badge" color="orange" */>}}
{{</* badge content="Badge" color="red" */>}}
```

{{< badge content="Badge" border=false >}}
{{< badge content="Badge" color="purple" border=false >}}
{{< badge content="Badge" color="indigo" border=false >}}
{{< badge content="Badge" color="blue" border=false >}}
{{< badge content="Badge" color="green" border=false >}}
{{< badge content="Badge" color="yellow" border=false >}}
{{< badge content="Badge" color="amber" border=false >}}
{{< badge content="Badge" color="orange" border=false >}}
{{< badge content="Badge" color="red" border=false >}}
```
{{</* badge content="Badge" border=false */>}}
{{</* badge content="Badge" color="purple" border=false */>}}
{{</* badge content="Badge" color="indigo" border=false */>}}
{{</* badge content="Badge" color="blue" border=false */>}}
{{</* badge content="Badge" color="green" border=false */>}}
{{</* badge content="Badge" color="yellow" border=false */>}}
{{</* badge content="Badge" color="amber" border=false */>}}
{{</* badge content="Badge" color="orange" border=false */>}}
{{</* badge content="Badge" color="red" border=false */>}}
```

#### サイズ

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

デフォルトは `md` で、`size` が加わる前にすべてのバッジが描画されていたサイズです。パラメータの追加で既存の表示は動きません。アイコンはステップに追従するため、サイズの合わないアイコンを持つことはありません。未知のサイズはエラーではなく、ビルド時に警告を出して `md` で描画されます。

両端は中央のステップが不得意な用途のためにあります。`xs` は見出しの横に置く件数・バージョン・状態などの注記、`xl` は周囲の本文と同じ大きさで読ませるヘッダー用のバッジです。

リンク付きの `xs` や `sm` のバッジは、ピルがそれより小さくても 24&times;24 CSS ピクセルのクリック領域を保ちます。[WCAG 2.2 SC 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum) が AA で求めるものです。ラベルが短い場合も同じで、1 文字のバッジでもピルが中央に置かれた 24&times;24 の領域になります。

#### アイコン

{{< badge content="Bundled" icon="sparkles" >}}
{{< badge content="Remote" icon="simple:hugo" >}}
{{< badge content="Project file" icon="file:icons/hexagon.svg" >}}

```
{{</* badge content="Bundled" icon="sparkles" */>}}
{{</* badge content="Remote" icon="simple:hugo" */>}}
{{</* badge content="Project file" icon="file:icons/hexagon.svg" */>}}
```

`icon` には [Icon](/docs/guide/shortcodes/icon) ショートコードが受け付ける名前をそのまま指定できます。`data/icons.yaml` のエントリ、リモートの `provider:name`、またはプロジェクト内の SVG を指す `file:` パスです。

`file:` のパスは、まず現在のページバンドルのリソースとして、次にサイトの `assets/` ディレクトリに対して解決されます。`file:icons/hexagon.svg` は `assets/icons/hexagon.svg` を見つけます。ファイルはリンクではなくインラインに展開されるため、他のアイコンと同じく `size` のステップで大きさが決まり、`fill` も `stroke` も持たない SVG は `currentColor` でバッジの文字色を受け継ぎます。書き換わるのはルートの `<svg>` 要素だけなので、内側に `<svg>` を含むファイルでもその要素の指定はそのまま残ります。`viewBox` を持たないファイルも比率を保ちます。

対応するのは SVG だけです。PNG へのパスや存在しないファイルは、空で描画されるのではなくビルドを失敗させます。

#### 変種

{{< badge content="Badge" icon="sparkles" >}}
{{< badge content="Releases" link="https://github.com/homelabcentral/hextra/releases" icon="github" >}}
```
{{</* badge content="Badge" icon="sparkles" */>}}
{{</* badge content="Releases" link="https://github.com/homelabcentral/hextra/releases" icon="github" */>}}
```

### オプション

| パラメータ | 説明                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `content`  | バッジのテキスト。                                                                                                       |
| `link`     | バッジのリンク。                                                                                                         |
| `icon`     | バッジのアイコン。バンドル名、リモートの `provider:name`、またはプロジェクト内の SVG を指す `file:<path>`。               |
| `size`     | バッジのサイズ。<br/> `xs`, `sm`, `md` (デフォルト), `lg`, `xl`.                                                          |
| `color`    | The color of the badge. <br/> `gray` (default), `purple`, `indigo`, `blue`, `green`, `yellow`, `amber`, `orange`, `red`. |
| `class`    | バッジのクラス。                                                                                                         |
| `border`   | 境界線を追加または削除します (デフォルト: true)。                                                                        |

## YouTube

YouTube 動画を埋め込みます。

```
{{</* youtube VIDEO_ID */>}}
```

結果:

{{< youtube id=dQw4w9WgXcQ loading=lazy >}}

詳細については、[Hugo の YouTube ショートコード](https://gohugo.io/content-management/shortcodes/#youtube)を参照してください。

## PDF

PDF ショートコードを使用すると、コンテンツ内に PDF ファイルを埋め込むことができます。

```
{{</* pdf "https://example.com/sample.pdf" */>}}
```

プロジェクトディレクトリ内に PDF ファイルを配置し、相対パスを使用することもできます。

```
{{</* pdf "path/to/file.pdf" */>}}
```

例:

{{< pdf "https://upload.wikimedia.org/wikipedia/commons/1/13/Example.pdf" >}}
