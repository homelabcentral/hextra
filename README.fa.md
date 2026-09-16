<div align="center">
  <h1 align="center">هگزترا</h1>
  <sup align="center"><a href="README.md">English</a> | <a href="README.zh-cn.md">简体中文</a> ｜ <a href="README.fa.md">فارسی</a></sup>
  <p align="center">تم هیوگو مدرن، پاسخگو و دارای امکانات کامل برای ایجاد وب‌سایت‌های استاتیک زیبا.</p>

نسخه‌ی نمایشی → [homelabcentral.github.io/hextra](https://homelabcentral.github.io/hextra/fa)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/5097752/263550533-c18343ca-3848-4230-b5c0-ee989d7916da.png">
  <img alt="Hextra" src="https://user-images.githubusercontent.com/5097752/263550528-663599f9-17a1-4686-b5c4-3da233b5034d.png">
</picture>

<div align="right">
<a href="https://github.com/homelabcentral/hextra/actions/workflows/pages.yml"><img alt="GitHub Actions Status" src="https://github.com/homelabcentral/hextra/actions/workflows/pages.yml/badge.svg"></a>
</div>

## ویژگی‌ها

- **طراحی زیبا** - با الهام از Nextra، هگزترا از Tailwind CSS برای ارائه یک طراحی مدرن که سایت شما را برجسته می‌کند، استفاده می‌کند.
- **طراحی واکنش‌گرا و حالت تیره** - در تمام دستگاه‌ها، از تلفن همراه، تبلت تا دسکتاپ، عالی به نظر می‌رسد. حالت تیره نیز برای انطباق با شرایط مختلف روشنایی پشتیبانی می‌شود.
- **سریع و سبک** - طراحی شده توسط Hugo، یک ایجادکننده سایت استاتیک سریع مثل رعد و برق که در یک فایل باینری قرار گرفته است، هگزترا ردپای خود را به حداقل می‌رساند. برای استفاده از آن به جاوااسکریپت یا Node.js نیازی ندارید.
- **جستجوی متن کامل** - جستجوی متن کاملا آفلاین داخلی طراحی شده توسط FlexSearch، بدون نیاز به پیکربندی اضافی.
- **امکانات کامل** - برای بهتر کردن محتوای شما مارک‌داون، برجسته‌کردن سینتکس، فرمول‌های ریاضی LaTeX، نمودارها و عناصر Shortcodeها را شامل میشه. فهرست مطالب، بردکرامب، صفحه‌بندی، پیمایش نوار کناری و موارد دیگر همه به صورت خودکار تولید می‌شوند.
- **چند زبانه و سئو آماده** - سایت‌های چند زبانه با حالت چند زبانه Hugo راحت ساخته می‌شوند. پشتیبانی خارج از جعبه برای برچسب‌های سئو، Open Graph و کارت‌های توییتر گنجانده شده است.
- **پشتیبانی از دسترس‌پذیری** - اجزای تعاملی از نشانه‌گذاری معنایی، رفتار سازگار با صفحه‌کلید و بررسی‌های خودکار دسترس‌پذیری استفاده می‌کنند تا رابط کاربری در گردش‌کارهای رایج فناوری‌های کمکی قابل استفاده بماند.

## شروع کنید

### نصب به عنوان ماژول هیوگو

به [Hugo extended](https://gohugo.io/installation/) نسخه ۰.۱۴۶.۰ یا بالاتر و [Go](https://go.dev/dl/) نیاز دارد — هیوگو برای حل ماژول‌ها از آن استفاده می‌کند.

```shell
hugo new site my-site --format=yaml
cd my-site
hugo mod init github.com/username/my-site
hugo mod get github.com/homelabcentral/hextra
```

سپس این بخش را به `hugo.yaml` اضافه کنید:

```yaml
module:
  imports:
    - path: github.com/homelabcentral/hextra

# اختیاری: فعال‌سازی طبقه‌بندی‌های تم، از جمله `series`. هیوگو راهبرد ادغام را
# تنها از پیکربندی پروژه می‌پذیرد، بنابراین تم نمی‌تواند خودش آن را تنظیم کند.
taxonomies:
  _merge: shallow
```

هیچ فایلی در وب‌سایت شما کپی نمی‌شود. هیوگو تم را در حافظه‌ی نهان ماژول‌های خود نگه می‌دارد و نسخه‌ای که سایت شما استفاده می‌کند تنها یک خط در `go.mod` است. ارتقا به‌صورت دستی انجام می‌شود:

```shell
hugo mod get -u github.com/homelabcentral/hextra          # آخرین نسخه منتشرشده
hugo mod get github.com/homelabcentral/hextra@v0.13.0     # یک نسخه مشخص
```

### استفاده

برای اطلاعات بیشتر به بخش [مستندات](https://homelabcentral.github.io/hextra/fa/docs) مراجعه کنید.

## مشارکت کردن

از مشارکت افراد جدید استقبال می‌کنیم.
برای شروع، [راهنمای مشارکت](.github/CONTRIBUTING.md) را بررسی کنید.

## مجوز

[مجوز MIT](./LICENSE)
