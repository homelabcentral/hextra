---
title: فونت‌های Google
weight: 1
---

Hextra پشتیبانی درجه‌یک از فونت‌های Google دارد: فونت‌های جداگانه و به‌طور مستقل قابل پیکربندی برای **سرفصل‌ها**، **متن اصلی** و **کد**، با استفاده از سینتکس مدرن `axes` فونت‌های متغیر Google، همراه با مجموعه فونت‌های جایگزین برای زمانی که فونت‌ها بارگذاری نمی‌شوند.

<!--more-->

## شروع سریع

فونت‌ها را در `hugo.yaml` سایت خود فعال کنید:

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

همین — نه نیازی به جایگزینی قالب هست، نه CSS سفارشی.

{{< callout type="warning" >}}
وقتی `enable: true` تنظیم شده باشد، `heading`، `body` و `code` را همراه با `fallbacks` آن‌ها تعریف کنید. تولید متغیرهای CSS همه آن‌ها را می‌خواند. `mono` استثناست — اختیاری است و در صورت نبودن به یک پشته تک‌عرض ساده بازمی‌گردد.
{{< /callout >}}

## پارامترها

| پارامتر             | نوع     | توضیح                                                                                                                         |
| ------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `enable`            | boolean | کلید اصلی. وقتی `false` باشد (یا حذف شود)، پوسته از مجموعه فونت سیستمی استفاده می‌کند و چیزی از Google بارگذاری نمی‌کند.      |
| `<group>.family`    | string  | نام دقیق خانواده فونت در Google Fonts، مثلاً `"Inter"`، `"JetBrains Mono"`. فاصله مجاز است — به‌طور خودکار URL-encode می‌شود. |
| `<group>.axes`      | string  | مشخصات محورهای فونت متغیر از URL جاسازی Google Fonts (پایین را ببینید).                                                       |
| `<group>.display`   | string  | راهبرد `font-display`: ‏`auto`، `block`، `swap`، `fallback` یا `optional`. مگر دلیل خاصی داشته باشید، از `swap` استفاده کنید. |
| `fallbacks.<group>` | string  | مجموعه فونت CSS که پس از فونت Google اضافه می‌شود.                                                                            |

`<group>` یکی از `heading`، `body`، `code` یا `mono` است.

## `code` در برابر `mono`

این دو به‌صورت عمدی از هم جدا هستند.

`code` برای **کدی است که می‌خوانید** — بلوک‌های کد، کد درون‌خطی، برجسته‌سازی نحو، gist‌ها، منبع واردشده و منبع سلول‌های نوت‌بوک.

`mono` برای **اجزای تک‌عرض رابط کاربری** است — کلیدهای `<kbd>`، خروجی `<samp>`، نشان میان‌بر جست‌وجو، شمارنده‌های اجرای نوت‌بوک، برچسب‌های هگز نمونه‌رنگ‌ها و هر چیزی که با ابزار `font-mono` سبک‌دهی شده باشد. این‌ها رابط کاربری‌اند، نه کد.

`mono` تنها گروه اختیاری است. اگر `family` را ننویسید، این سطح‌ها تنها از پشته `fallbacks.mono` استفاده می‌کنند و هیچ درخواستی هزینه نمی‌شود.

همه خانواده‌های Google Fonts متغیر نیستند. IBM Plex Mono وزن‌های مجزا می‌گیرد — `wght@400;500;600` — و بازه‌ای مثل `wght@400..600` را با خطای HTTP 400 رد می‌کند.

## پیدا کردن مقدار `axes`

Google Fonts از فهرست‌های ساده وزن به یک قالب URL مبتنی بر محورها مهاجرت کرده است. برای به دست آوردن مقدار درست:

{{% steps %}}

### یک فونت انتخاب کنید

