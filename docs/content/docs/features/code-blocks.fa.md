---
title: بلوک‌های کد
weight: 4
---

Hextra بلوک‌های کد را برای ظاهری شفاف‌تر و «ویرایشگرمانند» بازآرایی می‌کند: حاشیه‌های قابل مشاهده در هر دو حالت، گوشه‌های تیزتر، پس‌زمینه‌های مبتنی بر پالت و برجسته‌سازی خط با رنگ تأکیدی. همه تغییرات در `assets/css/highlight.css` قرار دارند و به هیچ پیکربندی نیاز ندارند — روی همه بلوک‌های کد اعمال می‌شوند.

<!--more-->

## برجسته‌سازی خط

خطوط را به روش استاندارد Hugo برجسته کنید؛ آن‌ها با [پالت تأکیدی](accent-color) استایل داده می‌شوند:

````markdown {filename="Markdown"}
```go {hl_lines=[3,4]}
package main

import "fmt"       // highlighted
func main() {}     // highlighted
```
````

به این شکل نمایش داده می‌شود:

```go {hl_lines=[3,4]}
package main

import "fmt"       // highlighted
func main() {}     // highlighted
```

نحوه نمایش:

- **حالت روشن**: پس‌زمینه `hextra-accent-200` با شفافیت ۶۰٪ و حاشیه چپ 2px از `hextra-accent-500`
- **حالت تاریک**: پس‌زمینه `hextra-accent-950` با شفافیت ۶۰٪ و همان حاشیه `hextra-accent-500`

چون این‌ها توکن‌های تأکیدی هستند، با تغییر رنگ تأکیدی، برجسته‌سازی‌ها به‌طور خودکار بازرنگ می‌شوند.

## شماره خطوط

بلوک‌های دارای `linenos=table` رفتار حاشیه‌ای ویژه‌ای دارند. Chroma کد شماره‌گذاری‌شده را به‌صورت یک جدول دوسلولی (شماره‌ها | کد) نمایش می‌دهد که یک حاشیه ساده را خراب می‌کند. حاشیه بین سلول‌ها تقسیم می‌شود:

- سلول اول (`.lntd:first-child pre`): حاشیه چپ + بالا/پایین، گوشه‌های گرد چپ
- سلول آخر (`.lntd:last-child pre`): حاشیه راست + بالا/پایین، گوشه‌های گرد راست

نتیجه یک حاشیه پیوسته دور کل جدول است. خطوط برجسته درون سلول کد نیز حاشیه چپ تأکیدی خود را از دست می‌دهند (در غیر این صورت وسط بلوک، بین شماره‌ها و کد، ظاهر می‌شد).

````markdown {filename="Markdown"}
```go {linenos=table,hl_lines=[2]}
package main
func main() {}
```
````

به این شکل نمایش داده می‌شود:

```go {linenos=table,hl_lines=[2]}
package main
func main() {}
```

## سربرگ‌های نام فایل

````markdown {filename="Markdown"}
```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
```
````

به این شکل نمایش داده می‌شود:

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
```

نوار نام فایل با حاشیه و پس‌زمینه پالت مخصوص خود (`neutral-200` در حالت روشن / `neutral-800` در حالت تاریک) بدون فاصله روی بلوک می‌نشیند و از نظر بصری مانند یک تب ویرایشگر خوانده می‌شود.

## آیکون‌های نوع فایل

وقتی نام فایل تنظیم شده باشد، نوار یک آیکون تک‌رنگ متناسب با پسوند فایل نشان می‌دهد (و در صورت نبود، به زبان بلوک کد بازمی‌گردد). آیکون‌ها رنگ متن نوار را به ارث می‌برند، بنابراین به‌طور خودکار با حالت روشن و تاریک سازگار می‌شوند:

````markdown {filename="Markdown"}
```js {filename="app.js"}
console.log("Hello!");
```
````

به این شکل نمایش داده می‌شود:

```js {filename="app.js"}
console.log("Hello!");
```

پیش‌فرض‌ها از [Simple Icons](https://simpleicons.org) برای زبان‌ها و ابزارها استفاده می‌کنند که درون پوسته قرار داده شده‌اند تا بیلدها آفلاین هم کار کنند. آیکون تعیین‌شده را برای هر بلوک با ویژگی `icon` جایگزین کنید، نگاشت‌های پسوند/زبان را با ساخت فایل `data/codeblock-icons.yaml` خودتان گسترش دهید، یا این ویژگی را به‌کلی غیرفعال کنید:

```yaml {filename="hugo.yaml"}
params:
  highlight:
    filenameIcon:
      enable: false
```

برای مرجع کامل، [برجسته‌سازی سینتکس](../guide/syntax-highlighting#file-type-icon) را ببینید.

## همه با هم

نام فایل، شماره خطوط و برجسته‌سازی تأکیدی با هم ترکیب می‌شوند:

````markdown {filename="Markdown"}
```python {filename="hello.py",linenos=table,hl_lines=[2,5]}
def say_hello():
    print("Hello!")

def main():
    say_hello()
```
````

به این شکل نمایش داده می‌شود:

```python {filename="hello.py",linenos=table,hl_lines=[2,5]}
def say_hello():
    print("Hello!")

def main():
    say_hello()
```

## فونت کد

وقتی [فونت‌های Google](google-fonts) فعال باشند، بلوک‌های کد (و کد درون‌خطی) از فونت `code` پیکربندی‌شده از طریق `var(--font-code)` استفاده می‌کنند — بدون هیچ تنظیم اضافی.

## سفارشی‌سازی

همه چیز توسط توکن‌های پالت و رنگ تأکیدی کنترل می‌شود، بنابراین همان مسیر معمول جایگزینی به کار می‌رود — متغیرها را در `assets/css/custom.css` تنظیم کنید. به پیشوند `--hx-` توجه کنید: هکسترا تِیلویند را با `@import "tailwindcss" prefix(hx)` وارد می‌کند که پیشوند را به متغیرهای خروجی هم اضافه می‌کند، پس `--color-neutral-950` بدون پیشوند نامی نیست که چیزی آن را بخواند.

```css {filename="assets/css/custom.css"}
:root {
  /* Lighter code block background in dark mode */
  --hx-color-neutral-950: oklch(9% 0 0);
}
```

برای تغییرات ساختاری (شعاع گوشه، عرض حاشیه)، کلاس‌ها را مستقیماً جایگزین کنید:

```css {filename="assets/css/custom.css"}
.hextra-code-block pre:not(.lntable pre) {
  border-radius: 0.5rem; /* back to a rounder look */
}
```
