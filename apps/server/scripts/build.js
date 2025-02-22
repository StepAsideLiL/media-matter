const ncc = require("@vercel/ncc");
const { basename, resolve } = require("path");
const glob = require("fast-glob");
const { mkdir, writeFile, remove, pathExists } = require("fs-extra");
const chokidar = require("chokidar");
const nodemon = require("nodemon");

const DIST_DIR = resolve(__dirname, "../dist");
const CACHE_DIR = resolve(DIST_DIR, ".cache");
const SRC_DIR = resolve(__dirname, "../src");
const devMode = process.argv.slice(2).includes("--dev");

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
        if (
          (await pathExists(resolve(DIST_DIR, basename(name)))) &&
          basename(name) === "query_engine-windows.dll.node"
        ) {
          return;
        }

        await writeFile(
          resolve(DIST_DIR, basename(name)),
          assetsSource[index].source
        );
      })
    );

    console.log("Build completed successfully.");
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
  } catch (error) {
    console.error("Error during build:", error);
  }
}

/**
 * Watches for changes in the SRC_DIR and triggers a rebuild.
 */
async function watchChanges() {
  await build();

  nodemon({ script: resolve(DIST_DIR, "index.js") });
  nodemon.emit("start");

  const watcher = chokidar.watch(SRC_DIR, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("all", async (event, path) => {
    console.log(`File ${path} has been ${event}`);
    try {
      await build().then(() => {
        nodemon.emit("restart");
      });
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
    await mkdir(CACHE_DIR, { recursive: true });

    if (devMode) {
      await watchChanges();
    } else {
      await build();
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