به [fonts.google.com](https://fonts.google.com/) بروید، فونتی را انتخاب کنید، استایل‌ها/وزن‌های دلخواه را برگزینید و روی **Get font** ← **Get embed code** کلیک کنید.

### آدرس جاسازی را کپی کنید

کد جاسازی شامل لینکی مانند این است:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

### خانواده و محورها را استخراج کنید

هر چه قبل از `:` است، خانواده فونت است (`Inter`)؛ هر چه بین `:` و `&` است، رشته محورهاست (`ital,wght@0,400;0,500;0,600;0,700;1,400`).

{{% /steps %}}

الگوهای رایج محورها:

| الگو                       | معنی                                                               |
| -------------------------- | ------------------------------------------------------------------ |
| `wght@400;700`             | وزن‌های ثابت ۴۰۰ و ۷۰۰                                             |
| `wght@100..800`            | دامنه کامل وزن متغیر ۱۰۰ تا ۸۰۰ (یک فایل کوچک برای فونت‌های متغیر) |
| `ital,wght@0,400;1,400`    | حالت معمولی و ایتالیک در وزن ۴۰۰                                   |
| `opsz,wght@6..12,200..900` | دامنه‌های اندازه اپتیکال + وزن                                     |

{{< callout type="info" >}}
برای فونت‌های متغیر، سینتکس بازه‌ای (`wght@100..800`) را ترجیح دهید — همه وزن‌ها را با یک درخواست دریافت می‌کنید، به جای یک فایل برای هر وزن ثابت.
{{< /callout >}}

## نحوه کارکرد داخلی

سه بخش با هم همکاری می‌کنند، همگی در زمان بیلد (بدون JavaScript سمت کاربر):

{{% steps %}}

### `layouts/_partials/google-fonts.html`

از `head.html` فراخوانی می‌شود. وقتی `params.fonts.enable` فعال باشد، ابتدا هینت‌های `<link rel="preconnect">` را برای `fonts.googleapis.com` و `fonts.gstatic.com` تولید می‌کند، سپس برای هر گروه پیکربندی‌شده یک `<link>` استایل‌شیت می‌سازد و URL مربوط به `css2` را از `family`، `axes` و `display` تشکیل می‌دهد. هر گروه در `with` پیچیده شده است، بنابراین گروهی که پیکربندی ندارد هیچ درخواستی تولید نمی‌کند.

### `assets/css/variables.css`

این فایل به‌صورت قالب Hugo اجرا می‌شود (`resources.ExecuteAsTemplate`)، پس می‌تواند پارامترهای سایت را در زمان بیلد بخواند. سه ویژگی سفارشی CSS را روی `:root` تعریف می‌کند:

```css
:root {
  --font-heading: "Sora", system-ui, ...;
  --font-body: "Inter", system-ui, ...;
  --font-code: "JetBrains Mono", ui-monospace, ...;
}
```

وقتی فونت‌ها غیرفعال باشند، این متغیرها به مجموعه‌های سیستمی ساده تبدیل می‌شوند — بقیه CSS هرگز لازم نیست تفاوت را بداند.

### `assets/css/fonts.css`

متغیرها را اعمال می‌کند: ‏`html` مقدار `var(--font-body)` می‌گیرد، `h1` تا `h6` (و سرفصل‌های افزونه تایپوگرافی) مقدار `var(--font-heading)` و `pre`، `code`، `kbd`، `samp` و بلوک‌های کد Hextra مقدار `var(--font-code)`. در بیلدهای تولید، این فایل در `head.html` به استایل‌شیت کامپایل‌شده الحاق می‌شود.

{{% /steps %}}

## دستور پخت‌ها

### یک فونت برای همه جا

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

### ظاهر نشریه‌ای (سرفصل‌های سریف)

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

### همین سایت نمایشی

سایتی که می‌خوانید از Sora برای سرفصل‌ها، Mozilla Text برای متن اصلی و Google Sans Code برای کد استفاده می‌کند — پیکربندی زنده را در [`docs/hugo.yaml`](https://github.com/homelabcentral/hextra/blob/main/docs/hugo.yaml) ببینید.

## عیب‌یابی

- **فونت تغییر نمی‌کند** — بررسی کنید نام خانواده دقیقاً با Google Fonts مطابقت داشته باشد (شامل فاصله‌ها و بزرگی/کوچکی حروف) و صفحه را hard-refresh کنید: لینک استایل‌شیت فقط زمانی ظاهر می‌شود که `params.fonts.enable` فعال باشد.
- **برخی وزن‌ها به‌صورت faux-bold نمایش داده می‌شوند** — مقدار `axes` درخواستی آن وزن را شامل نمی‌شود. آن را اضافه کنید (یا از بازه استفاده کنید).
- **جابه‌جایی چیدمان هنگام بارگذاری** — با `display: swap` طبیعی است؛ برای کاهش آن، مجموعه‌های جایگزین با متریک‌های مشابه انتخاب کنید یا از `display: optional` استفاده کنید تا در اتصال‌های کند، فونت جایگزین ترجیح داده شود.
- **حریم خصوصی/GDPR** — فونت‌ها از CDN گوگل ارائه می‌شوند. اگر باید خودمیزبان باشید، `fonts.enable: false` را نگه دارید و به جای آن قوانین `@font-face` را در `assets/css/custom.css` اضافه کنید، سپس متغیرهای `--font-heading`/`--font-body`/`--font-code` را خودتان تنظیم کنید.
