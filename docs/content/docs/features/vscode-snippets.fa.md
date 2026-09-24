---
title: اسنیپت‌های VS Code
weight: 7
---

Hextra فایل `.vscode/hextra.code-snippets` را ارائه می‌کند — ۱۱۵ اسنیپت دست‌نوشته VS Code که همه Shortcodeهای Hextra، کلیدهای Front matter صفحه که چیدمان‌ها می‌خوانند و ویژگی‌های بلوک کد که هوک‌های رندر می‌فهمند را پوشش می‌دهند. مخزن را در VS Code باز کنید و بلافاصله در دسترس‌اند؛ نه افزونه‌ای لازم است، نه پیکربندی.

<!--more-->

## چرا

ویژگی‌های Hextra فقط با خواندن مستندات قابل کشف‌اند. نوشتن یک صفحه یعنی به خاطر سپردن اینکه رنگ تگ کارت `tagColor` است (نه `tagType`)، اینکه یک مورد گالری موزائیکی `span="wide"` می‌گیرد، اینکه برجسته‌سازی خط با `hl_lines=[2,4]` انجام می‌شود، و اینکه پنج Shortcode به جای براکت‌های زاویه‌دار معمول به [نشانه‌گذاری درصدی](#notation-is-not-uniform) نیاز دارند. اسنیپت‌ها همه این‌ها را پشت یک پیشوند و یک `Tab` قرار می‌دهند.

هر نام پارامتر در این فایل از فراخوانی‌های `‎.Get "…"‎` در `layouts/_shortcodes/` گرفته شده و هر مقدار enum از نگاشت‌های استایل در `layouts/_partials/shortcodes/` — نه از مستندات، که ممکن است کهنه شوند.

## استفاده از آن‌ها

در هر فایل Markdown یک پیشوند تایپ کنید و `Tab` را بزنید. هر پیشوند با `hx` شروع می‌شود، پس هرگز با اسنیپت‌های عمومی Markdown تداخل نمی‌کنند:

| پیشوند    | پوشش می‌دهد           |
| --------- | --------------------- |
| `hx`      | همه Shortcodeها       |
| `hxfm-`   | بلوک‌های Front matter |
| `hxcode-` | انواع بلوک‌های کد     |

پارامترهای enum به‌صورت **جای‌بان انتخابی** هستند — با `Tab` روی آن‌ها بروید تا VS Code به جای متن آزاد، مقادیر معتبر را در یک منوی کشویی پیشنهاد دهد:

| پارامتر                        | گزینه‌ها                                                                |
| ------------------------------ | ----------------------------------------------------------------------- |
| `callout type`                 | `default` `info` `warning` `error` `important`                          |
| `badge color`، `card tagColor` | `gray` `purple` `indigo` `blue` `green` `yellow` `orange` `amber` `red` |
| `gallery type`                 | `grid` `mosaic` `masonry` `carousel`                                    |
| `gallery-item span`            | `wide` `tall` `large`                                                   |
| `filetree/folder state`        | `open` `closed`                                                         |
| `card method`                  | `Resize` `Fit` `Fill` `Crop`                                            |
| `width` (front matter)         | `normal` `wide` `full`                                                  |
| `linenos`                      | `table` `inline`                                                        |

پس `hxcallout` + ‏`Tab` شما را روی منوی کشویی type می‌برد و سپس بدنه:

```markdown
{{</* callout type="info" */>}}
Content
{{</* /callout */>}}
```

## نشانه‌گذاری یکسان نیست

پنج Shortcode از جداکننده‌های درصدی استفاده می‌کنند تا محتوای درونشان به‌صورت Markdown رندر شود؛ بقیه از براکت‌های زاویه‌دار استفاده می‌کنند. اشتباه گرفتن این موضوع، محتوایی تولید می‌کند که به‌صورت متن خام نمایش داده می‌شود. اسنیپت‌ها برای هر کدام نشانه‌گذاری درست را در خود دارند:

| نشانه‌گذاری     | Shortcodeها                                 |
| --------------- | ------------------------------------------- |
| `{{%/* … */%}}` | `steps`، `details`، `include`، `ltr`، `rtl` |
| `{{</* … */>}}` | بقیه موارد                                  |

## مرجع

### Shortcodeها

| پیشوند                  | چه چیزی درج می‌کند                                                 |
| ----------------------- | ------------------------------------------------------------------ |
| `hxcallout`             | جعبه کال‌اوت؛ نوع آن رنگ و آیکون پیش‌فرض را تعیین می‌کند           |
| `hxcallout-emoji`       | کال‌اوت با ایموجی سفارشی                                           |
| `hxcallout-icon`        | کال‌اوت با نام آیکون صریح                                          |
| `hxcards`               | ظرف شبکه کارت‌ها با دو کارت                                        |
| `hxcard`                | یک کارت — لینک، عنوان، آیکون، زیرعنوان                             |
| `hxcard-tag`            | کارت با تگ نشان — `tagColor`، `tagIcon`، `tagBorder`               |
| `hxcard-image`          | کارت تصویری — `method`/`options` به پردازش تصویر Hugo داده می‌شوند |
| `hxtabs`                | رابط تب‌دار با دو تب                                               |
| `hxtab`                 | یک تب — `name`، `icon`، `selected`                                 |
| `hxsteps`               | فهرست مراحل شماره‌گذاری‌شده با سرفصل‌های h3                        |
| `hxdetails`             | بلوک جمع‌شونده                                                     |
| `hxfiletree`            | درخت فایل با یک پوشه و یک فایل                                     |
| `hxfiletree-folder`     | گره پوشه                                                           |
| `hxfiletree-file`       | گره فایل                                                           |
| `hxgallery`             | ظرف گالری با دو مورد                                               |
| `hxgallery-item`        | تصویر گالری محلی                                                   |
| `hxgallery-item-remote` | تصویر گالری راه دور، با `width`/`height` الزامی                    |
| `hxbadge`               | نشان — محتوا، رنگ، آیکون                                           |
| `hxbadge-inline`        | نشان، شکل کوتاه با پارامترهای موقعیتی                              |
| `hxbadge-link`          | نشان پیچیده‌شده در یک لینک                                         |
| `hxicon`                | آیکون SVG داخلی                                                    |
| `hxicon-remote`         | آیکون راه دور — `lucide:` / `tabler:` / `simple:`                  |
| `hxjupyter`             | جاسازی نوت‌بوک Jupyter                                             |
| `hxpdf`                 | جاسازی PDF                                                         |
| `hxasciinema`           | ضبط Asciinema با گزینه‌های پخش                                     |
| `hxterm`                | اصطلاح واژه‌نامه                                                   |
| `hxinclude`             | درج درون‌خطی محتوای صفحه‌ای دیگر                                   |
| `hxaccordion`           | ظرف آکاردئون با دو بخش                                             |
| `hxaccordion-item`      | یک بخش آکاردئون                                                    |
| `hxarticle`             | کارت صفحه‌ای دیگر — عنوان، خلاصه، تصویر جلد                        |
| `hxbutton`              | پیوند با ظاهر دکمه، از طریق `href`                                 |
| `hxbutton-page`         | دکمه‌ای که با `pageRef` به صفحه‌ای درون سایت پیوند می‌دهد          |
| `hxcta`                 | دکمه فراخوان به اقدام                                              |
| `hxlead`                | پاراگراف آغازین                                                    |
| `hxborderless`          | جدول مرجع بدون خطوط سلول                                           |
| `hxkeywords`            | ظرف کلیدواژه با دو کلیدواژه                                        |
| `hxkeyword`             | یک کلیدواژه                                                        |
| `hxstats`               | شبکه آمار با دو عدد                                                |
| `hxstat`                | یک عدد آماری                                                       |
| `hxtimeline`            | ظرف خط زمانی با یک ورودی                                           |
| `hxtimeline-item`       | یک ورودی خط زمانی — `badge`، `badgeColor`، `badgeIcon`، `icon`     |
| `hxswatches`            | پالت رنگ از کدهای هگز موضعی                                        |
| `hxlist`                | فهرست صفحه‌ها، فیلترشده با `where`/`value`                         |
| `hxad`                  | یک تبلیغ در این نقطه — به تنظیم `params.ads` نیاز دارد             |
| `hxadprovider`          | تبلیغ با شبکه، قالب و ترازبندی مشخص                                |
| `hxchart`               | نمودار Chart.js از پیکربندی درون‌خطی                               |
| `hxtypeit`              | جلوه ماشین‌تحریر، هر خط یک رشته                                    |
| `hxvideo`               | ویدئوی میزبانی‌شده روی سایت با کنترل‌ها                            |
| `hxvideo-autoplay`      | ویدئوی پس‌زمینه — autoplay یعنی بی‌صدا                             |
| `hxyoutube`             | جاسازی یوتیوب که پخش‌کننده را فقط با کلیک بارگذاری می‌کند          |
| `hxemail`               | پیوند mailto مبهم‌سازی‌شده                                         |
| `hxgithub`              | کارت مخزن گیت‌هاب                                                  |
| `hxgitlab`              | کارت پروژه گیت‌لب با مسیر فضای‌نام                                 |
| `hxgitlab-id`           | کارت پروژه گیت‌لب با شناسه عددی                                    |
| `hxgitea`               | کارت مخزن Gitea                                                    |
| `hxforgejo`             | کارت مخزن Forgejo                                                  |
| `hxcodeberg`            | کارت مخزن Codeberg                                                 |
| `hxhuggingface`         | کارت مدل Hugging Face                                              |
| `hxhuggingface-dataset` | کارت مجموعه‌داده Hugging Face                                      |
| `hxansible`             | کارت نقش Ansible Galaxy                                            |
| `hxansible-collection`  | کارت مجموعه Ansible Galaxy                                         |
| `hxgist`                | gist گیت‌هاب در قالب بلوک کد پوسته                                 |
| `hxgist-live`           | gist که در مرورگر خواننده تازه‌سازی می‌شود                         |
| `hxcodeimporter`        | وارد کردن فایلی از یک URL به‌صورت بلوک کد                          |
| `hxcodeimporter-lines`  | بخش واردشده با شماره خط و خطوط برجسته                              |
| `hxcodeimporter-live`   | فایل واردشده که در مرورگر خواننده تازه‌سازی می‌شود                 |
| `hxltr`                 | اجبار چپ‌به‌راست درون صفحه راست‌به‌چپ                              |
| `hxrtl`                 | اجبار راست‌به‌چپ درون صفحه چپ‌به‌راست                              |
| `hxhero`                | بلوک کامل Hero برای صفحه `hextra-home`                             |
| `hxhero-container`      | ظرف Hero با تصویر کناری                                            |
| `hxhero-headline`       | تیتر Hero                                                          |
| `hxhero-subtitle`       | زیرعنوان Hero                                                      |
| `hxhero-badge`          | نشان قرصی بالای تیتر                                               |
| `hxhero-button`         | دکمه فراخوان Hero                                                  |
| `hxhero-section`        | سرفصل بخش در چیدمان صفحه اصلی                                      |
| `hxfeature-grid`        | شبکه ویژگی‌ها با دو کارت                                           |
| `hxfeature-card`        | کارت ویژگی                                                         |
| `hxfeature-card-image`  | کارت ویژگی با تصویر پس‌زمینه و گرادیان                             |

### Front matter

| پیشوند         | چه چیزی درج می‌کند                                                              |
| -------------- | ------------------------------------------------------------------------------- |
| `hxfm-docs`    | صفحه مستندات — `title`، `weight`، `toc`، `breadcrumbs`، `math`، `excludeSearch` |
| `hxfm-section` | فایل `_index.md` بخش — `prev`/`next`، `sidebar.open`، `cascade.type`            |
| `hxfm-blog`    | نوشته وبلاگ — `date`، `authors`، `tags`                                         |
| `hxfm-series`  | بلوک مجموعه — `series`، `seriesOrder`، `seriesOpened`                           |
| `hxfm-home`    | صفحه اصلی — `layout: hextra-home`                                               |
| `hxfm-sidebar` | بلوک `sidebar:` — ‏`open`، `exclude`، `hide`                                    |
| `hxfm-width`   | جایگزینی عرض صفحه — `normal` 80rem، ‏`wide` 90rem، ‏`full` 100%                 |
| `hxfm-cascade` | انتقال آبشاری یک پارامتر به صفحات زیرمجموعه (مثلاً `reversePagination`)         |

### بلوک‌های کد

| پیشوند           | چه چیزی درج می‌کند                                                |
| ---------------- | ----------------------------------------------------------------- |
| `hxcode`         | بلوک کد با سربرگ `filename`                                       |
| `hxcode-lines`   | بلوک کد با `linenos`، `hl_lines`، `linenostart`                   |
| `hxcode-baseurl` | بلوکی که سربرگ نام فایل آن از طریق `base_url` به منبع لینک می‌شود |
| `hxmermaid`      | بلوک نمودار Mermaid                                               |
| `hxmath`         | بلوک ریاضی نمایشی (به `math: true` نیاز دارد)                     |

## قالب فایل

برای هر اسنیپت یک شیء JSON. هر مدخل به `markdown` محدود شده، یک `description` دارد که منبع اصلی را نام می‌برد، و برای enumها از `${n|a,b|}` استفاده می‌کند:

```json {filename=".vscode/hextra.code-snippets"}
{
  "Hextra: callout": {
    "scope": "markdown",
    "prefix": "hxcallout",
    "body": ["{{</* callout type=\"${1|default,info,warning,error,important|}\" */>}}", "  ${2:Content}", "{{</* /callout */>}}"],
    "description": "Callout box. Each type picks its own color and default icon (layouts/_shortcodes/callout.html)."
  }
}
```

VS Code هر فایل `*.code-snippets` در `.vscode/` را به‌طور خودکار بارگذاری می‌کند، بنابراین هیچ چیزی در `settings.json` به آن ارجاع نمی‌دهد.

{{< callout type="info" >}}
پارامترهای منسوخ‌شده عمداً غایب‌اند. `tabs` هنوز `items=` و `defaultIndex=` را می‌پذیرد و `card` هنوز `tagType=` را، اما هر سه در زمان بیلد `warnf` تولید می‌کنند — اسنیپت‌ها در عوض از `tab name=`، `tab selected=` و `tagColor=` استفاده می‌کنند.
{{< /callout >}}

## همگام نگه داشتن آن‌ها

اسنیپت‌ها دست‌نوشته‌اند، پس اگر یک Shortcode پارامتری اضافه یا تغییر نام دهد ممکن است کهنه شوند. این تک‌خطی هر `param=` در فایل را با فراخوانی‌های واقعی `.Get` در پوسته مقایسه می‌کند و هر ناهماهنگی را چاپ می‌کند:

```bash
node -e '
const fs=require("fs"), cp=require("child_process");
const s=JSON.parse(fs.readFileSync(".vscode/hextra.code-snippets","utf8"));
const known={};
for(const f of cp.execSync("find layouts/_shortcodes -name \x27*.html\x27").toString().trim().split("\n")){
  const name=f.replace("layouts/_shortcodes/","").replace(/\.html$/,"");
  known[name]=new Set([...fs.readFileSync(f,"utf8").matchAll(/\.Get "([a-zA-Z0-9_-]+)"/g)].map(m=>m[1]));
}
const bad=[];
for(const [t,sn] of Object.entries(s))
  for(const m of sn.body.join("\n").matchAll(/\{\{[<%] ([a-zA-Z0-9\/-]+)([^}]*)/g)){
    if(m[1].startsWith("/")) continue;
    if(!(m[1] in known)){ bad.push(`${t}: unknown shortcode ${m[1]}`); continue; }
    for(const p of m[2].matchAll(/([a-zA-Z0-9_]+)=/g))
      if(!known[m[1]].has(p[1])) bad.push(`${t}: ${m[1]} has no param ${p[1]}`);
  }
console.log(bad.length ? bad.join("\n") : "ALL PARAMS MATCH SOURCE");
'
```

اجرای آن پس از هر تغییری که `layouts/_shortcodes/` را دستکاری می‌کند ارزشمند است — [ابزارهای توسعه](dev-tooling) را ببینید.

## استفاده از آن‌ها در سایت خودتان

این فایل خودکفاست و هیچ وابستگی به چیدمان این مخزن ندارد. آن را در هر سایت Hugo که از Hextra استفاده می‌کند کپی کنید:

```bash
mkdir -p .vscode
curl -o .vscode/hextra.code-snippets \
  https://raw.githubusercontent.com/homelabcentral/hextra/main/.vscode/hextra.code-snippets
```

برای در دسترس بودن آن‌ها در همه پروژه‌ها به جای یکی، همان فایل را در پوشه اسنیپت‌های کاربری خود قرار دهید:

| سیستم‌عامل | مسیر                                                |
| ---------- | --------------------------------------------------- |
| macOS      | `~/Library/Application Support/Code/User/snippets/` |
| Linux      | `~/.config/Code/User/snippets/`                     |
| Windows    | `%APPDATA%\Code\User\snippets\`                     |

{{< callout type="warning" >}}
با نصب سراسری، اسنیپت‌ها در هر فایل Markdown که باز می‌کنید فعال می‌شوند — از جمله پروژه‌های غیر Hugo، جایی که `hxcallout` سینتکسی درج می‌کند که به‌صورت متن خام نمایش داده می‌شود. مگر اینکه Hextra بخش عمده نوشته‌های شما باشد، نسخه `.vscode/` مخصوص هر پروژه را ترجیح دهید.
{{< /callout >}}

## اسنیپت‌ها مهارت ایجنت را هم می‌سازند

این اسنیپت‌ها به [`skills/hextra/`](https://github.com/homelabcentral/hextra/tree/main/skills/hextra) هم خوراک می‌دهند؛ بسته‌ای از مهارت که به ایجنت‌های کدنویس یاد می‌دهد چطور سایت Hextra بنویسند. آنجا قالب‌های Shortcode مرجع نهایی‌اند: دستور `npm run build:skill` نام پارامترها، مقادیر پیش‌فرض و الزامی بودن را مستقیماً از `layouts/_shortcodes/` می‌خواند و از اسنیپت‌ها برای مقادیر شمارشی و مثال‌های آماده کپی استفاده می‌کند که قالب‌ها به‌خوبی بیانشان نمی‌کنند. سازنده این دو را با هم مقایسه می‌کند و هر اسنیپتی را که پارامتری خارج از قالب به کار برده گزارش می‌دهد، بنابراین اسنیپت دست‌نویس بی‌سروصدا از پیاده‌سازی فاصله نمی‌گیرد.
