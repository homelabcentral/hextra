---
title: آیکون
next: /docs/guide/shortcodes/steps
---

برای استفاده از این شورت‌کد به صورت درون‌خطی، باید قابلیت شورت‌کدهای درون‌خطی در تنظیمات فعال شود:

```yaml {filename="hugo.yaml"}
enableInlineShortcodes: true
```

لیست آیکون‌های موجود را می‌توانید در [`data/icons.yaml`](https://github.com/homelabcentral/hextra/blob/main/data/icons.yaml) مشاهده کنید.

<!--more-->

## مثال

{{< icon "academic-cap" >}}
{{< icon "cake" >}}
{{< icon "gift" >}}
{{< icon "sparkles" >}}

## نحوه استفاده

```
{{</* icon "github" */>}}
```

آیکون‌های [Heroicons](https://v1.heroicons.com/) نسخه 1 به صورت پیش‌فرض در دسترس هستند.

### چگونه آیکون‌های خود را اضافه کنید

فایل `data/icons.yaml` را ایجاد کنید، سپس آیکون‌های SVG خود را با فرمت زیر اضافه کنید:

```yaml {filename="data/icons.yaml"}
your-icon: <svg>محتوای SVG آیکون شما</svg>
```

سپس می‌توانید از آن در شورت‌کد به این صورت استفاده کنید:

```
{{</* icon "your-icon" */>}}

{{</* card icon="your-icon" */>}}
```

نکته: [Iconify Design](https://iconify.design/) منبع خوبی برای یافتن آیکون‌های SVG است تا به این شکل کپی کنید. همچنین می‌توانید بدون کپی‌کردن و از طریق پیشوند ارائه‌دهندهٔ `iconify:` — که در بخش «بسته‌های آیکون راه دور» در ادامه توضیح داده شده — از همان آیکون‌ها استفاده کنید.

### بسته‌های آیکون راه دور

آیکون‌های راه دور را می‌توان با استفاده از پیشوند ارائه‌دهنده و به صورت موردنیاز بارگذاری کرد. Hextra از این ارائه‌دهنده‌ها پشتیبانی می‌کند:

| ارائه‌دهنده                                    | مثال                                    | آیکون                             |
| ---------------------------------------------- | --------------------------------------- | --------------------------------- |
| [Lucide](https://lucide.dev/icons/)            | `{{</* icon "lucide:house" */>}}`       | {{< icon "lucide:house" >}}       |
| [Tabler Icons](https://tabler.io/icons)        | `{{</* icon "tabler:user" */>}}`        | {{< icon "tabler:user" >}}        |
| [Tabler Icons](https://tabler.io/icons) (توپر) | `{{</* icon "tabler-filled:star" */>}}` | {{< icon "tabler-filled:star" >}} |
| [Simple Icons](https://simpleicons.org/)       | `{{</* icon "simple:hugo" */>}}`        | {{< icon "simple:hugo" >}}        |
| [Iconify](https://icon-sets.iconify.design/)   | `{{</* icon "iconify:mdi/server" */>}}` | {{< icon "iconify:mdi/server" >}} |

آیکون‌های راه دور در زمان ساخت دریافت می‌شوند و به هیچ تنظیمی نیاز ندارند؛ دریافت از راه دور به‌صورت پیش‌فرض فعال است. برای غیرفعال‌کردن آن یا افزودن ارائه‌دهندهٔ دلخواه خودتان، بخش «آیکون‌های راه دور» در صفحهٔ [پیکربندی]({{% relref "docs/guide/configuration" %}}) را ببینید.

چهار ارائه‌دهندهٔ نخست به فضای نام تخت یک بستهٔ واحد اشاره می‌کنند، بنابراین نام همان نام فایل در آن بسته است. Iconify متفاوت است: نام آن یک جفت `set/icon` است و به همهٔ مجموعه‌های [icon-sets.iconify.design](https://icon-sets.iconify.design/) دسترسی می‌دهد — `iconify:mdi/server`، `iconify:simple-icons/reddit`.

ارائه‌دهنده‌های پیش‌فرض از این URLهای CDN بارگذاری می‌شوند و `%s` با نام آیکون جایگزین می‌شود:

```yaml
lucide: "https://unpkg.com/lucide-static@1/icons/%s.svg"
tabler: "https://unpkg.com/@tabler/icons@3/icons/outline/%s.svg"
tabler-filled: "https://unpkg.com/@tabler/icons@3/icons/filled/%s.svg"
simple: "https://cdn.jsdelivr.net/npm/simple-icons@16/icons/%s.svg"
iconify: "https://api.iconify.design/%s.svg"
```

Tabler دو گونه را در دو پوشهٔ جدا منتشر می‌کند، بنابراین دو پیشوند دارد: `tabler:` برای مجموعهٔ خطی و `tabler-filled:` برای مجموعهٔ توپر. مجموعهٔ توپر بسیار کوچک‌تر است و هیچ نشان تجاری‌ای ندارد — `tabler:brand-docker` وجود دارد، `tabler-filled:brand-docker` وجود ندارد.

Lucide، Tabler و Simple Icons به نسخهٔ اصلی بسته محدود شده‌اند. آدرس Iconify یک API زنده است و نسخه‌ای برای قفل‌کردن ندارد، بنابراین بایت‌هایی که برمی‌گرداند می‌تواند بین دو ساخت تغییر کند، بدون آنکه چیزی در مخزن شما عوض شده باشد. اگر این موضوع اهمیت دارد، SVG را در `data/icons.yaml` خودتان کپی کنید.

نام‌ها میان ارائه‌دهنده‌ها منتقل نمی‌شوند و حدسِ محتمل معمولاً نادرست است. `simple:hackernews` شکست می‌خورد، چون Simple Icons آن آیکون را با نام حقوقی‌اش نگه می‌دارد — `simple:ycombinator`. به‌جای حدس‌زدن، فهرست خودِ ارائه‌دهنده را بررسی کنید.

> [!NOTE]
> نام آیکون ناشناخته یک خطای ساخت است، نه یک فضای خالی: ساخت با پیام `icon "..." not found` متوقف می‌شود. این رفتار خطاهای تایپی را در CI می‌گیرد، و در عین حال یعنی نام راه دوری که ۴۰۴ برگرداند، ساخت را از کار می‌اندازد.

نام آیکون‌های راه دور در هر جایی از Hextra که نام آیکون می‌پذیرد قابل استفاده است، از جمله کارت‌ها، تب‌ها، نشان‌ها، کال‌اوت‌ها و آیتم‌های منوی نوار ناوبری.

## خيارات

| المعلمة      | وصف            |
| ------------ | -------------- |
| `name`       | اسم الأيقونة   |
| `attributes` | سمات الأيقونة. |
