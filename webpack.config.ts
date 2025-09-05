import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import type { Configuration } from "webpack";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getConfig = (_env: any, argv: any): Configuration => ({
  target: "node",
  mode: argv.mode,
  context: resolve(__dirname, "src"),
  entry: "./index.ts",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "extended-jetbrains-icons-for-vscode.bundle.js",
    libraryTarget: "commonjs2",
    clean: true,
    devtoolModuleFilenameTemplate: "[absolute-resource-path]"
  },
  devtool: argv.mode === "development" ? "source-map" : false,
  externals: { vscode: "commonjs vscode" },
  resolve: {
    mainFields: ["browser", "module", "main"],
    extensions: [".ts", ".js", ".json"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: argv.mode === "development" ? "./tsconfig.json" : "./tsconfig.prod.json"
      })
    ]
  },
  module: {
    rules: [
      { test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ },
      { test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/, type: "asset/resource" }
    ]
  }
});

export default getConfig;
