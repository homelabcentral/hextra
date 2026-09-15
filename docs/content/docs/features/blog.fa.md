---
title: چیدمان وبلاگ
weight: 8
---

وبلاگ یک چیدمان سه‌ستونه قابل پیکربندی است: یک ستون هویت در سمت چپ، فهرست نوشته‌ها یا مقاله در وسط، و ستونی از ویجت‌ها در سمت راست. همه چیز از طریق `params.blog` در پیکربندی سایت شما کنترل می‌شود — سایتی که بلوک `params.blog` ندارد، همان خروجی تک‌ستونه ساده را بدون تغییر نمایش می‌دهد.

<!--more-->

## نگاهی کلی به چیدمان

| ستون      | محتوا                                                                | کلید پیکربندی                             |
| --------- | -------------------------------------------------------------------- | ----------------------------------------- |
| ستون چپ   | آواتار، نام، شعار، لینک‌های ناوبری، کارت حامی، کلیدهای تغییر زبان/تم | `params.blog.rail`                        |
| وسط       | کارت‌های نوشته (صفحات فهرست) یا مقاله                                | `params.blog.list`، `params.blog.article` |
| ستون راست | به‌روزشده‌های اخیر، نوشته‌های سنجاق‌شده، تگ‌های پرطرفدار             | `params.blog.widgets`                     |

هر ویژگی به‌صورت انتخابی فعال می‌شود: تعریف یک بلوک آن را روشن می‌کند و `enable: false` صریح دوباره آن را خاموش می‌کند. ستون هویت در اندازه‌های کوچک‌تر از نقطه شکست `md` پنهان می‌شود و در عوض بلوک هویت به‌صورت یک بنر در بالای ستون محتوا نمایش داده می‌شود.

## ستون هویت

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

- لینک‌های ناوبری از منوی `blog` می‌آیند (`menus.blog` در پیکربندی شما) — موارد دارای برچسب به ناوبری ستون تبدیل می‌شوند.
- هر عنصر فقط زمانی نمایش داده می‌شود که کلید آن موجود باشد: `sponsor` را حذف کنید و هیچ کارت حامی ظاهر نمی‌شود.
- در پایین ستون، همان پنل چسبان تغییر زبان و تم که نوار کناری مستندات استفاده می‌کند سنجاق شده است، بنابراین بدون اسکرول به بالا می‌توانید تغییر دهید.
- صفحات جداگانه می‌توانند با `blog: { rail: false }` در Front matter از آن انصراف دهند.

## کارت‌های نوشته

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
```

با `card.enable`، صفحات فهرست هر نوشته را به‌صورت یک کارت با تصویر کاور، زمان مطالعه و گزیده نمایش می‌دهند — و کل کارت قابل کلیک است، نه فقط عنوان. در حالت کارت، سرفصل صفحه فهرست پنهان می‌شود چون ستون هویت خود صفحه را معرفی می‌کند. بلوک `card` را حذف کنید تا به فهرست ساده بازگردید.

## مقالات

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

`related.count` پس از مقاله، بلوک «نوشته‌های مرتبط» را بر اساس تگ‌های مشترک نمایش می‌دهد.

### دکمه‌های اشتراک‌گذاری

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

`{url}` و `{title}` با لینک دائمی و عنوان نوشته جایگزین می‌شوند. موردی با `type: copy` (و بدون `url`) به جای لینک دادن، لینک دائمی را در کلیپ‌بورد کپی می‌کند. X، LinkedIn، Bluesky، Facebook، Mastodon و Telegram همگی با نقاط پایانی اشتراک‌گذاری استاندارد خود کار می‌کنند — برای مجموعه کامل، `docs/hugo.yaml` را ببینید.

## مجموعه‌ها

نوشته‌های مرتبط را در یک مجموعه بگذارید تا هر نوشته‌ی آن مجموعه یک فهرست جمع‌شونده از کل مجموعه و همچنین پیمایش قبلی/بعدی به ترتیب مجموعه داشته باشد.

```yaml {filename="content/blog/guide-google-fonts.md"}
---
title: "Guide: Adding Google Fonts"
series:
  - Guides
