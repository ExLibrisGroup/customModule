# Header and Footer Integration (Static & Remote)

This document describes how to support **header** and **footer** components in your Angular-based Primo NDE customization using either **static HTML files** or **remote components via Module Federation**.

---

## 🔧 Option 1: Static HTML Header and Footer

### 📁 Folder Structure

Place static header and footer files under:

```
src/assets/header-footer/
├── header_en.html
├── footer_en.html
├── header_he.html
└── footer_he.html
```

### 💡 Usage

1. Use `HtmlLoaderService` to fetch and load the correct HTML file based on language.
2. Insert HTML into your app layout dynamically:

```ts
this.htmlLoaderService.loadHtml(`assets/header-footer/header_${lang}.html`).subscribe(html => {
  this.headerHtml = html;
});
```

3. Insert into template:

```html
<div [innerHTML]="headerHtml | safeHtml"></div>
<router-outlet></router-outlet>
<div [innerHTML]="footerHtml | safeHtml"></div>
```

> Use Angular's DomSanitizer to safely bind raw HTML content.

---

## 🚀 Option 2: Remote Header and Footer Components

Use this approach if you want to dynamically load header/footer from a shared remote module (e.g., for multiple views).

### 🛠 Step 1: Create Remote Components

In your custom module, create:

```bash
ng generate component header
ng generate component footer
```

These components must implement the desired UI for header and footer.


### 🛠 Step 2: Load Remote Components in Shell App



The `selectorComponentMap` in `customComponentMappings.ts` must include:

```ts
export const selectorComponentMap = new Map<string, any>([
  ['nde-header', NdeHeaderComponent],
  ['nde-footer', NdeFooterComponent],
]);
```

### 🛠 Step 3: Support Language Switching (Optional)

Your components should accept `@Input() lang: string` and adjust content accordingly.

---




## ✅ Summary

| Feature           | Static HTML | Remote Component |
|------------------|-------------|------------------|
| Custom per language | ✅ Yes | ✅ Yes |
| Dynamic theming     | ❌ No  | ✅ Yes |
| Shared across views | ❌ No  | ✅ Yes |
| Easily override     | ✅ Yes | ✅ Yes |

---

## 📦 Build and Deploy

Build the custom module with:

```bash
npm run build
```

Output is zipped and can be uploaded via Alma > Discovery > View List > Edit > Customization Package.

For more info, refer to the main `README.md`.

