---
title: سایر شورتکدها
linkTitle: سایر
next: /docs/guide/deploy-site
---

{{< callout type="warning" >}}
برخی از این‌ها شورتکدهای داخلی Hugo هستند.
این شورتکدها کمتر پایدار در نظر گرفته می‌شوند و ممکن است هر زمان تغییر کنند.
{{< /callout >}}

## نشان

### أمثلة

{{< badge "default" >}}
{{< badge content="border" border=false >}}
{{< badge content="color" color="green" >}}
{{< badge content="link" link="https://github.com/homelabcentral/hextra/releases" >}}
{{< badge content="icon" icon="sparkles" >}}
### الاستخدام

#### تقصير

{{< badge "Badge" >}}
```
{{</* badge "Badge" */>}}
```

#### الألوان

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

#### اندازه‌ها

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

مقدار پیش‌فرض `md` است — همان اندازه‌ای که همه نشان‌ها پیش از افزوده‌شدن `size` با آن رندر می‌شدند، پس این پارامتر چیزی را در سایت‌های موجود جابه‌جا نمی‌کند. آیکون همراه با پله تغییر می‌کند، بنابراین یک نشان هرگز آیکونی با اندازه پله‌ای دیگر ندارد. اندازه ناشناخته خطا نیست: هنگام ساخت هشدار می‌دهد و با `md` رندر می‌شود.

دو سر این مقیاس برای دو کاری هستند که پله‌های میانی خوب انجام نمی‌دهند. `xs` برای یادداشت کناری است — یک شمارش، یک نسخه، یک وضعیت کنار عنوان — و `xl` برای نشانی در سرصفحه که باید هم‌اندازه متن پیرامونش خوانده شود.

یک نشان پیونددار `xs` یا `sm` ناحیه کلیک ۲۴&times;۲۴ پیکسل CSS را نگه می‌دارد، حتی وقتی خودِ قرص از آن کوچک‌تر است؛ این همان چیزی است که [WCAG 2.2 SC 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum) در سطح AA می‌خواهد. این کف برای برچسب کوتاه هم برقرار است: نشانی با یک نویسه همچنان هدفی ۲۴&times;۲۴ است با قرصی که در میان آن قرار می‌گیرد.

#### آیکون‌ها

{{< badge content="Bundled" icon="sparkles" >}}
{{< badge content="Remote" icon="simple:hugo" >}}
{{< badge content="Project file" icon="file:icons/hexagon.svg" >}}

```
{{</* badge content="Bundled" icon="sparkles" */>}}
{{</* badge content="Remote" icon="simple:hugo" */>}}
{{</* badge content="Project file" icon="file:icons/hexagon.svg" */>}}
```

`icon` هر نامی را می‌پذیرد که کوتاه‌کد [Icon](/docs/guide/shortcodes/icon) می‌پذیرد: یک ورودی از `data/icons.yaml`، یک `provider:name` راه دور، یا `file:` و سپس مسیر یک SVG در پروژه خودتان.

مسیر `file:` نخست به‌عنوان منبعِ page bundle جاری و سپس در پوشه `assets/` سایت پیدا می‌شود — `file:icons/hexagon.svg` فایل `assets/icons/hexagon.svg` را می‌یابد. فایل به‌جای پیوند شدن، درون‌خطی می‌شود؛ بنابراین مانند هر آیکون دیگری با پله `size` اندازه می‌گیرد و SVG‌ای که `fill` یا `stroke` خودش را ندارد رنگ متن نشان را از راه `currentColor` به ارث می‌برد. تنها عنصر ریشه `<svg>` بازنویسی می‌شود، پس فایلی که `<svg>` تودرتو دارد اندازه و کلاس آن عنصر درونی را نگه می‌دارد. فایلی هم که `viewBox` ندارد نسبت ابعادش را از دست نمی‌دهد.

فقط SVG کار می‌کند. مسیری به یک PNG، یا به فایلی که وجود ندارد، به‌جای رندر خالی، ساخت را با خطا متوقف می‌کند.

#### المتغيرات

{{< badge content="Badge" icon="sparkles" >}}
{{< badge content="Releases" link="https://github.com/homelabcentral/hextra/releases" icon="github" >}}
```
{{</* badge content="Badge" icon="sparkles" */>}}
{{</* badge content="Releases" link="https://github.com/homelabcentral/hextra/releases" icon="github" */>}}
```

### خيارات

| المعلمة   | وصف                                                                                                       |
| --------- | --------------------------------------------------------------------------------------------------------- |
| `content` | نص الشارة.                                                                                                |
| `link`    | رابط الشارة.                                                                                              |
| `icon`    | آیکون نشان. یک نام بسته‌ای، یک `provider:name` راه دور، یا `file:<path>` برای یک SVG در پروژه خودتان.      |
| `size`    | اندازه نشان.<br/> `xs`, `sm`, `md` (پیش‌فرض), `lg`, `xl`.                                                  |
| `color`   | `gray` (تقصير), `purple`, `indigo`, `blue`, `green`, `yellow`, `amber`, `orange`, `red`.<br/> لون الشارة. |
| `class`   | فئة الشارة.                                                                                               |
| `border`  | إضافة أو إزالة الحدود (افتراضي: true                                                                      |

## یوتیوب

تعبیه یک ویدیوی یوتیوب.

```
{{</* youtube VIDEO_ID */>}}
```

نتیجه:

{{< youtube id=dQw4w9WgXcQ loading=lazy >}}

برای اطلاعات بیشتر، به [شورتکد یوتیوب Hugo](https://gohugo.io/content-management/shortcodes/#youtube) مراجعه کنید.

## پی‌دی‌اف

با شورتکد پی‌دی‌اف، می‌توانید یک فایل پی‌دی‌اف را در محتوای خود تعبیه کنید.

```
{{</* pdf "https://example.com/sample.pdf" */>}}
```

همچنین می‌توانید فایل پی‌دی‌اف را در دایرکتوری پروژه خود قرار دهید و از مسیر نسبی استفاده کنید.

```
{{</* pdf "path/to/file.pdf" */>}}
```

مثال:

{{< pdf "https://upload.wikimedia.org/wikipedia/commons/1/13/Example.pdf" >}}
