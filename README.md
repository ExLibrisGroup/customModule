# CustomModule

### Overview
The NDE Customization package offers options to enhance and extend the functionality of Primo’s New Discovery Experience (NDE). You can add and develop your own components, customize theme templates, and tailor the discovery interface to your specific needs.

**Note:**
<mark>This branch includes updates and other improvements that will be compatible with the April 2025 release of NDE. We will merge this branch to the main one when it is compatible with released version of NDE.</mark>

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

## Development Server Setup

### Step 1: Download the Project
1. Navigate to the GitHub repository: [https://github.com/ExLibrisGroup/customModule](https://github.com/ExLibrisGroup/customModule).
2. Download the ZIP file of the project.
3. Extract the ZIP file to your desired development folder (e.g., `c:\env\custom-module\`).

### Step 2: Install Dependencies
1. Inside the `customModule` directory, install the necessary npm packages:
    ```bash
    npm install
    ```

---

## Code Scaffolding and Customization

### Step 3: Add Custom Components
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
      ['nde-recommendations', RecommendationsComponent],
      // Add more pairs as needed
    ]);
    ```

3. Customize the component’s `.html`, `.ts`, and `.scss` files as needed:
    - `src/app/recommendations-component/recommendations-component.component.html`
    - `src/app/recommendations-component/recommendations-component.component.ts`
    - `src/app/recommendations-component/recommendations-component.component.scss`

### Customization of Component Selectors

- All components in the NDE are intended to be customizable. However, if you encounter a component that does not support customization, please open a support case with us. This helps ensure that we can address the issue and potentially add customization support for that component in future updates.


---

### Step 4: Configuring Proxy for Local Development

There are two options for setting up your local development environment: configuring a proxy or using customization enhancements.

- **Option 1: Update `proxy.conf.mjs` Configuration**:
  - Set the URL of the server you want to test your code with by modifying the `proxy.conf.mjs` file in the `./proxy` directory:
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

- **Option 2: Enhancements in Customization**:
  - **Local Custom Package Development**:
    - To work with your live environment using a custom package, add the following configuration:
      ```bash
      useLocalCustomPackage=true
      ```
    - This setting assumes that your local development environment is running on the default port `4201`.
    - When starting your local development environment with the proxy enabled, configure your development customization package by specifying your local URL in the proxy configuration. Example:
      ```plaintext
      localhost:4201/...
      ```
    - This setup allows for real-time testing and development that closely mirrors live environment conditions.

## Optional Configuration with `build-settings.env`

The `build-settings.env` file allows you to configure additional options to tailor the build output and behavior of the custom module.

### Supported Environment Variables

#### `ADDON_NAME`

This option allows renaming the internal bootstrap and output files to distinguish different add-on modules.
																																
				 
											  
						  
										 
	 

Example:
```env
ADDON_NAME=thirdpartyaddon
```
																	  
		   
					   
	   

When set:
- `bootstrap.ts` → `bootstrapthirdpartyaddon.ts`
- `main.ts` dynamically loads: `import('./bootstrapthirdpartyaddon')`
- Webpack exposes:
								
		 
																										 
																																																 
  ```ts
  exposes: {
    './thirdpartyaddon': './src/bootstrapthirdpartyaddon.ts'
  }
  ```

> 💡 Use this to create multiple federated modules or differentiate builds for different consumers.

#### `ASSET_BASE_URL`

Defines the base URL for assets.

Example:
```env
ASSET_BASE_URL=http://il-urm08.corp.exlibrisgroup.com:4202/
				 
```

Generated:
```ts
// src/app/state/asset-base.generated.ts
export const assetBaseUrl = 'http://il-urm08.corp.exlibrisgroup.com:4202/';
```

Use in code:
```ts
import { assetBaseUrl } from 'src/app/state/asset-base.generated';
const img = `${assetBaseUrl}images/logo.png`;
```


This value is used to prefix asset paths in HTML templates and services. It allows assets to be hosted on a dedicated or remote server.

#### 📁 Example: Folder Structure

```
src/
└── assets/
    └── images/
        ├── addon_test1_logo.jpg
        ├── add_on_test_shine_blicks_precise.gif
        └── addon_test1_watermark_background.jpg
```

#### ✅ Usage in HTML Template with `autoAssetSrc` Directive

```html
<img autoAssetSrc [src]="'assets/images/addon_test1_logo.jpg'" alt="Logo" />
<img autoAssetSrc [src]="'assets/images/add_on_test_shine_blicks_precise.gif'" alt="Shiny Effect" />
<div class="bg" [ngStyle]="{ 'background-image': 'url(' + assetBaseUrl + 'assets/images/addon_test1_watermark_background.jpg)' }"></div>
```

These image paths will automatically resolve to:
```
http://il-urm08.corp.exlibrisgroup.com:4202/assets/images/your_image.jpg
```

This enables full separation of frontend code and assets deployment.
---
																																														   
	   
												   
	   
						  
	   
					 
				 
	   
																														  

## Using the `autoAssetSrc` Directive

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
  [Customize Primo NDE UI: Live Demo](https://www.youtube.com/watch?v=z06l2hJYuLc)



---

## Conclusion
By following these steps, you can customize and extend the NDE interface using the `CustomModule` package. If you have any questions or run into issues, refer to the project documentation or the ExLibris support.

