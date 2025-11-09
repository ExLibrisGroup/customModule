const fs = require('fs');
const path = require('path');

const envFilePath = path.resolve(__dirname, 'build-settings.env');
const bootstrapPath = path.resolve(__dirname, 'src/bootstrap.ts');
const mainPath = path.resolve(__dirname, 'src/main.ts');
const webpackConfigPath = path.resolve(__dirname, 'webpack.config.js');
const assetBaseOutPath = path.resolve(__dirname, 'src/app/state/asset-base.generated.ts');

if (!fs.existsSync(envFilePath)) {
    console.error("Error: build-settings.env file not found!");
    process.exit(1);
}

const envContent = fs.readFileSync(envFilePath, 'utf8');
const match = envContent.match(/^ADDON_NAME=(.*)$/m);

if (match) {
    const addonName = match[1].trim();
    const newBootstrapPath = path.resolve(__dirname, `src/bootstrap${addonName}.ts`);

    // Restore bootstrap.ts from previous version if needed
    if (!fs.existsSync(bootstrapPath) && fs.existsSync(newBootstrapPath)) {
        fs.copyFileSync(newBootstrapPath, bootstrapPath);
        console.log(`Restored bootstrap.ts from bootstrap${addonName}.ts`);
    }

    // Rename bootstrap.ts if not already renamed
    if (fs.existsSync(bootstrapPath) && !fs.existsSync(newBootstrapPath)) {
        fs.renameSync(bootstrapPath, newBootstrapPath);
        console.log(`Renamed bootstrap.ts to bootstrap${addonName}.ts`);
    }

    // Update main.ts import
    let mainContent = fs.readFileSync(mainPath, 'utf8');
    mainContent = mainContent.replace(
        /import\(['"]\.\/bootstrap.*?['"]\)/g,
        `import('./bootstrap${addonName}')`
    );
    fs.writeFileSync(mainPath, mainContent);
    console.log(`Updated main.ts to import('./bootstrap${addonName}')`);

    // Update webpack.config.js
    let webpackConfig = fs.readFileSync(webpackConfigPath, 'utf8');
    webpackConfig = webpackConfig.replace(/name:\s*["'][^"']+["']/, `name: "${addonName}"`);
    webpackConfig = webpackConfig.replace(/uniqueName:\s*["'][^"']+["']/, `uniqueName: "${addonName}"`);
    webpackConfig = webpackConfig.replace(/'\.\/[^']+':\s*'\.\/src\/bootstrap[^']*'/, `'./${addonName}': './src/bootstrap${addonName}.ts'`);
    fs.writeFileSync(webpackConfigPath, webpackConfig);
    console.log(`Updated webpack.config.js for addon: ${addonName}`);

} else {
    console.log("ADDON_NAME not found in build-settings.env. Skipping renaming.");
}

// --- Handle ASSET_BASE_URL ---
const assetBaseMatch = envContent.match(/^ASSET_BASE_URL=(.*)$/m);
const assetBaseUrl = assetBaseMatch ? assetBaseMatch[1].trim() : '';

console.log('ENV content:\n', envContent);
console.log('Extracted ASSET_BASE_URL:', assetBaseUrl);

fs.writeFileSync(assetBaseOutPath, `export const assetBaseUrl = '${assetBaseUrl}';\n`);
console.log(`✔ Written to ${assetBaseOutPath}:\nexport const assetBaseUrl = '${assetBaseUrl}';`);
console.log('Prebuild complemeted successfully!');
/*

 The script reads the  build-settings.env  file and extracts the  ADDON_NAME  and  ASSET_BASE_URL  values. It then renames the  bootstrap.ts  file to  bootstrap{ADDON_NAME}.ts  and updates the  main.ts  file to import the renamed bootstrap file. It also updates the  webpack.config.js  file with the addon name and the new bootstrap file. Finally, it writes the  assetBaseUrl  value to a new file  asset-base.generated.ts .
 Now, we need to modify the  package.json  file to run this script before building the project. Add the following script to the  package.json  file:
*/
