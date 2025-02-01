const ncc = require("@vercel/ncc");
const { basename, resolve } = require("path");
const glob = require("fast-glob");
const { mkdir, writeFile, remove } = require("fs-extra");
const chokidar = require("chokidar");

const DIST_DIR = resolve(__dirname, "../dist");
const CACHE_DIR = resolve(DIST_DIR, ".cache");
const SRC_DIR = resolve(__dirname, "../src");

const options = {
  cache: CACHE_DIR,
};

/**
 * Creates files with the given name and bundles it.
 * @param file name of the file to be built.
 */
async function createFiles(file) {
  try {
    const { code, assets } = await ncc(resolve(SRC_DIR, file), options);

    await mkdir(DIST_DIR, { recursive: true });

    await writeFile(resolve(DIST_DIR, basename(file, ".ts") + ".js"), code);

    const assetsNames = Object.keys(assets);
    const assetsSource = Object.values(assets);

    await Promise.all(
      assetsNames.map(async (name, index) => {
        await writeFile(
          resolve(DIST_DIR, basename(name)),
          assetsSource[index].source
        );
      })
    );
  } catch (error) {
    console.error(`Error processing file ${file}:`, error);
  }
}

/**
 * Builds the project and bundles it
 * @returns Promise
 */
async function build() {
  try {
    const files = await glob("index.ts", {
      cwd: SRC_DIR,
    });

    await Promise.all(files.map(createFiles));
    console.log("Build completed successfully.");
  } catch (error) {
    console.error("Error during build:", error);
  }
}

/**
 * Watches for changes in the SRC_DIR and triggers a rebuild.
 */
function watchChanges() {
  const watcher = chokidar.watch(SRC_DIR, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("all", async (event, path) => {
    console.log(`File ${path} has been ${event}`);
    try {
      await build();
      console.log("Rebuild completed.");
    } catch (error) {
      console.error("Error during rebuild:", error);
    }
  });

  watcher.on("error", (error) => {
    console.error("Watcher error:", error);
  });
}

async function main() {
  try {
    // Make .cache dir
    await mkdir(CACHE_DIR, { recursive: true });

    const args = process.argv.slice(2);
    const devMode = args.includes("--dev");

    if (devMode) {
      // Watch for changes in development mode
      watchChanges();
      console.log("Watching for changes...");
    } else {
      // Build and bundle in production mode
      await build();
      // Remove .cache dir
      await remove(CACHE_DIR);
    }
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// Handle uncaught exceptions and unhandled promise rejections
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

main();
