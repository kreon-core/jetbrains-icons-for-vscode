import { resolve } from "path";
import { Configuration } from "webpack";

const getConfig = (argv: any): Configuration => ({
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  context: resolve(__dirname, "src"),
  entry: "./index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: argv.mode === "development" ? "source-map" : false,
  externals: {
    vscode: "commonjs vscode",
  },
  mode: argv.mode,
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    path: resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
    // development only
    devtoolModuleFilenameTemplate:
      argv.mode === "development" ? "../[resource-path]" : "[resource-path]",
  },
});

export default [
  (
    _env: string | Record<string, boolean | number | string>,
    argv: any
  ): Configuration => {
    const config: Configuration = getConfig(argv);
    config.output!.filename = "extended-jetbrains-icons-for-vscode.bundle.js";
    return config;
  },
];