seriesOrder: 2
---
```

تنها کلید لازم `series` است. `seriesOrder` جایگاه نوشته را مشخص می‌کند؛ نوشته‌های بدون آن ابتدا بر اساس `weight` و سپس تاریخ مرتب می‌شوند و پس از نوشته‌های شماره‌دار قرار می‌گیرند.

شماره‌ی هر بخش بر اساس جایگاه در فهرست مرتب‌شده است، نه مقدار `seriesOrder`. اگر بخش سوم از شش بخش منتشر نشود، بقیه دوباره شماره‌گذاری می‌شوند و جای خالی نمی‌ماند؛ دو نوشته با `seriesOrder: 4` هم برچسب‌های متفاوت می‌گیرند.

به بخش `[taxonomies]` نیازی نیست: مجموعه‌ها مستقیماً از front matter خوانده می‌شوند و به زبان جاری محدودند، بنابراین ترجمه‌ها با هم مخلوط نمی‌شوند. تنظیمات کل سایت:

```yaml {filename="hugo.yaml"}
params:
  blog:
    article:
      series:
        enable: true # همین بلوک ماژول را فعال می‌کند؛ false آن را غیرفعال می‌کند
        opened: false # فهرست از ابتدا باز باشد
```

مانند دیگر امکانات وبلاگ، این ماژول اختیاری است: بلوک بالا آن را فعال می‌کند و سایتی که `params.blog.article.series` را تنظیم نکرده باشد، نوشته‌هایش دقیقاً مثل قبل نمایش داده می‌شوند، چه `series` در front matter باشد چه نباشد. `series: false` کوتاه‌شده‌ی `enable: false` است. حالت پیش‌فرض را هر نوشته می‌تواند با `seriesOpened: true` بازنویسی کند.

در نوشته‌های یک مجموعه، پیمایش مجموعه جای پیمایش تاریخ‌محور را می‌گیرد تا در انتهای نوشته تنها یک مجموعه کنترل پیمایش وجود داشته باشد. مجموعه‌ای با یک نوشته چیزی نمایش نمی‌دهد و پیمایش عادی باقی می‌ماند.

کلیدهای خودِ پیمایش تاریخ‌محور اولویت دارند، چون صریح‌اند و عضویت در یک مجموعه نیست: `displayPagination: false` هر دو را پنهان می‌کند و نوشته‌ای که در front matter خود `prev`/`next` را تعیین کرده باشد — از جمله `prev: false` — همان پیمایشی را نگه می‌دارد که برایش تنظیم شده است. با این حال ترتیب مجموعه بر `reversePagination` که همان نوشته‌ها را بر اساس تاریخ مرتب می‌کند، مقدم است.

نوشته‌هایی که برای پوسته‌ی Blowfish نوشته شده‌اند بدون تغییر کار می‌کنند: `series_order` به عنوان نام دیگر `seriesOrder` پذیرفته می‌شود.

## ویجت‌ها

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

به این ترتیب در ستون راست نمایش داده می‌شوند:

- **به‌روزشده‌های اخیر** — جدیدترین نوشته‌ها بر اساس تاریخ.
- **سنجاق‌شده** — نوشته‌های دارای `pinned: true` در Front matter.
- **تگ‌های پرطرفدار** — پراستفاده‌ترین تگ‌ها، با لینک به صفحات تگ خود.

هر ویجت فقط زمانی ظاهر می‌شود که بلوک آن موجود باشد؛ `count` مقادیر پیش‌فرض (۵ / ۳ / ۱۰) را جایگزین می‌کند.

## تگ‌ها و بایگانی

صفحات فهرست تگ‌ها و صفحات هر تگ از همان قالب وبلاگ استفاده می‌کنند — شامل ستون هویت، کارت‌ها و ویجت‌ها — بنابراین مرور بر اساس تگ حس مرور خود وبلاگ را دارد.

صفحه بایگانی نوشته‌ها را بر اساس سال گروه‌بندی می‌کند:

```yaml {filename="hugo.yaml"}
params:
  archives:
    section: blog # source section
    dateFormat: "Jan 02"
```

## تگ‌ها در فهرست مطالب

در صفحات مستندات و مقاله‌ها، تگ‌های صفحه می‌توانند به‌صورت چیپ زیر سرفصل فهرست مطالب نمایش داده شوند:

```yaml {filename="hugo.yaml"}
params:
  toc:
    displayTags: true
```
