---
title: فاوآیکون‌ها
weight: 5
---

فایل‌های فاوآیکون در یک پوشه اختصاصی `static/icons/` سازماندهی شده‌اند، با پشتیبانی از **فاوآیکون خودکار حالت تاریک** پشتیبانی می‌کند که از طرح رنگ سیستم‌عامل بازدیدکننده پیروی می‌کند.

<!--more-->

## ساختار پوشه‌ها

فاوآیکون‌ها به‌جای پراکندگی در `static/`، زیر `static/icons/` قرار دارند:

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

`layouts/_partials/favicons.html`، `assets/js/core/favicon.js` و `static/site.webmanifest` همگی به مسیرهای `icons/` ارجاع می‌دهند، بنابراین فایل‌های آیکون سایت شما باید در `static/icons/` قرار داشته باشند، نه `static/`.

## فاوآیکون حالت تاریک

یک فایل `favicon-dark.svg` کنار `favicon.svg` قرار دهید:

- در زمان بیلد، `favicon.js` با `fileExists "static/icons/favicon-dark.svg"` بررسی می‌شود — اگر فایل موجود نباشد، هیچ کد تعویضی اصلاً اجرا نمی‌شود.
- در زمان اجرا، اسکریپت `window.matchMedia("(prefers-color-scheme: dark)")` را زیر نظر می‌گیرد و هر بار که طرح رنگ سیستم‌عامل تغییر کند، مقدار `href` عنصر `<link>` فاوآیکون SVG ‏(`id="favicon-svg"`) را به‌صورت زنده بین `icons/favicon.svg` و `icons/favicon-dark.svg` تعویض می‌کند.

{{< callout type="info" >}}
این تعویض از طرح رنگ **سیستم‌عامل** پیروی می‌کند، نه کلید تغییر تم سایت — رابط تب مرورگر توسط تم سیستم‌عامل نمایش داده می‌شود، پس این رفتار با آنچه کاربران واقعاً اطراف فاوآیکون می‌بینند مطابقت دارد.
{{< /callout >}}

## راه‌اندازی آیکون‌های خودتان

{{% steps %}}

### تولید مجموعه

از ابزاری مانند [RealFaviconGenerator](https://realfavicongenerator.net/) با یک SVG واحد یا PNG با وضوح بالا استفاده کنید. به هشت فایل فهرست‌شده در بالا نیاز دارید.

### ساخت نسخه تاریک

`favicon.svg` را با نام `favicon-dark.svg` کپی کنید و رنگ‌های پرکننده را برای تب‌های تاریک تنظیم کنید (معمولاً: خطوط تیره روشن می‌شوند). اگر آیکون شما از قبل روی هر دو پس‌زمینه کار می‌کند، از این فایل صرف‌نظر کنید — پوسته به‌آرامی به حالت عادی بازمی‌گردد.

### جای‌گذاری فایل‌ها

همه چیز را در `static/icons/` بگذارید و `site.webmanifest` را در ریشه `static/` نگه دارید.

{{% /steps %}}
