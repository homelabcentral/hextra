---
title: ブログレイアウト
weight: 8
---

ブログは設定可能な 3 カラムレイアウトです。左にアイデンティティレール、中央に記事一覧または記事本文、右にウィジェットのカラムという構成です。すべてはサイト設定の `params.blog` で制御されます。`params.blog` ブロックのないサイトでは、単一カラムのマークアップがそのままレンダリングされます。

<!--more-->

## レイアウトの概要

| カラム   | 内容                                                                                     | 設定キー                                  |
| -------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- |
| 左レール | アバター、名前、タグライン、ナビゲーションリンク、スポンサーカード、言語・テーマスイッチ | `params.blog.rail`                        |
| 中央     | 記事カード（一覧ページ）または記事本文                                                   | `params.blog.list`, `params.blog.article` |
| 右レール | 最近の更新、ピン留めされた記事、トレンドタグ                                             | `params.blog.widgets`                     |

すべての機能はオプトインです。ブロックを定義すると有効になり、明示的に `enable: false` を指定すると無効に戻ります。レールは `md` ブレークポイント未満では非表示になり、代わりにアイデンティティブロックがコンテンツカラムの上部にバナーとして表示されます。

## アイデンティティレール

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

- ナビゲーションリンクは `blog` メニュー（設定の `menus.blog`）から取得されます。ラベルを持つエントリがレールのナビゲーションになります。
- 各要素はキーが存在するときのみレンダリングされます。`sponsor` を省略すればスポンサーカードは表示されません。
- レールの下部には、ドキュメントのサイドバーと同じスティッキーな言語・テーマ切り替えパネルが固定されるので、上までスクロールし直さずに切り替えられます。
- 個々のページはフロントマターに `blog: { rail: false }` を指定してオプトアウトできます。

## 記事カード

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

`card.enable` を指定すると、一覧ページでは各記事がカバー画像・読了時間・抜粋付きのカードとしてレンダリングされ、タイトルだけでなくカード全体がクリック可能になります。レールがページの役割を示しているため、カードモードでは一覧ページの見出しは非表示になります。`card` ブロックを削除すると、プレーンなリスト表示に戻ります。

`layout` はブログ一覧、`termLayout` はタグページのカード形状をそれぞれ選びます。`vertical` はカバーをテキストの上に置き、高さは内容に従って伸びます。`horizontal` はカバーを行頭側の 40% に置き、`sm` 以上ではすべてのカードを同じ高さに揃えます。どちらの値もどちらのページでも使え、上の値はこれらのキーが追加される前のレンダリング結果と同じです。

カードの抜粋は、記事のフロントマターの `summary`、次に `description`、最後に Hugo 自身の要約（`<!--more-->` 以降のテキスト、マーカーがなければ冒頭の文）の順で決まります。`summary` がカード専用になるのは、記事が `description` も設定しているときだけです。`summary` だけの場合は `<meta name="description">` と `og:description` にも入ります。`description` は常に両方に入るため、読者に見せたい文とクローラーにインデックスさせたい文が異なるときは両方のキーを設定してください。

```yaml {filename="content/blog/shipping-v2.md"}
---
title: "v2 リリース"
summary: "カードのために書いた、短く鋭い 2 行。"
description: "検索エンジンとリンクプレビューがインデックスする一文。"
---
```

## 記事ページ

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

`related.count` を指定すると、共通のタグに基づく「関連記事」ブロックが記事の後にレンダリングされます。

### 共有ボタン

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

`{url}` と `{title}` は記事のパーマリンクとタイトルに置き換えられます。`type: copy` を持つ（そして `url` を持たない）エントリは、外部リンクの代わりにパーマリンクをクリップボードにコピーします。X、LinkedIn、Bluesky、Facebook、Mastodon、Telegram はいずれも標準の共有エンドポイントで動作します。完全な一覧は `docs/hugo.yaml` を参照してください。

## シリーズ

関連する記事をまとめると、そのグループのすべての記事に、シリーズ全体の折りたたみ可能な目次と、シリーズ順の前後ナビゲーションが表示されます。

```yaml {filename="content/blog/guide-google-fonts.md"}
---
title: "Guide: Adding Google Fonts"
series:
  - Guides
seriesOrder: 2
---
```

必須のキーは `series` だけです。`seriesOrder` は並び順を指定します。指定がない記事は `weight`、次に日付の順で並び、番号付きの記事の後ろに配置されます。

表示される回数は `seriesOrder` の値ではなく、並び順から算出した位置です。6 本中 3 本目を非公開にしても番号が飛ぶことはなく、`seriesOrder: 4` が重複していても別々のラベルになります。

`[taxonomies]` の設定は不要です。シリーズはフロントマターから直接解決され、現在の言語に限定されるため、翻訳が混ざることはありません。サイト全体の設定:

```yaml {filename="hugo.yaml"}
params:
  blog:
    article:
      series:
        enable: true # このブロックでモジュールを有効化し、false で無効化
        opened: false # 最初から展開した状態にする
```

他のブログ機能と同じくオプトインです。上記のブロックを追加するとモジュールが有効になり、`params.blog.article.series` を設定しないサイトでは、記事に `series` があってもこれまでどおりの表示のままです。`enable: false` の省略形として `series: false` も使えます。初期状態は記事ごとに `seriesOpened: true` で上書きできます。

シリーズに属する記事では、シリーズの前後ナビゲーションが日付順のページャーを置き換えます。記事の末尾に順序の異なるナビゲーションが 2 つ並ぶことはありません。記事が 1 本だけのシリーズでは何も表示されず、通常のページャーがそのまま使われます。

ページャー自身の設定が優先されます。シリーズへの所属と違って、こちらは明示的な指定だからです。`displayPagination: false` は両方を非表示にし、フロントマターで `prev`/`next`（`prev: false` を含む）を指定した記事は、その設定どおりのページャーを保ちます。ただし同じ記事群を日付順に並べる `reversePagination` より、シリーズの並び順が優先されます。

Blowfish テーマ向けに書かれた記事もそのまま動作します。`series_order` は `seriesOrder` の別名として受け付けられます。

## ウィジェット

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

右レールには次の順序でレンダリングされます：

- **最近の更新** — 日付順の最新記事。
- **ピン留め** — フロントマターに `pinned: true` を持つ記事。
- **トレンドタグ** — 最も使われているタグ。各タグページへのリンク付き。

各ウィジェットはブロックが存在するときのみ表示されます。`count` でデフォルト値（5 / 3 / 10）を上書きできます。

## タグとアーカイブ

タグ一覧ページとタグ別ページは、レール・カード・ウィジェットを含む同じブログシェルを共有するので、タグをたどる体験はブログ本体を閲覧する体験と変わりません。

アーカイブページは記事を年ごとにグループ化します：

```yaml {filename="hugo.yaml"}
params:
  archives:
    section: blog # source section
    dateFormat: "Jan 02"
```

## 目次内のタグ表示

ドキュメントページと記事ページでは、目次の見出しの下にページのタグをチップとして表示できます：

```yaml {filename="hugo.yaml"}
params:
  toc:
    displayTags: true
```
