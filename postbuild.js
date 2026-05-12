const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
require('dotenv').config({ path: './build-settings.env' });

const distPath = path.join(__dirname, "dist", process.env.ADDON_NAME);

function removeDirectory(directory, callback) {
    fs.rm(directory, { recursive: true, force: true }, callback);
}

function createArchive(sourcePath, zipPath) {
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`Archive completed: ${archive.pointer()} total bytes`);
    console.log(`Zip file created at: ${zipPath}`);
  });

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") {
      console.log("Warning:", err);
    } else {
      throw err;
    }
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(sourcePath, path.basename(sourcePath));
  archive.finalize();
}

// Check if both INST_ID and VIEW_ID are present for renaming
if (process.env.INST_ID && process.env.VIEW_ID) {
  const targetPath = path.join(
    __dirname,
    "dist",
    `${process.env.INST_ID}-${process.env.VIEW_ID}`,
  );
  const zipPath = path.join(
    __dirname,
    "dist",
    `${process.env.INST_ID}-${process.env.VIEW_ID}.zip`,
  );

  function renameAndArchive() {
    fs.rename(distPath, targetPath, (err) => {
      if (err) throw err;
      console.log(`Renamed directory to ${targetPath}`);
      createArchive(targetPath, zipPath);
    });
  }

  // Check if target directory exists and remove it if it does
  if (fs.existsSync(targetPath)) {
    removeDirectory(targetPath, (err) => {
      if (err) throw err;
      renameAndArchive();
    });
  } else {
    renameAndArchive();
  }
} else {
  console.log(
    "INST_ID and/or VIEW_ID not found in build-settings.env. Using ADDON_NAME.",
  );
  const zipPath = path.join(__dirname, "dist", `${process.env.ADDON_NAME}.zip`);

  if (fs.existsSync(zipPath)) {
    fs.rmSync(zipPath, { force: true });
  }

  createArchive(distPath, zipPath);
}
