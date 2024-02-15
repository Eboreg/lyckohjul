import * as path from "path";

import * as webpack from "webpack";

const config: webpack.Configuration = {
    mode: "development",
    devtool: "source-map",
    output: {
        path: path.resolve("./lib/"),
        filename: "index.js",
    },
    entry: path.resolve("./src/index.ts"),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader",
            },
        ],
    },
    resolve: {
        extensions: [".js", ".ts"],
    },
};

export default config;
