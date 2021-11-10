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

const esbuild = require("esbuild");
const dotenv = require("dotenv");
const postcss = require("postcss");
const postCssConfig = require("./postcss.config.js");

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
    build.onLoad({ filter: /.\.css$/ }, async (args) => {
      console.info(`Reading CSS content from ${args.path}...`);
      const cssContent = fs.readFileSync(args.path);
      console.info(
        "Passing CSS content through PostCSS (this may take a while)..."
      );
      const result = await postcss(postCssConfig.plugins).process(cssContent, {
        ...postCssConfig.options,
        from: args.path,
      });
      console.info("Done");
      return {
        contents: result.css,
        loader: "css",
      };
    });
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
  plugins: [postCssPlugin, dotenvPlugin, typeCheckPlugin],
});
