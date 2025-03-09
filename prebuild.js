const fs = require('fs');
const path = require('path');

const envFilePath = path.resolve(__dirname, 'build-settings.env');
const bootstrapPath = path.resolve(__dirname, 'src/bootstrap.ts');
const mainPath = path.resolve(__dirname, 'src/main.ts');
const webpackConfigPath = path.resolve(__dirname, 'webpack.config.js');

if (!fs.existsSync(envFilePath)) {
    console.error("Error: build-settings.env file not found!");
    process.exit(1);
}

const envContent = fs.readFileSync(envFilePath, 'utf8');
const match = envContent.match(/^ADDON_NAME=(.*)$/m);

if (match) {
    const addonName = match[1].trim();
    const newBootstrapPath = path.resolve(__dirname, `src/bootstrap${addonName}.ts`);

    // Rename bootstrap.ts if not already renamed
    if (fs.existsSync(bootstrapPath) && !fs.existsSync(newBootstrapPath)) {
        fs.renameSync(bootstrapPath, newBootstrapPath);
        console.log(`Renamed bootstrap.ts to bootstrap${addonName}.ts`);
    }

    // Modify import in main.ts
    let mainContent = fs.readFileSync(mainPath, 'utf8');
    mainContent = mainContent.replace(
        /import\(['"]\.\/bootstrap['"]\)/g,
        `import('./bootstrap${addonName}')`
    );
    fs.writeFileSync(mainPath, mainContent);
    console.log(`Updated main.ts to import('./bootstrap${addonName}')`);

    // Modify webpack.config.js
    let webpackConfig = fs.readFileSync(webpackConfigPath, 'utf8');

    // Replace name: "customModule" with name: "{ADDON_NAME}"
    webpackConfig = webpackConfig.replace(
        /name:\s*["']customModule["']/,
        `name: "${addonName}"`
    );

    // Replace './custom-module': './src/bootstrap.ts' with './{ADDON_NAME}': './src/bootstrap{ADDON_NAME}.ts'
    webpackConfig = webpackConfig.replace(
        /'\.\/custom-module':\s*'\.\/src\/bootstrap.ts'/,
        `'./${addonName}': './src/bootstrap${addonName}.ts'`
    );

    fs.writeFileSync(webpackConfigPath, webpackConfig);
    console.log(`Updated webpack.config.js for addon: ${addonName}`);

} else {
    console.log("ADDON_NAME not found in build-settings.env. Skipping renaming.");
}
