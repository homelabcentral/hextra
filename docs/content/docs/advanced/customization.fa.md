---
title: سفارشی‌سازی Hextra
linkTitle: سفارشی‌سازی
---

Hextra برخی گزینه‌های پیش‌فرض سفارشی‌سازی را در فایل پیکربندی `hugo.yaml` ارائه می‌دهد تا تم را پیکربندی کنید.
این صفحه گزینه‌های موجود و نحوه سفارشی‌سازی بیشتر تم را توضیح می‌دهد.

<!--more-->

## CSS سفارشی

برای افزودن CSS سفارشی، باید یک فایل `assets/css/custom.css` در سایت خود ایجاد کنیم. Hextra به طور خودکار این فایل را بارگذاری می‌کند.

### خانواده فونت

خانواده فونت محتوا را می‌توان با استفاده از موارد زیر سفارشی کرد:

```css {filename="assets/css/custom.css"}
.content {
  font-family: "Times New Roman", Times, serif;
}
```

### عنصر کد درون خطی

رنگ متن مخلوط شده با `متن دیگر` را می‌توان با موارد زیر سفارشی کرد:

```css {filename="assets/css/custom.css"}
.content code:not(.code-block code) {
  color: #c97c2e;
}
```

### رنگ تاکیدی

تم اکنون از یک رنگ تاکیدی واحد پشتیبانی می‌کند که می‌توانید با افزودن متغیرهای رنگ تاکیدی به پرونده `assets/css/custom.css` خود آن را سفارشی کنید:

```css {filename="assets/css/custom.css"}
:root {
  --color-accent-color-50: oklch(0.977 0.013 236.62);
  --color-accent-color-100: oklch(0.951 0.026 236.824);
  --color-accent-color-200: oklch(0.901 0.058 230.902);
  --color-accent-color-300: oklch(0.828 0.111 230.318);
  --color-accent-color-400: oklch(0.746 0.16 232.661);
  --color-accent-color-500: oklch(0.685 0.169 237.323);
  --color-accent-color-600: oklch(0.588 0.158 241.966);
  --color-accent-color-700: oklch(0.5 0.134 242.749);
  --color-accent-color-800: oklch(0.443 0.11 240.79);
  --color-accent-color-900: oklch(0.391 0.09 240.876);
  --color-accent-color-950: oklch(0.293 0.066 243.157);
}
```

این سیستم رنگ تاکیدی یک پالت رنگی کامل با ۱۱ سایه (۵۰-۹۵۰) ارائه می‌دهد که در سراسر تم برای پیوندها، دکمه‌ها، برجسته‌سازی‌ها و سایر عناصر تاکیدی استفاده خواهد شد.

