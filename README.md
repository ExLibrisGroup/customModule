# Customizing components in Primo NDE

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
  - [Node.js and npm](#nodejs-and-npm)
  - [Angular CLI](#angular-cli)
- [Local development server setup and startup](#local-development-server-setup-and-startup)
- [Code scaffolding and customization](#code-scaffolding-and-customization)
  - [Adding custom components](#adding-custom-components)
  - [Accessing host component instance](#accessing-host-component-instance)
  - [Accessing app state](#accessing-app-state)
  - [Translating from code tables](#translating-from-code-tables)
- [Creating your own color theme](#creating-your-own-color-theme)
- [Developing an add-on for the NDE UI](#developing-an-add-on-for-the-nde-ui)
  - [Guidelines for developing an add-on](#guidelines-for-developing-an-add-on)
  - [Accessing add-on configuration parameters](#accessing-add-on-configuration-parameters)
  - [Build the project](#build-the-project)
  - [Create a distributable package](#create-a-distributable-package)
  - [Upload customization package to Alma](#upload-customization-package-to-alma)
- [Recommended development environment](#recommended-development-environment)
  - [IDEs and editors](#ides-and-editors)
  - [Debugging and testing](#debugging-and-testing)
  - [Optional tools](#optional-tools)
  - [Live tutorial and additional information](#live-tutorial-and-additional-information)

## Overview

Primo's New Discovery Experience (NDE) allows for a robust and flexible customization framework using Angular.  
This guide walks through setting up the development environment, creating and deploying custom components, themes, and add-ons.

## Prerequisites

### Node.js and npm

The NDE UI is built using Angular, which requires Node.js and npm for development. Ensure you have the following installed:

- Open a terminal (Command Prompt, PowerShell, or Terminal).
- Run the following commands in a terminal to check if Node.js and npm are installed:
    ```bash
    node -v
    npm -v
    ```
- If installed, you will see version numbers. If not, you will see an error.

If you see an error, follow the next step to install Node.js and npm.

- Visit the [Node.js download page](https://nodejs.org/en/download/).
- Download the appropriate version for your operating system (note: npm is included with Node.js).
- Follow the installation instructions.

### Angular CLI

The Angular CLI is a command-line interface tool that helps you create and manage Angular applications.  
It provides commands for generating components, services, and other Angular features.

- Open a terminal (Command Prompt, PowerShell, or Terminal).
- Run the following command to check if Angular CLI is installed:
    ```bash
    ng version
    ```

If Angular CLI is installed, you will see the version and installed Angular packages. If not, you will see an error.

If you see an error, follow the next step to install Angular CLI.
Note: Angular CLI requires Node.js and npm to be installed first. If you haven't installed them, please do so before proceeding.

- Open a terminal (Command Prompt, PowerShell, or Terminal).
- Run the following command to install Angular CLI globally:
    ```bash
    npm install -g @angular/cli
    ```

## Local development server setup and startup

You can develop your custom module using a local development server. This allows you to see changes in real-time as you modify your code, without having to upload the package to Alma every time.

1. Download the Project

   1. Go to the GitHub repository: [https://github.com/ExLibrisGroup/customModule](https://github.com/ExLibrisGroup/customModule).
   2. Download the ZIP file of the project.
   3. Extract the ZIP file to your desired development folder (e.g., `c:\env\custom-module\`).

2. Install Dependencies  
   Navigate to the `customModule` directory you have just downloaded and install the necessary npm packages by running the following command in the terminal:
    ```bash
   npm install
   ```
3. Configuring proxy for and starting local development server
   1. To run the local development server, you need to set up a proxy to connect to your institution's Alma server. This allows you to test your customizations against a live environment.
   2. You can set up the proxy by modifying the `proxy/proxy.const.mjs` file or by using a query parameter in the NDE URL:
      - Set the URL of the server you want to test your code with by modifying the `proxy/proxy.const.mjs`:
        Replace `myPrimoVE.com` with the url of your institution, for example: `https://mylibrary.primo.exlibrisgroup.com/`
        ```javascript
        // Configuration for the development proxy
        const environments = {
          'example': 'https://mylibrary.primo.exlibrisgroup.com/',
        }

        export const PROXY_TARGET = environments['example'];
        ```
   3. To start the local development server, run the following command:
       ```bash
       npm run start:proxy
       ```
   4. Open your browser and navigate to the following URL:
       ```
       http://localhost:4201/nde/home?vid=YOUR_INSTITUTION_CODE:YOUR_NDE_VIEW_CODE&lang=en
       ```
   5. Replace `YOUR_INSTITUTION_CODE` and `YOUR_NDE_VIEW_CODE` with your institution's code and the NDE view code you want to test.
   6. You should see the NDE interface with your customizations applied.

Alternatively, you can run the following command to start the local development server without a proxy:

- Start your development server by running:
  ```bash
  npm run start
  ```
 - Add the following query parameter to your NDE URL: `useLocalCustomPackage=true`
  For example: `https://mylibrary.primo.exlibrisgroup.com/nde/home?vid=YOUR_INSTITUTION_CODE:YOUR_NDE_VIEW_CODE&lang=en&useLocalCustomPackage=true`
  This setting assumes that your local development environment is running on the default port `4201`.

You should now see the NDE interface with your current customizations applied by visiting the indicated URLs in your browser.

## Code scaffolding and customization

Once you have the local development server running, you can start customizing the NDE interface by adding or modifying components, or even creating your own themes for NDE.

### Adding custom components

Custom components allow you to add functionality to your NDE view. The following steps will guide you through creating a custom component.  
We will create a button that allows users to report issues with accessing items in the catalogue.

1. Create custom components by running:
    ```bash
    ng generate component report-problem
    ```

   This will create a new component named `ReportProblemComponent` in the `src/app/report-problem` directory.
   The component will consist of four files:
   1. `report-problem.component.ts` - The TypeScript file containing the component logic.
   2. `report-problem.component.html` - The HTML file containing the component template.
   3. `report-problem.component.scss` - The SCSS file containing the component styles.
   4. `report-problem.component.spec.ts` - The test file for the component.

2. Update `selectorComponentMap` in `src/app/custom1-module/customComponentMappings.ts`. This will allow the NDE to recognize your custom component and render it in the appropriate location.
    ```typescript
    export const selectorComponentMap = new Map<string, any>([
      ['nde-record-availability-after', ReportProblemComponent],
      // Add more pairs as needed
    ]);
    ```
   Here you can choose where you want to add your new component: open your NDE view in your browser, inspect the HTML, and look for `nde-` elements.
   In this example we have chosen to display our custom component after the `nde-record-availability` element.
   We are also using the`-after`  tag so that custom component will appear after the `nde-record-availability` element in the NDE view.
   You can also use `-before` to place your component before the `nde-record-availability` element. The available are:
   - `-after` - to place your component after the selected element.
   - `-before` - to place your component before the selected element.
   - `-top` - to place your component at the top of the selected element.
   - `-bottom` - to place your component at the bottom of the selected element.

3. Customize the component’s `.html`, `.ts`, and `.scss` files as needed
   - `src/app/recommendations-component/recommendations-component.component.html`  
     Using HTML and Angular directives, you can create the structure and behavior of your component. Add the following code to the `report-problem.component.html` file:
     ```html
     <div class="report-problem">
       <h2>Report a Problem</h2>
       <button (click)="reportProblem()">Report</button>
     </div>
     ```

   - `src/app/recommendations-component/recommendations-component.component.ts`  
     In this file we will add the logic for our component. Add the following code to the `report-problem.component.ts` file:
     ```typescript
     import { Component } from '@angular/core';

     @Component({
       selector: 'app-report-problem',
       templateUrl: './report-problem.component.html',
       styleUrls: ['./report-problem.component.scss']
     })
     export class ReportProblemComponent {
       reportProblem() {
         // Logic to report a problem
         console.log('Problem reported!');
       }
     }
     ```
   - `src/app/recommendations-component/recommendations-component.component.scss`  
     We can use this file to add styles to our component. Add the following code to the `report-problem.component.scss` file:
     ```scss
     .report-problem {
       background-color: #f8f9fa;
       padding: 20px;
       border-radius: 5px;
       h2 {
         color: #343a40;
       }
       button {
         background-color: #007bff;
         color: white;
         border: none;
         padding: 10px 20px;
         border-radius: 5px;
         cursor: pointer;
         &:hover {
           background-color: #0056b3;
         }
       }
     }
     ```
   - `report-problem.component.spec.ts` (optional)  
     This file is automatically generated and contains the test cases for your component. You can modify it to add your own test cases.

Most elements in the NDE view are intended to be customizable. However, if you encounter an element that does not support customization, please open a support case with ExLibris.
This helps ensure that we can address the issue and potentially add customization support for that element in future updates.

### Accessing host component instance

You can get the instance of the component your custom component is hooked to by adding this property to your component class.  
You might need this when you want to access the properties or methods of the host component.
For example if you want to access the `record` object in the `nde-record-availability` component.

```angular2html
@Input() private hostComponent!: any;
```

### Accessing app state

You can gain access to the app state which is stored on an NGRX store by injecting the Store service to your component.
You might need this when you want to access the app state or dispatch actions to the store.

For example if you want to access the `isLoggedIn` property in the `user` feature of Primo.

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
- Or as Observable:
  ```angular2html
  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  ```

### Translating from code tables

You can translate codes in your custom component by using ngx-translate (https://github.com/ngx-translate/core).
Useful if you want to display a translated label in your component.

- If you are using a standalone component you will need to add the TranslateModule to your component imports list.
- In your components HTML you can translate a label like so:
  ```angular2html
  <span>This is some translated code: {{ 'delivery.code.ext_not_restricted' | translate }}</span>
  ```

## Creating your own color theme

The NDE UI supports theming, allowing you to customize the look and feel of the interface to match your institution's branding or design preferences.
Since NDE theming is based on Angular Material, you can leverage Material's theming capabilities to create a cohesive and visually appealing user experience.
We allow via the view configuration to choose between a number of pre-built themes.

The themes developed by ExLibris have been tested for usability and accessibility, ensuring that they meet the needs of a diverse user base.
If you require to create your own theme instead of using one of our options follow these steps:

While in the `customModule` directory, run the following command in a terminal to generate a new theme:
```bash
ng generate @angular/material:m3-theme
```
You will be prompted to answer a number of questions like so:

- `? What HEX color should be used to generate the M3 theme?`
  It will represent your primary color palette. (ex. #ffffff)
- `? What HEX color should be used represent the secondary color palette?`
  Leave blank to use generated colors from Material
- `? What HEX color should be used represent the tertiary color palette?`
  Leave blank to use generated colors from Material
- `? What HEX color should be used represent the neutral color palette?`
  Leave blank to use generated colors from Material
- `? What is the directory you want to place the generated theme file in?`
  Enter the relative path such as 'src/app/styles/' or leave blank to generate at your project root. For NDE themes, use `src/app/styles/`
- `? Do you want to use system-level variables in the theme?`
  System-level variables make dynamic theming easier through CSS custom properties, but increase the bundle size. For NDE themes, choose `yes`
- `? Choose light, dark, or both to generate the corresponding themes`
  For NDE themes, choose `light`

> It is important to answer `yes` when asked if you want to use system-level variables.  
> It is advisable only to enter the primary color and not secondary or tertiary. They will be selected automatically based on my primary color.

Once this script completes successfully you will receive this message:

`CREATE src/app/styles/m3-theme.scss (**** bytes)`

To apply the theme go to `_customized-theme.scss` and uncomment the following lines:

```
.custom-nde-theme{
  @include mat.all-component-colors(m3-theme.$light-theme);
  @include mat.system-level-colors(m3-theme.$light-theme);
}
```

This will apply the theme to the NDE UI.

## Developing an add-on for the NDE UI

The NDE UI supports loading of custom modules at runtime and also provides infrastructure to dynamically load add-ons developed by vendors, consortia, or community members.  
This enables seamless integration, allowing institutions to configure and deploy external add-ons through **Add-On Configuration** in Alma, in the `Configuration -> Discovery -> Other -> Add-on Configuration ` section.

The NDE UI add-on framework allows various stakeholders to develop and integrate custom functionality:

- **Vendors** can create and host services that institutions can seamlessly incorporate into their environment.
- **Institutions and consortia** can develop and share custom components, enabling consistency and collaboration across multiple libraries.

Furthermore, library staff can easily add, configure, and manage these add-ons through Alma, following guidelines provided by the stakeholders.  
The Add-on configuration fields show in Alma are:

- **Add-on Name** – The identifier used in Alma’s configuration.
- **Add-on URL** – The location where the add-on is hosted (static folder to load the add-on at runtime).
- **Configuration Parameters** – JSON-based config parameters to be referenced at runtime by the add-on.

### Guidelines for developing an add-on

You can download the custom module and modify it to function as an add-on.

#### Set add-on name

The `build-settings.env` file allows you to configure additional options to tailor the build output and behavior of the custom module.  
`ADDON_NAME` - This option allows renaming the internal bootstrap and output files to distinguish different add-on modules.

Example: `ADDON_NAME=customModule`

When set:

- `bootstrap.ts` will be renamed to `bootstrapcustomModule.ts`
- `main.ts` dynamically loads `bootstrapcustomModule.ts
- Webpack exposes:
  ```
  exposes: {
  './customModule': '/.src/bootstrapcustomModule.ts',
  }
  ```

Use this to create multiple federated modules or differentiate builds for different consumers.

The add-on infrastructure provides a way to access institution-specific configuration parameters. Institutions can upload their configuration settings in JSON format, which your add-on can reference dynamically within its components.

### Accessing add-on configuration parameters

In some cases you may want to access the configuration parameters defined in Alma. For example, a configuration parameter may contain a URL or an API key that your add-on needs to function properly.
To access the module parameters from your configuration file, inject the `LookupService` in your component and use `getModuleParam()`:

```ts
constructor(private lookupService: LookupService){
}
ngOnInit()
{
  const paramValue = this.lookupService.getModuleParam('yourParamKey');
}
```

>`yourParamKey` should match the keys defined in your Alma add-on JSON configuration.

If your add-on includes assets such as images, you can also ensure a complete separation between the frontend code and asset deployment.
To achieve this, set `ASSET_BASE_URL` in your environment variables to point to your designated static folder, allowing your add-on to reference assets independently of the core application.

`ASSET_BASE_URL` defines the base URL for assets used in the add-on. This allows you to host your assets separately from the main application, providing flexibility in asset management.

The `autoAssetSrc` directive automatically prepends `ASSET_BASE_URL` to your `[src]` attribute.

For example:

```html
<img autoAssetSrc [src]="'assets/images/logo.png'" alt="a logo"/>
```

With the following environment variable set in `build-settings.env`:

```env
ASSET_BASE_URL=https://il-urm08.corp.exlibrisgroup.com:4202/
```

Results in:

```html
<img src="https://il-urm08.corp.exlibrisgroup.com:4202/assets/images/logo.png" alt="a logo"/>
```

The supported HTML elements for `autoAssetSrc` are:

- `<img>`
- `<source>`
- `<video>`
- `<audio>`

> Always use `[src]="'relative/path'"` to ensure proper asset URL injection.

### Build the project

Once you have completed your customizations, you can build the project to create a distributable package in order to upload it to Alma.

#### Create a distributable package

To create a distributable package, you need to build the project using the Angular CLI. This process compiles your TypeScript code into JavaScript and packages it for deployment.

By default, the build process automatically compiles and packages the project into a ZIP file named according to the `INST_ID` and `VIEW_ID` specified in `build-settings.env`
Opening the file `build-settings.env` you will find the following lines:
```
INST_ID=DEMO_INST
VIEW_ID=Auto1
```

These settings will create a ZIP file called `DEMO_INST-Auto1.zip`. Change these values to your institution ID and the view ID you use for Primo.

Next, you can build the project by running the following command in the terminal:

```bash
npm run build
```

After a successful build, the compiled code will be located in the `dist/` directory.

### Upload customization package to Alma

Once the build process is complete, it will also have generated a ZIP file in the `dist/` directory that is ready to be uploaded to Alma:

> The generated zip file produced by the build process is not the same as the one you would upload to Alma.  
> The generated zip file contains the only compiled code and assets, not all the other customization files you would need to upload to Alma.

1. In Alma, navigate to `Configuration -> Discovery -> Display Configuration -> Configure Views`
2. Go to the `Manage Customization Package` tab.
3. Upload your zipped package in the `Customization Package` field and save.
4. Refresh the front-end to see your changes.

Congratulations! You have successfully customized the Primo NDE UI!

## Recommended development environment

Building and customizing the Primo NDE UI requires a well-configured development environment.  
Below are the recommended tools and configurations to set up your environment for optimal development.

### IDEs and editors

A good IDE or code editor can significantly enhance your development experience. Here are some popular options that work well with Angular and TypeScript:

- **Visual Studio Code (VSCode)** – Highly recommended - Free and lightweight code editor with a rich ecosystem of extensions.
  [Download VSCode](https://code.visualstudio.com/)
  - Recommended Extensions:
    - `Angular Language Service`
    - `ESLint` or `TSLint`
    - `Prettier - Code formatter`
    - `Path Intellisense`
    - `Material Icon Theme` (optional for better visuals)

- **WebStorm**  - Paid IDE by JetBrains, specifically designed for JavaScript and TypeScript development.
  [Download WebStorm](https://www.jetbrains.com/webstorm/)

- **Atom** – Free and open-source text editor with a variety of packages for Angular development.
  [Download Atom](https://atom.io/)

### Debugging and testing

- Use **Chrome Developer Tools** for runtime inspection.
- Install **Augury Extension** (Angular DevTools) for inspecting Angular components.

### Optional tools

- **Postman** – For testing API requests.
- **Docker** – For isolated build environments.
- **Nx** – Monorepo tool (if planning multiple apps/libraries).

## Live tutorial and additional information

Watch the ExLibris to live demo on YouTube for a visual guide on how to customize the Primo NDE UI: [Customize Primo NDE UI: Live Demo](https://www.youtube.com/watch?v=z06l2hJYuLc)
