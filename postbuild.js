const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
require('dotenv').config({ path: './build-settings.env' });

const distPath = path.join(__dirname, 'dist', 'custom-module');
const targetPath = path.join(__dirname, 'dist', `${process.env.INST_ID}-${process.env.VIEW_ID}`);
const zipPath = path.join(__dirname, 'dist', `${process.env.INST_ID}-${process.env.VIEW_ID}.zip`);

// Function to create zip archive
function createZip() {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // Listen for all archive data to be written
    output.on('close', function() {
        console.log(`Archive completed: ${archive.pointer()} total bytes`);
    });

    // Good practice to catch warnings (like stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            console.warn(err);
        } else {
            throw err;
        }
    });

    // Good practice to catch this error explicitly
    archive.on('error', function(err) {
        throw err;
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Append files from the renamed directory, putting its contents at the root of archive
    archive.directory(targetPath, false);

    // Finalize the archive (i.e., we are done appending files but streams have to finish yet)
    archive.finalize();
}

// Rename directory
fs.rename(distPath, targetPath, (err) => {
    if (err) {
        console.error('Error renaming directory:', err);
        return;
    }
    console.log(`Renamed directory to ${targetPath}`);

    // Create zip after successful rename
    createZip();
});
