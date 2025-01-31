const ncc = require("@vercel/ncc");
const { basename, resolve } = require("path");
const glob = require("fast-glob");
const { mkdir, writeFile, remove } = require("fs-extra");

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
  const { code, assets } = await ncc(resolve(SRC_DIR, file), options);

  await mkdir(DIST_DIR, { recursive: true });

  await writeFile(resolve(DIST_DIR, basename(file, ".ts") + ".js"), code);

  const assetsNames = Object.keys(assets);
  const assetsSource = Object.values(assets);

  assetsNames.map(async (name, index) => {
    await writeFile(
      resolve(DIST_DIR, basename(name)),
      assetsSource[index].source
    );
  });
}

/**
 * Builds the project and bundles it
 * @returns Promise
 */
async function build() {
  const files = await glob("index.ts", {
    cwd: SRC_DIR,
  });

  return Promise.all(files.map(createFiles));
}

async function main() {
  // Make .cache dir
  await mkdir(CACHE_DIR, { recursive: true });

  // Build and bundle
  await build();

  const args = process.argv.slice(2);
  const devMode = args.includes("--dev");

  if (!devMode) {
    // Remove .cache dir
    await remove(CACHE_DIR);
  }
}

main();
