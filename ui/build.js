/**
 * Build UI.
 *
 * There are two stages:
 *
 * 1. Type checking with tsc
 * 2. Compiling/bundling with esbuild
 *
 * Step 1 is necessary because esbuild doesn't do type checking although
 * it does compile TypeScript to JavaScript.
 */
const fs = require("fs");
const path = require("path");
const proc = require("child_process");
const tmp = require("tmp");

const esbuild = require("esbuild");
const dotenv = require("dotenv");
const postcss = require("postcss");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const ENV = process.env.NODE_ENV;
const IS_DEV = ENV === "development";
const WATCH = process.argv.includes("--watch");

/**
 * Plugin to load entries from .env file.
 *
 * All entries are then importable like so:
 *
 *   import { XYZ } from "env";
 */
const dotenvPlugin = {
  name: "dotenv",

  setup(build) {
    dotenv.config();

    build.onResolve({ filter: /^env$/ }, (args) => ({
      path: args.path,
      namespace: "env-ns",
    }));

    build.onLoad({ filter: /.*/, namespace: "env-ns" }, () => {
      const entries = {};

      Object.keys(process.env).forEach(
        (name) => (entries[name] = process.env[name])
      );

      return {
        contents: JSON.stringify(entries),
        loader: "json",
      };
    });
  },
};

/**
 * PostCSS plugin
 */
const postCssPlugin = {
  name: "postcss",

  setup(build) {
    const root = process.cwd();
    const outDir = path.join(root, "public", "build");
    build.onResolve(
      { filter: /.\.css$/, namespace: "file" },
      async (args) => {
        const filePath = path.resolve(args.resolveDir, args.path);
        const name = path.basename(filePath);
        const outFile = path.join(outDir, name);
        const css = fs.readFileSync(filePath);
        const result = await postcss().process(css, { from: filePath });
        fs.writeFileSync(outFile, result.css);
        return {
          path: outFile,
        };
      }
    );
  },
};

const typeCheckPlugin = {
  name: "typecheck",
  setup(build) {
    build.onStart(async () => {
      const tsc = proc.spawn("tsc", ["--noEmit", "--pretty"]);
      tsc.stdout.on("data", (data) => process.stdout.write(data));
      tsc.stderr.on("data", (data) => process.stderr.write(data));
    });
  },
};

esbuild.build({
  entryPoints: ["./src/index.tsx"],
  outfile: "public/build/bundle.js",
  target: "es2015",
  platform: "browser",
  bundle: true,
  minify: !IS_DEV,
  sourcemap: IS_DEV,
  watch: WATCH,
  logLevel: "info",
  plugins: [dotenvPlugin, typeCheckPlugin, postCssPlugin],
});