شما می‌توانید پالت‌های رنگی تاکیدی سفارشی را به صورت رایگان با استفاده از [رنگ‌های رابط کاربری](https://uicolors.app) تولید کنید - کافی است رنگ مورد نظر خود را وارد کنید و تمام سایه‌های لازم برای تم شما تولید خواهد شد.

### برجسته‌کردن سینتکس

Hextra متغیرهای CSS را برای سفارشی‌سازی عرض صفحات، نوار ناوبری و پاورقی ارائه می‌دهد:

```css {filename="assets/css/custom.css"}
:root {
  /* عرض صفحه - همچنین از طریق params.page.width در hugo.yaml قابل پیکربندی است */
  --hextra-max-page-width: 80rem; /* پیش‌فرض: 80rem (نرمال)، 90rem (عریض)، 100% (کامل) */

  /* عرض نوار ناوبری - همچنین از طریق params.navbar.width در hugo.yaml قابل پیکربندی است */
  --hextra-max-navbar-width: 90rem; /* عرض مستقل نوار ناوبری */

  /* عرض پاورقی - همچنین از طریق params.footer.width در hugo.yaml قابل پیکربندی است */
  --hextra-max-footer-width: 80rem; /* عرض مستقل پاورقی */
}
```

### متغیرهای تم Tailwind

با شروع از Hextra v0.10.0 که بر پایه Tailwind CSS v4 ساخته شده است، می‌توانید تم را با بازنویسی متغیرهای CSS در بلوک `@layer theme` سفارشی کنید.

این به شما امکان می‌دهد ظاهر کلی را بدون نیاز به تغییر هر کلاس به صورت جداگانه سفارشی کنید.

```css {filename="assets/css/custom.css"}
@layer theme {
  :root {
    --hx-default-mono-font-family: "JetBrains Mono", monospace;
  }
}
```

برای جزئیات بیشتر، [مستندات متغیرهای تم Tailwind](https://tailwindcss.com/docs/theme#default-theme-variable-reference) را بررسی کنید.

### سفارشی‌سازی بیشتر تم

تم را می‌توان با بازنویسی استایل‌های پیش‌فرض از طریق کلاس‌های CSS در معرض، بیشتر سفارشی کرد. مثالی برای سفارشی‌سازی عنصر پاورقی:

```css {filename="assets/css/custom.css"}
.hextra-footer {
  /* استایل‌ها روی عنصر پاورقی اعمال می‌شوند */
}

.hextra-footer:is(html[class~="dark"] *) {
  /* استایل‌ها روی عنصر پاورقی در حالت تاریک اعمال می‌شوند */
}
```

از کلاس‌های زیر می‌توان برای سفارشی‌سازی بخش‌های مختلف تم استفاده کرد.

#### عمومی

- `hextra-scrollbar` - عنصر نوار پیمایش
- `content` - ظرف محتوای صفحه

#### شورتکدها

##### نشان

- `hextra-badge` - عنصر نشان

##### کارت

- `hextra-card` - عنصر کارت
- `hextra-card-image` - عنصر تصویر کارت
- `hextra-card-icon` - عنصر آیکون کارت
- `hextra-card-subtitle` - عنصر زیرنویس کارت

##### کارت‌ها

- `hextra-cards` - ظرف شبکه‌ای کارت‌ها

##### نوت‌بوک Jupyter

- `hextra-jupyter-code-cell` - ظرف سلول کد Jupyter
- `hextra-jupyter-code-cell-outputs-container` - ظرف خروجی‌های سلول کد Jupyter
- `hextra-jupyter-code-cell-outputs` - عنصر div خروجی سلول کد Jupyter

##### PDF

- `hextra-pdf` - عنصر ظرف PDF

##### مراحل

- `hextra-steps` - ظرف مراحل

##### تب‌ها

- `hextra-tabs-panel` - ظرف پنل تب‌ها
- `hextra-tabs-toggle` - دکمه تغییر تب‌ها

##### درخت فایل

- `hextra-filetree` - ظرف درخت فایل

##### پوشه

- `hextra-filetree-folder` - ظرف پوشه درخت فایل

#### نوار ناوبری

- `hextra-nav-container` - ظرف نوار ناوبری
- `hextra-nav-container-blur` - عنصر ظرف نوار ناوبری در حالت محو
- `hextra-hamburger-menu` - دکمه منوی همبرگری

#### پاورقی

- `hextra-footer` - عنصر پاورقی
- `hextra-custom-footer` - ظرف بخش پاورقی سفارشی

#### جستجو

- `hextra-search-trigger` - دکمه فعال‌کننده جستجو
- `hextra-search-dialog` - عنصر دیالوگ جستجو
- `hextra-search-input` - عنصر ورودی جستجو
- `hextra-search-results` - ظرف لیست نتایج جستجو

کلاس‌ها و انتخابگرهای تو در تو اختیاری مورد استفاده در رابط کاربری جستجو:

- `hextra-search-crumb` - برچسب مسیر برای نخستین نتیجه از یک صفحه
- `hextra-search-title` - عنصر عنوان نتیجه
- `hextra-search-excerpt` - متن خلاصه نتیجه
- `hextra-search-match` - span پرس و جوی هایلایت شده
- `hextra-search-empty` - عنصر حالت خالی
- `a[role="option"][aria-selected="true"]` - لنکر نتیجه انتخاب‌شده

#### فهرست مطالب

- `hextra-toc` - ظرف فهرست مطالب

#### نوار کناری

- `hextra-sidebar-container` - ظرف نوار کناری
- `hextra-sidebar-active-item` - آیتم فعال در نوار کناری

#### تغییردهنده زبان

- `hextra-language-switcher` - دکمه تغییردهنده زبان
- `hextra-language-options` - ظرف گزینه‌های زبان

#### تغییردهنده تم

- `hextra-theme-toggle` - دکمه تغییر تم

#### دکمه کپی کد

- `hextra-code-copy-btn-container` - ظرف دکمه کپی کد
- `hextra-code-copy-btn` - دکمه کپی کد
- `hextra-copy-icon` - عنصر آیکون کپی
- `hextra-success-icon` - عنصر آیکون موفقیت

#### بلوک کد

- `hextra-code-block` - ظرف بلوک کد
- `hextra-code-filename` - عنصر نام فایل برای بلوک‌های کد

#### کارت ویژگی

- `hextra-feature-card` - عنصر لینک کارت ویژگی

#### شبکه ویژگی

- `hextra-feature-grid` - ظرف شبکه ویژگی

#### هایلایت سینتکس

لیست تم‌های هایلایت سینتکس موجود در [گالری استایل‌های Chroma](https://xyproto.github.io/splash/docs/all.html) قابل مشاهده است. برگه استایل را می‌توان با دستور زیر تولید کرد:

```shell
hugo gen chromastyles --style=github
```

برای بازنویسی تم پیش‌فرض هایلایت سینتکس، می‌توانیم استایل‌های تولید شده را به فایل CSS سفارشی اضافه کنیم.

## اسکریپت‌های سفارشی

می‌توانید اسکریپت‌های سفارشی را به انتهای head برای هر صفحه با افزودن فایل زیر اضافه کنید:

```
layouts/_partials/custom/head-end.html
```

## بخش اضافی سفارشی در پاورقی

می‌توانید بخش اضافی در پاورقی با ایجاد یک فایل `layouts/_partials/custom/footer.html` در سایت خود اضافه کنید.

```html {filename="layouts/_partials/custom/footer.html"}
<!-- عنصر پاورقی شما اینجا -->
```

بخش اضافه شده قبل از بخش کپی‌رایت در پاورقی اضافه می‌شود.
می‌توانید از [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) و [سینتکس قالب Hugo](https://gohugo.io/templates/) برای افزودن محتوای خود استفاده کنید.

متغیرهای Hugo موجود در بخش پاورقی عبارتند از: `.switchesVisible` و `.displayCopyright`.

## بخش‌های سفارشی صفحه

می‌توانید با ایجاد هر یک از فایل‌های زیر در سایت خود، بخش‌های سفارشی را پیرامون محتوای هر صفحه اضافه کنید:

```
layouts/_partials/custom/page-begin.html
layouts/_partials/custom/content-begin.html
layouts/_partials/custom/content-end.html
layouts/_partials/custom/page-end.html
```

هوک‌های صفحه داخل عنصر `<main>` صفحه رندر می‌شوند. هوک‌های محتوا بلافاصله قبل و بعد از محتوای صفحه رندر می‌شوند.

هر partial صفحه فعلی Hugo را به عنوان context دریافت می‌کند، بنابراین می‌توانید از پارامترهای صفحه، پارامترهای سایت و دیگر قابلیت‌های قالب Hugo استفاده کنید.

## چیدمان‌های سفارشی

چیدمان‌های تم را می‌توان با ایجاد یک فایل با همان نام در دایرکتوری `layouts` سایت خود بازنویسی کرد.
به عنوان مثال، برای بازنویسی چیدمان `single.html` برای مستندات، یک فایل `layouts/docs/single.html` در سایت خود ایجاد کنید.

برای اطلاعات بیشتر، به [مستندات قالب‌های Hugo][hugo-template-docs] مراجعه کنید.

## سفارشی‌سازی بیشتر

آیا آنچه را که به دنبالش بودید پیدا نکردید؟ با خیال راحت [یک بحث باز کنید](https://github.com/homelabcentral/hextra/discussions) یا به تم کمک کنید!

[hugo-template-docs]: https://gohugo.io/templates/
