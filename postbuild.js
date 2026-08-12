const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
require('dotenv').config({ path: './build-settings.env' });

const distPath = path.join(__dirname, 'dist', 'custom-module');
const targetPath = path.join(__dirname, 'dist', `${process.env.INST_ID}-${process.env.VIEW_ID}`);
const zipPath = path.join(__dirname, 'dist', `${process.env.INST_ID}-${process.env.VIEW_ID}.zip`);

function removeDirectory(directory, callback) {
    fs.rm(directory, { recursive: true, force: true }, callback);
}

function normalizeManifestPath(filePath, rootDirectory) {
    const absoluteRootDirectory = path.resolve(rootDirectory || path.dirname(filePath));
    const absoluteFilePath = path.resolve(filePath);
    const relativePath = path.relative(absoluteRootDirectory, absoluteFilePath);
    if (!relativePath || relativePath === '.' || relativePath.startsWith('..')) {
        return '';
    }

    return relativePath.split(path.sep).join('/');
}

function collectAssetManifest(rootDirectory) {
    if (!fs.existsSync(rootDirectory)) {
        throw new Error(`Asset manifest generation failed: output directory does not exist: ${rootDirectory}`);
    }

    if (!fs.statSync(rootDirectory).isDirectory()) {
        throw new Error(`Asset manifest generation failed: output path is not a directory: ${rootDirectory}`);
    }

    const files = [];
    const directories = new Set();
    const stack = [rootDirectory];

    while (stack.length > 0) {
        const currentDirectory = stack.pop();
        const entries = fs.readdirSync(currentDirectory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

        for (const entry of entries) {
            const fullPath = path.join(currentDirectory, entry.name);
            const relativePath = normalizeManifestPath(fullPath, rootDirectory);

            if (!relativePath) {
                continue;
            }

            if (entry.isDirectory()) {
                directories.add(relativePath);
                stack.push(fullPath);
            } else if (entry.isFile()) {
                if (entry.name === 'asset-manifest.json') {
                    continue;
                }
                files.push(relativePath);
            }
        }
    }

    const parentDirectories = new Set();
    for (const filePath of files) {
        const parts = filePath.split('/').slice(0, -1);
        let currentPath = '';

        for (const part of parts) {
            currentPath = currentPath ? `${currentPath}/${part}` : part;
            parentDirectories.add(currentPath);
        }
    }

    for (const parentDirectory of parentDirectories) {
        directories.add(parentDirectory);
    }

    return {
        files: files.sort((a, b) => a.localeCompare(b)),
        directories: Array.from(directories).sort((a, b) => a.localeCompare(b)),
    };
}

function writeAssetManifest(rootDirectory) {
    if (!fs.existsSync(rootDirectory)) {
        throw new Error(`Asset manifest generation failed: output directory does not exist: ${rootDirectory}`);
    }

    const manifest = collectAssetManifest(rootDirectory);
    const manifestPath = path.join(rootDirectory, 'asset-manifest.json');
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    console.log(`[AssetManifest] Created ${manifestPath} with ${manifest.files.length} files and ${manifest.directories.length} directories`);
    return manifestPath;
}

function renameAndArchive() {
    try {
        fs.renameSync(distPath, targetPath);
        console.log(`Renamed directory to ${targetPath}`);

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`Archive completed: ${archive.pointer()} total bytes`);
            console.log(`Zip file created at: ${zipPath}`);
            console.log('Please upload the zip file to Alma BO custom package section to deploy your custom module.');
        });

        archive.on('warning', (err) => {
            if (err.code === 'ENOENT') {
                console.log('Warning:', err);
            } else {
                throw err;
            }
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);
        archive.directory(targetPath, path.basename(targetPath));
        archive.finalize();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

function runPostbuild() {
    if (fs.existsSync(targetPath)) {
        removeDirectory(targetPath, (err) => {
            if (err) {
                console.error(err.message);
                process.exit(1);
            }
            renameAndArchive();
        });
    } else {
        renameAndArchive();
    }
}

if (require.main === module) {
    runPostbuild();
}

module.exports = {
    removeDirectory,
    normalizeManifestPath,
    collectAssetManifest,
    writeAssetManifest,
};
