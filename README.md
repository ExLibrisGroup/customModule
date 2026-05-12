# Talis Aspire Primo NDE Integration

[![Latest Release](https://img.shields.io/github/v/release/talis/Talis-Aspire-Primo-NDE-Integration?include_prereleases&label=Latest%20Release)](https://github.com/talis/Talis-Aspire-Primo-NDE-Integration/releases/latest)
[![Download](https://img.shields.io/github/downloads/talis/Talis-Aspire-Primo-NDE-Integration/latest/total?label=Downloads)](https://github.com/talis/Talis-Aspire-Primo-NDE-Integration/releases/download/latest/TalisAspireIntegration.zip)

This add-on integrates Talis Aspire Reading Lists with Ex Libris Primo NDE (New Discovery Experience), providing:

1. **"Send To Reading Lists" Button** - Allows users to bookmark catalog items directly to their reading lists
2. **"Cited on reading lists" Section** - Displays which reading lists cite the current catalog item

## Features

### Bookmark Button

- Appears below item availability information in full record display
- Supports MMS ID-based bookmarking (primary method)
- Falls back to OpenURL parameters when MMS ID is not available
- Configurable button text and tooltip

### Related Lists Display

- Shows reading lists that cite the current catalog item
- Uses MMS ID lookup (primary method)
- Falls back to ISBN lookup when MMS ID is not available
- Clean, simple bulleted list design
- Links open in new tabs

## Customer Configuration Steps

Library system managers can easily add, configure, and manage these add-ons through Alma. You will need to know:

- **Add-on Name** – `TalisAspireIntegration`
- **Add-on URL** – see the hosting options below.
- **Configuration Parameters** – JSON-based config parameters to be referenced at runtime by the add-on. The available parameters are discussed below.

### Hosting Options

There are two ways to host this add-on. Choose the option that best suits your institution's requirements.

#### Option 1: Talis-hosted (recommended)

Point Alma directly at the Talis-managed S3 distribution. The add-on files are served as a static directory from AWS S3:

```
https://talis-cs-production-primo-nde-eu-west-1.s3.eu-west-1.amazonaws.com/latest/TalisAspireIntegration/
```

**Pros:** Always serves the latest released version automatically — no action required from you when a new version is published.

**Risk:** Updates are deployed by Talis and take effect immediately. In rare cases a release could introduce a change that requires a corresponding configuration update on your side. Monitor the [release notes](https://github.com/talis/Talis-Aspire-Primo-NDE-Integration/releases) and test in a non-production view if this is a concern.

---

#### Option 2: Self-hosted

Download the ZIP, extract it, and host the resulting `TalisAspireIntegration/` directory on your own web server or CDN. Point Alma at the URL where you serve that directory.

Latest release ZIP is available from either:
- **S3:** [`TalisAspireIntegration.zip`](https://talis-cs-production-primo-nde-eu-west-1.s3.eu-west-1.amazonaws.com/latest/TalisAspireIntegration.zip)
- **GitHub Releases:** [`TalisAspireIntegration.zip`](https://github.com/talis/Talis-Aspire-Primo-NDE-Integration/releases/download/latest/TalisAspireIntegration.zip)

**Pros:** You control exactly which version is live and when updates are applied. Useful if your institution has change-freeze periods or requires internal testing before adopting a new release.

**Risk:** You are responsible for monitoring new releases and manually re-downloading, extracting, and re-deploying the files. Running an outdated version means you will not receive bug fixes or improvements until you update.

In Primo you will configure an addon: the screen looks like this

![Add-on Overview](./readme-files/addon-overview.png)

[Instructions for managing Add-Ons in the NDE User Interface](https://knowledge.exlibrisgroup.com/Primo/Product_Documentation/020Primo_VE/Primo_VE_(English)/120Other_Configurations/Managing_Add-Ons_for_the_NDE_UI)

## Configuration Parameters

This add-on is configured via Alma's Add-On Configuration. Upload a JSON configuration file with the following structure.

See [talis-aspire-config-example.json](talis-aspire-config-example.json) in this repo for a complete configuration template.

**Note:** The example file contains an `_instructions` field at the top for guidance. Remove this field before uploading to Primo.

### Configuration Fields

#### Required Fields

- **`baseUrl`** (string, **REQUIRED**): Your Talis Aspire tenancy base URL with trailing slash (HTTPS)
  - Example: `"https://youruni.rl.talis.com/"`
  
- **`mmsIdInstitutionCode`** (number, **REQUIRED**): The last four digits of your institution's MMS IDs
  - Example: `1234` for MMS IDs like `9912345678901234`

#### Optional Fields

The following fields are optional. If not provided, sensible defaults will be used.

- **`httpBaseUrl`** (string, optional): Your HTTP base URL for API response URL conversion
  - Used to identify and replace insecure HTTP URLs returned by the API with secure HTTPS URLs
  - **If not provided, automatically derived from `baseUrl` by replacing `https://` with `http://`**
  - Only set this if your HTTP and HTTPS URLs use different hostnames
  - Example: `"http://lists.library.youruni.ac.uk/"` when baseUrl is `"https://youruni.rl.talis.com/"`

- **`relatedListsDisplayLabel`** (string, optional): Text label for the related lists section
  - Default: `"Cited on reading lists:"`

- **`displayBookmarkThisButton`** (boolean, optional): Whether to show the bookmark button
  - Default: `true`
  - Set to `false` to disable the bookmark functionality

- **`bookmarkThisTitleAttribute`** (string, optional): Tooltip text for the bookmark button
  - Default: `"bookmark this item to reading lists"`

- **`bookmarkThisButtonText`** (string, optional): Button label text
  - Default: `"Send To Reading Lists"`

### Minimal Configuration Example

For most institutions, you only need to provide the two required fields:

```json
{
  "talisAspire": {
    "baseUrl": "https://youruni.rl.talis.com/",
    "mmsIdInstitutionCode": 1234
  }
}
```

All optional fields will use their default values, and `httpBaseUrl` will be automatically generated.

## Local Development Configuration

When developing locally using the proxy (localhost:4201), you need to provide your own test configuration since the live Primo site won't have your module's configuration.

### Setup Instructions

1. **Copy the example config file:**
   ```bash
   cp src/assets/talis-aspire-local-config.json.example src/assets/talis-aspire-local-config.json
   ```

2. **Edit `src/assets/talis-aspire-local-config.json`** with your test institution's values:
   ```json
   {
     "talisAspire": {
       "baseUrl": "https://your-test-institution.rl.talis.com/",
       "mmsIdInstitutionCode": 12345,
       "relatedListsDisplayLabel": "Cited on reading lists:",
       "displayBookmarkThisButton": true,
       "bookmarkThisTitleAttribute": "bookmark this item to reading lists",
       "bookmarkThisButtonText": "Send to reading lists"
     }
   }
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

### How It Works

- The bootstrap code detects when running on port 4201 (local proxy)
- It automatically fetches `/assets/talis-aspire-local-config.json` 
- This config **overrides** the MODULE_PARAMETERS from the live Primo site
- Your test values are used instead of the live configuration

### Important Notes

- The `talis-aspire-local-config.json` file is **gitignored** - it won't be committed to version control
- This prevents accidentally committing sensitive test URLs or institution codes
- Each developer maintains their own local config file with their test institution's values
- In production, configuration comes from Alma's Add-On Configuration (not this file)


## Technical Details

- Built as an Angular standalone component add-on for Primo NDE
- Uses JSONP for cross-origin API requests to Talis Aspire
- Integrates via Primo NDE component hooks:
  - `nde-record-availability-bottom` - Bookmark button placement
  - `nde-full-display-service-container-after` - Related lists placement

---

Original README Info below this line saved for it's utility.
[Further instructions were sourced from the Ex Libris developer blog](https://developers.exlibrisgroup.com/blog/how-to-develop-add-on-for-the-nde-ui/)

---

## ✨ New Feature (9th November 2025): Support for all customization files in assets folder:

All files that are you are able to customize through the assets folder of your customization package are now supported for preview when using the custom module in proxy mode.

For example to preview your brand logo you can now place your customized logo file in the following path in your local project:
`src/assets/images/library-logo.png`

To start proxy mode use the command:

``` bash
npm run start:proxy
```

---

### Overview


The NDE Customization package offers options to enhance and extend the functionality of Primo’s New Discovery Experience (NDE). You can add and develop your own components, customize theme templates, and tailor the discovery interface to your specific needs.

**Note:**
<mark>This branch includes updates and other improvements that are compatible with the December 2025 release of NDE.</mark>

**Note:**
The NDE Customization package is currently available exclusively to Primo customers who have early access to the New Discovery Experience (NDE). Further availability will be announced in upcoming releases.

---

## Prerequisites

### Node.js and npm (Node Package Manager)
1. **Verify Node.js and npm Installation:**
    - Open a terminal.
    - Run the following commands to check if Node.js and npm are installed:
        ```bash
        node -v
        npm -v
        ```
    - If installed, you will see version numbers. If not, you will see an error.

2. **Install Node.js and npm (if not installed):**
    - Visit the [Node.js download page](https://nodejs.org/en/download/).
    - Download the appropriate version for your operating system (npm is included with Node.js).
    - Follow the installation instructions.

### Angular CLI

1. **Verify Angular CLI Installation:**
    - Open a terminal.
    - Run the following command:
        ```bash
        ng version
        ```
    - If Angular CLI is installed, you will see the version and installed Angular packages.

2. **Install Angular CLI (if not installed):**
    - After installing Node.js and npm, install Angular CLI globally by running:
        ```bash
        npm install -g @angular/cli
        ```

---

## Development server setup and startup

### Step 1: Download the Project
1. Navigate to the GitHub repository: [https://github.com/ExLibrisGroup/customModule](https://github.com/ExLibrisGroup/customModule).
2. Download the ZIP file of the project.
3. Extract the ZIP file to your desired development folder (e.g., `c:\env\talis-aspire-integration\`).

### Step 2: Install Dependencies
1. Inside the `customModule` directory, install the necessary npm packages:
    ```bash
    npm install
    ```

### Step 3: Configuring proxy for and starting local development server

There are two options for setting up your local development environment: configuring a proxy or using parameter on your NDE URL.

- **Option 1: Update `proxy.const.mjs` Configuration**:
  - Set the URL of the server you want to test your code with by modifying the proxy.const.mjs file in the ./proxy directory:
    ```javascript
    // Configuration for the development proxy
    const environments = {
      'example': 'https://myPrimoVE.com',
    }

    export const PROXY_TARGET = environments['example'];
    ```
  - Start the development server with the configured proxy by running:
    ```bash
    npm run start:proxy
    ```
  - Open your browser on port 4201 to see your changes. e.g: http://localhost:4201/nde/home?vid=EXLDEV1_INST:NDE&lang=en

  
- **Option 2: Parameter on NDE URL**:
    - Start your development server by running
      ```bash
      npm run start
      ```
    -  Add the following query parameter to your NDE URL:
      ```
      useLocalCustomPackage=true
      ```
      For example: `https://sqa-na02.alma.exlibrisgroup.com/nde/home?vid=EXLDEV1_INST:NDE&useLocalCustomPackage=true`
    - This setting assumes that your local development environment is running on the default port `4201`.

  
---

## Step 4: Code Scaffolding and Customization

### Add Custom Components
1. Create custom components by running:
    ```bash
    ng generate component <ComponentName>
    ```
    Example:
    ```bash
    ng generate component RecommendationsComponent
    ``` 

2. Update `selectorComponentMap` in `customComponentMappings.ts` to connect the newly created components:
    ```typescript
    export const selectorComponentMap = new Map<string, any>([
      ['nde-recommendations-before', RecommendationsComponentBefore],
      ['nde-recommendations-after', RecommendationsComponentAfter],
      ['nde-recommendations-top', RecommendationsComponentTop],
      ['nde-recommendations-bottom', RecommendationsComponentBottom], 	  
      ['nde-recommendations', RecommendationsComponent],
      // Add more pairs as needed
    ]);
    ```

3. Customize the component’s `.html`, `.ts`, and `.scss` files as needed:
    - `src/app/recommendations-component/recommendations-component.component.html`
    - `src/app/recommendations-component/recommendations-component.component.ts`
    - `src/app/recommendations-component/recommendations-component.component.scss`



- All components in the NDE are intended to be customizable. However, if you encounter a component that does not support customization, please open a support case with us. This helps ensure that we can address the issue and potentially add customization support for that component in future updates.

### Accessing host component instance

You can get the instance of the component your custom component is hooked to by adding this property to your component class:

```angular2html
@Input() private hostComponent!: any;
```

### Accessing app state

- You can gain access to the app state which is stored on an NGRX store by injecting the Store service to your component:

```angular2html
private store = inject(Store);
```

- Create selectors. For example: 

```angular2html
const selectUserFeature = createFeatureSelector<{isLoggedIn: boolean}>('user');
const selectIsLoggedIn = createSelector(selectUserFeature, state => state.isLoggedIn);
```

- Apply selector to the store to get state as Signal:

```angular2html
isLoggedIn = this.store.selectSignal(selectIsLoggedIn);
```

Or as Observable:

```angular2html
isLoggedIn$ = this.store.select(selectIsLoggedIn);
```
### Automatic assets public path (`assets/...`)

If your custom module/add-on is hosted under a dynamic base URL, plain template URLs like:

```html
<img src="assets/images/logo.png" />
```
may break, because the browser resolves them relative to the host page.

To fix this, we provide:

src/app/services/assets-public-path.directive.ts

This directive automatically rewrites any src / href that starts with assets/ (or /assets/) to:

```js
__webpack_public_path__ + 'assets/...'
```
Import the directive in a component (Standalone)
Add the directive to the component imports:

```js
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AssetsPublicPathDirective } from '../services/assets-public-path.directive';

@Component({
  selector: 'custom-example',
  standalone: true,
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  imports: [CommonModule, AssetsPublicPathDirective],
})
export class ExampleComponent {}
```
If the component is not standalone (NgModule-based), import and export the directive from a shared module, and include that module where your components are declared.

Use it in HTML
After the directive is imported, you can use plain assets/... paths in templates:


```html
<!-- Images -->
<img src="assets/images/logo.png" alt="Logo">

<!-- Icons / SVG -->
<img src="assets/homepage/clock.svg" alt="Clock">

<!-- Links to files -->
<a href="assets/files/help.pdf">Help</a>
```
Supported attributes/elements (common cases):

img[src]

source[src]

script[src]

link[href]

a[href]

### Accessing app router

- You can gain access to the app router service by injecting the SHELL_ROUTER  injection token to your component:

```angular2html
import {SHELL_ROUTER} from "../../injection-tokens"; //the import path may vary on your project
private router = inject(SHELL_ROUTER);
```

- Listening for router navigation events. For example:

```angular2html
this.routerSubscription = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
        console.log('Tracking PageView: ', event.urlAfterRedirects);
    }
});
```



### Translating from code tables 

You can translate codes in your custom component by using ngx-translate (https://github.com/ngx-translate/core).

- If you are using a stand alone component you will need to add the TranslateModule to your component imports list.
- In your components HTML you can translate a label like so:
```angular2html
<span>This is some translated code: {{'delivery.code.ext_not_restricted' | translate}}</span>
```


---

## Creating your own color theme

The NDE theming is based on Angular Material. 
We allow via the view configuration to choose between a number of pre built themes.

![prebuilt theme image](./readme-files/prebuilt-themes.png "prebuilt themes configuration")


If you want to create your own theme instead of using one of our options follow these steps:

1. Create a material 3 theme by running:
    ```bash
    ng generate @angular/material:m3-theme
    ``` 
   You will be prompted to answer a number of questions like so:
  ```
? What HEX color should be used to generate the M3 theme? It will represent your primary color palette. (ex. #ffffff) #1eba18
? What HEX color should be used represent the secondary color palette? (Leave blank to use generated colors from Material)
? What HEX color should be used represent the tertiary color palette? (Leave blank to use generated colors from Material)
? What HEX color should be used represent the neutral color palette? (Leave blank to use generated colors from Material)
? What is the directory you want to place the generated theme file in? (Enter the relative path such as 'src/app/styles/' or leave blank to generate at your project root) src/app/styles/
? Do you want to use system-level variables in the theme? System-level variables make dynamic theming easier through CSS custom properties, but increase the bundle size. yes
? Choose light, dark, or both to generate the corresponding themes light

```
- Note that it is imporant to answer yes when asked if you want to use system-level variables.

- Also note that I'm only entering the primary color and not secondary or tertiary. They will be selected automatically based on my primary color.

Once this script completes successfully you will recieve this message: 

`CREATE src/app/styles/m3-theme.scss (2710 bytes)`

To apply the theme go to `_customized-theme.scss` and uncomment the following lines:
```
.custom-nde-theme{
  @include mat.all-component-colors(m3-theme.$light-theme);
  @include mat.system-level-colors(m3-theme.$light-theme);
}
```
---

## Developing an Add-On for the NDE UI

The NDE UI supports loading of custom modules at runtime and also provides infrastructure to dynamically load add-ons developed by vendors, consortia, or community members. This enables seamless integration, allowing institutions to configure and deploy external add-ons through **Add-On Configuration in Alma**.

The NDE UI add-on framework allows various stakeholders to develop and integrate custom functionality:

- **Vendors** can create and host services that institutions can seamlessly incorporate into their environment.
- **Institutions and consortia** can develop and share custom components, enabling consistency and collaboration across multiple libraries.

Library staff can easily add, configure, and manage these add-ons through Alma, following guidelines provided by the stakeholders. These typically include:

- **Add-on Name** – The identifier used in Alma’s configuration.
- **Add-on URL** – The location where the add-on is hosted (static folder to load the add-on at runtime).
- **Configuration Parameters** – JSON-based config parameters to be referenced at runtime by the add-on.

![Add-on Overview](./readme-files/addon-overview.png)

---

## Guidelines for Developing an Add-On

You can download the custom module and modify it to function as an add-on.

### Set Add-on Name

This section below should remain the same.

![Set Addon Name](./readme-files/set-addon-name.png)

![Example Configuration JSON](./readme-files/example-config-json.png)

---

The add-on infrastructure provides a way to access institution-specific configuration parameters. Institutions can upload their configuration settings in JSON format, which your add-on can reference dynamically within its components.

### 🔧 Accessing Add-On Configuration Parameters

Use Angular DI to inject the parameters directly into your component via the `MODULE_PARAMETERS` token:

```ts
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'custom-test-bottom',
  host: { 'data-component-id': 'custom-test-bottom-unique' },
  templateUrl: './test-bottom.component.html',
  styleUrls: ['./test-bottom.component.scss']
})
export class TestBottomComponent {
  constructor(@Inject('MODULE_PARAMETERS') public moduleParameters: any) {
    console.log('Module parameters TestBottomComponent:', this.moduleParameters);
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }
}

```

> 📘 `yourParamKey` should match the keys defined in your Alma Add-on JSON configuration.

---

If your add-on includes assets such as images, you can ensure a complete separation between the frontend code and asset deployment. To achieve this, set `ASSET_BASE_URL` to point to your designated static folder, allowing your add-on to reference assets independently of the core application.

![Access Assets via ASSET_BASE_URL](./readme-files/access-assets.png)


The `autoAssetSrc` directive automatically prepends `ASSET_BASE_URL` to your `[src]` attribute.

### Example:
```html
<img autoAssetSrc [src]="'assets/images/logo.png'" />
```

With:
```env
ASSET_BASE_URL=http://il-urm08.corp.exlibrisgroup.com:4202/
```

Results in:
```html
<img src="http://il-urm08.corp.exlibrisgroup.com:4202/assets/images/logo.png" />
```

### Supported Elements:
- `<img>`
- `<source>`
- `<video>`
- `<audio>`

> ✅ Always use `[src]="'relative/path'"` to ensure proper asset URL injection.

---

## Recommended Development Environment

To ensure smooth development, debugging, and code management, we recommend setting up your environment with the following tools:

### 🖥️ IDEs and Editors

- **Visual Studio Code (VSCode)** – Highly recommended  
  [Download VSCode](https://code.visualstudio.com/)
  - Recommended Extensions:
    - `Angular Language Service`
    - `ESLint` or `TSLint`
    - `Prettier - Code formatter`
    - `Path Intellisense`
    - `Material Icon Theme` (optional for better visuals)

- **WebStorm**  
  A powerful alternative with built-in Angular and TypeScript support.  
  [Download WebStorm](https://www.jetbrains.com/webstorm/)

- **IntelliJ IDEA**  
  A full-featured IDE by JetBrains. Ideal if you’re also working with Java backend.  
  [Download IntelliJ IDEA](https://www.jetbrains.com/idea/)

- **Eclipse IDE**  
  Suitable for full-stack development including Angular with the right plugins.  
  [Download Eclipse](https://www.eclipse.org/downloads/)

---

### 🔧 Tools & Utilities

- **Node Version Manager (nvm)**  
  Manage multiple versions of Node.js easily:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  ```

- **Angular CLI**
  ```bash
  npm install -g @angular/cli
  ```

- **Git GUI Clients**
  - GitHub Desktop
  - Sourcetree
  - GitKraken

---

### 🔍 Debugging & Testing

- Use **Chrome Developer Tools** for runtime inspection.
- Install **Augury Extension** (Angular DevTools) for inspecting Angular components.

---

### 🧪 Optional Tools

- **Postman** – For testing API requests.
- **Docker** – For isolated build environments.
- **Nx** – Monorepo tool (if planning multiple apps/libraries).

---
## Build the Project

### Step 5: Build the Project
1. Compile the project:
    ```bash
    npm run build
    ```

2. After a successful build, the compiled code will be in the `dist/` directory.


- **Automatic Packaging**:
  - The build process automatically compiles and packages the project into a ZIP file named according to the `INST_ID` and `VIEW_ID` specified in the `build-settings.env` file located at:
    ```
    C:\env\nde\customModule-base\build-settings.env
    ```
  - Example configuration:
    ```
    INST_ID=DEMO_INST
    VIEW_ID=Auto1
    ```
  - The ZIP file, e.g., `DEMO_INST-Auto1.zip`, is automatically created in the `dist/` directory after a successful build.


### Step 6: Upload Customization Package to Alma
1. In Alma, navigate to **Discovery > View List > Edit**.
2. Go to the **Manage Customization Package** tab.
3. Upload your zipped package in the **Customization Package** field and save.
4. Refresh the front-end to see your changes.


---

## Additional Resources

### Live Demo Tutorial
- **Customize Primo NDE UI**: Watch our live demo on YouTube for a visual guide on how to customize the Primo NDE UI:
  [Customize Primo NDE UI: Live Demo](https://www.youtube.com/watch?v=j6jAYkawDSM)



---

## Conclusion
By following these steps, you can customize and extend the NDE interface using the `CustomModule` package. If you have any questions or run into issues, refer to the project documentation or the ExLibris support.

