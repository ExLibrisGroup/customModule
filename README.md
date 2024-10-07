# CustomModule

### Overview
The NDE Customization package offers options to enhance and extend the functionality of Primo’s New Discovery Experience (NDE). You can add and develop your own components, customize theme templates, and tailor the discovery interface to your specific needs.

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
1. Create custom components within the `custom1-module` module by running:
    ```bash
    ng generate component <ComponentName> --module custom1-module
    ```
    Example:
    ```bash
    ng generate component RecommendationsComponent --module custom1-module
    ```

2. To add components before and after a target component, use:
    ```bash
    ng generate component <TargetComponent>-before --module custom1-module
    ng generate component <TargetComponent>-after --module custom1-module
    ```

3. Update `selectorComponentMap` in `custom1-module.module.ts` to connect the newly created components:
    ```typescript
    export const selectorComponentMap = new Map<string, any>([
      ['nde-recommendations-before', RecommendationsComponentBefore],
      ['nde-recommendations-after', RecommendationsComponentAfter],
      ['nde-recommendations', RecommendationsComponent],
      // Add more pairs as needed
    ]);
    ```

4. Customize the component’s `.html`, `.ts`, and `.scss` files as needed:
    - `src/app/recommendations-component/recommendations-component.component.html`
    - `src/app/recommendations-component/recommendations-component.component.ts`
    - `src/app/recommendations-component/recommendations-component.component.scss`

### Component Selectors that Extend `BaseCustomComponent`:
- `nde-full-display-container`
- `nde-full-display-service-container`
- `nde-full-display-details`
- `nde-full-display-links`
- `nde-get-it`
- `nde-tags`
- `nde-view-it`
- `nde-home-page`
- `nde-page-not-found`
- `nde-search-results-container`
- `nde-recommendations`
- `nde-search-results`
- `nde-search-result-container-item`
- `nde-record-almetrics`
- `nde-record-availability`
- `nde-record-checkbox`
- `nde-record-course`
- `nde-record-image`
- `nde-record-indications`
- `nde-record-main-details`
- `nde-record-summary`
- `nde-record-title`
- `nde-record-type`
- `nde-search-bar-filters`
- `nde-search-results-recommendations`
- `nde-copy-to-clipboard`
- `nde-citation-dialog`
- `nde-language-selector-container`
- `nde-language-selector-presenter`
- `nde-main-menu`
- `nde-logo`

---

## Build the Project

### Step 4: Build the Project
1. Compile the project:
    ```bash
    npm run build
    ```

2. After a successful build, the compiled code will be in the `dist/` directory.

### Step 5: Package for Distribution
1. Rename the `dist/custom-module` folder to match the format `INSTNAME-VIEWNAME`, where `INSTNAME` and `VIEWNAME` are specific to your installation.
2. Zip the renamed folder for distribution.

---


### Step 6: Configuring Proxy for Local Development
- **Update `proxy.conf.mjs` Configuration**:
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

- **Enhancements in Customization**:
  - All NDE selectors are customizable, with exceptions that will be noted and addressed as identified. This provides extended flexibility in adapting the discovery interface.
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

## Running Unit Tests

### Step 7: Upload Customization Package to Alma
1. In Alma, navigate to **Discovery > View List > Edit**.
2. Go to the **Manage Customization Package** tab.
3. Upload your zipped package in the **Customization Package** field and save.
4. Refresh the front-end to see your changes.

---

## Conclusion
By following these steps, you can customize and extend the NDE interface using the `CustomModule` package. If you have any questions or run into issues, refer to the project documentation or the ExLibris support.

